import {useQuery} from "@tanstack/react-query";
import {
    Avatar,
    Card,
    CardContent,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography,
    Divider,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import {useNavigate} from "react-router-dom";
import {useUpdateAuth} from "./auth/AuthenticationContext.tsx";
import {useAlertDialog} from "./AlertDialogProvider.tsx";
import {RequestObject} from "./RequestListOfRequestees.tsx";

/** The props for the list of papers; the title of the list and the endpoint to fetch its data from. */
export interface ListProps {
    endpoint: string;
    title: string;
}

// TODO | ALERT: Implementation not compatible with current single paper page implementation with props. Need tot alk about navigational context on monday.
// TODO | ALERT: This implementation expects a request dto with a date. You may encounter issues with the current backend.
/** This function processes and returns a list of all papers the user was requested to review. */
export default function RequestListOfPapers({endpoint, title}: ListProps) {
    const { showAlert } = useAlertDialog();
    const {logout} = useUpdateAuth();
    const LOGOUT_ALERT_TITLE = "Forced Logout";
    const LOGOUT_ALERT_MESSAGE = "You will be logged out shortly as your token is invalid.";
    const navigate = useNavigate();

    const {data, isLoading, error} = useQuery({
        queryKey: [endpoint],
        queryFn: async () => {
            const res = await fetch(endpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
                },
            });
            if (res.status === 401) {
                await showAlert(LOGOUT_ALERT_TITLE, LOGOUT_ALERT_MESSAGE, "", "");
                setTimeout(() => {logout();}, 5000);}
            if (!res.ok) {
                throw new Error("Failed to fetch requests.");
            }
            return res.json();
        },
    });

    /** Sorts the received requests by their creation date. Order is from most to least recent. */
    if (!isLoading && !error) {
        data.sort((request1: RequestObject, request2: RequestObject) => {
            return new Date(request2.creationDate).getTime() - new Date(request1.creationDate).getTime();
        });
    }

    /** Redirects to the paper with the given id.
     * WARNING: This is where the implementation with the single paper page is not compatible.
     * */
    const handleClick = (paperId: number) => {
        navigate(`/paper/${paperId}`);
    };

    /** The request list component. */
    return (
        <Card
            sx={{
                margin: "auto",
                mt: 4,
                boxShadow: 3,
                backgroundColor: "background.default",
                minWidth: 300,
            }}
        >
            {/* Content of the List */}
            <CardContent sx={{maxHeight: 400, overflow: 'hidden', padding: 0}}>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: "background.paper",
                        zIndex: 1,
                        px: "2px",
                        width: '100%',
                        textAlign: 'center',
                        display: 'flex', // Enables flexbox for vertical centering
                        justifyContent: 'center', // Centers content horizontally
                        alignItems: 'center',
                        minHeight: '50px', // Ensures enough height for vertical centering
                    }}
                >
                    {title}
                </Typography>
                {isLoading ? (
                    <Typography>Loading requests...</Typography>
                ) : error ? (
                    <Typography color="error">Failed to load requests.</Typography>
                ) : (
                    <List sx={{maxHeight: 353, overflow: 'auto'}}>
                        {data.map((request:
                                   {
                                       id: number;
                                       paperTitle: string;
                                       paperOwnerName: string;
                                       paperId: number
                                   },
                                   index: number) => (
                            <div key={request.id}>
                                {/* Requested Papers mapped as List Element */}
                                <ListItemButton
                                    onClick={() => handleClick(request.paperId)}
                                    sx={{
                                        borderRadius: 2,
                                        "&:hover": {
                                            backgroundColor: "background.paper",
                                        },
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ArticleIcon sx={{color: 'background.default'}}/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={request.paperTitle}
                                        secondary={`Author: ${request.paperOwnerName}`}
                                        slotProps={{
                                            primary: {
                                                noWrap: true,
                                                sx: {
                                                    fontSize: "0.875rem",
                                                    textOverflow: "ellipsis",
                                                    overflow: "hidden",
                                                    color: "primary",
                                                },
                                            },
                                            secondary: {
                                                sx: {
                                                    fontSize: "0.75rem",
                                                    color: "primary",
                                                },
                                            }
                                        }}
                                    />
                                </ListItemButton>
                                {index < data.length - 1 && <Divider sx={{backgroundColor: "grey"}}/>}
                            </div>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
}
