#!/usr/bin/env python3
"""
Generate content for remaining 6 courses
Run: docker compose exec backend python generate_remaining.py
"""
import os, sys
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import django; django.setup()

from academy.models import (
    Course, CourseModule, CourseLesson, CourseRequirement,
    CourseLearningOutcome, QuizQuestion, QuizAnswer
)

def create_course(slug, modules_data, requirements=None, outcomes=None):
    try:
        course = Course.objects.get(slug=slug)
    except Course.DoesNotExist:
        print(f"  SKIP: {slug} not found")
        return
    if course.modules.count() > 0:
        print(f"  SKIP: {course.title} already has content")
        return

    print(f"  Creating: {course.title}")
    
    if requirements:
        for i, (en, nl) in enumerate(requirements):
            CourseRequirement.objects.create(course=course, text=en, text_nl=nl, order=i)
    if outcomes:
        for i, (en, nl) in enumerate(outcomes):
            CourseLearningOutcome.objects.create(course=course, text=en, text_nl=nl, order=i)

    total_lessons = 0
    total_questions = 0
    for m_idx, mod in enumerate(modules_data):
        module = CourseModule.objects.create(
            course=course, title=mod["t"], title_nl=mod.get("tnl", mod["t"]), order=m_idx
        )
        quiz_lesson = None
        for l_idx, les in enumerate(mod["lessons"]):
            lesson = CourseLesson.objects.create(
                module=module, title=les[0], title_nl=les[1],
                lesson_type=les[2], duration_minutes=les[3],
                is_free_preview=(m_idx == 0 and l_idx < 2), order=l_idx
            )
            total_lessons += 1
            if les[2] == "quiz":
                quiz_lesson = lesson

        if quiz_lesson and "quiz" in mod:
            for q_idx, qd in enumerate(mod["quiz"]):
                q = QuizQuestion.objects.create(
                    lesson=quiz_lesson, question_text=qd["q"], question_text_nl=qd.get("qnl", ""),
                    question_type=qd.get("type", "multiple_choice"),
                    explanation=qd.get("exp", ""), explanation_nl=qd.get("expnl", ""),
                    order=q_idx, points=1
                )
                for a_idx, ad in enumerate(qd["a"]):
                    QuizAnswer.objects.create(
                        question=q, answer_text=ad[0], answer_text_nl=ad[1],
                        is_correct=ad[2], order=a_idx
                    )
                total_questions += 1

    print(f"    {len(modules_data)} modules, {total_lessons} lessons, {total_questions} quiz questions")


# ============================================================
# PRINCE2 Foundation & Practitioner
# ============================================================
create_course("prince2-foundation", [
    {
        "t": "PRINCE2 Overview", "tnl": "PRINCE2 Overzicht",
        "lessons": [
            ("What is PRINCE2?", "Wat is PRINCE2?", "video", 12),
            ("PRINCE2 vs other methods", "PRINCE2 vs andere methoden", "video", 10),
            ("The 7 Principles", "De 7 principes", "video", 18),
            ("The 7 Themes", "De 7 thema's", "video", 20),
            ("Quiz: PRINCE2 Basics", "Quiz: PRINCE2 Basis", "quiz", 10),
        ],
        "quiz": [
            {"q": "How many principles does PRINCE2 have?", "qnl": "Hoeveel principes heeft PRINCE2?", "type": "multiple_choice",
             "a": [("5", "5", False), ("7", "7", True), ("9", "9", False), ("12", "12", False)],
             "exp": "PRINCE2 has 7 principles.", "expnl": "PRINCE2 heeft 7 principes."},
            {"q": "Which is NOT a PRINCE2 principle?", "qnl": "Welke is GEEN PRINCE2 principe?", "type": "multiple_choice",
             "a": [("Continued business justification", "Voortdurende zakelijke rechtvaardiging", False),
                   ("Learn from experience", "Leren van ervaring", False),
                   ("Maximum documentation", "Maximale documentatie", True),
                   ("Manage by stages", "Managen per fase", False)],
             "exp": "PRINCE2 focuses on appropriate documentation, not maximum.", "expnl": "PRINCE2 richt zich op passende documentatie, niet maximale."},
        ]
    },
    {
        "t": "PRINCE2 Processes", "tnl": "PRINCE2 Processen",
        "lessons": [
            ("Starting Up a Project (SU)", "Een project starten (SU)", "video", 14),
            ("Initiating a Project (IP)", "Een project initialiseren (IP)", "video", 16),
            ("Directing a Project (DP)", "Een project aansturen (DP)", "video", 12),
            ("Controlling a Stage (CS)", "Een fase beheersen (CS)", "video", 15),
            ("Managing Product Delivery (MP)", "Productoplevering managen (MP)", "video", 12),
            ("Managing Stage Boundaries (SB)", "Fasegrenzen managen (SB)", "video", 14),
            ("Closing a Project (CP)", "Een project afsluiten (CP)", "video", 10),
            ("Quiz: Processes", "Quiz: Processen", "quiz", 15),
        ],
        "quiz": [
            {"q": "How many processes does PRINCE2 have?", "qnl": "Hoeveel processen heeft PRINCE2?", "type": "multiple_choice",
             "a": [("5", "5", False), ("7", "7", True), ("9", "9", False), ("4", "4", False)],
             "exp": "PRINCE2 has 7 processes.", "expnl": "PRINCE2 heeft 7 processen."},
            {"q": "Which process runs throughout the entire project?", "qnl": "Welk proces loopt door het hele project?", "type": "multiple_choice",
             "a": [("Starting Up a Project", "Een project starten", False),
                   ("Directing a Project", "Een project aansturen", True),
                   ("Closing a Project", "Een project afsluiten", False),
                   ("Initiating a Project", "Een project initialiseren", False)],
             "exp": "Directing a Project runs from start to finish.", "expnl": "Een project aansturen loopt van begin tot eind."},
        ]
    },
    {
        "t": "PRINCE2 Roles & Tailoring", "tnl": "PRINCE2 Rollen & Tailoring",
        "lessons": [
            ("Project Board", "Project Board", "video", 12),
            ("Project Manager role", "Rol van de projectmanager", "video", 10),
            ("Team Manager role", "Rol van de teammanager", "video", 8),
            ("Tailoring PRINCE2", "PRINCE2 op maat maken", "video", 14),
            ("Exam preparation", "Examenvoorbereiding", "video", 20),
            ("Quiz: Final Exam", "Quiz: Eindexamen", "quiz", 20),
            ("Certificate", "Certificaat", "certificate", 0),
        ],
        "quiz": [
            {"q": "Who is accountable for the project's success?", "qnl": "Wie is verantwoordelijk voor het succes van het project?", "type": "multiple_choice",
             "a": [("Project Manager", "Projectmanager", False), ("Executive (Project Board)", "Executive (Project Board)", True),
                   ("Team Manager", "Teammanager", False), ("Stakeholders", "Stakeholders", False)],
             "exp": "The Executive is ultimately accountable.", "expnl": "De Executive is uiteindelijk verantwoordelijk."},
        ]
    },
],
requirements=[("Basic understanding of projects", "Basiskennis van projecten"), ("No PRINCE2 experience needed", "Geen PRINCE2-ervaring nodig")],
outcomes=[("Pass the PRINCE2 Foundation exam", "Het PRINCE2 Foundation examen halen"), ("Apply PRINCE2 in your organization", "PRINCE2 toepassen in je organisatie"), ("Understand all 7 principles, themes and processes", "Alle 7 principes, thema's en processen begrijpen")]
)


# ============================================================
# Six Sigma Green Belt
# ============================================================
create_course("six-sigma-green-belt", [
    {
        "t": "Six Sigma Foundations", "tnl": "Six Sigma Basis",
        "lessons": [
            ("What is Six Sigma?", "Wat is Six Sigma?", "video", 12),
            ("DMAIC methodology", "DMAIC methodologie", "video", 15),
            ("Six Sigma roles and belts", "Six Sigma rollen en belts", "video", 10),
            ("Process thinking", "Procesdenken", "video", 12),
            ("Quiz: Six Sigma Basics", "Quiz: Six Sigma Basis", "quiz", 10),
        ],
        "quiz": [
            {"q": "What does DMAIC stand for?", "qnl": "Waar staat DMAIC voor?", "type": "multiple_choice",
             "a": [("Define, Measure, Analyze, Improve, Control", "Define, Measure, Analyze, Improve, Control", True),
                   ("Design, Manage, Apply, Implement, Check", "Design, Manage, Apply, Implement, Check", False),
                   ("Develop, Monitor, Assess, Integrate, Close", "Develop, Monitor, Assess, Integrate, Close", False),
                   ("Document, Map, Audit, Inspect, Certify", "Document, Map, Audit, Inspect, Certify", False)],
             "exp": "DMAIC: Define, Measure, Analyze, Improve, Control.", "expnl": "DMAIC: Define, Measure, Analyze, Improve, Control."},
            {"q": "Six Sigma aims for how many defects per million?", "qnl": "Six Sigma streeft naar hoeveel defecten per miljoen?", "type": "multiple_choice",
             "a": [("3.4", "3,4", True), ("34", "34", False), ("340", "340", False), ("0", "0", False)],
             "exp": "Six Sigma targets 3.4 defects per million opportunities.", "expnl": "Six Sigma streeft naar 3,4 defecten per miljoen mogelijkheden."},
        ]
    },
    {
        "t": "Define & Measure", "tnl": "Define & Measure",
        "lessons": [
            ("Project charter & problem statement", "Projectcharter & probleemstelling", "video", 14),
            ("Voice of the Customer (VOC)", "Voice of the Customer (VOC)", "video", 12),
            ("SIPOC diagram", "SIPOC diagram", "video", 10),
            ("Data collection planning", "Dataverzameling plannen", "video", 12),
            ("Measurement system analysis", "Meetsysteemanalyse", "video", 15),
            ("Process mapping", "Procesmapping", "video", 14),
        ],
    },
    {
        "t": "Analyze & Improve", "tnl": "Analyze & Improve",
        "lessons": [
            ("Root cause analysis", "Oorzaakanalyse", "video", 16),
            ("Fishbone diagrams", "Visgraatdiagrammen", "video", 10),
            ("Pareto analysis", "Pareto analyse", "video", 12),
            ("Hypothesis testing basics", "Basis hypothesetoetsen", "video", 18),
            ("Solution selection", "Oplossingsselectie", "video", 12),
            ("Quiz: Analysis", "Quiz: Analyse", "quiz", 15),
        ],
        "quiz": [
            {"q": "What does a Pareto chart help identify?", "qnl": "Wat helpt een Pareto-diagram identificeren?", "type": "multiple_choice",
             "a": [("The 80/20 rule - vital few causes", "De 80/20 regel - vitale oorzaken", True),
                   ("All causes equally", "Alle oorzaken gelijk", False),
                   ("Only financial impacts", "Alleen financiele impact", False),
                   ("Future trends", "Toekomstige trends", False)],
             "exp": "Pareto analysis identifies the vital few (20%) causing most problems (80%).", "expnl": "Pareto-analyse identificeert de vitale weinigen (20%) die de meeste problemen (80%) veroorzaken."},
        ]
    },
    {
        "t": "Control & Certification", "tnl": "Control & Certificering",
        "lessons": [
            ("Control charts", "Regelkaarten", "video", 14),
            ("Statistical Process Control", "Statistische procesbeheersing", "video", 16),
            ("Control plan development", "Beheersplan ontwikkeling", "video", 12),
            ("Sustaining improvements", "Verbeteringen borgen", "video", 10),
            ("Quiz: Final Exam", "Quiz: Eindexamen", "quiz", 20),
            ("Certificate", "Certificaat", "certificate", 0),
        ],
        "quiz": [
            {"q": "What is the purpose of a control chart?", "qnl": "Wat is het doel van een regelkaart?", "type": "multiple_choice",
             "a": [("Monitor process stability over time", "Processtabiliteit bewaken over tijd", True),
                   ("Track project budget", "Projectbudget bijhouden", False),
                   ("Assign team roles", "Teamrollen toewijzen", False),
                   ("Schedule meetings", "Vergaderingen plannen", False)],
             "exp": "Control charts monitor process variation over time.", "expnl": "Regelkaarten bewaken procesvariatie over tijd."},
        ]
    },
],
requirements=[("Basic math and statistics", "Basis wiskunde en statistiek"), ("Interest in process improvement", "Interesse in procesverbetering")],
outcomes=[("Apply DMAIC methodology", "DMAIC methodologie toepassen"), ("Use statistical tools for analysis", "Statistische tools gebruiken voor analyse"), ("Lead Green Belt projects", "Green Belt projecten leiden")]
)


# ============================================================
# Leadership for Project Managers
# ============================================================
create_course("leadership-pm", [
    {
        "t": "Leadership Foundations", "tnl": "Leiderschap Basis",
        "lessons": [
            ("Manager vs Leader", "Manager vs Leider", "video", 10),
            ("Leadership styles", "Leiderschapsstijlen", "video", 14),
            ("Emotional intelligence", "Emotionele intelligentie", "video", 16),
            ("Self-awareness assessment", "Zelfbewustzijn assessment", "video", 12),
            ("Quiz: Leadership Basics", "Quiz: Leiderschap Basis", "quiz", 10),
        ],
        "quiz": [
            {"q": "What distinguishes a leader from a manager?", "qnl": "Wat onderscheidt een leider van een manager?", "type": "multiple_choice",
             "a": [("Leaders inspire, managers execute", "Leiders inspireren, managers voeren uit", True),
                   ("Leaders have more authority", "Leiders hebben meer autoriteit", False),
                   ("There is no difference", "Er is geen verschil", False),
                   ("Managers earn more", "Managers verdienen meer", False)],
             "exp": "Leaders focus on vision and inspiration, managers on planning and execution.", "expnl": "Leiders richten zich op visie en inspiratie, managers op planning en uitvoering."},
        ]
    },
    {
        "t": "Team Dynamics", "tnl": "Teamdynamiek",
        "lessons": [
            ("Building high-performance teams", "High-performance teams bouwen", "video", 15),
            ("Tuckman's team stages", "Tuckmans teamfasen", "video", 12),
            ("Conflict resolution", "Conflictoplossing", "video", 14),
            ("Delegation and empowerment", "Delegeren en empowerment", "video", 12),
            ("Motivation theories", "Motivatietheorieen", "video", 16),
            ("Quiz: Teams", "Quiz: Teams", "quiz", 12),
        ],
        "quiz": [
            {"q": "What are Tuckman's 4 original team stages?", "qnl": "Wat zijn Tuckmans 4 oorspronkelijke teamfasen?", "type": "multiple_choice",
             "a": [("Forming, Storming, Norming, Performing", "Forming, Storming, Norming, Performing", True),
                   ("Plan, Do, Check, Act", "Plan, Do, Check, Act", False),
                   ("Define, Design, Develop, Deploy", "Define, Design, Develop, Deploy", False),
                   ("Start, Execute, Monitor, Close", "Start, Uitvoeren, Bewaken, Afsluiten", False)],
             "exp": "Tuckman proposed Forming, Storming, Norming, Performing (later adding Adjourning).", "expnl": "Tuckman stelde Forming, Storming, Norming, Performing voor (later Adjourning toegevoegd)."},
        ]
    },
    {
        "t": "Communication & Influence", "tnl": "Communicatie & Invloed",
        "lessons": [
            ("Effective communication", "Effectieve communicatie", "video", 12),
            ("Stakeholder management", "Stakeholder management", "video", 14),
            ("Negotiation skills", "Onderhandelingsvaardigheden", "video", 16),
            ("Presenting with impact", "Presenteren met impact", "video", 12),
            ("Certificate", "Certificaat", "certificate", 0),
        ],
    },
],
requirements=[("Some project management experience", "Enige projectmanagement ervaring"), ("Open to self-reflection", "Open voor zelfreflectie")],
outcomes=[("Develop your leadership style", "Je leiderschapsstijl ontwikkelen"), ("Build and lead high-performance teams", "High-performance teams bouwen en leiden"), ("Master conflict resolution", "Conflictoplossing beheersen")]
)


# ============================================================
# Program Management Professional
# ============================================================
create_course("program-management-pro", [
    {
        "t": "Program Management Basics", "tnl": "Programma Management Basis",
        "lessons": [
            ("Program vs Project vs Portfolio", "Programma vs Project vs Portfolio", "video", 12),
            ("The program lifecycle", "De programmalevenscyclus", "video", 15),
            ("Benefits management", "Benefits management", "video", 14),
            ("Governance structures", "Governance structuren", "video", 16),
            ("Quiz: Basics", "Quiz: Basis", "quiz", 10),
        ],
        "quiz": [
            {"q": "What distinguishes a program from a project?", "qnl": "Wat onderscheidt een programma van een project?", "type": "multiple_choice",
             "a": [("A program manages related projects for strategic benefits", "Een programma beheert gerelateerde projecten voor strategische voordelen", True),
                   ("A program is just a bigger project", "Een programma is gewoon een groter project", False),
                   ("Programs have no budget", "Programma's hebben geen budget", False),
                   ("Programs don't need governance", "Programma's hebben geen governance nodig", False)],
             "exp": "Programs coordinate related projects to achieve strategic benefits.", "expnl": "Programma's coordineren gerelateerde projecten om strategische voordelen te bereiken."},
        ]
    },
    {
        "t": "Strategic Alignment", "tnl": "Strategische Afstemming",
        "lessons": [
            ("Linking programs to strategy", "Programma's koppelen aan strategie", "video", 14),
            ("Stakeholder engagement at program level", "Stakeholder betrokkenheid op programmaniveau", "video", 12),
            ("Program roadmap", "Programma roadmap", "video", 16),
            ("Financial management", "Financieel management", "video", 14),
            ("Risk management at scale", "Risicomanagement op schaal", "video", 12),
        ],
    },
    {
        "t": "Execution & Benefits", "tnl": "Uitvoering & Benefits",
        "lessons": [
            ("Managing program components", "Programmacomponenten managen", "video", 15),
            ("Benefits realization", "Benefits realisatie", "video", 14),
            ("Transition and sustainment", "Transitie en borging", "video", 12),
            ("Program closure", "Programma afsluiting", "video", 10),
            ("Quiz: Final", "Quiz: Eindexamen", "quiz", 15),
            ("Certificate", "Certificaat", "certificate", 0),
        ],
        "quiz": [
            {"q": "What is benefits realization?", "qnl": "Wat is benefits realisatie?", "type": "multiple_choice",
             "a": [("Ensuring promised benefits are actually delivered", "Zorgen dat beloofde voordelen daadwerkelijk worden geleverd", True),
                   ("Calculating project costs", "Projectkosten berekenen", False),
                   ("Writing the business case", "De business case schrijven", False),
                   ("Hiring team members", "Teamleden inhuren", False)],
             "exp": "Benefits realization tracks and ensures delivery of promised strategic benefits.", "expnl": "Benefits realisatie volgt en borgt de levering van beloofde strategische voordelen."},
        ]
    },
],
requirements=[("Project management experience (3+ years)", "Projectmanagement ervaring (3+ jaar)"), ("Understanding of organizational strategy", "Begrip van organisatiestrategie")],
outcomes=[("Lead complex programs", "Complexe programma's leiden"), ("Manage benefits across projects", "Benefits managen over projecten"), ("Align programs to strategy", "Programma's afstemmen op strategie")]
)


# ============================================================
# SAFe & Scaling Agile
# ============================================================
create_course("safe-scaling-agile", [
    {
        "t": "SAFe Overview", "tnl": "SAFe Overzicht",
        "lessons": [
            ("Why scale Agile?", "Waarom Agile schalen?", "video", 10),
            ("SAFe framework overview", "SAFe framework overzicht", "video", 16),
            ("SAFe configurations", "SAFe configuraties", "video", 14),
            ("Core values and principles", "Kernwaarden en principes", "video", 12),
            ("Quiz: SAFe Basics", "Quiz: SAFe Basis", "quiz", 10),
        ],
        "quiz": [
            {"q": "What does SAFe stand for?", "qnl": "Waar staat SAFe voor?", "type": "multiple_choice",
             "a": [("Scaled Agile Framework", "Scaled Agile Framework", True),
                   ("Simple Agile for Enterprise", "Simple Agile for Enterprise", False),
                   ("Standard Agile Fundamentals", "Standard Agile Fundamentals", False),
                   ("Scrum at Full Enterprise", "Scrum at Full Enterprise", False)],
             "exp": "SAFe = Scaled Agile Framework.", "expnl": "SAFe = Scaled Agile Framework."},
        ]
    },
    {
        "t": "Agile Release Train", "tnl": "Agile Release Train",
        "lessons": [
            ("What is an ART?", "Wat is een ART?", "video", 14),
            ("PI Planning", "PI Planning", "video", 18),
            ("System Demo", "System Demo", "video", 10),
            ("Inspect & Adapt", "Inspect & Adapt", "video", 12),
            ("Release on Demand", "Release on Demand", "video", 10),
            ("Quiz: ART", "Quiz: ART", "quiz", 12),
        ],
        "quiz": [
            {"q": "How long is a typical Program Increment (PI)?", "qnl": "Hoe lang is een typische Program Increment (PI)?", "type": "multiple_choice",
             "a": [("2 weeks", "2 weken", False), ("4 weeks", "4 weken", False),
                   ("8-12 weeks", "8-12 weken", True), ("6 months", "6 maanden", False)],
             "exp": "A PI is typically 8-12 weeks (usually 5 iterations).", "expnl": "Een PI is meestal 8-12 weken (meestal 5 iteraties)."},
        ]
    },
    {
        "t": "Portfolio & Large Solution", "tnl": "Portfolio & Large Solution",
        "lessons": [
            ("Lean Portfolio Management", "Lean Portfolio Management", "video", 16),
            ("Value Streams", "Value Streams", "video", 14),
            ("Large Solution SAFe", "Large Solution SAFe", "video", 12),
            ("Metrics and measurement", "Metrics en meting", "video", 10),
            ("Quiz: Final", "Quiz: Eindexamen", "quiz", 15),
            ("Certificate", "Certificaat", "certificate", 0),
        ],
        "quiz": [
            {"q": "What is a Value Stream in SAFe?", "qnl": "Wat is een Value Stream in SAFe?", "type": "multiple_choice",
             "a": [("The flow of value from idea to delivery", "De stroom van waarde van idee tot oplevering", True),
                   ("A financial report", "Een financieel rapport", False),
                   ("A team structure", "Een teamstructuur", False),
                   ("A deployment pipeline", "Een deployment pipeline", False)],
             "exp": "A Value Stream represents the series of steps to deliver value.", "expnl": "Een Value Stream vertegenwoordigt de stappen om waarde te leveren."},
        ]
    },
],
requirements=[("Agile/Scrum experience", "Agile/Scrum ervaring"), ("Understanding of enterprise context", "Begrip van enterprise context")],
outcomes=[("Implement SAFe in your organization", "SAFe implementeren in je organisatie"), ("Run PI Planning events", "PI Planning events uitvoeren"), ("Manage Agile Release Trains", "Agile Release Trains managen")]
)


# ============================================================
# Microsoft Project Masterclass
# ============================================================
create_course("ms-project-masterclass", [
    {
        "t": "Getting Started", "tnl": "Aan de slag",
        "lessons": [
            ("MS Project interface", "MS Project interface", "video", 12),
            ("Creating your first project", "Je eerste project aanmaken", "video", 14),
            ("Calendar and working time", "Kalender en werktijd", "video", 10),
            ("Task creation basics", "Taken aanmaken basis", "video", 12),
            ("Quiz: Basics", "Quiz: Basis", "quiz", 8),
        ],
        "quiz": [
            {"q": "What is the default task type in MS Project?", "qnl": "Wat is het standaard taaktype in MS Project?", "type": "multiple_choice",
             "a": [("Fixed Units", "Vaste Eenheden", True), ("Fixed Duration", "Vaste Duur", False),
                   ("Fixed Work", "Vast Werk", False), ("Milestone", "Mijlpaal", False)],
             "exp": "Default task type is Fixed Units.", "expnl": "Het standaard taaktype is Vaste Eenheden."},
        ]
    },
    {
        "t": "Advanced Scheduling", "tnl": "Geavanceerde Planning",
        "lessons": [
            ("Task dependencies", "Taakafhankelijkheden", "video", 14),
            ("Critical path method", "Kritieke pad methode", "video", 16),
            ("Resource assignment", "Resource toewijzing", "video", 14),
            ("Resource leveling", "Resource nivellering", "video", 12),
            ("Baseline and tracking", "Baseline en tracking", "video", 14),
            ("Cost management", "Kostenbeheer", "video", 12),
        ],
    },
    {
        "t": "Reporting & Collaboration", "tnl": "Rapportage & Samenwerking",
        "lessons": [
            ("Gantt chart customization", "Gantt chart aanpassen", "video", 12),
            ("Custom views and filters", "Aangepaste weergaven en filters", "video", 10),
            ("Reporting dashboards", "Rapportage dashboards", "video", 14),
            ("Exporting and sharing", "Exporteren en delen", "video", 8),
            ("Tips and tricks", "Tips en trucs", "video", 10),
            ("Quiz: Final", "Quiz: Eindexamen", "quiz", 12),
            ("Certificate", "Certificaat", "certificate", 0),
        ],
        "quiz": [
            {"q": "What does resource leveling do?", "qnl": "Wat doet resource nivellering?", "type": "multiple_choice",
             "a": [("Resolves resource over-allocation by delaying tasks", "Lost overbezetting op door taken uit te stellen", True),
                   ("Adds more resources automatically", "Voegt automatisch meer resources toe", False),
                   ("Removes unused resources", "Verwijdert ongebruikte resources", False),
                   ("Increases the budget", "Verhoogt het budget", False)],
             "exp": "Resource leveling delays tasks to resolve over-allocation.", "expnl": "Resource nivellering stelt taken uit om overbezetting op te lossen."},
        ]
    },
],
requirements=[("Access to MS Project (trial OK)", "Toegang tot MS Project (proefversie OK)"), ("Basic PM knowledge", "Basis PM kennis")],
outcomes=[("Create professional project plans", "Professionele projectplannen maken"), ("Track progress with baselines", "Voortgang bijhouden met baselines"), ("Generate reports and dashboards", "Rapporten en dashboards genereren")]
)


# ============================================================
# SUMMARY
# ============================================================
print("\n=== FINAL SUMMARY ===")
for course in Course.objects.all().order_by('title'):
    modules = course.modules.count()
    lessons = CourseLesson.objects.filter(module__course=course).count()
    questions = QuizQuestion.objects.filter(lesson__module__course=course).count()
    print(f"  {course.title}: {modules} modules, {lessons} lessons, {questions} quiz questions")

total_m = CourseModule.objects.count()
total_l = CourseLesson.objects.count()
total_q = QuizQuestion.objects.count()
print(f"\n  TOTAL: {total_m} modules, {total_l} lessons, {total_q} quiz questions")
