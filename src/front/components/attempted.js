import React from 'react';
import { Segment, Header, Grid } from 'semantic-ui-react';
class Attempted extends React.Component {
  render() {
    return (
      <Grid.Column className='attempted'>
        <Segment
          basic
          style={{
            minHeight: '100%',
            alignSelf: 'flex-start',
            width: '100%',
          }}
        >
          <Grid stackable>
            <Grid.Column width={15} floated='left'>
              <Segment
                raised
                style={{
                  minHeight: '100%',
                  width: '100%',
                }}
              >
                <Grid.Column width={10}>
                  <Header size='medium' textAlign='left'>
                    Topics Attempted
                  </Header>
                </Grid.Column>
                <Grid.Column width={5}>
                  <Header size='medium' textAlign='right'>
                    {this.props.categories}
                  </Header>
                </Grid.Column>
              </Segment>
            </Grid.Column>

            <Grid.Column width={15}>
              <Segment
                raised
                style={{
                  minHeight: '100%',
                  width: '100%',
                }}
              >
                <Grid.Column width={15}>
                  <Header size='medium' textAlign='left'>
                    Topics Not attempted
                  </Header>
                </Grid.Column>
                <Grid.Column width={5} floated='right'>
                  <Header size='medium' textAlign='right'>
                    {this.props.topics}
                  </Header>
                </Grid.Column>
              </Segment>
            </Grid.Column>
          </Grid>
        </Segment>
      </Grid.Column>
    );
  }
}

export default Attempted;
