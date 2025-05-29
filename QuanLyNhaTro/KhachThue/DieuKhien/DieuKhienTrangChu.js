import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController } from "../../TrungTam";
import TrangChu from "../ManHinh/TrangChu";
import ChiTietNhaTro from "../ManHinh/ChiTietNhaTro";

const Stack = createStackNavigator();

const DieuKhienTrangChu = () => {
    const [controller] = useMyContextController();
    const { userLogin } = controller;

    return (
        <Stack.Navigator initialRouteName="TrangChu">
            <Stack.Screen
                name="TrangChu"
                component={TrangChu}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ChiTietNhaTro"
                component={ChiTietNhaTro}
                options={{ headerShown: true, title: "" }}
            />

        </Stack.Navigator>
    );
};

export default DieuKhienTrangChu;
