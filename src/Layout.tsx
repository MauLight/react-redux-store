import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { TopBar } from './components/common/TopBar'

const Sign = lazy(async () => await import('./routes/Sign'))
const Login = lazy(async () => await import('./routes/Login'))
const Home = lazy(async () => await import('./routes/Home'))
const Checkout = lazy(async () => await import('./routes/Checkout'))

function Layout() {
    const { pathname } = useLocation()
    const hideTopbar = pathname.includes('sign') || pathname.includes('login')
    return (
        <main>
            {
                !hideTopbar && <TopBar />
            }
            <Suspense fallback={<p>Loading...</p>}>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/sign' element={<Sign />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/checkout' element={<Checkout />} />
                </Routes>
            </Suspense>
        </main>
    )
}

export default Layout