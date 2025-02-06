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
    width?: string | number;
    height?: string | number;
}

/** This function processes and returns a list of all papers the user was requested to review. */
export default function RequestListOfPapers({endpoint, title, width = 600, height = 300}: ListProps) {
    const { showAlert } = useAlertDialog();
    const {logout} = useUpdateAuth();
    const navigate = useNavigate();

    /** Fetches the requests from the server. */
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
                await showAlert("Forced Logout", "You will be logged out shortly as your token is invalid.", "", "OK");
                logout();
            }
            if (!res.ok) {
                throw new Error("Failed to fetch requests.");
            }
            return await res.json();
        }
    });

    /** Sorts the received requests by their creation date. Order is from most to least recent. */
    if (!isLoading && !error) {
        data.sort((request1: RequestObject, request2: RequestObject) => {
            return new Date(request2.creationDate).getTime() - new Date(request1.creationDate).getTime();
        });
    }

    /** Redirects to the paper with the given id. */
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
                minWidth: width,
            }}
        >
            {/* Content of the List */}
            <CardContent sx={{padding: 0 }}>
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
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '50px',
                    }}
                >
                    {title}
                </Typography>
                {isLoading ? (
                    <Typography>Loading requests...</Typography>
                ) : error ? (
                    <Typography color="error">Failed to load requests.</Typography>
                ) : data.length === 0 ? (
                    <Typography color={"textSecondary"}>
                        No requests to display.
                    </Typography>
                ) : (
                    <List sx={{ maxHeight: height, overflow: 'auto' }}>
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