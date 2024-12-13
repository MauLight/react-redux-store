import { postIndividualProductAsync } from '@/features/products/productsSlice'
import { AppDispatch } from '@/store/store'
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
        reset()
        setConfirmationDialogue(false)
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className='w-full col-span-2 flex flex-col gap-y-5 px-10 py-10 bg-[#ffffff] border-x border-sym_gray-400'>
                <h1 className='text-[2rem] text-balance leading-tight uppercase'>Add your individual products here:</h1>
                <div className='flex flex-col gap-y-5'>
                    <div className="flex flex-col gap-y-2">
                        <div className="flex flex-col gap-y-1">
                            <label className='text-[0.8rem]' htmlFor="description">Title</label>
                            <input
                                {...register('title')}
                                type="text"
                                className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.title !== undefined ? 'ring-1 ring-red-500' : ''}`}
                                placeholder='Title'
                            />
                        </div>
                        {errors.title && <small className="text-red-500">{errors.title.message}</small>}
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <div className="flex flex-col gap-y-1">
                            <label className='text-[0.8rem]' htmlFor="description">Description</label>
                            <input
                                {...register('description')}
                                type="text"
                                className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.description !== undefined ? 'ring-1 ring-red-500' : ''}`}
                                placeholder='Description'
                            />
                        </div>
                        {errors.description && <small className="text-red-500">{errors.description.message}</small>}
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <div className="flex flex-col gap-y-1">
                            <label className='text-[0.8rem]' htmlFor="description">Price</label>
                            <input
                                {...register('price')}
                                type="number"
                                className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.price !== undefined ? 'ring-1 ring-red-500' : ''}`}
                                placeholder='Price'
                            />
                        </div>
                        {errors.price && <small className="text-red-500">{errors.price.message}</small>}
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <div className="flex flex-col gap-y-1">
                            <label className='text-[0.8rem]' htmlFor="description">Full price</label>
                            <input
                                {...register('fullPrice')}
                                type="number"
                                className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.fullPrice !== undefined ? 'ring-1 ring-red-500' : ''}`}
                                placeholder='Full price'
                            />
                        </div>
                        {errors.fullPrice && <small className="text-red-500">{errors.fullPrice.message}</small>}
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <div className="flex flex-col gap-y-1">
                            <label className='text-[0.8rem]' htmlFor="description">Image</label>
                            <input
                                {...register('image')}
                                type="text"
                                className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.image !== undefined ? 'ring-1 ring-red-500' : ''}`}
                                placeholder='Image'
                            />
                        </div>
                        {errors.image && <small className="text-red-500">{errors.image.message}</small>}
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <div className="flex flex-col gap-y-1">
                            <label className='text-[0.8rem]' htmlFor="description">Rating</label>
                            <input
                                {...register('rating')}
                                type="number"
                                className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.rating !== undefined ? 'ring-1 ring-red-500' : ''}`}
                                placeholder='Rating'
                            />
                        </div>
                        {errors.rating && <small className="text-red-500">{errors.rating.message}</small>}
                    </div>

                </div>

                <button type="submit" className='h-10 bg-[#10100e] text-[#ffffff] mt-2'>Submit</button>
            </form>
            {
                confirmationDialogue && (
                    <Modal openModal={confirmationDialogue} handleOpenModal={() => { setConfirmationDialogue(!confirmationDialogue) }}>
                        <>
                            <h1 className='text-[2rem] text-balance uppercase'> Is the information correct?</h1>
                            <div className="border-b border-sym_gray-600 mb-10 mt-5"></div>
                            <section className='flex gap-x-5'>
                                <div className='min-w-[23rem] h-[33rem]'>
                                    <ProductCard product={getValues()} />
                                </div>
                                <div className="w-full h-[33rem] flex flex-col justify-between">
                                    <div className="flex flex-col">
                                        <h2 className='text-[3rem] font-light text-sym_gray-600 text-balance uppercase'>{getValues().title}</h2>
                                        <div className='flex justify-end gap-x-2'>
                                            <p className='text-[3rem] text-end'>{`$${getValues().price}`}</p>
                                            <p className='text-[2rem] str font-light text-sym_gray-200 text-end uppercase'>us</p>
                                        </div>
                                        <button className='h-10 px-2 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e]'>Add to cart</button>
                                        <div className="border-b border-sym_gray-600 mt-10 mb-5"></div>
                                        <p className='font-light text-[1.2rem] tracking-tighter'>{getValues().description}</p>
                                    </div>
                                    <div className="flex justify-end items-center gap-x-2">
                                        <p className='font-light leading-none'>{'(0/5)'}</p>
                                        <div className="flex gap-x-[0.1rem] justify-end items-center text-sym_gray-500">
                                            <i className="fa-regular fa-star fa-lg"></i>
                                            <i className="fa-regular fa-star fa-lg"></i>
                                            <i className="fa-regular fa-star fa-lg"></i>
                                            <i className="fa-regular fa-star fa-lg"></i>
                                            <i className="fa-regular fa-star fa-lg"></i>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <div className="border-b border-sym_gray-600 mb-5 mt-10"></div>
                            <div className="flex justify-between items-center gap-x-5">
                                <div>
                                    {
                                        getValues().description.length < 200 && (
                                            <p className='text-red-500 text-[0.8rem]'>Your description is too short, try adding more than 200 characters.</p>
                                        )
                                    }
                                    {
                                        !getValues().image && (
                                            <p className='text-red-500 text-[0.8rem]'>A placeholder was added as image because you did not add a valid image url.</p>
                                        )
                                    }
                                </div>
                                <div className="flex gap-x-5">
                                    <button onClick={() => { setConfirmationDialogue(false) }} className='h-10 px-5 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-red-500 active:bg-[#10100e]'>Cancel</button><button onClick={handlePostProduct} className='h-10 px-5 mt-5 uppercase text-[#ffffff] transition-all duration-200 bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e]'>Confirm</button>
                                </div>
                            </div>
                        </>
                    </Modal>
                )
            }
        </>
    )
}

export default IndividualProduct
