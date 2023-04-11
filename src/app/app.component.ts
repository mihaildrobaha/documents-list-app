import { Component, OnInit } from '@angular/core';
import { IDocument, ISearchData } from './models/documents.interface';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public documents: IDocument[] = [];
  public archivedDocuments: IDocument[] = [];
  public isArchived: boolean = false;
  public isdisabledDeleteButton: boolean = true;
  public isDisabledEditButton: boolean = true;
  public isDisableArchiveCheckbox: boolean = false;
  public isSortByDocumentType: boolean = false;
  public isSortDocumentsBySeries: boolean = false;
  public isSortDocumentsByNumber: boolean = false;
  public isSortDocumentsByDate: boolean = false;
  public documentIdForEdit: string | null = null;

  constructor(private dataService: DataService) {}

  public ngOnInit(): void {
    this.documents = this.dataService
      .getDocuments()
      .filter((document: IDocument) => {
        return document.isArchived === false;
      });
    this.archivedDocuments = this.dataService
      .getDocuments()
      .filter((document: IDocument) => document.isArchived === true);
    this.dataService.onAddDocument$.subscribe((document: IDocument) => {
      if (document.isArchived) {
        this.archivedDocuments.unshift(document);
        this.disabledCheckbox();
      } else {
        this.documents.unshift(document);
      }
    });

    this.dataService.onEditDocument$.subscribe((editDocument: IDocument) => {
      const index = this.documents.findIndex(
        (document) => document.id === editDocument.id
      );
      if (index !== -1) {
        this.documents[index] = {
          ...editDocument,
        };
        this.disabledCheckbox();
      }

      if (!editDocument.isArchived) {
        this.checkDublicateInArchivedDocuments(editDocument);
        const archivedIndex = this.archivedDocuments.findIndex(
          (document) => document.id === editDocument.id
        );
        if (archivedIndex !== -1) {
          const documentToMove = this.archivedDocuments[archivedIndex];
          this.archivedDocuments.splice(archivedIndex, 1);
          this.documents.push(documentToMove);
        }
      }

      const index2 = this.archivedDocuments.findIndex(
        (document) => document.id === editDocument.id
      );
      if (index2 !== -1) {
        this.archivedDocuments[index2] = {
          ...editDocument,
        };
      }

      if (editDocument.isArchived) {
        this.checkDublicateInDocuments(editDocument);
        const documentIndex = this.documents.findIndex(
          (document) => document.id === editDocument.id
        );
        if (documentIndex !== -1) {
          const documentToMove = this.documents[documentIndex];
          this.documents.splice(documentIndex, 1);
          this.archivedDocuments.push(documentToMove);
        }
      }
    });
  }

  private checkDublicateInDocuments(editDocument: IDocument) {
    const documentIndex = this.documents.findIndex(
      (document) => document.id === editDocument.id
    );
    if (documentIndex !== -1) {
      const documentToMove = this.documents[documentIndex];
      this.documents.splice(documentIndex, 1);

      const archivedIndex = this.archivedDocuments.findIndex(
        (document) => document.id === editDocument.id
      );
      if (archivedIndex === -1) {
        this.archivedDocuments.push(documentToMove);
      }
    }
  }

  private checkDublicateInArchivedDocuments(editDocument: IDocument) {
    const archivedIndex = this.archivedDocuments.findIndex(
      (document) => document.id === editDocument.id
    );
    if (archivedIndex !== -1) {
      const documentToMove = this.archivedDocuments[archivedIndex];
      this.archivedDocuments.splice(archivedIndex, 1);

      const documentIndex = this.documents.findIndex(
        (document) => document.id === editDocument.id
      );
      if (documentIndex === -1) {
        this.documents.push(documentToMove);
      }
    }
  }

  public searchDocument(dataForSearch: ISearchData): void {
    this.documents = this.documents.filter(
      (document: IDocument) =>
        document.documentType.includes(dataForSearch.documentType) &&
        document.number
          .toString()
          .includes(dataForSearch.documentNumber.toString())
    );
  }

  public clearSearch(): void {
    this.documents = this.dataService
      .getDocuments()
      .filter((document: IDocument) => document.isArchived === false);
    this.unselectAllDocuments();
  }

  public toggleSelectedDocuments(id: string): void {
    this.documents.forEach((document: IDocument) => {
      if (document.id === id) {
        document.isSelected = !document.isSelected;
      }
    });
    if (
      this.documents.find((document: IDocument) => document.isSelected === true)
    ) {
      this.disableDeleteButton();
    } else {
      this.disableDeleteButton();
    }
    const selectedDocuments: IDocument[] = this.documents.filter(
      (document: IDocument) => document.isSelected
    );
    if (selectedDocuments.length === 1) {
      this.documentIdForEdit = selectedDocuments[0].id;
      this.isDisabledEditButton = false;
    } else {
      this.documentIdForEdit = null;
      this.isDisabledEditButton = true;
    }
  }

  public toggleArchivedDocuments(isArchived: boolean): void {
    this.isArchived = isArchived;
    if (this.isArchived) {
      this.mergeArchivedToDocuments();
    } else {
      this.hideArchived();
    }
    this.unselectAllDocuments();
    this.disableDeleteButton();
    this.disableEditButton();
  }

  private unselectAllDocuments(): void {
    this.documents.forEach((document: IDocument) => {
      document.isSelected = false;
    });
    this.archivedDocuments?.forEach((document: IDocument) => {
      document.isSelected = false;
    });
  }

  private mergeArchivedToDocuments(): void {
    this.archivedDocuments.forEach((document: IDocument) => {
      this.documents.unshift(document);
    });
  }

  private hideArchived(): void {
    this.documents = this.documents.filter(
      (document: IDocument) => document.isArchived === false
    );
  }

  public removeSelectedDocuments(documents: IDocument[]): void {
    if (this.isArchived) {
      this.archivedDocuments = documents.filter(
        (document: IDocument) => document.isArchived === true
      );
    }
    this.documents = documents;
    this.documents.forEach(
      (document: IDocument) => (document.isSelected = false)
    );
    this.disabledCheckbox();
    this.disableDeleteButton();
    this.isDisabledEditButton = true;
  }

  private disableDeleteButton(): void {
    if (
      this.documents.find((document: IDocument) => document.isSelected === true)
    ) {
      this.isdisabledDeleteButton = false;
    } else {
      this.isdisabledDeleteButton = true;
    }
  }

  private disableEditButton(): void {
    this.documents.forEach((document: IDocument) => {
      if (!document.isSelected) {
        this.isDisabledEditButton = true;
      }
    });
  }

  public disabledCheckbox(): void {
    if (
      this.archivedDocuments.length ||
      this.documents.some((document) => document.isArchived)
    ) {
      this.isDisableArchiveCheckbox = false;
    } else {
      this.isDisableArchiveCheckbox = true;
    }
  }

  public sortDocumentsByType(isSortByDocumentType: boolean): void {
    this.documents.sort((a, b) => {
      const order = this.isSortByDocumentType ? 1 : -1;
      return b.documentType.localeCompare(a.documentType) * order;
    });
    this.isSortByDocumentType = isSortByDocumentType;
  }

  public sortDocumentsBySeries(isSortDocumentsBySeries: boolean): void {
    this.documents.sort((a, b) => {
      const seriesA = a.series.toUpperCase();
      const seriesB = b.series.toUpperCase();
      if (this.isSortDocumentsBySeries) {
        if (/^\d+$/.test(seriesA) && /^\d+$/.test(seriesB)) {
          return parseInt(seriesB) - parseInt(seriesA);
        } else if (/^\d+$/.test(seriesA)) {
          return 1;
        } else if (/^\d+$/.test(seriesB)) {
          return -1;
        }
      } else {
        if (/^\d+$/.test(seriesA) && /^\d+$/.test(seriesB)) {
          return parseInt(seriesA) - parseInt(seriesB);
        } else if (/^\d+$/.test(seriesA)) {
          return -1;
        } else if (/^\d+$/.test(seriesB)) {
          return 1;
        }
      }
      return seriesA.localeCompare(seriesA);
    });
    this.isSortDocumentsBySeries = isSortDocumentsBySeries;
  }

  public sortDocumentsByNumber(isSortDocumentsByNumber: boolean): void {
    this.documents.sort((a, b) => {
      if (this.isSortDocumentsByNumber) {
        return b.number - a.number;
      } else {
        return a.number - b.number;
      }
    });
    this.isSortDocumentsByNumber = isSortDocumentsByNumber;
  }

  public sortDocumentsByDate(isSortDocumentsByDate: boolean): void {
    this.documents.sort((a, b) => {
      const dateA = new Date(a.dateOfIssue.split('.').reverse().join('-'));
      const dateB = new Date(b.dateOfIssue.split('.').reverse().join('-'));
      if (this.isSortDocumentsByDate) {
        return dateB > dateA ? 1 : -1;
      } else {
        return dateA > dateB ? 1 : -1;
      }
    });
    this.isSortDocumentsByDate = isSortDocumentsByDate;
  }
}
