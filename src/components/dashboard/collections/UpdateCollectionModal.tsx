import CustomDropdownWithCreate from '@/components/common/CustomDropdownWithCreate'
import ErrorComponent from '@/components/common/ErrorComponent'
import Fallback from '@/components/common/Fallback'
import { getAllCollectionsTitlesAsync, getCollectionByTitleAsync, updateCollectionByIdAsync } from '@/features/collections/collectionsSlice'
import { AppDispatch } from '@/store/store'
import { StoreProps } from '@/utils/types'
import { useEffect, useState, type ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

interface UpdateCollectionModalProps {
    productId: string
    closeModal: () => void
}

export default function UpdateCollectionModal({ productId, closeModal }: UpdateCollectionModalProps): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const collectionTitles = useSelector((state: StoreProps) => state.collections.titles)
    const collectionIsLoading = useSelector((state: StoreProps) => state.collections.isLoading)
    const collectionHasError = useSelector((state: StoreProps) => state.collections.hasErrors)

    const [titles, setTitles] = useState<string[]>([])
    const [inputValue, setInputValue] = useState<string>('')
    const [updateError, setUpdateError] = useState<string>('')

    async function handleUpdateCollection() {
        try {
            const title = inputValue.replaceAll(' ', '_')
            const { payload } = await dispatch(getCollectionByTitleAsync(title))
            const id = payload.collection.id
            if (id) {
                const { payload } = await dispatch(updateCollectionByIdAsync({ id, productId }))
                if (payload.updatedCollection) {
                    closeModal()
                } else {
                    setUpdateError(payload.error)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        async function getCollectionTitles() {
            await dispatch(getAllCollectionsTitlesAsync())
        }

        if (collectionTitles.length === 0) {
            getCollectionTitles()
        }
    }, [])

    useEffect(() => {
        if (collectionTitles.length > 0) {
            setTitles(collectionTitles.map(col => col.title))
        }
    }, [collectionTitles])

    return (
        <div className=''>
            {
                collectionHasError && (
                    <ErrorComponent error={updateError} />
                )
            }
            {
                !collectionHasError && collectionIsLoading && (
                    <div className="w-full h-full flex justify-center items-center">
                        <Fallback />
                    </div>
                )
            }
            {
                !collectionHasError && !collectionIsLoading && collectionTitles.length > 0 && (
                    <div className='w-full h-full flex flex-col gap-y-5'>
                        <h1>Add product to a collection:</h1>
                        {
                            titles.length > 0 && (
                                <div className='flex flex-col gap-y-1'>
                                    <label className='text-[0.8rem]' htmlFor="collections">Collections</label>
                                    <CustomDropdownWithCreate
                                        list={titles}
                                        value={inputValue}
                                        setValue={setInputValue}
                                        defaultValue='Choose a collection'
                                    />
                                </div>
                            )
                        }
                        <div className="w-full flex justify-end gap-x-2 mt-10">
                            <button onClick={closeModal} className='w-[120px] h-10 bg-[#10100e] hover:bg-red-500 active:bg-[#10100e] transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-2 rounded-[10px]'>
                                <i className="fa-solid fa-ban"></i>
                                Cancel
                            </button>
                            <button onClick={handleUpdateCollection} className='w-[120px] h-10 bg-green-600 hover:bg-green-500 active:bg-green-600 transition-color duration-200 text-[#ffffff] flex items-center justify-center gap-x-2 rounded-[10px]'>
                                <i className="fa-solid fa-floppy-disk"></i>
                                Save
                            </button>

                        </div>
                    </div>
                )
            }
        </div>
    )
}
