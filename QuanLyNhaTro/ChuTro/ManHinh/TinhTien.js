import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useMyContextController } from "../../TrungTam";
import { useFocusEffect } from "@react-navigation/native";

const TinhTien = ({ route }) => {
    const navigation = useNavigation();
    const { phong } = route.params;
    const [controller] = useMyContextController();
    const { userLogin } = controller;

    const [tenNguoiThue, setTenNguoiThue] = useState("Đang tải...");
    const [dienCu, setDienCu] = useState(0);
    const [dienMoi, setDienMoi] = useState("");
    const [nuocCu, setNuocCu] = useState(0);
    const [nuocMoi, setNuocMoi] = useState("");
    const [tienDichVu, setTienDichVu] = useState(0);
    const [donGiaDien, setDonGiaDien] = useState(null);
    const [donGiaNuoc, setDonGiaNuoc] = useState(null);
    const [tongTien, setTongTien] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            fetchNguoiThue();
            fetchChiSoCu();
            fetchDichVu();
        }, [])
    );

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
                setTenNguoiThue("Lỗi tải");
            }
        } else {
            setTenNguoiThue("Chưa có");
        }
    };

    const fetchChiSoCu = async () => {
        try {
            const dienSnapshot = await firestore()
                .collection("LichSuDien")
                .where("phongId", "==", phong.id)
                .where("nguoiThueId", "==", phong.nguoiThue)
                .orderBy("createdAt", "desc")
                .limit(1)
                .get();
            if (!dienSnapshot.empty) {
                setDienCu(dienSnapshot.docs[0].data().chiSoMoi);
            }

            const nuocSnapshot = await firestore()
                .collection("LichSuNuoc")
                .where("phongId", "==", phong.id)
                .where("nguoiThueId", "==", phong.nguoiThue)
                .orderBy("createdAt", "desc")
                .limit(1)
                .get();
            if (!nuocSnapshot.empty) {
                setNuocCu(nuocSnapshot.docs[0].data().chiSoMoi);
            }
        } catch (error) {
            console.log("Lỗi khi lấy chỉ số cũ:", error.message);
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

    const handleTinhTien = async () => {
        const dMoi = parseInt(dienMoi);
        const nMoi = parseInt(nuocMoi);

        if (isNaN(dMoi) || isNaN(nMoi)) {
            Alert.alert("Lỗi", "Vui lòng nhập chỉ số điện/nước mới hợp lệ.");
            return;
        }

        if (dMoi <= dienCu) {
            Alert.alert("Lỗi", "Chỉ số điện mới phải lớn hơn chỉ số cũ.");
            return;
        }

        if (nMoi <= nuocCu) {
            Alert.alert("Lỗi", "Chỉ số nước mới phải lớn hơn chỉ số cũ.");
            return;
        }

        if (donGiaDien == null || donGiaNuoc == null) {
            Alert.alert("Thiếu dữ liệu", "Bạn cần nhập đơn giá cho Điện và Nước trước.");
            return;
        }

        const soDien = dMoi - dienCu;
        const soNuoc = nMoi - nuocCu;
        const tienDien = soDien * donGiaDien;
        const tienNuoc = soNuoc * donGiaNuoc;
        const tong = phong.giaPhong + tienDien + tienNuoc + tienDichVu;

        setTongTien(tong);

        try {
            const now = firestore.FieldValue.serverTimestamp();

            // Ghi hoặc cập nhật tiền phòng trước
            let tienPhongId = "";

            const tienPhongQuery = await firestore()
                .collection("TienPhong")
                .where("creator", "==", userLogin.user_id)
                .where("nguoiThueId", "==", phong.nguoiThue)
                .where("phongId", "==", phong.id)
                .get();

            const tienPhongData = {
                creator: userLogin.user_id,
                phongId: phong.id,
                tenPhong: phong.tenPhong,
                giaPhong: phong.giaPhong,
                nguoiThueId: phong.nguoiThue,
                tenNguoiThue,
                chiSoDienCu: dienCu,
                chiSoDienMoi: dMoi,
                chiSoNuocCu: nuocCu,
                chiSoNuocMoi: nMoi,
                tienDichVu,
                createdAt: now,
                tongTien: tong,
                // idLichSuDien và idLichSuNuoc sẽ thêm sau
            };

            if (!tienPhongQuery.empty) {
                // Nếu đã có, cập nhật
                const docRef = tienPhongQuery.docs[0].ref;
                await docRef.update(tienPhongData);
                tienPhongId = docRef.id;
            } else {
                // Nếu chưa có, thêm mới
                const docRef = await firestore().collection("TienPhong").add(tienPhongData);
                tienPhongId = docRef.id;
            }

            // Ghi lịch sử điện/nước
            const refDien = await firestore().collection("LichSuDien").add({
                phongId: phong.id,
                nguoiThueId: phong.nguoiThue,
                chiSoCu: dienCu,
                chiSoMoi: dMoi,
                createdAt: now
            });

            const refNuoc = await firestore().collection("LichSuNuoc").add({
                phongId: phong.id,
                nguoiThueId: phong.nguoiThue,
                chiSoCu: nuocCu,
                chiSoMoi: nMoi,
                createdAt: now
            });

            const idLichSuDien = refDien.id;
            const idLichSuNuoc = refNuoc.id;

            // Cập nhật lại TienPhong với id lịch sử
            await firestore().collection("TienPhong").doc(tienPhongId).update({
                idLichSuDien,
                idLichSuNuoc,
            });

            // Ghi lịch sử tính tiền
            await firestore().collection("LichSuTienPhong").add({
                creator: userLogin.user_id,
                tienPhongId, // <-- ID từ bảng TienPhong
                phongId: phong.id,
                tenPhong: phong.tenPhong,
                giaPhong: phong.giaPhong,
                nguoiThueId: phong.nguoiThue,
                tenNguoiThue,
                chiSoDienCu: dienCu,
                chiSoDienMoi: dMoi,
                chiSoNuocCu: nuocCu,
                chiSoNuocMoi: nMoi,
                tienDichVu,
                createdAt: now,
                tongTien: tong,
                idLichSuDien,
                idLichSuNuoc,
            });

            Alert.alert("Thành công", `Tổng tiền: ${tong.toLocaleString()} đ`);
            navigation.goBack();
        } catch (error) {
            console.log("Lỗi khi lưu tiền phòng:", error.message);
            Alert.alert("Lỗi", "Không thể lưu tiền phòng.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Tên phòng: {phong.tenPhong}</Text>
            <Text style={styles.label}>Giá phòng: {phong.giaPhong} đ</Text>
            <Text style={styles.label}>Người thuê: {tenNguoiThue}</Text>

            <TextInput label="Chỉ số điện cũ" value={dienCu.toString()} disabled style={styles.input} />
            <TextInput label="Chỉ số điện mới" value={dienMoi} onChangeText={setDienMoi} keyboardType="numeric" style={styles.input} />

            <TextInput label="Chỉ số nước cũ" value={nuocCu.toString()} disabled style={styles.input} />
            <TextInput label="Chỉ số nước mới" value={nuocMoi} onChangeText={setNuocMoi} keyboardType="numeric" style={styles.input} />

            <Text style={styles.label}>Tiền dịch vụ khác: {tienDichVu.toLocaleString()} đ</Text>

            <Button mode="contained" onPress={handleTinhTien} style={styles.button} icon="calculator">
                Tính tiền
            </Button>

            {tongTien !== null && (
                <Text style={styles.result}>Tổng tiền phải trả: {tongTien.toLocaleString()} đ</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    input: {
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: "bold",
    },
    button: {
        width: 120,
        marginTop: 20,
        alignSelf: "center",
        backgroundColor: "#1E88E5",
    },
    result: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: "bold",
        color: "#388E3C",
        textAlign: "center",
    },
});

export default TinhTien;