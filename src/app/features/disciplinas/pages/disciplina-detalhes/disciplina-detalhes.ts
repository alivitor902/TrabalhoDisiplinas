import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  carregando = false;
  erro = '';
  naoEncontrada = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly disciplinaService: DisciplinaService
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.naoEncontrada = true;
      return;
    }

    try {
      this.carregando = true;
      this.erro = '';
      this.naoEncontrada = false;
      this.disciplina = await this.disciplinaService.buscarPorId(id);

      if (!this.disciplina) {
        this.naoEncontrada = true;
      }
    } catch (error) {
      this.erro = this.obterMensagemErro(error, 'Erro ao carregar disciplina.');
    } finally {
      this.carregando = false;
    }
  }

  async alternarGrade(): Promise<void> {
    if (!this.disciplina) {
      return;
    }

    try {
      this.erro = '';

      if (this.disciplina.adicionadaNaGrade) {
        await this.disciplinaService.removerDaGrade(this.disciplina.id);
      } else {
        await this.disciplinaService.adicionarNaGrade(this.disciplina.id);
      }

      this.disciplina = await this.disciplinaService.buscarPorId(this.disciplina.id);
    } catch (error) {
      this.erro = this.obterMensagemErro(error, 'Erro ao atualizar grade de interesse.');
    }
  }

  private obterMensagemErro(error: unknown, mensagemPadrao: string): string {
    return error instanceof Error ? error.message : mensagemPadrao;
  }
}
