import { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'

//*Redux
import { useDispatch } from 'react-redux'
import { postNewUserAsync } from '@/features/userAuth/userAuthSlice'
import { AppDispatch } from '@/store/store'

const GoogleButton = ({
  operation = 1,
  handleLogin,
}: {
  operation: number
  handleLogin: (args: { email: string; password: string }) => Promise<void>
}) => {

  const [btnPressed, setBtnPressed] = useState<boolean>(false)
  const dispatch: AppDispatch = useDispatch()

  const handleClick = () => {

    if (operation === 1) {
      setBtnPressed(true)
      googleLogin()
    } else {
      setBtnPressed(true)
      googleSignUp()
    }
  }

  const googleSignUp: () => void = useGoogleLogin({
    onSuccess: async (res) => {
      try {
        const { data } = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${res.access_token}`, {
          headers: {
            Authorization: `Bearer ${res.access_token}`,
            Accept: 'application/json'
          }
        })

        console.log(data)

        const newUser = {
          firstname: data.given_name,
          lastname: data.family_name,
          email: data.email,
          password: data.id + data.given_name + data.email
        }

        const response = await dispatch(postNewUserAsync(newUser))
        if (response) console.log(response)
      } catch (error) {
        console.log(error)
      }

    }
  })

  const googleLogin: () => void = useGoogleLogin({
    onSuccess: async (res) => {
      try {
        const { data } = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${res.access_token}`, {
          headers: {
            Authorization: `Bearer ${res.access_token}`,
            Accept: 'application/json'
          }
        })

        console.log(data)

        const user = {
          email: data.email,
          password: data.id + data.given_name + data.email
        }

        await handleLogin(user)

      } catch (error) {
        console.log(error)
      }
    }
  })

  return (
    <button
      disabled={btnPressed}
      type='button'
      onClick={handleClick}
      className='h-8 p-2 text-[#4285F4] w-full flex justify-center items-center gap-x-2'
    >
      <i className="fa-brands fa-google"></i>
      {btnPressed ? 'Loading...' : 'Login With Google'}
    </button>
  )
}

export default GoogleButton
