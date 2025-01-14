import { ReactNode, useEffect, useState } from 'react'
import Fallback from './Fallback'
import { DropdownProps } from '@/utils/types'

function CustomDropdown({ value, setValue, list, defaultValue, loading, error }: DropdownProps): ReactNode {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [choice, setChoice] = useState<string>(defaultValue || '')

    useEffect(() => {
        if (choice !== '') {
            setValue((value as "firstname" | "lastname" | "street" | "street_number" | "house_number" | "city" | "state" | "country" | "phone" | "zipcode" | "email"), choice)
        }
    }, [choice])

    return (
        <div onClick={() => { setIsOpen(!isOpen) }} className='relative mt-2 w-full h-9 flex justify-between items-center bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 cursor-pointer'>
            <p className={`capitalize ${choice === '' ? 'text-sym_gray-300' : 'text-[#10100e]'}`}>{choice === '' ? 'State' : choice}</p>
            {
                isOpen ? (
                    <i className="fa-solid fa-arrow-up"></i>
                )
                    :
                    (
                        <i className="fa-solid fa-arrow-down"></i>
                    )
            }
            {
                isOpen && (
                    <div className='absolute top-9 left-0 z-20 w-full max-h-[200px] overflow-y-scroll bg-[#10100e] border-b rounded-b-[5px]'>
                        <>
                            {
                                error ? (
                                    <div className='w-full h-full flex justify-center items-center'>
                                        <p className='text-balance text-center'>There was an error fetching the list, please refresh the page.</p>
                                    </div>
                                )
                                    :
                                    (
                                        <>
                                            {
                                                loading ? (
                                                    <div className='w-full h-full flex justify-center items-center'>
                                                        <Fallback color='#3f51b5' />
                                                    </div>
                                                )
                                                    :
                                                    (
                                                        <>
                                                            {
                                                                list.map((item: string, i: number) => (
                                                                    <button key={`${item}-${i}`} onClick={() => { setChoice(item) }} className='w-full h-9 bg-[#ffffff] text-[#10100e] rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 placeholder-sym_gray-300 hover:text-[#10100e] hover:bg-gray-50 active:text-[#ffffff] active:bg-[#10100e] transition-color duration-200'>
                                                                        {
                                                                            item
                                                                        }
                                                                    </button>
                                                                ))
                                                            }
                                                        </>
                                                    )
                                            }
                                        </>
                                    )
                            }
                        </>
                    </div>
                )
            }
        </div>
    )
}

export default CustomDropdown