import React, { Component } from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import Latex from 'react-latex';
class Answers extends Component {
  state = {};
  render() {
    let { correct, options } = this.props;
    return (
      <Segment inverted={this.props.dark}>
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <Grid column={2}>
                <Grid.Column>
                  <Segment
                    inverted={correct === 'a' || this.props.dark}
                    color={
                      correct === 'a'
                        ? 'green'
                        : this.props.dark
                        ? 'grey'
                        : null
                    }
                  >
                    {' '}
                    <Latex>{options.a}</Latex>
                  </Segment>
                </Grid.Column>
              </Grid>
            </Grid.Column>
            <Grid.Column>
              <Grid column={2}>
                <Grid.Column>
                  <Segment
                    inverted={correct === 'b' || this.props.dark}
                    color={
                      correct === 'b'
                        ? 'green'
                        : this.props.dark
                        ? 'grey'
                        : null
                    }
                  >
                    <Latex>{options.b}</Latex>
                  </Segment>
                </Grid.Column>
              </Grid>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Grid column={2}>
                <Grid.Column>
                  <Segment
                    inverted={correct === 'c' || this.props.dark}
                    color={
                      correct === 'c'
                        ? 'green'
                        : this.props.dark
                        ? 'grey'
                        : null
                    }
                  >
                    <Latex>{options.c}</Latex>
                  </Segment>
                </Grid.Column>
              </Grid>
            </Grid.Column>
            <Grid.Column>
              <Grid column={2}>
                <Grid.Column>
                  <Segment
                    inverted={correct === 'd' || this.props.dark}
                    color={
                      correct === 'd'
                        ? 'green'
                        : this.props.dark
                        ? 'grey'
                        : null
                    }
                  >
                    <Latex>{options.d}</Latex>
                  </Segment>
                </Grid.Column>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

export default Answers;
