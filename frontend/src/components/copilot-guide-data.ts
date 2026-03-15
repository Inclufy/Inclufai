// copilot-guide-data.ts — Multilingual guide content for AI Copilot sidebar
import {
  BarChart3, ListChecks, TrendingUp, AlertTriangle, FolderKanban,
  Building2, Target, Users, Shield, Briefcase, FileText, Clock,
  Calendar, Brain, Lightbulb, CheckCircle2, BookOpen, Settings,
  Workflow, Layers, GitBranch, Layout, GraduationCap,
  type LucideIcon,
} from "lucide-react";
import type { TourStep } from "@/components/GuidedTour";

/* ─── Types ─── */
export interface GuideFeature { icon: LucideIcon; title: string; description: string }
export interface GuideHowTo { title: string; steps: string[] }
export interface GuideContent {
  pageTitle: string;
  pageDescription: string;
  features: GuideFeature[];
  howTos: GuideHowTo[];
  tips: string[];
  tourSteps: TourStep[];
}
export interface NavLink { label: string; path: string; icon: LucideIcon }
export interface NavSection { title: string; links: NavLink[] }

type Lang = "en" | "nl" | "fr";

/* ─── Inline translation helper ─── */
export const GT: Record<string, Record<Lang, string>> = {
  features:       { en: "Features",              nl: "Functies",              fr: "Fonctionnalités" },
  howDoesItWork:  { en: "How does it work?",     nl: "Hoe werkt het?",       fr: "Comment ça marche ?" },
  tipsBest:       { en: "Tips & Best Practices", nl: "Tips & Best Practices", fr: "Conseils & Bonnes Pratiques" },
  relatedPages:   { en: "Related pages",         nl: "Gerelateerde pagina's", fr: "Pages liées" },
  allModules:     { en: "All modules",           nl: "Alle modules",          fr: "Tous les modules" },
  startTour:      { en: "Start Tour",            nl: "Start Rondleiding",     fr: "Démarrer la visite" },
  guide:          { en: "Guide",                 nl: "Gids",                  fr: "Guide" },
  askQuestion:    { en: "Ask a question...",      nl: "Stel een vraag...",     fr: "Posez une question..." },
  askCopilot:     { en: "Ask AI Copilot about",  nl: "Vraag de AI Copilot over", fr: "Demandez à l'AI Copilot sur" },
  howDoIUse:      { en: "How do I use",           nl: "Hoe gebruik ik",        fr: "Comment utiliser" },
  giveOverview:   { en: "Give me an overview.",   nl: "Geef me een overzicht.", fr: "Donnez-moi un aperçu." },
  hello:          { en: "Hello! I'm your AI Copilot", nl: "Hallo! Ik ben uw AI Copilot", fr: "Bonjour ! Je suis votre AI Copilot" },
  helpWith:       { en: "I help you with insights on your projects and programs", nl: "Ik help u met overzicht van uw projecten en programma's", fr: "Je vous aide avec des aperçus de vos projets et programmes" },
  suggestions:    { en: "Suggestions",            nl: "Suggesties",            fr: "Suggestions" },
  quickActions:   { en: "Quick Actions",          nl: "Snelle Acties",         fr: "Actions Rapides" },
  askQuestions:   { en: "Ask questions",           nl: "Stel je vragen",        fr: "Posez vos questions" },
  talkToPX:       { en: "Talk to PX",             nl: "Praat met PX",          fr: "Parlez à PX" },
  thinking:       { en: "Thinking...",             nl: "Denken...",             fr: "Réflexion..." },
  newConversation: { en: "New conversation",       nl: "Nieuw gesprek",         fr: "Nouvelle conversation" },
  poweredBy:      { en: "Powered by specialized agents", nl: "Aangedreven door gespecialiseerde agents", fr: "Propulsé par des agents spécialisés" },
  formCancelled:  { en: "Form cancelled. How else can I help you?", nl: "Formulier geannuleerd. Hoe kan ik verder helpen?", fr: "Formulaire annulé. Comment puis-je vous aider ?" },
};

export function gt(key: string, lang: Lang): string {
  return GT[key]?.[lang] ?? GT[key]?.en ?? key;
}

/* ═══════════════════════════════════════════════════════════════════
   GUIDE CONTENT — per language
   ═══════════════════════════════════════════════════════════════════ */

const GUIDE_NL: Record<string, GuideContent> = {
  "/dashboard": {
    pageTitle: "Dashboard",
    pageDescription: "Uw centrale project cockpit met overzicht van alle projecten, programma's en taken.",
    features: [
      { icon: BarChart3, title: "Project overzicht", description: "Status van al uw projecten in één oogopslag" },
      { icon: ListChecks, title: "Taken & deadlines", description: "Openstaande taken en naderende deadlines" },
      { icon: TrendingUp, title: "Voortgang", description: "Voortgangsgrafieken en burndown charts" },
      { icon: AlertTriangle, title: "Risico's & alerts", description: "Waarschuwingen voor projectrisico's" },
    ],
    howTos: [{ title: "Dashboard gebruiken", steps: ["Bekijk projectstatus kaarten bovenaan", "Scroll voor taak- en deadlineoverzicht", "Klik op een project voor details", "Gebruik filters voor specifieke weergaven"] }],
    tips: ["Check uw dashboard dagelijks voor actuele projectstatus.", "Klik op risico-alerts voor directe actie.", "Gebruik de AI Copilot voor snelle projectinzichten."],
    tourSteps: [{ title: "Welkom op het Dashboard", description: "Dit is uw centrale project cockpit. Hier ziet u alle belangrijke projectinformatie." }],
  },
  "/projects": {
    pageTitle: "Projecten",
    pageDescription: "Beheer al uw projecten met ondersteuning voor Scrum, Kanban, PRINCE2, Waterfall en meer.",
    features: [
      { icon: FolderKanban, title: "Project portfolio", description: "Overzicht van alle projecten met status en voortgang" },
      { icon: Layers, title: "Methodologie keuze", description: "Kies de juiste methodologie per project" },
      { icon: Users, title: "Team toewijzing", description: "Wijs teamleden toe aan projecten" },
      { icon: Target, title: "Doelen & KPI's", description: "Stel projectdoelen en meetbare KPI's in" },
    ],
    howTos: [
      { title: "Project aanmaken", steps: ["Klik op '+ Nieuw Project'", "Vul projectnaam en beschrijving in", "Selecteer de methodologie (Scrum, Kanban, etc.)", "Stel het team en de planning in", "Klik op Aanmaken"] },
      { title: "Project bekijken", steps: ["Klik op een project in de lijst", "Bekijk de project details en voortgang", "Navigeer via het submenu naar specifieke onderdelen", "Gebruik de methodologie-specifieke tools"] },
    ],
    tips: ["Kies de juiste methodologie bij aanvang — later wijzigen is complex.", "Stel altijd een project charter op als fundament.", "Gebruik de AI Copilot voor risico-analyse en advies."],
    tourSteps: [{ title: "Projecten", description: "Hier beheert u al uw projecten en kiest u de juiste aanpak." }],
  },
  "/programs": {
    pageTitle: "Programma's",
    pageDescription: "Beheer programma's die meerdere gerelateerde projecten bundelen (SAFe, MSP, PMI, PRINCE2).",
    features: [
      { icon: Building2, title: "Programma portfolio", description: "Overzicht van alle programma's" },
      { icon: GitBranch, title: "Project bundeling", description: "Groepeer gerelateerde projecten" },
      { icon: Target, title: "Benefits management", description: "Track programma-baten en waarderealisatie" },
      { icon: Users, title: "Stakeholder management", description: "Beheer stakeholders op programmaniveau" },
    ],
    howTos: [{ title: "Programma aanmaken", steps: ["Klik op '+ Nieuw Programma'", "Kies de programma-methodologie (SAFe, MSP, etc.)", "Vul naam en doelstelling in", "Wijs projecten toe aan het programma", "Klik op Aanmaken"] }],
    tips: ["Gebruik programma's voor strategische initiatieven met meerdere projecten.", "Track benefits op programmaniveau voor strategisch inzicht.", "Stel regelmatige governance reviews in."],
    tourSteps: [{ title: "Programma's", description: "Hier beheert u strategische programma's met meerdere projecten." }],
  },
  "/governance": {
    pageTitle: "Governance",
    pageDescription: "Portfolio governance, boards en stakeholder management.",
    features: [
      { icon: Shield, title: "Portfolio's", description: "Beheer project portfolio's en prioritering" },
      { icon: Briefcase, title: "Boards", description: "Governance boards en besluitvorming" },
      { icon: Users, title: "Stakeholders", description: "Stakeholder analyse en communicatie" },
      { icon: BarChart3, title: "Rapportages", description: "Governance rapportages en dashboards" },
    ],
    howTos: [{ title: "Portfolio beheren", steps: ["Ga naar Governance → Portfolio's", "Bekijk de portfolio matrix", "Prioriteer projecten op basis van waarde en risico", "Neem portfolio-beslissingen"] }],
    tips: ["Gebruik portfolio management voor strategische projectselectie.", "Houd governance boards regelmatig (maandelijks) bij.", "Documenteer alle governance-beslissingen."],
    tourSteps: [{ title: "Governance", description: "Hier beheert u portfolio governance en besluitvorming." }],
  },
  "/reports": {
    pageTitle: "Rapportages",
    pageDescription: "Genereer project- en programmarapportages met analyses en inzichten.",
    features: [
      { icon: FileText, title: "Standaard rapporten", description: "Voorgedefinieerde rapportage templates" },
      { icon: BarChart3, title: "Dashboards", description: "Visuele project dashboards" },
      { icon: TrendingUp, title: "Trendanalyse", description: "Projectprestaties over tijd" },
      { icon: FileText, title: "Export", description: "Exporteer naar PDF, Excel of PowerPoint" },
    ],
    howTos: [{ title: "Rapport genereren", steps: ["Open Rapportages", "Selecteer het rapporttype", "Kies projecten en periode", "Genereer het rapport", "Download of deel met stakeholders"] }],
    tips: ["Genereer wekelijks statusrapporten voor stakeholders.", "Gebruik trendanalyses om problemen vroegtijdig te signaleren.", "Pas rapporten aan per doelgroep (stuurgroep vs. team)."],
    tourSteps: [{ title: "Rapportages", description: "Hier genereert u project- en programmarapportages." }],
  },
  "/team": {
    pageTitle: "Team",
    pageDescription: "Beheer uw teamleden, rollen en capaciteit.",
    features: [
      { icon: Users, title: "Teamoverzicht", description: "Alle teamleden en hun rollen" },
      { icon: Target, title: "Capaciteitsplanning", description: "Beschikbaarheid en allocatie per teamlid" },
      { icon: BarChart3, title: "Werklast", description: "Werklast verdeling over het team" },
      { icon: Calendar, title: "Beschikbaarheid", description: "Vakanties, verlof en beschikbaarheid" },
    ],
    howTos: [{ title: "Teamlid toevoegen", steps: ["Open het Team overzicht", "Klik op '+ Teamlid uitnodigen'", "Vul e-mail en rol in", "Wijs projecten toe", "Verstuur de uitnodiging"] }],
    tips: ["Houd capaciteitsplanning actueel voor realistische planning.", "Verdeel taken gelijkmatig om overbelasting te voorkomen.", "Gebruik rollen voor duidelijke verantwoordelijkheden."],
    tourSteps: [{ title: "Team", description: "Hier beheert u uw team, rollen en capaciteit." }],
  },
  "/time-tracking": {
    pageTitle: "Tijdregistratie",
    pageDescription: "Registreer en analyseer tijdsbesteding per project, taak en teamlid.",
    features: [
      { icon: Clock, title: "Uren registreren", description: "Log uren per project en taak" },
      { icon: BarChart3, title: "Urenanalyse", description: "Analyse van tijdsbesteding per categorie" },
      { icon: Target, title: "Budget tracking", description: "Vergelijk bestede vs. geplande uren" },
      { icon: FileText, title: "Urenstaten", description: "Genereer urenstaten en overzichten" },
    ],
    howTos: [{ title: "Uren loggen", steps: ["Open Tijdregistratie", "Selecteer het project en de taak", "Vul de datum en het aantal uren in", "Voeg een notitie toe (optioneel)", "Klik op Opslaan"] }],
    tips: ["Log uren dagelijks voor de meest nauwkeurige registratie.", "Gebruik categorieën voor betere analyse (development, meetings, etc.).", "Review wekelijks of de registratie compleet is."],
    tourSteps: [{ title: "Tijdregistratie", description: "Hier registreert en analyseert u tijdsbesteding." }],
  },
  "/ai-assistant": {
    pageTitle: "AI Assistent",
    pageDescription: "Uw persoonlijke AI project management assistent voor analyses en advies.",
    features: [
      { icon: Brain, title: "AI Analyses", description: "Automatische project analyses en inzichten" },
      { icon: AlertTriangle, title: "Risico detectie", description: "AI identificeert risico's proactief" },
      { icon: Lightbulb, title: "Advies", description: "AI-gestuurde aanbevelingen per project" },
      { icon: FileText, title: "Rapportage", description: "Automatisch gegenereerde rapporten" },
    ],
    howTos: [{ title: "AI Assistent gebruiken", steps: ["Open de AI Assistent pagina", "Stel een vraag over uw project", "AI analyseert uw data en geeft advies", "Pas het advies toe in uw projectmanagement"] }],
    tips: ["Stel specifieke vragen voor de beste resultaten.", "Gebruik AI voor risico-scans vóór belangrijke milestones.", "Laat AI statusrapporten genereren om tijd te besparen."],
    tourSteps: [{ title: "AI Assistent", description: "Hier gebruikt u AI voor project analyses en advies." }],
  },
  "/post-project": {
    pageTitle: "Post Project",
    pageDescription: "Evalueer afgeronde projecten en documenteer lessons learned.",
    features: [
      { icon: CheckCircle2, title: "Project evaluatie", description: "Systematische evaluatie van afgeronde projecten" },
      { icon: BookOpen, title: "Lessons learned", description: "Documenteer en deel geleerde lessen" },
      { icon: BarChart3, title: "Prestatie-analyse", description: "Vergelijk planning vs. realisatie" },
      { icon: Target, title: "Benefits realisatie", description: "Meet of verwachte baten zijn gerealiseerd" },
    ],
    howTos: [{ title: "Post-project review", steps: ["Selecteer het afgeronde project", "Doorloop de evaluatiechecklist", "Documenteer lessons learned", "Beoordeel de benefits realisatie", "Deel resultaten met stakeholders"] }],
    tips: ["Voer de review uit binnen 2 weken na projectafsluiting.", "Betrek het hele team bij lessons learned sessies.", "Gebruik lessons learned in toekomstige projecten."],
    tourSteps: [{ title: "Post Project", description: "Hier evalueert u projecten en documenteert lessons learned." }],
  },
  "/profile": {
    pageTitle: "Profiel",
    pageDescription: "Beheer uw persoonlijke instellingen, profielfoto en voorkeuren.",
    features: [
      { icon: Users, title: "Profielgegevens", description: "Naam, foto en contactgegevens" },
      { icon: Settings, title: "Voorkeuren", description: "Taal, thema en notificatie-instellingen" },
      { icon: Shield, title: "Beveiliging", description: "Wachtwoord en authenticatie" },
      { icon: BarChart3, title: "Activiteit", description: "Uw recente activiteiten overzicht" },
    ],
    howTos: [{ title: "Profiel bijwerken", steps: ["Open uw Profiel", "Klik op 'Bewerken'", "Pas uw gegevens aan", "Upload een profielfoto", "Klik op Opslaan"] }],
    tips: ["Houd uw contactgegevens up-to-date.", "Stel notificatie-voorkeuren in voor relevante meldingen.", "Kies een thema (licht/donker) dat prettig werkt."],
    tourSteps: [{ title: "Profiel", description: "Hier beheert u uw persoonlijke instellingen." }],
  },
  "/settings": {
    pageTitle: "Instellingen",
    pageDescription: "Configureer systeem-, team- en projectinstellingen.",
    features: [
      { icon: Settings, title: "Systeeminstellingen", description: "Algemene configuratie en voorkeuren" },
      { icon: Users, title: "Gebruikersbeheer", description: "Rollen, rechten en uitnodigingen" },
      { icon: Workflow, title: "Workflows", description: "Aangepaste workflows en goedkeuringsprocessen" },
      { icon: Shield, title: "Beveiliging", description: "Beveiligingsinstellingen en audit trails" },
    ],
    howTos: [{ title: "Instellingen aanpassen", steps: ["Open Instellingen", "Navigeer naar de gewenste sectie", "Pas de configuratie aan", "Klik op Opslaan"] }],
    tips: ["Stel rollen en rechten zorgvuldig in voor goede governance.", "Configureer notificaties per project voor relevante updates.", "Review instellingen periodiek na organisatiewijzigingen."],
    tourSteps: [{ title: "Instellingen", description: "Hier configureert u alle systeem- en projectinstellingen." }],
  },
  "/surveys": {
    pageTitle: "Enquêtes",
    pageDescription: "Maak en verstuur enquêtes voor projectfeedback en teamtevredenheid.",
    features: [
      { icon: FileText, title: "Enquête builder", description: "Maak enquêtes met diverse vraagtypen" },
      { icon: Users, title: "Verspreiding", description: "Verstuur naar teams en stakeholders" },
      { icon: BarChart3, title: "Resultaten", description: "Analyseer antwoorden en trends" },
      { icon: TrendingUp, title: "Inzichten", description: "AI-gestuurde analyse van feedback" },
    ],
    howTos: [{ title: "Enquête maken", steps: ["Klik op '+ Nieuwe Enquête'", "Voeg vragen toe (multiple choice, schaal, open)", "Stel de doelgroep in", "Verstuur de enquête", "Bekijk resultaten in het dashboard"] }],
    tips: ["Houd enquêtes kort (max 10 vragen) voor hogere response rates.", "Verstuur na elke sprint of fase een korte retrospective enquête.", "Gebruik NPS-vragen voor vergelijkbare metingen over tijd."],
    tourSteps: [{ title: "Enquêtes", description: "Hier maakt en analyseert u enquêtes voor projectfeedback." }],
  },
};

const GUIDE_EN: Record<string, GuideContent> = {
  "/dashboard": {
    pageTitle: "Dashboard",
    pageDescription: "Your central project cockpit with an overview of all projects, programs, and tasks.",
    features: [
      { icon: BarChart3, title: "Project overview", description: "Status of all your projects at a glance" },
      { icon: ListChecks, title: "Tasks & deadlines", description: "Open tasks and upcoming deadlines" },
      { icon: TrendingUp, title: "Progress", description: "Progress charts and burndown charts" },
      { icon: AlertTriangle, title: "Risks & alerts", description: "Warnings for project risks" },
    ],
    howTos: [{ title: "Using the Dashboard", steps: ["View project status cards at the top", "Scroll for task and deadline overview", "Click a project for details", "Use filters for specific views"] }],
    tips: ["Check your dashboard daily for up-to-date project status.", "Click risk alerts for immediate action.", "Use the AI Copilot for quick project insights."],
    tourSteps: [{ title: "Welcome to the Dashboard", description: "This is your central project cockpit. Here you see all important project information." }],
  },
  "/projects": {
    pageTitle: "Projects",
    pageDescription: "Manage all your projects with support for Scrum, Kanban, PRINCE2, Waterfall, and more.",
    features: [
      { icon: FolderKanban, title: "Project portfolio", description: "Overview of all projects with status and progress" },
      { icon: Layers, title: "Methodology choice", description: "Choose the right methodology per project" },
      { icon: Users, title: "Team assignment", description: "Assign team members to projects" },
      { icon: Target, title: "Goals & KPIs", description: "Set project goals and measurable KPIs" },
    ],
    howTos: [
      { title: "Create a project", steps: ["Click '+ New Project'", "Fill in project name and description", "Select the methodology (Scrum, Kanban, etc.)", "Set up the team and schedule", "Click Create"] },
      { title: "View a project", steps: ["Click a project in the list", "View project details and progress", "Navigate via the submenu to specific sections", "Use methodology-specific tools"] },
    ],
    tips: ["Choose the right methodology at the start — changing later is complex.", "Always create a project charter as the foundation.", "Use the AI Copilot for risk analysis and advice."],
    tourSteps: [{ title: "Projects", description: "Here you manage all your projects and choose the right approach." }],
  },
  "/programs": {
    pageTitle: "Programs",
    pageDescription: "Manage programs that bundle multiple related projects (SAFe, MSP, PMI, PRINCE2).",
    features: [
      { icon: Building2, title: "Program portfolio", description: "Overview of all programs" },
      { icon: GitBranch, title: "Project bundling", description: "Group related projects" },
      { icon: Target, title: "Benefits management", description: "Track program benefits and value realization" },
      { icon: Users, title: "Stakeholder management", description: "Manage stakeholders at program level" },
    ],
    howTos: [{ title: "Create a program", steps: ["Click '+ New Program'", "Choose the program methodology (SAFe, MSP, etc.)", "Fill in name and objectives", "Assign projects to the program", "Click Create"] }],
    tips: ["Use programs for strategic initiatives with multiple projects.", "Track benefits at program level for strategic insight.", "Set up regular governance reviews."],
    tourSteps: [{ title: "Programs", description: "Here you manage strategic programs with multiple projects." }],
  },
  "/governance": {
    pageTitle: "Governance",
    pageDescription: "Portfolio governance, boards, and stakeholder management.",
    features: [
      { icon: Shield, title: "Portfolios", description: "Manage project portfolios and prioritization" },
      { icon: Briefcase, title: "Boards", description: "Governance boards and decision-making" },
      { icon: Users, title: "Stakeholders", description: "Stakeholder analysis and communication" },
      { icon: BarChart3, title: "Reports", description: "Governance reports and dashboards" },
    ],
    howTos: [{ title: "Manage portfolio", steps: ["Go to Governance → Portfolios", "View the portfolio matrix", "Prioritize projects based on value and risk", "Make portfolio decisions"] }],
    tips: ["Use portfolio management for strategic project selection.", "Keep governance boards updated regularly (monthly).", "Document all governance decisions."],
    tourSteps: [{ title: "Governance", description: "Here you manage portfolio governance and decision-making." }],
  },
  "/reports": {
    pageTitle: "Reports",
    pageDescription: "Generate project and program reports with analyses and insights.",
    features: [
      { icon: FileText, title: "Standard reports", description: "Predefined reporting templates" },
      { icon: BarChart3, title: "Dashboards", description: "Visual project dashboards" },
      { icon: TrendingUp, title: "Trend analysis", description: "Project performance over time" },
      { icon: FileText, title: "Export", description: "Export to PDF, Excel, or PowerPoint" },
    ],
    howTos: [{ title: "Generate a report", steps: ["Open Reports", "Select the report type", "Choose projects and period", "Generate the report", "Download or share with stakeholders"] }],
    tips: ["Generate weekly status reports for stakeholders.", "Use trend analyses to identify issues early.", "Customize reports per audience (steering committee vs. team)."],
    tourSteps: [{ title: "Reports", description: "Here you generate project and program reports." }],
  },
  "/team": {
    pageTitle: "Team",
    pageDescription: "Manage your team members, roles, and capacity.",
    features: [
      { icon: Users, title: "Team overview", description: "All team members and their roles" },
      { icon: Target, title: "Capacity planning", description: "Availability and allocation per team member" },
      { icon: BarChart3, title: "Workload", description: "Workload distribution across the team" },
      { icon: Calendar, title: "Availability", description: "Vacations, leave, and availability" },
    ],
    howTos: [{ title: "Add a team member", steps: ["Open the Team overview", "Click '+ Invite Team Member'", "Fill in email and role", "Assign projects", "Send the invitation"] }],
    tips: ["Keep capacity planning up to date for realistic planning.", "Distribute tasks evenly to prevent overload.", "Use roles for clear responsibilities."],
    tourSteps: [{ title: "Team", description: "Here you manage your team, roles, and capacity." }],
  },
  "/time-tracking": {
    pageTitle: "Time Tracking",
    pageDescription: "Record and analyze time spent per project, task, and team member.",
    features: [
      { icon: Clock, title: "Log hours", description: "Log hours per project and task" },
      { icon: BarChart3, title: "Time analysis", description: "Analysis of time spent per category" },
      { icon: Target, title: "Budget tracking", description: "Compare spent vs. planned hours" },
      { icon: FileText, title: "Timesheets", description: "Generate timesheets and overviews" },
    ],
    howTos: [{ title: "Log hours", steps: ["Open Time Tracking", "Select the project and task", "Enter the date and number of hours", "Add a note (optional)", "Click Save"] }],
    tips: ["Log hours daily for the most accurate tracking.", "Use categories for better analysis (development, meetings, etc.).", "Review weekly if the registration is complete."],
    tourSteps: [{ title: "Time Tracking", description: "Here you record and analyze time spent." }],
  },
  "/ai-assistant": {
    pageTitle: "AI Assistant",
    pageDescription: "Your personal AI project management assistant for analyses and advice.",
    features: [
      { icon: Brain, title: "AI Analyses", description: "Automatic project analyses and insights" },
      { icon: AlertTriangle, title: "Risk detection", description: "AI proactively identifies risks" },
      { icon: Lightbulb, title: "Advice", description: "AI-driven recommendations per project" },
      { icon: FileText, title: "Reporting", description: "Automatically generated reports" },
    ],
    howTos: [{ title: "Using the AI Assistant", steps: ["Open the AI Assistant page", "Ask a question about your project", "AI analyzes your data and gives advice", "Apply the advice in your project management"] }],
    tips: ["Ask specific questions for the best results.", "Use AI for risk scans before important milestones.", "Let AI generate status reports to save time."],
    tourSteps: [{ title: "AI Assistant", description: "Here you use AI for project analyses and advice." }],
  },
  "/post-project": {
    pageTitle: "Post Project",
    pageDescription: "Evaluate completed projects and document lessons learned.",
    features: [
      { icon: CheckCircle2, title: "Project evaluation", description: "Systematic evaluation of completed projects" },
      { icon: BookOpen, title: "Lessons learned", description: "Document and share lessons learned" },
      { icon: BarChart3, title: "Performance analysis", description: "Compare planning vs. actual" },
      { icon: Target, title: "Benefits realization", description: "Measure if expected benefits were realized" },
    ],
    howTos: [{ title: "Post-project review", steps: ["Select the completed project", "Go through the evaluation checklist", "Document lessons learned", "Assess benefits realization", "Share results with stakeholders"] }],
    tips: ["Conduct the review within 2 weeks after project closure.", "Involve the entire team in lessons learned sessions.", "Use lessons learned in future projects."],
    tourSteps: [{ title: "Post Project", description: "Here you evaluate projects and document lessons learned." }],
  },
  "/profile": {
    pageTitle: "Profile",
    pageDescription: "Manage your personal settings, profile photo, and preferences.",
    features: [
      { icon: Users, title: "Profile details", description: "Name, photo, and contact information" },
      { icon: Settings, title: "Preferences", description: "Language, theme, and notification settings" },
      { icon: Shield, title: "Security", description: "Password and authentication" },
      { icon: BarChart3, title: "Activity", description: "Your recent activity overview" },
    ],
    howTos: [{ title: "Update profile", steps: ["Open your Profile", "Click 'Edit'", "Update your details", "Upload a profile photo", "Click Save"] }],
    tips: ["Keep your contact details up to date.", "Set notification preferences for relevant alerts.", "Choose a theme (light/dark) that works for you."],
    tourSteps: [{ title: "Profile", description: "Here you manage your personal settings." }],
  },
  "/settings": {
    pageTitle: "Settings",
    pageDescription: "Configure system, team, and project settings.",
    features: [
      { icon: Settings, title: "System settings", description: "General configuration and preferences" },
      { icon: Users, title: "User management", description: "Roles, permissions, and invitations" },
      { icon: Workflow, title: "Workflows", description: "Custom workflows and approval processes" },
      { icon: Shield, title: "Security", description: "Security settings and audit trails" },
    ],
    howTos: [{ title: "Adjust settings", steps: ["Open Settings", "Navigate to the desired section", "Adjust the configuration", "Click Save"] }],
    tips: ["Set roles and permissions carefully for good governance.", "Configure notifications per project for relevant updates.", "Review settings periodically after organizational changes."],
    tourSteps: [{ title: "Settings", description: "Here you configure all system and project settings." }],
  },
  "/surveys": {
    pageTitle: "Surveys",
    pageDescription: "Create and send surveys for project feedback and team satisfaction.",
    features: [
      { icon: FileText, title: "Survey builder", description: "Create surveys with various question types" },
      { icon: Users, title: "Distribution", description: "Send to teams and stakeholders" },
      { icon: BarChart3, title: "Results", description: "Analyze responses and trends" },
      { icon: TrendingUp, title: "Insights", description: "AI-driven analysis of feedback" },
    ],
    howTos: [{ title: "Create a survey", steps: ["Click '+ New Survey'", "Add questions (multiple choice, scale, open)", "Set the target audience", "Send the survey", "View results in the dashboard"] }],
    tips: ["Keep surveys short (max 10 questions) for higher response rates.", "Send a short retrospective survey after each sprint or phase.", "Use NPS questions for comparable measurements over time."],
    tourSteps: [{ title: "Surveys", description: "Here you create and analyze surveys for project feedback." }],
  },
};

const GUIDE_FR: Record<string, GuideContent> = {
  "/dashboard": {
    pageTitle: "Tableau de bord",
    pageDescription: "Votre cockpit central de projet avec un aperçu de tous les projets, programmes et tâches.",
    features: [
      { icon: BarChart3, title: "Aperçu des projets", description: "Statut de tous vos projets en un coup d'œil" },
      { icon: ListChecks, title: "Tâches & échéances", description: "Tâches ouvertes et échéances à venir" },
      { icon: TrendingUp, title: "Progression", description: "Graphiques de progression et burndown charts" },
      { icon: AlertTriangle, title: "Risques & alertes", description: "Avertissements pour les risques du projet" },
    ],
    howTos: [{ title: "Utiliser le tableau de bord", steps: ["Consultez les cartes de statut du projet en haut", "Faites défiler pour l'aperçu des tâches et échéances", "Cliquez sur un projet pour les détails", "Utilisez les filtres pour des vues spécifiques"] }],
    tips: ["Consultez votre tableau de bord quotidiennement pour un statut à jour.", "Cliquez sur les alertes de risque pour une action immédiate.", "Utilisez l'AI Copilot pour des aperçus rapides du projet."],
    tourSteps: [{ title: "Bienvenue sur le Tableau de bord", description: "C'est votre cockpit central de projet. Ici vous voyez toutes les informations importantes." }],
  },
  "/projects": {
    pageTitle: "Projets",
    pageDescription: "Gérez tous vos projets avec support pour Scrum, Kanban, PRINCE2, Waterfall et plus.",
    features: [
      { icon: FolderKanban, title: "Portfolio de projets", description: "Aperçu de tous les projets avec statut et progression" },
      { icon: Layers, title: "Choix de méthodologie", description: "Choisissez la bonne méthodologie par projet" },
      { icon: Users, title: "Affectation d'équipe", description: "Affectez des membres à des projets" },
      { icon: Target, title: "Objectifs & KPIs", description: "Définissez des objectifs et des KPIs mesurables" },
    ],
    howTos: [
      { title: "Créer un projet", steps: ["Cliquez sur '+ Nouveau Projet'", "Remplissez le nom et la description", "Sélectionnez la méthodologie (Scrum, Kanban, etc.)", "Configurez l'équipe et le planning", "Cliquez sur Créer"] },
      { title: "Voir un projet", steps: ["Cliquez sur un projet dans la liste", "Consultez les détails et la progression", "Naviguez via le sous-menu vers des sections spécifiques", "Utilisez les outils spécifiques à la méthodologie"] },
    ],
    tips: ["Choisissez la bonne méthodologie au début — changer plus tard est complexe.", "Créez toujours une charte de projet comme fondation.", "Utilisez l'AI Copilot pour l'analyse des risques et les conseils."],
    tourSteps: [{ title: "Projets", description: "Ici vous gérez tous vos projets et choisissez la bonne approche." }],
  },
  "/programs": {
    pageTitle: "Programmes",
    pageDescription: "Gérez des programmes regroupant plusieurs projets liés (SAFe, MSP, PMI, PRINCE2).",
    features: [
      { icon: Building2, title: "Portfolio de programmes", description: "Aperçu de tous les programmes" },
      { icon: GitBranch, title: "Regroupement de projets", description: "Regroupez des projets liés" },
      { icon: Target, title: "Gestion des bénéfices", description: "Suivez les bénéfices et la réalisation de valeur" },
      { icon: Users, title: "Gestion des parties prenantes", description: "Gérez les parties prenantes au niveau programme" },
    ],
    howTos: [{ title: "Créer un programme", steps: ["Cliquez sur '+ Nouveau Programme'", "Choisissez la méthodologie (SAFe, MSP, etc.)", "Remplissez le nom et les objectifs", "Affectez des projets au programme", "Cliquez sur Créer"] }],
    tips: ["Utilisez les programmes pour des initiatives stratégiques avec plusieurs projets.", "Suivez les bénéfices au niveau programme pour un aperçu stratégique.", "Mettez en place des revues de gouvernance régulières."],
    tourSteps: [{ title: "Programmes", description: "Ici vous gérez des programmes stratégiques avec plusieurs projets." }],
  },
  "/governance": {
    pageTitle: "Gouvernance",
    pageDescription: "Gouvernance de portfolio, comités et gestion des parties prenantes.",
    features: [
      { icon: Shield, title: "Portfolios", description: "Gérez les portfolios de projets et la priorisation" },
      { icon: Briefcase, title: "Comités", description: "Comités de gouvernance et prise de décision" },
      { icon: Users, title: "Parties prenantes", description: "Analyse et communication des parties prenantes" },
      { icon: BarChart3, title: "Rapports", description: "Rapports de gouvernance et tableaux de bord" },
    ],
    howTos: [{ title: "Gérer le portfolio", steps: ["Allez dans Gouvernance → Portfolios", "Consultez la matrice du portfolio", "Priorisez les projets selon la valeur et le risque", "Prenez des décisions de portfolio"] }],
    tips: ["Utilisez la gestion de portfolio pour la sélection stratégique de projets.", "Tenez les comités à jour régulièrement (mensuellement).", "Documentez toutes les décisions de gouvernance."],
    tourSteps: [{ title: "Gouvernance", description: "Ici vous gérez la gouvernance de portfolio et la prise de décision." }],
  },
  "/reports": {
    pageTitle: "Rapports",
    pageDescription: "Générez des rapports de projet et de programme avec analyses et aperçus.",
    features: [
      { icon: FileText, title: "Rapports standard", description: "Modèles de rapports prédéfinis" },
      { icon: BarChart3, title: "Tableaux de bord", description: "Tableaux de bord visuels de projet" },
      { icon: TrendingUp, title: "Analyse des tendances", description: "Performance du projet au fil du temps" },
      { icon: FileText, title: "Exportation", description: "Exportez en PDF, Excel ou PowerPoint" },
    ],
    howTos: [{ title: "Générer un rapport", steps: ["Ouvrez Rapports", "Sélectionnez le type de rapport", "Choisissez les projets et la période", "Générez le rapport", "Téléchargez ou partagez avec les parties prenantes"] }],
    tips: ["Générez des rapports de statut hebdomadaires pour les parties prenantes.", "Utilisez les analyses de tendances pour identifier les problèmes tôt.", "Personnalisez les rapports par audience (comité de pilotage vs. équipe)."],
    tourSteps: [{ title: "Rapports", description: "Ici vous générez des rapports de projet et de programme." }],
  },
  "/team": {
    pageTitle: "Équipe",
    pageDescription: "Gérez vos membres d'équipe, rôles et capacité.",
    features: [
      { icon: Users, title: "Aperçu de l'équipe", description: "Tous les membres et leurs rôles" },
      { icon: Target, title: "Planification de capacité", description: "Disponibilité et allocation par membre" },
      { icon: BarChart3, title: "Charge de travail", description: "Répartition de la charge de travail" },
      { icon: Calendar, title: "Disponibilité", description: "Vacances, congés et disponibilité" },
    ],
    howTos: [{ title: "Ajouter un membre", steps: ["Ouvrez l'aperçu de l'Équipe", "Cliquez sur '+ Inviter un membre'", "Remplissez l'email et le rôle", "Affectez des projets", "Envoyez l'invitation"] }],
    tips: ["Maintenez la planification de capacité à jour pour une planification réaliste.", "Répartissez les tâches de manière égale pour éviter la surcharge.", "Utilisez les rôles pour des responsabilités claires."],
    tourSteps: [{ title: "Équipe", description: "Ici vous gérez votre équipe, les rôles et la capacité." }],
  },
  "/time-tracking": {
    pageTitle: "Suivi du temps",
    pageDescription: "Enregistrez et analysez le temps passé par projet, tâche et membre d'équipe.",
    features: [
      { icon: Clock, title: "Enregistrer les heures", description: "Enregistrez les heures par projet et tâche" },
      { icon: BarChart3, title: "Analyse du temps", description: "Analyse du temps passé par catégorie" },
      { icon: Target, title: "Suivi du budget", description: "Comparez les heures passées vs. planifiées" },
      { icon: FileText, title: "Feuilles de temps", description: "Générez des feuilles de temps" },
    ],
    howTos: [{ title: "Enregistrer les heures", steps: ["Ouvrez Suivi du temps", "Sélectionnez le projet et la tâche", "Entrez la date et le nombre d'heures", "Ajoutez une note (optionnel)", "Cliquez sur Enregistrer"] }],
    tips: ["Enregistrez les heures quotidiennement pour un suivi précis.", "Utilisez des catégories pour une meilleure analyse (développement, réunions, etc.).", "Vérifiez chaque semaine si l'enregistrement est complet."],
    tourSteps: [{ title: "Suivi du temps", description: "Ici vous enregistrez et analysez le temps passé." }],
  },
  "/ai-assistant": {
    pageTitle: "Assistant IA",
    pageDescription: "Votre assistant IA personnel de gestion de projet pour analyses et conseils.",
    features: [
      { icon: Brain, title: "Analyses IA", description: "Analyses automatiques de projet et aperçus" },
      { icon: AlertTriangle, title: "Détection des risques", description: "L'IA identifie les risques de manière proactive" },
      { icon: Lightbulb, title: "Conseils", description: "Recommandations pilotées par l'IA par projet" },
      { icon: FileText, title: "Rapports", description: "Rapports générés automatiquement" },
    ],
    howTos: [{ title: "Utiliser l'Assistant IA", steps: ["Ouvrez la page Assistant IA", "Posez une question sur votre projet", "L'IA analyse vos données et donne des conseils", "Appliquez les conseils dans votre gestion de projet"] }],
    tips: ["Posez des questions spécifiques pour de meilleurs résultats.", "Utilisez l'IA pour des scans de risques avant les jalons importants.", "Laissez l'IA générer des rapports de statut pour gagner du temps."],
    tourSteps: [{ title: "Assistant IA", description: "Ici vous utilisez l'IA pour les analyses de projet et les conseils." }],
  },
  "/post-project": {
    pageTitle: "Post Projet",
    pageDescription: "Évaluez les projets terminés et documentez les leçons apprises.",
    features: [
      { icon: CheckCircle2, title: "Évaluation de projet", description: "Évaluation systématique des projets terminés" },
      { icon: BookOpen, title: "Leçons apprises", description: "Documentez et partagez les leçons apprises" },
      { icon: BarChart3, title: "Analyse de performance", description: "Comparez planification vs. réalisation" },
      { icon: Target, title: "Réalisation des bénéfices", description: "Mesurez si les bénéfices attendus ont été réalisés" },
    ],
    howTos: [{ title: "Revue post-projet", steps: ["Sélectionnez le projet terminé", "Parcourez la checklist d'évaluation", "Documentez les leçons apprises", "Évaluez la réalisation des bénéfices", "Partagez les résultats avec les parties prenantes"] }],
    tips: ["Effectuez la revue dans les 2 semaines après la clôture du projet.", "Impliquez toute l'équipe dans les sessions de leçons apprises.", "Utilisez les leçons apprises dans les projets futurs."],
    tourSteps: [{ title: "Post Projet", description: "Ici vous évaluez les projets et documentez les leçons apprises." }],
  },
  "/profile": {
    pageTitle: "Profil",
    pageDescription: "Gérez vos paramètres personnels, photo de profil et préférences.",
    features: [
      { icon: Users, title: "Détails du profil", description: "Nom, photo et coordonnées" },
      { icon: Settings, title: "Préférences", description: "Langue, thème et paramètres de notification" },
      { icon: Shield, title: "Sécurité", description: "Mot de passe et authentification" },
      { icon: BarChart3, title: "Activité", description: "Aperçu de vos activités récentes" },
    ],
    howTos: [{ title: "Mettre à jour le profil", steps: ["Ouvrez votre Profil", "Cliquez sur 'Modifier'", "Mettez à jour vos informations", "Téléchargez une photo de profil", "Cliquez sur Enregistrer"] }],
    tips: ["Gardez vos coordonnées à jour.", "Configurez les préférences de notification pour des alertes pertinentes.", "Choisissez un thème (clair/sombre) qui vous convient."],
    tourSteps: [{ title: "Profil", description: "Ici vous gérez vos paramètres personnels." }],
  },
  "/settings": {
    pageTitle: "Paramètres",
    pageDescription: "Configurez les paramètres système, équipe et projet.",
    features: [
      { icon: Settings, title: "Paramètres système", description: "Configuration générale et préférences" },
      { icon: Users, title: "Gestion des utilisateurs", description: "Rôles, permissions et invitations" },
      { icon: Workflow, title: "Flux de travail", description: "Flux de travail personnalisés et processus d'approbation" },
      { icon: Shield, title: "Sécurité", description: "Paramètres de sécurité et journaux d'audit" },
    ],
    howTos: [{ title: "Ajuster les paramètres", steps: ["Ouvrez Paramètres", "Naviguez vers la section souhaitée", "Ajustez la configuration", "Cliquez sur Enregistrer"] }],
    tips: ["Configurez les rôles et permissions soigneusement pour une bonne gouvernance.", "Configurez les notifications par projet pour des mises à jour pertinentes.", "Revoyez les paramètres périodiquement après des changements organisationnels."],
    tourSteps: [{ title: "Paramètres", description: "Ici vous configurez tous les paramètres système et projet." }],
  },
  "/surveys": {
    pageTitle: "Enquêtes",
    pageDescription: "Créez et envoyez des enquêtes pour le feedback de projet et la satisfaction de l'équipe.",
    features: [
      { icon: FileText, title: "Créateur d'enquêtes", description: "Créez des enquêtes avec différents types de questions" },
      { icon: Users, title: "Distribution", description: "Envoyez aux équipes et parties prenantes" },
      { icon: BarChart3, title: "Résultats", description: "Analysez les réponses et tendances" },
      { icon: TrendingUp, title: "Aperçus", description: "Analyse pilotée par l'IA du feedback" },
    ],
    howTos: [{ title: "Créer une enquête", steps: ["Cliquez sur '+ Nouvelle Enquête'", "Ajoutez des questions (choix multiple, échelle, ouvert)", "Définissez l'audience cible", "Envoyez l'enquête", "Consultez les résultats dans le tableau de bord"] }],
    tips: ["Gardez les enquêtes courtes (max 10 questions) pour un meilleur taux de réponse.", "Envoyez une courte enquête rétrospective après chaque sprint ou phase.", "Utilisez des questions NPS pour des mesures comparables dans le temps."],
    tourSteps: [{ title: "Enquêtes", description: "Ici vous créez et analysez des enquêtes pour le feedback de projet." }],
  },
};

const GUIDE_MAPS: Record<Lang, Record<string, GuideContent>> = { en: GUIDE_EN, nl: GUIDE_NL, fr: GUIDE_FR };

const DEFAULT_GUIDES: Record<Lang, GuideContent> = {
  nl: {
    pageTitle: "ProjeXtPal",
    pageDescription: "Uw complete AI-gestuurde project management platform. Ontdek hieronder alle modules.",
    features: [
      { icon: Layout, title: "Dashboard", description: "Centraal overzicht van al uw projecten" },
      { icon: FolderKanban, title: "Projecten", description: "Projectbeheer met diverse methodologieën" },
      { icon: Building2, title: "Programma's", description: "Strategische programma's met meerdere projecten" },
      { icon: GraduationCap, title: "Academy", description: "Leer project management methodologieën" },
    ],
    howTos: [
      { title: "Aan de slag met ProjeXtPal", steps: ["Maak uw eerste project aan via Projecten", "Kies de juiste methodologie (Scrum, Kanban, PRINCE2, etc.)", "Stel uw team samen en wijs rollen toe", "Begin met plannen en taken toewijzen", "Monitor voortgang via het Dashboard"] },
      { title: "Navigeren in de applicatie", steps: ["Gebruik de zijbalk links om naar modules te navigeren", "Open de AI Copilot (rechtsboven) voor hulp op elke pagina", "Klik op 'Gids' voor pagina-specifieke handleidingen", "Methodologie-specifieke menu's verschijnen bij projectweergave"] },
    ],
    tips: ["Gebruik de AI Copilot om snel antwoorden te vinden over projectmanagement.", "Klik op 'Gids' op elke pagina voor context-specifieke handleidingen.", "De Academy biedt trainingen voor alle ondersteunde methodologieën."],
    tourSteps: [{ title: "Welkom bij ProjeXtPal", description: "Dit is uw complete project management platform. Laten we een rondleiding doen." }],
  },
  en: {
    pageTitle: "ProjeXtPal",
    pageDescription: "Your complete AI-driven project management platform. Explore all modules below.",
    features: [
      { icon: Layout, title: "Dashboard", description: "Central overview of all your projects" },
      { icon: FolderKanban, title: "Projects", description: "Project management with various methodologies" },
      { icon: Building2, title: "Programs", description: "Strategic programs with multiple projects" },
      { icon: GraduationCap, title: "Academy", description: "Learn project management methodologies" },
    ],
    howTos: [
      { title: "Getting started with ProjeXtPal", steps: ["Create your first project via Projects", "Choose the right methodology (Scrum, Kanban, PRINCE2, etc.)", "Set up your team and assign roles", "Start planning and assigning tasks", "Monitor progress via the Dashboard"] },
      { title: "Navigating the application", steps: ["Use the left sidebar to navigate to modules", "Open the AI Copilot (top right) for help on any page", "Click 'Guide' for page-specific instructions", "Methodology-specific menus appear in project view"] },
    ],
    tips: ["Use the AI Copilot to quickly find answers about project management.", "Click 'Guide' on any page for context-specific instructions.", "The Academy offers training for all supported methodologies."],
    tourSteps: [{ title: "Welcome to ProjeXtPal", description: "This is your complete project management platform. Let's take a tour." }],
  },
  fr: {
    pageTitle: "ProjeXtPal",
    pageDescription: "Votre plateforme complète de gestion de projet pilotée par l'IA. Découvrez tous les modules ci-dessous.",
    features: [
      { icon: Layout, title: "Tableau de bord", description: "Aperçu central de tous vos projets" },
      { icon: FolderKanban, title: "Projets", description: "Gestion de projet avec diverses méthodologies" },
      { icon: Building2, title: "Programmes", description: "Programmes stratégiques avec plusieurs projets" },
      { icon: GraduationCap, title: "Académie", description: "Apprenez les méthodologies de gestion de projet" },
    ],
    howTos: [
      { title: "Démarrer avec ProjeXtPal", steps: ["Créez votre premier projet via Projets", "Choisissez la bonne méthodologie (Scrum, Kanban, PRINCE2, etc.)", "Constituez votre équipe et attribuez les rôles", "Commencez à planifier et attribuer les tâches", "Suivez la progression via le Tableau de bord"] },
      { title: "Naviguer dans l'application", steps: ["Utilisez la barre latérale gauche pour naviguer vers les modules", "Ouvrez l'AI Copilot (en haut à droite) pour de l'aide sur chaque page", "Cliquez sur 'Guide' pour des instructions spécifiques à la page", "Les menus spécifiques à la méthodologie apparaissent dans la vue projet"] },
    ],
    tips: ["Utilisez l'AI Copilot pour trouver rapidement des réponses sur la gestion de projet.", "Cliquez sur 'Guide' sur chaque page pour des instructions contextuelles.", "L'Académie offre des formations pour toutes les méthodologies supportées."],
    tourSteps: [{ title: "Bienvenue sur ProjeXtPal", description: "C'est votre plateforme complète de gestion de projet. Faisons une visite." }],
  },
};

/* ─── Related pages per language ─── */

const RELATED_NL: Record<string, NavLink[]> = {
  "/dashboard":      [{ label: "Projecten", path: "/projects", icon: FolderKanban }, { label: "Rapportages", path: "/reports", icon: FileText }, { label: "Team", path: "/team", icon: Users }],
  "/projects":       [{ label: "Dashboard", path: "/dashboard", icon: Layout }, { label: "Programma's", path: "/programs", icon: Building2 }, { label: "Team", path: "/team", icon: Users }],
  "/programs":       [{ label: "Projecten", path: "/projects", icon: FolderKanban }, { label: "Governance", path: "/governance/portfolios", icon: Shield }, { label: "Rapportages", path: "/reports", icon: FileText }],
  "/governance":     [{ label: "Programma's", path: "/programs", icon: Building2 }, { label: "Rapportages", path: "/reports", icon: FileText }, { label: "Projecten", path: "/projects", icon: FolderKanban }],
  "/reports":        [{ label: "Dashboard", path: "/dashboard", icon: Layout }, { label: "Projecten", path: "/projects", icon: FolderKanban }, { label: "Tijdregistratie", path: "/time-tracking", icon: Clock }],
  "/team":           [{ label: "Projecten", path: "/projects", icon: FolderKanban }, { label: "Tijdregistratie", path: "/time-tracking", icon: Clock }, { label: "Dashboard", path: "/dashboard", icon: Layout }],
  "/time-tracking":  [{ label: "Projecten", path: "/projects", icon: FolderKanban }, { label: "Team", path: "/team", icon: Users }, { label: "Rapportages", path: "/reports", icon: FileText }],
  "/ai-assistant":   [{ label: "Dashboard", path: "/dashboard", icon: Layout }, { label: "Projecten", path: "/projects", icon: FolderKanban }, { label: "Rapportages", path: "/reports", icon: FileText }],
  "/post-project":   [{ label: "Projecten", path: "/projects", icon: FolderKanban }, { label: "Rapportages", path: "/reports", icon: FileText }, { label: "Enquêtes", path: "/surveys", icon: FileText }],
  "/profile":        [{ label: "Instellingen", path: "/settings", icon: Settings }, { label: "Dashboard", path: "/dashboard", icon: Layout }, { label: "Team", path: "/team", icon: Users }],
  "/settings":       [{ label: "Profiel", path: "/profile", icon: Users }, { label: "Team", path: "/team", icon: Users }, { label: "Governance", path: "/governance/portfolios", icon: Shield }],
  "/surveys":        [{ label: "Post Project", path: "/post-project", icon: CheckCircle2 }, { label: "Team", path: "/team", icon: Users }, { label: "Rapportages", path: "/reports", icon: FileText }],
};

const RELATED_EN: Record<string, NavLink[]> = {
  "/dashboard":      [{ label: "Projects", path: "/projects", icon: FolderKanban }, { label: "Reports", path: "/reports", icon: FileText }, { label: "Team", path: "/team", icon: Users }],
  "/projects":       [{ label: "Dashboard", path: "/dashboard", icon: Layout }, { label: "Programs", path: "/programs", icon: Building2 }, { label: "Team", path: "/team", icon: Users }],
  "/programs":       [{ label: "Projects", path: "/projects", icon: FolderKanban }, { label: "Governance", path: "/governance/portfolios", icon: Shield }, { label: "Reports", path: "/reports", icon: FileText }],
  "/governance":     [{ label: "Programs", path: "/programs", icon: Building2 }, { label: "Reports", path: "/reports", icon: FileText }, { label: "Projects", path: "/projects", icon: FolderKanban }],
  "/reports":        [{ label: "Dashboard", path: "/dashboard", icon: Layout }, { label: "Projects", path: "/projects", icon: FolderKanban }, { label: "Time Tracking", path: "/time-tracking", icon: Clock }],
  "/team":           [{ label: "Projects", path: "/projects", icon: FolderKanban }, { label: "Time Tracking", path: "/time-tracking", icon: Clock }, { label: "Dashboard", path: "/dashboard", icon: Layout }],
  "/time-tracking":  [{ label: "Projects", path: "/projects", icon: FolderKanban }, { label: "Team", path: "/team", icon: Users }, { label: "Reports", path: "/reports", icon: FileText }],
  "/ai-assistant":   [{ label: "Dashboard", path: "/dashboard", icon: Layout }, { label: "Projects", path: "/projects", icon: FolderKanban }, { label: "Reports", path: "/reports", icon: FileText }],
  "/post-project":   [{ label: "Projects", path: "/projects", icon: FolderKanban }, { label: "Reports", path: "/reports", icon: FileText }, { label: "Surveys", path: "/surveys", icon: FileText }],
  "/profile":        [{ label: "Settings", path: "/settings", icon: Settings }, { label: "Dashboard", path: "/dashboard", icon: Layout }, { label: "Team", path: "/team", icon: Users }],
  "/settings":       [{ label: "Profile", path: "/profile", icon: Users }, { label: "Team", path: "/team", icon: Users }, { label: "Governance", path: "/governance/portfolios", icon: Shield }],
  "/surveys":        [{ label: "Post Project", path: "/post-project", icon: CheckCircle2 }, { label: "Team", path: "/team", icon: Users }, { label: "Reports", path: "/reports", icon: FileText }],
};

const RELATED_FR: Record<string, NavLink[]> = {
  "/dashboard":      [{ label: "Projets", path: "/projects", icon: FolderKanban }, { label: "Rapports", path: "/reports", icon: FileText }, { label: "Équipe", path: "/team", icon: Users }],
  "/projects":       [{ label: "Tableau de bord", path: "/dashboard", icon: Layout }, { label: "Programmes", path: "/programs", icon: Building2 }, { label: "Équipe", path: "/team", icon: Users }],
  "/programs":       [{ label: "Projets", path: "/projects", icon: FolderKanban }, { label: "Gouvernance", path: "/governance/portfolios", icon: Shield }, { label: "Rapports", path: "/reports", icon: FileText }],
  "/governance":     [{ label: "Programmes", path: "/programs", icon: Building2 }, { label: "Rapports", path: "/reports", icon: FileText }, { label: "Projets", path: "/projects", icon: FolderKanban }],
  "/reports":        [{ label: "Tableau de bord", path: "/dashboard", icon: Layout }, { label: "Projets", path: "/projects", icon: FolderKanban }, { label: "Suivi du temps", path: "/time-tracking", icon: Clock }],
  "/team":           [{ label: "Projets", path: "/projects", icon: FolderKanban }, { label: "Suivi du temps", path: "/time-tracking", icon: Clock }, { label: "Tableau de bord", path: "/dashboard", icon: Layout }],
  "/time-tracking":  [{ label: "Projets", path: "/projects", icon: FolderKanban }, { label: "Équipe", path: "/team", icon: Users }, { label: "Rapports", path: "/reports", icon: FileText }],
  "/ai-assistant":   [{ label: "Tableau de bord", path: "/dashboard", icon: Layout }, { label: "Projets", path: "/projects", icon: FolderKanban }, { label: "Rapports", path: "/reports", icon: FileText }],
  "/post-project":   [{ label: "Projets", path: "/projects", icon: FolderKanban }, { label: "Rapports", path: "/reports", icon: FileText }, { label: "Enquêtes", path: "/surveys", icon: FileText }],
  "/profile":        [{ label: "Paramètres", path: "/settings", icon: Settings }, { label: "Tableau de bord", path: "/dashboard", icon: Layout }, { label: "Équipe", path: "/team", icon: Users }],
  "/settings":       [{ label: "Profil", path: "/profile", icon: Users }, { label: "Équipe", path: "/team", icon: Users }, { label: "Gouvernance", path: "/governance/portfolios", icon: Shield }],
  "/surveys":        [{ label: "Post Projet", path: "/post-project", icon: CheckCircle2 }, { label: "Équipe", path: "/team", icon: Users }, { label: "Rapports", path: "/reports", icon: FileText }],
};

const RELATED_PAGES_ALL: Record<Lang, Record<string, NavLink[]>> = { en: RELATED_EN, nl: RELATED_NL, fr: RELATED_FR };

/* ─── Sitemap per language ─── */
const SITEMAP_NL: NavSection[] = [
  { title: "Overzicht", links: [{ label: "Dashboard", path: "/dashboard", icon: Layout }, { label: "AI Assistent", path: "/ai-assistant", icon: Brain }] },
  { title: "Projecten & Programma's", links: [{ label: "Projecten", path: "/projects", icon: FolderKanban }, { label: "Programma's", path: "/programs", icon: Building2 }, { label: "Governance", path: "/governance/portfolios", icon: Shield }] },
  { title: "Team & Planning", links: [{ label: "Team", path: "/team", icon: Users }, { label: "Tijdregistratie", path: "/time-tracking", icon: Clock }, { label: "Rapportages", path: "/reports", icon: FileText }] },
  { title: "Evaluatie & Overig", links: [{ label: "Post Project", path: "/post-project", icon: CheckCircle2 }, { label: "Enquêtes", path: "/surveys", icon: FileText }, { label: "Profiel", path: "/profile", icon: Users }, { label: "Instellingen", path: "/settings", icon: Settings }] },
];

const SITEMAP_EN: NavSection[] = [
  { title: "Overview", links: [{ label: "Dashboard", path: "/dashboard", icon: Layout }, { label: "AI Assistant", path: "/ai-assistant", icon: Brain }] },
  { title: "Projects & Programs", links: [{ label: "Projects", path: "/projects", icon: FolderKanban }, { label: "Programs", path: "/programs", icon: Building2 }, { label: "Governance", path: "/governance/portfolios", icon: Shield }] },
  { title: "Team & Planning", links: [{ label: "Team", path: "/team", icon: Users }, { label: "Time Tracking", path: "/time-tracking", icon: Clock }, { label: "Reports", path: "/reports", icon: FileText }] },
  { title: "Evaluation & Other", links: [{ label: "Post Project", path: "/post-project", icon: CheckCircle2 }, { label: "Surveys", path: "/surveys", icon: FileText }, { label: "Profile", path: "/profile", icon: Users }, { label: "Settings", path: "/settings", icon: Settings }] },
];

const SITEMAP_FR: NavSection[] = [
  { title: "Aperçu", links: [{ label: "Tableau de bord", path: "/dashboard", icon: Layout }, { label: "Assistant IA", path: "/ai-assistant", icon: Brain }] },
  { title: "Projets & Programmes", links: [{ label: "Projets", path: "/projects", icon: FolderKanban }, { label: "Programmes", path: "/programs", icon: Building2 }, { label: "Gouvernance", path: "/governance/portfolios", icon: Shield }] },
  { title: "Équipe & Planification", links: [{ label: "Équipe", path: "/team", icon: Users }, { label: "Suivi du temps", path: "/time-tracking", icon: Clock }, { label: "Rapports", path: "/reports", icon: FileText }] },
  { title: "Évaluation & Autre", links: [{ label: "Post Projet", path: "/post-project", icon: CheckCircle2 }, { label: "Enquêtes", path: "/surveys", icon: FileText }, { label: "Profil", path: "/profile", icon: Users }, { label: "Paramètres", path: "/settings", icon: Settings }] },
];

const SITEMAPS: Record<Lang, NavSection[]> = { en: SITEMAP_EN, nl: SITEMAP_NL, fr: SITEMAP_FR };

/* ─── Public getters ─── */
export function getGuideMap(lang: Lang) { return GUIDE_MAPS[lang] ?? GUIDE_MAPS.en; }
export function getDefaultGuide(lang: Lang) { return DEFAULT_GUIDES[lang] ?? DEFAULT_GUIDES.en; }
export function getRelatedPages(lang: Lang) { return RELATED_PAGES_ALL[lang] ?? RELATED_PAGES_ALL.en; }
export function getSitemap(lang: Lang) { return SITEMAPS[lang] ?? SITEMAPS.en; }
