import { Injectable } from '@angular/core';
import { Database, get, push, ref, remove, set, update } from '@angular/fire/database';
import { Disciplina } from '../models/disciplina.model';

export type DisciplinaFormulario = Omit<Disciplina, 'id' | 'adicionadaNaGrade'>;

@Injectable({
  providedIn: 'root'
})
export class DisciplinaService {
  private readonly caminho = 'disciplinas';

  constructor(private readonly database: Database) {}

  async listar(): Promise<Disciplina[]> {
    try {
      const snapshot = await get(ref(this.database, this.caminho));
      const dados = snapshot.val() as Record<string, Omit<Disciplina, 'id'>> | null;

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
      const snapshot = await get(ref(this.database, `${this.caminho}/${id}`));
      const disciplina = snapshot.val() as Omit<Disciplina, 'id'> | null;

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
      const novaDisciplinaRef = push(ref(this.database, this.caminho));

      await set(novaDisciplinaRef, {
        ...disciplina,
        adicionadaNaGrade: false
      });
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao cadastrar disciplina.');
    }
  }

  async editar(id: string, disciplina: DisciplinaFormulario): Promise<void> {
    try {
      await update(ref(this.database, `${this.caminho}/${id}`), disciplina);
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao editar disciplina.');
    }
  }

  async excluir(id: string): Promise<void> {
    try {
      await remove(ref(this.database, `${this.caminho}/${id}`));
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
      await update(ref(this.database, `${this.caminho}/${id}`), { adicionadaNaGrade });
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao atualizar grade de interesse.');
    }
  }
}
