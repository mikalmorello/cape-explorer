import data from '../../data/locations.json'

export function LocationList() {
  return (
    <div className="location-list">
      {data.locations.map((location) => (
        <article key={location.id} className="location-card">
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
      ))}
    </div>
  )
}
