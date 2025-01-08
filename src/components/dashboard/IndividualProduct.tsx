import { postIndividualProductAsync } from '@/features/products/productsSlice'
import { AppDispatch } from '@/store/store'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { Modal } from '../common/Modal'
import ConfirmationModal from './ConfirmationModal'

export const productSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    image: yup.string().url('Image must be a valid URL'),
    price: yup.number().required(),
    discount: yup.number().required()
})

function IndividualProduct(): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const [confirmationDialogue, setConfirmationDialogue] = useState<boolean>(false)
    const [priceWithDiscount, setPriceWithDiscount] = useState<number>(0)

    const { watch, register, getValues, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            image: ''
        },
        resolver: yupResolver(productSchema)
    })
    const watchedValues = watch(['price', 'discount'])

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
            const { payload } = await dispatch(postIndividualProductAsync({ ...data }))
            if (payload) {
                toast.success(payload.message)
            } else {
                toast.error('There was an error with your request.')
            }
        }
        reset()
        setConfirmationDialogue(false)
    }

    function getPercentage() {
        const percentage = getValues().discount
        const price = getValues().price
        const discount = (percentage / 100) * price
        setPriceWithDiscount(price - discount)
    }

    useEffect(() => {
        getPercentage()
    }, [watchedValues])

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className='w-full col-span-1 flex flex-col gap-y-5 px-4 md:px-10 py-10 bg-[#ffffff] border-x border-sym_gray-400'>
                <h1 className='text-[1.5rem] sm:text-[2rem] text-balance leading-tight uppercase'>Add individual products here:</h1>
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
                            <label className='text-[0.8rem]' htmlFor="description">Price</label>
                            <input
                                {...register('price')}
                                className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.price !== undefined ? 'ring-1 ring-red-500' : ''}`}
                                placeholder='Full price'
                            />
                        </div>
                        {errors.price && <small className="text-red-500">{errors.price.message}</small>}
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <div className="flex flex-col gap-y-1">
                            <label className='text-[0.8rem]' htmlFor="description">{'Discount (leave empty if no discount)'}</label>
                            <input
                                {...register('discount')}
                                className={`w-full h-9 bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500`}
                            />
                        </div>
                        {errors.discount && <small className="text-red-500">{errors.discount.message}</small>}
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <div className="flex flex-col gap-y-1">
                            <label className='text-[0.8rem]' htmlFor="description">Price with discount</label>
                            <input
                                disabled
                                value={priceWithDiscount}
                                type="number"
                                className={`w-full h-9 bg-gray-50 rounded-[3px] border border-indigo-500 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500`}
                            />
                        </div>
                    </div>

                </div>

                <button type="submit" className='h-10 bg-[#10100e] text-[#ffffff] mt-2'>Submit</button>
            </form>
            {
                confirmationDialogue && (
                    <Modal openModal={confirmationDialogue} handleOpenModal={() => { setConfirmationDialogue(!confirmationDialogue) }}>
                        <ConfirmationModal
                            product={{ ...getValues() }}
                            setConfirmationDialogue={setConfirmationDialogue}
                            handlePostProduct={handlePostProduct}
                        />
                    </Modal>
                )
            }
        </>
    )
}

export default IndividualProduct
