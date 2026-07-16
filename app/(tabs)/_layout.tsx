import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4F7CFF',
        tabBarInactiveTintColor: '#71809B',
        tabBarStyle: {
          backgroundColor: '#111D32',
          borderTopColor: '#1D2B43',
          height: 70,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
  name="add-lead"
  options={{
    title: 'Add Lead',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="person-add-outline" color={color} size={size} />
    ),
  }}
/>
<Tabs.Screen
  name="lead-management"
  options={{
    title: 'Leads',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="people-outline" color={color} size={size} />
    ),
  }}
/>
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
