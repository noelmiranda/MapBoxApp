import { Room, Cancel  } from '@material-ui/icons';
import axios from 'axios';
import { useRef, useState } from "react"
import "./login.css";

export default function Login({setShowLogin, myStorage, setCurrentUser}) {
    const [error, setError] = useState(false);
    const nameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const user = {
            username:nameRef.current.value,          
            password:passwordRef.current.value
        };
        try{
          const res = await axios.post("/users/login", user);
          myStorage.setItem("user", res.data.username)
          setCurrentUser(res.data.username)
          setShowLogin(false);
          setError(false);
         }catch(err){
           setError(true)
        }
    };

    return (
        <div className="loginContainer">
            <div className="logoLogin">
              <Room />
              Login
            </div>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Username" ref={nameRef}/>
                    <input type="password" placeholder="Password" ref={passwordRef}/>
                    <button className="loginBtn">Login</button>
                    {error &&
                        <span className="failure">Something is wrong</span>
                    }
                    
                </form>

            <Cancel className="loginCancel" onClick={()=>setShowLogin(false)}/>

        </div>
    )
}