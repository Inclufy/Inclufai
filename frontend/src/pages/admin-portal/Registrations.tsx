import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertCircle, 
  Search, 
  RefreshCw, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock,
  Crown,
  Settings 
} from 'lucide-react';
import api from '@/lib/api';
import { usePageTranslations } from '@/hooks/usePageTranslations';

interface Registration {
  id: number;
  email: string;
  name: string;
  company: string | null;
  status: string;
  is_active: boolean;
  trial_approved: boolean;
  trial_start_date: string | null;
  trial_days_remaining: number | null;
  email_verified: boolean;
  registered: string;
  last_login: string | null;
  subscription: {
    tier: string | null;
    tier_display: string | null;
    status: string | null;
    status_display: string | null;
    days_remaining: number | null;
    is_active: boolean;
    start_date: string | null;
    end_date: string | null;
  };
}

export default function Registrations() {
  const { pt } = usePageTranslations();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Dialogs
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Registration | null>(null);
  const [selectedTier, setSelectedTier] = useState('trial');
  const [durationDays, setDurationDays] = useState('14');

  // Fetch registrations
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['registrations'],
      queryFn: async () => {
  const data = await api.get<any>('/auth/registrations/');
  console.log('✅ Fetched data:', data);
  return data;  // ✅ CORRECT!
},
  });

  const registrations: Registration[] = data?.registrations || [];

  // Update subscription mutation
  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ userId, tier, durationDays }: { userId: number; tier: string; durationDays: number }) => {
      const response = await api.put(`/auth/subscriptions/user/${userId}/`, {
        tier,
        duration_days: durationDays,
        status: 'active',
      });
      return response.data;
    },
    onSuccess: () => {
      setAlert({ type: 'success', message: 'Subscription updated successfully!' });
      setShowSubscriptionDialog(false);
      setSelectedUser(null);
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
    onError: (error: any) => {
      setAlert({
        type: 'error',
        message: error.response?.data?.error || 'Failed to update subscription',
      });
    },
  });

  const handleSubscriptionUpdate = () => {
    if (!selectedUser) return;
    
    updateSubscriptionMutation.mutate({
      userId: selectedUser.id,
      tier: selectedTier,
      durationDays: parseInt(durationDays),
    });
  };

  // Filter registrations
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.company || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && reg.status === 'pending') ||
      (statusFilter === 'approved' && reg.status === 'approved');

    return matchesSearch && matchesStatus;
  });

  const getTierBadgeColor = (tier: string | null) => {
    if (!tier) return 'bg-gray-500';
    const colors: Record<string, string> = {
      trial: 'bg-gray-500',
      starter: 'bg-blue-500',
      professional: 'bg-purple-500',
      team: 'bg-pink-500',
      enterprise: 'bg-green-500',
    };
    return colors[tier] || 'bg-gray-500';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading registrations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load registrations. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Registrations</h1>
        <p className="text-muted-foreground">Track and manage user signups</p>
      </div>

      {/* Alert */}
      {alert && (
        <Alert variant={alert.type === 'error' ? 'destructive' : 'default'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.count || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{data?.stats?.total || 0} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">verified/active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Trials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.stats?.active_trials || 0}
            </div>
            <p className="text-xs text-muted-foreground">of {data?.stats?.approved || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Newsletter Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              3 <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search email, name, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">{pt("Pending")}</SelectItem>
                <SelectItem value="approved">{pt("Approved")}</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => refetch()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {pt("Refresh")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Registrations</CardTitle>
          <CardDescription>
            Manage user registrations and subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{pt("Email")}</TableHead>
                  <TableHead>{pt("Name")}</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>{pt("Status")}</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Days Left</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">{pt("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No registrations found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {reg.email_verified ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-500" />
                          )}
                          {reg.email}
                        </div>
                      </TableCell>
                      <TableCell>{reg.name}</TableCell>
                      <TableCell>{reg.company || '—'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={reg.status === 'approved' ? 'default' : 'secondary'}
                        >
                          {reg.status === 'approved' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {reg.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {reg.subscription.tier ? (
                          <Badge
                            className={`${getTierBadgeColor(reg.subscription.tier)} text-white`}
                          >
                            {reg.subscription.tier_display}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {reg.subscription.days_remaining !== null ? (
                          <span
                            className={
                              reg.subscription.days_remaining < 7
                                ? 'text-red-500 font-semibold'
                                : ''
                            }
                          >
                            {reg.subscription.days_remaining} days
                          </span>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell>{formatDate(reg.registered)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(reg);
                            setSelectedTier(reg.subscription.tier || 'trial');
                            setShowSubscriptionDialog(true);
                          }}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Management Dialog */}
      <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Subscription</DialogTitle>
            <DialogDescription>
              Update subscription for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subscription Tier</label>
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial">Trial (14 days)</SelectItem>
                  <SelectItem value="starter">Starter (€29/month)</SelectItem>
                  <SelectItem value="professional">
                    Professional (€49/month)
                  </SelectItem>
                  <SelectItem value="team">Team (€39/user/month)</SelectItem>
                  <SelectItem value="enterprise">Enterprise (Custom)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (days)</label>
              <Input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                placeholder="30"
              />
              <p className="text-xs text-muted-foreground">
                Number of days until subscription expires
              </p>
            </div>

            {selectedUser?.subscription.tier && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Current: {selectedUser.subscription.tier_display} ({selectedUser.subscription.days_remaining} days remaining)
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubscriptionDialog(false)}
            >
              {pt("Cancel")}
            </Button>
            <Button
              onClick={handleSubscriptionUpdate}
              disabled={updateSubscriptionMutation.isPending}
            >
              {updateSubscriptionMutation.isPending ? 'Updating...' : 'Update Subscription'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}