import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import WeekComponent from './containers/Week';
import moment from 'moment';
import style from '../Style';
import 'moment/locale/fr';
import Swiper from 'react-native-swiper';
import WeekStore from '../stores/WeekStore';

moment.locale('fr');
const swiperReference = 'weekSwiper';

export default class WeekSwiper extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'Semaine',
        tabBarIcon: ({ tintColor }) => {
            return <MaterialCommunityIcons name="calendar-multiple" size={24} style={{ color: tintColor }} />;
        },
    };

    constructor(props) {
        super(props);
        let currentDay = moment();
        if (currentDay.isoWeekday() === 7) {
            currentDay = currentDay.add(1, 'days');
        }
        let groupName = this.props.screenProps.groupName;

        this.state = {
            groupName,
            week: parseInt(currentDay.isoWeek()),
            currentDay,
            weeks: [],
            index: null,
        };
    }

    componentDidMount() {
        let weeks = WeekStore.getWeeks();
        let index = 0;
        for (index; index < weeks.length; index++) {
            if (parseInt(this.state.currentDay.isoWeek()) === weeks[index]) {
                break;
            }
        }
        this.setState({ index, weeks });
    }

    render() {
        console.log({ swipe: 'week', ...this.state });
        if (true || this.state.weeks.length === 0 || this.state.index === null) {
            return (
                <View style={{ flex: 1 }}>
                    <ActivityIndicator style={style.containerView} size="large" animating={false} />
                </View>
            );
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <Swiper
                        ref={swiperReference}
                        showsButtons={false}
                        showsPagination={false}
                        index={this.state.index}
                        loadMinimal={true}
                        loadMinimalSize={7}
                        loop={true}>
                        {this.state.weeks.map((week, key) => {
                            return (
                                <WeekComponent
                                    key={key}
                                    week={week}
                                    groupName={this.state.groupName}
                                    nextFunction={() => this.refs[swiperReference].scrollBy(1, true)}
                                    previousFunction={() => this.refs[swiperReference].scrollBy(-1, true)}
                                />
                            );
                        })}
                    </Swiper>
                </View>
            );
        }
    }
}
