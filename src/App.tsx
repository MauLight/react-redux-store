import Layout from './Layout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { animatedGradientText } from './utils/styles'
import { useLocation } from 'react-router-dom'

function App() {

  const { pathname } = useLocation()

  return (
    <>
      <div className='relative min-h-screen bg-gray-100'>
        <Layout />
        <ToastContainer
          position='top-right'
          autoClose={4000}
          hideProgressBar={true}
          closeOnClick
          pauseOnHover
          theme='dark'
          limit={1}
        />
        {
          !pathname.includes('admin') && (
            <div className="w-full h-[60px] flex justify-end items-center px-10 bg-[#10100e]">
              <h1 className='text-[#fff]'>Powered by <a href='https://symetria.lat' className={`uppercase ${animatedGradientText}`}>Symetria</a></h1>
            </div>
          )
        }
      </div>
    </>
  )
}

export default App
