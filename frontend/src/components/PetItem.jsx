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

const PetItem = () => {
  const { id } = useParams(); // Assuming you are using React Router for routing
  console.log(id);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const maKhachHang = localStorage.getItem("tenDangNhap");

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await AxiosInstance.get(`/center/ct-thu-cung`);
        const petData = response.data.find(
          (p) => p.maThuCung.toString() === id
        );
        setPet(petData);
        console.log(petData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

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

  const addToCartPets = async (id) => {
    try {
      await AxiosInstance.post("/center/gio-hang/them-thu-cung", {
        maKhachHang: maKhachHang,
        maThuCung: id,
      });
      alert("Đã thêm thú cưng vào giỏ hàng!");
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
              pet.hinhAnh ||
              "https://plus.unsplash.com/premium_photo-1714675222078-f7a808907c38?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt={`${pet.tenThuCung}`}
            style={{ borderRadius: "10px" }}
          />
        </Grid>
        <Grid item xs={8} md={6}>
          <Typography variant="h4" component="div" gutterBottom>
            {pet.tenThuCung}
          </Typography>
          <Box display="flex" alignItems="center" marginBottom={2}>
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
          <Typography variant="body1" gutterBottom>
            Giống : {pet.tenGiong}
          </Typography>

          <Box display="flex" alignItems="center" marginBottom={2}>
            <Typography variant="body1" marginRight={2}>
              Số lượng tồn: {pet.soLuongTon}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" marginBottom={2}>
            <Typography variant="body1" marginRight={2}>
              Mô tả: {pet.moTa}
            </Typography>
          </Box>

          {pet.giaHienTai ? (
            <Button
              variant="contained"
              size="large"
              onClick={() => addToCartPets(pet.maThuCung)}
              color="primary"
            >
              Thêm vào giỏ hàng
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={() => addToCartPets(pet.maThuCung)}
              disabled
              color="primary"
            >
              Thêm vào giỏ hàng
            </Button>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default PetItem;
