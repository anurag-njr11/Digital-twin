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
    <div className="min-h-screen bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-teal-700 focus:px-4 focus:py-2 focus:text-white"
      >
        {site.labels.skipToContent}
      </a>
      <Navbar />
      <main id="main" className="mx-auto max-w-4xl px-4">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Research />
        <Skills />
        <Contact />
      </main>
      <footer className="mx-auto max-w-4xl border-t border-zinc-200 px-4 py-8 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        {site.labels.footer}
      </footer>
      {site.twinEnabled && !twin.open && <TwinButton onClick={twin.show} />}
      {twin.open && (
        <Suspense fallback={null}>
          <TwinPanel onClose={twin.hide} />
        </Suspense>
      )}
    </div>
  )
}
