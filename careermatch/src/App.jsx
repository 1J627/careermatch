import { Routes, Route } from 'react-router-dom'
import LandingPage from './CareerMatchLanding'
import PortfolioInput from './PortfolioInput'
import MatchResult from './MatchResult'
import ProgramLibrary from './ProgramLibrary'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/portfolio" element={<PortfolioInput />} />
      <Route path="/programs" element={<ProgramLibrary />} />
      <Route path="/result" element={<MatchResult />} />
    </Routes>
  )
}

export default App
