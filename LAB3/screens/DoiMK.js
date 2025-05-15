import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import auth, { EmailAuthProvider } from "@react-native-firebase/auth";

const DoiMK = ({ navigation }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const toggleShow = (field) => {
        if (field === "old") setShowOld(!showOld);
        else if (field === "new") setShowNew(!showNew);
        else setShowConfirm(!showConfirm);
    };

    const renderPasswordInput = (label, value, setValue, show, toggleFn) => (
        <View style={styles.inputContainer}>
            <TextInput
                placeholder={label}
                secureTextEntry={!show}
                value={value}
                onChangeText={setValue}
                style={styles.input}
            />
            <TouchableOpacity onPress={toggleFn} style={styles.icon}>
                <Icon name={show ? "eye-off" : "eye"} size={22} color="#666" />
            </TouchableOpacity>
        </View>
    );

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
            return;
        }

        if (newPassword === oldPassword) {
            Alert.alert("Lỗi", "Mật khẩu mới không được trùng với mật khẩu cũ.");
            return;
        }

        const user = auth().currentUser;

        if (user && user.email) {
            try {
                const credential = EmailAuthProvider.credential(user.email, oldPassword);
                await user.reauthenticateWithCredential(credential);
                await user.updatePassword(newPassword);
                Alert.alert("Thành công", "Mật khẩu đã được thay đổi.");
                navigation.goBack();
            } catch (error) {
                console.log("Error changing password:", error);
                let msg = "Đã có lỗi xảy ra.";

                if (
                    error.code === "auth/wrong-password" ||
                    error.code === "auth/invalid-credential"
                ) {
                    msg = "Mật khẩu cũ không đúng.";
                } else if (error.code === "auth/weak-password") {
                    msg = "Mật khẩu mới quá yếu (ít nhất 6 ký tự).";
                } else if (error.code === "auth/requires-recent-login") {
                    msg = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
                }

                Alert.alert("Lỗi", msg);
            }
        } else {
            Alert.alert("Lỗi", "Không tìm thấy người dùng.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đổi mật khẩu</Text>

            {renderPasswordInput("Mật khẩu hiện tại", oldPassword, setOldPassword, showOld, () => toggleShow("old"))}
            {renderPasswordInput("Mật khẩu mới", newPassword, setNewPassword, showNew, () => toggleShow("new"))}
            {renderPasswordInput("Xác nhận mật khẩu", confirmPassword, setConfirmPassword, showConfirm, () => toggleShow("confirm"))}

            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
        fontWeight: "bold",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        height: 50,
    },
    icon: {
        padding: 5,
    },
    button: {
        backgroundColor: "#4e73df",
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default DoiMK;
