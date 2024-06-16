import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Container,
  Paper,
  MenuItem,
  Select,
} from "@mui/material";
import AxiosInstance from "./AxiosInstante";
import { useSnackbar } from 'notistack';

const ManageInfor = () => {
  const [profile, setProfile] = useState([]);
  const maNhanVien = localStorage.getItem("tenDangNhap");
  const { enqueueSnackbar } = useSnackbar();
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/150"
  );
  const [selectedImage, setSelectedImage] = useState(null);


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
        const res = await AxiosInstance.post("/identity/hinhanh/get", [id]);
        if (res.status === 200) {
          const base64Image = res.data[0].source;
          const blob = base64ToBlob(base64Image, 'image/jpeg');
          const imageUrl = URL.createObjectURL(blob);
          setProfileImage(imageUrl)
          return imageUrl;
        }
    } catch (e) {
        // console.log(e);
    }
    return null;
}
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await AxiosInstance.get(
          `/identity/nhanvien/${maNhanVien}`
        );
        console.log("Profile Data:", response.data);
        const profileData = response.data;

        setProfile(profileData);
        console.log(profileData.hinhAnh.length)
        if(profileData.hinhAnh){
          getHinhAnh(profileData.hinhAnh[profileData.hinhAnh.length-1])
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [maNhanVien]);

  useEffect(() => {
    if (profile.ngaySinh) {
      const [year, month, day] = profile.ngaySinh.split("-");
      setDay(parseInt(day, 10));
      setMonth(parseInt(month, 10));
      setYear(parseInt(year, 10));
    }
  }, [profile.ngaySinh]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "day") setDay(value);
    if (name === "month") setMonth(value);
    if (name === "year") setYear(value);

    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };


  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedImage = event.target.files[0];
      setSelectedImage(selectedImage);
      setProfileImage(URL.createObjectURL(selectedImage)); // Hiển thị hình ảnh từ đường dẫn tạm thời
    }
  };

  // const handleSave = async () => {
  //   const updatedProfile = {
  //     ...profile,
  //     ngaySinh: new Date(year, month - 1, day).toISOString(),
  //   };

  //   try {
  //     const profileResponse = await AxiosInstance.put(
  //       `/identity/khachhang`,
  //       updatedProfile
  //     );
  //     if (profileResponse.status === 200) {
  //       alert("Profile updated successfully!");
  //     } else {
  //       console.error(
  //         "Unexpected response from profile update:",
  //         profileResponse
  //       );
  //       alert("Failed to update profile.");
  //     }
  //   } catch (error) {
  //     console.error("Error updating profile:", error);
  //     alert("Failed to update profile.");
  //   }
  // };

  const handleSave = async () => {
    const updatedProfile = {
      ...profile,
      ngaySinh: new Date(year, month - 1, day).toISOString(),
    };

    try {
      if (selectedImage) {
        console.log(selectedImage);
        const formData = new FormData();
        formData.append("image", selectedImage);
        formData.append("maNhanVien", maNhanVien);

        await AxiosInstance.post("/identity/hinhanh", formData,{
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      const profileResponse = await AxiosInstance.put(
        `/identity/nhanvien`,
        updatedProfile
      );

      if (profileResponse.status === 200) {
        enqueueSnackbar('Cập nhập profile thành công', {
            variant: 'success',
            autoHideDuration: 3000, // Set thời gian hiển thị là 3 giây
          });
      } else {
        console.error(
          "Unexpected response from profile update:",
          profileResponse
        );
        enqueueSnackbar('Cập nhập profile thất bại', {
            variant: 'error',
            autoHideDuration: 3000, // Set thời gian hiển thị là 3 giây
          });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      enqueueSnackbar('Cập nhập profile thất bại', {
        variant: 'error',
        autoHideDuration: 3000, // Set thời gian hiển thị là 3 giây
      });
    }
  };

  return (
    <Container>
      <Box mt={4} mb={2}>
        <Typography variant="h5">Hồ Sơ Của Tôi</Typography>
        <Typography variant="subtitle1">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </Typography>
      </Box>
      <Paper elevation={3} style={{ padding: 20 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tên đăng nhập"
              name="maNhanVien"
              value={profile.maNhanVien}
              margin="normal"
              size="small"
              InputLabelProps={{
                shrink: true, // Thêm thuộc tính này để label luôn ở vị trí đúng khi có giá trị
              }}
              disabled
            />

            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Họ"
                  name="ho"
                  value={profile.ho}
                  margin="normal"
                  size="small"
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true, // Thêm thuộc tính này để label luôn ở vị trí đúng khi có giá trị
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Tên"
                  name="ten"
                  value={profile.ten}
                  margin="normal"
                  size="small"
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true, // Thêm thuộc tính này để label luôn ở vị trí đúng khi có giá trị
                  }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={profile.email}
              margin="normal"
              size="small"
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true, // Thêm thuộc tính này để label luôn ở vị trí đúng khi có giá trị
              }}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              name="soDienThoai"
              value={profile.soDienThoai}
              margin="normal"
              size="small"
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true, // Thêm thuộc tính này để label luôn ở vị trí đúng khi có giá trị
              }}
            />
            <Box mb={2}>
              <TextField
                fullWidth
                label="CCCD"
                name="cccd"
                value={profile.cccd}
                margin="normal"
                size="small"
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true, // Thêm thuộc tính này để label luôn ở vị trí đúng khi có giá trị
                }}
              />
            </Box>
            <Button
              variant="contained"
              style={{ backgroundColor: "orange" }}
              fullWidth
              onClick={handleSave}
            >
              Lưu
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Box mb={2}>
              <img
                src={profileImage}
                alt="Profile"
                style={{ width: 150, height: 150, borderRadius: "50%" }}
              />
            </Box>
            <Button
              variant="contained"
              component="label"
              style={{ backgroundColor: "orange" }}
            >
              Chọn Ảnh
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              mt={2}
            >
              Dung lượng file tối đa 1 MB
              <br />
              Định dạng: .JPEG, .PNG
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ManageInfor;
