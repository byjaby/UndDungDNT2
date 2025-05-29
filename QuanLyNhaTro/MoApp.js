import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import DieuKhien from './DangNhap/DieuKhien';
import { MyContextControllerProvider } from './TrungTam';

const LOAINGUOIDUNG = firestore().collection('LoaiNguoiDung');
const ADMIN = firestore().collection('Admin');

const taoLoaiNguoiDungMacDinh = async () => {
    const loaiNguoiDungRef = await LOAINGUOIDUNG.get();
    if (loaiNguoiDungRef.empty) {
        await LOAINGUOIDUNG.doc("1").set({
            tenLoai: "Admin",
            moTa: "Quản trị viên hệ thống"
        });

        await LOAINGUOIDUNG.doc("2").set({
            tenLoai: "Khách thuê",
            moTa: "Người thuê phòng trọ"
        });

        await LOAINGUOIDUNG.doc("3").set({
            tenLoai: "Chủ trọ",
            moTa: "Người quản lý/phát phòng"
        });
    }
};

const layIdLoaiAdmin = async () => {
    const querySnapshot = await LOAINGUOIDUNG.where('tenLoai', '==', 'Admin').get();
    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return doc.id;
    } else {
        const newDocRef = await LOAINGUOIDUNG.add({
            tenLoai: "Admin",
            moTa: "Quản trị viên hệ thống"
        });
        return newDocRef.id;
    }
};

const kiemTraVaTaoAdmin = async (idLoaiAdmin) => {
    const adminEmail = 'quocthaiv4@gmail.com';
    const matKhau = '123456';

    try {
        const signInMethods = await auth().fetchSignInMethodsForEmail(adminEmail);

        if (signInMethods && signInMethods.length > 0) {
            return;
        }

        const userCredential = await auth().createUserWithEmailAndPassword(adminEmail, matKhau);
        const uid = userCredential.user.uid;

        const adminData = {
            hoTen: 'Võ Quốc Thái',
            email: adminEmail,
            sDT: '0375030925',
            diaChi: 'Bình Dương',
            id_loaiNguoiDung: idLoaiAdmin,
            createdAt: firestore.FieldValue.serverTimestamp(),
        };

        await ADMIN.doc(uid).set(adminData);
    } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
            console.log('Địa chỉ email đã tồn tại. Bỏ qua.');
        } else {
            console.error('Lỗi khi tạo tài khoản Admin:', err.code, err.message);
        }
    }
};

const MoApp = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                await taoLoaiNguoiDungMacDinh();
                const idLoaiAdmin = await layIdLoaiAdmin();
                await kiemTraVaTaoAdmin(idLoaiAdmin);
            } catch (error) {
                console.error("Lỗi khi khởi tạo ứng dụng:", error);
                Alert.alert("Lỗi", error.message);
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Đang mở ứng dụng...</Text>
            </View>
        );
    }

    return (
        <PaperProvider>
            <MyContextControllerProvider>
                <NavigationContainer>
                    <DieuKhien />
                </NavigationContainer>
            </MyContextControllerProvider>
        </PaperProvider>
    );
};

export default MoApp;
