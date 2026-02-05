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
import { workPoliciesApi } from '@/lib/kanbanApi';
import { 
  FileText, Plus, Trash2, Edit2, Loader2, 
  AlertCircle, CheckCircle2, Shield
} from 'lucide-react';

interface WorkPolicy {
  id: number;
  title: string;
  description: string;
  category: 'workflow' | 'quality' | 'team' | 'process';
  is_active: boolean;
  order: number;
}

const KanbanWorkPolicies = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project } = useProject(id);
  
  const [policies, setPolicies] = useState<WorkPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<WorkPolicy | null>(null);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'workflow' as const,
    is_active: true,
  });

  useEffect(() => {
    if (id) {
      loadPolicies();
    }
  }, [id]);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const response = await workPoliciesApi.getAll(id!);
      setPolicies(response.data);
    } catch (err) {
      console.error('Failed to load policies', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingPolicy) {
        await workPoliciesApi.update(id!, editingPolicy.id, form);
      } else {
        await workPoliciesApi.create(id!, form);
      }
      setShowDialog(false);
      setEditingPolicy(null);
      setForm({ title: '', description: '', category: 'workflow', is_active: true });
      loadPolicies();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save policy');
    }
  };

  const handleDelete = async (policyId: number) => {
    if (!confirm('Delete this policy?')) return;
    try {
      await workPoliciesApi.delete(id!, policyId);
      loadPolicies();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete policy');
    }
  };

  const openEdit = (policy: WorkPolicy) => {
    setEditingPolicy(policy);
    setForm({
      title: policy.title,
      description: policy.description,
      category: policy.category,
      is_active: policy.is_active,
    });
    setShowDialog(true);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      workflow: 'bg-blue-500',
      quality: 'bg-green-500',
      team: 'bg-purple-500',
      process: 'bg-orange-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-full bg-background">
        <ProjectHeader />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
        </div>
      </div>
    );
  }

  const activePolicies = policies.filter(p => p.is_active);
  const inactivePolicies = policies.filter(p => !p.is_active);
  const categories = [...new Set(policies.map(p => p.category))];

  return (
    <div className="min-h-full bg-background">
      <ProjectHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-cyan-600" />
              Explicit Work Policies
            </h1>
            <p className="text-muted-foreground">Define how work flows through the system</p>
          </div>
          <Button onClick={() => { 
            setEditingPolicy(null); 
            setForm({ title: '', description: '', category: 'workflow', is_active: true }); 
            setShowDialog(true); 
          }} className="bg-cyan-600 hover:bg-cyan-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Policy
          </Button>
        </div>

        <Card className="bg-cyan-50 border-cyan-200">
          <CardContent className="pt-4">
            <div className="flex gap-4">
              <Shield className="h-6 w-6 text-cyan-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-cyan-900">Why Explicit Policies?</h3>
                <p className="text-sm text-cyan-800 mt-1">
                  Kanban requires explicit policies to make the workflow transparent and consistent.
                  Clear policies help the team make decisions, manage flow, and continuously improve.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Total Policies</p>
              <p className="text-2xl font-bold">{policies.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600">{activePolicies.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold">{categories.length}</p>
            </CardContent>
          </Card>
        </div>

        {categories.map(category => {
          const categoryPolicies = activePolicies.filter(p => p.category === category);
          if (categoryPolicies.length === 0) return null;
          
          return (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 capitalize">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  {category} Policies ({categoryPolicies.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryPolicies.map((policy) => (
                    <div key={policy.id} className="p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{policy.title}</h3>
                            <Badge className={getCategoryColor(policy.category)}>{policy.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{policy.description}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(policy)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(policy.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {inactivePolicies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-gray-500" />
                Inactive Policies ({inactivePolicies.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {inactivePolicies.map((policy) => (
                  <div key={policy.id} className="flex items-center gap-4 p-3 border rounded-lg opacity-50">
                    <span className="flex-1 text-muted-foreground">{policy.title}</span>
                    <Badge variant="outline">{policy.category}</Badge>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(policy)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPolicy ? 'Edit Policy' : 'Add Work Policy'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Policy Title</label>
              <Input 
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                placeholder="e.g., Pull System"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                placeholder="Explain the policy in detail..."
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <select 
                value={form.category}
                onChange={(e) => setForm({...form, category: e.target.value as any})}
                className="w-full border rounded-md p-2"
              >
                <option value="workflow">Workflow</option>
                <option value="quality">Quality</option>
                <option value="team">Team</option>
                <option value="process">Process</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.title || !form.description} className="bg-cyan-600 hover:bg-cyan-700">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MethodologyHelpPanel methodology="kanban" />
    </div>
  );
};

export default KanbanWorkPolicies;
