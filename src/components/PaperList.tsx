import {useQuery} from "@tanstack/react-query"; // Make sure react-query is installed
import {Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography,} from "@mui/material";
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

    if (isLoading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error">Failed to load papers.</Typography>;
    }

    return (
        <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                My Papers
            </Typography>
            <List>
                {data.map((paper: { id: number; title: string; ownerName: string }) => (
                    <ListItem
                        key={paper.id}
                    >
                        <ListItemAvatar>
                            <Avatar>
                                <ArticleIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={paper.title}
                            secondary={`Author: ${paper.ownerName}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
