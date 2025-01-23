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
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";

export default function PaperList() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["paper"],
        queryFn: async () => {
            const res = await fetch(
                `https://my-json-server.typicode.com/kamitutori/peerlab-frontend/paperList`
            );
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
                maxWidth: 800,
                margin: "auto",
                mt: 4,
                boxShadow: 3,
            }}
        >
            <CardContent>
                <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                    My Papers
                </Typography>
                {isLoading ? (
                    <Typography>Loading papers...</Typography>
                ) : error ? (
                    <Typography color="error">Failed to load papers.</Typography>
                ) : (
                    <List>
                        {data.map((paper: { id: number; title: string; ownerName: string }) => (
                            <ListItemButton
                                key={paper.id}
                                onClick={() => handleClick(paper.id)}
                                sx={{
                                    borderRadius: 2,
                                    "&:hover": {
                                        backgroundColor: "#e3f2fd",
                                    },
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <ArticleIcon />
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
                                                maxWidth: "200px",
                                            },
                                        },
                                        secondary: {
                                            sx: {
                                                fontSize: "0.75rem",
                                            },
                                        }
                                    }}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
}
