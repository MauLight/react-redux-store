import { getAllErrorsAsync } from "@/features/errors/errorsSlice"
import { AppDispatch } from "@/store/store"
import { StoreProps } from "@/utils/types"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { formatDistance } from 'date-fns'



export default function Logs(): JSX.Element {
    const dispatch: AppDispatch = useDispatch()
    const errors = useSelector((state: StoreProps) => state.errors.errors)

    useEffect(() => {
        async function getAllErrors() {
            try {
                const { payload } = await dispatch(getAllErrorsAsync())
                console.log(payload.errors[0])
            } catch (error) {
                console.error(error)
            }
        }

        getAllErrors()

    }, [])

    useEffect(() => {
        console.log(errors)
    }, [errors])

    return (
        <div className='w-full h-screen flex justify-center items-start pt-44'>
            {
                errors.length > 0 && (
                    <div className="w-full max-w-[1440px] flex flex-col gap-y-5">
                        <h1 className="bg-[#fff] text-indigo-500 py-5 px-10 text-[1.5rem]">Errors</h1>
                        <div>
                            <div className="grid grid-cols-6 gap-x-10 text-[1.1rem] text-[#fff] uppercase border py-2 px-10 bg-sym_gray-400 rounded-t-[12px]">
                                <p>Id</p>
                                <p>clientId</p>
                                <p>actionType</p>
                                <p>message</p>
                                <p>created At</p>
                                <p>updated At</p>
                            </div>
                            <div className="rounded-b-[12px] overflow-hidden">
                                {
                                    errors.map((error, i) => (
                                        <div key={error.id} className={`grid grid-cols-6 gap-x-10 bg-[#fff] py-5 ${i === errors.length - 1 ? '' : 'border-b'} px-10`}>
                                            <p className="truncate">{error.id}</p>
                                            <p className="truncate">{error.clientId}</p>
                                            <p>{error.actionType}</p>
                                            <p>{error.message}</p>
                                            <p>{`${formatDistance(error.createdAt, new Date())} ago`}</p>
                                            <p>{`${formatDistance(error.updatedAt, new Date())} ago`}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
