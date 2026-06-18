import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DisciplinaService } from '../../services/disciplina.service';

@Component({
  selector: 'app-disciplina-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './disciplina-form.html',
  styleUrl: './disciplina-form.scss'
})
export class DisciplinaForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly disciplinaService = inject(DisciplinaService);
  private disciplinaId: string | null = null;
  carregando = false;
  salvando = false;
  erro = '';

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    descricao: ['', [Validators.required]],
    cargaHoraria: [0, [Validators.required, Validators.min(1)]],
    professor: ['', [Validators.required]],
    periodo: ['', [Validators.required]],
    categoria: ['', [Validators.required]]
  });

  async ngOnInit(): Promise<void> {
    this.disciplinaId = this.route.snapshot.paramMap.get('id');

    if (!this.disciplinaId) {
      return;
    }

    try {
      this.carregando = true;
      this.erro = '';
      const disciplina = await this.disciplinaService.buscarPorId(this.disciplinaId);

      if (!disciplina) {
        this.erro = 'Disciplina não encontrada.';
        return;
      }

      this.form.patchValue({
        nome: disciplina.nome,
        descricao: disciplina.descricao,
        cargaHoraria: disciplina.cargaHoraria,
        professor: disciplina.professor,
        periodo: disciplina.periodo,
        categoria: disciplina.categoria
      });
    } catch (error) {
      this.erro = this.obterMensagemErro(error, 'Erro ao carregar disciplina.');
    } finally {
      this.carregando = false;
    }
  }

  get titulo(): string {
    return this.disciplinaId ? 'Editar disciplina' : 'Cadastrar disciplina';
  }

  get nomeInvalido(): boolean {
    const campo = this.form.controls.nome;
    return campo.invalid && campo.touched;
  }

  async salvar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const disciplina = this.form.getRawValue();

    try {
      this.salvando = true;
      this.erro = '';

      if (this.disciplinaId) {
        await this.disciplinaService.editar(this.disciplinaId, disciplina);
      } else {
        await this.disciplinaService.cadastrar(disciplina);
      }

      this.router.navigateByUrl('/disciplinas');
    } catch (error) {
      this.erro = this.obterMensagemErro(
        error,
        this.disciplinaId ? 'Erro ao editar disciplina.' : 'Erro ao cadastrar disciplina.'
      );
    } finally {
      this.salvando = false;
    }
  }

  private obterMensagemErro(error: unknown, mensagemPadrao: string): string {
    return error instanceof Error ? error.message : mensagemPadrao;
  }
}
