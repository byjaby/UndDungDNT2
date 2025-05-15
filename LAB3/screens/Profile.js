import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useMyContextController } from "../store"; // Để truy cập thông tin admin
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import { Card, Title, Paragraph, Button } from "react-native-paper"; // Use Paper components for a more polished UI

const Profile = () => {
    const [controller] = useMyContextController();
    const { userLogin } = controller; // Lấy thông tin admin đã đăng nhập
    const navigation = useNavigation(); // Use the navigation hook

    if (!userLogin) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Chưa đăng nhập</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Paragraph style={styles.detail}>Họ và tên: {userLogin.fullName}</Paragraph>
                    <Paragraph style={styles.detail}>Email: {userLogin.email}</Paragraph>
                    <Paragraph style={styles.detail}>Số điện thoại: {userLogin.phone}</Paragraph>
                    <Paragraph style={styles.detail}>Địa chỉ: {userLogin.address}</Paragraph>
                </Card.Content>
            </Card>
            <Card.Actions style={styles.actions}>
                <Button
                    mode="contained"
                    onPress={() =>
                        navigation.navigate("EditProfile", { customer: userLogin })
                    }
                >
                    Sửa thông tin
                </Button>
            </Card.Actions>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f8f8f8", // Soft background color
    },
    card: {
        width: "100%",
        padding: 10,
        backgroundColor: "#fff", // White background for card
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5, // Shadow for Android
    },
    detail: {
        fontSize: 20,
        color: "#555", // Lighter color for details
        marginBottom: 12,
    },
    error: {
        fontSize: 18,
        color: "red",
    },
    actions: {
        justifyContent: "flex-end",
        marginTop: 10,
    },
});

export default Profile;
