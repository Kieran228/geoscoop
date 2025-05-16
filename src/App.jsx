// src/App.jsx
import Map from './sections/Map';

function App() {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-slate-800 text-white p-4">
        <h1 className="text-xl font-bold">Interactive World Map</h1>
      </header>
      
      {/* Make sure main takes up all remaining space */}
      <main className="flex-1 overflow-hidden">
        <Map />
      </main>
    </div>
  );
}

export default App