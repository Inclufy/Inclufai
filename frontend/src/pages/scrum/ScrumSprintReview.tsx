import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ProjectHeader } from '@/components/ProjectHeader';
import { MethodologyHelpPanel } from '@/components/MethodologyHelpPanel';
import { 
  Presentation, Target, CheckCircle, Save, Loader2, 
  Plus, X, MessageSquare, Trophy, ArrowLeft
} from 'lucide-react';

const ScrumSprintReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [review, setReview] = useState({
    sprint_name: 'Sprint 5',
    sprint_goal: 'Implementeer gebruikersauthenticatie en profielbeheer',
    completed_story_points: 0,
    sprint_goal_achieved: false,
    stakeholder_feedback: '',
    notes: '',
    action_items: [] as string[],
    demo_items: [] as string[]
  });
  const [newActionItem, setNewActionItem] = useState('');

  const saveReview = async () => {
    setSaving(true);
    try {
      // TODO: API call
      console.log('Saving review:', review);
      setTimeout(() => {
        setSaving(false);
        navigate(`/projects/${id}/scrum/overview`);
      }, 1000);
    } catch (error) {
      console.error('Failed to save review:', error);
      setSaving(false);
    }
  };

  const addActionItem = () => {
    if (!newActionItem.trim()) return;
    setReview({
      ...review,
      action_items: [...review.action_items, newActionItem]
    });
    setNewActionItem('');
  };

  const removeActionItem = (index: number) => {
    setReview({
      ...review,
      action_items: review.action_items.filter((_, i) => i !== index)
    });
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
              <Presentation className="h-6 w-6 text-purple-600" />
              Sprint Review: {review.sprint_name}
            </h1>
            <p className="text-muted-foreground">Demonstreer en evalueer sprint resultaten</p>
          </div>
          <Button 
            onClick={saveReview} 
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Opslaan
          </Button>
        </div>

        {/* Sprint Goal & Achievement */}
        <Card className={review.sprint_goal_achieved ? 'border-green-500 bg-green-50' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Sprint Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{review.sprint_goal}</p>
            <div className="flex items-center gap-2">
              <Checkbox
                id="goal-achieved"
                checked={review.sprint_goal_achieved}
                onCheckedChange={(checked) => setReview({
                  ...review,
                  sprint_goal_achieved: checked as boolean
                })}
              />
              <label htmlFor="goal-achieved" className="text-sm font-medium cursor-pointer">
                Sprint Goal Behaald
              </label>
              {review.sprint_goal_achieved && (
                <Trophy className="h-5 w-5 text-yellow-500 ml-2" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Sprint Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Voltooide Story Points</label>
                <Input
                  type="number"
                  value={review.completed_story_points}
                  onChange={(e) => setReview({
                    ...review,
                    completed_story_points: parseInt(e.target.value) || 0
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <div className="mt-1">
                  <Badge className={review.sprint_goal_achieved ? 'bg-green-600' : 'bg-yellow-600'}>
                    {review.sprint_goal_achieved ? 'Doel Bereikt ✓' : 'In Review'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stakeholder Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Stakeholder Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={review.stakeholder_feedback}
              onChange={(e) => setReview({ ...review, stakeholder_feedback: e.target.value })}
              placeholder="Leg feedback, vragen en suggesties van stakeholders vast..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card>
          <CardHeader>
            <CardTitle>Actiepunten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {review.action_items.map((item, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded">
                <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span className="flex-1">{item}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeActionItem(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <Input
                value={newActionItem}
                onChange={(e) => setNewActionItem(e.target.value)}
                placeholder="Voeg actiepunt toe..."
                onKeyPress={(e) => e.key === 'Enter' && addActionItem()}
              />
              <Button onClick={addActionItem}>
                <Plus className="h-4 w-4 mr-2" />
                Toevoegen
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Meeting Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Meeting Notities</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={review.notes}
              onChange={(e) => setReview({ ...review, notes: e.target.value })}
              placeholder="Aanvullende notities van de review meeting..."
              rows={6}
            />
          </CardContent>
        </Card>
      </div>
      <MethodologyHelpPanel methodology="agile" />
    </div>
  );
};

export default ScrumSprintReview;