import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectHeader } from "@/components/ProjectHeader";
import { usePageTranslations } from "@/hooks/usePageTranslations";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Pencil, Trash2, TableProperties } from "lucide-react";
import { toast } from "sonner";

const BASE = (id: string) => `/api/v1/sixsigma/projects/${id}/sixsigma`;

const SixSigmaSIPOC = () => {
  const { pt } = usePageTranslations();
  const { id } = useParams<{ id: string }>();
  const [diagrams, setDiagrams] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"diagram" | "item">("diagram");
  const [editing, setEditing] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [dForm, setDForm] = useState({ title: "", process_name: "", description: "" });
  const [iForm, setIForm] = useState({ diagram: "", category: "supplier", name: "", description: "", order: "" });
  const token = localStorage.getItem("access_token"); const headers: Record<string, string> = { Authorization: `Bearer ${token}` }; const jsonHeaders = { ...headers, "Content-Type": "application/json" };

  const fetchData = async () => { try { const [dRes, iRes] = await Promise.all([fetch(`${BASE(id!)}/sipoc/`, { headers }), fetch(`${BASE(id!)}/sipoc-items/`, { headers })]); if (dRes.ok) { const d = await dRes.json(); setDiagrams(Array.isArray(d) ? d : d.results || []); } if (iRes.ok) { const d = await iRes.json(); setItems(Array.isArray(d) ? d : d.results || []); } } catch (err) { console.error(err); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, [id]);

  const openCreateDiagram = () => { setDialogType("diagram"); setEditing(null); setDForm({ title: "", process_name: "", description: "" }); setDialogOpen(true); };
  const openEditDiagram = (d: any) => { setDialogType("diagram"); setEditing(d); setDForm({ title: d.title || "", process_name: d.process_name || "", description: d.description || "" }); setDialogOpen(true); };
  const openCreateItem = (diagramId?: number) => { setDialogType("item"); setEditing(null); setIForm({ diagram: String(diagramId || diagrams[0]?.id || ""), category: "supplier", name: "", description: "", order: "" }); setDialogOpen(true); };
  const openEditItem = (i: any) => { setDialogType("item"); setEditing(i); setIForm({ diagram: String(i.diagram || ""), category: i.category || "supplier", name: i.name || "", description: i.description || "", order: String(i.order || "") }); setDialogOpen(true); };

  const handleSaveDiagram = async () => { if (!dForm.title) { toast.error("Titel verplicht"); return; } setSubmitting(true); try { const url = editing ? `${BASE(id!)}/sipoc/${editing.id}/` : `${BASE(id!)}/sipoc/`; const method = editing ? "PATCH" : "POST"; const r = await fetch(url, { method, headers: jsonHeaders, body: JSON.stringify(dForm) }); if (r.ok) { toast.success("Opgeslagen"); setDialogOpen(false); fetchData(); } else toast.error("Opslaan mislukt"); } catch { toast.error("Opslaan mislukt"); } finally { setSubmitting(false); } };
  const handleSaveItem = async () => { if (!iForm.name) { toast.error("Naam verplicht"); return; } setSubmitting(true); try { const body: any = { ...iForm }; if (iForm.diagram) body.diagram = parseInt(iForm.diagram); if (iForm.order) body.order = parseInt(iForm.order); else delete body.order; const url = editing ? `${BASE(id!)}/sipoc-items/${editing.id}/` : `${BASE(id!)}/sipoc-items/`; const method = editing ? "PATCH" : "POST"; const r = await fetch(url, { method, headers: jsonHeaders, body: JSON.stringify(body) }); if (r.ok) { toast.success("Opgeslagen"); setDialogOpen(false); fetchData(); } else toast.error("Opslaan mislukt"); } catch { toast.error("Opslaan mislukt"); } finally { setSubmitting(false); } };
  const deleteDiagram = async (dId: number) => { if (!confirm("Verwijderen?")) return; try { const r = await fetch(`${BASE(id!)}/sipoc/${dId}/`, { method: "DELETE", headers }); if (r.ok || r.status === 204) { toast.success("Verwijderd"); fetchData(); } } catch { toast.error("Verwijderen mislukt"); } };
  const deleteItem = async (iId: number) => { if (!confirm("Verwijderen?")) return; try { const r = await fetch(`${BASE(id!)}/sipoc-items/${iId}/`, { method: "DELETE", headers }); if (r.ok || r.status === 204) { toast.success("Verwijderd"); fetchData(); } } catch { toast.error("Verwijderen mislukt"); } };

  const catColors: Record<string, string> = { supplier: "bg-blue-100 text-blue-700", input: "bg-green-100 text-green-700", process: "bg-yellow-100 text-yellow-700", output: "bg-orange-100 text-orange-700", customer: "bg-red-100 text-red-700" };
  const categories = ["supplier", "input", "process", "output", "customer"];

  if (loading) return (<div className="min-h-full bg-background"><ProjectHeader /><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div></div>);

  return (
    <div className="min-h-full bg-background"><ProjectHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between"><div className="flex items-center gap-3"><TableProperties className="h-6 w-6 text-blue-500" /><h1 className="text-2xl font-bold">SIPOC Diagram</h1></div><div className="flex gap-2"><Button variant="outline" onClick={() => openCreateItem()}><Plus className="h-4 w-4 mr-1" /> Item</Button><Button onClick={openCreateDiagram}><Plus className="h-4 w-4 mr-1" /> Diagram</Button></div></div>

        {diagrams.length === 0 ? <Card className="p-8 text-center"><TableProperties className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold">No SIPOC diagrams yet</h3></Card> : (
          diagrams.map(diag => {
            const diagItems = items.filter(i => i.diagram === diag.id);
            return (
              <Card key={diag.id}>
                <CardHeader className="pb-2"><div className="flex items-center justify-between"><CardTitle>{diag.title}</CardTitle><div className="flex gap-1"><Button variant="outline" size="sm" onClick={() => openCreateItem(diag.id)}><Plus className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" onClick={() => openEditDiagram(diag)}><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" onClick={() => deleteDiagram(diag.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button></div></div>{diag.process_name && <p className="text-sm text-muted-foreground">Process: {diag.process_name}</p>}</CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    {categories.map(cat => (
                      <div key={cat}><div className={`text-center text-xs font-bold py-1 rounded-t ${catColors[cat]}`}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</div>
                        <div className="border rounded-b p-2 min-h-[80px] space-y-1">{diagItems.filter(i => i.category === cat).map(i => (
                          <div key={i.id} className="text-xs p-1.5 bg-muted/50 rounded flex items-center justify-between group"><span>{i.name}</span><div className="opacity-0 group-hover:opacity-100 flex gap-0.5"><button onClick={() => openEditItem(i)} className="hover:text-blue-500"><Pencil className="h-3 w-3" /></button><button onClick={() => deleteItem(i.id)} className="hover:text-red-500"><Trash2 className="h-3 w-3" /></button></div></div>
                        ))}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? pt("Edit") : pt("Add")} {dialogType === "diagram" ? "SIPOC Diagram" : "SIPOC Item"}</DialogTitle></DialogHeader>
        {dialogType === "diagram" ? (
          <div className="space-y-4"><div className="space-y-2"><Label>{pt("Title")} *</Label><Input value={dForm.title} onChange={(e) => setDForm({ ...dForm, title: e.target.value })} /></div><div className="space-y-2"><Label>Process Name</Label><Input value={dForm.process_name} onChange={(e) => setDForm({ ...dForm, process_name: e.target.value })} /></div><div className="space-y-2"><Label>{pt("Description")}</Label><textarea className="w-full min-h-[60px] px-3 py-2 border rounded-md bg-background" value={dForm.description} onChange={(e) => setDForm({ ...dForm, description: e.target.value })} /></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setDialogOpen(false)}>{pt("Cancel")}</Button><Button onClick={handleSaveDiagram} disabled={submitting}>{submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{pt("Save")}</Button></div></div>
        ) : (
          <div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Diagram</Label><Select value={iForm.diagram} onValueChange={(v) => setIForm({ ...iForm, diagram: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{diagrams.map(d => <SelectItem key={d.id} value={d.id.toString()}>{d.title}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>{pt("Category")} *</Label><Select value={iForm.category} onValueChange={(v) => setIForm({ ...iForm, category: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}</SelectContent></Select></div></div><div className="space-y-2"><Label>{pt("Name")} *</Label><Input value={iForm.name} onChange={(e) => setIForm({ ...iForm, name: e.target.value })} /></div><div className="space-y-2"><Label>{pt("Description")}</Label><textarea className="w-full min-h-[40px] px-3 py-2 border rounded-md bg-background" value={iForm.description} onChange={(e) => setIForm({ ...iForm, description: e.target.value })} /></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setDialogOpen(false)}>{pt("Cancel")}</Button><Button onClick={handleSaveItem} disabled={submitting}>{submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{pt("Save")}</Button></div></div>
        )}
      </DialogContent></Dialog>
    </div>
  );
};

export default SixSigmaSIPOC;
