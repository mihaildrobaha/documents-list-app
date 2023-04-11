import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { IDocument } from 'src/app/models/documents.interface';
import { DialogComponent } from '../dialog/dialog.component';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() public documents: IDocument[] = [];
  @Input() public archivedDocuments: IDocument[] = [];
  @Input() public isdisabledDeleteButton: boolean | null = null;
  @Input() public isDisableArchiveCheckbox: boolean | null = null;
  @Input() public isDisabledEditButton: boolean | null = null;
  @Input() public isArchived: boolean | null = null;
  @Input() public isSortByDocumentType: boolean | null = null;
  @Input() public isSortDocumentsBySeries: boolean | null = null;
  @Input() public isSortDocumentsByNumber: boolean | null = null;
  @Input() public isSortDocumentsByDate: boolean | null = null;
  @Input() public documentIdForEdit: string | null = null;

  @Output() onToggleArchivedDocuments: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() onToggleSelectedDocuments: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() onRemoveSelectedDocuments: EventEmitter<IDocument[]> =
    new EventEmitter<IDocument[]>();
  @Output() onSortByDocumentType: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() onSortDocumentsBySeries: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() onSortDocumentsByNumber: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() onSortDocumentsByDate: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  public p: number = 1;
  public itemsPerPage: number = 5;
  public isDisabledMainCheckbox = false;

  constructor(
    private dialog: MatDialog,
    private dialogService: DialogService
  ) {}

  public ngOnInit(): void {}

  public disabledMainCheckbox(): void {
    this.dialogService.setArrays(this.documents, this.archivedDocuments);
  }

  public addDocuments(): void {
    const dialogConfig: MatDialogConfig<IDocument[]> = new MatDialogConfig<
      IDocument[]
    >();
    if (this.documents) {
      dialogConfig.data = this.documents;
      this.dialog.open(DialogComponent, dialogConfig);
      this.disabledMainCheckbox();
    }
  }

  public editDocument(): void {
    const dialogConfig: MatDialogConfig<IDocument> =
      new MatDialogConfig<IDocument>();
    if (this.documents) {
      this.documents.forEach((document: IDocument) => {
        if (document.id === this.documentIdForEdit) {
          dialogConfig.data = document;
        }
      });
      this.disabledMainCheckbox();
    }
    this.dialog.open(DialogComponent, dialogConfig);
  }

  public toggleSelected(id: string): void {
    this.onToggleSelectedDocuments.emit(id);
  }

  public toggleArchived(): void {
    this.isArchived = !this.isArchived;
    this.onToggleArchivedDocuments.emit(this.isArchived);
  }

  public removeDocument(): void {
    if (this.documents) {
      this.onRemoveSelectedDocuments.emit(
        this.documents.filter((document: IDocument) => !document.isSelected)
      );
    }
  }

  public sortDocumentsByType(): void {
    this.isSortByDocumentType = !this.isSortByDocumentType;
    this.onSortByDocumentType.emit(this.isSortByDocumentType);
  }

  public sortDocumentsBySeries(): void {
    this.isSortDocumentsBySeries = !this.isSortDocumentsBySeries;
    this.onSortDocumentsBySeries.emit(this.isSortDocumentsBySeries);
  }

  public sortDocumentsByNumber(): void {
    this.isSortDocumentsByNumber = !this.isSortDocumentsByNumber;
    this.onSortDocumentsByNumber.emit(this.isSortDocumentsByNumber);
  }

  public sortDocumentsByDate(): void {
    this.isSortDocumentsByDate = !this.isSortDocumentsByDate;
    this.onSortDocumentsByDate.emit(this.isSortDocumentsByDate);
  }
}
