import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import {Typography} from '@mui/material';

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

export default function SinglePaperRequest() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();


    const {
        isPending: isRequestPending,
        isError: isRequestError,
        error: requestError,
        data: requestData
    } = useQuery({
        queryKey: ["request", id],
        queryFn: async () => {
            const res = await fetch(`https://my-json-server.typicode.com/kamitutori/peerlab-frontend/request/${id}`);
            if (!res.ok) throw new Error("Failed to fetch request");
            return res.json();
        }
    });

    const requestObject: RequestElement = requestData;

    const paperId: number = requestObject?.paperId;

    const {
        isPending: isPaperPending,
        isError: isPaperError,
        error: paperError,
        data: paperData
    } = useQuery({
        queryKey: ["paper", paperId],
        queryFn: async () => {
            const res = await fetch(`https://my-json-server.typicode.com/kamitutori/peerlab-frontend/paper/${paperId}`);
            if (!res.ok) throw new Error("Failed to fetch paper");
            return res.json();
        }
    });

    if (isRequestPending || isPaperPending) {
        return <span>Loading...</span>;
    }

    if (isRequestError || isPaperError || !requestData || !paperData) {
        return <span>{`Error!: ${requestError?.message || paperError?.message || "Unknown error"}`}</span>;
    }

    const paperObject: PaperElement = paperData;

    const fileUrl = 'https://example.com/path/to/your/file.pdf';
    const fileName = 'downloaded-file.pdf';
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.click();
    };

    const Root = styled('div')(({ theme }) => ({
        width: '95%',
        ...theme.typography.body2,
        color: theme.palette.text.secondary,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(2),
    }));

    const getBannerColor = (requestObject: { status: string }): string => {
        let bannerColor: string;
        if (requestObject.status === "ACCEPTED" || requestObject.status === "SUBMITTED") {
            bannerColor = "#90EE90";
        } else {
            bannerColor = "#FF6347";
        }
        return bannerColor;
    };
    const bannerColor = getBannerColor(requestObject);

    const getBannerMessage = (requestObject: { status: string }): string => {
        let bannerMessage: string;
        if (requestObject.status === "PENDING") {
            bannerMessage = "A review has been requested : ";
        } else if (requestObject.status === "ACCEPTED") {
            bannerMessage = "The request has been accepted.";
        } else if (requestObject.status === "SUBMITTED") {
            bannerMessage = "The review has been submitted.";
        } else if (requestObject.status === "REJECTED") {
            bannerMessage = "The request has been rejected.";
        } else{
            bannerMessage = "The request is expired.";
        }
        return bannerMessage;
    };
    const bannerMessage = getBannerMessage(requestObject);


    return (
        <>
            <Paper sx={{ width: '100%' }}>
                <h2>.</h2>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', backgroundColor: bannerColor}}>
                    <Typography variant="h6" sx={{ flexGrow: 1, paddingLeft: '10px', paddingRight: '10px'}}>
                        {bannerMessage}
                    </Typography>
                    {requestObject.status === "PENDING" && (
                        <Button variant="contained" color="secondary">
                            Accept
                        </Button>
                    )}
                    {requestObject.status === "PENDING" && (
                        <Button variant="contained" color="secondary" sx={{ marginRight: '25px', marginLeft: '25px'}}>
                            Reject
                        </Button>
                    )}

                </Box>
                <h2 style={{ paddingLeft: '10px', paddingRight: '10px' }}>{paperObject.title}</h2>
                <h3 style={{ paddingLeft: '10px', paddingRight: '10px' }}>{`Authors : ${paperObject.authors}`}</h3>

                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Stack spacing={1} sx={{ alignItems: 'center', paddingLeft: '10px', paddingRight: '10px' }}>
                        <Chip label={paperObject.internal ? 'Internal' : 'External'} />
                    </Stack>
                    <Button
                        component="label"
                        variant="contained"
                        tabIndex={-1}
                        onClick={handleDownload}
                        startIcon={<FileDownloadIcon />}
                        sx={{ marginRight: '20px' }}
                    >
                        Download paper
                    </Button>
                </Stack>

                <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>{`Reached reviews : X/${paperObject.reviewLimit}`}</div>
                <Box sx={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', paddingLeft: '10px', paddingRight: '10px' }}>
                    <div>{`Preview: ${paperObject.abstractText}`}</div>
                </Box>

                <Root>
                    <Divider>Author's Note</Divider>
                    <p>{paperObject.authorsNote}</p>
                    <Divider />
                </Root>

                <Stack spacing={2} direction="row" justifyContent="flex-end">
                    <Button variant="outlined" onClick={() => navigate(`/edit-paper/${id}`)}>
                        Edit
                    </Button>
                </Stack>
            </Paper>

            <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>{`Upload Date: ${paperObject.uploadDate}`}</div>
        </>
    );
}