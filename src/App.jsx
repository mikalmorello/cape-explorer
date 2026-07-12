import { useState } from 'react'
import { MapView } from './features/map/MapView'
import { LocationList } from './features/locations/LocationList'
import './App.css'

function App() {
  const [view, setView] = useState('map')

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
        </nav>
      </header>
      <main className="app-main">
        {view === 'map' ? <MapView /> : <LocationList />}
      </main>
    </div>
  )
}

export default App
