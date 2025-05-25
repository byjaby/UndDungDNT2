import React, { useState } from "react";
import {
    View, StyleSheet, Alert, ScrollView, Image, TouchableOpacity, PermissionsAndroid, Platform
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { launchImageLibrary } from "react-native-image-picker";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Linking } from "react-native";

const SuaPhong = ({ route }) => {
    const navigation = useNavigation();
    const { phong } = route.params;

    const [tenPhong, setTenPhong] = useState(phong.tenPhong || "");
    const [giaPhong, setGiaPhong] = useState(phong.giaPhong?.toString() || "");
    const [chieuDai, setChieuDai] = useState(phong.chieuDai?.toString() || "");
    const [chieuRong, setChieuRong] = useState(phong.chieuRong?.toString() || "");
    const [hinhAnh, setHinhAnh] = useState(phong.hinhAnh || ""); // đường dẫn ảnh cũ
    const [newImageUri, setNewImageUri] = useState(null); // ảnh mới được chọn

    const requestPermission = async () => {
        if (Platform.OS === "android") {
            try {
                const permission = Platform.Version >= 33
                    ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                    : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

                const granted = await PermissionsAndroid.request(permission);
                if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                    Alert.alert("Yêu cầu quyền", "Vui lòng cấp quyền truy cập ảnh trong phần Cài đặt.", [
                        { text: "Hủy" },
                        { text: "Mở Cài đặt", onPress: () => Linking.openSettings() },
                    ]);
                    return false;
                }
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (error) {
                console.warn("Lỗi xin quyền:", error);
                return false;
            }
        }
        return true;
    };

    const handleChooseImage = async () => {
        const hasPermission = await requestPermission();
        if (!hasPermission) return;

        launchImageLibrary({ mediaType: "photo", quality: 1 }, (response) => {
            if (response.didCancel) return;
            if (response.errorCode) {
                Alert.alert("Lỗi", `Không thể chọn ảnh: ${response.errorMessage || "Lỗi không xác định"}`);
                return;
            }

            const uri = response.assets?.[0]?.uri;
            if (uri) {
                setNewImageUri(uri); // ảnh mới
            } else {
                Alert.alert("Lỗi", "Không thể lấy đường dẫn ảnh.");
            }
        });
    };

    const handleSave = async () => {
        if (!tenPhong.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập tên phòng.");
            return;
        }

        const gia = parseInt(giaPhong, 10);
        const dai = parseFloat(chieuDai);
        const rong = parseFloat(chieuRong);

        if (isNaN(gia) || gia < 0) {
            Alert.alert("Lỗi", "Giá phòng phải là số không âm.");
            return;
        }

        if (isNaN(dai) || dai <= 0 || isNaN(rong) || rong <= 0) {
            Alert.alert("Lỗi", "Chiều dài và chiều rộng phải là số dương.");
            return;
        }

        try {
            await firestore().collection("Phong").doc(phong.id).update({
                tenPhong: tenPhong.trim(),
                giaPhong: gia,
                chieuDai: dai,
                chieuRong: rong,
                hinhAnh: newImageUri || hinhAnh, // dùng ảnh mới nếu có, ngược lại dùng ảnh cũ
                updatedAt: firestore.FieldValue.serverTimestamp()
            });

            Alert.alert("Thành công", "Phòng đã được cập nhật.");
            navigation.navigate("DSPhong")
        } catch (error) {
            console.log("Lỗi khi cập nhật:", error.message);
            Alert.alert("Lỗi", "Không thể cập nhật: " + error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TextInput
                label="Tên phòng"
                value={tenPhong}
                onChangeText={setTenPhong}
                mode="outlined"
                style={styles.input}
            />

            <TextInput
                label="Giá phòng"
                value={giaPhong}
                onChangeText={setGiaPhong}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
            />

            <TextInput
                label="Chiều dài (m)"
                value={chieuDai}
                onChangeText={setChieuDai}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
            />

            <TextInput
                label="Chiều rộng (m)"
                value={chieuRong}
                onChangeText={setChieuRong}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
            />

            <TouchableOpacity onPress={handleChooseImage} style={styles.imagePicker}>
                <Image
                    source={{ uri: newImageUri || hinhAnh }}
                    style={styles.image}
                />
                {!newImageUri && !hinhAnh && (
                    <Text style={styles.imagePlaceholder}>Chọn hình ảnh</Text>
                )}
            </TouchableOpacity>

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

export default SuaPhong;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    input: {
        marginBottom: 16,
    },
    button: {
        alignSelf: "center",
        width: 120,
        marginTop: 20,
        backgroundColor: "#66E879",
    },
    imagePicker: {
        height: 150,
        borderRadius: 8,
        borderColor: "#ccc",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
    imagePlaceholder: {
        position: "absolute",
        color: "#888",
        fontSize: 16,
    },
});
