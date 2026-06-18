import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario, UsuarioSessao } from '../../features/usuarios/models/usuario.model';
import { UsuarioService } from '../../features/usuarios/services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'usuarioLogado';
  private readonly usuarioLogado = signal<UsuarioSessao | null>(this.carregarUsuarioLogado());

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly router: Router
  ) {}

  async login(email: string, senha: string): Promise<{ sucesso: boolean; mensagem?: string }> {
    const usuario = await this.usuarioService.buscarPorEmailSenha(email, senha);

    if (!usuario) {
      return {
        sucesso: false,
        mensagem: 'Email ou senha inválidos.'
      };
    }

    if (!usuario.ativo) {
      return {
        sucesso: false,
        mensagem: 'Usuário inativo. Acesso não permitido.'
      };
    }

    this.salvarUsuarioLogado(usuario);

    return {
      sucesso: true
    };
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.usuarioLogado.set(null);
    this.router.navigateByUrl('/login');
  }

  estaAutenticado(): boolean {
    return this.usuarioLogado() !== null;
  }

  obterUsuarioLogado(): UsuarioSessao | null {
    return this.usuarioLogado();
  }

  private carregarUsuarioLogado(): UsuarioSessao | null {
    const usuarioSalvo = localStorage.getItem(this.storageKey);

    if (!usuarioSalvo) {
      return null;
    }

    try {
      return JSON.parse(usuarioSalvo) as UsuarioSessao;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  private salvarUsuarioLogado(usuario: Usuario): void {
    const usuarioSessao: UsuarioSessao = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
      ativo: usuario.ativo
    };

    localStorage.setItem(this.storageKey, JSON.stringify(usuarioSessao));
    this.usuarioLogado.set(usuarioSessao);
  }
}
