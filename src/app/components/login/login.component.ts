import {
  Component,
  EventEmitter,
  output,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);

  closeLogin = output<void>();

  //  état du composant
  currentView = signal<'question' | 'login' | 'register'>('question');
  isSubmitting = signal(false);
  localError = signal<string | null>(null);

  getTitleText = computed(() => {
    switch (this.currentView()) {
      case 'login':
        return 'Connexion';
      case 'register':
        return "S'inscrire";
      case 'question':
      default:
        return 'Enregistrement';
    }
  });

  authLoading = this.authService.loading;
  authError = this.authService.error;

  loginForm: FormGroup = this.formBuilder.group({
    pseudo: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  registerForm: FormGroup = this.formBuilder.group({
    pseudo: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // navigation entre les vues
  showLogin() {
    this.currentView.set('login');
    this.clearErrors();
  }

  showRegister() {
    this.currentView.set('register');
    this.clearErrors();
  }

  showQuestion() {
    this.currentView.set('question');
    this.clearErrors();
  }

  closeDisquette() {
    this.closeLogin.emit();
    this.clearErrors();
  }

  private clearErrors() {
    this.localError.set(null);
  }

  // connexion
  async onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.clearErrors();

    const { pseudo, password } = this.loginForm.value;
    const result = await this.authService.signIn(pseudo, password);

    this.isSubmitting.set(false);

    if (result.success) {
      this.closeDisquette();
    } else {
      this.localError.set(result.error || 'Erreur de connexion');
    }
  }

  // inscription
  async onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.clearErrors();

    const { pseudo, password } = this.registerForm.value;
    const result = await this.authService.signUp(pseudo, password);

    this.isSubmitting.set(false);

    if (result.success) {
      this.localError.set('Vérifiez votre pseudo pour confirmer votre compte!');
      setTimeout(() => {
        this.showLogin();
      }, 3000);
    } else {
      this.localError.set(result.error || "Erreur d'inscription");
    }
  }

  // erreurs de formulaire
  getFieldError(
    formName: 'login' | 'register',
    fieldName: string
  ): string | null {
    const form = formName === 'login' ? this.loginForm : this.registerForm;
    const field = form.get(fieldName);

    if (!field || !field.touched || !field.errors) {
      return null;
    }

    if (field.errors['required']) {
      return 'Ce champ est requis';
    }
    if (field.errors['pseudo']) {
      return 'Pseudo invalide (déjà utilisé)';
    }
    if (field.errors['minlength']) {
      return 'Minimum 6 caractères';
    }
    return 'Erreur de validation';
  }
}
