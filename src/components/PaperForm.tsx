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
import CustomTextField from './CustomTextField';
import CloseIcon from '@mui/icons-material/Close';
// import {useNavigate} from "react-router-dom";

interface Reviewer {
    id: string;
    name: string;
    email: string;
}

export interface PaperData {
    id?: string;
    title: string;
    authors: string;
    reviewLimit: number;
    minScore: number;
    maxScore: number;
    internal: boolean;
    authorsNote: string;
    abstractText: string;
    requests: string[];
}

interface PaperFormProps {
    initialData?: PaperData;
    onSubmit: (data: PaperData) => void;
    fetchReviewersUrl: string;
}

const PaperForm: React.FC<PaperFormProps> = ({initialData = {} as PaperData, fetchReviewersUrl}) => {
    const [title, setTitle] = useState(initialData.title || '');
    const [authors, setAuthors] = useState(initialData.authors || '');
    const [reviewLimit, setReviewLimit] = useState(initialData.reviewLimit || '');
    const [minScore, setMinScore] = useState(initialData.minScore || '');
    const [maxScore, setMaxScore] = useState(initialData.maxScore || '');
    const [internal, setInternal] = useState(initialData.internal !== undefined ? (initialData.internal ? 'internal' : 'external') : 'internal');
    const [authorsNote, setAuthorsNote] = useState(initialData.authorsNote || '');
    const [abstractText, setAbstractText] = useState(initialData.abstractText || '');
    const [files, setFiles] = useState<File[]>([]);
    const [warning, setWarning] = useState('');
    const [reviewers, setReviewers] = useState<Reviewer[]>([]);
    const [requests, setRequests] = useState<string[]>(initialData.requests || []);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch(fetchReviewersUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
            .then(response => response.json())
            .then(data => setReviewers(data))
            .catch(error => console.error('Error fetching reviewers:', error));
    }, [fetchReviewersUrl]);

    useEffect(() => {
        if (internal === 'internal') {
            setMinScore('');
            setMaxScore('');
        }
    }, [internal]);

    // const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const minScoreNumber = Number(minScore);
        const maxScoreNumber = Number(maxScore);
        const reviewLimitNumber = Number(reviewLimit);

        if (internal === 'external' && (isNaN(minScoreNumber) || isNaN(maxScoreNumber) || minScoreNumber >= maxScoreNumber)) {
            setWarning('Please enter valid scores. The maximum score must be higher than the minimum score.');
            return;
        }
        if (isNaN(reviewLimitNumber) || reviewLimitNumber <= 0) {
            setWarning('Please enter a valid number for the maximum number of reviews.');
            return;
        }

        if (!reviewLimit) {
            setWarning('Please enter a valid number for the maximum number of reviews.');
            return;
        }

        setWarning('');

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user || !user.id) {
            setWarning('User is not logged in.');
            return;
        }

        const owner = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        const uploadDate = new Date().toISOString();

        const paperData = {
            title,
            owner,
            uploadDate,
            authors,
            authorsNote,
            abstractText,
            reviewLimit,
            minScore: minScoreNumber,
            maxScore: maxScoreNumber,
            fileId: "1",
            active: true,
            internal: internal === 'internal',
            requests: requests.map(requesteeId => {
                const reviewer = reviewers.find(reviewer => reviewer.id === requesteeId);
                return {
                    status: "PENDING",
                    paper: {id: 0},
                    requestee: {
                        id: requesteeId,
                        name: reviewer?.name || "",
                        email: reviewer?.email || ""
                    }
                };
            })
        };

        try {
            const response = await fetch(`http://localhost:8080/api/papers${initialData.id ? `/${initialData.id}` : ''}`, {
                method: initialData.id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(paperData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Success:', result);
            // TODO wait for backend to send id of result
            // navigate(`/paper/${result.id}`);
        } catch (error) {
            console.error('Error:', error);
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
                {initialData.title ? 'Edit Paper' : 'Add Paper'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2}>
                    <Grid2 sx={{display: 'flex', flexDirection: 'column'}}>
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
                            value={reviewLimit}
                            onChange={(e) => setReviewLimit(e.target.value)}
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
                <CustomTextField
                    label="Abstract Text"
                    value={abstractText}
                    onChange={(e) => setAbstractText(e.target.value)}
                    multiline
                    rows={4}
                    sx={{width: '100%', marginTop: 2}}
                />
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
};

export default PaperForm;