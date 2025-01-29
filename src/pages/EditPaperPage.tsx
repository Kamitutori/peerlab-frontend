import {useParams} from 'react-router-dom';
import PaperForm, {PaperData} from '../components/PaperForm';
import {useEffect, useState} from 'react';

export default function EditPaperPage() {
    const {id} = useParams<{ id: string }>();
    const [initialData, setInitialData] = useState<PaperData | null>(null);

    useEffect(() => {
        // Fetch the paper data to edit
        fetch(`http://localhost:8080/api/papers/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
            .then(response => response.json())
            .then(data => setInitialData(data))
            .catch(error => console.error('Error fetching paper data:', error));
    }, [id]);

    const handleSubmit = async (paperData: PaperData) => {
        try {
            const response = await fetch(`http://localhost:8080/api/papers/${id}`, {
                method: 'PUT',
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

    if (!initialData) {
        return <div>Loading...</div>;
    }

    return (
        <PaperForm
            initialData={initialData}
            onSubmit={handleSubmit}
            fetchReviewersUrl="http://localhost:8080/api/users/all"
        />
    );
}