// Atividade 1 · Aula 4 — transformação de dado. SEM JSX aqui dentro.
//
// Estas duas funções são puras: mesma entrada, mesma saída, nenhum estado.
// É por isso que elas moram em `lib/` e não dentro do componente de tela — e é um
// dos critérios de avaliação da atividade ("Separação de responsabilidade").
import type { Habito } from '../types/habito';

export type Secao = { title: string; data: Habito[] };

export function agrupar(habitos: Habito[]): Secao[] {
  // Critério de agrupamento escolhido: STATUS. `data` é o nome que a SectionList exige.
  const ordem = ['pendente', 'concluido', 'pulado'] as const;
    const titulos = {
    pendente: 'Pendentes',
    concluido: 'Concluídos',
    pulado: 'Pulados',
  } as const;

  const secoes = ordem.map(status => {
    return {
      title: titulos[status],
      data: habitos.filter(h => h.status === status)
    };
  });

  return secoes.filter(secao => secao.data.length > 0);
  // A ordem dos grupos é uma DECISÃO, não um efeito colateral do `Object.keys`.
  // Ordem escolhida: Pendentes -> Concluídos -> Pulados.
  // Por quê: O foco primário do usuário ao abrir o app deve ser as tarefas que 
  // ainda precisam ser feitas (Pendentes). Depois vêm as que já foram finalizadas 
  // com sucesso ou ignoradas no dia, servindo apenas para visualização.
}

export function filtrarPorTitulo(habitos: Habito[], busca: string): Habito[] {
  // Busca vazia (ou só espaços) devolve TUDO — senão o primeiro acesso já cai no
  // estado "nada encontrado".
    if (!busca.trim()) {
    return habitos;
  }

  const termo = busca.trim().toLowerCase();
  return habitos.filter(h => h.titulo.toLowerCase().includes(termo));
}
