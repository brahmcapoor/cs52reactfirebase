import React, { Component } from "react";
import firebase from "./firebase";
import { Card, CardBody, CardTitle } from "reactstrap";
import { Button } from "reactstrap";
import "./styles.css";

function AddUserForm(props) {
  const {
    userName,
    status,
    onNameChangeHandler,
    onStatusChangeHandler,
    onCreate,
  } = props;
  return (
    <div>
      <form>
        <label>
          Name:
          <input value={userName} type="text" onChange={onNameChangeHandler} />
        </label>
        <label>
          Status:
          <input value={status} type="text" onChange={onStatusChangeHandler} />
        </label>
      </form>
      <Button color="primary" onClick={onCreate}>
        Add User
      </Button>
    </div>
  );
}

function ControlPanel(props) {
  const {
    userName,
    status,
    onNameChangeHandler,
    onStatusChangeHandler,
    profileCreator,
  } = props;
  return (
    <div className="cardContainer">
      <Card className="card">
        <CardBody>
          <CardTitle> FireBase Control Panel </CardTitle>
          <AddUserForm
            userName={userName}
            status={status}
            onStatusChangeHandler={onStatusChangeHandler}
            onNameChangeHandler={onNameChangeHandler}
            onCreate={profileCreator}
          />
        </CardBody>
      </Card>
    </div>
  );
}

class UserItem extends Component {
  constructor(props) {
    super();
    this.state = {
      status: props.user.status,
    };
  }

  setStatus = e => {
    const toChange = firebase.database().ref("/users/" + this.props.user.id);
    toChange.set({ ...this.props.user, status: this.state.status });
    this.setState({
      status: "",
    });
  };

  render() {
    const { user, onDelete } = this.props;
    return (
      <div>
        <h3> {user.name} </h3>
        <h4> {user.status} </h4>
        <Button color="danger" onClick={onDelete}>
          Delete User
        </Button>
        <form>
          <label>
            New status:
            <input
              type="text"
              value={this.state.status}
              onChange={e => this.setState({ status: e.target.value })}
            />
          </label>
        </form>
        <Button color="info" onClick={this.setStatus}>
          Change Status
        </Button>
        <br />
      </div>
    );
  }
}

export default class FireBaseControlPanel extends Component {
  constructor() {
    super();
    this.state = {
      userName: "",
      status: "",
      users: [],
    };
  }

  componentDidMount() {
    const usersRef = firebase.database().ref("users");

    usersRef.on("value", snapshot => {
      let items = snapshot.val();
      console.log(snapshot.val());
      const users = [];
      for (let item in items) {
        const user = {
          id: item,
          name: items[item].name,
          status: items[item].status,
        };
        users.push(user);
      }
      this.setState({ users: users });
    });
  }

  createProfile = e => {
    e.preventDefault();
    const usersRef = firebase.database().ref("users");
    const user = {
      name: this.state.userName,
      status: this.state.status,
    };
    usersRef.push(user);
    this.setState({
      userName: "",
      status: "",
    });
  };

  deleteProfile = id => {
    const toDelete = firebase.database().ref("/users/" + id);
    toDelete.remove();
  };

  render() {
    return (
      <div className="outerContainer">
        <ControlPanel
          userName={this.state.userName}
          status={this.state.status}
          onNameChangeHandler={e => this.setState({ userName: e.target.value })}
          onStatusChangeHandler={e => this.setState({ status: e.target.value })}
          profileCreator={this.createProfile}
          profileDeletor={this.deleteProfile}
        />
        <div className="cardContainer">
          <Card className="card">
            <CardBody>
              {this.state.users.map(user => {
                return (
                  <UserItem
                    user={user}
                    key={user.id}
                    onDelete={e => this.deleteProfile(user.id)}
                  />
                );
              })}
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}
