import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
} from "@mui/material";
import AxiosInstance from "./AxiosInstante";

const HistoryOrder = () => {
  const [orders, setOrders] = useState({});
  const [filter, setFilter] = useState("all");
  const [filterOrders, setFilterOrders] = useState([]);

  const handleChangeFilter = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await AxiosInstance.get("/order/don-dat");
        console.log("Order Data:", response.data);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchOrder();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilterOrders(orders);
    } else if (filter === "true") {
      setFilterOrders(orders.filter((order) => order.trangThai === true));
    } else {
      setFilterOrders(orders.filter((order) => order.trangThai === false));
    }
  }, [filter, orders]);

  return (
    <Container maxWidth="lg" sx={{ marginTop: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Lịch sử đơn hàng
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="filter-label">Lọc theo trạng thái</InputLabel>
          <Select
            labelId="filter-label"
            id="filter-select"
            value={filter}
            label="Lọc theo trạng thái"
            onChange={handleChangeFilter}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="true">Đã thanh toán</MenuItem>
            <MenuItem value="false">Chưa thanh toán</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={2}>
        {Array.isArray(filterOrders) &&
          filterOrders.map((order) => (
            <Grid item key={order.soDonDat} xs={12}>
              <Box
                sx={{
                  border: 1,
                  borderColor: "grey.300",
                  padding: 2,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6">
                  Đơn hàng #{order.soDonDat} -{" "}
                  {order.trangThai ? "Đã thanh toán" : "Chưa thanh toán"}
                </Typography>
                <Typography variant="body1">
                  Khách hàng: {order.maKhachHang}
                </Typography>
                <Typography variant="body1">
                  Ngày lập: {order.ngayLap}
                </Typography>
                <Typography variant="body2">
                  Địa chỉ nhận hàng: {order.diaChi}
                </Typography>
              </Box>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default HistoryOrder;
