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
import { useNavigate } from "react-router-dom";

interface PaperListProps {
    endpoint: string;
    title: string;
}

export default function PaperList({endpoint, title}: PaperListProps) {
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
            if (!res.ok) throw new Error("Failed to fetch papers");
            return res.json();
        },
    });

    const navigate = useNavigate();

    const handleClick = (paperId: number) => {
        navigate(`/paper/${paperId}`);
    };

    return (
        <Card
            sx={{
                margin: "auto",
                mt: 4,
                boxShadow: 3,
                backgroundColor: "background.paper",
            }}
        >
            <CardContent sx={{ maxHeight: 400, overflow: 'hidden', padding: 0 }}>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        color: "white",
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
                    <Typography sx={{ color: "white" }}>Loading papers...</Typography>
                ) : error ? (
                    <Typography color="error">Failed to load papers.</Typography>
                ) : (
                    <List sx={{ maxHeight: 353, overflow: 'auto' }}>
                        {data.map((paper: { id: number; title: string; ownerName: string }, index: number) => (
                            <div key={paper.id}>
                                <ListItemButton
                                    onClick={() => handleClick(paper.id)}
                                    sx={{
                                        borderRadius: 2,
                                        "&:hover": {
                                            backgroundColor: "#353535",
                                        },
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ArticleIcon sx={{color: 'primary.main'}}/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={paper.title}
                                        secondary={`Author: ${paper.ownerName}`}
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