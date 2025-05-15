import { createStackNavigator } from "@react-navigation/stack";
import Customers from "../screens/Customers";
import CustomersDetail from "../screens/CustomersDetail";
import React from "react";

const Stack = createStackNavigator();

const CustomersStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#f8f8f8" },
            }}
        >
            <Stack.Screen
                name="Customers"
                component={Customers}
                options={{ title: "Danh sách khách hàng" }}
            />
            <Stack.Screen
                name="CustomersDetail"
                component={CustomersDetail}
                options={({ route }) => ({
                    title: route.params?.user?.fullName || "Chi tiết khách hàng"
                })}
            />
        </Stack.Navigator>
    );
};

export default CustomersStack;
