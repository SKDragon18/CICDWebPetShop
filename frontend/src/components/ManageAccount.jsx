import React,{ useState, useEffect, useRef} from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableHead, TableBody, TableCell, TableRow, TableContainer, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import AxiosInstance from './AxiosInstante';
import { useSnackbar } from 'notistack';

const SearchBar = () => {
  return (
    <div>
      <TextField label="Search" variant="outlined" />
      <Button variant="contained">Search</Button>
    </div>
  );
};

const RegistrationForm = ({ open, onClose, onSubmit }) => {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [usernames, setUsernames] = useState([]);
  useEffect(() => {
    // Hàm gọi API để lấy danh sách usernames
    const fetchUsernames = async () => {
      try {
        const response = await AxiosInstance.get('/identity/nhanvien/chuacotk'); // Thay URL bằng endpoint API thực tế của bạn
        setUsernames(response.data);
      } catch (error) {
        console.error('Error fetching usernames:', error);
      }
    };

    fetchUsernames();
  }, []);
  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Đăng ký tài khoản</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <TextField
            margin="dense"
            label="Họ"
            fullWidth
            {...register("ho", { required: true })}
            error={!!errors.ho}
            helperText={errors.ho ? "Họ là bắt buộc" : ""}
          />
          <TextField
            margin="dense"
            label="Tên"
            fullWidth
            {...register("ten", { required: true })}
            error={!!errors.ten}
            helperText={errors.ten ? "Tên là bắt buộc" : ""}
          />
          <FormControl fullWidth margin="dense" error={!!errors.tenDangNhap}>
            <InputLabel id="tenDangNhap-label">Tên đăng nhập</InputLabel>
            <Select
              labelId="tenDangNhap-label"
              label="Tên đăng nhập"
              {...register("tenDangNhap", { required: true })}
            >
              {usernames.map((username, index) => (
                <MenuItem key={index} value={username}>
                  {username}
                </MenuItem>
              ))}
            </Select>
            {errors.tenDangNhap && <p style={{ color: 'red' }}>Tên đăng nhập là bắt buộc</p>}
          </FormControl>

          <TextField
            margin="dense"
            label="Mật khẩu"
            type="password"
            fullWidth
            {...register("matKhau", { required: true })}
            error={!!errors.matKhau}
            helperText={errors.matKhau ? "Mật khẩu là bắt buộc" : ""}
          />
          <TextField
            margin="dense"
            label="CCCD"
            fullWidth
            {...register("cccd", { required: true })}
            error={!!errors.cccd}
            helperText={errors.cccd ? "CCCD là bắt buộc" : ""}
          />
          <TextField
            margin="dense"
            label="Số điện thoại"
            fullWidth
            {...register("soDienThoai", { required: true })}
            error={!!errors.soDienThoai}
            helperText={errors.soDienThoai ? "Số điện thoại là bắt buộc" : ""}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            {...register("email", { required: true })}
            error={!!errors.email}
            helperText={errors.email ? "Email là bắt buộc" : ""}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit(handleFormSubmit)} variant="contained">Đăng ký</Button>
      </DialogActions>
    </Dialog>
  );
};

const ManageAccount = () => {
    const [account, setAccount] =useState([]);
    const getAccount = async()=>{
      try {
          const res = await AxiosInstance.get("/identity/tk");
          console.log(res.data);
          setAccount(res.data);
      } catch (error) {
          console.error('Error fetching products:', error);
      }
  }
    const [selectedAccountIndex, setSelectedAccountIndex] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [openDialogResetMK, setOpenDialogResetMK] = useState(false);
    const [responseData, setResponseData] = useState(null);

    const handleRowClick = (index) => {
        if (selectedAccountIndex == index){
            setSelectedAccountIndex(null);
        }
        else{
            setSelectedAccountIndex(index);
        }
  };

  // Hàm xử lý khi ấn vào nút Edit
  const handleEdit = async() => {
    // Thực hiện hành động edit với thông tin của hàng được chọn
    if(selectedAccountIndex !== null) {
      const selectedAccount = account[selectedAccountIndex];
      try {
        const res = await AxiosInstance.put("/identity/tk/reset", {
            tenDangNhap: selectedAccount.tenDangNhap,
        });
        console.log(res.data);
        if(res.status === 200){
          setResponseData(res.data);
          setOpenDialogResetMK(true);
          enqueueSnackbar('Reset mật khẩu thành công', {
            variant: 'success',
            autoHideDuration: 3000, // Set thời gian hiển thị là 3 giây
          });

        }
        else{
          enqueueSnackbar('Lỗi', {
            variant: 'error',
            autoHideDuration: 3000, // Set thời gian hiển thị là 3 giây
          });
        }
        getAccount();
        setAccount((prevAccounts) =>
            prevAccounts.map((acc, index) =>
                index === selectedAccountIndex ? res.data : acc
            )
        );
      } catch (error) {
          console.error('Error updating account status:', error);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialogResetMK(false);
    setResponseData(null);
  };
  // Hàm xử lý khi ấn vào nút Delete
  const handleDelete = async () => {
    // Thực hiện hành động delete với thông tin của hàng được chọn
    if(selectedAccountIndex !== null) {
      const selectedAccount = account[selectedAccountIndex];
      try {
        const res = await AxiosInstance.put("/identity/tk", {
            tenDangNhap: selectedAccount.tenDangNhap,
            matKhau:selectedAccount.matKhau,
            trangThai: false
        });
        console.log(res.data);
        enqueueSnackbar('Khóa tài khoản thành công', {
          variant: 'success',
          autoHideDuration: 3000, // Set thời gian hiển thị là 3 giây
        });
        getAccount();
        setAccount((prevAccounts) =>
            prevAccounts.map((acc, index) =>
                index === selectedAccountIndex ? res.data : acc
            )
        );
    } catch (error) {
        console.error('Error updating account status:', error);
    }
    }
  };
  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleFormSubmit = (data) => {
    console.log("Form Data:", data);
    // Handle form submission
    handleDialogClose();
  };
  const handleUnlockAcc = async() =>{
    if(selectedAccountIndex !== null) {
      const selectedAccount = account[selectedAccountIndex];
      try {
        const res = await AxiosInstance.put("/identity/tk", {
            tenDangNhap: selectedAccount.tenDangNhap,
            matKhau:selectedAccount.matKhau,
            trangThai: true
        });
        console.log(res.data);
        enqueueSnackbar('Mở tài khoản thành công', {
          variant: 'success',
          autoHideDuration: 3000, // Set thời gian hiển thị là 3 giây
        });
        getAccount();
        setAccount((prevAccounts) =>
            prevAccounts.map((acc, index) =>
                index === selectedAccountIndex ? res.data : acc
            )
        );
    } catch (error) {
        console.error('Error updating account status:', error);
    }
    }
  }
  const ActionButtons = ({ onEdit, onDelete, isDisabled,onOpenDialog  }) => {
    return (
      <div>
        <Button variant="contained" color="success" style={{marginRight: '10px'}} onClick={onOpenDialog}>Đăng ký tài khoản</Button>
        <Button variant="contained" color="primary" style={{marginRight: '10px'}} onClick={onEdit} disabled={isDisabled}>Reset mật khẩu</Button>
        <Button variant="contained" color="secondary" style={{marginRight: '10px'}} onClick={handleUnlockAcc} disabled={isDisabled}>Mở tài khoản</Button>
        <Button variant="contained" color="error" onClick={onDelete} disabled={isDisabled}>Khóa tài khoản</Button>
      </div>
    );
  };
//   const handleDeselect = () => {
//     setSelectedUserIndex(null);
//   };
  useEffect(()=>{
    getAccount();
  },[])
  return (
    <>
        <SearchBar/>
        <ActionButtons onEdit={handleEdit} onDelete={handleDelete} onOpenDialog={handleDialogOpen} isDisabled={selectedAccountIndex === null}/>
        <RegistrationForm open={isDialogOpen} onClose={handleDialogClose} onSubmit={handleFormSubmit} />
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                    <TableCell>Tên đăng nhập</TableCell>
                    <TableCell>Quyền</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {account.map((acc, index) => (
                        <TableRow key={index}
                            onClick={() => handleRowClick(index)}
                           sx={{ 
                                  backgroundColor: selectedAccountIndex === index ? "#f0f0f0" : acc.trangThai ? '#C8E6C9' : '#FFCDD2'
                              }}
                        >
                            <TableCell>{acc.tenDangNhap}</TableCell>
                            <TableCell>{acc.quyen}</TableCell>
                            <TableCell>{acc.trangThai? "Hoạt đông" : "Ngưng"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            {/* <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
        </Paper>
        <Dialog open={openDialogResetMK} onClose={handleCloseDialog}>
        <DialogTitle>Thông tin mới</DialogTitle>
        <DialogContent>
          {responseData && (
            <div>
              <p>Mật khẩu reset: {responseData}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageAccount;





