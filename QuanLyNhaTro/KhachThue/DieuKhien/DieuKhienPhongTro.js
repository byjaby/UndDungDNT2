import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController } from "../../TrungTam";
import TrangChu from "../ManHinh/TrangChu";
import ChiTietNhaTro from "../ManHinh/ChiTietNhaTro";
import Tro from "../ManHinh/Tro";
import ThanhToan from "../ManHinh/ThanhToan";
import VNPayWebView from "../ManHinh/VNPayWebView";

const Stack = createStackNavigator();

const DieuKhienPhongTro = () => {
    const [controller] = useMyContextController();
    const { userLogin } = controller;

    return (
        <Stack.Navigator initialRouteName="Tro">
            <Stack.Screen
                name="Tro"
                component={Tro}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ThanhToan"
                component={ThanhToan}
                options={{ headerShown: true, title: "" }}
            />
            <Stack.Screen
                name="VNPayWebView"
                component={VNPayWebView}
                options={{ headerShown: true, title: "" }}
            />
        </Stack.Navigator>
    );
};

export default DieuKhienPhongTro;
