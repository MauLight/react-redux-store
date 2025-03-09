import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useDispatch } from 'react-redux'
import { getAllProductsAsync, updateProductByIdAsync } from '@/features/products/productsSlice'
import { AppDispatch } from '@/store/store'
import Compressor from 'compressorjs'

import axios from 'axios'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import IndividualProductImage from './IndividualProductImage'
import { ProductProps, StoreProps } from '@/utils/types'
import { generateSignature, getPercentage } from '@/utils/functions'
import { useSelector } from 'react-redux'
import IndividualProductForm from './IndividualProductsForm'
import { Modal } from '../common/Modal'
import ConfirmationModal from './ConfirmationModal'
import { toast } from 'react-toastify'

export const productSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    brand: yup.string().required(),
    description: yup.string().required('Description is required'),
    image: yup.string().url('Image must be a valid URL'),
    weight: yup.number(),
    height: yup.number(),
    width: yup.number(),
    length: yup.number(),
    price: yup.number().required('Price is required'),
    discount: yup.number(),
    quantity: yup.number().required(),
})

const CloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUDNAME
const CloudinaryAPIKEY = import.meta.env.VITE_CLOUDINARY_APIKEY

interface IndividualProductFormProps {
    product: ProductProps
    handleOpenUpdateProduct: () => void
    closeModal: () => void
}

function UpdateProductForm({ product, handleOpenUpdateProduct, closeModal }: IndividualProductFormProps): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const postProductIsLoading = useSelector((state: StoreProps) => state.inventory.productsAreLoading)
    const postProductError = useSelector((state: StoreProps) => state.inventory.productsHasError)
    const postProductErrorMessage = useSelector((state: StoreProps) => state.inventory.errorMessage)

    const [tags, setTags] = useState<string[]>(product.tags || [])
    const [wasSubmitted, setWasSubmitted] = useState<boolean>(false)
    const [confirmationDialogue, setConfirmationDialogue] = useState<boolean>(false)

    //* UseForm State
    const [priceWithDiscount, setPriceWithDiscount] = useState<number>(0)
    const { watch, register, getValues, setValue, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: product.title || '',
            brand: product.brand || '',
            description: product.description || '',
            image: product.images[0].image || '',
            weight: product.weight || 0,
            height: product.height || 0,
            width: product.width || 0,
            length: product.length || 0,
            price: product.price || 0,
            discount: product.discount || 0,
            quantity: product.quantity || 0
        },
        resolver: yupResolver(productSchema)
    })

    const watchedValues = watch(['price', 'discount'])
    const valuesForDescription = watch(['title', 'brand'])
    const descriptionAdded = watch(['description'])

    const onSubmit = () => {
        setConfirmationDialogue(true)
    }

    async function handleUpdateProduct() {
        const data = getValues()
        const { payload } = await dispatch(updateProductByIdAsync({ id: product.id as string, values: data }))
        if (payload.updatedProduct) {
            await dispatch(getAllProductsAsync())
            handleOpenUpdateProduct()
            reset()
        }
    }

    //* Cloudinary state
    const [cloudinaryFileUpload, setCloudinaryFileUpload] = useState<string | null>(product.images[0].image || null)
    const [cloudinaryPublicId, setCloudinaryPublicId] = useState<string | null>(null)
    const [compress] = useState<number>(1)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const handleFileButtonClick = (): void => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const postToCloudinary = async (formData: FormData): Promise<any> => {
        const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${CloudinaryCloudName}/image/upload`, formData)
        return data
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        event.preventDefault()

        if (event.target.files !== null) {
            const file = event.target.files[0]
            const formData = new FormData()
            if (compress === 1) {
                new Compressor(file, {
                    quality: 0.6,
                    success(res) {
                        formData.append('file', res)
                        formData.append('upload_preset', 'marketplace')
                        postToCloudinary(formData)
                            .then((response) => {
                                setCloudinaryFileUpload(response.secure_url)
                                setCloudinaryPublicId(response.public_id)
                                setValue('image', response.secure_url)
                            })
                    }
                })
            } else {
                formData.append('file', file)
                formData.append('upload_preset', 'marketplace')
                postToCloudinary(formData)
                    .then((response) => {
                        setCloudinaryFileUpload(response.secure_url)
                        setCloudinaryPublicId(response.public_id)
                        setValue('image', response.secure_url)
                    })
            }


        }
    }

    //* Erase last uploaded image if wants to upload another
    const handleResetUploadImage = async () => {
        const timestamp = Math.floor(Date.now() / 1000)
        const signature = generateSignature({ public_id: cloudinaryPublicId, timestamp })

        const formData = new FormData()
        formData.append('public_id', cloudinaryPublicId as string)
        formData.append('timestamp', timestamp.toString())
        formData.append('api_key', CloudinaryAPIKEY)
        formData.append('signature', signature)

        try {
            await axios.post(`https://api.cloudinary.com/v1_1/${CloudinaryCloudName}/image/destroy`, formData)
            toast.success('Image was deleted succesfully')
        } catch (error) {
            toast.error('There was an error deleting this image')
            console.error('There was an error deleting this image: ', error)
        }

        setCloudinaryFileUpload(null)
        setValue('image', product.images[0].image)
    }

    function handleResetForm() {
        reset()
        setWasSubmitted(true)
    }

    useEffect(() => {
        if (getValues().discount) {
            getPercentage({ ...getValues(), discount: getValues().discount as number }, setPriceWithDiscount)
        }
    }, [watchedValues])

    useEffect(() => {
        if (wasSubmitted && (watchedValues.length || valuesForDescription.length || descriptionAdded.length)) {
            setWasSubmitted(false)
        }
    }, [watchedValues, valuesForDescription, descriptionAdded])

    useEffect(() => {
        if (!postProductError && wasSubmitted) {
            reset()
            setTags([])
            setCloudinaryFileUpload(null)
            setConfirmationDialogue(false)
        }

    }, [wasSubmitted])

    useEffect(() => {
    }, [tags])

    return (
        <section className='relative'>
            <button onClick={closeModal} className='absolute top-0 right-2'>
                <i className="fa-solid fa-lg fa-xmark text-[#10100e] hover:text-red-500 active:text-[#10100e] transition-color duration-200"></i>
            </button>
            <form onSubmit={(e) => { e.preventDefault() }} className='w-full col-span-1 flex flex-col gap-y-5 px-4 md:px-10 py-10 bg-[#ffffff] rounded-[8px]'>
                <h1 className='text-[1rem] sm:text-[1.2rem] text-balance leading-tight'>Update Product:</h1>
                <div className="flex gap-x-5">

                    <IndividualProductForm
                        tags={tags}
                        errors={errors}
                        setTags={setTags}
                        register={register}
                        setValue={setValue}
                        wasSubmitted={wasSubmitted}
                        descriptionAdded={descriptionAdded}
                        priceWithDiscount={priceWithDiscount}
                        valuesForDescription={valuesForDescription}
                    />
                    <IndividualProductImage
                        fileInputRef={fileInputRef}
                        handleFileUpload={handleFileUpload}
                        cloudinaryFileUpload={cloudinaryFileUpload}
                        handleFileButtonClick={handleFileButtonClick}
                        handleResetUploadImage={handleResetUploadImage}
                    />
                </div>
                <div className="flex gap-x-2 justify-end">
                    <button onClick={handleResetForm} type='button' className='w-[150px] h-10 bg-[#ffffff] border border-gray-400 hover:bg-red-500 text-[#10100e] hover:text-[#ffffff] active:bg-[#ffffff] active:text-[#10100e] transition-color duration-200 mt-2 rounded-[10px]'>Reset</button>
                    <button onClick={handleSubmit(onSubmit)} className='w-[150px] h-10 bg-[#10100e] text-[#ffffff] hover:bg-green-600 active:bg-[#10100e] transition-color duration-200 mt-2 rounded-[10px]'>Submit</button>
                </div>
            </form>
            {
                confirmationDialogue && (
                    <Modal width='w-[1000px]' openModal={confirmationDialogue} handleOpenModal={() => { setConfirmationDialogue(!confirmationDialogue) }}>
                        <ConfirmationModal
                            product={{ ...getValues(), id: product.id, images: product.images }}
                            errorMessage={postProductErrorMessage}
                            handlePostProduct={handleUpdateProduct}
                            postProductError={postProductError}
                            postProductIsLoading={postProductIsLoading}
                            setConfirmationDialogue={setConfirmationDialogue}
                            imageList={product.images}
                        />
                    </Modal>
                )
            }
        </section>
    )
}

export default UpdateProductForm