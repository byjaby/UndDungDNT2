import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController } from "../store";
import { IconButton } from "react-native-paper";
import React from "react";
import Transaction from "../screens/Transaction";
import LichSu from "../screens/LichSu";

const Stack = createStackNavigator();

const LichSuGD = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    return (
        <Stack.Navigator
            initialRouteName="LichSu"
            screenOptions={{
                title: "Lịch sử giao dịch",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "pink" }
            }}
        >
            <Stack.Screen name="LichSu" component={LichSu} />
        </Stack.Navigator>
    );
};

export default LichSuGD;
