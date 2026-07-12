import { useState } from 'react'
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps'
import data from '../../data/locations.json'

const CAPE_COD_CENTER = { lat: 41.7003, lng: -70.3002 }

// Keep the map focused on our own pins - hide Google's default
// points-of-interest and transit layers so they don't compete visually.
const MAP_STYLES = [
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
]

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

function LocationPopup({ location }) {
  return (
    <div className="location-popup">
      <h2>{location.name}</h2>
      {location.area && <p className="popup-area">{location.area}</p>}
      {location.activities?.length > 0 && (
        <ul className="popup-activities">
          {location.activities.map((activity) => (
            <li key={activity.title}>
              {activity.title}
              {activity.category && (
                <span className="category-tag">{activity.category}</span>
              )}
            </li>
          ))}
        </ul>
      )}
      {location.notes && <p className="popup-notes">{location.notes}</p>}
      {location.website && (
        <a href={location.website} target="_blank" rel="noreferrer">
          Website
        </a>
      )}
      {location.photoAlbum && (
        <a
          className="popup-photos-link"
          href={location.photoAlbum}
          target="_blank"
          rel="noreferrer"
        >
          Photos
        </a>
      )}
    </div>
  )
}

export function MapView() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const [selectedId, setSelectedId] = useState(null)

  if (!apiKey) {
    return <MissingApiKeyNotice />
  }

  const selected = data.locations.find((loc) => loc.id === selectedId)

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        className="map-view"
        defaultCenter={CAPE_COD_CENTER}
        defaultZoom={10}
        gestureHandling="greedy"
        disableDefaultUI={false}
        styles={MAP_STYLES}
        onClick={() => setSelectedId(null)}
      >
        {data.locations.map((location) => (
          <Marker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            title={location.name}
            onClick={() => setSelectedId(location.id)}
          />
        ))}
        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            pixelOffset={[0, -36]}
            onCloseClick={() => setSelectedId(null)}
          >
            <LocationPopup location={selected} />
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  )
}
