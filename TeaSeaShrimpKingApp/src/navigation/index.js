import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MarketScreen from '../screens/MarketScreen';
import AssetsScreen from '../screens/AssetsScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AIAnalysisScreen from '../screens/AIAnalysisScreen';
import AssetDetailScreen from '../screens/AssetDetailScreen';
import KlineChartScreen from '../screens/KlineChartScreen';
import OrderbookScreen from '../screens/OrderbookScreen';
import TradeHistoryScreen from '../screens/TradeHistoryScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import AnalysisDetailScreen from '../screens/AnalysisDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 主标签导航
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Market') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Assets') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Transactions') {
            iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
          } else if (route.name === 'AI') {
            iconName = focused ? 'bulb' : 'bulb-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: '首页' }}
      />
      <Tab.Screen 
        name="Market" 
        component={MarketScreen}
        options={{ title: '市场' }}
      />
      <Tab.Screen 
        name="Assets" 
        component={AssetsScreen}
        options={{ title: '资产' }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionsScreen}
        options={{ title: '交易' }}
      />
      <Tab.Screen 
        name="AI" 
        component={AIAnalysisScreen}
        options={{ title: 'AI分析' }}
      />
    </Tab.Navigator>
  );
};

// 主导航
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#667eea',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main" 
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="AssetDetail" 
          component={AssetDetailScreen}
          options={{ title: '资产详情' }}
        />
        <Stack.Screen 
          name="KlineChart" 
          component={KlineChartScreen}
          options={{ title: 'K线图' }}
        />
        <Stack.Screen 
          name="Orderbook" 
          component={OrderbookScreen}
          options={{ title: '订单簿' }}
        />
        <Stack.Screen 
          name="TradeHistory" 
          component={TradeHistoryScreen}
          options={{ title: '交易历史' }}
        />
        <Stack.Screen 
          name="TransactionDetail" 
          component={TransactionDetailScreen}
          options={{ title: '交易详情' }}
        />
        <Stack.Screen 
          name="AnalysisDetail" 
          component={AnalysisDetailScreen}
          options={{ title: '分析详情' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;