import { getProductsBySearchWordAsync } from '@/features/products/productsSlice'
import { AppDispatch } from '@/store/store'
import { ProductProps, StoreProps } from '@/utils/types'
import { useState, type ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import Fallback from './Fallback'
import EmptyList from './EmptyList'
import ErrorComponent from './ErrorComponent'

export default function Searchbar(): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const searchIsLoading = useSelector((state: StoreProps) => state.inventory.searchIsLoading)
    const searchHasError = useSelector((state: StoreProps) => state.inventory.searchHasError)

    const [inputValue, setInputValue] = useState<string>('')
    const [focusX, setFocusX] = useState<boolean>(false)
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false)
    const [searchList, setSearchList] = useState<ProductProps[] | null>(null)

    function handleClearInput() {
        setInputValue('')
    }

    async function handleSubmitSearch(e: React.KeyboardEvent<HTMLInputElement>): Promise<void> {
        if (e.key === 'Enter') {
            console.log('searching...')
            const { payload } = await dispatch(getProductsBySearchWordAsync(inputValue))
            setSearchList(payload.products)
            console.log(payload)
        }
    }

    function handleResetSearchbar() {
        setInputValue('')
        setSearchList(null)
    }

    return (
        <div className='group w-[250px] relative h-10'>
            {
                searchIsLoading && (
                    <div className='absolute top-0 left-3 h-10'>
                        <Fallback size='20' />
                    </div>
                )
            }
            {
                !searchIsLoading && (
                    <i className="absolute top-5 left-3 fa-lg fa-solid fa-magnifying-glass text-sym_gray-300"></i>
                )
            }
            {
                inputValue.length > 0 && (
                    <i onClick={handleClearInput} className={`absolute top-3 right-2 fa-regular fa-circle-xmark cursor-pointer ${focusX ? 'text-[#10100e]' : 'text-[#ffffff]'}`}></i>
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
                className='h-full w-full outline-none border-none pl-[50px] pr-2 bg-transparent text-[#ffffff] group-hover:bg-[#ffffff] group-hover:text-[#10100e] focus:bg-[#ffffff] focus:text-[#10100e]' type="text"
            />
            {
                searchHasError && (
                    <ErrorComponent />
                )
            }
            {
                !searchHasError && searchList && searchList.length === 0 && inputValue.length > 0 && (
                    <EmptyList />
                )
            }
            {
                !searchHasError && searchList && searchList.length > 0 && searchList.map((product: ProductProps) => (
                    <Link to={`/product/${product.id}`} onClick={handleResetSearchbar} key={product.id} className='absolute top-10 left-0 bg-[#ffffff] glass grid grid-cols-3 gap-x-2'>
                        <div className="col-span-1">
                            <img src={product.image} className='w-full h-full object-cover' alt="product" />
                        </div>
                        <div className="col-span-2 flex flex-col gap-y-2">
                            <div className="flex flex-col">
                                <p className='text-[1rem]'>{product.title}</p>
                                <p className='text-[0.8rem]'>{product.brand}</p>
                            </div>
                            <p>{product.price}</p>
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}
