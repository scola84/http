import get from 'lodash-es/get';
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

  constructor() {
    this._details = {};
    this._id = null;
    this._parents = null;
    this._role = null;
    this._token = null;
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

  setDetails(value) {
    this._details = value;
    return this;
  }

  getId() {
    return this._id;
  }

  setId(value) {
    this._id = value;
    return this;
  }

  getName() {
    return this._details === null ?
      '' : User.formatName(this._details);
  }

  getParents() {
    return this._parents;
  }

  setParents(value) {
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

  setRole(value) {
    this._role = value;
    return this;
  }

  getToken() {
    return this._token;
  }

  setToken(value) {
    this._token = value;
    return this;
  }

  may(names = '') {
    names = Array.isArray(names) ? names : [names];
    let name = null;

    for (let i = 0; i < names.length; i += 1) {
      name = names[i].split('.');

      const permission = this._role[name[0]];
      const mask = get(masks, name);

      if ((this._and(permission, mask)) !== 0) {
        return true;
      }
    }

    return false;
  }

  _and(v1, v2) {
    // https://stackoverflow.com/a/43666199
    const hi = 0x80000000;
    const low = 0x7fffffff;
    const hi1 = ~~(v1 / hi);
    const hi2 = ~~(v2 / hi);
    const low1 = v1 & low;
    const low2 = v2 & low;
    const h = hi1 & hi2;
    const l = low1 & low2;
    return h * hi + l;
  }
}
