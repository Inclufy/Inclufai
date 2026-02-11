import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectHeader } from "@/components/ProjectHeader";
import { usePageTranslations } from "@/hooks/usePageTranslations";
import { Loader2, TrendingUp, RefreshCw } from "lucide-react";

const KanbanCFD = () => {
  const { pt } = usePageTranslations();
  const { id } = useParams<{ id: string }>();
  const [cfd, setCfd] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token"); const headers: Record<string, string> = { Authorization: `Bearer ${token}` };

  const fetchData = async () => { try { const r = await fetch(`/api/v1/projects/${id}/kanban/metrics/cfd/`, { headers }); if (r.ok) { const d = await r.json(); setCfd(Array.isArray(d) ? d : d.data || d.results || []); } } catch (err) { console.error(err); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, [id]);

  if (loading) return (<div className="min-h-full bg-background"><ProjectHeader /><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div></div>);

  const colors = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"];

  return (
    <div className="min-h-full bg-background"><ProjectHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between"><div className="flex items-center gap-3"><TrendingUp className="h-6 w-6 text-indigo-500" /><h1 className="text-2xl font-bold">Cumulative Flow Diagram</h1></div><Button variant="outline" onClick={fetchData} className="gap-2"><RefreshCw className="h-4 w-4" /> {pt("Refresh")}</Button></div>
        {cfd.length === 0 ? <Card className="p-8 text-center"><TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold">No CFD data yet</h3><p className="text-muted-foreground">Record daily metrics to generate CFD</p></Card> : (
          <Card><CardHeader><CardTitle>Flow Over Time</CardTitle></CardHeader>
            <CardContent><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left p-2">Date</th>{Object.keys(cfd[0]).filter(k => k !== "date" && k !== "id").map((col, i) => <th key={col} className="text-right p-2" style={{ color: colors[i % colors.length] }}>{col}</th>)}</tr></thead><tbody>{cfd.slice(-30).map((row, ri) => (<tr key={ri} className="border-b hover:bg-muted/50"><td className="p-2">{row.date}</td>{Object.entries(row).filter(([k]) => k !== "date" && k !== "id").map(([k, v], i) => <td key={k} className="text-right p-2 font-medium" style={{ color: colors[i % colors.length] }}>{String(v)}</td>)}</tr>))}</tbody></table></div></CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default KanbanCFD;
