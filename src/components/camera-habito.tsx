// Atividade 1 · Aula 5 — a câmera do registro.
//
// Vive num componente separado da tela de registro por um motivo prático: enquanto este
// componente NÃO está montado, a câmera do aparelho está desligada. Montar e desmontar
// por `useState` é o "liga/desliga" que temos antes da Aula 6.
//
// TODO 5.9: preencha o contrato de três tempos DESTE arquivo. Ele vale nota.
// CONTRATO DE TRÊS TEMPOS DESTE ARQUIVO:
// 1. PEDIR   → `useCameraPermissions()` devolve o estado e a função `pedirPermissao`,
//              chamada pelo botão da tela de convencimento. O pedido é do
//              usuário, nunca automático ao montar.
// 2. LER     → `camera.takePictureAsync({ quality: 0.7 })`, disparada pelo botão
//              "Tirar foto". Leitura PONTUAL: uma foto por toque.
// 3. PARAR   → desmontar este componente. Enquanto ele não está montado, a câmera do
//              aparelho está desligada — é por isso que ele é um componente separado e
//              não um trecho da tela de registro. Quem desmonta é o `cameraAberta` da
//              `TelaRegistrarHabito`, pelos botões "Fechar câmera" e "Tirar foto".
//              Não há `addListener` aqui, então não há `remove()` a chamar.
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { cores, espaco, tipografia } from '../theme';

export type CameraHabitoProps = {
  onCapturar: (fotoUri: string) => void;
  onCancelar: () => void;
};

export function CameraHabito({ onCapturar, onCancelar }: CameraHabitoProps) {
  const [permissao, pedirPermissao] = useCameraPermissions();
  const [camera, setCamera] = useState<CameraView | null>(null);
  const [lado, setLado] = useState<'back' | 'front'>('back');
  // Câmera ocupada por outro app acontece de verdade, e o usuário precisa saber por que
  // o toque não produziu foto nenhuma.
  const [erroCaptura, setErroCaptura] = useState<string | null>(null);
  const [capturando, setCapturando] = useState(false);

  async function tirarFoto() {
    // TODO 5.10: proteja contra a referência ainda null, tire a foto com qualidade 0.7
    //           e entregue o uri por `onCapturar`.
    //           Não peça base64 — a foto só vai ser EXIBIDA, e o uri basta.
    //           Pense também no que fazer se a captura falhar (câmera ocupada por outro
    //           app acontece de verdade): o usuário precisa saber.

    // No primeiro render a referência ainda é `null`. O TypeScript exige esta guarda.
    if (!camera) return;

    setErroCaptura(null);
    setCapturando(true);

    try {
      // Sem `base64`: a foto só vai ser EXIBIDA, e para isso o `uri` basta. `base64`
      // carregaria a imagem inteira como texto na memória, de graça.
      const foto = await camera.takePictureAsync({ quality: 0.7 });

      if (!foto) {
        setErroCaptura('A câmera não devolveu a foto. Tente de novo.');
        return;
      }

      onCapturar(foto.uri);
    } catch {
      setErroCaptura(
        'Não foi possível tirar a foto — a câmera pode estar em uso por outro app. Feche o outro app e tente de novo, ou salve o hábito sem foto.'
      );
    } finally {
      setCapturando(false);
    }
  }

  // TODO 5.11: PRIMEIRO estado — a resposta da permissão ainda não chegou.
  //           `null` não é "negado". Sem este caso, a tela de convencimento PISCA para
  //           quem já autorizou há semanas.
  // PRIMEIRO estado: a resposta da permissão ainda não chegou. `null` NÃO é "negado" —
  // sem este caso a tela de convencimento pisca para quem já autorizou há semanas.
  if (!permissao) {
    return <View style={estilos.tela} />;
  }

  // TODO 5.12: SEGUNDO estado — sabemos, e não temos.
  //           Devolva uma tela que EXPLIQUE por que o app precisa da câmera, com um
  //           Pressable que chama `pedirPermissao`.
  //           Atenção: são DOIS casos aqui, não um. Quando o diálogo do sistema não vai
  //           mais aparecer, o texto e o botão têm que mudar — o campo que responde isso
  //           é o mesmo que você usou no `localizacao.ts` (TODO 5.6).
  //           Ofereça também uma saída: dá para salvar o hábito sem foto.
  // SEGUNDO estado: sabemos, e não temos. São DOIS casos, não um — `canAskAgain` (o
  // mesmo campo usado no `localizacao.ts`) diz se o diálogo do sistema ainda aparece.
  if (!permissao.granted) {
    return (
      <View style={[estilos.tela, estilos.centro]}>
        <Text style={estilos.aviso}>
          Precisamos da câmera para você registrar a foto do seu progresso. A foto fica no
          cache deste app, no seu aparelho: não vai para a galeria nem para a internet.
        </Text>

        {permissao.canAskAgain ? (
          <Pressable
            onPress={pedirPermissao}
            accessibilityRole="button"
            accessibilityLabel="Permitir o acesso à câmera"
            style={({ pressed }) => [estilos.botao, pressed && estilos.botaoPressionado]}
          >
            <Text style={estilos.textoBotao}>Permitir câmera</Text>
          </Pressable>
        ) : (
          <Text style={estilos.aviso}>
            A permissão está bloqueada e o diálogo do sistema não vai mais aparecer. Abra
            Configurações {'>'} Habit Tracker {'>'} Câmera e autorize o acesso.
          </Text>
        )}

        {/* A saída: um hábito sem foto ainda é um hábito. */}
        <Pressable
          onPress={onCancelar}
          accessibilityRole="button"
          accessibilityLabel="Voltar e salvar o hábito sem foto"
          style={({ pressed }) => [estilos.botaoFantasma, pressed && estilos.botaoPressionado]}
        >
          <Text style={estilos.textoFantasma}>Salvar sem foto</Text>
        </Pressable>
      </View>
    );
  }

  // TODO 5.13: TERCEIRO estado — temos.
  // TERCEIRO estado: temos.
  return (
    <View style={estilos.tela}>
      {/* TODO 5.14: renderize o CameraView. Ele precisa de:
                    - a referência (use o callback ref com setCamera — `ref` aceita função)
                    - o estilo (que precisa dar ALTURA a ele, senão a tela fica preta)
                    - a prop de qual câmera usar */}
      {/* `ref` aceita uma função, e `setCamera` é uma função: o React a chama com o
          componente montado (e com `null` ao desmontar). A forma canônica seria `useRef`,
          que é Aula 6. O `flex: 1` de `estilos.camera` é o que dá ALTURA à câmera — sem
          ele a tela fica preta e a meia hora seguinte é perdida culpando a permissão. */}
      <CameraView ref={setCamera} style={estilos.camera} facing={lado} />

      <View style={estilos.painel}>
        {erroCaptura && <Text style={estilos.erro}>{erroCaptura}</Text>}

        <Pressable
          onPress={tirarFoto}
          disabled={capturando}
          accessibilityRole="button"
          accessibilityLabel="Tirar a foto do hábito"
          style={({ pressed }) => [
            estilos.botao,
            pressed && estilos.botaoPressionado,
            capturando && estilos.botaoDesabilitado,
          ]}
        >
          <Text style={estilos.textoBotao}>{capturando ? 'Tirando...' : 'Tirar foto'}</Text>
        </Pressable>

        <Pressable
          onPress={() => setLado((atual) => (atual === 'back' ? 'front' : 'back'))}
          accessibilityRole="button"
          accessibilityLabel="Alternar entre a câmera frontal e a traseira"
          style={({ pressed }) => [estilos.botaoFantasma, pressed && estilos.botaoPressionado]}
        >
          <Text style={estilos.textoFantasma}>Virar câmera</Text>
        </Pressable>

        <Pressable
          onPress={onCancelar}
          accessibilityRole="button"
          accessibilityLabel="Fechar a câmera"
          style={({ pressed }) => [estilos.botaoFantasma, pressed && estilos.botaoPressionado]}
        >
          <Text style={estilos.textoFantasma}>Fechar câmera</Text>
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#111' },
  centro: { alignItems: 'center', justifyContent: 'center', padding: espaco.lg, gap: espaco.md },
  camera: { flex: 1 },
  aviso: { ...tipografia.corpo, color: cores.cartao, textAlign: 'center' },
  erro: { ...tipografia.legenda, color: '#ff8a80', padding: espaco.sm, textAlign: 'center' },
  painel: { padding: espaco.md, gap: espaco.sm, backgroundColor: '#1b1b1b' },
  botao: {
    backgroundColor: cores.primaria,
    paddingVertical: espaco.sm + espaco.xs,
    borderRadius: espaco.sm,
    alignItems: 'center',
  },
  botaoFantasma: {
    borderWidth: 1,
    borderColor: cores.primaria,
    paddingVertical: espaco.sm + espaco.xs,
    borderRadius: espaco.sm,
    alignItems: 'center',
  },
  botaoPressionado: { opacity: 0.7 },
  botaoDesabilitado: { opacity: 0.5 },
  textoBotao: { ...tipografia.corpo, color: cores.cartao, fontWeight: '700' },
  textoFantasma: { ...tipografia.corpo, color: cores.primaria, fontWeight: '600' },
});
