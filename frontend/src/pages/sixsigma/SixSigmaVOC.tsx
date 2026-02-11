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
import { Loader2, Plus, MessageSquare, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const BASE = (id: string) => `/api/v1/sixsigma/projects/${id}/sixsigma`;

const SixSigmaVOC = () => {
  const { pt } = usePageTranslations();
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ customer_segment: "", need: "", requirement: "", priority: "medium", source: "", ctq: "" });
  const token = localStorage.getItem("access_token"); const headers: Record<string, string> = { Authorization: `Bearer ${token}` }; const jsonHeaders = { ...headers, "Content-Type": "application/json" };

  const fetchData = async () => { try { const r = await fetch(`${BASE(id!)}/voc/`, { headers }); if (r.ok) { const d = await r.json(); setItems(Array.isArray(d) ? d : d.results || []); } } catch (err) { console.error(err); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, [id]);

  const openCreate = () => { setEditing(null); setForm({ customer_segment: "", need: "", requirement: "", priority: "medium", source: "", ctq: "" }); setDialogOpen(true); };
  const openEdit = (i: any) => { setEditing(i); setForm({ customer_segment: i.customer_segment || "", need: i.need || "", requirement: i.requirement || "", priority: i.priority || "medium", source: i.source || "", ctq: i.ctq || "" }); setDialogOpen(true); };
  const handleSave = async () => { if (!form.need) { toast.error("Need verplicht"); return; } setSubmitting(true); try { const url = editing ? `${BASE(id!)}/voc/${editing.id}/` : `${BASE(id!)}/voc/`; const method = editing ? "PATCH" : "POST"; const r = await fetch(url, { method, headers: jsonHeaders, body: JSON.stringify(form) }); if (r.ok) { toast.success("Opgeslagen"); setDialogOpen(false); fetchData(); } else toast.error("Opslaan mislukt"); } catch { toast.error("Opslaan mislukt"); } finally { setSubmitting(false); } };
  const handleDelete = async (vId: number) => { if (!confirm("Verwijderen?")) return; try { const r = await fetch(`${BASE(id!)}/voc/${vId}/`, { method: "DELETE", headers }); if (r.ok || r.status === 204) { toast.success("Verwijderd"); fetchData(); } } catch { toast.error("Verwijderen mislukt"); } };

  const prioColors: Record<string, string> = { critical: "bg-red-100 text-red-700", high: "bg-orange-100 text-orange-700", medium: "bg-yellow-100 text-yellow-700", low: "bg-green-100 text-green-700" };

  if (loading) return (<div className="min-h-full bg-background"><ProjectHeader /><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div></div>);

  return (
    <div className="min-h-full bg-background"><ProjectHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between"><div className="flex items-center gap-3"><MessageSquare className="h-6 w-6 text-blue-500" /><h1 className="text-2xl font-bold">Voice of Customer</h1><Badge variant="outline">{items.length}</Badge></div><Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> {pt("Add")}</Button></div>
        {items.length === 0 ? <Card className="p-8 text-center"><MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold">No VOC entries yet</h3></Card> : (
          <div className="space-y-2">{items.map(i => (
            <Card key={i.id}><CardContent className="p-4 flex items-center justify-between"><div className="flex-1"><div className="flex items-center gap-2 mb-1">{i.customer_segment && <Badge variant="outline" className="text-xs">{i.customer_segment}</Badge>}<span className="font-medium">{i.need}</span><Badge className={`text-xs ${prioColors[i.priority] || ""}`}>{i.priority}</Badge></div>{i.requirement && <p className="text-sm text-muted-foreground">CTQ: {i.requirement}</p>}{i.ctq && <p className="text-xs text-muted-foreground">CTQ Metric: {i.ctq}</p>}</div><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => openEdit(i)}><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" onClick={() => handleDelete(i.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button></div></CardContent></Card>
          ))}</div>
        )}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? pt("Edit") : pt("Add")} VOC Entry</DialogTitle></DialogHeader>
        <div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Customer Segment</Label><Input value={form.customer_segment} onChange={(e) => setForm({ ...form, customer_segment: e.target.value })} /></div><div className="space-y-2"><Label>{pt("Priority")}</Label><Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="critical">Critical</SelectItem></SelectContent></Select></div></div><div className="space-y-2"><Label>Customer Need *</Label><textarea className="w-full min-h-[60px] px-3 py-2 border rounded-md bg-background" value={form.need} onChange={(e) => setForm({ ...form, need: e.target.value })} /></div><div className="space-y-2"><Label>Requirement / CTQ</Label><Input value={form.requirement} onChange={(e) => setForm({ ...form, requirement: e.target.value })} /></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Source</Label><Input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} /></div><div className="space-y-2"><Label>CTQ Metric</Label><Input value={form.ctq} onChange={(e) => setForm({ ...form, ctq: e.target.value })} /></div></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setDialogOpen(false)}>{pt("Cancel")}</Button><Button onClick={handleSave} disabled={submitting}>{submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{pt("Save")}</Button></div></div>
      </DialogContent></Dialog>
    </div>
  );
};

export default SixSigmaVOC;
