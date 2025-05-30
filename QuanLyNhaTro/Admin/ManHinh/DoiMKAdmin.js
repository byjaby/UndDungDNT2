import React, { useState } from "react";
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { TextInput, Button, Appbar } from "react-native-paper";
import auth from "@react-native-firebase/auth";

const DoiMKAdmin = ({ route, navigation }) => {
    const { user } = route.params;

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const reauthenticate = async (currentPassword) => {
        const currentUser = auth().currentUser;
        const credential = auth.EmailAuthProvider.credential(
            currentUser.email,
            currentPassword
        );
        try {
            await currentUser.reauthenticateWithCredential(credential);
            return true;
        } catch (error) {
            console.error("Reauthentication error:", error);
            return false;
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }

        if (newPassword === currentPassword) {
            Alert.alert("Lỗi", "Mật khẩu mới không được trùng với mật khẩu hiện tại.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
            return;
        }

        setLoading(true);

        const isReauthenticated = await reauthenticate(currentPassword);
        if (!isReauthenticated) {
            Alert.alert("Lỗi", "Mật khẩu hiện tại không đúng.");
            setLoading(false);
            return;
        }

        try {
            await auth().currentUser.updatePassword(newPassword);
            Alert.alert("Thành công", "Đổi mật khẩu thành công.", [
                {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            console.error("Đổi mật khẩu lỗi:", error);
            Alert.alert("Thất bại", "Không thể đổi mật khẩu. Vui lòng thử lại.");
        }

        setLoading(false);
    };

    return (
        <>
            <Appbar.Header style={{ backgroundColor: "#1976d2" }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
                <Appbar.Content title="Đổi mật khẩu" titleStyle={{ color: "white" }} />
            </Appbar.Header>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                        <TextInput
                            label="Mật khẩu hiện tại"
                            secureTextEntry
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            style={styles.input}
                            mode="outlined"
                        />
                        <TextInput
                            label="Mật khẩu mới"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                            style={styles.input}
                            mode="outlined"
                        />
                        <TextInput
                            label="Xác nhận mật khẩu"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            style={styles.input}
                            mode="outlined"
                        />

                        <Button
                            mode="contained"
                            onPress={handleChangePassword}
                            loading={loading}
                            disabled={loading}
                            style={styles.button}
                            icon="lock-reset"
                        >
                            Xác nhận
                        </Button>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
    },
    container: {
        padding: 24,
        backgroundColor: "white",
        marginHorizontal: 20,
        borderRadius: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    input: {
        marginBottom: 15,
        backgroundColor: "white",
    },
    button: {
        alignSelf: "center",
        width: 150,
        marginTop: 10,
        backgroundColor: "#1976d2",
        paddingVertical: 8,
        borderRadius: 8,
    },
});

export default DoiMKAdmin;
