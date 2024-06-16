import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Container, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import AxiosInstance from './AxiosInstante';
import { useSnackbar } from 'notistack';
const MyFormComponent = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const location = useLocation();
    const { regis } = location.state || {};
    console.log(regis)
    // State to store the input value
    const [inputValue, setInputValue] = useState('');
    // State to store the label value to display
    const [labelValue, setLabelValue] = useState('');
    const [message, setMessage] = useState('');

    // Handler for form submission
    const handleSubmit = (event) => {
        const res =  AxiosInstance.post("/identity/register/confirm", {
            "tenDangNhap":regis.tenDangNhap,
            "maXacNhan":inputValue
        })
        if(res.state === 200){
            navigate("/login")
        }
        else{
            enqueueSnackbar('Code không đúng mời nhập lại', {
                variant: 'error',
                autoHideDuration: 5000,
              });
        }
        event.preventDefault();
    };

    // Handler for resetting the form
    const handleReset = () => {
        const res =  AxiosInstance.post("/identity/register/getVerifiedCode", regis)
        if(res.state === 200){
            enqueueSnackbar('Email đã được gửi vui lòng nhập lại code!', {
                variant: 'success',
                autoHideDuration: 5000,
              });
        }
        else{
            enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại!', {
                variant: 'error',
                autoHideDuration: 5000,
              });
        }
    };

    return (
        <Container
            component="main"
            maxWidth="sm"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <Paper elevation={3} sx={{ padding: 4, width: '100%', textAlign: 'center' }}>
                <Typography variant="h5" component="h2" gutterBottom marginTop={4}>
                    Nhập code xác nhận
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3,
                    }}
                >
                    <TextField
                        label="Code"
                        variant="outlined"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        fullWidth
                        InputProps={{ style: { fontSize: 20 } }}
                        InputLabelProps={{ style: { fontSize: 20 } }}
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button type="submit" variant="contained" color="success" sx={{ fontSize: 18, padding: '12px 24px' }}>
                            Gửi
                        </Button>
                        <Button type="button" variant="outlined" color="secondary" sx={{ fontSize: 18, padding: '12px 24px' }} onClick={handleReset}>
                            Gửi lại
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default MyFormComponent;
