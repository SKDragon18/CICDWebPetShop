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

const AddPetForm = ({ open, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm loài thú cưng mới</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <TextField
            margin="dense"
            label="Tên loài thú cưng"
            fullWidth
            {...register("tenLoaiThuCung", { required: true })}
            error={!!errors.tenLoaiThuCung}
            helperText={errors.tenLoaiThuCung ? "Tên loài thú cưng là bắt buộc" : ""}
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

const EditPetForm = ({ open, onClose, onSubmit, pet }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (pet) {
      setValue('tenLoaiThuCung', pet.tenLoaiThuCung);
      setValue('maLoaiThuCung', pet.maLoaiThuCung);
    }
  }, [pet, setValue]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  if (!pet) {
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
            value={pet.maLoaiThuCung}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            {...register('maLoaiThuCung', { required: true })}
            error={!!errors.maChiNhanh}
            helperText={errors.maChiNhanh ? "Mã loại thú cưng là bắt buộc" : ""}
          />
          <TextField
            margin="dense"
            label="Tên loại thú cưng"
            defaultValue={pet.tenLoaiThuCung}
            fullWidth
            error={!!errors.tenLoaiThuCung}
            helperText={errors.tenLoaiThuCung ? "Tên loại thú cưng là bắt buộc" : ""}
            {...register('tenLoaiThuCung', { required: true })}
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
    const [selectedPetIndex, setSelectedPetIndex] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const tableRef = useRef(null);
    const [pet, setPet] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const getPet = async ()=>{
      try{
        const res = await AxiosInstance.get("/center/loaithucung")
        setPet(res.data)
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
    const handleConfirmDelete = async (pet) => {
      try {
          const res = await AxiosInstance.delete(`/center/loaithucung/${pet.maLoaiThuCung}`);
          if (res.status === 200) {
              enqueueSnackbar('Xóa loại thú cưng thành công', { variant: 'success', autoHideDuration: 3000 });
              getPet();
          }
      } catch (err) {
          enqueueSnackbar('Lỗi khi xóa thú cưng', { variant: 'error', autoHideDuration: 3000 });
          console.error(err);
      }
      setIsConfirmOpen(false);
      setSelectedPetIndex(null);
    };
    const handleRowClick = (index) => {
        if (selectedPetIndex == index){
            setSelectedPetIndex(null);
        }
        else{
            setSelectedPetIndex(index);
        }
  };

  // Hàm xử lý khi ấn vào nút Edit
  const handleEdit = () => {
    // Thực hiện hành động edit với thông tin của hàng được chọn
    if(selectedPetIndex !== null) {
      const selectedPet = pets[selectedPetIndex];
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
    const tenLoaiThuCung = data.tenLoaiThuCung.replace("\"","");
    try{
      const res = await AxiosInstance.post("/center/loaithucung", tenLoaiThuCung,{
        headers:{
          'Content-Type':'text/plain'
        }
      })
      if(res.status === 200){
        enqueueSnackbar('Thêm loài thú cưng thành công', {variant : 'success', autoHideDuration: 3000} )
        getPet()
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
      const res = await AxiosInstance.put("/center/loaithucung", data)
      if(res.status === 200){
        enqueueSnackbar(' sửa loại thú cưng thành công', {variant : 'success', autoHideDuration: 3000} )
        getPet()
      }
    }
    catch(err){
      enqueueSnackbar('lỗi', {variant : 'success', autoHideDuration: 3000} )
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
    getPet();
  },[])
  return (
    <>
        <SearchBar/>
        <ActionButtons onEdit={handleEdit} onDelete={handleDelete} onOpenDialog={handleDialogOpen} onOpenEditForm = {handleEditDialogOpen} isDisabled={selectedPetIndex === null}/>
        <AddPetForm open={isDialogOpen} onClose={handleDialogClose} onSubmit={handleFormSubmit} />
        <EditPetForm open={isEditOpen} onClose={handleEditDialogClose} onSubmit={handleEditFormSubmit} pet = {pet[selectedPetIndex]} />
        <ConfirmationDialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={()=>handleConfirmDelete(pet[selectedPetIndex])} />
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }} ref={tableRef}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>Mã loại thú cưng</TableCell>
                        <TableCell>Tên loại thú cưng</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pet.map((pet, index) => (
                        <TableRow key={index}
                            onClick={() => handleRowClick(index)}
                            sx={{ backgroundColor: selectedPetIndex === index ? "#f0f0f0" : "inherit" }}
                        >
                            <TableCell>{pet.maLoaiThuCung}</TableCell>
                            <TableCell>{pet.tenLoaiThuCung}</TableCell>          
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





