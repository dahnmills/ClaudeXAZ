import { Component, computed, input, output, signal } from '@angular/core';
import {
  ModalComponent,
  ButtonComponent,
  FileUploadComponent,
  FunctionalNoticeComponent,
  type UploadedFile,
  type UploadRejection,
} from '../../../shared/ui';
import { UPLOADED_ASSIGNMENTS, type Assignment } from '../portfolio-management.data';

/** Étape courante : on dépose un fichier, puis on arbitre les acheteurs déjà rattachés. */
type Step = 'upload' | 'conflicts';

/**
 * Upload portfolios : une modale, deux étapes.
 *
 * 1. dépôt du fichier d'affectations (Excel), `Submit` grisé sans fichier
 * 2. si des acheteurs du fichier appartiennent déjà à un portefeuille, on les
 *    liste avec leur portefeuille actuel et celui du fichier. Deux actions,
 *    appliquer ou reprendre au fichier ; abandonner passe par la croix.
 *
 * Sans conflit, l'étape 2 est sautée : on n'ouvre pas un écran de confirmation
 * pour dire qu'il n'y a rien à confirmer.
 */
@Component({
  selector: 'pm-upload-portfolios-modal',
  standalone: true,
  imports: [
    ModalComponent,
    ButtonComponent,
    FileUploadComponent,
    FunctionalNoticeComponent,
  ],
  templateUrl: './upload-portfolios-modal.component.html',
  styleUrl: './upload-portfolios-modal.component.scss',
})
export class UploadPortfoliosModalComponent {
  open = input<boolean>(false);

  /** Lot d'affectations validé par l'utilisateur. */
  applied = output<Assignment[]>();
  closed = output<void>();

  readonly step = signal<Step>('upload');
  readonly files = signal<UploadedFile[]>([]);
  readonly rejection = signal<UploadRejection | null>(null);

  /** Lot lu dans le fichier. Fixé à la soumission, pas avant : rien n'est lu au dépôt. */
  readonly batch = signal<Assignment[]>([]);

  readonly conflicts = computed(() => this.batch().filter(a => a.from));

  readonly title = computed(() => this.step() === 'upload' ? 'Upload portfolios' : 'Buyers already in a portfolio');

  /** La liste de conflits a besoin de largeur, la zone de dépôt non. */
  readonly size = computed(() => this.step() === 'upload' ? 'small' as const : 'large' as const);

  readonly rejectionMessage = computed(() => {
    switch (this.rejection()) {
      case 'type': return 'This file type is not accepted. Upload an XLSX, XLS or CSV file.';
      case 'size': return 'This file is too large. Upload a file under 5MB.';
      case 'count': return 'One file at a time. Remove the current file to upload another one.';
      default:      return '';
    }
  });

  readonly conflictSummary = computed(() =>
    `${this.conflicts().length} of ${this.batch().length} buyers in this file already belong to a portfolio. `
    + 'Continue moves them to the portfolio listed in the file.');

  onFilesChange(files: UploadedFile[]): void {
    this.files.set(files);
    if (files.length) this.rejection.set(null);
  }

  onRejected(reason: UploadRejection): void {
    this.rejection.set(reason);
  }

  /** Soumission : le fichier est « lu » ici, d'où le lot fixé à ce moment. */
  onSubmit(): void {
    if (!this.files().length) return;
    const batch = UPLOADED_ASSIGNMENTS.map(a => ({ ...a }));
    this.batch.set(batch);
    if (!batch.some(a => a.from)) {
      this.applied.emit(batch);
      this.reset();
      return;
    }
    this.step.set('conflicts');
  }

  onContinue(): void {
    this.applied.emit(this.batch());
    this.reset();
  }

  /** Reprendre au fichier : on revient à l'étape 1, vide, sans fermer la modale. */
  onUploadNewFile(): void {
    this.files.set([]);
    this.batch.set([]);
    this.rejection.set(null);
    this.step.set('upload');
  }

  onClose(): void {
    this.reset();
    this.closed.emit();
  }

  private reset(): void {
    this.step.set('upload');
    this.files.set([]);
    this.batch.set([]);
    this.rejection.set(null);
  }
}
