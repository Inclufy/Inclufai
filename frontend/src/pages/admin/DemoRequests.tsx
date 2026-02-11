import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Calendar, 
  Users, 
  Search, 
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Phone,
  Building2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePageTranslations } from '@/hooks/usePageTranslations';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001/api/v1';

interface DemoRequest {
  id: number;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  preferred_date: string | null;
  preferred_time: string | null;
  num_participants: number;
  message: string;
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  created_at: string;
  updated_at: string;
}

interface Stats {
  demos: {
    total: number;
    pending: number;
    scheduled: number;
    completed: number;
  };
}

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  contacted: 'bg-blue-100 text-blue-800 border-blue-300',
  scheduled: 'bg-purple-100 text-purple-800 border-purple-300',
  completed: 'bg-green-100 text-green-800 border-green-300',
  cancelled: 'bg-gray-100 text-gray-800 border-gray-300',
};

const STATUS_ICONS = {
  pending: Clock,
  contacted: Mail,
  scheduled: Calendar,
  completed: CheckCircle,
  cancelled: XCircle,
};

const DemoRequests = () => {
  const { pt } = usePageTranslations();
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/subscriptions/admin/stats/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      let url = `${API_BASE_URL}/subscriptions/admin/demos/`;
      
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (search) params.append('search', search);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setRequests(data.results || data);
      } else {
        throw new Error('Failed to fetch requests');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load demo requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/subscriptions/admin/demos/${id}/update/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Status updated successfully',
        });
        fetchRequests();
        fetchStats();
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRequests();
  }, [statusFilter, search]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Demo Requests</h1>
          <p className="text-gray-600 mt-2">Manage and track demo requests</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Demos</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.demos.total}</p>
                  </div>
                  <Calendar className="w-10 h-10 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{pt("Pending")}</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.demos.pending}</p>
                  </div>
                  <Clock className="w-10 h-10 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Scheduled</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.demos.scheduled}</p>
                  </div>
                  <Calendar className="w-10 h-10 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{pt("Completed")}</p>
                    <p className="text-3xl font-bold text-green-600">{stats.demos.completed}</p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by company, contact, or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">{pt("Pending")}</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">{pt("Completed")}</SelectItem>
                  <SelectItem value="cancelled">{pt("Cancelled")}</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={() => { fetchRequests(); fetchStats(); }} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                {pt("Refresh")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Requests ({requests.length})</CardTitle>
            <CardDescription>View and manage all demo requests</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                <p className="text-gray-600 mt-4">Loading requests...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto text-gray-300" />
                <p className="text-gray-600 mt-4">No demo requests found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>{pt("Status")}</TableHead>
                    <TableHead>{pt("Created")}</TableHead>
                    <TableHead>{pt("Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => {
                    const StatusIcon = STATUS_ICONS[request.status];
                    return (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{request.company_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-3 h-3 text-gray-400" />
                              {request.contact_name}
                            </div>
                            <div className="text-xs text-gray-600">{request.contact_email}</div>
                            {request.contact_phone && (
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Phone className="w-3 h-3" />
                                {request.contact_phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDate(request.preferred_date)}</div>
                            {request.preferred_time && (
                              <div className="text-xs text-gray-600">{request.preferred_time}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{request.num_participants}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={STATUS_COLORS[request.status]} variant="outline">
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {formatDate(request.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={request.status}
                            onValueChange={(value) => updateStatus(request.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">{pt("Pending")}</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="scheduled">Scheduled</SelectItem>
                              <SelectItem value="completed">{pt("Completed")}</SelectItem>
                              <SelectItem value="cancelled">{pt("Cancelled")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DemoRequests;
