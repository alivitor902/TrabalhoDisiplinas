import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StatusGradePipe } from '../../../../shared/pipes/status-grade.pipe';
import { Disciplina } from '../../models/disciplina.model';
import { DisciplinaService } from '../../services/disciplina.service';

@Component({
  selector: 'app-disciplina-detalhes',
  imports: [RouterLink, StatusGradePipe],
  templateUrl: './disciplina-detalhes.html',
  styleUrl: './disciplina-detalhes.scss'
})
export class DisciplinaDetalhes implements OnInit {
  disciplina?: Disciplina;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly disciplinaService: DisciplinaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigateByUrl('/disciplinas');
      return;
    }

    this.disciplina = this.disciplinaService.buscarPorId(id);

    if (!this.disciplina) {
      this.router.navigateByUrl('/disciplinas');
    }
  }

  alternarGrade(): void {
    if (!this.disciplina) {
      return;
    }

    if (this.disciplina.adicionadaNaGrade) {
      this.disciplinaService.removerDaGrade(this.disciplina.id);
    } else {
      this.disciplinaService.adicionarNaGrade(this.disciplina.id);
    }

    this.disciplina = this.disciplinaService.buscarPorId(this.disciplina.id);
  }
}
