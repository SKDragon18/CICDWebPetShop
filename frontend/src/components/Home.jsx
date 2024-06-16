import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Divider,
} from "@mui/material";
import AxiosInstance from "./AxiosInstante";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [maKhachHang, setMaKhachHang] = useState("");
  const [products, setProducts] = useState([]);
  const [pets, setPets] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branches, setBranches] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [pageProduct, setPageProduct] = useState(1); // Product pagination page
  const [pagePet, setPagePet] = useState(1); // Pet pagination page
  const itemsPerPage = 8; // Number of items per page
  const navigate = useNavigate();
  useEffect(() => {
    const maKhachHang = localStorage.getItem("tenDangNhap");
    if (maKhachHang) {
      setMaKhachHang(maKhachHang);
    }
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await AxiosInstance.get("/center/chinhanh");
        setBranches(response.data);
        if (response.data.length > 0) {
          setSelectedBranch(response.data[0].maChiNhanh);
          localStorage.setItem("maChiNhanh", response.data[0].maChiNhanh);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await AxiosInstance.get("/center/ct-san-pham");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchPets = async () => {
      try {
        const response = await AxiosInstance.get("/center/ct-thu-cung");
        setPets(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchProducts();
    fetchPets();
  }, []);
  useEffect(() => {
    const maKhachHang = localStorage.getItem("tenDangNhap");
    if (maKhachHang) {
      setMaKhachHang(maKhachHang);
    }
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await AxiosInstance.get("/center/chinhanh");
        setBranches(response.data);
        if (response.data.length > 0) {
          setSelectedBranch(response.data[0].maChiNhanh);
          localStorage.setItem("maChiNhanh", response.data[0].maChiNhanh);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await AxiosInstance.get("/center/ct-san-pham");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchPets = async () => {
      try {
        const response = await AxiosInstance.get("/center/ct-thu-cung");
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchProducts();
    fetchPets();
  }, []);

  
  useEffect(() => {
    if (selectedBranch !== null) {
      // Filter products and pets based on selected branch
      const filteredProducts = products.filter(
        (product) => product.maChiNhanh === parseInt(selectedBranch)
      );
      setFilteredProducts(filteredProducts);

      const filteredPets = pets.filter(
        (pet) => pet.maChiNhanh === parseInt(selectedBranch)
      );
      setFilteredPets(filteredPets);
    }
  }, [selectedBranch, products, pets]);

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
  };

  const handleProductPageChange = (event, value) => {
    setPageProduct(value);
  };

  const handlePetPageChange = (event, value) => {
    setPagePet(value);
  };

  const indexOfLastProduct = pageProduct * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const indexOfLastPet = pagePet * itemsPerPage;
  const indexOfFirstPet = indexOfLastPet - itemsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);

  const addToCartProducts = async (id) => {
    try {
      await AxiosInstance.post("/center/gio-hang/them-san-pham", {
        maKhachHang: maKhachHang,
        maSanPham: id,
        maChiNhanh: selectedBranch,
      });
      alert("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!");
    }
  };

  const addToCartPets = async (id) => {
    try {
      await AxiosInstance.post("/center/gio-hang/them-thu-cung", {
        maKhachHang: maKhachHang,
        maThuCung: id,
      });
      alert("Đã thêm thú cưng vào giỏ hàng!");
    } catch (error) {
      console.error("Error adding pet to cart:", error);
      alert("Có lỗi xảy ra khi thêm thú cưng vào giỏ hàng!");
    }
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

  const getHinhAnhsp = (src)=>{
    if(src){
      const base64Image = src;
      const blob = base64ToBlob(base64Image, 'image/jpeg');
      const imageUrl = URL.createObjectURL(blob);
      return imageUrl
    }
    else{
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTilBHGuqpKFdJat7nk6AriQdF1cwa37Gl8fg&s"
    }
            
  }
const getHinhAnh = (src)=>{
  if(src){
    const base64Image = src;
    const blob = base64ToBlob(base64Image, 'image/jpeg');
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl
  }
  else{
    return "https://png.pngtree.com/png-vector/20240202/ourlarge/pngtree-cute-cat-cartoon-kitten-pet-png-image_11584958.png"
  }
          
}
  return (
    <Container>
      <FormControl fullWidth margin="normal">
        <InputLabel id="branch-select-label">Chọn Chi Nhánh</InputLabel>
        <Select
          labelId="branch-select-label"
          id="branch-select"
          value={selectedBranch}
          label="Chọn Chi Nhánh"
          onChange={handleBranchChange}
        >
          {branches.map((branch) => (
            <MenuItem key={branch.maChiNhanh} value={branch.maChiNhanh}>
              {branch.tenChiNhanh}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="h5" component="h2" gutterBottom>
        Sản Phẩm
      </Typography>
        <Grid container spacing={3} paddingTop={1}>
          {currentProducts.map((product,index) => <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
            <CardMedia
                  component="img"
                  height="200"
                  image={getHinhAnhsp(product.hinhAnh)}
                  alt={product.tenSanPham}
                  onClick={() => navigate(`/product/${product.maSanPham}`)}
                />
              <CardContent
                sx={{ flex: "1 0 auto" }}
                onClick={() => navigate(`/product/${product.maSanPham}`)}
              >
                  <Typography variant="h6" component="div">
                    {product.tenSanPham}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    {product.tenLoaiSanPham}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                  {product.giaKhuyenMai ? (
                    <>
                      <Typography variant="body2" color="error">
                        {product.giaKhuyenMai} VND
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: "line-through", marginLeft: 1 }}
                      >
                        {product.giaHienTai} VND
                      </Typography>
                    </>
                  ) : product.giaHienTai ? (
                    <Typography variant="body2" color="text.primary">
                      {product.giaHienTai} VND
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="error">
                      LIÊN HỆ
                    </Typography>
                  )}
                </Box>

                <Typography variant="body2" color="text.primary">
                  Số lượng tồn: {product.soLuongTon}
                </Typography>
              </CardContent>
              {product.giaHienTai ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => addToCartProducts(product.maSanPham)}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => addToCartProducts(product.maSanPham)}
                    disabled
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>
        )}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <Pagination
          count={Math.ceil(filteredProducts.length / itemsPerPage)}
          page={pageProduct}
          onChange={handleProductPageChange}
          color="primary"
        />
      </Box>
      <Divider/>
      <Typography variant="h5" component="h2" gutterBottom marginTop={4}>
        Thú Cưng
      </Typography>
      <Grid container spacing={3} paddingTop={1}>
        {currentPets.map((pet,index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <CardMedia
                  component="img"
                  height="200"
                  image={getHinhAnh(pet.hinhAnh)}
                  alt={pet.tenThuCung}
                  onClick={() => navigate(`/pet/${pet.maThuCung}`)}
                />
              <CardContent
                sx={{ flex: "1 0 auto" }}
                onClick={() => navigate(`/pet/${pet.maThuCung}`)}
              >
                  <Typography variant="h6" component="div">
                    {pet.tenThuCung}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    {pet.tenGiong}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                  {pet.giaKhuyenMai ? (
                    <>
                      <Typography variant="body2" color="error">
                        {pet.giaKhuyenMai} VND
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: "line-through", marginLeft: 1 }}
                      >
                        {pet.giaHienTai} VND
                      </Typography>
                    </>
                  ) : pet.giaHienTai ? (
                    <Typography variant="body2" color="text.primary">
                      {pet.giaHienTai} VND
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="error">
                      LIÊN HỆ
                    </Typography>
                  )}
                </Box>
                {pet.soLuongTon ? (
                  <Typography variant="body2" color="text.primary">
                    Số lượng tồn: {pet.soLuongTon}
                  </Typography>
                ) : null}
              </CardContent>
              {pet.giaHienTai ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => addToCartPets(pet.maThuCung)}
                    color="primary"
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => addToCartPets(pet.maThuCung)}
                    disabled
                    color="primary"
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <Pagination
          count={Math.ceil(filteredPets.length / itemsPerPage)}
          page={pagePet}
          onChange={handlePetPageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default Home;

            