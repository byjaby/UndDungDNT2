import React, { useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { useMyContextController } from "../../TrungTam";
import auth from "@react-native-firebase/auth";

const ChiTietKhachThue = ({ route }) => {
    const [controller, dispatch] = useMyContextController();
    const navigation = useNavigation();
    const { user } = route.params;

    console.log("user.id: ", user.id);

    const deleteUser = async () => {
        try {
            await firestore().collection("KhachThue").doc(user.id).delete();
            Alert.alert("Thành công", "Đã xóa khách thuê.");
            dispatch({ type: 'RELOAD_KHACHTHUE' });
            navigation.goBack();
        } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa: " + error.message);
            console.log(error.message);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa khách thuê này?",
            [
                { text: "Hủy", style: "cancel" },
                { text: "Xóa", style: "destructive", onPress: deleteUser }
            ]
        );
    };

    const resetPassword = async () => {
        try {
            await auth().sendPasswordResetEmail(user.email);
            Alert.alert(
                "Thành công",
                "Đã gửi email đặt lại mật khẩu đến: " + user.email
            );
        } catch (error) {
            console.error("Lỗi khi gửi email reset password:", error);
            Alert.alert("Lỗi", "Không thể gửi email: " + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chi tiết khách thuê</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Họ tên:</Text>
                <Text style={styles.value}>{user.fullName || "Chưa có"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{user.email || "Chưa có"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>SĐT:</Text>
                <Text style={styles.value}>{user.phone || "Chưa có"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Địa chỉ:</Text>
                <Text style={styles.value}>{user.address || "Chưa có"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Ngày tạo:</Text>
                <Text style={styles.value}>
                    {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : "Không rõ"}
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    icon="pencil"
                    onPress={() => navigation.navigate("SuaKhachThue", { user })}
                    style={[styles.button, { backgroundColor: "#66E879" }]}
                >
                    Chỉnh sửa
                </Button>

                <Button
                    mode="contained"
                    icon="delete"
                    onPress={handleDelete}
                    style={[styles.button, { backgroundColor: "#f44336" }]}
                >
                    Xóa
                </Button>
            </View>
            <View style={styles.buttonContainer}>

                <Button
                    mode="contained"
                    icon="lock-reset"
                    onPress={resetPassword}
                    style={[styles.button, { backgroundColor: "#2196f3" }]}
                >
                    Đặt lại mật khẩu
                </Button>

            </View>
        </View >
    );
};

export default ChiTietKhachThue;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        alignSelf: 'center',
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#3f51b5",
    },
    row: {
        flexDirection: "row",
        marginBottom: 12,
    },
    label: {
        fontWeight: "bold",
        fontSize: 18,
        width: 110,
        color: "#333",
    },
    value: {
        fontSize: 18,
        flex: 1,
        color: "#555",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 15,
    },
    button: {
        paddingHorizontal: 16,
    },
});
