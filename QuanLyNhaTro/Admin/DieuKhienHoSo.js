import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useMyContextController, dangXuat } from "../TrungTam";
import HoSo from "./HoSo";
import { useNavigation } from "@react-navigation/native";
import SuaThongTinAdmin from "./SuaThongTinAdmin";
import DoiMKAdmin from "./DoiMKAdmin";

const Stack = createStackNavigator();

const DieuKhienHoSo = () => {
    const [controller, dispatch] = useMyContextController();
    const navigation = useNavigation();

    const handleLogout = () => {
        dangXuat(dispatch, navigation);
    };

    const { userLogin } = controller;
    return (
        <Stack.Navigator
            initialRouteName="HoSo"

        >
            <Stack.Screen
                name="HoSo"
                component={HoSo}
                options={({ navigation }) => ({
                    title: "THÔNG TIN CÁ NHÂN",
                    headerTitleAlign: "center",
                    headerStyle: {
                        backgroundColor: "#FFD166",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        elevation: 8,
                        borderBottomWidth: 0,
                    },
                    headerTitleStyle: {
                        color: "#F8F9FA",
                        fontWeight: "bold",
                        fontSize: 22,
                        letterSpacing: 1,
                        fontFamily: "HelveticaNeue-Medium",
                        textShadowColor: 'rgba(0, 0, 0, 0.3)',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 2,
                    },
                    headerRight: () => (
                        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
                            <Icon name="logout" size={24} color="#fff" />
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen
                name="SuaThongTinAdmin"
                component={SuaThongTinAdmin}
                options={() => ({
                    title: "SỬA THÔNG TIN",
                    headerTitleAlign: "center",
                    headerStyle: {
                        backgroundColor: "#FFD166",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        elevation: 8,
                        borderBottomWidth: 0,
                    },
                    headerTitleStyle: {
                        color: "#F8F9FA",
                        fontWeight: "bold",
                        fontSize: 22,
                        letterSpacing: 1,
                        fontFamily: "HelveticaNeue-Medium",
                        textShadowColor: 'rgba(0, 0, 0, 0.3)',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 2,
                    },

                })}
            />

            <Stack.Screen
                name="DoiMKAdmin"
                component={DoiMKAdmin}
                options={() => ({
                    title: "🔐 ĐỔI MẬT KHẨU",
                    headerTitleAlign: "center",
                    headerStyle: {
                        backgroundColor: "#FFD166",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        elevation: 8,
                        borderBottomWidth: 0,
                    },
                    headerTitleStyle: {
                        color: "#F8F9FA",
                        fontWeight: "bold",
                        fontSize: 22,
                        letterSpacing: 1,
                        fontFamily: "HelveticaNeue-Medium",
                        textShadowColor: 'rgba(0, 0, 0, 0.3)',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 2,
                    },

                })}
            />

        </Stack.Navigator>
    );
};

export default DieuKhienHoSo;
