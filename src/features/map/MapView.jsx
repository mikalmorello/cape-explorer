import { useEffect, useMemo, useState } from 'react'
import Map, { Marker, Popup } from 'react-map-gl/maplibre'
import maplibregl from 'maplibre-gl'
import { Protocol } from 'pmtiles'
import 'maplibre-gl/dist/maplibre-gl.css'
import data from '../../data/locations.json'
import { regionForArea } from '../../lib/capeRegions'
import { REGION_DISPLAY_OFFSET } from '../../lib/capeMunicipalities'
import { buildMapStyle, EMPTY_TOWNS, FRAME_BOUNDS, PAN_BOUNDS } from './mapStyle'

maplibregl.addProtocol('pmtiles', new Protocol().tile)

// Display-only position: locations.json stores true coordinates, but
// island locations render shifted by the same offset as their island's
// land so pins stay glued to the inset landmass.
function displayLngLat(location) {
  const offset = REGION_DISPLAY_OFFSET[regionForArea(location.area)]
  return offset
    ? [location.lng + offset[0], location.lat + offset[1]]
    : [location.lng, location.lat]
}

function shiftIslandTowns(geojson) {
  const shiftCoords = (coords, [dLng, dLat]) =>
    typeof coords[0] === 'number'
      ? [coords[0] + dLng, coords[1] + dLat]
      : coords.map((c) => shiftCoords(c, [dLng, dLat]))

  return {
    ...geojson,
    features: geojson.features.map((feature) => {
      const offset = REGION_DISPLAY_OFFSET[feature.properties.region]
      if (!offset) return feature
      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: shiftCoords(feature.geometry.coordinates, offset),
        },
      }
    }),
  }
}

function LocationPopup({ location }) {
  return (
    <div className="location-popup">
      <h2>
        {location.name}
        {location.closed && <span className="closed-badge">Closed</span>}
      </h2>
      {location.area && <p className="popup-area">{location.area}</p>}
      {location.address && <p className="popup-address">{location.address}</p>}
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

export function MapView({ town = 'all' }) {
  const [selectedId, setSelectedId] = useState(null)
  const [towns, setTowns] = useState(EMPTY_TOWNS)

  useEffect(() => {
    let cancelled = false
    fetch(`${import.meta.env.BASE_URL}data/cape-towns.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((geojson) => {
        if (!cancelled) setTowns(shiftIslandTowns(geojson))
      })
      .catch((err) => console.warn('Town boundaries unavailable:', err.message))
    return () => {
      cancelled = true
    }
  }, [])

  const mapStyle = useMemo(() => buildMapStyle(towns), [towns])

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
        onError={(e) => {
          // Missing local tiles (dev without fetch-tiles) is expected;
          // the map still renders towns, waves, and pins.
          if (!String(e.error?.message ?? '').includes('cape.pmtiles')) console.error(e.error)
        }}
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
        {selected && (
          <Popup
            longitude={displayLngLat(selected)[0]}
            latitude={displayLngLat(selected)[1]}
            anchor="bottom"
            offset={36}
            closeOnClick={false}
            onClose={() => setSelectedId(null)}
          >
            <LocationPopup location={selected} />
          </Popup>
        )}
      </Map>
    </div>
  )
}
