import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-paper";
import { loadTTCN, useMyContextController } from "../../TrungTam";
import { useFocusEffect } from '@react-navigation/native';

const HoSo = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    if (!userLogin) {
        return (
            <View style={styles.container}>
                <Text>Đang tải thông tin người dùng...</Text>
            </View>
        );
    }

    useFocusEffect(
        React.useCallback(() => {
            loadTTCN(dispatch, userLogin.user_id);
        }, [])
    );

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.label}>Họ tên:</Text>
                <Text style={styles.value}>{userLogin.fullName || "Chưa có"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{userLogin.email || "Chưa có"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>SĐT:</Text>
                <Text style={styles.value}>{userLogin.phone || "Chưa có"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Địa chỉ:</Text>
                <Text style={styles.value}>{userLogin.address || "Chưa có"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Ngày tạo:</Text>
                <Text style={styles.value}>
                    {userLogin.createdAt
                        ? new Date(userLogin.createdAt.seconds * 1000).toLocaleDateString()
                        : "Không rõ"}
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    icon="pencil"
                    onPress={() => navigation.navigate("SuaThongTin", { user: userLogin })}
                    style={[styles.button, { backgroundColor: "#66E879" }]}
                >
                    Chỉnh sửa
                </Button>

                <Button
                    mode="contained"
                    icon="lock-reset"
                    onPress={() => navigation.navigate("DoiMK", { user: userLogin })}
                    style={[styles.button, { backgroundColor: "#2196f3" }]}
                >
                    Đổi mật khẩu
                </Button>
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate("TroDK", { user: userLogin })}
                    style={[{ backgroundColor: "#66E879" }]}
                >
                    Phòng trọ đã đăng ký
                </Button>
            </View>
        </View>
    );
};

export default HoSo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    row: {
        flexDirection: "row",
        marginBottom: 12,
    },
    label: {
        fontWeight: "bold",
        fontSize: 18,
        width: 150,
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
        width: 170,
        paddingHorizontal: 16,
    },
});
