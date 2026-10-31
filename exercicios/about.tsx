// Exercício 3 — RESOLUÇÃO: Tela Sobre do Drawer
// No sandbox: src/app/about.tsx

import { StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Sobre o App</Text>
      <Text style={styles.texto}>Rastreador de Hábitos — Aula 7 (Drawer, Tabs e Notificações).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, padding: 24 },
  titulo: { fontSize: 20, fontWeight: '700' },
  texto: { fontSize: 16, color: '#555', textAlign: 'center' },
});
