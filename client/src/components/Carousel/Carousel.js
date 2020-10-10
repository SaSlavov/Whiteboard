import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Carousel.css'
import { withRouter } from 'react-router-dom';

const CenterMode = () => {

    const settings = {
        className: "center",
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnFocus: true,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <div className="carousel-container">
            <Slider {...settings}>
                <div className="box">
                    <p className="carousel-text">Fond of hurrying to an office meeting in the rain?</p>
                </div>
                <div className="box">
                    <p className="carousel-text">Fond of picnic with the germ family in the office?</p>
                </div>
                <div className="box">
                    <p className="carousel-text">NO!? Then you're at the right place! Let us introduce to you the mud/virus-free online whiteboard!</p>
                </div>
            </Slider>
        </div>
    );
};

export default withRouter(CenterMode);