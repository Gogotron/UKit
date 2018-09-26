import React from 'react';
import { ActivityIndicator, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createDrawerNavigator } from 'react-navigation';
import { Provider, connect } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';

import { toggleDarkMode } from './actions/toggleDarkMode';
import StackNavigator from './navigation/StackNavigator';
import About from './components/About';
import DrawerButton from './components/containers/buttons/DrawerButton';
import MyGroupButton from './components/containers/buttons/MyGroupButton';
import Split from './components/containers/headers/Split';
import style from './Style';
import WebBrowser from './components/WebBrowser';
import Geolocation from './components/Geolocation';
import configureStore from './stores';
import { setStatusBar } from './Utils';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchToggleDarkMode: () => {
            dispatch(toggleDarkMode());
        },
    };
};

const mapStateToProps = (state) => {
    return {
        themeName: state.darkMode.themeName,
    };
};

const CustomDrawerContentComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)((props) => {
    const { navigate } = props.navigation;
    const theme = style.Theme[props.themeName];

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        backgroundColor: theme.primary,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        alignContent: 'center',
                        height: 150,
                    }}>
                    <Image style={{ width: 50, height: 50, marginLeft: 20 }} source={require('./assets/icons/app.png')} />
                    <Text
                        style={{
                            color: '#FFF',
                            fontWeight: 'bold',
                            fontSize: 30,
                            marginLeft: 20,
                            flex: 1,
                            flexWrap: 'wrap',
                        }}>
                        Ukit
                    </Text>
                </View>
                <ScrollView style={{ backgroundColor: theme.background }}>
                    <View>
                        <Split lineColor={theme.border} onlyBottomMargin={true} />
                        <DrawerButton
                            title={'Groupes'}
                            size={28}
                            textSize={14}
                            icon={'list'}
                            color={theme.icon}
                            fontColor={theme.font}
                            onPress={() => props.navigation.closeDrawer()}
                        />
                        <Split title="Mon groupe" lineColor={theme.border} color={theme.icon} />
                        <MyGroupButton navigate={navigate} />
                        <Split title="Navigation" lineColor={theme.border} color={theme.icon} />
                        <DrawerButton
                            title={'ENT'}
                            size={28}
                            textSize={14}
                            icon={'dashboard'}
                            color={theme.icon}
                            fontColor={theme.font}
                            onPress={() => navigate('WebBrowser', { entrypoint: 'ent' })}
                        />
                        <DrawerButton
                            title={'Boîte email'}
                            size={28}
                            textSize={14}
                            icon={'mail-outline'}
                            color={theme.icon}
                            fontColor={theme.font}
                            onPress={() => navigate('WebBrowser', { entrypoint: 'email' })}
                        />
                        <DrawerButton
                            title={'Apogée'}
                            size={28}
                            textSize={14}
                            icon={'school'}
                            color={theme.icon}
                            fontColor={theme.font}
                            onPress={() => navigate('WebBrowser', { entrypoint: 'apogee' })}
                        />
                        <Split title="Application" lineColor={theme.border} color={theme.icon} />
                        <DrawerButton
                            title={'À propos'}
                            size={28}
                            textSize={14}
                            icon={'info'}
                            color={theme.icon}
                            fontColor={theme.font}
                            onPress={() => navigate('About')}
                        />
                    </View>
                </ScrollView>
                <View
                    style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderTopColor: theme.border,
                        borderTopWidth: 1,
                        backgroundColor: theme.background,
                    }}>
                    <TouchableOpacity onPress={props.dispatchToggleDarkMode}>
                        <MaterialCommunityIcons name="theme-light-dark" size={32} style={{ width: 32, height: 32, color: theme.icon }} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

const Drawer = createDrawerNavigator(
    {
        Home: {
            screen: StackNavigator,
        },
        About: {
            screen: About,
            navigationOptions: style.stackNavigator,
        },
        WebBrowser: {
            screen: WebBrowser,
            navigationOptions: style.stackNavigator,
        },
        Geolocation: {
            screen: Geolocation,
            navigationOptions: style.stackNavigator,
        },
    },
    {
        navigationOptions: ({ navigation }) => setStatusBar(navigation),
        contentComponent: CustomDrawerContentComponent,
    }
);

const { pStore, store } = configureStore();
const RNRedux = () => (
    <Provider store={store} style={style.fonts.default}>
        <PersistGate loading={<ActivityIndicator style={style.containerView} size="large" animating={true} />} persistor={pStore}>
            <StatusBar barStyle="light-content" backgroundColor={style.colors.blue} />
            <Drawer />
        </PersistGate>
    </Provider>
);

export default RNRedux;
