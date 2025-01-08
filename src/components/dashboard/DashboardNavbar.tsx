import { useEffect, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface NavbarButtonMobileProps {
    title: string
    icon: string
    wasPressed: boolean
    handlePressButton: () => void
    fontSize?: string
}

function NavbarButton({ title, icon, wasPressed, handlePressButton, fontSize = '0.7rem' }: NavbarButtonMobileProps) {


    return (
        <button onClick={handlePressButton} className={`group flex max-sm:flex-col sm:gap-x-2 gap-y-1 items-center justify-center w-full hover:bg-indigo-500 active:bg-[#ffffff] border-r border-sym_gray-300 transition-color duration-200 ${wasPressed ? 'bg-indigo-500' : ''}`}>
            <i className={`${icon} group-active:text-indigo-500`}></i>
            <p className={`text-[${fontSize}] group-active:text-indigo-500`}>{title}</p>
        </button>
    )
}

function DashboardNavbar(): ReactNode {

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [{ one, two, three }, setNavState] = useState<Record<string, boolean>>({
        one: true,
        two: false,
        three: false
    })

    useEffect(() => {
        if (one && !pathname.includes('settings')) {
            //navigate('/admin/settings')
        } else if (two && !pathname.includes('products')) {
            navigate('/admin/products')
        } else if (three && !pathname.includes('collections')) {
            navigate('/admin/collections')
        }
    }, [one, two, three])

    return (
        <>
            <nav className='fixed bottom-0 left-0 z-20 flex justify-between px-5 sm:hidden h-12 w-full bg-[#ffffff] border-t border-sym_gray-300'>
                <NavbarButton wasPressed={one} handlePressButton={() => { setNavState({ one: true, two: false, three: false }) }} title='Settings' icon='fa-solid fa-gear' />
                <NavbarButton wasPressed={two} handlePressButton={() => { setNavState({ one: false, two: true, three: false }) }} title='Products' icon='fa-solid fa-cube' />
                <NavbarButton wasPressed={three} handlePressButton={() => { setNavState({ one: false, two: false, three: true }) }} title='Collections' icon='fa-solid fa-cubes' />
            </nav>
            <nav className='hidden sm:flex h-12 w-full bg-[#ffffff] border-y border-l border-sym_gray-300'>
                <NavbarButton fontSize='1rem' wasPressed={one} handlePressButton={() => { setNavState({ one: true, two: false, three: false }) }} title='Settings' icon='fa-solid fa-gear' />
                <NavbarButton fontSize='1rem' wasPressed={two} handlePressButton={() => { setNavState({ one: false, two: true, three: false }) }} title='Products' icon='fa-solid fa-cube' />
                <NavbarButton fontSize='1rem' wasPressed={three} handlePressButton={() => { setNavState({ one: false, two: false, three: true }) }} title='Collections' icon='fa-solid fa-cubes' />
            </nav>
        </>
    )
}

export default DashboardNavbar