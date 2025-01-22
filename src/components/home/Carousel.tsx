import { useEffect, useRef, type ReactNode } from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useSelector } from 'react-redux'
import { StoreProps } from '@/utils/types'
import { AppDispatch } from '@/store/store'
import { useDispatch } from 'react-redux'
import { getSliderByIdAsync } from '@/features/ui/uiSlice'
import ErrorComponent from '../common/ErrorComponent'
import Fallback from '../common/Fallback'

function PrevArrow({ prev }: { prev: () => void }) {
    return (
        <div onClick={prev} className='absolute top-0 left-0 h-full w-[60px] flex items-center justify-center cursor-pointer z-50'>
            <div className='w-[60px] h-[60px] flex justify-center items-center bg-[#ffffff] hover:bg-indigo-500 transition-color duration-200'>
                <i className="fa-solid fa-arrow-left"></i>
            </div>
        </div>
    )
}

function NextArrow({ next }: { next: () => void }) {
    return (
        <div onClick={next} className='absolute top-0 right-0 h-full w-[60px] flex items-center justify-center cursor-pointer z-50'>

            <div className='w-[60px] h-[60px] flex justify-center items-center bg-[#ffffff] hover:bg-indigo-500 transition-color duration-200'>
                <i className="fa-solid fa-arrow-right"></i>
            </div>
        </div>
    )
}

function Carousel({ isBuilder }: { isBuilder?: boolean }): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const { currUI, currSlider, uiHasError, uiIsLoading } = useSelector((state: StoreProps) => state.ui)
    let sliderRef = useRef(null)

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: currSlider.speed ? (currSlider.speed * 1000) : 2000,
        autoplaySpeed: 5000,
        fade: currSlider.animation.toLowerCase() === 'fade' ? true : false,
        waitForAnimate: false,
        arrows: false,
        pauseOnHover: true
    }

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

    useEffect(() => {
        async function getCurrentSlider() {
            const { payload } = await dispatch(getSliderByIdAsync(currUI.home.slider.currSlider))
            if (payload.slider.imageList.length > 0) {
                console.log(payload.slider.imageList)
            }
        }

        if (currUI && currUI.home.slider.currSlider) {
            getCurrentSlider()
        }

    }, [currUI])

    useEffect(() => {
        console.log(currSlider.imageList)
    }, [currSlider])

    return (
        <>
            {
                uiHasError && (
                    <ErrorComponent />
                )
            }
            {
                !uiHasError && uiIsLoading && (
                    <div className="w-full h-full flex justify-center items-center">
                        <Fallback color='#6366f1' />
                    </div>
                )
            }
            {
                !uiHasError && !uiIsLoading && currSlider && (
                    <div className='relative slide-container flex justify-center h-full'>
                        <PrevArrow prev={prevSlide} />
                        <NextArrow next={nextSlide} />
                        <Slider ref={sliderRef} className={isBuilder ? 'h-full w-full' : 'h-[900px] w-full'} {...settings} >
                            {
                                currSlider.imageList.map((item: { image: string, public_id: string }) => (
                                    <img className={isBuilder ? 'h-[620px] object-cover' : 'h-[900px] object-cover'} key={item.public_id} src={item.image} />
                                ))
                            }
                        </Slider>
                    </div>
                )
            }
        </>
    )
}

export default Carousel