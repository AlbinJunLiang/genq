import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatDialogModule],
    styles: [`
        :host { display: block; border-radius: 16px; overflow: hidden; }
        .header { display: flex; align-items: center;  gap: 12px; margin-bottom: 8px; width: 100%; margin-top: 10px }
        .header mat-icon { font-size: 28px; width: 28px; height: 28px; }
        .message { font-size: 1.05rem; line-height: 1.6; color: #404040; margin: 16px 0; }
        .actions { padding: 16px 24px !important; background: #fafafa; border-top: 1px solid #eee; }
        button { border-radius: 8px !important; }
    `],
    template: `
    <h2 mat-dialog-title class="header">
      <span style="font-size: 1.25rem; font-weight: 600; text-align: center; align-items: center; width: 100%">{{ data.title }}</span>
    </h2>
    
    <mat-dialog-content class="message">
      {{ data.message }}
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="actions">
      <button mat-button (click)="onNoClick()">{{ data.cancelText }}</button>
      <button mat-flat-button [color]="data.color" (click)="onConfirm()">
        {{ data.confirmText }}
      </button>
    </mat-dialog-actions>
    `
})
export class ConfirmDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    onNoClick(): void { this.dialogRef.close(false); }
    onConfirm(): void { this.dialogRef.close(true); }
}