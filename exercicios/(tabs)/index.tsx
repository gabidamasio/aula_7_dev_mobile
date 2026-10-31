// Exercício 1 e 2 — RESOLUÇÃO: Tela Home das Tabs com navegação para rota dinâmica
// No sandbox: src/app/(tabs)/index.tsx

import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeTab() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meus Hábitos (Sandbox Aula 7)</Text>

      <Pressable
        style={styles.botao}
        onPress={() =>
          router.push({
            pathname: '/habit/[id]',
            params: { id: '5' },
          })
        }
      >
        <Text style={styles.textoBotao}>Abrir hábito 5</Text>
      </Pressable>

      <Pressable
        style={[styles.botao, styles.botaoSecundario]}
        onPress={() => router.push('/notificacoes')}
      >
        <Text style={styles.textoBotao}>Ex 4: Testar Notificações</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, padding: 24 },
  titulo: { fontSize: 20, fontWeight: '700' },
  botao: { backgroundColor: '#007AFF', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10 },
  botaoSecundario: { backgroundColor: '#f26522' },
  textoBotao: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
