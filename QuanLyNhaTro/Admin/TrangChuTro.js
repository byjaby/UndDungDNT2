import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DieuKhienAdmin from "./DieuKhienAdmin";
import { useMyContextController } from "../TrungTam";

const Tab = createMaterialBottomTabNavigator();

const Admin = ({ navigation }) => {
    const [controller] = useMyContextController();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#4e73df", // màu active
                tabBarInactiveTintColor: "#a0a0a0", // màu inactive
                tabBarStyle: {
                    backgroundColor: "#ffffff", // nền trắng
                    borderTopColor: "#e0e0e0", // viền trên
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
                name="DieuKhienAdmin"
                component={DieuKhienAdmin}
                options={{
                    tabBarLabel: "Chủ trọ",
                    tabBarIcon: ({ color }) => (
                        <Icon name="home-outline" color={color} size={24} />
                    ),
                }}
            />
        </Tab.Navigator>

    );
};

export default Admin;
