import Section from '../components/Section'
import ProjectCard from '../components/ProjectCard'
import projects from '../data/projects.json'
import site from '../data/site.json'

export default function Projects() {
  return (
    <Section id="projects" title={site.sections.projects.title}>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </Section>
  )
}
