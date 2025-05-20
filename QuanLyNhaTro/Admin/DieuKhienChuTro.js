import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController } from "../TrungTam";
import DSChuTro from "./DSChuTro";
import ThemChuTro from "./ThemChuTro";
import ChiTietChuTro from "./ChiTietChuTro";
import SuaChuTro from "./SuaChuTro";

const Stack = createStackNavigator();

const DieuKhienChuTro = () => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;
    return (
        <Stack.Navigator
            initialRouteName="DSChuTro"
            screenOptions={{
                title: "NGƯỜI DÙNG: CHỦ TRỌ",
                headerTitleAlign: "center",
                headerStyle: {
                    backgroundColor: "#FFD166",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 8, // cho Android có shadow
                    borderBottomWidth: 0,
                },
                headerTitleStyle: {
                    color: "#F8F9FA",  // chữ trắng
                    fontWeight: "bold",
                    fontSize: 22,
                    letterSpacing: 1,
                    fontFamily: "HelveticaNeue-Medium", // hoặc font bạn có
                    textShadowColor: 'rgba(0, 0, 0, 0.3)',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                },
            }}

        >
            <Stack.Screen name="DSChuTro" component={DSChuTro} />
            <Stack.Screen name="ThemChuTro" component={ThemChuTro} />
            <Stack.Screen name="ChiTietChuTro" component={ChiTietChuTro} />
            <Stack.Screen name="SuaChuTro" component={SuaChuTro} />
        </Stack.Navigator>
    );
};

export default DieuKhienChuTro;
