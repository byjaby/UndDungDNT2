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
            screenOptions={{
                title: "NGƯỜI DÙNG: KHÁCH THUÊ",
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
                    color: "#F8F9FA",
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
            <Stack.Screen name="DSKhachThue" component={DSKhachThue} />
            <Stack.Screen name="ThemKhachThue" component={ThemKhachThue} />
            <Stack.Screen name="ChiTietKhachThue" component={ChiTietKhachThue} />
            <Stack.Screen name="SuaKhachThue" component={SuaKhachThue} />
        </Stack.Navigator>
    );
};

export default DieuKhienKhachThue;
