import { Dispatch, SetStateAction, useState, type ReactNode } from 'react'

interface NavbarButtonMobileProps {
    title: string
    icon: string
    wasPressed: boolean
    handlePressButton: () => void
}

function NavbarButtonMobile({ title, icon, wasPressed, handlePressButton }: NavbarButtonMobileProps) {


    return (
        <button onClick={handlePressButton} className={`flex flex-col gap-y-1 items-center justify-center w-full hover:bg-indigo-500 active:bg-[#ffffff] transition-color duration-200 ${wasPressed ? 'bg-indigo-500' : ''}`}>
            <i className={`${icon}`}></i>
            <p className='text-[0.7rem]'>{title}</p>
        </button>
    )
}

function DashboardNavbar(): ReactNode {

    const [{ one, two, three }, setNavState] = useState<Record<string, boolean>>({
        one: true,
        two: false,
        three: false
    })

    return (
        <>
            <nav className='fixed bottom-0 left-0 z-20 flex justify-between px-5 sm:hidden h-12 w-full bg-[#ffffff] border-t border-sym_gray-300'>
                <NavbarButtonMobile wasPressed={one} handlePressButton={() => { setNavState({ one: true, two: false, three: false }) }} title='Settings' icon='fa-solid fa-gear' />
                <NavbarButtonMobile wasPressed={two} handlePressButton={() => { setNavState({ one: false, two: true, three: false }) }} title='Products' icon='fa-solid fa-cube' />
                <NavbarButtonMobile wasPressed={three} handlePressButton={() => { setNavState({ one: false, two: false, three: true }) }} title='Collections' icon='fa-solid fa-cubes' />
            </nav>
            <nav className='hidden sm:flex h-10 w-full bg-[#10100e] rounded-[10px]'></nav>
        </>
    )
}

export default DashboardNavbar