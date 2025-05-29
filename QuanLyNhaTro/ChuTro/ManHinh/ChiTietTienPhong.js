import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ScrollView, Dimensions, Platform, Alert } from "react-native";
import { Text, Button, Card, Divider, IconButton } from "react-native-paper";
import { useMyContextController } from "../../TrungTam";
import firestore from '@react-native-firebase/firestore';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window');

const ChiTietTienPhong = ({ route }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;
    const navigation = useNavigation();
    const { tienPhong } = route.params;
    const [lichSuKhac, setLichSuKhac] = useState([]);
    const [lichSuHienTaiId, setLichSuHienTaiId] = useState(null);

    useEffect(() => {
        if (!tienPhong?.id) return;

        const fetchLichSuTienPhong = async () => {
            try {
                const snapshot = await firestore()
                    .collection("LichSuTienPhong")
                    .where("tienPhongId", "==", tienPhong.id)
                    .get();

                const allRecords = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(0),
                }));

                if (allRecords.length === 0) {
                    setLichSuKhac([]);
                    setLichSuHienTaiId(null);
                    return;
                }

                const newestRecord = allRecords.reduce((latest, current) => {
                    return current.createdAt > latest.createdAt ? current : latest;
                }, allRecords[0]);

                const otherRecords = allRecords.filter(record => record.id !== newestRecord.id);

                setLichSuKhac(otherRecords);
                setLichSuHienTaiId(newestRecord.id); // ✅ Lưu ID bản ghi tương ứng
            } catch (error) {
                console.error("Lỗi khi lấy lịch sử tiền phòng:", error);
                setLichSuKhac([]);
                setLichSuHienTaiId(null);
            }
        };

        fetchLichSuTienPhong();
    }, [tienPhong]);

    const handleEdit = (tienPhong) => {
        navigation.navigate("SuaTienPhong", {
            tienPhong,
            lichSuId: lichSuHienTaiId
        });
    };

    const handlePrint = async (record) => {
        try {
            const createdAtDate = record.createdAt?.toDate ? record.createdAt.toDate() : (
                record.createdAt instanceof Date ? record.createdAt : null
            );

            const formattedDate = createdAtDate
                ? createdAtDate.toLocaleDateString('vi-VN')
                : 'Không rõ';
            const htmlContent = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Hóa đơn tiền phòng</h1>
        <p><strong>Phòng:</strong> ${record.tenPhong || 'Không rõ'}</p>
        <p><strong>Người thuê:</strong> ${record.tenNguoiThue || 'Không rõ'}</p>
        <p><strong>Ngày lập:</strong> ${formattedDate}</p>

        <table>
          <tr>
            <th>Mục</th>
            <th>Chi tiết</th>
          </tr>
          <tr>
            <td>Giá phòng</td>
            <td>${formatCurrency(record.giaPhong)}</td>
          </tr>
          <tr>
            <td>Tiền dịch vụ</td>
            <td>${formatCurrency(record.tienDichVu)}</td>
          </tr>
          <tr>
            <td>Chỉ số điện</td>
            <td>${record.chiSoDienCu} → ${record.chiSoDienMoi} (${record.chiSoDienMoi - record.chiSoDienCu} kWh)</td>
          </tr>
          <tr>
            <td>Chỉ số nước</td>
            <td>${record.chiSoNuocCu} → ${record.chiSoNuocMoi} (${record.chiSoNuocMoi - record.chiSoNuocCu} m³)</td>
          </tr>
          <tr class="total">
            <td>Tổng tiền</td>
            <td>${formatCurrency(record.tongTien)}</td>
          </tr>
        </table>
      </body>
      </html>
    `;

            // Tạo file PDF
            const options = {
                html: htmlContent,
                fileName: `HoaDon_TienPhong_${record.tenPhong || 'Unknown'}`,
                directory: 'Documents',
            };

            const file = await RNHTMLtoPDF.convert(options);

            Alert.alert('Tạo PDF thành công', `Đường dẫn: ${file.filePath}`, [
                {
                    text: 'Mở PDF',
                    onPress: () => {
                        // Mở file PDF bằng app xem file của hệ thống hoặc share
                        if (Platform.OS === 'ios') {
                            Share.open({ url: file.filePath });
                        } else {
                            Share.open({ url: `file://${file.filePath}` });
                        }
                    },
                },
                { text: 'Đóng' },
            ]);
        } catch (error) {
            console.error('Lỗi tạo PDF:', error);
            Alert.alert('Lỗi', 'Không thể tạo file PDF. Vui lòng thử lại.');
        }
    };

    const formatCurrency = (amount) => {
        return amount?.toLocaleString('vi-VN') + ' ₫' || '0 ₫';
    };

    const InfoRow = ({ icon, label, value, highlight = false }) => (
        <View style={styles.infoRow}>
            <View style={styles.infoLabel}>
                <Text style={[styles.labelText, highlight && styles.highlightLabel]}>{label}</Text>
            </View>
            <Text style={[styles.valueText, highlight && styles.highlightValue]}>{value}</Text>
        </View>
    );

    const renderLichSuItem = ({ item, index }) => {
        const date = item.createdAt ? item.createdAt.toLocaleDateString('vi-VN') : "Không rõ";

        return (
            <Card style={[styles.historyCard, { marginTop: index === 0 ? 0 : 12 }]} elevation={2}>
                <Card.Content style={styles.historyCardContent}>
                    <View style={styles.historyHeader}>
                        <View style={styles.historyBadge}>
                            <Text style={styles.historyBadgeText}>#{index + 1}</Text>
                        </View>
                        <Text style={styles.historyDate}>{date}</Text>
                    </View>

                    <View style={styles.historyInfo}>
                        <InfoRow label="Phòng" value={item.tenPhong ?? "Không rõ"} />
                        <InfoRow label="Người thuê" value={item.tenNguoiThue ?? "Không rõ"} />
                        <InfoRow label="Giá phòng" value={formatCurrency(item.giaPhong)} />

                        <View style={styles.meterSection}>
                            <Text style={styles.meterTitle}>📊 Chỉ số</Text>
                            <View style={styles.meterRow}>
                                <View style={styles.meterItem}>
                                    <Text style={styles.meterLabel}>⚡ Điện</Text>
                                    <Text style={styles.meterValue}>{item.chiSoDienCu} → {item.chiSoDienMoi}</Text>
                                </View>
                                <View style={styles.meterItem}>
                                    <Text style={styles.meterLabel}>💧 Nước</Text>
                                    <Text style={styles.meterValue}>{item.chiSoNuocCu} → {item.chiSoNuocMoi}</Text>
                                </View>
                            </View>
                        </View>

                        <Divider style={styles.divider} />

                        <InfoRow label="Tiền dịch vụ" value={formatCurrency(item.tienDichVu)} />
                        <InfoRow label="Tổng tiền" value={formatCurrency(item.tongTien)} highlight />
                    </View>

                    <View style={styles.historyActions}>
                        <Button
                            mode="outlined"
                            onPress={() => handlePrint(item)}
                            style={styles.printButton}
                            labelStyle={styles.printButtonLabel}
                            icon="printer"
                            compact
                        >
                            In hóa đơn
                        </Button>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View style={styles.headerSection}>
                <View style={styles.headerDecoration} />
                <Text style={styles.headerTitle}>Chi tiết tiền phòng</Text>
                <Text style={styles.headerSubtitle}>Thông tin thanh toán hiện tại</Text>
            </View>

            {/* Main Info Card */}
            <Card style={styles.mainCard} elevation={8}>
                <Card.Content style={styles.mainCardContent}>
                    <View style={styles.roomHeader}>
                        <View style={styles.roomBadge}>
                            <Text style={styles.roomBadgeText}>🏠</Text>
                        </View>
                        <View style={styles.roomInfo}>
                            <Text style={styles.roomName}>{tienPhong?.tenPhong ?? "Không rõ"}</Text>
                            <Text style={styles.tenantName}>{tienPhong.tenNguoiThue}</Text>
                        </View>
                        <View style={styles.dateInfo}>
                            <Text style={styles.dateLabel}>Ngày lập</Text>
                            <Text style={styles.dateValue}>
                                {tienPhong.createdAt?.toDate?.().toLocaleDateString('vi-VN') || "Không rõ"}
                            </Text>
                        </View>
                    </View>

                    <Divider style={styles.mainDivider} />

                    <View style={styles.priceSection}>
                        <InfoRow label="💰 Giá phòng" value={formatCurrency(tienPhong.giaPhong)} />
                        <InfoRow label="🔧 Tiền dịch vụ" value={formatCurrency(tienPhong.tienDichVu)} />
                    </View>

                    <View style={styles.meterSection}>
                        <Text style={styles.meterTitle}>📊 Chỉ số tiêu thụ</Text>
                        <View style={styles.meterRow}>
                            <View style={styles.meterItem}>
                                <Text style={styles.meterLabel}>⚡ Điện</Text>
                                <Text style={styles.meterValue}>
                                    {tienPhong.chiSoDienCu} → {tienPhong.chiSoDienMoi}
                                </Text>
                                <Text style={styles.meterUsage}>
                                    ({(tienPhong.chiSoDienMoi - tienPhong.chiSoDienCu)} kWh)
                                </Text>
                            </View>
                            <View style={styles.meterItem}>
                                <Text style={styles.meterLabel}>💧 Nước</Text>
                                <Text style={styles.meterValue}>
                                    {tienPhong.chiSoNuocCu} → {tienPhong.chiSoNuocMoi}
                                </Text>
                                <Text style={styles.meterUsage}>
                                    ({(tienPhong.chiSoNuocMoi - tienPhong.chiSoNuocCu)} m³)
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Divider style={styles.mainDivider} />

                    <View style={styles.totalSection}>
                        <Text style={styles.totalLabel}>Tổng cộng</Text>
                        <Text style={styles.totalValue}>{formatCurrency(tienPhong.tongTien)}</Text>
                    </View>

                    <View style={styles.mainActions}>
                        <Button
                            mode="contained"
                            onPress={() => handleEdit(tienPhong)}
                            style={styles.editButton}
                            labelStyle={styles.editButtonLabel}
                            icon="pencil"
                        >
                            Chỉnh sửa
                        </Button>

                        <Button
                            mode="outlined"
                            onPress={() => handlePrint(tienPhong)}
                            style={styles.printButton}
                            labelStyle={styles.printButtonLabel}
                            icon="printer"
                        >
                            In hóa đơn
                        </Button>
                    </View>
                </Card.Content>
            </Card>

            {/* History Section */}
            <View style={styles.historySection}>
                <View style={styles.historySectionHeader}>
                    <Text style={styles.historySectionTitle}>📋 Lịch sử thanh toán</Text>
                    <Text style={styles.historySectionSubtitle}>
                        {lichSuKhac.length} bản ghi trước đó
                    </Text>
                </View>

                {lichSuKhac.length > 0 ? (
                    <FlatList
                        data={lichSuKhac}
                        keyExtractor={(item) => item.id}
                        renderItem={renderLichSuItem}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <Card style={styles.emptyCard} elevation={2}>
                        <Card.Content style={styles.emptyCardContent}>
                            <Text style={styles.emptyIcon}>📝</Text>
                            <Text style={styles.emptyText}>Chưa có lịch sử thanh toán nào khác</Text>
                            <Text style={styles.emptySubText}>
                                Các kỳ thanh toán trước sẽ được hiển thị tại đây
                            </Text>
                        </Card.Content>
                    </Card>
                )}
            </View>
        </ScrollView>
    );
};

export default ChiTietTienPhong;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    headerSection: {
        backgroundColor: "#667eea",
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        position: "relative",
        overflow: "hidden",
    },
    headerDecoration: {
        position: "absolute",
        top: -50,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: "#ffffff",
        textAlign: "center",
        opacity: 0.9,
    },
    mainCard: {
        marginHorizontal: 16,
        marginTop: -20,
        borderRadius: 20,
        backgroundColor: "#ffffff",
    },
    mainCardContent: {
        padding: 20,
    },
    roomHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    roomBadge: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#667eea",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    roomBadgeText: {
        fontSize: 20,
    },
    roomInfo: {
        flex: 1,
    },
    roomName: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1a202c",
        marginBottom: 4,
    },
    tenantName: {
        fontSize: 16,
        color: "#718096",
    },
    dateInfo: {
        alignItems: "flex-end",
    },
    dateLabel: {
        fontSize: 12,
        color: "#a0aec0",
        marginBottom: 2,
    },
    dateValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#4a5568",
    },
    mainDivider: {
        marginVertical: 20,
        backgroundColor: "#e2e8f0",
    },
    priceSection: {
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    infoLabel: {
        flex: 1,
    },
    labelText: {
        fontSize: 16,
        color: "#4a5568",
        fontWeight: "500",
    },
    highlightLabel: {
        color: "#667eea",
        fontWeight: "600",
    },
    valueText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1a202c",
        textAlign: "right",
    },
    highlightValue: {
        color: "#667eea",
        fontSize: 18,
        fontWeight: "700",
    },
    meterSection: {
        backgroundColor: "#f7fafc",
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    meterTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#4a5568",
        marginBottom: 12,
    },
    meterRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    meterItem: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 8,
    },
    meterLabel: {
        fontSize: 14,
        color: "#718096",
        marginBottom: 4,
        fontWeight: "500",
    },
    meterValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1a202c",
        marginBottom: 2,
    },
    meterUsage: {
        fontSize: 12,
        color: "#667eea",
        fontWeight: "500",
    },
    totalSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#667eea",
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: "#667eea",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#ffffff",
    },
    totalValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#ffffff",
    },
    mainActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    editButton: {
        flex: 1,
        backgroundColor: "#667eea",
        borderRadius: 12,
        paddingVertical: 4,
    },
    editButtonLabel: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    printButton: {
        flex: 1,
        borderColor: "#667eea",
        borderRadius: 12,
        paddingVertical: 4,
    },
    printButtonLabel: {
        color: "#667eea",
        fontSize: 16,
        fontWeight: "600",
    },
    historySection: {
        padding: 16,
        paddingTop: 24,
    },
    historySectionHeader: {
        marginBottom: 16,
        alignItems: "center",
    },
    historySectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1a202c",
        marginBottom: 4,
    },
    historySectionSubtitle: {
        fontSize: 14,
        color: "#718096",
    },
    historyCard: {
        borderRadius: 16,
        backgroundColor: "#ffffff",
        borderLeftWidth: 4,
        borderLeftColor: "#667eea",
    },
    historyCardContent: {
        padding: 16,
    },
    historyHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    historyBadge: {
        backgroundColor: "#e2e8f0",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    historyBadgeText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#4a5568",
    },
    historyDate: {
        fontSize: 14,
        color: "#718096",
        fontWeight: "500",
    },
    historyInfo: {
        marginBottom: 16,
    },
    historyActions: {
        alignItems: "flex-end",
    },
    divider: {
        marginVertical: 12,
        backgroundColor: "#e2e8f0",
    },
    emptyCard: {
        borderRadius: 16,
        backgroundColor: "#ffffff",
    },
    emptyCardContent: {
        padding: 40,
        alignItems: "center",
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#4a5568",
        textAlign: "center",
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
        color: "#a0aec0",
        textAlign: "center",
        lineHeight: 20,
    },
});