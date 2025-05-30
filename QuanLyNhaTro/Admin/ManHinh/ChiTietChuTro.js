import React, { useEffect } from "react";
import { View, Text, StyleSheet, Alert, ScrollView, StatusBar } from "react-native";
import { Button, Card, Avatar, Divider } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { useMyContextController } from "../../TrungTam";
import auth from "@react-native-firebase/auth";
import LinearGradient from 'react-native-linear-gradient';

const ChiTietChuTro = ({ route }) => {
    const [controller, dispatch] = useMyContextController();
    const navigation = useNavigation();
    const { user } = route.params;

    const [creatorName, setCreatorName] = React.useState("Đang tải...");
    console.log("ID người tạo (creator):", user.creator);
    console.log("user.id: ", user.id);

    const deleteUser = async () => {
        try {
            await firestore().collection("ChuTro").doc(user.id).delete();
            Alert.alert("Thành công", "Đã xóa chủ trọ.");
            dispatch({ type: 'RELOAD_CHUTRO' });
            navigation.goBack();
        } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa: " + error.message);
            console.log(error.message);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa chủ trọ này?",
            [
                { text: "Hủy", style: "cancel" },
                { text: "Xóa", style: "destructive", onPress: deleteUser }
            ]
        );
    };

    const resetPassword = async () => {
        try {
            await auth().sendPasswordResetEmail(user.email);
            Alert.alert(
                "Thành công",
                "Đã gửi email đặt lại mật khẩu đến: " + user.email
            );
        } catch (error) {
            console.error("Lỗi khi gửi email reset password:", error);
            Alert.alert("Lỗi", "Không thể gửi email: " + error.message);
        }
    };

    useEffect(() => {
        const fetchCreatorName = async () => {
            if (user.creator) {
                try {
                    const adminDoc = await firestore()
                        .collection("Admin")
                        .doc(user.creator)
                        .get();

                    if (adminDoc.exists) {
                        const adminData = adminDoc.data();
                        setCreatorName(adminData?.hoTen || "Không rõ");
                    } else {
                        setCreatorName("Không tìm thấy");
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy thông tin Admin:", error);
                    setCreatorName("Lỗi");
                }
            } else {
                setCreatorName("Không có");
            }
        };

        fetchCreatorName();
    }, [user.creator]);

    const InfoRow = ({ icon, label, value }) => (
        <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>{icon}</Text>
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value || "Chưa có"}</Text>
            </View>
        </View>
    );

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
            <LinearGradient
                colors={['#CCD5AE', '#E9EDC9', '#FEFAE0']}
                style={styles.container}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Header Section */}
                    <View style={styles.header}>
                        <Avatar.Text
                            size={80}
                            label={user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                            style={styles.avatar}
                            labelStyle={styles.avatarLabel}
                        />
                        <Text style={styles.title}>Chi tiết chủ trọ</Text>
                        <Text style={styles.subtitle}>{user.fullName || "Người dùng"}</Text>
                    </View>

                    {/* Info Card */}
                    <Card style={styles.infoCard}>
                        <Card.Content style={styles.cardContent}>
                            <InfoRow
                                icon="👤"
                                label="Họ tên"
                                value={user.fullName}
                            />
                            <Divider style={styles.divider} />

                            <InfoRow
                                icon="📧"
                                label="Email"
                                value={user.email}
                            />
                            <Divider style={styles.divider} />

                            <InfoRow
                                icon="📱"
                                label="Số điện thoại"
                                value={user.phone}
                            />
                            <Divider style={styles.divider} />

                            <InfoRow
                                icon="🏠"
                                label="Tên nhà trọ"
                                value={user.tenTro}
                            />
                            <Divider style={styles.divider} />

                            <InfoRow
                                icon="🚪"
                                label="Số lượng phòng"
                                value={user.sLPhong}
                            />
                            <Divider style={styles.divider} />

                            <InfoRow
                                icon="📍"
                                label="Địa chỉ"
                                value={user.address}
                            />
                            <Divider style={styles.divider} />

                            <InfoRow
                                icon="👨‍💼"
                                label="Người tạo"
                                value={creatorName}
                            />
                            <Divider style={styles.divider} />

                            <InfoRow
                                icon="📅"
                                label="Ngày tạo"
                                value={user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : "Không rõ"}
                            />
                        </Card.Content>
                    </Card>

                    {/* Action Buttons */}
                    <View style={styles.actionContainer}>
                        <Button
                            mode="contained"
                            icon="pencil"
                            onPress={() => navigation.navigate("SuaChuTro", { user })}
                            style={styles.editButton}
                            contentStyle={styles.buttonContent}
                            labelStyle={styles.buttonLabel}
                        >
                            Chỉnh sửa
                        </Button>

                        <Button
                            mode="contained"
                            icon="lock-reset"
                            onPress={resetPassword}
                            style={styles.resetButton}
                            contentStyle={styles.buttonContent}
                            labelStyle={styles.buttonLabel}
                        >
                            Đặt lại mật khẩu
                        </Button>

                        <Button
                            mode="contained"
                            icon="delete"
                            onPress={handleDelete}
                            style={styles.deleteButton}
                            contentStyle={styles.buttonContent}
                            labelStyle={styles.buttonLabel}
                        >
                            Xóa
                        </Button>
                    </View>
                </ScrollView>
            </LinearGradient>
        </>
    );
};

export default ChiTietChuTro;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    avatar: {
        backgroundColor: '#4CAF50',
        marginBottom: 15,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    avatarLabel: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#344E41",
        marginBottom: 5,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: "#344E41",
        textAlign: 'center',
    },
    infoCard: {
        margin: 20,
        borderRadius: 20,
        elevation: 12,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    cardContent: {
        padding: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#f0f4f8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    icon: {
        fontSize: 20,
    },
    infoContent: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        color: "#666",
        marginBottom: 2,
        fontWeight: '500',
    },
    value: {
        fontSize: 16,
        color: "#2c3e50",
        fontWeight: '600',
    },
    divider: {
        backgroundColor: '#C9ADA7',
        height: 1,
        marginVertical: 5,
    },
    actionContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        gap: 15,
    },
    editButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 15,
        elevation: 6,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    resetButton: {
        backgroundColor: '#2196F3',
        borderRadius: 15,
        elevation: 6,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    deleteButton: {
        backgroundColor: '#f44336',
        borderRadius: 15,
        elevation: 6,
        shadowColor: '#f44336',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});