import { createStackNavigator } from "@react-navigation/stack";
import Services from "../screens/Services";
import AddNewService from "../screens/AddNewService";
import ServiceDetail from "../screens/ServiceDetail";
import { useMyContextController } from "../store";
import { IconButton } from "react-native-paper";
import React from "react";
import EditService from "../screens/EditService";
import AdminProfile from "../screens/AdminProfile";
import EditAdminProfile from "../screens/EditAdminProfile";
import CustomersDetail from "../screens/CustomersDetail";
import Customers from "../screens/Customers";

const Stack = createStackNavigator();

const RouterService = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    return (
        <Stack.Navigator
            initialRouteName="Services"
            screenOptions={{
                title: userLogin !== null ? userLogin.fullName : "Services",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "pink" },
                headerRight: () => (
                    <IconButton
                        icon="account"
                        onPress={() => navigation.navigate("AdminProfile")}
                    />
                ),
            }}
        >
            <Stack.Screen name="Services" component={Services} />
            <Stack.Screen name="AddNewService" component={AddNewService} />
            <Stack.Screen name="EditService" component={EditService} />
            <Stack.Screen name="ServiceDetail" component={ServiceDetail} />
            <Stack.Screen name="AdminProfile" component={AdminProfile} />
            <Stack.Screen name="EditAdminProfile" component={EditAdminProfile} />
        </Stack.Navigator>
    );
};

export default RouterService;
