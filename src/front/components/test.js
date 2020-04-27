import React, { Component } from 'react';
import {
  Sidebar,
  Segment,
  Button,
  Menu,
  Image,
  Icon,
  Header,
  Input,
} from 'semantic-ui-react';
class XYZ extends React.Component {
  constructor(props) {
    super(props);
    this.state = { Visibility: false, activeItem: 'home' };
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  toggleVisibility() {
    this.setState({ Visibility: !this.state.visible });
  }

  render() {
    const { Visibility, activeItem } = this.state;

    return (
      <div>
        <Button onClick={this.toggleVisibility}>Toggle Visibility</Button>
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            animation='overlay'
            width='thin'
            visible={visible}
            icon='labeled'
            vertical
            inverted
          >
            <Menu.Item
              name='home'
              onClick={(e) => {
                history.push(`/`);
              }}
            >
              <Icon name='home' />
              Home
            </Menu.Item>
            <Menu.Item name='gamepad'>
              <Icon name='gamepad' />
              Games
            </Menu.Item>
            <Menu.Item name='camera'>
              <Icon name='camera' />
              Channels
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              <Header as='h3'>Application Content</Header>
              <Image src='/assets/images/wireframe/paragraph.png' />
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default XYZ;
