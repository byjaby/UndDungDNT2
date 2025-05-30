import React, { useState } from "react";
import { View, StyleSheet, Alert, Image, TouchableOpacity, PermissionsAndroid, Platform } from "react-native";
import { TextInput, Button, Text, useTheme, Card, IconButton, HelperText } from "react-native-paper";
import { launchImageLibrary } from "react-native-image-picker";
import { themPhong, useMyContextController } from "../../TrungTam";
import { Linking } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from "react-native-gesture-handler";

const openAppSettings = () => {
    Linking.openSettings();
};

const ThemPhong = ({ navigation }) => {
    const theme = useTheme();
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;
    const [tenPhong, setTenPhong] = useState("");
    const [chieuDai, setChieuDai] = useState("");
    const [chieuRong, setChieuRong] = useState("");
    const [giaPhong, setGiaPhong] = useState("");
    const [hinhAnh, setHinhAnh] = useState(null);
    const [errors, setErrors] = useState({
        tenPhong: false,
        chieuDai: false,
        chieuRong: false,
        giaPhong: false,
        hinhAnh: false
    });

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
                            { text: "Hủy", style: "cancel" },
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
        const options = {
            mediaType: "photo",
            quality: 1,
            selectionLimit: 1
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                return;
            }

            if (response.errorCode) {
                Alert.alert("Lỗi", `Không thể chọn ảnh: ${response.errorMessage || "Lỗi không xác định"}`);
                return;
            }

            const sourceUri = response.assets?.[0]?.uri;
            if (sourceUri) {
                setHinhAnh(sourceUri);
                setErrors({ ...errors, hinhAnh: false });
            } else {
                Alert.alert("Lỗi", "Không thể lấy đường dẫn ảnh.");
            }
        });
    };

    const validateForm = () => {
        const newErrors = {
            tenPhong: !tenPhong.trim(),
            chieuDai: !chieuDai || isNaN(chieuDai) || Number(chieuDai) <= 0,
            chieuRong: !chieuRong || isNaN(chieuRong) || Number(chieuRong) <= 0,
            giaPhong: !giaPhong || isNaN(giaPhong) || Number(giaPhong) <= 0,
            hinhAnh: !hinhAnh
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleAddPhong = async () => {
        if (!validateForm()) {
            Alert.alert("Lỗi", "Vui lòng kiểm tra lại thông tin nhập");
            return;
        }

        const creatorId = userLogin?.user_id;
        if (!creatorId) {
            Alert.alert("Lỗi", "Không tìm thấy ID người dùng.");
            return;
        }

        try {
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
                Alert.alert("Thành công", "Đã thêm phòng mới.", [
                    { text: "OK", onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert("Lỗi", result.message || "Không thể thêm phòng.");
            }
        } catch (error) {
            Alert.alert("Lỗi", "Đã xảy ra lỗi khi thêm phòng: " + error.message);
        }
    };

    return (
        <ScrollView>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Card style={[styles.card, { backgroundColor: "#E9C46A" }]}>
                    <Card.Content>
                        <Text variant="titleLarge" style={[styles.title]}>
                            Thêm phòng mới
                        </Text>

                        <Text style={styles.inputLabel}>Tên phòng</Text>
                        <TextInput
                            value={tenPhong}
                            onChangeText={(text) => {
                                setTenPhong(text);
                                setErrors({ ...errors, tenPhong: false });
                            }}
                            mode="outlined"
                            style={styles.input}
                            error={errors.tenPhong}
                            left={<TextInput.Icon icon="home" />}
                        />
                        {errors.tenPhong && (
                            <HelperText type="error" visible={errors.tenPhong}>
                                Vui lòng nhập tên phòng
                            </HelperText>
                        )}

                        <View style={styles.dimensionsRow}>
                            <View style={styles.dimensionInput}>
                                <Text style={styles.inputLabel}>Chiều dài (m)</Text>
                                <TextInput
                                    value={chieuDai}
                                    onChangeText={(text) => {
                                        setChieuDai(text);
                                        setErrors({ ...errors, chieuDai: false });
                                    }}
                                    keyboardType="numeric"
                                    mode="outlined"
                                    error={errors.chieuDai}
                                    left={<TextInput.Icon icon="arrow-expand-horizontal" />}
                                />

                            </View>

                            <View style={styles.dimensionInput}>
                                <Text style={styles.inputLabel}>Chiều rộng (m)</Text>
                                <TextInput
                                    value={chieuRong}
                                    onChangeText={(text) => {
                                        setChieuRong(text);
                                        setErrors({ ...errors, chieuRong: false });
                                    }}
                                    keyboardType="numeric"
                                    mode="outlined"
                                    error={errors.chieuRong}
                                    left={<TextInput.Icon icon="arrow-expand-vertical" />}
                                />
                                {errors.chieuRong && <HelperText type="error" visible={errors.chieuRong}>
                                    Giá trị không hợp lệ
                                </HelperText>}
                            </View>
                        </View>
                        <Text style={styles.inputLabel}>Giá phòng (VNĐ)</Text>

                        <TextInput
                            value={giaPhong}
                            onChangeText={(text) => {
                                setGiaPhong(text);
                                setErrors({ ...errors, giaPhong: false });
                            }}
                            keyboardType="numeric"
                            mode="outlined"
                            style={styles.input}
                            error={errors.giaPhong}
                            left={<TextInput.Icon icon="cash" />}
                        />
                        {errors.giaPhong && <HelperText type="error" visible={errors.giaPhong}>
                            Giá trị không hợp lệ
                        </HelperText>}

                        <TouchableOpacity
                            onPress={handleChooseImage}
                            style={[
                                styles.imagePicker,
                                { borderColor: errors.hinhAnh ? theme.colors.error : "#fff" }
                            ]}
                        >
                            {hinhAnh ? (
                                <Image source={{ uri: hinhAnh }} style={styles.image} />
                            ) : (
                                <View style={styles.imagePlaceholder}>
                                    <MaterialCommunityIcons
                                        name="image-plus"
                                        size={40}
                                        color={"#fff"}
                                    />
                                    <Text style={[styles.imagePlaceholderText, { color: "#fff" }]}>
                                        Chọn hình ảnh phòng
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        {errors.hinhAnh && <HelperText type="error" visible={errors.hinhAnh}>
                            Vui lòng chọn ảnh phòng
                        </HelperText>}
                    </Card.Content>
                </Card>

                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={handleAddPhong}
                        style={[styles.button, { backgroundColor: theme.colors.primary }]}
                        icon="check"
                        labelStyle={styles.buttonLabel}
                        contentStyle={styles.buttonContent}
                    >
                        Thêm phòng
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={() => navigation.goBack()}
                        style={[styles.button, { borderColor: theme.colors.outline }]}
                        icon="close"
                        labelStyle={[styles.buttonLabel, { color: theme.colors.onSurface }]}
                        contentStyle={styles.buttonContent}
                    >
                        Hủy bỏ
                    </Button>
                </View>

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 16,
    },
    card: {
        marginBottom: 16,
        borderRadius: 12,
        elevation: 2,
    },
    title: {
        color: "#fff",
        marginBottom: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
        marginLeft: 4,
    },
    input: {
        marginBottom: 8,
    },
    dimensionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    dimensionInput: {
        width: '48%',
    },
    imagePicker: {
        height: 180,
        borderRadius: 8,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
        overflow: 'hidden',
    },
    image: {
        width: "100%",
        height: "100%",
    },
    imagePlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    imagePlaceholderText: {
        marginTop: 8,
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        paddingHorizontal: 16,
        gap: 12,
    },

    confirmButton: {
        flex: 1,
        backgroundColor: '#1976D2', // màu xanh dương (primary)
        borderRadius: 16,
        elevation: 2,
    },

    cancelButton: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#BDBDBD', // màu xám viền
        borderRadius: 16,
        backgroundColor: '#FFFFFF', // màu nền trắng
    },

    buttonLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF', // chữ trắng cho nút xác nhận
    },

    cancelButtonLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212121', // chữ đen cho nút hủy
    },

    buttonContent: {
        height: 50,
        justifyContent: 'center',
    },
});

export default ThemPhong;