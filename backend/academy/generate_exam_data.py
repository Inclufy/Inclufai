"""
Generate exam data for all courses
"""
import json
import os

# Generic exam template
def generate_exam(course_slug, course_title, num_questions=20):
    """Generate exam JSON for any course"""
    
    exam_data = {
        "id": f"{course_slug}-final",
        "title": f"{course_title} - Final Exam",
        "titleNL": f"{course_title} - Eindexamen",
        "description": f"Comprehensive exam covering all {course_title} topics",
        "descriptionNL": f"Uitgebreid examen over alle {course_title} onderwerpen",
        "passingScore": 80,
        "timeLimit": 45,
        "maxAttempts": 3,
        "questions": []
    }
    
    # Generate sample questions (in production, these would be course-specific)
    for i in range(1, num_questions + 1):
        question = {
            "id": f"q{i}",
            "text": f"Question {i} about {course_title}",
            "textNL": f"Vraag {i} over {course_title}",
            "options": [
                f"Option A",
                f"Option B (Correct)",
                f"Option C",
                f"Option D"
            ],
            "optionsNL": [
                f"Optie A",
                f"Optie B (Correct)",
                f"Optie C",
                f"Optie D"
            ],
            "correct": 1,  # Option B
            "points": 5
        }
        exam_data["questions"].append(question)
    
    return exam_data

# All courses
courses = [
    {"slug": "prince2-foundation", "title": "PRINCE2 Foundation"},
    {"slug": "agile-scrum-mastery", "title": "Agile & Scrum Mastery"},
    {"slug": "pm-fundamentals", "title": "Project Management Fundamentals"},
    {"slug": "ms-project-masterclass", "title": "Microsoft Project Masterclass"},
    {"slug": "leadership-pm", "title": "Leadership for PM"},
    {"slug": "six-sigma-green-belt", "title": "Six Sigma Green Belt"},
    {"slug": "program-management-pro", "title": "Program Management Pro"},
    {"slug": "safe-scaling-agile", "title": "SAFe & Scaling Agile"},
]

# Generate exam for each course
for course in courses:
    exam = generate_exam(course["slug"], course["title"])
    
    filename = f"data/exams/{course['slug']}-final.json"
    os.makedirs("data/exams", exist_ok=True)
    
    with open(filename, 'w') as f:
        json.dump(exam, f, indent=2)
    
    print(f"✅ Generated: {filename}")

print(f"\n🎉 Generated exams for {len(courses)} courses!")
