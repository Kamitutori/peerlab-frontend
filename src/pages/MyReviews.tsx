// TODO: Implement MyReviews
import ReviewList from "../components/ReviewList.tsx";

export default function MyReviews() {
    return (
        <div>
            <h1>Reviews</h1>
            <ReviewList
            endpoint={`https://my-json-server.typicode.com/kamitutori/peerlab-frontend/reviewList`}
            title={"My Reviews"}
            />
        </div>
    )
}