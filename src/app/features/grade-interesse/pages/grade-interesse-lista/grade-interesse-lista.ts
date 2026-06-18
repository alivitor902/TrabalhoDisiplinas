import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Disciplina } from '../../../disciplinas/models/disciplina.model';
import { DisciplinaService } from '../../../disciplinas/services/disciplina.service';

@Component({
  selector: 'app-grade-interesse-lista',
  imports: [RouterLink],
  templateUrl: './grade-interesse-lista.html',
  styleUrl: './grade-interesse-lista.scss'
})
export class GradeInteresseLista implements OnInit {
  disciplinas: Disciplina[] = [];
  carregando = false;
  erro = '';

  constructor(private readonly disciplinaService: DisciplinaService) {}

  ngOnInit(): void {
    this.carregarGrade();
  }

  async removerDaGrade(disciplina: Disciplina): Promise<void> {
    try {
      this.erro = '';
      await this.disciplinaService.removerDaGrade(disciplina.id);
      await this.carregarGrade();
    } catch (error) {
      this.erro = this.obterMensagemErro(error, 'Erro ao atualizar grade de interesse.');
    }
  }

  private async carregarGrade(): Promise<void> {
    try {
      this.carregando = true;
      this.erro = '';
      this.disciplinas = await this.disciplinaService.listarGradeInteresse();
    } catch (error) {
      this.erro = this.obterMensagemErro(error, 'Erro ao carregar disciplinas.');
      this.disciplinas = [];
    } finally {
      this.carregando = false;
    }
  }

  private obterMensagemErro(error: unknown, mensagemPadrao: string): string {
    return error instanceof Error ? error.message : mensagemPadrao;
  }
}
