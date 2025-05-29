import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController } from "../../TrungTam";
import GiaoDich from "../ManHinh/GiaoDich";

const Stack = createStackNavigator();

const DieuKhienGiaoDich = () => {
    const [controller] = useMyContextController();
    const { userLogin } = controller;

    return (
        <Stack.Navigator initialRouteName="GiaoDich">
            <Stack.Screen
                name="GiaoDich"
                component={GiaoDich}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default DieuKhienGiaoDich;
