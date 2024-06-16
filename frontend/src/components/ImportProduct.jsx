import React,{ useState, useEffect, useRef} from 'react';
import { get, useForm } from 'react-hook-form';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableHead, TableBody, TableCell, TableRow, TableContainer, Paper, Box,Grid,FormControl,InputLabel,Select,MenuItem } from '@mui/material';
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

const AddImportForm = ({ open, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [openPetDialog, setOpenPetDialog] = useState(false);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const handleRowClick = (index) => {
    if (selectedItemIndex == index){
      setSelectedItemIndex(null);
    }
    else{
      setSelectedItemIndex(index);
    }
  };
  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (data) => {
    onSubmit({ ...data, items });
  };

  const handleAddPet = (petData) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => 
        item.type === "Thú cưng" &&
        item.loaiThuCung.maThuCung === petData.loaiThuCung.maThuCung &&
        item.price === petData.price
      );
  
      if (existingItemIndex !== -1) {
        // Update the quantity of the existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity  = parseInt(updatedItems[existingItemIndex].quantity,10) + parseInt(petData.quantity,10);
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, petData];
      }
    });
    setOpenPetDialog(false);
  };

  const handleAddProduct = (productData) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => 
        item.type === "Sản phẩm" &&
        item.loaiSanPham.maSanPham === productData.loaiSanPham.maSanPham &&
        item.price === productData.price
      );
  
      if (existingItemIndex !== -1) {
        // Update the quantity of the existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity = parseInt(updatedItems[existingItemIndex].quantity,10) + parseInt(productData.quantity,10);
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, productData];
      }
    });
    setOpenProductDialog(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle>Thêm phiếu nhập</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <Box mt={2}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Button onClick={() => setOpenPetDialog(true)} variant="contained" color="secondary">Thêm thú cưng</Button>
                </Grid>
                <Grid item>
                  <Button onClick={() => setOpenProductDialog(true)} variant="contained" color="secondary">Thêm sản phẩm</Button>
                </Grid>
              </Grid>
            </Box>
            <TableContainer component={Paper} style={{ marginTop: 16 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Loại</TableCell>
                    <TableCell>Tên</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Giá</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index}
                     onClick={() => handleRowClick(index)}
                      selected={selectedItemIndex === index}
                      style={{ cursor: 'pointer' }}>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.type === "Thú cưng"? item.loaiThuCung.tenThuCung : item.loaiSanPham.tenSanPham}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(index);
                          }}
                        >
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button onClick={handleSubmit(handleFormSubmit)} variant="contained">Hoàn thành</Button>
        </DialogActions>
      </Dialog>
      <PetDialog open={openPetDialog} onClose={() => setOpenPetDialog(false)} onSubmit={handleAddPet} />
      <ProductDialog open={openProductDialog} onClose={() => setOpenProductDialog(false)} onSubmit={handleAddProduct} />
    </>
  );
};

const PetDialog = ({ open, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedPet, setSelectedPet] = useState(null);
  const [error, setError] = useState(false);
  const [items,setItems] = useState([])
  const getPet = async()=>{
    try{
        const res = await AxiosInstance.get("center/thucung")
        if(res.status === 200){
          const productItems = res.data.map(item => ({
            maThuCung: item.maThuCung,
            tenThuCung: item.tenThuCung
          }));
          setItems(productItems);
        }
    }
    catch(err){
      console.error(err)
    }
  }

  const handleFormSubmit = (data) => {
    if(!selectedPet){
      setError('loaiThuCung', { type: 'required', message: 'Trường này là bắt buộc' });
    }
    onSubmit({ ...data, loaiThuCung:selectedPet ,type: 'Thú cưng' });
  };

  const handlePetSelect = (event) => {
    const selectedPet = items.find(i => i.maThuCung === event.target.value);
    setSelectedPet(selectedPet);
  };
  useEffect(()=>{
    getPet();
  },[])

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm thú cưng</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <FormControl fullWidth error={error} margin="dense">
              <InputLabel id="pet-select-label">Thú cưng</InputLabel>
                    <Select
                      labelId="pet-select-label"
                      id="product-select"
                      value={selectedPet ? selectedPet.maThuCung : ''}
                      onChange={handlePetSelect}
                      required
                    >
                      {items.map((i) => (
                        <MenuItem key={i.maThuCung} value={i.maThuCung}>
                          {i.tenThuCung}
                        </MenuItem>
                      ))}
                    </Select>
                {error && <FormHelperText>Trường này là bắt buộc</FormHelperText>}
          </FormControl>
          <TextField
            margin="dense"
            label="Số lượng"
            fullWidth
            type="number"
            {...register("quantity", { required: true })}
            error={!!errors.quantity}
            helperText={errors.quantity ? "Số lượng là bắt buộc" : ""}
          />
          <TextField
            margin="dense"
            label="Giá"
            fullWidth
            type="number"
            {...register("price", { required: true })}
            error={!!errors.price}
            helperText={errors.price ? "Giá là bắt buộc" : ""}
          />
          <DialogActions>
            <Button onClick={onClose}>Hủy</Button>
            <Button type="submit" variant="contained">Hoàn thành</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ProductDialog = ({ open, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(false);
  const [items,setItems] = useState([])
  const getSanPham = async()=>{
    try{
        const res = await AxiosInstance.get("center/sanpham")
        if(res.status === 200){
          const productItems = res.data.map(item => ({
            maSanPham: item.maSanPham,
            tenSanPham: item.tenSanPham
          }));
          setItems(productItems);
        }
    }
    catch(err){
      console.error(err)
    }
  }
  const handleFormSubmit = (data) => {
    if(!selectedProduct){
      setError('loaiSanPham', { type: 'required', message: 'Trường này là bắt buộc' });
    }
    onSubmit({ ...data,loaiSanPham:selectedProduct , type: 'Sản phẩm' });
  };
  const handleProductSelect = (event) => {
    const selectedProduct = items.find(i => i.maSanPham === event.target.value);
    setSelectedProduct(selectedProduct);
  };
  useEffect(()=>{
    getSanPham();
  },[])
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Thêm sản phẩm</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <FormControl fullWidth error={error} margin="dense">
              <InputLabel id="pet-select-label">Sản phẩm</InputLabel>
                    <Select
                      labelId="pet-select-label"
                      id="product-select"
                      value={selectedProduct ? selectedProduct.maSanPham : ''}
                      onChange={handleProductSelect}
                      required
                    >
                      {items.map((i) => (
                        <MenuItem key={i.maSanPham} value={i.maSanPham}>
                          {i.tenSanPham}
                        </MenuItem>
                      ))}
                    </Select>
                {error && <FormHelperText>Trường này là bắt buộc</FormHelperText>}
          </FormControl>
          <TextField
            margin="dense"
            label="Số lượng"
            fullWidth
            type="number"
            {...register("quantity", { required: true })}
            error={!!errors.quantity}
            helperText={errors.quantity ? "Số lượng là bắt buộc" : ""}
          />
          <TextField
            margin="dense"
            label="Giá"
            fullWidth
            type="number"
            {...register("price", { required: true })}
            error={!!errors.price}
            helperText={errors.price ? "Giá là bắt buộc" : ""}
          />
          <DialogActions>
            <Button onClick={onClose}>Hủy</Button>
            <Button type="submit" variant="contained">Hoàn thành</Button>
          </DialogActions>
        </form>
      </DialogContent>
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
    const [selectedImportIndex, setSelectedImportIndex] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const tableRef = useRef(null);
    const [nhapHang, setNhapHang] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const getNhapHang = async ()=>{
      try{
        const res = await AxiosInstance.get("/center/nhaphang")
        setNhapHang(res.data)
      }
      catch(err){
        console.error(err);
      }
    }
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
      setSelectedImportIndex(null);
    };
    const handleRowClick = (index) => {
        if (selectedImportIndex == index){
            setSelectedImportIndex(null);
        }
        else{
            setSelectedImportIndex(index);
        }
  };

  // Hàm xử lý khi ấn vào nút Edit
  const handleEdit = () => {
    // Thực hiện hành động edit với thông tin của hàng được chọn
    if(selectedImportIndex !== null) {
      const selectedPet = pets[selectedImportIndex];
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
    const maNV = localStorage.getItem('tenDangNhap')
    const pet = []
    const product = []
    for (const i in data.items){
      if(data.items[i].type === "Thú cưng"){
        pet.push(data.items[i])
      }
      else{
        product.push(data.items[i])
      }
    }
    console.log(pet)
    console.log(product)
    try{
      const getNhanvien = await AxiosInstance.get(`identity/nhanvien/${maNV}`)
      if(getNhanvien.status === 200){
       const machinhanh = getNhanvien.data.maChiNhanh
       console.log(machinhanh)
       try{
        const getChiNhanh =  await AxiosInstance.get(`center/chinhanh/${machinhanh}`)
        if(getChiNhanh.status === 200){
          console.log(getChiNhanh.data)
          try{
            const res = await AxiosInstance.post("center/nhaphang/tao-phieu-nhap",{
              "maNhanVien": maNV,
              "chiNhanhDTO": getChiNhanh.data
            })
            if(res.status === 200){
              console.log(1)
              const datathucung = []
              const dataSP = []
              for (const i in pet){
                datathucung.push({
                  "maDonNhap": res.data.maDonNhapHang,
                  "maThuCung": pet[i].loaiThuCung.maThuCung,
                  "giaNhap": pet[i].price,
                  "soLuong": pet[i].quantity
                })
              }
              console.log(datathucung)
              for (const i in product){
                dataSP.push({
                  "maDonNhap": res.data.maDonNhapHang,
                  "maSanPham": product[i].loaiSanPham.maSanPham,
                  "giaNhap": product[i].price,
                  "soLuong": product[i].quantity
                })
              }
              console.log(dataSP)
              console.log(datathucung)
              try{
                const addthucung = await AxiosInstance.post("center/nhaphang/them-thu-cung",datathucung)
                if(addthucung.status === 200){
                  try{
                    const addSP = await AxiosInstance.post("center/nhaphang/them-san-pham",dataSP)
                    if(addSP.status === 200){
                      enqueueSnackbar('Hoàn thành nhập hàng', {variant : 'success', autoHideDuration: 3000} )
                      getNhapHang()
                    }
                  }
                  catch(e){
                    enqueueSnackbar('Lỗi thêm sản phẩm', {variant : 'error', autoHideDuration: 3000} )
                  }
                }
              }
              catch(e){
                enqueueSnackbar('Lỗi thêm thú cưng', {variant : 'error', autoHideDuration: 3000} )
              }
            }
          }
          catch(err){
            enqueueSnackbar('Lỗi tạo phiếu nhập', {variant : 'error', autoHideDuration: 3000} )
          }   
        }
      }
      catch(err){
        enqueueSnackbar('Lỗi lấy chi nhanh nhân viên', {variant : 'error', autoHideDuration: 3000} )
      }
      }
    }
    catch(err){
      enqueueSnackbar('Lỗi lấy nhân viên', {variant : 'error', autoHideDuration: 3000} )
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
      </div>
    );
  };
  useEffect(()=>{
    getNhapHang();
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
        <ActionButtons onEdit={handleEdit} onDelete={handleDelete} onOpenDialog={handleDialogOpen} onOpenEditForm = {handleEditDialogOpen} isDisabled={selectedImportIndex === null}/>
        <AddImportForm open={isDialogOpen} onClose={handleDialogClose} onSubmit={handleFormSubmit} />
        <EditBrandForm open={isEditOpen} onClose={handleEditDialogClose} onSubmit={handleEditFormSubmit} nhapHang = {nhapHang[selectedImportIndex]} />
        <ConfirmationDialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={()=>handleConfirmDelete(nhapHang[selectedImportIndex])} />
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }} ref={tableRef}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>Mã Đơn lập hàng</TableCell>
                        <TableCell>Ngày lập</TableCell>
                        <TableCell>Mã nhân viên</TableCell>
                        <TableCell>Chi nhánh</TableCell>           
                    </TableRow>
                </TableHead>
                <TableBody>
                    {nhapHang.map((nhapHang, index) => (
                        <TableRow key={index}
                            onClick={() => handleRowClick(index)}
                            sx={{ backgroundColor: selectedImportIndex === index ? "#f0f0f0" : "inherit" }}
                        >
                            <TableCell>{nhapHang.maDonNhapHang}</TableCell>
                            <TableCell>{nhapHang.ngayLap? formatDate(nhapHang.ngayLap):""}</TableCell>  
                            <TableCell>{nhapHang.maNhanVien}</TableCell>
                            <TableCell>{nhapHang.chiNhanhDTO.tenChiNhanh}</TableCell>        
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





