import PlasmaCanvas from './components/PlasmaCanvas'
import SpawnCanvas from './components/SpawnCanvas'

function App() {
  return (
    <div>
      <h2>Fluid shapes demo</h2>
      <PlasmaCanvas shapeColor={'#c4b1ff'} bgColor={'#42467b'} />
      <SpawnCanvas shapeColor={'#e0d610'} bgColor={'#1e5206'} />
    </div>
  )
}

export default App
