import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Calendar, CheckCircle } from "lucide-react";

interface Board {
  id: string;
  name: string;
  board_type: string;
  description: string;
  portfolio: string | null;
  program: string | null;
  project: string | null;
  meeting_frequency: string;
  chair_name: string;
  chair_email: string;
  member_count: number;
  is_active: boolean;
  created_at: string;
}

export default function GovernanceBoards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("/api/v1/governance/boards/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setBoards(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Error fetching boards:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBoardTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      steering_committee: "Steering Committee",
      program_board: "Program Board",
      project_board: "Project Board",
      advisory_board: "Advisory Board",
      executive_board: "Executive Board"
    };
    return labels[type] || type;
  };

  const getBoardTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      steering_committee: "bg-purple-100 text-purple-800",
      program_board: "bg-blue-100 text-blue-800",
      project_board: "bg-green-100 text-green-800",
      advisory_board: "bg-orange-100 text-orange-800",
      executive_board: "bg-red-100 text-red-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading boards...</div>
      </div>
    );
  }

  const activeBoards = boards.filter(b => b.is_active);
  const boardsByType = boards.reduce((acc, board) => {
    acc[board.board_type] = (acc[board.board_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Governance Boards
          </h1>
          <p className="text-muted-foreground mt-1">
            Steering committees, program boards, and advisory panels
          </p>
        </div>
        <Button onClick={() => navigate("/governance/boards/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Board
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Boards</p>
                <p className="text-2xl font-bold mt-1">{boards.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Boards</p>
                <p className="text-2xl font-bold mt-1">{activeBoards.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold mt-1">
                  {boards.reduce((sum, b) => sum + b.member_count, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Steering Committees</p>
                <p className="text-2xl font-bold mt-1">
                  {boardsByType.steering_committee || 0}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Boards List */}
      <div className="space-y-4">
        {boards.map((board) => (
          <Card 
            key={board.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/governance/boards/${board.id}`)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl">{board.name}</CardTitle>
                    <Badge className={getBoardTypeColor(board.board_type)}>
                      {getBoardTypeLabel(board.board_type)}
                    </Badge>
                    {!board.is_active && (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {board.description || "No description"}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Chair</span>
                  <p className="font-medium mt-1">
                    {board.chair_name || board.chair_email || "Not assigned"}
                  </p>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Members</span>
                  <p className="font-medium mt-1 flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {board.member_count}
                  </p>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Meeting Frequency</span>
                  <p className="font-medium mt-1">
                    {board.meeting_frequency || "Not set"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {boards.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Governance Boards Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first governance board to establish oversight
            </p>
            <Button onClick={() => navigate("/governance/boards/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Board
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
