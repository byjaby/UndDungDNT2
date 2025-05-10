import React from 'react';
import firestore from '@react-native-firebase/firestore';
import { FlatList, View, ScrollView, Text } from 'react-native';
import { Appbar, TextInput, Button } from 'react-native-paper';
import Todo from './Todo';

const AppRun = () => {
    const [todo, setTodo] = React.useState('');
    const ref = firestore().collection('todos');
    const [todos, setTodos] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    async function addTodo() {
        await ref.add({
            title: todo,
            complete: false,
        });
        setTodo('');
    }

    React.useEffect(() => {
        return ref.onSnapshot((querySnapshot) => {
            const list = [];
            querySnapshot.forEach((doc) => {
                const { title, complete } = doc.data();
                list.push({
                    id: doc.id,
                    title,
                    complete,
                });
            });
            setTodos(list);
            if (loading) {
                setLoading(false);
            }
        });
    });

    if (loading) {
        return null;
    }

    return (
        <View style={{ flex: 1 }}>
            <Appbar>
                <Appbar.Content title="Danh sách TODOS" />
            </Appbar>

            <FlatList
                style={{ flex: 1 }}
                data={todos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Todo {...item} />}
            />

            <TextInput
                label="Nhập Todo mới"
                value={todo}
                onChangeText={(text) => setTodo(text)}
            />

            <Button onPress={addTodo}>Thêm TODO</Button>
        </View>
    );

}

export default AppRun
