import React from 'react';
import {View, Text, StatusBar, Platform, TouchableHighlight, TextInput} from 'react-native';
import style from '../Style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationBar from 'react-native-navbar';
import {Fumi} from 'react-native-textinput-effects';
import URLButton from './containers/buttons/URLButton';
import AwesomeButton from 'react-native-awesome-button';

export default class Demo extends React.Component {

    static navigationOptions = ({navigation}) => {
        let title = 'Demo';
        let leftButton = (
            <TouchableHighlight onPress={_ => {
                navigation.navigate('DrawerOpen')
            }} underlayColor={"transparent"} style={{
                justifyContent: 'space-around',
                paddingLeft: 5
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <MaterialCommunityIcons
                        name="menu"
                        size={32}
                        style={{
                            color: 'white'
                        }}
                    />
                </View>
            </TouchableHighlight>
        );
        return {
            title,
            header: (
                <View
                    style={{
                        paddingTop: (Platform.OS === "android") ? StatusBar.currentHeight : 0,
                        backgroundColor: style.colors.green
                    }}>
                    <NavigationBar
                        title={{title, tintColor: "white"}}
                        tintColor={"transparent"}
                        leftButton={leftButton}
                    />
                </View>
            )
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            buttonState: 'idle'
        };
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin() {
        this.setState({ buttonState: 'busy' });
        setTimeout(() => {
            this.setState({ buttonState: 'success' });
        }, 2500);
    }

    render() {
        return (
            <View style={style.demo.view}>
                <Text style={style.demo.title}>Connexion</Text>
                <Fumi
                    label={'Adresse email'}
                    labelStyle={style.demo.labelStyle}
                    style={style.demo.rootStyle}
                    inputStyle={style.demo.inputStyle}
                    iconClass={Feather}
                    iconName={'at-sign'}
                    iconColor={'black'}
                    iconSize={20}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    keyboardType={'email-address'}
                />
                <Fumi
                    label={'Mot de passe'}
                    labelStyle={style.demo.labelStyle}
                    style={style.demo.rootStyle}
                    inputStyle={style.demo.inputStyle}
                    iconClass={MaterialCommunityIcons}
                    iconName={'textbox-password'}
                    iconColor={'black'}
                    iconSize={20}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    keyboardType={(Platform.OS === "android") ? 'visible-password' : 'default'}
                    secureTextEntry={true}
                />
                <AwesomeButton
                    states={{
                        idle: {
                            text: 'Se connecter',
                            icon: <MaterialIcons name="person" color="rgba(255, 255, 255, .9)" />,
                            iconAlignment: 'left',
                            backgroundStyle: {
                                backgroundColor: style.colors.lightblue,
                                minHeight: 40,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 0
                            },
                            labelStyle: {
                                color: 'white',
                                fontWeight: 'bold',
                                alignSelf: 'center',
                                marginLeft: 10
                            },
                            onPress: this.handleLogin
                        },
                        busy: {
                            text: 'Connexion en cours',
                            spinner: true,
                            spinnerProps: {
                                animated: true,
                                color: 'white'
                            },
                            backgroundStyle: {
                                backgroundColor: 'darkblue',
                                minHeight: 40,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 0
                            }
                        },
                        success: {
                            text: 'Connecté',
                            backgroundStyle: {
                                backgroundColor: 'green',
                                minHeight: 40,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 0
                            }
                        }
                    }}
                    transitionDuration={400}
                    buttonState={this.state.buttonState}
                />
                <View style={style.demo.content}>
                    <URLButton url="https://idnum.u-bordeaux.fr/" title="Activer mon IDNUM"/>
                    <URLButton url="https://idnum.u-bordeaux.fr/" title="Perte d'identifiant ou de mot de passe"/>
                    <URLButton url="https://idnum.u-bordeaux.fr/faq" title="Questions fréquentes"/>
                </View>
            </View>
        );
    }
}