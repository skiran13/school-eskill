import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import Login from './components/login';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import history from './components/history';
import { instanceOf } from 'prop-types';
import RegisterPage from './components/register';
import NewTest from './components/newtest';
import ForgotPage from './components/forgot';
import { Cookies, withCookies } from 'react-cookie';
import _ from 'lodash';
import io from 'socket.io-client';
import CoordinatorDashboard from './components/CoordinatorDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import QuestionPage from './components/QuestionPage';
import ChangeQuestion from './components/ChangeQuestion';
import { server } from './enpoint';
let socket = io.connect(
  // window.location.origin, //changes for running local
  server,
  {
    path: `/socket.io/`,
    rejectUnauthorized: false,
    reconnect: true,
  }
);
import {
  Sidebar,
  Segment,
  Menu,
  Icon,
  Header,
  Dropdown,
  Grid,
  Button,
} from 'semantic-ui-react';
import RequestCourse from './components/RequestCourse';
class Root extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };
  constructor(props) {
    super(props);
    const { cookies } = this.props;

    this.state = {
      isLoggedIn: cookies.get('isLoggedIn') || false,
      err: cookies.get('err') || null,
      details: {},
      email: cookies.get('email') || null,
      documents: cookies.get('documents') || null,
      categories: cookies.get('categories') || [],
      tags: cookies.get('categories') || null,
      level: cookies.get('level') || null,
      fail: '',
      catError: '',
      topError: '',
      tagError: '',
      catSuccess: 'none',
      topSuccess: 'none',
      tagSuccess: 'none',
      topics: [],
      chError: '',
      chSuccess: '',
      qstate: {},
      mode: false,
      canReg: false,
      selcatname: cookies.get('selcat') || '',
      visible: false,
      width: 0,
      height: 0,
      notified: true,
      success: '',
      addSuccess: '',
      addError: '',
      studentCount: 0,
      facultyCount: 0,
      dark: cookies.get('dark') == 'true' ? true : false,
    };
    this.emit = this.emit.bind(this);
    this.logout = this.logout.bind(this);
    this.mainEmit = this.mainEmit.bind(this);
    this.setLoading = this.setLoading.bind(this);
    this.stateSet = this.stateSet.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({ visible: !this.state.visible });
  }
  handleDarkSwitch() {
    // const { cookies } = this.props;
    // cookies.set('dark', !this.state.dark);
    // this.setState({ dark: !this.state.dark });
  }
  logout(props) {
    const { cookies } = this.props;
    cookies.remove('err');
    cookies.remove('isLoggedIn');
    cookies.remove('documents');
    cookies.remove('categories');
    cookies.remove('email');
    cookies.remove('pass');
    cookies.remove('level');
    cookies.remove('tags');
    this.emit('logout');
    this.setState = {
      isLoggedIn: false,
      details: {},
      categories: [],
      tags: [],
      email: null,
      topics: [],
      qstate: {},
    };
  }

  mainEmit(name, data) {
    const { cookies } = this.props;
    socket.emit(name, data);
    this.setState({ email: data.email });
    cookies.set('email', data.email);
    cookies.set('pass', data.pass);
  }
  emit(name, data) {
    socket.emit(name, data);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }
  componentDidMount(props) {
    const { cookies } = this.props;
    const { categories } = this.state;
    history.listen(function (location) {
      window.ga('set', 'page', location.pathname + location.search);
      window.ga('send', 'pageview');
    });
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    socket.on('connect', () => {
      if (cookies.get('email') != null && cookies.get('isLoggedIn')) {
        socket.emit('det', {
          email: cookies.get('email'),
          pass: cookies.get('pass'),
        });
      }
    });
    let topics = [];
    categories.map((c) => {
      c.topics.map((t) => {
        topics.push({
          tid: t.id,
          name: t.name,
          cid: c._id,
          notified: t.notified,
        });
      });
    });
    topics = _.sortBy(topics, 'tid', 'asc');
    this.setState({ topics: topics });
    socket.on('mode', (mode) => {
      this.setState({ mode: mode });
    });
    socket.on('canReg', (mode) => {
      this.setState({ canReg: mode });
    });
    socket.on('questionnumber', (c) => {
      this.setState({ qnumber: c });
    });
    socket.on('count', (car) => {
      this.setState({ studentCount: car[0], facultyCount: car[1] });
    });
    socket.on('validateLogin', (content) => {
      cookies.set('err', content.condition);
      cookies.set('isLoggedIn', content.validate);
      cookies.set('level', content.level);
      if (content.details.notifications.filter((k) => k.unread).length > 0) {
        this.setState({ notified: false });
      }
      this.setState({
        level: content.level,
        isLoggedIn: content.validate,
        err: content.condition,
        details: content.details,
        fail: '',
      });
    });
    socket.on('changeDetails', ({ details }) => {
      if (details.notifications.filter((k) => k.unread).length > 0) {
        this.setState({ notified: false });
      }
      this.setState({ details: details });
    });
    socket.on('fail', (reason) => {
      this.setState({ fail: reason });
    });
    socket.on('details', (content) => {
      if (content.notifications.filter((k) => k.unread).length > 0) {
        this.setState({ notified: false });
      }
      this.setState({ details: content });
    });
    socket.on('documents', (content) => {
      cookies.set('documents', content);
      this.setState({ documents: content });
    });
    socket.on('registerResponse', (res) => {
      if (res.fail) {
        this.setState({ fail: res.message, success: '' });
      } else {
        this.setState({ success: res.message, fail: '' });
      }
    });
    socket.on('q', (q) => {
      this.setState({ qstate: q });
    });
    socket.on('catError', (error) => {
      this.setState({ catError: error });
      error != '' ? this.setState({ catSuccess: 'none' }) : null;
    });
    socket.on('topError', (error) => {
      this.setState({ topError: error });
      error != '' ? this.setState({ topSuccess: 'none' }) : null;
    });
    socket.on('tagError', (error) => {
      this.setState({ tagError: error });
      error != '' ? this.setState({ tagError: 'none' }) : null;
    });
    socket.on('success', (type) => {
      type == 'category' ? this.setState({ catSuccess: 'success' }) : null;
      type == 'topic' ? this.setState({ topSuccess: 'success' }) : null;
      type == 'tag' ? this.setState({ tagSuccess: 'success' }) : null;
    });
    socket.on('addResponse', (res) => {
      if (res.fail) {
        this.setState({ addError: res.message, addSuccess: '' });
      } else {
        this.setState({ addSuccess: res.message, addError: '' });
      }
    });
    socket.on('changeResponse', (res) => {
      if (res.fail) {
        this.setState({ chError: res.message, chSuccess: '' });
      } else {
        this.setState({ chSuccess: res.message, chError: '' });
      }
    });
    socket.on('categories', (cats) => {
      topics = [];
      _.map(cats, (c) => {
        c.topics.map((t) => {
          topics.push({
            tid: parseInt(t.id),
            name: t.name,
            cid: c._id,
            class: c.class,
            notified: t.notified,
          });
        });
      });
      topics = _.sortBy(topics, 'tid', 'asc');
      this.setState({ categories: cats, topics: topics });
    });
    socket.on('tags', (tags) => {
      let company = [],
        exam = [],
        subject = [],
        topic = [];
      _.map(tags, (t) => {
        switch (t.group) {
          case 'company':
            company.push(t);
            break;
          case 'exam':
            exam.push(t);
            break;
          case 'subject':
            subject.push(t);
            break;
          case 'topic':
            topic.push(t);
            break;
        }
      });
      this.setState({
        grouped: {
          company: company,
          exam: exam,
          subject: subject,
          topic: topic,
        },
        tags: tags,
      });
    });
    window.onbeforeunload = () => {
      cookies.set('selcat', this.state.selcatname);
      socket.disconnect();
    };
  }
  handleHomeClick() {
    history.push(`/`);
    this.setState({ visible: false });
  }
  onButtonClick(e) {
    let { details } = this.state;
    details.notifications = [];
    socket.emit('updateNoti', details);
    this.setState({ details: details });
  }
  notificationSeen() {
    setTimeout(() => {
      let { details } = this.state;
      let flag = false;
      details.notifications = details.notifications.map((k) => {
        if (k.unread) {
          k.unread = false;
          flag = true;
        }
        return k;
      });
      if (flag) {
        socket.emit('updateNoti', details);
      }
      this.setState({ notified: true, details: details });
    }, 1000);
  }
  setLoading(type) {
    let newState = this.state;
    newState[type] = 'load';
    this.setState(newState);
  }
  stateSet(key, value, callback) {
    let newstate = this.state;
    newstate[key] = value;
    this.setState(newstate, () => {
      if (callback) {
        callback();
      }
    });
  }
  render() {
    let { width } = this.state;
    return (
      <Router history={history}>
        {this.state.isLoggedIn ? (
          <div>
            <Segment
              style={{
                borderRadius: '0',
                marginBottom: '0',
                padding: '0.5em 1em',
              }}
              className='navbar'
              inverted={this.state.dark}
            >
              <Menu secondary fluid borderless inverted={this.state.dark}>
                {width < 768 ? (
                  <Menu.Item onClick={(e) => this.handleClick()}>
                    <Icon
                      name='bars'
                      size='large'
                      style={{
                        color: '#798162',
                      }}
                    />
                  </Menu.Item>
                ) : null}
                <Menu.Item
                  onClick={(e) => {
                    history.push(`/`);
                  }}
                  className='brand-menu'
                >
                  <Header as='h2' className='brand'>
                    eSkill
                  </Header>
                </Menu.Item>

                <Menu.Menu position='right'>
                  {width >= 768 ? (
                    <Menu.Item
                      onClick={(e) => {
                        e.preventDefault();
                        history.push(`/`);
                      }}
                    >
                      <Icon name='home' size='large' />
                    </Menu.Item>
                  ) : null}
                  {this.state.details.level == 0 ? (
                    <Dropdown
                      icon={
                        <Icon.Group size='large'>
                          <Icon name='bell' />
                          {this.state.notified ? null : (
                            <Icon
                              className='corner top right'
                              name='circle'
                              size='mini'
                              color='red'
                            />
                          )}
                        </Icon.Group>
                      }
                      onClick={(e) => this.notificationSeen()}
                      floating
                      className='item'
                    >
                      {this.state.details.notifications.length > 0 ? (
                        <Dropdown.Menu
                          className='notifications'
                          style={{
                            backgroundColor: !this.state.dark
                              ? 'rgba(240, 240, 240, 0.8)'
                              : 'rgba(20, 20, 20, 0.8)',
                          }}
                        >
                          <Dropdown.Header
                            inverted={this.state.dark}
                            style={{
                              fontWeight: 'bold',
                              color: this.state.dark ? '#fff' : null,
                            }}
                          >
                            <Grid columns={2}>
                              <Grid.Row>
                                <Grid.Column verticalAlign='middle'>
                                  Notifications
                                </Grid.Column>
                                <Grid.Column textAlign='right'>
                                  <Button small onClick={this.onButtonClick}>
                                    Clear all
                                  </Button>
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          </Dropdown.Header>
                          {[...this.state.details.notifications]
                            .reverse()
                            .map((n) => {
                              return (
                                <Dropdown.Item>
                                  <Segment inverted={n.unread}>
                                    <span>{n.name}</span>
                                  </Segment>
                                </Dropdown.Item>
                              );
                            })}
                        </Dropdown.Menu>
                      ) : null}
                    </Dropdown>
                  ) : null}
                  {/* 
                  {width >= 768 ? (
                    <Menu.Item onClick={(e) => this.handleDarkSwitch()}>
                      <Icon
                        name={
                          this.state.dark ? 'lightbulb outline' : 'lightbulb'
                        }
                        size='large'
                      />
                    </Menu.Item>
                  ) : null} */}

                  {width >= 768 ? (
                    <Menu.Item
                      onClick={(e) => {
                        e.preventDefault();
                        this.logout();
                        window.location.href = '/';
                      }}
                    >
                      <Icon name='sign out' size='large' />
                    </Menu.Item>
                  ) : null}
                </Menu.Menu>
              </Menu>
            </Segment>

            <Sidebar.Pushable>
              <Sidebar
                as={Menu}
                animation='push'
                width='thin'
                visible={this.state.visible}
                icon='labeled'
                vertical
              >
                <Menu.Item name='home' onClick={(e) => this.handleHomeClick()}>
                  <Icon name='home' />
                  Home
                </Menu.Item>
                {/* <Menu.Item name="user">
                  <Icon name="user" />
                  Edit Profile
                </Menu.Item> */}
                {/* <Menu.Item onClick={(e) => this.handleDarkSwitch()}>
                  <Icon
                    name={this.state.dark ? 'lightbulb outline' : 'lightbulb'}
                  />
                  {this.state.dark ? 'Light Mode' : 'Dark Mode'}
                </Menu.Item> */}
                <Menu.Item
                  name='logout'
                  onClick={(e) => {
                    e.preventDefault();
                    this.logout();
                    window.location.href = '/';
                  }}
                >
                  <Icon name='sign out' />
                  Logout
                </Menu.Item>
              </Sidebar>
              <Sidebar.Pusher
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  backgroundColor: this.state.dark ? '#222' : '#fff',
                }}
              >
                <Switch>
                  <Segment basic style={{ flexGrow: '1' }}>
                    {this.state.details.details != undefined ? (
                      <div>
                        {this.state.level == 1 ? (
                          <Route
                            path={`/change/:category/:topic/:number`}
                            exact
                            render={(props) => (
                              <ChangeQuestion
                                {...this.state}
                                stateSet={this.stateSet}
                                emit={this.emit}
                                success={this.state.chSuccess}
                                error={this.state.chError}
                                category={props.match.params.category}
                                n={props.match.params.number}
                                topic={props.match.params.topic}
                              />
                            )}
                          />
                        ) : null}
                        {this.state.level == 0 ? (
                          <Route
                            path={`/question/:category/:topic/:id`}
                            exact
                            render={(props) => (
                              <NewTest
                                stateSet={this.stateSet}
                                dark={this.state.dark}
                                q={this.state.qstate}
                                logout={this.logout}
                                topics={this.state.topics}
                                grouped={this.state.grouped}
                                categories={this.state.categories}
                                emit={this.emit}
                                id={this.state.details._id}
                                sname={this.state.details.details.name}
                                i={props.match.params.id}
                                cat={props.match.params.category.replace(
                                  /[+]/g,
                                  ' '
                                )}
                                topic={props.match.params.topic.replace(
                                  /[+]/g,
                                  ' '
                                )}
                              />
                            )}
                          />
                        ) : null}
                        {this.state.level == 0 || this.state.level == 1 ? (
                          <Route
                            path={`/request`}
                            render={(props) => (
                              <RequestCourse
                                stateSet={this.stateSet}
                                q={this.state.qstate}
                                logout={this.logout}
                                categories={this.state.categories}
                                emit={this.emit}
                                details={this.state.details}
                                topics={this.state.topics}
                                dark={this.state.dark}
                              />
                            )}
                          />
                        ) : null}
                        {this.state.level == 0 ? (
                          <Route
                            exact
                            path={`/question/:category/:topic`}
                            render={(props) => (
                              <QuestionPage
                                dark={this.state.dark}
                                md={this.state.details.details}
                                level={this.state.level}
                                emit={this.emit}
                                faculties={this.state.details.faculties}
                                categories={this.state.categories}
                                history={this.props.history}
                                logout={this.logout}
                                details={this.state.details}
                                catError={this.state.catError}
                                topError={this.state.topError}
                                topics={this.state.topics}
                                catSuccess={this.state.catSuccess}
                                setLoading={this.setLoading}
                                topSuccess={this.state.topSuccess}
                                tags={this.state.tags}
                                grouped={this.state.grouped}
                                tagError={this.state.tagError}
                                tagSuccess={this.state.tagSuccess}
                                qs={this.state.qstate}
                                stateSet={this.stateSet}
                                topic={props.match.params.topic}
                                cat={props.match.params.category}
                                width={width}
                              />
                            )}
                          />
                        ) : null}
                        <Route
                          path={`/`}
                          exact
                          render={() =>
                            this.state.level == 2 ? (
                              <AdminDashboard
                                dark={this.state.dark}
                                canReg={this.state.canReg}
                                facultyCount={this.state.facultyCount}
                                studentCount={this.state.studentCount}
                                mode={this.state.mode}
                                md={this.state.details.details}
                                stateSet={this.stateSet}
                                level={this.state.level}
                                emit={this.emit}
                                faculties={this.state.details.faculties}
                                categories={this.state.categories}
                                history={this.props.history}
                                logout={this.logout}
                                details={this.state.details}
                                catError={this.state.catError}
                                topError={this.state.topError}
                                topics={this.state.topics}
                                catSuccess={this.state.catSuccess}
                                setLoading={this.setLoading}
                                topSuccess={this.state.topSuccess}
                                tags={this.state.tags}
                                grouped={this.state.grouped}
                                tagError={this.state.tagError}
                                tagSuccess={this.state.tagSuccess}
                                qnumber={this.state.qnumber}
                              />
                            ) : this.state.level == 4 ? (
                              <FacultyDashboard
                                md={this.state.details.details}
                                emit={this.emit}
                                history={this.props.history}
                                logout={this.logout}
                                setLoading={this.setLoading}
                                stateSet={this.stateSet}
                                emit={this.emit}
                                {...this.state}
                              />
                            ) : this.state.level == 1 ? (
                              <CoordinatorDashboard
                                facultyCount={this.state.facultyCount}
                                dark={this.state.dark}
                                studentCount={this.state.studentCount}
                                md={this.state.details.details}
                                level={this.state.level}
                                emit={this.emit}
                                faculties={this.state.details.faculties}
                                categories={this.state.categories}
                                history={this.props.history}
                                logout={this.logout}
                                details={this.state.details}
                                catError={this.state.catError}
                                qnumber={this.state.qnumber}
                                width={this.state.width}
                                topError={this.state.topError}
                                topics={this.state.topics}
                                catSuccess={this.state.catSuccess}
                                setLoading={this.setLoading}
                                topSuccess={this.state.topSuccess}
                                tags={this.state.tags}
                                grouped={this.state.grouped}
                                tagError={this.state.tagError}
                                stateSet={this.props.stateSet}
                                chError={this.state.chError}
                                chSuccess={this.state.chSuccess}
                                tagSuccess={this.state.tagSuccess}
                                addSuccess={this.state.addSuccess}
                                addError={this.state.addError}
                              />
                            ) : (
                              <StudentDashboard
                                md={this.state.details.details}
                                level={this.state.level}
                                dark={this.state.dark}
                                emit={this.emit}
                                faculties={this.state.details.faculties}
                                categories={this.state.categories}
                                history={this.props.history}
                                logout={this.logout}
                                details={this.state.details}
                                catError={this.state.catError}
                                topError={this.state.topError}
                                topics={this.state.topics}
                                catSuccess={this.state.catSuccess}
                                setLoading={this.setLoading}
                                topSuccess={this.state.topSuccess}
                                tags={this.state.tags}
                                grouped={this.state.grouped}
                                tagError={this.state.tagError}
                                tagSuccess={this.state.tagSuccess}
                                qs={this.state.qstate}
                                stateSet={this.stateSet}
                              />
                            )
                          }
                        />
                      </div>
                    ) : null}
                  </Segment>
                </Switch>

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
                  <a href='https://github.com/skiran13' target='_blank'>
                    Surya Kiran
                  </a>
                  ,{' '}
                  <a href='https://github.com/v16s' target='_blank'>
                    Vignesh Shankar
                  </a>{' '}
                  and{' '}
                  <a href='https://github.com/abhishekchandar' target='_blank'>
                    Abhishek Chandar
                  </a>
                </Header>
              </Sidebar.Pusher>
            </Sidebar.Pushable>
          </div>
        ) : (
          <Switch>
            {this.state.canReg ? (
              <Route
                path={`/register`}
                render={() => (
                  <RegisterPage
                    dark={this.state.dark}
                    mode={this.state.mode}
                    emit={this.emit}
                  />
                )}
              />
            ) : null}
            <Route
              path={`/forgot`}
              render={() => (
                <ForgotPage dark={this.state.dark} emit={this.emit} />
              )}
            />
            <Route
              path={`/`}
              render={() => (
                <Login
                  dark={this.state.dark}
                  fail={this.state.fail}
                  success={this.state.success}
                  emit={this.mainEmit}
                  canReg={this.state.canReg}
                />
              )}
            />
          </Switch>
        )}
      </Router>
    );
  }
}
Root = withCookies(Root);
export default Root;
