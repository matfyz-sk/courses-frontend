import { EventEmitter } from "events";
import { SWITCH_USER_TYPE } from '../types';
import dispatcher from "../dispatcher";

class TodoStore extends EventEmitter {
  constructor() {
    super();
    this.isAdmin = true;
  }

  switchUserType(isAdmin) {
    this.isAdmin=isAdmin;
    this.emit("change");
  }

  handleActions(action) {
    switch(action.type) {
      case SWITCH_USER_TYPE: {
        this.switchUserType(action.isAdmin);
        break;
      }
      default: {
        break;
      }
    }
  }
}

const todoStore = new TodoStore();
dispatcher.register(todoStore.handleActions.bind(todoStore));

export default todoStore;
