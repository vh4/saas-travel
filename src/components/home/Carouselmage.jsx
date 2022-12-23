import React, { Component } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

export default function Carouselmage(props){

    return (
        <div className="container flex justify-center">
          <div>
          <Carousel>
              <div>
                  <img src={'/slider-1.jpg'} />
                  <p className="legend">Legend 1</p>
              </div>
              <div>
              <img src={'/slider-2.jpg'} />
                  <p className="legend">Legend 2</p>
              </div>
              <div>
              <img src={'/slider-3.jpg'} />
                  <p className="legend">Legend 3</p>
              </div>
          </Carousel>        
          </div> 
        </div>
    )
    
}