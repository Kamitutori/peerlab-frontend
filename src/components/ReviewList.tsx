import axios from "axios";

interface ReviewListProps {
    reviews?: axios.AxiosResponse<any> | undefined
}

export default function ReviewList({reviews}: ReviewListProps) {
    return (
        <div>
            <h2>ReviewList</h2>

        </div>
    )
}