import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-lista',
  imports: [RouterLink],
  templateUrl: './usuario-lista.html',
  styleUrl: './usuario-lista.scss'
})
export class UsuarioLista implements OnInit {
  usuarios: Usuario[] = [];
  carregando = false;
  erro = '';

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  async excluir(usuario: Usuario): Promise<void> {
    const confirmar = confirm(`Deseja excluir o usuário ${usuario.nome}?`);

    if (!confirmar) {
      return;
    }

    try {
      this.erro = '';
      await this.usuarioService.excluir(usuario.id);
      await this.carregarUsuarios();
    } catch (error) {
      this.erro = this.obterMensagemErro(error, 'Erro ao excluir usuário.');
      this.cdr.detectChanges();
    }
  }

  private async carregarUsuarios(): Promise<void> {
    try {
      this.carregando = true;
      this.erro = '';
      this.usuarios = await this.usuarioService.listar();
    } catch (error) {
      this.erro = this.obterMensagemErro(error, 'Erro ao carregar usuários.');
      this.usuarios = [];
    } finally {
      this.carregando = false;
      this.cdr.detectChanges();
    }
  }

  private obterMensagemErro(error: unknown, mensagemPadrao: string): string {
    return error instanceof Error ? error.message : mensagemPadrao;
  }
}
