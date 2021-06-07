import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { View, Text } from 'react-native';
import { PersistGate } from 'redux-persist/es/integration/react';

import StatusBar from '../components/ui/StatusBar';
import Drawer from '../navigation/Drawer';
import style from '../Style';
import configureStore from '../stores';
import { AppContextProvider } from '../utils/DeviceUtils';
import SettingsManager from '../utils/SettingsManager';
import Welcome from '../navigation/WelcomePage';

// See : https://github.com/react-navigation/react-navigation/issues/5568
// if (Platform.OS === 'android') {
//     SafeAreaView.setStatusBarHeight(0);
// }

const { store, pStore } = configureStore();
// const DrawerContainer = createAppContainer(Drawer);

export default () => {
    const [isFirstLoad, setFirstLoad] = useState(SettingsManager.isFirstLoad());
    const [themeName, setThemeName] = useState(SettingsManager.getTheme());
    const [groupName, setGroupName] = useState(SettingsManager.getGroup());

    useEffect(() => {
        SettingsManager.on('theme', (newTheme) => {
            setThemeName(newTheme);
        });
    }, []);

    useEffect(() => {
        SettingsManager.on('group', (newGroup) => {
            setGroupName(newGroup);
        });
    }, []);

    useEffect(() => {
        SettingsManager.on('firstload', (newFistLoad) => {
            setFirstLoad(newFistLoad);
        });
    }, []);

    return (
        <View style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
            <Provider store={store} style={style.fonts.default}>
                <AppContextProvider value={{ themeName, groupName }}>
                    <PersistGate loading={null} persistor={pStore}>
                        <StatusBar />
                        {isFirstLoad ? (
                            <Welcome />
                        ) : (
                            <Drawer />
                        )}
                    </PersistGate>
                </AppContextProvider>
            </Provider>
        </View>
    );
};
