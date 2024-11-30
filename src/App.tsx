
import { TopBar } from './components/home/TopBar'
import Layout from './Layout'

interface AppProps {
  state: any
  dispatch: any
}

function App({ state, dispatch }: AppProps) {

  console.log(state)

  return (
    <div className='min-h-screen bg-sym_gray-800'>
      <TopBar cart={state.cart} />
      <Layout state={state} dispatch={dispatch} />
    </div>
  )
}

export default App
