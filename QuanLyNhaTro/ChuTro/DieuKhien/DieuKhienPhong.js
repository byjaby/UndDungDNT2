import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController } from "../../TrungTam";
import DSPhong from "../ManHinh/DSPhong";
import ThemPhong from "../ManHinh/ThemPhong";
import ChiTietPhong from "../ManHinh/ChiTietPhong";
import SuaPhong from "../ManHinh/SuaPhong";
import TinhTien from "../ManHinh/TinhTien";
import HoSo from "../ManHinh/HoSo";

const Stack = createStackNavigator();

const DieuKhienPhong = () => {
    const [controller] = useMyContextController();
    const { userLogin } = controller;

    return (
        <Stack.Navigator initialRouteName="DSDV">
            <Stack.Screen
                name="DSPhong"
                component={DSPhong}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="ThemPhong"
                component={ThemPhong}
                options={{ headerShown: true, title: "" }}
            />

            <Stack.Screen
                name="ChiTietPhong"
                component={ChiTietPhong}
                options={{ headerShown: true, title: "" }}
            />

            <Stack.Screen
                name="SuaPhong"
                component={SuaPhong}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="TinhTien"
                component={TinhTien}
                options={{ headerShown: false }}
            />

        </Stack.Navigator>
    );
};

export default DieuKhienPhong;
