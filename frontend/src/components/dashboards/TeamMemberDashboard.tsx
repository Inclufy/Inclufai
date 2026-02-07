import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, Calendar, TrendingUp } from "lucide-react";

interface Task {
  id: number;
  name: string;
  project_name: string;
  status: string;
  priority: string;
  due_date: string;
  assigned_to: string;
}

interface Project {
  id: number;
  name: string;
  status: string;
  progress: number;
  my_role: string;
}

const TeamMemberDashboard: React.FC = () => {
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem("user_name") || "Team Member";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      
      // Fetch projects where I'm a team member
      const projectsRes = await fetch('/api/v1/projects/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const projectsData = await projectsRes.json();
      setMyProjects(projectsData);

      // Mock tasks for now (would come from tasks API)
      const mockTasks: Task[] = projectsData.flatMap((project: Project) => [
        {
          id: 1,
          name: "Review design mockups",
          project_name: project.name,
          status: "in_progress",
          priority: "high",
          due_date: "2026-02-10",
          assigned_to: "me"
        },
        {
          id: 2,
          name: "Complete user testing",
          project_name: project.name,
          status: "todo",
          priority: "medium",
          due_date: "2026-02-15",
          assigned_to: "me"
        }
      ]).slice(0, 5);
      
      setMyTasks(mockTasks);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tasksInProgress = myTasks.filter(t => t.status === 'in_progress').length;
  const tasksTodo = myTasks.filter(t => t.status === 'todo').length;
  const tasksCompleted = myTasks.filter(t => t.status === 'completed').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {userName}!</h1>
        <p className="text-muted-foreground mt-1">Here's what you're working on</p>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">IN PROGRESS</p>
                <p className="text-3xl font-bold mt-2">{tasksInProgress}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">TO DO</p>
                <p className="text-3xl font-bold mt-2">{tasksTodo}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">COMPLETED</p>
                <p className="text-3xl font-bold mt-2">{tasksCompleted}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">MY PROJECTS</p>
                <p className="text-3xl font-bold mt-2">{myProjects.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Tasks */}
      <div>
        <h2 className="text-xl font-bold mb-4">My Tasks</h2>
        <div className="space-y-3">
          {myTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold">{task.name}</h3>
                      <Badge variant="outline" className="capitalize">
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Badge 
                        variant={task.priority === 'high' ? 'destructive' : 'outline'}
                        className="capitalize"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>📁 {task.project_name}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* My Projects */}
      <div>
        <h2 className="text-xl font-bold mb-4">My Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge variant="outline" className="capitalize">{project.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberDashboard;
