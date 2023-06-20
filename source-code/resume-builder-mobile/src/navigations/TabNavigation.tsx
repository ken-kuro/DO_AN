import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ITab, TabEnum} from '../types/common';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TabScreen from '../screens/TabScreen';

const TabNavigation = () => {
  const Tab = createBottomTabNavigator();
  const mainTabs: ITab[] = [
    {
      name: TabEnum.Home,
      href: 'https://resume-builder.hieuhm.com',
    },
    {
      name: TabEnum.Dashboard,
      href: 'https://resume-builder.hieuhm.com/dashboard',
    },
  ];
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string = '';
          switch (route.name) {
            case TabEnum.Home:
              iconName = 'home';
              break;
            case TabEnum.Dashboard:
              iconName = 'file';
              break;
            default:
              iconName = 'circle';
              break;
          }

          return (
            <FontAwesome5
              name={iconName}
              size={size}
              color={color}
              solid={focused}
              light={!focused}
            />
          );
        },
        tabBarActiveTintColor: '#00B14F',
        tabBarInactiveTintColor: '#2F4858',
      })}>
      {mainTabs.map((tab: ITab) => {
        return (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={TabScreen}
            initialParams={tab}
            options={{headerShown: false}}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default TabNavigation;
