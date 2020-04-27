import React from 'react';
import { Segment, Header, Grid } from 'semantic-ui-react';
class Queries extends React.Component {
  render() {
    return (
      <Grid.Column className='queries'>
        <Segment
          basic
          style={{
            minHeight: '100%',
            alignSelf: 'flex-start',
            width: '100%',
          }}
        >
          <Grid stackable>
            <Grid.Column width={5}>
              <Segment
                raised
                style={{
                  minHeight: '100%',
                  width: '100%',
                }}
              >
                <Grid.Column width={10}>
                  <Header size='medium' textAlign='left'>
                    Total Queries
                  </Header>
                </Grid.Column>
                <Grid.Column width={5} floated='right'>
                  <Header size='medium' textAlign='right'>
                    {this.props.categories}
                  </Header>
                </Grid.Column>
              </Segment>
            </Grid.Column>

            <Grid.Column width={5}>
              <Segment
                raised
                style={{
                  minHeight: '100%',
                  width: '100%',
                }}
              >
                <Grid.Column width={10}>
                  <Header size='medium' textAlign='left'>
                    Pending Queries
                  </Header>
                </Grid.Column>
                <Grid.Column width={5} floated='right'>
                  <Header size='medium' textAlign='right'>
                    {this.props.topics}
                  </Header>
                </Grid.Column>
              </Segment>
            </Grid.Column>

            <Grid.Column width={5}>
              <Segment
                raised
                style={{
                  minHeight: '100%',
                  width: '100%',
                }}
              >
                <Grid.Column width={10}>
                  <Header size='medium' textAlign='left'>
                    Solved Queries
                  </Header>
                </Grid.Column>
                <Grid.Column width={5} floated='right'>
                  <Header size='medium' textAlign='right'>
                    5
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

export default Queries;
