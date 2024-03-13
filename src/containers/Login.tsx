import { useState } from "react"
import { getToken } from "../services/http"

interface LoginProps {
    setToken: (token: string) => void; 
}

const Login:React.FC<LoginProps> = ({setToken})=>{
    const [username, setUsername]=useState('')
    const [password, setPassword]=useState('')


    const login= async()=>{
        const token = await getToken({username, password})
        console.log('token: ' + token)
        setToken(token)
    }
    return(
        <div>
            <span>Login</span>
            <br/>
            <input type="text" onChange={(event)=>setUsername(event.target.value)} value={username}/>
            <br/>
            <input type="password" onChange={(event)=>setPassword(event.target.value)} value={password}/>
            <br/>
            <input type="button" onClick={login} value="Login"/>
        </div>
    )
}

export default Login;