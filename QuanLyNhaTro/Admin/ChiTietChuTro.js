import React, { useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { useMyContextController } from "../TrungTam";
import auth from "@react-native-firebase/auth";

const ChiTietChuTro = ({ route }) => {
    const [controller, dispatch] = useMyContextController();
    const navigation = useNavigation();
    const { user } = route.params;

    const [creatorName, setCreatorName] = React.useState("Đang tải...");
    console.log("ID người tạo (creator):", user.creator);
    console.log("user.id: ", user.id); // Kiểm tra giá trị

    const deleteUser = async () => {
        try {
            await firestore().collection("ChuTro").doc(user.id).delete();
            Alert.alert("Thành công", "Đã xóa chủ trọ.");
            dispatch({ type: 'RELOAD_CHUTRO' });
            navigation.goBack();
        } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa: " + error.message);
            console.log(error.message);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa chủ trọ này?",
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

    useEffect(() => {
        const fetchCreatorName = async () => {
            if (user.creator) {
                try {
                    const adminDoc = await firestore()
                        .collection("Admin")
                        .doc(user.creator)
                        .get();

                    if (adminDoc.exists) {
                        const adminData = adminDoc.data();
                        setCreatorName(adminData?.hoTen || "Không rõ");
                    } else {
                        setCreatorName("Không tìm thấy");
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy thông tin Admin:", error);
                    setCreatorName("Lỗi");
                }
            } else {
                setCreatorName("Không có");
            }
        };

        fetchCreatorName();
    }, [user.creator]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chi tiết chủ trọ</Text>

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
                <Text style={styles.label}>Người tạo:</Text>
                <Text style={styles.value}>{creatorName || "Chưa có"}</Text>
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
                    onPress={() => navigation.navigate("SuaChuTro", { user })}
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

export default ChiTietChuTro;

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
