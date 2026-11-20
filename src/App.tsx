// Перемикайте потрібний компонент під час уроку (як у form-contact/src/App.tsx):
// import { NetworkPitfallsDemo } from "./components/NetworkPitfallsDemo"
import { ShopFetchLive } from "./components/ShopFetchLive"
// import { ShopAxiosLive } from "./components/ShopAxiosLive"
// import { ShopPractice } from "./components/ShopPractice"

export function App() {
  return (
    <div className="app-layout">
      {/* <NetworkPitfallsDemo /> */}
      <ShopFetchLive />
      {/* <ShopAxiosLive /> */}
      {/* <ShopPractice /> */}
    </div>
  )
}

export default App
