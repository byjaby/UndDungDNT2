import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, Platform, Text } from "react-native";
import DieuKhienChuTro from "./DieuKhienChuTro";
import DieuKhienKhachThue from "./DieuKhienKhachThue";
import { useMyContextController } from "../../TrungTam";
import DieuKhienHoSo from "./DieuKhienHoSo";

const Tab = createMaterialBottomTabNavigator();

const MenuAdmin = () => {
    const [controller] = useMyContextController();

    const MinimalTab = ({ color, focused, iconName, label, accentColor }) => (
        <View style={styles.tabContainer}>
            <View style={[
                styles.iconWrapper,
                focused && { backgroundColor: accentColor }
            ]}>
                <Icon
                    name={iconName}
                    color={focused ? '#ffffff' : '#94a3b8'}
                    size={24}
                />
            </View>
            <Text style={[
                styles.tabLabel,
                { color: focused ? accentColor : '#64748b' }
            ]}>
                {label}
            </Text>
            {focused && <View style={[styles.activeBar, { backgroundColor: accentColor }]} />}
        </View>
    );

    return (
        <Tab.Navigator
            initialRouteName="DieuKhienChuTro"
            activeColor="#1e293b"
            inactiveColor="#64748b"
            shifting={false}
            barStyle={{
                backgroundColor: '#02111B',
                borderTopWidth: 1,
                borderTopColor: '#e2e8f0',
                elevation: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                height: Platform.OS === 'ios' ? 85 : 70,
                paddingBottom: Platform.OS === 'ios' ? 20 : 5,
                paddingTop: 10,
                paddingHorizontal: 15,
            }}
            labeled={false}
            sceneAnimationEnabled={true}
        >
            <Tab.Screen
                name="DieuKhienChuTro"
                component={DieuKhienChuTro}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <MinimalTab
                            color={color}
                            focused={focused}
                            iconName="office-building-marker"
                            label="Chủ trọ"
                            accentColor="#f59e0b"
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="DieuKhienKhachThue"
                component={DieuKhienKhachThue}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <MinimalTab
                            color={color}
                            focused={focused}
                            iconName="account-group"
                            label="Khách thuê"
                            accentColor="#06b6d4"
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="DieuKhienHoSo"
                component={DieuKhienHoSo}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <MinimalTab
                            color={color}
                            focused={focused}
                            iconName="card-account-details"
                            label="Hồ sơ"
                            accentColor="#8b5cf6"
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: 8,
        position: 'relative',
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
        backgroundColor: 'transparent',
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 2,
    },
    activeBar: {
        position: 'absolute',
        top: 0,
        width: 24,
        height: 3,
        borderRadius: 2,
    },
});

export default MenuAdmin;