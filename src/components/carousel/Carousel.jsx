import Carousel from "react-multi-carousel";
import { useEffect, useState } from "react";
import "react-multi-carousel/lib/styles.css";

export default function Carousels(props) {

    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 5
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
      };

    return (
        <div className="w-full">
                <Carousel 

                autoPlaySpeed={1000}
                keyBoardControl={true}
                customTransition="all .1"
                transitionDuration={100}               
                infinite={true}
                responsive={responsive}
            
                >
                    <div className="flex justify-center px-2">
                        <img className="h-36 xl:h-64 rounded-xl" src="/slider-1.jpg" alt="" />
                    </div>
                    <div className="flex justify-center px-2">
                        <img className="h-36 xl:h-64 rounded-xl" src="/slider-2.jpg" alt="" />
                    </div>
                    <div className="flex justify-center px-2">
                        <img className="h-36 xl:h-64 rounded-xl" src="/slider-3.jpg" alt="" />
                    </div>
                    <div className="flex justify-center px-2">
                        <img className="h-36 xl:h-64 rounded-xl" src="/slider-4.png"alt="" />
                    </div>
                </Carousel>
        </div>
    )
}