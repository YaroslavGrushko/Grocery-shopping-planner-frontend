import { useState } from "react"

import Typography from '@mui/material/Typography';

import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Button from '@mui/material/Button';

import { Credentials } from "../types";

interface CredentialsProps {
    title: string;
    buttonTitle: string;
    action: (credentials: Credentials) => void; 
}

const CredentialsForm: React.FC<CredentialsProps> = ({title, buttonTitle, action})=>{
    const [username, setUsername]=useState('')
    const [password, setPassword]=useState('')
    const [showPassword, setShowPassword] = useState(false)

    const onClick =()=>{
        const credentials: Credentials = {
            username: username,
            password: password
        }
        action(credentials)
    }

    return(
        <div style={{width: '25ch', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Typography variant="h2">{title}</Typography>
            <br/>
            {/* Username */}
            <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                <InputLabel htmlFor="login-username">Логін</InputLabel>
                <Input
                    id="login-username"
                    type="text"
                    onChange={(event)=>setUsername(event.target.value)} 
                    value={username}
                />
            </FormControl>
            <br/>
            {/* Password */}
            <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">Пароль</InputLabel>
                <Input
                    id="standard-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    onChange={(event)=>setPassword(event.target.value)} 
                    value={password}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((show) => !show)}
                        onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
                            event.preventDefault();
                          }}
                        >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    }
                />
            </FormControl>
            <br/>
            <div style={{display: "flex", flexDirection:"column", marginBottom: '2ch'}}>
                <Button variant="outlined" onClick={onClick}>{buttonTitle}</Button>
            </div>
        </div>
    )
}

export default CredentialsForm;