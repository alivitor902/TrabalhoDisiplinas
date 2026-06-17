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

  adicionarNaGrade(disciplina: Disciplina): void {
    this.disciplinaService.adicionarNaGrade(disciplina.id);
    this.carregarDisciplinas();
  }

  removerDaGrade(disciplina: Disciplina): void {
    this.disciplinaService.removerDaGrade(disciplina.id);
    this.carregarDisciplinas();
  }

  excluir(disciplina: Disciplina): void {
    const confirmar = confirm(`Deseja excluir a disciplina ${disciplina.nome}?`);

    if (confirmar) {
      this.disciplinaService.excluir(disciplina.id);
      this.carregarDisciplinas();
    }
  }

  limparFiltros(): void {
    this.busca = '';
    this.filtroPeriodo = '';
    this.filtroCategoria = '';
  }

  private carregarDisciplinas(): void {
    this.disciplinas = this.disciplinaService.listar();
  }
}
