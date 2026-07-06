import { Component, inject, signal } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCellDef, MatHeaderCellDef, MatHeaderRowDef, MatRowDef, MatTableModule } from '@angular/material/table';
import { MatIcon } from "@angular/material/icon";
import { MatMenuTrigger, MatMenuItem, MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { ModelForm } from "./model-form/model-form";
import { CommonModule } from '@angular/common';
import { SnackBarService } from '../../core/services/ui/snackbar-service';
import { ModelStore } from '../../core/stores/model-store';
import { ModelConfig } from '../../core/interfaces/model-interface';

@Component({
  selector: 'app-model-table',
  imports: [CommonModule, MatCellDef, MatHeaderCellDef,
    MatPaginator, MatRowDef, MatHeaderRowDef, MatProgressSpinner,
    MatTableModule, MatIcon, MatMenuModule, MatMenuTrigger, MatButtonModule, MatMenuItem, ModelForm],
  templateUrl: './model-table.html',
  styleUrl: './model-table.scss',
})
export class ModelTable {

  protected displayedColumns: string[] = ['actions', 'id', 'model', 'provider'];
  protected pageSize = signal(5);
  protected currentPage = signal(1);
  protected totalItems = signal(0);
  protected modelStore = inject(ModelStore);
  protected isFormOpen = signal(false);
  public editableModel: ModelConfig | null = null;
  private snackbar = inject(SnackBarService);



  ngOnInit() {
    this.modelStore.loadModels();
  }


  protected getCellValue(element: any, col: string): any {
    if (col === 'defect') return element.isActive ? '✓' : '-';
    return element[col] ?? '-';
  }

  protected goToEdit(model: ModelConfig) {
    this.editableModel = model;
    this.isFormOpen.set(true);
  }

  protected goToCreate() {
    this.isFormOpen.set(true);
    this.editableModel = null;
  }

  protected onDelete(id: number) {
    this.modelStore.deleteModel(id).subscribe({
      next: () => {
        this.snackbar.show('¡Eliminado exitósamente!', 'Ok');
      },
      error: (err) => {
        console.log(err)
        this.snackbar.show('Error al eliminar', 'ok');
      }
    });
  }
}