"""
Generate quiz data for course lessons
"""
import json
import os

def generate_quiz(lesson_id, lesson_title, course_slug):
    """Generate quiz for any lesson"""
    
    quiz = {
        "id": lesson_id,
        "title": f"{lesson_title} Quiz",
        "titleNL": f"{lesson_title} Quiz",
        "passingScore": 70,
        "questions": []
    }
    
    # Generate 3 sample questions
    for i in range(1, 4):
        question = {
            "id": f"q{i}",
            "text": f"What is a key concept in {lesson_title}?",
            "textNL": f"Wat is een belangrijk concept in {lesson_title}?",
            "options": [
                "Concept A",
                "Concept B (Correct)",
                "Concept C",
                "Concept D"
            ],
            "optionsNL": [
                "Concept A",
                "Concept B (Correct)",
                "Concept C",
                "Concept D"
            ],
            "correct": 1,
            "explanation": f"Concept B is correct for {lesson_title}.",
            "explanationNL": f"Concept B is correct voor {lesson_title}."
        }
        quiz["questions"].append(question)
    
    return quiz

# Example: Generate for PM fundamentals lessons
pm_lessons = [
    {"id": "pm-l1", "title": "Business Case"},
    {"id": "pm-l2", "title": "Stakeholder Management"},
    {"id": "pm-l3", "title": "Risk Management"},
    {"id": "pm-l4", "title": "Project Planning"},
    {"id": "pm-l5", "title": "Project Charter"},
]

os.makedirs("data/quizzes", exist_ok=True)

for lesson in pm_lessons:
    quiz = generate_quiz(lesson["id"], lesson["title"], "pm-fundamentals")
    
    filename = f"data/quizzes/{lesson['id']}.json"
    with open(filename, 'w') as f:
        json.dump(quiz, f, indent=2)
    
    print(f"✅ Generated: {filename}")

print(f"\n🎉 Generated {len(pm_lessons)} quizzes!")
