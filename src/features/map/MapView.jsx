import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'

const CAPE_COD_CENTER = { lat: 41.7003, lng: -70.3002 }

const DUMMY_PIN = { lat: 41.6688, lng: -70.2962 } // Hyannis, MA

function MissingApiKeyNotice() {
  return (
    <div className="map-notice">
      <p>
        The map can't render without a Google Maps API key. Add
        <code> VITE_GOOGLE_MAPS_API_KEY</code> to <code>.env.local</code>
        (see <code>.env.example</code> and the README).
      </p>
    </div>
  )
}

export function MapView() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return <MissingApiKeyNotice />
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        className="map-view"
        defaultCenter={CAPE_COD_CENTER}
        defaultZoom={10}
        gestureHandling="greedy"
        disableDefaultUI={false}
      >
        <Marker position={DUMMY_PIN} title="Dummy pin" />
      </Map>
    </APIProvider>
  )
}
