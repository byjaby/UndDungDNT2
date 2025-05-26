import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { useMyContextController } from "../../TrungTam";

const ChiTietDV = ({ route }) => {
    const [controller, dispatch] = useMyContextController();
    const navigation = useNavigation();
    const { dichVu } = route.params;
    const isDefaultService =
        ["điện", "nước"].includes((dichVu.tenDV || "").trim().toLowerCase());
    const handleDelete = () => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa dịch vụ này?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa", style: "destructive", onPress: async () => {
                        try {
                            await firestore().collection("DichVu").doc(dichVu.id).delete();
                            Alert.alert("Thành công", "Dịch vụ đã được xóa.");
                            dispatch({ type: 'RELOAD_DICHVU' });
                            navigation.goBack();
                        } catch (error) {
                            console.log("Lỗi khi xóa dịch vụ:", error.message);
                            Alert.alert("Lỗi", "Không thể xóa: " + error.message);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.label}>Tên dịch vụ:</Text>
                <Text style={styles.value}>{dichVu.tenDV || "Không rõ"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Chi phí:</Text>
                <Text style={styles.value}>
                    {dichVu.chiPhi != null ? `${dichVu.chiPhi.toLocaleString()} đ` : "Không rõ"}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Mô tả:</Text>
                <Text style={styles.value}>{dichVu.moTa || "Không có"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Ngày tạo:</Text>
                <Text style={styles.value}>
                    {dichVu.createdAt
                        ? new Date(dichVu.createdAt.seconds * 1000).toLocaleDateString()
                        : "Không rõ"}
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    icon="pencil"
                    onPress={() => navigation.navigate("SuaDV", { dichVu })}
                    style={[styles.button, { backgroundColor: "#66E879" }]}
                >
                    Chỉnh sửa
                </Button>

                {!isDefaultService && (
                    <Button
                        mode="contained"
                        icon="delete"
                        onPress={handleDelete}
                        style={[styles.button, { backgroundColor: "#f44336" }]}
                    >
                        Xóa
                    </Button>
                )}

            </View>
        </View>
    );
};

export default ChiTietDV;

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
