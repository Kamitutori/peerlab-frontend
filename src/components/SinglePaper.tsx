import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import {Typography} from "@mui/material";

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
}

interface RequestElement {
    id: number;
    status: string;
    paperId: number;
    reviewId: number;
}

interface Props {
    request: RequestElement;
}

const BannerBox = styled(Box)(({ theme, bannerColor }: { bannerColor: string, theme: any }) => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    backgroundColor: bannerColor,
    padding: theme.spacing(1.5),
    borderRadius: '4px',
    marginBottom: theme.spacing(2),
}));

const Root = styled('div')(({ theme }) => ({
    width: '95%',
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
}));


export default function SinglePaper({ request }: Props) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isRequest = Boolean(request && request.id && request.status);

    const {
        isPending: isPaperPending,
        isError: isPaperError,
        error: paperError,
        data: paperData
    } = useQuery({
        queryKey: ["paper", id],
        queryFn: async () => {
            const res = await fetch(`https://my-json-server.typicode.com/kamitutori/peerlab-frontend/paper/${id}`);
            if (!res.ok) throw new Error("Failed to fetch paper");
            return res.json();
        }
    });

    {/* TO DO : download link for the paper!!*/}
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

    const paperObject: PaperElement = paperData;

    const openToReview = isRequest && ((request.status === "ACCEPTED" && !request.reviewId) ||
        (request.status === "EXPIRED" && !request.reviewId && !paperObject.reviewLimit && paperObject.active));


    // Logic for banner color and message
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

        bannerColor = getBannerColor(request.status);
        bannerMessage = getBannerMessage(request.status);
    }
    {/*TO DO : change the status of the request when the button is clicked */}
    const handleAccept = () => {
        console.log('Request Accepted');
    };

    const handleReject = () => {
        console.log('Request Rejected');
    };

    {/* TO DO : Delete the review if the button is clicked*/}
    const handleDelete = () => {
        console.log('Review Deleted');
    };

    return (
        <>
            <Paper sx={{ width: '100%', maxWidth: '1000px', padding: '20px', borderRadius: '8px', boxShadow: 3, marginTop: 9}}>
                <Typography variant="h4" sx={{ marginBottom: 2, textAlign: 'center' }}>{paperObject.title}</Typography>
                {isRequest && (<BannerBox bannerColor={bannerColor} theme={undefined} >
                    <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff', paddingLeft: '10px' }}>
                        {bannerMessage}
                    </Typography>
                    {request.status === "PENDING" && (
                        <>
                            <Button variant="contained" color="secondary" onClick={handleAccept}>Accept</Button>
                            <Button variant="contained" color="secondary" sx={{ marginLeft: 2 }} onClick={handleReject}>Reject</Button>
                        </>
                    )}
                </BannerBox>)}
                <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ marginBottom: 2 }}>
                    <Chip label={paperObject.internal ? 'Internal' : 'External'} color="primary" />
                    <Button
                        variant="contained"
                        onClick={handleDownload}
                        startIcon={<FileDownloadIcon />}
                    >
                        Download Paper
                    </Button>
                </Stack>
                <Typography variant="body1"><strong>Authors : </strong> {paperObject.authors}</Typography>
                <Typography variant="body1"><strong>Preview : </strong> {paperObject.abstractText}</Typography>
                <Root>
                    <Divider />
                </Root>
                <Typography variant="body1"><strong>Accepted requests : </strong> *number of reached reviews* {paperObject.reviewLimit ? ` / ${paperObject.reviewLimit}` : ' '}</Typography>
                <Typography variant="body1"><strong>Status :  </strong> {`${paperObject.active ? 'active' : 'inactive'}`}</Typography>


                <Root>
                    <Divider>Author's Note</Divider>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{paperObject.authorsNote}</Typography>
                    <Divider />
                </Root>
                {/*TO DO : real request/review list*/}
                {!isRequest && (
                <List
                    sx={{
                        width: '100%',
                        maxWidth: 600,
                        bgColor: 'background.paper',
                        position: 'relative',
                        overflow: 'auto',
                        maxHeight: 250,
                        '& ul': { padding: 0 },
                    }}
                    subheader={<li />}
                >
                    {[0, 1, 2, 3, 4].map((sectionId) => (
                        <li key={`section-${sectionId}`}>
                            <ul>
                                <ListSubheader>{`review status ${sectionId}`}</ListSubheader>
                                {[0, 1, 2].map((item) => (
                                    <ListItem key={`item-${sectionId}-${item}`}>
                                        <ListItemText primary={`Review ${item}`} />
                                    </ListItem>
                                ))}
                            </ul>
                        </li>
                    ))}
                </List>)}
                <Stack spacing={2} direction="row" justifyContent="flex-end" sx={{ marginTop: 2 }}>
                    <Button variant="outlined" onClick={() => navigate(`/edit-paper/${id}`)}>Edit</Button>
                    {isRequest && request.reviewId && (
                        <Button variant="outlined" onClick={() => navigate(`/view-review/${request.reviewId}`)}>
                            View Review
                        </Button>
                    )}
                    {openToReview && (
                        <Button variant="outlined" onClick={() => navigate(`/add-review/${id}`)}>
                            Add Review
                        </Button>
                    )}
                </Stack>
                {isRequest && request.reviewId && (
                    <Stack direction="row" justifyContent="flex-end" sx={{ marginTop: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate(`/edit-review/${request.reviewId}`)}
                            color="primary"
                            sx={{ marginRight: 2 }}
                        >
                            Edit the Review
                        </Button>
                    </Stack>
            )}
                {isRequest && request.reviewId && (
                    <Stack spacing={2} direction="row" justifyContent="flex-end">
                        <Button variant="outlined" onClick={handleDelete}>
                            Delete review
                        </Button>
                    </Stack>)}
            </Paper>

            <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>{`Upload Date: ${paperObject.uploadDate}`}</div>
        </>
    );
}