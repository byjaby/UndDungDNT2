import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController, logout } from "../store";
import { IconButton, Menu } from "react-native-paper";
import React, { useState } from "react";
import EditProfile from "../screens/EditProfile";
import Profile from "../screens/Profile";
import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";
import DoiMK from "../screens/DoiMK";

const Stack = createStackNavigator();

const ProfileUser = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;
    const [visible, setVisible] = useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <Stack.Navigator
            initialRouteName="Profile"
            screenOptions={{
                title: "Thông tin cá nhân",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "gray" },
                headerRight: () => (
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={
                            <IconButton icon="menu" color="white" onPress={openMenu} />
                        }
                    >
                        <Menu.Item
                            onPress={() => {
                                closeMenu();
                                navigation.navigate("DoiMK");
                            }}
                            title="Đổi mật khẩu"
                        />
                        <Menu.Item
                            onPress={() => {
                                closeMenu();
                                logout(dispatch, navigation);
                            }}
                            title="Đăng xuất"
                        />

                    </Menu>
                ),
            }}
        >
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="DoiMK" component={DoiMK} />
        </Stack.Navigator>
    );
};

export default ProfileUser;
