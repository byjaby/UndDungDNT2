import { Alert, View, ActivityIndicator } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { useState } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const Register = ({ navigation }) => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [hiddenPassword, setHiddenPassword] = useState(true);
    const [hiddenPasswordConfirm, setHiddenPasswordConfirm] = useState(true);
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const isFullNameValid = () => fullName.trim() !== "";
    const isEmailValid = () => isValidEmail(email) && email.trim() !== "";
    const isPasswordValid = () => password.length >= 6;
    const isPasswordConfirmValid = () => passwordConfirm === password;
    const isPhoneValid = () => /^\d{10}$/.test(phone);

    const isFormValid = () => {
        return (
            isFullNameValid() &&
            isEmailValid() &&
            isPasswordValid() &&
            isPasswordConfirmValid() &&
            isPhoneValid()
        );
    };

    const USERS = firestore().collection("USERS");

    const handleCreateAccount = async () => {
        // Kiểm tra trước khi hiển thị lỗi
        if (!isFormValid()) {
            setSubmitted(true); // Lúc này mới hiển thị lỗi
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        setLoading(true);
        try {
            const response = await auth().createUserWithEmailAndPassword(email.trim(), password);
            await USERS.doc(response.user.uid).set({
                fullName,
                email: email.trim(),
                phone,
                address,
                role: "customer",
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
            Alert.alert("Thành công", "Tạo tài khoản thành công!");
            navigation.navigate("Login");
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                Alert.alert("Lỗi", "Email đã được sử dụng.");
            } else if (error.code === "auth/invalid-email") {
                Alert.alert("Lỗi", "Email không hợp lệ.");
            } else if (error.code === "auth/weak-password") {
                Alert.alert("Lỗi", "Mật khẩu quá yếu.");
            } else {
                Alert.alert("Lỗi", error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{
                fontSize: 30,
                fontWeight: "bold",
                alignSelf: "center",
                color: "pink",
                marginTop: 50,
                marginBottom: 30,
            }}>
                Tạo tài khoản mới
            </Text>

            <TextInput
                label="Họ và tên"
                value={fullName}
                onChangeText={setFullName}
            />
            <HelperText type="error" visible={submitted && !isFullNameValid()}>
                Họ tên không được để trống
            </HelperText>

            <TextInput
                label="Địa chỉ email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <HelperText type="error" visible={submitted && !isEmailValid()}>
                Email không hợp lệ
            </HelperText>

            <TextInput
                label="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={hiddenPassword}
                right={
                    <TextInput.Icon
                        icon={hiddenPassword ? "eye-off" : "eye"}
                        onPress={() => setHiddenPassword(!hiddenPassword)}
                    />
                }
            />
            <HelperText type="error" visible={submitted && !isPasswordValid()}>
                Mật khẩu phải có ít nhất 6 ký tự
            </HelperText>

            <TextInput
                label="Nhập lại mật khẩu"
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                secureTextEntry={hiddenPasswordConfirm}
                right={
                    <TextInput.Icon
                        icon={hiddenPasswordConfirm ? "eye-off" : "eye"}
                        onPress={() => setHiddenPasswordConfirm(!hiddenPasswordConfirm)}
                    />
                }
            />
            <HelperText type="error" visible={submitted && !isPasswordConfirmValid()}>
                Mật khẩu xác nhận không khớp
            </HelperText>

            <TextInput
                label="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={{ marginBottom: 0 }}
            />
            <HelperText type="error" visible={submitted && !isPhoneValid()}>
                Số điện thoại phải gồm đúng 10 số
            </HelperText>


            <TextInput
                label="Địa chỉ"
                value={address}
                onChangeText={setAddress}
                style={{ marginBottom: 20 }}
            />

            {loading ? (
                <ActivityIndicator size="large" color="pink" />
            ) : (
                <Button
                    mode="contained"
                    onPress={handleCreateAccount}
                    style={{ marginBottom: 20 }}
                >
                    Tạo tài khoản
                </Button>
            )}

            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text>Bạn đã có tài khoản? </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Button onPress={() => navigation.navigate("Login")}>Đăng nhập</Button>
            </View>
        </View>
    );
};

export default Register;
