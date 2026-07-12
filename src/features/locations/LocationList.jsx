import data from '../../data/locations.json'
import covers from '../../data/photos.json'

function thumbUrl(url) {
  return `${url}=w200-h200-c`
}

export function LocationList() {
  return (
    <div className="location-list">
      {data.locations.map((location) => {
        const cover = covers[location.id]
        return (
          <article key={location.id} className="location-card">
            <div className="card-row">
              {cover && (
                <img
                  className="card-thumb"
                  src={thumbUrl(cover)}
                  alt={location.name}
                  loading="lazy"
                />
              )}
              <div className="card-body">
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
                    Photos
                  </a>
                )}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
