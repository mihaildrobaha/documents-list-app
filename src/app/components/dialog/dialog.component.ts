import { Component } from '@angular/core';

interface IType {
  value: string;
  typeValue: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  public value: string = '';

  public types: IType[] = [
    { value: 'type-0', typeValue: 'type1' },
    { value: 'type-1', typeValue: 'type2' },
    { value: 'type-2', typeValue: 'type3' },
  ];

  mask = { mask: [/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/] };
}
