import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMyContextController, updateService } from "../store";

const EditService = ({ navigation, route }) => {
    const { service } = route.params;
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    const [name, setName] = useState(service.name);
    const [price, setPrice] = useState(service.price.toString());
    const [worker, setWorker] = useState(service.worker);
    const [startTime, setStartTime] = useState(new Date(service.startTime));
    const [endTime, setEndTime] = useState(new Date(service.endTime));
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    // Keeping track of the non-editable fields
    const [TrangThai] = useState(service.TrangThai);  // Keep status as a constant
    const [NguoiBook] = useState(service.NguoiBook); // Keep NguoiBook as a constant

    const handleUpdateService = async () => {
        if (!name || !price || !worker) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        const updatedService = {
            name,
            price: parseFloat(price),
            worker,
            updatedAt: new Date().toISOString()
        };

        await updateService(dispatch, service.id, updatedService);
        Alert.alert("Thành công", "Dịch vụ đã được cập nhật.");
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chỉnh sửa dịch vụ</Text>

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

            <Button mode="contained" style={{ marginTop: 20 }} onPress={handleUpdateService}>
                Cập nhật dịch vụ
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
    label: {
        marginTop: 10,
        marginBottom: 5,
        fontSize: 16,
        fontWeight: "600",
    },
});

export default EditService;
