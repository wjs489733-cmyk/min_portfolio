import { notFound } from 'next/navigation'
import ProjectWorkScreen from '@/components/ProjectWorkScreen'
import { archiveProjects, getArchiveProject } from '@/lib/archiveProjects'

export function generateStaticParams() {
  return archiveProjects.map((project) => ({ id: project.id }))
}

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const project = getArchiveProject(params.id)

  if (!project) notFound()

  return <ProjectWorkScreen project={project} />
}
