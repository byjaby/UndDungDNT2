import React, { useState, useRef } from "react";
import {
    View,
    StyleSheet,
    Alert,
    ScrollView,
    Animated,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    StatusBar
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { themChuTro, useMyContextController } from "../../TrungTam";

const ThemChuTro = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handleAddChuTro = async () => {
        const newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        if (!fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ tên';
        }

        if (!email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!phoneRegex.test(phone)) {
            newErrors.phone = 'Số điện thoại phải có 10 chữ số';
        }

        if (!address.trim()) {
            newErrors.address = 'Vui lòng nhập địa chỉ';
        } else if (address.trim().length < 5) {
            newErrors.address = 'Địa chỉ quá ngắn';
        }

        if (!password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            Alert.alert("Thông báo", "Vui lòng sửa các lỗi trước khi tiếp tục.");
            return;
        }

        setLoading(true);
        const creatorId = userLogin?.user_id || null;

        try {
            const result = await themChuTro(dispatch, fullName, email, password, phone, address, creatorId);
            if (result.success) {
                Alert.alert(
                    "Thành công",
                    "Đã thêm chủ trọ mới thành công!",
                    [{ text: "OK", onPress: () => navigation.goBack() }]
                );
            } else {
                Alert.alert("Lỗi", result.message || "Thêm chủ trọ thất bại.");
            }
        } catch (error) {
            Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
            <View
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <Animated.View
                    style={[
                        styles.header,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name="arrow-left" size={24} color="#1e293b" />
                    </TouchableOpacity>
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>Thêm Chủ Trọ Mới</Text>
                        <Text style={styles.subtitle}>Điền thông tin để tạo tài khoản chủ trọ</Text>
                    </View>
                </Animated.View>

                <ScrollView
                    style={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Animated.View
                        style={[
                            styles.formContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        {/* Họ và tên */}
                        <Text style={styles.fieldLabel}>Họ và tên *</Text>
                        <TextInput
                            value={fullName}
                            onChangeText={setFullName}
                            mode="outlined"
                            style={styles.textInput}
                            error={!!errors.fullName}
                        />
                        {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

                        {/* Email */}
                        <Text style={styles.fieldLabel}>Email *</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            mode="outlined"
                            style={styles.textInput}
                            error={!!errors.email}
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                        {/* Mật khẩu */}
                        <Text style={styles.fieldLabel}>Mật khẩu *</Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            mode="outlined"
                            style={styles.textInput}
                            error={!!errors.password}
                        />
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                        {/* Số điện thoại */}
                        <Text style={styles.fieldLabel}>Số điện thoại *</Text>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            mode="outlined"
                            style={styles.textInput}
                            error={!!errors.phone}
                        />
                        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

                        {/* Địa chỉ */}
                        <Text style={styles.fieldLabel}>Địa chỉ *</Text>
                        <TextInput
                            value={address}
                            onChangeText={setAddress}
                            mode="outlined"
                            style={styles.textInput}
                            multiline
                            error={!!errors.address}
                        />
                        {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

                        {/* Nút Thêm Chủ Trọ */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.submitButton,
                                    loading && styles.submitButtonDisabled
                                ]}
                                onPress={handleAddChuTro}
                                disabled={loading}
                                activeOpacity={0.8}
                            >
                                {loading ? (
                                    <View style={styles.loadingContainer}>
                                        <Text style={styles.submitButtonText}>Đang xử lý...</Text>
                                    </View>
                                ) : (
                                    <>
                                        <Icon name="plus" size={20} color="#ffffff" />
                                        <Text style={styles.submitButtonText}>Thêm Chủ Trọ</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },
    header: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#CBD5E1',
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    headerContent: {
        flex: 1,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 15,
        color: '#64748B',
    },
    scrollContainer: {
        flex: 1,
    },
    formContainer: {
        padding: 24,
    },
    fieldContainer: {
        marginBottom: 22,
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1E293B',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#FFFFFF',
        fontSize: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        paddingVertical: 14,
        paddingHorizontal: 18,
        color: '#0F172A',
    },
    inputError: {
        borderColor: '#EF4444',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 13,
        marginTop: 4,
        fontWeight: '500',
    },
    buttonContainer: {
        marginTop: 36,
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    submitButtonDisabled: {
        backgroundColor: '#94A3B8',
        shadowOpacity: 0.1,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default ThemChuTro;