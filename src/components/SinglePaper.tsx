
import {useQuery} from "@tanstack/react-query";
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
//    requests: SinglePaperRequestListEntry
}



export default function SinglePaper() {
    const {
        isPending: isPaperPending,
        isError: isPaperError,
        error: paperError,
        data: paperData} =
        useQuery({ queryKey: ["paper"],
            queryFn: async () => {
                const res = await fetch(
                    `https://my-json-server.typicode.com/kamitutori/peerlab-frontend/paper`);
                return (await res.json());
            }
        });


    if (isPaperPending) {
        return <span>Loading...</span>;
    }
    if (isPaperError) {
        return <span>{`Error!: ${paperError.message}`}</span>;
    }

  

    let paperObject: PaperElement = paperData[1];
    return (
        <>
            <Paper sx={{ width: '100%' }}>
            <h2>{paperObject.title}</h2>
            <h3>{`Authors : ${paperObject.authors}`}</h3>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<FileDownloadIcon />}
            >
              Download paper
            </Button>
            {/*<div>{`Active :  ${paperObject.active}`}</div>
            <div>{`Internal : ${paperObject.internal}`}</div>*/}
            <Stack spacing={1} sx={{ alignItems: 'center' }}>
              <Chip label={paperObject.internal === true ? 'Internal' : 'External'}/>
            </Stack>
            <div>{`Reviews : X/${paperObject.reviewLimit}`}</div>
            <Box sx={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)' }}>
                <div>{`Preview: ${paperObject.abstractText}`}</div>
            </Box>
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
            <Box>
                <div>{`Authors note: ${paperObject.authorsNote}`}</div>
            </Box>
            </Paper>
            
            <div>{`Upload Date: ${paperObject.uploadDate}`}</div>

            {/*
                <RequestList />
                <Button href={"/api/papers"}>
                    {"Edit"}
                </Button>
                */}
        </>
    );


}

