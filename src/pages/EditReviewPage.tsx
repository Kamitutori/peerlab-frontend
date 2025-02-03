import { useParams } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm.tsx';
import {useEffect, useState} from "react";

export default function EditReviewPage() {
    const { id } = useParams<{ id: string }>();
    const [initialData, setInitialData] = useState<any>(null);

    useEffect(() => {
        // Fetch the paper data to edit
        fetch(`http://localhost:8080/api/reviews/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        })
            .then(response => response.json())
            .then(data => setInitialData(data))
            .catch(error => console.error('Error fetching review data:', error));
    }, [id]);

    const handleSubmit = async (reviewData: any) => {
        try {
            const response = await fetch(`http://localhost:8080/api/reviews`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(reviewData)
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
        <ReviewForm
            initialData={initialData}
            onSubmit={handleSubmit}
        />
    );
}
