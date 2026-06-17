import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DestaqueGradeDirective } from '../../../../shared/directives/destaque-grade.directive';
import { StatusGradePipe } from '../../../../shared/pipes/status-grade.pipe';
import { Disciplina } from '../../models/disciplina.model';

@Component({
  selector: 'app-disciplina-card',
  imports: [RouterLink, DestaqueGradeDirective, StatusGradePipe],
  templateUrl: './disciplina-card.html',
  styleUrl: './disciplina-card.scss'
})
export class DisciplinaCard {
  @Input() disciplina!: Disciplina;

  @Output() adicionarNaGrade = new EventEmitter<Disciplina>();
  @Output() removerDaGrade = new EventEmitter<Disciplina>();
  @Output() excluir = new EventEmitter<Disciplina>();
}
