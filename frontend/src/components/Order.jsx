import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  TextField,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import AxiosInstance from "./AxiosInstante";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [specificAddress, setSpecificAddress] = useState("");

  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");

  const [cartProducts, setCartProducts] = useState([]);
  const [cartPets, setCartPets] = useState([]);

  const [productQuantities, setProductQuantities] = useState({});
  const [petQuantities, setPetQuantities] = useState({});

  const [selectedBranch, setSelectedBranch] = useState("");
  const [maKhachHang, setMaKhachHang] = useState("");

  const phoneNumberRef = useRef(null);
  const specificAddressRef = useRef(null);
  const fullNameRef = useRef(null);
  const provinceRef = useRef(null);
  const districtRef = useRef(null);
  const wardRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const maChiNhanh = localStorage.getItem("maChiNhanh");
    const maKhachHang = localStorage.getItem("tenDangNhap");
    console.log(maChiNhanh);
    console.log(maKhachHang);
    if (maChiNhanh) {
      setSelectedBranch(maChiNhanh);
    }
    if (maKhachHang) {
      setMaKhachHang(maKhachHang);
    }
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (maKhachHang && selectedBranch) {
        try {
          const responseProducts = await AxiosInstance.post(
            "/center/gio-hang/san-pham",
            {
              maKhachHang: maKhachHang,
              maChiNhanh: selectedBranch,
            }
          );

          const responsePets = await AxiosInstance.post(
            "/center/gio-hang/thu-cung",
            {
              maKhachHang: maKhachHang,
              maChiNhanh: selectedBranch,
            }
          );
          setCartPets(responsePets.data);
          setCartProducts(responseProducts.data);

          // Initialize quantities for products and pets
          const initialProductQuantities = responseProducts.data.reduce(
            (acc, item) => {
              acc[item.maSanPham] = 1;
              return acc;
            },
            {}
          );

          const initialPetQuantities = responsePets.data.reduce((acc, item) => {
            acc[item.maThuCung] = 1;
            return acc;
          }, {});

          setProductQuantities(initialProductQuantities);
          setPetQuantities(initialPetQuantities);
          console.log(responseProducts.data);
          console.log(responsePets.data);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      }
    };

    fetchCartItems();
  }, [maKhachHang, selectedBranch]);

  useEffect(() => {
    axios
      .get("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((response) => {
        setProvinces(response.data.data);
        setLoadingProvinces(false);
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
        setLoadingProvinces(false);
      });
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      setLoadingDistricts(true);
      axios
        .get(`https://esgoo.net/api-tinhthanh/2/${selectedProvince.id}.htm`)
        .then((response) => {
          setDistricts(response.data.data);
          setWards([]);
          setLoadingDistricts(false);
        })
        .catch((error) => {
          console.error("Error fetching districts:", error);
          setLoadingDistricts(false);
        });
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      setLoadingWards(true);
      axios
        .get(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict.id}.htm`)
        .then((response) => {
          setWards(response.data.data);
          setLoadingWards(false);
        })
        .catch((error) => {
          console.error("Error fetching wards:", error);
          setLoadingWards(false);
        });
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  const calculateTotal = () => {
    let productTotal = 0;
    let petTotal = 0;

    // Tính tổng sản phẩm
    cartProducts.forEach((item) => {
      const quantity = Number(productQuantities[item.maSanPham]) || 0;
      const price = item.giaKM ? Number(item.giaKM) : Number(item.giaHienTai);
      productTotal += price * quantity;
    });

    // Tính tổng thú cưng
    cartPets.forEach((item) => {
      const quantity = Number(petQuantities[item.maThuCung]) || 0;
      const price = item.giaKM ? Number(item.giaKM) : Number(item.giaHienTai);
      petTotal += price * quantity;
    });
    console.log(productTotal);

    // Tổng cả sản phẩm và thú cưng
    return productTotal + petTotal;
  };

  const handleQuantityChange = (type, id, value) => {
    let inventory = {};
    if (type === "product") {
      inventory = cartProducts.find((item) => item.maSanPham === id).soLuongTon;
    } else {
      inventory = cartPets.find((item) => item.maThuCung === id).soLuongTon;
    }

    if (value > inventory) {
      alert(`Số lượng không thể vượt quá số lượng tồn (${inventory})`);
      return;
    }

    if (type === "product") {
      setProductQuantities((prev) => ({
        ...prev,
        [id]: value,
      }));
    } else {
      setPetQuantities((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  // Kiểm tra thông tin giao hàng nhập hợp lệ
  const isShippingInfoValid = () => {
    return (
      fullName.trim() !== "" &&
      phoneNumber.trim() !== "" &&
      selectedProvince !== null &&
      selectedDistrict !== null &&
      selectedWard !== null &&
      specificAddress.trim() !== ""
    );
  };

  // Xử lý nút đặt hàng
  const placeOrder = async () => {
    if (!isShippingInfoValid()) {
      if (fullName.trim() === "") {
        fullNameRef.current.focus();
        alert("Tên không được để trống!");
        return;
      }
      if (phoneNumber.trim() === "") {
        phoneNumberRef.current.focus();
        alert("Số điện thoại không được để trống!");
        return;
      }

      if (selectedProvince === null) {
        alert("Vui lòng chọn tinh/ thành phố!");
        provinceRef.current.focus();
        return;
      }

      if (selectedDistrict === null) {
        alert("Vui lòng chọn quận/huyện!");
        districtRef.current.focus();
        return;
      }

      if (selectedWard === null) {
        alert("Vui lòng chọn phường/xã!");
        wardRef.current.focus();
        return;
      }

      if (specificAddress.trim() === "") {
        specificAddressRef.current.focus();
        alert("Địa chỉ không được để trống!");
        return;
      }

      return;
    }
    try {
      const orderInfoData = {
        diaChi:
          specificAddress,
        soDienThoai: phoneNumber,
        maChiNhanh: selectedBranch,
        maKhachhang: maKhachHang,
      };
      console.log(orderInfoData);

      const orderResponse = await AxiosInstance.post(
        "/order/don-dat",
        orderInfoData
      );
      const maDonDat = orderResponse.data.soDonDat;
      // Tạo danh sách các sản phẩm từ cartProducts

      const orderProducts = cartProducts.map((product) => ({
        maDonDat: maDonDat,
        soLuong: productQuantities[product.maSanPham] || 1,
        donGia: product.giaKM ? product.giaKM : product.giaHienTai,
        maSanPham: product.maSanPham,
        maChiNhanh: selectedBranch,
      }));

      await AxiosInstance.post("/order/dat-hang/sp", orderProducts);

      const orderPets = cartPets.map((pet) => ({
        maDonDat: maDonDat,
        soLuong: petQuantities[pet.maThuCung] || 1,
        donGia: pet.giaKM ? pet.giaKM : pet.giaHienTai,
        maThuCung: pet.maThuCung,
      }));

      console.log(orderPets);
      await AxiosInstance.post("/order/dat-hang/tc", orderPets);
      alert("Đã đặt hàng thành công!");

      const responseCart = await AxiosInstance.post(
        "/center/gio-hang/bo-tat-ca",
        {
          maKhachHang: maKhachHang,
          maChiNhanh: selectedBranch,
        }
      );
      setCartPets(responseCart.data);
      setCartProducts(responseCart.data);

      navigate("/cart");
    } catch (error) {
      alert("Đặt hàng thất bại!");
      console.error("Đặt hàng thất bại:", error.message);
      // Hiển thị thông báo lỗi cho người dùng
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom marginTop={2}>
        Xác nhận đơn hàng
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h6">Thông tin giao hàng:</Typography>
            <TextField
              fullWidth
              label="Họ và tên"
              margin="normal"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              inputRef={fullNameRef}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              margin="normal"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              inputRef={phoneNumberRef}
            />
            <Box display="flex" marginBottom="16px">
              <Autocomplete
                ref={provinceRef}
                options={provinces}
                getOptionLabel={(option) => option.full_name}
                value={selectedProvince}
                onChange={(event, newValue) => {
                  setSelectedProvince(newValue);
                  setSelectedDistrict(null);
                  setSelectedWard(null);
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tỉnh/Thành phố"
                    variant="outlined"
                    margin="normal"
                    disabled={loadingProvinces}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingProvinces ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                style={{ marginRight: "10px" }}
              />
              <Autocomplete
                ref={districtRef}
                options={districts}
                getOptionLabel={(option) => option.full_name}
                value={selectedDistrict}
                onChange={(event, newValue) => {
                  setSelectedDistrict(newValue);
                  setSelectedWard(null);
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Quận/Huyện"
                    variant="outlined"
                    margin="normal"
                    disabled={!selectedProvince || loadingDistricts}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingDistricts ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                style={{ marginRight: "10px" }}
              />
              <Autocomplete
                ref={wardRef}
                options={wards}
                getOptionLabel={(option) => option.full_name}
                value={selectedWard}
                onChange={(event, newValue) => setSelectedWard(newValue)}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Phường/Xã"
                    variant="outlined"
                    margin="normal"
                    disabled={!selectedDistrict || loadingWards}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingWards ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Box>
            <TextField
              fullWidth
              label="Địa chỉ cụ thể"
              margin="normal"
              value={specificAddress}
              onChange={(e) => setSpecificAddress(e.target.value)}
              inputRef={specificAddressRef}
            />
            <Typography variant="h6">Phương thức thanh toán</Typography>
            <Typography>Thanh toán khi nhận hàng</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper
            elevation={3}
            style={{
              maxHeight: "300px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" margin={2}>
              Thông tin sản phẩm:
            </Typography>
            <Box
              style={{ flexGrow: 1, overflow: "auto", marginBottom: "10px" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "60%" }}>Sản phẩm</TableCell>
                    <TableCell style={{ width: "20%" }}>Số lượng</TableCell>
                    <TableCell style={{ width: "20%" }}>Thành tiền</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartProducts.map((item) => (
                    <TableRow key={item.maSanPham}>
                      <TableCell>
                        <Grid container>
                          <Grid item xs={4}>
                            <img
                              src={item.hinhAnh}
                              alt={item.tenSanPham}
                              style={{ width: 50, height: 50 }}
                            />
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant="body2">
                              {item.tenSanPham}
                            </Typography>
                            <Typography variant="body2">
                              {" "}
                              {item.giaKM ? item.giaKM : item.giaHienTai}
                            </Typography>
                          </Grid>
                        </Grid>
                      </TableCell>
                      <TableCell>
                        {" "}
                        <TextField
                          type="number"
                          value={productQuantities[item.maSanPham] || 1}
                          onChange={(e) =>
                            handleQuantityChange(
                              "product",
                              item.maSanPham,
                              parseInt(e.target.value)
                            )
                          }
                          inputProps={{ min: 1 }}
                        />
                      </TableCell>
                      <TableCell>
                        {(item.giaKM ? item.giaKM : item.giaHienTai) *
                          (productQuantities[item.maSanPham] || 1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
          <Paper
            elevation={3}
            style={{
              maxHeight: "300px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              style={{ flexGrow: 1, overflow: "auto", marginBottom: "10px" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "60%" }}>Thú cưng</TableCell>
                    <TableCell style={{ width: "20%" }}>Số lượng</TableCell>
                    <TableCell style={{ width: "20%" }}>Thành tiền</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartPets.map((item) => (
                    <TableRow key={item.maSanPham}>
                      <TableCell>
                        <Grid container>
                          <Grid item xs={4}>
                            <img
                              src={item.hinhAnh}
                              alt={item.tenThuCung}
                              style={{ width: 50, height: 50 }}
                            />
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant="body2">
                              {item.tenThuCung}
                            </Typography>
                            <Typography variant="body2">
                              {" "}
                              {item.giaKM ? item.giaKM : item.giaHienTai}
                            </Typography>
                          </Grid>
                        </Grid>
                      </TableCell>
                      <TableCell>
                        {" "}
                        <TextField
                          type="number"
                          value={petQuantities[item.maThuCung] || 1}
                          onChange={(e) =>
                            handleQuantityChange(
                              "pet",
                              item.maThuCung,
                              parseInt(e.target.value)
                            )
                          }
                          inputProps={{ min: 1 }}
                        />
                      </TableCell>
                      <TableCell>
                        {(item.giaKM ? item.giaKM : item.giaHienTai) *
                          (petQuantities[item.maThuCung] || 1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Box style={{ borderTop: "1px solid #ddd", padding: "10px" }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">
                  Tổng cộng: {calculateTotal().toLocaleString()}đ
                </Typography>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={placeOrder}
                >
                  Đặt hàng
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Order;
