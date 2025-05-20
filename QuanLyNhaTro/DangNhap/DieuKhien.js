import { createStackNavigator } from "@react-navigation/stack";
import DangNhap from "./DangNhap";
import DangKy from "./DangKy";
import QuenMK from "./QuenMK";
import TrangChuTro from "../Admin/TrangChuTro";

const Stack = createStackNavigator();

const DieuKhien = () => {
    return (
        <Stack.Navigator
            initialRouteName="DangNhap"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="DangNhap" component={DangNhap} />
            <Stack.Screen name="DangKy" component={DangKy} />
            <Stack.Screen name="QuenMK" component={QuenMK} />
            <Stack.Screen name="TrangChuTro" component={TrangChuTro} />
        </Stack.Navigator>
    );
};

export default DieuKhien;
