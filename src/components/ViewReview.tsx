import Paper from "@mui/material/Paper";
import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

interface ReviewElement {
    id: number;
    fileIds: string[];
    summary: string;
    strengths:string;
    weaknesses: string;
    comments: string;
    questions: string;
    score: number;
    confidenceLevel: number;
    submissionDate: string;
}

export default function ViewReview() {
    const { id } = useParams<{ id: string }>();

    {/*const {
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

    const reviewObject: ReviewElement = reviewData;*/}

    {/*TO DO : on click go back to the previous page*/}
    const handleBackToPaper = () => {
        console.log('back to paper');
    };
    return(
        <Paper sx={{ width: '100%', minWidth: '1000px', maxWidth: '1000px', padding: '20px', borderRadius: '8px', boxShadow: 3, marginTop: 9}}>
            <Box sx={{
                width: '100%',
                height: '150px',
                overflowY: 'auto',
                boxShadow: 4, // Ombre légère autour de la box
                padding: 2,
            }}>
                <Typography variant="h6" gutterBottom>
                    Summmary
                </Typography>
                Affichage 1: Texte d'exemple 1hhh jhvkjghvkjgckjghc ujgvkcgtkugckhygtckyhgc ougftkujtiyhfgckjiygcjyc ouyfoufgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg
            </Box>
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                sx={{paddingTop: 2, width: '100%', overflowY: 'auto', padding: 1}}
            >
                {/* Box à gauche */}
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
                    Affichage 1: Textkhgfkchjgckjgckh;gfckhfckhfcxkyfxke d'
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
                    Affichage 1: Texte d'
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
                    Affichage 1: Textkhgfkchjgckjgckh;gfckhfckhfcxkyfxke d'
                </Box>

                {/* Box à droite */}
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
                    Affichage 1: Texte d'
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
                    <Typography variant="h6"><strong>Confidence level : </strong> medium</Typography>
                    <Typography variant="h6"><strong>Score : </strong> SCORE</Typography>
                </Box>
                <Box>
                    Submission Date : ikgkihyv
                    <Box
                    sx={{display: 'flex',
                        justifyContent: 'flex-end',
                        margin: 2,
                    }}>
                        <Button variant="contained" onClick={handleBackToPaper}>
                            Back to paper
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Paper>
    )

}