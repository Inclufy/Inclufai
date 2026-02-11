import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectHeader } from "@/components/ProjectHeader";
import { usePageTranslations } from "@/hooks/usePageTranslations";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Lightbulb, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const BASE = (id: string) => `/api/v1/sixsigma/projects/${id}/sixsigma`;

const SixSigmaSolutions = () => {
  const { pt } = usePageTranslations();
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", impact_score: "", effort_score: "", cost_estimate: "", status: "proposed" });
  const token = localStorage.getItem("access_token"); const headers: Record<string, string> = { Authorization: `Bearer ${token}` }; const jsonHeaders = { ...headers, "Content-Type": "application/json" };

  const fetchData = async () => { try { const r = await fetch(`${BASE(id!)}/solutions/`, { headers }); if (r.ok) { const d = await r.json(); setItems(Array.isArray(d) ? d : d.results || []); } } catch (err) { console.error(err); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, [id]);
  const openCreate = () => { setEditing(null); setForm({ title: "", description: "", impact_score: "", effort_score: "", cost_estimate: "", status: "proposed" }); setDialogOpen(true); };
  const openEdit = (i: any) => { setEditing(i); setForm({ title: i.title || "", description: i.description || "", impact_score: String(i.impact_score || ""), effort_score: String(i.effort_score || ""), cost_estimate: String(i.cost_estimate || ""), status: i.status || "proposed" }); setDialogOpen(true); };
  const handleSave = async () => { if (!form.title) { toast.error("Titel verplicht"); return; } setSubmitting(true); try { const body: any = { title: form.title, description: form.description, status: form.status }; if (form.impact_score) body.impact_score = parseInt(form.impact_score); if (form.effort_score) body.effort_score = parseInt(form.effort_score); if (form.cost_estimate) body.cost_estimate = parseFloat(form.cost_estimate); const url = editing ? `${BASE(id!)}/solutions/${editing.id}/` : `${BASE(id!)}/solutions/`; const r = await fetch(url, { method: editing ? "PATCH" : "POST", headers: jsonHeaders, body: JSON.stringify(body) }); if (r.ok) { toast.success("Opgeslagen"); setDialogOpen(false); fetchData(); } else toast.error("Opslaan mislukt"); } catch { toast.error("Opslaan mislukt"); } finally { setSubmitting(false); } };
  const handleDelete = async (sId: number) => { if (!confirm("Verwijderen?")) return; try { await fetch(`${BASE(id!)}/solutions/${sId}/`, { method: "DELETE", headers }); fetchData(); } catch {} };
  const statusColors: Record<string, string> = { proposed: "bg-blue-100 text-blue-700", selected: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700", implemented: "bg-purple-100 text-purple-700" };
  if (loading) return (<div className="min-h-full bg-background"><ProjectHeader /><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div></div>);
  return (
    <div className="min-h-full bg-background"><ProjectHeader /><div className="p-6 space-y-6">
      <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Lightbulb className="h-6 w-6 text-yellow-500" /><h1 className="text-2xl font-bold">Solutions</h1><Badge variant="outline">{items.length}</Badge></div><Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> {pt("Add")}</Button></div>
      {items.length === 0 ? <Card className="p-8 text-center"><Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold">No solutions yet</h3></Card> : (
        <div className="space-y-2">{items.map(i => (
          <Card key={i.id}><CardContent className="p-4 flex items-center justify-between"><div className="flex-1"><div className="flex items-center gap-2 mb-1"><span className="font-medium">{i.title}</span><Badge className={`text-xs ${statusColors[i.status] || ""}`}>{i.status}</Badge></div>{i.description && <p className="text-sm text-muted-foreground">{i.description}</p>}<div className="flex gap-4 text-xs text-muted-foreground mt-1">{i.impact_score && <span>Impact: {i.impact_score}/10</span>}{i.effort_score && <span>Effort: {i.effort_score}/10</span>}{i.cost_estimate && <span>Cost: €{parseFloat(i.cost_estimate).toLocaleString()}</span>}</div></div><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => openEdit(i)}><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" onClick={() => handleDelete(i.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button></div></CardContent></Card>
        ))}</div>
      )}
    </div>
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? pt("Edit") : pt("Add")} Solution</DialogTitle></DialogHeader><div className="space-y-4"><div className="space-y-2"><Label>{pt("Title")} *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div><div className="space-y-2"><Label>{pt("Description")}</Label><textarea className="w-full min-h-[60px] px-3 py-2 border rounded-md bg-background" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div><div className="grid grid-cols-3 gap-3"><div className="space-y-2"><Label>Impact (1-10)</Label><Input type="number" min="1" max="10" value={form.impact_score} onChange={(e) => setForm({ ...form, impact_score: e.target.value })} /></div><div className="space-y-2"><Label>Effort (1-10)</Label><Input type="number" min="1" max="10" value={form.effort_score} onChange={(e) => setForm({ ...form, effort_score: e.target.value })} /></div><div className="space-y-2"><Label>Cost Estimate</Label><Input type="number" value={form.cost_estimate} onChange={(e) => setForm({ ...form, cost_estimate: e.target.value })} /></div></div><div className="space-y-2"><Label>{pt("Status")}</Label><Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="proposed">Proposed</SelectItem><SelectItem value="selected">Selected</SelectItem><SelectItem value="rejected">Rejected</SelectItem><SelectItem value="implemented">Implemented</SelectItem></SelectContent></Select></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setDialogOpen(false)}>{pt("Cancel")}</Button><Button onClick={handleSave} disabled={submitting}>{submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{pt("Save")}</Button></div></div></DialogContent></Dialog>
    </div>
  );
};
export default SixSigmaSolutions;
