import { useRef, type ReactNode } from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const images = [
    {
        id: 'a1',
        img: 'https://images.unsplash.com/photo-1605976511586-97429c97da3a'
    },
    {
        id: 'b2',
        img: 'https://images.unsplash.com/photo-1673098654488-e8d3c0139134'
    },
    {
        id: 'c3',
        img: 'https://images.unsplash.com/photo-1620737729381-a79833458394'
    },
    {
        id: 'd4',
        img: 'https://images.unsplash.com/photo-1631981152698-bdee35111fd2'
    },
]

function PrevArrow({ prev }: { prev: () => void }) {
    return (
        <div onClick={prev} className='absolute top-0 left-0 h-full w-[60px] flex items-center justify-center cursor-pointer z-50 hover:bg-sym_gray-800'>
            <div className='w-[60px] h-[60px] flex justify-center items-center bg-[#ffffff] hover:bg-indigo-500 transition-color duration-200'>
                <i className="fa-solid fa-arrow-left"></i>
            </div>
        </div>
    )
}

function NextArrow({ next }: { next: () => void }) {
    return (
        <div onClick={next} className='absolute top-0 right-0 h-full w-[60px] flex items-center justify-center cursor-pointer z-50 hover:bg-sym_gray-800'>

            <div className='w-[60px] h-[60px] flex justify-center items-center bg-[#ffffff] hover:bg-indigo-500 transition-color duration-200'>
                <i className="fa-solid fa-arrow-right"></i>
            </div>
        </div>
    )
}

const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 5000,
    fade: true,
    waitForAnimate: false,
    arrows: false
}

function Carousel(): ReactNode {
    let sliderRef = useRef(null)

    function prevSlide() {
        if (sliderRef.current) {
            (sliderRef.current as Slider).slickPrev()
        }
    }
    function nextSlide() {
        if (sliderRef.current) {
            (sliderRef.current as Slider).slickNext()
        }
    }
    return (
        <div className='relative slide-container flex justify-center h-full'>
            <PrevArrow prev={prevSlide} />
            <NextArrow next={nextSlide} />
            <Slider ref={sliderRef} className='h-[900px] w-full' {...settings} >
                {
                    images.map((img) => (
                        <img className='h-[900px] object-cover' key={img.id} src={img.img} />
                    ))
                }
            </Slider>
        </div>
    )
}

export default Carousel