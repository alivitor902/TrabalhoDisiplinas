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

  constructor(private readonly disciplinaService: DisciplinaService) {}

  ngOnInit(): void {
    this.carregarGrade();
  }

  removerDaGrade(disciplina: Disciplina): void {
    this.disciplinaService.removerDaGrade(disciplina.id);
    this.carregarGrade();
  }

  private carregarGrade(): void {
    this.disciplinas = this.disciplinaService.listarGradeInteresse();
  }
}
