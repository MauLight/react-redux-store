import { useEffect, useState, type ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'

//* Components
import { PaymentForm } from '@/components/checkout/PaymentForm'
import { CheckSummary } from '@/components/checkout/CheckSummary'
import { CheckoutCard } from '@/components/checkout/CheckoutCard'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { APIProvider, Map, AdvancedMarker, MapCameraChangedEvent } from '@vis.gl/react-google-maps'

//* Types
import { ProductProps, StoreProps } from '@/utils/types'
import { fadeIn } from '@/utils/functions'

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID

const geocodeAddress = (address: string, callback: (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => void) => {
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ address }, (results, status) => {
        if (results) {
            return callback(results, status)
        }
        return null
    })
}

const Checkout = (): ReactElement => {
    const cart = useSelector((state: StoreProps) => state.cart.cart)
    const localCart: ProductProps[] = JSON.parse(localStorage.getItem('marketplace-cart') || '[]')
    const dispatch = useDispatch()

    //*Google maps state
    const [address, setAddress] = useState<string>('')
    const [zoom, setZoom] = useState<number>(13)
    const [geocodeResult, setGeocodeResult] = useState<{ lat: number, lng: number } | null>(null)

    const readyToPay = useSelector((state: StoreProps) => state.cart.readyToPay)
    const total = cart.length > 0 ? cart.reduce((acc: number, curr: any) => acc + (curr.price * curr.quantity), 0) : localCart.reduce((acc: number, curr: any) => acc + (curr.price * curr.quantity), 0)
    const vat = Math.floor(((total / 100) * 19))
    const totalWithVat = total + vat

    const handleGeocode = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            geocodeAddress(address, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus): void => {
                if (status === 'OK') {
                    const newGeoLocation = {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    }
                    setGeocodeResult(newGeoLocation)
                    setZoom(18)
                    console.log(newGeoLocation, 'This is the new geolocation.')
                } else {
                    console.error('Geocode was not successful for the following reason: ' + status);
                }
            });
        }
    }

    const handleCameraChanged = (ev: MapCameraChangedEvent) => {
        setZoom(ev.detail.zoom)
        console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
    }

    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem('marketplace-cart', JSON.stringify(cart))
        }
    }, [])

    return (
        <div className={`min-[500px]:max-[1440px]:px-10 w-full flex justify-center ${readyToPay ? 'bg-[#10100e]' : 'gap-y-10 bg-[#fdfdfd]'}`}>
            <div className={`w-web h-screen flex flex-col justify-center overflow-y-scroll transition-color duration-200 ${readyToPay ? 'bg-[#10100e]' : 'gap-y-10 bg-[#fdfdfd]'}`}>
                <div className="h-[100px]"></div>
                <div className="flex flex-col gap-y-5">
                    <div className="flex justify-between items-start">
                        <motion.h1
                            variants={fadeIn('bottom', 0.1)}
                            initial={'hidden'}
                            whileInView={'show'}
                            className={`uppercase text-[2rem] min-[500px]:text-[4rem] lg:text-9xl ${readyToPay ? 'text-[#ffffff]' : 'text-[#10100e]'}`}>{readyToPay ? 'checkout' : 'your cart'}</motion.h1>
                        <Link to={'/'}>
                            <XMarkIcon className='w-6 text-[#2E3D49] font-accent hover:rotate-90 hover:text-[#EA0C1D] transition-all duration-200' />
                        </Link>
                    </div>
                    {
                        !readyToPay && (
                            <div>
                                <p className='text-[1rem] lg:text-2xl text-[#10100e] uppercase'>{`total ${0} items`}</p>
                                <p className='text-[1rem] lg:text-2xl text-[#10100e] uppercase'>Your products are not reserved until payment is complete</p>
                            </div>
                        )
                    }
                </div>
                <>

                    {
                        readyToPay ? (
                            <APIProvider onLoad={() => { console.log('Maps loaded.') }} apiKey={apiKey}>
                                <PaymentForm cart={cart} totalWithVat={totalWithVat}>
                                    <>
                                        <input onKeyDown={handleGeocode} value={address} onChange={({ target }) => { setAddress(target.value) }} className="absolute z-20 top-0 left-0 w-full h-10 outline-none px-2" />

                                        <Map
                                            center={geocodeResult}
                                            zoom={zoom}
                                            mapId={mapId}
                                            defaultZoom={13}
                                            defaultCenter={{ lat: -33.44888970000001, lng: 289.3307345 }}
                                            onCameraChanged={handleCameraChanged}>
                                            {geocodeResult && <AdvancedMarker position={geocodeResult} />}
                                        </Map>
                                    </>

                                </PaymentForm>
                            </APIProvider>
                        )
                            :
                            (
                                <div className="relative grid-cols-1 grid md:grid-cols-5 xl:grid-cols-4 gap-x-5 overflow-y-scroll scrollbar-hide max-md:gap-y-20">
                                    <div className="col-span-3">
                                        {
                                            cart.length > 0 && cart.map((product, i) => (
                                                <CheckoutCard key={product.id + i} dispatch={dispatch} product={product} />
                                            ))
                                        }
                                        {
                                            cart.length === 0 && localCart.map((product, i) => (
                                                <CheckoutCard key={product.id + i} dispatch={dispatch} product={product} />
                                            ))
                                        }
                                    </div>
                                    <div className="col-span-2 xl:col-span-1">
                                        <CheckSummary numberOfProducts={Object.values(cart).length} total={total} taxes={vat} totalWithTaxes={totalWithVat} />
                                    </div>
                                </div>
                            )
                    }
                </>
                <div className="grow"></div>
            </div>
        </div>
    )
}

export default Checkout
