import { postIndividualProductAsync } from '@/features/products/productsSlice'
import { AppDispatch } from '@/store/store'
import { ProductProps } from '@/utils/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { Modal } from '../common/Modal'
import { ProductCard } from '../common/ProductCard'

export const productSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    price: yup.number().positive('Price must be a positive number').required('Price is required'),
    fullPrice: yup.number().positive('Full price must be a positive number').required('Full price is required'),
    image: yup.string().url('Image must be a valid URL'),
    rating: yup.number().min(0, 'Rating must be at least 0').max(5, 'Rating must be at most 5').required('Rating is required')
})

function IndividualProduct(): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const [confirmationDialogue, setConfirmationDialogue] = useState<boolean>(false)
    const { register, getValues, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            price: 0,
            fullPrice: 0,
            image: '',
            rating: 0
        },
        resolver: yupResolver(productSchema)
    })

    const onSubmit = () => {
        setConfirmationDialogue(true)
    }

    async function handlePostProduct() {
        const data = getValues()

        const isUrl = /^(https?:\/\/)?((([a-zA-Z0-9$_.+!*'(),;?&=-]|%[0-9a-fA-F]{2})+:)*([a-zA-Z0-9$_.+!*'(),;?&=-]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:[0-9]+)?(\/([a-zA-Z0-9$_.+!*'(),;:@&=-]|%[0-9a-fA-F]{2})*)*(\?([a-zA-Z0-9$_.+!*'(),;:@&=-]|%[0-9a-fA-F]{2})*)?(#([a-zA-Z0-9$_.+!*'(),;:@&=-]|%[0-9a-fA-F]{2})*)?$/.test(data.image as string)

        if (!isUrl) {
            const { payload } = await dispatch(postIndividualProductAsync({ ...data, image: 'https://dummyimage.com/600x400/000/fff' }))
            if (payload) {
                toast.success(payload.message)
            } else {
                toast.error('There was an error with your request.')
            }
        } else {
            const { payload } = await dispatch(postIndividualProductAsync(data))
            if (payload) {
                toast.success(payload.message)
            } else {
                toast.error('There was an error with your request.')
            }
        }
        console.log('Form submitted:', data)
        reset()
    }

    return (
        <>
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
            {
                confirmationDialogue && (
                    <Modal openModal={confirmationDialogue} handleOpenModal={() => { setConfirmationDialogue(!confirmationDialogue) }}>
                        <p>some</p>
                        <ProductCard product={getValues()} />
                    </Modal>
                )
            }
        </>
    )
}

export default IndividualProduct
