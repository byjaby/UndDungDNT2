import { View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { login, useMyContextController } from "../store";
import { useEffect, useState } from "react";

const Login = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hiddenPassword, setHiddenPassword] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loginError, setLoginError] = useState(""); // lỗi từ server

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const hasErrorEmail = () => submitted && (email.trim() === "" || !isValidEmail(email));
    const hasErrorPassword = () => submitted && password.trim().length < 6;

    const handleLogin = async () => {
        setSubmitted(true);
        setLoginError("");

        if (email.trim() === "" || !isValidEmail(email)) return;
        if (password.trim().length < 6) return;

        try {
            const result = await login(dispatch, email, password);
            if (!result.success) {
                setLoginError(result.message || "Email hoặc mật khẩu không đúng");
            }
        } catch (err) {
            setLoginError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
    };

    useEffect(() => {
        if (userLogin != null) {
            console.log("User Login:", userLogin); // Kiểm tra role tại đây
            if (userLogin.role === "admin") {
                navigation.reset({ index: 0, routes: [{ name: "Admin" }] });
            } else if (userLogin.role === "customer") {
                navigation.reset({ index: 0, routes: [{ name: "Customer" }] });
            } else {
                console.log("Không có quyền truy cập.");
            }
        }
    }, [userLogin]);

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <Text
                style={{
                    fontSize: 40,
                    fontWeight: "bold",
                    alignSelf: "center",
                    color: "aqua",
                    marginTop: 100,
                    marginBottom: 50,
                }}
            >
                Đăng nhập
            </Text>

            <TextInput
                label="Địa chỉ email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <HelperText type="error" visible={hasErrorEmail()}>
                {email.trim() === "" ? "Vui lòng nhập Email" : "Email không hợp lệ"}
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
            <HelperText type="error" visible={hasErrorPassword()}>
                Mật khẩu phải từ 6 ký tự trở lên
            </HelperText>

            {loginError !== "" && (
                <HelperText type="error" visible={true}>
                    {loginError}
                </HelperText>
            )}

            <Button
                mode="contained"
                buttonColor="blue"
                onPress={handleLogin}
                style={{ marginTop: 20 }}
            >
                Đăng nhập
            </Button>

            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                <Text>Bạn chưa có tài khoản? </Text>
                <Button onPress={() => navigation.navigate("Register")}>
                    Tạo tài khoản
                </Button>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 10 }}>
                <Button onPress={() => navigation.navigate('ForgotPassword')}>
                    Quên mật khẩu
                </Button>
            </View>
        </View>
    );
};

export default Login;
