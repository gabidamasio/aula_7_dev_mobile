
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CardHabito } from './CardHabito';
import { cores, espaco } from '../theme';
import type { Habito } from '../types/habito';

export type ItemHabitoProps = {
  habito: Habito;
  onAlternar: (id: string) => void;
  onRemover: (id: string) => void;
};

export function ItemHabito({
  habito,
  onAlternar,
  onRemover,
}: ItemHabitoProps) {
  const router = useRouter();

  const concluido = habito.status === 'concluido';

  return (
    <View style={styles.item}>
      <CardHabito
        titulo={habito.titulo}
        categoria={habito.categoria}
        status={habito.status}
        destacado={habito.destacado}
        fotoUri={habito.fotoUri}
        local={habito.local}
        recyclingKey={habito.id}
        onPress={() => router.push(`/habit/${habito.id}`)}
        onLongPress={() => onRemover(habito.id)}
      />

      <Pressable
        onPress={() => onAlternar(habito.id)}
        style={styles.botaoStatus}
        accessibilityRole="button"
      >
        <Text style={styles.textoStatus}>
          {concluido ? 'Reabrir hábito' : 'Concluir hábito'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    gap: espaco.xs,
  },
  botaoStatus: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: cores.fundo,
    borderRadius: espaco.sm,
  },
  textoStatus: {
    color: cores.primaria,
    fontWeight: '700',
  },
});