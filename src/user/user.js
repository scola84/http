import get from 'lodash-es/get';
let masks = {};

export default class User {
  static setMasks(value) {
    masks = value;
  }

  constructor() {
    this._id = null;
    this._parents = {};
    this._permissions = {};
    this._person = {};
    this._token = null;
  }

  getId() {
    return this._id;
  }

  setId(value) {
    this._id = value;
    return this;
  }

  getParents() {
    return this._parents;
  }

  setParents(value) {
    this._parents = value;
    return this;
  }

  getPerson() {
    return this._person;
  }

  getPersonName() {
    let name = '';

    name += this._person.given_name;
    name += this._person.additional_name ?
      ' ' + this._person.additional_name : '';
    name += this._person.family_name ?
      ' ' + this._person.family_name : '';

    return name;
  }

  setPerson(value) {
    this._person = {
      honorific_prefix: value.honorific_prefix,
      honorific_suffix: value.honorific_suffix,
      given_name: value.given_name,
      additional_name: value.additional_name,
      family_name: value.family_name,
      tel: value.tel,
      username: value.username
    };
  }

  getPermissions() {
    return this._permissions;
  }

  setPermissions(value) {
    this._permissions = value;
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

      const permission = this._permissions[name[0]];
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
