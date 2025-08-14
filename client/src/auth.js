import { useCookies } from 'react-cookie';

function useAuthEmail(){

    const[cookies,setCookies] = useCookies(["auth_email"]);
    var authToken = cookies.auth_email;
    
    if(authToken == undefined){
        return null;
    }else{
        return authToken;
    }
    
}

function useAuthPassword(){

    const[cookies,setCookies] = useCookies(["auth_password"]);
    var authToken = cookies.auth_password;
    
    if(authToken == undefined){
        return null;
    }else{
        return authToken;
    }
    
}

export { useAuthEmail, useAuthPassword };
