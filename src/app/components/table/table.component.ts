import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IDocument } from 'src/app/models/documents.interface';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() documents: IDocument[] | null = null;
  @Input() isDisabledButtons: boolean | null = null;
  @Output() onToggleArchivedDocuments: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() onToggleSelectedDocuments: EventEmitter<number> =
    new EventEmitter<number>();
  @Output() onRemoveSelectedDocuments: EventEmitter<IDocument[]> =
    new EventEmitter<IDocument[]>();

  public p: number = 1;
  public itemsPerPage: number = 5;
  private isArchived: boolean = false;

  constructor(private dialog: MatDialog) {}

  public addDocuments(): void {
    this.dialog.open(DialogComponent);
  }

  public toggleArchived(): void {
    this.isArchived = !this.isArchived;
    this.onToggleArchivedDocuments.emit(this.isArchived);
  }

  public toggleSelected(id: number): void {
    this.onToggleSelectedDocuments.emit(id);
  }

  public removeDocument(): void {
    this.onRemoveSelectedDocuments.emit(
      this.documents?.filter((document: IDocument) => !document.isSelected)
    );
  }
}
