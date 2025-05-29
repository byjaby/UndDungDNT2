import React, { useState } from "react";
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { TextInput, Button, Text, Title } from "react-native-paper";
import auth from "@react-native-firebase/auth";

const DoiMK = ({ route, navigation }) => {
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
            return false;
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }

        if (newPassword === currentPassword) {
            Alert.alert("Mật khẩu mới không được trùng với mật khẩu hiện tại.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Mật khẩu xác nhận không khớp.");
            return;
        }

        setLoading(true);

        const isReauthenticated = await reauthenticate(currentPassword);
        if (!isReauthenticated) {
            Alert.alert("Mật khẩu hiện tại không đúng.");
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
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
    },
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#f5f5f5",
    },
    input: {
        marginBottom: 15,
        backgroundColor: "white",
    },
    button: {
        alignSelf: 'center',
        width: 120,
        marginTop: 10,
        backgroundColor: "#1976d2",
        paddingVertical: 6,
        borderRadius: 8,
    },
});

export default DoiMK;
