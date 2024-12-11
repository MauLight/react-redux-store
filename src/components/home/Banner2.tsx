import { type ReactElement } from 'react'

export const Banner2 = (): ReactElement => {
    return (
        <div className="relative border h-[900px] w-full grid grid-cols-3">
            <div className="col-span-2 relative w-full flex justify-center items-center">
                <img src='https://res.cloudinary.com/maulight/image/upload/v1732918809/e-commerce/banner_2.webp' className='h-full object-cover' />
            </div>
            <div className='col-span-1 flex justify-center items-center bg-[#9ed6f7]'>
                <h1 className='absolute right-[12%] neue text-[42px] animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text'>Surreal Collection</h1>
            </div>
        </div>
    )
}
