// Atividade 3 · Aula 5 (bônus, opcional) — o nível de bolha do bom hábito.
//
// Micro-hábito de postura: o app mostra uma bolha que só fica VERDE e CENTRALIZADA
// quando o telefone está apoiado na mesa perfeitamente plano.
//
// Para pré-visualizar: descomente <TelaNivelBolha /> em App.tsx.
//
// TODO 5.28: preencha o contrato de três tempos DESTE arquivo.
// CONTRATO DE TRÊS TEMPOS DESTE ARQUIVO:
// 1. PEDIR   → `Accelerometer.isAvailableAsync()` no botão "Ligar". Movimento não pede
//              permissão de runtime no Android nem no Expo Go do iOS; o que se pergunta
//              é se o HARDWARE existe (o iOS Simulator não tem).
// 2. LER     → `Accelerometer.addListener(...)` a cada INTERVALO_MS — leitura CONTÍNUA,
//              uma torneira aberta, não um copo.
// 3. PARAR   → `assinatura?.remove()` no botão "Desligar", nesta mesma tela.
//              ⚠️ LIMITAÇÃO ASSUMIDA: esta assinatura não é encerrada ao sair da tela,
//              porque a ferramenta para isso é assunto da Aula 6. Sair com o sensor
//              ligado o deixa ligado — o botão "Desligar" existe justamente por isso.
//
// POR QUE ACELERÔMETRO E NÃO GIROSCÓPIO:
//   O giroscópio mede VELOCIDADE ANGULAR: com o aparelho parado na mesa ele marca ≈ 0
//   nos três eixos, e um nível de bolha precisa funcionar justamente com o aparelho
//   parado. O acelerômetro mede aceleração linear SOMADA À GRAVIDADE — aquele vetor
//   constante de 1 g aponta sempre para baixo, e a forma como ele se reparte entre x, y
//   e z é exatamente a INCLINAÇÃO que a bolha precisa desenhar.
//
// RESTRIÇÕES: sem animação. A bolha se move por `StyleSheet` e Flexbox, como na Aula 3.
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import type { EventSubscription } from 'expo-modules-core';

import { cores, espaco, tipografia } from '../theme';

// TODO 5.30: escolha o intervalo de atualização CONSCIENTEMENTE e justifique aqui.
//           O comentário vale nota, e o que se avalia nele é se você entendeu a troca:
//           16 ms dá ~60 leituras por segundo (bolha fluida, 60 re-renderizações por
//           segundo); 500 ms dá uma bolha que parece travada. Onde fica o meio-termo,
//           sabendo que NÃO há animação suavizando as posições intermediárias?
// const INTERVALO_MS = ???;

/**
 * 50 ms = 20 leituras (e 20 re-renderizações) por segundo.
 *
 * A troca: 16 ms daria ~60 leituras/s — fluido, mas são 60 `setState` por segundo num
 * componente que redesenha a tela inteira, e o olho não distingue o ganho num alvo que
 * se move poucos pixels. 500 ms daria uma bolha que "pula" de posição em posição e
 * parece travada. Como NÃO há animação suavizando as posições intermediárias, cada
 * leitura é um salto visível, e 20 saltos por segundo já são lidos como movimento
 * contínuo — é o ponto onde a suavidade para de melhorar e o custo continua subindo.
 */
const INTERVALO_MS = 50;

// Abaixo desta inclinação em AMBOS os eixos o aparelho está plano o bastante.
// Em g: 0.05 g ≈ 3 graus.
const TOLERANCIA_G = 0.05;

// Metade do lado da área onde a bolha anda, em pixels. Ver `estilos.area`.
const RAIO_AREA = 110;
const RAIO_BOLHA = 20;

// `left`/`top` da bolha quando ela está no centro da área (a bolha é posicionada pelo
// canto superior esquerdo, não pelo centro).
const CENTRO = RAIO_AREA - RAIO_BOLHA;

// Quanto a bolha pode andar do centro antes de encostar na borda.
const CURSO_MAXIMO = RAIO_AREA - RAIO_BOLHA;

// 1 g = curso inteiro. Ver o comentário do `deslocamento`, mais abaixo.
const PIXELS_POR_G = CURSO_MAXIMO;

/** Prende `valor` no intervalo [-limite, +limite]. Função pura, sem estado. */
function limitar(valor: number, limite: number): number {
  return Math.min(limite, Math.max(-limite, valor));
}

export function TelaNivelBolha() {
  const [assinatura, setAssinatura] = useState<EventSubscription | null>(null);
  const [inclinacao, setInclinacao] = useState({ x: 0, y: 0 });
  const [indisponivel, setIndisponivel] = useState(false);

  async function ligar() {
    // TODO 5.31: cheque a disponibilidade do acelerômetro, peça o intervalo do TODO 5.30,
    //           assine o sensor guardando `x` e `y` no estado, e guarde a assinatura.
    //           Mesmo padrão dos Exercícios 4 e 6 — inclusive o `isAvailableAsync`.

    const disponivel = await Accelerometer.isAvailableAsync();
    if (!disponivel) {
      setIndisponivel(true);
      return;
    }

    Accelerometer.setUpdateInterval(INTERVALO_MS);

    // Só x e y interessam: z é o eixo perpendicular à tela, e com o aparelho deitado ele
    // carrega o 1 g da gravidade inteiro — não diz nada sobre estar torto.
    const nova = Accelerometer.addListener(({ x, y }) => {
      setInclinacao({ x, y });
    });

    setAssinatura(nova);
  }

  function desligar() {
    // TODO 5.32: encerre a assinatura e volte a bolha ao centro.
    //           Regra nº 9 da aula: todo `addListener` tem um `remove()` no mesmo arquivo.

    // Regra nº 9 da aula: todo `addListener` tem um `remove()` no mesmo arquivo.
    assinatura?.remove();
    setAssinatura(null);
    setInclinacao({ x: 0, y: 0 });
  }

  const plano = Math.abs(inclinacao.x) < TOLERANCIA_G && Math.abs(inclinacao.y) < TOLERANCIA_G;

  // TODO 5.33: transforme a inclinação em pixels de deslocamento da bolha.
  //           Três coisas a resolver:
  //           a) quantos pixels por g? (1 g é o aparelho DE PÉ, ou seja 90 graus);
  //           b) limite o valor para a bolha não sair da área;
  //           c) um dos dois eixos precisa ser INVERTIDO — descubra qual, testando:
  //              no acelerômetro o y positivo aponta para o topo do aparelho, e na tela
  //              o y positivo desce.

  // (a) 1 g é o aparelho DE PÉ (90 graus): mapeando 1 g no curso inteiro, a bolha
  //     encosta na borda exatamente quando o telefone está na vertical, e a área toda
  //     fica disponível para os poucos graus que interessam a um nível de bolha.
  // (b) `limitar` impede que uma leitura acima de 1 g (um esbarrão) jogue a bolha para
  //     fora do círculo.
  // (c) o y é o eixo INVERTIDO: no acelerômetro o y positivo aponta para o topo do
  //     aparelho, e na tela o `top` cresce para BAIXO. Sem o sinal negativo a bolha
  //     anda para o lado errado e o nível mente.
  const deslocamento = {
    left: CENTRO + limitar(inclinacao.x * PIXELS_POR_G, CURSO_MAXIMO),
    top: CENTRO - limitar(inclinacao.y * PIXELS_POR_G, CURSO_MAXIMO),
  };

  return (
    <View style={estilos.tela}>
      <Text style={estilos.titulo}>Nível de bolha</Text>
      <Text style={estilos.legenda}>
        Apoie o telefone na mesa. A bolha fica verde quando ele está plano.
      </Text>

      {indisponivel && <Text style={estilos.erro}>Este aparelho não tem acelerômetro.</Text>}

      <View style={estilos.area}>
        <View style={estilos.mira} />
        <View
          style={[estilos.bolha, plano ? estilos.bolhaPlana : estilos.bolhaTorta, deslocamento]}
        />
      </View>

      <Text style={estilos.leitura}>
        x: {inclinacao.x.toFixed(2)} g · y: {inclinacao.y.toFixed(2)} g
      </Text>
      <Text style={estilos.status}>{plano ? '✅ plano' : '↔️ inclinado'}</Text>

      <View style={estilos.botoes}>
        <Pressable
          onPress={ligar}
          disabled={assinatura !== null}
          accessibilityRole="button"
          accessibilityLabel="Ligar o nível de bolha"
          style={({ pressed }) => [
            estilos.botao,
            pressed && estilos.pressionado,
            assinatura !== null && estilos.desabilitado,
          ]}
        >
          <Text style={estilos.textoBotao}>Ligar</Text>
        </Pressable>

        <Pressable
          onPress={desligar}
          disabled={assinatura === null}
          accessibilityRole="button"
          accessibilityLabel="Desligar o nível de bolha"
          style={({ pressed }) => [
            estilos.botao,
            pressed && estilos.pressionado,
            assinatura === null && estilos.desabilitado,
          ]}
        >
          <Text style={estilos.textoBotao}>Desligar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    padding: espaco.lg,
    gap: espaco.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.fundo,
  },
  titulo: tipografia.titulo,
  legenda: { ...tipografia.legenda, textAlign: 'center' },
  erro: { ...tipografia.legenda, color: cores.erro },
  area: {
    width: RAIO_AREA * 2,
    height: RAIO_AREA * 2,
    borderRadius: RAIO_AREA,
    borderWidth: 2,
    borderColor: cores.textoFraco,
    backgroundColor: cores.cartao,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mira: {
    width: RAIO_BOLHA * 2 + espaco.sm,
    height: RAIO_BOLHA * 2 + espaco.sm,
    borderRadius: RAIO_BOLHA + espaco.xs,
    borderWidth: 1,
    borderColor: cores.textoFraco,
  },
  bolha: {
    position: 'absolute',
    width: RAIO_BOLHA * 2,
    height: RAIO_BOLHA * 2,
    borderRadius: RAIO_BOLHA,
  },
  bolhaPlana: { backgroundColor: cores.sucesso },
  bolhaTorta: { backgroundColor: cores.primaria },
  leitura: { ...tipografia.corpo, fontVariant: ['tabular-nums'] },
  status: { ...tipografia.corpo, fontWeight: '700' },
  botoes: { flexDirection: 'row', gap: espaco.sm },
  botao: {
    backgroundColor: cores.primaria,
    paddingVertical: espaco.sm + espaco.xs,
    paddingHorizontal: espaco.lg,
    borderRadius: espaco.sm,
  },
  pressionado: { opacity: 0.7 },
  desabilitado: { opacity: 0.4 },
  textoBotao: { ...tipografia.corpo, color: cores.cartao, fontWeight: '700' },
});
