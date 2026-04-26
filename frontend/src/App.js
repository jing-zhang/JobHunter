import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/app/Layout'
import Dashboard from '@/pages/Dashboard'
import Applications from '@/pages/Applications'
import Interviews from '@/pages/Interviews'
import Offers from '@/pages/Offers'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="interviews" element={<Interviews />} />
          <Route path="offers" element={<Offers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App
