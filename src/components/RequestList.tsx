// TODO: Implement the RequestList component
export interface RequestListEntry {
    id: number;
    status: string;
    paperTitle: string;
    paperOwnerName: string;
    paperUploadDate: string;
}

export interface SinglePaperRequestListEntry {
    id: number;
    status: string;
    requesteeName: string;
}

export default function RequestList() {

    return (
        <div>
            <h2>RequestList</h2>
        </div>
    )
}