import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, News, Destinations, DestinationDetails, NewsDetails, Profile, FormAddData,} from '../screens';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, fontType } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AnimatedTabIcon = ({ name, color, focused }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.3 : 1,
      useNativeDriver: true,
      speed: 15,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Icon name={name} size={24} color={color} />
    </Animated.View>
  );
};

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.greenDark(),
        tabBarInactiveTintColor: colors.grey(),
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: fontType['Poppins-Medium'],
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 60,
          borderTopWidth: 0.3,
          borderTopColor: colors.grey(0.3),
          elevation: 5,
        },
        tabBarIcon: ({ color, focused }) => {
          const iconMap = {
            Home: 'home',
            Destinations: 'location-on',
            News: 'article',
            Profile: 'person',
          };
          return (
            <AnimatedTabIcon
              name={iconMap[route.name]}
              color={color}
              focused={focused}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Destinations" component={Destinations} />
      <Tab.Screen name="News" component={News} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const Router = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen name="MainApp" component={BottomTabs} />
      <Stack.Screen name="DestinationDetails" component={DestinationDetails} />
      <Stack.Screen name="NewsDetails" component={NewsDetails} />
      <Stack.Screen name="FormAddData" component={FormAddData} />
    </Stack.Navigator>
  );
};

export default Router;
