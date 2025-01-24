import ErrorComponent from '@/components/common/ErrorComponent'
import { getAllCollectionsTitlesAsync, postNewCollectionAsync } from '@/features/collections/collectionsSlice'
import { AppDispatch } from '@/store/store'
import { StoreProps } from '@/utils/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'

export const productSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
})

export default function AddNewCollection({ closeModal, hasError }: { closeModal: () => void, hasError: boolean }): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const error = useSelector((state: StoreProps) => state.collections.error)

    //* UseForm State
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: ''
        },
        resolver: yupResolver(productSchema)
    })

    async function handlePostNewCollection(data: { title: string }) {
        try {
            const { payload } = await dispatch(postNewCollectionAsync({ title: data.title }))
            if (payload.newCollection) {
                await dispatch(getAllCollectionsTitlesAsync())
                reset()
                closeModal()
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>{
            hasError ? (
                <ErrorComponent error={error} />
            )
                :
                (
                    <div className='flex flex-col gap-y-5'>
                        <h1 className='text-[1rem]'>Create a new collection:</h1>
                        <div className="w-full flex flex-col gap-y-2">
                            <form onSubmit={handleSubmit(handlePostNewCollection)} className="flex flex-col gap-y-1">
                                <label className='text-[0.8rem]' htmlFor="brand">Collection name</label>
                                <input
                                    {...register('title')}
                                    type="text"
                                    className={`w-full h-10 text-[0.9rem] bg-gray-50 rounded-[6px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-500 ${errors.title !== undefined ? 'ring-1 ring-red-500' : ''}`}
                                    placeholder='eg. myCollection'
                                />
                            </form>
                            {errors.title && <small className="text-red-500">{errors.title.message}</small>}
                        </div>
                    </div>
                )
        }
        </>
    )
}
