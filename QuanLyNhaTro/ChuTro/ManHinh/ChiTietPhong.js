import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Image, ScrollView } from "react-native";
import { Button, Text, useTheme, Card, IconButton, Divider } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { useMyContextController } from "../../TrungTam";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ChiTietPhong = ({ route }) => {
    const theme = useTheme();
    const [controller, dispatch] = useMyContextController();
    const navigation = useNavigation();
    const { phong } = route.params;

    const [tenNguoiThue, setTenNguoiThue] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNguoiThue = async () => {
            if (phong.nguoiThue && phong.nguoiThue.trim() !== "") {
                try {
                    const doc = await firestore().collection("KhachThue").doc(phong.nguoiThue).get();
                    if (doc.exists) {
                        const data = doc.data();
                        setTenNguoiThue(data.fullName || "Không rõ");
                    } else {
                        setTenNguoiThue("Không tìm thấy");
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy tên người thuê:", error.message);
                    setTenNguoiThue("Lỗi tải");
                }
            }
        };

        fetchNguoiThue();
    }, [phong.nguoiThue]);

    const handleDelete = () => {
        if (phong.nguoiThue && phong.nguoiThue.trim() !== "") {
            Alert.alert(
                "Không thể xóa",
                "Phòng hiện đang có người thuê, không thể xóa.",
                [{ text: "Đã hiểu" }]
            );
            return;
        }

        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa phòng này?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await firestore().collection("Phong").doc(phong.id).delete();

                            await firestore()
                                .collection("ChuTro")
                                .doc(phong.creator)
                                .update({
                                    sLPhong: firestore.FieldValue.increment(-1),
                                });

                            Alert.alert(
                                "Thành công",
                                "Phòng đã được xóa thành công.",
                                [{ text: "OK", onPress: () => navigation.goBack() }]
                            );
                        } catch (error) {
                            console.log("Lỗi khi xóa phòng:", error.message);
                            Alert.alert("Lỗi", "Không thể xóa: " + error.message);
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const renderDetailRow = (icon, label, value) => (
        <View style={styles.detailRow}>
            <MaterialCommunityIcons
                name={icon}
                size={24}
                color={theme.colors.primary}
                style={styles.rowIcon}
            />
            <View style={styles.detailTextContainer}>
                <Text variant="bodyMedium" style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>
                    {label}
                </Text>
                <Text variant="bodyLarge" style={[styles.detailValue, { color: theme.colors.onSurface }]}>
                    {value || "Không có thông tin"}
                </Text>
            </View>
        </View>
    );

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            contentContainerStyle={styles.scrollContent}
        >
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <Image
                    source={{ uri: phong.hinhAnh || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <Card.Content>
                    <Text variant="titleLarge" style={[styles.title, { color: theme.colors.onSurface }]}>
                        {phong.tenPhong || "Phòng không tên"}
                    </Text>

                    <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />

                    {renderDetailRow(
                        "tape-measure",
                        "Diện tích",
                        `${phong.chieuDai || 0}m x ${phong.chieuRong || 0}m`
                    )}

                    {renderDetailRow(
                        "cash",
                        "Giá phòng",
                        phong.giaPhong != null ? `${phong.giaPhong.toLocaleString()} đ` : null
                    )}

                    {renderDetailRow(
                        phong.nguoiThue ? "account-check" : "home",
                        "Tình trạng",
                        phong.nguoiThue ? `Đang thuê: ${tenNguoiThue}` : "Phòng trống"
                    )}

                    {renderDetailRow(
                        "calendar-month",
                        "Ngày tạo",
                        phong.createdAt ? new Date(phong.createdAt.seconds * 1000).toLocaleDateString() : null
                    )}
                </Card.Content>
            </Card>

            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    icon="pencil"
                    onPress={() => navigation.navigate("SuaPhong", { phong })}
                    style={[styles.button, { backgroundColor: theme.colors.primary }]}
                    labelStyle={styles.buttonLabel}
                    contentStyle={styles.buttonContent}
                >
                    Chỉnh sửa
                </Button>

                <Button
                    mode="contained-tonal"
                    icon="delete"
                    onPress={handleDelete}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                    contentStyle={styles.buttonContent}
                    loading={loading}
                    disabled={loading}
                >
                    Xóa phòng
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 16,
    },
    card: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: 220,
    },
    title: {
        marginTop: 12,
        marginBottom: 8,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    divider: {
        marginVertical: 12,
        height: 1,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    rowIcon: {
        marginRight: 16,
    },
    detailTextContainer: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 14,
        opacity: 0.8,
    },
    detailValue: {
        fontSize: 16,
        marginTop: 2,
    },
    buttonContainer: {
        marginTop: 8,
    },
    button: {
        width: 140,
        alignSelf: "center",
        marginVertical: 8,
        borderRadius: 8,
    },
    buttonLabel: {
        fontSize: 16,
    },
    buttonContent: {
        height: 48,
    },
});

export default ChiTietPhong;