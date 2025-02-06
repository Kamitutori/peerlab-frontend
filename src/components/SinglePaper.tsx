import {useQuery} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Chip from '@mui/material/Chip';
/** The wrapping box component of the request state banner. */
import {styled} from '@mui/material/styles';
import {Card, Divider, Grid2, Typography, useTheme} from "@mui/material";
import {useUpdateAuth} from "./auth/AuthenticationContext.tsx";
import {useAlertDialog} from "../utils/alertDialogUtils.ts";
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

const BannerBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== "bannerColor",
})<{ bannerColor: string }>(({ bannerColor, theme }) => ({
    display: "flex",
    alignItems: "center",
    width: "100%",
    backgroundColor: bannerColor,
    padding: theme.spacing(1.5),
    borderRadius: "4px",
}));


export default function SinglePaper() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {logout} = useUpdateAuth();
    const {showAlert} = useAlertDialog();
    const theme = useTheme();
    const isLightMode = theme.palette.mode === "light";

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
        data: paperData,
        refetch
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
        },
    });

    const [paperObject, setPaperObject] = useState<PaperElement>({
        id: 0,
        title: "",
        authors: "",
        fileId: "",
        internal: false,
        abstractText: "",
        authorsNote: "",
        active: false,
        uploadDate: "",
        reviewLimit: 0,
        requests: [],
        owner: {
            id: 0,
            name: "",
            email: "",
            password: ""
        }
    });
    const [numberOfSubmittedReviews, setNumberOfSubmittedReviews] = useState<number>(-1);
    useEffect(() => {
        if (!isPaperError && !isPaperPending && paperData) {
            setPaperObject(paperData);
            setNumberOfSubmittedReviews(paperData.requests.filter((request: RequestObject) => request.reviewId === null).length);
        }
    }, [isPaperError, isPaperPending, paperData]);

    /** Determines whether the user visiting this site is the owner or a requestee and isolates their request if so. */
    const [isRequest, setIsRequest] = useState<boolean>(false);
    useEffect(() => {
        const userJson = localStorage.getItem("user");
        if (!paperData || isPaperPending || isPaperError) {
            setIsRequest(false);
        }
        if (userJson && (JSON.parse(userJson)?.name !== paperObject.owner.name) && paperObject.owner.name !== "") {
            setIsRequest(true);
            if (paperData.requests.length > 0) {
                console.log(paperData.requests[0]);
                setRequestofRequestee(paperData.requests[0]);
            }
        }
    }, [isPaperPending, isPaperError, paperData, paperObject]);

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
                case "PENDING":
                    return isLightMode ? "#c1b80b" : "#b3b300";
                case "ACCEPTED":
                    return isLightMode ? "#449fd5" : "#008ae6";
                case "SUBMITTED":
                    return isLightMode ? "#2f8c2f" : "#018a01";
                case "REJECTED":
                    return "#ff0000";
                case "EXPIRED":
                    return isLightMode ? "#dadada" : "#000000";
                default:
                    return "secondary";
            }
        };

        /** Determines what message to display on the request banner. */
        const getBannerMessage = (status: string): string => {
            switch (status) {
                case "PENDING":
                    return "You were requested to write a review : ";
                case "ACCEPTED":
                    return "You have accepted the request to write a review.";
                case "SUBMITTED":
                    return "Your review is submitted.";
                case "REJECTED":
                    return "You have rejected the request.";
                case "EXPIRED":
                    return "The request has expired.";
                default:
                    return "Unknown status."
            }
        };
        bannerColor = getBannerColor(requestofRequestee.status);
        bannerMessage = getBannerMessage(requestofRequestee.status);
    }

    /** Converts the date of the paper form iso 8601 to format 'DD.MM.YYYY at HH:MM'.*/
    const convertISO8601ToDate = (isoString: string) => {
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) {
                return "Date is invalid."
            }
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();

            return `${day}.${month}.${year} at ${hours}:${minutes}`;
        } catch {
            //await showAlert("Error converting ISO-8601", "An error occurred while converting the date from ISO-8601 format: ", "", "OK");
            return
        }
    }

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
            const result = await response.text();
            window.open(result, '_blank');
        } catch (error) {
            await showAlert("Error during Download", `There was an error during the download: ${error}`, "", "OK")
        }
    };

    /** This function sends a request to the server to update the request status according to the users input which is either 'ACCEPTED' or 'REJECTED'. */
    const handleResponseToRequest = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const buttonId: string = event.currentTarget.id;
        console.log(buttonId);
        try {
            const response = await fetch(`http://localhost:8080/api/requests/${requestofRequestee.id}`, {
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
                await showAlert("Failed to Update Request", `The request could not be updated: ${await response.text()}`, "", "OK");
            }
            await response.json();
            await refetch();
        } catch (error) {
            await showAlert("Error", `An error occurred while updating the request: ${error}`, "", "OK");
        }
    };

    /** Checks the current status of the fetch of the paper. */
    if (isPaperPending) {
        return <span>Loading...</span>;
    }
    if (isPaperError) {
        return <span>{`Error!: ${paperError.message}`}</span>;
    }

    return (
        <Card variant="outlined"
              sx=
                  {{
                      minWidth: '320px',
                      maxWidth: '1000px',
                      minHeight: '540px',
                      marginLeft: 10,
                      marginTop: 10,
                      paddingLeft: '10px',
                      paddingRight: '10px',
                  }}
        >
            <Typography textAlign="end">
                Upload Date: {convertISO8601ToDate(paperObject.uploadDate)}
            </Typography>
            {isRequest && (
                <BannerBox
                    bannerColor={bannerColor}
                    sx={{ mt: 1 }}
                >
                    <Typography variant="h6" sx={{ flexGrow: 1, color: 'primary', pl: 1 }}>
                        {bannerMessage}
                    </Typography>
                    {requestofRequestee.status === "PENDING" && (
                        <>
                            <Button
                                id="acceptButton"
                                variant="contained"
                                color="primary"
                                onClick={handleResponseToRequest}
                            >
                                Accept
                            </Button>
                            <Button
                                id="rejectButton"
                                variant="outlined"
                                color="primary"
                                sx={{ ml: 2 }}
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
                    mx: '10px',
                    my: '10px',
                    width: '100%',
                    px: '10px',
                    py: '10px',
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
                            <Chip label={paperObject.internal ? 'internal' : 'external'}
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
                <Grid2 container
                       spacing={2}
                       sx=
                           {{
                               display: 'flex',
                               flexDirection: 'row',
                               justifyContent: 'flex-start',

                }}
                >
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
                        <Button variant="outlined" onClick={() => navigate(`requests/${id}/add-review/`)}>
                            Add Review
                        </Button>
                    )}
                    {isRequest && requestofRequestee.reviewId && (
                        <Button variant="outlined"
                                onClick={() => navigate(`/review/${requestofRequestee.reviewId}`)}>
                            View Review
                        </Button>
                    )}
                </Grid2>
            </Grid2>
        </Card>
    );
}