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
            return { ...state, loaiNguoiDungLogin: action.value };
        case "LOGOUT":
            return { ...state, loaiNguoiDungLogin: null };
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
    loaiNguoiDungLogin: null,
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
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        const uid = userCredential.user.uid;

        const userDoc = await firestore().collection("KhachThue").doc(uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();

            if (userData.email !== email) {
                dispatch({ type: "SET_ERROR", value: "Thông tin người dùng không chính xác." });
                return { success: false, message: "Thông tin người dùng không chính xác. Vui lòng liên hệ quản trị viên." };
            }

            dispatch({ type: "USER_LOGIN", value: { user_id: uid, ...userData } });
            dispatch({ type: "SET_LOADING", value: false });
            return { success: true };
        } else {
            dispatch({ type: "SET_ERROR", value: "Không tìm thấy người dùng trong hệ thống." });
            dispatch({ type: "SET_LOADING", value: false });
            return { success: false, message: "Tài khoản không tồn tại trong hệ thống (Firestore)." };
        }
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

const dangKy = async (dispatch, fullName, email, password, phone, address) => {
    dispatch({ type: "SET_LOADING", value: true });

    try {
        // ✅ Kiểm tra số điện thoại đã tồn tại chưa
        const phoneQuery = await KHACHTHUE.where("phone", "==", phone.trim()).get();
        if (!phoneQuery.empty) {
            throw new Error("Số điện thoại đã được sử dụng.");
        }

        // Tạo tài khoản
        const response = await auth().createUserWithEmailAndPassword(email.trim(), password);
        const uid = response.user.uid;

        // Lấy loại người dùng 'Khách thuê'
        const loaiQuery = await LOAINGUOIDUNG.where("tenLoai", "==", "Khách thuê").get();
        if (loaiQuery.empty) {
            throw new Error("Không tìm thấy loại người dùng 'Khách thuê'.");
        }
        const idLoaiKhachThue = loaiQuery.docs[0].id;

        // Lưu thông tin người dùng
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

const dangXuat = (dispatch, navigation) => {
    auth()
        .signOut()
        .then(() => {
            dispatch({ type: "LOGOUT" });
            navigation.reset({
                index: 0,
                routes: [{ name: "DangNhap" }],
            });
        })
        .catch(() => {
            Alert.alert("Đăng xuất thất bại.");
        });
};

export {
    MyContextControllerProvider,
    useMyContextController,
    dangNhap,
    dangKy,
    dangXuat
};
