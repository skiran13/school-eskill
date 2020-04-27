import React from 'react';
import Stats from './stats';
import { Grid, Tab } from 'semantic-ui-react';
import CoordinatorProblems from './CoordinatorProblems';
import ChangeSearch from './ChangeSearch';
import AddQuestion from './AddQuestion';
import _ from 'lodash';

class CoordinatorDashboard extends React.Component {
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
    let tl = _.toArray(topics).length;

    let cl = _.toArray(categories).length;
    return (
      <div>
        <Grid padded stackable relaxed centered doubling divided='vertically'>
          <Grid.Row>
            <Stats
              categories={cl}
              topics={tl}
              qn={this.props.qnumber}
              students={this.props.studentCount}
              faculty={this.props.facultyCount}
              dark={this.props.dark}
            />
          </Grid.Row>
          <Grid.Row>
            <Grid.Column computer={15}>
              <Tab
                menu={{
                  pointing: this.props.width > 768,
                  inverted: this.props.dark,
                  stackable: true,
                }}
                panes={[
                  {
                    menuItem: 'Problem Reports',
                    render: () => (
                      <Tab.Pane inverted={this.props.dark} attached={false}>
                        <CoordinatorProblems
                          stateSet={this.props.stateSet}
                          emit={this.props.emit}
                          width={this.props.width}
                          details={this.props.details}
                          dark={this.props.dark}
                          chSuccess={this.props.chError}
                          chError={this.props.chSuccess}
                        />
                      </Tab.Pane>
                    ),
                  },
                  {
                    menuItem: 'Add Question',
                    render: () => (
                      <Tab.Pane inverted={this.props.dark} attached={false}>
                        <AddQuestion
                          categories={this.props.categories}
                          tags={this.props.tags}
                          grouped={this.props.grouped}
                          emit={this.emit}
                          topics={this.props}
                          error={this.props.addError}
                          success={this.props.addSuccess}
                          dark={this.props.dark}
                        />
                      </Tab.Pane>
                    ),
                  },
                  {
                    menuItem: 'Change Question',
                    render: () => (
                      <Tab.Pane inverted={this.props.dark} attached={false}>
                        <ChangeSearch
                          categories={this.props.categories}
                          stateSet={this.props.stateSet}
                          emit={this.emit}
                          dark={this.props.dark}
                        />
                      </Tab.Pane>
                    ),
                  },
                ]}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default CoordinatorDashboard;
