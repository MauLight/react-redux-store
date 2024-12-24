import { AdvancedMarker, APIProvider, Map, MapCameraChangedEvent } from '@vis.gl/react-google-maps'
import { useEffect, useState, type ReactNode } from 'react'
import { PaymentForm } from './PaymentForm'
import { StoreProps } from '@/utils/types'
import { useSelector } from 'react-redux'

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID

interface GoogleMapsAPIProps {
    vat: number
    totalWithVat: number
}

export default function GoogleMapsAPI({ vat, totalWithVat }: GoogleMapsAPIProps): ReactNode {
    const cart = useSelector((state: StoreProps) => state.cart.cart)

    //* Google maps state
    const [zoom, setZoom] = useState<number>(13)
    const [geocodeResult, setGeocodeResult] = useState<{ lat: number, lng: number } | null>(null)
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null)

    const handleCameraChanged = (ev: MapCameraChangedEvent) => {
        setZoom(ev.detail.zoom)
    }

    useEffect(() => {
        if (selectedPlace !== null && selectedPlace.geometry !== undefined && selectedPlace.geometry.location !== undefined) {
            const newGeoLocation = {
                lat: selectedPlace.geometry.location.lat(),
                lng: selectedPlace.geometry.location.lng()
            }
            setGeocodeResult(newGeoLocation)
            setZoom(18)
        }
    }, [selectedPlace])

    return (
        <APIProvider onLoad={() => { console.log('Maps loaded.') }} apiKey={apiKey}>
            <PaymentForm
                vat={vat}
                selectedPlace={selectedPlace}
                setSelectedPlace={setSelectedPlace}
                cart={cart}
                totalWithVat={totalWithVat}
            >
                <>
                    <Map
                        zoom={zoom}
                        mapId={mapId}
                        defaultZoom={13}
                        center={geocodeResult}
                        defaultCenter={{ lat: -33.44888970000001, lng: 289.3307345 }}
                        onCameraChanged={handleCameraChanged}>
                        {geocodeResult && <AdvancedMarker position={geocodeResult} />}
                    </Map>
                </>

            </PaymentForm>
        </APIProvider>
    )
}
