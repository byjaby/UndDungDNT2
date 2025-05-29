import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useMyContextController } from "../../TrungTam";
import DieuKhienTrangChu from "./DieuKhienTrangChu";
import DieuKhienHoSo from "./DieuKhienHoSo";
import DieuKhienPhongTro from "./DieuKhienPhongTro";
import DieuKhienGiaoDich from "./DieuKhienGiaoDich";

const Tab = createMaterialBottomTabNavigator();

const MenuKhachThue = () => {
    const [controller] = useMyContextController();

    return (
        <Tab.Navigator
            initialRouteName="DieuKhienTrangChu"
            activeColor="#ffffff"
            inactiveColor="#a0a0a0"
            shifting={false}
            barStyle={{
                backgroundColor: "#2c3e50",
                borderTopWidth: 0,
                height: 70,
                elevation: 20,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: -4,
                },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                overflow: 'hidden',
                paddingBottom: 5,
                paddingTop: 8,
            }}
            labeled={true}
            sceneAnimationEnabled={true}
            sceneAnimationType="shifting"
        >
            <Tab.Screen
                name="DieuKhienTrangChu"
                component={DieuKhienTrangChu}
                options={{
                    tabBarLabel: "Trang chủ",
                    tabBarIcon: ({ color, focused }) => (
                        <Icon
                            name={focused ? "home" : "home-outline"}
                            color={focused ? "#3498db" : color}
                            size={focused ? 28 : 24}
                        />
                    ),
                    tabBarColor: "#34495e",
                    tabBarBadge: false,
                }}
            />

            <Tab.Screen
                name="DieuKhienPhongTro"
                component={DieuKhienPhongTro}
                options={{
                    tabBarLabel: "Trọ của tôi",
                    tabBarIcon: ({ color, focused }) => (
                        <Icon
                            name={focused ? "home-account" : "home-account"}
                            color={focused ? "#3498db" : color}
                            size={focused ? 28 : 24}
                        />
                    ),
                    tabBarColor: "#34495e",
                    tabBarBadge: false,
                }}
            />

            <Tab.Screen
                name="DieuKhienGiaoDich"
                component={DieuKhienGiaoDich}
                options={{
                    tabBarLabel: "Giao dịch",
                    tabBarIcon: ({ color, focused }) => (
                        <Icon
                            name={focused ? "file-document-edit" : "file-document-edit-outline"}
                            color={focused ? "#3498db" : color}
                            size={focused ? 28 : 24}
                        />
                    ),
                    tabBarColor: "#34495e",
                    tabBarBadge: false,
                }}
            />

            <Tab.Screen
                name="DieuKhienHoSo"
                component={DieuKhienHoSo}
                options={{
                    tabBarLabel: "Cá nhân",
                    tabBarIcon: ({ color, focused }) => (
                        <Icon
                            name={focused ? "account" : "account-outline"}
                            color={focused ? "#3498db" : color}
                            size={focused ? 28 : 24}
                        />
                    ),
                    tabBarColor: "#34495e",
                    tabBarBadge: false,
                }}
            />
        </Tab.Navigator>
    );
};

export default MenuKhachThue;