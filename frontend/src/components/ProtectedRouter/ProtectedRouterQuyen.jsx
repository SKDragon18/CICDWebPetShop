import { Outlet,Navigate } from "react-router-dom";

const ProtectedRouter = ()=>{
    const quyen = localStorage.getItem('quyen')  
    return (
        quyen === 'khachhang' ? <Navigate to="/"/> :<Outlet/> 
    )
}


export default ProtectedRouter