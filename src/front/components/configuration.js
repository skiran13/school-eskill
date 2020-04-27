import React from 'react';
import { Segment, Header, Grid, Radio } from 'semantic-ui-react';
class Configuration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.mode ? 'On' : 'Off',
      reg: props.canReg ? 'On' : 'Off',
    };
    this.switch = this.switch.bind(this);
    this.radio = React.createRef();
  }
  switch(checked) {
    let { emit } = this.props;

    emit('changeMode', checked);
  }
  switchReg(checked) {
    let { emit } = this.props;
    emit('toggleReg', checked);
  }
  componentDidMount() {
    let { mode } = this.props;
    this.setState({ type: mode ? 'On' : 'Off' });
  }
  render() {
    return (
      <Grid.Column width={8}>
        <Segment inverted={this.props.dark}>
          <Segment basic>
            <Header inverted={this.props.dark} size='large' textAlign='center'>
              Configuration
            </Header>
          </Segment>

          <Segment inverted={this.props.dark} basic>
            <Header as='h4' inverted={this.props.dark}>
              Faculty Registration
              <Radio
                toggle
                checked={this.props.mode}
                style={{ margin: '0 2em', marginTop: '5px' }}
                onChange={(e, d) => this.switch(d.checked)}
              />
              {this.props.mode ? 'On' : 'Off'}
            </Header>
          </Segment>
          <Segment inverted={this.props.dark} basic>
            <Header as='h4' inverted={this.props.dark}>
              Registration
              <Radio
                toggle
                checked={this.props.canReg}
                style={{ margin: '0 2em', marginTop: '5px' }}
                onChange={(e, d) => this.switchReg(d.checked)}
              />
              {this.props.canReg ? 'On' : 'Off'}
            </Header>
          </Segment>
        </Segment>
      </Grid.Column>
    );
  }
}

export default Configuration;
