import { type ReactNode } from 'react'
import { ProductCard } from '@/components/common/ProductCard'
import video from '@/assets/video/Alien.webm'
import { v4 as uuid } from 'uuid'

interface CollectionProps {
    title: string
}

const products = [
    {
        id: '1',
        description: "col-484d6936-64c6-47ae-ba0d-41a74177b446",
        title: "Into the unknown",
        price: 1400,
        fullPrice: 1680,
        image: "https://res.cloudinary.com/maulight/image/upload/v1732918791/e-commerce/banner_1.webp"
    },
    {
        id: '2',
        description: "col-bb4ab7fb-5f48-4e70-9099-db22d3fa564e",
        title: "Radiant Skyline",
        price: 1400,
        fullPrice: 1680,
        image: "https://res.cloudinary.com/maulight/image/upload/v1732918603/e-commerce/home_3.webp"
    },
    {
        id: '3',
        description: "col-51381472-9fca-47aa-adeb-4dcf53b29a68",
        title: "Face of the deep",
        price: 1400,
        fullPrice: 1680,
        image: "https://res.cloudinary.com/maulight/image/upload/v1732918602/e-commerce/home_1.webp"
    },
    {
        id: '4',
        description: "col-1ff69ea5-5a2a-45f8-9b1e-28b9a474488e",
        title: "A vintage sunset",
        price: 1180,
        fullPrice: 1416,
        image: "https://res.cloudinary.com/maulight/image/upload/v1732918603/e-commerce/home_2.webp"
    }
];

export default function Collection({ title = 'Collection' }: CollectionProps): ReactNode {
    const id = uuid()
    return (
        <main className='relative w-screen min-h-screen flex flex-col justify-center items-center pb-20'>
            <div className='z-20'>
                <header className='w-[1440px] h-[30rem] flex justify-start items-center'>
                    <h1 className='text-[#ffffff] text-[5rem] animated-background bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text'>{title}</h1>
                </header>
                <nav></nav>
                <section className="w-full min-web:w-[1440px] h-full grid grid-cols-2 min-[1440px]:grid-cols-3">
                    {
                        [...products, ...products, ...products].map((product, i) => (
                            <ProductCard key={`${product.id}-${id}-${i}`} product={product} />
                        ))
                    }
                </section>
            </div>
            <video autoPlay muted loop src={video} className='absolute top-0 left-0 w-screen h-screen object-cover opacity-30'></video>
        </main>
    )
}
