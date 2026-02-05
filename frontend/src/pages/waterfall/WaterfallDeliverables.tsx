import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectHeader } from '@/components/ProjectHeader';
import { useProject } from '@/hooks/useApi';
import { MethodologyHelpPanel } from '@/components/MethodologyHelpPanel';
import { deliverableApi } from '@/lib/waterfallApi';
import { 
  Package, CheckCircle2, Clock, XCircle, 
  FileText, Users, Calendar, Loader2
} from 'lucide-react';

interface Deliverable {
  id: number;
  name: string;
  description: string;
  phase: string;
  type: 'document' | 'code' | 'design' | 'approval' | 'training';
  status: 'pending' | 'in-progress' | 'review' | 'approved' | 'rejected';
  owner: string;
  due_date: string;
  completed_date?: string;
  approver?: string;
  acceptance_criteria: string[];
}

const WaterfallDeliverables = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project } = useProject(id);
  
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadDeliverables();
    }
  }, [id]);

  const loadDeliverables = async () => {
    try {
      setLoading(true);
      const response = await deliverableApi.getAll(id!);
      setDeliverables(response.data);
    } catch (err) {
      console.error('Failed to load deliverables', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-gray-500',
      'in-progress': 'bg-blue-500',
      review: 'bg-yellow-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle2;
      case 'rejected': return XCircle;
      default: return Clock;
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      document: 'border-blue-200 bg-blue-50',
      code: 'border-purple-200 bg-purple-50',
      design: 'border-pink-200 bg-pink-50',
      approval: 'border-green-200 bg-green-50',
      training: 'border-orange-200 bg-orange-50'
    };
    return colors[type as keyof typeof colors] || 'border-gray-200 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="min-h-full bg-background">
        <ProjectHeader />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  const phases = ['Requirements', 'Design', 'Development', 'Testing', 'Deployment'];
  const approvedCount = deliverables.filter(d => d.status === 'approved').length;
  const inProgressCount = deliverables.filter(d => d.status === 'in-progress').length;
  const pendingCount = deliverables.filter(d => d.status === 'pending').length;

  return (
    <div className="min-h-full bg-background">
      <ProjectHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 text-blue-600" />
              Project Deliverables
            </h1>
            <p className="text-muted-foreground">Track deliverables and acceptance criteria</p>
          </div>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex gap-4">
              <Package className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900">Deliverable Management</h3>
                <p className="text-sm text-blue-800 mt-1">
                  Each Waterfall phase produces specific deliverables with defined acceptance criteria.
                  Formal approval is required before proceeding to the next phase.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{deliverables.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-gray-600">{pendingCount}</p>
            </CardContent>
          </Card>
        </div>

        {deliverables.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-8">
                No deliverables found. Deliverables are typically added during project planning.
              </p>
            </CardContent>
          </Card>
        ) : (
          phases.map(phase => {
            const phaseDeliverables = deliverables.filter(d => d.phase === phase);
            if (phaseDeliverables.length === 0) return null;

            return (
              <Card key={phase}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {phase} Phase ({phaseDeliverables.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {phaseDeliverables.map(deliverable => {
                      const StatusIcon = getStatusIcon(deliverable.status);
                      
                      return (
                        <div 
                          key={deliverable.id} 
                          className={`p-4 border-2 rounded-lg ${getTypeColor(deliverable.type)}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <StatusIcon className="h-5 w-5" />
                                <h3 className="font-semibold">{deliverable.name}</h3>
                                <Badge className={getStatusColor(deliverable.status)}>
                                  {deliverable.status}
                                </Badge>
                                <Badge variant="outline" className="capitalize">
                                  {deliverable.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {deliverable.description}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Owner:</span>
                              <span className="font-medium">{deliverable.owner}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Due:</span>
                              <span className="font-medium">{deliverable.due_date}</span>
                            </div>
                            {deliverable.approver && (
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Approver:</span>
                                <span className="font-medium">{deliverable.approver}</span>
                              </div>
                            )}
                          </div>

                          <div className="bg-white/50 p-3 rounded-md">
                            <p className="text-sm font-medium mb-2">Acceptance Criteria:</p>
                            <ul className="space-y-1">
                              {deliverable.acceptance_criteria.map((criteria, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{criteria}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {deliverable.completed_date && (
                            <div className="mt-3 p-2 bg-green-100 rounded-md text-sm">
                              <span className="font-medium text-green-900">
                                Completed: {deliverable.completed_date}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <MethodologyHelpPanel methodology="waterfall" />
    </div>
  );
};

export default WaterfallDeliverables;
