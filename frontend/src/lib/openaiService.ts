// 🤖 BACKEND API SERVICE FOR VISUAL SELECTION
// Calls backend which calls OpenAI (avoids CORS)

export interface ConceptExtraction {
  primaryConcepts: string[];
  learningIntent: string;
  conceptClass: string;
  methodologyDetected: string;
  confidence: number;
  reasoning: string;
}

export async function extractLessonConcepts(
  courseTitle: string,
  moduleTitle: string,
  lessonTitle: string,
  methodology: string
): Promise<ConceptExtraction> {
  
  console.log('🤖 Calling backend for AI analysis...');
  
  try {
    // Get auth token from localStorage
    const token = localStorage.getItem('access_token');
    
    // Relative URL - works in Docker!
    const response = await fetch('/api/v1/academy/analyze-lesson/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({
        courseTitle,
        moduleTitle,
        lessonTitle,
        methodology: methodology || 'generic_pm'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json() as ConceptExtraction;
    
    console.log('✅ Backend Analysis Complete:');
    console.log('  📌 Concepts:', result.primaryConcepts);
    console.log('  🎯 Intent:', result.learningIntent);
    console.log('  📊 Class:', result.conceptClass);
    console.log('  🔬 Methodology:', result.methodologyDetected);
    console.log('  💯 Confidence:', Math.round(result.confidence * 100) + '%');
    console.log('  💡 Reasoning:', result.reasoning);
    
    return result;
    
  } catch (error) {
    console.error('❌ Backend API Error:', error);
    
    // Fallback: basic keyword extraction
    const basicKeywords = lessonTitle
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 3);
    
    return {
      primaryConcepts: basicKeywords,
      learningIntent: 'explain_concept',
      conceptClass: 'framework',
      methodologyDetected: methodology || 'generic_pm',
      confidence: 0.5,
      reasoning: 'Fallback due to backend error'
    };
  }
}

// Session cache
const conceptCache = new Map<string, ConceptExtraction>();

export async function getCachedLessonConcepts(
  courseTitle: string,
  moduleTitle: string,
  lessonTitle: string,
  methodology: string
): Promise<ConceptExtraction> {
  
  const cacheKey = `${courseTitle}|${moduleTitle}|${lessonTitle}`;
  
  if (conceptCache.has(cacheKey)) {
    console.log('📦 Using cached backend analysis');
    return conceptCache.get(cacheKey)!;
  }
  
  const concepts = await extractLessonConcepts(
    courseTitle,
    moduleTitle,
    lessonTitle,
    methodology
  );
  
  conceptCache.set(cacheKey, concepts);
  
  return concepts;
}

export function clearConceptCache(): void {
  conceptCache.clear();
  console.log('🗑️ Concept cache cleared');
}
