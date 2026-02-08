import React, { useState, useEffect } from "react";
import { useNavigate, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, Button } from "@/components/ui/button";
import { useNavigate, Badge } from "@/components/ui/badge";
import { useNavigate, Plus, User, TrendingUp, AlertCircle } from "lucide-react";

interface Stakeholder {
  id: string;
  user_email: string;
  user_name: string;
  role: string;
  influence_level: string;
  interest_level: string;
  quadrant: string;
  communication_plan: string;
  is_active: boolean;
}

export default function Stakeholders() {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStakeholders();
  }, []);

  const fetchStakeholders = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("/api/v1/governance/stakeholders/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setStakeholders(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Error fetching stakeholders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      executive_sponsor: "Executive Sponsor",
      senior_responsible_owner: "Senior Responsible Owner",
      business_change_manager: "Business Change Manager",
      project_executive: "Project Executive",
      key_stakeholder: "Key Stakeholder"
    };
    return labels[role] || role;
  };

  const getInfluenceColor = (level: string) => {
    const colors: Record<string, string> = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800"
    };
    return colors[level] || colors.medium;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading stakeholders...</div>
      </div>
    );
  }

  // Group by quadrant
  const matrix = {
    manage_closely: stakeholders.filter(s => s.influence_level === 'high' && s.interest_level === 'high'),
    keep_satisfied: stakeholders.filter(s => s.influence_level === 'high' && s.interest_level !== 'high'),
    keep_informed: stakeholders.filter(s => s.influence_level !== 'high' && s.interest_level === 'high'),
    monitor: stakeholders.filter(s => s.influence_level !== 'high' && s.interest_level !== 'high')
  };

  const totalStakeholders = stakeholders.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8" />
            Stakeholder Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Strategic stakeholder engagement and influence mapping
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Stakeholder
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Stakeholders</p>
                <p className="text-2xl font-bold mt-1">{totalStakeholders}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Key Players</p>
                <p className="text-2xl font-bold mt-1">{matrix.manage_closely.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Influence</p>
                <p className="text-2xl font-bold mt-1">
                  {matrix.manage_closely.length + matrix.keep_satisfied.length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Interest</p>
                <p className="text-2xl font-bold mt-1">
                  {matrix.manage_closely.length + matrix.keep_informed.length}
                </p>
              </div>
              <User className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stakeholder List */}
      <div className="space-y-4">
        {stakeholders.map((stakeholder) => (
          <Card key={stakeholder.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{stakeholder.user_name}</p>
                    <p className="text-sm text-muted-foreground">{stakeholder.user_email}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Badge variant="outline">{getRoleLabel(stakeholder.role)}</Badge>
                  <Badge className={getInfluenceColor(stakeholder.influence_level)}>
                    {stakeholder.influence_level} influence
                  </Badge>
                  <Badge variant="outline">
                    {stakeholder.interest_level} interest
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalStakeholders === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Stakeholders Yet</h3>
            <p className="text-muted-foreground mb-4">
              Add stakeholders to track engagement and influence
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Stakeholder
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
