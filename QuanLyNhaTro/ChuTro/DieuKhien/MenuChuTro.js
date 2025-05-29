import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useMyContextController } from "../../TrungTam";
import DieuKhienHoSo from "./DieuKhienHoSo";
import DieuKhienPhong from "./DieuKhienPhong";
import DieuKhienDV from "./DieuKhienDV";
import { IconButton } from "react-native-paper";
import DieuKhienTinhTien from "./DieuKhienTinhTien";
import DieuKhienThuePhong from "./DieuKhienThuePhong";

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
                    tabBarLabel: "Phòng",
                    tabBarIcon: ({ color }) => (
                        <Icon name="bunk-bed" color={color} size={26} />
                    ),
                }}
            />

            <Tab.Screen
                name="DieuKhienThuePhong"
                component={DieuKhienThuePhong}
                options={{
                    tabBarLabel: "Thuê phòng",
                    tabBarIcon: ({ color }) => (
                        <Icon name="account-plus" color={color} size={26} />
                    ),
                }}
            />

            <Tab.Screen
                name="DieuKhienDV"
                component={DieuKhienDV}
                options={{
                    tabBarLabel: "Dịch vụ",
                    tabBarIcon: ({ color }) => (
                        <Icon name="calendar-edit" color={color} size={26} />
                    ),
                }}
            />

            <Tab.Screen
                name="DieuKhienTinhTien"
                component={DieuKhienTinhTien}
                options={{
                    tabBarLabel: "Tính tiền",
                    tabBarIcon: ({ color }) => (
                        <Icon name="calculator" color={color} size={26} />
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
