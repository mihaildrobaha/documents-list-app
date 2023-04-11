export interface IDocument {
  id: string;
  documentType: string;
  series: string;
  number: number;
  dateOfIssue: string;
  isMain: boolean;
  isArchived: boolean;
  isSelected: boolean;
  organization: string;
  divisionCode: string;
}

export interface IType {
  type: string;
}

export interface ISearchData {
  documentType: string;
  documentNumber: number;
}
