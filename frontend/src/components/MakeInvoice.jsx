import React,{ useState, useEffect, useRef} from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableHead, TableBody, TableCell, TableRow, TableContainer, Paper,  Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
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

const AddBreedForm = ({ open, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedPet, setSelectedPet] = useState(null);
  const [pet, setPet] = useState([])
  const [error, setError] = useState(false);
  const handleFormSubmit = (data) => {
    if (!selectedPet) {
      setError('loaiThuCung', { type: 'required', message: 'Trường này là bắt buộc' });
      return;
    }
    onSubmit( {...data, loaiThuCung:selectedPet});
  };
  const getPet = async()=>{
    try{
      const res = await  AxiosInstance.get("center/loaithucung")
      setPet(res.data)
  }
  catch(err){
    console.error(err)
  }
  }
  useEffect(()=>{
    getPet()
  },[])

  const handlePetSelect = (event) => {
    const selectedPet = pet.find(i => i.maLoaiThuCung === event.target.value);
    setSelectedPet(selectedPet);
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm giống mới</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <TextField
            margin="dense"
            label="Tên giống mới"
            fullWidth
            {...register("tengiong", { required: true })}
            error={!!errors.tenLoaiThuCung}
            helperText={errors.tenLoaiThuCung ? "Tên loài thú cưng là bắt buộc" : ""}
          />
          <FormControl fullWidth error={error}>
            <InputLabel id="pet-select-label">Loại thú cưng</InputLabel>
                  <Select
                    labelId="pet-select-label"
                    value={selectedPet ? selectedPet.maLoaiThuCung : ''}
                    onChange={handlePetSelect}
                    required
                  >
                    {pet.map((i) => (
                      <MenuItem key={i.maLoaiThuCung} value={i.maLoaiThuCung}>
                        {i.tenLoaiThuCung}
                      </MenuItem>
                    ))}
                  </Select>
              {error && <FormHelperText>Trường này là bắt buộc</FormHelperText>}
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit(handleFormSubmit)} variant="contained">Thêm mới</Button>
      </DialogActions>
    </Dialog>
  );
};

const EditBreedForm = ({ open, onClose, onSubmit, breed }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [selectedPet, setSelectedPet] = useState(null);
  const [pet, setPet] = useState([])
  const [error, setError] = useState(false);
  const handleFormSubmit = (data) => {
    if (!selectedPet) {
      setError('loaiThuCung', { type: 'required', message: 'Trường này là bắt buộc' });
      return;
    }
    onSubmit( {...data, loaiThuCung:selectedPet});
  };
  const getPet = async()=>{
    try{
      const res = await  AxiosInstance.get("center/loaithucung")
      setPet(res.data)
  }
  catch(err){
    console.error(err)
  }
  }
  useEffect(()=>{
    if(!breed){
      return;
    }
    setValue('maGiong',breed.maGiong)
    setValue('tengiong', breed.tengiong)
    setSelectedPet(breed.loaiThuCung)
    getPet()
  },[breed])
  const handlePetSelect = (event) => {
    const selectedPet = pet.find(i => i.maLoaiThuCung === event.target.value);
    setSelectedPet(selectedPet);
  };
  if(!breed){
    return;
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sửa Giống</DialogTitle>
      <DialogContent>
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <TextField
            margin="dense"
            label="ID"
            fullWidth
            readOnly
            value={breed.maGiong}
            {...register("maGiong", { required: true })}
            error={!!errors.tenLoaiThuCung}
            helperText={errors.tenLoaiThuCung ? "Tên loài thú cưng là bắt buộc" : ""}
          />
          <TextField
            margin="dense"
            label="Tên giống mới"
            fullWidth
            defaultValue={breed.tengiong}
            {...register("tengiong", { required: true })}
            error={!!errors.tengiong}
            helperText={errors.tengiong ? "Tên giống là bắt buộc" : ""}
          />
          <FormControl fullWidth error={error}>
            <InputLabel id="pet-select-label">Loại thú cưng</InputLabel>
                  <Select
                    labelId="pet-select-label"
                    value={selectedPet ? selectedPet.maLoaiThuCung : ''}
                    onChange={handlePetSelect}
                    required
                  >
                    {pet.map((i) => (
                      <MenuItem key={i.maLoaiThuCung} value={i.maLoaiThuCung}>
                        {i.tenLoaiThuCung}
                      </MenuItem>
                    ))}
                  </Select>
              {error && <FormHelperText>Trường này là bắt buộc</FormHelperText>}
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit(handleFormSubmit)} variant="contained">Sửa</Button>
      </DialogActions>
    </Dialog>
  );
};

const ConfirmationDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận xóa</DialogTitle>
      <DialogContent>
        Bạn có chắc chắn muốn xóa giống này không?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button onClick={onConfirm} variant="contained" color="error">Yes</Button>
      </DialogActions>
    </Dialog>
  );
};


const ManageAccount = () => {
    const [selectedInvoiceIndex, setSelectedInvoiceIndex] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const tableRef = useRef(null);
    const [donDats, setDonDats] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const getDonDat = async ()=>{
      try{
        const res = await AxiosInstance.get("/order/don-dat")
        setDonDats(res.data)
      }
      catch(err){
        console.error(err);
      }
    }
    const handleConfirmDelete = async (donDat) => {
        const maNV = localStorage.getItem('tenDangNhap')
      try {
          const res = await AxiosInstance.post('/order/dat-hang/hoa-don',{
            "soHoaDon": donDat.soDonDat,
            "maNhanVien": maNV
          });
          if (res.status === 200) {
              enqueueSnackbar('thành công', { variant: 'success', autoHideDuration: 3000 });
              getDonDat();
          }
      } catch (err) {
          enqueueSnackbar('Lỗi', { variant: 'error', autoHideDuration: 3000 });
          console.error(err);
      }
      setIsConfirmOpen(false);
      setSelectedInvoiceIndex(null);
    };
    const handleRowClick = (index) => {
        if (selectedInvoiceIndex == index){
            setSelectedInvoiceIndex(null);
        }
        else{
            setSelectedInvoiceIndex(index);
        }
  };

  // Hàm xử lý khi ấn vào nút Edit
  const handleEdit = () => {
    // Thực hiện hành động edit với thông tin của hàng được chọn
    if(selectedInvoiceIndex !== null) {
      const selectedPet = pets[selectedInvoiceIndex];
      // Thực hiện hành động edit với selectedPet
      console.log("Edit pet:", selectedPet);
    }
  };

  // Hàm xử lý khi ấn vào nút Delete
  const handleDelete = () => {
      setIsConfirmOpen(true)
    
  };
  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleFormSubmit = async(data) => {
    console.log(data)
    // try{
    //   const res = await AxiosInstance.post("/center/giong", data,{ 
    //   })
    //   if(res.status === 200){
    //     enqueueSnackbar('Thêm giống thành công', {variant : 'success', autoHideDuration: 3000} )
    //     getBreed()
    //   }
    // }
    // catch(err){
    //   enqueueSnackbar('Lỗi', {variant : 'error', autoHideDuration: 3000} )
    //   console.log(err)
    // }
    // handleDialogClose();
  };
  const handleEditDialogOpen = () => {
    setIsEditOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditOpen(false);
  };

  const handleEditFormSubmit = async(data) => {
    console.log("Form Data:", data);
    try{
      const res = await AxiosInstance.put("/center/giong", data)
      if(res.status === 200){
        enqueueSnackbar(' sửa giống thành công', {variant : 'success', autoHideDuration: 3000} )
        getBreed()
      }
    }
    catch(err){
      enqueueSnackbar('lỗi', {variant : 'error', autoHideDuration: 3000} )
    }
    handleEditDialogClose();
  };
  const ActionButtons = ({ onEdit, onDelete, isDisabled,onOpenDialog,onOpenEditForm  }) => {
    if(selectedInvoiceIndex){
        isDisabled = donDats[selectedInvoiceIndex].trangThai
    }
    return (
      <div>
        <Button variant="contained" color="success" onClick={onDelete} disabled={isDisabled}>Hoàn thành</Button>
      </div>
    );
  };
  useEffect(()=>{
    getDonDat();
  },[])
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <>
        <SearchBar/>
        <EditBreedForm open={isEditOpen} onClose={handleEditDialogClose} onSubmit={handleEditFormSubmit} donDat = {donDats[selectedInvoiceIndex]} />
        <ActionButtons onEdit={handleEdit} onDelete={handleDelete} onOpenDialog={handleDialogOpen} onOpenEditForm = {handleEditDialogOpen} isDisabled={selectedInvoiceIndex === null}/>
        <ConfirmationDialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={()=>handleConfirmDelete(donDats[selectedInvoiceIndex])} />
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }} ref={tableRef}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>Số đơn đặt</TableCell>
                        <TableCell>Ngày lập</TableCell>
                        <TableCell>Địa chỉ</TableCell>
                        <TableCell>Số điện thoại</TableCell>
                        <TableCell>Mã chi nhánh</TableCell>
                        <TableCell>Mã khách hàng</TableCell>
                        <TableCell>trạng thái</TableCell>  
                    </TableRow>
                </TableHead>
                <TableBody>
                    {donDats.map((donDat, index) => (
                        <TableRow key={index}
                            onClick={() => handleRowClick(index)}
                            sx={{ backgroundColor: selectedInvoiceIndex === index ? "#f0f0f0" : "inherit" }}
                        >
                            <TableCell>{donDat.soDonDat}</TableCell>
                            <TableCell>{donDat.ngayLap? formatDate(donDat.ngayLap) : ""}</TableCell>
                            <TableCell>{donDat.diaChi}</TableCell>
                            <TableCell>{donDat.soDienThoai}</TableCell>
                            <TableCell>{donDat.maChiNhanh}</TableCell>
                            <TableCell>{donDat.maKhachhang}</TableCell>
                            <TableCell>{donDat.trangThai?"Hoàn thành":"Không hoàn thành"}</TableCell>     
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
    </>
  );
};

export default ManageAccount;





