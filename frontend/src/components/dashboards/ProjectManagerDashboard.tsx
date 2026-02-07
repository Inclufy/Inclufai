import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, DollarSign, Users, TrendingUp, Target, Activity } from "lucide-react";

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

interface AIInsight {
  type: "critical" | "warning" | "success";
  message: string;
  action?: string;
}

const ProjectManagerDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const aiInsights: AIInsight[] = [
    {
      type: "critical",
      message: "Mobile App Development: 15% over budget",
      action: "Review sprint scope and reduce features"
    },
    {
      type: "warning", 
      message: "Backend API integration delayed - waiting on 3rd party",
      action: "Schedule vendor call to negotiate timeline"
    },
    {
      type: "success",
      message: "Team velocity +12% vs last sprint",
      action: "Consider increasing sprint capacity"
    }
  ];

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/api/v1/projects/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthScore = (project: Project) => {
    const budgetTotal = parseFloat(project.budget) || 0;
    const budgetSpent = project.expenses_total || 0;
    const budgetHealth = budgetTotal > 0 ? ((budgetTotal - budgetSpent) / budgetTotal * 100) : 100;
    const scheduleHealth = project.progress || 0;
    return Math.round((budgetHealth + scheduleHealth) / 2);
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-500";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-500";
    return "text-red-600 dark:text-red-500";
  };

  const totalBudget = projects.reduce((sum, p) => sum + parseFloat(p.budget || "0"), 0);
  const totalSpent = projects.reduce((sum, p) => sum + (p.expenses_total || 0), 0);
  const activeProjects = projects.filter(p => p.status === "active").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section - Consistent with Executive Dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Manager Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your project portfolio overview</p>
        </div>
      </div>

      {/* Stats Cards - Same style as Executive Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">TOTAL PROJECTS</p>
                <p className="text-3xl font-bold mt-2">{projects.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ACTIVE</p>
                <p className="text-3xl font-bold mt-2">{activeProjects}</p>
                <p className="text-xs text-green-600 dark:text-green-500 mt-1">In Progress</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
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
                <p className="text-xs text-muted-foreground mt-1">Allocated</p>
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
                <p className="text-sm font-medium text-muted-foreground">AVG HEALTH</p>
                <p className="text-3xl font-bold mt-2">
                  {Math.round(projects.reduce((sum, p) => sum + getHealthScore(p), 0) / projects.length || 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Portfolio Score</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            AI Insights
            <Badge variant="outline" className="ml-auto">AI-Powered</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiInsights.map((insight, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              {insight.type === "critical" && (
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              )}
              {insight.type === "warning" && (
                <Clock className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              )}
              {insight.type === "success" && (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="font-medium">{insight.message}</p>
                {insight.action && (
                  <p className="text-sm text-muted-foreground mt-1">💡 {insight.action}</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Project Cards - Simple Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4">Active Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => {
            const healthScore = getHealthScore(project);
            const budgetTotal = parseFloat(project.budget) || 0;
            const budgetSpent = project.expenses_total || 0;
            const budgetPercentage = budgetTotal > 0 ? (budgetSpent / budgetTotal) * 100 : 0;

            return (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="capitalize">
                          {project.methodology}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getHealthColor(healthScore)}`}>
                        {healthScore}
                      </div>
                      <div className="text-xs text-muted-foreground">Health</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Budget
                      </span>
                      <span className={`font-medium ${budgetPercentage > 100 ? 'text-red-600' : ''}`}>
                        €{budgetSpent.toLocaleString()} / €{budgetTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          budgetPercentage > 100 ? 'bg-red-600' :
                          budgetPercentage > 80 ? 'bg-yellow-600' : 'bg-green-600'
                        }`}
                        style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Team */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                    <Users className="h-4 w-4" />
                    <span>{project.team_members_count} team members</span>
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

export default ProjectManagerDashboard;
