import { Dispatch, SetStateAction } from "react"
import { toast } from "react-toastify"
import CryptoJS from 'crypto-js'
import axios from "axios"
import { DecodedProps, RegionProps } from "./types"
import { jwtDecode } from "jwt-decode"

const cloudinaryApiSecret = import.meta.env.VITE_CLOUDINARY_APISECRET
const CloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUDNAME

export const degToRad = (deg: number) => deg * Math.PI / 180
export const randRange = (min: number, max: number) => Math.random() * (max - min) + min

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const fadeIn = (direction: string, delay: number) => {
  return {
    hidden: {
      y: direction === 'top' ? 10 : direction === 'down' ? -10 : 0,
      opacity: 0,
      x: direction === 'left' ? 10 : direction === 'right' ? -10 : 0
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: 'tween',
        duration: 0.5,
        delay,
        ease: [0.25, 0.25, 0.25, 0.75]
      }
    }
  }
}

export function handleCopyToClipboard(text: string, message: string) {
  navigator.clipboard.writeText(text)
  toast.success(message)
}

export function getPercentage(getValues: () => {
  image?: string | undefined;
  discount: number;
  price: number;
  title: string;
  description: string;
}, setPriceWithDiscount: Dispatch<SetStateAction<number>>) {
  const percentage = getValues().discount
  const price = getValues().price
  const discount = (percentage / 100) * price
  setPriceWithDiscount(price - discount)
}

export function generateSignature(params: Record<string, any>): string {
  const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&')
  const stringToSign = `${sortedParams}${cloudinaryApiSecret}`
  const hash = CryptoJS.SHA1(stringToSign)

  return hash.toString(CryptoJS.enc.Hex)
}

export async function getRegionsAsync(): Promise<RegionProps[]> {
  const { data } = await axios.get('http://testservices.wschilexpress.com/georeference/api/v1/regions')
  if (data) {
    const regions = data.regions
    return regions
  } else {
    return []
  }
}

export const postToCloudinary = async (formData: FormData, setError?: Dispatch<SetStateAction<string | null>>): Promise<any> => {
  try {
    const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${CloudinaryCloudName}/image/upload`, formData)
    return data
  } catch (error) {
    console.log(error)
    if (setError) {
      setError((error as Record<string, any>).message)
    }
    return error
  }
}

export function handleDecodeToken(token: string) {

  const decoded: DecodedProps = jwtDecode(token)
  const currentTime = Date.now() / 1000

  if (decoded.role !== 'admin') {
    toast.error('Wrong credentials.')
    return false
  }

  if (decoded.exp < currentTime) {
    toast.error('Token expired, please try again.')
    return false
  }

  return true
}
