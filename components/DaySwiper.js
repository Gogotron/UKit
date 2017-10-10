import React from 'react';
import {Platform, View, ActivityIndicator} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DayComponent from './containers/Day';
import moment from 'moment';
import style from '../Style';
import 'moment/locale/fr';
import Swiper from 'react-native-swiper';
import store from 'react-native-simple-store';

moment.locale('fr');

export default class DaySwiper extends React.Component {
    static navigationOptions = {
        tabBarLabel: "Jour",
        tabBarIcon: ({tintColor}) => {
            let size = (Platform.OS === 'android') ? 16 : 24;
            return (
                <MaterialCommunityIcons
                    name="calendar"
                    size={size}
                    style={{color: tintColor}}
                />
            )
        }
    };

    constructor(props) {
        super(props);
        let currentDay = moment();
        if (currentDay.isoWeekday() === 7) {
            currentDay = currentDay.add(1, 'days');
        }
        let currentMonth = currentDay.month();
        let currentYear = currentDay.year();
        let groupName = this.props.screenProps.groupName;
        this.state = {
            groupName,
            currentDay: currentDay,
            index: null,
            startYear: (currentMonth > 7) ? currentYear : currentYear - 1,
            endYear: (currentMonth > 7) ? currentYear + 1 : currentYear,
            days: []
        };
    }

    componentWillMount() {
        // setTimeout(_ => this.generateAllDays());
        setTimeout(() => {
            store.get("days").then((days) => {
                let index = 0;
                for (index; index < days.data.length; index++) {
                    if (this.state.currentDay.isSame(days.data[index])) {
                        return true;
                    }
                }
                this.setState({index, days: days.data});
            });
        });
    }

    generateAllDays() {
        let days = [];
        let day = moment().set({year: this.state.startYear, month: 7, date: 20});
        let lastDay = moment().set({year: this.state.endYear, month: 6, date: 31});
        let index = 0;
        let currentIndex = 0;
        while (day.isBefore(lastDay, 'day')) {
            let isSunday = (day.isoWeekday() === 7);
            if (day.isSame(this.state.currentDay, 'day')) {
                if (!isSunday) {
                    currentIndex = index;
                } else {
                    currentIndex = index + 1;
                }
            }
            if (!isSunday) {
                days.push(day.clone());
                index++;
            }
            day = day.add(1, 'days');
        }
        this.setState({index: Math.min(currentIndex, index - 1), days});
    }

    render() {
        if (this.state.days.length === 0 || this.state.index === null) {
            return (<ActivityIndicator style={style.containerView} size="large" animating={true}/>);
        } else {
            return (
                <Swiper ref="daySwiper"
                        showsButtons={false}
                        showsPagination={false}
                        index={this.state.index}
                        loadMinimal={true}
                        loadMinimalSize={7}
                        loop={true}
                >
                    {this.state.days.map((day, key) => {
                        return (<DayComponent key={key}
                                              day={day}
                                              groupName={this.state.groupName}
                                              nextFunction={_ => this.refs.daySwiper.scrollBy(1, true)}
                                              previousFunction={_ => this.refs.daySwiper.scrollBy(-1, true)}/>);
                    })}
                </Swiper>
            );
        }
    }
}