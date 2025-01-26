export default function Dashboard() {

    if (!localStorage.getItem("jwt")) {
        window.location.href = "http://localhost:5173/login";
    }

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
}
