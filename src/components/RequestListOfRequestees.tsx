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

// TODO theme adjustment depending on light/dark mode
export interface SinglePaperRequestListEntry {
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

export interface ListOfRequesteesProps {
    requests: SinglePaperRequestListEntry[];
}

/** */
export default function RequestListOfPapers({requests}: ListOfRequesteesProps) {
    const navigate = useNavigate();
    const theme = useTheme();
    const isLighMode = theme.palette.mode === "light";

    requests.sort((a: SinglePaperRequestListEntry, b: SinglePaperRequestListEntry) => {
        const statusOrder = ["SUBMITTED", "ACCEPTED", "PENDING", "REJECTED", "EXPIRED"];
        const statusComparison = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        return statusComparison !== 0 ? statusComparison : a.requesteeName.localeCompare(b.requesteeName);
    });

    const handleClick = (reviewId: number) => {
        navigate(`/review/${reviewId}`);
    };

    const matchColor = (status: string) => {
        if (status === "PENDING") {
            return isLighMode ? "#e6e600" : "#b3b300"; // Light mode
            //return "#b3b300"; // Dark mode
        } else if (status === "ACCEPTED") {
            return "#00ccff"; // Light mode
            //return "#008ae6"; // Dark mode
        } else if (status === "SUBMITTED") {
            return "#99ff99"; // Light mode
            //return "#008000"; // Dark mode
        } else if (status === "REJECTED") {
            return "#ff0000"; // Light mode
        } else {
            return "#f2f2f2"; // Light mode
            //return "#595959"; // Dark mode
        }
    }

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
                            <ListItemButton
                                disabled={request.status !== "SUBMITTED"}
                                onClick={() => handleClick(request.reviewId === null ? 0 : request.reviewId)}
                                sx={{
                                    borderRadius: 2,
                                    backgroundColor: matchColor(request.status),
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
                                                color: "primary",
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
