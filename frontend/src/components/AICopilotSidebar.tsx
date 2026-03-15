import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Sparkles,
  Loader2,
  X,
  Mic,
  Maximize2,
  Minimize2,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Plus,
  MessageSquare,
  HelpCircle,
  Play,
  Info,
  ArrowRight,
  Lightbulb,
  Settings,
  Compass,
  Map,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import DynamicForm from "@/components/chat/DynamicForm";
import { AIMessageRenderer } from "@/components/AIMessageRenderer";
import { useCopilot } from "@/contexts/CopilotContext";
import { useLanguage } from "@/contexts/LanguageContext";

import { toast } from "sonner";
import { GuidedTour, type TourStep } from "@/components/GuidedTour";
import { VoiceChatDialog } from "@/components/dashboards/HomeAIVoiceCards";
import { SetupWizardPanel } from "@/pages/OnboardingWizard";
import {
  gt,
  getGuideMap,
  getDefaultGuide,
  getRelatedPages,
  getSitemap,
  type GuideContent,
  type NavLink,
  type NavSection,
} from "@/components/copilot-guide-data";

/* ─── Types ─── */
type CopilotTab = "chat" | "guide" | "setup";
type Lang = "en" | "nl" | "fr";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  formSchema?: any;
}

interface ChatResponse {
  id: number;
  title: string;
  updated_at: string;
  messages: Array<{
    id: number;
    role: string;
    content: string;
    created_at: string;
    original_ai_response?: string;
  }>;
}

interface SendMessageResponse {
  user_message: { id: number; content: string };
  ai_response: { id: number; content: string; original_ai_response?: string };
}

/* Guide content is in copilot-guide-data.ts with EN/NL/FR translations */

/* ═══════════════════════════════════════════════════════════════════
   SUGGESTIONS & QUICK ACTIONS (Chat tab)
   ═══════════════════════════════════════════════════════════════════ */

const suggestionsData: Record<Lang, { icon: typeof AlertTriangle; title: string; description: string }[]> = {
  en: [
    { icon: AlertTriangle, title: "Project risks", description: "Analyze current project risks and suggest mitigations." },
    { icon: TrendingUp, title: "Performance report", description: "Generate a summary of project performance metrics." },
  ],
  nl: [
    { icon: AlertTriangle, title: "Projectrisico's", description: "Analyseer huidige projectrisico's en stel mitigaties voor." },
    { icon: TrendingUp, title: "Prestatierapport", description: "Genereer een samenvatting van projectprestaties." },
  ],
  fr: [
    { icon: AlertTriangle, title: "Risques du projet", description: "Analysez les risques actuels du projet et proposez des atténuations." },
    { icon: TrendingUp, title: "Rapport de performance", description: "Générez un résumé des métriques de performance du projet." },
  ],
};

const quickActionsData: Record<Lang, { icon: typeof BarChart3; label: string }[]> = {
  en: [
    { icon: BarChart3, label: "Monthly report" },
    { icon: TrendingUp, label: "Portfolio analysis" },
    { icon: AlertTriangle, label: "Risk scan" },
  ],
  nl: [
    { icon: BarChart3, label: "Maandrapportage" },
    { icon: TrendingUp, label: "Portfolio analyse" },
    { icon: AlertTriangle, label: "Risico scan" },
  ],
  fr: [
    { icon: BarChart3, label: "Rapport mensuel" },
    { icon: TrendingUp, label: "Analyse de portfolio" },
    { icon: AlertTriangle, label: "Scan des risques" },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export default function AICopilotSidebar() {
  const { isOpen, close, requestedTab } = useCopilot();
  const { language } = useLanguage();

  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<CopilotTab>("chat");
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [activeForm, setActiveForm] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Resolve current path for guide — multilingual
  const lang = language as Lang;
  const currentPath = "/" + location.pathname.split("/").filter(Boolean)[0];
  const guideMap = getGuideMap(lang);
  const guide = guideMap[location.pathname] || guideMap[currentPath] || getDefaultGuide(lang);
  const relatedPages = getRelatedPages(lang);
  const sitemap = getSitemap(lang);

  const suggestions = suggestionsData[lang] ?? suggestionsData.en;
  const quickActions = quickActionsData[lang] ?? quickActionsData.en;

  // Sync with requested tab from context
  useEffect(() => {
    if (requestedTab) setActiveTab(requestedTab);
  }, [requestedTab]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && activeTab === "chat") setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen, activeTab]);

  const handleSendMessage = async (customMessage?: string) => {
    const messageContent = customMessage || inputValue;
    if (!messageContent.trim() || isSending) return;
    const userMessage: Message = { id: Date.now().toString(), role: "user", content: messageContent, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);
    setActiveForm(null);
    try {
      let chatId = currentChatId;
      if (!chatId) {
        const newChat = await api.post<{ id: string; title: string }>("/bot/chats/", { title: messageContent.substring(0, 50) });
        chatId = newChat.id.toString();
        setCurrentChatId(chatId);
      }
      const response = await api.post<SendMessageResponse>(`/bot/chats/${chatId}/send_message/`, { message: messageContent, language });
      let formSchema = null;
      if (response.ai_response?.original_ai_response) {
        try {
          const parsed = JSON.parse(response.ai_response.original_ai_response);
          if (parsed.form_type && parsed.fields) { formSchema = parsed; setActiveForm(parsed); }
        } catch {}
      }
      const aiResponse: Message = { id: (response.ai_response?.id || Date.now() + 1).toString(), role: "assistant", content: response.ai_response?.content || "Sorry, I could not process your request.", timestamp: new Date(), formSchema };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Sorry, I encountered an error. Please try again.", timestamp: new Date() }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleFormSubmit = async (result: any) => {
    setActiveForm(null);
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: `## Success\n\n${result.message || "Operation completed successfully!"}`, timestamp: new Date() }]);
  };

  const handleFormCancel = () => {
    setActiveForm(null);
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: gt("formCancelled", lang), timestamp: new Date() }]);
  };

  const handleNewChat = () => {
    setCurrentChatId(null); setMessages([]); setActiveForm(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success(lang === "nl" ? "Gekopieerd" : lang === "fr" ? "Copié" : "Copied to clipboard");
  };

  const handleFeedback = (type: "positive" | "negative") => {
    toast.success(type === "positive" ? "Thanks for the feedback!" : "We'll work to improve");
  };

  if (!isOpen) return null;

  const sidebarWidth = expanded ? "w-[600px]" : "w-[380px]";
  const isNl = language === "nl"; // kept for VoiceChatDialog prop

  /* ─── Guide Tab Content ─── */
  const renderGuideTab = () => (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        {/* Page header */}
        <div className="rounded-lg bg-gradient-to-r from-purple-600/10 to-fuchsia-600/10 border border-purple-200 dark:border-purple-800/50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Info className="h-4 w-4 text-purple-600" />
            <h4 className="text-sm font-semibold text-foreground">{guide.pageTitle}</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{guide.pageDescription}</p>
          {guide.tourSteps.length > 0 && (
            <Button
              size="sm"
              className="mt-3 text-xs bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:from-purple-700 hover:to-fuchsia-700"
              onClick={() => setIsTourOpen(true)}
            >
              <Play className="h-3 w-3 mr-1.5" />
              {gt("startTour", lang)}
            </Button>
          )}
        </div>

        {/* Features */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
            {gt("features", lang)}
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            {guide.features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg border border-border hover:bg-accent/30 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="h-3.5 w-3.5 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground">{feature.title}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border" />

        {/* How-To's */}
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
            {gt("howDoesItWork", lang)}
          </p>
          {guide.howTos.map((howTo, i) => (
            <div key={i} className="rounded-lg border border-border p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <ArrowRight className="h-3 w-3 text-purple-500" />
                <p className="text-xs font-semibold text-foreground">{howTo.title}</p>
              </div>
              <ol className="space-y-1 ml-4">
                {howTo.steps.map((step, j) => (
                  <li key={j} className="flex items-start gap-2 text-[10px] text-muted-foreground">
                    <span className="w-4 h-4 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 text-[9px] font-bold mt-0.5">{j + 1}</span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <div className="border-t border-border" />

        {/* Tips */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{gt("tipsBest", lang)}</p>
          {guide.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30">
              <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>

        {/* Ask AI button */}
        <div className="pt-2">
          <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => { setActiveTab("chat"); handleSendMessage(`${gt("howDoIUse", lang)} ${guide.pageTitle}? ${gt("giveOverview", lang)}`); }}>
            <MessageSquare className="h-3 w-3 mr-1.5" />
            {`${gt("askCopilot", lang)} ${guide.pageTitle}`}
          </Button>
        </div>

        <div className="border-t border-border" />

        {/* Related pages */}
        {relatedPages[currentPath] && (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1 flex items-center gap-1">
              <Compass className="h-3 w-3" />
              {gt("relatedPages", lang)}
            </p>
            <div className="grid grid-cols-1 gap-1">
              {relatedPages[currentPath].map((link, i) => {
                const LinkIcon = link.icon;
                return (
                  <button key={i} className="flex items-center gap-2.5 p-2 rounded-lg border border-border hover:bg-accent/50 hover:border-purple-300 transition-all text-left group cursor-pointer w-full" onClick={() => navigate(link.path)}>
                    <div className="w-6 h-6 rounded-md bg-purple-500/10 group-hover:bg-purple-500/20 flex items-center justify-center shrink-0 transition-colors">
                      <LinkIcon className="h-3 w-3 text-purple-600" />
                    </div>
                    <span className="text-xs font-medium text-foreground group-hover:text-purple-600 transition-colors">{link.label}</span>
                    <ExternalLink className="h-2.5 w-2.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Sitemap */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1 flex items-center gap-1">
            <Map className="h-3 w-3" />
            {gt("allModules", lang)}
          </p>
          <div className="space-y-2">
            {sitemap.map((section, si) => (
              <div key={si} className="rounded-lg border border-border p-2.5 space-y-1.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{section.title}</p>
                <div className="grid grid-cols-2 gap-1">
                  {section.links.map((link, li) => {
                    const SitemapIcon = link.icon;
                    const isCurrentPage = currentPath === link.path;
                    return (
                      <button key={li} className={cn("flex items-center gap-1.5 p-1.5 rounded-md text-left transition-all cursor-pointer text-[10px]", isCurrentPage ? "bg-purple-500/10 text-purple-700 dark:text-purple-400 font-semibold border border-purple-200 dark:border-purple-800/50" : "hover:bg-accent/50 text-muted-foreground hover:text-foreground")} onClick={() => !isCurrentPage && navigate(link.path)}>
                        <SitemapIcon className={cn("h-3 w-3 shrink-0", isCurrentPage ? "text-purple-600" : "text-muted-foreground")} />
                        <span className="truncate">{link.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );

  return (
    <>
      <div className={cn("h-full border-l border-border bg-card flex flex-col transition-all duration-300 relative", sidebarWidth)}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-sm">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">AI Copilot</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-0">Online</Badge>
              </div>
              <span className="text-[11px] text-muted-foreground">ProjeXtPal AI</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => setExpanded(!expanded)} title={expanded ? "Minimize" : "Expand"}>
              {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={close}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-border bg-muted/30">
          <button className={cn("flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors border-b-2", activeTab === "chat" ? "border-purple-600 text-purple-700 dark:text-purple-400" : "border-transparent text-muted-foreground hover:text-foreground")} onClick={() => setActiveTab("chat")}>
            <MessageSquare className="h-3.5 w-3.5" />
            Chat
          </button>
          <button className={cn("flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors border-b-2", activeTab === "guide" ? "border-purple-600 text-purple-700 dark:text-purple-400" : "border-transparent text-muted-foreground hover:text-foreground")} onClick={() => setActiveTab("guide")}>
            <HelpCircle className="h-3.5 w-3.5" />
            {gt("guide", lang)}
          </button>
          <button className={cn("flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors border-b-2", activeTab === "setup" ? "border-purple-600 text-purple-700 dark:text-purple-400" : "border-transparent text-muted-foreground hover:text-foreground")} onClick={() => setActiveTab("setup")}>
            <Settings className="h-3.5 w-3.5" />
            Setup
          </button>
        </div>

        {/* Content */}
        {activeTab === "setup" ? (
          <SetupWizardPanel onComplete={() => setActiveTab("chat")} />
        ) : activeTab === "guide" ? (
          renderGuideTab()
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="p-4">
                {/* AI Chat + Voice Cards */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    onClick={() => inputRef.current?.focus()}
                    className="rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                  >
                    <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-white font-bold text-sm leading-tight">AI Chat</p>
                          <p className="text-white/70 text-[10px]">{gt("askQuestions", lang)}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setVoiceOpen(true)}
                    className="rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                  >
                    <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Mic className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-white font-bold text-sm leading-tight">Voice</p>
                          <p className="text-white/70 text-[10px]">{gt("talkToPX", lang)}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                {messages.length === 0 ? (
                  <div className="space-y-6">
                    <div className="text-center pt-2 pb-2">
                      <h3 className="text-base font-semibold text-foreground mb-1">{gt("hello", lang)}</h3>
                      <p className="text-xs text-muted-foreground max-w-[260px] mx-auto">{gt("helpWith", lang)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">{gt("suggestions", lang)}</p>
                      <div className="space-y-2">
                        {suggestions.map((item, i) => (
                          <button key={i} onClick={() => handleSendMessage(item.description)} className="w-full flex items-start gap-3 p-3 rounded-lg border border-border bg-background hover:bg-accent/50 hover:border-primary/20 transition-all text-left group">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5"><item.icon className="h-4 w-4 text-primary" /></div>
                            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground">{item.title}</p><p className="text-[11px] text-muted-foreground line-clamp-2">{item.description}</p></div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors mt-1 flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">{gt("quickActions", lang)}</p>
                      <div className="space-y-1.5">
                        {quickActions.map((action, i) => (
                          <button key={i} onClick={() => handleSendMessage(action.label)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors text-left">
                            <action.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{action.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {messages.map((message) => (
                      <AIMessageRenderer key={message.id} message={{ id: message.id, role: message.role, content: message.content }} onCopy={handleCopyMessage} onFeedback={handleFeedback} showActions={message.role === "assistant"} />
                    ))}
                    {activeForm && (<div className="mt-3"><DynamicForm schema={activeForm} onSubmit={handleFormSubmit} onCancel={handleFormCancel} /></div>)}
                    {isSending && (
                      <div className="flex items-start gap-2 mt-3">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0"><Loader2 className="h-4 w-4 text-white animate-spin" /></div>
                        <div className="bg-muted/50 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                            <span className="text-xs text-muted-foreground ml-1">{gt("thinking", lang)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={scrollRef} />
                  </div>
                )}
              </div>
            </ScrollArea>

            {messages.length > 0 && (
              <div className="px-4 pt-2">
                <Button variant="ghost" size="sm" onClick={handleNewChat} className="w-full text-xs text-muted-foreground hover:text-foreground">
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  {gt("newConversation", lang)}
                </Button>
              </div>
            )}

            <div className="p-3 border-t border-border bg-card">
              <div className="flex items-center gap-2">
                <Input ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === "Enter" && !isSending && !activeForm && handleSendMessage()} placeholder={gt("askQuestion", lang)} disabled={isSending || !!activeForm} className="h-10 text-sm bg-background" />
                <Button onClick={() => handleSendMessage()} disabled={!inputValue.trim() || isSending || !!activeForm} size="icon" className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white">
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-[10px] text-center text-muted-foreground mt-1.5">ProjeXtPal AI &middot; {gt("poweredBy", lang)}</p>
            </div>
          </>
        )}
      </div>

      {/* Guided Tour overlay */}
      {isTourOpen && guide.tourSteps.length > 0 && (
        <GuidedTour steps={guide.tourSteps} onClose={() => setIsTourOpen(false)} />
      )}

      {/* Voice Chat Dialog */}
      <VoiceChatDialog open={voiceOpen} onClose={() => setVoiceOpen(false)} isNL={isNl} />
    </>
  );
}
