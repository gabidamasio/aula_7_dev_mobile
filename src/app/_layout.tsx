
import { useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

// Define como as notificações serão exibidas com o app aberto.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Listener: notificação recebida.
    const recebida = Notifications.addNotificationReceivedListener(() => {
      console.log('Notificação recebida');
    });

    // Listener: usuário tocou na notificação.
    const tocada = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notificação tocada');

        const habitId =
          response.notification.request.content.data?.habitId;

        if (typeof habitId === 'string') {
          router.push({
            pathname: '/habit/[id]',
            params: { id: habitId },
          });
        }
      }
    );

    return () => {
      recebida.remove();
      tocada.remove();
    };
  }, [router]);

  return (
    <Drawer
      screenOptions={{
        headerTintColor: '#f26522',
        drawerActiveTintColor: '#f26522',
        drawerLabelStyle: {
          fontSize: 15,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'Home',
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons
              name="home"
              color={typeof color === 'string' ? color : '#888888'}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="about"
        options={{
          title: 'Sobre',
          drawerLabel: 'Sobre',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons
              name="info"
              color={typeof color === 'string' ? color : '#888888'}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="settings"
        options={{
          title: 'Configurações',
          drawerLabel: 'Configurações',
          drawerIcon: ({ color, size }) => (
            <MaterialIcons
              name="settings"
              color={typeof color === 'string' ? color : '#888888'}
              size={size}
            />
          ),
        }}
      />

      {/* Rotas auxiliares fora do menu principal */}
      <Drawer.Screen
        name="sobre"
        options={{ drawerItemStyle: { display: 'none' } }}
      />

      <Drawer.Screen
        name="registrar-foto"
        options={{ drawerItemStyle: { display: 'none' } }}
      />

      <Drawer.Screen
        name="galeria"
        options={{ drawerItemStyle: { display: 'none' } }}
      />

      <Drawer.Screen
        name="habit/[id]"
        options={{ drawerItemStyle: { display: 'none' } }}
      />
    </Drawer>
  );
}
