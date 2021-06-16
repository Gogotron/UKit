import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import WelcomePagination from '../../components/ui/WelcomePagination';
import WelcomeButton from '../../components/buttons/WelcomeButton';
import styles, { GradientColor } from '../../StyleWelcome';
import Translator from '../../utils/translator';
import SettingsManager from '../../utils/SettingsManager';
import WelcomeBackButton from '../../components/buttons/WelcomeBackButton';

const THEME_LIST = [
	{ id: 'light', title: 'LIGHT_THEME' },
	{ id: 'dark', title: 'DARK_THEME' },
];

const LANGUAGE_LIST = [
	{ id: 'fr', title: 'FRENCH' },
	{ id: 'en', title: 'ENGLISH' },
];

class SecondWelcomePage extends React.Component {
	constructor(props) {
		super(props);
	}

	getLanguage = () => {
		return this.props.getState('lang');
	}

	selectLanguage = (newLang) => {
		this.props.changeState('lang', newLang.id)
		SettingsManager.setLanguage(newLang.id);
	};

	getTheme = () => {
		return this.props.getState('theme');
	}

	selectTheme = (newTheme) => {
		this.props.changeState('theme', newTheme.id)
		SettingsManager.setTheme(newTheme.id);
	};



	render() {
		const { navigation } = this.props;
		return (
			<LinearGradient
				style={{ flex: 1 }}
				colors={GradientColor()}
				start={{ x: 0.05, y: 0.05 }}
				end={{ x: 0.95, y: 0.95 }}>
				<SafeAreaView style={{ flex: 1 }}>
					{/* <WelcomeBackButton onPress={navigation.goBack} /> */}
					<View style={styles('whiteCardContainer')} style={{ flexGrow: 1 }}>
						<View style={styles('whiteCard')}>
							<Text style={styles('whiteCardText')}>
								{Translator.get('YOUR_THEME')}
							</Text>
							{THEME_LIST.map((themeEntry) => (
								<TouchableOpacity
									key={themeEntry.id}
									onPress={() => this.selectTheme(themeEntry)}
									style={
										this.getTheme() === themeEntry.id
											? styles('whiteCardButtonSelected')
											: styles('whiteCardButton')
									}>
									<Text
										style={
											this.getTheme() === themeEntry.id
												? styles('whiteCardButtonTextSelected')
												: styles('whiteCardButtonText')
										}>
										{Translator.get(themeEntry.title)}
									</Text>
								</TouchableOpacity>
							))}
						</View>
						<View style={styles('whiteCard')}>
							<Text style={styles('whiteCardText')}>
								{Translator.get('YOUR_LANGUAGE')}
							</Text>
							{LANGUAGE_LIST.map((languageEntry) => (
								<TouchableOpacity
									key={languageEntry.id}
									onPress={() => this.selectLanguage(languageEntry)}
									style={
										this.getLanguage() === languageEntry.id
											? styles('whiteCardButtonSelected')
											: styles('whiteCardButton')
									}>
									<Text
										style={
											this.getLanguage() === languageEntry.id
												? styles('whiteCardButtonTextSelected')
												: styles('whiteCardButtonText')
										}>
										{Translator.get(languageEntry.title)}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>

					<WelcomeButton
						onPress={() => navigation.navigate('ThirdWelcomePage')}
						buttonText={Translator.get('NEXT')}
					/>

					<WelcomePagination pageNumber={2} maxPage={4} />
				</SafeAreaView>
			</LinearGradient>
		);
	}
}

export default SecondWelcomePage;
