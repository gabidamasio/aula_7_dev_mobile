// Exercício 2 — RESOLUÇÃO: Aba de Estatísticas (Stats)
// No sandbox: src/app/(tabs)/stats.tsx

import { StyleSheet, Text, View } from 'react-native';

export default function StatsTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Estatísticas</Text>
      <Text style={styles.texto}>Acompanhe o progresso dos seus hábitos aqui.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, padding: 24 },
  titulo: { fontSize: 20, fontWeight: '700' },
  texto: { fontSize: 16, color: '#555' },
});
