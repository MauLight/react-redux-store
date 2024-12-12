import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'

import TopBar from './components/common/TopBar'
import ErrorBoundary from './components/error/ErrorBoundary'
import Fallback from './components/common/Fallback'

const Sign = lazy(async () => await import('./routes/Sign'))
const Login = lazy(async () => await import('./routes/Login'))
const AdminLogin = lazy(async () => await import('./routes/AdminLogin'))
const Dashboard = lazy(async () => await import('./routes/Dashboard'))
const Home = lazy(async () => await import('./routes/Home'))
const Checkout = lazy(async () => await import('./routes/Checkout'))
const NotFound = lazy(async () => await import('./routes/NotFound'))

function Layout() {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const hideTopbar = pathname.includes('sign') || pathname.includes('login') || pathname.includes('admin')
    const user = localStorage.getItem('store-user')

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [])

    return (
        <main>
            {
                !hideTopbar && <TopBar />
            }
            <ErrorBoundary>
                <Suspense fallback={<Fallback />}>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/sign' element={<Sign />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/admin/login' element={<AdminLogin />} />
                        <Route path='/admin/dashboard' element={<Dashboard />} />
                        <Route path='/checkout' element={<Checkout />} />
                        <Route path='*' element={<NotFound />} />
                    </Routes>
                </Suspense>
            </ErrorBoundary>
        </main>
    )
}

export default Layout