// Atividade 1 · Aula 5 — a camada que fala com o GPS.
//
// A tela NÃO chama `expo-location` diretamente: ela chama `obterLocalAtual()` e recebe de
// volta um resultado que ou tem o local, ou tem o MOTIVO exato da falha. Assim a decisão
// de qual mensagem mostrar vira um acesso a um `Record` fechado, e o TypeScript passa a
// cobrar que você trate todos os casos.
//
// TODO 5.3: preencha o contrato de três tempos DESTE arquivo. Ele vale nota.
// CONTRATO DE TRÊS TEMPOS DESTE ARQUIVO:
// 1. PEDIR   → `Location.requestForegroundPermissionsAsync()`, e logo depois
//              `Location.hasServicesEnabledAsync()` — permissão e serviço são duas
//              perguntas diferentes, com duas respostas do usuário diferentes.
// 2. LER     → `Location.getCurrentPositionAsync({ accuracy: PRECISAO_ESCOLHIDA })`:
//              uma leitura PONTUAL ("o copo"), disparada pelo toque do usuário.
// 3. PARAR   → não se aplica, porque aqui não há assinatura. `getCurrentPositionAsync`
//              lê uma vez e devolve; não existe torneira aberta para fechar. Se um dia
//              esta camada passar a usar `watchPositionAsync`, ela precisará devolver a
//              assinatura para que a tela tenha um botão que chame `remove()`.

import * as Location from 'expo-location';

import type { LocalHabito } from '../types/habito';

/**
 * Os caminhos de falha do GPS. São quatro e não um porque as AÇÕES que o usuário precisa
 * tomar são quatro diferentes.
 */
export type FalhaLocal =
  | 'permissao-negada'
  | 'permissao-bloqueada'
  | 'servico-desligado'
  | 'hardware-indisponivel';

export type ResultadoLocal =
  | { ok: true; local: LocalHabito }
  | { ok: false; falha: FalhaLocal };

// Quatro mensagens, quatro próximos toques de dedo diferentes:
// tocar de novo · abrir as Configurações · ligar o GPS · desistir e salvar sem local.
export const MENSAGENS_FALHA_LOCAL: Record<FalhaLocal, string> = {
  // TODO 5.4: escreva as quatro mensagens. Elas precisam ser DIFERENTES entre si e dizer
  //          ao usuário O QUE ELE PODE FAZER. "Erro ao obter localização" nas quatro é
  //          exatamente o que este exercício existe para evitar.
  //          Pergunte-se, para cada uma: qual é o próximo toque de dedo do usuário?
  'permissao-negada':
    'Sem a localização não dá para registrar onde o treino aconteceu. Toque em "Usar minha localização" de novo e escolha "Permitir".',
  'permissao-bloqueada':
    'A permissão de localização está bloqueada para este app. Abra Configurações > Habit Tracker > Localização e autorize o acesso — o diálogo não vai mais aparecer sozinho.',
  'servico-desligado':
    'A localização do aparelho está desligada. Ligue o GPS nas configurações rápidas e toque no botão de novo.',
  'hardware-indisponivel':
    'Não foi possível ler o GPS deste aparelho. Você pode salvar o hábito sem o local — ele continua valendo.',
};

// TODO 5.5: escolha a Accuracy e JUSTIFIQUE aqui em comentário.
//          O objetivo do campo é responder "em que academia o treino aconteceu".
//          Quanto custa, em bateria e em tempo de espera, cada nível acima do necessário?
//          A justificativa também vai para o README (TODO 5.24).

/**
 * `Balanced` (~100 m) é o suficiente para responder a pergunta do campo: "em que academia
 * o treino aconteceu". Uma academia ocupa um quarteirão, e 100 m distinguem bairros.
 *
 * O nível acima (`High`, ~10 m) liga o GPS em potência cheia e costuma levar vários
 * segundos a mais para fixar sinal — bateria e espera pagos por uma precisão que nenhuma
 * parte da tela usa. `BestForNavigation` é mais caro ainda, e existe para desenhar o
 * trajeto de quem está se movendo. O nível abaixo (`Low`, ~1 km) sai barato mas confunde
 * academias vizinhas, que é justamente o que não pode acontecer.
 */
const PRECISAO_ESCOLHIDA = Location.Accuracy.Balanced;

export async function obterLocalAtual(): Promise<ResultadoLocal> {
  // TODO 5.6: peça a permissão de foreground.
  //          Se não for concedida, decida entre 'permissao-negada' e 'permissao-bloqueada'
  //          usando o campo certo da resposta, e devolva { ok: false, falha }.
  // 1. PEDIR — `canAskAgain` é o campo que separa "negou" de "bloqueou". Sem ele o app
  //    manda o usuário tocar num botão que nunca mais vai funcionar.
  const permissao = await Location.requestForegroundPermissionsAsync();
  if (permissao.status !== 'granted') {
    return {
      ok: false,
      falha: permissao.canAskAgain ? 'permissao-negada' : 'permissao-bloqueada',
    };
  }

  // TODO 5.7: confira se o SERVIÇO de localização está ligado. Permissão concedida com o
  //          GPS desligado é situação cotidiana, e é uma checagem SEPARADA — a ação do
  //          usuário é outra.
  // Checagem SEPARADA: permissão concedida com o GPS do aparelho desligado é situação
  // cotidiana, e a ação do usuário é outra (ligar o GPS, não reautorizar o app).
  const servicoLigado = await Location.hasServicesEnabledAsync();
  if (!servicoLigado) {
    return { ok: false, falha: 'servico-desligado' };
  }

  // TODO 5.8: leia a posição com a Accuracy do TODO 5.5 e monte o LocalHabito.
  //          Atenção: `coords.accuracy` é `number | null`.

  // 2. LER — o `try` existe para que um aparelho sem GPS (ou uma leitura que estoura o
  //    tempo) caia em 'hardware-indisponivel' em vez de derrubar a tela.
  try {
    const posicao = await Location.getCurrentPositionAsync({ accuracy: PRECISAO_ESCOLHIDA });

    return {
      ok: true,
      local: {
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
        // `coords.accuracy` é `number | null`: nem todo aparelho informa o raio.
        precisaoMetros: posicao.coords.accuracy ?? 0,
      },
    };
  } catch {
    return { ok: false, falha: 'hardware-indisponivel' };
  }
}
