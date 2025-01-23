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

interface PaperListProps {
    endpoint: string;
    title: string;
}

export default function PaperList({endpoint, title}: PaperListProps) {
    const {data, isLoading, error} = useQuery({
        queryKey: [endpoint],
        queryFn: async () => {
            const res = await fetch(endpoint);
            if (!res.ok) throw new Error("Failed to fetch papers");
            return res.json();
        },
    });

    const handleClick = (paperId: number) => {
        console.log(`Clicked on paper with ID: ${paperId}`);
    };

    return (
        <Card
            sx={{
                margin: "auto",
                mt: 4,
                boxShadow: 3,
                backgroundColor: "#504e4e",
            }}
        >
            <CardContent sx={{ maxHeight: 400, overflow: 'hidden', padding: 0 }}>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        mb: 2,
                        color: "white",
                        position: 'sticky',
                        top: 0,
                        backgroundColor: "#353535", // Highlight color
                        zIndex: 1,
                        padding: '8px 16px',
                        width: '100%',
                    }}
                >
                    {title}
                </Typography>
                {isLoading ? (
                    <Typography sx={{ color: "white" }}>Loading papers...</Typography>
                ) : error ? (
                    <Typography color="error">Failed to load papers.</Typography>
                ) : (
                    <List sx={{ maxHeight: 360, overflow: 'auto' }}>
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
                                            <ArticleIcon/>
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
                                                    color: "white",
                                                },
                                            },
                                            secondary: {
                                                sx: {
                                                    fontSize: "0.75rem",
                                                    color: "white",
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