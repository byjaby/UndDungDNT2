import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController } from "../../TrungTam";
import DSChuTro from "../ManHinh/DSChuTro";
import ThemChuTro from "../ManHinh/ThemChuTro";
import ChiTietChuTro from "../ManHinh/ChiTietChuTro";
import SuaChuTro from "../ManHinh/SuaChuTro";

const Stack = createStackNavigator();

const DieuKhienChuTro = () => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;
    return (
        <Stack.Navigator
            initialRouteName="DSChuTro"
        >
            <Stack.Screen name="DSChuTro" component={DSChuTro}
                options={{ headerShown: false }} />
            <Stack.Screen name="ThemChuTro" component={ThemChuTro} options={{ headerShown: false }} />
            <Stack.Screen name="ChiTietChuTro" component={ChiTietChuTro} options={{ headerShown: true, title: "" }} />
            <Stack.Screen name="SuaChuTro" component={SuaChuTro} options={{ headerShown: true, title: "" }} />
        </Stack.Navigator>
    );
};

export default DieuKhienChuTro;
