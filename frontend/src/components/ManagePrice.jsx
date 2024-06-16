import React,{ useState, useEffect, useRef} from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableHead, TableBody, TableCell, TableRow, TableContainer, Paper, FormControlLabel,Checkbox , Select, MenuItem } from '@mui/material';
import AxiosInstance from './AxiosInstante';
import { useSnackbar } from 'notistack';
import axios from 'axios';
const SearchBar = () => {
  return (
    <div>
      <TextField label="Search" variant="outlined" />
      <Button variant="contained">Search</Button>
    </div>
  );
};

const AddPriceForm = ({ open, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const handleFormSubmit = (data) => {
    onSubmit({ ...data, chiNhanh: selectedBranch });
  };
  const [chinhanh, setChiNhanh] = useState([])
  const getchinhanh = async () =>{
      try{
          const res = await  AxiosInstance.get("center/chinhanh")
          setChiNhanh(res.data)
      }
      catch(err){
        console.error(err)
      }
  }
  useEffect(()=>{
    getchinhanh()
  },[])
  const handleBranchSelect = (event) => {
    const selectedBranch = chinhanh.find(branch => branch.maChiNhanh === event.target.value);
    setSelectedBranch(selectedBranch);
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm bảng giá mới</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <TextField
            margin="dense"
            label="Thời gian bắt đầu"
            type='datetime-local'
            fullWidth
            {...register("thoiGianBatDau", { required: true })}
            error={!!errors.thoiGianBatDau}
            helperText={errors.thoiGianBatDau ? "Thời gian bắt đầu là bắt buộc" : ""}
            focused 
          />
          <TextField
            margin="dense"
            label="Thời gian kết thúc"
            fullWidth
            type='datetime-local'
            {...register("thoiGianKetThuc", { required: true })}
            error={!!errors.thoiGianKetThuc}
            helperText={errors.thoiGianKetThuc ? "Thời gian kết thúc là bắt buộc" : ""}
            focused 
          />
          <TextField
            margin="dense"
            label="Nội dung"
            fullWidth
            {...register("noiDung")}
          />
          <Select
            label="Chi nhánh"
            fullWidth
            value={selectedBranch ? selectedBranch.maChiNhanh : ''}
            onChange={handleBranchSelect}
          >
            {chinhanh.map(branch => (
              <MenuItem key={branch.maChiNhanh} value={branch.maChiNhanh}>{branch.tenChiNhanh}</MenuItem>
            ))}
          </Select>      
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit(handleFormSubmit)} variant="contained">Thêm mới</Button>
      </DialogActions>
    </Dialog>
  );
};

const EditPriceForm = ({ open, onClose, onSubmit, banggia }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const handleFormSubmit = (data) => {
    onSubmit({ ...data, chiNhanh: selectedBranch });
  };
  const [chinhanh, setChiNhanh] = useState([])
  const getchinhanh = async () =>{
      try{
          const res = await  AxiosInstance.get("center/chinhanh")
          setChiNhanh(res.data)
      }
      catch(err){
        console.error(err)
      }
  }
  useEffect(()=>{
    getchinhanh()
  },[])
  useEffect(() => {
    // Kiểm tra xem bảng giá nào được chọn
    if (banggia) {
      // Lấy bảng giá tương ứng từ mảng bangGia
      // Đặt giá trị cho các trường trong form
      setValue("maBangGia", banggia.maBangGia);
      setValue("thoiGianBatDau", formatDateTimeLocal(banggia.thoiGianBatDau));
      setValue("thoiGianKetThuc", formatDateTimeLocal(banggia.thoiGianKetThuc));
      setValue("noiDung", banggia.noiDung);
      setValue("trangThai", banggia.trangThai);
      // Lấy chi nhánh tương ứng của bảng giá
      const selectedBranch = banggia.chiNhanh;
      // Đặt chi nhánh được chọn trong form
      setSelectedBranch(selectedBranch);
    }
  }, [banggia]);
  const handleBranchSelect = (event) => {
    const selectedBranch = chinhanh.find(branch => branch.maChiNhanh === event.target.value);
    setSelectedBranch(selectedBranch);
  };
  if (!banggia) {
    return null;
  }
  const formatDateTimeLocal = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sửa bảng giá</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <TextField
                margin="dense"
                label="Mã bảng giá"
                fullWidth
                value={banggia.maBangGia}
                readOnly
                {...register("maBangGia", { required: true })}
                error={!!errors.maBangGia}
                helperText={errors.maBangGia ? "Mã bảng giá là bắt buộc" : ""}
                focused 
            />
          <TextField
            margin="dense"
            label="Thời gian bắt đầu"
            type='datetime-local'
            defaultValue={formatDateTimeLocal(banggia.thoiGianBatDau)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            {...register("thoiGianBatDau", { required: true })}
            error={!!errors.thoiGianBatDau}
            helperText={errors.thoiGianBatDau ? "Thời gian bắt đầu là bắt buộc" : ""}
            focused 
          />
          <TextField
            margin="dense"
            label="Thời gian kết thúc"
            fullWidth
            defaultValue={formatDateTimeLocal(banggia.thoiGianKetThuc)}
            InputLabelProps={{ shrink: true }}
            type='datetime-local'
            {...register("thoiGianKetThuc", { required: true })}
            error={!!errors.thoiGianKetThuc}
            helperText={errors.thoiGianKetThuc ? "Thời gian kết thúc là bắt buộc" : ""}
            focused 
          />
          <TextField
            margin="dense"
            label="Nội dung"
            fullWidth
            defaultValue={banggia.noiDung}
            {...register("noiDung")}
          />
          <FormControlLabel
            control={<Checkbox {...register("trangThai")} color="primary"  defaultChecked={banggia.trangThai} disabled />}
            label="Trạng thái"
          />
          <Select
            label="Chi nhánh"
            fullWidth
            value={selectedBranch ? selectedBranch.maChiNhanh : ''}
            onChange={handleBranchSelect}
            readOnly
          >
            {chinhanh.map(branch => (
              <MenuItem key={branch.maChiNhanh} value={branch.maChiNhanh}>{branch.tenChiNhanh}</MenuItem>
            ))}
          </Select>      
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit(handleFormSubmit)} variant="contained">Sửa</Button>
      </DialogActions>
    </Dialog>
  );
};

const CapNhapChiTietBangGia = ({ open, onClose, onSubmit, banggia })=>{
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { enqueueSnackbar } = useSnackbar();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const[ctBangGiaSanPham, setCtBangGiaSanPham] = useState([]);
  const[ctBangGiaThuCung, setCtBangGiaThuCung] = useState([]);  
  const [selectedPriceTCIndex, setSelectedPriceTCIndex] = useState(null);
  const [selectedPriceSPIndex, setSelectedPriceSPIndex] = useState(null);
  const formatDateTimeLocal = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  const getCtBangGiaThuCung = async (banggia) =>{
    try{
        const res = await  AxiosInstance.get("center/ct-thu-cung/bang-gia")
        const result = []
        for(const item of res.data){
            if(item.maBangGia === banggia.maBangGia){
                console.log(item)
                result.push(item)
            }
        }
        setCtBangGiaThuCung(result)
    }
    catch(err){
      console.error(err)
    }
    }
    const getCtBangGiaSanPham = async (banggia) =>{
        try{
            const res = await  AxiosInstance.get("center/ct-san-pham/bang-gia")
            const result = []
            for(const item of res.data){
                if(item.maBangGia === banggia.maBangGia){
                    result.push(item)
                }
            }
            setCtBangGiaSanPham(result)
        }
        catch(err){
            console.error(err)
        }
    }
    const handleTableCellChange = (newValue, index, type) => {
        // Tạo một bản sao của mảng ctBangGiaThuCung hoặc ctBangGiaSanPham
        let updatedData = [];
        if (type === "thuCung") {
          updatedData = [...ctBangGiaThuCung];
        } else if (type === "sanPham") {
          updatedData = [...ctBangGiaSanPham];
        }
      
        // Cập nhật giá trị của ô tương ứng trong mảng
        updatedData[index] = {
          ...updatedData[index],
          giaKhuyenMai: newValue
        };
      
        // Cập nhật lại state tương ứng
        if (type === "thuCung") {
          setCtBangGiaThuCung(updatedData);
        } else if (type === "sanPham") {
          setCtBangGiaSanPham(updatedData);
        }
      };
    const handleFirstButtonClick = async(banggia)=>{
        try{
            const res = await axios.post(
                'http://localhost:8989/center/ct-thu-cung/upload',
                banggia.maBangGia, // Dữ liệu gửi đi (mã bảng giá)
                    {
                        headers: {
                        'Content-Type': 'application/json'
                        }
                    }
              );
            if(res.status === 200){
                enqueueSnackbar('upload chi tiết bản giá thú cưng thành công', { variant: 'success', autoHideDuration: 3000 });
                getCtBangGiaThuCung(banggia)
            }
        }
        catch(e){
            console.error(e);
        }
    }
    const handleSecondButtonClick = async(banggia)=>{
        try{
            console.log(banggia.maBangGia)
            const res = await axios.post(
                'http://localhost:8989/center/ct-san-pham/upload',
                banggia.maBangGia, // Dữ liệu gửi đi (mã bảng giá)
                    {
                        headers: {
                        'Content-Type': 'application/json'
                        }
                    }
              );
            if(res.status === 200){
                enqueueSnackbar('upload chi tiết bản giá sản phẩm thành công', { variant: 'success', autoHideDuration: 3000 });
                getCtBangGiaSanPham(banggia)
                console.log(ctBangGiaSanPham)
            }
        }
        catch(e){
            console.error(e);
        }
    }
    const handleFormSubmit = (data) => {
        onSubmit({ ...data, ctBangGiaThuCung, ctBangGiaSanPham });
      };
      useEffect(() => {
        getCtBangGiaThuCung(banggia);
        getCtBangGiaSanPham(banggia);
      }, [banggia]);
    
      if (!banggia) {
        return null;
      }
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
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
          <DialogTitle>Cập nhập chi tiết bảng giá</DialogTitle>
          <DialogContent>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 , width: '100%'}} > 
                    <Table stickyHeader aria-label="sticky table" sx={{ width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã bảng giá</TableCell>
                            <TableCell>Thời gian bắt đầu</TableCell>
                            <TableCell>Thời gian kết thúc</TableCell>
                            <TableCell>Chi nhánh</TableCell>
                            <TableCell>Hình ảnh</TableCell>
                            <TableCell>Tên thú cưng</TableCell>
                            <TableCell>Mô tả</TableCell>
                            <TableCell>Tên giống</TableCell>
                            <TableCell>Giá hiện tại</TableCell>
                            <TableCell>Giá khuyến mãi</TableCell>                  
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ctBangGiaThuCung.map((bangGia, index) => (
                            <TableRow key={index}
                            >
                                <TableCell>{bangGia.maBangGia}</TableCell>
                                <TableCell>{bangGia.thoiGianBatDau ? formatDate(bangGia.thoiGianBatDau) : ""}</TableCell> 
                                <TableCell>{bangGia.thoiGianKetThuc? formatDate(bangGia.thoiGianKetThuc) : ""}</TableCell>
                                <TableCell>{bangGia.tenChiNhanh}</TableCell>
                                <TableCell>{bangGia.hinhAnh}</TableCell>
                                <TableCell>{bangGia.tenThuCung}</TableCell>
                                <TableCell>{bangGia.moTa}</TableCell>
                                <TableCell>{bangGia.tenGiong}</TableCell>
                                <TableCell>{bangGia.giaHienTai}</TableCell>
                                <TableCell><TextField
                                        defaultValue={bangGia.giaKhuyenMai}
                                        onChange={(e) => handleTableCellChange(e.target.value, index, "thuCung")}
                                        />
                                </TableCell>              
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
            {/* bảng 2 */}
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã bảng giá</TableCell>
                            <TableCell>Thời gian bắt đầu</TableCell>
                            <TableCell>Thời gian kết thúc</TableCell>
                            <TableCell>Chi nhánh</TableCell>
                            <TableCell>Hình ảnh</TableCell>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell>Tên loại sản phẩm</TableCell>
                            <TableCell>số lượng tồn</TableCell>
                            <TableCell>Giá hiện tại</TableCell>
                            <TableCell>Giá khuyến mãi</TableCell>                  
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ctBangGiaSanPham.map((bangGia, index) => (
                            <TableRow key={index}
                            >
                                <TableCell>{bangGia.maBangGia}</TableCell>
                                <TableCell>{bangGia.thoiGianBatDau ? formatDate(bangGia.thoiGianBatDau) : ""}</TableCell> 
                                <TableCell>{bangGia.thoiGianKetThuc? formatDate(bangGia.thoiGianKetThuc) : ""}</TableCell>
                                <TableCell>{bangGia.tenChiNhanh}</TableCell>
                                <TableCell>{bangGia.hinhAnh}</TableCell>
                                <TableCell>{bangGia.tenSanPham}</TableCell>
                                <TableCell>{bangGia.tenLoaiSanPham}</TableCell>
                                <TableCell>{bangGia.soLuongTon}</TableCell>
                                <TableCell>{bangGia.giaHienTai}</TableCell>
                                <TableCell><TextField
                                        defaultValue={bangGia.giaKhuyenMai}
                                        onChange={(e) => handleTableCellChange(e.target.value, index, "sanPham")}
                                        />
                                </TableCell>                
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
            
            {/* Hai nút */}
            <Button onClick={()=>handleFirstButtonClick(banggia)}>Upload thú cưng</Button>
            <Button onClick={()=>handleSecondButtonClick(banggia)}>Upload sản phẩm</Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Hủy</Button>
            <Button onClick={handleSubmit(handleFormSubmit)} variant="contained">Cập nhập</Button>
          </DialogActions>
        </Dialog>
      );
}

const ConfirmationDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận xóa</DialogTitle>
      <DialogContent>
        Bạn có chắc chắn muốn xóa bảng giá này không?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button onClick={onConfirm} variant="contained" color="error">Yes</Button>
      </DialogActions>
    </Dialog>
  );
};


const ManageAccount = () => {
    const [selectedPriceIndex, setSelectedPriceIndex] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isCapNhapCTOpen, setIsCapNhapCTOpen] = useState(false)
    const[ctBangGiaSanPham, setCtBangGiaSanPham] = useState([]);
    const[ctBangGiaThuCung, setCtBangGiaThuCung] = useState([]); 
    const tableRef = useRef(null);
    const [bangGia, setBangGia] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const getBangGia = async ()=>{
      try{
        const res = await AxiosInstance.get("/center/banggia")
        setBangGia(res.data)
      }
      catch(err){
        console.error(err);
      }
    }
    const getCtBangGiaThuCung = async (banggia) =>{
      try{
          const res = await  AxiosInstance.get("center/ct-thu-cung")
          const result = []
          for(const item of res.data){
              if(item.maBangGia === banggia.maBangGia){
                  console.log(item)
                  result.push(item)
              }
          }
          setCtBangGiaThuCung(result)
      }
      catch(err){
        console.error(err)
      }
      console.log("sád")
      }
      const getCtBangGiaSanPham = async (banggia) =>{
          try{
              const res = await  AxiosInstance.get("center/ct-san-pham")
              const result = []
              for(const item of res.data){
                  if(item.maBangGia === banggia.maBangGia){
                      result.push(item)
                  }
              }
              setCtBangGiaSanPham(result)
          }
          catch(err){
              console.error(err)
          }
      }
    const handleConfirmDelete = async (banggia) => { 
        if(ctBangGiaThuCung.length === 0 && ctBangGiaSanPham.length === 0){
          try {
            const res = await AxiosInstance.delete(`/center/banggia/${banggia.maBangGia}`);
            if (res.status === 200) {
                enqueueSnackbar('Xóa bảng giá thành công thành công', { variant: 'success', autoHideDuration: 3000 });
                getBangGia();
            }
          } catch (err) {
              enqueueSnackbar('Lỗi khi xóa bảng giá', { variant: 'error', autoHideDuration: 3000 });
              console.error(err);
          }
        }
        else{
          enqueueSnackbar('Bảng giá này có chi tiết bản giá', { variant: 'error', autoHideDuration: 3000 });
        }
      setIsConfirmOpen(false);
      setSelectedPriceIndex(null);
    };
    const handleRowClick = (index) => {
        if (selectedPriceIndex == index){
            setSelectedPriceIndex(null);
        }
        else{
            setSelectedPriceIndex(index);
        }
  };

  // Hàm xử lý khi ấn vào nút Edit
  const handleEdit = () => {
    // Thực hiện hành động edit với thông tin của hàng được chọn
    if(selectedPriceIndex !== null) {
      const selectedPet = pets[selectedPriceIndex];
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
      const res = await AxiosInstance.post("/center/banggia", data)
      if(res.status === 200){
        enqueueSnackbar('Thêm bảng giá thành công', {variant : 'success', autoHideDuration: 3000} )
        getBangGia()
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
      const res = await AxiosInstance.put("/center/banggia", data)
      if(res.status === 200){
        enqueueSnackbar(' sửa bảng giá thành công', {variant : 'success', autoHideDuration: 3000} )
        getBangGia()
      }
    }
    catch(err){
      enqueueSnackbar('lỗi', {variant : 'success', autoHideDuration: 3000} )
    }
    handleEditDialogClose();
  };

  const handleCapNhapDialogOpen = () => {
    setIsCapNhapCTOpen(true);
  };

  const handleCapNhapDialogClose = () => {
    setIsCapNhapCTOpen(false);
  };

  const handleCapNhapFormSubmit = async(data) => {
    console.log("Form Data:", data);
    const result1 = []
    const result2 = []
    console.log(data.ctBangGiaSanPham[1])
    for (const item in data.ctBangGiaSanPham){
        console.log()
        result1.push({
            "maBangGia":data.ctBangGiaSanPham[item].maBangGia,
            "maSanPham":data.ctBangGiaSanPham[item].maSanPham,
            "donGia": data.ctBangGiaSanPham[item].giaKhuyenMai
        })
    }
    for (const item in data.ctBangGiaThuCung){
        console.log()
        result2.push({
            "maBangGia":data.ctBangGiaThuCung[item].maBangGia,
            "maThuCung":data.ctBangGiaThuCung[item].maThuCung,
            "donGia": data.ctBangGiaThuCung[item].giaKhuyenMai
        })
    }
    try{
      const res = await AxiosInstance.post("/center/ct-san-pham", result1)
      if(res.status === 200){
        enqueueSnackbar('cập nhập bảng giá sản phẩm thành công', {variant : 'success', autoHideDuration: 3000} )
        getBangGia()
      }
    }
    catch(err){
      enqueueSnackbar('lỗi', {variant : 'success', autoHideDuration: 3000} )
    }
    try{
        const res = await AxiosInstance.post("/center/ct-thu-cung", result2)
        if(res.status === 200){
          enqueueSnackbar('Cập nhập bảng giá thú cưng thành công', {variant : 'success', autoHideDuration: 3000} )
          getBangGia()
        }
      }
      catch(err){
        enqueueSnackbar('lỗi', {variant : 'success', autoHideDuration: 3000} )
      }
    // handleEditDialogClose();
  };
  const handleApply= async()=>{
    const banggia = bangGia[selectedPriceIndex]
    try{
      const res = await AxiosInstance.get(`/center/banggia/apply/${banggia.maBangGia}`)
      if(res.status === 200){
        enqueueSnackbar('Apply bảng giá thú cưng thành công', {variant : 'success', autoHideDuration: 3000} )
        getBangGia()
      }
    }
    catch(err){
      enqueueSnackbar('có lỗi trong việc apply bảng giá', {variant : 'error', autoHideDuration: 3000} )
      console.log(err)
    }
  }
  const ActionButtons = ({ onEdit, onDelete, isDisabled,onOpenDialog,onOpenEditForm  }) => {
    return (
      <div>
        <Button variant="contained" color="success" style={{marginRight: '10px'}} onClick={onOpenDialog}>Thêm</Button>
        <Button variant="contained" color="primary" style={{marginRight: '10px'}} onClick={onOpenEditForm} disabled={isDisabled}>Sửa</Button>
        <Button variant="contained" color="primary" style={{marginRight: '10px'}} onClick={handleCapNhapDialogOpen} disabled={isDisabled}>Cập nhập chi tiết bảng giá</Button>
        <Button variant="contained" color="primary" style={{marginRight: '10px'}}  onClick={handleApply} disabled={isDisabled}>Apply</Button>
        <Button variant="contained" color="error" onClick={onDelete} disabled={isDisabled}>Xóa</Button>
      </div>
    );
  };
  useEffect(()=>{
    getBangGia();
  },[])
  useEffect(() => {
    getCtBangGiaThuCung(bangGia[selectedPriceIndex]);
    getCtBangGiaSanPham(bangGia[selectedPriceIndex]);
  }, [bangGia[selectedPriceIndex]]);

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
        <ActionButtons onEdit={handleEdit} onDelete={handleDelete} onOpenDialog={handleDialogOpen} onOpenEditForm = {handleEditDialogOpen} isDisabled={selectedPriceIndex === null}/>
        <AddPriceForm open={isDialogOpen} onClose={handleDialogClose} onSubmit={handleFormSubmit} />
        <EditPriceForm open={isEditOpen} onClose={handleEditDialogClose} onSubmit={handleEditFormSubmit} banggia = {bangGia[selectedPriceIndex]} />
        <ConfirmationDialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={()=>handleConfirmDelete(bangGia[selectedPriceIndex])} />
        <CapNhapChiTietBangGia open={isCapNhapCTOpen} onClose={handleCapNhapDialogClose} onSubmit = {handleCapNhapFormSubmit}  banggia={bangGia[selectedPriceIndex]}/>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }} ref={tableRef}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>Mã bảng giá</TableCell>
                        <TableCell>Thời gian bắt đầu</TableCell>
                        <TableCell>Thời gian kết thúc</TableCell>
                        <TableCell>Nội dung</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Chi nhánh</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bangGia.map((bangGia, index) => (
                        <TableRow key={index}
                            onClick={() => handleRowClick(index)}
                            sx={{ backgroundColor: selectedPriceIndex === index ? "#f0f0f0" : "inherit" }}
                        >
                            <TableCell>{bangGia.maBangGia}</TableCell>
                            <TableCell>{bangGia.thoiGianBatDau ? formatDate(bangGia.thoiGianBatDau) : ""}</TableCell> 
                            <TableCell>{bangGia.thoiGianKetThuc? formatDate(bangGia.thoiGianKetThuc) : ""}</TableCell>
                            <TableCell>{bangGia.noiDung}</TableCell>      
                            <TableCell>{bangGia.trangThai? "True": "False"}</TableCell>
                            <TableCell>{bangGia.chiNhanh.tenChiNhanh}</TableCell>               
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





