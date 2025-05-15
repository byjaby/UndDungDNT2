import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController } from "../store";
import { IconButton } from "react-native-paper";
import React from "react";
import Transaction from "../screens/Transaction";


const Stack = createStackNavigator();

const TransactionRouter = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    return (
        <Stack.Navigator
            initialRouteName="Transaction"
            screenOptions={{
                title: "Giao dịch dịch vụ",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "pink" }
            }}
        >
            <Stack.Screen name="Transaction" component={Transaction} />
        </Stack.Navigator>
    );
};

export default TransactionRouter;
