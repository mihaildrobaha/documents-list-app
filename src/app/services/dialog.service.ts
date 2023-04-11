import { Injectable } from '@angular/core';
import { IDocument } from '../models/documents.interface';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  public documents: IDocument[] = [];
  public archivedDocuments: IDocument[] = [];

  constructor() {}

  public setArrays(
    documents: IDocument[],
    archivedDocuments: IDocument[]
  ): void {
    this.documents = documents;
    this.archivedDocuments = archivedDocuments;
  }
}
