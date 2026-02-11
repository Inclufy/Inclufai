import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProjectHeader } from "@/components/ProjectHeader";
import { usePageTranslations } from "@/hooks/usePageTranslations";
import { Loader2, RefreshCw, Target, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const BASE = (id: string) => `/api/v1/sixsigma/projects/${id}/sixsigma`;

const MethodologyDashboard = () => {
  const { pt } = usePageTranslations();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };

  const fetchDashboard = async () => { try { const r = await fetch(`${BASE(id!)}/dashboard/`, { headers }); if (r.ok) setDashboard(await r.json()); } catch (err) { console.error(err); } finally { setLoading(false); } };
  useEffect(() => { fetchDashboard(); }, [id]);
  const nav = (path: string) => navigate(`/projects/${id}/six-sigma/${path}`);

  if (loading) return (<div className="min-h-full bg-background"><ProjectHeader /><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div></div>);
  const d = dashboard || {};

  const phases = [
    { name: "Define", color: "bg-blue-500", pages: [
      { label: "DMAIC Overview", path: "dmaic" },
      { label: "SIPOC Diagram", path: "sipoc" },
      { label: "Voice of Customer", path: "voc" },
    ]},
    { name: "Measure", color: "bg-green-500", pages: [
      { label: "Data Collection", path: "data-collection" },
      { label: "MSA", path: "msa" },
      { label: "Baseline", path: "baseline" },
    ]},
    { name: "Analyze", color: "bg-yellow-500", pages: [
      { label: "Fishbone Diagram", path: "fishbone" },
      { label: "Root Cause", path: "root-cause" },
      { label: "Pareto Analysis", path: "pareto" },
      { label: "Hypothesis Testing", path: "hypothesis" },
      { label: "Regression", path: "regression" },
    ]},
    { name: "Improve", color: "bg-orange-500", pages: [
      { label: "Solutions", path: "solutions" },
      { label: "Pilot", path: "pilot" },
      { label: "FMEA", path: "fmea" },
      { label: "Implementation", path: "implementation" },
    ]},
    { name: "Control", color: "bg-red-500", pages: [
      { label: "Control Plan", path: "control-plan" },
      { label: "Control Chart", path: "control-chart" },
      { label: "SPC", path: "spc" },
      { label: "Monitoring", path: "monitoring" },
      { label: "Tollgate Reviews", path: "tollgate" },
      { label: "Project Closure", path: "closure" },
    ]},
  ];

  return (
    <div className="min-h-full bg-background"><ProjectHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center"><Target className="h-5 w-5 text-white" /></div><div><h1 className="text-2xl font-bold">Six Sigma Dashboard</h1><p className="text-sm text-muted-foreground">DMAIC Methodology</p></div></div>
          <Button variant="outline" onClick={fetchDashboard} className="gap-2"><RefreshCw className="h-4 w-4" /> {pt("Refresh")}</Button>
        </div>

        {d.current_phase && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Current Phase</p><p className="text-2xl font-bold">{d.current_phase}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">{pt("Overall Progress")}</p><p className="text-2xl font-bold">{d.overall_progress || 0}%</p><Progress value={d.overall_progress || 0} className="h-2 mt-2" /></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Sigma Level</p><p className="text-2xl font-bold">{d.sigma_level || "—"}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Open Actions</p><p className="text-2xl font-bold">{d.open_actions || 0}</p></CardContent></Card>
          </div>
        )}

        <div className="space-y-4">
          {phases.map(phase => (
            <Card key={phase.name}><CardHeader className="pb-2"><div className="flex items-center gap-3"><div className={`h-3 w-3 rounded-full ${phase.color}`} /><CardTitle className="text-lg">{phase.name}</CardTitle></div></CardHeader>
              <CardContent><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {phase.pages.map(p => (
                  <Button key={p.path} variant="outline" className="justify-start gap-2 h-auto py-2" onClick={() => nav(p.path)}><ArrowRight className="h-3.5 w-3.5" /><span className="text-sm">{p.label}</span></Button>
                ))}
              </div></CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MethodologyDashboard;
