import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import UserService from "../routers/UserService";
import ProfileUser from "../routers/ProfileUser";
import { useMyContextController } from "../store";
import LichSuGD from "../routers/LichSuGD";

const Tab = createMaterialBottomTabNavigator();

const Customer = ({ navigation }) => {
    const [controller] = useMyContextController();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#4e73df",
                tabBarInactiveTintColor: "#a0a0a0",
                tabBarStyle: {
                    backgroundColor: "#ffffff",
                    borderTopColor: "#e0e0e0",
                    paddingBottom: 5,
                    paddingTop: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                },
            }}
        >
            <Tab.Screen
                name="UserService"
                component={UserService}
                options={{
                    tabBarLabel: "Dịch vụ",
                    tabBarIcon: ({ color }) => (
                        <Icon name="toolbox-outline" color={color} size={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="LichSuGD"
                component={LichSuGD}
                options={{
                    tabBarLabel: "Lịch sử giao dịch",
                    tabBarIcon: ({ color }) => (
                        <Icon name="history" color={color} size={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="ProfileUser"
                component={ProfileUser}
                options={{
                    tabBarLabel: "Cá nhân",
                    tabBarIcon: ({ color }) => (
                        <Icon name="account-circle-outline" color={color} size={24} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default Customer;
