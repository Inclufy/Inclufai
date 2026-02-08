import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase, TrendingUp, Users, DollarSign } from "lucide-react";

interface Portfolio {
  id: string;
  name: string;
  description: string;
  status: string;
  strategic_objectives: string;
  budget_allocated: number;
  owner_name: string;
  owner_email: string;
  total_boards: number;
  created_at: string;
}

export default function Portfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("/api/v1/governance/portfolios/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setPortfolios(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: "bg-yellow-100 text-yellow-800",
      active: "bg-green-100 text-green-800",
      on_hold: "bg-orange-100 text-orange-800",
      closed: "bg-gray-100 text-gray-800"
    };
    return colors[status] || colors.active;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading portfolios...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-8 w-8" />
            Strategic Portfolios
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage strategic initiatives and governance
          </p>
        </div>
        <Button onClick={() => navigate("/governance/portfolios/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Portfolio
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Portfolios</p>
                <p className="text-2xl font-bold mt-1">{portfolios.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold mt-1">
                  {portfolios.filter(p => p.status === 'active').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Boards</p>
                <p className="text-2xl font-bold mt-1">
                  {portfolios.reduce((sum, p) => sum + p.total_boards, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold mt-1">
                  €{portfolios.reduce((sum, p) => sum + (p.budget_allocated || 0), 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <Card 
            key={portfolio.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/governance/portfolios/${portfolio.id}`)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{portfolio.name}</CardTitle>
                <Badge className={getStatusColor(portfolio.status)}>
                  {portfolio.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {portfolio.description || "No description"}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Owner</span>
                  <span className="font-medium">{portfolio.owner_name || portfolio.owner_email}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Governance Boards</span>
                  <span className="font-medium">{portfolio.total_boards}</span>
                </div>
                
                {portfolio.budget_allocated > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">€{portfolio.budget_allocated.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {portfolios.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Portfolios Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first strategic portfolio to get started
            </p>
            <Button onClick={() => navigate("/governance/portfolios/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Portfolio
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
