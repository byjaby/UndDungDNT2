import React, { createContext, useContext, useReducer } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Alert } from "react-native";

const MyContext = createContext();
const USERS = firestore().collection("USERS");
const SERVICES = firestore().collection("SERVICES");
const LichSuGD = firestore().collection("LichSuGD");

// --- Reducer ---
const reducer = (state, action) => {
    switch (action.type) {
        case "USER_LOGIN":
            return { ...state, userLogin: action.value };
        case "LOGOUT":
            return { ...state, userLogin: null };
        case "SET_SERVICES":
            return { ...state, services: action.value };
        case "UPDATE_USER":
            return { ...state, userLogin: action.payload };
        default:
            return new Error("Action not found");
    }
};

// --- Initial state ---
const initialState = {
    userLogin: null,
    services: [],
    lichSuGD: [],
    loading: false,
    error: null,
};

// --- Provider ---
const MyContextControllerProvider = ({ children }) => {
    const [controller, dispatch] = useReducer(reducer, initialState);

    return (
        <MyContext.Provider value={[controller, dispatch]}>
            {children}
        </MyContext.Provider>
    );
};

// --- Hook sử dụng context ---
const useMyContextController = () => {
    const context = useContext(MyContext);
    if (!context) {
        throw new Error("useMyContextController must be used within a MyContextControllerProvider");
    }
    return context;
};

// --- Hàm đăng nhập ---
const login = async (dispatch, email, password) => {
    try {
        // Đăng nhập Firebase Auth
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        const uid = userCredential.user.uid;

        // Lấy dữ liệu người dùng từ Firestore
        const userDocRef = firestore().collection("USERS").doc(uid);  // Sử dụng firestore()
        const userDoc = await userDocRef.get();

        // Kiểm tra xem người dùng có tồn tại trong Firestore không
        if (userDoc.exists) {
            const userData = userDoc.data();

            // Nếu bạn muốn kiểm tra lại email trong Firestore có trùng với email đăng nhập không
            if (userData.email !== email) {
                return { success: false, message: "Thông tin người dùng không khớp. Vui lòng liên hệ quản trị viên." };
            }

            // Đăng nhập thành công
            console.log("✅ Firestore user data:", userData);
            dispatch({ type: "USER_LOGIN", value: { user_id: uid, ...userData } });

            return { success: true };
        } else {
            // Trường hợp người dùng không tồn tại trong Firestore
            return { success: false, message: "Tài khoản không tồn tại trong hệ thống (Firestore)." };
        }
    } catch (error) {
        console.log("❌ Login error:", error.code);

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

        return { success: false, message };
    }
};

const logout = (dispatch, navigation) => {
    auth()
        .signOut()
        .then(() => {
            dispatch({ type: "LOGOUT" });
            navigation.reset({
                index: 0,
                routes: [{ name: "Login" }], // Tên screen đăng nhập của bạn
            });
        })
        .catch(() => {
            Alert.alert("Đăng xuất thất bại.");
        });
};


// --- Hàm lấy danh sách dịch vụ ---
const loadServices = async (dispatch) => {
    try {
        const snapshot = await SERVICES.get();
        const services = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        dispatch({ type: "SET_SERVICES", value: services });
    } catch (error) {
        console.log("Lỗi khi tải dịch vụ:", error);
        Alert.alert("Không thể tải danh sách dịch vụ.");
    }
};

// --- Thêm dịch vụ ---
const addService = async (dispatch, serviceData) => {
    try {
        await SERVICES.add(serviceData);
        await loadServices(dispatch);
    } catch (error) {
        console.log("Lỗi khi thêm dịch vụ:", error);
        Alert.alert("Không thể thêm dịch vụ.");
    }
};

// --- Cập nhật dịch vụ ---
const updateService = async (dispatch, serviceId, updatedData) => {
    try {
        await SERVICES.doc(serviceId).update(updatedData);
        await loadServices(dispatch);
    } catch (error) {
        console.log("Lỗi khi cập nhật dịch vụ:", error);
        Alert.alert("Không thể cập nhật dịch vụ.");
    }
};

// --- Xóa dịch vụ ---
const deleteService = async (dispatch, serviceId) => {
    try {
        await SERVICES.doc(serviceId).delete();
        await loadServices(dispatch);
    } catch (error) {
        console.log("Lỗi khi xoá dịch vụ:", error);
        Alert.alert("Không thể xoá dịch vụ.");
    }
};

const updateAdminInfo = async (dispatch, userId, updatedData) => {
    try {
        console.log("userId:", userId);
        const userRef = firestore().collection("USERS").doc(userId);

        // Kiểm tra xem tài liệu có tồn tại không
        const docSnap = await userRef.get();

        if (!docSnap.exists) {
            throw new Error("Tài liệu không tồn tại.");
        }

        await userRef.update(updatedData);

        const userData = { user_id: docSnap.id, ...docSnap.data() };
        dispatch({ type: "USER_LOGIN", value: userData });
        console.log("✅ Updated successfully:", userData);
    } catch (error) {
        console.error("❌ Error updating admin:", error.message);
        Alert.alert("Lỗi", error.message);
    }
};

const updateCustomerInfo = async (dispatch, userId, updatedData) => {
    try {
        console.log("userId:", userId);
        const userRef = firestore().collection("USERS").doc(userId);

        // Kiểm tra xem tài liệu có tồn tại không
        const docSnap = await userRef.get();

        if (!docSnap.exists) {
            throw new Error("Tài liệu không tồn tại.");
        }

        await userRef.update(updatedData);

        const userData = { user_id: docSnap.id, ...docSnap.data() };
        dispatch({ type: "USER_LOGIN", value: userData });
        console.log("✅ Updated successfully:", userData);
    } catch (error) {
        console.error("❌ Error updating Customer:", error.message);
        Alert.alert("Lỗi", error.message);
    }
};
const addLichSuGD = async (dispatch, data) => {
    try {
        const docRef = await firestore().collection("LichSuGD").add({
            ...data,
            createdAt: firestore.FieldValue.serverTimestamp(), // ✅
        });
        console.log("📦 Lịch sử giao dịch đã được tạo với ID:", docRef.id);
    } catch (error) {
        console.error("❌ Lỗi khi thêm lịch sử giao dịch:", error.message);
        Alert.alert("Lỗi", "Không thể thêm lịch sử giao dịch.");
    }
};

export {
    MyContextControllerProvider,
    useMyContextController,
    login,
    logout,
    loadServices,
    addService,
    updateService,
    deleteService,
    updateAdminInfo,
    updateCustomerInfo,
    addLichSuGD
};
