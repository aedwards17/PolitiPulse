import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

export default function SignOut() {
    const auth = getAuth();
    const navigate = useNavigate();
  
    signOut(auth).then(() => {
      console.log("Sign Out Successful")
      navigate("/")
    }).catch((error) => {
      console.log("Error: ", error.message)
      navigate("/")
    });    
}
