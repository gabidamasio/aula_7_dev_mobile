
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import type { Habito } from '../types/habito';
import { corDoStatus, rotuloDoStatus } from '../utils/status-habito';
import { formatarLocal } from '../lib/formatar-local';
import { cores, espaco, tipografia } from '../theme';

export type CardHabitoProps = Pick<Habito, 'titulo' | 'categoria' | 'status'> & {
  onPress: () => void;
  onLongPress?: () => void;
  destacado?: boolean;
  fotoUri?: Habito['fotoUri'];
  local?: Habito['local'];
  recyclingKey?: string;
};

export function CardHabito({
  titulo,
  categoria,
  status,
  onPress,
  onLongPress,
  destacado = false,
  fotoUri,
  local,
  recyclingKey,
}: CardHabitoProps) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.card, destacado && styles.destaque]}
    >
      {fotoUri ? (
        <Image
          source={{ uri: fotoUri }}
          style={styles.miniatura}
          contentFit="cover"
          transition={200}
          recyclingKey={recyclingKey}
          accessibilityLabel={`Foto do hábito ${titulo}`}
        />
      ) : (
        <View style={[styles.miniatura, styles.miniaturaVazia]} />
      )}

      <View style={styles.corpo}>
        <Text style={tipografia.titulo} numberOfLines={2}>
          {titulo}
        </Text>

        <Text style={[styles.meta, { color: corDoStatus(status) }]}>
          {categoria} · {rotuloDoStatus(status)}
        </Text>

        {local && (
          <Text style={styles.local} numberOfLines={1}>
            {formatarLocal(local)}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.cartao,
    borderRadius: espaco.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: cores.textoFraco,
    padding: espaco.md,
    gap: espaco.sm,
  },
  destaque: {
    borderColor: cores.primaria,
    borderWidth: 2,
  },
  miniatura: {
    width: 64,
    height: 64,
    borderRadius: espaco.sm,
    backgroundColor: cores.fundo,
  },
  miniaturaVazia: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: cores.textoFraco,
    borderStyle: 'dashed',
  },
  corpo: {
    flex: 1,
    gap: espaco.xs,
  },
  meta: {
    fontSize: tipografia.legenda.fontSize,
    textTransform: 'capitalize',
  },
  local: tipografia.legenda,
});
