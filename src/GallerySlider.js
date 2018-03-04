import React, { Component } from 'react';
import Slider from 'react-slick';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import galleryImage1 from '../public/static/1.jpeg';
import galleryImage2 from '../public/static/2.jpeg';
import galleryImage3 from '../public/static/3.jpeg';
import galleryImage4 from '../public/static/4.jpeg';
import galleryImage5 from '../public/static/5.jpeg';
import galleryImage6 from '../public/static/6.jpeg';

class GallerySlider extends React.Component {
  render() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    const height = window.innerWidth < 600 ? 300 : 600;
    return (
      <Slider {...settings}>
        <img src={galleryImage1} style={{ width: '100%', height }}/>
        <img src={galleryImage2} style={{ width: '100%', height }}/>
        <img src={galleryImage3} style={{ width: '100%', height }}/>
        <img src={galleryImage4} style={{ width: '100%', height }}/>
        <img src={galleryImage5} style={{ width: '100%', height }}/>
        <img src={galleryImage6} style={{ width: '100%', height }}/>
      </Slider>
    );
  }
}

export default GallerySlider;
