import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export default function Carousels({props}) {
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 864 },
            items: 3,
            slidesToSlide: 3 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 800, min: 464 },
            items: 2,
            slidesToSlide: 2 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };
    return (
        <>
            <Carousel
                swipeable={false}
                draggable={false}
                showDots={true}
                responsive={responsive}
                ssr={true} // means to render carousel on server-side.
                infinite={true}
                autoPlay={props !== "mobile" ? true : false}
                autoPlaySpeed={1000}
                keyBoardControl={true}
                customTransition="all .5"
                transitionDuration={500}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                deviceType={props}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-5-px"
                centerMode={true}
            >
                <div>
                    <img src="/wisata.png" alt="" />
                </div>
                <div>
                    <img src="/hotel.png" alt="" />
                </div>
                <div>
                    <img src="/pelni.png" alt="" />
                </div>
                <div>
                    <img src="/train.png" alt="" />
                </div>
                <div>
                    <img className="h-96" src="/plane.png" alt="" />
                </div>
                <div>
                    <img src="/logo.png" alt="" />
                </div>
                <div>
                    <img className="h-96" src="/logo192.png" alt="" />
                </div>
                <div>
                    <img className="h-24" src="/logo512.png" alt="" />
                </div>
            </Carousel>
        </>
    )
}