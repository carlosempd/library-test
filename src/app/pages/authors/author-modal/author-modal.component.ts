import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Author } from '@models/author.model';

@Component({
  selector: 'app-author-modal',
  templateUrl: './author-modal.component.html',
  styleUrls: ['./author-modal.component.scss'],
})
export class AuthorModalComponent implements OnInit {
  authorForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AuthorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Author,
  ) {
    this.isEditMode = !!data;
    this.authorForm = this.fb.group({
      name: [data?.name || '', [Validators.required]],
      genre: [data?.genre || '', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.authorForm.valid) {
      const result = {
        ...this.data,
        ...this.authorForm.value,
      };
      this.dialogRef.close(result);
    }
  }
}
