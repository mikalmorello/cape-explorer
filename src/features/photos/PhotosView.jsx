import { useState } from 'react'
import data from '../../data/locations.json'
import covers from '../../data/photos.json'

function locationById(id) {
  return data.locations.find((loc) => loc.id === id)
}

function thumbUrl(url) {
  return `${url}=w400-h400-c`
}

function coverUrl(url) {
  return `${url}=w1200`
}

function LocationDetail({ location, cover, onClose }) {
  return (
    <div className="photo-detail">
      <button type="button" className="photo-detail-back" onClick={onClose}>
        &larr; All albums
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
        {location.photoAlbum && (
          <a
            className="popup-photos-link"
            href={location.photoAlbum}
            target="_blank"
            rel="noreferrer"
          >
            View album in Google Photos
          </a>
        )}
      </article>
      <a href={location.photoAlbum} target="_blank" rel="noreferrer">
        <img
          className="photo-detail-cover"
          src={coverUrl(cover)}
          alt={location.name}
        />
      </a>
    </div>
  )
}

export function PhotosView() {
  const [selectedId, setSelectedId] = useState(null)
  const entries = Object.entries(covers).filter(([id]) => locationById(id))

  if (entries.length === 0) {
    return (
      <div className="photos-empty">
        <p>
          No photo albums linked yet. Add a <code>photoAlbum</code> (Google
          Photos shared-album link) to a location in
          <code> locations.json</code> — covers are pulled in on the next
          deploy.
        </p>
      </div>
    )
  }

  if (selectedId) {
    return (
      <LocationDetail
        location={locationById(selectedId)}
        cover={covers[selectedId]}
        onClose={() => setSelectedId(null)}
      />
    )
  }

  return (
    <div className="photo-grid photo-grid-browse">
      {entries.map(([id, cover]) => (
        <button
          key={id}
          type="button"
          className="photo-tile"
          onClick={() => setSelectedId(id)}
        >
          <img src={thumbUrl(cover)} alt={locationById(id).name} loading="lazy" />
          <span className="photo-tile-label">{locationById(id).name}</span>
        </button>
      ))}
    </div>
  )
}
