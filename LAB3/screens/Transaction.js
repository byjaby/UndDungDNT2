import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { Card, Title, Paragraph, Button } from "react-native-paper";

const Transaction = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection("LichSuGD")
            .orderBy("createdAt", "desc")
            .onSnapshot(querySnapshot => {
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTransactions(data);
            });

        return () => unsubscribe();
    }, []);
    const handleApprove = async (id) => {
        try {
            await firestore().collection("LichSuGD").doc(id).update({
                TrangThai: true,
            });
        } catch (error) {
            console.error("Lỗi khi duyệt giao dịch:", error);
        }
    };
    const renderItem = ({ item }) => (
        <Card style={styles.card} mode="outlined">
            <Card.Content>
                <Title style={styles.title}>{item.name}</Title>
                <Paragraph style={styles.detail}>💰 Giá: {item.price?.toLocaleString()} ₫</Paragraph>
                <Paragraph style={styles.detail}>👨‍🔧 Người làm: {item.worker}</Paragraph>
                <Paragraph style={styles.detail}>🧑 Người đăng ký: {item.NguoiBook || "Không xác định"}</Paragraph>
                <Paragraph style={styles.detail}>
                    🕒 Bắt đầu: {new Date(item.startTime).toLocaleTimeString()}
                </Paragraph>
                <Paragraph style={styles.detail}>📅 Ngày đăng ký: {new Date(item.createdAt?.toDate?.() || item.createdAt).toLocaleString()}</Paragraph>
                <Paragraph style={[styles.status, { color: item.TrangThai ? "#4CAF50" : "#FF9800" }]}>
                    {item.TrangThai ? "✔️ Đã duyệt" : "⏳ Chờ duyệt"}
                </Paragraph>

                {!item.TrangThai && (
                    <Button
                        mode="contained"
                        style={styles.approveButton}
                        icon="check"
                        onPress={() => handleApprove(item.id)}
                    >
                        Duyệt
                    </Button>
                )}
            </Card.Content>
        </Card>
    );

    return (
        <FlatList
            data={transactions}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.container}
            ListEmptyComponent={<Text style={styles.empty}>Hiện chưa có giao dịch nào.</Text>}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#F9FAFB",
    },
    card: {
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        elevation: 3,
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    detail: {
        fontSize: 20,
        marginBottom: 4,
        color: "#555",
    },
    status: {
        marginTop: 8,
        fontWeight: "600",
        fontSize: 16,
    },
    empty: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 16,
        color: "#888",
    },
    approveButton: {
        marginTop: 10,
        backgroundColor: "#4CAF50",
        alignSelf: "center",
        paddingHorizontal: 12,
    },
});

export default Transaction;
