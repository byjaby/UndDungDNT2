import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import { getFirestore, collection, doc, setDoc } from '@react-native-firebase/firestore';
import { View, Text, ActivityIndicator } from 'react-native';
import Router from './routers/Router';
import { MyContextControllerProvider } from './store';

const db = getFirestore();
const USERS = collection(db, 'USERS');

const admin = {
    fullName: 'Admin',
    email: 'quocthaiv4@gmail.com',
    password: '123456',
    phone: '0375030922',
    address: 'Bình Dương',
    role: 'admin',
};

const checkAndCreateAdmin = async () => {
    try {
        const signInMethods = await auth().fetchSignInMethodsForEmail(admin.email);

        if (signInMethods && signInMethods.length > 0) {
            console.log('Admin account already exists. Skipping creation.');
            return;
        }

        console.log('Creating admin account...');
        const userCredential = await createUserWithEmailAndPassword(getAuth(), admin.email, admin.password);
        const uid = userCredential.user.uid;

        const { password, ...adminData } = admin;
        await setDoc(doc(USERS, uid), adminData);

        console.log('Admin account and Firestore record created.');
    } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
            console.log('Email already in use. Skipping creation.');
        } else {
            console.error('Error in checkAndCreateAdmin:', err.code, err.message);
        }
    }
};

const App = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            await checkAndCreateAdmin();
            setIsLoading(false);
        };
        init();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <PaperProvider>
            <MyContextControllerProvider>
                <NavigationContainer>
                    <Router />
                </NavigationContainer>
            </MyContextControllerProvider>
        </PaperProvider>
    );
};

export default App;
