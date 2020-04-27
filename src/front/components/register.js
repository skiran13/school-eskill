import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Form,
  Input,
  TextArea,
  Button,
  Select,
  Segment,
  Image,
  Container,
  Icon,
  Grid,
  Dropdown,
  Modal,
  Header,
} from 'semantic-ui-react';
import history from './history';
import _ from 'lodash';
class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passError: '',
      value: [],
    };
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange = (e, { value }) => this.setState({ value });
  submit(e) {
    this.setState({ passError: '' });
    let regNo = document.querySelector('#reg').value;

    function getBranch() {
      let branch;

      return branch;
    }
    let obj = {
      name: document.querySelector('#name').value,
      regNo: document.querySelector('#reg').value,
      branch: this.props.mode
        ? 'Faculty'
        : document.querySelector('#branch').innerText,
      classes: this.state.value,
      cbranch: document.querySelector('#schoolbranch').innerText,
      password: document.querySelector('#password').value,
      confirm: document.querySelector('#confirm').value,
      email: document.querySelector('#email').value,
    };
    if (obj.password == obj.confirm) {
      this.props.emit('reg', obj);
      history.push('/');
    } else {
      this.setState({ passError: "Passwords don't match! " });
    }
  }

  render() {
    const options = [
      { key: 'm', text: 'Male', value: 'male' },
      { key: 'f', text: 'Female', value: 'female' },
    ];
    let { value } = this.state;
    const branches = [
      { key: 'c1', text: 'Class 1', value: 'Class 1' },
      { key: 'c2', text: 'Class 2', value: 'Class 2' },
      { key: 'c3', text: 'Class 3', value: 'Class 3' },
      { key: 'c4', text: 'Class 4', value: 'Class 4' },
      { key: 'c5', text: 'Class 5', value: 'Class 5' },
      { key: 'c6', text: 'Class 6', value: 'Class 6' },
      { key: 'c7', text: 'Class 7', value: 'Class 7' },
      { key: 'c8', text: 'Class 8', value: 'Class 8' },
      { key: 'c9', text: 'Class 9', value: 'Class 9' },
      { key: 'c10', text: 'Class 10', value: 'Class 10' },
      { key: 'c11', text: 'Class 11', value: 'Class 11' },
      { key: 'c12', text: 'Class 12', value: 'Class 12' },
    ];
    const schoolbranchs = [
      { key: 'srmpub', text: 'SRM Public School', value: 'srmpub' },
    ];
    return (
      <Grid
        centered
        verticalAlign='middle'
        style={{
          height: '100vh',
          paddingTop: '14px',
          width: '100vw',
          backgroundColor: this.props.dark ? '#222' : '#fff',
        }}
      >
        <Grid.Row verticalAlign='middle'>
          <Grid.Column width={13} textAlign='center'>
            <Segment padded size='big' inverted={this.props.dark}>
              <Header
                as='h2'
                style={{
                  marginBottom: '0',
                }}
              >
                eSkill {this.props.mode ? 'Faculty' : 'Student'} Registration
              </Header>
              <p
                style={{
                  fontSize: '14px',
                }}
              >
                {' '}
                Please fill in the details in order to continue
              </p>
              <Form
                inverted={this.props.dark}
                onSubmit={(e) => {
                  e.preventDefault();
                  this.submit(e);
                }}
              >
                <Form.Field>
                  <label>Full Name</label>
                  <input id='name' required placeholder='Name' />
                </Form.Field>
                <Form.Field>
                  <label>Reg Number</label>
                  <input
                    id='reg'
                    required
                    placeholder={this.props.mode ? 'Id' : 'Reg No.'}
                  />
                </Form.Field>
                <Form.Group widths='equal'>
                  <Form.Field
                    control={Select}
                    required
                    label='School'
                    options={schoolbranchs}
                    placeholder='School'
                    id='schoolbranch'
                  />
                  {this.props.mode ? (
                    <Form.Field
                      control={Dropdown}
                      required
                      multiple
                      selection
                      value={value}
                      onChange={this.handleChange}
                      placeholder='Classes'
                      label='Classes'
                      options={branches}
                      id='classes'
                    />
                  ) : (
                    <Form.Field
                      control={Select}
                      required
                      label='Class'
                      options={branches}
                      placeholder='Class'
                      id='branch'
                    />
                  )}
                </Form.Group>
                <Form.Group widths='equal'>
                  <Form.Input
                    required
                    fluid
                    id='email'
                    label='Email'
                    placeholder='Email ID'
                  />
                  <Form.Input
                    type='password'
                    required
                    fluid
                    id='password'
                    label='Password'
                    placeholder='Password'
                  />
                  <Form.Input
                    type='password'
                    required
                    fluid
                    id='confirm'
                    label='Confirm Password'
                    placeholder='Confirm Password'
                  />
                </Form.Group>

                <Button
                  type='cancel'
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/');
                  }}
                >
                  Cancel
                </Button>
                <Button positive type='submit'>
                  Register
                </Button>
              </Form>
              {this.state.passError !== '' ? (
                <div
                  className='ui error message'
                  style={{
                    display: 'block',
                    border: 'none',
                    height: '38px',
                    fontSize: '1rem',
                  }}
                >
                  {this.state.passError}
                </div>
              ) : null}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
class CustomInput extends React.Component {
  render() {
    return (
      <Button
        primary
        fluid
        onClick={(e) => {
          e.preventDefault();
          this.props.onClick(e);
        }}
      >
        {this.props.value}
      </Button>
    );
  }
}
export default RegisterPage;
