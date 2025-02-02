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
import {useUpdateAuth} from "./auth/AuthenticationContext.tsx";
import {useNavigate} from "react-router-dom";
import {useAlertDialog} from "./AlertDialogProvider.tsx";
import {RequestObject} from "./RequestListOfRequestees.tsx";

/** The review object as returned by the server endpoint. */
export interface ReviewObject {
    id: number;
    request: RequestObject
    fileIds: string[];
    summary: string;
    strengths: string;
    weaknesses: string;
    comments: string;
    questions: string;
    score: number,
    confidenceLevel: number;
    creationDate: string;
}

/** The props for the list of papers; the title of the list and the endpoint to fetch its data from. */
interface ReviewListProps {
    endpoint: string;
    title: string;
}

// TODO | ALERT: Implementation not compatible with current single paper page implementation with props. Need tot alk about navigational context on monday.
/** This function processes and returns a list of all papers the user was requested to review. */
export default function ReviewList({endpoint, title}: ReviewListProps) {
    const {logout} = useUpdateAuth();
    const navigate = useNavigate();
    const {showAlert} = useAlertDialog();
    const LOGOUT_ALERT_TITLE = "Forced Logout";
    const LOGOUT_ALERT_MESSAGE = "You will be logged out shortly as your token is invalid.";

    /** Fetches the reviews from the server. */
    const {data, isLoading, error} = useQuery({
        queryKey: [endpoint],
        queryFn: async () => {
            const res = await fetch(endpoint);
            await showAlert(LOGOUT_ALERT_TITLE, LOGOUT_ALERT_MESSAGE, "", "");
            if (res.status === 401) {
                logout();
            }
            if (!res.ok) {
                throw new Error("Failed to fetch reviews");
            }
            return res.json();
        },
    });

    /** Sorts the received reviews by their submission date. Order is from most to least recent. */
    if (!isLoading && !error) {
        data.sort((review1: ReviewObject, review2: ReviewObject) => {
            return new Date(review2.creationDate).getTime() - new Date(review1.creationDate).getTime();
        });
    }

    /** Redirects to the review with the given id.
     * WARNING: This is where the implementation with the single paper page is not compatible.
     * */
    const handleClick = (reviewId: number) => {
        navigate(`/review/${reviewId}`);
    };

    /** The review list component. */
    return (
        <Card
            sx={{
                margin: "auto",
                mt: 4,
                boxShadow: 3,
                backgroundColor: "background.default",
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
                        padding: '8px 16px',
                        width: '100%',
                    }}
                >
                    {title}
                </Typography>
                {isLoading ? (
                    <Typography sx={{color: "white"}}>Loading reviews...</Typography>
                ) : error ? (
                    <Typography color="error">Failed to load reviews.</Typography>
                ) : (
                    <List sx={{maxHeight: 353, overflow: 'auto'}}>
                        {data.map((review:
                                   {
                                       id: number;
                                       request: RequestObject;
                                   }, index: number) => (
                            <div key={review.request.paperId}>
                                {/* Reviews mapped as List Element */}
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