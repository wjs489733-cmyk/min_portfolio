import ProjectsArchiveScreen from '@/components/ProjectsArchiveScreen'

export default function Projects({ searchParams }: { searchParams?: { cat?: string } }) {
  return <ProjectsArchiveScreen category={searchParams?.cat} />
}
