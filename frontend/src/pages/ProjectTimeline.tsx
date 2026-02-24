import { ProjectTimeline as TimelineComponent } from "@/components/ProjectTimeline";
import { ProjectHeader } from "@/components/ProjectHeader";
import { usePageTranslations } from '@/hooks/usePageTranslations';

const ProjectTimeline = () => {
  const { pt } = usePageTranslations();
  return (
    <div className="min-h-full bg-background">
      <ProjectHeader />
      <div className="p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">{pt("Project Timeline")}</h1>
          <p className="text-muted-foreground">{pt("Track project progress, milestones, and deliverables")}</p>
        </div>
        <TimelineComponent />
      </div>
    </div>
  );
};

export default ProjectTimeline;
