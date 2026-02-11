import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, FileText, Search } from "lucide-react";

const AuditLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };

  const fetchLogs = async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p) });
      if (search) params.set("search", search);
      const r = await fetch(`/api/v1/admin/logs/?${params}`, { headers });
      if (r.ok) {
        const d = await r.json();
        const items = Array.isArray(d) ? d : d.results || [];
        setLogs(p === 1 ? items : [...logs, ...items]);
        setHasMore(!!d.next);
        setPage(p);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchLogs(); }, []);

  const handleSearch = () => { fetchLogs(1); };
  const actionColors: Record<string, string> = { create: "bg-green-100 text-green-700", update: "bg-blue-100 text-blue-700", delete: "bg-red-100 text-red-700", login: "bg-purple-100 text-purple-700", logout: "bg-gray-100 text-gray-700" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3"><FileText className="h-6 w-6 text-blue-500" /><h1 className="text-2xl font-bold">Audit Logs</h1><Badge variant="outline">{logs.length}</Badge></div>
        <Button variant="outline" onClick={() => fetchLogs(1)} className="gap-2"><RefreshCw className="h-4 w-4" /> Refresh</Button>
      </div>

      <div className="flex gap-2"><Input placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} className="max-w-sm" /><Button variant="outline" onClick={handleSearch}><Search className="h-4 w-4" /></Button></div>

      {loading && logs.length === 0 ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div> : logs.length === 0 ? <Card className="p-8 text-center"><FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold">No audit logs found</h3></Card> : (
        <div className="space-y-1">{logs.map((log, i) => (
          <Card key={log.id || i}><CardContent className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={`text-xs ${actionColors[log.action?.toLowerCase()] || "bg-gray-100 text-gray-700"}`}>{log.action}</Badge>
              <div><p className="text-sm font-medium">{log.description || log.message || `${log.action} on ${log.model || log.resource}`}</p><p className="text-xs text-muted-foreground">{log.user_email || log.user?.email || "System"} {log.ip_address && `• ${log.ip_address}`}</p></div>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{log.created_at ? new Date(log.created_at).toLocaleString() : log.timestamp}</span>
          </CardContent></Card>
        ))}</div>
      )}
      {hasMore && <div className="text-center"><Button variant="outline" onClick={() => fetchLogs(page + 1)} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load More"}</Button></div>}
    </div>
  );
};

export default AuditLogs;
