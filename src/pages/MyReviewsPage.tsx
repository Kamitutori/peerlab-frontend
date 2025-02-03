// TODO: Implement MyReviews
import ReviewList from "../components/ReviewList.tsx";

export default function MyReviewsPage() {
    return (
        <div>
            <h1>Reviews</h1>
            <ReviewList
                endpoint={`http://localhost:8080/api/papers`}
                title={"My Reviews"}
            />
        </div>
    )
}