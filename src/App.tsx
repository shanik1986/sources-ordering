import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LessonListPage from './components/lessons/LessonListPage'
import LessonEditor from './components/editor/LessonEditor'
import PrintPreview from './components/preview/PrintPreview'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LessonListPage />} />
        <Route path="/edit/:id" element={<LessonEditor />} />
        <Route path="/preview/:id" element={<PrintPreview />} />
      </Routes>
    </BrowserRouter>
  )
}
