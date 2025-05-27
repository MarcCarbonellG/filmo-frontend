import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  errorMessage: string | null = null;
  @ViewChild('regSuccessRef') regSuccessRef!: ElementRef<HTMLDialogElement>;

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: [
          '',
          [
            Validators.required,
            Validators.maxLength(20),
            Validators.pattern(/^\S+$/),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/),
          ],
        ],
        confirm: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirm = form.get('confirm')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  openRegSuccessDialog() {
    this.regSuccessRef.nativeElement.showModal();
  }

  closeRegSuccessDialog() {
    this.regSuccessRef.nativeElement.close();
    this.router.navigate(['/login']);
  }
  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { email, username, password } = this.registerForm.value;

    const cleanUsername = username.trim().replace(/\s/g, '');

    this.authService.register(email, cleanUsername, password).subscribe({
      next: () => {
        this.openRegSuccessDialog();
      },
      error: (err) => {
        this.errorMessage = err.error.userMessage;
      },
    });
  }
}
