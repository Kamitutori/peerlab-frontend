// TODO number of review files may be limited to 5
// TODO whether score is disabled has to be set accordingly to the internal/external value (which is not typical for a review to know)
import React, {useEffect, useRef, useState} from 'react';
import {
    Box,
    Button,
    Checkbox, FormControl,
    FormControlLabel,
    Grid2,
    IconButton, InputLabel, MenuItem,
    Paper,
    Radio,
    RadioGroup, Select, SelectChangeEvent,
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
import {Label} from "@mui/icons-material";

// Define a type for the reviewer
interface Reviewer {
    id: string;
    name: string;
    email: string;
}

interface ReviewFormProps {
    initialData?: any;
    onSubmit: (data: any) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({initialData = {}}) => {
    const [title, setTitle] = useState(initialData.title || '');
    const [authors, setAuthors] = useState(initialData.authors || '');
    const [maxReviews, setMaxReviews] = useState(initialData.maxReviews || '');

    const [internal, setInternal] = useState(initialData.internal || 'internal');
    const [authorsNote, setAuthorsNote] = useState(initialData.authorsNote || '');
    const [files, setFiles] = useState<File[]>([]);
    const [warning, setWarning] = useState('');
    const [reviewers, setReviewers] = useState<Reviewer[]>([]);
    const [requests, setRequests] = useState<string[]>(initialData.requests || []);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [summary, setSummary] = useState(initialData.summary || '');
    const [strengths, setStrengths] = useState(initialData.strengths || '');
    const [weaknesses, setWeaknesses] = useState(initialData.weaknesses || '');
    const [comments, setComments] = useState(initialData.comments || '');
    const [questions, setQuestions] = useState(initialData.questions || '');
    const [score, setScore] = useState(initialData.score || '');

    const [confidenceLevel, setConfidenceLevel] = useState(initialData.confidenceLevel || '');
    const [fileIds, setFileIds] = useState(initialData.fileIds || Array(5).fill(null));
    const [isExternal] = useState(!initialData.isInternal || false);

    const [minScore] = useState(initialData.minScore || '');
    const [maxScore] = useState(initialData.maxScore || '');

    const confidenceLevels = ['High', 'Medium', 'Low'];
    const handleConfidenceLevel = (event: SelectChangeEvent) => {
        setConfidenceLevel(event.target.value as string);
    };
    // TODO review code from here..
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

        setWarning('');

        // Retrieve the user information from local storage
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
            abstractText: authorsNote,
            authorsNote,
            reviewLimit: maxReviewsNum,
            minScore: minScoreNum,
            maxScore: maxScoreNum,
            fileId: "1", // Replace with actual file ID
            active: true,
            internal: internal === 'internal',
            requests: requests.map(requesteeId => {
                const reviewer = reviewers.find(reviewer => reviewer.id === requesteeId);
                return {
                    status: "PENDING",
                    paper: {id: 0}, // Replace with actual paper ID if available
                    requestee: {
                        id: requesteeId,
                        name: reviewer?.name || "",
                        email: reviewer?.email || ""
                    }
                };
            })
        };

        try {
            const response = await fetch('http://localhost:8080/api/papers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(paperData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.text();
            if (result) {
                console.log('Success:', JSON.parse(result));
            } else {
                console.log('Success: No content returned');
            }
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

    // TODO ... til here
    return (
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", width: "100%"}}>
            <Paper sx={{width: '100%', padding: 4, backgroundColor: 'background.paper', boxShadow: 3, marginTop: 10,}}>
                <Typography variant="h4" component="h1" sx={{color: 'white'}} fontWeight={"bold"}>
                    {initialData.title ? 'Edit Review' : 'Add Review'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid2 container spacing={1} sx={{maxWidth: "800px"}}>
                        <CustomTextField
                            required
                            label="Summary"
                            value={summary}
                            multiline
                            rows={5.4}
                            onChange={(e) => setSummary(e.target.value)}
                        />
                        <Grid2 gap={2} sx={{display: 'flex', flexDirection: 'row', width: "100%",}}>
                            <CustomTextField
                                required
                                label="Strenghts"
                                value={strengths}
                                multiline
                                rows={9.4}
                                onChange={(e) => setStrengths(e.target.value)}
                            />
                            <CustomTextField
                                required
                                label="Weaknesses"
                                value={weaknesses}
                                multiline
                                rows={9.4}
                                onChange={(e) => setWeaknesses(e.target.value)}
                            />
                        </Grid2>
                        <Grid2 gap={2} sx={{display: 'flex', flexDirection: 'row', width: "100%"}}>
                            <CustomTextField
                                required
                                label="Comments"
                                value={comments}
                                multiline
                                rows={5.4}
                                onChange={(e) => setComments(e.target.value)}
                            />
                            <CustomTextField
                                required
                                label="Questions"
                                value={questions}
                                multiline
                                rows={5.4}
                                onChange={(e) => setQuestions(e.target.value)}
                            />
                        </Grid2>
                        <Box sx={{display: "flex", alignItems: "center", gap: 2, width: "100%"}}>
                            <FormControl sx={{minWidth: "150px", flexGrow: 1}}>
                                <InputLabel id="confidence-level-label">Confidence Level</InputLabel>
                                <Select
                                    labelId="confidence-level-label"
                                    id="confidence-level-select"
                                    label="Confidence Level"
                                    value={confidenceLevel}
                                    onChange={handleConfidenceLevel}
                                    sx={{width: "30%"}}
                                >
                                    {confidenceLevels.map((level) => (
                                        <MenuItem key={level} value={level}>
                                            {level}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {isExternal && (
                                <>
                                    <CustomTextField
                                        sx={{width: "150px"}}
                                        required
                                        label="Score"
                                        value={score}
                                        onChange={(e) => setScore(e.target.value)}
                                    />
                                    <Typography sx={{whiteSpace: "nowrap"}}>
                                        {`∈ [${minScore || 1}, ${maxScore || 5}]`}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </Grid2>

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
        </Box>
    );
};

export default ReviewForm;
