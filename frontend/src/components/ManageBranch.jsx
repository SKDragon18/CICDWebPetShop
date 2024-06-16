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

const AddBrandForm = ({ open, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm chi nhánh mới</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <TextField
            margin="dense"
            label="Tên chi nhánh"
            fullWidth
            {...register("tenChiNhanh", { required: true })}
            error={!!errors.tenChiNhanh}
            helperText={errors.tenChiNhanh ? "Tên chi nhánh là bắt buộc" : ""}
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

const EditBrandForm = ({ open, onClose, onSubmit, chiNhanh }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      tenChiNhanh: chiNhanh ? chiNhanh.tenChiNhanh : '',
    }
  });

  useEffect(() => {
    if (chiNhanh) {
      setValue('tenChiNhanh', chiNhanh.tenChiNhanh);
      setValue('maChiNhanh', chiNhanh.maChiNhanh);
    }
  }, [chiNhanh, setValue]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  const handleTenChiNhanhChange = (event) => {
    console.log("Input value changed:", event.target.value);
    setValue('tenChiNhanh', event.target.value);
  };

  if (!chiNhanh) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sửa chi nhánh</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <TextField
            margin="dense"
            label="ID"
            value={chiNhanh.maChiNhanh}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            {...register('maChiNhanh', { required: true })}
            error={!!errors.maChiNhanh}
            helperText={errors.maChiNhanh ? "Mã chi nhánh là bắt buộc" : ""}
          />
          <TextField
            margin="dense"
            label="Tên chi nhánh"
            defaultValue={chiNhanh.tenChiNhanh}
            fullWidth
            error={!!errors.tenChiNhanh}
            helperText={errors.tenChiNhanh ? "Tên chi nhánh là bắt buộc" : ""}
            {...register('tenChiNhanh', { required: true })}
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
      <DialogTitle>Xác nhận xóa</DialogTitle>
      <DialogContent>
        Bạn có chắc chắn muốn xóa chi nhánh này không?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button onClick={onConfirm} variant="contained" color="error">Yes</Button>
      </DialogActions>
    </Dialog>
  );
};


const ManageAccount = () => {
    const [selectedbranchIndex, setSelectedbranchIndex] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const tableRef = useRef(null);
    const [chiNhanh, setChiNhanh] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const getChiNhanh = async ()=>{
      try{
        const res = await AxiosInstance.get("/center/chinhanh")
        setChiNhanh(res.data)
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
    const handleConfirmDelete = async (chiNhanh) => {
      console.log(chiNhanh.maChiNhanh)
      try {
          const res = await AxiosInstance.delete(`/center/chinhanh/${chiNhanh.maChiNhanh}`);
          if (res.status === 200) {
              enqueueSnackbar('Xóa chi nhánh thành công', { variant: 'success', autoHideDuration: 3000 });
              getChiNhanh();
          }
      } catch (err) {
          enqueueSnackbar('Lỗi khi xóa chi nhánh', { variant: 'error', autoHideDuration: 3000 });
          console.error(err);
      }
      setIsConfirmOpen(false);
      setSelectedbranchIndex(null);
    };
    const handleRowClick = (index) => {
        if (selectedbranchIndex == index){
            setSelectedbranchIndex(null);
        }
        else{
            setSelectedbranchIndex(index);
        }
  };

  // Hàm xử lý khi ấn vào nút Edit
  const handleEdit = () => {
    // Thực hiện hành động edit với thông tin của hàng được chọn
    if(selectedbranchIndex !== null) {
      const selectedPet = pets[selectedbranchIndex];
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
    const chinhanh = data.tenChiNhanh.replace("\"","");
    console.log(chinhanh)
    try{
      const res = await AxiosInstance.post("/center/chinhanh", chinhanh,{
        headers:{
          'Content-Type':'text/plain'
        }
      })
      if(res.status === 200){
        enqueueSnackbar('Thêm chi nhánh thành công', {variant : 'success', autoHideDuration: 3000} )
        getChiNhanh()
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
      const res = await AxiosInstance.put("/center/chinhanh", data)
      if(res.status === 200){
        enqueueSnackbar(' sửa chi nhánh thành công', {variant : 'success', autoHideDuration: 3000} )
        getChiNhanh()
      }
    }
    catch(err){
      enqueueSnackbar('lỗi', {variant : 'success', autoHideDuration: 3000} )
      getChiNhanh()
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
    getChiNhanh();
  },[])
  return (
    <>
        <SearchBar/>
        <ActionButtons onEdit={handleEdit} onDelete={handleDelete} onOpenDialog={handleDialogOpen} onOpenEditForm = {handleEditDialogOpen} isDisabled={selectedbranchIndex === null}/>
        <AddBrandForm open={isDialogOpen} onClose={handleDialogClose} onSubmit={handleFormSubmit} />
        <EditBrandForm open={isEditOpen} onClose={handleEditDialogClose} onSubmit={handleEditFormSubmit} chiNhanh = {chiNhanh[selectedbranchIndex]} />
        <ConfirmationDialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={()=>handleConfirmDelete(chiNhanh[selectedbranchIndex])} />
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }} ref={tableRef}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>Mã chi nhánh</TableCell>
                        <TableCell>Tên chi nhánh</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {chiNhanh.map((chiNhanh, index) => (
                        <TableRow key={index}
                            onClick={() => handleRowClick(index)}
                            sx={{ backgroundColor: selectedbranchIndex === index ? "#f0f0f0" : "inherit" }}
                        >
                            <TableCell>{chiNhanh.maChiNhanh}</TableCell>
                            <TableCell>{chiNhanh.tenChiNhanh}</TableCell>          
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





