import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Usuario } from '../models/usuario.model';

export type UsuarioFormulario = Omit<Usuario, 'id'>;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly caminho = 'usuarios';
  private readonly baseUrl = `${environment.firebaseConfig.databaseURL}/${this.caminho}`;

  async listar(): Promise<Usuario[]> {
    try {
      const dados = await this.request<Record<string, Omit<Usuario, 'id'>> | null>('');

      if (!dados) {
        return [];
      }

      return Object.entries(dados).map(([id, usuario]) => ({
        id,
        ...usuario
      }));
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao carregar usuários.');
    }
  }

  async buscarPorId(id: string): Promise<Usuario | undefined> {
    try {
      const usuario = await this.request<Omit<Usuario, 'id'> | null>(id);

      if (!usuario) {
        return undefined;
      }

      return {
        id,
        ...usuario
      };
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao carregar usuário.');
    }
  }

  async cadastrar(usuario: UsuarioFormulario): Promise<void> {
    try {
      await this.request('', {
        method: 'POST',
        body: usuario
      });
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao cadastrar usuário.');
    }
  }

  async editar(id: string, usuario: UsuarioFormulario): Promise<void> {
    try {
      await this.request(id, {
        method: 'PATCH',
        body: usuario
      });
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao editar usuário.');
    }
  }

  async excluir(id: string): Promise<void> {
    try {
      await this.request(id, { method: 'DELETE' });
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao excluir usuário.');
    }
  }

  async buscarPorEmailSenha(email: string, senha: string): Promise<Usuario | undefined> {
    const usuarios = await this.listar();
    const emailNormalizado = email.trim().toLowerCase();

    return usuarios.find(
      (usuario) => usuario.email.trim().toLowerCase() === emailNormalizado && usuario.senha === senha
    );
  }

  private async request<T>(
    path: string,
    options: { method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'; body?: unknown } = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);
    const pathSegment = path ? `/${encodeURIComponent(path)}` : '';

    try {
      const response = await fetch(`${this.baseUrl}${pathSegment}.json`, {
        method: options.method ?? 'GET',
        headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Firebase respondeu com status ${response.status}.`);
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Tempo esgotado ao conectar com o Firebase.');
      }

      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }
}
