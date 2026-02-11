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
import { Loader2, Plus, Ruler, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const BASE = (id: string) => `/api/v1/sixsigma/projects/${id}/sixsigma`;

const SixSigmaMSA = () => {
  const { pt } = usePageTranslations();
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ measurement_system: "", study_type: "gage_rr", result: "", repeatability: "", reproducibility: "", total_grr: "", status: "planned" });
  const token = localStorage.getItem("access_token"); const headers: Record<string, string> = { Authorization: `Bearer ${token}` }; const jsonHeaders = { ...headers, "Content-Type": "application/json" };

  const fetchData = async () => { try { const r = await fetch(`${BASE(id!)}/msa/`, { headers }); if (r.ok) { const d = await r.json(); setItems(Array.isArray(d) ? d : d.results || []); } } catch (err) { console.error(err); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, [id]);
  const openCreate = () => { setEditing(null); setForm({ measurement_system: "", study_type: "gage_rr", result: "", repeatability: "", reproducibility: "", total_grr: "", status: "planned" }); setDialogOpen(true); };
  const openEdit = (i: any) => { setEditing(i); setForm({ measurement_system: i.measurement_system || "", study_type: i.study_type || "gage_rr", result: i.result || "", repeatability: String(i.repeatability || ""), reproducibility: String(i.reproducibility || ""), total_grr: String(i.total_grr || ""), status: i.status || "planned" }); setDialogOpen(true); };
  const handleSave = async () => { if (!form.measurement_system) { toast.error("Measurement system verplicht"); return; } setSubmitting(true); try { const body: any = { ...form }; if (form.repeatability) body.repeatability = parseFloat(form.repeatability); else delete body.repeatability; if (form.reproducibility) body.reproducibility = parseFloat(form.reproducibility); else delete body.reproducibility; if (form.total_grr) body.total_grr = parseFloat(form.total_grr); else delete body.total_grr; const url = editing ? `${BASE(id!)}/msa/${editing.id}/` : `${BASE(id!)}/msa/`; const method = editing ? "PATCH" : "POST"; const r = await fetch(url, { method, headers: jsonHeaders, body: JSON.stringify(body) }); if (r.ok) { toast.success("Opgeslagen"); setDialogOpen(false); fetchData(); } else toast.error("Opslaan mislukt"); } catch { toast.error("Opslaan mislukt"); } finally { setSubmitting(false); } };
  const handleDelete = async (mId: number) => { if (!confirm("Verwijderen?")) return; try { await fetch(`${BASE(id!)}/msa/${mId}/`, { method: "DELETE", headers }); toast.success("Verwijderd"); fetchData(); } catch { toast.error("Verwijderen mislukt"); } };
  const grrColor = (v: number) => v <= 10 ? "text-green-600" : v <= 30 ? "text-yellow-600" : "text-red-600";
  if (loading) return (<div className="min-h-full bg-background"><ProjectHeader /><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div></div>);
  return (
    <div className="min-h-full bg-background"><ProjectHeader /><div className="p-6 space-y-6">
      <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Ruler className="h-6 w-6 text-green-500" /><h1 className="text-2xl font-bold">Measurement System Analysis</h1><Badge variant="outline">{items.length}</Badge></div><Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> {pt("Add")}</Button></div>
      {items.length === 0 ? <Card className="p-8 text-center"><Ruler className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold">No MSA studies yet</h3></Card> : (
        <div className="space-y-3">{items.map(i => (<Card key={i.id}><CardContent className="p-4 flex items-center justify-between"><div><div className="flex items-center gap-2 mb-1"><span className="font-medium">{i.measurement_system}</span><Badge variant="outline" className="text-xs">{i.study_type?.replace("_", " ")}</Badge><Badge variant={i.status === "completed" ? "default" : "secondary"} className="text-xs">{i.status}</Badge></div><div className="flex gap-4 text-sm">{i.repeatability != null && <span>Repeat: <strong>{i.repeatability}%</strong></span>}{i.reproducibility != null && <span>Reprod: <strong>{i.reproducibility}%</strong></span>}{i.total_grr != null && <span>GRR: <strong className={grrColor(i.total_grr)}>{i.total_grr}%</strong></span>}</div></div><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => openEdit(i)}><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" onClick={() => handleDelete(i.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button></div></CardContent></Card>))}</div>
      )}
    </div>
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? pt("Edit") : pt("Add")} MSA Study</DialogTitle></DialogHeader><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Measurement System *</Label><Input value={form.measurement_system} onChange={(e) => setForm({ ...form, measurement_system: e.target.value })} /></div><div className="space-y-2"><Label>Study Type</Label><Select value={form.study_type} onValueChange={(v) => setForm({ ...form, study_type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="gage_rr">Gage R&R</SelectItem><SelectItem value="bias">Bias</SelectItem><SelectItem value="linearity">Linearity</SelectItem><SelectItem value="stability">Stability</SelectItem></SelectContent></Select></div></div><div className="grid grid-cols-3 gap-3"><div className="space-y-2"><Label>Repeatability %</Label><Input type="number" value={form.repeatability} onChange={(e) => setForm({ ...form, repeatability: e.target.value })} /></div><div className="space-y-2"><Label>Reproducibility %</Label><Input type="number" value={form.reproducibility} onChange={(e) => setForm({ ...form, reproducibility: e.target.value })} /></div><div className="space-y-2"><Label>Total GRR %</Label><Input type="number" value={form.total_grr} onChange={(e) => setForm({ ...form, total_grr: e.target.value })} /></div></div><div className="space-y-2"><Label>Result / Conclusion</Label><textarea className="w-full min-h-[40px] px-3 py-2 border rounded-md bg-background" value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} /></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setDialogOpen(false)}>{pt("Cancel")}</Button><Button onClick={handleSave} disabled={submitting}>{submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{pt("Save")}</Button></div></div></DialogContent></Dialog>
    </div>
  );
};
export default SixSigmaMSA;
