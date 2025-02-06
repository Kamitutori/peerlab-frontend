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
    Typography
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CustomTextField from './CustomTextField';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import {useAlertDialog} from "./AlertDialogProvider.tsx";

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

interface PaperFormProps {
    initialData?: PaperData;
}

const PaperPageForm: React.FC<PaperFormProps> = ({ initialData = {} as PaperData }) => {
    const [title, setTitle] = useState(initialData.title || '');
    const [authors, setAuthors] = useState(initialData.authors || '');
    const [reviewLimit, setReviewLimit] = useState(initialData.reviewLimit || '');
    const [minScore, setMinScore] = useState(initialData.minScore || '');
    const [maxScore, setMaxScore] = useState(initialData.maxScore || '');
    const [isInternal, setIsInternal] = useState(initialData.isInternal !== undefined ? (initialData.isInternal ? 'internal' : 'external') : 'internal');
    const [authorsNote, setAuthorsNote] = useState(initialData.authorsNote || '');
    const [abstractText, setAbstractText] = useState(initialData.abstractText || '');
    const [files, setFiles] = useState<File[]>([]);
    const [warning, setWarning] = useState('');
    const [reviewers, setReviewers] = useState<Reviewer[]>([]);
    const [requests, setRequests] = useState<Request[]>(initialData.requests || []);
    const [requestsToDelete, setRequestsToDelete] = useState<Request[]>([]);
    const [newRequests, setNewRequests] = useState<Request[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {showAlert} = useAlertDialog();

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
                setReviewers(data);
            } catch (error) {
                console.error('Error fetching reviewers:', error);
                if (retryCount < 3) {
                    setTimeout(() => fetchReviewers(retryCount + 1), Math.pow(2, retryCount) * 1000);
                }
            }
        };
        fetchReviewers();
    }, []);

    useEffect(() => {
        if (isInternal === 'internal') {
            setMinScore('');
            setMaxScore('');
        }
    }, [isInternal]);

    const navigate = useNavigate();

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
        setWarning('');

        const owner = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        const uploadDate = new Date().toISOString();

        let fileId = initialData.fileId;

        if (files.length > 0) {
            const file = files[0];

            try {
                const uploadResponse = await fetch(`http://localhost:8080/api/minio/upload-url?fileName=${file.name}`, {
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

            navigate(`/paper/${paperResult.id}`);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDownloadClick = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/minio/download-url?fileId=${initialData.fileId}`, {
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

    const onDrop = (acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleRemoveFile = () => {
        setFiles([]);
    };

    const handleReviewerChange = (reviewerId: string) => {
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


    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleCancelClick = () => {
        navigate(-1); // Navigate back to the previous page
    };

    return (
        <Paper sx={{ width: '100%', padding: 4, backgroundColor: 'background.paper', boxShadow: 3, marginTop: 10, position: 'relative' }}>
            {initialData.id && (
                <IconButton onClick={handleDeleteClick} sx={{ position: 'absolute', top: 35, right: 25 }}>
                    <DeleteIcon />
                </IconButton>
            )}
            <Typography variant="h4" component="h1" fontWeight={"bold"} sx={{ textAlign: 'leftZ' }}>
                {initialData.title ? 'Edit Paper' : 'Add Paper'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2}>
                    <Grid2 sx={{ display: 'flex', flexDirection: 'column' }}>
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
                                    disabled={isInternal === 'internal'}
                                />
                            </Grid2>
                            <Grid2>
                                <CustomTextField
                                    required
                                    label="Maximum score"
                                    value={maxScore}
                                    onChange={(e) => setMaxScore(e.target.value)}
                                    disabled={isInternal === 'internal'}
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
                            sx={{ width: '100%' }}
                        />
                    </Grid2>
                </Grid2>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <RadioGroup
                        row
                        value={isInternal}
                        onChange={(e) => setIsInternal(e.target.value)}
                    >
                        <FormControlLabel
                            value="internal"
                            control={<Radio disabled={!!initialData.id} />}
                            label="Internal"
                            sx={{ color: 'primary' }}
                        />
                        <FormControlLabel
                            value="external"
                            control={<Radio disabled={!!initialData.id} />}
                            label="External"
                            sx={{ color: 'primary' }}
                        />
                    </RadioGroup>
                </Box>
                <CustomTextField
                    label="Abstract Text"
                    value={abstractText}
                    onChange={(e) => setAbstractText(e.target.value)}
                    multiline
                    rows={4}
                    sx={{ width: '100%', marginTop: 2 }}
                />
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
                        {files.length === 0 ? (
                            <Box {...getRootProps()}
                                 sx={{
                                     border: '2px dashed grey',
                                     padding: 4,
                                     textAlign: 'center',
                                     marginTop: 2
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
                <input
                    type="file"
                    accept={'.pdf'}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                        if (e.target.files) {
                            setFiles(Array.from(e.target.files));
                        }
                    }}
                />
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
                                            onChange={handleSelectAll}
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
                                                    checked={!!request}
                                                    onChange={() => handleReviewerChange(reviewer.id)}
                                                    disabled={isDisabled}
                                                />
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {warning && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {warning}
                    </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button type="button" variant="contained" color="secondary" onClick={handleCancelClick}>
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