import { Dispatch, SetStateAction, useState, type ReactNode } from 'react'
import { AdvancedMarker, APIProvider, Map, MapCameraChangedEvent } from '@vis.gl/react-google-maps'

import PlaceAutocomplete from './AutoCompleteElement'

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID

function GoogleMaps({ setStep }: { setStep: Dispatch<SetStateAction<{ one: boolean, two: boolean }>> }): ReactNode {

    //* Google maps state
    const [zoom, setZoom] = useState<number>(13)
    const [geocodeResult, setGeocodeResult] = useState<{ lat: number, lng: number } | null>(null)
    const [locationInputValue, setLocationInputValue] = useState<google.maps.places.PlaceResult | null>(null)

    const handleCameraChanged = (ev: MapCameraChangedEvent) => {
        setZoom(ev.detail.zoom)
    }

    return (
        <APIProvider onLoad={() => { console.log('Maps loaded.') }} apiKey={apiKey}>
            <main>
                <div className="flex flex-col h-[450px]">
                    <Map
                        zoom={zoom}
                        mapId={mapId}
                        defaultZoom={13}
                        center={geocodeResult}
                        defaultCenter={{ lat: -33.44888970000001, lng: 289.3307345 }}
                        onCameraChanged={handleCameraChanged}>
                        {geocodeResult && <AdvancedMarker position={geocodeResult} />}
                    </Map>
                </div>
                <PlaceAutocomplete
                    setStep={setStep}
                    onPlaceSelect={setLocationInputValue}
                    selectedPlace={locationInputValue as google.maps.places.PlaceResult}
                />
            </main>
        </APIProvider>
    )
}

export default GoogleMaps
