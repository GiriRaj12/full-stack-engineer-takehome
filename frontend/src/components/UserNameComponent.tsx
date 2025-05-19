import { Button, Container, TextField, Typography, Box } from '@material-ui/core'
import React, {useState} from 'react'


export default function UserNameInputComponent(props){

    const [username, setUserName] = useState("");
    const [isUserNameError, setUserNameError] = useState(false)
    const [userNameErrorMessage, setUserNameErrorMessage] = useState("")

    const onUserNameChange = (event)=> {
        setUserNameError(false);
        setUserName(event.target.value);
        setUserNameErrorMessage("")
    }

    const onSubmit = () => {
        if(!(username && String(username).length >= 4)){
            setUserNameError(true)
            setUserNameErrorMessage("Should have atleast 5 chars")
        }
        else 
            props.continueSession(username)
    }

    return (
        <Container maxWidth="sm">
            <Typography>Please provide a valid Name to continue the Session</Typography>
            <Box padding={2} borderRadius={1} margin={2}>
                <TextField id="session-user-name" 
                    label="username" variant="outlined" 
                    placeholder="User Name" 
                    value={username}
                    onChange={onUserNameChange}
                    error={isUserNameError}
                    helperText={userNameErrorMessage}
                    fullWidth
                    style={{margin: 2}}
                />
                <Button variant="contained" onClick={onSubmit}>Confirm</Button>
            </Box>
        </Container>

    )

}