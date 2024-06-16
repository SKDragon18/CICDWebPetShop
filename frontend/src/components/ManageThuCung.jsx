import React,{ useState, useEffect, useRef} from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableHead, TableBody, TableCell, TableRow, TableContainer, Paper,  Select, MenuItem, FormControl, InputLabel, FormHelperText, Box } from '@mui/material';
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

const AddThuCungForm = ({ open, onClose, onSubmit }) => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedBreed, setSelectedBreed] = useState('');
    const [branches, setBranches] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [formError, setFormError] = useState(false);
    const [selectedSaleStatus, setSelectedSaleStatus] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
     const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
     const handleFormSubmit = (data) => {
        if (!selectedBranch || !selectedBreed || selectedSaleStatus === '') {
          if (!selectedBranch) {
            setError('chiNhanh', { type: 'required', message: 'Trường này là bắt buộc' });
          }
          if (!selectedBreed) {
            setError('giong', { type: 'required', message: 'Trường này là bắt buộc' });
          }
          if (selectedSaleStatus === '') {
            setError('trangThaiBan', { type: 'required', message: 'Trường này là bắt buộc' });
          }
          setFormError(true);
          return;
        }
        // handle image upload if necessary
        const formData = new FormData();
        if (selectedImage) {
          formData.append('image', selectedImage);
        }
        onSubmit({ ...data, chiNhanh: selectedBranch, giong: selectedBreed, trangThaiBan: selectedSaleStatus, hinhAnh: formData });
      };
      const getBranches = async () => {
        try {
          const res = await AxiosInstance.get("center/chinhanh");
          setBranches(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      const getBreeds = async () => {
        try {
          const res = await AxiosInstance.get("center/giong");
          setBreeds(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      useEffect(() => {
        getBranches();
        getBreeds();
      }, []);
      const handleBranchSelect = (event) => {
        const selectedBranch = branches.find(i => i.maChiNhanh === event.target.value);
        setSelectedBranch(selectedBranch);
      };
    
      const handleBreedSelect = (event) => {
        const selectedBreed = breeds.find(i => i.maGiong === event.target.value);
        setSelectedBreed(selectedBreed);
      };
      const handleSaleStatusSelect = (event) => {
        setSelectedSaleStatus(event.target.value);
      };
      const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
        setImagePreviewUrl(URL.createObjectURL(file));
      };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Thêm hoặc Thú Cưng</DialogTitle>
      <DialogContent>
      <Box display="flex" alignItems="flex-start">
        <Box flex={1} pr={2}>
            <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <TextField
                margin="dense"
                label="Tên Thú Cưng"
                fullWidth
                {...register("tenThuCung", { required: true })}
                error={!!errors.tenThuCung}
                helperText={errors.tenThuCung ? "Tên thú cưng là bắt buộc" : ""}
            />
            <TextField
                margin="dense"
                label="Chủ"
                fullWidth
                {...register("chu", { required: true })}
                error={!!errors.chu}
                helperText={errors.chu ? "Chủ thú cưng là bắt buộc" : ""}
            />
            <FormControl fullWidth error={!!errors.chiNhanh} margin="dense">
                <InputLabel id="branch-select-label">Chi Nhánh</InputLabel>
                <Select
                labelId="branch-select-label"
                value={selectedBranch ? selectedBranch.maChiNhanh : ''}
                onChange={handleBranchSelect}
                required
                >
                {branches.map((i) => (
                    <MenuItem key={i.maChiNhanh} value={i.maChiNhanh}>
                    {i.tenChiNhanh}
                    </MenuItem>
                ))}
                </Select>
                {errors.chiNhanh && <FormHelperText>Trường này là bắt buộc</FormHelperText>}
            </FormControl>
            <FormControl fullWidth error={!!errors.giong} margin="dense">
                <InputLabel id="breed-select-label">Giống</InputLabel>
                <Select
                labelId="breed-select-label"
                value={selectedBreed ? selectedBreed.maGiong : ''}
                onChange={handleBreedSelect}
                required
                >
                {breeds.map((i) => (
                    <MenuItem key={i.maGiong} value={i.maGiong}>
                    {i.tengiong}
                    </MenuItem>
                ))}
                </Select>
                {errors.giong && <FormHelperText>Trường này là bắt buộc</FormHelperText>}
            </FormControl>
            <FormControl fullWidth error={!!errors.trangThaiBan} margin="dense">
                <InputLabel id="sale-status-select-label">Trạng Thái Bán</InputLabel>
                <Select
                labelId="sale-status-select-label"
                value={selectedSaleStatus}
                onChange={handleSaleStatusSelect}
                required
                >
                <MenuItem value={0}>Chưa bán</MenuItem>
                <MenuItem value={1}>Đã bán</MenuItem>
                </Select>
                {errors.trangThaiBan && <FormHelperText>Trường này là bắt buộc</FormHelperText>}
            </FormControl>
            <TextField
                margin="dense"
                label="Mô Tả"
                fullWidth
                {...register("moTa")}
                multiline
                rows={4}
            />
            <TextField
                margin="dense"
                label="Giá Hiện Tại"
                fullWidth
                {...register("giaHienTai", { required: true, valueAsNumber: true })}
                error={!!errors.giaHienTai}
                helperText={errors.giaHienTai ? "Giá hiện tại là bắt buộc" : ""}
                type="number"
            />
            <FormControl fullWidth margin="dense">
                <input
                accept="image/*"
                id="image-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                <Button variant="contained" component="span">
                    Chọn Hình Ảnh
                </Button>
                </label>
                </FormControl>
            </form>
        </Box>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" pl={2}>
                {imagePreviewUrl && (
                <img src={imagePreviewUrl} alt="Preview" style={{ maxHeight: '200px', maxWidth: '100%' }} />
                )}
            </Box>
      </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit(handleFormSubmit)} variant="contained">Thêm</Button>
      </DialogActions>
    </Dialog>
  );
};

const EditThuCungForm = ({ open, onClose, onSubmit, pet }) => {
  const { register, handleSubmit,setValue, setError, formState: { errors } } = useForm();
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedBreed, setSelectedBreed] = useState('');
    const [branches, setBranches] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [formError, setFormError] = useState(false);
    const [selectedSaleStatus, setSelectedSaleStatus] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

     const base64ToBlob = (base64, mime) => {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: mime });
    };
    const getHinhAnh = async (id) => {
      try {
          const res = await AxiosInstance.post("/center/hinhanh/get", [id]);
          if (res.status === 200) {
            const base64Image = res.data[0].source;
            const blob = base64ToBlob(base64Image, 'image/jpeg');
            const imageUrl = URL.createObjectURL(blob);
            return imageUrl;
          }
      } catch (e) {
          console.log(e);
      }
      return null;
  }
     const handleFormSubmit = (data) => {
        if (!selectedBranch || !selectedBreed || selectedSaleStatus === '') {
          if (!selectedBranch) {
            setError('chiNhanh', { type: 'required', message: 'Trường này là bắt buộc' });
          }
          if (!selectedBreed) {
            setError('giong', { type: 'required', message: 'Trường này là bắt buộc' });
          }
          if (selectedSaleStatus === '') {
            setError('trangThaiBan', { type: 'required', message: 'Trường này là bắt buộc' });
          }
          setFormError(true);
          return;
        }
        // handle image upload if necessary
        const formData = new FormData();
        if (selectedImage) {
          formData.append('image', selectedImage);
        }
        onSubmit({ ...data, chiNhanh: selectedBranch, giong: selectedBreed, trangThaiBan: selectedSaleStatus, hinhAnh: formData });
      };
      const getBranches = async () => {
        try {
          const res = await AxiosInstance.get("center/chinhanh");
          setBranches(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      const getBreeds = async () => {
        try {
          const res = await AxiosInstance.get("center/giong");
          setBreeds(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      useEffect(() => {
        getBranches();
        getBreeds();
      }, []);
      const handleBranchSelect = (event) => {
        const selectedBranch = branches.find(i => i.maChiNhanh === event.target.value);
        setSelectedBranch(selectedBranch);
      };
    
      const handleBreedSelect = (event) => {
        const selectedBreed = breeds.find(i => i.maGiong === event.target.value);
        setSelectedBreed(selectedBreed);
      };
      const handleSaleStatusSelect = (event) => {
        setSelectedSaleStatus(event.target.value);
      };
      const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
        console.log(URL.createObjectURL(file))
        setImagePreviewUrl(URL.createObjectURL(file));
      };
      useEffect(()=>{
        if(!pet){
          return;
        }
        setValue('maThuCung',pet.maThuCung)
        setValue('tenThuCung', pet.tenThuCung)
        setValue('chu', pet.chu)
        setSelectedBranch(pet.chiNhanh)
        setSelectedBreed(pet.giong)
        setSelectedSaleStatus(pet.trangThaiBan)
        setValue('moTa',pet.moTa)
        setValue('giaHienTai', pet.giaHienTai)
        setValue('soLuongTon',pet.soLuongTon)
        setImagePreviewUrl('');
      },[pet])
      useEffect(() => {
        if(!pet){
          return
        }
        const fetchImageUrls = async () => {
            const urls = {};
              if (pet.hinhAnh && pet.hinhAnh[0]) {
                  const imageUrl = await getHinhAnh(pet.hinhAnh[0]);
                  if (imageUrl) {
                      urls[pet.hinhAnh[0]] = imageUrl;
                      setImagePreviewUrl(imageUrl);
                  }
              }
    
        };
      
        fetchImageUrls();
      }, [pet]);
      if(!pet){
        return;
      }
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Chỉnh sửa Thú Cưng</DialogTitle>
      <DialogContent>
      <Box display="flex" alignItems="flex-start">
        <Box flex={1} pr={2}>
            <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <TextField
                margin="dense"
                label="Mã thú cưng"
                fullWidth
                {...register("maThuCung", { required: true })}
                readOnly
            />
            <TextField
                margin="dense"
                label="Tên Thú Cưng"
                defaultValue={pet.tenThuCung}
                fullWidth
                {...register("tenThuCung", { required: true })}
                error={!!errors.tenThuCung}
                helperText={errors.tenThuCung ? "Tên thú cưng là bắt buộc" : ""}
            />
            <TextField
                margin="dense"
                label="Chủ"
                fullWidth
                defaultValue={pet.chu}
                {...register("chu", { required: true })}
                error={!!errors.chu}
                helperText={errors.chu ? "Chủ thú cưng là bắt buộc" : ""}
            />
            <FormControl fullWidth error={!!errors.chiNhanh} margin="dense">
                <InputLabel id="branch-select-label">Chi Nhánh</InputLabel>
                <Select
                labelId="branch-select-label"
                value={selectedBranch ? selectedBranch.maChiNhanh : ''}
                onChange={handleBranchSelect}
                required
                defaultValue={pet.maChiNhanh}
                >
                {branches.map((i) => (
                    <MenuItem key={i.maChiNhanh} value={i.maChiNhanh}>
                    {i.tenChiNhanh}
                    </MenuItem>
                ))}
                </Select>
                {errors.chiNhanh && <FormHelperText>Trường này là bắt buộc</FormHelperText>}
            </FormControl>
            <FormControl fullWidth error={!!errors.giong} margin="dense">
                <InputLabel id="breed-select-label">Giống</InputLabel>
                <Select
                labelId="breed-select-label"
                value={selectedBreed ? selectedBreed.maGiong : ''}
                onChange={handleBreedSelect}
                required
                defaultValue={pet.maGiong}
                >
                {breeds.map((i) => (
                    <MenuItem key={i.maGiong} value={i.maGiong}>
                    {i.tengiong}
                    </MenuItem>
                ))}
                </Select>
                {errors.giong && <FormHelperText>Trường này là bắt buộc</FormHelperText>}
            </FormControl>
            <FormControl fullWidth error={!!errors.trangThaiBan} margin="dense">
                <InputLabel id="sale-status-select-label">Trạng Thái Bán</InputLabel>
                <Select
                labelId="sale-status-select-label"
                value={selectedSaleStatus}
                onChange={handleSaleStatusSelect}
                required
                defaultValue={pet.trangThaiBan}
                >
                <MenuItem value={0}>Chưa bán</MenuItem>
                <MenuItem value={1}>Đã bán</MenuItem>
                </Select>
                {errors.trangThaiBan && <FormHelperText>Trường này là bắt buộc</FormHelperText>}
            </FormControl>
            <TextField
                margin="dense"
                label="Mô Tả"
                defaultValue={pet.moTa}
                fullWidth
                {...register("moTa")}
                multiline
                rows={4}
            />
            <TextField
                margin="dense"
                label="Giá Hiện Tại"
                fullWidth
                defaultValue={pet.giaHienTai}
                {...register("giaHienTai", { required: true, valueAsNumber: true })}
                error={!!errors.giaHienTai}
                helperText={errors.giaHienTai ? "Giá hiện tại là bắt buộc" : ""}
                type="number"
            />
            <TextField
                margin="dense"
                label="Số lượng tồn"
                fullWidth
                defaultValue={pet.soLuongTon}
                {...register("soLuongTon", { required: true, valueAsNumber: true })}
                error={!!errors.soLuongTon}
                helperText={errors.soLuongTon ? "Số lượng tồn là bắt buộc" : ""}
                type="number"
            />
            <FormControl fullWidth margin="dense">
                <input
                accept="image/*"
                id="image-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                <Button variant="contained" component="span">
                    Chọn Hình Ảnh
                </Button>
                </label>
                </FormControl>
            </form>
        </Box>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" pl={2}>
                {imagePreviewUrl && (
                <img src={imagePreviewUrl} alt="Preview" style={{ maxHeight: '200px', maxWidth: '100%' }} />
                )}
            </Box>
      </Box>
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
        Bạn có chắc chắn muốn xóa thú cưng này không?
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
    const [pets, setPets] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const [imageUrls, setImageUrls] = useState({});
    const getBreed = async ()=>{
      try{
        const res = await AxiosInstance.get("/center/thucung")
        setPets(res.data)
      }
      catch(err){
        console.error(err);
      }
    }
    const handleConfirmDelete = async (pet) => {
      try {
          const res = await AxiosInstance.delete(`/center/thucung/${pet.maThuCung}`);
          if (res.status === 200) {
              enqueueSnackbar('Xóa thú cưng thành công', { variant: 'success', autoHideDuration: 3000 });
              getBreed();
          }
      } catch (err) {
          enqueueSnackbar('Lỗi khi xóa thú cưng', { variant: 'error', autoHideDuration: 3000 });
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

    const { hinhAnh, ...rest } = data;
    console.log(hinhAnh.get('image'));
    try{
      const res = await AxiosInstance.post("/center/thucung", rest)
      if(res.status === 200){
       try{
        console.log(res.data.maThuCung)
        const pushimage = await AxiosInstance.post("/center/image", {
          "image":hinhAnh.get('image'),
          "maThuCung": res.data.maThuCung
        },{
          headers: {
              'Content-Type': 'multipart/form-data',
            },
        })
        if(pushimage.status === 200){
          enqueueSnackbar('Thêm thú cưng thành công', {variant : 'success', autoHideDuration: 3000} )
          getBreed()
        }
      }
      catch(e){
        enqueueSnackbar('Lỗi khi đẩy ảnh lên', {variant : 'error', autoHideDuration: 3000} )
        console.log(e)
        getBreed()
      }
      }
    }
    catch(err){
      enqueueSnackbar('Lỗi thêm thú cưng', {variant : 'error', autoHideDuration: 3000} )
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
    const { hinhAnh, ...rest } = data;
    if(hinhAnh.get('image')){
      try{
        const res = await AxiosInstance.put("/center/thucung", rest)
        if(res.status === 200){
          try{
            const pushimage = await AxiosInstance.post("/center/image", {
              "image":hinhAnh.get('image'),
              "maThuCung": res.data.maThuCung
            },{
              headers: {
                  'Content-Type': 'multipart/form-data',
                },
            })
            if(pushimage.status === 200){
              enqueueSnackbar('Sửa thú cưng thành công', {variant : 'success', autoHideDuration: 3000} )
              getBreed()
            }
          }
          catch(e){
            console.log(e)
            enqueueSnackbar('Lỗi đẩy ảnh', {variant : 'error', autoHideDuration: 3000} )
          }
        }
      }
      catch(err){
        console.log(err)
        enqueueSnackbar('Lỗi cập nhập thú cưng', {variant : 'error', autoHideDuration: 3000} )
      }
    }
    else{
      try{
        const res = await AxiosInstance.put("/center/thucung", rest)
        if(res.status === 200){
          enqueueSnackbar(' sửa thú cưng thành công', {variant : 'success', autoHideDuration: 3000} )
          getBreed()
        }
      }
      catch(err){
        console.log(err)
        enqueueSnackbar('Lỗi cập nhập thú cưng', {variant : 'error', autoHideDuration: 3000} )
      }
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
  const base64ToBlob = (base64, mime) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
  };
  const getHinhAnh = async (id) => {
    try {
        const res = await AxiosInstance.post("/center/hinhanh/get", [id]);
        if (res.status === 200) {
          const base64Image = res.data[0].source;
          const blob = base64ToBlob(base64Image, 'image/jpeg');
          const imageUrl = URL.createObjectURL(blob);
          return imageUrl;
        }
    } catch (e) {
        // console.log(e);
    }
    return null;
}
useEffect(() => {
  const fetchImageUrls = async () => {
      const urls = {};
      for (const pet of pets) {
          if (pet.hinhAnh) {
              for (const i in pet.hinhAnh){
                const imageUrl = await getHinhAnh(pet.hinhAnh[i]);
                if (imageUrl) {
                  urls[pet.hinhAnh[i]] = imageUrl;
                }
              }
          }
      }
      setImageUrls(urls);
  };

  fetchImageUrls();
}, [pets]);

  useEffect(()=>{
    getBreed();
    console.log(pets)
  },[])
  return (
    <>
        <SearchBar/>
        <ActionButtons onEdit={handleEdit} onDelete={handleDelete} onOpenDialog={handleDialogOpen} onOpenEditForm = {handleEditDialogOpen} isDisabled={selectedBreedIndex === null}/>
        <AddThuCungForm open={isDialogOpen} onClose={handleDialogClose} onSubmit={handleFormSubmit} />
        <EditThuCungForm open={isEditOpen} onClose={handleEditDialogClose} onSubmit={handleEditFormSubmit} pet = {pets[selectedBreedIndex]} /> 
        <ConfirmationDialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={()=>handleConfirmDelete(pets[selectedBreedIndex])} />
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }} ref={tableRef}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>Mã thú cưng</TableCell>
                        <TableCell>Hình ảnh</TableCell>
                        <TableCell>Tên thú cưng</TableCell>
                        <TableCell>Trạng thái bán</TableCell>
                        <TableCell>Chủ</TableCell>
                        <TableCell>Mô tả</TableCell>
                        <TableCell>Giá</TableCell>
                        <TableCell>Giá khuyến mãi</TableCell>
                        <TableCell>Chi nhánh</TableCell>
                        <TableCell>Giống</TableCell>
                        <TableCell>Số lượng tồn</TableCell>        
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pets.map((pet, index) => (
                        <TableRow key={index}
                            onClick={() => handleRowClick(index)}
                            sx={{ backgroundColor: selectedBreedIndex === index ? "#f0f0f0" : "inherit" }}
                        >
                            <TableCell>{pet.maThuCung}</TableCell>
                            <TableCell> {pet.hinhAnh ? (
                              <div style={{ maxWidth: 150, maxHeight: 150 }}>
                                <img src={imageUrls[pet.hinhAnh[pet.hinhAnh.length-1]]} alt="Example" style={{ width: '100%', height: '100%' }} />
                              </div>
                                  
                                ) : ''}</TableCell>
                            <TableCell>{pet.tenThuCung}</TableCell>
                            <TableCell>{pet.trangThaiBan}</TableCell>
                            <TableCell>{pet.chu}</TableCell>
                            <TableCell>{pet.moTa}</TableCell>
                            <TableCell>{pet.giaHienTai}</TableCell>
                            <TableCell>{pet.giaKM}</TableCell>
                            <TableCell>{pet.chiNhanh.tenChiNhanh}</TableCell>
                            <TableCell>{pet.giong.tengiong}</TableCell>
                            <TableCell>{pet.soLuongTon}</TableCell>           
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





