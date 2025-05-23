import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController } from "../../TrungTam";
import DSDV from "../ManHinh/DSDV";
import ThemDV from "../ManHinh/ThemDV";
import ChiTietDV from "../ManHinh/ChiTietDV";
import SuaDV from "../ManHinh/SuaDV";

const Stack = createStackNavigator();

const DieuKhienDV = () => {
    const [controller] = useMyContextController();
    const { userLogin } = controller;

    return (
        <Stack.Navigator initialRouteName="DSDV">
            <Stack.Screen
                name="DSDV"
                component={DSDV}
                options={({ navigation }) => ({
                    title: "DỊCH VỤ",
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
                name="ThemDV"
                component={ThemDV}
                options={({ navigation }) => ({
                    title: "THÊM DỊCH VỤ",
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
                name="ChiTietDV"
                component={ChiTietDV}
                options={({ navigation }) => ({
                    title: "CHI TIẾT DỊCH VỤ",
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
                name="SuaDV"
                component={SuaDV}
                options={({ navigation }) => ({
                    title: "CHỈNH SỬA DỊCH VỤ",
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

export default DieuKhienDV;
