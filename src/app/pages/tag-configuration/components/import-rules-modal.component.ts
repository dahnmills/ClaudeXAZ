import { Component, ElementRef, signal, viewChild, output, input } from '@angular/core';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { FunctionalNoticeComponent } from '../../../shared/ui/functional-notice/functional-notice.component';
import { TagRule, EMPTY_CRITERIA } from '../tag-configuration.models';

/** A plausible parsed rule set for the mock JSON import — no real file parsing, no real backend. */
const MOCK_IMPORTED_RULES: TagRule[] = [
  { id: 'imported-1', position: 1, decision: 'Accept', status: 'Valid',
    criteria: { ...EMPTY_CRITERIA, sensitivity: ['S0'], newAutoGrade: ['08', '09', '10'] } },
  { id: 'imported-2', position: 2, decision: 'Refuse', status: 'Valid',
    criteria: { ...EMPTY_CRITERIA, sensitivity: ['S3'] } },
];

/**
 * Import rules (Figma split-button group, "A combiner dans 1 seul split
 * button": Compare/Test/Import/Create) — upload a JSON rule-set file. 3
 * states per the design: empty picker, file selected, validation error.
 * No real backend: "import" just validates the extension and hands back a
 * fixed mock rule set as a stand-in for a real parsed payload.
 */
@Component({
  selector: 'tag-import-rules-modal',
  standalone: true,
  imports: [ModalComponent, ButtonComponent, IconComponent, FunctionalNoticeComponent],
  templateUrl: './import-rules-modal.component.html',
  styleUrl: './import-rules-modal.component.scss',
})
export class ImportRulesModalComponent {
  open = input<boolean>(false);

  imported = output<TagRule[]>();
  closed   = output<void>();

  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  fileName = signal<string | null>(null);
  error    = signal(false);

  browse(): void { this.fileInput()?.nativeElement.click(); }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.error.set(!!file && !file.name.endsWith('.json'));
    this.fileName.set(file?.name ?? null);
  }

  removeFile(): void {
    this.fileName.set(null);
    this.error.set(false);
    const el = this.fileInput()?.nativeElement;
    if (el) el.value = '';
  }

  onImport(): void {
    if (!this.fileName() || this.error()) return;
    this.imported.emit(MOCK_IMPORTED_RULES.map(r => ({ ...r, criteria: { ...r.criteria } })));
    this.removeFile();
  }

  onClose(): void {
    this.removeFile();
    this.closed.emit();
  }
}
