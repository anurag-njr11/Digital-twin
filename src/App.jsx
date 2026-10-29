import { Suspense, lazy } from 'react'
import Navbar from './components/Navbar'
import TwinButton from './components/TwinButton'
import useTwinPanel from './hooks/useTwinPanel'
import Hero from './sections/Hero'
import About from './sections/About'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Research from './sections/Research'
import Skills from './sections/Skills'
import Contact from './sections/Contact'
import site from './data/site.json'

const TwinPanel = lazy(() => import('./components/TwinPanel'))

export default function App() {
  const twin = useTwinPanel()

  return (
    <div className="min-h-screen font-sans antialiased text-stone-100">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-accent focus:text-on-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        {site.labels.skipToContent}
      </a>
      <Navbar />
      <main id="main">
        <Hero onAsk={twin.ask} />
        <About />
        <Experience />
        <Projects />
        <Research />
        <Skills />
        <Contact />
      </main>
      <footer className="mx-auto max-w-6xl border-t px-4 py-10 text-xs leading-relaxed sm:px-6 border-white/10 text-stone-500">
        <p>{site.labels.footer}</p>
        {site.twinEnabled && <p className="mt-2">{site.labels.privacy}</p>}
      </footer>
      {site.twinEnabled && !twin.open && <TwinButton onClick={twin.show} />}
      {twin.open && (
        <Suspense fallback={null}>
          <TwinPanel onClose={twin.hide} initialQuestion={twin.question} />
        </Suspense>
      )}
    </div>
  )
}
