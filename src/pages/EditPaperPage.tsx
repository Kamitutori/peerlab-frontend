import { useParams } from 'react-router-dom';
import PaperPageForm, { PaperData } from '../components/PaperPageForm.tsx';
import { useEffect, useState } from 'react';

export default function EditPaperPage() {
    const { id } = useParams<{ id: string }>();
    const [initialData, setInitialData] = useState<PaperData | null>(null);

    useEffect(() => {
        const fetchPaperData = async (retryCount = 0) => {
            try {
                const response = await fetch(`http://localhost:8080/api/papers/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setInitialData(data);
            } catch (error) {
                console.error('Error fetching paper data:', error);
                if (retryCount < 3) {
                    setTimeout(() => fetchPaperData(retryCount + 1), Math.pow(2, retryCount) * 1000);
                }
            }
        };
        fetchPaperData();
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