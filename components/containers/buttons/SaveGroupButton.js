import React from 'react';
import { TouchableHighlight, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import store from 'react-native-simple-store';
import { connect } from 'react-redux';
import { setFavoriteGroup } from '../../../actions/setFavoriteGroup';

class SaveGroupButton extends React.Component {
    constructor(props) {
        super(props);
        let savedGroup = null;
        if (props.hasOwnProperty('savedGroup')) {
            savedGroup = props.savedGroup;
        }
        this.state = {
            displayedGroup: this.props.groupName,
            savedGroup,
        };
    }

    saveGroup() {
        if (this.isSaved()) {
            store.update('profile', { group: null }).then(() => {
                this.setState({ savedGroup: null });
                this.props.dispatchSetFavoriteGroup(null);
            });
        } else {
            store.update('profile', { group: this.state.displayedGroup }).then(() => {
                this.setState({ savedGroup: this.state.displayedGroup });
                this.props.dispatchSetFavoriteGroup(this.state.displayedGroup);
            });
        }
    }

    isSaved() {
        return !(this.state.savedGroup === null || this.state.savedGroup !== this.state.displayedGroup);
    }

    render() {
        return (
            <TouchableHighlight
                onPress={() => this.saveGroup()}
                underlayColor={'transparent'}
                style={{
                    justifyContent: 'space-around',
                    paddingLeft: 5,
                }}>
                <View
                    style={{
                        justifyContent: 'space-around',
                        paddingHorizontal: 5,
                    }}>
                    <MaterialIcons name={this.isSaved() ? 'star' : 'star-border'} size={30} style={{ color: 'white' }} />
                </View>
            </TouchableHighlight>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchSetFavoriteGroup: (groupName) => {
            dispatch(setFavoriteGroup(groupName));
        },
    };
};

const mapStateToProps = (state) => {
    return {
        savedGroup: state.favorite.groupName,
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SaveGroupButton);
