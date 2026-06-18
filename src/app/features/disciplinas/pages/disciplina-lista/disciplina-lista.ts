import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DisciplinaCard } from '../../components/disciplina-card/disciplina-card';
import { Disciplina } from '../../models/disciplina.model';
import { DisciplinaService } from '../../services/disciplina.service';

@Component({
  selector: 'app-disciplina-lista',
  imports: [FormsModule, RouterLink, DisciplinaCard],
  templateUrl: './disciplina-lista.html',
  styleUrl: './disciplina-lista.scss'
})
export class DisciplinaLista implements OnInit {
  disciplinas: Disciplina[] = [];
  busca = '';
  filtroPeriodo = '';
  filtroCategoria = '';
  carregando = false;
  erro = '';

  constructor(private readonly disciplinaService: DisciplinaService) {}

  ngOnInit(): void {
    this.carregarDisciplinas();
  }

  get periodos(): string[] {
    return [...new Set(this.disciplinas.map((disciplina) => disciplina.periodo))];
  }

  get categorias(): string[] {
    return [...new Set(this.disciplinas.map((disciplina) => disciplina.categoria))];
  }

  get disciplinasFiltradas(): Disciplina[] {
    const termo = this.busca.trim().toLowerCase();

    return this.disciplinas.filter((disciplina) => {
      const textoBusca = [
        disciplina.nome,
        disciplina.professor,
        disciplina.periodo,
        disciplina.categoria
      ]
        .join(' ')
        .toLowerCase();

      const passaBusca = !termo || textoBusca.includes(termo);
      const passaPeriodo = !this.filtroPeriodo || disciplina.periodo === this.filtroPeriodo;
      const passaCategoria = !this.filtroCategoria || disciplina.categoria === this.filtroCategoria;

      return passaBusca && passaPeriodo && passaCategoria;
    });
  }

  async adicionarNaGrade(disciplina: Disciplina): Promise<void> {
    try {
      this.erro = '';
      await this.disciplinaService.adicionarNaGrade(disciplina.id);
      await this.carregarDisciplinas();
    } catch (error) {
      this.erro = this.obterMensagemErro(error, 'Erro ao atualizar grade de interesse.');
    }
  }

  async removerDaGrade(disciplina: Disciplina): Promise<void> {
    try {
      this.erro = '';
      await this.disciplinaService.removerDaGrade(disciplina.id);
      await this.carregarDisciplinas();
    } catch (error) {
      this.erro = this.obterMensagemErro(error, 'Erro ao atualizar grade de interesse.');
    }
  }

  async excluir(disciplina: Disciplina): Promise<void> {
    const confirmar = confirm(`Deseja excluir a disciplina ${disciplina.nome}?`);

    if (confirmar) {
      try {
        this.erro = '';
        await this.disciplinaService.excluir(disciplina.id);
        await this.carregarDisciplinas();
      } catch (error) {
        this.erro = this.obterMensagemErro(error, 'Erro ao excluir disciplina.');
      }
    }
  }

  limparFiltros(): void {
    this.busca = '';
    this.filtroPeriodo = '';
    this.filtroCategoria = '';
  }

  private async carregarDisciplinas(): Promise<void> {
    try {
      this.carregando = true;
      this.erro = '';
      this.disciplinas = await this.disciplinaService.listar();
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
