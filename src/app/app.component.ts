import { Component, OnInit } from '@angular/core';
import { IDocument } from './models/documents.interface';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private dataServise: DataService) {}

  public documents: IDocument[] | null = null;
  public disabledButtons: boolean = true;

  public ngOnInit(): void {
    this.dataServise.getDocuments().subscribe((data: IDocument[]) => {
      this.documents = data.filter((document) => document.isArchived === false);
    });
  }

  public toggleArchivedDocuments(isArchived: boolean): void {
    if (isArchived) {
      this.dataServise
        .getDocuments()
        .subscribe((data: IDocument[]) => (this.documents = data));
    } else {
      this.dataServise.getDocuments().subscribe((data: IDocument[]) => {
        this.documents = data.filter(
          (document) => document.isArchived === false
        );
      });
    }
    this.documents!.forEach(
      (document: IDocument) => (document.isSelected = false)
    );
  }

  public toggleSelectedDocuments(id: number): void {
    if (this.documents) {
      this.documents.forEach((document: IDocument) => {
        if (document.id === id) {
          document.isSelected = !document.isSelected;
        }
      });
    }

    if (this.documents) {
      if (
        this.documents.find(
          (document: IDocument) => document.isSelected === true
        )
      ) {
        this.disabledButtons = false;
      } else {
        this.disabledButtons = true;
      }
    }
  }

  public removeSelectedDocoments(documents: IDocument[]): void {
    this.documents = documents;
    this.documents.forEach(
      (document: IDocument) => (document.isSelected = false)
    );
    this.disabledButtons = true;
  }
}
