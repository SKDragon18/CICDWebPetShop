import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

// Giả định dữ liệu đơn hàng
const orders = [
  {
    id: 1,
    customerName: "Nguyễn Văn A",
    totalAmount: 500000,
    status: "unpaid", // Chưa thanh toán
    items: [
      { id: 1, name: "Sản phẩm 1", price: 200000, quantity: 2 },
      { id: 2, name: "Sản phẩm 2", price: 150000, quantity: 1 },
    ],
  },
  {
    id: 2,
    customerName: "Trần Thị B",
    totalAmount: 800000,
    status: "paid", // Đã thanh toán
    items: [
      { id: 3, name: "Sản phẩm 3", price: 300000, quantity: 1 },
      { id: 4, name: "Sản phẩm 4", price: 500000, quantity: 1 },
    ],
  },
  // Thêm đơn hàng khác nếu cần
];

const OrderDetail = () => {
  const { id } = useParams();
  const order = orders.find((order) => order.id.toString() === id);
  const [status, setStatus] = useState(order.status);

  const handleToggleStatus = () => {
    setStatus(status === "unpaid" ? "paid" : "unpaid");
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Chi tiết đơn hàng #{id}
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h6">Thông tin đơn hàng:</Typography>
        <Typography variant="body1">
          Khách hàng: {order.customerName}
        </Typography>
        <Typography variant="body1">
          Tổng giá trị: {order.totalAmount.toLocaleString()} VNĐ
        </Typography>
        <Typography variant="body2">
          Trạng thái đơn hàng:{" "}
          {status === "unpaid" ? "Chưa thanh toán" : "Đã thanh toán"}
        </Typography>
      </Box>
      <Stepper activeStep={status === "unpaid" ? 0 : 1} alternativeLabel>
        <Step>
          <StepLabel>Chưa thanh toán</StepLabel>
        </Step>
        <Step>
          <StepLabel>Đã thanh toán</StepLabel>
        </Step>
      </Stepper>
      <Box sx={{ marginTop: 2 }}>
        <Button variant="contained" onClick={handleToggleStatus}>
          {status === "unpaid" ? "Thanh toán" : "Đã thanh toán"}
        </Button>
      </Box>
    </Container>
  );
};

export default OrderDetail;
