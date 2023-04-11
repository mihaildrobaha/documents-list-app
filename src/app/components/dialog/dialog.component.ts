import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDocument, IType } from 'src/app/models/documents.interface';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  public isDisabledMainChekbox: boolean = false;
  public divisionCodeMask = {
    mask: [/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
  };
  public numberMask = {
    mask: [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/],
  };
  public myForm: FormGroup | null = null;
  public documentTypes: IType[] = [
    { type: 'Паспорт' },
    { type: 'Загран. паспорт' },
    { type: 'Свидетельство о рождении' },
  ];
  public organizationTypes: IType[] = [
    { type: 'ГУ МВД Первого района' },
    { type: 'ГУ МВД Второго района' },
    { type: 'ГУ МВД Третьего района' },
  ];

  constructor(
    private FormBuilder: FormBuilder,
    private dataService: DataService,
    private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) public documents: IDocument[] | null = null,
    @Inject(MAT_DIALOG_DATA) public document: IDocument | null = null
  ) {
    this.myForm = this.FormBuilder.group({
      id: [this.document?.id ? this.document?.id : false],
      isMain: [this.document?.isMain ? this.document?.isMain : false],
      isArchived: [
        this.document?.isArchived ? this.document?.isArchived : false,
      ],
      isSelected: [
        this.document?.isSelected ? this.document?.isSelected : false,
      ],
      documentType: [
        this.document?.documentType ? this.document?.documentType : '',
        Validators.required,
      ],
      series: [this.document?.series ? this.document?.series : ''],
      number: [
        this.document?.number ? this.document?.number : null,
        Validators.required,
      ],
      dateOfIssue: [
        this.formatDate(
          this.document?.dateOfIssue ? this.document?.dateOfIssue : '-'
        ),
      ],
      organization: [
        this.document?.organization ? this.document?.organization : '',
      ],
      divisionCode: [
        this.document?.divisionCode ? this.document?.divisionCode : '',
      ],
    });
  }

  public ngOnInit(): void {
    if (this.documents?.length) {
      this.disabledMainCheckboxToAdd();
    }
    this.disabledMainCheckboxToEdit();
  }

  private disabledMainCheckboxToAdd(): void {
    this.dialogService.documents?.forEach((document: IDocument) => {
      if (document.isMain) {
        this.myForm!.controls['isMain'].disable();
      }
    });
    this.dialogService.archivedDocuments.forEach((document: IDocument) => {
      if (document.isMain) {
        this.myForm!.controls['isMain'].disable();
      }
    });
  }

  private disabledMainCheckboxToEdit(): void {
    if (this.document?.isMain) {
      this.myForm!.controls['isMain'].enable();
    }
    this.dialogService.documents.forEach((document: IDocument) => {
      if (document.isMain && !this.document?.isMain) {
        this.myForm!.controls['isMain'].disable();
      }
    });
    this.dialogService.archivedDocuments.forEach((document: IDocument) => {
      if (document.isMain && !this.document?.isMain) {
        this.myForm!.controls['isMain'].disable();
      }
    });
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString();
    const year = date.getFullYear().toString();
    return `${month}/${day}/${year}`;
  }

  public submitForm(): void {
    if (Array.isArray(this.documents)) {
      const document: IDocument = {
        id: Math.random().toString(36).substring(2),
        isMain: this.myForm?.value.isMain,
        isArchived: this.myForm?.value.isArchived,
        isSelected: this.myForm?.value.isSelected,
        documentType: this.myForm?.value.documentType,
        series: this.myForm?.value.series || '-',
        number: this.myForm?.value.number,
        dateOfIssue: this.formatDate(this.myForm?.value.dateOfIssue),
        organization: this.myForm?.value.organization,
        divisionCode: this.myForm?.value.divisionCode,
      };
      this.dataService.addDocuments(document);
    } else {
      const document: IDocument = {
        id: this.myForm?.value.id,
        isMain: this.myForm?.value.isMain,
        isArchived: this.myForm?.value.isArchived,
        isSelected: this.myForm?.value.isSelected,
        documentType: this.myForm?.value.documentType,
        series: this.myForm?.value.series || '-',
        number: this.myForm?.value.number,
        dateOfIssue: this.formatDate(this.myForm?.value.dateOfIssue),
        organization: this.myForm?.value.organization,
        divisionCode: this.myForm?.value.divisionCode,
      };
      this.dataService.editDocuments(document);
    }
  }
}
