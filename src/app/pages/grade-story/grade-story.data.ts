import { EMPTY_CRITERIA } from '../tag-configuration/tag-configuration.models';
import { GradeStoryEntry } from './grade-story.models';

export const GRADE_STORY_ENTRIES: GradeStoryEntry[] = [
  {
    id: 'gs-1', date: '2026-06-02', gradeType: 'automatic', gradeValue: 6, score: 1.00, status: 'Valid',
    tagInputs: {
      sensitivity: 'S1', exposure: '<= 100,000 EUR', autoGradeValue: '06',
      validGrade: { value: '04, 05, 06', type: 'Automatic', freshness: 'Fresh' },
      buyerRole: 'Insured', naceCode: '62.01', legalForm: 'SARL', lastAcceptedAutograde: '06',
    },
    tagRule: {
      id: 'fr-1', position: 1, decision: 'Accept', status: 'Valid',
      criteria: { ...EMPTY_CRITERIA, sensitivity: ['S1'], newAutoGrade: ['06'], cvgValue: ['04', '05', '06'], cvgType: ['Automatic'], cvgFreshness: 'Fresh' },
    },
  },
  {
    id: 'gs-2', date: '2026-04-14', gradeType: 'manual', gradeValue: 4, score: null, status: 'NC',
    tagInputs: {
      sensitivity: 'S2', exposure: '> 100,000 EUR', autoGradeValue: '04',
      validGrade: { value: '04, 05', type: 'Manual', freshness: 'Outdated' },
      buyerRole: 'Prospect', naceCode: '41.20', legalForm: 'SA', lastAcceptedAutograde: '05',
    },
    tagRule: {
      id: 'fr-2', position: 2, decision: 'Refuse', status: 'Valid',
      criteria: { ...EMPTY_CRITERIA, sensitivity: ['S2'], cvgValue: ['04', '05'], transferred: true },
    },
  },
  {
    id: 'gs-3', date: '2026-01-28', gradeType: 'automatic', gradeValue: 8, score: 3.20, status: 'Valid',
    tagInputs: {
      sensitivity: 'Any', exposure: 'Any', autoGradeValue: '08',
      validGrade: { value: 'Any', type: 'Any', freshness: 'Any' },
      buyerRole: 'Insured', naceCode: 'Any', legalForm: 'Any', lastAcceptedAutograde: 'NA',
    },
    tagRule: {
      id: 'fr-3', position: 3, decision: 'Accept', status: 'Valid',
      criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['08', '09', '10'], cvgValue: ['04', '05', '06'], cvgType: ['Automatic'], cvgFreshness: 'Fresh' },
    },
  },
];
