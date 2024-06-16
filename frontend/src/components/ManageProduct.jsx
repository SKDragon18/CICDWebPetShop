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

const AddSanPhamForm = ({ open, onClose, onSubmit }) => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [branches, setBranches] = useState([]);
    const [Types, setTypes] = useState([]);
    const [formError, setFormError] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
     const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
     const handleFormSubmit = (data) => {
        if (!selectedBranch || !selectedType) {
          if (!selectedBranch) {
            setError('chiNhanh', { type: 'required', message: 'Trường này là bắt buộc' });
          }
          if (!selectedType) {
            setError('giong', { type: 'required', message: 'Trường này là bắt buộc' });
          }
          setFormError(true);
          return;
        }
        // handle image upload if necessary
        const formData = new FormData();
        if (selectedImage) {
          formData.append('image', selectedImage);
        }
        onSubmit({ ...data, maChiNhanh: selectedBranch.maChiNhanh, loaiSanPham: selectedType, hinhAnh: formData });
      };
      const getBranches = async () => {
        try {
          const res = await AxiosInstance.get("center/chinhanh");
          setBranches(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      const getTypes = async () => {
        try {
          const res = await AxiosInstance.get("center/loaisanpham");
          setTypes(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      useEffect(() => {
        getBranches();
        getTypes();
      }, []);
      const handleBranchSelect = (event) => {
        const selectedBranch = branches.find(i => i.maChiNhanh === event.target.value);
        setSelectedBranch(selectedBranch);
      };
    
      const handleTypeSelect = (event) => {
        const selectedType = Types.find(i => i.maLoaiSanPham === event.target.value);
        setSelectedType(selectedType);
      };
      const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
        setImagePreviewUrl(URL.createObjectURL(file));
      };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Thêm sản phẩm</DialogTitle>
      <DialogContent>
      <Box display="flex" alignItems="flex-start">
        <Box flex={1} pr={2}>
            <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <TextField
                margin="dense"
                label="Tên sản phẩm"
                fullWidth
                {...register("tenSanPham", { required: true })}
                error={!!errors.tenThuCung}
                helperText={errors.tenThuCung ? "Tên thú cưng là bắt buộc" : ""}
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
                <InputLabel id="breed-select-label">Loại sản phẩm</InputLabel>
                <Select
                labelId="breed-select-label"
                value={selectedType ? selectedType.maLoaiSanPham : ''}
                onChange={handleTypeSelect}
                required
                >
                {Types.map((i) => (
                    <MenuItem key={i.maLoaiSanPham} value={i.maLoaiSanPham}>
                    {i.tenLoaiSanPham}
                    </MenuItem>
                ))}
                </Select>
                {errors.giong && <FormHelperText>Trường này là bắt buộc</FormHelperText>}
            </FormControl>
            <TextField
                margin="dense"
                label="Giá Hiện Tại"
                fullWidth
                {...register("giaHienTai", { required: true, valueAsNumber: true })}
                error={!!errors.giaHienTai}
                helperText={errors.giaHienTai ? "Giá hiện tại là bắt buộc" : ""}
                type="number"
            />
            <TextField
                margin="dense"
                label="Số lượng tồn"
                fullWidth
                {...register("soLuongTon", { required: true, valueAsNumber: true })}
                error={!!errors.soLuongTon}
                helperText={errors.soLuongTon ? "Giá hiện tại là bắt buộc" : ""}
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

const EditSanPhamForm = ({ open, onClose, onSubmit, product }) => {
  const { register, handleSubmit,setValue, setError, formState: { errors } } = useForm();
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [branches, setBranches] = useState([]);
    const [types, setTypes] = useState([]);
    const [formError, setFormError] = useState(false);;
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
        if (!selectedBranch || !selectedType) {
            if (!selectedBranch) {
              setError('chiNhanh', { type: 'required', message: 'Trường này là bắt buộc' });
            }
            if (!selectedType) {
              setError('giong', { type: 'required', message: 'Trường này là bắt buộc' });
            }
            setFormError(true);
            return;
          }
          // handle image upload if necessary
          const formData = new FormData();
          if (selectedImage) {
            formData.append('image', selectedImage);
          }
          onSubmit({ ...data, maChiNhanh: selectedBranch, loaiSanPham: selectedType, hinhAnh: formData });
      };
      const getBranches = async () => {
        try {
          const res = await AxiosInstance.get("center/chinhanh");
          setBranches(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      const getTypes = async () => {
        try {
          const res = await AxiosInstance.get("center/loaisanpham");
          setTypes(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      useEffect(() => {
        getBranches();
        getTypes();
      }, []);
      const handleBranchSelect = (event) => {
        const selectedBranch = branches.find(i => i.maChiNhanh === event.target.value);
        setSelectedBranch(selectedBranch);
      };
    
      const handleTypeSelect = (event) => {
        const selectedType = Types.find(i => i.maLoaiSanPham === event.target.value);
        setSelectedType(selectedType);
      };
      const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
        console.log(URL.createObjectURL(file))
        setImagePreviewUrl(URL.createObjectURL(file));
      };
      useEffect(()=>{
        if(!product){
          return;
        }
        setValue('maSanPham',product.maSanPham)
        setValue('tenSanPham', product.tenSanPham)
        setSelectedBranch(product.maChiNhanh)
        setSelectedType(product.loaiSanPham)
        setValue('giaHienTai', product.giaHienTai)
        setImagePreviewUrl('');
      },[product])
      useEffect(() => {
        if(!product){
          return
        }
        const fetchImageUrls = async () => {
            const urls = {};
              if (product.hinhAnh && product.hinhAnh[0]) {
                  const imageUrl = await getHinhAnh(product.hinhAnh[0]);
                  if (imageUrl) {
                      urls[product.hinhAnh[0]] = imageUrl;
                      setImagePreviewUrl(imageUrl);
                  }
              }
    
        };
      
        fetchImageUrls();
      }, [product]);
      if(!product){
        return;
      }
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
      <DialogContent>
      <Box display="flex" alignItems="flex-start">
        <Box flex={1} pr={2}>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
                <TextField
                    margin="dense"
                    label="Mã sản phẩm"
                    fullWidth
                    value={product.maSanPham}
                    readOnly
                    {...register("maSanPham", { required: true })}

                />
            <TextField
                margin="dense"
                label="Tên sản phẩm"
                fullWidth
                defaultValue={product.tenSanPham}
                {...register("tenSanPham", { required: true })}
                error={!!errors.tenSanPham}
                helperText={errors.tenSanPham ? "Tên thú cưng là bắt buộc" : ""}
            />
            <FormControl fullWidth error={!!errors.chiNhanh} margin="dense">
                <InputLabel id="branch-select-label">Chi Nhánh</InputLabel>
                <Select
                labelId="branch-select-label"
                value={selectedBranch ? selectedBranch : ''}
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
                <InputLabel id="breed-select-label">Loại sản phẩm</InputLabel>
                <Select
                labelId="breed-select-label"
                value={selectedType ? selectedType.maLoaiSanPham : ''}
                onChange={handleTypeSelect}
                required
                >
                {types.map((i) => (
                    <MenuItem key={i.maLoaiSanPham} value={i.maLoaiSanPham}>
                    {i.tenLoaiSanPham}
                    </MenuItem>
                ))}
                </Select>
                {errors.loaiSanPham && <FormHelperText>Trường này là bắt buộc</FormHelperText>}
            </FormControl>
            <TextField
                margin="dense"
                label="Giá Hiện Tại"
                fullWidth
                defaultValue={product.giaHienTai}
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
        Bạn có chắc chắn muốn xóa sản phẩm này không?
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
    const [products, setProducts] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const [imageUrls, setImageUrls] = useState({});
    const getProduct = async ()=>{
      try{
        const res = await AxiosInstance.get("/center/sanpham")
        setProducts(res.data)
        console.log(res.data)
      }
      catch(err){
        console.error(err);
      }
    }
    const handleConfirmDelete = async (product) => {
      try {
          const res = await AxiosInstance.delete(`/center/sanpham/${product.maSanPham}/${product.maChiNhanh}`);
          if (res.status === 200) {
              enqueueSnackbar('Xóa sản phẩm thành công', { variant: 'success', autoHideDuration: 3000 });
              getProduct()
          }
      } catch (err) {
          enqueueSnackbar('Lỗi khi xóa sản phẩm', { variant: 'error', autoHideDuration: 3000 });
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
    try{
      const res = await AxiosInstance.post("/center/sanpham", rest)
      if(res.status === 200){
       try{
        console.log(res.data.maSanPham)
        const pushimage = await AxiosInstance.post("/center/image", {
          "image":hinhAnh.get('image'),
          "maSanPham": res.data.maSanPham
        },{
          headers: {
              'Content-Type': 'multipart/form-data',
            },
        })
        if(pushimage.status === 200){
          enqueueSnackbar('Thêm sản phẩm thành công', {variant : 'success', autoHideDuration: 3000} )
          getProduct()
        }
      }
      catch(e){
        enqueueSnackbar('Lỗi khi đẩy ảnh lên', {variant : 'error', autoHideDuration: 3000} )
        console.log(e)
        getProduct()
      }
      }
    }
    catch(err){
      enqueueSnackbar('Lỗi thêm sản phẩm', {variant : 'error', autoHideDuration: 3000} )
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
    console.log(rest)
    console.log(hinhAnh.get('image'))
    if(hinhAnh.get('image')){
      try{
        const res = await AxiosInstance.put("/center/sanpham", rest)
        if(res.status === 200){
          try{
            const pushimage = await AxiosInstance.post("/center/image", {
              "image":hinhAnh.get('image'),
              "maSanPham": res.data.maSanPham
            },{
              headers: {
                  'Content-Type': 'multipart/form-data',
                },
            })
            if(pushimage.status === 200){
              enqueueSnackbar('Sửa sản phẩm thành công', {variant : 'success', autoHideDuration: 3000} )
              getProduct()
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
        enqueueSnackbar('Lỗi cập nhập sản phẩm', {variant : 'error', autoHideDuration: 3000} )
      }
    }
    else{
      try{
        const res = await AxiosInstance.put("/center/sanpham", rest)
        if(res.status === 200){
          enqueueSnackbar('sửa sản phẩm thành công', {variant : 'success', autoHideDuration: 3000} )
          getProduct()
        }
      }
      catch(err){
        console.log(err)
        enqueueSnackbar('Lỗi cập nhập sản phẩm', {variant : 'error', autoHideDuration: 3000} )
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
      for (const pet of products) {
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
}, [products]);

  useEffect(()=>{
    getProduct();
  },[])
  return (
    <>
        <SearchBar/>
        <ActionButtons onEdit={handleEdit} onDelete={handleDelete} onOpenDialog={handleDialogOpen} onOpenEditForm = {handleEditDialogOpen} isDisabled={selectedBreedIndex === null}/>
        <AddSanPhamForm open={isDialogOpen} onClose={handleDialogClose} onSubmit={handleFormSubmit} />
        <EditSanPhamForm open={isEditOpen} onClose={handleEditDialogClose} onSubmit={handleEditFormSubmit} product = {products[selectedBreedIndex]} /> 
        <ConfirmationDialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={()=>handleConfirmDelete(products[selectedBreedIndex])} />
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }} ref={tableRef}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>Mã sản phẩm</TableCell>
                        <TableCell>Hình ảnh</TableCell>
                        <TableCell>Tên sản phẩm</TableCell>
                        <TableCell>Giá</TableCell>
                        <TableCell>Giá khuyến mãi</TableCell>
                        <TableCell>Mã chi nhánh</TableCell>
                        <TableCell>loại sản phẩm</TableCell>
                        <TableCell>Số lượng tồn</TableCell>        
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((product, index) => (
                        <TableRow key={index}
                            onClick={() => handleRowClick(index)}
                            sx={{ backgroundColor: selectedBreedIndex === index ? "#f0f0f0" : "inherit" }}
                        >
                            <TableCell>{product.maSanPham}</TableCell>
                            <TableCell> {product.hinhAnh ? (
 
                                  <div style={{ maxWidth: 150, maxHeight: 150 }}>
                                    <img src={imageUrls[product.hinhAnh[product.hinhAnh.length-1]]} alt="Example" style={{ width: '100%', height: '100%' }} />
                                  </div>
                                ) : ''}</TableCell>
                            <TableCell>{product.tenSanPham}</TableCell>
                            <TableCell>{product.giaHienTai}</TableCell>
                            <TableCell>{product.giaKM}</TableCell>
                            <TableCell>{product.maChiNhanh}</TableCell>
                            <TableCell>{product.loaiSanPham.tenLoaiSanPham}</TableCell>
                            <TableCell>{product.soLuongTon}</TableCell>           
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





