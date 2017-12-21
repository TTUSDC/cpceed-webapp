import React from 'react';
import PropTypes from 'prop-types';

import Layer from 'grommet/components/Layer';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';

import logger from 'logger.js';
import Login from './Login.jsx';
import Register from './Register.jsx';

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(newIndex) {
    this.setState({
      index: newIndex,
    });
  }

  render() {
    return (
      <Layer
        closer
        flush={false}
        align='center'
        onClose={() => {
          this.props.authCancelled();
        }}
      >
        <Tabs
          activeIndex={this.state.index}
          justify='center'
          responsive={false}
          onActive={(event) => {
            this.handleTabChange(event);
          }}
        >
          <Tab title='Login'>
            <Login
              handleLogin={this.props.handleLogin}
              logErr={this.props.logErr}
              waiting={this.props.waiting}
            />
          </Tab>
          <Tab title='Register'>
            <Register
              handleRegister={this.props.handleRegister}
              regErr={this.props.regErr}
              waiting={this.props.waiting}
            />
          </Tab>
        </Tabs>
      </Layer>
    );
  }
}

Auth.propTypes = {
  handleRegister: PropTypes.func,
  handleLogin: PropTypes.func,
  authCancelled: PropTypes.func.isRequired,
  regErr: PropTypes.string,
  logErr: PropTypes.string,
  waiting: PropTypes.bool,
};

Auth.defaultProps = {
  handleRegister: () => logger.error('handleRegister called without being passed'),
  handleLogin: () => logger.error('handleLogin called without being passed'),
  regErr: '',
  logErr: '',
  waiting: false,
};

export default Auth;
