import { useState } from 'react'
import './App.css'

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

  const updateStopwatch = (id, updatesOrUpdater) => {
    setStopwatches(prevStopwatches =>
      prevStopwatches.map(sw =>
        sw.id === id
          ? (typeof updatesOrUpdater === 'function'
              ? updatesOrUpdater(sw)
              : { ...sw, ...updatesOrUpdater }
            )
          : sw
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

function Stopwatch({ stopwatch, onDelete, onUpdate }) {
  const [intervalId, setIntervalId] = useState(null)

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleStart = () => {
    if (stopwatch.isRunning || intervalId) return

    onUpdate(stopwatch.id, (sw) => ({
      ...sw,
      isRunning: true,
      isPaused: false
    }))

    const id = setInterval(() => {
      onUpdate(stopwatch.id, (sw) => ({
        ...sw,
        time: sw.time + 1
      }))
    }, 1000)

    setIntervalId(id)
  }

  const handlePause = () => {
    if (!intervalId) return

    clearInterval(intervalId)
    setIntervalId(null)

    onUpdate(stopwatch.id, (sw) => ({
      ...sw,
      isRunning: false,
      isPaused: true
    }))
  }

  const handleResume = () => {
    if (stopwatch.isRunning || intervalId) return

    onUpdate(stopwatch.id, (sw) => ({
      ...sw,
      isRunning: true,
      isPaused: false
    }))

    const id = setInterval(() => {
      onUpdate(stopwatch.id, (sw) => ({
        ...sw,
        time: sw.time + 1
      }))
    }, 1000)

    setIntervalId(id)
  }

  const handleClear = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }

    onUpdate(stopwatch.id, (sw) => ({
      ...sw,
      time: 0,
      isRunning: false,
      isPaused: false
    }))
  }

  const handleDelete = () => {
    if (intervalId) {
      clearInterval(intervalId)
    }
    onDelete(stopwatch.id)
  }

  return (
    <div className="stopwatch">
      <div className="stopwatch-header">
        <div className="stopwatch-title">TIMER #{stopwatch.id}</div>
        <button className="delete-button" onClick={handleDelete}>
          DELETE
        </button>
      </div>
      
      <div className="display">
        <div className="time">{formatTime(stopwatch.time)}</div>
      </div>
      
      <div className="controls">
        {!stopwatch.isRunning && !stopwatch.isPaused && (
          <button className="control-button start-button" onClick={handleStart}>
            START
          </button>
        )}
        
        {stopwatch.isRunning && (
          <button className="control-button pause-button" onClick={handlePause}>
            PAUSE
          </button>
        )}
        
        {stopwatch.isPaused && (
          <button className="control-button resume-button" onClick={handleResume}>
            RESUME
          </button>
        )}
        
        {(stopwatch.isRunning || stopwatch.isPaused) && (
          <button className="control-button clear-button" onClick={handleClear}>
            CLEAR
          </button>
        )}
      </div>
    </div>
  )
}

export default App