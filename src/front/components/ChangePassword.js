import React from 'react';
import { Button, Checkbox, Form, Input } from 'semantic-ui-react';

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldpass: '',
      pass: '',
      cpass: '',
      success: this.props.success,
    };
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  onClick(e) {
    let { emit } = this.props;
    let { oldpass, pass, cpass } = this.state;
    if (cpass == pass) {
      let data = { _id: this.props.details._id, oldpass, pass };
      emit('cps', data);
    } else {
      this.setState({ success: 'fail' });
    }
    setTimeout(() => {
      if (this.state.success == 'pass') {
        let { logout } = this.props;
        logout();
        window.location.href = '/';
      }
    }, 2000);
  }
  onChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }
  componentWillUpdate(nextProps, nextState) {
    if (this.props.success !== nextProps.success)
      nextState.success = nextProps.success;
  }
  render() {
    let { oldpass, pass, cpass } = this.state;

    return (
      <Form>
        <Form.Field
          required
          control={Input}
          label='Current Password'
          placeholder='Current Password'
          name='oldpass'
          type='password'
          value={oldpass}
          onChange={this.onChange}
        />
        <Form.Field
          required
          control={Input}
          label='New Password'
          placeholder='New Password'
          name='pass'
          type='password'
          value={pass}
          onChange={this.onChange}
        />
        <Form.Field
          required
          control={Input}
          label='Confirm Password'
          type='password'
          placeholder='Confirm Password'
          name='cpass'
          value={cpass}
          onChange={this.onChange}
        />
        {this.state.success == 'fail' ? (
          <div
            className='ui error message'
            style={{
              display: 'block',
              border: 'none',
            }}
          >
            Password Change Failed
          </div>
        ) : this.state.success == 'pass' ? (
          <div
            className='ui success message'
            style={{
              display: 'block',
              border: 'none',
            }}
          >
            Password Change Successfully
          </div>
        ) : null}
        <Form.Field width={5} style={{ textAlign: 'center', margin: 'auto' }}>
          <Button
            primary
            fluid
            type='submit'
            style={{ marginTop: '40px' }}
            onClick={this.onClick}
          >
            Submit
          </Button>
        </Form.Field>
      </Form>
    );
  }
}

export default ChangePassword;
