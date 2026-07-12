import { MapView } from './features/map/MapView'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Cape Explorer</h1>
      </header>
      <main className="app-main">
        <MapView />
      </main>
    </div>
  )
}

export default App
