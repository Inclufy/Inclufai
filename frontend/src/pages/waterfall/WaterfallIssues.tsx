import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ProjectHeader } from '@/components/ProjectHeader';
import { useProject } from '@/hooks/useApi';
import { MethodologyHelpPanel } from '@/components/MethodologyHelpPanel';
import { issueApi } from '@/lib/waterfallApi';
import { 
  AlertCircle, Plus, Edit2, Trash2, Clock, 
  CheckCircle2, XCircle, Loader2
} from 'lucide-react';

interface Issue {
  id: number;
  title: string;
  description: string;
  category: 'technical' | 'business' | 'resource' | 'process';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignee: string;
  reporter: string;
  date_reported: string;
  date_resolved?: string;
  resolution?: string;
}

const WaterfallIssues = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project } = useProject(id);
  
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'technical' as const,
    priority: 'medium' as const,
    status: 'open' as const,
    assignee: '',
    reporter: '',
    date_reported: new Date().toISOString().split('T')[0],
    resolution: '',
  });

  useEffect(() => {
    if (id) {
      loadIssues();
    }
  }, [id]);

  const loadIssues = async () => {
    try {
      setLoading(true);
      const response = await issueApi.getAll(id!);
      setIssues(response.data);
    } catch (err) {
      console.error('Failed to load issues', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingIssue) {
        await issueApi.update(id!, editingIssue.id, form);
      } else {
        await issueApi.create(id!, { ...form, project: id });
      }
      setShowDialog(false);
      setEditingIssue(null);
      resetForm();
      loadIssues();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save issue');
    }
  };

  const handleDelete = async (issueId: number) => {
    if (!confirm('Delete this issue?')) return;
    try {
      await issueApi.delete(id!, issueId);
      loadIssues();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete issue');
    }
  };

  const openEdit = (issue: Issue) => {
    setEditingIssue(issue);
    setForm({
      title: issue.title,
      description: issue.description,
      category: issue.category,
      priority: issue.priority,
      status: issue.status,
      assignee: issue.assignee,
      reporter: issue.reporter,
      date_reported: issue.date_reported,
      resolution: issue.resolution || '',
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      category: 'technical',
      priority: 'medium',
      status: 'open',
      assignee: '',
      reporter: '',
      date_reported: new Date().toISOString().split('T')[0],
      resolution: '',
    });
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-blue-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      critical: 'bg-red-500'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return AlertCircle;
      case 'in-progress': return Loader2;
      case 'resolved': return CheckCircle2;
      case 'closed': return XCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-red-500',
      'in-progress': 'bg-blue-500',
      resolved: 'bg-green-500',
      closed: 'bg-gray-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-full bg-background">
        <ProjectHeader />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </div>
      </div>
    );
  }

  const openIssues = issues.filter(i => i.status === 'open' || i.status === 'in-progress');
  const criticalIssues = issues.filter(i => i.priority === 'critical');

  return (
    <div className="min-h-full bg-background">
      <ProjectHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-red-600" />
              Issue Log
            </h1>
            <p className="text-muted-foreground">Track and resolve project issues</p>
          </div>
          <Button onClick={() => { resetForm(); setShowDialog(true); }} className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Log Issue
          </Button>
        </div>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-4">
            <div className="flex gap-4">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900">Issue Management</h3>
                <p className="text-sm text-red-800 mt-1">
                  Issues are problems that have already occurred and need resolution. 
                  Unlike risks (which are potential future problems), issues require immediate action.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Total Issues</p>
              <p className="text-2xl font-bold">{issues.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Open</p>
              <p className="text-2xl font-bold text-red-600">{openIssues.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold text-red-600">{criticalIssues.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold text-green-600">
                {issues.filter(i => i.status === 'resolved').length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Issues</CardTitle>
          </CardHeader>
          <CardContent>
            {issues.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No issues logged. Click "Log Issue" to create one.</p>
            ) : (
              <div className="space-y-3">
                {issues.map((issue) => {
                  const StatusIcon = getStatusIcon(issue.status);

                  return (
                    <div key={issue.id} className="p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <StatusIcon className="h-4 w-4" />
                            <h3 className="font-semibold">{issue.title}</h3>
                            <Badge className={getPriorityColor(issue.priority)}>
                              {issue.priority}
                            </Badge>
                            <Badge className={getStatusColor(issue.status)}>
                              {issue.status}
                            </Badge>
                            <Badge variant="outline" className="capitalize">{issue.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Assignee: </span>
                              <span className="font-medium">{issue.assignee}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Reporter: </span>
                              <span className="font-medium">{issue.reporter}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Reported: </span>
                              <span>{issue.date_reported}</span>
                            </div>
                            {issue.date_resolved && (
                              <div>
                                <span className="text-muted-foreground">Resolved: </span>
                                <span>{issue.date_resolved}</span>
                              </div>
                            )}
                          </div>
                          {issue.resolution && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                              <p className="text-sm font-medium text-green-900 mb-1">Resolution:</p>
                              <p className="text-sm text-green-800">{issue.resolution}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(issue)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(issue.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingIssue ? 'Edit Issue' : 'Log New Issue'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Issue title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
            <Textarea placeholder="Detailed description" rows={3} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <select className="w-full border rounded-md p-2" value={form.category} onChange={(e) => setForm({...form, category: e.target.value as any})}>
                  <option value="technical">Technical</option>
                  <option value="business">Business</option>
                  <option value="resource">Resource</option>
                  <option value="process">Process</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Priority</label>
                <select className="w-full border rounded-md p-2" value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value as any})}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Assignee" value={form.assignee} onChange={(e) => setForm({...form, assignee: e.target.value})} />
              <Input placeholder="Reporter" value={form.reporter} onChange={(e) => setForm({...form, reporter: e.target.value})} />
            </div>
            {(form.status === 'resolved' || form.status === 'closed') && (
              <Textarea placeholder="Resolution details" rows={3} value={form.resolution} onChange={(e) => setForm({...form, resolution: e.target.value})} />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.title || !form.assignee} className="bg-red-600 hover:bg-red-700">Log Issue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MethodologyHelpPanel methodology="waterfall" />
    </div>
  );
};

export default WaterfallIssues;
