import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string): void {
    this.show(message, 'success-snackbar', 3000);
  }

  error(message: string): void {
    this.show(message, 'error-snackbar', 5000);
  }

  private show(message: string, panelClass: string, duration: number): void {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }
}
