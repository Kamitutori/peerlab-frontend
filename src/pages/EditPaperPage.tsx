import {useParams} from 'react-router-dom';
import PaperPageForm, {PaperData} from '../components/PaperPageForm.tsx';
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

    if (!initialData) {
        return <div>Loading...</div>;
    }

    return (
        <PaperPageForm
            initialData={initialData}
        />
    );
}