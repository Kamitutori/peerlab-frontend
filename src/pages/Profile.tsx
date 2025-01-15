import PaperList from "../components/PaperList.tsx";
import ReviewList from "../components/ReviewList.tsx";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {useState} from "react";

{/*
async function fetchMyPapers() {
    const res = await axios
        .get("http://localhost:5173/api/papers/*methodName*", {params: {_sort: "title"}});
    return res.data;
*/}

export default function Profile() {

    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);

    const {
        isPending: isUserPending,
        isError: isUserError,
        data: userData,
        error: userError} =
        useQuery({ queryKey: ["user"], queryFn: fetchMyPapers })
    const {
        isPending: isPaperPending,
        isError: isPaperError,
        data: paperData,
        error: paperError} =
        useQuery({ queryKey: ["myPapers"], queryFn: fetchMyPapers })
    const {
        isPending: isReviewPending,
        isError: isReviewError,
        data: reviewData,
        error: reviewError} =
        useQuery({ queryKey: ["myPapers"], queryFn: fetchMyPapers })

    if (isPaperPending) {
        return <span>Loading... (shimmer)</span>
    }
    if (isPaperError) {
        return (
            <>
                <h1>{JSON.stringify(paperError)}</h1>
                <span>Error: {paperError.message}</span>
            </>
        );
    }
    // Assume, data was successfully loaded.

    {/*
    setUsername(userData.username);
    setEmail(userData.email);
    */}
    return (
        <div>
            <h1>Profile</h1>
            <div>{username}</div>
            <div>{email}</div>
            <PaperList papers={paperData}/>
            <ReviewList reviews={reviewData}/>
        </div>
    )
}

function fetchMyPapers() {
    return axios
        .get("http://localhost:5173/api/papers/*methodName*", { params: { _sort: "title" } })
        .then((res: { data: any; }) => res.data);

}
