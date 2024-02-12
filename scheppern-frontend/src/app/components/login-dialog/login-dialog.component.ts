import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { TicketService } from 'src/app/services/ticket-service.service';
import { Ticket } from 'src/models';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {
  username = '';
  password = '';

  isLoading = false;
  statusMessage = '';

  constructor(
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private ticketService: TicketService
  ) { }

  ngOnInit(): void {
  }

  login(): void {
    this.isLoading = true;
    this.ticketService.login(this.username, this.password).subscribe(
      (data) => {
        this.isLoading = false;
        this.dialogRef.close();
      },
      (error) => {
        this.isLoading = false;
        this.statusMessage = error;
        console.error('Error:', error);
      }
    );
  }
}
