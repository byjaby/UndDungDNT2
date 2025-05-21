import React, { createContext, useContext, useReducer } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Alert } from "react-native";

const MyContext = createContext();
const LOAINGUOIDUNG = firestore().collection("LoaiNguoiDung");
const ADMIN = firestore().collection("Admin");
const CHUTRO = firestore().collection("ChuTro");
const KHACHTHUE = firestore().collection("KhachThue");
const PHONG = firestore().collection("Phong");
const DICHVU = firestore().collection("DichVu");
const TIENPHONG = firestore().collection("TienPhong");
const LICHSUTHANHTOAN = firestore().collection("LichSuThanhToan");

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
        case "UPDATE_PHONG":
            return { ...state, phong: action.payload };
        case "SET_DICHVU":
            return { ...state, dichVu: action.value };
        case "UPDATE_DICHVU":
            return { ...state, dichVu: action.payload };
        case "SET_TIENPHONG":
            return { ...state, tienPhong: action.value };
        case "UPDATE_TIENPHONG":
            return { ...state, tienPhong: action.payload };
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

const KhachDangKy = async (dispatch, fullName, email, password, phone, address) => {
    dispatch({ type: "SET_LOADING", value: true });

    try {
        const phoneQuery = await KHACHTHUE.where("phone", "==", phone.trim()).get();
        if (!phoneQuery.empty) {
            throw new Error("Số điện thoại đã được sử dụng.");
        }

        const response = await auth().createUserWithEmailAndPassword(email.trim(), password);
        const uid = response.user.uid;

        const loaiQuery = await LOAINGUOIDUNG.where("tenLoai", "==", "Khách thuê").get();
        if (loaiQuery.empty) {
            throw new Error("Không tìm thấy loại người dùng 'Khách thuê'.");
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
            throw new Error("Số điện thoại đã được sử dụng.");
        }

        const response = await auth().createUserWithEmailAndPassword(email.trim(), password);
        const uid = response.user.uid;

        const loaiQuery = await LOAINGUOIDUNG.where("tenLoai", "==", "Chủ trọ").get();
        if (loaiQuery.empty) {
            throw new Error("Không tìm thấy loại người dùng 'Chủ trọ'.");
        }
        const idLoaiChuTro = loaiQuery.docs[0].id;

        await CHUTRO.doc(uid).set({
            fullName,
            email: email.trim(),
            phone: phone.trim(),
            tenTro,
            address,
            id_loaiNguoiDung: idLoaiChuTro,
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
            throw new Error("Số điện thoại đã được sử dụng.");
        }

        // Tạo tài khoản với email & password
        const response = await auth().createUserWithEmailAndPassword(email.trim(), password);
        const uid = response.user.uid;

        // Lấy id loại người dùng "Chủ trọ"
        const loaiQuery = await firestore().collection("LoaiNguoiDung").where("tenLoai", "==", "Chủ trọ").get();
        if (loaiQuery.empty) {
            throw new Error("Không tìm thấy loại người dùng 'Chủ trọ'.");
        }
        const idLoaiChuTro = loaiQuery.docs[0].id;

        // Lưu dữ liệu chủ trọ vào Firestore
        await firestore().collection("ChuTro").doc(uid).set({
            fullName,
            email: email.trim(),
            phone: phone.trim(),
            address,
            id_loaiNguoiDung: idLoaiChuTro,
            creator: creatorId,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });

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

export {
    MyContextControllerProvider,
    useMyContextController,
    dangNhap,
    KhachDangKy,
    chuDangKy,
    dangXuat,
    loadChuTro,
    themChuTro,
    loadKhachThue,
    themKhachThue,
    loadHoSo
};
