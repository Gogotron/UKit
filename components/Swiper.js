import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

/**
 * Default styles
 * @type {StyleSheetPropType}
 */
const styles = {
    container: {
        backgroundColor: 'transparent',
        position: 'relative',
        flex: 1,
    },

    wrapperIOS: {
        backgroundColor: 'transparent',
    },

    wrapperAndroid: {
        backgroundColor: 'transparent',
        flex: 1,
    },

    slide: {
        backgroundColor: 'transparent',
    },

    pagination_x: {
        position: 'absolute',
        bottom: 25,
        left: 0,
        right: 0,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },

    pagination_y: {
        position: 'absolute',
        right: 15,
        top: 0,
        bottom: 0,
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },

    title: {
        height: 30,
        justifyContent: 'center',
        position: 'absolute',
        paddingLeft: 10,
        bottom: -30,
        left: 0,
        flexWrap: 'nowrap',
        width: 250,
        backgroundColor: 'transparent',
    },

    buttonWrapper: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        left: 0,
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    buttonText: {
        fontSize: 50,
        color: '#007aff',
    },
};

export default class extends Component {
    /**
     * Props Validation
     * @type {Object}
     */
    static propTypes = {
        dynamic: PropTypes.bool,
        horizontal: PropTypes.bool,
        children: PropTypes.node.isRequired,
        containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
        style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
        scrollViewStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
        pagingEnabled: PropTypes.bool,
        showsHorizontalScrollIndicator: PropTypes.bool,
        showsVerticalScrollIndicator: PropTypes.bool,
        bounces: PropTypes.bool,
        scrollsToTop: PropTypes.bool,
        removeClippedSubviews: PropTypes.bool,
        automaticallyAdjustContentInsets: PropTypes.bool,
        showsPagination: PropTypes.bool,
        showsButtons: PropTypes.bool,
        disableNextButton: PropTypes.bool,
        loadMinimal: PropTypes.bool,
        loadMinimalSize: PropTypes.number,
        loadMinimalLoader: PropTypes.element,
        index: PropTypes.number,
        renderPagination: PropTypes.func,
        dotStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
        activeDotStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
        dotColor: PropTypes.string,
        activeDotColor: PropTypes.string,
        /**
         * Called when the index has changed because the user swiped.
         */
        onIndexChanged: PropTypes.func,
    };

    /**
     * Default props
     * @return {object} props
     * @see http://facebook.github.io/react-native/docs/scrollview.html
     */
    static defaultProps = {
        dynamic: false,
        horizontal: true,
        pagingEnabled: true,
        showsHorizontalScrollIndicator: false,
        showsVerticalScrollIndicator: false,
        bounces: false,
        scrollsToTop: false,
        removeClippedSubviews: true,
        automaticallyAdjustContentInsets: false,
        showsPagination: true,
        showsButtons: false,
        disableNextButton: false,
        loop: true,
        loadMinimal: false,
        loadMinimalSize: 1,
        index: 0,
        onIndexChanged: () => null,
    };

    /**
     * Init states
     * @return {object} states
     */
    state = this.initState(this.props);

    componentWillReceiveProps(nextProps) {
        let indexUpdated = this.props.index !== nextProps.index;

        // if (nextProps.dynamic) {
        //     indexUpdated = this.props.index <= 2;
        // }

        this.setState(this.initState(nextProps, indexUpdated), () => {
            indexUpdated && this.androidPageIndexChangeFix();
        });
    }

    componentDidMount() {
        setTimeout(() => {
            this.scrollView.scrollTo({ x: this.state.width * this.state.index, y: 0, animated: false });
        });
    }

    componentWillUpdate(nextProps, nextState) {
        // If the index has changed, we notify the parent via the onIndexChanged callback
        if (this.state.index !== nextState.index) {
            this.props.onIndexChanged(nextState.index);
            return true;
        }
        return false;
    }

    initState(props, updateIndex = false) {
        // set the current state
        const state = this.state || { width: 0, height: 0, offset: { x: 0, y: 0 } };

        const initState = {
            autoplayEnd: false,
            loopJump: false,
            offset: {},
            lengthBeforeRefresh: null,
        };

        initState.total = props.children ? props.children.length || 1 : 0;

        if (state.total === initState.total && !updateIndex) {
            // retain the index
            initState.index = state.index;
        } else {
            initState.index = initState.total > 1 ? Math.min(props.index, initState.total - 1) : 0;
        }

        // Default: horizontal
        const { width, height } = Dimensions.get('window');

        initState.dir = 'x';

        if (props.width) {
            initState.width = props.width;
        } else if (this.state && this.state.width) {
            initState.width = this.state.width;
        } else {
            initState.width = width;
        }

        if (props.height) {
            initState.height = props.height;
        } else if (this.state && this.state.height) {
            initState.height = this.state.height;
        } else {
            initState.height = height;
        }

        if (initState.index === 1) {
            this.scrollView.scrollTo({ x: width, y: 0, animated: false });
        }

        initState.offset.x = width * props.index;

        this.internals = {
            ...this.internals,
            isScrolling: false,
            offset: initState.offset,
        };

        return initState;
    }

    // include internals with state
    fullState() {
        return Object.assign({}, this.state, this.internals);
    }

    onLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        const offset = (this.internals.offset = {});
        const state = { width, height };

        if (this.state.total > 1) {
            let setup = this.state.index;
            offset.x = width * setup;
        }

        // only update the offset in state if needed, updating offset while swiping
        // causes some bad jumping / stuttering
        if (!this.state.offset || width !== this.state.width || height !== this.state.height) {
            state.offset = offset;
        }

        this.setState(state);
    };

    /**
     * Scroll begin handle
     * @param  {object} e native event
     */
    onScrollBegin = (e) => {
        // update scroll state
        this.internals.isScrolling = true;
        this.props.onScrollBeginDrag && this.props.onScrollBeginDrag(e, this.fullState(), this);
    };

    /**
     * Scroll end handle
     * @param  {object} e native event
     */
    onScrollEnd = (e) => {
        // update scroll state
        this.internals.isScrolling = false;

        this.updateIndex(e.nativeEvent.contentOffset, () => {
            // if `onMomentumScrollEnd` registered will be called here
            this.props.onMomentumScrollEnd && this.props.onMomentumScrollEnd(e, this.fullState(), this);
        });
    };

    /**
     * Drag end handle
     * @param {object} e native event
     */
    onScrollEndDrag = (e) => {
        const { contentOffset } = e.nativeEvent;
        const { horizontal, children } = this.props;
        const { index } = this.state;
        const { offset } = this.internals;
        const previousOffset = horizontal ? offset.x : offset.y;
        const newOffset = horizontal ? contentOffset.x : contentOffset.y;

        if (previousOffset === newOffset && (index === 0 || index === children.length - 1)) {
            this.internals.isScrolling = false;
        }
    };

    /**
     * Update index after scroll
     * @param  {object} offset content offset
     */
    updateIndex = (offset, cb) => {
        const state = this.state;
        let index = state.index;
        const diff = offset.x - this.internals.offset.x;
        const step = state.width;

        // Do nothing if offset no change.
        if (!diff) return;

        // Note: if touch very very quickly and continuous,
        // the variation of `index` more than 1.
        // parseInt() ensures it's always an integer
        index = parseInt(index + Math.round(diff / step));

        const newState = {};
        newState.index = index;

        this.internals.offset = offset;

        this.setState(newState, () => cb());
    };

    /**
     * Scroll by index
     * @param  {number} index offset index
     * @param  {bool} animated
     */

    scrollBy = (index, animated = true) => {
        if (this.internals.isScrolling || this.state.total < 2) return;
        const state = this.state;
        const diff = (this.props.loop ? 1 : 0) + index + this.state.index;
        let x = 0;
        let y = 0;
        x = diff * state.width;

        if (!this.props.dynamic && Platform.OS !== 'ios') {
            this.scrollView && this.scrollView[animated ? 'setPage' : 'setPageWithoutAnimation'](diff);
        } else {
            this.scrollView && this.scrollView.scrollTo({ x, y, animated });
        }

        // update scroll state
        this.internals.isScrolling = true;
        this.setState({
            autoplayEnd: false,
        });

        // trigger onScrollEnd manually in android
        if (!this.props.dynamic && (!animated || Platform.OS !== 'ios')) {
            setImmediate(() => {
                this.onScrollEnd({
                    nativeEvent: {
                        position: diff,
                    },
                });
            });
        }
    };

    scrollViewPropOverrides = () => {
        const props = this.props;
        let overrides = {};

        for (let prop in props) {
            // if(~scrollResponders.indexOf(prop)
            if (
                typeof props[prop] === 'function' &&
                prop !== 'onMomentumScrollEnd' &&
                prop !== 'renderPagination' &&
                prop !== 'onScrollBeginDrag'
            ) {
                let originResponder = props[prop];
                overrides[prop] = (e) => originResponder(e, this.fullState(), this);
            }
        }

        return overrides;
    };

    /**
     * Render pagination
     * @return {object} react-dom
     */
    renderPagination = () => {
        // By default, dots only show when `total` >= 2
        if (this.state.total <= 1) return null;

        let dots = [];
        const ActiveDot = this.props.activeDot || (
            <View
                style={[
                    {
                        backgroundColor: this.props.activeDotColor || '#007aff',
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        marginLeft: 3,
                        marginRight: 3,
                        marginTop: 3,
                        marginBottom: 3,
                    },
                    this.props.activeDotStyle,
                ]}
            />
        );
        const Dot = this.props.dot || (
            <View
                style={[
                    {
                        backgroundColor: this.props.dotColor || 'rgba(0,0,0,.2)',
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        marginLeft: 3,
                        marginRight: 3,
                        marginTop: 3,
                        marginBottom: 3,
                    },
                    this.props.dotStyle,
                ]}
            />
        );
        for (let i = 0; i < this.state.total; i++) {
            dots.push(i === this.state.index ? React.cloneElement(ActiveDot, { key: i }) : React.cloneElement(Dot, { key: i }));
        }

        return (
            <View pointerEvents="none" style={[styles['pagination_x'], this.props.paginationStyle]}>
                {dots}
            </View>
        );
    };

    renderTitle = () => {
        const child = this.props.children[this.state.index];
        const title = child && child.props && child.props.title;
        return title ? <View style={styles.title}>{this.props.children[this.state.index].props.title}</View> : null;
    };

    renderNextButton = () => {
        let button = null;

        if (this.state.index !== this.state.total - 1) {
            button = this.props.nextButton || <Text style={styles.buttonText}>›</Text>;
        }

        return (
            <TouchableOpacity onPress={() => button !== null && this.scrollBy(1)} disabled={this.props.disableNextButton}>
                <View>{button}</View>
            </TouchableOpacity>
        );
    };

    renderPrevButton = () => {
        let button = null;

        if (this.state.index !== 0) {
            button = this.props.prevButton || <Text style={styles.buttonText}>‹</Text>;
        }

        return (
            <TouchableOpacity onPress={() => button !== null && this.scrollBy(-1)}>
                <View>{button}</View>
            </TouchableOpacity>
        );
    };

    renderButtons = () => {
        return (
            <View
                pointerEvents="box-none"
                style={[
                    styles.buttonWrapper,
                    {
                        width: this.state.width,
                        height: this.state.height,
                    },
                    this.props.buttonWrapperStyle,
                ]}>
                {this.renderPrevButton()}
                {this.renderNextButton()}
            </View>
        );
    };

    refScrollView = (view) => {
        this.scrollView = view;
        this.androidPageIndexChangeFix();
    };

    androidPageIndexChangeFix() {
        if (!this.props.dynamic && this.scrollView && Platform.OS !== 'ios') {
            this.scrollView.setPage(this.state.index);
        }
    }

    renderScrollView = (pages) => {
        return (
            <ScrollView
                ref={this.refScrollView}
                {...this.props}
                {...this.scrollViewPropOverrides()}
                contentContainerStyle={[styles.wrapperIOS, this.props.style]}
                onScrollBeginDrag={this.onScrollBegin}
                onMomentumScrollEnd={this.onScrollEnd}
                onScrollEndDrag={this.onScrollEndDrag}
                horizontal={true}
                pagingEnabled={true}
                style={this.props.scrollViewStyle}>
                {pages}
            </ScrollView>
        );
    };

    /**
     * Default render
     * @return {object} react-dom
     */
    render() {
        const state = this.state;
        const props = this.props;
        const { index, total, width, height } = this.state;
        const {
            children,
            containerStyle,
            loop,
            loadMinimal,
            loadMinimalSize,
            loadMinimalLoader,
            renderPagination,
            showsButtons,
            showsPagination,
        } = this.props;

        const loopVal = loop ? 1 : 0;
        let pages = [];

        const pageStyle = [{ width: width, height: height }, styles.slide];
        const pageStyleLoading = {
            width,
            height,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        };

        // For make infinite at least total > 1
        if (total > 1) {
            // Re-design a loop model for avoid img flickering
            pages = Object.keys(children);

            pages = pages.map((page, i) => {
                if (loadMinimal) {
                    if (i >= index + loopVal - loadMinimalSize && i <= index + loopVal + loadMinimalSize) {
                        return (
                            <View style={pageStyle} key={children[page].key}>
                                {children[page]}
                            </View>
                        );
                    } else {
                        return (
                            <View style={pageStyleLoading} key={children[page].key}>
                                {loadMinimalLoader ? loadMinimalLoader : <ActivityIndicator />}
                            </View>
                        );
                    }
                } else {
                    return (
                        <View style={pageStyle} key={children[page].key}>
                            {children[page]}
                        </View>
                    );
                }
            });
        } else {
            pages = (
                <View style={pageStyle} key={0}>
                    {children}
                </View>
            );
        }

        return (
            <View style={[styles.container, containerStyle]} onLayout={this.onLayout}>
                {this.renderScrollView(pages)}
                {showsPagination && (renderPagination ? renderPagination(index, total, this) : this.renderPagination())}
                {this.renderTitle()}
                {showsButtons && this.renderButtons()}
            </View>
        );
    }
}
