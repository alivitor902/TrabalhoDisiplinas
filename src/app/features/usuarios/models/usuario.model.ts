export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  perfil: 'admin' | 'aluno';
  ativo: boolean;
}

export type UsuarioSessao = Omit<Usuario, 'senha'>;
