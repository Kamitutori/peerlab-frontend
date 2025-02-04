import Paper from "@mui/material/Paper";
import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

interface ReviewElement {
    id: number;
    fileIds: string[];
    summary: string;
    strengths:string;
    weaknesses: string;
    comments: string;
    questions: string;
    score: number;
    confidenceLevel: string;
    submissionDate: string;
}

export default function ViewReview() {
    const { id } = useParams<{ id: string }>();

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
            if (!res.ok) throw new Error("Failed to fetch review");
            return res.json();
        }
    });

    if (isReviewPending) {
        return <span>Loading...</span>;
    }
    if (isReviewError) {
        return <span>{`Error!: ${reviewError.message}`}</span>;
    }

    const reviewObject: ReviewElement = reviewData;

    {/*TO DO : on click go back to the previous page*/}
    const handleBackToPaper = () => {
        console.log('back to paper');
    };


    {/*TO DO : download the pdf with the button!!*/}
    const downloadFile = (fileId: string) => {
        const fileUrl = `/path/to/files/${fileId}`;
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileId;
        link.click();
    };


    return(
        <Paper sx={{ width: '100%', minWidth: '1000px', maxWidth: '1000px', padding: '20px', borderRadius: '8px', boxShadow: 3, marginTop: 9}}>
            <Box sx={{
                width: '100%',
                height: '150px',
                overflowY: 'auto',
                boxShadow: 4,
                padding: 2,
            }}>
                <Typography variant="h6" gutterBottom>
                    Summmary
                </Typography>
                {reviewObject.summary}
            </Box>
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                sx={{paddingTop: 2, width: '100%', overflowY: 'auto', padding: 1}}
            >
                <Box
                    sx={{
                        width: '50%',
                        height: '290px',
                        overflowY: 'auto',
                        boxShadow: 4,
                        marginRight: 1,
                        padding: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Strengths
                    </Typography>
                    {reviewObject.strengths}
                </Box>

                <Box
                    sx={{
                        width: '50%',
                        height: '290px',
                        overflowY: 'auto',
                        boxShadow: 4,
                        marginLeft: 1,
                        padding: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Questions
                    </Typography>
                    {reviewObject.questions}
                </Box>
            </Box>
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                sx={{ paddingTop: 2, width: '100%', overflowY: 'auto', padding: 1}}
            >
                <Box
                    sx={{
                        width: '50%',
                        height: '290px',
                        overflowY: 'auto',
                        boxShadow: 4,
                        marginRight: 1,
                        padding: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Weaknesses
                    </Typography>
                    {reviewObject.weaknesses}
                </Box>

                <Box
                    sx={{
                        width: '50%',
                        height: '290px',
                        overflowY: 'auto',
                        boxShadow: 4,
                        marginLeft: 1,
                        padding: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Comments
                    </Typography>
                    {reviewObject.comments}
                </Box>
            </Box>
            <Box
                display="flex"
                flexDirection="row"
                sx={{
                width: '100%',
                marginLeft: 1,
                padding: 2,
            }}>
                <Box
                    sx={{
                        width: '75%',
                    }}
                >
                    <Typography variant="h6"><strong>Confidence level : </strong> {reviewObject.confidenceLevel}</Typography>
                    <Typography variant="h6"><strong>Score : </strong> {reviewObject.score}</Typography>
                </Box>
                <Box>
                    Submission Date : {reviewObject.submissionDate}
                    <Box
                    sx={{display: 'flex',
                        justifyContent: 'flex-end',
                        margin: 2,
                    }}>
                        <Button variant="contained" onClick={handleBackToPaper}>
                            Back to paper
                        </Button>
                    </Box>

                    {/*TO DO : download files button*/}
                </Box>
            </Box>
            <Grid container spacing={2}>
                {reviewObject.fileIds.map((fileId) => (
                    <Grid item xs={12} sm={6} md={4} key={fileId}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => downloadFile(fileId)}
                            fullWidth
                        >
                            Download {fileId}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    )

}