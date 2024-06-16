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
    const [selectedBreedIndex, setSelectedBreedIndex] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const tableRef = useRef(null);
    const [breed, setBreed] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const getBreed = async ()=>{
      try{
        const res = await AxiosInstance.get("/center/giong")
        setBreed(res.data)
      }
      catch(err){
        console.error(err);
      }
    }
    const handleConfirmDelete = async (breed) => {
      try {
          const res = await AxiosInstance.delete(`/center/giong/${breed.maGiong}`);
          if (res.status === 200) {
              enqueueSnackbar('Xóa giống thành công', { variant: 'success', autoHideDuration: 3000 });
              getBreed();
          }
      } catch (err) {
          enqueueSnackbar('Lỗi khi xóa giống', { variant: 'error', autoHideDuration: 3000 });
          console.error(err);
      }
      setIsConfirmOpen(false);
      setSelectedBreedIndex(null);
    };
    const handleRowClick = (index) => {
        if (selectedBreedIndex == index){
            setSelectedBreedIndex(null);
        }
        else{
            setSelectedBreedIndex(index);
        }
  };

  // Hàm xử lý khi ấn vào nút Edit
  const handleEdit = () => {
    // Thực hiện hành động edit với thông tin của hàng được chọn
    if(selectedBreedIndex !== null) {
      const selectedPet = pets[selectedBreedIndex];
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
    try{
      const res = await AxiosInstance.post("/center/giong", data,{ 
      })
      if(res.status === 200){
        enqueueSnackbar('Thêm giống thành công', {variant : 'success', autoHideDuration: 3000} )
        getBreed()
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
    return (
      <div>
        <Button variant="contained" color="primary" style={{marginRight: '10px'}} onClick={onOpenDialog}>Thêm</Button>
        <Button variant="contained" color="primary" style={{marginRight: '10px'}} onClick={onOpenEditForm} disabled={isDisabled}>Sửa</Button>
        <Button variant="contained" color="error" onClick={onDelete} disabled={isDisabled}>Xóa</Button>
      </div>
    );
  };
  useEffect(()=>{
    getBreed();
  },[])
  return (
    <>
        <SearchBar/>
        <ActionButtons onEdit={handleEdit} onDelete={handleDelete} onOpenDialog={handleDialogOpen} onOpenEditForm = {handleEditDialogOpen} isDisabled={selectedBreedIndex === null}/>
        <AddBreedForm open={isDialogOpen} onClose={handleDialogClose} onSubmit={handleFormSubmit} />
        <EditBreedForm open={isEditOpen} onClose={handleEditDialogClose} onSubmit={handleEditFormSubmit} breed = {breed[selectedBreedIndex]} />
        <ConfirmationDialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={()=>handleConfirmDelete(breed[selectedBreedIndex])} />
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }} ref={tableRef}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>Mã giống</TableCell>
                        <TableCell>Tên giống</TableCell>
                        <TableCell>Mã loại thú cưng</TableCell>
                        <TableCell>Tên loại thú cưng</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {breed.map((breed, index) => (
                        <TableRow key={index}
                            onClick={() => handleRowClick(index)}
                            sx={{ backgroundColor: selectedBreedIndex === index ? "#f0f0f0" : "inherit" }}
                        >
                            <TableCell>{breed.maGiong}</TableCell>
                            <TableCell>{breed.tengiong}</TableCell> 
                            <TableCell>{breed.loaiThuCung.maLoaiThuCung}</TableCell>
                            <TableCell>{breed.loaiThuCung.tenLoaiThuCung}</TableCell>          
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





