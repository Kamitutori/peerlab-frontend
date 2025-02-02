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
    useTheme,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import {useNavigate} from "react-router-dom";

/** The request object as returned by the server endpoint. */
export interface RequestObject {
    id: number;
    status: string;
    paperId: number;
    paperTitle: string;
    paperOwnerName: string;
    requesteeId: number;
    requesteeName: string;
    reviewId: number | null;
    creationDate: string;
}

export interface ListOfRequests {
    requests: RequestObject[];
}

/** This function processes and returns a list of all the requested users of a paper. */
export default function RequestListOfRequestees({requests}: ListOfRequests) {
    const navigate = useNavigate();
    const theme = useTheme();
    const isLightMode = theme.palette.mode === "light";

    /** Sorts the received requests first by their status in below order and secondary in alphabetical order. */
    requests.sort((a: RequestObject, b: RequestObject) => {
        const statusOrder = ["SUBMITTED", "ACCEPTED", "PENDING", "REJECTED", "EXPIRED"];
        const statusComparison = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        return statusComparison !== 0 ? statusComparison : a.requesteeName.localeCompare(b.requesteeName);
    });

    /** Redirects to the review with the given id. */
    const handleClick = (reviewId: number) => {
        navigate(`/review/${reviewId}`);
    };

    /** Adapts the color scheme of the requests to their status and the current theme. */
    const matchColor = (status: string) => {
        if (status === "PENDING") {
            return isLightMode ? "#e6e600": "#b3b300";
        } else if (status === "ACCEPTED") {
            return isLightMode ? "#00ccff": "#008ae6";
        } else if (status === "SUBMITTED") {
            return isLightMode ? "#99ff99" : "#008000";
        } else if (status === "REJECTED") {
            return "#ff0000";
        } else {
            return isLightMode ? "#f2f2f2" : "#595959";
        }
    }

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
                    Reviews
                </Typography>
                <List sx={{maxHeight: 353, overflow: 'auto'}}>
                    {requests.map((request:
                               {
                                   id: number;
                                   status: string;
                                   requesteeName: string;
                                   reviewId: number | null
                               },
                               index: number) => (
                        <div key={request.id}>
                            {/* Requests mapped as List Element */}
                            <ListItemButton
                                disabled={request.status !== "SUBMITTED"}
                                onClick={() => handleClick(request.reviewId === null ? 0 : request.reviewId)}
                                sx={{
                                    borderRadius: 2,
                                    backgroundColor: "background.paper",
                                    "&:hover": {
                                        backgroundColor: "#888888", // Dark: b2b2b2; Light: 888888
                                    },
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <ArticleIcon sx={{color: 'background.default'}}/>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={request.requesteeName}
                                    secondary={request.status}
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
                                                color: matchColor(request.status),
                                            },
                                        }
                                    }}
                                />
                            </ListItemButton>
                            {index < requests.length - 1 && <Divider sx={{backgroundColor: "grey"}}/>}
                        </div>
                    ))}
                </List>

            </CardContent>
        </Card>
    );
}
