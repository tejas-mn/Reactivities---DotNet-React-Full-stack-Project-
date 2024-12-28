import { Navigate, Outlet, useLocation } from "react-router";
import { useStore } from "../stores/store";
import { toast } from "react-toastify";

export default function RequireAuth()
{
    const {userStore : {isLoggedIn}} = useStore();
    const location = useLocation();
    
    if(!isLoggedIn)
    {
        return <Navigate to='/' state={{from: location}}/>
    }

    return <Outlet/>
}