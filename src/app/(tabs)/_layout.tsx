
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#888888',
        headerTintColor: '#f26522',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Feather
              name="home"
              color={typeof color === 'string' ? color : '#888888'}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          title: 'Estatísticas',
          tabBarLabel: 'Estatísticas',
          tabBarIcon: ({ color, size }) => (
            <Feather
              name="bar-chart-2"
              color={typeof color === 'string' ? color : '#888888'}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}