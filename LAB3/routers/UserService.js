import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController } from "../store";
import React from "react";
import ServicesList from "../screens/ServicesList";
import DangKyService from "../screens/DangKyService";

const Stack = createStackNavigator();

const UserService = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    return (
        <Stack.Navigator
            initialRouteName="ServicesList"
            screenOptions={{
                title: "Danh sách dịch vụ",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "gray" }

            }}
        >
            <Stack.Screen name="ServicesList" component={ServicesList} />
            <Stack.Screen name="DangKyService" component={DangKyService} />
        </Stack.Navigator>
    );
};

export default UserService;
