import React, { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Container,
  Paper,
} from "@mui/material";

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    // Logic to handle password change can be added here
    console.log(passwords);
  };

  return (
    <Container>
      <Box mt={4} mb={2}>
        <Typography variant="h4">Đổi Mật Khẩu</Typography>
        <Typography variant="subtitle1">
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </Typography>
      </Box>
      <Paper
        elevation={3}
        style={{ padding: 20, maxWidth: 400, margin: "0 auto" }}
      >
        <Box mb={2}>
          <TextField
            fullWidth
            label="Mật khẩu hiện tại"
            type={showPassword.current ? "text" : "password"}
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handleInputChange}
            margin="normal"
            size="small"
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Mật khẩu mới"
            type={showPassword.new ? "text" : "password"}
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleInputChange}
            margin="normal"
            size="small"
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Xác nhận mật khẩu"
            type={showPassword.confirm ? "text" : "password"}
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleInputChange}
            margin="normal"
            size="small"
          />
        </Box>
        <Button
          variant="contained"
          fullWidth
          style={{ backgroundColor: "orange" }}
          onClick={handleSubmit}
        >
          Lưu
        </Button>
      </Paper>
    </Container>
  );
};

export default ChangePassword;
