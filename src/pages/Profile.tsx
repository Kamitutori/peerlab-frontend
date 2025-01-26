import {useQuery} from "@tanstack/react-query";

interface UserElement {
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

    return (
        <div>
            <h1>Profile</h1>
            <h2>{userObject.name}</h2>
            <h3>{userObject.email}</h3>
        </div>
    )
}
