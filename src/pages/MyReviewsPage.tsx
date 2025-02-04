// TODO: Implement MyReviews
import RequestListOfPapers from "../components/RequestListOfPapers.tsx";

export default function MyReviewsPage() {
    return (
        <div>
            <h1>Reviews</h1>
            <RequestListOfPapers
                endpoint={`http://localhost:8080/api/requests?status=PENDING`}
                title={"Requests"}
            />
        </div>
    )
}