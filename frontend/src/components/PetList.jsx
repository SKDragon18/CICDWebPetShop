import { React, useEffect, useMemo, useState } from "react";
import PetCard from "./PetCard";
import Slider from "react-slick";
import { NavigateNext, NavigateBefore } from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";
import { Grid, Box } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./PetList.css"; // Make sure to create this CSS file
import AxiosInstance from "./AxiosInstante";

// const pets = [
//   {
//     name: 'Buddy',
//     description: 'A friendly dog',
//     image: 'path_to_image/buddy.jpg',
//   },
//   {
//     name: 'Mittens',
//     description: 'A playful cat',
//     image: 'path_to_image/mittens.jpg',
//   },
//   {
//     name: 'Rex',
//     description: 'An energetic puppy',
//     image: 'path_to_image/rex.jpg',
//   },
//   {
//     name: 'Whiskers',
//     description: 'A fluffy kitten',
//     image: 'path_to_image/whiskers.jpg',
//   },
//   // Add more pets here
// ];

// const NextArrow = (props) => {
//   const { onClick } = props;
//   return (
//     <div className="arrow next" onClick={onClick}>
//       <NavigateNext style={{ fontSize: '40px', color: 'gray' }} />
//     </div>
//   );
// };

// const PrevArrow = (props) => {
//   const { onClick } = props;
//   return (
//     <div className="arrow prev" onClick={onClick}>
//       <NavigateBefore style={{ fontSize: '40px', color: 'gray' }} />
//     </div>
//   );
// };

const PetList = () => {
  const [petTest, setPetTest] = useState([]);
  const [pets, setPest] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const getPetTest = async () => {
    try {
      const res = await AxiosInstance.get("center/thucung");
      console.log(res.data);
      setPetTest(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const getPet = async () => {
    try {
      const res = await AxiosInstance.get("center/ct-thu-cung");
      // console.log(res.data);
      setPest(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    getPetTest();
    getPet();
  }, []);

  const totalPages = Math.ceil(pets.length / pageSize);
  const handleChange = (event, value) => {
    setCurrentPage(value); // MUI's Pagination component starts from 0
  };

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const currentPets = pets.slice(start, end);
  // const settings = {
  //     dots: true,
  //     infinite: true,
  //     speed: 500,
  //     slidesToShow: 3,
  //     slidesToScroll: 1,
  //     autoplay: true,
  //     autoplaySpeed: 3000,
  //     nextArrow: <NextArrow />,
  //     prevArrow: <PrevArrow />,
  //     responsive: [
  //     {
  //         breakpoint: 1024,
  //         settings: {
  //         slidesToShow: 2,
  //         },
  //     },
  //     {
  //         breakpoint: 768,
  //         settings: {
  //         slidesToShow: 1,
  //         },
  //     },
  //     ],
  // };

  // return (
  //     <div className="carousel-wrapper">
  //     <Slider {...settings}>
  //         {pets.map((pet, index) => (
  //         <div key={index}>
  //             <PetCard pet={pet} />
  //         </div>
  //         ))}
  //     </Slider>
  //     </div>
  // );
  return (
    <>
      <Grid container spacing={1} className="gid">
        {" "}
        {/* Grid container with spacing between items */}
        {currentPets.map((pet, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            {" "}
            {/* Define grid layout */}
            <PetCard pet={pet} hinhAnh={petTest[index].hinhAnh} />
          </Grid>
        ))}
      </Grid>
      <Pagination
        className="pagination-container"
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        variant="outlined"
        shape="rounded"
      />
    </>
  );
};

export default PetList;
