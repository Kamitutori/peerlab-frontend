import React, {useEffect, useRef, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    Grid2,
    IconButton, InputLabel, MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Typography
} from '@mui/material';
import {useDropzone} from 'react-dropzone';
import CustomTextField from './CustomTextField';
import CloseIcon from '@mui/icons-material/Close';
import {useUpdateAuth} from "./auth/AuthenticationContext.tsx";
import {useAlertDialog} from "./AlertDialogProvider.tsx";
import {useNavigate} from "react-router-dom";

interface ReviewFormProps {
    initialData?: any;
    onSubmit: (data: any) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({initialData = {}}) => {
    const CANCEL_REVIEW_ALERT_TITLE = "Cancel Review";
    const CANCEL_REVIEW_ALERT_MESSAGE = "Are you sure you want to cancel writing this review? All inputs will be discarded.";
    const CANCEL_REVIEW_ALERT_OK_TEXT = "Confirm";
    const CANCEL_REVIEW_ALERT_CANCEL_TEXT = "Cancel";

    const {logout} = useUpdateAuth();
    const {showAlert} = useAlertDialog();
    const navigate = useNavigate();
    const [warning, setWarning] = useState('');

    /** Input fields of a review */
    const [summary, setSummary] = useState(initialData.summary || '');
    const [strengths, setStrengths] = useState(initialData.strengths || '');
    const [weaknesses, setWeaknesses] = useState(initialData.weaknesses || '');
    const [comments, setComments] = useState(initialData.comments || '');
    const [questions, setQuestions] = useState(initialData.questions || '');
    const [score, setScore] = useState(initialData.score || '');
    const [confidenceLevel, setConfidenceLevel] = useState(initialData.confidenceLevel || '');
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    /** Properties of the corresponding request needed for a correct submission of a review */
    const [request] = useState(initialData.request);
    const [isExternal] = useState(!initialData.isInternal);
    const [minScore] = useState(initialData.minScore);
    const [maxScore] = useState(initialData.maxScore);

    /** Checks whether the text fields have to be filled out or a file is uploaded */
    const [isTextRequired, setIsTextRequired] = useState(true);
    useEffect(() => {
        setIsTextRequired(files.length === 0);
    }, [files]);

    /** Confidence levels for the select field */
    const confidenceLevels = ['High', 'Medium', 'Low'];
    const handleConfidenceLevel = (event: SelectChangeEvent) => {
        setConfidenceLevel(event.target.value as string);
    };

    /** Handles the submission of the review */
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const scoreNum = parseInt(score);

        if (isExternal) {
            if (isNaN(scoreNum) || scoreNum < minScore || scoreNum > maxScore) {
                setWarning('Please enter a valid score.');
                return;
            }
        }

        setWarning('');

        const fileIds: string[] = [];
        for (const file of files) {
            try {
                const uploadResponse = await fetch(`http://localhost:8080/api/minio/upload-url?fileName=${file.name}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                    }
                });

                const { uploadUrl, fileId } = await uploadResponse.json();

                await fetch(uploadUrl, {
                    method: "PUT",
                    body: file,
                    headers: {
                        "Content-Type": file.type
                    }
                });

                fileIds.push(fileId);
            } catch (error) {
                console.error("Error uploading file:", error);
                setWarning('Error uploading file(s).');
                return;
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

        try {
            const response = await fetch('http://localhost:8080/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(reviewData)
            });

            if (response.ok) {
                const result = await response.text();
                if (result) {
                    console.log('Success:', JSON.parse(result));
                } else {
                    console.log('Success: No content returned');
                }
            } else if (response.status === 400) {
                setWarning(`Your inputs are invalid: ${await response.text()}`);
            } else if (response.status === 401) {
                setWarning('Your token is invalid. You are being logged out.');
                setTimeout(() => {
                    logout();
                }, 3000);
            } else {
                setWarning(`Unknown error: ${response.status} ${await response.text()}`);
            }
        } catch (error) {
            alert(`An error has occurred: ${error}`);
        }
    };

    /** These functions handle the file upload */
    const onDrop = (acceptedFiles: File[]) => {
        setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    };

    const {getRootProps, getInputProps} = useDropzone({onDrop, multiple: true});

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleRemoveFile = (fileName: string) => {
        setFiles(files.filter(file => file.name !== fileName));
    };

    /** Handles the cancellation of the review */
    const handleCancel = async () => {
        const hasCanceled = await showAlert(CANCEL_REVIEW_ALERT_TITLE, CANCEL_REVIEW_ALERT_MESSAGE, CANCEL_REVIEW_ALERT_OK_TEXT, CANCEL_REVIEW_ALERT_CANCEL_TEXT);
        if (hasCanceled) {
            navigate(`http://localhost:8080/paper/${request.paperId}`, { state: { source: "paper_list" } });
        }
    };
    console.log(files)

    return (
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", width: "100%"}}>
            <Paper sx={{width: '100%', padding: 4, backgroundColor: 'background.paper', boxShadow: 3, marginTop: 10,}}>
                <Typography variant="h4" component="h1" sx={{color: 'white'}} fontWeight={"bold"}>
                    {initialData.title ? 'Edit Review' : 'Add Review'}
                </Typography>

                {/* Review Form */}
                <form onSubmit={handleSubmit}>
                    <Grid2 container spacing={1} sx={{maxWidth: "800px"}}>
                        <CustomTextField
                            required={isTextRequired}
                            label="Summary"
                            value={summary}
                            multiline
                            rows={5.4}
                            onChange={(e) => setSummary(e.target.value)}
                        />
                        <Grid2 gap={2} sx={{display: 'flex', flexDirection: 'row', width: "100%",}}>
                            <CustomTextField
                                required={isTextRequired}
                                label="Strenghts"
                                value={strengths}
                                multiline
                                rows={9.4}
                                onChange={(e) => setStrengths(e.target.value)}
                            />
                            <CustomTextField
                                required={isTextRequired}
                                label="Weaknesses"
                                value={weaknesses}
                                multiline
                                rows={9.4}
                                onChange={(e) => setWeaknesses(e.target.value)}
                            />
                        </Grid2>
                        <Grid2 gap={2} sx={{display: 'flex', flexDirection: 'row', width: "100%"}}>
                            <CustomTextField
                                required={isTextRequired}
                                label="Comments"
                                value={comments}
                                multiline
                                rows={5.4}
                                onChange={(e) => setComments(e.target.value)}
                            />
                            <CustomTextField
                                required={isTextRequired}
                                label="Questions"
                                value={questions}
                                multiline
                                rows={5.4}
                                onChange={(e) => setQuestions(e.target.value)}
                            />
                        </Grid2>
                        <Box sx={{display: "flex", alignItems: "center", gap: 2, width: "100%"}}>
                            <FormControl required sx={{minWidth: "175px", flexGrow: 1}}>
                                <InputLabel id="confidence-level-label">Confidence Level</InputLabel>
                                <Select
                                    required={true}
                                    labelId="confidence-level-label"
                                    id="confidence-level-select"
                                    label="Confidence Level *"
                                    value={confidenceLevel}
                                    onChange={handleConfidenceLevel}
                                    sx={{width: "33%"}}
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
                                        required={isExternal}
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

                    {/* File Upload */}
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
                    {files.length > 0 && (
                        <Box sx={{marginTop: 2}}>
                            {files.map(file => (
                                <Box key={file.name} sx={{display: 'flex', alignItems: 'center', marginTop: 1}}>
                                    <Typography sx={{color: 'primary', fontWeight: 'bold'}}>
                                        {file.name}
                                    </Typography>
                                    <IconButton onClick={() => handleRemoveFile(file.name)} sx={{ml: 1}}>
                                        <CloseIcon/>
                                    </IconButton>
                                </Box>
                            ))}
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
                        multiple
                    />

                    <input
                        type="file"
                        accept={'.pdf'}
                        ref={fileInputRef}
                        style={{display: 'none'}}
                        onChange={(e) => {
                            if (e.target.files) {
                                setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files)]);
                            }
                        }}
                        multiple
                    />
                    {warning && (
                        <Typography color="error" sx={{mt: 2}}>
                            {warning}
                        </Typography>
                    )}

                    {/* Submission Note */}
                    <Typography sx={{mt: 2, color: 'gray', fontSize: '0.875rem'}}>
                        To submit your review, either fill in all text fields or upload at least one review file.
                    </Typography>

                    {/* Submit & Cancel Buttons */}
                    <Box sx={{display: "flex", gap: 2, mt: 2}}>
                        <Button type="submit" variant="contained" color="primary" sx={{mt: 2}}>
                            Submit
                        </Button>
                        <Button variant="outlined" color="error" onClick={handleCancel} sx={{mt: 2}}>
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default ReviewForm;