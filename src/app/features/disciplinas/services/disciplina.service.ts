import { Injectable } from '@angular/core';
import { Disciplina } from '../models/disciplina.model';

export type DisciplinaFormulario = Omit<Disciplina, 'id' | 'adicionadaNaGrade'>;

@Injectable({
  providedIn: 'root'
})
export class DisciplinaService {
  private readonly storageKey = 'catalogo-disciplinas';
  private disciplinas: Disciplina[] = [];

  constructor() {
    this.disciplinas = this.carregar();
  }

  listar(): Disciplina[] {
    return [...this.disciplinas];
  }

  buscarPorId(id: string): Disciplina | undefined {
    return this.disciplinas.find((disciplina) => disciplina.id === id);
  }

  cadastrar(disciplina: DisciplinaFormulario): void {
    this.disciplinas = [
      ...this.disciplinas,
      {
        ...disciplina,
        id: crypto.randomUUID(),
        adicionadaNaGrade: false
      }
    ];
    this.salvar();
  }

  editar(id: string, disciplina: DisciplinaFormulario): void {
    this.disciplinas = this.disciplinas.map((item) =>
      item.id === id ? { ...item, ...disciplina } : item
    );
    this.salvar();
  }

  excluir(id: string): void {
    this.disciplinas = this.disciplinas.filter((disciplina) => disciplina.id !== id);
    this.salvar();
  }

  adicionarNaGrade(id: string): void {
    this.alterarStatusGrade(id, true);
  }

  removerDaGrade(id: string): void {
    this.alterarStatusGrade(id, false);
  }

  listarGradeInteresse(): Disciplina[] {
    return this.disciplinas.filter((disciplina) => disciplina.adicionadaNaGrade);
  }

  private alterarStatusGrade(id: string, adicionadaNaGrade: boolean): void {
    this.disciplinas = this.disciplinas.map((disciplina) =>
      disciplina.id === id ? { ...disciplina, adicionadaNaGrade } : disciplina
    );
    this.salvar();
  }

  private carregar(): Disciplina[] {
    const dadosSalvos = localStorage.getItem(this.storageKey);

    if (!dadosSalvos) {
      return this.salvarDadosIniciais();
    }

    try {
      return JSON.parse(dadosSalvos) as Disciplina[];
    } catch {
      return this.salvarDadosIniciais();
    }
  }

  private salvar(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.disciplinas));
  }

  private salvarDadosIniciais(): Disciplina[] {
    const disciplinasIniciais = this.criarDadosIniciais();
    localStorage.setItem(this.storageKey, JSON.stringify(disciplinasIniciais));
    return disciplinasIniciais;
  }

  private criarDadosIniciais(): Disciplina[] {
    return [
      {
        id: 'poo',
        nome: 'Programação Orientada a Objetos',
        descricao: 'Estudo de classes, objetos, encapsulamento, herança e polimorfismo.',
        cargaHoraria: 80,
        professor: 'Mariana Souza',
        periodo: '3º período',
        categoria: 'Programação',
        adicionadaNaGrade: false
      },
      {
        id: 'estrutura-dados',
        nome: 'Estrutura de Dados',
        descricao: 'Listas, pilhas, filas, árvores, grafos e análise de estruturas.',
        cargaHoraria: 80,
        professor: 'Carlos Mendes',
        periodo: '4º período',
        categoria: 'Computação',
        adicionadaNaGrade: false
      },
      {
        id: 'banco-dados',
        nome: 'Banco de Dados',
        descricao: 'Modelagem relacional, SQL, normalização e consultas a dados.',
        cargaHoraria: 60,
        professor: 'Renata Lima',
        periodo: '4º período',
        categoria: 'Dados',
        adicionadaNaGrade: false
      },
      {
        id: 'engenharia-software',
        nome: 'Engenharia de Software',
        descricao: 'Processos, requisitos, projeto, testes e manutenção de software.',
        cargaHoraria: 60,
        professor: 'Eduardo Rocha',
        periodo: '5º período',
        categoria: 'Gestão de Software',
        adicionadaNaGrade: false
      },
      {
        id: 'desenvolvimento-web',
        nome: 'Desenvolvimento Web',
        descricao: 'Criação de aplicações web com HTML, CSS, TypeScript e frameworks.',
        cargaHoraria: 80,
        professor: 'Juliana Castro',
        periodo: '5º período',
        categoria: 'Programação',
        adicionadaNaGrade: false
      },
      {
        id: 'sistemas-operacionais',
        nome: 'Sistemas Operacionais',
        descricao: 'Gerência de processos, memória, arquivos e concorrência.',
        cargaHoraria: 60,
        professor: 'Roberto Almeida',
        periodo: '3º período',
        categoria: 'Computação',
        adicionadaNaGrade: false
      }
    ];
  }
}
