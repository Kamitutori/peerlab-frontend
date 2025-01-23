import {useQuery} from "@tanstack/react-query";

/*
async function fetchMyPapers() {
    const res = await axios
        .get("http://localhost:5173/api/papers/*methodName*", {params: {_sort: "title"}});
    return res.data;
*/

interface UserTemplate {
    name: string,
    email: string
}

export default function Profile() {
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
    const userObject: UserTemplate = userData[1];

    return (
        <div>
            <h1>Profile</h1>
            <h2>{userObject.name}</h2>
            <h3>{userObject.email}</h3>

            {/*
             <PaperList papers={paperData}/>
            <ShimmerTable mode="light" row={7} col={1} border={1} borderColor={"#cbd5e1"} rounded={0.25} rowGap={16} colPadding={[10, 5, 10, 5]} />
            <ReviewList reviews={reviewData}/>
             */}
        </div>
    )
}


/*
    Synchronous implementation example in case I need to go back
function fetchUser() {
    return axios
        .get("https://my-json-server.typicode.com/kamitutori/peerlab-frontend/user")
        .then((res: { data: any; }) => res.data);
}
    Asynchronous implementation example in case I need to go back
async function fetchUser() {
    const res = await axios
        .get("https://my-json-server.typicode.com/kamitutori/peerlab-frontend/user");
    return res.data;
}

async function fetchMyPapers() {
    const res = await axios
        .get("https://my-json-server.typicode.com/kamitutori/peerlab-frontend/paper", {params: {_sort: "title"}});
    return res.data;
}

async function fetchMyReviews() {
    const res = await axios
        .get("https://my-json-server.typicode.com/kamitutori/peerlab-frontend/reviews");
    return res.data;
}
*/
