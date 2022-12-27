import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";

export default function Carousels(props) {

    const [width, setWidth] = useState();

    useEffect(() =>{
        setWidth(window.innerHeight)
    }, [setWidth]);

    const settingWindows =                 
    {
        dots: true,
        infinite: true,
        speed: 2000,
        autoPlay: true,
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
    };

    const settingMobile = {

        focusOnSelect: true,
        slidesToShow: 3,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        dots:true
    };

    return (
        <div className="px-0 xl:px-16">
        {
            width <= 786 ?

            (
                <Slider {...settingWindows}
            
                >
                    <div className="flex justify-center space-x-2 px-4 mx-2">
                        <img className="h-36 xl:h-64 rounded-xl" src="/slider-1.jpg" alt="" />
                    </div>
                    <div className="flex justify-center space-x-2 px-4 mx-2">
                        <img className="h-36 xl:h-64 rounded-xl" src="/slider-2.jpg" alt="" />
                    </div>
                    <div className="flex justify-centerspace-x-2 px-2 mx-2">
                        <img className="h-36 xl:h-64 rounded-xl" src="/slider-3.jpg" alt="" />
                    </div>
                    <div className="flex justify-center space-x-2 px-2 mx-2">
                        <img className="h-36 xl:h-64 rounded-xl" src="/slider-4.png"alt="" />
                    </div>
                </Slider>
            ) : 
            

            (
                <Slider {...settingMobile}
            
                >
                    <div className="flex justify-center space-x-4 px-4 mx-4">
                        <img className="h-36 xl:h-64 rounded-xl" src="/slider-1.jpg" alt="" />
                    </div>
                    <div className="flex justify-center space-x-4 px-4 mx-4">
                        <img className="h-36 xl:h-64 rounded-xl" src="/slider-2.jpg" alt="" />
                    </div>
                    <div className="flex justify-centerspace-x-4 px-4 mx-4">
                        <img className="h-36 xl:h-64 rounded-xl" src="/slider-3.jpg" alt="" />
                    </div>
                    <div className="flex justify-center space-x-4 px-4 mx-4">
                        <img className="h-36 xl:h-64 rounded-xl" src="/slider-4.png"alt="" />
                    </div>
                </Slider>
            )

        }

        </div>
    )
}