import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import CalendarNewEventPrompt from './buttons/CalendarNewEventPrompt';
import style from '../Style';
import Translator from '../utils/translator';

export default class CourseRow extends React.PureComponent {
	constructor(props) {
		super(props);
		let backgroundColor = props.theme.eventBackground;
		let borderColor = props.theme.eventBorder;
		let lineColor = '#FFF';

		if (props.theme.courses[props.data.color]) {
			lineColor = props.theme.courses[props.data.color];
		} else {
			lineColor = props.theme.courses.default;
		}

		this.state = { backgroundColor, borderColor, lineColor, popupVisible: false };
	}

	closePopup = () => this.setState({ popupVisible: false });

	openPopup = () => this.setState({ popupVisible: true });

	_onPress = () => {
		requestAnimationFrame(() => {
			this.props.navigation.navigate('Course', {
				data: this.props.data,
			});
		});
	};

	render() {
		const { theme } = this.props;

		if (this.props.data.category === 'nocourse') {
			return (
				<View style={style.schedule.course.noCourse}>
					<Text style={[style.schedule.course.noCourseText, { color: theme.font }]}>
						{Translator.get('NO_CLASS_THIS_DAY')}
					</Text>
				</View>
			);
		} else if (this.props.data.category === 'masked') {
			return null;
		} else {
			let annotations = null,
				subject = null,
				ue = null,
				ueTitle = null;

			if (this.props.data.UE) {
				ueTitle = (
					<View style={style.schedule.course.iconHeader}>
						<MaterialIcons
							name="code"
							size={18}
							style={{ width: 18, height: 18, color: theme.font }}
						/>
					</View>
				);

				ue = <Text style={{ color: theme.font }}>{this.props.data.UE}</Text>;
			}

			if (this.props.data.subject !== 'N/C') {
				subject = (
					<View style={{ flex: 1 }}>
						<Text
							style={[
								style.schedule.course.content,
								style.schedule.course.title,
								{
									textAlign: 'left',
									color: theme.font,
								},
							]}>
							{this.props.data.subject}
						</Text>
					</View>
				);
			}
			if (this.props.data.description?.length > 0) {
				annotations = this.props.data.description.split('\n').map((annotation, key) => {
					return (
						<Text key={key} style={{ color: theme.font }}>
							{annotation}
						</Text>
					);
				});
			}

			let isLargeMode = true;
			let actions = null;
			if (this.props.navigation) {
				actions = null;
				isLargeMode = false;
			}

			const content = (
				<View
					style={[
						style.schedule.course.root,
						{
							backgroundColor: this.state.backgroundColor,
							marginHorizontal: isLargeMode ? 0 : 12,
							borderRadius: isLargeMode ? 0 : 8,
							shadowColor: '#000',
							shadowOffset: {
								width: 0,
								height: 2,
							},
							shadowOpacity: 0.23,
							shadowRadius: 2.62,
							elevation: 4,

							borderLeftWidth: 12,
							borderLeftColor: this.state.lineColor,
						},
					]}>
					<View style={style.schedule.course.row}>
						<View
							style={[
								style.schedule.course.hours,
								{ borderColor: this.state.lineColor },
							]}>
							<View>
								<Text
									style={[
										style.schedule.course.hoursText,
										{ color: theme.font },
									]}>
									{this.props.data.starttime}
								</Text>
							</View>
							<View>
								<Text
									style={[
										style.schedule.course.hoursText,
										{ color: theme.font },
									]}>
									{this.props.data.endtime}
								</Text>
							</View>
						</View>

						<View style={style.schedule.course.contentBlock}>
							<View style={style.schedule.course.contentType}>
								{subject}
								<View>
									<Text
										style={[
											style.schedule.course.title,
											{ color: theme.font },
										]}>
										{this.props.data.category !== this.props.data.subject ? (
											this.props.data.category
										) : (
											<></>
										)}
									</Text>
								</View>
							</View>

							<View style={style.schedule.course.line}>
								{ueTitle}
								<View style={style.schedule.course.container}>{ue}</View>
							</View>
							<View style={{ marginBottom: 16 }} />

							<View style={style.schedule.course.groupsContainer}>
								<View style={style.schedule.course.groupsContent}>
									{annotations}
								</View>
							</View>
						</View>
					</View>
					{actions}
				</View>
			);

			let body = content;
			if (this.props.navigation) {
				body = (
					<View>
						<TouchableHighlight
							onPress={this._onPress}
							onLongPress={this.openPopup}
							underlayColor={theme.selection}>
							{content}
						</TouchableHighlight>
						<CalendarNewEventPrompt
							popupVisible={this.state.popupVisible}
							closePopup={this.closePopup}
							openPopup={this.openPopup}
							theme={theme}
							data={this.props.data}
						/>
					</View>
				);
			}

			return <View style={{ marginVertical: 4 }}>{body}</View>;
		}
	}
}
