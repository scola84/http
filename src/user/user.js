import get from 'lodash-es/get';
import Long from 'long';

const scopes = { read: 0, write: 1 };
let masks = {};

export default class User {
  static setMasks(value) {
    masks = value;
  }

  static formatName(details) {
    let name = '';

    name += details.given_name;
    name += details.additional_name ?
      ' ' + details.additional_name : '';
    name += details.family_name ?
      ' ' + details.family_name : '';

    return name;
  }

  constructor(options = {}) {
    this._details = null;
    this._id = null;
    this._parents = null;
    this._role = null;
    this._token = null;

    this.setDetails(options.details);
    this.setId(options.id);
    this.setParents(options.parents);
    this.setRole(options.role);
    this.setToken(options.token);
  }

  getDetail(name) {
    return this._details[name];
  }

  getDetails() {
    return this._person;
  }

  hasDetail(name) {
    return typeof this._details[name] !== 'undefined' &&
      this._details[name] !== null &&
      this._details[name] !== '';
  }

  setDetail(name, value) {
    this._details[name] = value;
    return this;
  }

  setDetails(value = {}) {
    this._details = value;
    return this;
  }

  unsetDetail(name) {
    this._details[name] = null;
    return this;
  }

  getId() {
    return this._id;
  }

  setId(value = null) {
    this._id = value;
    return this;
  }

  getName() {
    return this._details === null ?
      '' : User.formatName(this._details);
  }

  getParentId(name, scope = 'write') {
    return this._parents[scope][name] || [];
  }

  getParentScope(name, scope = 'write') {
    return typeof this._parents[scope][name] !== 'undefined' ?
      scope : null;
  }

  getParents() {
    return this._parents;
  }

  setParents(value = null) {
    this._parents = value;
    return this;
  }

  getRole() {
    return this._role;
  }

  getRoleDetail(name) {
    return this._role[name];
  }

  setRoleDetail(name, value) {
    this._role[name] = value;
    return this;
  }

  setRole(value = null) {
    this._role = value;
    return this;
  }

  getToken() {
    return this._token;
  }

  setToken(value = null) {
    this._token = value;
    return this;
  }

  may(permission, route, data) {
    if (typeof permission === 'string' || Array.isArray(permission)) {
      return this._mayRole(permission);
    }

    if (typeof permission === 'function') {
      return permission(route, data);
    }

    if (typeof permission.scope === 'undefined') {
      return this._mayRole(permission.name);
    }

    const scope = data && data.meta && data.meta.scope ||
      data && data.data && data.data.scope;

    const found = this._mayScope(route, data,
      permission.scope, scope, true);

    if (typeof permission.name === 'undefined') {
      return found;
    }

    return this._mayRole(permission.name) && found;
  }

  _mayRole(names) {
    names = Array.isArray(names) ? names : [names];
    let name = null;

    for (let i = 0; i < names.length; i += 1) {
      name = names[i].split('.');

      const permission = Long.fromNumber(this._role[name[0]]);
      const mask = Long.fromNumber(get(masks, name));

      if ((permission.and(mask)).toNumber() !== 0) {
        return true;
      }
    }

    return false;
  }

  _mayScope(box, data, desired, actual) {
    if (typeof desired === 'function') {
      return desired(box, data, actual);
    }

    return scopes[actual] >= scopes[desired];
  }
}
