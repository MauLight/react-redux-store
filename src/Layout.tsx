import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const Home = lazy(async () => await import('./routes/Home'))

function Layout() {
    return (
        <div>
            <Suspense fallback={<p>Loading...</p>}>
                <Routes>
                    <Route path='/' element={<Home />} />
                </Routes>
            </Suspense>
        </div>
    )
}

export default Layout