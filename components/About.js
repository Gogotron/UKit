import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from 'react-native-navbar';

import style from '../Style';
import URLButton from './containers/buttons/URLButton';

export default class About extends React.Component {
    static navigationOptions = ({ navigation }) => {
        let title = 'À propos';
        let leftButton = (
            <TouchableOpacity
                onPress={() => {
                    navigation.goBack();
                }}
                style={{
                    justifyContent: 'space-around',
                    paddingLeft: 5,
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                    <Ionicons
                        name="ios-arrow-back"
                        size={32}
                        style={{
                            color: 'white',
                        }}
                    />
                    <View
                        style={{
                            justifyContent: 'space-around',
                            marginLeft: 5,
                        }}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                color: 'white',
                            }}>
                            Retour
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
        return {
            title,
            header: (
                <View
                    style={{
                        backgroundColor: style.colors.blue,
                    }}>
                    <NavigationBar title={{ title, tintColor: 'white' }} tintColor={'transparent'} leftButton={leftButton} />
                </View>
            ),
        };
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={style.about.view}>
                    <Text style={style.about.title}>Ukit Bordeaux v{Expo.Constants.manifest.version}</Text>
                    <View style={style.about.content}>
                        <Text>
                            Cette application a été développée par Jean B. dans le cadre du concours HackeTaFac 2017. Aujourd'hui, elle est
                            maintenue par KBDev SARL.
                        </Text>
                    </View>

                    <Text style={style.about.title}>Nous contacter</Text>
                    <View style={style.about.content}>
                        <URLButton url="https://twitter.com/HackJack_" title="Twitter" />
                        <URLButton url="https://ukit-bordeaux.fr" title="Site web" />
                        <URLButton url="https://kbdev.io" title="Site de l'entreprise" />
                    </View>

                    <Text style={style.about.title}>Mentions légales</Text>
                    <View style={style.about.content}>
                        <URLButton url="https://ukit-bordeaux.fr/policies/privacy" title="Politique de confidentialité" />
                    </View>
                </View>
            </View>
        );
    }
}
