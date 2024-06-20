import { connect } from 'react-redux';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';

import { userSlice } from '@/redux/slices/userSlice/userSlice';
import { chatSlice } from '@/redux/slices/chatSlice/chatSlice';
const actions = [
    userSlice.actions,
    chatSlice.actions
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

const connectRedux = (Component) => {
    return connect(mapStateToProps, mapDispatchToProps)(Component);
};

export default connectRedux;