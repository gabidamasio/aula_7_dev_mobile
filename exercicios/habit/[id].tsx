// Exercício 1 — RESOLUÇÃO: Rota dinâmica para abrir detalhe do hábito
// Nível ⭐
// No sandbox: src/app/habit/[id].tsx

import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HabitDetail() {
  const router = useRouter();
  // 1. Ler parâmetro 'id'
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Detalhes do hábito</Text>
      {/* 2. Mostrar ID */}
      <Text style={styles.id}>Hábito ID: {id}</Text>

      <Pressable onPress={() => router.back()} style={styles.botao}>
        <Text style={styles.textoBotao}>Voltar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 24 },
  titulo: { fontSize: 20, fontWeight: '700' },
  id: { fontSize: 18, color: '#007AFF', fontWeight: '600' },
  botao: { marginTop: 16, backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  textoBotao: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
