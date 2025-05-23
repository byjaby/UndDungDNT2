import React, { useState } from "react";
import { View, StyleSheet, Alert, Image, TouchableOpacity, PermissionsAndroid, Platform } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { launchImageLibrary } from "react-native-image-picker";
import { themPhong, useMyContextController } from "../../TrungTam";
import { Linking } from "react-native";

const openAppSettings = () => {
    Linking.openSettings();
};

const ThemPhong = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    const [tenPhong, setTenPhong] = useState("");
    const [chieuDai, setChieuDai] = useState("");
    const [chieuRong, setChieuRong] = useState("");
    const [giaPhong, setGiaPhong] = useState("");
    const [hinhAnh, setHinhAnh] = useState(null);

    const requestPermission = async () => {
        if (Platform.OS === "android") {
            try {
                const permission = Platform.Version >= 33
                    ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                    : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

                const granted = await PermissionsAndroid.request(permission);

                if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                    Alert.alert(
                        "Yêu cầu quyền",
                        "Bạn đã từ chối cấp quyền và chọn không hỏi lại. Vui lòng vào Cài đặt > Ứng dụng > [Tên ứng dụng] > Quyền để cấp quyền truy cập ảnh.",
                        [
                            { text: "Hủy" },
                            { text: "Mở Cài đặt", onPress: () => Linking.openSettings() },
                        ]
                    );
                    return false;
                }

                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (error) {
                console.warn("Lỗi khi xin quyền:", error);
                Alert.alert("Lỗi", "Không thể yêu cầu quyền truy cập: " + error.message);
                return false;
            }
        }
        return true;
    };

    const handleChooseImage = async () => {
        const hasPermission = await requestPermission();
        if (!hasPermission) {
            return;
        }
        const options = { mediaType: "photo", quality: 1 };
        launchImageLibrary(options, (response) => {
            console.log("Image Picker Response:", JSON.stringify(response, null, 2));

            if (response.didCancel) {
                console.log("Người dùng đã hủy chọn ảnh");
                return;
            }

            if (response.errorCode) {
                Alert.alert("Lỗi", `Không thể chọn ảnh: ${response.errorMessage || "Lỗi không xác định"}`);
                return;
            }

            const sourceUri = response.assets?.[0]?.uri;
            if (sourceUri) {
                setHinhAnh(sourceUri);
            } else {
                Alert.alert("Lỗi", "Không thể lấy đường dẫn ảnh.");
            }
        });
    };

    const handleAddPhong = async () => {
        if (!tenPhong || !chieuDai || !chieuRong || !giaPhong || !hinhAnh) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin và chọn ảnh.");
            return;
        }

        if (
            isNaN(chieuDai) || Number(chieuDai) <= 0 ||
            isNaN(chieuRong) || Number(chieuRong) <= 0 ||
            isNaN(giaPhong) || Number(giaPhong) <= 0
        ) {
            Alert.alert("Lỗi", "Chiều dài, chiều rộng, và giá phòng phải là số dương.");
            return;
        }

        const creatorId = userLogin?.user_id;
        if (!creatorId) {
            Alert.alert("Lỗi", "Không tìm thấy ID người dùng.");
            return;
        }

        const result = await themPhong(
            dispatch,
            tenPhong.trim(),
            Number(chieuDai),
            Number(chieuRong),
            Number(giaPhong),
            hinhAnh,
            "",
            creatorId
        );

        if (result.success) {
            Alert.alert("Thành công", "Đã thêm phòng mới.");
            navigation.goBack();
        } else {
            Alert.alert("Lỗi", result.message || "Không thể thêm phòng.");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="Tên phòng"
                value={tenPhong}
                onChangeText={setTenPhong}
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Chiều dài (m)"
                value={chieuDai}
                onChangeText={setChieuDai}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Chiều rộng (m)"
                value={chieuRong}
                onChangeText={setChieuRong}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Giá phòng (VNĐ)"
                value={giaPhong}
                onChangeText={setGiaPhong}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
            />

            <TouchableOpacity onPress={handleChooseImage} style={styles.imagePicker}>
                {hinhAnh ? (
                    <Image source={{ uri: hinhAnh }} style={styles.image} />
                ) : (
                    <Text style={styles.imagePlaceholder}>Chọn hình ảnh</Text>
                )}
            </TouchableOpacity>

            <Button
                mode="contained"
                onPress={handleAddPhong}
                style={styles.button}
                icon="plus"
            >
                Thêm
            </Button>
        </View>
    );
};

export default ThemPhong;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
        flex: 1,
    },
    input: {
        marginBottom: 16,
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
        color: "#888",
        fontSize: 16,
    },
    button: {
        backgroundColor: "#66E879",
        alignSelf: "center",
        paddingHorizontal: 20,
        marginTop: 10,
    },
});
