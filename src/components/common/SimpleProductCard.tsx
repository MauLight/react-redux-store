import { CartItemProps, ProductProps } from '@/utils/types'

export default function SimpleProductCard({ product }: { product: ProductProps | CartItemProps }) {

    const image = (product as ProductProps).images ? (product as ProductProps).images[0].image : (product as CartItemProps).image

    return (
        <div className="grid grid-cols-3 gap-10">
            <div className='col-span-1'>
                <img src={image} alt="product" />
            </div>
            <div className="col-span-2 flex flex-col max-sm:justify-center">
                <h1 className='text-[0.9rem] sm:text-[2rem]'>{product.title}</h1>
                <p className='text-gray-700 hidden sm:flex'>{product.description}</p>
            </div>
        </div>
    )
}
