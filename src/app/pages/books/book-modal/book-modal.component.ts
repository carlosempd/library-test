import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Author } from '@models/author.model';
import { Book } from '@models/book.model';
import { AuthorService } from '@services/author.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthorModalComponent } from '@pages/authors/author-modal/author-modal.component';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-book-modal',
  templateUrl: './book-modal.component.html',
  styleUrls: ['./book-modal.component.scss'],
})
export class BookModalComponent implements OnInit {
  bookForm: FormGroup;
  isEditMode: boolean = false;
  authors: Author[] = [];
  filteredAuthors!: Observable<Author[]>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BookModalComponent>,
    private dialog: MatDialog,
    private authorService: AuthorService,
    private toast: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: { book?: Book, authors: Author[] }
  ) {
    this.isEditMode = !!data.book;
    this.authors = data.authors;

    this.bookForm = this.fb.group({
      title: [data.book?.title || '', [Validators.required]],
      description: [data.book?.description || '', [Validators.required]],
      author: [this.findAuthor(data.book?.authorId), [Validators.required]],
      published: [data.book?.published || false],
      yearPublished: [data.book?.yearPublished || null, [Validators.min(1000), Validators.max(new Date().getFullYear())]]
    });

    this.setupConditionalValidation();
  }

  ngOnInit(): void {
    this.filteredAuthors = this.bookForm.get('author')!.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value?.name),
      map(name => name ? this._filter(name) : this.authors.slice())
    );
  }

  private findAuthor(id?: number): Author | null {
    if (!id) return null;
    return this.authors.find(a => a.id === id) || null;
  }

  private _filter(name: string): Author[] {
    const filterValue = name.toLowerCase();
    return this.authors.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  displayFn(author: Author): string {
    return author && author.name ? author.name : '';
  }

  setupConditionalValidation() {
    const publishedControl = this.bookForm.get('published');
    const yearControl = this.bookForm.get('yearPublished');

    // Initial check
    if (publishedControl?.value) {
      yearControl?.setValidators([Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear())]);
    }

    publishedControl?.valueChanges.subscribe(published => {
      if (published) {
        yearControl?.setValidators([Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear())]);
      } else {
        yearControl?.setValidators([Validators.min(1000), Validators.max(new Date().getFullYear())]);
      }
      yearControl?.updateValueAndValidity();
    });
  }

  onAddNewAuthor() {
    const dialogRef = this.dialog.open(AuthorModalComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authorService.createAuthor(result).subscribe(
          newAuthor => {
            this.authors.push(newAuthor);
            this.bookForm.get('author')?.setValue(newAuthor);
            this.toast.success('Author created and selected');
          },
          () => {
            this.toast.error('Error creating author');
          }
        );
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.bookForm.valid) {
      const formValue = this.bookForm.value;
      const result: any = {
        title: formValue.title,
        description: formValue.description,
        authorId: formValue.author.id,
        published: formValue.published,
        yearPublished: formValue.yearPublished
      };
      
      this.dialogRef.close(result);
    }
  }
}
