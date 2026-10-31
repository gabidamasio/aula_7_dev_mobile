// Exercício 4 — RESOLUÇÃO: Notificações locais (agendar e receber)
// Nível ⭐⭐⭐
// No sandbox: src/app/notificacoes.tsx

import { requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
} from 'expo-notifications/build/NotificationsEmitter';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Configurar handler para exibir em foreground
setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function NotificationScreen() {
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    // 1. Pedir permissão
    async function requestPermission() {
      const { status } = await requestPermissionsAsync();
      setPermissionGranted(status === 'granted');
    }

    requestPermission();

    // 2. Registrar listeners
    const receivedListener = addNotificationReceivedListener((notification) => {
      console.log('Notificação recebida', notification);
    });

    const responseListener = addNotificationResponseReceivedListener((response) => {
      console.log('Notificação tocada', response);
    });

    return () => {
      receivedListener.remove();
      responseListener.remove();
    };
  }, []);

  const handleSchedule = async () => {
    if (!permissionGranted) {
      console.log('Permissão não concedida');
      return;
    }

    // 3. Agendar notificação para daqui a 5 segundos
    await scheduleNotificationAsync({
      content: {
        title: 'Hora do hábito!',
        body: 'Não esqueça de sua rotina.',
        data: { habitId: '5' },
        sound: 'default',
        badge: 1,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleSchedule} style={styles.botao}>
        <Text style={styles.textoBotao}>Agendar notificação em 5s</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  botao: { backgroundColor: '#f26522', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10 },
  textoBotao: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
