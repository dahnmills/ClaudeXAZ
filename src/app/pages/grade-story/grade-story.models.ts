import { GradeType, GradeValue } from '../../shared/ui/grade/grade.component';
import { TagRule } from '../tag-configuration/tag-configuration.models';

/** Buyer data snapshot as it stood when the TAG rule was evaluated (BN AZTQIRIN-55735). */
export interface TagInputsSnapshot {
  sensitivity:           string;
  exposure:              string;
  autoGradeValue:        string;
  validGrade:            { value: string; type: string; freshness: string };
  buyerRole:             string;
  naceCode:              string;
  legalForm:             string;
  lastAcceptedAutograde: string;
}

export interface GradeStoryEntry {
  id:         string;
  date:       string;
  gradeType:  GradeType;
  gradeValue: GradeValue | null;
  score:      number | null;
  /** Grade status shown next to the grade — its own clickable zone (opens the TAG explanation modal). */
  status:     'Valid' | 'NC';
  tagInputs:  TagInputsSnapshot;
  tagRule:    TagRule;
}
