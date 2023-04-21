import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"

import "./Carousel.css"

const Carousel = ({ images, current }) => {

  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrevClick = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length)
  }

  const handleNextClick = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  }

  let className = current ? "carousel-image active" : "carousel-image"

  return (
    <div className="carousel">
        <button onClick={handlePrevClick} className="carousel-button">
            <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <img
            src={images[currentIndex]}
            className={className}
            alt=""
        />
        <button onClick={handleNextClick} className="carousel-button">
            <FontAwesomeIcon icon={faArrowRight} />
        </button>
    </div>
  );
};

export default Carousel;
