import React, { createContext, useContext, useReducer } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Alert } from "react-native";
import DSPhong from "../ChuTro/ManHinh/DSPhong";

const MyContext = createContext();
const LOAINGUOIDUNG = firestore().collection("LoaiNguoiDung");
const CHUTRO = firestore().collection("ChuTro");
const KHACHTHUE = firestore().collection("KhachThue");

const reducer = (state, action) => {
    switch (action.type) {
        case "USER_LOGIN":
            return { ...state, userLogin: action.value };
        case "SET_USER_LOGIN":
            return { ...state, userLogin: action.value };
        case "LOGOUT":
            return { ...state, userLogin: null };
        case "SET_CHUTRO":
            return { ...state, chuTro: action.value };
        case "SET_KHACHTHUE":
            return { ...state, khachThue: action.value };
        case "SET_PHONG":
            return { ...state, phong: action.value };
        case "SET_DICHVU":
            return { ...state, dichVu: action.value };
        case "SET_TIENPHONG":
            return { ...state, tienPhong: action.value };
        case "SET_LSTIENPHONG":
            return { ...state, lSTienPhong: action.value };
        case "SET_THUEPHONG":
            return { ...state, thuePhong: action.value };
        case "SET_LSGD":
            return { ...state, LSGD: action.value };
        case "SET_LOADING":
            return { ...state, loading: action.value };
        case "SET_ERROR":
            return { ...state, error: action.value };
        default:
            console.warn(`Unknown action type: ${action.type}`);
            return state;
    }
};

const initialState = {
    userLogin: null,
    chuTro: [],
    khachThue: [],
    phong: [],
    dichVu: [],
    tienPhong: [],
    loading: false,
    error: null
};

const MyContextControllerProvider = ({ children }) => {
    const [controller, dispatch] = useReducer(reducer, initialState);

    return (
        <MyContext.Provider value={[controller, dispatch]}>
            {children}
        </MyContext.Provider>
    );
};

const useMyContextController = () => {
    const context = useContext(MyContext);
    if (!context) {
        throw new Error("useMyContextController must be used within a MyContextControllerProvider");
    }
    return context;
};

const dangNhap = async (dispatch, email, password) => {
    dispatch({ type: "SET_LOADING", value: true });

    try {
        const userCredential = await auth().signInWithEmailAndPassword(email.trim(), password);
        const firebaseUID = userCredential.user.uid;

        const collections = ["Admin", "ChuTro", "KhachThue"];
        let userData = null;
        let foundCollection = null;
        let foundDocId = null;

        for (const collectionName of collections) {
            const snapshot = await firestore()
                .collection(collectionName)
                .where("email", "==", email.trim())
                .limit(1)
                .get();

            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                userData = doc.data();
                foundCollection = collectionName;
                foundDocId = doc.id;
                break;
            }
        }

        if (!userData) {
            dispatch({ type: "SET_ERROR", value: "Tài khoản không tồn tại trong hệ thống." });
            dispatch({ type: "SET_LOADING", value: false });
            return { success: false, message: "Không tìm thấy người dùng trong cơ sở dữ liệu." };
        }

        dispatch({
            type: "USER_LOGIN",
            value: {
                user_id: foundDocId,
                ...userData,
                collection: foundCollection, // thông tin dùng sau này nếu cần
            },
        });

        dispatch({ type: "SET_LOADING", value: false });
        return { success: true };

    } catch (error) {
        let message = "Đăng nhập thất bại.";
        if (error.code === 'auth/user-not-found') {
            message = "Người dùng không tồn tại.";
        } else if (error.code === 'auth/wrong-password') {
            message = "Sai mật khẩu.";
        } else if (error.code === 'auth/invalid-email') {
            message = "Email không hợp lệ.";
        } else if (error.code === 'auth/invalid-credential') {
            message = "Thông tin đăng nhập không hợp lệ.";
        }

        dispatch({ type: "SET_ERROR", value: message });
        dispatch({ type: "SET_LOADING", value: false });
        return { success: false, message };
    }
};

const khachDangKy = async (dispatch, fullName, email, password, phone, address) => {
    dispatch({ type: "SET_LOADING", value: true });

    try {
        const phoneQuery = await KHACHTHUE.where("phone", "==", phone.trim()).get();
        if (!phoneQuery.empty) {
            dispatch({ type: "SET_LOADING", value: false });
            return { success: false, message: "Số điện thoại đã được sử dụng." };
        }

        const response = await auth().createUserWithEmailAndPassword(email.trim(), password);
        const uid = response.user.uid;

        const loaiQuery = await LOAINGUOIDUNG.where("tenLoai", "==", "Khách thuê").get();
        if (loaiQuery.empty) {
            dispatch({ type: "SET_LOADING", value: false });
            return { success: false, message: "Không tìm thấy loại người dùng 'Khách thuê'." };
        }
        const idLoaiKhachThue = loaiQuery.docs[0].id;

        await KHACHTHUE.doc(uid).set({
            fullName,
            email: email.trim(),
            phone: phone.trim(),
            address,
            id_loaiNguoiDung: idLoaiKhachThue,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });

        return { success: true };

    } catch (error) {
        let message = "Đăng ký thất bại.";
        if (error.code === "auth/email-already-in-use") {
            message = "Email đã được sử dụng.";
        } else if (error.code === "auth/invalid-email") {
            message = "Email không hợp lệ.";
        } else if (error.code === "auth/weak-password") {
            message = "Mật khẩu quá yếu (tối thiểu 6 ký tự).";
        } else {
            message = error.message;
        }

        dispatch({ type: "SET_ERROR", value: message });
        dispatch({ type: "SET_LOADING", value: false });
        return { success: false, message };
    }
};

const chuDangKy = async (dispatch, fullName, email, password, phone, tenTro, address) => {
    dispatch({ type: "SET_LOADING", value: true });

    try {
        const phoneQuery = await KHACHTHUE.where("phone", "==", phone.trim()).get();
        if (!phoneQuery.empty) {
            dispatch({ type: "SET_LOADING", value: false });
            return { success: false, message: "Số điện thoại đã được sử dụng." };
        }

        const response = await auth().createUserWithEmailAndPassword(email.trim(), password);
        const uid = response.user.uid;

        const loaiQuery = await LOAINGUOIDUNG.where("tenLoai", "==", "Chủ trọ").get();
        if (loaiQuery.empty) {
            dispatch({ type: "SET_LOADING", value: false });
            return { success: false, message: "Không tìm thấy loại người dùng 'Chủ trọ'." };
        }
        const idLoaiChuTro = loaiQuery.docs[0].id;

        await CHUTRO.doc(uid).set({
            fullName,
            email: email.trim(),
            phone: phone.trim(),
            tenTro,
            address,
            sLPhong: 0,
            id_loaiNguoiDung: idLoaiChuTro,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });

        // Thêm 2 dịch vụ mặc định
        const dichVuCollection = firestore().collection("DichVu");
        const batch = firestore().batch();

        const dvDienRef = dichVuCollection.doc();
        batch.set(dvDienRef, {
            tenDV: "Điện",
            tenDVLower: "điện",
            chiPhi: "",
            moTa: "",
            creator: uid,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });

        const dvNuocRef = dichVuCollection.doc();
        batch.set(dvNuocRef, {
            tenDV: "Nước",
            tenDVLower: "nước",
            chiPhi: "",
            moTa: "",
            creator: uid,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });

        await batch.commit();

        dispatch({ type: "SET_LOADING", value: false });
        return { success: true };

    } catch (error) {
        let message = "Đăng ký thất bại.";
        if (error.code === "auth/email-already-in-use") {
            message = "Email đã được sử dụng.";
        } else if (error.code === "auth/invalid-email") {
            message = "Email không hợp lệ.";
        } else if (error.code === "auth/weak-password") {
            message = "Mật khẩu quá yếu (tối thiểu 6 ký tự).";
        } else {
            message = error.message;
        }

        dispatch({ type: "SET_ERROR", value: message });
        dispatch({ type: "SET_LOADING", value: false });
        return { success: false, message };
    }
};

const dangXuat = (dispatch, navigation) => {
    auth()
        .signOut()
        .then(() => {
            dispatch({ type: "LOGOUT" });
            navigation.reset({
                index: 0,
                routes: [{ name: "DangNhap" }], // Tên screen đăng nhập của bạn
            });
        })
        .catch(() => {
            Alert.alert("Đăng xuất thất bại.");
        });
};

const loadChuTro = async (dispatch) => {
    dispatch({ type: 'SET_LOADING', value: true });

    try {
        const snapshot = await firestore().collection("ChuTro").get();

        const danhSachChuTro = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        dispatch({ type: 'SET_CHUTRO', value: danhSachChuTro });
        dispatch({ type: 'SET_LOADING', value: false });
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu Chủ trọ:", error);
        dispatch({ type: 'SET_ERROR', value: error.message });
        dispatch({ type: 'SET_LOADING', value: false });
    }
};

const themChuTro = async (dispatch, fullName, email, password, phone, address, creatorId) => {
    dispatch({ type: "SET_LOADING", value: true });

    try {
        // Kiểm tra phone đã tồn tại chưa
        const phoneQuery = await firestore().collection("ChuTro").where("phone", "==", phone.trim()).get();
        if (!phoneQuery.empty) {
            dispatch({ type: "SET_LOADING", value: false });
            return { success: false, message: "Số điện thoại đã được sử dụng." };
        }

        // Tạo tài khoản với email & password
        const response = await auth().createUserWithEmailAndPassword(email.trim(), password);
        const uid = response.user.uid;

        // Lấy id loại người dùng "Chủ trọ"
        const loaiQuery = await firestore().collection("LoaiNguoiDung").where("tenLoai", "==", "Chủ trọ").get();
        if (loaiQuery.empty) {
            dispatch({ type: "SET_LOADING", value: false });
            return { success: false, message: "Không tìm thấy loại người dùng 'Chủ trọ'." };
        }
        const idLoaiChuTro = loaiQuery.docs[0].id;

        // Lưu dữ liệu chủ trọ vào Firestore
        await firestore().collection("ChuTro").doc(uid).set({
            fullName,
            email: email.trim(),
            phone: phone.trim(),
            address,
            tenTro: "",
            sLPhong: "",
            id_loaiNguoiDung: idLoaiChuTro,
            creator: creatorId,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });

        // Thêm 2 dịch vụ mặc định: Điện và Nước
        const dichVuCollection = firestore().collection("DichVu");
        const batch = firestore().batch();

        const dienRef = dichVuCollection.doc();
        batch.set(dienRef, {
            tenDV: "Điện",
            tenDVLower: "điện",
            chiPhi: "",
            moTa: "",
            creator: uid,
            createdAt: firestore.FieldValue.serverTimestamp()
        });

        const nuocRef = dichVuCollection.doc();
        batch.set(nuocRef, {
            tenDV: "Nước",
            tenDVLower: "nước",
            chiPhi: "",
            moTa: "",
            creator: uid,
            createdAt: firestore.FieldValue.serverTimestamp()
        });

        await batch.commit();

        dispatch({ type: "SET_LOADING", value: false });
        return { success: true, idChuTro: uid };

    } catch (error) {
        let message = "Thêm Chủ trọ thất bại.";
        if (error.code === "auth/email-already-in-use") {
            message = "Email đã được sử dụng.";
        } else if (error.code === "auth/invalid-email") {
            message = "Email không hợp lệ.";
        } else if (error.code === "auth/weak-password") {
            message = "Mật khẩu quá yếu (tối thiểu 6 ký tự).";
        } else {
            message = error.message;
        }

        dispatch({ type: "SET_ERROR", value: message });
        dispatch({ type: "SET_LOADING", value: false });
        return { success: false, message };
    }
};

const loadKhachThue = async (dispatch) => {
    dispatch({ type: 'SET_LOADING', value: true });

    try {
        const snapshot = await firestore().collection("KhachThue").get();

        const danhSachKhachThue = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        dispatch({ type: 'SET_KHACHTHUE', value: danhSachKhachThue });
        dispatch({ type: 'SET_LOADING', value: false });
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu Khách thuê trọ:", error);
        dispatch({ type: 'SET_ERROR', value: error.message });
        dispatch({ type: 'SET_LOADING', value: false });
    }
};

const themKhachThue = async (dispatch, fullName, email, password, phone, address) => {
    dispatch({ type: "SET_LOADING", value: true });

    try {
        // Kiểm tra phone đã tồn tại chưa
        const phoneQuery = await firestore().collection("KhachThue").where("phone", "==", phone.trim()).get();
        if (!phoneQuery.empty) {
            throw new Error("Số điện thoại đã được sử dụng.");
        }

        const response = await auth().createUserWithEmailAndPassword(email.trim(), password);
        const uid = response.user.uid;

        const loaiQuery = await firestore().collection("LoaiNguoiDung").where("tenLoai", "==", "Khách thuê").get();
        if (loaiQuery.empty) {
            throw new Error("Không tìm thấy loại người dùng 'Chủ trọ'.");
        }
        const idLoaiKhachThue = loaiQuery.docs[0].id;

        await firestore().collection("KhachThue").doc(uid).set({
            fullName,
            email: email.trim(),
            phone: phone.trim(),
            address,
            id_loaiNguoiDung: idLoaiKhachThue,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });

        dispatch({ type: "SET_LOADING", value: false });

        return { success: true, idKhachThue: uid };

    } catch (error) {
        let message = "Thêm khách thuê thất bại.";
        if (error.code === "auth/email-already-in-use") {
            message = "Email đã được sử dụng.";
        } else if (error.code === "auth/invalid-email") {
            message = "Email không hợp lệ.";
        } else if (error.code === "auth/weak-password") {
            message = "Mật khẩu quá yếu (tối thiểu 6 ký tự).";
        } else {
            message = error.message;
        }

        dispatch({ type: "SET_ERROR", value: message });
        dispatch({ type: "SET_LOADING", value: false });
        return { success: false, message };
    }
};

const loadHoSo = async (dispatch, userId) => {
    try {
        const doc = await firestore().collection("Admin").doc(userId).get();

        if (doc.exists) {
            dispatch({
                type: "SET_USER_LOGIN",
                value: {
                    user_id: doc.id,
                    ...doc.data(),
                },
            });
        }
    } catch (error) {
        console.error("Lỗi khi tải lại thông tin cá nhân:", error);
    }
};

const loadHoSoChuTro = async (dispatch, userId) => {
    try {
        const userSnap = await firestore().collection("ChuTro").doc(userId).get();
        const userData = userSnap.data();

        // Tìm thẻ ngân hàng của chủ trọ
        const bankSnap = await firestore()
            .collection("TheNganHang")
            .where("creator", "==", userId)
            .limit(1)
            .get();

        let bankData = null;
        if (!bankSnap.empty) {
            bankData = bankSnap.docs[0].data();
        }

        dispatch({
            type: "SET_USER_LOGIN",
            value: {
                ...userData,
                user_id: userId,
                ...bankData // Merge thông tin thẻ vào userLogin
            }
        });
    } catch (error) {
        console.error("Lỗi load hồ sơ:", error);
    }
};

const loadHoSoKhach = async (dispatch, userId) => {
    try {
        const doc = await firestore().collection("KhachThue").doc(userId).get();

        if (doc.exists) {
            dispatch({
                type: "SET_USER_LOGIN",
                value: {
                    user_id: doc.id,
                    ...doc.data(),
                },
            });
        }
    } catch (error) {
        console.error("Lỗi khi tải lại thông tin cá nhân:", error);
    }
};

const loadDV = async (dispatch) => {
    dispatch({ type: 'SET_LOADING', value: true });

    try {
        const snapshot = await firestore().collection("DichVu").get();

        const dSDV = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        dispatch({ type: 'SET_DICHVU', value: dSDV });
        dispatch({ type: 'SET_LOADING', value: false });
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu dịch vụ:", error);
        dispatch({ type: 'SET_ERROR', value: error.message });
        dispatch({ type: 'SET_LOADING', value: false });
    }
};

const themDV = async (dispatch, tenDV, chiPhi, moTa, creatorId) => {
    dispatch({ type: "SET_LOADING", value: true });

    const tenDVTrimmed = tenDV.trim();
    const tenDVLower = tenDVTrimmed.toLowerCase();

    try {
        const snapshot = await firestore()
            .collection("DichVu")
            .where("tenDVLower", "==", tenDVLower)
            .where("creator", "==", creatorId.trim())
            .get();

        if (!snapshot.empty) {
            dispatch({ type: "SET_LOADING", value: false });
            return { success: false, message: "Tên dịch vụ đã tồn tại." };
        }

        const uid = firestore().collection("DichVu").doc().id;
        await firestore().collection("DichVu").doc(uid).set({
            tenDV: tenDVTrimmed,
            tenDVLower, // dùng để kiểm tra trùng tên
            chiPhi,
            moTa,
            creator: creatorId,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });

        dispatch({ type: "SET_LOADING", value: false });
        return { success: true, idDichVu: uid };
    } catch (error) {
        let message = "Thêm dịch vụ thất bại.";
        console.error("Lỗi khi thêm dịch vụ:", error);
        if (error.message) {
            message = error.message;
        }
        dispatch({ type: "SET_ERROR", value: message });
        dispatch({ type: "SET_LOADING", value: false });
        return { success: false, message };
    }
};

const loadPhong = async (dispatch, userId) => {
    dispatch({ type: 'SET_LOADING', value: true });

    try {
        const snapshot = await firestore()
            .collection("Phong")
            .where("creator", "==", userId)
            .get();

        const dSPhong = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        dispatch({ type: 'SET_PHONG', value: dSPhong });
        dispatch({ type: 'SET_LOADING', value: false });
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu phòng:", error);
        dispatch({ type: 'SET_ERROR', value: error.message });
        dispatch({ type: 'SET_LOADING', value: false });
    }
};

const themPhong = async (dispatch, tenPhong, chieuDai, chieuRong, giaPhong, hinhAnh, nguoiThue, creatorId) => {
    dispatch({ type: "SET_LOADING", value: true });
    try {
        const snapshot = await firestore()
            .collection("Phong")
            .where("tenPhong", "==", tenPhong.trim())
            .where("creator", "==", creatorId.trim())
            .get();

        if (!snapshot.empty) {
            dispatch({ type: "SET_LOADING", value: false });
            return { success: false, message: "Tên phòng đã tồn tại." };
        }
        const uid = firestore().collection("Phong").doc().id;
        await firestore().collection("Phong").doc(uid).set({
            tenPhong,
            chieuDai,
            chieuRong,
            giaPhong,
            hinhAnh,
            nguoiThue: "",
            creator: creatorId,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });
        const userRef = firestore().collection("ChuTro").doc(creatorId);
        await userRef.update({
            sLPhong: firestore.FieldValue.increment(1),
        });
        dispatch({ type: "SET_LOADING", value: false });
        return { success: true, idPhong: uid };
    } catch (error) {
        let message = "Thêm phòng mới thất bại.";
        console.error("Lỗi khi thêm phòng:", error);
        if (error.message) {
            message = error.message;
        }
        dispatch({ type: "SET_ERROR", value: message });
        dispatch({ type: "SET_LOADING", value: false });
        return { success: false, message };
    }
};

const loadTienPhong = async (dispatch, userId) => {
    dispatch({ type: 'SET_LOADING', value: true });

    try {
        const snapshot = await firestore()
            .collection("TienPhong")
            .where("creator", "==", userId)
            .get();

        const dSTienPhong = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        dispatch({ type: 'SET_TIENPHONG', value: dSTienPhong });
        dispatch({ type: 'SET_LOADING', value: false });
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu tiền phòng:", error);
        dispatch({ type: 'SET_ERROR', value: error.message });
        dispatch({ type: 'SET_LOADING', value: false });
    }
};

const loadTTCN = async (dispatch, userId) => {
    try {
        const doc = await firestore().collection("KhachThue").doc(userId).get();

        if (doc.exists) {
            dispatch({
                type: "SET_USER_LOGIN",
                value: {
                    user_id: doc.id,
                    ...doc.data(),
                },
            });
        }
    } catch (error) {
        console.error("Lỗi khi tải lại thông tin cá nhân:", error);
    }
};

const loadThuePhong = async (dispatch, creator) => {
    dispatch({ type: 'SET_LOADING', value: true });

    try {
        const snapshot = await firestore()
            .collection("ThuePhong")
            .where("creator", "==", creator)
            .get();

        const danhThuePhong = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        dispatch({ type: 'SET_THUEPHONG', value: danhThuePhong });
        dispatch({ type: 'SET_LOADING', value: false });

        return danhThuePhong;
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu thuê phòng:", error);
        dispatch({ type: 'SET_ERROR', value: error.message });
        dispatch({ type: 'SET_LOADING', value: false });
        return [];
    }
};

const loadTro = async (dispatch, userId) => {
    dispatch({ type: 'SET_LOADING', value: true });

    try {
        const snapshot = await firestore()
            .collection("ThuePhong")
            .where("userId", "==", userId)
            .where("trangThai", "==", "true")
            .get();

        const dSPhong = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        dispatch({ type: 'SET_PHONG', value: dSPhong });
        dispatch({ type: 'SET_LOADING', value: false });

        return dSPhong;
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu phòng:", error);
        dispatch({ type: 'SET_ERROR', value: error.message });
        dispatch({ type: 'SET_LOADING', value: false });
        return [];
    }
};

const loadLSTT = async (dispatch, userId) => {
    dispatch({ type: 'SET_LOADING', value: true });

    try {
        const snapshot = await firestore().collection("LichSuThanhToan").get();
        const lsgdDocs = snapshot.docs;
        const filteredLSGD = [];

        for (const doc of lsgdDocs) {
            const data = doc.data();

            const gd = await firestore().collection("LichSuGiaoDich").doc(data.giaoDichId).get();
            const gdData = gd.data();
            if (!gdData) continue;

            const tienPhong = await firestore().collection("TienPhong").doc(gdData.tienPhongId).get();
            const tienPhongData = tienPhong.data();
            if (!tienPhongData || tienPhongData.nguoiThueId !== userId) continue;

            const chuTro = await firestore().collection("ChuTro").doc(tienPhongData.creator).get();
            const chuTroData = chuTro.data();

            filteredLSGD.push({
                id: doc.id,
                ngayThanhToan: data.ngayThanhToan,
                tongTien: tienPhongData.tongTien,
                tenPhong: tienPhongData.tenPhong,
                tenNguoiThue: tienPhongData.tenNguoiThue,
                tenChuTro: chuTroData?.fullName || "Không rõ",
                tenTro: chuTroData.tenTro || "Chưa đặt tên",
            });
            console.log("userId hiện tại:", userId);
            console.log("nguoiThueId trong tienPhong:", tienPhongData.nguoiThueId);

        }

        dispatch({ type: 'SET_LSGD', value: filteredLSGD });
        dispatch({ type: 'SET_LOADING', value: false });

        console.log("DỮ LIỆU LỊCH SỬ", filteredLSGD);
        return filteredLSGD;
    } catch (error) {
        console.error("Lỗi khi tải lịch sử:", error);
        dispatch({ type: 'SET_ERROR', value: error.message });
        dispatch({ type: 'SET_LOADING', value: false });
    }
};

export {
    MyContextControllerProvider,
    useMyContextController,
    dangNhap,
    khachDangKy,
    chuDangKy,
    dangXuat,
    loadChuTro,
    themChuTro,
    loadKhachThue,
    themKhachThue,
    loadHoSo,
    loadHoSoChuTro,
    loadHoSoKhach,
    loadDV,
    themDV,
    loadPhong,
    themPhong,
    loadTienPhong,
    loadTTCN,
    loadThuePhong,
    loadTro,
    loadLSTT,
};
