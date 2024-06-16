import { Outlet,Navigate } from "react-router-dom";

const ProtectedRouter = ()=>{
    const token = localStorage.getItem('Token')  
    return (
        token ? <Outlet/> : <Navigate to="/login"/>
    )
}


export default ProtectedRouter