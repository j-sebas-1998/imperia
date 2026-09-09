import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

const USERNAME_PATTERN = /^[0-9]{6,12}$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class AuthPage {
  readonly mode = signal<AuthMode>('login');
  readonly formMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly loginForm;
  readonly registerForm;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
  ) {
    this.loginForm = this.fb.nonNullable.group({
      username: ['', [Validators.required, Validators.pattern(USERNAME_PATTERN)]],
      password: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
    });

    this.registerForm = this.fb.nonNullable.group({
      username: ['', [Validators.required, Validators.pattern(USERNAME_PATTERN)]],
      password: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  switchMode(mode: AuthMode): void {
    this.mode.set(mode);
    this.formMessage.set(null);
    this.successMessage.set(null);
  }

  onLoginSubmit(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.formMessage.set('Debes diligenciar un usuario y una contraseña válidos para continuar.');
      this.successMessage.set(null);
      return;
    }

    const { username, password } = this.loginForm.getRawValue();

    if (!this.authService.login(username, password)) {
      this.formMessage.set('Credenciales inválidas. Verifica el número de cédula y la contraseña.');
      this.successMessage.set(null);
      return;
    }

    this.formMessage.set(null);
    this.successMessage.set('Inicio de sesión exitoso.');
  }

  onRegisterSubmit(): void {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      this.formMessage.set('Revisa los datos del formulario antes de continuar.');
      this.successMessage.set(null);
      return;
    }

    const { username, password, confirmPassword } = this.registerForm.getRawValue();

    if (password !== confirmPassword) {
      this.registerForm.get('confirmPassword')?.setErrors({ mismatch: true });
      this.formMessage.set('Las contraseñas no coinciden.');
      this.successMessage.set(null);
      return;
    }

    if (this.authService.isRegistered(username)) {
      this.registerForm.get('username')?.setErrors({ alreadyRegistered: true });
      this.formMessage.set('El número de cédula ya está registrado.');
      this.successMessage.set(null);
      return;
    }

    const result = this.authService.register(username, password);

    if (!result.success) {
      this.formMessage.set(result.message);
      this.successMessage.set(null);
      return;
    }

    this.formMessage.set(null);
    this.successMessage.set(result.message);
    this.registerForm.reset();
    this.mode.set('login');
    this.loginForm.patchValue({ username, password });
  }

  isInvalid(controlName: string, formName: 'login' | 'register'): boolean {
    const form: FormGroup = formName === 'login' ? this.loginForm : this.registerForm;
    const control = form.get(controlName as 'username' | 'password' | 'confirmPassword');

    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getLoginUsernameError(): string {
    const control = this.loginForm.get('username');
    return this.getFieldMessage(control, 'Usuario');
  }

  getLoginPasswordError(): string {
    const control = this.loginForm.get('password');
    return this.getFieldMessage(control, 'Contraseña');
  }

  getRegisterUsernameError(): string {
    const control = this.registerForm.get('username');
    return this.getFieldMessage(control, 'Usuario');
  }

  getRegisterPasswordError(): string {
    const control = this.registerForm.get('password');
    return this.getFieldMessage(control, 'Contraseña');
  }

  getConfirmPasswordError(): string {
    const control = this.registerForm.get('confirmPassword');

    if (!control || !control.touched && !control.dirty) {
      return '';
    }

    if (control.errors?.['required']) {
      return 'La confirmación de la contraseña es obligatoria.';
    }

    if (control.errors?.['mismatch']) {
      return 'Las contraseñas no coinciden.';
    }

    return '';
  }

  private getFieldMessage(control: AbstractControl | null, label: string): string {
    if (!control || !control.touched && !control.dirty) {
      return '';
    }

    if (control.errors?.['required']) {
      return `${label} es obligatorio.`;
    }

    if (control.errors?.['pattern']) {
      if (label === 'Usuario') {
        return 'El usuario debe ser el número de cédula (solo números, 6 a 12 dígitos).';
      }

      return 'La contraseña debe tener al menos 8 caracteres, incluyendo letras y números.';
    }

    if (control.errors?.['alreadyRegistered']) {
      return 'El número de cédula ya está registrado.';
    }

    return '';
  }
}
