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

export interface SinglePaperRequestListEntry {
    id: number;
    status: string;
    paperId: string;
    paperTitle: string;
    paperOwnerName: string;
    requesteeId: number;
    requesteeName: string;
    reviewId: number;
}

interface ListOfRequesteesProps {
    requests: SinglePaperRequestListEntry[];
}

export default function RequestListOfPapers({requests}: ListOfRequesteesProps) {
    const navigate = useNavigate();

    const statusOrder = ["SUBMITTED", "ACCEPTED", "PENDING", "REJECTED", "EXPIRED"];
    requests.sort((a: SinglePaperRequestListEntry, b: SinglePaperRequestListEntry) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

    const handleClick = (reviewId: number) => {
        navigate(`/review/${reviewId}`);
    };

    const matchColor = (status: string) => {
        if (status === "PENDING") {
            return "info";
        } else if (status === "ACCEPTED") {
            return "white";
        } else if (status === "SUBMITTED") {
            return "success";
        } else if (status === "REJECTED") {
            return "error";
        } else {
            return "grey";
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
                                   reviewId: number
                               },
                               index: number) => (
                        <div key={request.id}>
                            <ListItemButton
                                disabled={request.status !== "SUBMITTED"}
                                onClick={() => handleClick(request.reviewId)}
                                color={matchColor(request.status)}
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
