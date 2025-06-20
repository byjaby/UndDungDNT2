import React from "react";
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { Text } from "react-native-paper";
import { useMyContextController, loadTienPhong } from "../../TrungTam";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const DSTinhTien = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { tienPhong, userLogin } = controller;

    useFocusEffect(
        React.useCallback(() => {
            if (userLogin?.user_id) {
                loadTienPhong(dispatch, userLogin.user_id);
            }
        }, [userLogin?.user_id])
    );

    const danhSachDaXuLy = (tienPhong || []).filter(
        (item) => item.creator === userLogin?.user_id
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() =>
                navigation.navigate("ChiTietTienPhong", { tienPhong: item })
            }
        >
            <View style={styles.cardHeader}>
                <Icon name="home-city-outline" size={26} color="#3f51b5" />
                <Text style={styles.cardTitle}>Phòng: {item.tenPhong || "Không rõ"}</Text>
            </View>

            <View style={styles.cardContent}>
                <View style={styles.row}>
                    <Icon name="account" size={20} color="#555" />
                    <Text style={styles.label}>Người thuê:</Text>
                    <Text style={styles.value}>{item.tenNguoiThue || "Không rõ"}</Text>
                </View>
                <View style={styles.row}>
                    <Icon name="calendar-month-outline" size={20} color="#555" />
                    <Text style={styles.label}>Ngày:</Text>
                    <Text style={styles.value}>
                        {item.createdAt?.toDate?.().toLocaleDateString() || "Không rõ"}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Icon name="cash-multiple" size={20} color="#555" />
                    <Text style={styles.label}>Tổng tiền:</Text>
                    <Text style={styles.total}>{item.tongTien?.toLocaleString()} đ</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {danhSachDaXuLy.length > 0
                        ? `Danh sách tính tiền phòng (${danhSachDaXuLy.length})`
                        : "Chưa có dữ liệu tính tiền"}
                </Text>
            </View>

            <FlatList
                data={danhSachDaXuLy}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 8,
        color: "#3f51b5",
    },
    cardContent: {
        marginTop: 4,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    label: {
        marginLeft: 6,
        fontWeight: "600",
        color: "#555",
        width: 100,
    },
    value: {
        flex: 1,
        color: "#333",
        fontWeight: "500",
    },
    total: {
        flex: 1,
        fontSize: 16,
        color: "#d32f2f",
        fontWeight: "bold",
    },
});

export default DSTinhTien;
