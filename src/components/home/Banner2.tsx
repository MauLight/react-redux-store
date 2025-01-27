import { StoreProps } from '@/utils/types'
import { type ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export const Banner2 = (): ReactElement => {
    const { currentTemplate } = useSelector((state: StoreProps) => state.ui)

    return (
        <Link to={'/collection'} className={currentTemplate.hero ? currentTemplate.hero.layout : "relative h-[900px] w-full overflow-hidden"}>
            <div className={currentTemplate.hero ? currentTemplate.hero.image : 'h-full grid grid-cols-3 overflow-hidden'}>
                <div className="col-span-2 relative w-full hidden sm:flex justify-center items-center">
                    <img src='https://res.cloudinary.com/maulight/image/upload/v1732918809/e-commerce/banner_2.webp' className='object-cover' />
                </div>
                <div className='col-span-3 sm:col-span-1 flex justify-center items-center bg-[#9ed6f7]'>
                    <h1 className='absolute right-[12%] neue text-[2rem] sm:text-[3rem] animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text'>Surreal Collection</h1>
                </div>
            </div>
        </Link>
    )
}
