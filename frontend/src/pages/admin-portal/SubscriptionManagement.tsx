import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, Users, TrendingUp, Clock, CheckCircle, XCircle, Plus, Edit, Trash } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import api from '@/lib/api';

interface Subscription {
  id: number;
  user_id: number;
  user_email: string;
  user_name: string;
  tier: string;
  tier_display: string;
  status: string;
  status_display: string;
  start_date: string | null;
  end_date: string | null;
  days_remaining: number | null;
  is_active: boolean;
  auto_renew: boolean;
  created_at: string;
}

interface SubscriptionStats {
  total: number;
  active: number;
  trial: number;
  professional: number;
  team: number;
  enterprise: number;
}

interface PlanFeatures {
  ai_assistant: boolean;
  time_tracking: boolean;
  program_management: boolean;
  teams: boolean;
  post_project: boolean;
}

interface PlanLimits {
  max_projects: number;
  max_users: number;
}

interface Plan {
  name: string;
  price: number;
  description: string;
  features: PlanFeatures;
  limits: PlanLimits;
}

export default function SubscriptionManagement() {
  const queryClient = useQueryClient();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Mutation to toggle subscription status
const toggleSubscriptionMutation = useMutation({
  mutationFn: async ({ userId, isActive }: { userId: number; isActive: boolean }) => {
    // Call backend API to update subscription
    const response = await api.patch(`/auth/registrations/${userId}/subscription/`, {
      is_active: isActive
    });
    return response;
  },
  onSuccess: (data, variables) => {
    setAlert({ 
      type: 'success', 
      message: `Subscription ${variables.isActive ? 'activated' : 'deactivated'} successfully!` 
    });
    // Refresh the subscriptions list
    queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    setTimeout(() => setAlert(null), 3000);
  },
  onError: (error) => {
    console.error('Failed to update subscription:', error);
    setAlert({ 
      type: 'error', 
      message: 'Failed to update subscription status' 
    });
    setTimeout(() => setAlert(null), 3000);
  }
});

  // Fetch registrations and transform to subscriptions
  const { data: subscriptionsData, isLoading, error } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const data = await api.get<any>('/auth/registrations/');
      console.log('✅ Registrations for subscriptions:', data);
      
      if (data && data.registrations) {
        const subscriptions = data.registrations.map((reg: any) => ({
          id: reg.id,
          user_id: reg.id,
          user_email: reg.email,
          user_name: reg.name,
          tier: reg.subscription.tier || 'trial',
          tier_display: reg.subscription.tier_display || 'Trial',
          status: reg.subscription.status || 'inactive',
          status_display: reg.subscription.status_display || 'Inactive',
          start_date: reg.subscription.start_date,
          end_date: reg.subscription.end_date,
          days_remaining: reg.subscription.days_remaining,
          is_active: reg.subscription.is_active,
          auto_renew: false,
          created_at: reg.registered,
        }));
        return { subscriptions };
      }
      return { subscriptions: [] };
    },
  });

  const subscriptions: Subscription[] = subscriptionsData?.subscriptions || [];

  // Calculate stats
  const stats: SubscriptionStats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.is_active).length,
    trial: subscriptions.filter(s => s.tier === 'trial').length,
    professional: subscriptions.filter(s => s.tier === 'professional').length,
    team: subscriptions.filter(s => s.tier === 'team').length,
    enterprise: subscriptions.filter(s => s.tier === 'enterprise').length,
  };

  const getTierBadgeColor = (tier: string) => {
    const colors: Record<string, string> = {
      trial: 'bg-gray-500',
      starter: 'bg-blue-500',
      professional: 'bg-purple-500',
      team: 'bg-pink-500',
      enterprise: 'bg-green-500',
    };
    return colors[tier] || 'bg-gray-500';
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500',
      expired: 'bg-red-500',
      cancelled: 'bg-gray-500',
      pending: 'bg-yellow-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setShowEditDialog(true);
  };

  const handleSavePlan = () => {
    if (!editingPlan) return;
    
    console.log('Saving plan:', editingPlan);
    // TODO: Make API call to save plan
    // await api.put('/admin/plans', editingPlan);
    
    setAlert({ type: 'success', message: `Plan "${editingPlan.name}" updated successfully!` });
    setShowEditDialog(false);
    setTimeout(() => setAlert(null), 3000);
  };

  // Edit Plan Dialog Component
  const EditPlanDialog = () => {
    if (!editingPlan) return null;

    return (
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Plan: {editingPlan.name}</DialogTitle>
            <DialogDescription>
              Update plan details, features, and limits
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plan Name</Label>
                  <Input 
                    value={editingPlan.name} 
                    onChange={(e) => 
                      setEditingPlan({...editingPlan, name: e.target.value})
                    } 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price (€)</Label>
                  <Input 
                    type="number" 
                    value={editingPlan.price} 
                    onChange={(e) => 
                      setEditingPlan({...editingPlan, price: parseFloat(e.target.value)})
                    } 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input 
                  value={editingPlan.description} 
                  onChange={(e) => 
                    setEditingPlan({...editingPlan, description: e.target.value})
                  } 
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Features</h3>
              
              <div className="space-y-3 border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="ai-assistant">AI Assistant</Label>
                    <p className="text-sm text-muted-foreground">Enable AI-powered chat assistant</p>
                  </div>
                  <Switch 
                    id="ai-assistant"
                    checked={editingPlan.features.ai_assistant}
                    onCheckedChange={(checked) => 
                      setEditingPlan({
                        ...editingPlan, 
                        features: {...editingPlan.features, ai_assistant: checked}
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="time-tracking">Time Tracking</Label>
                    <p className="text-sm text-muted-foreground">Track time spent on projects</p>
                  </div>
                  <Switch 
                    id="time-tracking"
                    checked={editingPlan.features.time_tracking}
                    onCheckedChange={(checked) => 
                      setEditingPlan({
                        ...editingPlan, 
                        features: {...editingPlan.features, time_tracking: checked}
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="program-management">Program Management</Label>
                    <p className="text-sm text-muted-foreground">Manage programs with multiple projects</p>
                  </div>
                  <Switch 
                    id="program-management"
                    checked={editingPlan.features.program_management}
                    onCheckedChange={(checked) => 
                      setEditingPlan({
                        ...editingPlan, 
                        features: {...editingPlan.features, program_management: checked}
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="teams">Teams</Label>
                    <p className="text-sm text-muted-foreground">Collaborate with team members</p>
                  </div>
                  <Switch 
                    id="teams"
                    checked={editingPlan.features.teams}
                    onCheckedChange={(checked) => 
                      setEditingPlan({
                        ...editingPlan, 
                        features: {...editingPlan.features, teams: checked}
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="post-project">Post Project</Label>
                    <p className="text-sm text-muted-foreground">Share projects publicly</p>
                  </div>
                  <Switch 
                    id="post-project"
                    checked={editingPlan.features.post_project}
                    onCheckedChange={(checked) => 
                      setEditingPlan({
                        ...editingPlan, 
                        features: {...editingPlan.features, post_project: checked}
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Limits */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Limits</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-projects">Max Projects</Label>
                  <Input 
                    id="max-projects"
                    type="number" 
                    value={editingPlan.limits.max_projects} 
                    onChange={(e) => 
                      setEditingPlan({
                        ...editingPlan, 
                        limits: {...editingPlan.limits, max_projects: parseInt(e.target.value)}
                      })
                    } 
                  />
                  <p className="text-xs text-muted-foreground">0 = unlimited</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-users">Max Users</Label>
                  <Input 
                    id="max-users"
                    type="number" 
                    value={editingPlan.limits.max_users} 
                    onChange={(e) => 
                      setEditingPlan({
                        ...editingPlan, 
                        limits: {...editingPlan.limits, max_users: parseInt(e.target.value)}
                      })
                    } 
                  />
                  <p className="text-xs text-muted-foreground">0 = unlimited</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePlan}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load subscriptions. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <EditPlanDialog />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <p className="text-muted-foreground">
          Manage user subscriptions and pricing plans
        </p>
      </div>

      {/* Alert */}
      {alert && (
        <Alert variant={alert.type === 'error' ? 'destructive' : 'default'} className="bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="subscriptions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="subscriptions">User Subscriptions</TabsTrigger>
          <TabsTrigger value="plans">Plans & Pricing</TabsTrigger>
        </TabsList>

        {/* Tab 1: User Subscriptions */}
        <TabsContent value="subscriptions" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{stats.total}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-2xl font-bold">{stats.active}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Trial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-2xl font-bold">{stats.trial}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Professional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className="text-2xl font-bold">{stats.professional}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-pink-500" />
                  <span className="text-2xl font-bold">{stats.team}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Enterprise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-2xl font-bold">{stats.enterprise}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscriptions Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Subscriptions</CardTitle>
              <CardDescription>
                View and manage all user subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Days Left</TableHead>
                      <TableHead>Auto Renew</TableHead>
                      <TableHead className="text-right w-[250px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-muted-foreground">
                          No subscriptions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      subscriptions.map((subscription) => (
                        <TableRow key={subscription.id}>
                          <TableCell className="font-medium">
                            {subscription.user_name}
                          </TableCell>
                          <TableCell>{subscription.user_email}</TableCell>
                          <TableCell>
                            <Badge className={`${getTierBadgeColor(subscription.tier)} text-white`}>
                              {subscription.tier_display}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusBadgeColor(subscription.status)} text-white`}>
                              {subscription.status_display}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(subscription.start_date)}</TableCell>
                          <TableCell>{formatDate(subscription.end_date)}</TableCell>
                          <TableCell>
                            {subscription.days_remaining !== null ? (
                              <span className={subscription.days_remaining < 7 ? 'text-red-500 font-semibold' : ''}>
                                {subscription.days_remaining} days
                              </span>
                            ) : (
                              'N/A'
                            )}
                          </TableCell>
                          <TableCell>
                            {subscription.auto_renew ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                          </TableCell>
                          <TableCell className="text-right">
  <div className="flex items-center justify-end gap-2">
    {/* Activate/Deactivate Toggle */}
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">
        {subscription.is_active ? 'Active' : 'Inactive'}
      </span>
      <Switch 
  checked={subscription.is_active}
  onCheckedChange={async (checked) => {
    try {
      // ✅ UNCOMMENTED: Make API call to update subscription status
      await api.patch(`/auth/registrations/${subscription.user_id}/subscription/`, { 
        is_active: checked 
      });
      
      console.log(`${checked ? 'Activated' : 'Deactivated'} subscription for ${subscription.user_email}`);
      
      setAlert({ 
        type: 'success', 
        message: `Subscription ${checked ? 'activated' : 'deactivated'} for ${subscription.user_name}!` 
      });
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      
      // Auto-hide alert after 3 seconds
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Failed to update subscription:', error);
      setAlert({ 
        type: 'error', 
        message: 'Failed to update subscription status' 
      });
      setTimeout(() => setAlert(null), 3000);
    }
  }}
/>
    </div>
    
    {/* Manage Button */}
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        window.location.href = `/admin/registrations`;
      }}
    >
      Manage
    </Button>
  </div>
</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Plans & Pricing */}
        <TabsContent value="plans" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Pricing Plans</h2>
              <p className="text-muted-foreground">Manage subscription plans and pricing</p>
            </div>
            <Button onClick={() => handleEditPlan({
  name: 'New Plan',
  price: 0,
  description: 'New subscription plan',
  features: {
    ai_assistant: false,
    time_tracking: false,
    program_management: false,
    teams: false,
    post_project: false,
  },
  limits: {
    max_projects: 0,
    max_users: 0,
  }
})}>
  <Plus className="h-4 w-4 mr-2" />
  Add New Plan
</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Trial Plan */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Trial</CardTitle>
                    <CardDescription>14 days</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleEditPlan({
                      name: 'Trial',
                      price: 0,
                      description: 'Free trial',
                      features: {
                        ai_assistant: false,
                        time_tracking: false,
                        program_management: false,
                        teams: false,
                        post_project: false,
                      },
                      limits: {
                        max_projects: 1,
                        max_users: 1,
                      }
                    })}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">€0</div>
                <p className="text-sm text-muted-foreground mb-4">Free trial</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    1 project
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Mobile only
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-gray-400" />
                    No Time Tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Starter Plan */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Starter</CardTitle>
                    <CardDescription>For individuals</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleEditPlan({
                      name: 'Starter',
                      price: 29,
                      description: 'For individuals',
                      features: {
                        ai_assistant: true,
                        time_tracking: true,
                        program_management: false,
                        teams: false,
                        post_project: false,
                      },
                      limits: {
                        max_projects: 5,
                        max_users: 1,
                      }
                    })}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">€29</div>
                <p className="text-sm text-muted-foreground mb-4">/month</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    5 projects
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Time Tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    AI Assistant
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="border-purple-500 border-2 relative">
              <div className="absolute -top-3 left-4">
                <Badge className="bg-purple-500 text-white">Most Popular</Badge>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start mt-2">
                  <div>
                    <CardTitle>Professional</CardTitle>
                    <CardDescription>For project managers</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleEditPlan({
                      name: 'Professional',
                      price: 49,
                      description: 'For project managers',
                      features: {
                        ai_assistant: true,
                        time_tracking: true,
                        program_management: true,
                        teams: false,
                        post_project: false,
                      },
                      limits: {
                        max_projects: 10,
                        max_users: 1,
                      }
                    })}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">€49</div>
                <p className="text-sm text-muted-foreground mb-4">/month</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    10 projects
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Program Management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Everything from Starter
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Team Plan */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Team</CardTitle>
                    <CardDescription>Collaboration</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleEditPlan({
                      name: 'Team',
                      price: 39,
                      description: 'Collaboration',
                      features: {
                        ai_assistant: true,
                        time_tracking: true,
                        program_management: false,
                        teams: true,
                        post_project: true,
                      },
                      limits: {
                        max_projects: 0,
                        max_users: 25,
                      }
                    })}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">€39</div>
                <p className="text-sm text-muted-foreground mb-4">/user/month</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    25 users
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Unlimited projects
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Everything
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}