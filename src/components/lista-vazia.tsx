import { StyleSheet, Text, View } from 'react-native';

import { cores, espaco, tipografia } from '../theme';
import { BotaoAcao } from './botao-acao';

type ListaVaziaProps = {
  primeiroAcesso: boolean;
  termo?: string;
  onLimparBusca: () => void;
};

export function ListaVazia(props: ListaVaziaProps) {
  if (props.primeiroAcesso) { 
    return (
      <View style={styles.vazio}>
        <Text style={styles.titulo}>Nenhum hábito cadastrado</Text>
        <Text style={styles.apoio}>Toque em “Novo hábito” para começar.</Text>
      </View>
    );
  }

  return (
    <View style={styles.vazio}>
      <Text style={styles.titulo}>Nenhum hábito encontrado</Text>
      <Text style={styles.apoio}>Limpe o campo de busca para ver todos os hábitos.</Text>
      <BotaoAcao
        rotulo="Limpar busca"
        onPressionar={props.onLimparBusca}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  vazio: { alignItems: 'center', gap: espaco.xs, paddingVertical: espaco.lg * 2 },
  titulo: { ...tipografia.corpo, fontWeight: '600', color: cores.texto },
  apoio: { ...tipografia.legenda, textAlign: 'center' },
});
