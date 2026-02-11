import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Users, Calendar, CheckCircle, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePageTranslations } from '@/hooks/usePageTranslations';

interface Board {
  id: string;
  name: string;
  board_type: string;
  description: string;
  meeting_frequency: string;
  chair_name: string;
  chair_email: string;
  member_count: number;
  is_active: boolean;
  created_at: string;
}

export default function GovernanceBoards() {
  const { pt } = usePageTranslations();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", board_type: "", meeting_frequency: "", is_active: true });
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = localStorage.getItem("access_token");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  useEffect(() => { fetchBoards(); }, []);

  const fetchBoards = async () => {
    try {
      const response = await fetch("/api/v1/governance/boards/", { headers });
      const data = await response.json();
      setBoards(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Error fetching boards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (e: React.MouseEvent, board: Board) => {
    e.stopPropagation();
    setEditingBoard(board);
    setEditForm({ name: board.name, description: board.description || "", board_type: board.board_type, meeting_frequency: board.meeting_frequency || "", is_active: board.is_active });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingBoard) return;
    try {
      const res = await fetch(`/api/v1/governance/boards/${editingBoard.id}/`, { method: "PATCH", headers, body: JSON.stringify(editForm) });
      if (!res.ok) throw new Error("Failed");
      toast({ title: "Updated", description: "Board updated successfully." });
      setEditModalOpen(false);
      fetchBoards();
    } catch {
      toast({ title: "Error", description: "Failed to update.", variant: "destructive" });
    }
  };

  const handleDelete = async (e: React.MouseEvent, board: Board) => {
    e.stopPropagation();
    if (!confirm(`Delete board "${board.name}"?`)) return;
    try {
      await fetch(`/api/v1/governance/boards/${board.id}/`, { method: "DELETE", headers });
      toast({ title: "Deleted", description: `${board.name} has been removed.` });
      fetchBoards();
    } catch {
      toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
    }
  };

  const getBoardTypeLabel = (type: string) => {
    const labels: Record<string, string> = { steering_committee: "Steering Committee", program_board: "Program Board", project_board: "Project Board", advisory_board: "Advisory Board", executive_board: "Executive Board" };
    return labels[type] || type;
  };

  const getBoardTypeColor = (type: string) => {
    const colors: Record<string, string> = { steering_committee: "bg-purple-100 text-purple-800", program_board: "bg-blue-100 text-blue-800", project_board: "bg-green-100 text-green-800", advisory_board: "bg-orange-100 text-orange-800", executive_board: "bg-red-100 text-red-800" };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="text-muted-foreground">Loading boards...</div></div>;

  const activeBoards = boards.filter(b => b.is_active);
  const boardsByType = boards.reduce((acc, board) => { acc[board.board_type] = (acc[board.board_type] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Users className="h-8 w-8" /> Governance Boards</h1>
          <p className="text-muted-foreground mt-1">Steering committees, program boards, and advisory panels</p>
        </div>
        <Button onClick={() => navigate("/governance/boards/new")}><Plus className="h-4 w-4 mr-2" /> New Board</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Boards</p><p className="text-2xl font-bold mt-1">{boards.length}</p></div><Users className="h-8 w-8 text-blue-600" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Active Boards</p><p className="text-2xl font-bold mt-1">{activeBoards.length}</p></div><CheckCircle className="h-8 w-8 text-green-600" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Members</p><p className="text-2xl font-bold mt-1">{boards.reduce((sum, b) => sum + b.member_count, 0)}</p></div><Users className="h-8 w-8 text-purple-600" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Steering Committees</p><p className="text-2xl font-bold mt-1">{boardsByType.steering_committee || 0}</p></div><Calendar className="h-8 w-8 text-orange-600" /></div></CardContent></Card>
      </div>

      <div className="space-y-4">
        {boards.map((board) => (
          <Card key={board.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/governance/boards/${board.id}`)}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl">{board.name}</CardTitle>
                    <Badge className={getBoardTypeColor(board.board_type)}>{getBoardTypeLabel(board.board_type)}</Badge>
                    {!board.is_active && <Badge variant="outline">{pt("Inactive")}</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{board.description || "No description"}</p>
                </div>
                <div className="flex gap-1 ml-4">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleEdit(e, board)}><Pencil className="h-4 w-4 text-gray-500" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleDelete(e, board)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div><span className="text-muted-foreground">Chair</span><p className="font-medium mt-1">{board.chair_name || board.chair_email || "Not assigned"}</p></div>
                <div><span className="text-muted-foreground">{pt("Members")}</span><p className="font-medium mt-1 flex items-center gap-1"><Users className="h-4 w-4" />{board.member_count}</p></div>
                <div><span className="text-muted-foreground">Meeting Frequency</span><p className="font-medium mt-1">{board.meeting_frequency || "Not set"}</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {boards.length === 0 && (
        <Card><CardContent className="p-12 text-center"><Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold mb-2">No Governance Boards Yet</h3><p className="text-muted-foreground mb-4">Create your first governance board to establish oversight</p><Button onClick={() => navigate("/governance/boards/new")}><Plus className="h-4 w-4 mr-2" /> Create Board</Button></CardContent></Card>
      )}

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit Board: {editingBoard?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid gap-2"><Label>{pt("Name")}</Label><Input value={editForm.name} onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="grid gap-2"><Label>{pt("Description")}</Label><Textarea value={editForm.description} onChange={(e) => setEditForm(p => ({ ...p, description: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Board Type</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editForm.board_type} onChange={(e) => setEditForm(p => ({ ...p, board_type: e.target.value }))}>
                  <option value="steering_committee">Steering Committee</option>
                  <option value="program_board">Program Board</option>
                  <option value="project_board">{pt("Project Board")}</option>
                  <option value="advisory_board">Advisory Board</option>
                  <option value="executive_board">Executive Board</option>
                </select>
              </div>
              <div className="grid gap-2"><Label>Meeting Frequency</Label><Input value={editForm.meeting_frequency} onChange={(e) => setEditForm(p => ({ ...p, meeting_frequency: e.target.value }))} placeholder="e.g. Weekly, Monthly" /></div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={editForm.is_active} onChange={(e) => setEditForm(p => ({ ...p, is_active: e.target.checked }))} className="rounded" />
              <Label>{pt("Active")}</Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>{pt("Cancel")}</Button>
              <Button onClick={handleSaveEdit} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">{pt("Save Changes")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
