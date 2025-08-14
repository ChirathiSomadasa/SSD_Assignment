import { useCookies } from 'react-cookie';

function useAuthEmail(){

    const [cookies, setCookies] = useCookies(["admin_auth_email"]);
    var authToken = cookies.admin_auth_email;
    
    if(authToken == undefined){
        return null;
    }else{
        return authToken;
    }
    
}

function useAuthPassword(){

    const[cookies,setCookies] = useCookies(["admin_auth_password"]);
    var authToken = cookies.admin_auth_password;
    
    if(authToken == undefined){
        return null;
    }else{
        return authToken;
    }
    
}

export { useAuthEmail,useAuthPassword };
