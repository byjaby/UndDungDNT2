import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { themDV, useMyContextController } from "../../TrungTam";

const ThemDV = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    const [tenDV, setTenDV] = useState("");
    const [chiPhi, setChiPhi] = useState("");
    const [moTa, setMoTa] = useState("");

    const handleAddDichVu = async () => {
        if (!tenDV || !chiPhi || !moTa) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        if (isNaN(chiPhi) || Number(chiPhi) <= 0) {
            Alert.alert("Lỗi", "Chi phí phải là số lớn hơn 0.");
            return;
        }

        const creatorId = userLogin?.user_id;
        if (!creatorId) {
            Alert.alert("Lỗi", "Không tìm thấy ID người dùng.");
            return;
        }

        const result = await themDV(dispatch, tenDV, Number(chiPhi), moTa, creatorId);
        if (result.success) {
            Alert.alert("Thành công", `Đã thêm dịch vụ mới.`);
            navigation.goBack();
        } else {
            Alert.alert("Lỗi", result.message || "Thêm dịch vụ thất bại.");
        }
    };

    return (
        <View style={styles.container}>

            <TextInput
                label="Tên dịch vụ"
                value={tenDV}
                onChangeText={setTenDV}
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Chi phí (VNĐ)"
                value={chiPhi}
                onChangeText={setChiPhi}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Mô tả"
                value={moTa}
                onChangeText={setMoTa}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
            />
            <Button
                mode="contained"
                style={styles.button}
                onPress={handleAddDichVu}
            >
                Thêm
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
    button: {
        marginTop: 20,
        width: 100,
        alignSelf: "center",
        backgroundColor: "#343A40",
    },
});

export default ThemDV;
