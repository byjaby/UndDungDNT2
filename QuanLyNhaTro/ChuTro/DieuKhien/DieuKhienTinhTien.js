import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController } from "../../TrungTam";
import DSTinhTien from "../ManHinh/DSTinhTien";

const Stack = createStackNavigator();

const DieuKhienTinhTien = () => {
    const [controller] = useMyContextController();
    const { userLogin } = controller;

    return (
        <Stack.Navigator initialRouteName="DSDV">
            <Stack.Screen
                name="DSTinhTien"
                component={DSTinhTien}
                options={({ navigation }) => ({
                    title: "TIỀN PHÒNG",
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

export default DieuKhienTinhTien;
