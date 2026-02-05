import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectHeader } from '@/components/ProjectHeader';
import { useProject } from '@/hooks/useApi';
import { MethodologyHelpPanel } from '@/components/MethodologyHelpPanel';
import { baselineApi } from '@/lib/waterfallApi';
import { 
  Target, Calendar, DollarSign, CheckCircle2, Loader2
} from 'lucide-react';

interface Baseline {
  id: number;
  baseline_type: 'scope' | 'schedule' | 'cost';
  version: number;
  data: any;
  approved_by: string;
  approval_date: string;
  is_current: boolean;
}

const WaterfallBaselines = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project } = useProject(id);
  
  const [baselines, setBaselines] = useState<Baseline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadBaselines();
    }
  }, [id]);

  const loadBaselines = async () => {
    try {
      setLoading(true);
      const response = await baselineApi.getAll(id!);
      setBaselines(response.data);
    } catch (err) {
      console.error('Failed to load baselines', err);
    } finally {
      setLoading(false);
    }
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

  const scopeBaseline = baselines.find(b => b.baseline_type === 'scope' && b.is_current);
  const scheduleBaseline = baselines.find(b => b.baseline_type === 'schedule' && b.is_current);
  const costBaseline = baselines.find(b => b.baseline_type === 'cost' && b.is_current);

  return (
    <div className="min-h-full bg-background">
      <ProjectHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              Project Baselines
            </h1>
            <p className="text-muted-foreground">Scope, Schedule, and Cost Baselines</p>
          </div>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex gap-4">
              <Target className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900">What are Project Baselines?</h3>
                <p className="text-sm text-blue-800 mt-1">
                  Baselines are the approved versions of scope, schedule, and cost that serve as reference points
                  for measuring project performance. Changes require formal change control procedures.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {baselines.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-8">
                No baselines found. Baselines are typically set during project planning phase.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {scopeBaseline && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    Scope Baseline (v{scopeBaseline.version})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Approved by: {scopeBaseline.approved_by}</span>
                    <span>Date: {scopeBaseline.approval_date}</span>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <pre className="text-sm overflow-auto">{JSON.stringify(scopeBaseline.data, null, 2)}</pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {scheduleBaseline && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    Schedule Baseline (v{scheduleBaseline.version})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Approved by: {scheduleBaseline.approved_by}</span>
                    <span>Date: {scheduleBaseline.approval_date}</span>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <pre className="text-sm overflow-auto">{JSON.stringify(scheduleBaseline.data, null, 2)}</pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {costBaseline && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    Cost Baseline (v{costBaseline.version})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Approved by: {costBaseline.approved_by}</span>
                    <span>Date: {costBaseline.approval_date}</span>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <pre className="text-sm overflow-auto">{JSON.stringify(costBaseline.data, null, 2)}</pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      <MethodologyHelpPanel methodology="waterfall" />
    </div>
  );
};

export default WaterfallBaselines;
