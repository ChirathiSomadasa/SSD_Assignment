import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';
import { useEffect } from 'react';

function SignOut(){

    const[cookies,setCookies] = useCookies(["auth_email","user_type"]);
    var navigate = useNavigate();

    useEffect(function(){

        setCookies("auth_email", null);
        setCookies("auth_password", null);

        //redirect login
        navigate("/login");

    });

    return(
        "Please wait..."
    );
}


export default SignOut;