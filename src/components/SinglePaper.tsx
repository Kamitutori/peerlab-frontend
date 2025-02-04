import {useQuery} from "@tanstack/react-query";
import {useParams, useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Chip from '@mui/material/Chip';
import {styled} from '@mui/material/styles';
import {Card, Grid2, Typography} from "@mui/material";
import {useUpdateAuth} from "./auth/AuthenticationContext.tsx";
import {useAlertDialog} from "./AlertDialogProvider.tsx";
import RequestListOfRequestees, {RequestObject, UserObject} from "./RequestListOfRequestees.tsx";
import React, {useState} from "react";

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

const BannerBox = styled(Box)(({theme, bannerColor}: { bannerColor: string, theme: any }) => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    backgroundColor: bannerColor,
    padding: theme.spacing(1.5),
    borderRadius: '4px',
    marginBottom: theme.spacing(2),
}));

export default function SinglePaper() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {logout} = useUpdateAuth();
    const {showAlert} = useAlertDialog();

    function navigateToEditReview(reviewId: string) {
        navigate("/edit-review/" + reviewId);
    }

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

    {/* TODO : download link for the paper!!*/
    }
    const fileUrl = 'https://example.com/path/to/your/file.pdf';
    const fileName = 'downloaded-file.pdf';
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.click();
    };

    if (isPaperPending) {
        return <span>Loading...</span>;
    }
    if (isPaperError) {
        return <span>{`Error!: ${paperError.message}`}</span>;
    }

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

    const isRequest = determineView();
    if (isRequest) {
        setRequestofRequestee(paperData.requests[0]);
    }

    function determineView() {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            try {
                if (JSON.parse(userJson).name === undefined || JSON.parse(userJson).email === undefined) {
                    showAlert("User Object Error", "Unexpected behavior: User object in local storage is undefined. You will be logged out as a result.", "", "OK")
                        .then(() => {
                            logout();
                        });
                }
                return JSON.parse(userJson).name === paperData.paperOwnerName;
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

    const paperObject: PaperElement = paperData;
    const numberOfSubmittedReviews = paperObject.requests.filter((request) => request.status === "SUBMITTED").length;

    const openToReview = isRequest
        && (
            (requestofRequestee.status === "ACCEPTED" && !requestofRequestee.reviewId)
            || (requestofRequestee.status === "EXPIRED" && !requestofRequestee.reviewId && !paperObject.reviewLimit && paperObject.active)
        );

    /** Banner logic concerning color and message */
    let bannerColor = '#FF6347';
    let bannerMessage = "The request is expired."; // Default message

    if (isRequest) {
        const getBannerColor = (status: string): string => {
            switch (status) {
                case "ACCEPTED":
                case "SUBMITTED":
                    return "#90EE90"; // Green
                default:
                    return "#FF6347"; // Red
            }
        };

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

    {/* TODO : change the status of the request when the button is clicked */}
    const handleResponseToRequest = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const buttonId: string = event.currentTarget.id;
        try {
            const response = await fetch(`http://localhost:8080/requests/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify({
                    status: buttonId === "acceptButton" ? 'ACCEPTED' : 'REJECTED',
                }),
            });
            if (response.status === 401) {
                await showAlert("Invalid Token", "Your token is invalid. You will be logged out.", "", "OK");
                logout();
            }
            if (!response.ok) {
                await showAlert("Failed to update request", `The request could not be updated: ${await response.text()}`, "", "OK");
            }
            const updatedRequest: RequestObject = await response.json();
            paperObject.requests[0] = updatedRequest;
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
                      maxWidth: '1500px',
                      minHeight: '540px',
                      marginLeft: 10,
                      marginTop: 10,
                  }}
        >
            {isRequest &&
                (
                    <BannerBox bannerColor={bannerColor} theme={undefined}>
                        <Typography variant="h6" sx={{flexGrow: 1, color: '#fff', paddingLeft: '10px'}}>
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
                                    sx={{marginLeft: 2}}
                                    onClick={handleResponseToRequest}
                                >
                                    Reject
                                </Button>
                            </>
                        )}
                    </BannerBox>
                )}
            <Grid2
                container
                spacing={2}
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch', // Ensures both cards are the same height
                    marginLeft: 1,
                    marginTop: 1,
                    width: '100%',
                    paddingLeft: '10px', // Add space to prevent overlap by the drawer
                    paddingTop: '10px',

                }}
            >
                {/* The "left side" content */}
                <Grid2>
                    <Typography variant="h4">{paperObject.title}</Typography>
                    <Typography variant="h5">{paperObject.authors}</Typography>
                    <Typography variant="body1">Uploaded by {isRequest ? paperObject.owner.name : "you"}</Typography>
                    <Grid2
                        container
                        sx={{display: "flex", flexDirection: "row"}}
                    >
                        <Chip label={paperObject.active ? 'active' : 'locked'}
                              color={paperObject.active ? "success" : "warning"}/>
                        <Chip label={paperObject.internal ? 'Internal' : 'External'} color="primary"/>
                    </Grid2>
                    <Grid2>
                        <Typography variant="body1">
                            <strong>Reviews:</strong> {numberOfSubmittedReviews} {paperObject.reviewLimit ? ` / ` : ' '} {paperObject.reviewLimit}
                        </Typography>
                        {/* Optional "Review Progress Bar" */}
                    </Grid2>
                    <Button
                        variant="contained"
                        onClick={handleDownload}
                        startIcon={<FileDownloadIcon/>}
                    >
                        Download Paper
                    </Button>
                    <Box
                        sx={{
                            maxWidth: "600px", // Set maximum width for the box
                            maxHeight: "300px", // Set maximum height for the scrollable area
                            overflowY: "auto", // Enable vertical scrolling
                            padding: "16px", // Add some padding
                            border: "1px solid #ddd", // Add a light border
                            borderRadius: "8px", // Optional: Add rounded corners
                            backgroundColor: "background.paper", // Optional: Light background color
                        }}
                    >
                        <>
                            <Typography variant="h6">Abstract</Typography>
                            <Typography variant="body1">
                                {paperObject.abstractText}
                            </Typography>
                        </>
                    </Box>
                    {!isRequest && (
                        <RequestListOfRequestees requests={paperObject.requests}/>
                    )}
                </Grid2>

                {/* The "right side" content, i.e. Upload date, authors note & edit button */}
                <Grid2>
                    {isRequest && requestofRequestee.reviewId && (
                        <Button variant="outlined"
                                onClick={() => navigate(`/view-review/${requestofRequestee.reviewId}`)}>
                            View Review
                        </Button>
                    )}
                    <Typography textAlign="end">
                        Upload Date: {convertISO8601ToDate(paperObject.uploadDate)}
                    </Typography>
                    <>
                        <Box
                            sx={{
                                maxWidth: "400px", // Set maximum width for the box
                                maxHeight: "300px", // Set maximum height for the scrollable area
                                overflowY: "auto", // Enable vertical scrolling
                                padding: "16px", // Add some padding
                                border: "1px solid #ddd", // Add a light border
                                borderRadius: "8px", // Optional: Add rounded corners
                                backgroundColor: "background.paper", // Optional: Light background color
                            }}
                        >
                            <>
                                <Typography variant="h6">Author's Note</Typography>
                                <Typography variant="body1">
                                    {paperObject.authorsNote ? paperObject.authorsNote : "The author has made no comments on the paper."}
                                </Typography>
                            </>
                        </Box>
                    </>
                    {(openToReview && requestofRequestee.status !== "SUBMITTED") && (
                        <Button variant="outlined" onClick={() => navigate(`/add-review/${id}`)}>
                            Add Review
                        </Button>
                    )}
                    {requestofRequestee.status === "SUBMITTED" && (
                        <>
                            <Button variant="outlined"
                                    onClick={() => navigateToEditReview(requestofRequestee.reviewId ? `${requestofRequestee.reviewId}` : "error")}>
                                Edit Review
                            </Button>
                        </>
                    )}
                    <Button
                        variant="outlined"
                        onClick={() => navigate(`/edit-paper/${id}`)}
                        sx={{}}
                    >
                        Edit Paper
                    </Button>
                </Grid2>
            </Grid2>
        </Card>
    )
        ;
}