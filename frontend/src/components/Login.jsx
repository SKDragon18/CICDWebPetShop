import { Box, Button } from "@mui/material";
import MyTextField from "./form/MyTextField";
import MyButton from "./form/MyButton";
import MyPassField from "./form/MyPassField";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AxiosInstance from "./AxiosInstante";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
const Login = () => {
  const navigate = useNavigate();
  // const schema = yup
  // .object({
  //     email:yup.string().email('Field expects an email adress').required('Email is a required field'),
  //     password: yup.string().required('Password is a required field').min(8,'Password must be at least 8 characters').matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  //     .matches(/[a-z]/, 'Password must contain at least one lower case letter')
  //     .matches(/[0-9]/, 'Password must contain at least one number letter')
  //     .matches(/[!@#$%^&*()<>?:"{}[]|\+-_=]/, 'Password must contain at least one special character letter'),
  // })
  // {resolver: yupResolver(schema)}
  const { handleSubmit, control } = useForm();
  const submission = (data) => {
    console.log(data);
    AxiosInstance.post(`identity/login`, {
      tenDangNhap: data.username,
      matKhau: data.password,
    })
      .then((response) => {
        localStorage.setItem("tenDangNhap", response.data.tenDangNhap);
        localStorage.setItem("quyen", response.data.quyen);
        localStorage.setItem("Token", response.data.token);
        if (response.data.quyen === "khachhang") {
          navigate(`/`);
        } else {
          navigate("/admin");
        }
      })
      .catch((error) => {
        control.error("error during login", error);
      });
  };
  return (
    <div className="myBackground">
      <form onSubmit={handleSubmit(submission)}>
        <Box className={"whiteBox"}>
          <Box className={"itemBox"}>
            <Box className={"title"}>Đăng nhập</Box>
          </Box>
          <Box className={"itemBox"}>
            <MyTextField
              label={"Username"}
              name={"username"}
              control={control}
            />
          </Box>
          <Box className={"itemBox"}>
            <MyPassField
              label={"Password"}
              name={"password"}
              control={control}
            />
          </Box>
          <Box className={"itemBox"}>
            <MyButton label={"Login"} type={"submit"} />
          </Box>
          <Box className={"itemBox"} sx={{ flexDirection: "column" }}>
            <Link to="/register">Đăng ký</Link>
            <Link to="/request/password_reset">
              {" "}
              Quên mật khẩu? Click here{" "}
            </Link>
          </Box>
        </Box>
      </form>
    </div>
  );
};

export default Login;
