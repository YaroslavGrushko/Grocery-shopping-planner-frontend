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
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <CredentialsForm action={login} title='Вхід' buttonTitle='Вхід'/>
                <Button variant="text" onClick={()=>setIsRegister(true)}>Ще не зареєстровані? Зареєструйтесь</Button>
            </div>
        }
    </>
    )
}

export default Login;