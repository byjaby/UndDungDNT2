import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { Card, Title, Paragraph } from "react-native-paper";
import { useMyContextController } from "../store"; // <== nhớ đường dẫn đúng

const LichSu = () => {
    const [transactions, setTransactions] = useState([]);
    const [controller] = useMyContextController();
    const { userLogin } = controller;

    useEffect(() => {
        if (!userLogin?.user_id) return;

        const unsubscribe = firestore()
            .collection("LichSuGD")
            .where("NguoiBookID", "==", userLogin.user_id)
            .onSnapshot(querySnapshot => {
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTransactions(data);
            });

        return () => unsubscribe();
    }, [userLogin?.user_id]);

    const renderItem = ({ item }) => (
        <Card style={styles.card} mode="outlined">
            <Card.Content>
                <Title style={styles.title}>{item.name}</Title>
                <Paragraph style={styles.detail}>💰 Giá: {item.price?.toLocaleString()} ₫</Paragraph>
                <Paragraph style={styles.detail}>👨‍🔧 Người làm: {item.worker}</Paragraph>
                <Paragraph style={styles.detail}>
                    🕒 Bắt đầu: {new Date(item.startTime).toLocaleTimeString()}
                </Paragraph>
                <Paragraph style={styles.detail}>
                    📅 Ngày đăng ký: {new Date(item.createdAt?.toDate?.() || item.createdAt).toLocaleString()}
                </Paragraph>
                <Paragraph style={[styles.status, { color: item.TrangThai ? "#4CAF50" : "#FF9800" }]}>
                    {item.TrangThai ? "✔️ Đã xác nhận" : "⏳ Chờ xác nhận"}
                </Paragraph>
            </Card.Content>
        </Card>
    );

    return (
        <FlatList
            data={transactions}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.container}
            ListEmptyComponent={<Text style={styles.empty}>Bạn chưa có giao dịch nào.</Text>}
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
});

export default LichSu;
