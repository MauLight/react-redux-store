import { getProductsBySearchWordAsync } from '@/features/products/productsSlice'
import { AppDispatch } from '@/store/store'
import { ProductProps, StoreProps } from '@/utils/types'
import { useRef, useState, type ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import Fallback from './Fallback'
import EmptyList from './EmptyList'
import ErrorComponent from './ErrorComponent'
import { animatedGradientText } from '@/utils/styles'
import useOutsideClick from '@/hooks/useClickOutside'

export default function Searchbar({ closeModal }: { closeModal?: () => void }): ReactNode {
    const dispatch: AppDispatch = useDispatch()
    const searchIsLoading = useSelector((state: StoreProps) => state.inventory.searchIsLoading)
    const searchHasError = useSelector((state: StoreProps) => state.inventory.searchHasError)

    const [inputValue, setInputValue] = useState<string>('')
    const [focusX, setFocusX] = useState<boolean>(false)
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false)
    const [searchList, setSearchList] = useState<ProductProps[] | null>(null)

    const timerRef = useRef<number | null>(null)
    const modalRef = useRef(null)
    function onClose() {
        setSearchList(null)
        setInputValue('')
    }

    useOutsideClick(modalRef, onClose)

    function handleClearInput() {
        setInputValue('')
    }

    function debounceSearch() {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }
        timerRef.current = window.setTimeout(async () => {
            const { payload } = await dispatch(getProductsBySearchWordAsync(inputValue))
            setSearchList(payload.products)
        }, 1000)
    }

    async function handleSubmitSearch(e: React.KeyboardEvent<HTMLInputElement>): Promise<void> {
        if (e.key === 'Enter') {
            console.log('searching...')
            const { payload } = await dispatch(getProductsBySearchWordAsync(inputValue))
            setSearchList(payload.products)
        }
    }

    function handleResetSearchbar() {
        if (closeModal) {
            closeModal()
        }
        setInputValue('')
        setSearchList(null)
    }

    return (
        <div className='sm:w-[250px] max-sm:border border-gray-300 relative h-10 z-20'>
            {
                searchIsLoading && (
                    <div className='absolute top-0 left-3 h-10'>
                        <Fallback size='20' />
                    </div>
                )
            }
            {
                !searchIsLoading && (
                    <i className="absolute top-5 left-3 fa-lg fa-solid fa-magnifying-glass text-sym_gray-100"></i>
                )
            }
            {
                inputValue.length > 0 && (
                    <i onClick={handleClearInput} className={`absolute top-3 right-2 fa-regular fa-circle-xmark cursor-pointer ${focusX ? 'text-[#10100e]' : 'text-[#fff]'}`}></i>
                )
            }
            <input
                onFocus={() => { setFocusX(true); setIsInputFocused(true) }}
                onBlur={() => { setFocusX(false); setIsInputFocused(false) }}
                onMouseEnter={() => { setFocusX(true) }}
                onMouseLeave={() => { !isInputFocused && setFocusX(false) }}
                value={inputValue}
                onChange={({ target }) => { setInputValue(target.value); debounceSearch() }}
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
                    <Link ref={modalRef} to={`/product/${product.id}`} onClick={handleResetSearchbar} key={product.id} className='absolute top-10 left-0 bg-[#ffffff] glass grid grid-cols-3 gap-x-2 max-sm:w-full'>
                        <div className="col-span-1 h-[80px] z-10">
                            <img src={product.images[0].image} className='w-full h-full object-cover' alt="product" />
                        </div>
                        <div className="col-span-2 flex flex-col gap-y-2 z-10">
                            <div className="flex flex-col text-[#fff]">
                                <p className='text-[1rem]'>{product.title}</p>
                                <p className={`text-[0.8rem] ${animatedGradientText}`}>{product.brand}</p>
                            </div>
                        </div>
                        <div className="absolute z-0 top-0 left-0 w-full h-full bg-[#10100e] opacity-40"></div>
                    </Link>
                ))
            }
        </div>
    )
}
