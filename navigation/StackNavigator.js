import React from 'react';
import {StackNavigator} from 'react-navigation';
import Home from '../components/Home';
import Group from '../components/Group';
import About from '../components/About';
import ENTWebview from "../components/ENTWebview";
import style from '../Style';

export default StackNavigator({
    Home: {
        screen: Home,
        navigationOptions: style.stackNavigator
    },
    Group: {
        screen: Group
    },
    About: {
        screen: About,
        navigationOptions: style.stackNavigator
    },
    ENTWebview: {
        screen: ENTWebview,
        navigationOptions: style.stackNavigator
    }
});