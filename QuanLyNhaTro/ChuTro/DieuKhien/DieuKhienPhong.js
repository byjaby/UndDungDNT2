import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController } from "../../TrungTam";
import DSPhong from "../ManHinh/DSPhong";
import ThemPhong from "../ManHinh/ThemPhong";
import ChiTietPhong from "../ManHinh/ChiTietPhong";
import SuaPhong from "../ManHinh/SuaPhong";

const Stack = createStackNavigator();

const DieuKhienPhong = () => {
    const [controller] = useMyContextController();
    const { userLogin } = controller;

    return (
        <Stack.Navigator initialRouteName="DSDV">
            <Stack.Screen
                name="DSPhong"
                component={DSPhong}
                options={({ navigation }) => ({
                    title: "PHÒNG CHO THUÊ",
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
                    }
                })}
            />

            <Stack.Screen
                name="ThemPhong"
                component={ThemPhong}
                options={({ navigation }) => ({
                    title: "THÊM PHÒNG MỚI",
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
                    }
                })}
            />

            <Stack.Screen
                name="ChiTietPhong"
                component={ChiTietPhong}
                options={({ navigation }) => ({
                    title: "CHI TIẾT PHÒNG",
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
                    }
                })}
            />

            <Stack.Screen
                name="SuaPhong"
                component={SuaPhong}
                options={({ navigation }) => ({
                    title: "SỬA THÔNG TIN PHÒNG",
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
                    }
                })}
            />
        </Stack.Navigator>
    );
};

export default DieuKhienPhong;
