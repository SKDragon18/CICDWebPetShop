import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  CardMedia,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import AxiosInstance from "./AxiosInstante";
import { useParams } from "react-router-dom";

// Custom styled component for strikethrough text
const StrikeThroughText = styled(Typography)({
  textDecoration: "line-through",
  marginRight: "8px",
});

const ProductItem = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const maChiNhanh = localStorage.getItem("maChiNhanh");
  const maKhachHang = localStorage.getItem("tenDangNhap");
  console.log(maChiNhanh);
  console.log(maKhachHang);
  console.log(id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await AxiosInstance.get(`/center/ct-san-pham`);
        const productData = response.data.find(
          (p) =>
            p.maSanPham.toString() === id &&
            p.maChiNhanh.toString() === maChiNhanh
        );
        setProduct(productData);
        console.log(productData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, maChiNhanh]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  const addToCartProducts = async (id) => {
    try {
      await AxiosInstance.post("/center/gio-hang/them-san-pham", {
        maKhachHang: maKhachHang,
        maSanPham: id,
        maChiNhanh: maChiNhanh,
      });
      console.log(product);
      alert("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    }
  };

  return (
    <Container>
      <Grid container spacing={3} marginTop={2}>
        <Grid item xs={4} md={6}>
          <CardMedia
            component="img"
            height="600px"
            image={
              product.hinhAnh ||
              "https://plus.unsplash.com/premium_photo-1714675222078-f7a808907c38?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt={`${product.tenSanPham}`}
            style={{ borderRadius: "10px" }}
          />
        </Grid>
        <Grid item xs={8} md={6}>
          <Typography variant="h4" component="div" gutterBottom>
            {product.tenSanPham}
          </Typography>
          <Box display="flex" alignItems="center" marginBottom={2}>
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
          <Typography variant="body1" gutterBottom>
            Loại : {product.tenLoaiSanPham}
          </Typography>
          <Box display="flex" alignItems="center" marginBottom={2}>
            <Typography variant="body1" marginRight={2}>
              Số lượng tồn: {product.soLuongTon}
            </Typography>
          </Box>
          {product.giaHienTai ? (
            <Button
              variant="contained"
              size="large"
              onClick={() => addToCartProducts(product.maSanPham)}
            >
              Thêm vào giỏ hàng
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={() => addToCartProducts(product.maSanPham)}
              disabled
            >
              Thêm vào giỏ hàng
            </Button>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductItem;
