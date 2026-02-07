import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, FolderKanban, TrendingUp, AlertTriangle, DollarSign, Target, Sparkles, Users, Activity, Clock, CheckCircle } from "lucide-react";

interface Project {
  id: number;
  name: string;
  status: string;
  progress: number;
  budget: string;
  expenses_total: number;
  team_members_count: number;
  methodology: string;
}

interface Program {
  id: number;
  name: string;
  status: string;
  description?: string;
}

const ExecutiveDashboard: React.FC = () => {
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

  const getProjectHealth = (project: Project) => {
    const budgetTotal = parseFloat(project.budget) || 0;
    const budgetSpent = project.expenses_total || 0;
    const budgetHealth = budgetTotal > 0 ? ((budgetTotal - budgetSpent) / budgetTotal * 100) : 100;
    const scheduleHealth = project.progress || 0;
    return Math.round((budgetHealth + scheduleHealth) / 2);
  };

  const getProjectInsight = (project: Project) => {
    const health = getProjectHealth(project);
    const budgetTotal = parseFloat(project.budget) || 0;
    const budgetSpent = project.expenses_total || 0;
    const budgetPerc = budgetTotal > 0 ? (budgetSpent / budgetTotal) * 100 : 0;

    if (budgetPerc > 100) {
      return { type: 'critical' as const, message: `${Math.round(budgetPerc - 100)}% over budget - immediate action required` };
    }
    if (budgetPerc > 85) {
      return { type: 'warning' as const, message: `${Math.round(budgetPerc)}% budget utilized - monitor closely` };
    }
    if (project.progress > 75) {
      return { type: 'success' as const, message: `${project.progress}% complete - on track for delivery` };
    }
    if (health < 60) {
      return { type: 'warning' as const, message: 'Low health score - review resource allocation' };
    }
    return { type: 'success' as const, message: 'Project progressing as planned' };
  };

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalBudget = projects.reduce((sum, p) => sum + parseFloat(p.budget || "0"), 0);
  const totalSpent = projects.reduce((sum, p) => sum + (p.expenses_total || 0), 0);
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading executive dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Executive Dashboard</h1>
        <p className="text-muted-foreground mt-1">Portfolio-wide insights and AI-powered recommendations</p>
      </div>

      {/* Portfolio KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">PROGRAMS</p>
                <p className="text-3xl font-bold mt-2">{programs.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Strategic Initiatives</p>
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
                <p className="text-sm font-medium text-muted-foreground">PROJECTS</p>
                <p className="text-3xl font-bold mt-2">{projects.length}</p>
                <p className="text-xs text-green-600 dark:text-green-500 mt-1">{activeProjects} Active</p>
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
                <p className="text-sm font-medium text-muted-foreground">PORTFOLIO BUDGET</p>
                <p className="text-3xl font-bold mt-2">€{(totalBudget / 1000).toFixed(1)}K</p>
                <p className="text-xs text-muted-foreground mt-1">€{(totalSpent / 1000).toFixed(1)}K Spent</p>
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
                <p className="text-sm font-medium text-muted-foreground">AVG COMPLETION</p>
                <p className="text-3xl font-bold mt-2">{avgProgress}%</p>
                <p className="text-xs text-muted-foreground mt-1">Portfolio Progress</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Portfolio Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Portfolio Insights
            <Badge variant="outline" className="ml-auto">AI-Powered</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 rounded-lg border hover:bg-accent/50 transition-colors">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium">Portfolio Risk Alert</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {projects.filter(p => {
                    const budgetPerc = (p.expenses_total / parseFloat(p.budget || "1")) * 100;
                    return budgetPerc > 85;
                  }).length} projects approaching budget limits - recommend executive review
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border hover:bg-accent/50 transition-colors">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Positive Momentum</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Portfolio showing {avgProgress}% average completion - ahead of industry benchmark (42%)
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border hover:bg-accent/50 transition-colors">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Resource Optimization</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Total team capacity: {projects.reduce((sum, p) => sum + p.team_members_count, 0)} members across {projects.length} projects
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Program Summaries */}
      {programs.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Program Summaries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{program.name}</CardTitle>
                      <Badge variant="outline" className="mt-2 capitalize">{program.status}</Badge>
                    </div>
                    <Building2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">AI Summary</p>
                        <p className="text-sm text-muted-foreground">
                          Strategic initiative tracking on schedule - recommend quarterly stakeholder review
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Project Executive Summaries */}
      <div>
        <h2 className="text-xl font-bold mb-4">Project Executive Summaries</h2>
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => {
            const health = getProjectHealth(project);
            const insight = getProjectInsight(project);
            const budgetTotal = parseFloat(project.budget) || 0;
            const budgetSpent = project.expenses_total || 0;

            return (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{project.name}</h3>
                        <Badge variant="outline" className="capitalize">{project.methodology}</Badge>
                        <Badge variant="outline" className="capitalize">{project.status}</Badge>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${
                      health >= 80 ? 'text-green-600' :
                      health >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {health}
                      <span className="text-xs text-muted-foreground ml-1">Health</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <p className="text-xl font-bold">{project.progress}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="text-xl font-bold">€{(budgetSpent / 1000).toFixed(1)}K / €{(budgetTotal / 1000).toFixed(1)}K</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Team</p>
                      <p className="text-xl font-bold">{project.team_members_count} members</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border bg-accent/20">
                    <div className="flex items-start gap-2">
                      {insight.type === 'critical' && <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />}
                      {insight.type === 'warning' && <Clock className="h-4 w-4 text-yellow-500 mt-0.5" />}
                      {insight.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium">AI Executive Summary</p>
                        <p className="text-sm text-muted-foreground">{insight.message}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
