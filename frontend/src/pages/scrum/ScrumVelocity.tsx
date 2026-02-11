import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectHeader } from "@/components/ProjectHeader";
import { usePageTranslations } from "@/hooks/usePageTranslations";
import { Loader2, BarChart3, TrendingUp } from "lucide-react";

const ScrumVelocity = () => {
  const { pt } = usePageTranslations();
  const { id } = useParams<{ id: string }>();
  const [velocity, setVelocity] = useState<any[]>([]);
  const [average, setAverage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [vRes, aRes] = await Promise.all([
        fetch(`/api/v1/projects/${id}/scrum/velocity/`, { headers }),
        fetch(`/api/v1/projects/${id}/scrum/velocity/average/`, { headers }),
      ]);
      if (vRes.ok) { const d = await vRes.json(); setVelocity(Array.isArray(d) ? d : d.results || []); }
      if (aRes.ok) setAverage(await aRes.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  if (loading) return (<div className="min-h-full bg-background"><ProjectHeader /><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div></div>);

  const maxPts = Math.max(...velocity.map(v => v.story_points_completed || v.committed_points || 0), 1);

  return (
    <div className="min-h-full bg-background"><ProjectHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3"><BarChart3 className="h-6 w-6 text-blue-500" /><h1 className="text-2xl font-bold">{pt("Velocity")}</h1></div>
        {average && <Card><CardContent className="p-4 flex items-center gap-4"><TrendingUp className="h-8 w-8 text-green-500" /><div><p className="text-sm text-muted-foreground">{pt("Average Velocity")}</p><p className="text-3xl font-bold">{average.average_velocity || average.average || 0} <span className="text-sm font-normal">pts/sprint</span></p></div></CardContent></Card>}
        {velocity.length === 0 ? <Card className="p-8 text-center"><BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold">{pt("No velocity data yet")}</h3><p className="text-muted-foreground">{pt("Complete sprints to see velocity")}</p></Card> : (
          <Card><CardHeader><CardTitle>{pt("Sprint Velocity")}</CardTitle></CardHeader>
            <CardContent><div className="space-y-3">{velocity.map((v, i) => {
              const pts = v.story_points_completed || v.committed_points || 0;
              return (
                <div key={v.id || i} className="flex items-center gap-4">
                  <span className="text-sm w-24 text-muted-foreground">{v.sprint_name || `Sprint ${v.sprint}`}</span>
                  <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden"><div className="bg-blue-500 h-full rounded-full flex items-center justify-end pr-2 transition-all" style={{ width: `${(pts / maxPts) * 100}%` }}><span className="text-xs text-white font-bold">{pts}</span></div></div>
                  <Badge variant="outline" className="text-xs w-14 justify-center">{pts} pts</Badge>
                </div>
              );
            })}</div></CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ScrumVelocity;
