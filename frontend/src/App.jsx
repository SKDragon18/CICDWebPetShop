import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Home from "./components/Home";
import NavbarAdmin from "./components/NavbarAdmin";
import Register from "./components/Register";
import ManageAccount from "./components/ManageAccount";
import ManageEmployees from "./components/ManageEmployees";
import ManageBranch from "./components/ManageBranch";
import ManageType from "./components/ManageType";
import ManagePet from "./components/ManagePet";
import ManageBreeds from "./components/ManageBreeds";
import ManagePrice from "./components/ManagePrice";
import ImportProduct from "./components/ImportProduct";
import ChangePassword from "./components/Customer/ChangePassword";
import CustomerProfile from "./components/Customer/CustomerProfile";
import ManageThuCung from "./components/ManageThuCung";
import ManageProduct from "./components/ManageProduct";
import MakeInvoice from "./components/MakeInvoice";
import ManageInfor from "./components/ManageInfor";
import Confirm from "./components/Confirm";

import { Routes, Route, useLocation } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Cart from "./components/Cart";
import Order from "./components/Order";
import HistoryOrder from "./components/HistoryOrder";
import OrderDetail from "./components/OrderDetail";
import ProductItem from "./components/ProductItem";
import PetItem from "./components/PetItem";

import ProtectedRouterToken from "./components/ProtectedRouter/ProtectedRouterToken";
import ProtectedRouter from "./components/ProtectedRouter/ProtectedRouterQuyen";
import ProtectedRouterAdmin from "./components/ProtectedRouter/ProtectedRouterAdmin";

function App() {
  const [count, setCount] = useState(0);

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Navbar />
      <div style={{ paddingTop: "64px" }}>
        {" "}
        {/* Chỗ này là đặt padding-top để tránh bị che bởi Navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/confirm" element={<Confirm />} />
          <Route  element={<ProtectedRouterToken/>}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<Order />} />
            <Route path="/changepassowrd" element={<ChangePassword />} />
            <Route path="/profile" element={<CustomerProfile />} />
            <Route path="/history" element={<HistoryOrder />} />
            <Route path="/orderdetail" element={<OrderDetail />} />
            <Route path="/product/:id" element={<ProductItem />} />
            <Route path="/pet/:id" element={<PetItem />} />
          </Route>
          {/* <Route path="/register" element={<Register />} /> */}
          {/* <Route path="/cart" element={<Cart />} /> */}
        </Routes>
        <Routes>
          <Route element={<ProtectedRouter/>}>
            <Route element={<ProtectedRouterToken/>} >
                <Route element={<ProtectedRouterAdmin/>}>
                  <Route
                    path="/admin"
                    element={<NavbarAdmin content={<ManageAccount />} />}
                  />
                </Route>
                <Route
                  path="/admin/nhanvien"
                  element={<NavbarAdmin content={<ManageEmployees />} />}
                />
                <Route
                  path="/admin/chinhanh"
                  element={<NavbarAdmin content={<ManageBranch />} />}
                />
                <Route
                  path="/admin/thucung"
                  element={<NavbarAdmin content={<ManageThuCung />} />}
                />
                <Route
                  path="/admin/loaisp"
                  element={<NavbarAdmin content={<ManageType />} />}
                />
                <Route
                  path="/admin/loaithucung"
                  element={<NavbarAdmin content={<ManagePet />} />}
                />
                <Route
                  path="/admin/giong"
                  element={<NavbarAdmin content={<ManageBreeds />} />}
                />
                <Route
                  path="/admin/banggia"
                  element={<NavbarAdmin content={<ManagePrice />} />}
                />
                <Route
                  path="/admin/nhaphang"
                  element={<NavbarAdmin content={<ImportProduct />} />}
                />
                <Route
                  path="/admin/sanpham"
                  element={<NavbarAdmin content={<ManageProduct />} />}
                />
                <Route
                  path="/admin/laphoadon"
                  element={<NavbarAdmin content={<MakeInvoice />} />}
                />
                <Route
                  path="/admin/infor"
                  element={<NavbarAdmin content={<ManageInfor />} />}
                />
              </Route>
          </Route>
        </Routes>
      </div>
    </SnackbarProvider>
  );
}

export default App;
