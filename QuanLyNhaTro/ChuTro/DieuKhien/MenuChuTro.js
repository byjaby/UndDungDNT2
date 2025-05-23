import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useMyContextController } from "../../TrungTam";
import DieuKhienHoSo from "./DieuKhienHoSo";
import DieuKhienPhong from "./DieuKhienPhong";
import DieuKhienDV from "./DieuKhienDV";

const Tab = createMaterialBottomTabNavigator();

const MenuChuTro = () => {
    const [controller] = useMyContextController();

    return (
        <Tab.Navigator
            initialRouteName="DieuKhienPhong"
            activeColor="#F77F00"
            inactiveColor="#F7E1D7"
            shifting={true}
            barStyle={{
                backgroundColor: "#003049",
                borderTopWidth: 1,
                borderTopColor: "#003049",
                elevation: 10,
                height: 65,
            }}
            labeled={true}
        >
            <Tab.Screen
                name="DieuKhienPhong"
                component={DieuKhienPhong}
                options={{
                    tabBarLabel: "Quản lý phòng",
                    tabBarIcon: ({ color }) => (
                        <Icon name="bunk-bed" color={color} size={26} />
                    ),
                }}
            />

            <Tab.Screen
                name="DieuKhienDV"
                component={DieuKhienDV}
                options={{
                    tabBarLabel: "Quản lý dịch vụ",
                    tabBarIcon: ({ color }) => (
                        <Icon name="bunk-bed" color={color} size={26} />
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

export default MenuChuTro;
