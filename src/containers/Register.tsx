import { useState } from "react"
import { registerUser } from "../services/http"

interface RegisterProps {
    setToken: (token: string) => void; 
}

const Register:React.FC<RegisterProps> = ({setToken})=>{
    const [username, setUsername]=useState('')
    const [password, setPassword]=useState('')


    const register= async()=>{
        const token = await registerUser({username, password})
        console.log('token: ' + token)
        setToken(token)
    }
    return(
        <div>
            <span>Register</span>
            <br/>
            <input type="text" onChange={(event)=>setUsername(event.target.value)} value={username}/>
            <br/>
            <input type="password" onChange={(event)=>setPassword(event.target.value)} value={password}/>
            <br/>
            <input type="button" onClick={register} value="Register"/>
        </div>
    )
}

export default Register;