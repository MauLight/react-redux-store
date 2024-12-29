import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route, useLocation, useMatch } from 'react-router-dom'

import TopBar from './components/common/TopBar'
import ErrorBoundary from './components/error/ErrorBoundary'
import Fallback from './components/common/Fallback'

const Sign = lazy(async () => await import('./routes/Sign'))
const Login = lazy(async () => await import('./routes/Login'))
const Home = lazy(async () => await import('./routes/Home'))
const Profile = lazy(async () => await import('./routes/Profile'))
const Collection = lazy(async () => await import('./routes/Collection'))
const IndividualProduct = lazy(async () => await import('./routes/IndividualProduct'))
const AdminLogin = lazy(async () => await import('./routes/AdminLogin'))
const Dashboard = lazy(async () => await import('./routes/Dashboard'))
const Checkout = lazy(async () => await import('./routes/Checkout'))
const NotFound = lazy(async () => await import('./routes/NotFound'))
const Confirmation = lazy(async () => await import('@/routes/Confirmation'))

function Layout() {
    const { pathname } = useLocation()
    const hideTopbar = pathname.includes('sign') || pathname.includes('login') || pathname.includes('admin') || pathname.includes('confirmation')

    const matchId = useMatch('/product/:id')
    const productId = matchId?.params.id
    const [showScrollButton, setShowScrollButton] = useState<boolean>(false)

    function scrollToTop() {
        console.log('here', window.scrollY)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

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
        <main className='relative'>
            {
                !hideTopbar && <TopBar />
            }
            <ErrorBoundary>
                <Suspense fallback={<Fallback />}>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/sign' element={<Sign />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/profile' element={<Profile />} />
                        <Route path='/collection' element={<Collection title='Surreal Collection' />} />
                        <Route path='/product/:id' element={<IndividualProduct id={productId ? productId : undefined} />} />
                        <Route path='/admin/login' element={<AdminLogin />} />
                        <Route path='/admin' element={<Dashboard />} />
                        <Route path='/checkout' element={<Checkout />} />
                        <Route path='/confirmation' element={<Confirmation />} />
                        <Route path='*' element={<NotFound />} />
                    </Routes>
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