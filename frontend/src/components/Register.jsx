import { Box, Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import AxiosInstance from './AxiosInstante';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const { handleSubmit, control, register, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const submission = (data) => {
        console.log(data);
        AxiosInstance.post(`/identity/register`, data).then(() => {
            navigate(`/register/confirm`,{ state: { regis: data } })
        });
    };

    const onlyNumbers = (value) => {
        return /^\d+$/.test(value);
    };

    return (
        <div className={"myBackground"} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit(submission)} style={{ width: '400px', padding: '20px', borderRadius: '10px' }}>
                <Box className={"whiteBox"} style={{ width: '100%' }}>
                    <Box className={"itemBox"} style={{ width: '100%' }}>
                        <Box className={"title"}>Đăng ký</Box>
                    </Box>
                    <Box className={"itemBox"}>
                        <TextField
                            label={"Tên đăng nhập"}
                            {...register('tenDangNhap', { required: 'Tên đăng nhập là bắt buộc' })}
                            error={!!errors.tenDangNhap}
                            helperText={errors.tenDangNhap ? errors.tenDangNhap.message : ''}
                            fullWidth
                        />
                    </Box>
                    <Box className={"itemBox"}>
                        <TextField
                            label={"Mật khẩu"}
                            type="password"
                            {...register('matKhau', { required: 'Mật khẩu là bắt buộc' })}
                            error={!!errors.matKhau}
                            helperText={errors.matKhau ? errors.matKhau.message : ''}
                            fullWidth
                        />
                    </Box>
                    <Box className={"itemBox"}>
                        <Box style={{ display: 'flex', gap: '10px' }}>
                            <TextField
                                label={"Họ"}
                                {...register('ho', { required: 'Họ là bắt buộc' })}
                                error={!!errors.ho}
                                helperText={errors.ho ? errors.ho.message : ''}
                                fullWidth
                            />
                            <TextField
                                label={"Tên"}
                                {...register('ten', { required: 'Tên là bắt buộc' })}
                                error={!!errors.ten}
                                helperText={errors.ten ? errors.ten.message : ''}
                                fullWidth
                            />
                        </Box>
                    </Box>
                    <Box className={"itemBox"}>
                        <TextField
                            label={"CCCD"}
                            {...register('cccd', { required: 'CCCD là bắt buộc' })}
                            error={!!errors.cccd}
                            helperText={errors.cccd ? errors.cccd.message : ''}
                            fullWidth
                        />
                    </Box>
                    <Box className={"itemBox"}>
                        <TextField
                            label={"SDT"}
                            {...register('soDienThoai', { required: 'Số điện thoại là bắt buộc', validate: onlyNumbers })}
                            error={!!errors.soDienThoai}
                            helperText={errors.soDienThoai ? (errors.soDienThoai.type === 'validate' ? 'Số điện thoại không hợp lệ' : errors.soDienThoai.message) : ''}
                            inputProps={{ inputMode: 'numeric' }}
                            fullWidth
                        />
                    </Box>
                    <Box className={"itemBox"}>
                        <TextField
                            label={"Email"}
                            type="email"
                            {...register('email', { 
                                required: 'Email là bắt buộc', 
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: 'Email không hợp lệ'
                                }
                            })}
                            error={!!errors.email}
                            helperText={errors.email ? errors.email.message : ''}
                            fullWidth
                        />
                    </Box>
                    <Box className={"itemBox"}>
                        <Button variant="contained" type={"submit"}>Đăng ký</Button>
                    </Box>
                    <Box className={"itemBox"}>
                        <Link to="/">Có tài khoản, đăng nhập!</Link>
                    </Box>
                </Box>
            </form>
        </div>
    );
};

export default Register;
