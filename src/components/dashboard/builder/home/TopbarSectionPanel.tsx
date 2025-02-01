import { Dispatch, SetStateAction, useRef, useState, type ReactNode } from 'react'
import axios from 'axios'

import { generateSignature, postToCloudinary } from '@/utils/functions'

import ErrorComponent from '@/components/common/ErrorComponent'
import Fallback from '@/components/common/Fallback'
import { toast } from 'react-toastify'
import { fullSpectrumColors } from '@/utils/lists'
import { Switch } from '@/components/common/Switch'
import { updateUIConfigurationAsync } from '@/features/ui/uiSlice'
import { StoreProps } from '@/utils/types'
import { useSelector } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { useDispatch } from 'react-redux'

const CloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUDNAME
const CloudinaryAPIKEY = import.meta.env.VITE_CLOUDINARY_APIKEY

export default function TopbarSectionPanel({ topBackground, setTopBackground }: { topBackground: string, setTopBackground: Dispatch<SetStateAction<string>> }): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const { id, currConfig, uiHasError } = useSelector((state: StoreProps) => state.ui)
    const [clickedAllowTransparency, setClickedAllowTransparency] = useState<boolean>(true)

    async function handleOpenAllowTransparency() {
        if (!clickedAllowTransparency) {

            try {

                const newTopbarConfig = {
                    transparent: true,
                    bgColor: '#10100e',
                    logo: cloudinaryLogo,
                    logo_public_id: cloudinaryPublicId
                }

                await dispatch(updateUIConfigurationAsync({
                    id: id as string, newConfiguration: {
                        ...currConfig,
                        home: {
                            ...currConfig.home,
                            topbar: newTopbarConfig
                        }
                    }
                }))

                setTopBackground('#10100e')
                setClickedAllowTransparency(true)

            } catch (error) {
                console.log(error)
            }

            return
        }

        try {

            const newTopbarConfig = {
                transparent: false,
                bgColor: topBackground,
                logo: cloudinaryLogo,
                logo_public_id: cloudinaryPublicId
            }

            await dispatch(updateUIConfigurationAsync({
                id: id as string, newConfiguration: {
                    ...currConfig,
                    home: {
                        ...currConfig.home,
                        topbar: newTopbarConfig
                    }
                }
            }))

            setClickedAllowTransparency(false)

        } catch (error) {
            console.log(error)
        }
    }

    async function handleChangeBgColor(color: string) {

        try {
            const newTopbarConfig = {
                transparent: clickedAllowTransparency,
                bgColor: color.replace('bg-[', '').replace(']', ''),
                logo: cloudinaryLogo,
                logo_public_id: cloudinaryPublicId
            }

            await dispatch(updateUIConfigurationAsync({
                id: id as string, newConfiguration: {
                    ...currConfig,
                    home: {
                        ...currConfig.home,
                        topbar: newTopbarConfig
                    }
                }
            }))

            setTopBackground(color.replace('bg-[', '').replace(']', ''))
            setClickedAllowTransparency(false)

        } catch (error) {
            console.log(error)
        }

    }

    const [cloudinaryPublicId, setCloudinaryPublicId] = useState<string>('')
    const [cloudinaryLogo, setCloudinaryLogo] = useState<string | null>(null)
    const [cloudinaryLoading, setCloudinaryLoading] = useState<boolean>(false)
    const [cloudinaryError, setCloudinaryError] = useState<string | null>(null)
    const [compress, _setCompress] = useState<number>(1)

    //* Input file ref, hidden and accesible through the button that triggers handleFileButtonClick method.
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    //* Method triggered by fileInputRef, from the button and pointing to the hidden input.text, triggers onChange event.
    const handleFileButtonClick = (): void => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

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
                                .then(async (response) => {
                                    setCloudinaryLogo(response.secure_url)
                                    setCloudinaryPublicId(response.public_id)

                                    const newTopbarConfig = {
                                        transparent: clickedAllowTransparency,
                                        bgColor: topBackground,
                                        logo: response.secure_url,
                                        logo_public_id: response.public_id
                                    }

                                    await dispatch(updateUIConfigurationAsync({
                                        id: id as string, newConfiguration: {
                                            ...currConfig,
                                            home: {
                                                ...currConfig.home,
                                                topbar: newTopbarConfig
                                            }
                                        }
                                    }))

                                    setCloudinaryLoading(false)

                                })
                        }
                    })
                } else {
                    formData.append('file', file)
                    formData.append('upload_preset', 'marketplace')
                    postToCloudinary(formData, setCloudinaryError)
                        .then(async (response) => {

                            setCloudinaryLogo(response.secure_url)
                            setCloudinaryPublicId(response.public_id)

                            const newTopbarConfig = {
                                transparent: clickedAllowTransparency,
                                bgColor: topBackground,
                                logo: response.secure_url,
                                logo_public_id: response.public_id
                            }

                            await dispatch(updateUIConfigurationAsync({
                                id: id as string, newConfiguration: {
                                    ...currConfig,
                                    home: {
                                        ...currConfig.home,
                                        topbar: newTopbarConfig
                                    }
                                }
                            }))

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

    const handleResetUploadImage = async () => {

        const timestamp = Math.floor(Date.now() / 1000)
        const signature = generateSignature({ public_id: cloudinaryPublicId, timestamp })

        const formData = new FormData()
        formData.append('public_id', cloudinaryPublicId as string)
        formData.append('timestamp', timestamp.toString())
        formData.append('api_key', CloudinaryAPIKEY)
        formData.append('signature', signature)

        try {
            const response = await axios.post(`https://api.cloudinary.com/v1_1/${CloudinaryCloudName}/image/destroy`, formData)
            console.log('Image was deleted succesfully: ', response.data)

            const newTopbarConfig = {
                transparent: clickedAllowTransparency,
                bgColor: topBackground,
                logo: '',
                logo_public_id: ''
            }

            await dispatch(updateUIConfigurationAsync({
                id: id as string, newConfiguration: {
                    ...currConfig,
                    home: {
                        ...currConfig.home,
                        topbar: newTopbarConfig
                    }
                }
            }))

        } catch (error) {
            console.error('There was an error deleting this image: ', error)
        }

        setCloudinaryLogo(null)
    }

    return (
        <>
            {
                uiHasError ? (
                    <ErrorComponent />
                )
                    :
                    (
                        <section className='w-full flex flex-col gap-y-5'>
                            <h2 className='text-[1rem] text-sym_gray-700'>Topbar Section:</h2>
                            <div className="flex flex-col gap-y-10">

                                <div className="flex flex-col gap-y-2">
                                    <div className="flex items-center justify-between gap-x-2">
                                        <p>Make the top navbar transparent</p>
                                        <Switch clicked={clickedAllowTransparency} handleClick={handleOpenAllowTransparency} />
                                    </div>
                                </div>

                                <div className="group flex flex-col gap-y-2">
                                    <label className='text-[0.8rem]' htmlFor="topbar color">{'Topbar background color'}</label>
                                    <div className="flex flex-col w-[200px]">
                                        <div className="flex flex-wrap">
                                            {
                                                fullSpectrumColors.map((color, i) => (
                                                    <button onClick={() => { handleChangeBgColor(color) }} key={i + '-' + color} className={`w-7 h-7 border ${color.replaceAll('"', '')}`} />
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-y-2">
                                    <>
                                        {
                                            cloudinaryError && (
                                                <ErrorComponent error={cloudinaryError} />
                                            )
                                        }
                                        {
                                            !cloudinaryError && cloudinaryLoading && (
                                                <div className='w-full h-[120px] flex justify-center items-center'>
                                                    <Fallback color='#6366f1' />
                                                </div>
                                            )
                                        }
                                        {
                                            !cloudinaryError && !cloudinaryLoading && cloudinaryLogo && (
                                                <div className="group flex flex-col gap-y-2">

                                                    <label className='text-[0.8rem]' htmlFor="background upload">{'Image (16:9 / 1920x1080 px for best results)'}</label>
                                                    <div className='relative h-[120px] rounded-[5px] overflow-hidden'>
                                                        <img src={cloudinaryLogo} alt="product" className='h-full w-full object-cover' />
                                                        <button type='button' onClick={handleResetUploadImage} className='absolute top-2 right-2 w-[30px] h-[30px] flex justify-center items-center rounded-full bg-indigo-500 text-[#ffffff] hover:bg-[#10100e] active:bg-indigo-500'>
                                                            <i className="fa-solid fa-xmark"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            )

                                        }
                                        {
                                            !cloudinaryError && !cloudinaryLoading && !cloudinaryLogo && (
                                                <div className="group flex flex-col gap-y-2">
                                                    <label className='text-[0.8rem]' htmlFor="background upload">{'Logo (300x60 px for best results)'}</label>
                                                    <button onClick={handleFileButtonClick} name='background upload' className='h-[120px] w-[200px] flex flex-col justify-center items-center gap-y-2 border border-sym_gray-600 border-dashed rounded-[5px] group-hover:border-indigo-500 group-hover:text-indigo-500 transition-color duration-200'>
                                                        <i className="fa-solid fa-cloud-arrow-up fa-xl"></i>
                                                        Upload image
                                                    </button>
                                                    <input type='file' ref={fileInputRef} onChange={handleFileUpload} className='hidden' />
                                                </div>
                                            )
                                        }
                                    </>
                                </div>

                            </div>
                        </section>
                    )
            }
        </>
    )
}
