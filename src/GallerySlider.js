import React, { Component } from 'react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import galleryImage1 from '../public/static/1.jpeg';
import galleryImage2 from '../public/static/2.jpeg';
import galleryImage3 from '../public/static/3.jpeg';
import galleryImage4 from '../public/static/4.jpeg';
import galleryImage5 from '../public/static/5.jpeg';
import galleryImage6 from '../public/static/6.jpeg';

class GallerySlider extends Component {
    render() {
        var settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };
        const height = window.innerWidth * 6 / 16;
        return (
            <Slider {...settings}>
                <div
                    className="slide-container"
                    style={{ backgroundImage: `url(${galleryImage1})`, height }}
                />
                <div
                    className="slide-container"
                    style={{ backgroundImage: `url(${galleryImage2})`, height }}
                />
                <div
                    className="slide-container"
                    style={{ backgroundImage: `url(${galleryImage3})`, height }}
                />
                <div
                    className="slide-container"
                    style={{ backgroundImage: `url(${galleryImage4})`, height }}
                />
                <div
                    className="slide-container"
                    style={{ backgroundImage: `url(${galleryImage5})`, height }}
                />
                <div
                    className="slide-container"
                    style={{ backgroundImage: `url(${galleryImage6})`, height }}
                />
            </Slider>
        );
    }
}

export default GallerySlider;
