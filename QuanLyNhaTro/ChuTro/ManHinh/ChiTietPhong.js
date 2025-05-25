import React from "react";
import { View, Text, StyleSheet, Alert, Image } from "react-native";
import { Button } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { useMyContextController } from "../../TrungTam";

const ChiTietPhong = ({ route }) => {
    const [controller, dispatch] = useMyContextController();
    const navigation = useNavigation();
    const { phong } = route.params;

    const handleDelete = () => {
        if (phong.nguoiThue && phong.nguoiThue.trim() !== "") {
            Alert.alert("Không thể xóa", "Phòng hiện đang có người thuê, không thể xóa.");
            return;
        }
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa phòng cho thuê này?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa", style: "destructive", onPress: async () => {
                        try {
                            await firestore().collection("Phong").doc(phong.id).delete();

                            await firestore()
                                .collection("ChuTro")
                                .doc(phong.creator)
                                .update({
                                    sLPhong: firestore.FieldValue.increment(-1),
                                });

                            Alert.alert("Thành công", "Phòng cho thuê đã được xóa.");
                            navigation.goBack();
                        } catch (error) {
                            console.log("Lỗi khi xóa phòng cho thuê:", error.message);
                            Alert.alert("Lỗi", "Không thể xóa: " + error.message);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: phong.hinhAnh }}
                style={styles.image}
                resizeMode="cover"
            />

            <View style={styles.row}>
                <Text style={styles.label}>Tên phòng:</Text>
                <Text style={styles.value}>{phong.tenPhong || "Không rõ"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Chiều dài:</Text>
                <Text style={styles.value}>{phong.chieuDai} m</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Chiều rộng:</Text>
                <Text style={styles.value}>{phong.chieuRong} m</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Giá phòng:</Text>
                <Text style={styles.value}>
                    {phong.giaPhong != null ? `${phong.giaPhong.toLocaleString()} đ` : "Không rõ"}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Người thuê:</Text>
                <Text style={styles.value}>{phong.nguoiThue || "Chưa có"}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Ngày tạo:</Text>
                <Text style={styles.value}>
                    {phong.createdAt
                        ? new Date(phong.createdAt.seconds * 1000).toLocaleDateString()
                        : "Không rõ"}
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    icon="pencil"
                    onPress={() => navigation.navigate("SuaPhong", { phong })}
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
        </View>
    );
};

export default ChiTietPhong;

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
    image: {
        width: "100%",
        height: 180,
        borderRadius: 10,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
    },
    button: {
        paddingHorizontal: 16,
    },
});
