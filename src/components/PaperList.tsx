import * as React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import ArticleIcon from '@mui/icons-material/Article';
import {useQuery} from "@tanstack/react-query";

function generate(element: React.ReactElement<unknown>) {
    return [0, 1, 2].map((value) =>
        React.cloneElement(element, {
            key: value,
        }),
    );
}

const Demo = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.background.paper,
}));

export default function PaperList() {
    useQuery({
        queryKey: ["paper"],
        queryFn: async () => {
            const res = await fetch(
                `https://my-json-server.typicode.com/kamitutori/peerlab-frontend/paperList`);
            return (await res.json());
        }
    });
    return (
        <Box sx={{flexGrow: 1, maxWidth: 752}}>
            <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                My Papers
            </Typography>
            <Demo>
                {generate(
                    <ListItem
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete">
                                <DeleteIcon/>
                            </IconButton>
                        }
                    >
                        <ListItemAvatar>
                            <Avatar>
                                <ArticleIcon/>
                            </Avatar>
                        </ListItemAvatar>
                    </ListItem>,
                )}
            </Demo>
        </Box>
    );
}