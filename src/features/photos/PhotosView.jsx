import { useState } from 'react'
import data from '../../data/locations.json'
import photos from '../../data/photos.json'

function locationById(id) {
  return data.locations.find((loc) => loc.id === id)
}

function thumbUrl(url) {
  return `${url}=w400-h400-c`
}

function largeUrl(url) {
  return `${url}=w1600`
}

function LocationDetail({ location, urls, onClose }) {
  return (
    <div className="photo-detail">
      <button type="button" className="photo-detail-back" onClick={onClose}>
        &larr; All photos
      </button>
      <article className="location-card">
        <header>
          <h2>{location.name}</h2>
          {location.area && <span className="card-area">{location.area}</span>}
        </header>
        {location.activities?.length > 0 && (
          <ul className="card-activities">
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
        {location.notes && <p className="card-notes">{location.notes}</p>}
        {location.website && (
          <a href={location.website} target="_blank" rel="noreferrer">
            Website
          </a>
        )}
      </article>
      <div className="photo-grid">
        {urls.map((url) => (
          <a key={url} href={largeUrl(url)} target="_blank" rel="noreferrer">
            <img src={thumbUrl(url)} alt={location.name} loading="lazy" />
          </a>
        ))}
      </div>
    </div>
  )
}

export function PhotosView() {
  const [selectedId, setSelectedId] = useState(null)
  const entries = Object.entries(photos).filter(([id]) => locationById(id))

  if (entries.length === 0) {
    return (
      <div className="photos-empty">
        <p>
          No photo albums linked yet. Add a <code>photoAlbum</code> (Google
          Photos shared-album link) to a location in
          <code> locations.json</code> — photos are pulled in on the next
          deploy.
        </p>
      </div>
    )
  }

  if (selectedId) {
    return (
      <LocationDetail
        location={locationById(selectedId)}
        urls={photos[selectedId]}
        onClose={() => setSelectedId(null)}
      />
    )
  }

  return (
    <div className="photo-grid photo-grid-browse">
      {entries.map(([id, urls]) => (
        <button
          key={id}
          type="button"
          className="photo-tile"
          onClick={() => setSelectedId(id)}
        >
          <img src={thumbUrl(urls[0])} alt={locationById(id).name} loading="lazy" />
          <span className="photo-tile-label">{locationById(id).name}</span>
        </button>
      ))}
    </div>
  )
}
