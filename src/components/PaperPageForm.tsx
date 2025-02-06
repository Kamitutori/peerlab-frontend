import React, { useEffect, useRef, useState } from 'react';
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
    Typography,
    FormHelperText
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CustomTextField from './CustomTextField';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import {useAlertDialog} from "../utils/alertDialogUtils.ts";

// Define types for the paper and reviewer data
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
    isInternal: boolean;
    authorsNote: string;
    abstractText: string;
    requests: Request[];
    fileId: string;
}

interface Request {
    id?: string;
    requestee: {
        id: string;
    };
    status?: string;
}

// Paper data to populate the form
interface PaperFormProps {
    initialData?: PaperData;
}

// Main PaperPageForm component
const PaperPageForm: React.FC<PaperFormProps> = ({ initialData = {} as PaperData }) => {
    // Declare state variables to manage form data
    const [title, setTitle] = useState(initialData.title || '');
    const [authors, setAuthors] = useState(initialData.authors || '');
    const [reviewLimit, setReviewLimit] = useState(initialData.reviewLimit || '');
    const [minScore, setMinScore] = useState(initialData.minScore || '');
    const [maxScore, setMaxScore] = useState(initialData.maxScore || '');
    const [isInternal, setIsInternal] = useState(initialData.isInternal !== undefined ? (initialData.isInternal ? 'internal' : 'external') : 'internal');
    const [authorsNote, setAuthorsNote] = useState(initialData.authorsNote || '');
    const [abstractText, setAbstractText] = useState(initialData.abstractText || '');
    const [files, setFiles] = useState<File[]>([]); // For managing uploaded files
    const [warning, setWarning] = useState(''); // For handling warning messages
    const [reviewers, setReviewers] = useState<Reviewer[]>([]); // List of reviewers
    const [requests, setRequests] = useState<Request[]>(initialData.requests || []);// Paper review requests
    const [requestsToDelete, setRequestsToDelete] = useState<Request[]>([]); // Requests to delete
    const [newRequests, setNewRequests] = useState<Request[]>([]); // New review requests
    const fileInputRef = useRef<HTMLInputElement>(null); // Reference to file input element
    const [isEdited, setIsEdited] = useState(false); // Flag to track if the form is edited
    const {showAlert} = useAlertDialog(); // Custom hook to show alerts

    // Fetch reviewers on component mount
    useEffect(() => {
        const fetchReviewers = async (retryCount = 0) => {
            console.log(`Fetching reviewers, attempt ${retryCount + 1}`);
            try {
                const response = await fetch("http://localhost:8080/api/users/all", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });

                const text = await response.text();
                const data = text ? JSON.parse(text) : [];
                console.log('Fetched reviewers:', data);
                setReviewers(data); // Set the list of reviewers
            } catch (error) {
                console.error('Error fetching reviewers:', error);
                if (retryCount < 3) {
                    setTimeout(() => fetchReviewers(retryCount + 1), Math.pow(2, retryCount) * 1000);
                }
            }
        };
        fetchReviewers();
    }, []);

    // Update min and max score when internal status changes
    useEffect(() => {
        if (isInternal === 'internal') {
            setMinScore('');
            setMaxScore('');
        }
    }, [isInternal]);

    const navigate = useNavigate(); // For navigation
    const [authorsNoteCount, setAuthorsNoteCount] = useState(authorsNote.length);
    const [abstractTextCount, setAbstractTextCount] = useState(abstractText.length);

    // Handle input change for authors note
    const handleAuthorsNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 2000) {
            setAuthorsNoteCount(value.length);
            setAuthorsNote(value);
            setIsEdited(true); // Mark form as edited
        }
    };

    // Handle input change for abstract text
    const handleAbstractTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 2000) {
            setAbstractTextCount(value.length);
            setAbstractText(value);
            setIsEdited(true);
        }
    };

    // Form submission handler
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const minScoreNumber = isInternal === 'internal' ? null : Number(minScore);
        const maxScoreNumber = isInternal === 'internal' ? null : Number(maxScore);
        const reviewLimitNumber = Number(reviewLimit);
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        if (!user || !user.id) {
            setWarning('User is not logged in.');
            return;
        }
        if (isInternal === 'external' && (minScoreNumber === null || maxScoreNumber === null || isNaN(minScoreNumber) || isNaN(maxScoreNumber) || minScoreNumber >= maxScoreNumber)) {
            setWarning('Please enter valid scores. The maximum score must be higher than the minimum score.');
            return;
        }
        if (isNaN(reviewLimitNumber) || (reviewLimitNumber <= 0 && reviewLimit)) {
            setWarning('Please enter a valid number for the maximum number of reviews.');
            return;
        }
        if (files.length === 0 && !initialData.id) {
            setWarning("Please upload a file.");
            return;
        }
        setWarning(''); // Reset warning

        const owner = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        const uploadDate = new Date().toISOString();

        let fileId = initialData.fileId;

        // Handle file upload if a new file is selected
        if (files.length > 0) {
            const file = files[0];

            try {
                const uploadResponse = await fetch(`http://localhost:8080/api/minio/paper-upload-url?fileName=${file.name}`, {
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

                fileId = newFileId;
                console.log("File uploaded successfully.");
            } catch (error) {
                console.error("Error uploading file:", error);
                return;
            }
        }

        // Prepare paper data and submit it to the server
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
            fileId,
            active: true,
            isInternal: isInternal === 'internal',
        };

        try {
            const paperResponse = await fetch(`http://localhost:8080/api/papers${initialData.id ? `/${initialData.id}` : ''}`, {
                method: initialData.id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(paperData)
            });

            const paperResult = await paperResponse.json();
            console.log('Successfully posted paper:', paperResult);

            // Handle new review requests if there are any
            if (newRequests.length > 0) {
                const requestsData = newRequests.map(request => ({
                    requestee: {
                        id: request.requestee.id,
                    },
                    paperId: paperResult.id
                }));

                try {
                    const requestResponse = await fetch(`http://localhost:8080/api/requests`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                        },
                        body: JSON.stringify(requestsData)
                    });
                    const reviewResult = await requestResponse.json();
                    console.log('Successfully sent reviews:', reviewResult);
                } catch (error) {
                    console.error('Error:', error);
                }
            }

            // Delete requests if necessary
            for (const request of requestsToDelete) {
                if (request.id) {
                    try {
                        await fetch(`http://localhost:8080/api/requests/${request.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                            }
                        });

                        console.log('Successfully deleted request:', request.id);
                    } catch (error) {
                        console.error('Error deleting request:', error);
                    }
                }
            }

            navigate(`/paper/${paperResult.id}`); // Navigate to the created/updated paper page
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Handle file download
    const handleDownloadClick = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/minio/paper-download-url?fileId=${initialData.fileId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                }
            });

            const downloadUrl = await response.text();

            window.open(downloadUrl, '_blank');
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    // Handle delete paper action
    const handleDeleteClick = async () => {
        const result = await showAlert("Paper deletion", "Are you sure you want to delete this paper?", "Delete", "Cancel");
        if (!result) return;
        try {
            const response = await fetch(`http://localhost:8080/api/papers/${initialData.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });

            const text = await response.text();
            const result = text ? JSON.parse(text) : {};

            navigate(`/papers`);
            console.log('Successfully deleted paper:', result);
        } catch (error) {
            console.error('Error:', error);
            navigate(`/papers`);
        }
    }

    // Handle file drop (upload via drag and drop)
    const onDrop = (acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    // Open file input when upload button is clicked
    const handleUploadClick = () => {
        setIsEdited(true);
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Remove selected file
    const handleRemoveFile = () => {
        setFiles([]);
    };

    // Handle reviewer selection
    const handleReviewerChange = (reviewerId: string) => {
        setIsEdited(true);
        setRequests(prevSelected => {
            const isAlreadyRequested = prevSelected.some(request => request.requestee.id === reviewerId);

            if (isAlreadyRequested) {
                const requestToDelete = prevSelected.find(request => request.requestee.id === reviewerId);
                if (requestToDelete) {
                    // Remove from requestsToDelete if already scheduled for deletion
                    setRequestsToDelete(prev => prev.filter(req => req.requestee.id !== reviewerId));
                }
                setNewRequests(prev => prev.filter(request => request.requestee.id !== reviewerId));
                return prevSelected.filter(request => request.requestee.id !== reviewerId);
            } else {
                // If the reviewer was previously marked for deletion, remove it from there
                setRequestsToDelete(prev => prev.filter(req => req.requestee.id !== reviewerId));
                setNewRequests(prev => [...prev, { requestee: { id: reviewerId } }]);
                return [...prevSelected, { requestee: { id: reviewerId } }];
            }
        });
    };

    // Select/deselect all reviewers
    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsEdited(true);
        if (event.target.checked) {
            setRequests(reviewers.map(reviewer => ({ requestee: { id: reviewer.id } })));
            setNewRequests(reviewers.map(reviewer => ({ requestee: { id: reviewer.id } })));
            setRequestsToDelete([]);
        } else {
            setRequests([]);
            setRequestsToDelete(prev => [
                ...prev,
                ...requests.filter(request => !newRequests.some(newRequest => newRequest.requestee.id === request.requestee.id))
            ]);
            setNewRequests([]);
        }
    };

    // Handle cancel button click
    const handleCancelClick = async () => {
        if (isEdited) {
            const result = await showAlert("Cancel", "All changes will be discarded", "Proceed", "Go back");
            if (!result) return;
        }
        navigate(-1); // Navigate back to the previous page
        return;
    };

    // Render the PaperPageForm component, which displays the form for adding or editing paper data.
    return (
        <Paper sx={{ width: '100%', padding: 4, backgroundColor: 'background.paper', boxShadow: 3, marginTop: 10, position: 'relative' }}>
            {/* Display delete button if there is an existing paper (editing scenario) */}
            {initialData.id && (
                <IconButton onClick={handleDeleteClick} sx={{ position: 'absolute', top: 35, right: 25 }}>
                    <DeleteIcon />
                </IconButton>
            )}
            {/* Title: 'Edit Paper' if there is paper data, otherwise 'Add Paper' */}
            <Typography variant="h4" component="h1" fontWeight={"bold"} sx={{ textAlign: 'leftZ' }}>
                {initialData.title ? 'Edit Paper' : 'Add Paper'}
            </Typography>

            {/* Form for submitting paper data */}
            <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2}>
                    {/* Paper name and authors/conference */}
                    <Grid2 sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CustomTextField
                            required
                            label="Paper name"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value) // Update title value
                                setIsEdited(true) // Mark form as edited
                            }}
                        />
                        <CustomTextField
                            required
                            label="Authors/Conference"
                            value={authors}
                            onChange={(e) => {
                                setAuthors(e.target.value) // Update authors value
                                setIsEdited(true) // Mark form as edited

                            }}
                        />
                        <CustomTextField
                            label="Maximum number of reviews"
                            value={reviewLimit}
                            onChange={(e) => {
                                setReviewLimit(e.target.value) // Update review limit
                                setIsEdited(true) // Mark form as edited
                            }}
                        />
                        {/* Min and Max score fields */}
                        <Grid2 container spacing={2}>
                            <Grid2>
                                <CustomTextField
                                    required
                                    label="Minimum score"
                                    value={minScore}
                                    onChange={(e) => {
                                        setMinScore(e.target.value) // Update minimum score
                                        setIsEdited(true) // Mark form as edited
                                    }}
                                    disabled={isInternal === 'internal'}
                                />
                            </Grid2>
                            <Grid2>
                                <CustomTextField
                                    required
                                    label="Maximum score"
                                    value={maxScore}
                                    onChange={(e) => {
                                        setMaxScore(e.target.value) // Update maximum score
                                        setIsEdited(true) // Mark form as edited
                                    }}
                                    disabled={isInternal === 'internal'} // Disable if internal
                                />
                            </Grid2>
                        </Grid2>
                    </Grid2>

                    {/* Authors' note with character count */}
                    <Grid2>
                        <Box sx={{ position: 'relative', width: '100%' }}>
                            <CustomTextField
                                label="Authors note"
                                value={authorsNote}
                                onChange={handleAuthorsNoteChange} // Update authors note
                                multiline
                                rows={9.4}
                                sx={{ width: '100%' }}
                            />
                            {/* Display character count */}
                            <FormHelperText sx={{ position: 'absolute', right: 0, bottom: '-20px' }}>
                                <Typography variant="body2" color="text.secondary" fontSize={12}>
                                    {`${authorsNoteCount}/2000`}
                                </Typography>
                            </FormHelperText>
                        </Box>
                    </Grid2>
                </Grid2>
                {/* Radio buttons for selecting internal or external status */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <RadioGroup
                        row
                        value={isInternal}
                        onChange={(e) => {
                            setIsInternal(e.target.value) // Update internal/external status
                            setIsEdited(true) // Mark form as edited
                        }}
                    >
                        <FormControlLabel
                            value="internal"
                            control={<Radio disabled={!!initialData.id} />} // Disable if editing
                            label="Internal"
                            sx={{ color: 'primary' }}
                        />
                        <FormControlLabel
                            value="external"
                            control={<Radio disabled={!!initialData.id} />} // Disable if editing
                            label="External"
                            sx={{ color: 'primary' }}
                        />
                    </RadioGroup>
                </Box>
                {/* Abstract text input field with character count */}
                <Box sx={{ position: 'relative', width: '100%', marginTop: 2 }}>
                    <CustomTextField
                        label="Abstract Text"
                        value={abstractText}
                        onChange={handleAbstractTextChange} // Update abstract text
                        multiline
                        rows={4}
                        sx={{ width: '100%' }}
                    />
                    <FormHelperText sx={{ position: 'absolute', right: 0, bottom: '-20px' }}>
                        <Typography variant="body2" color="text.secondary" fontSize={12}>
                            {`${abstractTextCount}/2000`}
                        </Typography>
                    </FormHelperText>
                </Box>
                {/* Display uploaded file info if editing an existing paper */}
                {initialData.id ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                        <Typography sx={{ color: 'primary', fontWeight: 'bold' }}>
                            Uploaded file:
                        </Typography>
                        <Button variant="contained" color="secondary" onClick={handleDownloadClick} sx={{ ml: 2 }}>
                            Download
                        </Button>
                    </Box>
                ) : (
                    <>
                        {/* Display file upload area when no file is uploaded */}
                        {files.length === 0 ? (
                            <Box {...getRootProps()}
                                 sx={{
                                     border: '2px dashed grey',
                                     padding: 4,
                                     textAlign: 'center',
                                     marginTop: 5
                                 }}>
                                <input {...getInputProps()} />
                                <Typography sx={{ color: 'primary' }}>
                                    Drag & drop some files here, or click to select files
                                </Typography>
                                <Button variant="contained" color="secondary" onClick={handleUploadClick} sx={{ mt: 2 }}>
                                    Upload File
                                </Button>
                            </Box>
                        ) : (

                            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                                {/* Display the uploaded file name */}
                                <Typography sx={{ color: 'primary', fontWeight: 'bold' }}>
                                    Uploaded file: {files[0].name}
                                </Typography>
                                <IconButton onClick={handleRemoveFile} sx={{ ml: 1 }}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        )}
                    </>
                )}

                {/* Hidden file input to allow file upload */}
                <input
                    type="file"
                    accept={'.pdf'}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                        if (e.target.files) {
                            setFiles(Array.from(e.target.files)); // Set selected files
                        }
                        setIsEdited(true); // Mark form as edited
                    }
                }
                />

                {/* Table for displaying reviewers and selecting them */}
                <TableContainer component={Paper} sx={{ marginTop: 4 }}>
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
                                            onChange={handleSelectAll} // Select all reviewers
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{ mr: 1 }}
                                        >
                                            Select all
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </TableContainer>
                <TableContainer component={Paper} sx={{ maxHeight: 350, overflow: 'auto' }}>
                    <Table>
                        <TableBody>
                            {/* Render reviewers in table rows */}
                            {reviewers.map((reviewer) => {
                                const request = requests.find(request => request.requestee.id === reviewer.id && request.status !== 'REJECTED');
                                const isDisabled = request && (request.status === 'ACCEPTED' || request.status === 'SUBMITTED');
                                const statusText = request && (request.status === 'ACCEPTED' || request.status === 'SUBMITTED') ? request.status : '';

                                return (
                                    <TableRow key={reviewer.id} sx={{ height: 40 }}>
                                        <TableCell>{reviewer.name}</TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                {statusText && (
                                                    <Typography variant="body2" color="green" sx={{ marginRight: 1 }}>
                                                        {statusText}
                                                    </Typography>
                                                )}
                                                <Checkbox
                                                    checked={!!request} // Mark checkbox if reviewer is selected
                                                    onChange={() => handleReviewerChange(reviewer.id)} // Handle reviewer selection change
                                                    disabled={isDisabled} // Disable if status is ACCEPTED/SUBMITTED
                                                />
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Display warning message if there's any */}
                {warning && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {warning}
                    </Typography>
                )}

                {/* Cancel and Submit buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button type="button" variant="contained" color="error" onClick={handleCancelClick}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default PaperPageForm;