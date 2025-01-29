import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'

interface NavbarButtonMobileProps {
    title: string
    icon: string
    wasPressed: boolean
    handlePressButton: () => void
    fontSize?: string
    navigate: any
}

function NavbarButton({ title, icon, wasPressed, navigate, handlePressButton, fontSize = '0.7rem' }: NavbarButtonMobileProps) {

    function handleNavbarButtonAction() {
        handlePressButton()
        navigate()
    }

    return (
        <button onClick={handleNavbarButtonAction} className={`group flex max-sm:flex-col sm:gap-x-1 gap-y-1 items-center justify-center max-w-[120px] hover:text-indigo-500 active:text-[#10100e] border-sym_gray-300 transition-color duration-200 ${wasPressed ? 'text-indigo-500' : ''}`}>
            <i className={`${icon}`}></i>
            <p className={`text-[${fontSize}]`}>{title}</p>
        </button>
    )
}

function DashboardNavbar(): ReactNode {

    const navigate = useNavigate()

    const [{ one, two, three, four }, setNavState] = useState<Record<string, boolean>>({
        one: true,
        two: false,
        three: false,
        four: false
    })

    return (
        <>
            <nav className='fixed bottom-0 left-0 z-20 flex justify-between sm:hidden h-12 w-full bg-[#ffffff] border-t border-sym_gray-300'>
                <NavbarButton navigate={() => { navigate('/admin/builder') }} wasPressed={one} handlePressButton={() => { setNavState({ one: true, two: false, three: false, four: false }) }} title='Builder' icon='fa-solid fa-wrench' />
                <NavbarButton navigate={() => { navigate('/admin/products') }} wasPressed={two} handlePressButton={() => { setNavState({ one: false, two: true, three: false, four: false }) }} title='Products' icon='fa-solid fa-cube' />
                <NavbarButton navigate={() => { navigate('/admin/collections') }} wasPressed={three} handlePressButton={() => { setNavState({ one: false, two: false, three: true, four: false }) }} title='Collections' icon='fa-solid fa-cubes' />
                <NavbarButton navigate={() => { navigate('/admin/settings') }} wasPressed={four} handlePressButton={() => { setNavState({ one: false, two: false, three: false, four: true }) }} title='Settings' icon='fa-solid fa-gear' />
            </nav>
            <nav className='w-full hidden sm:flex justify-between items-center bg-[#ffffff]'>
                <div className="flex gap-x-10">
                    <NavbarButton navigate={() => { navigate('/admin/builder') }} wasPressed={one} handlePressButton={() => { setNavState({ one: true, two: false, three: false, four: false }) }} title='Builder' icon='fa-solid fa-wrench' />
                    <NavbarButton navigate={() => { navigate('/admin/products') }} wasPressed={two} handlePressButton={() => { setNavState({ one: false, two: true, three: false, four: false }) }} title='Products' icon='fa-solid fa-cube' />
                    <NavbarButton navigate={() => { navigate('/admin/collections') }} wasPressed={three} handlePressButton={() => { setNavState({ one: false, two: false, three: true, four: false }) }} title='Collections' icon='fa-solid fa-cubes' />
                    <NavbarButton navigate={() => { navigate('/admin/settings') }} wasPressed={four} handlePressButton={() => { setNavState({ one: false, two: false, three: false, four: true }) }} title='Settings' icon='fa-solid fa-gear' />
                </div>
                <Link to={'/'} className='text-[0.9rem] hover:text-indigo-500 transition-color duration-200 flex gap-x-1 items-center'>
                    <i className="fa-solid fa-arrow-left-long"></i>
                    Back to Site</Link>
            </nav>
        </>
    )
}

export default DashboardNavbar