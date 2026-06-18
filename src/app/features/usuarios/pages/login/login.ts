import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  erro = '';
  carregando = false;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]]
  });

  ngOnInit(): void {
    if (this.authService.estaAutenticado()) {
      this.router.navigateByUrl('/disciplinas');
    }
  }

  async entrar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      this.carregando = true;
      this.erro = '';
      const { email, senha } = this.form.getRawValue();
      const resultado = await this.authService.login(email, senha);

      if (!resultado.sucesso) {
        this.erro = resultado.mensagem ?? 'Email ou senha inválidos.';
        return;
      }

      this.router.navigateByUrl('/disciplinas');
    } catch {
      this.erro = 'Email ou senha inválidos.';
    } finally {
      this.carregando = false;
      this.cdr.detectChanges();
    }
  }
}
