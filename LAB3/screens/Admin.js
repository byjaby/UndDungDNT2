import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RouterService from "../routers/RouterService";
import Transaction from "./Transaction";
import Customers from "./Customers";
import Setting from "./Setting";
import { useMyContextController } from "../store";
import CustomersStack from "../routers/CustomersStack";
import TransactionRouter from "../routers/TransactionRouter";

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
                name="RouterService"
                component={RouterService}
                options={{
                    tabBarLabel: "Trang chủ",
                    tabBarIcon: ({ color }) => (
                        <Icon name="home-outline" color={color} size={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="TransactionRouter"
                component={TransactionRouter}
                options={{
                    tabBarLabel: "Giao dịch dịch vụ",
                    tabBarIcon: ({ color }) => (
                        <Icon name="cash-multiple" color={color} size={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="Customers"
                component={CustomersStack}
                options={{
                    tabBarLabel: "Khách hàng",
                    tabBarIcon: ({ color }) => (
                        <Icon name="account-group-outline" color={color} size={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="Setting"
                component={Setting}
                options={{
                    tabBarLabel: "Cài đặt",
                    tabBarIcon: ({ color }) => (
                        <Icon name="cog-outline" color={color} size={24} />
                    ),
                }}
            />
        </Tab.Navigator>

    );
};

export default Admin;
