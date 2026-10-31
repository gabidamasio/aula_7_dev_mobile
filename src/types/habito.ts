export type StatusHabito = 'pendente' | 'concluido' | 'pulado';

export type CategoriaHabito = 'saude' | 'produtividade' | 'mentalidade' | 'sono';

export type FrequenciaHabito = 'diaria' | 'semanal';

/**
 * Aula 5 — onde o hábito foi registrado.
 *
 * `precisaoMetros` é o RAIO de confiança devolvido pelo GPS (`coords.accuracy`), não um
 * erro: "estamos neste ponto, com ± tantos metros de margem". Exibir a coordenada sem ele
 * é vender uma certeza que o aparelho não tem.
 */
export interface LocalHabito {
  latitude: number;
  longitude: number;
  precisaoMetros: number;
}

export interface Habito {
  id: string;
  titulo: string;
  categoria: CategoriaHabito;
  frequencia: FrequenciaHabito;
  status: StatusHabito;
  streakDias: number;
  destacado?: boolean;
  criadoEm: string;
  /**
   * Aula 5 — os dois campos novos são OPCIONAIS de propósito: o usuário pode negar a
   * permissão de localização, negar a câmera, ou as duas. Um hábito sem foto e sem local
   * continua sendo um hábito. Um tipo que obrigasse os dois quebraria o app justamente
   * para quem disse "não".
   */
  local?: LocalHabito;
  fotoUri?: string;
}

export type NovoHabito = Omit<Habito, 'id' | 'status' | 'streakDias' | 'criadoEm'>;

export type ResumoHabito = Pick<Habito, 'id' | 'titulo' | 'status' | 'categoria'>;

export type AtualizacaoHabito = Partial<Omit<Habito, 'id' | 'criadoEm'>>;

export type EstadoTela<T> =
  | { situacao: 'carregando' }
  | { situacao: 'sucesso'; dados: T }
  | { situacao: 'erro'; mensagem: string };
