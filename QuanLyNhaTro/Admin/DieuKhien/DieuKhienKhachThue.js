import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController } from "../../TrungTam";
import DSKhachThue from "../ManHinh/DSKhachThue";
import ThemKhachThue from "../ManHinh/ThemKhachThue";
import ChiTietKhachThue from "../ManHinh/ChiTietKhachThue";
import SuaKhachThue from "../ManHinh/SuaKhachThue";

const Stack = createStackNavigator();

const DieuKhienKhachThue = () => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;
    return (
        <Stack.Navigator
            initialRouteName="DSKhachThue"
        >
            <Stack.Screen name="DSKhachThue" component={DSKhachThue} options={{ headerShown: false }} />
            <Stack.Screen name="ThemKhachThue" component={ThemKhachThue} options={{ headerShown: false }} />
            <Stack.Screen name="ChiTietKhachThue" component={ChiTietKhachThue} options={{ headerShown: false }} />
            <Stack.Screen name="SuaKhachThue" component={SuaKhachThue} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default DieuKhienKhachThue;
