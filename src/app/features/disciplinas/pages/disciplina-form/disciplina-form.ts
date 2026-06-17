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

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    descricao: ['', [Validators.required]],
    cargaHoraria: [0, [Validators.required, Validators.min(1)]],
    professor: ['', [Validators.required]],
    periodo: ['', [Validators.required]],
    categoria: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.disciplinaId = this.route.snapshot.paramMap.get('id');

    if (!this.disciplinaId) {
      return;
    }

    const disciplina = this.disciplinaService.buscarPorId(this.disciplinaId);

    if (!disciplina) {
      this.router.navigateByUrl('/disciplinas');
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
  }

  get titulo(): string {
    return this.disciplinaId ? 'Editar disciplina' : 'Cadastrar disciplina';
  }

  get nomeInvalido(): boolean {
    const campo = this.form.controls.nome;
    return campo.invalid && campo.touched;
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const disciplina = this.form.getRawValue();

    if (this.disciplinaId) {
      this.disciplinaService.editar(this.disciplinaId, disciplina);
    } else {
      this.disciplinaService.cadastrar(disciplina);
    }

    this.router.navigateByUrl('/disciplinas');
  }
}
