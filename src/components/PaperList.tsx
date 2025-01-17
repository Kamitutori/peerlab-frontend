import {ListItem, ListItemButton, ListItemText} from "@mui/material";
import {FixedSizeList, ListChildComponentProps} from 'react-window';
import Box from "@mui/material/Box";

export interface PaperListEntry {
    id: number;
    title: string;
    ownerName: string;
    authors: string;
}

export default function VirtualizedPaperList() {

    function renderRow(props: ListChildComponentProps) {
        const {index, style} = props;

        return (
            <ListItem style={style} key={index} component="div" disablePadding>
                <ListItemButton>
                    <ListItemText
                        primary={`paper_title_${index + 1}`/*` Item ` */}
                        secondary={'author'}
                    />
                </ListItemButton>
            </ListItem>

        );
    }

    return (
        <div>
            <h2>PaperList</h2>
            <Box
                sx={{width: '100%', height: 400, maxWidth: 360, bgcolor: '#555'}}
            >
                <FixedSizeList
                    height={400}
                    width={360}
                    itemSize={46}
                    itemCount={200}
                    overscanCount={5}
                >
                    {renderRow}
                </FixedSizeList>

                {/*
                <List
                    height={400}
                    width={360}
                    itemSize={46}
                >
                    {renderRow}
                </List>
                */}
            </Box>

        </div>
    )
}

