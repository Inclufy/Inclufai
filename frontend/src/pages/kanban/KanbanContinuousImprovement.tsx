import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectHeader } from "@/components/ProjectHeader";
import { usePageTranslations } from "@/hooks/usePageTranslations";
import { Loader2, TrendingUp, RefreshCw, ArrowUp, ArrowDown, Minus } from "lucide-react";

const KanbanContinuousImprovement = () => {
  const { pt } = usePageTranslations();
  const { id } = useParams<{ id: string }>();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token"); const headers: Record<string, string> = { Authorization: `Bearer ${token}` };

  const fetchData = async () => { try { const [mRes, pRes] = await Promise.all([fetch(`/api/v1/projects/${id}/kanban/metrics/`, { headers }), fetch(`/api/v1/projects/${id}/kanban/work-policies/`, { headers })]); if (mRes.ok) { const d = await mRes.json(); setMetrics(Array.isArray(d) ? d : d.results || []); } if (pRes.ok) { const d = await pRes.json(); setPolicies(Array.isArray(d) ? d : d.results || []); } } catch (err) { console.error(err); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, [id]);

  const latest = metrics[0]; const prev = metrics[1];
  const trend = (curr: number | null, prevVal: number | null) => { if (!curr || !prevVal) return null; if (curr < prevVal) return "down"; if (curr > prevVal) return "up"; return "same"; };
  const TrendIcon = ({ t, inverse }: { t: string | null; inverse?: boolean }) => { if (!t) return <Minus className="h-3.5 w-3.5 text-gray-400" />; const good = inverse ? t === "down" : t === "up"; return good ? <ArrowUp className="h-3.5 w-3.5 text-green-500" /> : t === "same" ? <Minus className="h-3.5 w-3.5 text-gray-400" /> : <ArrowDown className="h-3.5 w-3.5 text-red-500" />; };

  if (loading) return (<div className="min-h-full bg-background"><ProjectHeader /><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div></div>);

  return (
    <div className="min-h-full bg-background"><ProjectHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between"><div className="flex items-center gap-3"><TrendingUp className="h-6 w-6 text-emerald-500" /><h1 className="text-2xl font-bold">Continuous Improvement</h1></div><Button variant="outline" onClick={fetchData} className="gap-2"><RefreshCw className="h-4 w-4" /> {pt("Refresh")}</Button></div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Lead Time</p><TrendIcon t={trend(latest?.avg_lead_time, prev?.avg_lead_time)} inverse /></div><p className="text-2xl font-bold">{latest?.avg_lead_time ? `${Math.round(latest.avg_lead_time)}d` : "—"}</p></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Cycle Time</p><TrendIcon t={trend(latest?.avg_cycle_time, prev?.avg_cycle_time)} inverse /></div><p className="text-2xl font-bold">{latest?.avg_cycle_time ? `${Math.round(latest.avg_cycle_time)}d` : "—"}</p></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Throughput</p><TrendIcon t={trend(latest?.throughput, prev?.throughput)} /></div><p className="text-2xl font-bold">{latest?.throughput || 0}</p></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">WIP</p><TrendIcon t={trend(latest?.wip_count, prev?.wip_count)} inverse /></div><p className="text-2xl font-bold">{latest?.wip_count || 0}</p></CardContent></Card>
        </div>

        <Card><CardHeader><CardTitle>Active Policies ({policies.length})</CardTitle></CardHeader>
          <CardContent>{policies.length === 0 ? <p className="text-muted-foreground">No policies defined. Add work policies to track improvement areas.</p> : (
            <div className="space-y-2">{policies.map(p => (
              <div key={p.id} className="p-3 border rounded-lg"><div className="flex items-center gap-2"><span className="font-medium text-sm">{p.title}</span><Badge variant="outline" className="text-xs">{p.policy_type}</Badge></div>{p.description && <p className="text-xs text-muted-foreground mt-1">{p.description}</p>}</div>
            ))}</div>
          )}</CardContent>
        </Card>

        {metrics.length > 1 && (
          <Card><CardHeader><CardTitle>Improvement Trend</CardTitle></CardHeader>
            <CardContent><div className="space-y-2">{metrics.slice(0, 10).map((m, i) => (
              <div key={m.id || i} className="flex items-center justify-between p-2 rounded hover:bg-muted/50 text-sm"><span>{m.date || m.recorded_at?.split("T")[0]}</span><div className="flex gap-6"><span>Lead: {m.avg_lead_time ? `${Math.round(m.avg_lead_time)}d` : "—"}</span><span>Cycle: {m.avg_cycle_time ? `${Math.round(m.avg_cycle_time)}d` : "—"}</span><span>Through: {m.throughput || 0}</span></div></div>
            ))}</div></CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default KanbanContinuousImprovement;
