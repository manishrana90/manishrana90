import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
    token: null,
    walletToken: null,
    isAuthenticated: false,
    casinoAllGames: null,
    eventId: null,
    session: [],
    balance: 0,
    expo: 0,
    bonus: 0,
    casino: 0,
    version: 1.0,
    depositStatus: false,
    casinoPermit: [],
    authenticate: () => {},
    setWalletToken: () => {},
    logout: () => {},
    setCasino: () => {},
    setEventId: () => {},
    setSession: () => {},
    setBalance: () => {},
    setExpo: () => {},
    setBonus: () => {},
    setCasinoBalance: () => {},
    setVersion: () => {},
    setDepositStatus: () => {},
    casinoPermissionSetter: () => {},
});

function AuthContextProvider({children}) {
    const [authToken, setauthToken] = useState();
    const [walletToken, setwalletToken] = useState(null);
    const [casinoGames, setCasinoGames] = useState(null);
    const [roomEventId, setroomEventId] = useState(null);
    const [eventSession, setEventSession] = useState([]);
    const [userBalance, setUserBalance] = useState(0);
    const [userExpo, setUserExpo] = useState(0);
    const [userBonus, setUserBonus] = useState(0);
    const [casinoBalance, setCasinoBal] = useState(0);
    const [appVersion, setAppVersion] = useState("1.0");
    const [depositValue, setDepositValue] = useState("1.0");
    const [casinoPermit, setCasinoPermit] = useState([]);
    const [availableEventTypes, setAvailableEventTypes] = useState({});

    async function authenticate(token) {
        await AsyncStorage.setItem('token', token);
        setauthToken(token);
        setEventTypes(token);
    }

    async function setEventTypes(data) {
        setAvailableEventTypes(data);
    }

    async function setWalletToken(token) {
        setwalletToken(token);
    }

    async function setCasino(value) {
        setCasinoGames(value);
    }

    async function setEventId(value) {
        setroomEventId(value);
    }

    async function setSession(value) {
        setEventSession(value);
    }

    async function setBalance(value) {
        await AsyncStorage.setItem('balance', JSON.stringify(value));
        setUserBalance(value);
    }

    async function setExpo(value) {
        await AsyncStorage.setItem('expo', JSON.stringify(value));
        setUserExpo(value);
    }

    async function setBonus(value) {
        await AsyncStorage.setItem('bonus', JSON.stringify(value));
        setUserBonus(value);
    }

    async function setCasinoBalance(value) {
        await AsyncStorage.setItem('casino', JSON.stringify(value));
        setCasinoBal(value);
    }

    async function setVersion(value) {
        setAppVersion(value);
    }

    async function setDepositStatus(value) {
        setDepositValue(value);
    }

    async function casinoPermissionSetter(value) {
        console.log('permission setter');
        setCasinoPermit(value)
    }

    async function logout() {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('balance');
        await AsyncStorage.removeItem('expo');
        setauthToken(null);
        setUserBalance(0);
        setUserExpo(0);
        setDepositValue(false);
        setwalletToken(null);
    }

    const value = {
        token: authToken,
        walletToken: walletToken,
        isAuthenticated: !!authToken,
        casinoAllGames: casinoGames,
        eventId: roomEventId,
        session: eventSession,
        balance:userBalance,
        bonus:userBonus,
        expo: userExpo,
        casino:casinoBalance,
        version: appVersion,
        depositStatus: depositValue,
        casinoPermit: casinoPermit,
        availableEventTypes: availableEventTypes,
        authenticate: authenticate,
        setWalletToken: setWalletToken,
        logout: logout,
        setCasino: setCasino,
        setEventId: setEventId,
        setSession: setSession,
        setBalance: setBalance,
        setExpo: setExpo,
        setBonus: setBonus,
        setCasinoBalance: setCasinoBalance,
        setAppVersion: setVersion,
        setDepositStatus: setDepositStatus,
        casinoPermissionSetter: casinoPermissionSetter,
        setEventTypes: setEventTypes,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContextProvider;