import { registerUser } from "../services/http"
import CredentialsForm from "./CredentialsForm";
import { Credentials } from "../types";

interface RegisterProps {
    setToken: (token: string) => void; 
}

const Register:React.FC<RegisterProps> = ({setToken})=>{
    const register= async(credentials: Credentials)=>{
        const token = await registerUser(credentials)
        console.log('token: ' + token)
        setToken(token)
    }
    return(
        <CredentialsForm action={register} title='Реєстрація' buttonTitle='Зареєструватись'/>
    )
}

export default Register;