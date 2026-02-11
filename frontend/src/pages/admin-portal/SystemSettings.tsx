import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Settings, Save } from "lucide-react";
import { toast } from "sonner";

const SystemSettings = () => {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  const jsonHeaders = { ...headers, "Content-Type": "application/json" };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/v1/admin/settings/", { headers });
      if (r.ok) setSettings(await r.json());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchSettings(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await fetch("/api/v1/admin/settings/", { method: "PUT", headers: jsonHeaders, body: JSON.stringify(settings) });
      if (r.ok) { toast.success("Settings opgeslagen"); setSettings(await r.json()); } else toast.error("Opslaan mislukt");
    } catch { toast.error("Opslaan mislukt"); } finally { setSaving(false); }
  };

  const updateField = (key: string, value: any) => setSettings({ ...settings, [key]: value });

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  // Render settings dynamically based on what the API returns
  const knownFields = ["site_name", "support_email", "default_language", "maintenance_mode", "max_upload_size", "session_timeout", "allow_registration", "require_email_verification"];
  const settingsEntries = Object.entries(settings).filter(([k]) => k !== "id" && k !== "created_at" && k !== "updated_at");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Settings className="h-6 w-6 text-gray-500" /><h1 className="text-2xl font-bold">System Settings</h1></div><Button onClick={handleSave} disabled={saving} className="gap-2">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save All</Button></div>

      {settingsEntries.length === 0 ? <Card className="p-8 text-center text-muted-foreground">No settings available. The API may need to initialize default settings.</Card> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settingsEntries.map(([key, value]) => (
            <Card key={key}><CardContent className="p-4">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">{key.replace(/_/g, " ")}</Label>
              {typeof value === "boolean" ? (
                <label className="flex items-center gap-2 mt-2"><input type="checkbox" checked={value} onChange={(e) => updateField(key, e.target.checked)} /><span className="text-sm">{value ? "Enabled" : "Disabled"}</span></label>
              ) : typeof value === "number" ? (
                <Input type="number" value={value} onChange={(e) => updateField(key, parseFloat(e.target.value) || 0)} className="mt-1" />
              ) : typeof value === "string" ? (
                value.length > 100 ? <textarea className="w-full min-h-[60px] px-3 py-2 border rounded-md bg-background mt-1" value={value} onChange={(e) => updateField(key, e.target.value)} /> : <Input value={value} onChange={(e) => updateField(key, e.target.value)} className="mt-1" />
              ) : (
                <p className="text-sm mt-1">{JSON.stringify(value)}</p>
              )}
            </CardContent></Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SystemSettings;
