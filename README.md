## TODO
- Request status reset after review is deleted


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

```typescript jsx
return (
    <>
        <Paper sx={{
            width: '100%',
            maxWidth: '1000px',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: 3,
            marginTop: 9
        }}>
            <Typography variant="h4" sx={{marginBottom: 2, textAlign: 'center'}}>{paperObject.title}</Typography>
            {isRequest &&
                (
                    <BannerBox bannerColor={bannerColor} theme={undefined}>
                        <Typography variant="h6" sx={{flexGrow: 1, color: '#fff', paddingLeft: '10px'}}>
                            {bannerMessage}
                        </Typography>
                        {requestofRequestee.status === "PENDING" && (
                            <>
                                <Button variant="contained" color="secondary" onClick={handleAccept}>Accept</Button>
                                <Button variant="contained" color="secondary" sx={{marginLeft: 2}}
                                        onClick={handleReject}>Reject</Button>
                            </>
                        )}
                    </BannerBox>
                )}
            <Stack direction="row" spacing={2} justifyContent="space-between" sx={{marginBottom: 2}}>
                <Chip label={paperObject.internal ? 'Internal' : 'External'} color="primary"/>
                <Button
                    variant="contained"
                    onClick={handleDownload}
                    startIcon={<FileDownloadIcon/>}
                >
                    Download Paper
                </Button>
            </Stack>
            <Typography variant="body1"><strong>Authors : </strong> {paperObject.authors}</Typography>
            <Typography variant="body1"><strong>Preview : </strong> {paperObject.abstractText}</Typography>
            <Root>
                <Divider/>
            </Root>
            <Typography variant="body1"><strong>Accepted requests : </strong> *number of reached
                reviews* {paperObject.reviewLimit ? ` / ${paperObject.reviewLimit}` : ' '}</Typography>
            <Typography variant="body1"><strong>Status : </strong> {`${paperObject.active ? 'active' : 'inactive'}`}
            </Typography>

            <Root>
                <Divider>Author's Note</Divider>
                <Typography variant="body2" sx={{fontStyle: 'italic'}}>{paperObject.authorsNote}</Typography>
                <Divider/>
            </Root>
            {/*TO DO : real request/review list*/}
            {!isRequest && (
                <RequestListOfRequestees requests={paperObject.requests}/>
            )}
            <Stack spacing={2} direction="row" justifyContent="flex-end" sx={{marginTop: 2}}>
                <Button variant="outlined" onClick={() => navigate(`/edit-paper/${id}`)}>Edit</Button>
                {isRequest && requestofRequestee.reviewId && (
                    <Button variant="outlined"
                            onClick={() => navigate(`/view-review/${requestofRequestee.reviewId}`)}>
                        View Review
                    </Button>
                )}
                {openToReview && (
                    <Button variant="outlined" onClick={() => navigate(`/add-review/${id}`)}>
                        Add Review
                    </Button>
                )}
            </Stack>
            {isRequest && requestofRequestee.reviewId && (
                <Stack direction="row" justifyContent="flex-end" sx={{marginTop: 2}}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(`/edit-review/${requestofRequestee.reviewId}`)}
                        color="primary"
                        sx={{marginRight: 2}}
                    >
                        Edit the Review
                    </Button>
                </Stack>
            )}
            {isRequest && requestofRequestee.reviewId && (
                <Stack spacing={2} direction="row" justifyContent="flex-end">
                    <Button variant="outlined" onClick={handleDelete}>
                        Delete review
                    </Button>
                </Stack>)}
        </Paper>

        <div style={{
            paddingLeft: '10px',
            paddingRight: '10px'
        }}>{`Upload Date: ${convertISO8601ToDate(paperObject.uploadDate)}`}</div>
    </>
);
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