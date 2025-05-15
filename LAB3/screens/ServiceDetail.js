import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Button } from "react-native-paper";
import { useMyContextController, deleteService } from "../store";

const ServiceDetail = ({ route, navigation }) => {
    const { service: initialService } = route.params;
    const [controller, dispatch] = useMyContextController();
    const [service, setService] = useState(initialService);

    useFocusEffect(
        useCallback(() => {
            const updated = controller.services.find(s => s.id === initialService.id);
            if (updated) {
                setService(updated);
            }
        }, [controller.services])
    );

    const handleDelete = () => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc muốn xóa dịch vụ này?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        await deleteService(dispatch, service.id);
                        Alert.alert("Thành công", "Dịch vụ đã được xóa.");
                        navigation.goBack();
                    }
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{service.name}</Text>
            <Text style={styles.detail}>💰 Giá: {service.price.toLocaleString()} ₫</Text>
            <Text style={styles.detail}>👤 Người làm: {service.worker}</Text>
            <Text style={styles.detail}>📌 Người tạo: {service.creator}</Text>
            <Text style={styles.detail}>📅 Ngày tạo: {new Date(service.createdAt).toLocaleString()}</Text>
            <Text style={styles.detail}>📅 Ngày cập nhật: {new Date(service.updatedAt).toLocaleString()}</Text>
            <Button
                mode="contained"
                icon="pencil"
                style={styles.button}
                onPress={() => {
                    if (service.TrangThai) {
                        Alert.alert("Không thể chỉnh sửa", "Dịch vụ đã có người đăng ký, không thể chỉnh sửa.");
                    } else {
                        navigation.navigate("EditService", { service });
                    }
                }}
            >
                Chỉnh sửa
            </Button>

            <Button
                mode="outlined"
                icon="delete"
                style={[styles.button, { borderColor: "red" }]}
                textColor="red"
                onPress={handleDelete}
            >
                Xóa
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
    },
    detail: {
        fontSize: 20,
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
    },
});

export default ServiceDetail;
