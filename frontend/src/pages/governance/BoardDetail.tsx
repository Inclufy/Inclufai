import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Shield, Users, Trash2, Plus, Calendar, X, Pencil } from "lucide-react";
import { usePageTranslations } from '@/hooks/usePageTranslations';

interface Board {
  id: string;
  name: string;
  description: string;
  board_type: string;
  meeting_frequency: string;
  is_active: boolean;
  chair_name: string | null;
  chair_email: string | null;
  members: any[];
  member_count: number;
  portfolio: string | null;
  created_at: string;
}

interface TeamUser { id: number; email: string; first_name: string; last_name: string; }

const boardTypeLabels: Record<string, string> = { steering_committee: "Steering Committee", program_board: "Program Board", project_board: "Project Board", advisory_board: "Advisory Board", executive_board: "Executive Board" };
const memberRoleLabels: Record<string, string> = { chair: "Chair", member: "Member", secretary: "Secretary", observer: "Observer" };

const BoardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { pt } = usePageTranslations();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [memberRole, setMemberRole] = useState("member");
  const [addingMember, setAddingMember] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", description: "", board_type: "", meeting_frequency: "", is_active: true });

  const token = localStorage.getItem("access_token");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  useEffect(() => { fetchBoard(); }, [id]);

  const fetchBoard = async () => {
    try { const res = await fetch(`/api/v1/governance/boards/${id}/`, { headers }); if (!res.ok) throw new Error("Not found"); setBoard(await res.json()); } catch { toast({ title: "Error", description: "Board not found.", variant: "destructive" }); navigate("/governance/boards"); } finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try { const res = await fetch("/api/v1/auth/admin/users/", { headers }); if (res.ok) { const data = await res.json(); setUsers(Array.isArray(data) ? data : data.results || []); } } catch { try { const res = await fetch("/api/v1/auth/company-users/", { headers }); if (res.ok) { const data = await res.json(); setUsers(Array.isArray(data) ? data : data.results || []); } } catch {} }
  };

  const handleAddMember = async () => {
    if (!selectedUser) return;
    setAddingMember(true);
    try {
      const res = await fetch("/api/v1/governance/board-members/", { method: "POST", headers, body: JSON.stringify({ board: id, user: parseInt(selectedUser), role: memberRole }) });
      if (!res.ok) { const err = await res.json(); throw new Error(JSON.stringify(err)); }
      toast({ title: "Member Added", description: "Board member added successfully." });
      setShowAddMember(false); setSelectedUser(""); setMemberRole("member"); fetchBoard();
    } catch (e: any) { toast({ title: "Error", description: e.message || "Failed to add member.", variant: "destructive" }); } finally { setAddingMember(false); }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Remove this member?")) return;
    try { await fetch(`/api/v1/governance/board-members/${memberId}/`, { method: "DELETE", headers }); toast({ title: "Removed", description: "Member removed." }); fetchBoard(); } catch { toast({ title: "Error", description: "Failed to remove.", variant: "destructive" }); }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this board?")) return;
    try { const res = await fetch(`/api/v1/governance/boards/${id}/`, { method: "DELETE", headers }); if (res.ok) { toast({ title: "Deleted", description: "Board removed." }); navigate("/governance/boards"); } } catch { toast({ title: "Error", description: "Failed to delete.", variant: "destructive" }); }
  };

  const openEditModal = () => {
  const { pt } = usePageTranslations();
    if (!board) return;
    setEditForm({ name: board.name, description: board.description || "", board_type: board.board_type, meeting_frequency: board.meeting_frequency || "", is_active: board.is_active });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`/api/v1/governance/boards/${id}/`, { method: "PATCH", headers, body: JSON.stringify(editForm) });
      if (!res.ok) throw new Error("Failed");
      toast({ title: "Updated", description: "Board updated successfully." });
      setEditModalOpen(false); fetchBoard();
    } catch { toast({ title: "Error", description: "Failed to update.", variant: "destructive" }); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" /></div>;
  if (!board) return null;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/governance/boards")}><ArrowLeft className="w-4 h-4 mr-2" /> Back to Boards</Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={openEditModal}><Pencil className="w-4 h-4 mr-2" /> Edit</Button>
          <Button variant="outline" size="sm" onClick={handleDelete}><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><Shield className="w-6 h-6 text-blue-600" /></div>
            <div><CardTitle className="text-2xl">{board.name}</CardTitle><div className="flex gap-2 mt-1"><Badge>{boardTypeLabels[board.board_type] || board.board_type}</Badge><Badge variant={board.is_active ? "default" : "secondary"}>{board.is_active ? "Active" : "Inactive"}</Badge></div></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {board.description && <div><h3 className="font-semibold text-sm text-gray-500 mb-1">{pt("Description")}</h3><p className="text-gray-700">{board.description}</p></div>}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center"><Users className="w-5 h-5 mx-auto text-blue-600 mb-1" /><p className="text-sm text-gray-500">Chair</p><p className="font-semibold text-sm">{board.chair_name || "Not assigned"}</p></div>
            <div className="text-center"><Users className="w-5 h-5 mx-auto text-purple-600 mb-1" /><p className="text-sm text-gray-500">{pt("Members")}</p><p className="font-semibold">{board.member_count}</p></div>
            <div className="text-center"><Calendar className="w-5 h-5 mx-auto text-green-600 mb-1" /><p className="text-sm text-gray-500">Meeting Frequency</p><p className="font-semibold text-sm">{board.meeting_frequency || "Not set"}</p></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><div className="flex items-center justify-between"><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-purple-600" /> Board Members</CardTitle><Button size="sm" onClick={() => { setShowAddMember(true); fetchUsers(); }}><Plus className="w-4 h-4 mr-2" /> Add Member</Button></div></CardHeader>
        <CardContent>
          {showAddMember && (
            <div className="mb-6 p-4 border-2 border-purple-200 rounded-lg bg-purple-50/50 space-y-4">
              <div className="flex items-center justify-between"><h4 className="font-semibold text-purple-700">Add New Member</h4><Button variant="ghost" size="sm" onClick={() => setShowAddMember(false)}><X className="w-4 h-4" /></Button></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>User</Label><Select value={selectedUser} onValueChange={setSelectedUser}><SelectTrigger><SelectValue placeholder="Select a user" /></SelectTrigger><SelectContent>{users.map((u) => (<SelectItem key={u.id} value={u.id.toString()}>{u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : u.email}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-2"><Label>{pt("Role")}</Label><Select value={memberRole} onValueChange={setMemberRole}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="chair">Chair</SelectItem><SelectItem value="member">{pt("Member")}</SelectItem><SelectItem value="secretary">Secretary</SelectItem><SelectItem value="observer">Observer</SelectItem></SelectContent></Select></div>
              </div>
              <Button onClick={handleAddMember} disabled={!selectedUser || addingMember} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">{addingMember ? "Adding..." : "Add to Board"}</Button>
            </div>
          )}
          {board.members.length === 0 && !showAddMember ? <p className="text-gray-500 text-center py-8">No members yet. Click "Add Member" to get started.</p> : (
            <div className="space-y-3">{board.members.map((member: any) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div><h4 className="font-medium">{member.user_name || member.user_email}</h4><p className="text-sm text-gray-500">{memberRoleLabels[member.role] || member.role}</p></div>
                <div className="flex items-center gap-2"><Badge variant={member.role === "chair" ? "default" : "outline"}>{memberRoleLabels[member.role] || member.role}</Badge><Button variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id)}><Trash2 className="w-3 h-3 text-red-500" /></Button></div>
              </div>
            ))}</div>
          )}
        </CardContent>
      </Card>

      <div className="text-xs text-gray-400">Created: {new Date(board.created_at).toLocaleDateString()}</div>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit Board</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid gap-2"><Label>{pt("Name")}</Label><Input value={editForm.name} onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="grid gap-2"><Label>{pt("Description")}</Label><Textarea value={editForm.description} onChange={(e) => setEditForm(p => ({ ...p, description: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Board Type</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editForm.board_type} onChange={(e) => setEditForm(p => ({ ...p, board_type: e.target.value }))}>
                  <option value="steering_committee">Steering Committee</option><option value="program_board">Program Board</option><option value="project_board">{pt("Project Board")}</option><option value="advisory_board">Advisory Board</option><option value="executive_board">Executive Board</option>
                </select>
              </div>
              <div className="grid gap-2"><Label>Meeting Frequency</Label><Input value={editForm.meeting_frequency} onChange={(e) => setEditForm(p => ({ ...p, meeting_frequency: e.target.value }))} placeholder="e.g. Weekly, Monthly" /></div>
            </div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={editForm.is_active} onChange={(e) => setEditForm(p => ({ ...p, is_active: e.target.checked }))} className="rounded" /><Label>{pt("Active")}</Label></div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>{pt("Cancel")}</Button>
              <Button onClick={handleSaveEdit} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">{pt("Save Changes")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoardDetail;
