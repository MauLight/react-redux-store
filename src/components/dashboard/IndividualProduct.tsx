import { useEffect, useRef, useState, type ReactNode } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import Compressor from 'compressorjs'
import { motion } from 'motion/react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { postIndividualProductAsync } from '@/features/products/productsSlice'

import { Modal } from '../common/Modal'
import IndividualProductForm from './IndividualProductsForm'
import ConfirmationModal from './ConfirmationModal'

import { generateSignature, postToCloudinary } from '@/utils/functions'
import { useSelector } from 'react-redux'
import { ProductProps, StoreProps } from '@/utils/types'
import DashboardButton from './DashboardButton'
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import ErrorComponent from '../common/ErrorComponent'
import Fallback from '../common/Fallback'
import DashboardUploadButton from './DashboardUploadButton'

const CloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUDNAME
const CloudinaryAPIKEY = import.meta.env.VITE_CLOUDINARY_APIKEY

export const productSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    brand: yup.string().required(),
    description: yup.string().required('Description is required'),
    weight: yup.number(),
    height: yup.number(),
    width: yup.number(),
    length: yup.number(),
    price: yup.number().required('Price is required'),
    discount: yup.number(),
    quantity: yup.number().required('Quantity is required'),
})

interface ImageListProps { image: string, image_public_id: string }

function IndividualProduct(): ReactNode {

    //* Store state
    const dispatch: AppDispatch = useDispatch()
    const postProductIsLoading = useSelector((state: StoreProps) => state.inventory.productsAreLoading)
    const postProductError = useSelector((state: StoreProps) => state.inventory.productsHasError)
    const postProductErrorMessage = useSelector((state: StoreProps) => state.inventory.errorMessage)

    const [confirmationDialogue, setConfirmationDialogue] = useState<boolean>(false)
    const [priceWithDiscount, setPriceWithDiscount] = useState<number>(0)
    const [compress] = useState<number>(1)

    const [tags, setTags] = useState<string[]>([])
    const [wasSubmitted, setWasSubmitted] = useState<boolean>(false)

    //* UseForm State
    const { watch, register, getValues, setValue, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            weight: 0,
            height: 0,
            width: 0,
            length: 0,
            price: 0,
            discount: 0,
            quantity: 0
        },
        resolver: yupResolver(productSchema)
    })

    const watchedValues = watch(['price', 'discount'])
    const valuesForDescription = watch(['title', 'brand'])
    const descriptionAdded = watch(['description'])

    const onSubmit = () => {
        setConfirmationDialogue(true)
    }

    //* Cloudinary state
    const [imageList, setImageList] = useState<Array<ImageListProps>>([])
    const [cloudinaryLoading, setCloudinaryLoading] = useState<boolean>(false)
    const [cloudinaryError, setCloudinaryError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const handleFileButtonClick = (): void => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    //* Upload a new image to Cloudinary
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        event.preventDefault()

        if (event.target.files !== null) {
            try {
                setCloudinaryLoading(true)
                const file = event.target.files[0]
                const formData = new FormData()
                if (compress === 1) {
                    new Compressor(file, {
                        quality: 0.6,
                        success(res) {
                            console.log(res.size, 'This is the new size.')
                            formData.append('file', res)
                            formData.append('upload_preset', 'marketplace')
                            postToCloudinary(formData, setCloudinaryError)
                                .then((response) => {


                                    setImageList((prev) => [...prev, { image: response.secure_url, image_public_id: response.public_id }])
                                    setCloudinaryLoading(false)
                                })
                        }
                    })
                } else {
                    formData.append('file', file)
                    formData.append('upload_preset', 'marketplace')
                    postToCloudinary(formData, setCloudinaryError)
                        .then((response) => {

                            setImageList((prev) => [...prev, { image: response.secure_url, image_public_id: response.public_id }])
                            setCloudinaryLoading(false)
                        })
                }
            } catch (error) {
                console.log(error)
                setCloudinaryLoading(false)
                toast.error(error as string)
            }


        }
    }

    //* Erase last uploaded image if wants to upload another
    const handleResetUploadImage = async (image: string) => {

        const selectedImage = imageList.find(img => img.image === image)

        console.log(selectedImage)

        if (selectedImage) {
            const timestamp = Math.floor(Date.now() / 1000)
            const signature = generateSignature({ public_id: selectedImage.image_public_id, timestamp })

            const formData = new FormData()
            formData.append('public_id', selectedImage.image_public_id as string)
            formData.append('timestamp', timestamp.toString())
            formData.append('api_key', CloudinaryAPIKEY)
            formData.append('signature', signature)

            try {
                const response = await axios.post(`https://api.cloudinary.com/v1_1/${CloudinaryCloudName}/image/destroy`, formData)
                console.log('Image was deleted succesfully: ', response.data)
            } catch (error) {
                console.error('There was an error deleting this image: ', error)
            }
            setImageList(prev => prev.filter(image => image.image_public_id !== selectedImage.image_public_id))
        }

    }

    function handleResetForm() {
        reset()
        setWasSubmitted(true)
    }

    async function handlePostProduct() {
        const data = getValues()

        try {
            await dispatch(postIndividualProductAsync({ ...data, tags, images: imageList }))
            setWasSubmitted(true)
            setImageList([])

        } catch (error) {
            console.log(error)
            toast.error('There was an error submitting this product.')
        }
    }

    function getPercentage() {
        const percentage = getValues().discount
        const price = getValues().price
        const discount = percentage ? (percentage / 100) * price : 0
        setPriceWithDiscount(price - discount)
    }

    function handleDropElement(source: string, target: string) {

        const sourceIndex = imageList.findIndex(image => image.image === source)
        const targetIndex = imageList.findIndex(image => image.image === target)

        if (sourceIndex === -1 || targetIndex === -1) return

        let updatedImageList: Array<ImageListProps> = [...imageList]
        const temp = updatedImageList[sourceIndex]
        updatedImageList[sourceIndex] = updatedImageList[targetIndex]
        updatedImageList[targetIndex] = temp
        setImageList(updatedImageList)
    }

    useEffect(() => {
        getPercentage()
    }, [watchedValues])

    useEffect(() => {
        if (wasSubmitted && (watchedValues.length || valuesForDescription.length || descriptionAdded.length)) {
            setWasSubmitted(false)
        }
    }, [watchedValues, valuesForDescription, descriptionAdded])

    useEffect(() => {
        if (!postProductError) {
            reset()
            setTags([])
            setConfirmationDialogue(false)
        }

    }, [wasSubmitted])

    return (
        <>
            <form onSubmit={(e) => { e.preventDefault() }} className='w-full col-span-1 flex flex-col gap-y-5 px-4 md:px-10 py-10 bg-[#ffffff] rounded-[8px]'>
                <h1 className='text-[1rem] sm:text-[1.2rem] text-balance leading-tight'>Add individual products:</h1>
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
                    <ul className="min-w-[400px] flex flex-wrap gap-2 p-2 border border-gray-300 rounded-[5px] overflow-scroll">
                        {
                            cloudinaryError && (
                                <ErrorComponent />
                            )
                        }
                        {
                            !cloudinaryError && cloudinaryLoading && (
                                <div className="w-full h-[120px] flex justify-center items-center">
                                    <Fallback />
                                </div>
                            )
                        }
                        {
                            !cloudinaryError && !cloudinaryLoading && (
                                <>
                                    <div>
                                        <div className='h-[120px] w-[120px] flex flex-col justify-center items-center gap-y-2 border border-sym_gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-color duration-200 border-dashed rounded-[5px] text-[0.9rem]'>
                                            <DashboardUploadButton action={handleFileButtonClick} />
                                        </div>
                                        <input multiple accept="image/*" type='file' ref={fileInputRef} onChange={handleFileUpload} className='hidden' />
                                    </div>
                                    {
                                        imageList.map((elem, i) => (
                                            <BuilderCard key={`${elem.image_public_id}-${i}`} card={{ id: i, image: elem.image }} onDrop={handleDropElement} handleReset={handleResetUploadImage} />
                                        ))
                                    }
                                </>
                            )
                        }
                    </ul>
                </div>
                <div className="flex gap-x-2 justify-end">

                    <DashboardButton type='button' label='Reset' action={handleResetForm} actionType='cancel' />
                    <motion.button
                        transition={{ duration: 0.05 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSubmit(onSubmit)} className='w-[120px] h-10 bg-green-600 hover:bg-green-500 active:bg-green-600 transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-2 rounded-[10px]'>
                        <i className="fa-solid fa-floppy-disk"></i>
                        Submit
                    </motion.button>

                </div>
            </form>
            {
                confirmationDialogue && (
                    <Modal width='w-[1200px]' openModal={confirmationDialogue} handleOpenModal={() => { setConfirmationDialogue(!confirmationDialogue) }}>
                        <ConfirmationModal
                            product={{ ...getValues() } as ProductProps}
                            imageList={imageList}
                            errorMessage={postProductErrorMessage}
                            handlePostProduct={handlePostProduct}
                            postProductError={postProductError}
                            postProductIsLoading={postProductIsLoading}
                            setConfirmationDialogue={setConfirmationDialogue}
                        />
                    </Modal>
                )
            }
        </>
    )
}

export default IndividualProduct

function BuilderCard({ card, onDrop, handleReset }: { card: { id: number, image: string }, onDrop: (source: string, target: string) => void, handleReset: (image: string) => void }) {
    const { id, image } = card
    const [dragging, setDragging] = useState<boolean>(false)
    const [_isDraggedOver, setIsDraggedOver] = useState<boolean>(false)
    const cardRef = useRef(null)

    useEffect(() => {
        const element = cardRef.current
        if (!element) return

        const cleanup: CleanupFn = combine(
            draggable({
                element,
                getInitialData() { return card },
                onDragStart: () => setDragging(true),
                onDrop: () => setDragging(false),
            }),
            dropTargetForElements({
                element,
                getData() { return card },
                onDragEnter: () => setIsDraggedOver(true),
                onDragLeave: () => setIsDraggedOver(false),
                onDrop: ({ source, self }) => {
                    onDrop(source.data.image as string, self.data.image as string)
                    setIsDraggedOver(false)
                }
            })
        )

        return cleanup as unknown as () => void
    }, [])

    return (
        <li ref={cardRef} className={`group relative w-[120px] h-[120px] flex justify-start items-center border border-sym_gray-400 rounded-[5px] cursor-grab active:cursor-grabbing ${dragging ? 'bg-indigo-500 opacity-50' : 'bg-[#ffffff]'}`} data-test-id={id} >
            <section className='relative w-full h-full'>
                <button onClick={() => { handleReset(image) }} className='absolute -right-2 -top-1 z-10 w-[20px] h-[20px] flex justify-center items-center rounded-full bg-[#10100e] hover:bg-red-500 transition-color duration-200'>
                    <i className="fa-solid fa-xmark text-[#ffffff]"></i>
                </button>
                <img className='h-full w-full object-cover rounded-[5px]' src={image} alt="placeholder" />
            </section>
            <div className={`absolute hidden group-hover:flex  bg-indigo-500 opacity-20 transition-all duration-200 w-full h-full`}></div>
        </li>
    )
}