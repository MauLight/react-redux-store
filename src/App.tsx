
import Layout from './Layout'

interface AppProps {
  state: any
  dispatch: any
}

function App({ state, dispatch }: AppProps) {

  console.log(state)

  return (
    <div className='min-h-screen bg-sym_gray-800'>
      <Layout />
    </div>
  )
}

export default App
