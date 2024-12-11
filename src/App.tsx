
import Layout from './Layout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {

  return (
    <div className='min-h-screen bg-sym_gray-800'>
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
    </div>
  )
}

export default App
