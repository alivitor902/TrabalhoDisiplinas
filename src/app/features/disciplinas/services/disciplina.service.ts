import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Disciplina } from '../models/disciplina.model';

export type DisciplinaFormulario = Omit<Disciplina, 'id' | 'adicionadaNaGrade'>;

@Injectable({
  providedIn: 'root'
})
export class DisciplinaService {
  private readonly caminho = 'disciplinas';
  private readonly baseUrl = `${environment.firebaseConfig.databaseURL}/${this.caminho}`;

  async listar(): Promise<Disciplina[]> {
    try {
      const dados = await this.request<Record<string, Omit<Disciplina, 'id'>> | null>('');

      if (!dados) {
        return [];
      }

      return Object.entries(dados).map(([id, disciplina]) => ({
        id,
        ...disciplina
      }));
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao carregar disciplinas.');
    }
  }

  async buscarPorId(id: string): Promise<Disciplina | undefined> {
    try {
      const disciplina = await this.request<Omit<Disciplina, 'id'> | null>(id);

      if (!disciplina) {
        return undefined;
      }

      return {
        id,
        ...disciplina
      };
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao carregar disciplina.');
    }
  }

  async cadastrar(disciplina: DisciplinaFormulario): Promise<void> {
    try {
      await this.request('', {
        method: 'POST',
        body: {
          ...disciplina,
          adicionadaNaGrade: false
        }
      });
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao cadastrar disciplina.');
    }
  }

  async editar(id: string, disciplina: DisciplinaFormulario): Promise<void> {
    try {
      await this.request(id, {
        method: 'PATCH',
        body: disciplina
      });
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao editar disciplina.');
    }
  }

  async excluir(id: string): Promise<void> {
    try {
      await this.request(id, { method: 'DELETE' });
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao excluir disciplina.');
    }
  }

  async adicionarNaGrade(id: string): Promise<void> {
    await this.alterarStatusGrade(id, true);
  }

  async removerDaGrade(id: string): Promise<void> {
    await this.alterarStatusGrade(id, false);
  }

  async listarGradeInteresse(): Promise<Disciplina[]> {
    const disciplinas = await this.listar();
    return disciplinas.filter((disciplina) => disciplina.adicionadaNaGrade);
  }

  private async alterarStatusGrade(id: string, adicionadaNaGrade: boolean): Promise<void> {
    try {
      await this.request(id, {
        method: 'PATCH',
        body: { adicionadaNaGrade }
      });
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao atualizar grade de interesse.');
    }
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
