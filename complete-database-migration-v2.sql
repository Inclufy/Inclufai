-- ProjeXtPal Academy: Complete Database Migration
-- Version: 2.0 - AI Coach + Skills + Certification

-- ============================================================================
-- PART 1: USER LEARNING PROFILES
-- ============================================================================

CREATE TABLE IF NOT EXISTS academy_user_learning_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    user_id INTEGER NOT NULL,
    track_type TEXT NOT NULL CHECK (track_type IN ('standard', 'personalized')),
    sector TEXT,
    role TEXT,
    experience_level TEXT CHECK (experience_level IN ('starter', 'medior', 'senior', 'expert')),
    has_current_project BOOLEAN,
    current_project_context TEXT,
    methodologies TEXT[],
    learning_goal TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- PART 2: AI COACH
-- ============================================================================

CREATE TABLE IF NOT EXISTS academy_ai_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    user_id INTEGER NOT NULL,
    course_id TEXT,
    lesson_id INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS academy_ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    thread_id UUID NOT NULL REFERENCES academy_ai_threads(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    mode TEXT CHECK (mode IN ('explain', 'apply', 'reflect', 'remediate', 'practice', 'quiz_help')),
    content TEXT NOT NULL,
    selected_text TEXT,
    ui_context JSONB,
    sources JSONB,
    suggested_actions JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- PART 3: SIMULATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS academy_simulations (
    id TEXT PRIMARY KEY,
    tenant_id UUID,
    title TEXT NOT NULL,
    methodology TEXT NOT NULL,
    sector TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    definition JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS academy_simulation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    user_id INTEGER NOT NULL,
    simulation_id TEXT NOT NULL REFERENCES academy_simulations(id),
    course_id TEXT,
    lesson_id INTEGER,
    current_state_key TEXT,
    total_scores JSONB,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    finished_at TIMESTAMPTZ
);

-- ============================================================================
-- PART 4: SKILLS
-- ============================================================================

CREATE TABLE IF NOT EXISTS academy_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_code TEXT NOT NULL UNIQUE,
    skill_name TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    level_definition JSONB NOT NULL,
    methodology_alignment TEXT[],
    is_critical BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS academy_user_skills (
    tenant_id UUID,
    user_id INTEGER NOT NULL,
    skill_id UUID NOT NULL REFERENCES academy_skills(id) ON DELETE CASCADE,
    current_level TEXT NOT NULL DEFAULT 'none' CHECK (current_level IN ('none', 'foundation', 'practitioner', 'expert')),
    proficiency_score NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (proficiency_score >= 0 AND proficiency_score <= 100),
    lessons_completed INTEGER DEFAULT 0,
    quizzes_passed INTEGER DEFAULT 0,
    simulations_completed INTEGER DEFAULT 0,
    last_practiced_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, skill_id)
);

-- ============================================================================
-- PART 5: CERTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS academy_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    user_id INTEGER NOT NULL,
    certification_type TEXT NOT NULL CHECK (certification_type IN ('internal', 'external')),
    certification_name TEXT NOT NULL,
    methodology TEXT NOT NULL,
    level TEXT NOT NULL,
    exam_score NUMERIC(5,2),
    issued_at TIMESTAMPTZ,
    certificate_number TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_ai_threads_user ON academy_ai_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_thread ON academy_ai_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_user ON academy_user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_certifications_user ON academy_certifications(user_id);

-- ============================================================================
-- SAMPLE SKILLS DATA
-- ============================================================================

INSERT INTO academy_skills (skill_code, skill_name, category, level_definition, methodology_alignment, is_critical) VALUES
('governance.risk_mgmt', 'Risk Management', 'governance', 
 '{"foundation": "Can identify and log risks", "practitioner": "Can assess and mitigate risks", "expert": "Can design risk frameworks"}'::jsonb,
 ARRAY['PRINCE2', 'PMI'], true),
('governance.business_case', 'Business Case Development', 'governance',
 '{"foundation": "Can understand business cases", "practitioner": "Can develop business cases", "expert": "Can guide strategic decisions"}'::jsonb,
 ARRAY['PRINCE2', 'PMI'], true),
('planning.scope_mgmt', 'Scope Management', 'planning',
 '{"foundation": "Can understand scope", "practitioner": "Can define and control scope", "expert": "Can architect complex scope"}'::jsonb,
 ARRAY['PRINCE2', 'PMI'], true),
('execution.sprint_planning', 'Sprint Planning', 'execution',
 '{"foundation": "Can participate in sprint planning", "practitioner": "Can facilitate sprint planning", "expert": "Can optimize sprint frameworks"}'::jsonb,
 ARRAY['Scrum', 'Agile'], true),
('stakeholder.communication', 'Communication Planning', 'stakeholder',
 '{"foundation": "Can execute communication plans", "practitioner": "Can design communication strategies", "expert": "Can architect communication frameworks"}'::jsonb,
 ARRAY['PRINCE2', 'PMI', 'Scrum'], true)
ON CONFLICT (skill_code) DO NOTHING;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

SELECT 'ProjeXtPal Academy Database Migration Complete!' AS status,
       '24 tables created' AS tables,
       '5 sample skills inserted' AS skills;
