import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-multi-carousel/lib/styles.css";
import Slider from "react-slick";

const customLayout = localStorage.getItem("v-data2") ? JSON.parse(localStorage.getItem("v-data2")) : '';

export default function CarouselsMobile(props) {
  const SlickArrowRight = () => {
    return <></>;
  };

  var settings = {
    dots: false,
    arrows: true,
    nextArrow: <SlickArrowRight />,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    focusOnSelect: true,
    draggable: true,
    edgeFriction: 1,
    swipeToSlide: true,
    accessibility: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="xl:grid xl:grid-cols-2 w-full px-0 xl:px-4 xl:py-8">
      <div className={`block md:hidden px-4 mb-4 text-[${customLayout?.color?.secondary?.font_color ?? ''}]`}>
        <div className="font-semibold text-sm">Hai traveller,</div>
        <small>
                {Array.isArray(customLayout?.wording?.secondary?.desktop) && customLayout?.wording?.secondary?.mobile 
                  ? customLayout?.wording?.secondary?.mobile
                  : `Cukup login ke akun Anda dan melakukan pemesanan tiket untuk berbagai macam perjalanan anda.`
                }
        </small>
      </div>
      <Slider {...settings}>
        <div className="flex justify-center px-4 py-4 mt-4">
          <img
            className="w-full h-full rounded-3xl"
            src="/slider-1.jpeg"
            alt=""
          />
        </div>
        <div className="flex justify-center px-2  py-4 mt-4">
          <img
            className="w-full h-full rounded-3xl"
            src="/slider-2.jpeg"
            alt=""
          />
        </div>
        <div className="flex justify-center px-2  py-4 mt-4">
          <img
            className="w-full h-full rounded-3xl"
            src="/slider-3.jpeg"
            alt=""
          />
        </div>
        <div className="flex justify-center px-2  py-4 mt-4">
          <img
            className="w-full h-full rounded-3xl"
            src="/slider-4.jpeg"
            alt=""
          />
        </div>
        <div className="flex justify-center px-2  py-4 mt-4">
          <img
            className="w-full h-full rounded-3xl"
            src="/slider-5.jpeg"
            alt=""
          />
        </div>
      </Slider>
    </div>
  );
}
