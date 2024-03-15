import { useState } from "react"

import Button from '@mui/material/Button';


import { getToken } from "../services/http"
import Register from './Register'
import { Credentials } from "../types";
import CredentialsForm from "./CredentialsForm";

import {GROCERY_SHOPPING_PLANNER_TOKEN} from '../consts'

interface LoginProps {
    setToken: (token: string) => void; 
}

const Login:React.FC<LoginProps> = ({setToken})=>{
    const [isRegister, setIsRegister] = useState(false)

    const login= async(credentials: Credentials)=>{
        const token = await getToken(credentials)
        console.log('token: ' + token)
        setToken(token)
        localStorage.setItem(GROCERY_SHOPPING_PLANNER_TOKEN, token);
    }

    return(
    <>
        {isRegister ? <Register setToken={setToken}/> :
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <CredentialsForm action={login} title='Login' buttonTitle='Login'/>
                <Button variant="text" onClick={()=>setIsRegister(true)}>Not Registered? Register</Button>
            </div>
        }
    </>
    )
}

export default Login;