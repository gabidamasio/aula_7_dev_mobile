// Atividade 1 · Aula 5 — a tela "Registrar hábito".
//
// Até a Aula 4 todo dado nascia do teclado. Aqui o app passa a saber ONDE o treino
// aconteceu e COM O QUE ele se parecia, sem ninguém digitar nada.
//
// TODO 5.15: preencha o contrato de três tempos DESTA tela. Ele vale nota.
// CONTRATO DE TRÊS TEMPOS DESTA TELA:
// 1. PEDIR   → nada é pedido ao montar. O GPS é pedido dentro de `obterLocalAtual()`
//              (`services/localizacao.ts`), no toque de "Usar minha localização"; a
//              câmera é pedida pelo `<CameraHabito>`, que só existe depois do toque em
//              "Tirar foto".
// 2. LER     → uma leitura pontual de posição por toque, e uma foto por toque. Nenhuma
//              das duas roda sozinha, e nenhuma delas bloqueia o salvamento.
// 3. PARAR   → não se aplica a esta tela, porque ela não abre assinatura nenhuma: não há
//              `watchPositionAsync` nem `addListener` aqui. O único recurso contínuo é a
//              câmera, e ela para quando `cameraAberta` volta a false e o
//              `<CameraHabito>` é desmontado.
//
// RESTRIÇÕES DA ENTREGA (é aqui que a nota se decide):
//   - Sem `useEffect`, `useRef` ou qualquer hook do React além do `useState`. Os hooks de
//     permissão das bibliotecas (`useCameraPermissions`) são permitidos — são delas.
//   - Sem navegação. A tela aparece por condicional com `useState`, como no Exercício 5.
//   - Sem mapa. A coordenada é TEXTO.
//   - Sem salvar na galeria e sem escolher foto do rolo.
//   - Sem rede. Nada de enviar a foto para lugar nenhum.
//   - Um hábito sem foto e sem local AINDA É UM HÁBITO. Se negar tudo quebrar a tela,
//     a entrega perde os 15% de "degradação graciosa".
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Image } from 'expo-image';

import { BotaoAcao } from '../components/botao-acao';
import { CameraHabito } from '../components/camera-habito';
import { formatarLocal } from '../lib/formatar-local';
import { MENSAGENS_FALHA_LOCAL, obterLocalAtual, type FalhaLocal } from '../services/localizacao';
import { cores, espaco, tipografia } from '../theme';
import type { CategoriaHabito, Habito, LocalHabito } from '../types/habito';

export type TelaRegistrarHabitoProps = {
  onSalvar: (habito: Habito) => void;
  onCancelar: () => void;
};

const CATEGORIAS: CategoriaHabito[] = ['saude', 'produtividade', 'mentalidade', 'sono'];

export function TelaRegistrarHabito({ onSalvar, onCancelar }: TelaRegistrarHabitoProps) {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState<CategoriaHabito>('saude');

  const [local, setLocal] = useState<LocalHabito | null>(null);
  const [falhaLocal, setFalhaLocal] = useState<FalhaLocal | null>(null);
  const [buscandoLocal, setBuscandoLocal] = useState(false);

  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [cameraAberta, setCameraAberta] = useState(false);

  async function registrarLocal() {
    // TODO 5.16: chame `obterLocalAtual()` e trate os DOIS ramos do resultado.
    //           Ligue e desligue `buscandoLocal` em volta da chamada, senão o botão
    //           fica mudo enquanto o GPS busca o sinal — e buscar sinal demora.
    //           Limpe a falha anterior ANTES de tentar de novo.

    // Limpar a falha ANTES de tentar de novo: senão a mensagem velha fica na tela
    // enquanto a nova tentativa está em curso, e o usuário lê um erro que já passou.
    setFalhaLocal(null);
    setBuscandoLocal(true);

    const resultado = await obterLocalAtual();

    if (resultado.ok) {
      setLocal(resultado.local);
    } else {
      // O local anterior não vale mais depois de uma falha: melhor nada do que um ponto
      // de outro treino colado neste.
      setLocal(null);
      setFalhaLocal(resultado.falha);
    }

    // Fora do if/else: o botão precisa voltar ao normal nos dois caminhos.
    setBuscandoLocal(false);
  }

  function salvar() {
    // TODO 5.17: monte o Habito novo e entregue por `onSalvar`.
    //           - id: pense em como gerar um que não colida (o `length` do array foi o
    //             problema de `keyExtractor` da Aula 4);
    //           - `local` e `fotoUri` só entram no objeto QUANDO EXISTEM — é isso que faz
    //             o app continuar funcionando para quem negou as duas permissões;
    //           - título vazio não deveria virar hábito.

    const tituloLimpo = titulo.trim();
    // Título vazio não vira hábito. O botão já está desabilitado, mas a regra mora aqui.
    if (tituloLimpo.length === 0) return;

    const habito: Habito = {
      // `String(array.length)` foi o problema de `keyExtractor` da Aula 4: remova um item
      // e o próximo id colide com um que já existe. O relógio mais um sufixo aleatório
      // não repete nem em dois toques no mesmo milissegundo.
      id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      titulo: tituloLimpo,
      categoria,
      frequencia: 'diaria',
      status: 'pendente',
      streakDias: 0,
      criadoEm: new Date().toISOString(),
      // `local` e `fotoUri` só entram no objeto QUANDO EXISTEM. É este espalhamento
      // condicional que faz o app continuar funcionando para quem negou as duas
      // permissões: o campo fica ausente, não fica `null` fingindo ser um dado.
      ...(local ? { local } : {}),
      ...(fotoUri ? { fotoUri } : {}),
    };

    onSalvar(habito);
  }

  // TODO 5.18: quando `cameraAberta` for true, devolva o <CameraHabito /> ocupando a tela
  //           inteira, em vez do formulário. Ele precisa de duas funções:
  //           - o que fazer com o uri capturado (guardar e fechar a câmera);
  //           - o que fazer no cancelamento (só fechar).
  //           Enquanto o <CameraHabito> NÃO está montado, a câmera está desligada — é
  //           esse o liga/desliga que temos antes da Aula 7.

  // Enquanto o <CameraHabito> NÃO está montado, a câmera do aparelho está desligada — é
  // esse o liga/desliga que temos antes da Aula 7.
  if (cameraAberta) {
    return (
      <CameraHabito
        onCapturar={(uri) => {
          setFotoUri(uri);
          setCameraAberta(false);
        }}
        onCancelar={() => setCameraAberta(false)}
      />
    );
  }

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <Text style={estilos.titulo}>Registrar hábito</Text>

      <TextInput
        style={estilos.campo}
        placeholder="O que você fez? (ex.: Treino de perna)"
        value={titulo}
        onChangeText={setTitulo}
        accessibilityLabel="Título do hábito"
      />

      <View style={estilos.grupoCategorias}>
        {CATEGORIAS.map((opcao) => (
          <Pressable
            key={opcao}
            onPress={() => setCategoria(opcao)}
            accessibilityRole="radio"
            accessibilityState={{ selected: categoria === opcao }}
            accessibilityLabel={`Categoria ${opcao}`}
            style={({ pressed }) => [
              estilos.chip,
              categoria === opcao && estilos.chipAtivo,
              pressed && estilos.pressionado,
            ]}
          >
            <Text style={[estilos.chipTexto, categoria === opcao && estilos.chipTextoAtivo]}>
              {opcao}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* ---------- Localização ---------- */}
      <View style={estilos.bloco}>
        <Text style={estilos.rotuloBloco}>Onde foi</Text>

        <BotaoAcao
          rotulo={buscandoLocal ? 'Buscando localização...' : 'Usar minha localização'}
          onPressionar={registrarLocal}
          desabilitado={buscandoLocal}
        />

        {/* TODO 5.19: mostre TRÊS coisas diferentes aqui, cada uma no seu caso:
                      - quando houver `local`: o texto legível (use `formatarLocal`);
                      - quando houver `falhaLocal`: a mensagem daquela falha específica,
                        com `estilos.erro` — e são QUATRO mensagens possíveis, não uma;
                      - quando não houver nem um nem outro: avise que é opcional, para o
                        usuário não achar que precisa autorizar para seguir. */}

        {/* Três casos, três textos. A mensagem de falha vem do `Record` fechado do
            serviço, então são QUATRO textos possíveis aqui — um por ação do usuário. */}
        {local && <Text style={estilos.info}>{formatarLocal(local)}</Text>}

        {falhaLocal && <Text style={estilos.erro}>{MENSAGENS_FALHA_LOCAL[falhaLocal]}</Text>}

        {!local && !falhaLocal && (
          <Text style={estilos.legenda}>
            Opcional. Sem localização o hábito é salvo do mesmo jeito — só não vai dizer
            onde foi.
          </Text>
        )}
      </View>

      {/* ---------- Foto ---------- */}
      <View style={estilos.bloco}>
        <Text style={estilos.rotuloBloco}>Como foi</Text>

        <BotaoAcao
          rotulo={fotoUri ? 'Tirar outra foto' : 'Tirar foto'}
          onPressionar={() => setCameraAberta(true)}
        />

        {/* TODO 5.20: quando houver `fotoUri`, exiba a prévia com o <Image> do expo-image
                      (`estilos.previa`), com `contentFit` explícito e uma transição.
                      Sem foto, diga ao usuário que é opcional E onde a foto vai parar —
                      "fica no cache do app, não vai para a galeria nem para a internet"
                      é informação que ele tem o direito de ter antes de tirar. */}

        {fotoUri ? (
          <Image
            source={{ uri: fotoUri }}
            style={estilos.previa}
            contentFit="cover"
            transition={200}
            accessibilityLabel="Prévia da foto do hábito"
          />
        ) : (
          <Text style={estilos.legenda}>
            Opcional. A foto fica no cache deste app, no seu aparelho: não vai para a
            galeria nem para a internet.
          </Text>
        )}
      </View>

      <View style={estilos.rodape}>
        <BotaoAcao
          rotulo="Salvar hábito"
          onPressionar={salvar}
          desabilitado={titulo.trim().length === 0}
        />
        <BotaoAcao rotulo="Cancelar" onPressionar={onCancelar} />
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.md, gap: espaco.md, paddingBottom: espaco.lg * 2 },
  titulo: tipografia.titulo,
  campo: {
    borderWidth: 1,
    borderColor: cores.textoFraco,
    borderRadius: espaco.sm,
    padding: espaco.sm,
    backgroundColor: cores.cartao,
    fontSize: 16,
  },
  grupoCategorias: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  chip: {
    paddingVertical: espaco.xs,
    paddingHorizontal: espaco.sm + espaco.xs,
    borderRadius: espaco.lg,
    borderWidth: 1,
    borderColor: cores.textoFraco,
    backgroundColor: cores.cartao,
  },
  chipAtivo: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  chipTexto: { ...tipografia.legenda, color: cores.texto, textTransform: 'capitalize' },
  chipTextoAtivo: { color: cores.cartao, fontWeight: '700' },
  pressionado: { opacity: 0.8 },
  bloco: {
    backgroundColor: cores.cartao,
    borderRadius: espaco.sm,
    padding: espaco.md,
    gap: espaco.sm,
  },
  rotuloBloco: { ...tipografia.corpo, fontWeight: '700' },
  info: tipografia.corpo,
  legenda: tipografia.legenda,
  erro: { ...tipografia.legenda, color: cores.erro },
  previa: {
    width: '100%',
    height: 200,
    borderRadius: espaco.sm,
    backgroundColor: cores.fundo,
  },
  rodape: { gap: espaco.sm },
});
