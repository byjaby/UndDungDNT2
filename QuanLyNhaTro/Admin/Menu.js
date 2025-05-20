import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DieuKhienChuTro from "./DieuKhienChuTro";
import DieuKhienKhachThue from "./DieuKhienKhachThue";
import { useMyContextController } from "../TrungTam";
import DieuKhienHoSo from "./DieuKhienHoSo";

const Tab = createMaterialBottomTabNavigator();

const Menu = () => {
    const [controller] = useMyContextController();

    return (
        <Tab.Navigator
            initialRouteName="DieuKhienChuTro"
            activeColor="#000814"
            inactiveColor="#F2E8CF"
            shifting={true} // Tab có hiệu ứng chuyển động mượt
            barStyle={{
                backgroundColor: "#EF476F",
                borderTopWidth: 1,
                borderTopColor: "#BC4749",
                elevation: 10,
                height: 65,
            }}
            labeled={true}
        >
            <Tab.Screen
                name="DieuKhienChuTro"
                component={DieuKhienChuTro}
                options={{
                    tabBarLabel: "Chủ trọ",
                    tabBarIcon: ({ color }) => (
                        <Icon name="human-male-board" color={color} size={26} />
                    ),
                }}
            />

            <Tab.Screen
                name="DieuKhienKhachThue"
                component={DieuKhienKhachThue}
                options={{
                    tabBarLabel: "Khách thuê",
                    tabBarIcon: ({ color }) => (
                        <Icon name="account-group-outline" color={color} size={26} />
                    ),
                }}
            />

            <Tab.Screen
                name="DieuKhienHoSo"
                component={DieuKhienHoSo}
                options={{
                    tabBarLabel: "Hồ sơ",
                    tabBarIcon: ({ color }) => (
                        <Icon name="account" color={color} size={26} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default Menu;
