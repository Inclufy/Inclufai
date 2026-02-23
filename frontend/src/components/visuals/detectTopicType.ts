import type { VisualType } from './types';

/**
 * Dynamically detect the visual topic type from lesson content/transcript.
 * Used as fallback when no visual_type is set in the database (visual_type === 'auto').
 */
export const detectTopicType = (text: string): VisualType => {
  const lower = text.toLowerCase();

  if (
    (lower.includes('project') && (lower.includes('definitie') || lower.includes('definition'))) ||
    (lower.includes('tijdelijk') && lower.includes('uniek') && lower.includes('resultaat'))
  ) {
    return 'project_def';
  }

  if (
    lower.includes('triple constraint') ||
    (lower.includes('tijd') && lower.includes('budget') && lower.includes('kwaliteit')) ||
    (lower.includes('time') && lower.includes('budget') && lower.includes('quality')) ||
    (lower.includes('tijd') && lower.includes('budget') && lower.includes('scope'))
  ) {
    return 'triple_constraint';
  }

  if (
    lower.includes('projectmanager') ||
    lower.includes('pm rol') ||
    lower.includes('pm role') ||
    (lower.includes('verantwoordelijk') && lower.includes('plannen'))
  ) {
    return 'pm_role';
  }

  if (
    (lower.includes('project') && lower.includes('operatie')) ||
    (lower.includes('project') && lower.includes('operation')) ||
    lower.includes('verschil tussen')
  ) {
    return 'comparison';
  }

  if (lower.includes('lifecycle') || lower.includes('levenscyclus') || lower.includes('fasen')) {
    return 'lifecycle';
  }

  if (lower.includes('stakeholder') || lower.includes('belanghebbende')) {
    return 'stakeholder';
  }

  if (lower.includes('risico') || lower.includes('risk')) {
    return 'risk';
  }

  return 'generic';
};

/**
 * Get section title and subtitle based on detected topic type
 */
export const getTopicMeta = (
  topicType: VisualType,
  sectionText: string,
  index: number,
  isNL: boolean
): { title: string; subtitle: string } => {
  switch (topicType) {
    case 'project_def':
      return {
        title: isNL ? 'Wat is een Project?' : 'What is a Project?',
        subtitle: isNL ? 'De 3 kernkenmerken' : 'The 3 core characteristics',
      };
    case 'triple_constraint':
      return {
        title: isNL ? 'De Triple Constraint' : 'The Triple Constraint',
        subtitle: isNL ? 'Tijd, Budget & Scope' : 'Time, Budget & Scope',
      };
    case 'pm_role':
      return {
        title: isNL ? 'De Rol van de PM' : 'The Role of the PM',
        subtitle: isNL ? 'Verantwoordelijkheden' : 'Responsibilities',
      };
    case 'comparison':
      return {
        title: isNL ? 'Project vs. Operatie' : 'Project vs. Operation',
        subtitle: isNL ? 'Ken het verschil' : 'Know the difference',
      };
    case 'lifecycle':
      return {
        title: isNL ? 'Projectlevenscyclus' : 'Project Lifecycle',
        subtitle: isNL ? 'De fasen van een project' : 'The phases of a project',
      };
    case 'stakeholder':
      return {
        title: isNL ? 'Stakeholder Management' : 'Stakeholder Management',
        subtitle: isNL ? 'Belanghebbenden in kaart' : 'Mapping stakeholders',
      };
    case 'risk':
      return {
        title: isNL ? 'Risicomanagement' : 'Risk Management',
        subtitle: isNL ? 'Identificeer & beheers risico\'s' : 'Identify & manage risks',
      };
    default: {
      const firstSentence = sectionText.split(/[.!?]/)[0]?.trim() || '';
      return {
        title: firstSentence.length > 60 ? firstSentence.substring(0, 60) + '...' : firstSentence,
        subtitle: `${isNL ? 'Deel' : 'Part'} ${index + 1}`,
      };
    }
  }
};