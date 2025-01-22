import { useState, type ReactNode } from 'react'

export default function Searchbar(): ReactNode {

    const [inputValue, setInputValue] = useState<string>('')
    const [focusX, setFocusX] = useState<boolean>(false)
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false)

    function handleClearInput() {
        setInputValue('')
    }

    async function handleSubmitSearch(e: React.KeyboardEvent<HTMLInputElement>): Promise<void> {
        if (e.key === 'Enter') {
            console.log('searching...')
        }
    }

    return (
        <div className='group w-[200px] relative h-10'>
            <i className="absolute top-5 left-3 fa-lg fa-solid fa-magnifying-glass text-sym_gray-300"></i>
            {
                inputValue.length > 0 && (
                    <i onClick={handleClearInput} className={`absolute top-[23px] right-2 fa-regular fa-circle-xmark cursor-pointer ${focusX ? 'text-[#10100e]' : 'text-[#ffffff]'}`}></i>
                )
            }
            <input
                onFocus={() => { setFocusX(true); setIsInputFocused(true) }}
                onBlur={() => { setFocusX(false); setIsInputFocused(false) }}
                onMouseEnter={() => { setFocusX(true) }}
                onMouseLeave={() => { !isInputFocused && setFocusX(false) }}
                value={inputValue}
                onChange={({ target }) => { setInputValue(target.value) }}
                onKeyDown={handleSubmitSearch}
                className='h-full w-full outline-none border-none pl-[50px] pr-2 bg-transparent text-[#ffffff] group-hover:bg-[#ffffff] group-hover:text-[#10100e] focus:bg-[#ffffff] focus:text-[#10100e]' type="text" />
        </div>
    )
}
