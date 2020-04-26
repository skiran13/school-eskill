import React from 'react';
import { Button } from '@aragon/ui';
import { Link } from 'react-router-dom';
import { Image, Form, Segment, Header } from 'semantic-ui-react';
import { pubpath } from '../enpoint';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.sendToServer = this.sendToServer.bind(this);
  }
  sendToServer(e) {
    const accDetails = {
      email: e.target.querySelectorAll('input')[0].value,
      pass: e.target.querySelectorAll('input')[1].value,
    };

    this.props.emit('det', accDetails);
  }
  render() {
    return (
      <div
        className='container'
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100vw',
          minHeight: '100vh',
          backgroundColor: this.props.dark ? '#222' : '#fff',
        }}
      >
        <div
          className='ui middle aligned center aligned grid'
          style={{
            width: '60%',
            margin: '0 auto',
            minWidth: '400px',
            maxWidth: '500px',
          }}
        >
          <div className='column'>
            <Image
              src={require('../logo.png')}
              size='small'
              style={{ marginBottom: '20px', backdropFilter: 'blur(1px)' }}
              centered
            />

            <form
              className='ui large form'
              style={{
                boxShadow: '0px 0px 3px',
              }}
              onSubmit={(e) => {
                e.preventDefault();
                this.sendToServer(e);
              }}
            >
              <div
                className={
                  this.props.dark
                    ? 'ui segment basic inverted'
                    : 'ui secondary segment basic minimal'
                }
              >
                <Header as='h2' className='login-heading'>
                  eSkill
                </Header>
                <div className='field'>
                  <div className='ui left input'>
                    <input type='text' placeholder='Register/Employee Number' />
                  </div>
                </div>
                <div className='field'>
                  <div className='ui left input'>
                    <input type='password' placeholder='Password' />
                  </div>
                </div>
                <button
                  className='ui fluid large primary submit button'
                  type='submit'
                >
                  Login
                </button>
              </div>

              <div
                className='ui error message'
                style={{
                  display: this.props.fail == '' ? 'none' : 'block',
                  border: 'none',
                }}
              >
                {this.props.fail == 'np'
                  ? 'Wrong Password'
                  : this.props.fail == 'nu'
                  ? `Account doesn't exist`
                  : 'Registration failed'}
              </div>
              <div
                className='ui success message'
                style={{
                  display: this.props.success == '' ? 'none' : 'block',
                  border: 'none',
                }}
              >
                {this.props.success == '' ? '' : 'Registered Successfully'}
              </div>
            </form>

            {this.props.canReg ? (
              <div className='ui message'>
                <Link to={pubpath + '/register'}>Register</Link>
              </div>
            ) : null}

            <div className='ui message'>
              <Link to={pubpath + '/forgot'}>Forgot Password</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
