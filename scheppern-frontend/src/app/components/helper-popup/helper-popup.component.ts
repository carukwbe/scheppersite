import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Global } from 'src/environments/environment';

@Component({
  selector: 'app-helper-popup',
  templateUrl: './helper-popup.component.html',
  styleUrls: ['./helper-popup.component.css']
})
export class HelperPopupComponent {
  Global = Global;

  constructor(
    public dialogRef: MatDialogRef<HelperPopupComponent>
  ) {}
}


