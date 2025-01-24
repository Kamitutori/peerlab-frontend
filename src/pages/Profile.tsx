import {useQuery} from "@tanstack/react-query";
import Box from "@mui/material/Box";
import {PaperListEntry} from "../components/PaperList.tsx";

interface UserElement {
    name: string,
    email: string
}

export default function Profile() {

    const {
        /*
        isPending: isPaperPending,
        isError: isPaperError,
        error: paperError,
        */
        data: paperData } =
        useQuery({
            queryKey: ["myPapers"],
            queryFn: async () => {
                const res = await fetch(`https://my-json-server.typicode.com/kamitutori/peerlab-frontend/paperList`);
                return (await res.json());}
        });
    const {
        isPending: isUserPending,
        isError: isUserError,
        data: userData,
        error: userError} =
        useQuery({
            queryKey: ["user"],
            queryFn: async () => {
                const res = await fetch(`https://my-json-server.typicode.com/kamitutori/peerlab-frontend/user`);
                return (await res.json());}
        });
    /*
    const {
        isPending: isReviewPending,
        isError: isReviewError,
        data: reviewData,
        error: reviewError} =
        useQuery({ queryKey: ["myReviews"], queryFn: fetchMyReviews });
    */

    // User as "dominant" object over the others...
    if (isUserPending) {
        return <span>Loading... (shimmer)</span>
    }
    if (isUserError) {
        return (
            <>
                <h1>{JSON.stringify(userError)}</h1>
            </>
        );
    }

    // At least user was successfully fetched
    let userObject: UserElement = userData[0];
    let paperObject: PaperListEntry[] = paperData;

    return (
        <div>
            <h1>Profile</h1>
            <h2>{userObject.name}</h2>
            <h3>{userObject.email}</h3>
            <Box>
                <div>{`"${paperObject[0].title}" by "${paperObject[0].ownerName}"`}</div>
                <div>{`"${paperObject[1].title}" by "${paperObject[1].ownerName}"`}</div>
                <div>{`"${paperObject[2].title}" by "${paperObject[2].ownerName}"`}</div>
                <div>{`"${paperObject[3].title}" by "${paperObject[3].ownerName}"`}</div>
                <div>{`"${paperObject[4].title}" by "${paperObject[4].ownerName}"`}</div>
            </Box>

            {/*
             <PaperList papers={paperData}/>
            <ShimmerTable mode="light" row={7} col={1} border={1} borderColor={"#cbd5e1"} rounded={0.25} rowGap={16} colPadding={[10, 5, 10, 5]} />
            <ReviewList reviews={reviewData}/>
             */}
        </div>
    )
}
