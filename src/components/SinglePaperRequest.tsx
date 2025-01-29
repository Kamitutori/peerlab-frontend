import {useQuery} from "@tanstack/react-query";
import Paper from '@mui/material/Paper';




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

export interface SinglePaperRequestListEntry {
    id: number;
    paper: PaperElement;
    status: string;
}

export default function SinglePaperRequest() {
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
            <Paper sx={{width: '100%'}}>



            </Paper>
        
        </>
    )
}

