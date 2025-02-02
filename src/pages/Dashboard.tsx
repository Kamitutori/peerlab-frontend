export default function Dashboard() {

    if (!localStorage.getItem("jwt")) {
        window.location.href = "http://localhost:5173/login";
    }

    return (
        <>
            <h1>Dashboard</h1>
        </>
    );
}
