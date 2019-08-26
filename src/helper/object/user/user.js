import get from 'lodash-es/get'
import set from 'lodash-es/set'
import Long from 'long'

const scopes = { read: 0, write: 1 }
let masks = {}

export class User {
  static getMasks () {
    return masks
  }

  static setMasks (value) {
    masks = value
  }

  static formatName (details, parts = null) {
    let name = ''

    if (parts === null || parts.indexOf('given_name') > -1) {
      name += details.given_name
    }

    if (parts === null || parts.indexOf('additional_name') > -1) {
      name += details.additional_name
        ? ' ' + details.additional_name : ''
    }

    if (parts === null || parts.indexOf('family_name') > -1) {
      name += details.family_name
        ? ' ' + details.family_name : ''
    }

    return name.trim()
  }

  constructor (options = {}) {
    this._details = null
    this._id = null
    this._parents = null
    this._role = null
    this._token = null

    this.setDetails(options.details)
    this.setId(options.id)
    this.setParents(options.parents)
    this.setRole(options.role)
    this.setToken(options.token)
  }

  getDetail (name) {
    return get(this._details, name)
  }

  getDetails () {
    return this._details
  }

  hasDetail (name) {
    const value = this.getDetail(name)
    return typeof value !== 'undefined' && value !== null && value !== ''
  }

  setDetail (name, value) {
    set(this._details, name, value)
    return this
  }

  setDetails (value = {}) {
    this._details = value
    return this
  }

  unsetDetail (name) {
    set(this._details, name, null)
    return this
  }

  getId () {
    return this._id
  }

  setId (value = null) {
    this._id = value
    return this
  }

  getName (parts) {
    return this._details === null
      ? '' : User.formatName(this._details, parts)
  }

  getParentId (name, scope = 'write') {
    return this._parents[scope][name] || []
  }

  getParentScope (name, scope = 'write') {
    return typeof this._parents[scope][name] !== 'undefined'
      ? scope : null
  }

  getParents () {
    return this._parents
  }

  setParents (value = null) {
    this._parents = value
    return this
  }

  getRole () {
    return this._role
  }

  getRoleDetail (name) {
    return this._role[name]
  }

  setRoleDetail (name, value) {
    this._role[name] = value
    return this
  }

  setRole (value = null) {
    this._role = value
    return this
  }

  getToken () {
    return this._token
  }

  setToken (value = null) {
    this._token = value
    return this
  }

  may (permission, box, data) {
    if (typeof permission === 'string' || Array.isArray(permission)) {
      return this.mayRole(permission)
    }

    if (typeof permission === 'function') {
      return permission(box, data)
    }

    if (typeof permission.scope === 'undefined') {
      return this.mayRole(permission.name)
    }

    const scope = (data && data.meta && data.meta.scope) ||
      (data && data.data && data.data.scope)

    const found = this.mayScope(box, data,
      permission.scope, scope)

    if (typeof permission.name === 'undefined') {
      return found
    }

    return this.mayRole(permission.name) && found
  }

  mayRole (names) {
    names = Array.isArray(names) ? names : [names]
    let name = null

    for (let i = 0; i < names.length; i += 1) {
      name = names[i].split('.')

      const permission = Long.fromNumber(this._role[name[0]])
      const mask = Long.fromNumber(get(masks, name))

      if ((permission.and(mask)).toNumber() !== 0) {
        return true
      }
    }

    return false
  }

  mayScope (box, data, desired, actual) {
    if (typeof desired === 'function') {
      return desired(box, data, actual)
    }

    return scopes[actual] >= scopes[desired]
  }
}
