import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectHeader } from "@/components/ProjectHeader";
import { usePageTranslations } from "@/hooks/usePageTranslations";
import { Loader2, Users } from "lucide-react";

const KanbanTeam = () => {
  const { pt } = usePageTranslations();
  const { id } = useParams<{ id: string }>();
  const [cards, setCards] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token"); const headers: Record<string, string> = { Authorization: `Bearer ${token}` };

  const fetchData = async () => { try { const [crRes, cRes] = await Promise.all([fetch(`/api/v1/projects/${id}/kanban/cards/`, { headers }), fetch(`/api/v1/projects/${id}/kanban/columns/`, { headers })]); if (crRes.ok) { const d = await crRes.json(); setCards(Array.isArray(d) ? d : d.results || []); } if (cRes.ok) { const d = await cRes.json(); setColumns(Array.isArray(d) ? d : d.results || []); } } catch (err) { console.error(err); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, [id]);

  const colMap = Object.fromEntries(columns.map(c => [c.id, c.name]));
  const members = [...new Set(cards.filter(c => c.assigned_to_name).map(c => c.assigned_to_name))];

  if (loading) return (<div className="min-h-full bg-background"><ProjectHeader /><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div></div>);

  return (
    <div className="min-h-full bg-background"><ProjectHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3"><Users className="h-6 w-6 text-blue-500" /><h1 className="text-2xl font-bold">{pt("Team")} Workload</h1><Badge variant="outline">{members.length} members</Badge></div>
        {members.length === 0 ? <Card className="p-8 text-center"><Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold">No team members assigned yet</h3><p className="text-muted-foreground">Assign cards to team members to see workload</p></Card> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{members.map(name => {
            const memberCards = cards.filter(c => c.assigned_to_name === name);
            const blocked = memberCards.filter(c => c.is_blocked).length;
            return (
              <Card key={name}><CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3"><div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center"><span className="font-semibold text-violet-600">{name.charAt(0).toUpperCase()}</span></div><div><p className="font-medium">{name}</p><p className="text-xs text-muted-foreground">{memberCards.length} cards{blocked > 0 && <span className="text-red-500 ml-1">({blocked} blocked)</span>}</p></div></div>
                <div className="space-y-1">{memberCards.slice(0, 5).map(c => (
                  <div key={c.id} className="flex items-center gap-2 text-xs p-1 rounded bg-muted/50"><span className={c.is_blocked ? "text-red-500" : ""}>{c.title}</span>{colMap[c.column] && <Badge variant="outline" className="text-xs ml-auto">{colMap[c.column]}</Badge>}</div>
                ))}{memberCards.length > 5 && <p className="text-xs text-muted-foreground">+{memberCards.length - 5} more</p>}</div>
              </CardContent></Card>
            );
          })}</div>
        )}
      </div>
    </div>
  );
};

export default KanbanTeam;
