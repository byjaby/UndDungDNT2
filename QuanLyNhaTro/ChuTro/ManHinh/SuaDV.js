import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useMyContextController } from "../../TrungTam";

const SuaDV = ({ route }) => {
    const navigation = useNavigation();
    const { dichVu } = route.params;
    const [tenDV, setTenDV] = useState(dichVu.tenDV || "");
    const [chiPhi, setChiPhi] = useState(dichVu.chiPhi?.toString() || "");
    const [moTa, setMoTa] = useState(dichVu.moTa || "");

    const isDefaultService = ["điện", "nước"].includes(tenDV.trim().toLowerCase());

    const handleSave = async () => {
        const tenDVTrimmed = tenDV.trim();
        const tenDVLower = tenDVTrimmed.toLowerCase();

        if (!tenDVTrimmed) {
            Alert.alert("Lỗi", "Vui lòng nhập tên dịch vụ.");
            return;
        }

        const chiPhiValue = parseInt(chiPhi, 10);
        if (isNaN(chiPhiValue) || chiPhiValue < 0) {
            Alert.alert("Lỗi", "Chi phí phải là số không âm.");
            return;
        }

        try {
            // Kiểm tra tên dịch vụ (không phân biệt hoa thường)
            const snapshot = await firestore()
                .collection("DichVu")
                .where("tenDVLower", "==", tenDVLower)
                .where("creator", "==", dichVu.creator)
                .get();

            const isDuplicate = snapshot.docs.some(doc => doc.id !== dichVu.id);

            if (isDuplicate) {
                Alert.alert("Lỗi", "Tên dịch vụ đã tồn tại.");
                return;
            }

            // Cập nhật nếu không trùng
            await firestore().collection("DichVu").doc(dichVu.id).update({
                tenDV: tenDVTrimmed,
                tenDVLower,
                chiPhi: chiPhiValue,
                moTa: moTa.trim(),
                updatedAt: firestore.FieldValue.serverTimestamp()
            });

            Alert.alert("Thành công", "Dịch vụ đã được cập nhật.");
            navigation.navigate("DSDV");
        } catch (error) {
            console.log("Lỗi khi cập nhật:", error.message);
            Alert.alert("Lỗi", "Không thể cập nhật: " + error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TextInput
                label="Tên dịch vụ"
                value={tenDV}
                onChangeText={setTenDV}
                mode="outlined"
                style={styles.input}
                disabled={isDefaultService} // ✅ Không cho sửa
            />

            <TextInput
                label="Chi phí"
                value={chiPhi}
                onChangeText={setChiPhi}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
            />

            <TextInput
                label="Mô tả"
                value={moTa}
                onChangeText={setMoTa}
                mode="outlined"
                multiline
                style={[styles.input, { height: 100 }]}
            />

            <Button
                mode="contained"
                onPress={handleSave}
                style={styles.button}
                icon="content-save"
            >
                Lưu
            </Button>
        </ScrollView>
    );
};

export default SuaDV;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        alignSelf: "center",
        color: "#3f51b5",
    },
    input: {
        marginBottom: 16,
    },
    button: {
        alignSelf: 'center',
        width: 120,
        marginTop: 20,
        backgroundColor: "#66E879",
    },
});
