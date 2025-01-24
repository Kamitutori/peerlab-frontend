
import {useQuery} from "@tanstack/react-query";
import Box from "@mui/material/Box";

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

    const paperObject: PaperElement = paperData[1];
    return (
        <>
            <h2>{paperObject.title}</h2>
            <h2>{paperObject.authors}</h2>
            <div>{`Active ${paperObject.active}`}</div>
            <div>{`Internal: ${paperObject.internal}`}</div>
            <div>{`Reviews: X/${paperObject.reviewLimit}`}</div>
            <Box sx={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)' }}>
                <div>{`Preview: ${paperObject.abstractText}`}</div>
            </Box>
            <Box>
                <div>{`Authors note: ${paperObject.authorsNote}`}</div>
            </Box>
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

