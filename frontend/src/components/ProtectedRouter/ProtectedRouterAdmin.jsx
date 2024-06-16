import { Outlet,Navigate } from "react-router-dom";

const ProtectedRouter = ()=>{
    const quyen = localStorage.getItem('quyen')  
    return (
        quyen === "admin" ? <Outlet /> : quyen === "quanly" ? <Navigate to="admin/nhanvien" /> : <Navigate to="admin/nhaphang"/>
    )
}


export default ProtectedRouter