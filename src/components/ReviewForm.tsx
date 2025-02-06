import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    Grid2,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Typography
} from '@mui/material';
import CustomTextField from './CustomTextField';
import CloseIcon from '@mui/icons-material/Close';
import { useAlertDialog } from '../utils/alertDialogUtils.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// Define types for the props and data
interface ReviewFormProps {
    initialData?: ReviewData;
}

interface ReviewData {
    id?: string;
    request: RequestData;
    fileIds: string[];
    summary: string;
    strengths: string;
    weaknesses: string;
    comments: string;
    questions: string;
    score: number;
    confidenceLevel: string;
    submissionDate: string;
}

interface Reviewer {
    id: string;
}

interface RequestData {
    paperId: string;
    requestee: Reviewer;
}

interface PaperData {
    id: string;
    title: string;
    authors: string;
    reviewLimit: number;
    minScore: number;
    maxScore: number;
    isInternal: boolean;
    authorsNote: string;
    abstractText: string;
    requests: string[];
    fileId: string;
}

// Main ReviewForm component
const ReviewForm: React.FC<ReviewFormProps> = ({ initialData = {} as ReviewData }) => {
    // Constants for cancel review alert
    const CANCEL_REVIEW_ALERT_TITLE = "Cancel Review";
    const CANCEL_REVIEW_ALERT_MESSAGE = "Are you sure you want to cancel writing this review? All inputs will be discarded.";
    const CANCEL_REVIEW_ALERT_OK_TEXT = "Confirm";
    const CANCEL_REVIEW_ALERT_CANCEL_TEXT = "Cancel";

    // State hooks for form data and file uploads
    const [files, setFiles] = useState<File[]>([]);
    const [summary, setSummary] = useState(initialData.summary || '');
    const [strengths, setStrengths] = useState(initialData.strengths || '');
    const [weaknesses, setWeaknesses] = useState(initialData.weaknesses || '');
    const [comments, setComments] = useState(initialData.comments || '');
    const [questions, setQuestions] = useState(initialData.questions || '');
    const [score, setScore] = useState(initialData.score || '');
    const [confidenceLevel, setConfidenceLevel] = useState(initialData.confidenceLevel || '');
    const [warning, setWarning] = useState('');
    const [isTextRequired, setIsTextRequired] = useState(true);

    // Refs and parameters
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { id } = useParams<{ id: string }>();
    const { showAlert } = useAlertDialog();
    const navigate = useNavigate();
    let [request] = useState<RequestData | null>(null);
    let [isExternal] = useState(false);
    let [minScore] = useState<number>(NaN);
    let [maxScore] = useState<number>(NaN);

    // Check if files are added to the review
    useEffect(() => {
        setIsTextRequired(files.length === 0);
    }, [files]);

    // Fetch request data for the review
    const {
        isPending: isRequestPending,
        isError: isRequestError,
        error: requestError,
        data: requestData
    } = useQuery({
        queryKey: ["request", id],
        queryFn: async () => {
            const res = await fetch(`http://localhost:8080/api/requests/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                }
            });
            if (!res.ok) throw new Error("Failed to fetch request");
            return res.json();
        }
    });

    // Set request data for later use
    initialData.request = requestData;
    request = requestData;

    // Fetch paper data from the reviewed paper
    const [paperData, setPaperData] = useState<PaperData | null>(null);
    useEffect(() => {
        if (requestData) {
            const paperId = requestData.paperId;
            const fetchPaperData = async () => {
                try {
                    const res = await fetch(`http://localhost:8080/api/papers/${paperId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
                        },
                    });
                    if (!res.ok) throw new Error('Failed to fetch paper');
                    const data = await res.json();
                    setPaperData(data);
                } catch (error) {
                    console.error('Error fetching paper:', error);
                }
            };

            fetchPaperData();
        }
    }, [requestData]);

    // Loading states for request and paper data
    if (isRequestPending) {
        return <span>Loading request...</span>;
    }
    if (isRequestError) {
        return <span>{`Error!: ${requestError.message}`}</span>;
    }

    if (!paperData) {
        return <span>Loading paper...</span>;
    }

    const paperObject: PaperData = paperData;
    // Setting the relevant paper information
    isExternal = !paperObject.isInternal;
    minScore = paperObject.minScore;
    maxScore = paperObject.maxScore;

    // Confidence level selection
    const confidenceLevels = ['High', 'Medium', 'Low'];
    const handleConfidenceLevel = (event: SelectChangeEvent) => {
        setConfidenceLevel(event.target.value as string);
    };

    /** Handles the submission of the review */
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        let scoreNum;
        if (typeof score === "string") {
            scoreNum = parseInt(score);
        } else {
            scoreNum = score;
        }

        // Validate the score for external papers
        if (isExternal) {
            if (isNaN(scoreNum) || scoreNum < minScore || scoreNum > maxScore) {
                setWarning('Please enter a valid score.');
                return;
            }
        }

        setWarning('');
        // Creates file IDs in minio server
        const fileIds: string[] = [];
        if (!isTextRequired) {
            for (const file of files) {
                try {
                    const uploadResponse = await fetch(`http://localhost:8080/api/minio/review-upload-url?fileName=${file.name}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                        }
                    });

                    const { uploadUrl, fileId: newFileId } = await uploadResponse.json();

                    await fetch(uploadUrl, {
                        method: "PUT",
                        body: file,
                        headers: {
                            "Content-Type": file.type
                        }
                    });

                    fileIds.push(newFileId);
                } catch (error) {
                    console.error("Error uploading file:", error);
                    setWarning('Error uploading file(s).');
                    return;
                }
            }
        }

        const reviewData = {
            summary: summary,
            strengths: strengths,
            weaknesses: weaknesses,
            comments: comments,
            confidenceLevel: confidenceLevel,
            score: score,
            fileIds: fileIds,
            submissionDate: new Date().toISOString(),
            request: request
        };

        // Submit the review data to the AP
        try {
            const response = await fetch(`http://localhost:8080/api/reviews${initialData.id ? `/${initialData.id}` : ''}`, {
                method: initialData.id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(reviewData)
            });
            const reviewResponse = await response.json();
            console.log('Success:', reviewResponse);
            navigate(`/review/${reviewResponse.id}`);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Handle file upload click
    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handle file removal
    const handleRemoveFile = (fileName: string) => {
        setFiles(files.filter(file => file.name !== fileName));
    };

    /** Handles the cancellation of the review */
    const handleCancel = async () => {
        const hasCanceled = await showAlert(CANCEL_REVIEW_ALERT_TITLE, CANCEL_REVIEW_ALERT_MESSAGE, CANCEL_REVIEW_ALERT_OK_TEXT, CANCEL_REVIEW_ALERT_CANCEL_TEXT);
        if (hasCanceled) {
            navigate(-1);
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", width: "100%" }}>
            <Paper sx={{ width: '100%', padding: 4, backgroundColor: 'background.paper', boxShadow: 3, marginTop: 10 }}>
                {/* Edit Review Page or Add Review Page */}
                <Typography variant="h4" component="h1" fontWeight={"bold"}>
                    {initialData.id ? 'Edit Review' : 'Add Review'}
                </Typography>

                {/* Review Form */}
                <form onSubmit={handleSubmit}>
                    <Grid2 container spacing={1} sx={{ maxWidth: "800px" }}>
                        {/* Summary text field */}
                        <CustomTextField
                            required={isTextRequired}
                            label="Summary"
                            value={summary}
                            multiline
                            rows={5.4}
                            onChange={(e) => setSummary(e.target.value)}
                        />
                        <Grid2 gap={2} sx={{ display: 'flex', flexDirection: 'row', width: "100%" }}>
                            {/* Strengths text field */}
                            <CustomTextField
                                required={isTextRequired}
                                label="Strenghts"
                                value={strengths}
                                multiline
                                rows={9.4}
                                onChange={(e) => setStrengths(e.target.value)}
                            />
                            {/* Weaknesses text field */}
                            <CustomTextField
                                required={isTextRequired}
                                label="Weaknesses"
                                value={weaknesses}
                                multiline
                                rows={9.4}
                                onChange={(e) => setWeaknesses(e.target.value)}
                            />
                        </Grid2>
                        <Grid2 gap={2} sx={{ display: 'flex', flexDirection: 'row', width: "100%" }}>
                            {/* Comments text field */}
                            <CustomTextField
                                required={isTextRequired}
                                label="Comments"
                                value={comments}
                                multiline
                                rows={5.4}
                                onChange={(e) => setComments(e.target.value)}
                            />
                            {/* Questions text field */}
                            <CustomTextField
                                required={isTextRequired}
                                label="Questions"
                                value={questions}
                                multiline
                                rows={5.4}
                                onChange={(e) => setQuestions(e.target.value)}
                            />
                        </Grid2>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                            {/* Confidence Level Dropdown */}
                            <FormControl required sx={{ minWidth: "175px", flexGrow: 1 }}>
                                <InputLabel id="confidence-level-label">Confidence Level</InputLabel>
                                <Select
                                    required={true}
                                    labelId="confidence-level-label"
                                    id="confidence-level-select"
                                    label="Confidence Level *"
                                    value={confidenceLevel}
                                    onChange={handleConfidenceLevel}
                                    sx={{ width: "33%" }}
                                >
                                    {confidenceLevels.map((level) => (
                                        <MenuItem key={level} value={level}>
                                            {level}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {/* Score Input if external */}
                            {isExternal && (
                                <>
                                    <CustomTextField
                                        sx={{ width: "150px" }}
                                        required={isExternal}
                                        label="Score"
                                        value={score}
                                        onChange={(e) => setScore(e.target.value)}
                                    />
                                    <Typography sx={{ whiteSpace: "nowrap" }}>
                                        {`∈ [${minScore}, ${maxScore}]`}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </Grid2>

                    {/* File Upload */}
                    <Box
                        sx={{
                            border: '2px dashed grey',
                            padding: 4,
                            textAlign: 'center',
                            marginTop: 2
                        }}>
                        <input
                            type="file"
                            accept={'.pdf'}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                if (e.target.files) {
                                    const newFiles = Array.from(e.target.files).filter(file => {
                                        const existingFileIndex = files.findIndex(existingFile => existingFile.name === file.name);
                                        if (existingFileIndex !== -1) {
                                            files[existingFileIndex] = file;
                                            return false;
                                        }
                                        return true;
                                    });
                                    setFiles(prevFiles => [...prevFiles, ...newFiles]);
                                }
                            }}
                            multiple
                        />
                        <Typography sx={{ color: 'primary' }}>
                            Drag & drop some files here, or click to select files
                        </Typography>

                        {/* File Upload Button */}
                        <Button variant="contained" color="secondary" onClick={handleUploadClick} sx={{ mt: 2 }}>
                            Upload File
                        </Button>
                    </Box>

                    {/* File List */}
                    {files.length > 0 && (
                        <Box sx={{ marginTop: 2 }}>
                            {files.map(file => (
                                <Box key={file.name} sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                                    <Typography sx={{ color: 'primary', fontWeight: 'bold' }}>
                                        {file.name}
                                    </Typography>
                                    <IconButton onClick={() => handleRemoveFile(file.name)} sx={{ ml: 1 }}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {warning && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {warning}
                        </Typography>
                    )}

                    <Typography sx={{ mt: 2, color: 'gray', fontSize: '0.875rem' }}>
                        To submit your review, either fill in all text fields or upload at least one review file.
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>

                        {/* Submit Button */}
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                            Submit
                        </Button>

                        {/* Cancel Button */}
                        <Button variant="outlined" color="error" onClick={handleCancel} sx={{ mt: 2 }}>
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default ReviewForm;