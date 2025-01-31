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

interface ReviewListProps {
    endpoint: string;
    title: string;
}

export default function ReviewList({endpoint, title}: ReviewListProps) {
    const {logout} = useUpdateAuth();
    const navigate = useNavigate();
    const {data, isLoading, error} = useQuery({
        queryKey: [endpoint],
        queryFn: async () => {
            const res = await fetch(endpoint);
            if (res.status === 401) {
                logout();
            }
            if (!res.ok) throw new Error("Failed to fetch reviews");
            return res.json();
        },
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
                        padding: '8px 16px',
                        width: '100%',
                    }}
                >
                    {title}
                </Typography>
                {isLoading ? (
                    <Typography sx={{ color: "white" }}>Loading reviews...</Typography>
                ) : error ? (
                    <Typography color="error">Failed to load reviews.</Typography>
                ) : (
                    <List sx={{ maxHeight: 353, overflow: 'auto' }}>
                        {data.map((review: { id: number; paperName: string; authorName: string }, index: number) => (
                            <div key={review.id}>
                                <ListItemButton
                                    onClick={() => handleClick(review.id)}
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
                                        primary={review.paperName}
                                        secondary={`Author: ${review.authorName}`}
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