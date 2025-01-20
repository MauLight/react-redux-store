import { postToCloudinary } from '@/utils/functions'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { toast } from 'react-toastify'
import Compressor from 'compressorjs'
import { Switch } from '@/components/common/Switch'
import ErrorComponent from '@/components/common/ErrorComponent'
import Fallback from '@/components/common/Fallback'
import { AppDispatch } from '@/store/store'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { StoreProps } from '@/utils/types'
import { updateAuthAllowGoogle, updateAuthBackground, updateAuthHeader, updateAuthLogoUrl, updateUIConfigurationAsync } from '@/features/ui/uiSlice'

export default function AuthBuilderPanel(): ReactNode {

    const dispatch: AppDispatch = useDispatch()
    const { ui, currUI, authHasError, authIsLoading } = useSelector((state: StoreProps) => state.ui)

    //* Switch state

    const [clickedAllowGoogle, setClickedAllowGoogle] = useState<boolean>(false)
    const [clickedCompressImage, setClickedCompressImage] = useState<boolean>(false)
    const [authHeader, setAuthHeader] = useState<string>('')

    const handleClickAllowGoogle = (): void => {
        setClickedAllowGoogle(!clickedAllowGoogle)
        dispatch(updateAuthAllowGoogle(!clickedAllowGoogle))
    }

    const handleClickCompressImage = (): void => {
        setClickedCompressImage(!clickedCompressImage)
        setCompress(clickedCompressImage ? 1 : 0)
    }

    const handleAuthAddHeader = () => {
        dispatch(updateAuthHeader(authHeader))
    }

    //* Cloudinary state
    const [compress, setCompress] = useState<number>(1)

    const [cloudinaryLoadingOne, setCloudinaryLoadingOne] = useState<boolean>(false)
    const [cloudinaryLoadingTwo, setCloudinaryLoadingTwo] = useState<boolean>(false)
    const [cloudinaryErrorOne, setCloudinaryErrorOne] = useState<string | null>(null)
    const [cloudinaryErrorTwo, setCloudinaryErrorTwo] = useState<string | null>(null)


    const [urlToCloudinaryLogo, setUrlToCloudinaryLogo] = useState<string>('')
    const [urlToCloudinaryBg, setUrlToCloudinaryBg] = useState<string>('')
    const [urlToCloudinaryLoadingLogo, setUrlToCloudinaryLoadingLogo] = useState<boolean>(false)
    const [urlToCloudinaryLoadingBg, setUrlToCloudinaryLoadingBg] = useState<boolean>(false)
    const [urlToCloudinaryErrorLogo, setUrlToCloudinaryErrorLogo] = useState<string | null>(null)
    const [urlToCloudinaryErrorBg, setUrlToCloudinaryErrorBg] = useState<string | null>(null)

    const [_cloudinaryPublicId, setCloudinaryPublicId] = useState<string | null>(null)

    //* Upload a new image to Cloudinary
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number): Promise<void> => {
        event.preventDefault()

        if (event.target.files !== null) {
            try {
                if (index === 0) {
                    setCloudinaryLoadingOne(true)
                } else {
                    setCloudinaryLoadingTwo(true)
                }

                const file = event.target.files[0]
                const formData = new FormData()
                if (compress === 1) {
                    new Compressor(file, {
                        quality: 0.6,
                        success(res) {
                            console.log(res.size, 'This is the new size.')
                            formData.append('file', res)
                            formData.append('upload_preset', 'marketplace')
                            postToCloudinary(formData, index === 0 ? setCloudinaryErrorOne : setCloudinaryErrorTwo)
                                .then((response) => {

                                    if (index === 0) {
                                        setUrlToCloudinaryLogo(response.secure_url)
                                    } else {
                                        setUrlToCloudinaryBg(response.secure_url)
                                    }

                                    if (index === 0) {
                                        dispatch(updateAuthLogoUrl(response.secure_url))
                                    } else {
                                        dispatch(updateAuthBackground(response.secure_url))
                                    }

                                    setCloudinaryPublicId(response.public_id)

                                    if (index === 0) {
                                        setCloudinaryLoadingOne(false)
                                    } else {
                                        setCloudinaryLoadingTwo(false)
                                    }
                                })
                        }
                    })
                } else {
                    formData.append('file', file)
                    formData.append('upload_preset', 'marketplace')
                    postToCloudinary(formData, index === 0 ? setCloudinaryErrorOne : setCloudinaryErrorTwo)
                        .then((response) => {

                            if (index === 0) {
                                dispatch(updateAuthLogoUrl(response.secure_url))
                            } else {
                                dispatch(updateAuthBackground(response.secure_url))
                            }

                            setCloudinaryPublicId(response.public_id)

                            if (index === 0) {
                                setCloudinaryLoadingOne(false)
                            } else {
                                setCloudinaryLoadingTwo(false)
                            }
                        })
                }
            } catch (error) {
                console.log(error)
                if (index === 0) {
                    setCloudinaryLoadingOne(false)
                } else {
                    setCloudinaryLoadingTwo(false)
                }
                toast.error(error as string)
            }


        }
    }

    const handleFileUploadFromUrl = async (index: number): Promise<void> => {

        const isUrl = /^(https?:\/\/)?((([a-zA-Z0-9$_.+!*'(),;?&=-]|%[0-9a-fA-F]{2})+:)*([a-zA-Z0-9$_.+!*'(),;?&=-]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:[0-9]+)?(\/([a-zA-Z0-9$_.+!*'(),;:@&=-]|%[0-9a-fA-F]{2})*)*(\?([a-zA-Z0-9$_.+!*'(),;:@&=-]|%[0-9a-fA-F]{2})*)?(#([a-zA-Z0-9$_.+!*'(),;:@&=-]|%[0-9a-fA-F]{2})*)?$/.test(
            index === 0 ? urlToCloudinaryLogo : urlToCloudinaryBg as string
        )

        if (isUrl) {
            try {

                if (index == 0) {
                    setUrlToCloudinaryLoadingLogo(true)
                } else {
                    setUrlToCloudinaryLoadingBg(true)
                }

                const file = index === 0 ? urlToCloudinaryLogo : urlToCloudinaryBg
                const formData = new FormData()

                formData.append('file', file)
                formData.append('upload_preset', 'marketplace')
                const response = await postToCloudinary(formData, index === 0 ? setUrlToCloudinaryErrorLogo : setUrlToCloudinaryErrorBg)

                if (response.secure_url) {
                    if (index === 0) {
                        dispatch(updateAuthLogoUrl(response.secure_url))
                    } else {
                        dispatch(updateAuthBackground(response.secure_url))
                    }

                    setCloudinaryPublicId(response.public_id)

                    if (index === 0) {
                        setUrlToCloudinaryErrorLogo(null)
                    } else {
                        setUrlToCloudinaryErrorBg(null)
                    }

                    if (index == 0) {
                        setUrlToCloudinaryLoadingLogo(false)
                    } else {
                        setUrlToCloudinaryLoadingBg(false)
                    }
                }

            } catch (error) {
                console.log(error)
                toast.error(error as string)
            }
        } else {

            if (index === 0) {
                setUrlToCloudinaryErrorLogo('There was an error on our part.')
            } else {
                setUrlToCloudinaryErrorBg('There was an error on our part.')
            }
        }
    }

    async function handleUpdateAuthConfiguration() {

        const newAuthConfiguration = {
            allowGoogle: clickedAllowGoogle,
            compressImage: clickedCompressImage,
            header: authHeader,
            logoUrl: urlToCloudinaryLogo,
            background: urlToCloudinaryBg
        }

        await dispatch(updateUIConfigurationAsync({
            id: currUI.id, newConfiguration: {

                ...ui,
                auth: newAuthConfiguration

            }
        }))
    }

    useEffect(() => {
        if (Object.keys(currUI).length > 0) {
            setClickedAllowGoogle(currUI.auth.allowGoogle)
            setClickedCompressImage(currUI.auth.compressImage)
            setAuthHeader(currUI.auth.header)
            setUrlToCloudinaryLogo(currUI.auth.logoUrl)
            setUrlToCloudinaryBg(currUI.auth.background)
        }
    }, [currUI])

    return (
        <>
            {
                authHasError && (
                    <ErrorComponent />
                )
            }
            {
                !authHasError && authIsLoading && (
                    <div className="w-full h-full flex justify-center items-center">
                        <Fallback color='#6366f1' />
                    </div>
                )
            }
            {
                !authHasError && !authIsLoading && (
                    <section className='w-full h-full flex flex-col items-start justify-between gap-y-5'>
                        <div className='flex flex-col gap-y-10'>
                            <div>
                                <h1 className='text-[1.2rem]'>Auth Builder:</h1>
                                <p className='text-[0.9rem] text-sym_gray-600 text-balance'>
                                    Customize the login screen. Add your company logo, enable Google Authentication, change the background, and more.
                                </p>
                            </div>

                            <div className="flex flex-col gap-y-2">
                                <div className="flex items-center justify-between gap-x-2">
                                    <p>Allow users to log in with Google Auth</p>
                                    <Switch clicked={clickedAllowGoogle} handleClick={handleClickAllowGoogle} />
                                </div>
                                <div className="flex items-center justify-between gap-x-2">
                                    <p>Compress images before Upload</p>
                                    <Switch clicked={clickedCompressImage} handleClick={handleClickCompressImage} />
                                </div>
                            </div>

                            <div className='flex flex-col gap-y-1'>
                                <label className='text-[0.8rem]' htmlFor="url">Add Header</label>
                                <div className='relative'>
                                    <input value={authHeader} onChange={({ target }) => { setAuthHeader(target.value) }} className='w-full h-10 pr-10 truncate text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500' type="text" />
                                    <button className='absolute top-1 right-1 w-[33px] h-[33px] rounded-[5px] bg-[#10100e] hover:bg-green-600 active:bg-[#10100e] transition-color duration-200' onClick={handleAuthAddHeader}>
                                        <i className="text-[#ffffff] fa-solid fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            {
                                ['Upload Logo', 'Upload Image/Video Background'].map((title, i) => (
                                    <UploadComponent
                                        index={i}
                                        title={title}
                                        key={title + i}
                                        error={i === 0 ? cloudinaryErrorOne : cloudinaryErrorTwo}
                                        isLoading={i === 0 ? cloudinaryLoadingOne : cloudinaryLoadingTwo}
                                        handleFileUpload={handleFileUpload}
                                    />
                                ))
                            }

                            <div className="flex gap-x-5">
                                {
                                    ['Upload Logo from URL', 'Upload Background from URL'].map((title, i) => (
                                        <UploadComponentFromUrl
                                            index={i}
                                            title={title}
                                            key={title + i}
                                            loading={i === 0 ? urlToCloudinaryLoadingLogo : urlToCloudinaryLoadingBg}
                                            urlToCloudinary={i === 0 ? urlToCloudinaryLogo : urlToCloudinaryBg}
                                            setUrlToCloudinary={i === 0 ? setUrlToCloudinaryLogo : setUrlToCloudinaryBg}
                                            urlToCloudinaryError={i === 0 ? urlToCloudinaryErrorLogo : urlToCloudinaryErrorBg}
                                            handleFileUploadFromUrl={handleFileUploadFromUrl}
                                        />
                                    ))
                                }
                            </div>

                        </div>
                        <div className="w-full flex justify-start gap-x-2 mt-5">
                            <button className='w-[120px] h-10 bg-[#10100e] hover:bg-sym_gray-700 active:bg-[#10100e] transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-2 rounded-[10px]'>
                                <i className="fa-regular fa-eye"></i>
                                Preview
                            </button>
                            <button onClick={handleUpdateAuthConfiguration} className='w-[120px] h-10 bg-green-600 hover:bg-green-500 active:bg-green-600 transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-2 rounded-[10px]'>
                                <i className="fa-solid fa-floppy-disk"></i>
                                Save
                            </button>
                        </div>
                    </section>
                )
            }
        </>
    )
}

interface UploadComponentProps {
    index: number
    title: string
    error: string | null
    isLoading: boolean
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void
}

function UploadComponent({ title, handleFileUpload, index, error, isLoading }: UploadComponentProps) {

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileButtonClick = (): void => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    return (
        <>
            {
                error && (
                    <ErrorComponent error={error} />
                )
            }
            {
                !error && isLoading && (
                    <div className='group h-[120px] border border-dashed border-sym_gray-300 rounded-[5px] p-2'>
                        <Fallback />
                    </div>
                )
            }
            {
                !error && !isLoading && (
                    <div className='group h-[120px] border border-dashed border-sym_gray-300 hover:border-indigo-500 rounded-[5px] p-2'>
                        <button type='button' className='w-full h-full flex flex-col justify-center items-center gap-y-3 group-hover:text-indigo-500 active:text-[#10100e] transition-color duration-200' onClick={handleFileButtonClick}>
                            <i className="fa-solid fa-cloud-arrow-up fa-xl"></i>
                            {title}
                        </button>
                        <input type='file' ref={fileInputRef} onChange={(e) => { handleFileUpload(e, index) }} className='hidden' />
                    </div>
                )
            }
        </>
    )
}

interface UploadComponentFromUrlProps {
    title: string
    index: number
    loading: boolean
    urlToCloudinary: string
    urlToCloudinaryError: string | null
    setUrlToCloudinary: (url: string) => void
    handleFileUploadFromUrl: (index: number) => void
}

function UploadComponentFromUrl({
    title,
    index,
    loading,
    urlToCloudinary,
    urlToCloudinaryError,
    setUrlToCloudinary,
    handleFileUploadFromUrl }
    :
    UploadComponentFromUrlProps) {
    return (
        <div className='flex flex-col gap-y-1'>
            <label className='text-[0.8rem]' htmlFor="url">{title}</label>
            <div className='relative'>
                <input className={`w-full h-10 pr-10 truncate text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${urlToCloudinaryError ? 'ring-1 ring-red-500' : ''}`} value={urlToCloudinary} onChange={({ target }) => { setUrlToCloudinary(target.value) }} type="text" />
                <button className='absolute top-1 right-1 w-[33px] h-[33px] rounded-[5px] bg-[#10100e] hover:bg-green-600 active:bg-[#10100e] transition-color duration-200' onClick={() => { handleFileUploadFromUrl(index) }}>
                    {
                        loading ? (
                            <Fallback color='#ffffff' />
                        )
                            :
                            (
                                <i className="text-[#ffffff] fa-solid fa-plus"></i>
                            )
                    }
                </button>
            </div>
            {urlToCloudinaryError && <small className="text-red-500">Value is not a valid URL</small>}
        </div>
    )
}
