import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, CreditCard, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const SubscriptionManagement = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", max_projects: "", max_users: "", features: "", is_active: true });
  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  const jsonHeaders = { ...headers, "Content-Type": "application/json" };

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/v1/admin/plans/", { headers });
      if (r.ok) { const d = await r.json(); setPlans(Array.isArray(d) ? d : d.results || []); }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchPlans(); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: "", price: "", max_projects: "", max_users: "", features: "", is_active: true }); setDialogOpen(true); };
  const openEdit = (p: any) => { setEditing(p); setForm({ name: p.name || "", price: String(p.price || p.monthly_price || ""), max_projects: String(p.max_projects || ""), max_users: String(p.max_users || ""), features: p.features || "", is_active: p.is_active !== false }); setDialogOpen(true); };
  const handleSave = async () => {
    if (!form.name) { toast.error("Naam verplicht"); return; }
    setSubmitting(true);
    try {
      const body: any = { name: form.name, is_active: form.is_active };
      if (form.price) body.price = parseFloat(form.price);
      if (form.max_projects) body.max_projects = parseInt(form.max_projects);
      if (form.max_users) body.max_users = parseInt(form.max_users);
      if (form.features) body.features = form.features;
      const url = editing ? `/api/v1/admin/plans/${editing.id}/` : `/api/v1/admin/plans/`;
      const method = editing ? "PATCH" : "POST";
      const r = await fetch(url, { method, headers: jsonHeaders, body: JSON.stringify(body) });
      if (r.ok) { toast.success("Opgeslagen"); setDialogOpen(false); fetchPlans(); } else toast.error("Opslaan mislukt");
    } catch { toast.error("Opslaan mislukt"); } finally { setSubmitting(false); }
  };
  const handleDelete = async (pId: number) => { if (!confirm("Verwijderen?")) return; try { const r = await fetch(`/api/v1/admin/plans/${pId}/`, { method: "DELETE", headers }); if (r.ok || r.status === 204) { toast.success("Verwijderd"); fetchPlans(); } } catch { toast.error("Verwijderen mislukt"); } };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div className="flex items-center gap-3"><CreditCard className="h-6 w-6 text-purple-500" /><h1 className="text-2xl font-bold">Subscription Plans</h1><Badge variant="outline">{plans.length}</Badge></div><Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Add Plan</Button></div>

      {plans.length === 0 ? <Card className="p-8 text-center text-muted-foreground">No plans configured</Card> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{plans.map(p => (
          <Card key={p.id} className={!p.is_active ? "opacity-60" : ""}><CardContent className="p-5">
            <div className="flex items-center justify-between mb-3"><h3 className="text-lg font-bold">{p.name}</h3><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button></div></div>
            <p className="text-3xl font-bold mb-3">€{p.price || p.monthly_price || 0}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            <div className="space-y-1 text-sm">{p.max_projects && <p>Max projects: <strong>{p.max_projects}</strong></p>}{p.max_users && <p>Max users: <strong>{p.max_users}</strong></p>}</div>
            <Badge variant={p.is_active ? "default" : "secondary"} className="mt-3 text-xs">{p.is_active ? "Active" : "Inactive"}</Badge>
          </CardContent></Card>
        ))}</div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Plan</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div><div className="space-y-2"><Label>Price (€/month)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div></div>
          <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Max Projects</Label><Input type="number" value={form.max_projects} onChange={(e) => setForm({ ...form, max_projects: e.target.value })} /></div><div className="space-y-2"><Label>Max Users</Label><Input type="number" value={form.max_users} onChange={(e) => setForm({ ...form, max_users: e.target.value })} /></div></div>
          <div className="space-y-2"><Label>Features</Label><textarea className="w-full min-h-[60px] px-3 py-2 border rounded-md bg-background" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleSave} disabled={submitting}>{submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Save</Button></div>
        </div>
      </DialogContent></Dialog>
    </div>
  );
};

export default SubscriptionManagement;
