import React, { Component } from "react";
import { Link } from "react-router-dom";
import History from "./history";
import Stats from "./stats";
import {
  Sidebar,
  Segment,
  Button,
  Menu,
  Image,
  Container,
  Table,
  Icon,
  Header,
  Input,
  Grid,
  Dropdown,
  Pagination,
  Tab,
  Modal,
  GridRow
} from "semantic-ui-react";
import Categories from "./categories";
import AddQuestion from "./AddQuestion";
import _ from "lodash";
import endpoint from "../enpoint";
import CompletionTable from "./CompletionTable";
import ReportProblem from "./ReportProblem";
import StudentTable from "./StudentTable";
class FacultyDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modalVisible: false,
      filter: props.categories,
      studentDetails: []
    };
    this.logout = this.logout.bind(this);
    this.emit = this.emit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({ visible: !this.state.visible });
  }
  componentDidMount() {
    let { studentDetails } = this.state;
    let { details } = this.props;
    let students = details.details.students;
    students.map(s => {
      if (s.a === true) {
        fetch(endpoint + "/api/student", {
          method: "POST",
          body: JSON.stringify({ sid: s._id, cat: s.cat, topic: s.topic }),
          headers: { "Content-Type": "application/json" }
        })
          .then(res => res.json())
          .then(res => {
            if (!res.err) {
              let i = _.findIndex(studentDetails, {
                _id: s._id,
                cat: s.cat,
                topic: s.topic
              });
              if (i > -1) {
                studentDetails[i] = { ...studentDetails[i], ...res };
              } else {
                studentDetails.push({ ...s, ...res });
              }
              this.setState({ studentDetails: studentDetails });
            }
          });
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    let { studentDetails } = this.state;
    let { details } = nextProps;
    let students = details.details.students;
    students.map(s => {
      if (s.a === true) {
        fetch(endpoint + "/api/student", {
          method: "POST",
          body: JSON.stringify({ sid: s._id, cat: s.cat, topic: s.topic }),
          headers: { "Content-Type": "application/json" }
        })
          .then(res => res.json())
          .then(res => {
            if (!res.err) {
              let i = _.findIndex(studentDetails, {
                _id: s._id,
                cat: s.cat,
                topic: s.topic
              });
              if (i > -1) {
                studentDetails[i] = { ...studentDetails[i], ...res };
              } else {
                studentDetails.push({ ...s, ...res });
              }
              this.setState({ studentDetails: studentDetails });
            }
          });
      }
    });
  }
  logout() {
    this.props.logout();
  }
  emit(name, obj) {
    this.props.emit(name, obj);
  }
  render() {
    let { md: det, topics, categories, details } = this.props;
    let tl = _.toArray(topics).length;
    let { studentDetails } = this.state;
    let cl = _.toArray(categories).length;
    return (
      <div>
        <Segment
          basic
          style={{
            minHeight: "100%",
            alignSelf: "flex-start",
            width: "100%"
          }}
        >
          <Grid padded stackable relaxed centered divided="vertically">
            <Grid.Row>
              <Grid.Column width={13}>
                <Tab
                  menu={{
                    pointing: this.props.width > 768,
                    inverted: this.props.dark,
                    stackable: true
                  }}
                  panes={[
                    {
                      menuItem: "Approval List",
                      render: () => (
                        <Tab.Pane inverted={this.props.dark} attached={false}>
                          <StudentTable
                            stateSet={this.props.stateSet}
                            emit={this.props.emit}
                            details={this.props.details}
                            width={this.props.width}
                            dark={this.props.dark}
                          />
                        </Tab.Pane>
                      )
                    },
                    {
                      menuItem: "Student Progress",
                      render: () => (
                        <Tab.Pane inverted={this.props.dark} attached={false}>
                          <CompletionTable
                            stateSet={this.props.stateSet}
                            emit={this.props.emit}
                            details={this.props.details}
                            width={this.props.width}
                            dark={this.props.dark}
                            studentDetails={studentDetails}
                          />
                        </Tab.Pane>
                      )
                    },
                    {
                      menuItem: "Problem Reports",
                      render: () => (
                        <Tab.Pane inverted={this.props.dark} attached={false}>
                          <ReportProblem
                            details={this.props.details}
                            width={this.props.width}
                            dark={this.props.dark}
                            studentDetails={studentDetails}
                          />
                        </Tab.Pane>
                      )
                    }
                  ]}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    );
  }
}

export default FacultyDashboard;
