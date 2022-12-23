import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export default function Carousels({props}) {
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
        },
        tablet: {
            breakpoint: { max: 800, min: 464 },
            items: 1,
            slidesToSlide: 2 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };
    return (
        <div >
            <Carousel
                swipeable={false}
                draggable={false}
                showDots={true}
                responsive={responsive}
                ssr={true} // means to render carousel on server-side.
                infinite={true}
                autoPlay={props !== "mobile" ? true : false}
                autoPlaySpeed={2000}
                keyBoardControl={true}
                customTransition="transform 300ms ease-in-out"
                transitionDuration={2000}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                deviceType={props}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-5-px"
                centerMode={true}
            >
                <div className="pr-4">
                    <img className="h-96" src="/slider-1.jpg" alt="" />
                </div>
                <div className="pr-4">
                    <img className="h-96" src="/slider-2.jpg" alt="" />
                </div>
                <div className="pr-4">
                    <img className="h-96" ssrc="/slider-3.jpg" alt="" />
                </div>
                <div className="pr-4"> 
                    <img className="h-96" src="/slider-4.png"alt="" />
                </div>
                <div className="pr-4"> 
                    <img className="h-96" src="/slider-4.png"alt="" />
                </div>
            </Carousel>
        </div>
    )
}