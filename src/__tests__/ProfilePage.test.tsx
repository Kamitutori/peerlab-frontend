import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Profile from "../pages/Profile.tsx";

test('renders welcome message', () => {
    render(<Profile />);
    expect(screen.getByText('Profile')).toBeInTheDocument();
});
