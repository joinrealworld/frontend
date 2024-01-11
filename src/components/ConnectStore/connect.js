import { connect as connectRedux } from 'react-redux';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';

import { userSlice } from '@/redux/slices/userSlice/userSlice';
const actions = [
    userSlice.actions
];


const mapStateToProps = (state) => {
    return { ...state }
}

const mapDispatchToProps = (dispatch) => {
    const creators = Map().merge(...actions)
        .filter(value => typeof value === 'function')
        .toObject();
    return { actions: bindActionCreators(creators, dispatch), dispatch }
}

export const connect = (Component) => {
    return connectRedux(mapStateToProps, mapDispatchToProps)(Component);
};