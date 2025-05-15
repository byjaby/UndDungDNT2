import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CustomerDetail = ({ route }) => {
    const { user } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chi tiết người dùng</Text>
            <Text style={styles.label}><Text style={styles.label}>Họ tên:</Text> {user.fullName || "Chưa có"}</Text>
            <Text style={styles.label}><Text style={styles.label}>Email:</Text> {user.email}</Text>
            <Text style={styles.label}><Text style={styles.label}>SĐT:</Text> {user.phone || "Chưa có"}</Text>
            <Text style={styles.label}><Text style={styles.label}>Địa chỉ:</Text> {user.address || "Chưa có"}</Text>
        </View>
    );
};

export default CustomerDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 20,
    },
    label: {
        fontSize: 20,
    },
});
