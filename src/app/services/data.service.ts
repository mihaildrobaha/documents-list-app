import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IDocument } from '../models/documents.interface';
import { documents } from '../data/data';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public onAddDocument$: Subject<IDocument> = new Subject<IDocument>();
  public onEditDocument$: Subject<IDocument> = new Subject<IDocument>();

  constructor() {}

  public getDocuments(): IDocument[] {
    return documents;
  }

  public addDocuments(document: IDocument): void {
    this.onAddDocument$.next(document);
  }

  public editDocuments(document: IDocument): void {
    this.onEditDocument$.next(document);
  }
}
