import React, { useCallback, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useMyContextController, loadLSTT } from "../../TrungTam";
import { useFocusEffect } from "@react-navigation/native";

const GiaoDich = () => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin, LSGD = [] } = controller;

    const [selectedMonth, setSelectedMonth] = useState(0); // 0 = Tất cả tháng
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useFocusEffect(
        useCallback(() => {
            loadLSTT(dispatch, userLogin.user_id);
        }, [])
    );

    const filteredLSGD =
        LSGD.length > 0
            ? LSGD.filter((item) => {
                const date =
                    item.ngayThanhToan instanceof Date
                        ? item.ngayThanhToan
                        : item.ngayThanhToan?.toDate?.();

                return (
                    date &&
                    (selectedMonth === 0 || date.getMonth() + 1 === selectedMonth) &&
                    date.getFullYear() === selectedYear
                );
            })
            : [];

    const renderItem = ({ item }) => {
        const formattedDate =
            item.ngayThanhToan?.toDate().toLocaleDateString("vi-VN") || "Không rõ";
        return (
            <View style={styles.card}>
                <Text style={styles.title}>Tên trọ: {item.tenTro}</Text>
                <Text>Chủ trọ: {item.tenChuTro}</Text>
                <Text>Phòng: {item.tenPhong}</Text>
                <Text>Tổng tiền: {item.tongTien.toLocaleString()} đ</Text>
                <Text>Ngày giao dịch: {formattedDate}</Text>
            </View>
        );
    };

    const yearList = [];
    for (let y = new Date().getFullYear(); y >= 2020; y--) {
        yearList.push(y);
    }

    const getTitle = () => {
        let title = `Lịch sử giao dịch (${filteredLSGD.length})`;
        if (selectedMonth > 0) title += ` - Tháng ${selectedMonth}`;
        title += `/${selectedYear}`;
        return title;
    };

    return (
        <View style={{ flex: 1, padding: 12 }}>
            <Text style={styles.header}>{getTitle()}</Text>

            <View style={styles.pickerRow}>
                <View style={styles.pickerContainer}>
                    <Text>Tháng:</Text>
                    <Picker
                        selectedValue={selectedMonth}
                        onValueChange={(value) => setSelectedMonth(value)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Tất cả" value={0} />
                        {[...Array(12)].map((_, i) => (
                            <Picker.Item key={i} label={`Tháng ${i + 1}`} value={i + 1} />
                        ))}
                    </Picker>
                </View>

                <View style={styles.pickerContainer}>
                    <Text>Năm:</Text>
                    <Picker
                        selectedValue={selectedYear}
                        onValueChange={(value) => setSelectedYear(value)}
                        style={styles.picker}
                    >
                        {yearList.map((year) => (
                            <Picker.Item key={year} label={`${year}`} value={year} />
                        ))}
                    </Picker>
                </View>
            </View>

            <Button
                mode="outlined"
                onPress={() => {
                    setSelectedMonth(0);
                    setSelectedYear(new Date().getFullYear());
                }}
                style={styles.clearButton}
            >
                Xóa bộ lọc
            </Button>

            {filteredLSGD.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        Bạn chưa có giao dịch nào.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredLSGD}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    pickerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    pickerContainer: {
        flex: 1,
        marginHorizontal: 5,
    },
    picker: {
        backgroundColor: "#f5f5f5",
    },
    clearButton: {
        alignSelf: "flex-end",
        marginBottom: 10,
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
    },
});

export default GiaoDich;
