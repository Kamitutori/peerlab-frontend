import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
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

export default function SinglePaper() {
    const { id } = useParams<{ id: string }>();

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

    if (isPaperPending) {
        return <span>Loading...</span>;
    }
    if (isPaperError) {
        return <span>{`Error!: ${paperError.message}`}</span>;
    }

    const paperObject: PaperElement = paperData;

    return (
        <>
            <Paper sx={{ width: '100%' }}>
                <h2>.</h2>
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

                <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>{`Status :  ${paperObject.active ? 'active' : 'inactive'}`}</div>
                <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>{`Review limit : X/${paperObject.reviewLimit}`}</div>
                <Box sx={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', paddingLeft: '10px', paddingRight: '10px' }}>
                    <div>{`Preview: ${paperObject.abstractText}`}</div>
                </Box>

                <Root>
                    <Divider>Author's Note</Divider>
                    <p>{paperObject.authorsNote}</p>
                    <Divider />
                </Root>

                <List
                    sx={{
                        width: '100%',
                        maxWidth: 600,
                        bgcolor: 'background.paper',
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
                </List>

                <Stack spacing={2} direction="row" justifyContent="flex-end">
                    <Button variant="outlined" href={"/api/papers"}>
                        Edit
                    </Button>
                </Stack>
            </Paper>

            <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>{`Upload Date: ${paperObject.uploadDate}`}</div>
        </>
    );
}