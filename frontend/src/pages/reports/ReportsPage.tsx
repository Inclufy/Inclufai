import React, { useState } from "react";
import ReportModal from "./ReportModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Download,
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  BarChart3,
  Calendar,
  Clock,
  Building2,
  Briefcase,
  FolderKanban,
  AlertTriangle,
  Award,
  Activity,
} from "lucide-react";
import { usePageTranslations } from '@/hooks/usePageTranslations';

interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: string;
  roles: string[];
  aiPowered: boolean;
}

const reportTemplates: ReportTemplate[] = [
  // Executive Reports
  {
    id: "portfolio-analysis",
    title: "Portfolio Analysis",
    description: "AI-powered analysis of all programs and projects with strategic insights",
    icon: Briefcase,
    category: "executive",
    roles: ["superadmin", "admin"],
    aiPowered: true,
  },
  {
    id: "executive-summary",
    title: "Executive Summary",
    description: "High-level overview of portfolio health, budget, and key risks",
    icon: TrendingUp,
    category: "executive",
    roles: ["superadmin", "admin"],
    aiPowered: true,
  },
  {
    id: "financial-overview",
    title: "Financial Overview",
    description: "Budget allocation, spending trends, and financial forecasts",
    icon: DollarSign,
    category: "executive",
    roles: ["superadmin", "admin"],
    aiPowered: true,
  },
  
  // Program Manager Reports
  {
    id: "program-performance",
    title: "Program Performance",
    description: "Detailed analysis of program progress, milestones, and deliverables",
    icon: Building2,
    category: "program",
    roles: ["program_manager", "admin", "superadmin"],
    aiPowered: true,
  },
  {
    id: "benefits-realization",
    title: "Benefits Realization",
    description: "Track and analyze program benefits against planned outcomes",
    icon: Target,
    category: "program",
    roles: ["program_manager", "admin", "superadmin"],
    aiPowered: true,
  },
  {
    id: "governance-report",
    title: "Governance Report",
    description: "Board updates, compliance status, and governance metrics",
    icon: Award,
    category: "program",
    roles: ["program_manager", "admin", "superadmin"],
    aiPowered: false,
  },
  
  // Project Manager Reports
  {
    id: "project-status",
    title: "Project Status Report",
    description: "Current project status, tasks, risks, and upcoming milestones",
    icon: FolderKanban,
    category: "project",
    roles: ["pm", "program_manager", "admin", "superadmin"],
    aiPowered: true,
  },
  {
    id: "team-performance",
    title: "Team Performance",
    description: "Team productivity, capacity, and resource utilization",
    icon: Users,
    category: "project",
    roles: ["pm", "program_manager", "admin", "superadmin"],
    aiPowered: true,
  },
  {
    id: "budget-analysis",
    title: "Budget Analysis",
    description: "Project budget vs actual, spending trends, and forecasts",
    icon: BarChart3,
    category: "project",
    roles: ["pm", "program_manager", "admin", "superadmin"],
    aiPowered: true,
  },
  {
    id: "risk-analysis",
    title: "Risk Analysis",
    description: "Identified risks, mitigation plans, and risk trends",
    icon: AlertTriangle,
    category: "project",
    roles: ["pm", "program_manager", "admin", "superadmin"],
    aiPowered: true,
  },
  
  // Team Member Reports
  {
    id: "time-tracking",
    title: "Time Tracking Report",
    description: "Personal time logs, hours worked, and productivity metrics",
    icon: Clock,
    category: "personal",
    roles: ["guest", "member", "pm", "program_manager", "admin", "superadmin"],
    aiPowered: false,
  },
  {
    id: "personal-performance",
    title: "Personal Performance",
    description: "Your contributions, completed tasks, and achievements",
    icon: Activity,
    category: "personal",
    roles: ["guest", "member", "pm", "program_manager", "admin", "superadmin"],
    aiPowered: true,
  },
  
  // Scheduled Reports
  {
    id: "weekly-summary",
    title: "Weekly Summary",
    description: "Automated weekly summary of key activities and metrics",
    icon: Calendar,
    category: "scheduled",
    roles: ["pm", "program_manager", "admin", "superadmin"],
    aiPowered: true,
  },
];

const ReportsPage: React.FC = () => {
  const { pt } = usePageTranslations();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  const userRole = user?.role || "guest";

  // Filter reports based on user role
  const availableReports = reportTemplates.filter((report) =>
    report.roles.includes(userRole)
  );

  const categories = [
    { id: "all", label: "All Reports", icon: FileText },
    { id: "executive", label: "Executive", icon: Briefcase, roles: ["superadmin", "admin"] },
    { id: "program", label: "Program", icon: Building2, roles: ["program_manager", "admin", "superadmin"] },
    { id: "project", label: "Project", icon: FolderKanban, roles: ["pm", "program_manager", "admin", "superadmin"] },
    { id: "personal", label: "Personal", icon: Users, roles: ["guest", "member", "pm", "program_manager", "admin", "superadmin"] },
    { id: "scheduled", label: "Scheduled", icon: Calendar, roles: ["pm", "program_manager", "admin", "superadmin"] },
  ];

  const visibleCategories = categories.filter(
    (cat) => cat.id === "all" || !cat.roles || cat.roles.includes(userRole)
  );

  const filteredReports =
    selectedCategory === "all"
      ? availableReports
      : availableReports.filter((r) => r.category === selectedCategory);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(false);

  const handleGenerateReport = async (reportId: string) => {
    setGeneratingReport(reportId);
    setReportModalOpen(true);
    setReportLoading(true);
    setReportData(null);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("/api/v1/governance/reports/generate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ report_id: reportId }),
      });

      if (!response.ok) throw new Error("Failed to generate report");
      
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error("Report generation failed:", error);
      setReportData({
        title: "Error",
        date: new Date().toISOString(),
        executive_summary: "Failed to generate report. Please check your connection and try again.",
        sections: [],
        recommendations: [],
        risk_highlights: [],
        kpis: [],
      });
    } finally {
      setReportLoading(false);
      setGeneratingReport(null);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-violet-900/20">
      <div className="absolute top-0 -left-4 w-[28rem] h-[28rem] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-[28rem] h-[28rem] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-20 w-[28rem] h-[28rem] bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <div className="relative z-10 p-8 md:p-10 space-y-8 max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 bg-purple-100/50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
            <Sparkles className="h-4 w-4" />
            <span>📊 AI-Powered Reports</span>
            <Badge className="ml-1 bg-green-500 text-white text-xs">{pt("New")}</Badge>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Reports & Analytics
            </span>
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Generate AI-powered insights and reports tailored to your role
          </p>
        </div>

        {/* Category Tabs */}
        <Card className="border-0 ring-1 ring-purple-100 dark:ring-purple-900/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <div className="border-b border-purple-100 dark:border-purple-900/30 px-7 pt-7">
              <TabsList className="bg-purple-50 dark:bg-purple-900/20 p-1.5 rounded-2xl ring-1 ring-inset ring-purple-100 dark:ring-purple-900/50">
                {visibleCategories.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-lg data-[state=active]:ring-1 data-[state=active]:ring-purple-100 dark:data-[state=active]:ring-purple-800 rounded-xl px-6 py-2.5 text-sm font-bold transition-all"
                  >
                    <cat.icon className="h-4 w-4 mr-2" />
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={selectedCategory} className="p-7">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => {
                  const IconComponent = report.icon;
                  const isGenerating = generatingReport === report.id;

                  return (
                    <Card
                      key={report.id}
                      className="border-0 ring-1 ring-purple-100 dark:ring-purple-900/50 hover:ring-purple-200 dark:hover:ring-purple-800/50 transition-all duration-300 group"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          {report.aiPowered && (
                            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                              <Sparkles className="h-3 w-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                        <CardDescription>{report.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleGenerateReport(report.id)}
                            disabled={isGenerating}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl"
                          >
                            {isGenerating ? (
                              <>
                                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <FileText className="h-4 w-4 mr-2" />
                                Generate
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-xl"
                            disabled={isGenerating}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredReports.length === 0 && (
                <div className="text-center py-20">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center ring-4 ring-purple-50 dark:ring-purple-900/20 mx-auto mb-4">
                    <FileText className="h-8 w-8 text-purple-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    No reports available for this category
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      <ReportModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        report={reportData}
        loading={reportLoading}
      />
    </div>
  );
};

export default ReportsPage;
