import { lazy, Suspense, useEffect, useLayoutEffect, useState } from 'react'
import { Routes, Route, useLocation, useMatch } from 'react-router-dom'

import TopBar from './components/common/TopBar'
import DashboardHeader from './components/dashboard/DashboardHeader'
import ErrorBoundary from './components/error/ErrorBoundary'
import Fallback from './components/common/Fallback'
import ScrollToTop from './ScrollToTop'
import AnnouncementBar from './components/common/AnnouncementBar'
import { getUIConfigurationAsync, postNewUIConfigurationAsync } from './features/ui/uiSlice'
import { AppDispatch } from './store/store'
import { useDispatch } from 'react-redux'

const Sign = lazy(async () => await import('./routes/Sign'))
const Login = lazy(async () => await import('./routes/Login'))
const Home = lazy(async () => await import('./routes/Home'))
const Profile = lazy(async () => await import('./routes/Profile'))
const Collection = lazy(async () => await import('./routes/Collection'))
const IndividualProduct = lazy(async () => await import('./routes/IndividualProduct'))
const AdminLogin = lazy(async () => await import('./routes/AdminLogin'))

const Dashboard = lazy(async () => await import('./routes/Dashboard'))
const Products = lazy(async () => await import('./routes/Products'))
const Builder = lazy(async () => await import('./routes/Builder'))

const Checkout = lazy(async () => await import('./routes/Checkout'))
const NotFound = lazy(async () => await import('./routes/NotFound'))
const Confirmation = lazy(async () => await import('@/routes/Confirmation'))

function Layout() {
    const dispatch: AppDispatch = useDispatch()
    const { pathname } = useLocation()
    const hideTopbar = pathname.includes('sign') || pathname.includes('login') || pathname.includes('admin') || pathname.includes('confirmation')
    const isAdmin = pathname.includes('admin')

    const [announcementBar, _setAnnouncementBar] = useState<boolean>(true)

    const matchId = useMatch('/product/:id')
    const productId = matchId?.params.id
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false)

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    useLayoutEffect(() => {
        async function getCurrentUIOrCreateNewUIConfiguration() {
            {
                try {
                    const { payload } = await dispatch(getUIConfigurationAsync())
                    if (payload.message) {
                        const { payload } = await dispatch(postNewUIConfigurationAsync())
                        console.log(payload)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
        getCurrentUIOrCreateNewUIConfiguration()
    }, [])

    useEffect(() => {
        function handleScroll() {
            setShowScrollButton(window.scrollY > 1000)
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            removeEventListener('scroll', handleScroll)
        }

    }, [])

    return (
        <main className={`relative ${pathname.length === 1 || pathname === '/collection' ? 'bg-[#10100e]' : ''}`}>
            {
                announcementBar && (
                    <AnnouncementBar />
                )
            }
            {
                !hideTopbar && <TopBar announcementBar={announcementBar} />
            }
            {
                isAdmin && (
                    <DashboardHeader />
                )
            }
            <ErrorBoundary>
                <Suspense fallback={<Fallback />}>
                    <ScrollToTop>
                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path='/sign' element={<Sign />} />
                            <Route path='/login' element={<Login />} />
                            <Route path='/profile' element={<Profile />} />
                            <Route path='/collection' element={<Collection title='Surreal Collection' />} />
                            <Route path='/product/:id' element={<IndividualProduct id={productId ? productId : undefined} />} />
                            <Route path='/admin/login' element={<AdminLogin />} />
                            <Route path='/admin' element={<Dashboard />} />
                            <Route path='/admin/products' element={<Products />} />
                            <Route path='/admin/builder' element={<Builder />} />
                            <Route path='/checkout' element={<Checkout />} />
                            <Route path='/confirmation' element={<Confirmation />} />
                            <Route path='*' element={<NotFound />} />
                        </Routes>
                    </ScrollToTop>
                </Suspense>
            </ErrorBoundary>
            {
                showScrollButton && (
                    <button onClick={scrollToTop} className='fixed bottom-10 right-10 w-[50px] h-[50px] rounded-full border bg-[#ffffff]'>
                        <i className="fa-solid fa-arrow-up"></i>
                    </button>
                )
            }
        </main>
    )
}

export default Layout