import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const Home = lazy(async () => await import('./routes/Home'))
const Checkout = lazy(async () => await import('./routes/Checkout'))

function Layout() {
    return (
        <main>
            <Suspense fallback={<p>Loading...</p>}>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/checkout' element={<Checkout />} />
                </Routes>
            </Suspense>
        </main>
    )
}

export default Layout