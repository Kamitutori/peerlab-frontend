import React, {useEffect, useRef, useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid2,
    IconButton,
    Paper,
    Radio,
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import {useDropzone} from 'react-dropzone';
import CustomTextField from '../components/CustomTextField';
import CloseIcon from '@mui/icons-material/Close';

// Define a type for the reviewer
interface Reviewer {
    id: string;
    name: string;
    email: string;
}

export default function AddPaperPage() {
    const [title, setTitle] = useState('');
    const [authors, setAuthors] = useState('');
    const [maxReviews, setMaxReviews] = useState('');
    const [minScore, setMinScore] = useState('');
    const [maxScore, setMaxScore] = useState('');
    const [internal, setInternal] = useState('internal');
    const [authorsNote, setAuthorsNote] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [warning, setWarning] = useState('');
    const [reviewers, setReviewers] = useState<Reviewer[]>([]);
    const [requests, setRequests] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Fetch reviewers from an API
        fetch('https://my-json-server.typicode.com/kamitutori/peerlab-frontend/userList')
            .then(response => response.json())
            .then(data => setReviewers(data))
            .catch(error => console.error('Error fetching reviewers:', error));
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const minScoreNum = parseInt(minScore);
        const maxScoreNum = parseInt(maxScore);
        const maxReviewsNum = parseInt(maxReviews);

        if (isNaN(minScoreNum) || isNaN(maxScoreNum) || minScoreNum >= maxScoreNum) {
            if (internal === 'external') {
                setWarning('Please enter valid scores. The maximum score must be higher than the minimum score.');
                return;
            }
        }

        if (isNaN(maxReviewsNum)) {
            setWarning('Please enter a valid number for the maximum number of reviews.');
            return;
        }

        // if (files.length === 0) {
        //     setWarning('Please upload a file.');
        //     return;
        // }

        setWarning('');
        const paperData = {
            title,
            authors,
            reviewLimit: maxScoreNum,
            minScore: minScoreNum,
            maxScore: maxScoreNum,
            internal,
            authorsNote,
            //files,
            requests: requests.map(requesteeId => {
                const reviewer = reviewers.find(reviewer => reviewer.id === requesteeId);
                return {
                    status: "PENDING",
                    paper: { id: 0 }, // Replace with actual paper ID if available
                    requestee: {
                        id: requesteeId,
                        name: reviewer?.name || "",
                        email: reviewer?.email || ""
                    }
                };
            })
        };

        try {
            console.log(requests);
            const response = await fetch('http://localhost:8080/api/papers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(paperData)
            });

            const result = await response.json();
            console.log('Success:', result);
            // Handle success (e.g., show a success message, redirect, etc.)
        } catch (error) {
            console.error('Error:', error);
            // Handle error (e.g., show an error message)
        }
    };

    const onDrop = (acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
    };

    const {getRootProps, getInputProps} = useDropzone({onDrop});

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleRemoveFile = () => {
        setFiles([]);
    };

    const handleReviewerChange = (reviewerId: string) => {
        setRequests(prevSelected =>
            prevSelected.includes(reviewerId)
                ? prevSelected.filter(id => id !== reviewerId)
                : [...prevSelected, reviewerId]
        );
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setRequests(reviewers.map(reviewer => reviewer.id));
        } else {
            setRequests([]);
        }
    };

    return (
        <Paper sx={{width: '100%', padding: 4, backgroundColor: 'background.paper', boxShadow: 3, marginTop: 10}}>
            <Typography variant="h4" component="h1" sx={{color: 'white'}} fontWeight={"bold"}>
                Add Paper
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2}>
                    <Grid2
                        sx={{display: 'flex', flexDirection: 'column'}}
                    >
                        <CustomTextField
                            required
                            label="Paper name"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <CustomTextField
                            required
                            label="Authors/Conference"
                            value={authors}
                            onChange={(e) => setAuthors(e.target.value)}
                        />
                        <CustomTextField
                            required
                            label="Maximum number of reviews"
                            value={maxReviews}
                            onChange={(e) => setMaxReviews(e.target.value)}
                        />
                        <Grid2 container spacing={2}>
                            <Grid2>
                                <CustomTextField
                                    required
                                    label="Minimum score"
                                    value={minScore}
                                    onChange={(e) => setMinScore(e.target.value)}
                                    disabled={internal === 'internal'}
                                />
                            </Grid2>
                            <Grid2>
                                <CustomTextField
                                    required
                                    label="Maximum score"
                                    value={maxScore}
                                    onChange={(e) => setMaxScore(e.target.value)}
                                    disabled={internal === 'internal'}
                                />
                            </Grid2>
                        </Grid2>
                    </Grid2>
                    <Grid2>
                        <CustomTextField
                            label="Authors note"
                            value={authorsNote}
                            onChange={(e) => setAuthorsNote(e.target.value)}
                            multiline
                            rows={9.4}
                            sx={{width: '130%'}}
                        />
                    </Grid2>
                </Grid2>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <RadioGroup
                        row
                        value={internal}
                        onChange={(e) => setInternal(e.target.value)}
                    >
                        <FormControlLabel
                            value="internal"
                            control={<Radio/>}
                            label="Internal"
                            sx={{color: 'primary'}}
                        />
                        <FormControlLabel
                            value="external"
                            control={<Radio/>}
                            label="External"
                            sx={{color: 'primary'}}
                        />
                    </RadioGroup>
                </Box>
                {files.length === 0 ? (
                    <Box {...getRootProps()}
                         sx={{
                             border: '2px dashed grey',
                             padding: 4,
                             textAlign: 'center',
                             marginTop: 2
                         }}>
                        <input {...getInputProps()} />
                        <Typography sx={{color: 'primary'}}>
                            Drag & drop some files here, or click to select files
                        </Typography>
                        <Button variant="contained" color="secondary" onClick={handleUploadClick} sx={{mt: 2}}>
                            Upload File
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{display: 'flex', alignItems: 'center', marginTop: 2}}>
                        <Typography sx={{color: 'primary', fontWeight: 'bold'}}>
                            Uploaded file: {files[0].name}
                        </Typography>
                        <IconButton onClick={handleRemoveFile} sx={{ml: 1}}>
                            <CloseIcon/>
                        </IconButton>
                    </Box>
                )}
                <input
                    type="file"
                    accept={'.pdf'}
                    ref={fileInputRef}
                    style={{display: 'none'}}
                    onChange={(e) => {
                        if (e.target.files) {
                            setFiles(Array.from(e.target.files));
                        }
                    }}
                />
                <TableContainer component={Paper} sx={{marginTop: 4}}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Request review from:</TableCell>
                                <TableCell
                                    align="right"
                                    sx={{
                                        position: 'sticky',
                                        top: 0,
                                        backgroundColor: 'background',
                                        zIndex: 1
                                    }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            flexDirection: 'row-reverse'
                                        }}>
                                        <Checkbox
                                            checked={requests.length === reviewers.length}
                                            indeterminate={requests.length > 0 && requests.length < reviewers.length}
                                            onChange={handleSelectAll}
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{mr: 1}}
                                        >
                                            Select all
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </TableContainer>
                <TableContainer component={Paper} sx={{maxHeight: 350, overflow: 'auto'}}>
                    <Table>
                        <TableBody>
                            {reviewers.map((reviewer) => (
                                <TableRow key={reviewer.id} sx={{height: 40}}>
                                    <TableCell>{reviewer.name}</TableCell>
                                    <TableCell align="right">
                                        <Checkbox
                                            checked={requests.includes(reviewer.id)}
                                            onChange={() => handleReviewerChange(reviewer.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {warning && (
                    <Typography color="error" sx={{mt: 2}}>
                        {warning}
                    </Typography>
                )}
                <Button type="submit" variant="contained" color="primary" sx={{mt: 2}}>
                    Submit
                </Button>
            </form>
        </Paper>
    );
}