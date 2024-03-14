import { useState } from "react"
import { getToken } from "../services/http"
import Register from './Register'

interface LoginProps {
    setToken: (token: string) => void; 
}

const Login:React.FC<LoginProps> = ({setToken})=>{
    const [username, setUsername]=useState('')
    const [password, setPassword]=useState('')
    const [isRegister, setIsRegister] = useState(false)

    const login= async()=>{
        const token = await getToken({username, password})
        console.log('token: ' + token)
        setToken(token)
    }
    return(
    <>
    {isRegister ? <Register setToken={setToken}/> :
        <div>
            <span>Login</span>
            <br/>
            <input type="text" onChange={(event)=>setUsername(event.target.value)} value={username}/>
            <br/>
            <input type="password" onChange={(event)=>setPassword(event.target.value)} value={password}/>
            <br/>
            <input type="button" onClick={login} value="Login"/>
            <input type="button" onClick={()=>setIsRegister(true)} value="Not Registered? Register"/>
        </div>
    }
    </>
    )
}

export default Login;