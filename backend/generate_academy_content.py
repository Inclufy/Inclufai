#!/usr/bin/env python3
"""
AI Course Content Generator for ProjeXtPal Academy
Generates modules, lessons, quiz questions for all seeded courses.

Usage: docker compose exec backend python generate_academy_content.py
"""
import os, sys, json
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import django
django.setup()

from academy.models import (
    Course, CourseModule, CourseLesson, CourseRequirement,
    CourseLearningOutcome, QuizQuestion, QuizAnswer
)

# ============================================================
# COURSE CONTENT DEFINITIONS
# ============================================================

COURSE_CONTENT = {
    "pm-fundamentals": {
        "title": "Project Management Fundamentals",
        "requirements": [
            ("No prior PM experience needed", "Geen PM-ervaring nodig"),
            ("Basic computer skills", "Basiscomputervaardigheden"),
            ("Motivation to learn", "Motivatie om te leren"),
        ],
        "outcomes": [
            ("Understand the full project lifecycle", "De volledige projectlevenscyclus begrijpen"),
            ("Create WBS and Gantt charts", "WBS en Gantt charts maken"),
            ("Manage risks and stakeholders", "Risico\'s en stakeholders managen"),
            ("Lead project teams effectively", "Projectteams effectief leiden"),
            ("Apply lessons learned", "Lessons learned toepassen"),
        ],
        "modules": [
            {
                "title": "Introduction to Project Management",
                "title_nl": "Introductie Project Management",
                "lessons": [
                    ("What is a project?", "Wat is een project?", "video", 8),
                    ("The role of the project manager", "De rol van de projectmanager", "video", 12),
                    ("Project management methodologies", "Projectmanagement methodologieen", "video", 15),
                    ("The project lifecycle", "De projectlevenscyclus", "video", 10),
                    ("Quiz: Basic Concepts", "Quiz: Basisconcepten", "quiz", 10),
                ],
                "quiz": [
                    {
                        "q": "What is the primary role of a project manager?",
                        "q_nl": "Wat is de primaire rol van een projectmanager?",
                        "type": "multiple_choice",
                        "answers": [
                            ("Writing code", "Code schrijven", False),
                            ("Planning, executing and closing the project", "Het project plannen, uitvoeren en afsluiten", True),
                            ("Only monitoring budget", "Alleen de budget bewaken", False),
                            ("Making coffee for the team", "Koffie halen voor het team", False),
                        ],
                        "explanation": "A project manager is responsible for planning, executing, monitoring and closing the entire project.",
                        "explanation_nl": "Een projectmanager is verantwoordelijk voor het plannen, uitvoeren, bewaken en afsluiten van het gehele project."
                    },
                    {
                        "q": "Which phase follows planning in waterfall?",
                        "q_nl": "Welke fase komt na de planningsfase in waterval?",
                        "type": "multiple_choice",
                        "answers": [
                            ("Initiation", "Initiatie", False),
                            ("Execution", "Uitvoering", True),
                            ("Closure", "Afsluiting", False),
                            ("Monitoring", "Monitoring", False),
                        ],
                        "explanation": "In waterfall, the execution phase follows planning.",
                        "explanation_nl": "In de watervalmethode volgt de uitvoeringsfase na de planning."
                    },
                    {
                        "q": "A WBS helps divide work into manageable pieces.",
                        "q_nl": "Een WBS helpt bij het opdelen van werk in beheersbare stukken.",
                        "type": "true_false",
                        "answers": [
                            ("True", "Waar", True),
                            ("False", "Niet waar", False),
                        ],
                        "explanation": "A Work Breakdown Structure (WBS) decomposes the total scope into smaller deliverables.",
                        "explanation_nl": "Een Work Breakdown Structure (WBS) splitst de totale scope op in kleinere op te leveren producten."
                    },
                ]
            },
            {
                "title": "Project Initiation",
                "title_nl": "Project Initiatie",
                "lessons": [
                    ("Creating the project charter", "Het projectcharter opstellen", "video", 14),
                    ("Stakeholder analysis", "Stakeholder analyse", "video", 11),
                    ("Business case development", "Business case ontwikkelen", "video", 13),
                    ("Scope definition", "Scope definitie", "video", 9),
                    ("Practical: Project Charter", "Praktikopdracht: Project Charter", "assignment", 30),
                ],
            },
            {
                "title": "Planning",
                "title_nl": "Planning",
                "lessons": [
                    ("Work Breakdown Structure (WBS)", "Work Breakdown Structure (WBS)", "video", 16),
                    ("Creating Gantt charts", "Gantt charts maken", "video", 18),
                    ("Resource planning", "Resource planning", "video", 12),
                    ("Budget and cost estimation", "Budget en kostenraming", "video", 14),
                    ("Risk management", "Risicomanagement", "video", 20),
                    ("Quiz: Planning", "Quiz: Planning", "quiz", 15),
                ],
                "quiz": [
                    {
                        "q": "What belongs to risk management?",
                        "q_nl": "Wat hoort bij risicomanagement?",
                        "type": "multiple_choice",
                        "answers": [
                            ("Ignoring risks", "Risico\'s negeren", False),
                            ("Identifying and mitigating risks", "Risico\'s identificeren en mitigeren", True),
                            ("Only tracking positive risks", "Alleen positieve risico\'s bijhouden", False),
                            ("Waiting for problems to occur", "Wachten tot problemen zich voordoen", False),
                        ],
                        "explanation": "Risk management involves identifying, analyzing, and mitigating project risks.",
                        "explanation_nl": "Risicomanagement omvat het identificeren, analyseren en mitigeren van projectrisico\'s."
                    },
                    {
                        "q": "What is the critical path?",
                        "q_nl": "Wat is het kritieke pad?",
                        "type": "multiple_choice",
                        "answers": [
                            ("The shortest sequence of tasks", "De kortste reeks taken", False),
                            ("The longest sequence determining minimum duration", "De langste reeks die de minimale doorlooptijd bepaalt", True),
                            ("The most expensive tasks", "De duurste taken", False),
                            ("Tasks with most resources", "Taken met de meeste resources", False),
                        ],
                        "explanation": "The critical path is the longest sequence of dependent tasks that determines the minimum project duration.",
                        "explanation_nl": "Het kritieke pad is de langste reeks afhankelijke taken die de minimale projectduur bepaalt."
                    },
                ]
            },
            {
                "title": "Execution & Monitoring",
                "title_nl": "Uitvoering & Monitoring",
                "lessons": [
                    ("Leading the project team", "Het projectteam leiden", "video", 15),
                    ("Progress tracking and reporting", "Voortgang bijhouden en rapporteren", "video", 12),
                    ("Change management", "Wijzigingsbeheer", "video", 14),
                    ("Quality management", "Kwaliteitsmanagement", "video", 11),
                    ("Communication management", "Communicatiemanagement", "video", 13),
                ],
            },
            {
                "title": "Closure",
                "title_nl": "Afsluiting",
                "lessons": [
                    ("Project closure checklist", "Project afsluiting checklist", "video", 10),
                    ("Lessons learned", "Lessons learned", "video", 12),
                    ("Final documentation", "Einddocumentatie", "video", 8),
                    ("Quiz: Final Exam", "Quiz: Eindexamen", "quiz", 20),
                    ("Certificate", "Certificaat", "certificate", 0),
                ],
                "quiz": [
                    {
                        "q": "What is the purpose of a lessons learned session?",
                        "q_nl": "Wat is het doel van een lessons learned sessie?",
                        "type": "multiple_choice",
                        "answers": [
                            ("Blaming team members", "Schuldigen aanwijzen", False),
                            ("Improving future projects by learning from experience", "Toekomstige projecten verbeteren door te leren van ervaringen", True),
                            ("Extending the project", "Het project verlengen", False),
                            ("Requesting additional budget", "Extra budget aanvragen", False),
                        ],
                        "explanation": "Lessons learned help organizations improve their project management practices.",
                        "explanation_nl": "Lessons learned helpen organisaties hun projectmanagementpraktijken te verbeteren."
                    },
                    {
                        "q": "Which document formally closes a project?",
                        "q_nl": "Welk document sluit een project formeel af?",
                        "type": "multiple_choice",
                        "answers": [
                            ("Project charter", "Projectcharter", False),
                            ("Status report", "Statusrapport", False),
                            ("Project closure report", "Project afsluiting rapport", True),
                            ("Risk register", "Risicoregister", False),
                        ],
                        "explanation": "The project closure report formally documents the end of a project.",
                        "explanation_nl": "Het project afsluitingsrapport documenteert formeel het einde van een project."
                    },
                ]
            },
        ]
    },
    "agile-scrum": {
        "title": "Agile & Scrum Mastery",
        "requirements": [
            ("Basic PM knowledge helpful", "Basis PM-kennis handig"),
            ("Open mindset for agile thinking", "Open mindset voor agile denken"),
        ],
        "outcomes": [
            ("Master Scrum framework", "Scrum framework beheersen"),
            ("Run effective sprints", "Effectieve sprints uitvoeren"),
            ("Facilitate Scrum ceremonies", "Scrum ceremonies faciliteren"),
            ("Create and manage product backlogs", "Product backlogs creeren en beheren"),
        ],
        "modules": [
            {
                "title": "Agile Mindset",
                "title_nl": "Agile Mindset",
                "lessons": [
                    ("What is Agile?", "Wat is Agile?", "video", 10),
                    ("The Agile Manifesto", "Het Agile Manifest", "video", 12),
                    ("Agile vs Waterfall", "Agile vs Waterval", "video", 15),
                    ("Quiz: Agile Basics", "Quiz: Agile Basis", "quiz", 10),
                ],
                "quiz": [
                    {
                        "q": "How many values does the Agile Manifesto have?",
                        "q_nl": "Hoeveel waarden heeft het Agile Manifest?",
                        "type": "multiple_choice",
                        "answers": [
                            ("2", "2", False),
                            ("4", "4", True),
                            ("6", "6", False),
                            ("12", "12", False),
                        ],
                        "explanation": "The Agile Manifesto has 4 values and 12 principles.",
                        "explanation_nl": "Het Agile Manifest heeft 4 waarden en 12 principes."
                    },
                ]
            },
            {
                "title": "Scrum Framework",
                "title_nl": "Scrum Framework",
                "lessons": [
                    ("Scrum roles", "Scrum rollen", "video", 14),
                    ("Scrum events", "Scrum events", "video", 16),
                    ("Scrum artifacts", "Scrum artefacten", "video", 12),
                    ("Sprint planning", "Sprint planning", "video", 15),
                    ("Daily standup", "Daily standup", "video", 8),
                    ("Sprint review & retrospective", "Sprint review & retrospective", "video", 12),
                    ("Quiz: Scrum", "Quiz: Scrum", "quiz", 15),
                ],
                "quiz": [
                    {
                        "q": "What is the recommended maximum sprint length?",
                        "q_nl": "Wat is de aanbevolen maximale sprintlengte?",
                        "type": "multiple_choice",
                        "answers": [
                            ("1 week", "1 week", False),
                            ("2 weeks", "2 weken", False),
                            ("4 weeks", "4 weken", True),
                            ("6 weeks", "6 weken", False),
                        ],
                        "explanation": "Scrum Guide recommends sprints of maximum 4 weeks (1 month).",
                        "explanation_nl": "De Scrum Guide adviseert sprints van maximaal 4 weken (1 maand)."
                    },
                    {
                        "q": "Who is responsible for the Product Backlog?",
                        "q_nl": "Wie is verantwoordelijk voor de Product Backlog?",
                        "type": "multiple_choice",
                        "answers": [
                            ("Scrum Master", "Scrum Master", False),
                            ("Product Owner", "Product Owner", True),
                            ("Development Team", "Development Team", False),
                            ("Stakeholders", "Stakeholders", False),
                        ],
                        "explanation": "The Product Owner is solely responsible for managing the Product Backlog.",
                        "explanation_nl": "De Product Owner is als enige verantwoordelijk voor het beheer van de Product Backlog."
                    },
                ]
            },
            {
                "title": "Kanban & Lean",
                "title_nl": "Kanban & Lean",
                "lessons": [
                    ("Kanban principles", "Kanban principes", "video", 12),
                    ("WIP limits", "WIP limieten", "video", 10),
                    ("Lean thinking", "Lean denken", "video", 14),
                    ("Certificate", "Certificaat", "certificate", 0),
                ],
            },
        ]
    },
}


def populate_course(slug, content):
    """Populate a single course with modules, lessons, and quizzes"""
    try:
        course = Course.objects.get(slug=slug)
    except Course.DoesNotExist:
        print(f"  Course {slug} not found, skipping")
        return False
    
    # Skip if already has modules
    if course.modules.count() > 0:
        print(f"  {course.title}: Already has {course.modules.count()} modules, skipping")
        return True
    
    print(f"  Populating: {course.title}")
    
    # Requirements
    for i, (en, nl) in enumerate(content.get("requirements", [])):
        CourseRequirement.objects.create(course=course, text=en, text_nl=nl, order=i)
    
    # Learning outcomes
    for i, (en, nl) in enumerate(content.get("outcomes", [])):
        CourseLearningOutcome.objects.create(course=course, text=en, text_nl=nl, order=i)
    
    # Modules
    total_lessons = 0
    total_duration = 0
    
    for m_idx, mod_data in enumerate(content["modules"]):
        module = CourseModule.objects.create(
            course=course,
            title=mod_data["title"],
            title_nl=mod_data.get("title_nl", ""),
            order=m_idx,
        )
        
        quiz_lesson = None
        
        for l_idx, (title_en, title_nl, lesson_type, duration) in enumerate(mod_data["lessons"]):
            lesson = CourseLesson.objects.create(
                module=module,
                title=title_en,
                title_nl=title_nl,
                lesson_type=lesson_type,
                duration_minutes=duration,
                is_free_preview=(m_idx == 0 and l_idx < 2),
                order=l_idx,
            )
            total_lessons += 1
            total_duration += duration
            
            if lesson_type == "quiz":
                quiz_lesson = lesson
        
        # Create quiz questions for this module
        if quiz_lesson and "quiz" in mod_data:
            for q_idx, q_data in enumerate(mod_data["quiz"]):
                question = QuizQuestion.objects.create(
                    lesson=quiz_lesson,
                    question_text=q_data["q"],
                    question_text_nl=q_data.get("q_nl", ""),
                    question_type=q_data.get("type", "multiple_choice"),
                    explanation=q_data.get("explanation", ""),
                    explanation_nl=q_data.get("explanation_nl", ""),
                    order=q_idx,
                    points=1,
                )
                
                for a_idx, (a_en, a_nl, correct) in enumerate(q_data["answers"]):
                    QuizAnswer.objects.create(
                        question=question,
                        answer_text=a_en,
                        answer_text_nl=a_nl,
                        is_correct=correct,
                        order=a_idx,
                    )
            
            print(f"    Module {m_idx+1}: {mod_data['title']} ({len(mod_data['lessons'])} lessons, {len(mod_data['quiz'])} quiz questions)")
        else:
            print(f"    Module {m_idx+1}: {mod_data['title']} ({len(mod_data['lessons'])} lessons)")
    
    # Update course stats
    course.duration_hours = total_duration // 60 or 1
    course.student_count = 0
    course.save()
    
    return True


# Run
print("\nGenerating course content...\n")
for slug, content in COURSE_CONTENT.items():
    populate_course(slug, content)

# Summary
print("\n=== Summary ===")
for course in Course.objects.filter(status='published'):
    modules = course.modules.count()
    lessons = CourseLesson.objects.filter(module__course=course).count()
    questions = QuizQuestion.objects.filter(lesson__module__course=course).count()
    print(f"  {course.title}: {modules} modules, {lessons} lessons, {questions} quiz questions")

print("\nDone!")
