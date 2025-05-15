import { View } from "react-native";
import { Button } from "react-native-paper";
import { logout, useMyContextController } from "../store";

const Setting = ({ navigation }) => {
    const [controller, dispatch] = useMyContextController();

    const handleLogout = () => {
        logout(dispatch, navigation);
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Button mode="contained" onPress={handleLogout}>
                Đăng xuất
            </Button>
        </View>
    );
};

export default Setting;
