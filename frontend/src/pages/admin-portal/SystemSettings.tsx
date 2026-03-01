import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, Settings, Save, Key, Building2, Shield, Mail,
  Sparkles, CreditCard, Wrench, Trash2, Plus, Eye, EyeOff,
} from "lucide-react";
import { toast } from "sonner";

// ============================================================
// Types
// ============================================================

interface SystemSettingItem {
  id: string;
  key: string;
  value: any;
  category: string;
  description: string;
  is_sensitive: boolean;
  updated_at: string | null;
}

interface ClientApiKey {
  id: string;
  company: number;
  company_name: string;
  provider: "openai" | "anthropic";
  masked_key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CompanyOption {
  id: number;
  name: string;
}

// ============================================================
// Helpers
// ============================================================

const CATEGORY_META: Record<string, { label: string; labelNL: string; icon: React.ReactNode }> = {
  general:     { label: "General",     labelNL: "Algemeen",      icon: <Settings className="h-4 w-4" /> },
  security:    { label: "Security",    labelNL: "Beveiliging",   icon: <Shield className="h-4 w-4" /> },
  email:       { label: "Email",       labelNL: "E-mail",        icon: <Mail className="h-4 w-4" /> },
  features:    { label: "Features",    labelNL: "Functies",      icon: <Sparkles className="h-4 w-4" /> },
  billing:     { label: "Billing",     labelNL: "Facturatie",    icon: <CreditCard className="h-4 w-4" /> },
  maintenance: { label: "Maintenance", labelNL: "Onderhoud",     icon: <Wrench className="h-4 w-4" /> },
  api_keys:    { label: "API Keys",    labelNL: "API Sleutels",  icon: <Key className="h-4 w-4" /> },
};

const CATEGORY_ORDER = ["general", "security", "email", "features", "billing", "maintenance", "api_keys"];

function formatLabel(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ============================================================
// Main Component
// ============================================================

const SystemSettings = () => {
  const [settings, setSettings] = useState<SystemSettingItem[]>([]);
  const [apiKeys, setApiKeys] = useState<ClientApiKey[]>([]);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [dirty, setDirty] = useState<Record<string, any>>({});

  // API key form state
  const [akCompany, setAkCompany] = useState("");
  const [akProvider, setAkProvider] = useState<"openai" | "anthropic">("openai");
  const [akKey, setAkKey] = useState("");
  const [akSaving, setAkSaving] = useState(false);
  const [showKeyFor, setShowKeyFor] = useState<string | null>(null);

  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  const jsonHeaders = { ...headers, "Content-Type": "application/json" };

  // ----- Fetch settings -----
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/v1/admin/settings/", { headers });
      if (r.ok) {
        const data = await r.json();
        setSettings(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ----- Fetch API keys -----
  const fetchApiKeys = useCallback(async () => {
    try {
      const r = await fetch("/api/v1/admin/api-keys/", { headers });
      if (r.ok) setApiKeys(await r.json());
    } catch (err) {
      console.error("Failed to fetch API keys:", err);
    }
  }, []);

  // ----- Fetch companies -----
  const fetchCompanies = useCallback(async () => {
    try {
      const r = await fetch("/api/v1/admin/tenants/", { headers });
      if (r.ok) {
        const data = await r.json();
        const list = data.results || data;
        setCompanies(Array.isArray(list) ? list.map((c: any) => ({ id: c.id, name: c.name })) : []);
      }
    } catch (err) {
      console.error("Failed to fetch companies:", err);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchApiKeys();
    fetchCompanies();
  }, []);

  // ----- Update a setting locally -----
  const updateSetting = (key: string, value: any) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    );
    setDirty((prev) => ({ ...prev, [key]: value }));
  };

  // ----- Save all changed settings -----
  const handleSave = async () => {
    const changedKeys = Object.keys(dirty);
    if (changedKeys.length === 0) {
      toast.info("No changes to save");
      return;
    }

    setSaving(true);
    try {
      const payload = changedKeys.map((key) => ({
        key,
        value: dirty[key],
      }));
      const r = await fetch("/api/v1/admin/settings/", {
        method: "PATCH",
        headers: jsonHeaders,
        body: JSON.stringify(payload),
      });
      if (r.ok) {
        toast.success("Settings saved");
        setDirty({});
        fetchSettings();
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // ----- Create / Update API key -----
  const handleSaveApiKey = async () => {
    if (!akCompany || !akKey) {
      toast.error("Select a company and enter an API key");
      return;
    }
    setAkSaving(true);
    try {
      const r = await fetch("/api/v1/admin/api-keys/", {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({
          company_id: akCompany,
          provider: akProvider,
          api_key: akKey,
        }),
      });
      if (r.ok) {
        toast.success(`${akProvider === "openai" ? "OpenAI" : "Anthropic"} API key saved`);
        setAkKey("");
        fetchApiKeys();
      } else {
        const err = await r.json().catch(() => ({}));
        toast.error(err.error || "Failed to save API key");
      }
    } catch {
      toast.error("Failed to save API key");
    } finally {
      setAkSaving(false);
    }
  };

  // ----- Delete API key -----
  const handleDeleteApiKey = async (id: string) => {
    try {
      const r = await fetch(`/api/v1/admin/api-keys/${id}/`, {
        method: "DELETE",
        headers,
      });
      if (r.ok || r.status === 204) {
        toast.success("API key removed");
        fetchApiKeys();
      } else {
        toast.error("Failed to remove API key");
      }
    } catch {
      toast.error("Failed to remove API key");
    }
  };

  // ----- Group settings by category -----
  const settingsByCategory: Record<string, SystemSettingItem[]> = {};
  settings.forEach((s) => {
    if (!settingsByCategory[s.category]) settingsByCategory[s.category] = [];
    settingsByCategory[s.category].push(s);
  });

  // ----- Loading state -----
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const hasDirtyChanges = Object.keys(dirty).length > 0;

  // ----- Render a single setting field -----
  const renderField = (s: SystemSettingItem) => {
    const val = s.value;

    if (typeof val === "boolean") {
      return (
        <div className="flex items-center justify-between rounded-lg border p-4" key={s.key}>
          <div>
            <p className="font-medium text-sm">{formatLabel(s.key)}</p>
            {s.description && <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>}
          </div>
          <Switch
            checked={val}
            onCheckedChange={(checked) => updateSetting(s.key, checked)}
          />
        </div>
      );
    }

    if (typeof val === "number") {
      return (
        <div className="space-y-2 rounded-lg border p-4" key={s.key}>
          <Label className="font-medium text-sm">{formatLabel(s.key)}</Label>
          {s.description && <p className="text-xs text-muted-foreground">{s.description}</p>}
          <Input
            type="number"
            value={val}
            onChange={(e) => updateSetting(s.key, parseFloat(e.target.value) || 0)}
          />
        </div>
      );
    }

    // String
    return (
      <div className="space-y-2 rounded-lg border p-4" key={s.key}>
        <Label className="font-medium text-sm">{formatLabel(s.key)}</Label>
        {s.description && <p className="text-xs text-muted-foreground">{s.description}</p>}
        <Input
          value={typeof val === "string" ? val : JSON.stringify(val)}
          onChange={(e) => updateSetting(s.key, e.target.value)}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-gray-500" />
          <h1 className="text-2xl font-bold">System Settings</h1>
        </div>
        <Button onClick={handleSave} disabled={saving || !hasDirtyChanges} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save All
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          {CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat];
            if (!meta) return null;
            // Skip empty categories (except api_keys which is always shown)
            if (cat !== "api_keys" && !settingsByCategory[cat]?.length) return null;
            return (
              <TabsTrigger key={cat} value={cat} className="gap-1.5">
                {meta.icon}
                {meta.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Setting category tabs */}
        {CATEGORY_ORDER.filter((c) => c !== "api_keys").map((cat) => (
          <TabsContent key={cat} value={cat}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {CATEGORY_META[cat]?.icon}
                  {CATEGORY_META[cat]?.label} Settings
                </CardTitle>
                <CardDescription>
                  Configure {CATEGORY_META[cat]?.label.toLowerCase()} settings for the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {settingsByCategory[cat]?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {settingsByCategory[cat].map(renderField)}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm py-4">
                    No settings in this category yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        {/* API Keys Tab */}
        <TabsContent value="api_keys">
          <div className="space-y-6">
            {/* Add API Key Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add / Update API Key
                </CardTitle>
                <CardDescription>
                  Set OpenAI or Anthropic API keys per client organisation. Each company can have one key per provider.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="space-y-2">
                    <Label>Organisation</Label>
                    <Select value={akCompany} onValueChange={setAkCompany}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company..." />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Provider</Label>
                    <Select value={akProvider} onValueChange={(v) => setAkProvider(v as "openai" | "anthropic")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="anthropic">Anthropic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input
                      type="password"
                      placeholder="sk-... or sk-ant-..."
                      value={akKey}
                      onChange={(e) => setAkKey(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleSaveApiKey} disabled={akSaving} className="gap-2">
                    {akSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                    Save Key
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Existing API Keys */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Client API Keys
                </CardTitle>
                <CardDescription>
                  Manage OpenAI and Anthropic API keys per organisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {apiKeys.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4">
                    No API keys configured yet. Use the form above to add keys for client organisations.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-2 font-medium">Organisation</th>
                          <th className="pb-2 font-medium">Provider</th>
                          <th className="pb-2 font-medium">API Key</th>
                          <th className="pb-2 font-medium">Status</th>
                          <th className="pb-2 font-medium">Updated</th>
                          <th className="pb-2 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apiKeys.map((ak) => (
                          <tr key={ak.id} className="border-b last:border-0">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                {ak.company_name}
                              </div>
                            </td>
                            <td className="py-3">
                              <Badge variant={ak.provider === "openai" ? "default" : "secondary"}>
                                {ak.provider === "openai" ? "OpenAI" : "Anthropic"}
                              </Badge>
                            </td>
                            <td className="py-3 font-mono text-xs">
                              <div className="flex items-center gap-1">
                                {showKeyFor === ak.id ? ak.masked_key : "••••••••••••"}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => setShowKeyFor(showKeyFor === ak.id ? null : ak.id)}
                                >
                                  {showKeyFor === ak.id ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                </Button>
                              </div>
                            </td>
                            <td className="py-3">
                              <Badge variant={ak.is_active ? "default" : "destructive"} className="text-xs">
                                {ak.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="py-3 text-muted-foreground text-xs">
                              {ak.updated_at ? new Date(ak.updated_at).toLocaleDateString() : "-"}
                            </td>
                            <td className="py-3 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteApiKey(ak.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
