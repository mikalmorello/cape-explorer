import data from '../../data/locations.json'
import covers from '../../data/photos.json'
import { sizedPhotoUrl } from '../../lib/googlePhotos'

function locationById(id) {
  return data.locations.find((loc) => loc.id === id)
}

function thumbUrl(url) {
  return sizedPhotoUrl(url, 'w200-h200-c')
}

function ItineraryStop({ stop }) {
  const location = locationById(stop.locationId)
  if (!location) return null
  const cover = covers[location.id]

  return (
    <li className="itinerary-stop">
      {cover && (
        <img
          className="card-thumb"
          src={thumbUrl(cover)}
          alt={location.name}
          loading="lazy"
        />
      )}
      <div className="itinerary-stop-body">
        <header>
          <h3>{location.name}</h3>
          {stop.note && <span className="itinerary-stop-note">{stop.note}</span>}
        </header>
        {location.area && <span className="card-area">{location.area}</span>}
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
      </div>
    </li>
  )
}

export function ItinerariesView() {
  const itineraries = data.itineraries ?? []

  if (itineraries.length === 0) {
    return (
      <div className="photos-empty">
        <p>
          No itineraries yet. Add one to the <code>itineraries</code> array in
          <code> locations.json</code> — a hand-picked sequence of stops from
          an actual plan, not a suggestion.
        </p>
      </div>
    )
  }

  return (
    <div className="itinerary-list">
      {itineraries.map((itinerary) => (
        <article key={itinerary.id} className="itinerary-card">
          <h2>{itinerary.name}</h2>
          {itinerary.notes && <p className="card-notes">{itinerary.notes}</p>}
          <ol className="itinerary-stops">
            {itinerary.stops.map((stop) => (
              <ItineraryStop key={stop.locationId} stop={stop} />
            ))}
          </ol>
        </article>
      ))}
    </div>
  )
}
