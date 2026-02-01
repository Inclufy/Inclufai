import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ProjectHeader } from '@/components/ProjectHeader';
import { MethodologyHelpPanel } from '@/components/MethodologyHelpPanel';
import { 
  Package, Rocket, CheckCircle, Plus, Calendar, 
  TrendingUp, ArrowLeft, Loader2, ExternalLink
} from 'lucide-react';

interface Increment {
  id: number;
  version: string;
  sprint_name: string;
  description: string;
  is_released: boolean;
  release_date?: string;
  meets_dod: boolean;
  test_coverage?: number;
  completed_tasks_count: number;
}

const ScrumIncrements = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [increments, setIncrements] = useState<Increment[]>([
    {
      id: 1,
      version: 'v1.2.0',
      sprint_name: 'Sprint 4',
      description: 'User authentication, profile management, password reset',
      is_released: true,
      release_date: '2026-01-15',
      meets_dod: true,
      test_coverage: 87.5,
      completed_tasks_count: 12
    },
    {
      id: 2,
      version: 'v1.3.0',
      sprint_name: 'Sprint 5',
      description: 'Pricing system, subscription management, payment integration',
      is_released: false,
      meets_dod: true,
      test_coverage: 92.3,
      completed_tasks_count: 15
    }
  ]);
  const [showNewIncrement, setShowNewIncrement] = useState(false);
  const [newIncrement, setNewIncrement] = useState({
    version: '',
    description: '',
    sprint_name: ''
  });

  const createIncrement = async () => {
    // TODO: API call
    const increment: Increment = {
      id: increments.length + 1,
      ...newIncrement,
      is_released: false,
      meets_dod: false,
      completed_tasks_count: 0
    };
    setIncrements([increment, ...increments]);
    setNewIncrement({ version: '', description: '', sprint_name: '' });
    setShowNewIncrement(false);
  };

  const releaseIncrement = async (incrementId: number) => {
    setIncrements(increments.map(inc => 
      inc.id === incrementId 
        ? { ...inc, is_released: true, release_date: new Date().toISOString().split('T')[0] }
        : inc
    ));
  };

  return (
    <div className="min-h-full bg-background">
      <ProjectHeader />
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link to={`/projects/${id}/scrum/overview`}>
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Terug naar Overview
              </Button>
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 text-purple-600" />
              Product Increments
            </h1>
            <p className="text-muted-foreground">Track opgeleverde werk en releases</p>
          </div>

          <Dialog open={showNewIncrement} onOpenChange={setShowNewIncrement}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Nieuw Increment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nieuw Increment Maken</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium">Versie</label>
                  <Input
                    value={newIncrement.version}
                    onChange={(e) => setNewIncrement({ ...newIncrement, version: e.target.value })}
                    placeholder="v1.4.0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Sprint</label>
                  <Input
                    value={newIncrement.sprint_name}
                    onChange={(e) => setNewIncrement({ ...newIncrement, sprint_name: e.target.value })}
                    placeholder="Sprint 6"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Beschrijving</label>
                  <Textarea
                    value={newIncrement.description}
                    onChange={(e) => setNewIncrement({ ...newIncrement, description: e.target.value })}
                    placeholder="Wat zit er in dit increment..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={createIncrement} 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={!newIncrement.version || !newIncrement.description}
                >
                  Increment Aanmaken
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Totaal Increments</p>
                  <p className="text-2xl font-bold">{increments.length}</p>
                </div>
                <Package className="h-8 w-8 text-purple-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Released</p>
                  <p className="text-2xl font-bold">{increments.filter(i => i.is_released).length}</p>
                </div>
                <Rocket className="h-8 w-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">DoD Compliant</p>
                  <p className="text-2xl font-bold">{increments.filter(i => i.meets_dod).length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Increments List */}
        <div className="space-y-4">
          {increments.map((increment) => (
            <Card key={increment.id} className={increment.is_released ? 'border-green-200 bg-green-50' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-purple-600" />
                    <div>
                      <CardTitle className="text-lg">{increment.version}</CardTitle>
                      <p className="text-sm text-muted-foreground">{increment.sprint_name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {increment.is_released ? (
                      <Badge className="bg-green-600">
                        <Rocket className="h-3 w-3 mr-1" />
                        Released
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-600">In Development</Badge>
                    )}
                    {increment.meets_dod && (
                      <Badge variant="outline" className="border-blue-600 text-blue-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        DoD ✓
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{increment.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Voltooide Tasks</p>
                    <p className="text-lg font-semibold">{increment.completed_tasks_count}</p>
                  </div>
                  {increment.test_coverage !== undefined && (
                    <div>
                      <p className="text-xs text-muted-foreground">Test Coverage</p>
                      <p className="text-lg font-semibold">{increment.test_coverage}%</p>
                    </div>
                  )}
                  {increment.release_date && (
                    <div>
                      <p className="text-xs text-muted-foreground">Release Datum</p>
                      <p className="text-lg font-semibold">
                        {new Date(increment.release_date).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                  )}
                </div>

                {!increment.is_released && (
                  <Button 
                    onClick={() => releaseIncrement(increment.id)}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Release to Production
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {increments.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Nog geen increments gemaakt</p>
              <Button onClick={() => setShowNewIncrement(true)} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Maak je eerste increment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      <MethodologyHelpPanel methodology="agile" />
    </div>
  );
};

export default ScrumIncrements;