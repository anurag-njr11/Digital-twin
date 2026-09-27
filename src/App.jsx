import { Suspense, lazy } from 'react'
import Background from './components/Background'
import Highlights from './components/Highlights'
import Navbar from './components/Navbar'
import ScrollProgress from './components/ScrollProgress'
import TwinCta from './components/TwinCta'
import TwinButton from './components/TwinButton'
import useSpotlight from './hooks/useSpotlight'
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
  useSpotlight()

  return (
    <div className="min-h-screen font-sans antialiased text-zinc-100">
      <Background />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-blue-700 focus:px-4 focus:py-2 focus:text-white"
      >
        {site.labels.skipToContent}
      </a>
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Hero />
        <Highlights />
        <About />
        <Experience />
        <Projects />
        <Research />
        <Skills />
        {site.twinEnabled && <TwinCta onAsk={twin.ask} />}
        <Contact />
      </main>
      <footer className="mx-auto max-w-7xl border-t px-4 py-10 font-mono text-xs leading-relaxed sm:px-6 border-white/10 text-zinc-500">
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
