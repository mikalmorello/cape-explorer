import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import Map, { Marker } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import data from '../../data/locations.json'
import townsData from '../../data/capeTowns.json'
import { regionForArea } from '../../lib/capeRegions'
import { REGION_DISPLAY_OFFSET } from '../../lib/capeMunicipalities'
import { buildMapStyle, FRAME_BOUNDS, PAN_BOUNDS } from './mapStyle'

// Display-only position: locations.json stores true coordinates, but
// island locations render shifted by the same offset as their island's
// land so pins stay glued to the inset landmass.
function displayLngLat(location) {
  const offset = REGION_DISPLAY_OFFSET[regionForArea(location.area)]
  return offset
    ? [location.lng + offset[0], location.lat + offset[1]]
    : [location.lng, location.lat]
}

// Islands (Martha's Vineyard, Nantucket) are hidden for now per the
// owner - their polygons stay in capeTowns.json so re-enabling is a
// matter of dropping this filter (and restoring the inset shift via
// REGION_DISPLAY_OFFSET).
function capeOnly(geojson) {
  return {
    ...geojson,
    features: geojson.features.filter((f) => f.properties.region.endsWith('Cape')),
  }
}

function LocationPanel({ location, onClose }) {
  return (
    <div className="location-panel">
      <div className="location-panel-header">
        <h2>
          {location.name}
          {location.closed && <span className="closed-badge">Closed</span>}
        </h2>
        <button className="location-panel-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      {(location.area || location.address) && (
        <div className="location-panel-meta">
          {location.area && <p className="popup-area">{location.area}</p>}
          {location.address && <p className="popup-address">{location.address}</p>}
        </div>
      )}
      {location.activities?.length > 0 && (
        <div className="location-panel-section">
          <h3 className="location-panel-section-title">
            Activities ({location.activities.length})
          </h3>
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
        </div>
      )}
      {location.notes && (
        <div className="location-panel-section">
          <p className="popup-notes">{location.notes}</p>
        </div>
      )}
      {(location.website || location.photoAlbum) && (
        <div className="location-panel-section location-panel-links">
          {location.website && (
            <a href={location.website} target="_blank" rel="noreferrer">
              Website &rarr;
            </a>
          )}
          {location.photoAlbum && (
            <a href={location.photoAlbum} target="_blank" rel="noreferrer">
              Photos &rarr;
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export function MapView({ town = 'all' }) {
  const [selectedId, setSelectedId] = useState(null)

  const mapStyle = useMemo(() => buildMapStyle(capeOnly(townsData)), [])

  const locations =
    town === 'all' ? data.locations : data.locations.filter((loc) => loc.area === town)
  const selected = locations.find((loc) => loc.id === selectedId)

  return (
    <div className="map-view">
      <Map
        initialViewState={{ bounds: FRAME_BOUNDS, fitBoundsOptions: { padding: 30 } }}
        maxBounds={PAN_BOUNDS}
        minZoom={7}
        maxZoom={16}
        mapStyle={mapStyle}
        onClick={() => setSelectedId(null)}
        style={{ width: '100%', height: '100%' }}
      >
        {locations.map((location) => {
          const [lng, lat] = displayLngLat(location)
          return (
            <Marker
              key={location.id}
              longitude={lng}
              latitude={lat}
              color="#2b6157"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                setSelectedId(location.id)
              }}
            />
          )
        })}
      </Map>
      {selected &&
        // Portaled to <body> so it escapes .map-view's stacking context
        // (position: fixed always creates one) - otherwise its z-index
        // would only out-rank siblings inside .map-view, not the
        // floating header, which lives outside it in the DOM.
        createPortal(
          <LocationPanel location={selected} onClose={() => setSelectedId(null)} />,
          document.body,
        )}
    </div>
  )
}
