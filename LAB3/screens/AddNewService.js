import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { addService, useMyContextController } from "../store";

const AddNewService = ({ navigation }) => {

    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [worker, setWorker] = useState("");

    const handleAddService = async () => {
        if (!name || !price || !worker) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        const timestamp = new Date().toISOString();
        const newService = {
            name,
            price: parseFloat(price),
            worker,
            creator: userLogin?.fullName || "Unknown",
            createdAt: timestamp,
            updatedAt: timestamp
        };
        await addService(dispatch, newService);
        Alert.alert("Thành công", "Đã thêm dịch vụ.");
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thêm dịch vụ mới</Text>
            <TextInput
                label="Tên dịch vụ"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Giá (VND)"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Người làm"
                value={worker}
                onChangeText={setWorker}
                mode="outlined"
                style={styles.input}
            />
            <Button mode="contained" style={{ marginTop: 20 }} onPress={handleAddService}>
                Thêm dịch vụ
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        marginBottom: 16,
    },
});

export default AddNewService;