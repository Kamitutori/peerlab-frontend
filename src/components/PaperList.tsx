import { useQuery } from "@tanstack/react-query";
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
import { useNavigate } from "react-router-dom";
import { useUpdateAuth } from "./auth/AuthenticationContext.tsx";
import { useAlertDialog } from "./AlertDialogProvider.tsx";

interface Paper {
    id: number;
    title: string;
    owner: {
        name: string;
    };
    reviewCount: number;
    reviewLimit: number;
}

/** The props for the list of papers; the title of the list and the endpoint to fetch its data from. */
export interface ListProps {
    endpoint: string;
    title: string;
    filter?: (paper: Paper) => boolean;
}

export default function PaperList({ endpoint, title, filter }: ListProps) {
    const { showAlert } = useAlertDialog();
    const { logout } = useUpdateAuth();
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery<Paper[]>({
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
                throw new Error("Failed to fetch papers.");
            }
            return await res.json();
        }
    });

    const filteredData = data ? (filter ? data.filter(filter) : data) : [];

    const handleClick = (paperId: number) => {
        navigate(`/paper/${paperId}`);
    };

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
            <CardContent sx={{ minWidth: 600, maxHeight: 400, overflow: 'hidden', padding: 0 }}>
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
                    <Typography>Loading papers...</Typography>
                ) : error ? (
                    <Typography color="error">Failed to load papers.</Typography>
                ) : (
                    <List sx={{ maxHeight: 353, overflow: 'auto' }}>
                        {filteredData.map((paper: Paper, index: number) => (
                            <div key={paper.id}>
                                <ListItemButton
                                    onClick={() => handleClick(paper.id)}
                                    sx={{
                                        borderRadius: 2,
                                        "&:hover": {
                                            backgroundColor: "background.paper",
                                        },
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ArticleIcon sx={{ color: 'background.default' }} />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={paper.title}
                                        secondary={`Author: ${paper.owner.name}`}
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
                                {index < filteredData.length - 1 && <Divider sx={{ backgroundColor: "grey" }} />}
                            </div>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
}