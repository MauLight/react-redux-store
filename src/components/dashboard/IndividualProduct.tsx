import { ProductProps } from '@/utils/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

export const productSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    price: yup.number().positive('Price must be a positive number').required('Price is required'),
    fullPrice: yup.number().positive('Full price must be a positive number').required('Full price is required'),
    image: yup.string().url('Image must be a valid URL').required('Image is required'),
    rating: yup.number().min(0, 'Rating must be at least 0').max(5, 'Rating must be at most 5').required('Rating is required')
})

function IndividualProduct(): ReactNode {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(productSchema)
    })

    const onSubmit = (data: ProductProps) => {
        console.log('Form submitted:', data)
        reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='w-full col-span-1 flex flex-col px-5 pt-5 pb-2 gap-y-2 bg-[#ffffff] rounded-[10px]'>
            <h1>Add your individual products here:</h1>
            <input
                {...register('title')}
                type="text"
                className='h-10 px-2 border rounded-[5px] text-[1rem] placeholder-sym_gray-400 outline-none'
                placeholder='Title'
            />
            {errors.title && <small className="text-red-500">{errors.title.message}</small>}

            <input
                {...register('description')}
                type="text"
                className='h-10 px-2 border rounded-[5px] text-[1rem] placeholder-sym_gray-400 outline-none'
                placeholder='Description'
            />
            {errors.description && <small className="text-red-500">{errors.description.message}</small>}

            <input
                {...register('price')}
                type="number"
                className='h-10 px-2 border rounded-[5px] text-[1rem] placeholder-sym_gray-400 outline-none'
                placeholder='Price'
            />
            {errors.price && <small className="text-red-500">{errors.price.message}</small>}

            <input
                {...register('fullPrice')}
                type="number"
                className='h-10 px-2 border rounded-[5px] text-[1rem] placeholder-sym_gray-400 outline-none'
                placeholder='Full price'
            />
            {errors.fullPrice && <small className="text-red-500">{errors.fullPrice.message}</small>}

            <input
                {...register('image')}
                type="text"
                className='h-10 px-2 border rounded-[5px] text-[1rem] placeholder-sym_gray-400 outline-none'
                placeholder='Image'
            />
            {errors.image && <small className="text-red-500">{errors.image.message}</small>}

            <input
                {...register('rating')}
                type="number"
                className='h-10 px-2 border rounded-[5px] text-[1rem] placeholder-sym_gray-400 outline-none'
                placeholder='Rating'
            />
            {errors.rating && <small className="text-red-500">{errors.rating.message}</small>}

            <button type="submit" className='h-10 bg-[#10100e] text-[#ffffff] mt-2'>Submit</button>
        </form>
    )
}

export default IndividualProduct
