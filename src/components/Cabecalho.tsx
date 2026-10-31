import { StyleSheet, Text, View } from 'react-native';

type CabecalhoProps = {
  total: number;
  concluidos: number;
};

export function Cabecalho({ total, concluidos }: CabecalhoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Hábitos de hoje</Text>
      <View style={styles.linha}>
        <Text style={styles.meta}>Total: {total}</Text>
        <Text style={styles.meta}>Concluídos: {concluidos}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  titulo: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    fontSize: 14,
    color: '#616161',
  },
});
