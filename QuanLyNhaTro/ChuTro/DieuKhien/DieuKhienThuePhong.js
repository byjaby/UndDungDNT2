import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController } from "../../TrungTam";
import DKPhong from "../ManHinh/DKPhong";

const Stack = createStackNavigator();

const DieuKhienThuePhong = () => {
    const [controller] = useMyContextController();
    const { userLogin } = controller;

    return (
        <Stack.Navigator initialRouteName="DKPhong">
            <Stack.Screen
                name="DKPhong"
                component={DKPhong}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default DieuKhienThuePhong;
