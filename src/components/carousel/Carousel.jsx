import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-multi-carousel/lib/styles.css";
import Slider from "react-slick";

export default function Carousels(props) {
  const SlickArrowRight = () => {
    return <></>;
  };

  const SlickArrowLeft = () => {
    return <></>;
  };

  var settings = {
    dots: true,
    arrows: true,
    nextArrow: <SlickArrowRight />,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: false,
    focusOnSelect: true,
    draggable: true,
    edgeFriction: 1,
    swipeToSlide: true,
    accessibility: true,
    autoplaySpeed: 2000,
    centerMode: true, // Menyertakan centerMode
    centerPadding: "50px", // Sesuaikan dengan jumlah padding yang Anda inginkan
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
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
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <div className="container mx-auto xl:grid xl:grid-cols-2 w-full px-0 xl:px-4 xl:py-8">
      <div className="block md:hidden px-4 mb-4 text-gray-500">
        <div className="font-semibold text-sm">Hai Traveller,</div>
        <small>nikmati promo menarik lainya untuk kamu.</small>
      </div>
      <div className="hidden xl:block ">
        <div className="flex space-x-4 pl-12 text-white">
          <img className="" src="/join.svg" width={160} alt="carousal.png" />
          <div>
            <h1 className="2xl:px-8 text-xl font-bold">Hai Traveller,</h1>
            <div className="mt-2 2xl:px-8">
              <div className="mt-4">
                Cukup login ke akun Anda dan melakukan pemesanan tiket untuk
                berbagai macam perjalanan.
              </div>
              <div className="mt-6">
                Nikmati perjalanan anda di beberapa menu travel kereta, kapal,
                dan pesawat.
              </div>
            </div>
          </div>
        </div>
      </div>
      <Slider {...settings}>
        <div className="flex justify-center px-2">
          <img
            className="w-full h-full xl:rounded-xl"
            src="/slider-1.jpg"
            alt=""
          />
        </div>
        <div className="flex justify-center px-2">
          <img
            className="w-full h-full xl:rounded-xl"
            src="/slider-2.jpg"
            alt=""
          />
        </div>
        <div className="flex justify-center px-2">
          <img
            className="w-full h-full xl:rounded-xl"
            src="/slider-3.jpg"
            alt=""
          />
        </div>
        <div className="flex justify-center px-2">
          <img
            className="w-full h-full xl:rounded-xl"
            src="/slider-4.png"
            alt=""
          />
        </div>
      </Slider>
    </div>
  );
}
