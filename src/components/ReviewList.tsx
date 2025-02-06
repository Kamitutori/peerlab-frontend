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

export interface ListProps {
    endpoint: string;
    title: string;
    width?: string | number;
    height?: string | number;
}

export default function ReviewList({endpoint, title, width = 600, height = 300}: ListProps) {
    const {showAlert} = useAlertDialog();
    const {logout} = useUpdateAuth();
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
                await showAlert("Forced Logout", "You will be logged out shortly as your token is invalid.", "", "OK");
                logout();
            }
            if (!res.ok) {
                throw new Error("Failed to fetch reviews.");
            }
            return await res.json();
        }
    });

    const handleClick = (reviewId: number) => {
        navigate(`/review/${reviewId}`);
    };

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
            <CardContent sx={{maxHeight: height, overflow: 'auto', padding: 0}}>
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
                    <Typography>Loading reviews...</Typography>
                ) : error ? (
                    <Typography color="error">Failed to load reviews.</Typography>
                ) : data.length === 0 ? (
                    <Typography color={"textSecondary"}>
                        No reviews to display.
                    </Typography>
                ) : (
                    <List sx={{maxHeight: height, overflow: 'auto'}}>
                        {data.map((review: { id: number; request: RequestObject }, index: number) => (
                            <div key={review.request.paperId}>
                                <ListItemButton
                                    onClick={() => handleClick(review.id)}
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
                                        primary={review.request.paperTitle}
                                        secondary={`Author: ${review.request.paperOwnerName}`}
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