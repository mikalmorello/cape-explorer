import data from '../../data/locations.json'
import covers from '../../data/photos.json'
import { sizedPhotoUrl } from '../../lib/googlePhotos'
import { REGION_ORDER, regionForArea } from '../../lib/capeRegions'

function thumbUrl(url) {
  return sizedPhotoUrl(url, 'w200-h200-c')
}

function groupByRegion(locations) {
  const groups = new Map()
  for (const location of locations) {
    const region = regionForArea(location.area)
    if (!groups.has(region)) groups.set(region, [])
    groups.get(region).push(location)
  }
  return REGION_ORDER.map((region) => [region, groups.get(region)]).filter(
    ([, locs]) => locs?.length,
  )
}

function LocationCard({ location }) {
  const cover = covers[location.id]
  return (
    <article className="location-card">
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
            <h2>
              {location.name}
              {location.closed && <span className="closed-badge">Closed</span>}
            </h2>
            {location.area && <span className="card-area">{location.area}</span>}
          </header>
          {location.address && <p className="card-address">{location.address}</p>}
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
}

export function LocationList({ town = 'all' }) {
  if (town !== 'all') {
    const locations = data.locations.filter((loc) => loc.area === town)
    return (
      <div className="location-list">
        <section className="region-group">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </section>
      </div>
    )
  }

  const regions = groupByRegion(data.locations)

  return (
    <div className="location-list">
      {regions.map(([region, locations]) => (
        <section key={region} className="region-group">
          <h2 className="region-heading">{region}</h2>
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </section>
      ))}
    </div>
  )
}
