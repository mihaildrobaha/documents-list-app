export interface IDocument {
  id: number;
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
