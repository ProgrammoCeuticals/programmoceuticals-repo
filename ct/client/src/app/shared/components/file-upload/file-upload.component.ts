import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors"
         [class.border-primary-500]="file"
         (dragover)="$event.preventDefault()"
         (drop)="onDrop($event)">
      <input #fileInput type="file" class="hidden" [accept]="accept" (change)="onFileChange($event)" />
      <div *ngIf="!file">
        <svg class="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="mt-2 text-sm text-gray-600">
          <button type="button" class="text-primary-600 font-medium hover:underline" (click)="fileInput.click()">
            Click to upload
          </button>
          or drag and drop
        </p>
        <p class="text-xs text-gray-400 mt-1">{{ hint }}</p>
      </div>
      <div *ngIf="file" class="flex items-center justify-center gap-3">
        <svg class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-sm font-medium text-gray-700">{{ file.name }}</span>
        <button type="button" class="text-red-500 text-xs hover:underline" (click)="clear()">Remove</button>
      </div>
    </div>
  `,
})
export class FileUploadComponent {
  @Input() accept = '.doc,.docx';
  @Input() hint = '.doc or .docx only';
  @Output() fileSelected = new EventEmitter<File>();

  file: File | null = null;

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) this.setFile(input.files[0]);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const f = event.dataTransfer?.files[0];
    if (f) this.setFile(f);
  }

  private setFile(f: File) {
    this.file = f;
    this.fileSelected.emit(f);
  }

  clear() {
    this.file = null;
    this.fileSelected.emit(undefined as unknown as File);
  }
}
