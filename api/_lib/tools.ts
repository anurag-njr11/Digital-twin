import type { Tool } from './provider'

export type Links = { email: string; github: string; linkedin: string; resume: string | null }

// R8.1: read-only, no input, and only ever return what links.json lists.
export function createTools(links: Links): Tool[] {
  return [
    {
      name: 'get_contact_links',
      description: "Returns Anurag's public contact links: email, GitHub and LinkedIn.",
      run: () => ({ email: links.email, github: links.github, linkedin: links.linkedin }),
    },
    {
      name: 'get_resume_link',
      description: "Returns the public URL of Anurag's resume PDF, if there is one.",
      run: () =>
        links.resume
          ? { resume: links.resume }
          : { resume: null, note: `No public resume link yet. Visitors can ask for it at ${links.email}.` },
    },
  ]
}
