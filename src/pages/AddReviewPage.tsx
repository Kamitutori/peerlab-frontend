import ReviewForm from '../components/ReviewForm.tsx';
// TODO Why is there a submission func in the form but also the add review page?
export default function AddReviewPage() {

    const handleSubmit = async (reviewData: any) => {
        try {
            const response = await fetch('http://localhost:8080/api/reviews', {
                method: 'POST',
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

    return (
        <ReviewForm
            onSubmit={handleSubmit}
        />
    );
}
