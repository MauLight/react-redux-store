import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const Home = lazy(async () => await import('./routes/Home'))
const Checkout = lazy(async () => await import('./routes/Checkout'))

function Layout({ state, dispatch }: { state: any, dispatch: any }) {
    return (
        <div>
            <Suspense fallback={<p>Loading...</p>}>
                <Routes>
                    <Route path='/' element={<Home state={state} dispatch={dispatch} />} />
                    <Route path='/checkout' element={<Checkout cart={state.cart} dispatch={dispatch} />} />
                </Routes>
            </Suspense>
        </div>
    )
}

export default Layout