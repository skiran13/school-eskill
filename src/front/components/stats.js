import React from 'react';
import { Segment, Header, Grid } from 'semantic-ui-react';
class Categories extends React.Component {
  render() {
    return (
      <Grid.Column className='stats'>
        <Segment
          basic
          style={{
            minHeight: '100%',
            alignSelf: 'flex-start',
            width: '100%',
          }}
        >
          <Grid stackable columns={5}>
            <Grid.Column>
              <Segment
                inverted={this.props.dark}
                raised
                style={{
                  minHeight: '100%',
                  width: '100%',
                }}
              >
                <Grid.Column width={10}>
                  <Header
                    inverted={this.props.dark}
                    size='medium'
                    textAlign='left'
                  >
                    Total Subjects
                  </Header>
                </Grid.Column>
                <Grid.Column width={5} floated='right'>
                  <Header
                    inverted={this.props.dark}
                    size='medium'
                    textAlign='right'
                  >
                    {this.props.categories}
                  </Header>
                </Grid.Column>
              </Segment>
            </Grid.Column>

            <Grid.Column>
              <Segment
                inverted={this.props.dark}
                raised
                style={{
                  minHeight: '100%',
                  width: '100%',
                }}
              >
                <Grid.Column width={10}>
                  <Header
                    inverted={this.props.dark}
                    size='medium'
                    textAlign='left'
                  >
                    Total Topics
                  </Header>
                </Grid.Column>
                <Grid.Column width={5} floated='right'>
                  <Header
                    inverted={this.props.dark}
                    size='medium'
                    textAlign='right'
                  >
                    {this.props.topics}
                  </Header>
                </Grid.Column>
              </Segment>
            </Grid.Column>

            <Grid.Column>
              <Segment
                inverted={this.props.dark}
                raised
                style={{
                  minHeight: '100%',
                  width: '100%',
                }}
              >
                <Grid.Column width={10}>
                  <Header
                    inverted={this.props.dark}
                    size='medium'
                    textAlign='left'
                  >
                    Total Questions
                  </Header>
                </Grid.Column>
                <Grid.Column width={5} floated='right'>
                  <Header
                    inverted={this.props.dark}
                    size='medium'
                    textAlign='right'
                  >
                    {this.props.qn}
                  </Header>
                </Grid.Column>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment
                raised
                inverted={this.props.dark}
                style={{
                  minHeight: '100%',
                  width: '100%',
                }}
              >
                <Grid.Column width={10}>
                  <Header
                    inverted={this.props.dark}
                    size='medium'
                    textAlign='left'
                  >
                    Registered Students
                  </Header>
                </Grid.Column>
                <Grid.Column width={5} floated='right'>
                  <Header
                    inverted={this.props.dark}
                    size='medium'
                    textAlign='right'
                  >
                    {this.props.students}
                  </Header>
                </Grid.Column>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment
                raised
                inverted={this.props.dark}
                style={{
                  minHeight: '100%',
                  width: '100%',
                }}
              >
                <Grid.Column width={10}>
                  <Header
                    inverted={this.props.dark}
                    size='medium'
                    textAlign='left'
                  >
                    Registered Faculty
                  </Header>
                </Grid.Column>
                <Grid.Column width={5} floated='right'>
                  <Header
                    inverted={this.props.dark}
                    size='medium'
                    textAlign='right'
                  >
                    {this.props.faculty}
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

export default Categories;
