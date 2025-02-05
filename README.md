## Getting Started
You will need the node package manager (npm) to actually develop and run anything of the frontend.
It is the node package manager for Node.js, so you will need to install Node.js first.

If you want to run it, first you'll need to install the dependencies. You can do this by running the following command:
```bash
npm install
```
This will install all the dependencies listed in the package.json file.
If someone adds a new package "npm install" is sufficient.

To run the app locally, run the following command:
```bash
npm run dev
```
The port to connect to is displayed. 

+++ End of notice +++


# Example for RegisterPage without useQuery
Implementation not 1:1 possible as await needs to be called in an async function.
```typescript
    const register = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: input.name,
                    email: input.email,
                    password: input.password
                })
            });
            if (response.status == 200) {
                setMessageProps(`Registration successful. Verify your email to authenticate and login afterward. 
 Redirecting to login...`, "success");
                setTimeout(() => {
                    navigate("/login");
                }, 10000);
            } else if (response.status == 403) {
                setMessageProps(`Registration failed: ${response.status}. Please check your inputs. Maybe the email is already in use.`, "error");
            } else {
                console.error('Error during registration:', response.status);
                alert(`There was an error during registration. Please try again later. Err: ${err}`);
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert("Registration failed. Please try again");
        }
    }
```

# Frontend Tech Stack
- Language: TypeScript
- Framework: React
- State Management: Context API?
- Runtime: Node.js
- Package Manager: npm
- (specific) Libraries: react-router-dom, react-query, react-material-ui
- Test Framework: Jest (not yet implemented)
- Setup: Vite