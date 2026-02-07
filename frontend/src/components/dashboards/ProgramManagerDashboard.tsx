import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, FolderKanban, TrendingUp, AlertTriangle, DollarSign, Users, Sparkles, Target } from "lucide-react";

interface Project {
  id: number;
  name: string;
  status: string;
  progress: number;
  budget: string;
  expenses_total: number;
  team_members_count: number;
  methodology: string;
  program?: number;
}

interface Program {
  id: number;
  name: string;
  status: string;
  description?: string;
}

const ProgramManagerDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      
      const projectsRes = await fetch('/api/v1/projects/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const projectsData = await projectsRes.json();
      setProjects(projectsData);

      const programsRes = await fetch('/api/v1/programs/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const programsData = await programsRes.json();
      setPrograms(programsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProjectsByProgram = (programId: number) => {
    return projects.filter(p => p.program === programId);
  };

  const getProgramHealth = (programId: number) => {
    const programProjects = getProjectsByProgram(programId);
    if (programProjects.length === 0) return 100;
    
    const avgProgress = programProjects.reduce((sum, p) => sum + p.progress, 0) / programProjects.length;
    return Math.round(avgProgress);
  };

  const getProgramBudget = (programId: number) => {
    const programProjects = getProjectsByProgram(programId);
    const total = programProjects.reduce((sum, p) => sum + parseFloat(p.budget || "0"), 0);
    const spent = programProjects.reduce((sum, p) => sum + (p.expenses_total || 0), 0);
    return { total, spent };
  };

  const activePrograms = programs.filter(p => p.status === 'active').length;
  const totalProjects = projects.length;
  const totalBudget = projects.reduce((sum, p) => sum + parseFloat(p.budget || "0"), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading program dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Program Manager Dashboard</h1>
        <p className="text-muted-foreground mt-1">Cross-program insights and resource management</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">MY PROGRAMS</p>
                <p className="text-3xl font-bold mt-2">{programs.length}</p>
                <p className="text-xs text-green-600 dark:text-green-500 mt-1">{activePrograms} Active</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">TOTAL PROJECTS</p>
                <p className="text-3xl font-bold mt-2">{totalProjects}</p>
                <p className="text-xs text-muted-foreground mt-1">Across Programs</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <FolderKanban className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">TOTAL BUDGET</p>
                <p className="text-3xl font-bold mt-2">€{(totalBudget / 1000).toFixed(1)}K</p>
                <p className="text-xs text-muted-foreground mt-1">All Programs</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">TEAM SIZE</p>
                <p className="text-3xl font-bold mt-2">
                  {projects.reduce((sum, p) => sum + p.team_members_count, 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Total Members</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Program Insights
            <Badge variant="outline" className="ml-auto">AI-Powered</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 rounded-lg border hover:bg-accent/50 transition-colors">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Strong Program Performance</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {activePrograms} active programs showing healthy progress - recommend stakeholder updates
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border hover:bg-accent/50 transition-colors">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium">Resource Distribution</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Team capacity spread across {programs.length} programs - consider consolidation opportunities
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Program Details */}
      <div>
        <h2 className="text-xl font-bold mb-4">Program Overview</h2>
        <div className="space-y-4">
          {programs.map((program) => {
            const programProjects = getProjectsByProgram(program.id);
            const health = getProgramHealth(program.id);
            const { total, spent } = getProgramBudget(program.id);

            return (
              <Card key={program.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl">{program.name}</CardTitle>
                        <Badge variant="outline" className="capitalize">{program.status}</Badge>
                      </div>
                      {program.description && (
                        <p className="text-sm text-muted-foreground mt-2">{program.description}</p>
                      )}
                    </div>
                    <div className={`text-2xl font-bold ${
                      health >= 80 ? 'text-green-600' :
                      health >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {health}
                      <span className="text-xs text-muted-foreground ml-1">Health</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Program Stats */}
                  <div className="grid grid-cols-3 gap-4 pb-4 border-b">
                    <div>
                      <p className="text-sm text-muted-foreground">Projects</p>
                      <p className="text-xl font-bold">{programProjects.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="text-xl font-bold">€{(total / 1000).toFixed(1)}K</p>
                      <p className="text-xs text-muted-foreground">€{(spent / 1000).toFixed(1)}K spent</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Team</p>
                      <p className="text-xl font-bold">
                        {programProjects.reduce((sum, p) => sum + p.team_members_count, 0)} members
                      </p>
                    </div>
                  </div>

                  {/* AI Program Summary */}
                  <div className="p-3 rounded-lg bg-accent/20 border">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">AI Program Summary</p>
                        <p className="text-sm text-muted-foreground">
                          Program contains {programProjects.length} projects with {health}% average health. 
                          {health >= 80 
                            ? " All projects on track - maintain current momentum."
                            : health >= 60
                            ? " Some projects need attention - schedule program review."
                            : " Multiple projects at risk - immediate program intervention required."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Projects in Program */}
                  {programProjects.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Projects in this Program:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {programProjects.map((project) => (
                          <div key={project.id} className="p-3 rounded-lg border bg-accent/10">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-sm">{project.name}</p>
                              <Badge variant="outline" className="text-xs capitalize">{project.status}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{project.progress}% complete</span>
                              <span>{project.team_members_count} members</span>
                              <span className="capitalize">{project.methodology}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Standalone Projects */}
      {projects.filter(p => !p.program).length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Standalone Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.filter(p => !p.program).map((project) => (
              <Card key={project.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold">{project.name}</h3>
                    <Badge variant="outline" className="capitalize">{project.status}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{project.progress}% complete</span>
                    <span>{project.team_members_count} members</span>
                    <span className="capitalize">{project.methodology}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramManagerDashboard;
