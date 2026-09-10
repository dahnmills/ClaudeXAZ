import { Component, ElementRef, computed, input, model, output, signal, viewChild } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { IconComponent } from '../icon/icon.component';

/** Fichier déposé. On ne garde du `File` que ce qui s'affiche, plus le blob si un écran doit le lire. */
export interface UploadedFile {
  name: string;
  /** Taille en octets, mise en forme par l'atome. */
  size: number;
  blob?: File;
}

/** Motif de refus, remonté à l'écran qui décide du message à afficher. */
export type UploadRejection = 'type' | 'size' | 'count';

/**
 * File Upload : zone de dépôt en pointillés plus liste des fichiers retenus.
 *
 * Seul atome autorisé à porter un `<input type="file">` : c'est lui qui possède
 * la primitive, les écrans passent par lui. Il valide extension, taille et
 * nombre, et refuse sans rien afficher lui-même : le message d'erreur appartient
 * à l'écran, qui sait s'il veut une notice, un texte d'aide ou rien.
 */
@Component({
  selector: 'ds-file-upload',
  standalone: true,
  imports: [ButtonComponent, ButtonIconComponent, IconComponent],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  host: {
    'class': 'ds-file-upload',
  },
})
export class FileUploadComponent {
  /** Filtre du sélecteur natif, ex. `.xlsx,.csv`. Vide = tout accepté. */
  accept = input<string>('');
  /** Extensions dites à l'utilisateur, ex. `XLSX or CSV`. */
  acceptLabel = input<string>('');
  maxSizeMb = input<number>(5);
  maxFiles = input<number>(1);
  disabled = input<boolean>(false);

  /** Liste des fichiers retenus, en liaison bidirectionnelle. */
  files = model<UploadedFile[]>([]);

  rejected = output<UploadRejection>();

  private fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  /** Survol d'un glisser-déposer en cours. */
  readonly dragging = signal(false);

  /** Zone pleine : on ne prend plus rien, la zone s'éteint. */
  readonly full = computed(() => this.files().length >= this.maxFiles());

  readonly hint = computed(() => {
    const files = this.maxFiles();
    return [
      this.acceptLabel(),
      `less than ${this.maxSizeMb()}MB`,
      `up to ${files} file${files > 1 ? 's' : ''}`,
    ].filter(Boolean).join(' • ');
  });

  sizeLabel(bytes: number): string {
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  browse(): void {
    if (this.disabled() || this.full()) return;
    this.fileInput()?.nativeElement.click();
  }

  onFilePicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.add(Array.from(input.files ?? []));
    // Champ vidé : reprendre le même fichier après un retrait doit relancer un `change`.
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    if (this.disabled() || this.full()) return;
    event.preventDefault();
    this.dragging.set(true);
  }

  onDragLeave(): void {
    this.dragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    if (this.disabled() || this.full()) return;
    this.add(Array.from(event.dataTransfer?.files ?? []));
  }

  remove(index: number): void {
    this.files.update(list => list.filter((_, i) => i !== index));
  }

  /** Validation dans l'ordre nombre, extension, taille : un seul motif remonte par fichier. */
  private add(picked: File[]): void {
    const kept: UploadedFile[] = [];
    for (const file of picked) {
      if (this.files().length + kept.length >= this.maxFiles()) { this.rejected.emit('count'); break; }
      if (!this.matchesAccept(file)) { this.rejected.emit('type'); continue; }
      if (file.size > this.maxSizeMb() * 1024 * 1024) { this.rejected.emit('size'); continue; }
      kept.push({ name: file.name, size: file.size, blob: file });
    }
    if (kept.length) this.files.update(list => [...list, ...kept]);
  }

  private matchesAccept(file: File): boolean {
    const accept = this.accept().trim();
    if (!accept) return true;
    const name = file.name.toLowerCase();
    return accept.split(',')
      .map(part => part.trim().toLowerCase())
      .filter(Boolean)
      .some(part => part.startsWith('.') ? name.endsWith(part) : file.type === part);
  }
}
