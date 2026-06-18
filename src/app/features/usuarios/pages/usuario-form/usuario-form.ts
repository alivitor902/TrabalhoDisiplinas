import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.scss'
})
export class UsuarioForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usuarioService = inject(UsuarioService);
  private readonly cdr = inject(ChangeDetectorRef);
  private usuarioId: string | null = null;

  carregando = false;
  salvando = false;
  erro = '';

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    perfil: ['aluno' as 'admin' | 'aluno', [Validators.required]],
    ativo: [true, [Validators.required]]
  });

  async ngOnInit(): Promise<void> {
    this.usuarioId = this.route.snapshot.paramMap.get('id');

    if (!this.usuarioId) {
      return;
    }

    try {
      this.carregando = true;
      this.erro = '';
      const usuario = await this.usuarioService.buscarPorId(this.usuarioId);

      if (!usuario) {
        this.erro = 'Usuário não encontrado.';
        return;
      }

      this.form.patchValue({
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        perfil: usuario.perfil,
        ativo: usuario.ativo
      });
    } catch (error) {
      this.erro = this.obterMensagemErro(error, 'Erro ao carregar usuário.');
    } finally {
      this.carregando = false;
      this.cdr.detectChanges();
    }
  }

  get titulo(): string {
    return this.usuarioId ? 'Editar usuário' : 'Cadastrar usuário';
  }

  async salvar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      this.salvando = true;
      this.erro = '';
      const usuario = this.form.getRawValue();

      if (this.usuarioId) {
        await this.usuarioService.editar(this.usuarioId, usuario);
      } else {
        await this.usuarioService.cadastrar(usuario);
      }

      this.router.navigateByUrl('/usuarios');
    } catch (error) {
      this.erro = this.obterMensagemErro(
        error,
        this.usuarioId ? 'Erro ao editar usuário.' : 'Erro ao cadastrar usuário.'
      );
    } finally {
      this.salvando = false;
      this.cdr.detectChanges();
    }
  }

  private obterMensagemErro(error: unknown, mensagemPadrao: string): string {
    return error instanceof Error ? error.message : mensagemPadrao;
  }
}
