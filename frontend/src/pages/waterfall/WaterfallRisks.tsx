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
import { riskApi } from '@/lib/waterfallApi';
import { 
  Shield, Plus, Edit2, Trash2, AlertTriangle, 
  TrendingUp, TrendingDown, Minus, Loader2
} from 'lucide-react';

interface Risk {
  id: number;
  title: string;
  description: string;
  category: 'technical' | 'business' | 'resource' | 'external';
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  status: 'identified' | 'analyzing' | 'mitigating' | 'closed';
  owner: string;
  mitigation: string;
  date_identified: string;
  date_closed?: string;
}

const WaterfallRisks = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project } = useProject(id);
  
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'technical' as const,
    probability: 'medium' as const,
    impact: 'medium' as const,
    status: 'identified' as const,
    owner: '',
    mitigation: '',
    date_identified: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (id) {
      loadRisks();
    }
  }, [id]);

  const loadRisks = async () => {
    try {
      setLoading(true);
      const response = await riskApi.getAll(id!);
      setRisks(response.data);
    } catch (err) {
      console.error('Failed to load risks', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingRisk) {
        await riskApi.update(id!, editingRisk.id, form);
      } else {
        await riskApi.create(id!, { ...form, project: id });
      }
      setShowDialog(false);
      setEditingRisk(null);
      resetForm();
      loadRisks();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save risk');
    }
  };

  const handleDelete = async (riskId: number) => {
    if (!confirm('Delete this risk?')) return;
    try {
      await riskApi.delete(id!, riskId);
      loadRisks();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete risk');
    }
  };

  const openEdit = (risk: Risk) => {
    setEditingRisk(risk);
    setForm({
      title: risk.title,
      description: risk.description,
      category: risk.category,
      probability: risk.probability,
      impact: risk.impact,
      status: risk.status,
      owner: risk.owner,
      mitigation: risk.mitigation,
      date_identified: risk.date_identified,
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      category: 'technical',
      probability: 'medium',
      impact: 'medium',
      status: 'identified',
      owner: '',
      mitigation: '',
      date_identified: new Date().toISOString().split('T')[0],
    });
  };

  const getProbabilityColor = (prob: string) => {
    const colors = { low: 'bg-green-500', medium: 'bg-yellow-500', high: 'bg-red-500' };
    return colors[prob as keyof typeof colors] || 'bg-gray-500';
  };

  const getImpactColor = (impact: string) => {
    const colors = { low: 'bg-green-500', medium: 'bg-yellow-500', high: 'bg-red-500' };
    return colors[impact as keyof typeof colors] || 'bg-gray-500';
  };

  const getRiskScore = (probability: string, impact: string) => {
    const scores = { low: 1, medium: 2, high: 3 };
    return scores[probability as keyof typeof scores] * scores[impact as keyof typeof scores];
  };

  const getRiskLevel = (score: number) => {
    if (score >= 6) return { label: 'Critical', color: 'bg-red-500', icon: TrendingUp };
    if (score >= 4) return { label: 'High', color: 'bg-orange-500', icon: TrendingUp };
    if (score >= 2) return { label: 'Medium', color: 'bg-yellow-500', icon: Minus };
    return { label: 'Low', color: 'bg-green-500', icon: TrendingDown };
  };

  if (loading) {
    return (
      <div className="min-h-full bg-background">
        <ProjectHeader />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      </div>
    );
  }

  const activeRisks = risks.filter(r => r.status !== 'closed');
  const criticalRisks = activeRisks.filter(r => getRiskScore(r.probability, r.impact) >= 6);

  return (
    <div className="min-h-full bg-background">
      <ProjectHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6 text-orange-600" />
              Risk Register
            </h1>
            <p className="text-muted-foreground">Track and manage project risks</p>
          </div>
          <Button onClick={() => { resetForm(); setShowDialog(true); }} className="bg-orange-600 hover:bg-orange-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Risk
          </Button>
        </div>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-4">
            <div className="flex gap-4">
              <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-900">Risk Management</h3>
                <p className="text-sm text-orange-800 mt-1">
                  Proactively identify, assess, and mitigate risks that could impact project success.
                  Regular risk reviews are essential for waterfall projects.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Total Risks</p>
              <p className="text-2xl font-bold">{risks.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-orange-600">{activeRisks.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold text-red-600">{criticalRisks.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Closed</p>
              <p className="text-2xl font-bold text-green-600">
                {risks.filter(r => r.status === 'closed').length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Risk Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            {activeRisks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No active risks. Click "Add Risk" to create one.</p>
            ) : (
              <div className="space-y-3">
                {activeRisks.map((risk) => {
                  const score = getRiskScore(risk.probability, risk.impact);
                  const level = getRiskLevel(score);
                  const Icon = level.icon;

                  return (
                    <div key={risk.id} className="p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{risk.title}</h3>
                            <Badge className={level.color}>
                              <Icon className="h-3 w-3 mr-1" />
                              {level.label}
                            </Badge>
                            <Badge variant="outline" className="capitalize">{risk.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{risk.description}</p>
                          <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Probability:</span>
                              <Badge className={getProbabilityColor(risk.probability)} variant="outline">
                                {risk.probability}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Impact:</span>
                              <Badge className={getImpactColor(risk.impact)} variant="outline">
                                {risk.impact}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Owner:</span>
                              <span className="font-medium">{risk.owner}</span>
                            </div>
                          </div>
                          <div className="mt-3 p-3 bg-muted rounded-md">
                            <p className="text-sm font-medium mb-1">Mitigation Strategy:</p>
                            <p className="text-sm text-muted-foreground">{risk.mitigation}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(risk)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(risk.id)}>
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
            <DialogTitle>{editingRisk ? 'Edit Risk' : 'Add Risk'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Risk title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
            <Textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <select className="w-full border rounded-md p-2" value={form.category} onChange={(e) => setForm({...form, category: e.target.value as any})}>
                  <option value="technical">Technical</option>
                  <option value="business">Business</option>
                  <option value="resource">Resource</option>
                  <option value="external">External</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <select className="w-full border rounded-md p-2" value={form.status} onChange={(e) => setForm({...form, status: e.target.value as any})}>
                  <option value="identified">Identified</option>
                  <option value="analyzing">Analyzing</option>
                  <option value="mitigating">Mitigating</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Probability</label>
                <select className="w-full border rounded-md p-2" value={form.probability} onChange={(e) => setForm({...form, probability: e.target.value as any})}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Impact</label>
                <select className="w-full border rounded-md p-2" value={form.impact} onChange={(e) => setForm({...form, impact: e.target.value as any})}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <Input placeholder="Risk owner" value={form.owner} onChange={(e) => setForm({...form, owner: e.target.value})} />
            <Textarea placeholder="Mitigation strategy" rows={3} value={form.mitigation} onChange={(e) => setForm({...form, mitigation: e.target.value})} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.title || !form.owner} className="bg-orange-600 hover:bg-orange-700">Save Risk</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MethodologyHelpPanel methodology="waterfall" />
    </div>
  );
};

export default WaterfallRisks;
