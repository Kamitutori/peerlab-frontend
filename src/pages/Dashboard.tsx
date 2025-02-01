import RequestListOfRequestees, {SinglePaperRequestListEntry} from '../components/RequestListOfRequestees';
import RequestListOfPapers from "../components/RequestListOfPapers.tsx";

export default function Dashboard() {

    if (!localStorage.getItem("jwt")) {
        window.location.href = "http://localhost:5173/login";
    }

    const requestData: SinglePaperRequestListEntry[] = [
        { id: 1, status: "PENDING", paperId: 1, paperTitle: "Paper 1", paperOwnerName: "John Doe", requesteeId: 1, requesteeName: "Jane Doe", reviewId: null, creationDate: "2018-08-12T09:28:44Z"},
        { id: 2, status: "PENDING", paperId: 1, paperTitle: "Paper 1", paperOwnerName: "John Doe", requesteeId: 2, requesteeName: "Jane Do", reviewId: null, creationDate: "2018-08-12T09:28:44Z"},
        { id: 3, status: "ACCEPTED", paperId: 1, paperTitle: "Paper 1", paperOwnerName: "John Doe", requesteeId: 3, requesteeName: "Zane Do", reviewId: null, creationDate: "2018-08-12T09:28:44Z"},
        { id: 4, status: "REJECTED", paperId: 1, paperTitle: "Paper 1", paperOwnerName: "John Doe", requesteeId: 4, requesteeName: "Zane Go", reviewId: null, creationDate: "2018-08-12T09:28:44Z"},
        { id: 5, status: "SUBMITTED", paperId: 1, paperTitle: "Paper 1", paperOwnerName: "John Doe", requesteeId: 5, requesteeName: "Kane Go", reviewId: 1, creationDate: "2018-08-12T09:28:44Z"},
        { id: 2, status: "EXPIRED", paperId: 1, paperTitle: "Paper 1", paperOwnerName: "John Doe", requesteeId: 6, requesteeName: "Kane Gor", reviewId:  null, creationDate: "2018-08-12T09:28:44Z"},
        { id: 2, status: "PENDING", paperId: 1, paperTitle: "Paper 1", paperOwnerName: "John Doe", requesteeId: 7, requesteeName: "Janett Do", reviewId: null, creationDate: "2018-08-12T09:28:44Z"},
        ];

    const paperData: SinglePaperRequestListEntry[] = [
        { id: 4, status: "REJECTED", paperId: 4, paperTitle: "Paper 4", paperOwnerName: "Zane Go", requesteeId: 4, requesteeName: "John Doe", reviewId: null, creationDate: "2018-08-12T09:28:44Z"},
        { id: 2, status: "PENDING", paperId: 7, paperTitle: "Paper 7", paperOwnerName: "Janett Do", requesteeId: 7, requesteeName: "John Doe", reviewId: null, creationDate: "2018-09-12T07:28:44Z"},
        { id: 2, status: "EXPIRED", paperId: 6, paperTitle: "Paper 6", paperOwnerName: "Kane Gor", requesteeId: 6, requesteeName: "John Doe", reviewId:  null, creationDate: "2018-09-12T09:21:44Z" },
        { id: 5, status: "SUBMITTED", paperId: 5, paperTitle: "Paper 5", paperOwnerName: "Kane Go", requesteeId: 5, requesteeName: "John Doe", reviewId: null, creationDate: "2018-09-12T09:28:43Z"},
        { id: 1, status: "PENDING", paperId: 1, paperTitle: "Paper 1", paperOwnerName: "Jane Doe", requesteeId: 1, requesteeName: "John Doe", reviewId: null, creationDate: "2018-09-12T09:28:44Z" },
        { id: 3, status: "ACCEPTED", paperId: 3, paperTitle: "Paper 3", paperOwnerName: "Zane Do", requesteeId: 3, requesteeName: "John Doe", reviewId: null, creationDate: "2018-09-14T09:28:44Z"},
        { id: 2, status: "PENDING", paperId: 2, paperTitle: "Paper 2", paperOwnerName: "Jane Do", requesteeId: 2, requesteeName: "John Doe", reviewId: null, creationDate: "2019-09-12T09:28:44Z"},
    ];

    return (
        <>
            <RequestListOfRequestees requests={requestData} />
            <RequestListOfPapers requests={paperData} />
        </>
    );
}
