import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { loadHoSo, useMyContextController } from "../../TrungTam";
import { useFocusEffect } from '@react-navigation/native';

const HoSo = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    if (!userLogin) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Đang tải thông tin người dùng...</Text>
            </View>
        );
    }

    useFocusEffect(
        React.useCallback(() => {
            loadHoSo(dispatch, userLogin.user_id);
        }, [])
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <View style={styles.row}>
                    <Text style={styles.label}>Họ tên:</Text>
                    <Text style={styles.value}>{userLogin.hoTen || "Chưa có"}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{userLogin.email || "Chưa có"}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>SĐT:</Text>
                    <Text style={styles.value}>{userLogin.sDT || "Chưa có"}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Địa chỉ:</Text>
                    <Text style={styles.value}>{userLogin.diaChi || "Chưa có"}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Ngày tạo:</Text>
                    <Text style={styles.value}>
                        {userLogin.createdAt
                            ? new Date(userLogin.createdAt.seconds * 1000).toLocaleDateString()
                            : "Không rõ"}
                    </Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    icon="pencil"
                    onPress={() => navigation.navigate("SuaThongTinAdmin", { user: userLogin })}
                    style={[styles.button, { backgroundColor: "#66E879" }]}
                >
                    Chỉnh sửa
                </Button>

                <Button
                    mode="contained"
                    icon="lock-reset"
                    onPress={() => navigation.navigate("DoiMKAdmin", { user: userLogin })}
                    style={[styles.button, { backgroundColor: "#2196f3" }]}
                >
                    Đổi mật khẩu
                </Button>
            </View>
        </ScrollView>
    );
};

export default HoSo;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        padding: 24,
        backgroundColor: "#f7f9fc",
        flexGrow: 1,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        marginBottom: 30,
    },
    row: {
        flexDirection: "row",
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingBottom: 8,
    },
    label: {
        fontWeight: "600",
        fontSize: 16,
        width: 110,
        color: "#444",
    },
    value: {
        flex: 1,
        fontSize: 16,
        color: "#666",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    button: {
        width: 160,
        borderRadius: 8,
        elevation: 2,
    },
});
