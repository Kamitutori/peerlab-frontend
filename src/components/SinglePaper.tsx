import {useQuery} from "@tanstack/react-query";
import {useParams, useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Chip from '@mui/material/Chip';
import {styled} from '@mui/material/styles';
import {Card, Divider, Grid2, Typography} from "@mui/material";
import {useUpdateAuth} from "./auth/AuthenticationContext.tsx";
import {useAlertDialog} from "./AlertDialogProvider.tsx";
import RequestListOfRequestees, {RequestObject, UserObject} from "./RequestListOfRequestees.tsx";
import React, {useEffect, useState} from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

/** The paper object returned by the server. */
interface PaperElement {
    id: number;
    title: string;
    authors: string;
    fileId: string;
    internal: boolean;
    abstractText: string;
    authorsNote: string;
    active: boolean;
    uploadDate: string;
    reviewLimit: number;
    requests: RequestObject[];
    owner: UserObject;
}

/** The wrapping box component of the request state banner. */
const BannerBox = styled(Box)(({theme, bannerColor}: { bannerColor: string, theme: any }) => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    backgroundColor: bannerColor,
    padding: theme.spacing(1.5),
    borderRadius: '4px',
}));

export default function SinglePaper() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {logout} = useUpdateAuth();
    const {showAlert} = useAlertDialog();

    /** If the user is a requestee, this const will be set to the request he received. */
    const [requestofRequestee, setRequestofRequestee] = useState<RequestObject>({
        id: 0,
        status: '',
        paperId: 0,
        paperTitle: '',
        paperOwnerName: '',
        requestee: {
            id: 0,
            name: '',
            email: '',
            password: '',
        },
        reviewId: null,
        creationDate: '',
    });

    /** This query fetches the paper to display. */
    const {
        isPending: isPaperPending,
        isError: isPaperError,
        error: paperError,
        data: paperData
    } = useQuery({
        queryKey: ["paper", id],
        queryFn: async () => {
            const res = await fetch(`http://localhost:8080/api/papers/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                }
            });
            if (!res.ok) throw new Error("Failed to fetch paper");
            return res.json();
        }
    });

    /** This function downloads the paper file from the server. */
    const handleDownload = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/minio/download-url?fileId=${paperObject.fileId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                },
            })
            if (response.status === 401) {
                await showAlert("Invalid Token", "Your token is invalid. You will be logged out.", "", "OK");
                logout();
            }
            if (!response.ok) {
                await showAlert("Failed to Download", `There was an error when fetching the file: ${await response.text()}.`, "", "OK");
                return;
            }
            let result = await response.text();
            const linkElement = document.createElement("a");
            linkElement.href = result;
            document.body.appendChild(linkElement);
            linkElement.click();
            document.body.removeChild(linkElement);
        } catch (error) {
            await showAlert("Error during Download", `There was an error during the download: ${error}`, "", "OK")
        }

    };

    /** Checks the current status of the fetch of the paper. */
    if (isPaperPending) {
        return <span>Loading...</span>;
    }
    if (isPaperError) {
        return <span>{`Error!: ${paperError.message}`}</span>;
    }


    const paperObject: PaperElement = paperData;
    const numberOfSubmittedReviews = paperObject.requests.filter((request) => request.status === "SUBMITTED").length;

    /** Converts the date of the paper form iso 8601 to format 'DD.MM.YYYY at HH:MM'.*/
    const convertISO8601ToDate = (isoString: string) => {
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) {
                //TODO this is a loop; implement error treatment.
                //await showAlert("Invalid ISO-8601 Date", "The received date is not in the specified ISO-8601 format.", "", "OK");
            }
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();

            return `${day}.${month}.${year} at ${hours}:${minutes}`;
        } catch (error) {
            //await showAlert("Error converting ISO-8601", "An error occurred while converting the date from ISO-8601 format.", "", "OK");
            return
        }
    }
/*
    const determineView = () => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            try {
                if (JSON.parse(userJson).name === undefined || JSON.parse(userJson).email === undefined) {
                    showAlert("User Object Error", "Unexpected behavior: User object in local storage is undefined. You will be logged out as a result.", "", "OK")
                        .then(() => {
                            logout();
                        });
                }
                return JSON.parse(userJson).name !== paperData.paperOwnerName;
            } catch (error) {
                showAlert("User Object Error", "Unexpected behavior: User object in local storage is not a valid JSON object. You are logged out as a result.", "", "OK")
                    .then(() => {
                        logout();
                    });
            }
        } else {
            showAlert("Invalid Storage State", "There is no user object in your local storage. You will be logged out.", "", "OK")
                .then(() => {
                    logout();
                });
        }
    }
*/

    /** Determines whether the user visiting this site is the owner or a requestee. */
    const [isRequest, setIsRequest] = useState<boolean>(false);
    useEffect(() => {
        const userJson = localStorage.getItem("user");
        if (userJson && (JSON.parse(userJson)?.name !== paperData.paperOwnerName)) {
            setIsRequest(true);
        }
        if (isRequest && paperData.requests.length > 0) {
            setRequestofRequestee(paperData.requests[0]);
        }
    }, [isRequest, paperData.requests]);




    const openToReview = isRequest
        && (
            (requestofRequestee.status === "ACCEPTED" && !requestofRequestee.reviewId)
            || (requestofRequestee.status === "EXPIRED" && !requestofRequestee.reviewId && !paperObject.reviewLimit && paperObject.active)
        );

    /** Banner logic concerning coloring and message. */
    let bannerColor = '#FF6347';
    let bannerMessage = "The request is expired."; // Default message

    if (isRequest) {
        /** Determines the color of the banner depending on the status of the request. */
        const getBannerColor = (status: string): string => {
            switch (status) {
                case "ACCEPTED":
                case "SUBMITTED":
                    return "#90EE90"; // Green
                default:
                    return "#FF6347"; // Red
            }
        };

        /** Determines what message to display on the request banner. */
        const getBannerMessage = (status: string): string => {
            switch (status) {
                case "PENDING":
                    return "A review has been requested : ";
                case "ACCEPTED":
                    return "The request has been accepted.";
                case "SUBMITTED":
                    return "The review has been submitted.";
                case "REJECTED":
                    return "The request has been rejected.";
                default:
                    return "The request is expired.";
            }
        };

        bannerColor = getBannerColor(requestofRequestee.status);
        bannerMessage = getBannerMessage(requestofRequestee.status);
    }

    /** This function sends a request to the server to update the request status according to the users input which is either 'ACCEPTED' or 'REJECTED'. */
    const handleResponseToRequest = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const buttonId: string = event.currentTarget.id;
        try {
            const response = await fetch(`http://localhost:8080/api/requests/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(buttonId === "acceptButton" ? "ACCEPTED" : "REJECTED")
            });
            if (response.status === 401) {
                await showAlert("Invalid Token", "Your token is invalid. You will be logged out.", "", "OK");
                logout();
            }
            if (!response.ok) {
                await showAlert("Failed to update request", `The request could not be updated: ${await response.text()}`, "", "OK");
            }
            const updatedRequest: RequestObject = await response.json();
            //paperObject.requests[0] = updatedRequest;
            setRequestofRequestee(updatedRequest);
        } catch (error) {
            await showAlert("Error", `An error occurred while updating the request: ${error}`, "", "OK");
        }
    };

    return (
        <Card variant="outlined"
              sx=
                  {{
                      minWidth: '320px',
                      maxWidth: '1000px',
                      minHeight: '540px',
                      marginLeft: 10,
                      marginTop: 10,
                      padding: 2
                  }}
        >
            <Typography textAlign="end">
                Upload Date: {convertISO8601ToDate(paperObject.uploadDate)}
            </Typography>
            {isRequest && (
                <BannerBox
                    bannerColor={bannerColor}
                    theme={undefined}
                    sx={{ mt: 1 }}
                >
                    <Typography variant="h6" sx={{flexGrow: 1, color: 'primary', pl: 1}}>
                        {bannerMessage}
                    </Typography>
                    {requestofRequestee.status === "PENDING" && (
                        <>
                            <Button
                                id="acceptButton"
                                variant="contained"
                                color="secondary"
                                onClick={handleResponseToRequest}
                            >
                                Accept
                            </Button>
                            <Button
                                id="rejectButton"
                                variant="contained"
                                color="secondary"
                                sx={{ml: 2}}
                                onClick={handleResponseToRequest}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                </BannerBox>
            )}
            {/* All wrapping grid G1; grows in rows*/}
            <Grid2
                container
                spacing={2}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    marginLeft: 1,
                    marginTop: 1,
                    width: '100%',
                    pl: '10px',
                    pt: '10px',

                }}
            >
                {/* The "top side" content; grid g2, growing in columns */}
                <Grid2 container spacing={2} sx={{flex: 1, display: "flex", flexDirection: "row"}}>
                    {/* The left upper box content*/}
                    <Grid2 sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 1}}>
                        <Typography variant="h4">{paperObject.title}</Typography>
                        <Typography variant="h5">{paperObject.authors}</Typography>
                        <Grid2 container spacing={1}>
                            <CloudUploadIcon/>
                            <Typography variant="body1">
                                Uploaded by {isRequest ? paperObject.owner.name : "you"}
                            </Typography>
                        </Grid2>
                        <Grid2 container spacing={1}>
                            <Chip label={paperObject.active ? 'active' : 'locked'}
                                  color={paperObject.active ? "success" : "warning"}
                            />
                            <Chip label={paperObject.internal ? 'Internal' : 'External'}
                                  color="primary"
                            />
                        </Grid2>
                        <Typography variant="body1">
                            <strong>Reviews:</strong> {numberOfSubmittedReviews} {paperObject.reviewLimit ? ` / ` : ' '} {paperObject.reviewLimit}
                        </Typography>
                        {/* Optional "Review Progress Bar"; grid need if implemented */}
                        <Button
                            variant="contained"
                            onClick={handleDownload}
                            startIcon={<FileDownloadIcon/>}
                            sx={{maxWidth: "200px"}}
                        >
                            Download Paper
                        </Button>
                    </Grid2>

                    {/* Upload and Authors note*/}
                    <Grid2 sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 1}}>
                        <Box
                            sx={{
                                maxWidth: "400px",
                                maxHeight: "300px",
                                height: "210px",
                                overflowY: "auto",
                                padding: 2,
                                border: "1px solid #777",
                                borderRadius: "8px",
                                backgroundColor: "background.default",
                            }}
                        >
                            <Typography variant="h6" textAlign="center">Author's Note</Typography>
                            <Divider></Divider>
                            <Typography variant="body1">
                                {paperObject.authorsNote ? paperObject.authorsNote : `${paperObject.owner.name} has made no comments on the paper.`}
                            </Typography>
                        </Box>
                    </Grid2>
                </Grid2>

                {/* grid G3 The "bottom side" content, */}
                <Grid2 container spacing={2} sx={{flex: 1, display: 'flex', flexDirection: 'row', gap: 1}}>
                    {/* Abstract */}
                    <Grid2>
                        <Box
                            sx={{
                                height: "400px",
                                width: "600px",
                                overflowY: "auto",
                                padding: 2,
                                border: "1px solid #777",
                                borderRadius: "8px",
                                backgroundColor: "background.default", // Optional: Light background color
                            }}
                        >
                            <Typography variant="h6">Abstract</Typography>
                            <Divider sx={{mb: 1}}></Divider>
                            <Typography variant="body1">
                                {paperObject.abstractText}
                            </Typography>
                        </Box>
                    </Grid2>

                    <Grid2>
                        {/* Requests */}
                        {!isRequest && (
                            <RequestListOfRequestees requests={paperObject.requests}/>
                        )}
                    </Grid2>
                </Grid2>

                {/* Administrative Buttons / Last row */}
                <Grid2 container spacing={2} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                    {!isRequest && (
                        <Button
                            variant="outlined"
                            onClick={() => navigate(`/edit-paper/${id}`)}
                            sx={{}}
                        >
                            Edit Paper
                        </Button>
                    )}
                    {(openToReview && requestofRequestee.status !== "SUBMITTED") && (
                        <Button variant="outlined" onClick={() => navigate(`/add-review/${id}`)}>
                            Add Review
                        </Button>
                    )}
                    {isRequest && requestofRequestee.reviewId && (
                        <Button variant="outlined"
                                onClick={() => navigate(`/view-review/${requestofRequestee.reviewId}`)}>
                            View Review
                        </Button>
                    )}
                </Grid2>
            </Grid2>
        </Card>
    );
}