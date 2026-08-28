import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'))
const Whitelist = lazy(() => import('./pages/Whitelist'))

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-[100svh] hero-backdrop" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/whitelist" element={<Whitelist />} />
      </Routes>
    </Suspense>
  )
}
