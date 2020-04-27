import React from 'react';
import { Modal } from 'semantic-ui-react';

import ChangeQuestion from './ChangeQuestion';
export default class ChangeModal extends React.Component {
  render() {
    return (
      <Modal
        closeOnDimmerClick
        open={this.props.visible}
        size='large'
        onClose={() => this.props.handleClick()}
      >
        <Modal.Content
          style={{
            backgroundColor: this.props.dark ? '#222' : '#fff',
          }}
        >
          <ChangeQuestion
            n={this.props.n}
            modal
            dark={this.props.dark}
            category={this.props.cat}
            error={this.props.chError}
            success={this.props.chSuccess}
            topic={this.props.topic}
            stateSet={this.props.stateSet}
            emit={this.props.emit}
            afterEmit={this.props.resolve}
          />
        </Modal.Content>
      </Modal>
    );
  }
}
