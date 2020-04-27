import React from 'react';
import { Grid } from 'semantic-ui-react';
import { timeFormat } from 'd3-time-format';
import Categories from './categories';
import Stats from './stats';
import Configuration from './configuration';
import _ from 'lodash';

class Dashboard extends React.Component {
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
        <Grid padded stackable relaxed doubling divided='vertically'>
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
            <Categories
              dark={this.props.dark}
              categories={this.props.categories}
              emit={this.emit}
              catError={this.props.catError}
              topError={this.props.topError}
              topics={this.props.topics}
              loading={this.props.setLoading}
              catSuccess={this.props.catSuccess}
              topSuccess={this.props.topSuccess}
              stateSet={this.props.stateSet}
            />
            <Configuration
              dark={this.props.dark}
              emit={this.props.emit}
              mode={this.props.mode}
              canReg={this.props.canReg}
            />
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
