import React,{ useState, useEffect, useRef} from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableHead, TableBody, TableCell, TableRow, TableContainer, Paper } from '@mui/material';
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

const AddTypeForm = ({ open, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm chi loại sản phẩm mới</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <TextField
            margin="dense"
            label="Tên loại sản phẩm"
            fullWidth
            {...register("tenLoaiSanPham", { required: true })}
            error={!!errors.ho}
            helperText={errors.ho ? "Tên loại sản phẩm là bắt buộc là bắt buộc" : ""}
          />
          
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit(handleFormSubmit)} variant="contained">Thêm mới</Button>
      </DialogActions>
    </Dialog>
  );
};

const EditTypeForm = ({ open, onClose, onSubmit, loai }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (loai) {
      setValue('tenLoaiSanPham', loai.tenLoaiSanPham);
      setValue('maLoaiSanPham', loai.maLoaiSanPham);
    }
  }, [loai, setValue]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };


  if (!loai) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sửa loại</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <TextField
            margin="dense"
            label="ID"
            value={loai.maLoaiSanPham}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            {...register('maLoaiSanPham', { required: true })}
            error={!!errors.maLoaiSanPham}
            helperText={errors.maLoaiSanPham ? "Mã chi nhánh là bắt buộc" : ""}
          />
          <TextField
            margin="dense"
            label="Tên chi nhánh"
            defaultValue={loai.tenLoaiSanPham}
            fullWidth
            error={!!errors.tenLoaiSanPham}
            helperText={errors.tenLoaiSanPham ? "Tên chi nhánh là bắt buộc" : ""}
            {...register('tenLoaiSanPham', { required: true })}
          />
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
      <DialogTitle>Xác nhận lập đơn</DialogTitle>
      <DialogContent>
        Bạn có chắc chắn muốn lập hóa đơn này không?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button onClick={onConfirm} variant="contained" color="error">Yes</Button>
      </DialogActions>
    </Dialog>
  );
};


const ManageAccount = () => {
    const [selectedTypeIndex, setSelectedTypeIndex] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const tableRef = useRef(null);
    const [loai, setLoai] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const getLoai = async ()=>{
      try{
        const res = await AxiosInstance.get("/center/loaisanpham")
        setLoai(res.data)
      }
      catch(err){
        console.error(err);
      }
    }
  // Assume pets data is available in pets array
  // const chiNhanh = [
  //   {maChiNhanh: 1, tenChiNhanh: "Man thiện"},
  //   {maChiNhanh: 2, tenChiNhanh: "Trần Thị Hoa"}
  // ]
// Hàm xử lý khi chọn một hàng
    const handleConfirmDelete = async (loai) => {
      console.log(loai.maLoaiSanPham)
      try {
          const res = await AxiosInstance.delete(`/center/loaisanpham/${loai.maLoaiSanPham}`);
          if (res.status === 200) {
              enqueueSnackbar('Lập đợn thành công', { variant: 'success', autoHideDuration: 3000 });
              getLoai();
          }
      } catch (err) {
          enqueueSnackbar('Lỗi khi lập đơn', { variant: 'error', autoHideDuration: 3000 });
          console.error(err);
      }
      setIsConfirmOpen(false);
      setSelectedTypeIndex(null);
    };
    const handleRowClick = (index) => {
        if (selectedTypeIndex == index){
            setSelectedTypeIndex(null);
        }
        else{
            setSelectedTypeIndex(index);
        }
  };

  // Hàm xử lý khi ấn vào nút Edit
  const handleEdit = () => {
    // Thực hiện hành động edit với thông tin của hàng được chọn
    if(selectedTypeIndex !== null) {
      const selectedPet = pets[selectedTypeIndex];
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
    const tenLoaiSanPham = data.tenLoaiSanPham.replace("\"","");
    try{
      const res = await AxiosInstance.post("/center/loaisanpham", tenLoaiSanPham,{
        headers:{
          'Content-Type':'text/plain'
        }
      })
      if(res.status === 200){
        enqueueSnackbar('Thêm loại sản phẩm thành công', {variant : 'success', autoHideDuration: 3000} )
        getLoai()
      }
    }
    catch(err){
      enqueueSnackbar('Lỗi', {variant : 'error', autoHideDuration: 3000} )
      console.log(err)
    }
    handleDialogClose();
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
      const res = await AxiosInstance.put("/center/loaisanpham", data)
      if(res.status === 200){
        enqueueSnackbar('sửa loại sản phẩm thành công', {variant : 'success', autoHideDuration: 3000} )
        getLoai()
      }
    }
    catch(err){
      enqueueSnackbar('lỗi', {variant : 'success', autoHideDuration: 3000} )
      getLoai()
    }
    handleEditDialogClose();
  };
  const ActionButtons = ({ onEdit, onDelete, isDisabled,onOpenDialog,onOpenEditForm  }) => {
    return (
      <div>
        <Button variant="contained" color="primary" style={{marginRight: '10px'}} onClick={onOpenDialog}>Thêm</Button>
        <Button variant="contained" color="primary" style={{marginRight: '10px'}} onClick={onOpenEditForm} disabled={isDisabled}>Sửa</Button>
        <Button variant="contained" color="error" onClick={onDelete} disabled={isDisabled}>Xóa</Button>
      </div>
    );
  };
  useEffect(()=>{
    getLoai();
  },[])
  return (
    <>
        <SearchBar/>
        <ActionButtons onEdit={handleEdit} onDelete={handleDelete} onOpenDialog={handleDialogOpen} onOpenEditForm = {handleEditDialogOpen} isDisabled={selectedTypeIndex === null}/>
        <AddTypeForm open={isDialogOpen} onClose={handleDialogClose} onSubmit={handleFormSubmit} />
        <EditTypeForm open={isEditOpen} onClose={handleEditDialogClose} onSubmit={handleEditFormSubmit} loai = {loai[selectedTypeIndex]} />
        <ConfirmationDialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={()=>handleConfirmDelete(loai[selectedTypeIndex])} />
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }} ref={tableRef}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>Mã loại sản phẩm</TableCell>
                        <TableCell>Tên loại sản phẩm</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loai.map((loai, index) => (
                        <TableRow key={index}
                            onClick={() => handleRowClick(index)}
                            sx={{ backgroundColor: selectedTypeIndex === index ? "#f0f0f0" : "inherit" }}
                        >
                            <TableCell>{loai.maLoaiSanPham}</TableCell>
                            <TableCell>{loai.tenLoaiSanPham}</TableCell>          
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





