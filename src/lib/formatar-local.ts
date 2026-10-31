// Atividade 1 · Aula 5 — transformação de dado. SEM JSX e SEM chamada de sensor aqui.
//
// Função pura: mesma entrada, mesma saída, nenhum estado. É por isso que ela mora em
// `lib/` e não dentro da tela — mesma separação de responsabilidade cobrada na Aula 4.
import type { LocalHabito } from '../types/habito';

/**
 * Quantas casas decimais um humano consegue usar? Cada casa decimal vale ~11 m no
 * equador, e o próprio GPS erra mais do que isso: com `Accuracy.Balanced` o raio fica na
 * casa dos 50–100 m. Quatro casas (~11 m) já é mais precisão do que o dado tem — cinco,
 * seis ou catorze seriam inventar certeza.
 */
const CASAS_DECIMAIS = 4;

/**
 * Texto legível para HUMANOS, com o raio de precisão.
 *
 * O raio aparece SEMPRE, e não só quando é ruim: sem ele a tela vende uma certeza que o
 * aparelho não tem, e o usuário não tem como saber se "-8.0632, -34.8711" quer dizer
 * "nesta esquina" ou "em algum lugar deste bairro".
 */
export function formatarLocal(local: LocalHabito): string {
  const latitude = local.latitude.toFixed(CASAS_DECIMAIS);
  const longitude = local.longitude.toFixed(CASAS_DECIMAIS);
  const raio = Math.round(local.precisaoMetros);

  return `📍 ${latitude}, ${longitude} · precisão de ± ${raio} m`;
}
