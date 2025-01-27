export default function Dashboard() {

    if (!localStorage.getItem("jwt")) {
        window.location.href = "http://localhost:5173/login";
    }
    /*
    const { data } = useQuery({
        queryKey: ['recent'],
        queryFn: async () => {
            const res = await fetch("http://localhost:8080/api/papers", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            return await res.json();
        }
    });
    */
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
}
