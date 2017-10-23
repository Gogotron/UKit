import React from 'react';
import {StackNavigator} from 'react-navigation';
import Home from '../components/Home';
import Group from '../components/Group';
import About from '../components/About';
import WebBrowser from '../components/WebBrowser';
import Geolocation from '../components/Geolocation';
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
    WebBrowser: {
        screen: WebBrowser,
        navigationOptions: style.stackNavigator
    },
    Geolocation: {
        screen: Geolocation,
        navigationOptions: style.stackNavigator
    }
});