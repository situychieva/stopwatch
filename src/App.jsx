import { useState } from 'react'
import './App.css'
import Stopwatch from './components/Stopwatch'

function App() {
  const [stopwatches, setStopwatches] = useState([])
  const [nextId, setNextId] = useState(1)

  const addStopwatch = () => {
    setStopwatches(prev => [
      ...prev,
      {
        id: nextId,
        time: 0,
        isRunning: false,
        isPaused: false
      }
    ])
    setNextId(prev => prev + 1)
  }

  const deleteStopwatch = (id) => {
    setStopwatches(prev => prev.filter(sw => sw.id !== id))
  }

  const updateStopwatch = (id, updater) => {
    setStopwatches(prevStopwatches =>
      prevStopwatches.map(sw =>
        sw.id === id ? updater(sw) : sw
      )
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>⏱ STOPWATCH ⏱</h1>
      </div>

      <button className="add-button" onClick={addStopwatch}>
        + NEW TIMER +
      </button>

      <div className="stopwatch-list">
        {stopwatches.length === 0 ? (
          <div className="empty-state">PRESS START TO ADD STOPWATCH...</div>
        ) : (
          stopwatches.map(stopwatch => (
            <Stopwatch
              key={stopwatch.id}
              stopwatch={stopwatch}
              onDelete={deleteStopwatch}
              onUpdate={updateStopwatch}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default App