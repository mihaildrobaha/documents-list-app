import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ISearchData, IType } from 'src/app/models/documents.interface';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Output() onSearchDocument: EventEmitter<ISearchData> =
    new EventEmitter<ISearchData>();
  @Output() onClearSearch: EventEmitter<boolean> = new EventEmitter<boolean>();

  public documentTypes: IType[] = [
    { type: 'Паспорт' },
    { type: 'Загран. паспорт' },
    { type: 'Свидетельство о рождении' },
  ];

  public myForm: FormGroup = new FormGroup({
    documentType: new FormControl(''),
    documentNumber: new FormControl(''),
  });

  public searchDocument(): void {
    if (this.myForm.value.documentNumber === '') {
      return;
    }
    const dataForSearch: ISearchData = {
      documentType: this.myForm.value.documentType,
      documentNumber: this.myForm.value.documentNumber,
    };

    this.onSearchDocument.emit(dataForSearch);
  }

  public clearSearch(): void {
    this.onClearSearch.emit();
    this.setDefaultInputValue();
  }

  public setDefaultInputValue(): void {
    this.myForm.reset();
    this.myForm.value.documentNumber = '';
  }
}
