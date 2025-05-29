import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useMyContextController } from "../../TrungTam";

const SuaTienPhong = ({ route, navigation }) => {
    const { lichSuId } = route.params;
    const [controller] = useMyContextController();
    const { userLogin } = controller;
    const [data, setData] = useState(null);
    const [dienMoi, setDienMoi] = useState("");
    const [nuocMoi, setNuocMoi] = useState("");
    const [tongTien, setTongTien] = useState(null);
    const [donGiaDien, setDonGiaDien] = useState(0);
    const [donGiaNuoc, setDonGiaNuoc] = useState(0);
    const [tienDichVu, setTienDichVu] = useState(0);

    useEffect(() => {
        fetchLichSu();
        fetchDichVu();
    }, []);

    const fetchLichSu = async () => {
        try {
            const doc = await firestore().collection("LichSuTienPhong").doc(lichSuId).get();
            if (doc.exists) {
                const d = doc.data();
                setData(d);
                setDienMoi(d.chiSoDienMoi.toString());
                setNuocMoi(d.chiSoNuocMoi.toString());
                setTongTien(d.tongTien);
            } else {
                Alert.alert("Lỗi", "Không tìm thấy dữ liệu.");
                navigation.goBack();
            }
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tải dữ liệu.");
            navigation.goBack();
        }
    };
    const fetchDichVu = async () => {
        try {
            const snapshot = await firestore()
                .collection("DichVu")
                .where("creator", "==", userLogin.user_id)
                .get();

            let tong = 0;
            let dien = null;
            let nuoc = null;

            snapshot.docs.forEach(doc => {
                const { tenDV, chiPhi } = doc.data();
                if (tenDV.toLowerCase() === "điện") dien = chiPhi;
                else if (tenDV.toLowerCase() === "nước") nuoc = chiPhi;
                else tong += chiPhi || 0;
            });

            setTienDichVu(tong);
            setDonGiaDien(dien);
            setDonGiaNuoc(nuoc);
        } catch (error) {
            console.log("Lỗi khi lấy dịch vụ:", error.message);
        }
    };
    const handleCapNhat = async () => {
        const dMoi = parseInt(dienMoi);
        const nMoi = parseInt(nuocMoi);

        if (isNaN(dMoi) || isNaN(nMoi)) {
            Alert.alert("Lỗi", "Vui lòng nhập chỉ số điện/nước mới hợp lệ.");
            return;
        }

        if (dMoi <= data.chiSoDienCu || nMoi <= data.chiSoNuocCu) {
            Alert.alert("Lỗi", "Chỉ số mới phải lớn hơn chỉ số cũ.");
            return;
        }

        const soDien = dMoi - data.chiSoDienCu;
        const soNuoc = nMoi - data.chiSoNuocCu;

        const tienDien = soDien * donGiaDien;
        const tienNuoc = soNuoc * donGiaNuoc;
        const tong = data.giaPhong + tienDichVu + tienDien + tienNuoc;

        try {
            // Cập nhật LichSuTienPhong
            await firestore().collection("LichSuTienPhong").doc(lichSuId).update({
                chiSoDienMoi: dMoi,
                chiSoNuocMoi: nMoi,
                tongTien: tong,
                updatedAt: firestore.FieldValue.serverTimestamp(),
            });

            // Cập nhật bảng TienPhong nếu có
            if (data.tienPhongId) {
                await firestore().collection("TienPhong").doc(data.tienPhongId).update({
                    chiSoDienMoi: dMoi,
                    chiSoNuocMoi: nMoi,
                    tongTien: tong,
                    updatedAt: firestore.FieldValue.serverTimestamp(),
                });
            }

            // Cập nhật bảng LichSuDien
            if (data.lichSuDienId) {
                await firestore().collection("LichSuDien").doc(data.lichSuDienId).update({
                    chiSoMoi: dMoi,
                    updatedAt: firestore.FieldValue.serverTimestamp(),
                });
            }

            // Cập nhật bảng LichSuNuoc
            if (data.lichSuNuocId) {
                await firestore().collection("LichSuNuoc").doc(data.lichSuNuocId).update({
                    chiSoMoi: nMoi,
                    updatedAt: firestore.FieldValue.serverTimestamp(),
                });
            }

            Alert.alert("Thành công", `Đã cập nhật. Tổng tiền: ${tong.toLocaleString()} đ`);
            navigation.navigate("DSTinhTien");
        } catch (error) {
            console.log("Lỗi khi cập nhật:", error.message);
            Alert.alert("Lỗi", "Không thể cập nhật dữ liệu.");
        }
    };

    if (!data) return null;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Phòng: {data.tenPhong}</Text>
            <Text style={styles.label}>Người thuê: {data.tenNguoiThue}</Text>
            <Text style={styles.label}>Giá phòng: {data.giaPhong.toLocaleString()} đ</Text>

            <Text style={styles.label}>Chỉ số điện cũ: {data.chiSoDienCu}</Text>
            <TextInput
                label="Chỉ số điện mới"
                value={dienMoi}
                onChangeText={setDienMoi}
                keyboardType="numeric"
                style={styles.input}
            />

            <Text style={styles.label}>Chỉ số nước cũ: {data.chiSoNuocCu}</Text>
            <TextInput
                label="Chỉ số nước mới"
                value={nuocMoi}
                onChangeText={setNuocMoi}
                keyboardType="numeric"
                style={styles.input}
            />

            <Button mode="contained" onPress={handleCapNhat} style={styles.button} icon="content-save">
                Cập nhật
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: "bold",
    },
    input: {
        marginBottom: 12,
    },
    button: {
        width: 120,
        alignSelf: "center",
        marginTop: 20,
        backgroundColor: "#4CAF50",
    },
});

export default SuaTienPhong;
