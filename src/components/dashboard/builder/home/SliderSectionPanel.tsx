import { useEffect, useRef, useState, type ReactNode } from 'react'
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import Compressor from 'compressorjs'

import { generateSignature, postToCloudinary } from '@/utils/functions'
import { toast } from 'react-toastify'
import axios from 'axios'
import ErrorComponent from '@/components/common/ErrorComponent'
import Fallback from '@/components/common/Fallback'
import { getAllSlidersAsync, getSliderByIdAsync, postNewSliderAsync, updateSliderConfigurationAsync, updateUIConfigurationAsync } from '@/features/ui/uiSlice'
import { SliderProps, StoreProps } from '@/utils/types'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import CustomDropdownWithCreate from '@/components/common/CustomDropdownWithCreate'
import { Modal } from '@/components/common/Modal'
import Carousel from '@/components/home/Carousel'

const CloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUDNAME
const CloudinaryAPIKEY = import.meta.env.VITE_CLOUDINARY_APIKEY

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

        return cleanup
    }, [])

    return (
        <li ref={cardRef} className={`group relative w-[120px] h-[120px] flex justify-start items-center border border-sym_gray-400 rounded-[5px] cursor-grab active:cursor-grabbing ${dragging ? 'bg-indigo-500 opacity-50' : 'bg-[#ffffff]'}`} data-test-id={id} >
            <section className='relative w-full h-full'>
                <button onClick={() => { handleReset(image) }} className='absolute -right-2 -top-1 z-10 w-[20px] h-[20px] flex justify-center items-center rounded-full bg-[#10100e] hover:bg-red-500 transition-color duration-200'>
                    <i className="fa-solid fa-xmark text-[#ffffff]"></i>
                </button>
                <img className='h-full w-full object-cover' src={image} alt="placeholder" />
            </section>
            <div className={`absolute hidden group-hover:flex  bg-indigo-500 opacity-20 transition-all duration-200 w-full h-full`}></div>
        </li>
    )
}

function SliderSectionPanel(): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const { sliders, currUI, currSlider, uiHasError, uiIsLoading } = useSelector((state: StoreProps) => state.ui)
    const [selectedSliderName, setSelectedSliderName] = useState<string>('')

    const [selectedSpeed, setSelectedSpeed] = useState<number>(0)
    const [selectedAnimation, setSelectedAnimation] = useState<string>('')

    const [openCreateNewSlider, setOpenCreateNewSlider] = useState<boolean>(false)
    const [sliderName, setSliderName] = useState<string>('')

    const [sliderNameList, setSliderNameList] = useState<Array<string>>([])
    const [selectedSlider, setSelectedSlider] = useState<SliderProps | null>(null)
    const [imageList, setImageList] = useState<Array<string>>([])
    const [cloudinaryPublicId, setCloudinaryPublicId] = useState<Array<string>>([])

    const [cloudinaryLoading, setCloudinaryLoading] = useState<boolean>(false)
    const [cloudinaryError, setCloudinaryError] = useState<string | null>(null)
    const [cloudinaryEnd, setCloudinaryEnd] = useState<boolean>(false)

    const [compress, _setCompress] = useState<number>(1)

    //* handleOpen preview modal
    const [openModal, setOpenModal] = useState<boolean>(false)

    const fileInputRef = useRef<HTMLInputElement | null>(null)

    function handleOpenPreview() {
        setOpenModal(!openModal)
    }

    const handleFileButtonClick = (): void => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        event.preventDefault()

        if (event.target.files !== null && selectedSlider) {
            try {
                setCloudinaryLoading(true)

                const files = Array.from(event.target.files)

                if (files.length > 5) {
                    toast.error('You can add up to 5 images to the slider.')
                    return
                }

                const uploadPromises = files.map(file => {
                    const formData = new FormData()
                    if (compress === 1) {
                        return new Promise<void>((resolve, reject) => {
                            new Compressor(file, {
                                quality: 0.6,
                                success(res) {
                                    console.log(res.size, 'This is the new size.')
                                    formData.append('file', res)
                                    formData.append('upload_preset', 'marketplace')
                                    postToCloudinary(formData, setCloudinaryError)
                                        .then((response) => {
                                            setImageList(prevList => [...prevList, response.secure_url])
                                            setCloudinaryPublicId(prevList => [...prevList, response.public_id])
                                            resolve()
                                        })
                                        .catch(reject)
                                },
                                error(err) {
                                    reject(err)
                                }
                            })
                        })
                    } else {
                        formData.append('file', file)
                        formData.append('upload_preset', 'marketplace')
                        return postToCloudinary(formData, setCloudinaryError)
                            .then((response) => {
                                setImageList(prevList => [...prevList, response.secure_url])
                                setCloudinaryPublicId(prevList => [...prevList, response.public_id])
                            })
                    }
                })

                await Promise.all(uploadPromises)
                setCloudinaryLoading(false)
                setCloudinaryEnd(true)

            } catch (error) {
                console.log(error)
                setCloudinaryLoading(false)
                toast.error(error as string)
            }
        }
    }

    const handleResetUploadImage = async (image: string) => {

        const imageIndex = currSlider.imageList.findIndex(img => img.image === image)
        if (imageIndex !== -1) {

            const updatedImageList = currSlider.imageList.filter(item => item.image !== image)

            if (selectedSlider) {
                const newConfiguration = {
                    name: selectedSlider?.name,
                    speed: selectedSlider?.speed,
                    animation: selectedSlider?.animation,
                    imageList: updatedImageList
                }

                handleUpdateCurrentSlider(selectedSlider.id, newConfiguration)
            }

            const imagePublicId = cloudinaryPublicId[imageIndex]
            const timestamp = Math.floor(Date.now() / 1000)
            const signature = generateSignature({ public_id: imagePublicId, timestamp })

            const formData = new FormData()
            formData.append('public_id', imagePublicId)
            formData.append('timestamp', timestamp.toString())
            formData.append('api_key', CloudinaryAPIKEY)
            formData.append('signature', signature)

            try {
                const response = await axios.post(`https://api.cloudinary.com/v1_1/${CloudinaryCloudName}/image/destroy`, formData)
                console.log('Image was deleted succesfully: ', response.data)
            } catch (error) {
                console.error('There was an error deleting this image: ', error)
            }
        }

        const newImageList = imageList.filter(elem => elem !== image)
        setImageList(newImageList)
    }

    function handleDropElement(source: string, target: string) {

        const sourceIndex = imageList.findIndex(image => image === source)
        const targetIndex = imageList.findIndex(image => image === target)

        if (sourceIndex === -1 || targetIndex === -1) return

        const updatedSliderList: Array<string> = [...imageList]
        const temp = updatedSliderList[sourceIndex]
        updatedSliderList[sourceIndex] = updatedSliderList[targetIndex]
        updatedSliderList[targetIndex] = temp
        setImageList(updatedSliderList)

        if (selectedSlider) {
            const auxSelectedSliderImages = selectedSlider?.imageList
            const sourceObjectIndex = auxSelectedSliderImages.findIndex(item => item.image === source)
            const targetObjectIndex = auxSelectedSliderImages.findIndex(item => item.image === target)

            if (sourceObjectIndex === -1 || targetObjectIndex === -1) return
            const temp = auxSelectedSliderImages[sourceObjectIndex]
            auxSelectedSliderImages[sourceObjectIndex] = auxSelectedSliderImages[targetObjectIndex]
            auxSelectedSliderImages[targetObjectIndex] = temp

            const newConfiguration = {
                name: selectedSlider.name,
                speed: selectedSlider.speed,
                animation: selectedSlider.animation,
                imageList: auxSelectedSliderImages
            }
            handleUpdateCurrentSlider(selectedSlider.id, newConfiguration)
        }
    }

    function handleOpenCreateNewSlider() {
        setOpenCreateNewSlider(true)
    }

    async function handleCreateNewSlider() {
        try {
            await dispatch(postNewSliderAsync({ sliderName }))
            setSliderName('')
            setOpenCreateNewSlider(false)
        } catch (error) {
            console.log(error)
        }
    }

    function handleCancelCreateNewSlider() {
        setSliderName('')
        setOpenCreateNewSlider(false)
    }

    async function handleUpdateSelectedSlider() {

        await dispatch(updateUIConfigurationAsync({
            id: currUI.id, newConfiguration: {

                ...currUI,
                home: {
                    ...currUI.home,
                    slider: {
                        ...currUI.home.slider,
                        currSlider: selectedSlider?.id
                    }
                }

            }
        }))
    }

    async function handleUpdateCurrentSlider(id: string, newConfiguration: any) {
        try {
            await dispatch(updateSliderConfigurationAsync({ id, newConfiguration }))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        async function getCurrentSlider() {
            const { payload } = await dispatch(getSliderByIdAsync(currUI.home.slider.currSlider))
            setSelectedSlider(payload.slider)
            setSelectedSliderName(payload.slider.name)
            setSelectedSpeed(payload.slider.speed)
            setSelectedAnimation(payload.slider.animation)
            if (payload.slider.imageList.length > 0) {
                const images = payload.slider.imageList.map((item: { image: string, public_id: string }) => item.image)
                const ids = payload.slider.imageList.map((item: { image: string, public_id: string }) => item.public_id)

                setImageList(images)
                setCloudinaryPublicId(ids)
            }
        }

        if (currUI && currUI.home.slider.currSlider) {
            getCurrentSlider()
        }

    }, [currUI])

    useEffect(() => {
        async function getSliders() {
            try {
                const { payload } = await dispatch(getAllSlidersAsync())
                const sliderNames = payload.sliders.map((slider: SliderProps) => slider.name)
                setSliderNameList(sliderNames)
            } catch (error) {
                console.log(error)
            }
        }

        if (!sliders.length) {
            getSliders()
        } else {
            const sliderNames = sliders.map((slider: SliderProps) => slider.name)
            setSliderNameList(sliderNames)
        }

    }, [sliders])

    useEffect(() => {
        const currSlider = sliders.find(slider => slider.name === selectedSliderName)
        if (currSlider) {
            setSelectedSlider(currSlider)
        }
    }, [selectedSliderName])

    //* Update UI to reflect last chosen slider, load chosen slider's data to inputs.
    useEffect(() => {
        if (selectedSlider) {
            setSelectedSliderName(selectedSlider.name)
            setSelectedSpeed(selectedSlider.speed)
            setSelectedAnimation(selectedSlider.animation)
            if (selectedSlider.imageList.length > 0) {
                const images = selectedSlider.imageList.map((item: { image: string, public_id: string }) => item.image)
                const ids = selectedSlider.imageList.map((item: { image: string, public_id: string }) => item.public_id)

                setImageList(images)
                setCloudinaryPublicId(ids)
            } else {
                setImageList([])
                setCloudinaryPublicId([])
            }

        }
        if (selectedSlider && selectedSlider.id !== currSlider.id) {
            handleUpdateSelectedSlider()
        }
    }, [selectedSlider])

    //* Update slider images after getting them back from cloudinary.
    useEffect(() => {
        if (imageList.length > 0 && selectedSlider && !cloudinaryLoading && cloudinaryEnd) {
            const imageListWithId = imageList.map((item, i) => ({ image: item, public_id: cloudinaryPublicId[i] }))

            const newConfiguration = {
                name: selectedSliderName,
                speed: selectedSpeed,
                animation: selectedAnimation,
                imageList: imageListWithId
            }

            handleUpdateCurrentSlider(selectedSlider.id, newConfiguration)
            setCloudinaryEnd(false)
        }
    }, [imageList])

    //* Update speed property in db after selecting a new value in UI.
    useEffect(() => {
        if (selectedSlider && selectedSpeed !== selectedSlider.speed) {
            const newConfiguration = {
                name: selectedSliderName,
                speed: selectedSpeed,
                animation: selectedAnimation,
                imageList: selectedSlider.imageList
            }
            handleUpdateCurrentSlider(selectedSlider.id, newConfiguration)
        }

    }, [selectedSpeed])

    //* Update animation property in db after selecting a new value in UI.
    useEffect(() => {
        if (selectedSlider && selectedAnimation !== selectedSlider.animation) {
            const newConfiguration = {
                name: selectedSliderName,
                speed: selectedSpeed,
                animation: selectedAnimation,
                imageList: selectedSlider.imageList
            }
            handleUpdateCurrentSlider(selectedSlider.id, newConfiguration)
        }

    }, [selectedAnimation])

    return (
        <>
            {
                uiHasError && (
                    <ErrorComponent />
                )
            }
            {
                !uiHasError && uiIsLoading && (
                    <div className="w-full h-full flex justify-center items-center">
                        <Fallback />
                    </div>
                )
            }
            {
                !uiHasError && !uiIsLoading && selectedSlider && (
                    <section className='w-full flex flex-col gap-y-5'>
                        <h2 className='text-[1rem] text-sym_gray-700'>Slider Section:</h2>
                        <div className="flex flex-col gap-y-10">

                            <div className="flex flex-col gap-y-2">
                                <div className="flex flex-col gap-y-1">
                                    <label className='text-[0.8rem]' htmlFor="Saved sliders">Saved Sliders</label>
                                    <CustomDropdownWithCreate
                                        create
                                        label='Add New Slider'
                                        buttonFunction={handleOpenCreateNewSlider}
                                        id='Saved sliders'
                                        defaultValue={selectedSlider?.name || 'Recommended'}
                                        value={selectedSliderName}
                                        setValue={setSelectedSliderName}
                                        list={sliderNameList}
                                    />
                                </div>
                            </div>

                            {
                                openCreateNewSlider && (
                                    <div className="flex flex-col gap-y-2 p-2 border border-indigo-500 rounded-[5px]">
                                        <div className="flex flex-col gap-y-1">
                                            <label className='text-[0.8rem]' htmlFor="slider_name">New Slider Name</label>
                                            <input
                                                id='slider_name'
                                                value={sliderName}
                                                onChange={({ target }) => { setSliderName(target.value) }}
                                                type="text"
                                                className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-400`}
                                                placeholder='eg. mySlider'
                                            />
                                        </div>
                                        <div className="flex justify-end gap-x-2 pt-2">
                                            <button onClick={handleCancelCreateNewSlider} className='w-[100px] h-8 bg-red-600 hover:bg-red-500 active:bg-red-600 transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-2 rounded-[5px]'>
                                                <i className="fa-solid fa-xmark"></i>
                                                Cancel
                                            </button>
                                            <button onClick={handleCreateNewSlider} className='w-[100px] h-8 bg-green-600 hover:bg-green-500 active:bg-green-600 transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-2 rounded-[5px]'>
                                                <i className="fa-solid fa-floppy-disk"></i>
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                )
                            }

                            <div className="grid grid-cols-2 items-center gap-x-3">
                                <div className="flex flex-col gap-y-2">
                                    <div className="flex flex-col gap-y-1">
                                        <label className='text-[0.8rem]' htmlFor="speed">{'Slider speed: (higher equals faster)'}</label>
                                        <CustomDropdownWithCreate
                                            defaultValue='Recommended'
                                            value={selectedSpeed}
                                            setValue={setSelectedSpeed}
                                            list={['0', '1', '3', '4', '5']}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-y-2">
                                    <div className="flex flex-col gap-y-1">
                                        <label className='text-[0.8rem]' htmlFor="animation">{'Slider animation:'}</label>
                                        <CustomDropdownWithCreate
                                            defaultValue='Recommended'
                                            value={selectedAnimation}
                                            setValue={setSelectedAnimation}
                                            list={['Slide', 'Fade']}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-y-2">
                                <label className='text-[0.8rem]' htmlFor="description">Slider order:</label>
                                <ul className="w-full flex flex-wrap gap-2 p-2 border rounded-[5px] overflow-scroll">
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
                                                    <button onClick={handleFileButtonClick} className='h-[120px] w-[120px] flex flex-col justify-center items-center gap-y-2 border border-sym_gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-color duration-200 border-dashed rounded-[5px] text-[0.9rem]'>
                                                        <i className="fa-solid fa-cloud-arrow-up fa-xl"></i>
                                                        Upload image
                                                    </button>
                                                    <input multiple accept="image/*" type='file' ref={fileInputRef} onChange={handleFileUpload} className='hidden' />
                                                </div>
                                                {
                                                    imageList.map((elem, i) => (
                                                        <BuilderCard key={`${elem}-${i}`} card={{ id: i, image: elem }} onDrop={handleDropElement} handleReset={handleResetUploadImage} />
                                                    ))
                                                }
                                            </>
                                        )
                                    }
                                </ul>
                            </div>

                            {
                                currSlider.imageList.length > 0 && (
                                    <div className="w-full flex justify-start gap-x-2">
                                        <button onClick={handleOpenPreview} className='w-[120px] h-10 bg-[#10100e] hover:bg-indigo-500 active:bg-[#10100e] transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-2 rounded-[10px]'>
                                            <i className="fa-regular fa-eye"></i>
                                            Preview
                                        </button>
                                    </div>
                                )
                            }
                            <Modal width='w-[1100px]' height='h-[700px]' openModal={openModal} handleOpenModal={handleOpenPreview}>
                                <Carousel isBuilder />
                            </Modal>

                        </div>
                    </section>
                )
            }
        </>
    )
}

export default SliderSectionPanel