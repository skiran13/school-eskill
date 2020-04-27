import React from 'react';
import { Link } from 'react-router-dom';
import Queries from './queries';
import Attempted from './attempted';
import { Segment, Button, Header, Grid } from 'semantic-ui-react';
import _ from 'lodash';

class StudentDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modalVisible: false,
      filter: props.categories,
    };
    this.logout = this.logout.bind(this);
    this.emit = this.emit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({ visible: !this.state.visible });
  }

  logout() {
    this.props.logout();
  }
  componentDidMount() {}
  emit(name, obj) {
    this.props.emit(name, obj);
  }

  render() {
    let { md: det, topics, categories } = this.props;
    let tl = _.toArray(topics).length,
      cl = _.toArray(categories).length;
    return (
      <div>
        <Segment
          centered
          style={{
            minHeight: '100%',
            alignSelf: 'flex-start',
            width: '100%',
          }}
        >
          <Grid padded stackable relaxed doubling divided='vertically'>
            <Grid.Row>
              <Queries categories={cl} topics={tl} />
            </Grid.Row>
          </Grid>

          <Grid padded stackable relaxed doubling divided='vertically'>
            <Grid.Row>
              <Attempted categories={cl} topics={tl} />
            </Grid.Row>
          </Grid>

          <Grid padded stackable relaxed doubling divided='vertically'>
            <Grid.Row />
          </Grid>

          <Grid columns={2} divided>
            <Grid.Row>
              <Grid.Column stretched>
                <Button>
                  <Link to='/newtest'>New Test</Link>
                </Button>
              </Grid.Column>
              <Grid.Column stretched>
                <Button>Skill Analysis Report</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <Header
          inverted={this.state.dark}
          size='tiny'
          style={{
            position: 'relative',
            textAlign: 'center',
            width: '100%',
            alignSelf: 'flex-end',
            fontSize: '1.3em',
          }}
        >
          eSkill - Developed by{' '}
          <a href='https://www.linkedin.com/in/skiran13'>Surya Kiran</a>,{' '}
          <a href='https://www.linkedin.com/in/vonesix'>Vignesh Shankar</a> and{' '}
          <a href='https://www.linkedin.com/in/abhishekchandar'>
            Abhishek Chandar
          </a>
        </Header>
      </div>
    );
  }
}

export default StudentDashboard;
