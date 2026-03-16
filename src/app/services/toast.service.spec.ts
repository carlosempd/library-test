import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        ToastService,
        { provide: MatSnackBar, useValue: spy }
      ]
    });
    service = TestBed.inject(ToastService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show success toast', () => {
    service.success('Success message');
    expect(snackBarSpy.open).toHaveBeenCalledWith('Success message', 'Close', jasmine.objectContaining({
      panelClass: ['success-snackbar']
    }));
  });

  it('should show error toast', () => {
    service.error('Error message');
    expect(snackBarSpy.open).toHaveBeenCalledWith('Error message', 'Close', jasmine.objectContaining({
      panelClass: ['error-snackbar']
    }));
  });
});
