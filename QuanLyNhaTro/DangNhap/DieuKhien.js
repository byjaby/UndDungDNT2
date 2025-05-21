import { createStackNavigator } from "@react-navigation/stack";
import DangNhap from "./DangNhap";
import KhachDangKy from "./KhachDangKy";
import QuenMK from "./QuenMK";
import ChonDangKy from "./ChonDangKy";
import ChuDangKy from "./ChuDangKy";
import MenuAdmin from "../Admin/DieuKhien/MenuAdmin";
import MenuChuTro from "../ChuTro/DieuKhien/MenuChuTro";

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
            <Stack.Screen name="ChonDangKy" component={ChonDangKy} />
            <Stack.Screen name="KhachDangKy" component={KhachDangKy} />
            <Stack.Screen name="ChuDangKy" component={ChuDangKy} />
            <Stack.Screen name="QuenMK" component={QuenMK} />
            <Stack.Screen name="MenuAdmin" component={MenuAdmin} />
            <Stack.Screen name="MenuChuTro" component={MenuChuTro} />
        </Stack.Navigator>
    );
};

export default DieuKhien;
