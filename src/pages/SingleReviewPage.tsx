import Paper from "@mui/material/Paper";
import {useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useUpdateAuth} from "../components/auth/AuthenticationContext.tsx";
import {useAlertDialog} from "../utils/alertDialogUtils.ts";
import {useEffect, useState} from "react";
import {UserObject} from "../components/RequestListOfRequestees.tsx";
import {Divider, Grid2} from "@mui/material";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {convertISO8601ToDate} from "../components/SinglePaperPage.tsx";

interface ReviewElement {
    id: number;
    request: RequestElement;
    fileIds: string[];
    summary: string;
    strengths: string;
    weaknesses: string;
    comments: string;
    questions: string;
    score: number;
    confidenceLevel: string;
    submissionDate: string;
}

interface RequestElement {
    id: number;
    requestee: UserObject;
    paperId: number;
    paperOwnerName: string;
    paperTitle: string;
    paperMaxScore: number;
    paperMinScore: number;
}

export default function SingleReviewPage() {
    const {id} = useParams<{ id: string }>();
    const {logout} = useUpdateAuth();
    const {showAlert} = useAlertDialog();
    const navigate = useNavigate();
    const [isReviewer, setIsReviewer] = useState(false);
    const [isInternal, setIsInternal] = useState(false);
    const [hasReviewFiles, setHasReviewFiles] = useState(false);
    const [submissionDate, setSubmissionDate] = useState("");

    const [reviewObject, setReviewObject] = useState<ReviewElement>({
        id: 0,
        request: {
            id: 0,
            requestee: {
                id: 0,
                name: "",
                email: "",
            },
            paperId: 0,
            paperOwnerName: "",
            paperTitle: "",
            paperMinScore: Number.MIN_SAFE_INTEGER,
            paperMaxScore: Number.MAX_SAFE_INTEGER
        },
        fileIds: [],
        summary: "",
        strengths: "",
        weaknesses: "",
        comments: "",
        questions: "",
        score: Number.MAX_SAFE_INTEGER,
        confidenceLevel: "",
        submissionDate: ""
    });

    const {
        isPending: isReviewPending,
        isError: isReviewError,
        error: reviewError,
        data: reviewData
    } = useQuery({
        queryKey: ["review", id],
        queryFn: async () => {
            const res = await fetch(`http://localhost:8080/api/reviews/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                }
            });
            if (res.status === 401) {
                await showAlert("Invalid Token", "Your token is invalid. You will be logged out.", "", "OK");
                logout();
            } else if (!res.ok) {
                await showAlert("Failed to Fetch Review", "The review could not be fetched: " + await res.text(), "", "OK");
            } else {
                return await res.json();
            }
        }
    });

    useEffect(() => {
        if (reviewData && !isReviewPending && !isReviewError) {
            setReviewObject(reviewData);
            const userJson = localStorage.getItem("user");
            if (userJson && reviewObject.request.paperOwnerName !== JSON.parse(userJson)?.name) {
                setIsReviewer(true);
            }
            if (reviewObject.score === Number.MAX_SAFE_INTEGER) {
                setIsInternal(true);
            }
            if (reviewObject.fileIds.length !== 0) {
                setHasReviewFiles(true);
            }

            const updateSubmissionDate = async () => {
                setSubmissionDate(convertISO8601ToDate(reviewObject.submissionDate));
                if (submissionDate === "") {
                    setSubmissionDate(new Date().toISOString());
                    await showAlert("Error converting ISO-8601", "An error occurred while converting the date from ISO-8601 format. Date is set to now. ", "", "OK");
                }
            }
            updateSubmissionDate();
        }
    }, [reviewData]);

    const downloadFile = (fileId: string) => {
        const fileUrl = `/path/to/files/${fileId}`;
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileId;
        link.click();
    };

    if (isReviewPending) {
        return <span>Loading...</span>;
    }
    if (isReviewError) {
        return <span>{`Error: ${reviewError.message}`}</span>;
    }

    return (
        <Paper sx=
                   {{
                       maxWidth: '3000px',
                       minHeight: '100vh',
                       width: '1000px',
                       backgroundColor: 'background.paper',
                       my: 10,
                       mx: 10,
                       py: 2,
                       px: 3,
                       borderRadius: 2,
                       boxShadow: 3,
                       position: "relative",
                       alignItems: "stretch",
                   }}
        >
            <Grid2 sx={{display: "flex", flexDirection: "row"}}>
                <Button variant="contained" onClick={() => navigate(`/paper/${reviewObject.request.paperId}`)}>
                    <FirstPageIcon></FirstPageIcon>
                    <Typography>Back to Paper</Typography>
                </Button>
                <Typography sx={{position: "absolute", right: 0,}}>
                    Upload Date: {convertISO8601ToDate(reviewObject.submissionDate)}
                </Typography>
            </Grid2>
            <Typography
                variant={"h4"}
                align={"center"}
                fontWeight={"bold"}
                sx={{mb: 2}}>
                {isReviewer ? "Your Review" : `${reviewObject.request.requestee.name}'s Review`}
            </Typography>

            <Grid2 container spacing={1} sx={{maxWidth: "100%", alignItems: "center"}}>
                <Box sx=
                         {{
                             minHeight: "210px",
                             maxHeight: "300px",
                             width: "100%",
                             overflowY: "auto",
                             border: "1px solid #777",
                             borderRadius: "8px",
                             backgroundColor: "background.default",
                             justifySelf: "center",
                         }}
                >
                    <Typography textAlign={"center"} variant={"h6"}>
                        <strong>Summary</strong>
                    </Typography>
                    <Divider></Divider>
                    <Typography sx={{m: 2}}>
                        {reviewObject.summary}
                    </Typography>
                </Box>
                <Grid2 gap={2} sx={{display: 'flex', flexDirection: 'row', width: "100%",}}>
                    <Box sx=
                             {{
                                 minHeight: "210px",
                                 maxHeight: "420px",
                                 width: "100%",
                                 overflowY: "auto",
                                 border: "1px solid #777",
                                 borderRadius: "8px",
                                 backgroundColor: "background.default",
                                 justifySelf: "center",
                             }}
                    >
                        <Typography textAlign={"center"} variant={"h6"}>
                            <strong>Strengths</strong>
                        </Typography>
                        <Divider></Divider>
                        <Typography sx={{m: 2}}>
                            {reviewObject.strengths}
                        </Typography>
                    </Box>
                    <Box sx=
                             {{
                                 minHeight: "210px",
                                 maxHeight: "420px",
                                 width: "100%",
                                 overflowY: "auto",
                                 border: "1px solid #777",
                                 borderRadius: "8px",
                                 backgroundColor: "background.default",
                                 justifySelf: "center",
                             }}
                    >
                        <Typography textAlign={"center"} variant={"h6"}>
                            <strong>Weaknesses</strong>
                        </Typography>
                        <Divider></Divider>
                        <Typography sx={{m: 2}}>
                            {reviewObject.weaknesses}
                        </Typography>
                    </Box>
                </Grid2>
                <Grid2 gap={2} sx={{display: 'flex', flexDirection: 'row', width: "100%"}}>
                    <Box sx=
                             {{
                                 minHeight: "210px",
                                 maxHeight: "315px",
                                 width: "100%",
                                 overflowY: "auto",
                                 border: "1px solid #777",
                                 borderRadius: "8px",
                                 backgroundColor: "background.default",
                                 justifySelf: "center",
                             }}
                    >
                        <Typography textAlign={"center"} variant={"h6"}>
                            <strong>Comments</strong>
                        </Typography>
                        <Divider></Divider>
                        <Typography sx={{m: 2}}>
                            {reviewObject.comments}
                        </Typography>
                    </Box>
                    <Box sx=
                             {{
                                 minHeight: "210px",
                                 maxHeight: "315px",
                                 width: "100%",
                                 overflowY: "auto",
                                 border: "1px solid #777",
                                 borderRadius: "8px",
                                 backgroundColor: "background.default",
                                 justifySelf: "center",
                             }}
                    >
                        <Typography textAlign={"center"} variant={"h6"}>
                            <strong>Questions</strong>
                        </Typography>
                        <Divider></Divider>
                        <Typography sx={{m: 2}}>
                            {reviewObject.questions}
                        </Typography>
                    </Box>
                </Grid2>
                <Box sx={{display: "flex", alignItems: "center", gap: 2, width: "100%"}}>
                    <Grid2 container sx={{display: "flex", flexDirection: "row", alignItems: "center", gap: 2}}>
                        <Typography>Confidence Level: </Typography>
                        <Chip
                            label={reviewObject.confidenceLevel ? reviewObject.confidenceLevel : "Not Specified"}
                            color={
                                reviewObject.confidenceLevel === "low" ? "error"
                                    : reviewObject.confidenceLevel === "medium" ? "warning"
                                        : reviewObject.confidenceLevel === "high" ? "success"
                                            : "primary"
                            }
                        >
                        </Chip>
                        {!isInternal && (
                            <Typography sx={{whiteSpace: "nowrap", position: "absolute", right: "25px"}}>
                                {`Score: ${reviewObject.score} from range [${reviewObject.request.paperMinScore}, ${reviewObject.request.paperMaxScore}]`}
                            </Typography>
                        )}
                    </Grid2>
                </Box>
                {hasReviewFiles && (
                    <>
                        <Typography>Review Files:</Typography>
                        <Grid2 container sx={{display: "flex", flexDirection: "row", alignItems: "center", gap: 2}}>
                            {reviewObject.fileIds.map((fileId, index) => (
                                <Button
                                    key={index}
                                    variant="text"
                                    color="primary"
                                    onClick={() => downloadFile(fileId)}
                                    startIcon={
                                        <InsertDriveFileIcon sx={{height: "50px", width: "50px"}}/>
                                    }
                                >
                                </Button>
                            ))}
                        </Grid2>
                    </>
                )}
            </Grid2>

        </Paper>
    );

}