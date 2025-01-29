import ReviewForm from '../components/ReviewForm.tsx';

export default function AddPaperPage() {
    const handleSubmit = async (paperData: any) => {
        try {
            const response = await fetch('http://localhost:8080/api/papers', {
                method: 'POST',
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

    return (
        <ReviewForm
            onSubmit={handleSubmit}
        />
    );
}
