import { ReactNode, useEffect, useState } from 'react'
import Fallback from './Fallback'

export interface DropdownProps {
    create?: boolean
    label?: string
    buttonFunction?: any
    id?: string
    value: any
    setValue: any
    list: string[]
    defaultValue?: string
    loading?: boolean
    error?: boolean
}

function CustomDropdownWithCreate({
    value,
    setValue,
    list,
    defaultValue,
    loading,
    error,
    id,
    create,
    label,
    buttonFunction
}: DropdownProps): ReactNode {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [choice, setChoice] = useState<string>(defaultValue || '')

    useEffect(() => {
        if (value && choice === defaultValue) {
            setChoice(value)
        }
    }, [value])

    useEffect(() => {
        if (choice !== '' && choice !== value) {
            setValue(choice)
        }
    }, [choice])


    return (
        <div id={id} onClick={() => { setIsOpen(!isOpen) }} className='relative w-full h-9 flex justify-between items-center bg-gray-50 rounded-[3px] border border-gray-300 ring-0 focus:ring-0 focus:outline-none px-2 cursor-pointer'>
            <p className={`capitalize ${choice === '' ? 'text-sym_gray-300' : 'text-[#10100e]'}`}>{choice === '' ? 'State' : choice}</p>
            {
                isOpen ? (
                    <i className="fa-solid fa-sm fa-arrow-up"></i>
                )
                    :
                    (
                        <i className="fa-solid fa-sm fa-arrow-down"></i>
                    )
            }
            {
                isOpen && (
                    <div className='absolute top-9 left-0 z-20 w-full max-h-[200px] overflow-y-scroll border-b rounded-b-[5px]'>
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
                                                                create && label && buttonFunction && (
                                                                    <CreateButton label={label} buttonFunction={buttonFunction} />
                                                                )
                                                            }
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

export default CustomDropdownWithCreate

function CreateButton({ label, buttonFunction }: { label: string, buttonFunction: any }) {
    return (
        <button onClick={buttonFunction} className='w-full h-9 bg-[#ffffff] hover:bg-gray-100 transition-color duration-200 text-indigo-500 rounded-[3px] border border-gray-300'>{label}</button>
    )
}