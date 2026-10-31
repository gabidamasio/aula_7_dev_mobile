// Atividade 1 · Aula 4 — o botão de ação reutilizável.
//
// Substitui todo `<Button>` e todo `<Text onPress>` que sobrou da Aula 3.
// Precisa ser usado em PELO MENOS DOIS lugares da tela para valer a entrega.
import { Pressable, StyleSheet, Text } from 'react-native';

import { cores, espaco } from '../theme';

export type BotaoAcaoProps = {
  rotulo: string;
  onPressionar: () => void;
  desabilitado?: boolean;
};

export function BotaoAcao({ rotulo, onPressionar, desabilitado = false }: BotaoAcaoProps) {
  // Sem hex solto aqui: as cores vêm de `../theme`. A ação vai em `onPress` (nunca em
  // `onPressIn`), e `style` é função de `{ pressed }`.
  return (
    <Pressable
      style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
      onPress={onPressionar}
      disabled={desabilitado}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      hitSlop={{ top: espaco.md, bottom: espaco.md, left: espaco.md, right: espaco.md }}
      android_ripple={{ color: 'rgba(255,255,255,0.2)', foreground: true }}
    >
      <Text style={styles.rotulo}>{rotulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    paddingVertical: espaco.sm + espaco.xs,
    paddingHorizontal: espaco.md,
    borderRadius: espaco.lg,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    marginVertical: espaco.xs,  
  },
  botaoPressionado: {
    opacity: 0.8,
  },
  botaoDesabilitado: {
    opacity: 0.5,
  },
  rotulo: { color: cores.cartao, fontSize: 16, fontWeight: '600' },
});
