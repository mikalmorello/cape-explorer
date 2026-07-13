import { useState } from 'react'
import { MapView } from './features/map/MapView'
import { LocationList } from './features/locations/LocationList'
import { PhotosView } from './features/photos/PhotosView'
import data from './data/locations.json'
import { distinctAreas } from './lib/capeRegions'
import './App.css'

const TOWN_OPTIONS = distinctAreas(data.locations)

function App() {
  const [view, setView] = useState('map')
  const [town, setTown] = useState('all')

  return (
    <div className="app">
      <header className="app-header">
        <h1>Cape Explorer</h1>
        <nav className="view-toggle">
          <button
            type="button"
            className={view === 'map' ? 'active' : ''}
            onClick={() => setView('map')}
          >
            Map
          </button>
          <button
            type="button"
            className={view === 'list' ? 'active' : ''}
            onClick={() => setView('list')}
          >
            List
          </button>
          <button
            type="button"
            className={view === 'photos' ? 'active' : ''}
            onClick={() => setView('photos')}
          >
            Photos
          </button>
        </nav>
        <label className="town-filter">
          Town
          <select value={town} onChange={(e) => setTown(e.target.value)}>
            <option value="all">All towns</option>
            {TOWN_OPTIONS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </label>
      </header>
      <main className="app-main">
        {view === 'map' && <MapView town={town} />}
        {view === 'list' && <LocationList town={town} />}
        {view === 'photos' && <PhotosView />}
      </main>
    </div>
  )
}

export default App
