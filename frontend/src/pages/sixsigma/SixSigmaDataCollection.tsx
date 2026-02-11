import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProjectHeader } from "@/components/ProjectHeader";
import { usePageTranslations } from "@/hooks/usePageTranslations";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Database, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const BASE = (id: string) => `/api/v1/sixsigma/projects/${id}/sixsigma`;

const SixSigmaDataCollection = () => {
  const { pt } = usePageTranslations();
  const { id } = useParams<{ id: string }>();
  const [plans, setPlans] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"plan" | "metric">("plan");
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pForm, setPForm] = useState({ title: "", description: "", data_type: "continuous", sampling_method: "", sample_size: "" });
  const [mForm, setMForm] = useState({ plan: "", name: "", target_value: "", unit: "", collected_value: "" });
  const token = localStorage.getItem("access_token"); const headers: Record<string, string> = { Authorization: `Bearer ${token}` }; const jsonHeaders = { ...headers, "Content-Type": "application/json" };

  const fetchData = async () => { try { const [pRes, mRes] = await Promise.all([fetch(`${BASE(id!)}/data-collection/`, { headers }), fetch(`${BASE(id!)}/metrics/`, { headers })]); if (pRes.ok) { const d = await pRes.json(); setPlans(Array.isArray(d) ? d : d.results || []); } if (mRes.ok) { const d = await mRes.json(); setMetrics(Array.isArray(d) ? d : d.results || []); } } catch (err) { console.error(err); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, [id]);

  const openCreatePlan = () => { setDialogType("plan"); setEditing(null); setPForm({ title: "", description: "", data_type: "continuous", sampling_method: "", sample_size: "" }); setDialogOpen(true); };
  const openEditPlan = (p: any) => { setDialogType("plan"); setEditing(p); setPForm({ title: p.title || "", description: p.description || "", data_type: p.data_type || "continuous", sampling_method: p.sampling_method || "", sample_size: String(p.sample_size || "") }); setDialogOpen(true); };
  const openCreateMetric = () => { setDialogType("metric"); setEditing(null); setMForm({ plan: plans[0]?.id?.toString() || "", name: "", target_value: "", unit: "", collected_value: "" }); setDialogOpen(true); };
  const openEditMetric = (m: any) => { setDialogType("metric"); setEditing(m); setMForm({ plan: String(m.plan || ""), name: m.name || "", target_value: String(m.target_value || ""), unit: m.unit || "", collected_value: String(m.collected_value || "") }); setDialogOpen(true); };

  const handleSavePlan = async () => { if (!pForm.title) { toast.error("Titel verplicht"); return; } setSubmitting(true); try { const body: any = { ...pForm }; if (pForm.sample_size) body.sample_size = parseInt(pForm.sample_size); else delete body.sample_size; const url = editing ? `${BASE(id!)}/data-collection/${editing.id}/` : `${BASE(id!)}/data-collection/`; const method = editing ? "PATCH" : "POST"; const r = await fetch(url, { method, headers: jsonHeaders, body: JSON.stringify(body) }); if (r.ok) { toast.success("Opgeslagen"); setDialogOpen(false); fetchData(); } else toast.error("Opslaan mislukt"); } catch { toast.error("Opslaan mislukt"); } finally { setSubmitting(false); } };
  const handleSaveMetric = async () => { if (!mForm.name) { toast.error("Naam verplicht"); return; } setSubmitting(true); try { const body: any = { name: mForm.name, unit: mForm.unit }; if (mForm.plan) body.plan = parseInt(mForm.plan); if (mForm.target_value) body.target_value = parseFloat(mForm.target_value); if (mForm.collected_value) body.collected_value = parseFloat(mForm.collected_value); const url = editing ? `${BASE(id!)}/metrics/${editing.id}/` : `${BASE(id!)}/metrics/`; const method = editing ? "PATCH" : "POST"; const r = await fetch(url, { method, headers: jsonHeaders, body: JSON.stringify(body) }); if (r.ok) { toast.success("Opgeslagen"); setDialogOpen(false); fetchData(); } else toast.error("Opslaan mislukt"); } catch { toast.error("Opslaan mislukt"); } finally { setSubmitting(false); } };
  const deletePlan = async (pId: number) => { if (!confirm("Verwijderen?")) return; try { await fetch(`${BASE(id!)}/data-collection/${pId}/`, { method: "DELETE", headers }); toast.success("Verwijderd"); fetchData(); } catch { toast.error("Verwijderen mislukt"); } };
  const deleteMetric = async (mId: number) => { if (!confirm("Verwijderen?")) return; try { await fetch(`${BASE(id!)}/metrics/${mId}/`, { method: "DELETE", headers }); toast.success("Verwijderd"); fetchData(); } catch { toast.error("Verwijderen mislukt"); } };

  if (loading) return (<div className="min-h-full bg-background"><ProjectHeader /><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div></div>);

  return (
    <div className="min-h-full bg-background"><ProjectHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3"><Database className="h-6 w-6 text-green-500" /><h1 className="text-2xl font-bold">Data Collection</h1></div>
        <div className="flex items-center justify-between"><h2 className="font-semibold">Collection Plans ({plans.length})</h2><Button onClick={openCreatePlan} size="sm" className="gap-2"><Plus className="h-4 w-4" /> Plan</Button></div>
        {plans.length === 0 ? <Card className="p-6 text-center text-muted-foreground">No collection plans yet</Card> : (
          <div className="space-y-2">{plans.map(p => (<Card key={p.id}><CardContent className="p-4 flex items-center justify-between"><div><div className="flex items-center gap-2"><span className="font-medium">{p.title}</span><Badge variant="outline" className="text-xs">{p.data_type}</Badge></div>{p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}</div><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => openEditPlan(p)}><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" onClick={() => deletePlan(p.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button></div></CardContent></Card>))}</div>
        )}
        <div className="flex items-center justify-between"><h2 className="font-semibold">Metrics ({metrics.length})</h2><Button onClick={openCreateMetric} size="sm" className="gap-2"><Plus className="h-4 w-4" /> Metric</Button></div>
        {metrics.length === 0 ? <Card className="p-6 text-center text-muted-foreground">No metrics yet</Card> : (
          <div className="space-y-2">{metrics.map(m => { const pct = m.target_value ? Math.min(((m.collected_value || 0) / m.target_value) * 100, 100) : 0; return (<Card key={m.id}><CardContent className="p-4 flex items-center justify-between"><div className="flex-1"><div className="flex items-center gap-2 mb-1"><span className="font-medium">{m.name}</span>{m.unit && <Badge variant="outline" className="text-xs">{m.unit}</Badge>}</div>{m.target_value && <div className="flex items-center gap-2"><Progress value={pct} className="h-2 w-32" /><span className="text-xs">{m.collected_value || 0}/{m.target_value}</span></div>}</div><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => openEditMetric(m)}><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" onClick={() => deleteMetric(m.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button></div></CardContent></Card>); })}</div>
        )}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? pt("Edit") : pt("Add")} {dialogType === "plan" ? "Collection Plan" : "Metric"}</DialogTitle></DialogHeader>
        {dialogType === "plan" ? (
          <div className="space-y-4"><div className="space-y-2"><Label>{pt("Title")} *</Label><Input value={pForm.title} onChange={(e) => setPForm({ ...pForm, title: e.target.value })} /></div><div className="space-y-2"><Label>{pt("Description")}</Label><textarea className="w-full min-h-[60px] px-3 py-2 border rounded-md bg-background" value={pForm.description} onChange={(e) => setPForm({ ...pForm, description: e.target.value })} /></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Data Type</Label><Select value={pForm.data_type} onValueChange={(v) => setPForm({ ...pForm, data_type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="continuous">Continuous</SelectItem><SelectItem value="discrete">Discrete</SelectItem><SelectItem value="attribute">Attribute</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label>Sample Size</Label><Input type="number" value={pForm.sample_size} onChange={(e) => setPForm({ ...pForm, sample_size: e.target.value })} /></div></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setDialogOpen(false)}>{pt("Cancel")}</Button><Button onClick={handleSavePlan} disabled={submitting}>{submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{pt("Save")}</Button></div></div>
        ) : (
          <div className="space-y-4">{plans.length > 0 && <div className="space-y-2"><Label>Plan</Label><Select value={mForm.plan} onValueChange={(v) => setMForm({ ...mForm, plan: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{plans.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.title}</SelectItem>)}</SelectContent></Select></div>}<div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>{pt("Name")} *</Label><Input value={mForm.name} onChange={(e) => setMForm({ ...mForm, name: e.target.value })} /></div><div className="space-y-2"><Label>Unit</Label><Input value={mForm.unit} onChange={(e) => setMForm({ ...mForm, unit: e.target.value })} /></div></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Target</Label><Input type="number" value={mForm.target_value} onChange={(e) => setMForm({ ...mForm, target_value: e.target.value })} /></div><div className="space-y-2"><Label>Collected</Label><Input type="number" value={mForm.collected_value} onChange={(e) => setMForm({ ...mForm, collected_value: e.target.value })} /></div></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setDialogOpen(false)}>{pt("Cancel")}</Button><Button onClick={handleSaveMetric} disabled={submitting}>{submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{pt("Save")}</Button></div></div>
        )}
      </DialogContent></Dialog>
    </div>
  );
};

export default SixSigmaDataCollection;
