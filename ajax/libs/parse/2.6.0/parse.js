/**
 * Parse JavaScript SDK v2.6.0
 *
 * The source tree of this library can be found at
 *   https://github.com/ParsePlatform/Parse-SDK-JS
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Parse = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.track = track;

var _CoreManager = _interopRequireDefault(_dereq_("./CoreManager"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

/**
 * Parse.Analytics provides an interface to Parse's logging and analytics
 * backend.
 *
 * @class Parse.Analytics
 * @static
 * @hideconstructor
 */

/**
  * Tracks the occurrence of a custom event with additional dimensions.
  * Parse will store a data point at the time of invocation with the given
  * event name.
  *
  * Dimensions will allow segmentation of the occurrences of this custom
  * event. Keys and values should be {@code String}s, and will throw
  * otherwise.
  *
  * To track a user signup along with additional metadata, consider the
  * following:
  * <pre>
  * var dimensions = {
  *  gender: 'm',
  *  source: 'web',
  *  dayType: 'weekend'
  * };
  * Parse.Analytics.track('signup', dimensions);
  * </pre>
  *
  * There is a default limit of 8 dimensions per event tracked.
  *
  * @method track
  * @name Parse.Analytics.track
  * @param {String} name The name of the custom event to report to Parse as
  * having happened.
  * @param {Object} dimensions The dictionary of information by which to
  * segment this event.
  * @return {Promise} A promise that is resolved when the round-trip
  * to the server completes.
  */


function track(name
/*: string*/
, dimensions
/*: { [key: string]: string }*/
)
/*: Promise*/
{
  name = name || '';
  name = name.replace(/^\s*/, '');
  name = name.replace(/\s*$/, '');

  if (name.length === 0) {
    throw new TypeError('A name for the custom event must be provided');
  }

  for (var _key in dimensions) {
    if (typeof _key !== 'string' || typeof dimensions[_key] !== 'string') {
      throw new TypeError('track() dimensions expects keys and values of type "string".');
    }
  }

  return _CoreManager.default.getAnalyticsController().track(name, dimensions);
}

var DefaultController = {
  track: function (name, dimensions) {
    var RESTController = _CoreManager.default.getRESTController();

    return RESTController.request('POST', 'events/' + name, {
      dimensions: dimensions
    });
  }
};

_CoreManager.default.setAnalyticsController(DefaultController);
},{"./CoreManager":4,"@babel/runtime/helpers/interopRequireDefault":61}],2:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ParseUser = _interopRequireDefault(_dereq_("./ParseUser"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow-weak
 */


var uuidv4 = _dereq_('uuid/v4');
/*:: import type { RequestOptions } from './RESTController';*/


var registered = false;
/**
 * Provides utility functions for working with Anonymously logged-in users. <br />
 * Anonymous users have some unique characteristics:
 * <ul>
 *  <li>Anonymous users don't need a user name or password.</li>
 *  <ul>
 *    <li>Once logged out, an anonymous user cannot be recovered.</li>
 *  </ul>
 *  <li>signUp converts an anonymous user to a standard user with the given username and password.</li>
 *  <ul>
 *    <li>Data associated with the anonymous user is retained.</li>
 *  </ul>
 *  <li>logIn switches users without converting the anonymous user.</li>
 *  <ul>
 *    <li>Data associated with the anonymous user will be lost.</li>
 *  </ul>
 *  <li>Service logIn (e.g. Facebook, Twitter) will attempt to convert
 *  the anonymous user into a standard user by linking it to the service.</li>
 *  <ul>
 *    <li>If a user already exists that is linked to the service, it will instead switch to the existing user.</li>
 *  </ul>
 *  <li>Service linking (e.g. Facebook, Twitter) will convert the anonymous user
 *  into a standard user by linking it to the service.</li>
 * </ul>
 * @class Parse.AnonymousUtils
 * @static
 */

var AnonymousUtils = {
  /**
   * Gets whether the user has their account linked to anonymous user.
   *
   * @method isLinked
   * @name Parse.AnonymousUtils.isLinked
   * @param {Parse.User} user User to check for.
   *     The user must be logged in on this device.
   * @return {Boolean} <code>true</code> if the user has their account
   *     linked to an anonymous user.
   * @static
   */
  isLinked: function (user
  /*: ParseUser*/
  ) {
    var provider = this._getAuthProvider();

    return user._isLinked(provider.getAuthType());
  },

  /**
   * Logs in a user Anonymously.
   *
   * @method logIn
   * @name Parse.AnonymousUtils.logIn
   * @param {Object} options MasterKey / SessionToken.
   * @returns {Promise}
   * @static
   */
  logIn: function (options
  /*:: ?: RequestOptions*/
  ) {
    var provider = this._getAuthProvider();

    return _ParseUser.default._logInWith(provider.getAuthType(), provider.getAuthData(), options);
  },

  /**
   * Links Anonymous User to an existing PFUser.
   *
   * @method link
   * @name Parse.AnonymousUtils.link
   * @param {Parse.User} user User to link. This must be the current user.
   * @param {Object} options MasterKey / SessionToken.
   * @returns {Promise}
   * @static
   */
  link: function (user
  /*: ParseUser*/
  , options
  /*:: ?: RequestOptions*/
  ) {
    var provider = this._getAuthProvider();

    return user._linkWith(provider.getAuthType(), provider.getAuthData(), options);
  },
  _getAuthProvider: function () {
    var provider = {
      restoreAuthentication: function () {
        return true;
      },
      getAuthType: function () {
        return 'anonymous';
      },
      getAuthData: function () {
        return {
          authData: {
            id: uuidv4()
          }
        };
      }
    };

    if (!registered) {
      _ParseUser.default._registerAuthenticationProvider(provider);

      registered = true;
    }

    return provider;
  }
};
var _default = AnonymousUtils;
exports.default = _default;
},{"./ParseUser":31,"@babel/runtime/helpers/interopRequireDefault":61,"uuid/v4":81}],3:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.getJobsData = getJobsData;
exports.startJob = startJob;
exports.getJobStatus = getJobStatus;

var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));

var _CoreManager = _interopRequireDefault(_dereq_("./CoreManager"));

var _decode = _interopRequireDefault(_dereq_("./decode"));

var _encode = _interopRequireDefault(_dereq_("./encode"));

var _ParseError = _interopRequireDefault(_dereq_("./ParseError"));

var _ParseQuery = _interopRequireDefault(_dereq_("./ParseQuery"));

var _ParseObject = _interopRequireDefault(_dereq_("./ParseObject"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

/**
 * Contains functions for calling and declaring
 * <a href="/docs/cloud_code_guide#functions">cloud functions</a>.
 * <p><strong><em>
 *   Some functions are only available from Cloud Code.
 * </em></strong></p>
 *
 * @class Parse.Cloud
 * @static
 * @hideconstructor
 */

/**
  * Makes a call to a cloud function.
  * @method run
  * @name Parse.Cloud.run
  * @param {String} name The function name.
  * @param {Object} data The parameters to send to the cloud function.
  * @param {Object} options
  * @return {Promise} A promise that will be resolved with the result
  * of the function.
  */


function run(name
/*: string*/
, data
/*: mixed*/
, options
/*: RequestOptions*/
)
/*: Promise<mixed>*/
{
  options = options || {};

  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError('Cloud function name must be a string.');
  }

  var requestOptions = {};

  if (options.useMasterKey) {
    requestOptions.useMasterKey = options.useMasterKey;
  }

  if (options.sessionToken) {
    requestOptions.sessionToken = options.sessionToken;
  }

  return _CoreManager.default.getCloudController().run(name, data, requestOptions);
}
/**
  * Gets data for the current set of cloud jobs.
  * @method getJobsData
  * @name Parse.Cloud.getJobsData
  * @return {Promise} A promise that will be resolved with the result
  * of the function.
  */


function getJobsData()
/*: Promise<Object>*/
{
  return _CoreManager.default.getCloudController().getJobsData({
    useMasterKey: true
  });
}
/**
  * Starts a given cloud job, which will process asynchronously.
  * @method startJob
  * @name Parse.Cloud.startJob
  * @param {String} name The function name.
  * @param {Object} data The parameters to send to the cloud function.
  * @return {Promise} A promise that will be resolved with the jobStatusId
  * of the job.
  */


function startJob(name
/*: string*/
, data
/*: mixed*/
)
/*: Promise<string>*/
{
  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError('Cloud job name must be a string.');
  }

  return _CoreManager.default.getCloudController().startJob(name, data, {
    useMasterKey: true
  });
}
/**
  * Gets job status by Id
  * @method getJobStatus
  * @name Parse.Cloud.getJobStatus
  * @param {String} jobStatusId The Id of Job Status.
  * @return {Parse.Object} Status of Job.
  */


function getJobStatus(jobStatusId
/*: string*/
)
/*: Promise<ParseObject>*/
{
  var query = new _ParseQuery.default('_JobStatus');
  return query.get(jobStatusId, {
    useMasterKey: true
  });
}

var DefaultController = {
  run: function (name, data, options
  /*: RequestOptions*/
  ) {
    var RESTController = _CoreManager.default.getRESTController();

    var payload = (0, _encode.default)(data, true);
    var request = RESTController.request('POST', 'functions/' + name, payload, options);
    return request.then(function (res) {
      if ((0, _typeof2.default)(res) === 'object' && Object.keys(res).length > 0 && !res.hasOwnProperty('result')) {
        throw new _ParseError.default(_ParseError.default.INVALID_JSON, 'The server returned an invalid response.');
      }

      var decoded = (0, _decode.default)(res);

      if (decoded && decoded.hasOwnProperty('result')) {
        return Promise.resolve(decoded.result);
      }

      return Promise.resolve(undefined);
    });
  },
  getJobsData: function (options
  /*: RequestOptions*/
  ) {
    var RESTController = _CoreManager.default.getRESTController();

    return RESTController.request('GET', 'cloud_code/jobs/data', null, options);
  },
  startJob: function (name, data, options
  /*: RequestOptions*/
  ) {
    var RESTController = _CoreManager.default.getRESTController();

    var payload = (0, _encode.default)(data, true);
    return RESTController.request('POST', 'jobs/' + name, payload, options);
  }
};

_CoreManager.default.setCloudController(DefaultController);
},{"./CoreManager":4,"./ParseError":18,"./ParseObject":23,"./ParseQuery":26,"./decode":41,"./encode":42,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/typeof":73}],4:[function(_dereq_,module,exports){
(function (process){
/*:: import type { AttributeMap, ObjectCache, OpsMap, State } from './ObjectStateMutations';*/

/*:: import type ParseFile from './ParseFile';*/

/*:: import type { FileSource } from './ParseFile';*/

/*:: import type { Op } from './ParseOp';*/

/*:: import type ParseObject from './ParseObject';*/

/*:: import type { QueryJSON } from './ParseQuery';*/

/*:: import type ParseUser from './ParseUser';*/

/*:: import type { AuthData } from './ParseUser';*/

/*:: import type { PushData } from './Push';*/

/*:: import type { RequestOptions, FullOptions } from './RESTController';*/

/*:: type AnalyticsController = {
  track: (name: string, dimensions: { [key: string]: string }) => Promise;
};*/

/*:: type CloudController = {
  run: (name: string, data: mixed, options: RequestOptions) => Promise;
  getJobsData: (options: RequestOptions) => Promise;
  startJob: (name: string, data: mixed, options: RequestOptions) => Promise;
};*/

/*:: type ConfigController = {
  current: () => Promise;
  get: () => Promise;
  save: (attrs: { [key: string]: any }) => Promise;
};*/

/*:: type FileController = {
  saveFile: (name: string, source: FileSource, options: FullOptions) => Promise;
  saveBase64: (name: string, source: FileSource, options: FullOptions) => Promise;
  download: (uri: string) => Promise;
};*/

/*:: type InstallationController = {
  currentInstallationId: () => Promise;
};*/

/*:: type ObjectController = {
  fetch: (object: ParseObject | Array<ParseObject>, forceFetch: boolean, options: RequestOptions) => Promise;
  save: (object: ParseObject | Array<ParseObject | ParseFile>, options: RequestOptions) => Promise;
  destroy: (object: ParseObject | Array<ParseObject>, options: RequestOptions) => Promise;
};*/

/*:: type ObjectStateController = {
  getState: (obj: any) => ?State;
  initializeState: (obj: any, initial?: State) => State;
  removeState: (obj: any) => ?State;
  getServerData: (obj: any) => AttributeMap;
  setServerData: (obj: any, attributes: AttributeMap) => void;
  getPendingOps: (obj: any) => Array<OpsMap>;
  setPendingOp: (obj: any, attr: string, op: ?Op) => void;
  pushPendingState: (obj: any) => void;
  popPendingState: (obj: any) => OpsMap;
  mergeFirstPendingState: (obj: any) => void;
  getObjectCache: (obj: any) => ObjectCache;
  estimateAttribute: (obj: any, attr: string) => mixed;
  estimateAttributes: (obj: any) => AttributeMap;
  commitServerChanges: (obj: any, changes: AttributeMap) => void;
  enqueueTask: (obj: any, task: () => Promise) => Promise;
  clearAllState: () => void;
  duplicateState: (source: any, dest: any) => void;
};*/

/*:: type PushController = {
  send: (data: PushData, options: RequestOptions) => Promise;
};*/

/*:: type QueryController = {
  find: (className: string, params: QueryJSON, options: RequestOptions) => Promise;
  aggregate: (className: string, params: any, options: RequestOptions) => Promise;
};*/

/*:: type RESTController = {
  request: (method: string, path: string, data: mixed, options: RequestOptions) => Promise;
  ajax: (method: string, url: string, data: any, headers?: any, options: FullOptions) => Promise;
};*/

/*:: type SchemaController = {
  purge: (className: string) => Promise;
  get: (className: string, options: RequestOptions) => Promise;
  delete: (className: string, options: RequestOptions) => Promise;
  create: (className: string, params: any, options: RequestOptions) => Promise;
  update: (className: string, params: any, options: RequestOptions) => Promise;
  send(className: string, method: string, params: any, options: RequestOptions): Promise;
};*/

/*:: type SessionController = {
  getSession: (token: RequestOptions) => Promise;
};*/

/*:: type StorageController = {
  async: 0;
  getItem: (path: string) => ?string;
  setItem: (path: string, value: string) => void;
  removeItem: (path: string) => void;
  getItemAsync?: (path: string) => Promise;
  setItemAsync?: (path: string, value: string) => Promise;
  removeItemAsync?: (path: string) => Promise;
  clear: () => void;
} | {
  async: 1;
  getItem?: (path: string) => ?string;
  setItem?: (path: string, value: string) => void;
  removeItem?: (path: string) => void;
  getItemAsync: (path: string) => Promise;
  setItemAsync: (path: string, value: string) => Promise;
  removeItemAsync: (path: string) => Promise;
  clear: () => void;
};*/

/*:: type LocalDatastoreController = {
  fromPinWithName: (name: string) => ?any;
  pinWithName: (name: string, objects: any) => void;
  unPinWithName: (name: string) => void;
  getAllContents: () => ?any;
  clear: () => void;
};*/

/*:: type UserController = {
  setCurrentUser: (user: ParseUser) => Promise;
  currentUser: () => ?ParseUser;
  currentUserAsync: () => Promise;
  signUp: (user: ParseUser, attrs: AttributeMap, options: RequestOptions) => Promise;
  logIn: (user: ParseUser, options: RequestOptions) => Promise;
  become: (options: RequestOptions) => Promise;
  hydrate: (userJSON: AttributeMap) => Promise;
  logOut: (options: RequestOptions) => Promise;
  me: (options: RequestOptions) => Promise;
  requestPasswordReset: (email: string, options: RequestOptions) => Promise;
  updateUserOnDisk: (user: ParseUser) => Promise;
  upgradeToRevocableSession: (user: ParseUser, options: RequestOptions) => Promise;
  linkWith: (user: ParseUser, authData: AuthData) => Promise;
  removeUserFromDisk: () => Promise;
};*/

/*:: type HooksController = {
  get: (type: string, functionName?: string, triggerName?: string) => Promise;
  create: (hook: mixed) => Promise;
  delete: (hook: mixed) => Promise;
  update: (hook: mixed) => Promise;
  send: (method: string, path: string, body?: mixed) => Promise;
};*/

/*:: type WebSocketController = {
  onopen: () => void;
  onmessage: (message: any) => void;
  onclose: () => void;
  onerror: (error: any) => void;
  send: (data: any) => void;
  close: () => void;
}*/

/*:: type Config = {
  AnalyticsController?: AnalyticsController,
  CloudController?: CloudController,
  ConfigController?: ConfigController,
  FileController?: FileController,
  InstallationController?: InstallationController,
  ObjectController?: ObjectController,
  ObjectStateController?: ObjectStateController,
  PushController?: PushController,
  QueryController?: QueryController,
  RESTController?: RESTController,
  SchemaController?: SchemaController,
  SessionController?: SessionController,
  StorageController?: StorageController,
  LocalDatastoreController?: LocalDatastoreController,
  UserController?: UserController,
  HooksController?: HooksController,
  WebSocketController?: WebSocketController,
};*/
"use strict";
/*
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

var config
/*: Config & { [key: string]: mixed }*/
= {
  // Defaults
  IS_NODE: typeof process !== 'undefined' && !!process.versions && !!process.versions.node && !process.versions.electron,
  REQUEST_ATTEMPT_LIMIT: 5,
  SERVER_URL: 'https://api.parse.com/1',
  SERVER_AUTH_TYPE: null,
  SERVER_AUTH_TOKEN: null,
  LIVEQUERY_SERVER_URL: null,
  VERSION: 'js' + "2.6.0",
  APPLICATION_ID: null,
  JAVASCRIPT_KEY: null,
  MASTER_KEY: null,
  USE_MASTER_KEY: false,
  PERFORM_USER_REWRITE: true,
  FORCE_REVOCABLE_SESSION: false
};

function requireMethods(name
/*: string*/
, methods
/*: Array<string>*/
, controller
/*: any*/
) {
  methods.forEach(function (func) {
    if (typeof controller[func] !== 'function') {
      throw new Error("".concat(name, " must implement ").concat(func, "()"));
    }
  });
}

module.exports = {
  get: function (key
  /*: string*/
  )
  /*: any*/
  {
    if (config.hasOwnProperty(key)) {
      return config[key];
    }

    throw new Error('Configuration key not found: ' + key);
  },
  set: function (key
  /*: string*/
  , value
  /*: any*/
  )
  /*: void*/
  {
    config[key] = value;
  },

  /* Specialized Controller Setters/Getters */
  setAnalyticsController: function (controller
  /*: AnalyticsController*/
  ) {
    requireMethods('AnalyticsController', ['track'], controller);
    config['AnalyticsController'] = controller;
  },
  getAnalyticsController: function ()
  /*: AnalyticsController*/
  {
    return config['AnalyticsController'];
  },
  setCloudController: function (controller
  /*: CloudController*/
  ) {
    requireMethods('CloudController', ['run', 'getJobsData', 'startJob'], controller);
    config['CloudController'] = controller;
  },
  getCloudController: function ()
  /*: CloudController*/
  {
    return config['CloudController'];
  },
  setConfigController: function (controller
  /*: ConfigController*/
  ) {
    requireMethods('ConfigController', ['current', 'get', 'save'], controller);
    config['ConfigController'] = controller;
  },
  getConfigController: function ()
  /*: ConfigController*/
  {
    return config['ConfigController'];
  },
  setFileController: function (controller
  /*: FileController*/
  ) {
    requireMethods('FileController', ['saveFile', 'saveBase64'], controller);
    config['FileController'] = controller;
  },
  getFileController: function ()
  /*: FileController*/
  {
    return config['FileController'];
  },
  setInstallationController: function (controller
  /*: InstallationController*/
  ) {
    requireMethods('InstallationController', ['currentInstallationId'], controller);
    config['InstallationController'] = controller;
  },
  getInstallationController: function ()
  /*: InstallationController*/
  {
    return config['InstallationController'];
  },
  setObjectController: function (controller
  /*: ObjectController*/
  ) {
    requireMethods('ObjectController', ['save', 'fetch', 'destroy'], controller);
    config['ObjectController'] = controller;
  },
  getObjectController: function ()
  /*: ObjectController*/
  {
    return config['ObjectController'];
  },
  setObjectStateController: function (controller
  /*: ObjectStateController*/
  ) {
    requireMethods('ObjectStateController', ['getState', 'initializeState', 'removeState', 'getServerData', 'setServerData', 'getPendingOps', 'setPendingOp', 'pushPendingState', 'popPendingState', 'mergeFirstPendingState', 'getObjectCache', 'estimateAttribute', 'estimateAttributes', 'commitServerChanges', 'enqueueTask', 'clearAllState'], controller);
    config['ObjectStateController'] = controller;
  },
  getObjectStateController: function ()
  /*: ObjectStateController*/
  {
    return config['ObjectStateController'];
  },
  setPushController: function (controller
  /*: PushController*/
  ) {
    requireMethods('PushController', ['send'], controller);
    config['PushController'] = controller;
  },
  getPushController: function ()
  /*: PushController*/
  {
    return config['PushController'];
  },
  setQueryController: function (controller
  /*: QueryController*/
  ) {
    requireMethods('QueryController', ['find', 'aggregate'], controller);
    config['QueryController'] = controller;
  },
  getQueryController: function ()
  /*: QueryController*/
  {
    return config['QueryController'];
  },
  setRESTController: function (controller
  /*: RESTController*/
  ) {
    requireMethods('RESTController', ['request', 'ajax'], controller);
    config['RESTController'] = controller;
  },
  getRESTController: function ()
  /*: RESTController*/
  {
    return config['RESTController'];
  },
  setSchemaController: function (controller
  /*: SchemaController*/
  ) {
    requireMethods('SchemaController', ['get', 'create', 'update', 'delete', 'send', 'purge'], controller);
    config['SchemaController'] = controller;
  },
  getSchemaController: function ()
  /*: SchemaController*/
  {
    return config['SchemaController'];
  },
  setSessionController: function (controller
  /*: SessionController*/
  ) {
    requireMethods('SessionController', ['getSession'], controller);
    config['SessionController'] = controller;
  },
  getSessionController: function ()
  /*: SessionController*/
  {
    return config['SessionController'];
  },
  setStorageController: function (controller
  /*: StorageController*/
  ) {
    if (controller.async) {
      requireMethods('An async StorageController', ['getItemAsync', 'setItemAsync', 'removeItemAsync'], controller);
    } else {
      requireMethods('A synchronous StorageController', ['getItem', 'setItem', 'removeItem'], controller);
    }

    config['StorageController'] = controller;
  },
  setLocalDatastoreController: function (controller
  /*: LocalDatastoreController*/
  ) {
    requireMethods('LocalDatastoreController', ['pinWithName', 'fromPinWithName', 'unPinWithName', 'getAllContents', 'clear'], controller);
    config['LocalDatastoreController'] = controller;
  },
  getLocalDatastoreController: function ()
  /*: LocalDatastoreController*/
  {
    return config['LocalDatastoreController'];
  },
  setLocalDatastore: function (store
  /*: any*/
  ) {
    config['LocalDatastore'] = store;
  },
  getLocalDatastore: function () {
    return config['LocalDatastore'];
  },
  getStorageController: function ()
  /*: StorageController*/
  {
    return config['StorageController'];
  },
  setAsyncStorage: function (storage
  /*: any*/
  ) {
    config['AsyncStorage'] = storage;
  },
  getAsyncStorage: function () {
    return config['AsyncStorage'];
  },
  setWebSocketController: function (controller
  /*: WebSocketController*/
  ) {
    config['WebSocketController'] = controller;
  },
  getWebSocketController: function ()
  /*: WebSocketController*/
  {
    return config['WebSocketController'];
  },
  setUserController: function (controller
  /*: UserController*/
  ) {
    requireMethods('UserController', ['setCurrentUser', 'currentUser', 'currentUserAsync', 'signUp', 'logIn', 'become', 'logOut', 'me', 'requestPasswordReset', 'upgradeToRevocableSession', 'linkWith'], controller);
    config['UserController'] = controller;
  },
  getUserController: function ()
  /*: UserController*/
  {
    return config['UserController'];
  },
  setLiveQueryController: function (controller
  /*: any*/
  ) {
    requireMethods('LiveQueryController', ['setDefaultLiveQueryClient', 'getDefaultLiveQueryClient', '_clearCachedDefaultClient'], controller);
    config['LiveQueryController'] = controller;
  },
  getLiveQueryController: function ()
  /*: any*/
  {
    return config['LiveQueryController'];
  },
  setHooksController: function (controller
  /*: HooksController*/
  ) {
    requireMethods('HooksController', ['create', 'get', 'update', 'remove'], controller);
    config['HooksController'] = controller;
  },
  getHooksController: function ()
  /*: HooksController*/
  {
    return config['HooksController'];
  }
};
}).call(this,_dereq_('_process'))
},{"_process":77}],5:[function(_dereq_,module,exports){
"use strict";
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * This is a simple wrapper to unify EventEmitter implementations across platforms.
 */

module.exports = _dereq_('events').EventEmitter;
var EventEmitter;
},{"events":78}],6:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ParseUser = _interopRequireDefault(_dereq_("./ParseUser"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow-weak
 */

/* global FB */


var initialized = false;
var requestedPermissions;
var initOptions;
var provider = {
  authenticate: function (options) {
    var _this = this;

    if (typeof FB === 'undefined') {
      options.error(this, 'Facebook SDK not found.');
    }

    FB.login(function (response) {
      if (response.authResponse) {
        if (options.success) {
          options.success(_this, {
            id: response.authResponse.userID,
            access_token: response.authResponse.accessToken,
            expiration_date: new Date(response.authResponse.expiresIn * 1000 + new Date().getTime()).toJSON()
          });
        }
      } else {
        if (options.error) {
          options.error(_this, response);
        }
      }
    }, {
      scope: requestedPermissions
    });
  },
  restoreAuthentication: function (authData) {
    if (authData) {
      var newOptions = {};

      if (initOptions) {
        for (var key in initOptions) {
          newOptions[key] = initOptions[key];
        }
      } // Suppress checks for login status from the browser.


      newOptions.status = false; // If the user doesn't match the one known by the FB SDK, log out.
      // Most of the time, the users will match -- it's only in cases where
      // the FB SDK knows of a different user than the one being restored
      // from a Parse User that logged in with username/password.

      var existingResponse = FB.getAuthResponse();

      if (existingResponse && existingResponse.userID !== authData.id) {
        FB.logout();
      }

      FB.init(newOptions);
    }

    return true;
  },
  getAuthType: function () {
    return 'facebook';
  },
  deauthenticate: function () {
    this.restoreAuthentication(null);
  }
};
/**
 * Provides a set of utilities for using Parse with Facebook.
 * @class Parse.FacebookUtils
 * @static
 * @hideconstructor
 */

var FacebookUtils = {
  /**
   * Initializes Parse Facebook integration.  Call this function after you
   * have loaded the Facebook Javascript SDK with the same parameters
   * as you would pass to<code>
   * <a href=
   * "https://developers.facebook.com/docs/reference/javascript/FB.init/">
   * FB.init()</a></code>.  Parse.FacebookUtils will invoke FB.init() for you
   * with these arguments.
   *
   * @method init
   * @name Parse.FacebookUtils.init
   * @param {Object} options Facebook options argument as described here:
   *   <a href=
   *   "https://developers.facebook.com/docs/reference/javascript/FB.init/">
   *   FB.init()</a>. The status flag will be coerced to 'false' because it
   *   interferes with Parse Facebook integration. Call FB.getLoginStatus()
   *   explicitly if this behavior is required by your application.
   */
  init: function (options) {
    if (typeof FB === 'undefined') {
      throw new Error('The Facebook JavaScript SDK must be loaded before calling init.');
    }

    initOptions = {};

    if (options) {
      for (var key in options) {
        initOptions[key] = options[key];
      }
    }

    if (initOptions.status && typeof console !== 'undefined') {
      var warn = console.warn || console.log || function () {}; // eslint-disable-line no-console


      warn.call(console, 'The "status" flag passed into' + ' FB.init, when set to true, can interfere with Parse Facebook' + ' integration, so it has been suppressed. Please call' + ' FB.getLoginStatus() explicitly if you require this behavior.');
    }

    initOptions.status = false;
    FB.init(initOptions);

    _ParseUser.default._registerAuthenticationProvider(provider);

    initialized = true;
  },

  /**
   * Gets whether the user has their account linked to Facebook.
   *
   * @method isLinked
   * @name Parse.FacebookUtils.isLinked
   * @param {Parse.User} user User to check for a facebook link.
   *     The user must be logged in on this device.
   * @return {Boolean} <code>true</code> if the user has their account
   *     linked to Facebook.
   */
  isLinked: function (user) {
    return user._isLinked('facebook');
  },

  /**
   * Logs in a user using Facebook. This method delegates to the Facebook
   * SDK to authenticate the user, and then automatically logs in (or
   * creates, in the case where it is a new user) a Parse.User.
   *
   * Standard API:
   *
   * <code>logIn(permission: string, authData: Object);</code>
   *
   * Advanced API: Used for handling your own oAuth tokens
   * {@link https://docs.parseplatform.org/rest/guide/#linking-users}
   *
   * <code>logIn(authData: Object, options?: Object);</code>
   *
   * @method logIn
   * @name Parse.FacebookUtils.logIn
   * @param {(String|Object)} permissions The permissions required for Facebook
   *    log in.  This is a comma-separated string of permissions.
   *    Alternatively, supply a Facebook authData object as described in our
   *    REST API docs if you want to handle getting facebook auth tokens
   *    yourself.
   * @param {Object} options MasterKey / SessionToken. Alternatively can be used for authData if permissions is a string
   * @returns {Promise}
   */
  logIn: function (permissions, options) {
    if (!permissions || typeof permissions === 'string') {
      if (!initialized) {
        throw new Error('You must initialize FacebookUtils before calling logIn.');
      }

      requestedPermissions = permissions;
      return _ParseUser.default._logInWith('facebook', options);
    }

    return _ParseUser.default._logInWith('facebook', {
      authData: permissions
    }, options);
  },

  /**
   * Links Facebook to an existing PFUser. This method delegates to the
   * Facebook SDK to authenticate the user, and then automatically links
   * the account to the Parse.User.
   *
   * Standard API:
   *
   * <code>link(user: Parse.User, permission: string, authData?: Object);</code>
   *
   * Advanced API: Used for handling your own oAuth tokens
   * {@link https://docs.parseplatform.org/rest/guide/#linking-users}
   *
   * <code>link(user: Parse.User, authData: Object, options?: FullOptions);</code>
   *
   * @method link
   * @name Parse.FacebookUtils.link
   * @param {Parse.User} user User to link to Facebook. This must be the
   *     current user.
   * @param {(String|Object)} permissions The permissions required for Facebook
   *    log in.  This is a comma-separated string of permissions.
   *    Alternatively, supply a Facebook authData object as described in our
   *    REST API docs if you want to handle getting facebook auth tokens
   *    yourself.
   * @param {Object} options MasterKey / SessionToken. Alternatively can be used for authData if permissions is a string
   * @returns {Promise}
   */
  link: function (user, permissions, options) {
    if (!permissions || typeof permissions === 'string') {
      if (!initialized) {
        throw new Error('You must initialize FacebookUtils before calling link.');
      }

      requestedPermissions = permissions;
      return user._linkWith('facebook', options);
    }

    return user._linkWith('facebook', {
      authData: permissions
    }, options);
  },

  /**
   * Unlinks the Parse.User from a Facebook account.
   *
   * @method unlink
   * @name Parse.FacebookUtils.unlink
   * @param {Parse.User} user User to unlink from Facebook. This must be the
   *     current user.
   * @param {Object} options Standard options object with success and error
   *    callbacks.
   * @returns {Promise}
   */
  unlink: function (user, options) {
    if (!initialized) {
      throw new Error('You must initialize FacebookUtils before calling unlink.');
    }

    return user._unlinkFrom('facebook', options);
  },
  // Used for testing purposes
  _getAuthProvider: function () {
    return provider;
  }
};
var _default = FacebookUtils;
exports.default = _default;
},{"./ParseUser":31,"@babel/runtime/helpers/interopRequireDefault":61}],7:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

var _Storage = _interopRequireDefault(_dereq_("./Storage"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */


var iidCache = null;

function hexOctet() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function generateId() {
  return hexOctet() + hexOctet() + '-' + hexOctet() + '-' + hexOctet() + '-' + hexOctet() + '-' + hexOctet() + hexOctet() + hexOctet();
}

var InstallationController = {
  currentInstallationId: function ()
  /*: Promise<string>*/
  {
    if (typeof iidCache === 'string') {
      return Promise.resolve(iidCache);
    }

    var path = _Storage.default.generatePath('installationId');

    return _Storage.default.getItemAsync(path).then(function (iid) {
      if (!iid) {
        iid = generateId();
        return _Storage.default.setItemAsync(path, iid).then(function () {
          iidCache = iid;
          return iid;
        });
      }

      iidCache = iid;
      return iid;
    });
  },
  _clearCache: function () {
    iidCache = null;
  },
  _setInstallationIdCache: function (iid
  /*: string*/
  ) {
    iidCache = iid;
  }
};
module.exports = InstallationController;
},{"./Storage":35,"@babel/runtime/helpers/interopRequireDefault":61}],8:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/defineProperty"));

var _CoreManager = _interopRequireDefault(_dereq_("./CoreManager"));

var _EventEmitter2 = _interopRequireDefault(_dereq_("./EventEmitter"));

var _ParseObject = _interopRequireDefault(_dereq_("./ParseObject"));

var _LiveQuerySubscription = _interopRequireDefault(_dereq_("./LiveQuerySubscription"));

var _promiseUtils = _dereq_("./promiseUtils");
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

/* global WebSocket */
// The LiveQuery client inner state


var CLIENT_STATE = {
  INITIALIZED: 'initialized',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  CLOSED: 'closed',
  RECONNECTING: 'reconnecting',
  DISCONNECTED: 'disconnected'
}; // The event type the LiveQuery client should sent to server

var OP_TYPES = {
  CONNECT: 'connect',
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
  ERROR: 'error'
}; // The event we get back from LiveQuery server

var OP_EVENTS = {
  CONNECTED: 'connected',
  SUBSCRIBED: 'subscribed',
  UNSUBSCRIBED: 'unsubscribed',
  ERROR: 'error',
  CREATE: 'create',
  UPDATE: 'update',
  ENTER: 'enter',
  LEAVE: 'leave',
  DELETE: 'delete'
}; // The event the LiveQuery client should emit

var CLIENT_EMMITER_TYPES = {
  CLOSE: 'close',
  ERROR: 'error',
  OPEN: 'open'
}; // The event the LiveQuery subscription should emit

var SUBSCRIPTION_EMMITER_TYPES = {
  OPEN: 'open',
  CLOSE: 'close',
  ERROR: 'error',
  CREATE: 'create',
  UPDATE: 'update',
  ENTER: 'enter',
  LEAVE: 'leave',
  DELETE: 'delete'
};

var generateInterval = function (k) {
  return Math.random() * Math.min(30, Math.pow(2, k) - 1) * 1000;
};
/**
 * Creates a new LiveQueryClient.
 * Extends events.EventEmitter
 * <a href="https://nodejs.org/api/events.html#events_class_eventemitter">cloud functions</a>.
 *
 * A wrapper of a standard WebSocket client. We add several useful methods to
 * help you connect/disconnect to LiveQueryServer, subscribe/unsubscribe a ParseQuery easily.
 *
 * javascriptKey and masterKey are used for verifying the LiveQueryClient when it tries
 * to connect to the LiveQuery server
 *
 * We expose three events to help you monitor the status of the LiveQueryClient.
 *
 * <pre>
 * let Parse = require('parse/node');
 * let LiveQueryClient = Parse.LiveQueryClient;
 * let client = new LiveQueryClient({
 *   applicationId: '',
 *   serverURL: '',
 *   javascriptKey: '',
 *   masterKey: ''
 *  });
 * </pre>
 *
 * Open - When we establish the WebSocket connection to the LiveQuery server, you'll get this event.
 * <pre>
 * client.on('open', () => {
 *
 * });</pre>
 *
 * Close - When we lose the WebSocket connection to the LiveQuery server, you'll get this event.
 * <pre>
 * client.on('close', () => {
 *
 * });</pre>
 *
 * Error - When some network error or LiveQuery server error happens, you'll get this event.
 * <pre>
 * client.on('error', (error) => {
 *
 * });</pre>
 * @alias Parse.LiveQueryClient
 */


var LiveQueryClient =
/*#__PURE__*/
function (_EventEmitter) {
  (0, _inherits2.default)(LiveQueryClient, _EventEmitter);
  /**
   * @param {Object} options
   * @param {string} options.applicationId - applicationId of your Parse app
   * @param {string} options.serverURL - <b>the URL of your LiveQuery server</b>
   * @param {string} options.javascriptKey (optional)
   * @param {string} options.masterKey (optional) Your Parse Master Key. (Node.js only!)
   * @param {string} options.sessionToken (optional)
   */

  function LiveQueryClient(_ref) {
    var _this;

    var applicationId = _ref.applicationId,
        serverURL = _ref.serverURL,
        javascriptKey = _ref.javascriptKey,
        masterKey = _ref.masterKey,
        sessionToken = _ref.sessionToken;
    (0, _classCallCheck2.default)(this, LiveQueryClient);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(LiveQueryClient).call(this));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "attempts", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "id", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "requestId", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "applicationId", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "serverURL", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "javascriptKey", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "masterKey", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "sessionToken", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "connectPromise", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "subscriptions", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "socket", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", void 0);

    if (!serverURL || serverURL.indexOf('ws') !== 0) {
      throw new Error('You need to set a proper Parse LiveQuery server url before using LiveQueryClient');
    }

    _this.reconnectHandle = null;
    _this.attempts = 1;
    _this.id = 0;
    _this.requestId = 1;
    _this.serverURL = serverURL;
    _this.applicationId = applicationId;
    _this.javascriptKey = javascriptKey;
    _this.masterKey = masterKey;
    _this.sessionToken = sessionToken;
    _this.connectPromise = (0, _promiseUtils.resolvingPromise)();
    _this.subscriptions = new Map();
    _this.state = CLIENT_STATE.INITIALIZED;
    return _this;
  }

  (0, _createClass2.default)(LiveQueryClient, [{
    key: "shouldOpen",
    value: function ()
    /*: any*/
    {
      return this.state === CLIENT_STATE.INITIALIZED || this.state === CLIENT_STATE.DISCONNECTED;
    }
    /**
     * Subscribes to a ParseQuery
     *
     * If you provide the sessionToken, when the LiveQuery server gets ParseObject's
     * updates from parse server, it'll try to check whether the sessionToken fulfills
     * the ParseObject's ACL. The LiveQuery server will only send updates to clients whose
     * sessionToken is fit for the ParseObject's ACL. You can check the LiveQuery protocol
     * <a href="https://github.com/parse-community/parse-server/wiki/Parse-LiveQuery-Protocol-Specification">here</a> for more details. The subscription you get is the same subscription you get
     * from our Standard API.
     *
     * @param {Object} query - the ParseQuery you want to subscribe to
     * @param {string} sessionToken (optional)
     * @return {Object} subscription
     */

  }, {
    key: "subscribe",
    value: function (query
    /*: Object*/
    , sessionToken
    /*: ?string*/
    )
    /*: Object*/
    {
      var _this2 = this;

      if (!query) {
        return;
      }

      var className = query.className;
      var queryJSON = query.toJSON();
      var where = queryJSON.where;
      var fields = queryJSON.keys ? queryJSON.keys.split(',') : undefined;
      var subscribeRequest = {
        op: OP_TYPES.SUBSCRIBE,
        requestId: this.requestId,
        query: {
          className: className,
          where: where,
          fields: fields
        }
      };

      if (sessionToken) {
        subscribeRequest.sessionToken = sessionToken;
      }

      var subscription = new _LiveQuerySubscription.default(this.requestId, query, sessionToken);
      this.subscriptions.set(this.requestId, subscription);
      this.requestId += 1;
      this.connectPromise.then(function () {
        _this2.socket.send(JSON.stringify(subscribeRequest));
      });
      return subscription;
    }
    /**
     * After calling unsubscribe you'll stop receiving events from the subscription object.
     *
     * @param {Object} subscription - subscription you would like to unsubscribe from.
     */

  }, {
    key: "unsubscribe",
    value: function (subscription
    /*: Object*/
    ) {
      var _this3 = this;

      if (!subscription) {
        return;
      }

      this.subscriptions.delete(subscription.id);
      var unsubscribeRequest = {
        op: OP_TYPES.UNSUBSCRIBE,
        requestId: subscription.id
      };
      this.connectPromise.then(function () {
        _this3.socket.send(JSON.stringify(unsubscribeRequest));
      });
    }
    /**
     * After open is called, the LiveQueryClient will try to send a connect request
     * to the LiveQuery server.
     *
     */

  }, {
    key: "open",
    value: function () {
      var _this4 = this;

      var WebSocketImplementation = _CoreManager.default.getWebSocketController();

      if (!WebSocketImplementation) {
        this.emit(CLIENT_EMMITER_TYPES.ERROR, 'Can not find WebSocket implementation');
        return;
      }

      if (this.state !== CLIENT_STATE.RECONNECTING) {
        this.state = CLIENT_STATE.CONNECTING;
      }

      this.socket = new WebSocketImplementation(this.serverURL); // Bind WebSocket callbacks

      this.socket.onopen = function () {
        _this4._handleWebSocketOpen();
      };

      this.socket.onmessage = function (event) {
        _this4._handleWebSocketMessage(event);
      };

      this.socket.onclose = function () {
        _this4._handleWebSocketClose();
      };

      this.socket.onerror = function (error) {
        _this4._handleWebSocketError(error);
      };
    }
  }, {
    key: "resubscribe",
    value: function () {
      var _this5 = this;

      this.subscriptions.forEach(function (subscription, requestId) {
        var query = subscription.query;
        var queryJSON = query.toJSON();
        var where = queryJSON.where;
        var fields = queryJSON.keys ? queryJSON.keys.split(',') : undefined;
        var className = query.className;
        var sessionToken = subscription.sessionToken;
        var subscribeRequest = {
          op: OP_TYPES.SUBSCRIBE,
          requestId: requestId,
          query: {
            className: className,
            where: where,
            fields: fields
          }
        };

        if (sessionToken) {
          subscribeRequest.sessionToken = sessionToken;
        }

        _this5.connectPromise.then(function () {
          _this5.socket.send(JSON.stringify(subscribeRequest));
        });
      });
    }
    /**
     * This method will close the WebSocket connection to this LiveQueryClient,
     * cancel the auto reconnect and unsubscribe all subscriptions based on it.
     *
     */

  }, {
    key: "close",
    value: function () {
      if (this.state === CLIENT_STATE.INITIALIZED || this.state === CLIENT_STATE.DISCONNECTED) {
        return;
      }

      this.state = CLIENT_STATE.DISCONNECTED;
      this.socket.close(); // Notify each subscription about the close

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.subscriptions.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var subscription = _step.value;
          subscription.emit(SUBSCRIPTION_EMMITER_TYPES.CLOSE);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this._handleReset();

      this.emit(CLIENT_EMMITER_TYPES.CLOSE);
    } // ensure we start with valid state if connect is called again after close

  }, {
    key: "_handleReset",
    value: function () {
      this.attempts = 1;
      this.id = 0;
      this.requestId = 1;
      this.connectPromise = (0, _promiseUtils.resolvingPromise)();
      this.subscriptions = new Map();
    }
  }, {
    key: "_handleWebSocketOpen",
    value: function () {
      this.attempts = 1;
      var connectRequest = {
        op: OP_TYPES.CONNECT,
        applicationId: this.applicationId,
        javascriptKey: this.javascriptKey,
        masterKey: this.masterKey,
        sessionToken: this.sessionToken
      };
      this.socket.send(JSON.stringify(connectRequest));
    }
  }, {
    key: "_handleWebSocketMessage",
    value: function (event
    /*: any*/
    ) {
      var data = event.data;

      if (typeof data === 'string') {
        data = JSON.parse(data);
      }

      var subscription = null;

      if (data.requestId) {
        subscription = this.subscriptions.get(data.requestId);
      }

      switch (data.op) {
        case OP_EVENTS.CONNECTED:
          if (this.state === CLIENT_STATE.RECONNECTING) {
            this.resubscribe();
          }

          this.emit(CLIENT_EMMITER_TYPES.OPEN);
          this.id = data.clientId;
          this.connectPromise.resolve();
          this.state = CLIENT_STATE.CONNECTED;
          break;

        case OP_EVENTS.SUBSCRIBED:
          if (subscription) {
            subscription.emit(SUBSCRIPTION_EMMITER_TYPES.OPEN);
          }

          break;

        case OP_EVENTS.ERROR:
          if (data.requestId) {
            if (subscription) {
              subscription.emit(SUBSCRIPTION_EMMITER_TYPES.ERROR, data.error);
            }
          } else {
            this.emit(CLIENT_EMMITER_TYPES.ERROR, data.error);
          }

          break;

        case OP_EVENTS.UNSUBSCRIBED:
          // We have already deleted subscription in unsubscribe(), do nothing here
          break;

        default:
          {
            // create, update, enter, leave, delete cases
            if (!subscription) {
              break;
            }

            var override = false;

            if (data.original) {
              override = true;
              delete data.original.__type; // Check for removed fields

              for (var field in data.original) {
                if (!(field in data.object)) {
                  data.object[field] = undefined;
                }
              }

              data.original = _ParseObject.default.fromJSON(data.original, false);
            }

            delete data.object.__type;

            var parseObject = _ParseObject.default.fromJSON(data.object, override);

            subscription.emit(data.op, parseObject, data.original);

            var localDatastore = _CoreManager.default.getLocalDatastore();

            if (override && localDatastore.isEnabled) {
              localDatastore._updateObjectIfPinned(parseObject).then(function () {});
            }
          }
      }
    }
  }, {
    key: "_handleWebSocketClose",
    value: function () {
      if (this.state === CLIENT_STATE.DISCONNECTED) {
        return;
      }

      this.state = CLIENT_STATE.CLOSED;
      this.emit(CLIENT_EMMITER_TYPES.CLOSE); // Notify each subscription about the close

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.subscriptions.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var subscription = _step2.value;
          subscription.emit(SUBSCRIPTION_EMMITER_TYPES.CLOSE);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this._handleReconnect();
    }
  }, {
    key: "_handleWebSocketError",
    value: function (error
    /*: any*/
    ) {
      this.emit(CLIENT_EMMITER_TYPES.ERROR, error);
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.subscriptions.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var subscription = _step3.value;
          subscription.emit(SUBSCRIPTION_EMMITER_TYPES.ERROR);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      this._handleReconnect();
    }
  }, {
    key: "_handleReconnect",
    value: function () {
      var _this6 = this; // if closed or currently reconnecting we stop attempting to reconnect


      if (this.state === CLIENT_STATE.DISCONNECTED) {
        return;
      }

      this.state = CLIENT_STATE.RECONNECTING;
      var time = generateInterval(this.attempts); // handle case when both close/error occur at frequent rates we ensure we do not reconnect unnecessarily.
      // we're unable to distinguish different between close/error when we're unable to reconnect therefore
      // we try to reonnect in both cases
      // server side ws and browser WebSocket behave differently in when close/error get triggered

      if (this.reconnectHandle) {
        clearTimeout(this.reconnectHandle);
      }

      this.reconnectHandle = setTimeout(function () {
        _this6.attempts++;
        _this6.connectPromise = (0, _promiseUtils.resolvingPromise)();

        _this6.open();
      }.bind(this), time);
    }
  }]);
  return LiveQueryClient;
}(_EventEmitter2.default);

_CoreManager.default.setWebSocketController(typeof WebSocket === 'function' || (typeof WebSocket === "undefined" ? "undefined" : (0, _typeof2.default)(WebSocket)) === 'object' ? WebSocket : null);

var _default = LiveQueryClient;
exports.default = _default;
},{"./CoreManager":4,"./EventEmitter":5,"./LiveQuerySubscription":9,"./ParseObject":23,"./promiseUtils":47,"@babel/runtime/helpers/assertThisInitialized":52,"@babel/runtime/helpers/classCallCheck":54,"@babel/runtime/helpers/createClass":56,"@babel/runtime/helpers/defineProperty":57,"@babel/runtime/helpers/getPrototypeOf":59,"@babel/runtime/helpers/inherits":60,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/possibleConstructorReturn":68,"@babel/runtime/helpers/typeof":73}],9:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/inherits"));

var _EventEmitter2 = _interopRequireDefault(_dereq_("./EventEmitter"));

var _CoreManager = _interopRequireDefault(_dereq_("./CoreManager"));
/*
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

/**
 * Creates a new LiveQuery Subscription.
 * Extends events.EventEmitter
 * <a href="https://nodejs.org/api/events.html#events_class_eventemitter">cloud functions</a>.
 *
 *
 * <p>Open Event - When you call query.subscribe(), we send a subscribe request to
 * the LiveQuery server, when we get the confirmation from the LiveQuery server,
 * this event will be emitted. When the client loses WebSocket connection to the
 * LiveQuery server, we will try to auto reconnect the LiveQuery server. If we
 * reconnect the LiveQuery server and successfully resubscribe the ParseQuery,
 * you'll also get this event.
 *
 * <pre>
 * subscription.on('open', () => {
 *
 * });</pre></p>
 *
 * <p>Create Event - When a new ParseObject is created and it fulfills the ParseQuery you subscribe,
 * you'll get this event. The object is the ParseObject which is created.
 *
 * <pre>
 * subscription.on('create', (object) => {
 *
 * });</pre></p>
 *
 * <p>Update Event - When an existing ParseObject (original) which fulfills the ParseQuery you subscribe
 * is updated (The ParseObject fulfills the ParseQuery before and after changes),
 * you'll get this event. The object is the ParseObject which is updated.
 * Its content is the latest value of the ParseObject.
 *
 * Parse-Server 3.1.3+ Required for original object parameter
 *
 * <pre>
 * subscription.on('update', (object, original) => {
 *
 * });</pre></p>
 *
 * <p>Enter Event - When an existing ParseObject's (original) old value doesn't fulfill the ParseQuery
 * but its new value fulfills the ParseQuery, you'll get this event. The object is the
 * ParseObject which enters the ParseQuery. Its content is the latest value of the ParseObject.
 *
 * Parse-Server 3.1.3+ Required for original object parameter
 *
 * <pre>
 * subscription.on('enter', (object, original) => {
 *
 * });</pre></p>
 *
 *
 * <p>Update Event - When an existing ParseObject's old value fulfills the ParseQuery but its new value
 * doesn't fulfill the ParseQuery, you'll get this event. The object is the ParseObject
 * which leaves the ParseQuery. Its content is the latest value of the ParseObject.
 *
 * <pre>
 * subscription.on('leave', (object) => {
 *
 * });</pre></p>
 *
 *
 * <p>Delete Event - When an existing ParseObject which fulfills the ParseQuery is deleted, you'll
 * get this event. The object is the ParseObject which is deleted.
 *
 * <pre>
 * subscription.on('delete', (object) => {
 *
 * });</pre></p>
 *
 *
 * <p>Close Event - When the client loses the WebSocket connection to the LiveQuery
 * server and we stop receiving events, you'll get this event.
 *
 * <pre>
 * subscription.on('close', () => {
 *
 * });</pre></p>
 *
 * @alias Parse.LiveQuerySubscription
 */


var Subscription =
/*#__PURE__*/
function (_EventEmitter) {
  (0, _inherits2.default)(Subscription, _EventEmitter);
  /*
   * @param {string} id - subscription id
   * @param {string} query - query to subscribe to
   * @param {string} sessionToken - optional session token
   */

  function Subscription(id, query, sessionToken) {
    var _this;

    (0, _classCallCheck2.default)(this, Subscription);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Subscription).call(this));
    _this.id = id;
    _this.query = query;
    _this.sessionToken = sessionToken; // adding listener so process does not crash
    // best practice is for developer to register their own listener

    _this.on('error', function () {});

    return _this;
  }
  /**
   * Close the subscription
   */


  (0, _createClass2.default)(Subscription, [{
    key: "unsubscribe",
    value: function ()
    /*: Promise*/
    {
      var _this2 = this;

      return _CoreManager.default.getLiveQueryController().getDefaultLiveQueryClient().then(function (liveQueryClient) {
        liveQueryClient.unsubscribe(_this2);

        _this2.emit('close');
      });
    }
  }]);
  return Subscription;
}(_EventEmitter2.default);

var _default = Subscription;
exports.default = _default;
},{"./CoreManager":4,"./EventEmitter":5,"@babel/runtime/helpers/classCallCheck":54,"@babel/runtime/helpers/createClass":56,"@babel/runtime/helpers/getPrototypeOf":59,"@babel/runtime/helpers/inherits":60,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/possibleConstructorReturn":68}],10:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(_dereq_("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/asyncToGenerator"));

var _CoreManager = _interopRequireDefault(_dereq_("./CoreManager"));

var _ParseQuery = _interopRequireDefault(_dereq_("./ParseQuery"));

var _LocalDatastoreUtils = _dereq_("./LocalDatastoreUtils");
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

/**
 * Provides a local datastore which can be used to store and retrieve <code>Parse.Object</code>. <br />
 * To enable this functionality, call <code>Parse.enableLocalDatastore()</code>.
 *
 * Pin object to add to local datastore
 *
 * <pre>await object.pin();</pre>
 * <pre>await object.pinWithName('pinName');</pre>
 *
 * Query pinned objects
 *
 * <pre>query.fromLocalDatastore();</pre>
 * <pre>query.fromPin();</pre>
 * <pre>query.fromPinWithName();</pre>
 *
 * <pre>const localObjects = await query.find();</pre>
 *
 * @class Parse.LocalDatastore
 * @static
 */


var LocalDatastore = {
  isEnabled: false,
  isSyncing: false,
  fromPinWithName: function (name
  /*: string*/
  )
  /*: Promise<Array<Object>>*/
  {
    var controller = _CoreManager.default.getLocalDatastoreController();

    return controller.fromPinWithName(name);
  },
  pinWithName: function (name
  /*: string*/
  , value
  /*: any*/
  )
  /*: Promise<void>*/
  {
    var controller = _CoreManager.default.getLocalDatastoreController();

    return controller.pinWithName(name, value);
  },
  unPinWithName: function (name
  /*: string*/
  )
  /*: Promise<void>*/
  {
    var controller = _CoreManager.default.getLocalDatastoreController();

    return controller.unPinWithName(name);
  },
  _getAllContents: function ()
  /*: Promise<Object>*/
  {
    var controller = _CoreManager.default.getLocalDatastoreController();

    return controller.getAllContents();
  },
  // Use for testing
  _getRawStorage: function ()
  /*: Promise<Object>*/
  {
    var controller = _CoreManager.default.getLocalDatastoreController();

    return controller.getRawStorage();
  },
  _clear: function ()
  /*: Promise<void>*/
  {
    var controller = _CoreManager.default.getLocalDatastoreController();

    return controller.clear();
  },
  // Pin the object and children recursively
  // Saves the object and children key to Pin Name
  _handlePinAllWithName: function () {
    var _handlePinAllWithName2 = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee(name
    /*: string*/
    , objects
    /*: Array<ParseObject>*/
    ) {
      var pinName, toPinPromises, objectKeys, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, parent, children, parentKey, json, objectKey, fromPinPromise, _ref, _ref2, pinned, toPin;

      return _regenerator.default.wrap(function (_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              pinName = this.getPinName(name);
              toPinPromises = [];
              objectKeys = [];
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 6;

              for (_iterator = objects[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                parent = _step.value;
                children = this._getChildren(parent);
                parentKey = this.getKeyForObject(parent);
                json = parent._toFullJSON();

                if (parent._localId) {
                  json._localId = parent._localId;
                }

                children[parentKey] = json;

                for (objectKey in children) {
                  objectKeys.push(objectKey);
                  toPinPromises.push(this.pinWithName(objectKey, [children[objectKey]]));
                }
              }

              _context.next = 14;
              break;

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](6);
              _didIteratorError = true;
              _iteratorError = _context.t0;

            case 14:
              _context.prev = 14;
              _context.prev = 15;

              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }

            case 17:
              _context.prev = 17;

              if (!_didIteratorError) {
                _context.next = 20;
                break;
              }

              throw _iteratorError;

            case 20:
              return _context.finish(17);

            case 21:
              return _context.finish(14);

            case 22:
              fromPinPromise = this.fromPinWithName(pinName);
              _context.next = 25;
              return Promise.all([fromPinPromise, toPinPromises]);

            case 25:
              _ref = _context.sent;
              _ref2 = (0, _slicedToArray2.default)(_ref, 1);
              pinned = _ref2[0];
              toPin = (0, _toConsumableArray2.default)(new Set([].concat((0, _toConsumableArray2.default)(pinned || []), objectKeys)));
              return _context.abrupt("return", this.pinWithName(pinName, toPin));

            case 30:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[6, 10, 14, 22], [15,, 17, 21]]);
    }));

    return function () {
      return _handlePinAllWithName2.apply(this, arguments);
    };
  }(),
  // Removes object and children keys from pin name
  // Keeps the object and children pinned
  _handleUnPinAllWithName: function () {
    var _handleUnPinAllWithName2 = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee2(name
    /*: string*/
    , objects
    /*: Array<ParseObject>*/
    ) {
      var localDatastore, pinName, promises, objectKeys, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _objectKeys, parent, children, parentKey, pinned, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, objectKey, hasReference, key, pinnedObjects;

      return _regenerator.default.wrap(function (_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this._getAllContents();

            case 2:
              localDatastore = _context2.sent;
              pinName = this.getPinName(name);
              promises = [];
              objectKeys = [];
              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              _context2.prev = 9;

              for (_iterator2 = objects[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                parent = _step2.value;
                children = this._getChildren(parent);
                parentKey = this.getKeyForObject(parent);

                (_objectKeys = objectKeys).push.apply(_objectKeys, [parentKey].concat((0, _toConsumableArray2.default)(Object.keys(children))));
              }

              _context2.next = 17;
              break;

            case 13:
              _context2.prev = 13;
              _context2.t0 = _context2["catch"](9);
              _didIteratorError2 = true;
              _iteratorError2 = _context2.t0;

            case 17:
              _context2.prev = 17;
              _context2.prev = 18;

              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }

            case 20:
              _context2.prev = 20;

              if (!_didIteratorError2) {
                _context2.next = 23;
                break;
              }

              throw _iteratorError2;

            case 23:
              return _context2.finish(20);

            case 24:
              return _context2.finish(17);

            case 25:
              objectKeys = (0, _toConsumableArray2.default)(new Set(objectKeys));
              pinned = localDatastore[pinName] || [];
              pinned = pinned.filter(function (item) {
                return !objectKeys.includes(item);
              });

              if (pinned.length == 0) {
                promises.push(this.unPinWithName(pinName));
                delete localDatastore[pinName];
              } else {
                promises.push(this.pinWithName(pinName, pinned));
                localDatastore[pinName] = pinned;
              }

              _iteratorNormalCompletion3 = true;
              _didIteratorError3 = false;
              _iteratorError3 = undefined;
              _context2.prev = 32;
              _iterator3 = objectKeys[Symbol.iterator]();

            case 34:
              if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                _context2.next = 51;
                break;
              }

              objectKey = _step3.value;
              hasReference = false;
              _context2.t1 = _regenerator.default.keys(localDatastore);

            case 38:
              if ((_context2.t2 = _context2.t1()).done) {
                _context2.next = 47;
                break;
              }

              key = _context2.t2.value;

              if (!(key === _LocalDatastoreUtils.DEFAULT_PIN || key.startsWith(_LocalDatastoreUtils.PIN_PREFIX))) {
                _context2.next = 45;
                break;
              }

              pinnedObjects = localDatastore[key] || [];

              if (!pinnedObjects.includes(objectKey)) {
                _context2.next = 45;
                break;
              }

              hasReference = true;
              return _context2.abrupt("break", 47);

            case 45:
              _context2.next = 38;
              break;

            case 47:
              if (!hasReference) {
                promises.push(this.unPinWithName(objectKey));
              }

            case 48:
              _iteratorNormalCompletion3 = true;
              _context2.next = 34;
              break;

            case 51:
              _context2.next = 57;
              break;

            case 53:
              _context2.prev = 53;
              _context2.t3 = _context2["catch"](32);
              _didIteratorError3 = true;
              _iteratorError3 = _context2.t3;

            case 57:
              _context2.prev = 57;
              _context2.prev = 58;

              if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                _iterator3.return();
              }

            case 60:
              _context2.prev = 60;

              if (!_didIteratorError3) {
                _context2.next = 63;
                break;
              }

              throw _iteratorError3;

            case 63:
              return _context2.finish(60);

            case 64:
              return _context2.finish(57);

            case 65:
              return _context2.abrupt("return", Promise.all(promises));

            case 66:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this, [[9, 13, 17, 25], [18,, 20, 24], [32, 53, 57, 65], [58,, 60, 64]]);
    }));

    return function () {
      return _handleUnPinAllWithName2.apply(this, arguments);
    };
  }(),
  // Retrieve all pointer fields from object recursively
  _getChildren: function (object
  /*: ParseObject*/
  ) {
    var encountered = {};

    var json = object._toFullJSON();

    for (var key in json) {
      if (json[key] && json[key].__type && json[key].__type === 'Object') {
        this._traverse(json[key], encountered);
      }
    }

    return encountered;
  },
  _traverse: function (object
  /*: any*/
  , encountered
  /*: any*/
  ) {
    if (!object.objectId) {
      return;
    } else {
      var objectKey = this.getKeyForObject(object);

      if (encountered[objectKey]) {
        return;
      }

      encountered[objectKey] = object;
    }

    for (var key in object) {
      var json = object[key];

      if (!object[key]) {
        json = object;
      }

      if (json.__type && json.__type === 'Object') {
        this._traverse(json, encountered);
      }
    }
  },
  // Transform keys in pin name to objects
  _serializeObjectsFromPinName: function () {
    var _serializeObjectsFromPinName2 = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee3(name
    /*: string*/
    ) {
      var _this = this,
          _ref3;

      var localDatastore, allObjects, key, pinName, pinned, promises, objects;
      return _regenerator.default.wrap(function (_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this._getAllContents();

            case 2:
              localDatastore = _context3.sent;
              allObjects = [];

              for (key in localDatastore) {
                if (key.startsWith(_LocalDatastoreUtils.OBJECT_PREFIX)) {
                  allObjects.push(localDatastore[key][0]);
                }
              }

              if (name) {
                _context3.next = 7;
                break;
              }

              return _context3.abrupt("return", allObjects);

            case 7:
              pinName = this.getPinName(name);
              pinned = localDatastore[pinName];

              if (Array.isArray(pinned)) {
                _context3.next = 11;
                break;
              }

              return _context3.abrupt("return", []);

            case 11:
              promises = pinned.map(function (objectKey) {
                return _this.fromPinWithName(objectKey);
              });
              _context3.next = 14;
              return Promise.all(promises);

            case 14:
              objects = _context3.sent;
              objects = (_ref3 = []).concat.apply(_ref3, (0, _toConsumableArray2.default)(objects));
              return _context3.abrupt("return", objects.filter(function (object) {
                return object != null;
              }));

            case 17:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function () {
      return _serializeObjectsFromPinName2.apply(this, arguments);
    };
  }(),
  // Replaces object pointers with pinned pointers
  // The object pointers may contain old data
  // Uses Breadth First Search Algorithm
  _serializeObject: function () {
    var _serializeObject2 = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee4(objectKey
    /*: string*/
    , localDatastore
    /*: any*/
    ) {
      var LDS, root, queue, meta, uniqueId, nodeId, subTreeRoot, field, value, key, pointer;
      return _regenerator.default.wrap(function (_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              LDS = localDatastore;

              if (LDS) {
                _context4.next = 5;
                break;
              }

              _context4.next = 4;
              return this._getAllContents();

            case 4:
              LDS = _context4.sent;

            case 5:
              if (!(!LDS[objectKey] || LDS[objectKey].length === 0)) {
                _context4.next = 7;
                break;
              }

              return _context4.abrupt("return", null);

            case 7:
              root = LDS[objectKey][0];
              queue = [];
              meta = {};
              uniqueId = 0;
              meta[uniqueId] = root;
              queue.push(uniqueId);

              while (queue.length !== 0) {
                nodeId = queue.shift();
                subTreeRoot = meta[nodeId];

                for (field in subTreeRoot) {
                  value = subTreeRoot[field];

                  if (value.__type && value.__type === 'Object') {
                    key = this.getKeyForObject(value);

                    if (LDS[key] && LDS[key].length > 0) {
                      pointer = LDS[key][0];
                      uniqueId++;
                      meta[uniqueId] = pointer;
                      subTreeRoot[field] = pointer;
                      queue.push(uniqueId);
                    }
                  }
                }
              }

              return _context4.abrupt("return", root);

            case 15:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function () {
      return _serializeObject2.apply(this, arguments);
    };
  }(),
  // Called when an object is save / fetched
  // Update object pin value
  _updateObjectIfPinned: function () {
    var _updateObjectIfPinned2 = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee5(object
    /*: ParseObject*/
    ) {
      var objectKey, pinned;
      return _regenerator.default.wrap(function (_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (this.isEnabled) {
                _context5.next = 2;
                break;
              }

              return _context5.abrupt("return");

            case 2:
              objectKey = this.getKeyForObject(object);
              _context5.next = 5;
              return this.fromPinWithName(objectKey);

            case 5:
              pinned = _context5.sent;

              if (!(!pinned || pinned.length === 0)) {
                _context5.next = 8;
                break;
              }

              return _context5.abrupt("return");

            case 8:
              return _context5.abrupt("return", this.pinWithName(objectKey, [object._toFullJSON()]));

            case 9:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function () {
      return _updateObjectIfPinned2.apply(this, arguments);
    };
  }(),
  // Called when object is destroyed
  // Unpin object and remove all references from pin names
  // TODO: Destroy children?
  _destroyObjectIfPinned: function () {
    var _destroyObjectIfPinned2 = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee6(object
    /*: ParseObject*/
    ) {
      var localDatastore, objectKey, pin, promises, key, pinned;
      return _regenerator.default.wrap(function (_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (this.isEnabled) {
                _context6.next = 2;
                break;
              }

              return _context6.abrupt("return");

            case 2:
              _context6.next = 4;
              return this._getAllContents();

            case 4:
              localDatastore = _context6.sent;
              objectKey = this.getKeyForObject(object);
              pin = localDatastore[objectKey];

              if (pin) {
                _context6.next = 9;
                break;
              }

              return _context6.abrupt("return");

            case 9:
              promises = [this.unPinWithName(objectKey)];
              delete localDatastore[objectKey];

              for (key in localDatastore) {
                if (key === _LocalDatastoreUtils.DEFAULT_PIN || key.startsWith(_LocalDatastoreUtils.PIN_PREFIX)) {
                  pinned = localDatastore[key] || [];

                  if (pinned.includes(objectKey)) {
                    pinned = pinned.filter(function (item) {
                      return item !== objectKey;
                    });

                    if (pinned.length == 0) {
                      promises.push(this.unPinWithName(key));
                      delete localDatastore[key];
                    } else {
                      promises.push(this.pinWithName(key, pinned));
                      localDatastore[key] = pinned;
                    }
                  }
                }
              }

              return _context6.abrupt("return", Promise.all(promises));

            case 13:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    return function () {
      return _destroyObjectIfPinned2.apply(this, arguments);
    };
  }(),
  // Update pin and references of the unsaved object
  _updateLocalIdForObject: function () {
    var _updateLocalIdForObject2 = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee7(localId
    /*: string*/
    , object
    /*: ParseObject*/
    ) {
      var localKey, objectKey, unsaved, promises, localDatastore, key, pinned;
      return _regenerator.default.wrap(function (_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              if (this.isEnabled) {
                _context7.next = 2;
                break;
              }

              return _context7.abrupt("return");

            case 2:
              localKey = "".concat(_LocalDatastoreUtils.OBJECT_PREFIX).concat(object.className, "_").concat(localId);
              objectKey = this.getKeyForObject(object);
              _context7.next = 6;
              return this.fromPinWithName(localKey);

            case 6:
              unsaved = _context7.sent;

              if (!(!unsaved || unsaved.length === 0)) {
                _context7.next = 9;
                break;
              }

              return _context7.abrupt("return");

            case 9:
              promises = [this.unPinWithName(localKey), this.pinWithName(objectKey, unsaved)];
              _context7.next = 12;
              return this._getAllContents();

            case 12:
              localDatastore = _context7.sent;

              for (key in localDatastore) {
                if (key === _LocalDatastoreUtils.DEFAULT_PIN || key.startsWith(_LocalDatastoreUtils.PIN_PREFIX)) {
                  pinned = localDatastore[key] || [];

                  if (pinned.includes(localKey)) {
                    pinned = pinned.filter(function (item) {
                      return item !== localKey;
                    });
                    pinned.push(objectKey);
                    promises.push(this.pinWithName(key, pinned));
                    localDatastore[key] = pinned;
                  }
                }
              }

              return _context7.abrupt("return", Promise.all(promises));

            case 15:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    return function () {
      return _updateLocalIdForObject2.apply(this, arguments);
    };
  }(),

  /**
   * Updates Local Datastore from Server
   *
   * <pre>
   * await Parse.LocalDatastore.updateFromServer();
   * </pre>
   * @method updateFromServer
   * @name Parse.LocalDatastore.updateFromServer
   * @static
   */
  updateFromServer: function () {
    var _updateFromServer = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee8() {
      var _this2 = this;

      var localDatastore, keys, key, pointersHash, _i, _keys, _key, _key$split, _key$split2, className, objectId, queryPromises, responses, objects, pinPromises;

      return _regenerator.default.wrap(function (_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              if (!(!this.checkIfEnabled() || this.isSyncing)) {
                _context8.next = 2;
                break;
              }

              return _context8.abrupt("return");

            case 2:
              _context8.next = 4;
              return this._getAllContents();

            case 4:
              localDatastore = _context8.sent;
              keys = [];

              for (key in localDatastore) {
                if (key.startsWith(_LocalDatastoreUtils.OBJECT_PREFIX)) {
                  keys.push(key);
                }
              }

              if (!(keys.length === 0)) {
                _context8.next = 9;
                break;
              }

              return _context8.abrupt("return");

            case 9:
              this.isSyncing = true;
              pointersHash = {};
              _i = 0, _keys = keys;

            case 12:
              if (!(_i < _keys.length)) {
                _context8.next = 23;
                break;
              }

              _key = _keys[_i]; // Ignore the OBJECT_PREFIX

              _key$split = _key.split('_'), _key$split2 = (0, _slicedToArray2.default)(_key$split, 4), className = _key$split2[2], objectId = _key$split2[3]; // User key is split into [ 'Parse', 'LDS', '', 'User', 'objectId' ]

              if (_key.split('_').length === 5 && _key.split('_')[3] === 'User') {
                className = '_User';
                objectId = _key.split('_')[4];
              }

              if (!objectId.startsWith('local')) {
                _context8.next = 18;
                break;
              }

              return _context8.abrupt("continue", 20);

            case 18:
              if (!(className in pointersHash)) {
                pointersHash[className] = new Set();
              }

              pointersHash[className].add(objectId);

            case 20:
              _i++;
              _context8.next = 12;
              break;

            case 23:
              queryPromises = Object.keys(pointersHash).map(function (className) {
                var objectIds = Array.from(pointersHash[className]);
                var query = new _ParseQuery.default(className);
                query.limit(objectIds.length);

                if (objectIds.length === 1) {
                  query.equalTo('objectId', objectIds[0]);
                } else {
                  query.containedIn('objectId', objectIds);
                }

                return query.find();
              });
              _context8.prev = 24;
              _context8.next = 27;
              return Promise.all(queryPromises);

            case 27:
              responses = _context8.sent;
              objects = [].concat.apply([], responses);
              pinPromises = objects.map(function (object) {
                var objectKey = _this2.getKeyForObject(object);

                return _this2.pinWithName(objectKey, object._toFullJSON());
              });
              _context8.next = 32;
              return Promise.all(pinPromises);

            case 32:
              this.isSyncing = false;
              _context8.next = 39;
              break;

            case 35:
              _context8.prev = 35;
              _context8.t0 = _context8["catch"](24);
              console.error('Error syncing LocalDatastore: ', _context8.t0);
              this.isSyncing = false;

            case 39:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this, [[24, 35]]);
    }));

    return function () {
      return _updateFromServer.apply(this, arguments);
    };
  }(),
  getKeyForObject: function (object
  /*: any*/
  ) {
    var objectId = object.objectId || object._getId();

    return "".concat(_LocalDatastoreUtils.OBJECT_PREFIX).concat(object.className, "_").concat(objectId);
  },
  getPinName: function (pinName
  /*: ?string*/
  ) {
    if (!pinName || pinName === _LocalDatastoreUtils.DEFAULT_PIN) {
      return _LocalDatastoreUtils.DEFAULT_PIN;
    }

    return _LocalDatastoreUtils.PIN_PREFIX + pinName;
  },
  checkIfEnabled: function () {
    if (!this.isEnabled) {
      console.error('Parse.enableLocalDatastore() must be called first');
    }

    return this.isEnabled;
  }
};
module.exports = LocalDatastore;

_CoreManager.default.setLocalDatastoreController(_dereq_('./LocalDatastoreController.browser'));

_CoreManager.default.setLocalDatastore(LocalDatastore);
},{"./CoreManager":4,"./LocalDatastoreController.browser":11,"./LocalDatastoreUtils":12,"./ParseQuery":26,"@babel/runtime/helpers/asyncToGenerator":53,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/slicedToArray":70,"@babel/runtime/helpers/toConsumableArray":72,"@babel/runtime/regenerator":76}],11:[function(_dereq_,module,exports){
"use strict";

var _LocalDatastoreUtils = _dereq_("./LocalDatastoreUtils");
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

/* global localStorage */


var LocalDatastoreController = {
  fromPinWithName: function (name
  /*: string*/
  )
  /*: Array<Object>*/
  {
    var values = localStorage.getItem(name);

    if (!values) {
      return [];
    }

    var objects = JSON.parse(values);
    return objects;
  },
  pinWithName: function (name
  /*: string*/
  , value
  /*: any*/
  ) {
    try {
      var values = JSON.stringify(value);
      localStorage.setItem(name, values);
    } catch (e) {
      // Quota exceeded, possibly due to Safari Private Browsing mode
      console.log(e.message);
    }
  },
  unPinWithName: function (name
  /*: string*/
  ) {
    localStorage.removeItem(name);
  },
  getAllContents: function ()
  /*: Object*/
  {
    var LDS = {};

    for (var i = 0; i < localStorage.length; i += 1) {
      var key = localStorage.key(i);

      if ((0, _LocalDatastoreUtils.isLocalDatastoreKey)(key)) {
        var value = localStorage.getItem(key);

        try {
          LDS[key] = JSON.parse(value);
        } catch (error) {
          console.error('Error getAllContents: ', error);
        }
      }
    }

    return LDS;
  },
  getRawStorage: function ()
  /*: Object*/
  {
    var storage = {};

    for (var i = 0; i < localStorage.length; i += 1) {
      var key = localStorage.key(i);
      var value = localStorage.getItem(key);
      storage[key] = value;
    }

    return storage;
  },
  clear: function ()
  /*: Promise*/
  {
    var toRemove = [];

    for (var i = 0; i < localStorage.length; i += 1) {
      var key = localStorage.key(i);

      if ((0, _LocalDatastoreUtils.isLocalDatastoreKey)(key)) {
        toRemove.push(key);
      }
    }

    var promises = toRemove.map(this.unPinWithName);
    return Promise.all(promises);
  }
};
module.exports = LocalDatastoreController;
},{"./LocalDatastoreUtils":12}],12:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isLocalDatastoreKey = isLocalDatastoreKey;
exports.OBJECT_PREFIX = exports.PIN_PREFIX = exports.DEFAULT_PIN = void 0;
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

var DEFAULT_PIN = '_default';
exports.DEFAULT_PIN = DEFAULT_PIN;
var PIN_PREFIX = 'parsePin_';
exports.PIN_PREFIX = PIN_PREFIX;
var OBJECT_PREFIX = 'Parse_LDS_';
exports.OBJECT_PREFIX = OBJECT_PREFIX;

function isLocalDatastoreKey(key
/*: string*/
)
/*: boolean*/
{
  return !!(key && (key === DEFAULT_PIN || key.startsWith(PIN_PREFIX) || key.startsWith(OBJECT_PREFIX)));
}
},{}],13:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultState = defaultState;
exports.setServerData = setServerData;
exports.setPendingOp = setPendingOp;
exports.pushPendingState = pushPendingState;
exports.popPendingState = popPendingState;
exports.mergeFirstPendingState = mergeFirstPendingState;
exports.estimateAttribute = estimateAttribute;
exports.estimateAttributes = estimateAttributes;
exports.commitServerChanges = commitServerChanges;

var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));

var _encode = _interopRequireDefault(_dereq_("./encode"));

var _ParseFile = _interopRequireDefault(_dereq_("./ParseFile"));

var _ParseObject = _interopRequireDefault(_dereq_("./ParseObject"));

var _ParseRelation = _interopRequireDefault(_dereq_("./ParseRelation"));

var _TaskQueue = _interopRequireDefault(_dereq_("./TaskQueue"));

var _ParseOp = _dereq_("./ParseOp");
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */


function defaultState()
/*: State*/
{
  return {
    serverData: {},
    pendingOps: [{}],
    objectCache: {},
    tasks: new _TaskQueue.default(),
    existed: false
  };
}

function setServerData(serverData
/*: AttributeMap*/
, attributes
/*: AttributeMap*/
) {
  for (var _attr in attributes) {
    if (typeof attributes[_attr] !== 'undefined') {
      serverData[_attr] = attributes[_attr];
    } else {
      delete serverData[_attr];
    }
  }
}

function setPendingOp(pendingOps
/*: Array<OpsMap>*/
, attr
/*: string*/
, op
/*: ?Op*/
) {
  var last = pendingOps.length - 1;

  if (op) {
    pendingOps[last][attr] = op;
  } else {
    delete pendingOps[last][attr];
  }
}

function pushPendingState(pendingOps
/*: Array<OpsMap>*/
) {
  pendingOps.push({});
}

function popPendingState(pendingOps
/*: Array<OpsMap>*/
)
/*: OpsMap*/
{
  var first = pendingOps.shift();

  if (!pendingOps.length) {
    pendingOps[0] = {};
  }

  return first;
}

function mergeFirstPendingState(pendingOps
/*: Array<OpsMap>*/
) {
  var first = popPendingState(pendingOps);
  var next = pendingOps[0];

  for (var _attr2 in first) {
    if (next[_attr2] && first[_attr2]) {
      var merged = next[_attr2].mergeWith(first[_attr2]);

      if (merged) {
        next[_attr2] = merged;
      }
    } else {
      next[_attr2] = first[_attr2];
    }
  }
}

function estimateAttribute(serverData
/*: AttributeMap*/
, pendingOps
/*: Array<OpsMap>*/
, className
/*: string*/
, id
/*: ?string*/
, attr
/*: string*/
)
/*: mixed*/
{
  var value = serverData[attr];

  for (var i = 0; i < pendingOps.length; i++) {
    if (pendingOps[i][attr]) {
      if (pendingOps[i][attr] instanceof _ParseOp.RelationOp) {
        if (id) {
          value = pendingOps[i][attr].applyTo(value, {
            className: className,
            id: id
          }, attr);
        }
      } else {
        value = pendingOps[i][attr].applyTo(value);
      }
    }
  }

  return value;
}

function estimateAttributes(serverData
/*: AttributeMap*/
, pendingOps
/*: Array<OpsMap>*/
, className
/*: string*/
, id
/*: ?string*/
)
/*: AttributeMap*/
{
  var data = {};

  for (var attr in serverData) {
    data[attr] = serverData[attr];
  }

  for (var i = 0; i < pendingOps.length; i++) {
    for (attr in pendingOps[i]) {
      if (pendingOps[i][attr] instanceof _ParseOp.RelationOp) {
        if (id) {
          data[attr] = pendingOps[i][attr].applyTo(data[attr], {
            className: className,
            id: id
          }, attr);
        }
      } else {
        if (attr.includes('.')) {
          // convert a.b.c into { a: { b: { c: value } } }
          var fields = attr.split('.');
          var last = fields[fields.length - 1];
          var object = Object.assign({}, data);

          for (var _i = 0; _i < fields.length - 1; _i++) {
            object = object[fields[_i]];
          }

          object[last] = pendingOps[i][attr].applyTo(object[last]);
        } else {
          data[attr] = pendingOps[i][attr].applyTo(data[attr]);
        }
      }
    }
  }

  return data;
}

function commitServerChanges(serverData
/*: AttributeMap*/
, objectCache
/*: ObjectCache*/
, changes
/*: AttributeMap*/
) {
  for (var _attr3 in changes) {
    var val = changes[_attr3];
    serverData[_attr3] = val;

    if (val && (0, _typeof2.default)(val) === 'object' && !(val instanceof _ParseObject.default) && !(val instanceof _ParseFile.default) && !(val instanceof _ParseRelation.default)) {
      var json = (0, _encode.default)(val, false, true);
      objectCache[_attr3] = JSON.stringify(json);
    }
  }
}
},{"./ParseFile":19,"./ParseObject":23,"./ParseOp":24,"./ParseRelation":27,"./TaskQueue":37,"./encode":42,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/typeof":73}],14:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));

var equalObjects = _dereq_('./equals').default;

var decode = _dereq_('./decode').default;

var ParseError = _dereq_('./ParseError').default;

var ParsePolygon = _dereq_('./ParsePolygon').default;

var ParseGeoPoint = _dereq_('./ParseGeoPoint').default;
/**
 * contains -- Determines if an object is contained in a list with special handling for Parse pointers.
 */


function contains(haystack, needle) {
  if (needle && needle.__type && (needle.__type === 'Pointer' || needle.__type === 'Object')) {
    for (var i in haystack) {
      var ptr = haystack[i];

      if (typeof ptr === 'string' && ptr === needle.objectId) {
        return true;
      }

      if (ptr.className === needle.className && ptr.objectId === needle.objectId) {
        return true;
      }
    }

    return false;
  }

  return haystack.indexOf(needle) > -1;
}

function transformObject(object) {
  if (object._toFullJSON) {
    return object._toFullJSON();
  }

  return object;
}
/**
 * matchesQuery -- Determines if an object would be returned by a Parse Query
 * It's a lightweight, where-clause only implementation of a full query engine.
 * Since we find queries that match objects, rather than objects that match
 * queries, we can avoid building a full-blown query tool.
 */


function matchesQuery(className, object, objects, query) {
  if (object.className !== className) {
    return false;
  }

  var obj = object;
  var q = query;

  if (object.toJSON) {
    obj = object.toJSON();
  }

  if (query.toJSON) {
    q = query.toJSON().where;
  }

  obj.className = className;

  for (var field in q) {
    if (!matchesKeyConstraints(className, obj, objects, field, q[field])) {
      return false;
    }
  }

  return true;
}

function equalObjectsGeneric(obj, compareTo, eqlFn) {
  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      if (eqlFn(obj[i], compareTo)) {
        return true;
      }
    }

    return false;
  }

  return eqlFn(obj, compareTo);
}
/**
 * Determines whether an object matches a single key's constraints
 */


function matchesKeyConstraints(className, object, objects, key, constraints) {
  if (constraints === null) {
    return false;
  }

  if (key.indexOf('.') >= 0) {
    // Key references a subobject
    var keyComponents = key.split('.');
    var subObjectKey = keyComponents[0];
    var keyRemainder = keyComponents.slice(1).join('.');
    return matchesKeyConstraints(className, object[subObjectKey] || {}, objects, keyRemainder, constraints);
  }

  var i;

  if (key === '$or') {
    for (i = 0; i < constraints.length; i++) {
      if (matchesQuery(className, object, objects, constraints[i])) {
        return true;
      }
    }

    return false;
  }

  if (key === '$and') {
    for (i = 0; i < constraints.length; i++) {
      if (!matchesQuery(className, object, objects, constraints[i])) {
        return false;
      }
    }

    return true;
  }

  if (key === '$nor') {
    for (i = 0; i < constraints.length; i++) {
      if (matchesQuery(className, object, objects, constraints[i])) {
        return false;
      }
    }

    return true;
  }

  if (key === '$relatedTo') {
    // Bail! We can't handle relational queries locally
    return false;
  }

  if (!/^[A-Za-z][0-9A-Za-z_]*$/.test(key)) {
    throw new ParseError(ParseError.INVALID_KEY_NAME, "Invalid Key: ".concat(key));
  } // Equality (or Array contains) cases


  if ((0, _typeof2.default)(constraints) !== 'object') {
    if (Array.isArray(object[key])) {
      return object[key].indexOf(constraints) > -1;
    }

    return object[key] === constraints;
  }

  var compareTo;

  if (constraints.__type) {
    if (constraints.__type === 'Pointer') {
      return equalObjectsGeneric(object[key], constraints, function (obj, ptr) {
        return typeof obj !== 'undefined' && ptr.className === obj.className && ptr.objectId === obj.objectId;
      });
    }

    return equalObjectsGeneric(decode(object[key]), decode(constraints), equalObjects);
  } // More complex cases


  for (var condition in constraints) {
    compareTo = constraints[condition];

    if (compareTo.__type) {
      compareTo = decode(compareTo);
    } // Compare Date Object or Date String


    if (toString.call(compareTo) === '[object Date]' || typeof compareTo === 'string' && new Date(compareTo) !== 'Invalid Date' && !isNaN(new Date(compareTo))) {
      object[key] = new Date(object[key].iso ? object[key].iso : object[key]);
    }

    switch (condition) {
      case '$lt':
        if (object[key] >= compareTo) {
          return false;
        }

        break;

      case '$lte':
        if (object[key] > compareTo) {
          return false;
        }

        break;

      case '$gt':
        if (object[key] <= compareTo) {
          return false;
        }

        break;

      case '$gte':
        if (object[key] < compareTo) {
          return false;
        }

        break;

      case '$ne':
        if (equalObjects(object[key], compareTo)) {
          return false;
        }

        break;

      case '$in':
        if (!contains(compareTo, object[key])) {
          return false;
        }

        break;

      case '$nin':
        if (contains(compareTo, object[key])) {
          return false;
        }

        break;

      case '$all':
        for (i = 0; i < compareTo.length; i++) {
          if (object[key].indexOf(compareTo[i]) < 0) {
            return false;
          }
        }

        break;

      case '$exists':
        {
          var propertyExists = typeof object[key] !== 'undefined';
          var existenceIsRequired = constraints['$exists'];

          if (typeof constraints['$exists'] !== 'boolean') {
            // The SDK will never submit a non-boolean for $exists, but if someone
            // tries to submit a non-boolean for $exits outside the SDKs, just ignore it.
            break;
          }

          if (!propertyExists && existenceIsRequired || propertyExists && !existenceIsRequired) {
            return false;
          }

          break;
        }

      case '$regex':
        {
          if ((0, _typeof2.default)(compareTo) === 'object') {
            return compareTo.test(object[key]);
          } // JS doesn't support perl-style escaping


          var expString = '';
          var escapeEnd = -2;
          var escapeStart = compareTo.indexOf('\\Q');

          while (escapeStart > -1) {
            // Add the unescaped portion
            expString += compareTo.substring(escapeEnd + 2, escapeStart);
            escapeEnd = compareTo.indexOf('\\E', escapeStart);

            if (escapeEnd > -1) {
              expString += compareTo.substring(escapeStart + 2, escapeEnd).replace(/\\\\\\\\E/g, '\\E').replace(/\W/g, '\\$&');
            }

            escapeStart = compareTo.indexOf('\\Q', escapeEnd);
          }

          expString += compareTo.substring(Math.max(escapeStart, escapeEnd + 2));
          var modifiers = constraints.$options || '';
          modifiers = modifiers.replace('x', '').replace('s', ''); // Parse Server / Mongo support x and s modifiers but JS RegExp doesn't

          var exp = new RegExp(expString, modifiers);

          if (!exp.test(object[key])) {
            return false;
          }

          break;
        }

      case '$nearSphere':
        {
          if (!compareTo || !object[key]) {
            return false;
          }

          var distance = compareTo.radiansTo(object[key]);
          var max = constraints.$maxDistance || Infinity;
          return distance <= max;
        }

      case '$within':
        {
          if (!compareTo || !object[key]) {
            return false;
          }

          var southWest = compareTo.$box[0];
          var northEast = compareTo.$box[1];

          if (southWest.latitude > northEast.latitude || southWest.longitude > northEast.longitude) {
            // Invalid box, crosses the date line
            return false;
          }

          return object[key].latitude > southWest.latitude && object[key].latitude < northEast.latitude && object[key].longitude > southWest.longitude && object[key].longitude < northEast.longitude;
        }

      case '$options':
        // Not a query type, but a way to add options to $regex. Ignore and
        // avoid the default
        break;

      case '$maxDistance':
        // Not a query type, but a way to add a cap to $nearSphere. Ignore and
        // avoid the default
        break;

      case '$select':
        {
          var subQueryObjects = objects.filter(function (obj, index, arr) {
            return matchesQuery(compareTo.query.className, obj, arr, compareTo.query.where);
          });

          for (var _i = 0; _i < subQueryObjects.length; _i += 1) {
            var subObject = transformObject(subQueryObjects[_i]);
            return equalObjects(object[key], subObject[compareTo.key]);
          }

          return false;
        }

      case '$dontSelect':
        {
          var _subQueryObjects = objects.filter(function (obj, index, arr) {
            return matchesQuery(compareTo.query.className, obj, arr, compareTo.query.where);
          });

          for (var _i2 = 0; _i2 < _subQueryObjects.length; _i2 += 1) {
            var _subObject = transformObject(_subQueryObjects[_i2]);

            return !equalObjects(object[key], _subObject[compareTo.key]);
          }

          return false;
        }

      case '$inQuery':
        {
          var _subQueryObjects2 = objects.filter(function (obj, index, arr) {
            return matchesQuery(compareTo.className, obj, arr, compareTo.where);
          });

          for (var _i3 = 0; _i3 < _subQueryObjects2.length; _i3 += 1) {
            var _subObject2 = transformObject(_subQueryObjects2[_i3]);

            if (object[key].className === _subObject2.className && object[key].objectId === _subObject2.objectId) {
              return true;
            }
          }

          return false;
        }

      case '$notInQuery':
        {
          var _subQueryObjects3 = objects.filter(function (obj, index, arr) {
            return matchesQuery(compareTo.className, obj, arr, compareTo.where);
          });

          for (var _i4 = 0; _i4 < _subQueryObjects3.length; _i4 += 1) {
            var _subObject3 = transformObject(_subQueryObjects3[_i4]);

            if (object[key].className === _subObject3.className && object[key].objectId === _subObject3.objectId) {
              return false;
            }
          }

          return true;
        }

      case '$containedBy':
        {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = object[key][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var value = _step.value;

              if (!contains(compareTo, value)) {
                return false;
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return true;
        }

      case '$geoWithin':
        {
          var points = compareTo.$polygon.map(function (geoPoint) {
            return [geoPoint.latitude, geoPoint.longitude];
          });
          var polygon = new ParsePolygon(points);
          return polygon.containsPoint(object[key]);
        }

      case '$geoIntersects':
        {
          var _polygon = new ParsePolygon(object[key].coordinates);

          var point = new ParseGeoPoint(compareTo.$point);
          return _polygon.containsPoint(point);
        }

      default:
        return false;
    }
  }

  return true;
}

function validateQuery(query
/*: any*/
) {
  var q = query;

  if (query.toJSON) {
    q = query.toJSON().where;
  }

  var specialQuerykeys = ['$and', '$or', '$nor', '_rperm', '_wperm', '_perishable_token', '_email_verify_token', '_email_verify_token_expires_at', '_account_lockout_expires_at', '_failed_login_count'];
  Object.keys(q).forEach(function (key) {
    if (q && q[key] && q[key].$regex) {
      if (typeof q[key].$options === 'string') {
        if (!q[key].$options.match(/^[imxs]+$/)) {
          throw new ParseError(ParseError.INVALID_QUERY, "Bad $options value for query: ".concat(q[key].$options));
        }
      }
    }

    if (specialQuerykeys.indexOf(key) < 0 && !key.match(/^[a-zA-Z][a-zA-Z0-9_\.]*$/)) {
      throw new ParseError(ParseError.INVALID_KEY_NAME, "Invalid key name: ".concat(key));
    }
  });
}

var OfflineQuery = {
  matchesQuery: matchesQuery,
  validateQuery: validateQuery
};
module.exports = OfflineQuery;
},{"./ParseError":18,"./ParseGeoPoint":20,"./ParsePolygon":25,"./decode":41,"./equals":43,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/typeof":73}],15:[function(_dereq_,module,exports){
(function (process){
"use strict";

var _interopRequireWildcard = _dereq_("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

var _decode = _interopRequireDefault(_dereq_("./decode"));

var _encode = _interopRequireDefault(_dereq_("./encode"));

var _CoreManager = _interopRequireDefault(_dereq_("./CoreManager"));

var _InstallationController = _interopRequireDefault(_dereq_("./InstallationController"));

var ParseOp = _interopRequireWildcard(_dereq_("./ParseOp"));

var _RESTController = _interopRequireDefault(_dereq_("./RESTController"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Contains all Parse API classes and functions.
 * @static
 * @global
 * @class
 * @hideconstructor
 */


var Parse = {
  /**
   * Call this method first to set up your authentication tokens for Parse.
   * You can get your keys from the Data Browser on parse.com.
   * @param {String} applicationId Your Parse Application ID.
   * @param {String} javaScriptKey (optional) Your Parse JavaScript Key (Not needed for parse-server)
   * @param {String} masterKey (optional) Your Parse Master Key. (Node.js only!)
   * @static
   */
  initialize: function (applicationId
  /*: string*/
  , javaScriptKey
  /*: string*/
  ) {
    if ("browser" === 'browser' && _CoreManager.default.get('IS_NODE') && !process.env.SERVER_RENDERING) {
      /* eslint-disable no-console */
      console.log('It looks like you\'re using the browser version of the SDK in a ' + 'node.js environment. You should require(\'parse/node\') instead.');
      /* eslint-enable no-console */
    }

    Parse._initialize(applicationId, javaScriptKey);
  },
  _initialize: function (applicationId
  /*: string*/
  , javaScriptKey
  /*: string*/
  , masterKey
  /*: string*/
  ) {
    _CoreManager.default.set('APPLICATION_ID', applicationId);

    _CoreManager.default.set('JAVASCRIPT_KEY', javaScriptKey);

    _CoreManager.default.set('MASTER_KEY', masterKey);

    _CoreManager.default.set('USE_MASTER_KEY', false);
  },

  /**
   * Call this method to set your AsyncStorage engine
   * Starting Parse@1.11, the ParseSDK do not provide a React AsyncStorage as the ReactNative module
   * is not provided at a stable path and changes over versions.
   * @param {AsyncStorage} storage a react native async storage.
   * @static
   */
  setAsyncStorage: function (storage
  /*: any*/
  ) {
    _CoreManager.default.setAsyncStorage(storage);
  },

  /**
   * Call this method to set your LocalDatastoreStorage engine
   * If using React-Native use {@link Parse.setAsyncStorage Parse.setAsyncStorage()}
   * @param {LocalDatastoreController} controller a data storage.
   * @static
   */
  setLocalDatastoreController: function (controller
  /*: any*/
  ) {
    _CoreManager.default.setLocalDatastoreController(controller);
  }
};
/** These legacy setters may eventually be deprecated **/

/**
 * @member Parse.applicationId
 * @type string
 * @static
 */

Object.defineProperty(Parse, 'applicationId', {
  get: function () {
    return _CoreManager.default.get('APPLICATION_ID');
  },
  set: function (value) {
    _CoreManager.default.set('APPLICATION_ID', value);
  }
});
/**
 * @member Parse.javaScriptKey
 * @type string
 * @static
 */

Object.defineProperty(Parse, 'javaScriptKey', {
  get: function () {
    return _CoreManager.default.get('JAVASCRIPT_KEY');
  },
  set: function (value) {
    _CoreManager.default.set('JAVASCRIPT_KEY', value);
  }
});
/**
 * @member Parse.masterKey
 * @type string
 * @static
 */

Object.defineProperty(Parse, 'masterKey', {
  get: function () {
    return _CoreManager.default.get('MASTER_KEY');
  },
  set: function (value) {
    _CoreManager.default.set('MASTER_KEY', value);
  }
});
/**
 * @member Parse.serverURL
 * @type string
 * @static
 */

Object.defineProperty(Parse, 'serverURL', {
  get: function () {
    return _CoreManager.default.get('SERVER_URL');
  },
  set: function (value) {
    _CoreManager.default.set('SERVER_URL', value);
  }
});
/**
 * @member Parse.serverAuthToken
 * @type string
 * @static
 */

Object.defineProperty(Parse, 'serverAuthToken', {
  get: function () {
    return _CoreManager.default.get('SERVER_AUTH_TOKEN');
  },
  set: function (value) {
    _CoreManager.default.set('SERVER_AUTH_TOKEN', value);
  }
});
/**
 * @member Parse.serverAuthType
 * @type string
 * @static
 */

Object.defineProperty(Parse, 'serverAuthType', {
  get: function () {
    return _CoreManager.default.get('SERVER_AUTH_TYPE');
  },
  set: function (value) {
    _CoreManager.default.set('SERVER_AUTH_TYPE', value);
  }
});
/**
 * @member Parse.liveQueryServerURL
 * @type string
 * @static
 */

Object.defineProperty(Parse, 'liveQueryServerURL', {
  get: function () {
    return _CoreManager.default.get('LIVEQUERY_SERVER_URL');
  },
  set: function (value) {
    _CoreManager.default.set('LIVEQUERY_SERVER_URL', value);
  }
});
/* End setters */

Parse.ACL = _dereq_('./ParseACL').default;
Parse.Analytics = _dereq_('./Analytics');
Parse.AnonymousUtils = _dereq_('./AnonymousUtils').default;
Parse.Cloud = _dereq_('./Cloud');
Parse.CoreManager = _dereq_('./CoreManager');
Parse.Config = _dereq_('./ParseConfig').default;
Parse.Error = _dereq_('./ParseError').default;
Parse.FacebookUtils = _dereq_('./FacebookUtils').default;
Parse.File = _dereq_('./ParseFile').default;
Parse.GeoPoint = _dereq_('./ParseGeoPoint').default;
Parse.Polygon = _dereq_('./ParsePolygon').default;
Parse.Installation = _dereq_('./ParseInstallation').default;
Parse.LocalDatastore = _dereq_('./LocalDatastore');
Parse.Object = _dereq_('./ParseObject').default;
Parse.Op = {
  Set: ParseOp.SetOp,
  Unset: ParseOp.UnsetOp,
  Increment: ParseOp.IncrementOp,
  Add: ParseOp.AddOp,
  Remove: ParseOp.RemoveOp,
  AddUnique: ParseOp.AddUniqueOp,
  Relation: ParseOp.RelationOp
};
Parse.Push = _dereq_('./Push');
Parse.Query = _dereq_('./ParseQuery').default;
Parse.Relation = _dereq_('./ParseRelation').default;
Parse.Role = _dereq_('./ParseRole').default;
Parse.Schema = _dereq_('./ParseSchema').default;
Parse.Session = _dereq_('./ParseSession').default;
Parse.Storage = _dereq_('./Storage');
Parse.User = _dereq_('./ParseUser').default;
Parse.LiveQuery = _dereq_('./ParseLiveQuery').default;
Parse.LiveQueryClient = _dereq_('./LiveQueryClient').default;

Parse._request = function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _CoreManager.default.getRESTController().request.apply(null, args);
};

Parse._ajax = function () {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return _CoreManager.default.getRESTController().ajax.apply(null, args);
}; // We attempt to match the signatures of the legacy versions of these methods


Parse._decode = function (_, value) {
  return (0, _decode.default)(value);
};

Parse._encode = function (value, _, disallowObjects) {
  return (0, _encode.default)(value, disallowObjects);
};

Parse._getInstallationId = function () {
  return _CoreManager.default.getInstallationController().currentInstallationId();
};
/**
 * Enable pinning in your application.
 * This must be called before your application can use pinning.
 *
 * @static
 */


Parse.enableLocalDatastore = function () {
  Parse.LocalDatastore.isEnabled = true;
};
/**
 * Flag that indicates whether Local Datastore is enabled.
 *
 * @static
 */


Parse.isLocalDatastoreEnabled = function () {
  return Parse.LocalDatastore.isEnabled;
};
/**
 * Gets all contents from Local Datastore
 *
 * <pre>
 * await Parse.dumpLocalDatastore();
 * </pre>
 *
 * @static
 */


Parse.dumpLocalDatastore = function () {
  if (!Parse.LocalDatastore.isEnabled) {
    console.log('Parse.enableLocalDatastore() must be called first'); // eslint-disable-line no-console

    return Promise.resolve({});
  } else {
    return Parse.LocalDatastore._getAllContents();
  }
};

_CoreManager.default.setInstallationController(_InstallationController.default);

_CoreManager.default.setRESTController(_RESTController.default);

// For legacy requires, of the form `var Parse = require('parse').Parse`
Parse.Parse = Parse;
module.exports = Parse;
}).call(this,_dereq_('_process'))
},{"./Analytics":1,"./AnonymousUtils":2,"./Cloud":3,"./CoreManager":4,"./FacebookUtils":6,"./InstallationController":7,"./LiveQueryClient":8,"./LocalDatastore":10,"./ParseACL":16,"./ParseConfig":17,"./ParseError":18,"./ParseFile":19,"./ParseGeoPoint":20,"./ParseInstallation":21,"./ParseLiveQuery":22,"./ParseObject":23,"./ParseOp":24,"./ParsePolygon":25,"./ParseQuery":26,"./ParseRelation":27,"./ParseRole":28,"./ParseSchema":29,"./ParseSession":30,"./ParseUser":31,"./Push":32,"./RESTController":33,"./Storage":35,"./decode":41,"./encode":42,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/interopRequireWildcard":62,"_process":77}],16:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/defineProperty"));

var _ParseRole = _interopRequireDefault(_dereq_("./ParseRole"));

var _ParseUser = _interopRequireDefault(_dereq_("./ParseUser"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */


var PUBLIC_KEY = '*';
/**
 * Creates a new ACL.
 * If no argument is given, the ACL has no permissions for anyone.
 * If the argument is a Parse.User, the ACL will have read and write
 *   permission for only that user.
 * If the argument is any other JSON object, that object will be interpretted
 *   as a serialized ACL created with toJSON().
 *
 * <p>An ACL, or Access Control List can be added to any
 * <code>Parse.Object</code> to restrict access to only a subset of users
 * of your application.</p>
 * @alias Parse.ACL
 */

var ParseACL =
/*#__PURE__*/
function () {
  /**
   * @param {(Parse.User|Object)} user The user to initialize the ACL for
   */
  function ParseACL(arg1
  /*: ParseUser | ByIdMap*/
  ) {
    (0, _classCallCheck2.default)(this, ParseACL);
    (0, _defineProperty2.default)(this, "permissionsById", void 0);
    this.permissionsById = {};

    if (arg1 && (0, _typeof2.default)(arg1) === 'object') {
      if (arg1 instanceof _ParseUser.default) {
        this.setReadAccess(arg1, true);
        this.setWriteAccess(arg1, true);
      } else {
        for (var _userId in arg1) {
          var accessList = arg1[_userId];

          if (typeof _userId !== 'string') {
            throw new TypeError('Tried to create an ACL with an invalid user id.');
          }

          this.permissionsById[_userId] = {};

          for (var _permission in accessList) {
            var allowed = accessList[_permission];

            if (_permission !== 'read' && _permission !== 'write') {
              throw new TypeError('Tried to create an ACL with an invalid permission type.');
            }

            if (typeof allowed !== 'boolean') {
              throw new TypeError('Tried to create an ACL with an invalid permission value.');
            }

            this.permissionsById[_userId][_permission] = allowed;
          }
        }
      }
    } else if (typeof arg1 === 'function') {
      throw new TypeError('ParseACL constructed with a function. Did you forget ()?');
    }
  }
  /**
   * Returns a JSON-encoded version of the ACL.
   * @return {Object}
   */


  (0, _createClass2.default)(ParseACL, [{
    key: "toJSON",
    value: function ()
    /*: ByIdMap*/
    {
      var permissions = {};

      for (var p in this.permissionsById) {
        permissions[p] = this.permissionsById[p];
      }

      return permissions;
    }
    /**
     * Returns whether this ACL is equal to another object
     * @param other The other object to compare to
     * @return {Boolean}
     */

  }, {
    key: "equals",
    value: function (other
    /*: ParseACL*/
    )
    /*: boolean*/
    {
      if (!(other instanceof ParseACL)) {
        return false;
      }

      var users = Object.keys(this.permissionsById);
      var otherUsers = Object.keys(other.permissionsById);

      if (users.length !== otherUsers.length) {
        return false;
      }

      for (var u in this.permissionsById) {
        if (!other.permissionsById[u]) {
          return false;
        }

        if (this.permissionsById[u].read !== other.permissionsById[u].read) {
          return false;
        }

        if (this.permissionsById[u].write !== other.permissionsById[u].write) {
          return false;
        }
      }

      return true;
    }
  }, {
    key: "_setAccess",
    value: function (accessType
    /*: string*/
    , userId
    /*: ParseUser | ParseRole | string*/
    , allowed
    /*: boolean*/
    ) {
      if (userId instanceof _ParseUser.default) {
        userId = userId.id;
      } else if (userId instanceof _ParseRole.default) {
        var name = userId.getName();

        if (!name) {
          throw new TypeError('Role must have a name');
        }

        userId = 'role:' + name;
      }

      if (typeof userId !== 'string') {
        throw new TypeError('userId must be a string.');
      }

      if (typeof allowed !== 'boolean') {
        throw new TypeError('allowed must be either true or false.');
      }

      var permissions = this.permissionsById[userId];

      if (!permissions) {
        if (!allowed) {
          // The user already doesn't have this permission, so no action is needed
          return;
        } else {
          permissions = {};
          this.permissionsById[userId] = permissions;
        }
      }

      if (allowed) {
        this.permissionsById[userId][accessType] = true;
      } else {
        delete permissions[accessType];

        if (Object.keys(permissions).length === 0) {
          delete this.permissionsById[userId];
        }
      }
    }
  }, {
    key: "_getAccess",
    value: function (accessType
    /*: string*/
    , userId
    /*: ParseUser | ParseRole | string*/
    )
    /*: boolean*/
    {
      if (userId instanceof _ParseUser.default) {
        userId = userId.id;

        if (!userId) {
          throw new Error('Cannot get access for a ParseUser without an ID');
        }
      } else if (userId instanceof _ParseRole.default) {
        var name = userId.getName();

        if (!name) {
          throw new TypeError('Role must have a name');
        }

        userId = 'role:' + name;
      }

      var permissions = this.permissionsById[userId];

      if (!permissions) {
        return false;
      }

      return !!permissions[accessType];
    }
    /**
     * Sets whether the given user is allowed to read this object.
     * @param userId An instance of Parse.User or its objectId.
     * @param {Boolean} allowed Whether that user should have read access.
     */

  }, {
    key: "setReadAccess",
    value: function (userId
    /*: ParseUser | ParseRole | string*/
    , allowed
    /*: boolean*/
    ) {
      this._setAccess('read', userId, allowed);
    }
    /**
     * Get whether the given user id is *explicitly* allowed to read this object.
     * Even if this returns false, the user may still be able to access it if
     * getPublicReadAccess returns true or a role that the user belongs to has
     * write access.
     * @param userId An instance of Parse.User or its objectId, or a Parse.Role.
     * @return {Boolean}
     */

  }, {
    key: "getReadAccess",
    value: function (userId
    /*: ParseUser | ParseRole | string*/
    )
    /*: boolean*/
    {
      return this._getAccess('read', userId);
    }
    /**
     * Sets whether the given user id is allowed to write this object.
     * @param userId An instance of Parse.User or its objectId, or a Parse.Role..
     * @param {Boolean} allowed Whether that user should have write access.
     */

  }, {
    key: "setWriteAccess",
    value: function (userId
    /*: ParseUser | ParseRole | string*/
    , allowed
    /*: boolean*/
    ) {
      this._setAccess('write', userId, allowed);
    }
    /**
     * Gets whether the given user id is *explicitly* allowed to write this object.
     * Even if this returns false, the user may still be able to write it if
     * getPublicWriteAccess returns true or a role that the user belongs to has
     * write access.
     * @param userId An instance of Parse.User or its objectId, or a Parse.Role.
     * @return {Boolean}
     */

  }, {
    key: "getWriteAccess",
    value: function (userId
    /*: ParseUser | ParseRole | string*/
    )
    /*: boolean*/
    {
      return this._getAccess('write', userId);
    }
    /**
     * Sets whether the public is allowed to read this object.
     * @param {Boolean} allowed
     */

  }, {
    key: "setPublicReadAccess",
    value: function (allowed
    /*: boolean*/
    ) {
      this.setReadAccess(PUBLIC_KEY, allowed);
    }
    /**
     * Gets whether the public is allowed to read this object.
     * @return {Boolean}
     */

  }, {
    key: "getPublicReadAccess",
    value: function ()
    /*: boolean*/
    {
      return this.getReadAccess(PUBLIC_KEY);
    }
    /**
     * Sets whether the public is allowed to write this object.
     * @param {Boolean} allowed
     */

  }, {
    key: "setPublicWriteAccess",
    value: function (allowed
    /*: boolean*/
    ) {
      this.setWriteAccess(PUBLIC_KEY, allowed);
    }
    /**
     * Gets whether the public is allowed to write this object.
     * @return {Boolean}
     */

  }, {
    key: "getPublicWriteAccess",
    value: function ()
    /*: boolean*/
    {
      return this.getWriteAccess(PUBLIC_KEY);
    }
    /**
     * Gets whether users belonging to the given role are allowed
     * to read this object. Even if this returns false, the role may
     * still be able to write it if a parent role has read access.
     *
     * @param role The name of the role, or a Parse.Role object.
     * @return {Boolean} true if the role has read access. false otherwise.
     * @throws {TypeError} If role is neither a Parse.Role nor a String.
     */

  }, {
    key: "getRoleReadAccess",
    value: function (role
    /*: ParseRole | string*/
    )
    /*: boolean*/
    {
      if (role instanceof _ParseRole.default) {
        // Normalize to the String name
        role = role.getName();
      }

      if (typeof role !== 'string') {
        throw new TypeError('role must be a ParseRole or a String');
      }

      return this.getReadAccess('role:' + role);
    }
    /**
     * Gets whether users belonging to the given role are allowed
     * to write this object. Even if this returns false, the role may
     * still be able to write it if a parent role has write access.
     *
     * @param role The name of the role, or a Parse.Role object.
     * @return {Boolean} true if the role has write access. false otherwise.
     * @throws {TypeError} If role is neither a Parse.Role nor a String.
     */

  }, {
    key: "getRoleWriteAccess",
    value: function (role
    /*: ParseRole | string*/
    )
    /*: boolean*/
    {
      if (role instanceof _ParseRole.default) {
        // Normalize to the String name
        role = role.getName();
      }

      if (typeof role !== 'string') {
        throw new TypeError('role must be a ParseRole or a String');
      }

      return this.getWriteAccess('role:' + role);
    }
    /**
     * Sets whether users belonging to the given role are allowed
     * to read this object.
     *
     * @param role The name of the role, or a Parse.Role object.
     * @param {Boolean} allowed Whether the given role can read this object.
     * @throws {TypeError} If role is neither a Parse.Role nor a String.
     */

  }, {
    key: "setRoleReadAccess",
    value: function (role
    /*: ParseRole | string*/
    , allowed
    /*: boolean*/
    ) {
      if (role instanceof _ParseRole.default) {
        // Normalize to the String name
        role = role.getName();
      }

      if (typeof role !== 'string') {
        throw new TypeError('role must be a ParseRole or a String');
      }

      this.setReadAccess('role:' + role, allowed);
    }
    /**
     * Sets whether users belonging to the given role are allowed
     * to write this object.
     *
     * @param role The name of the role, or a Parse.Role object.
     * @param {Boolean} allowed Whether the given role can write this object.
     * @throws {TypeError} If role is neither a Parse.Role nor a String.
     */

  }, {
    key: "setRoleWriteAccess",
    value: function (role
    /*: ParseRole | string*/
    , allowed
    /*: boolean*/
    ) {
      if (role instanceof _ParseRole.default) {
        // Normalize to the String name
        role = role.getName();
      }

      if (typeof role !== 'string') {
        throw new TypeError('role must be a ParseRole or a String');
      }

      this.setWriteAccess('role:' + role, allowed);
    }
  }]);
  return ParseACL;
}();

var _default = ParseACL;
exports.default = _default;
},{"./ParseRole":28,"./ParseUser":31,"@babel/runtime/helpers/classCallCheck":54,"@babel/runtime/helpers/createClass":56,"@babel/runtime/helpers/defineProperty":57,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/typeof":73}],17:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/defineProperty"));

var _CoreManager = _interopRequireDefault(_dereq_("./CoreManager"));

var _decode = _interopRequireDefault(_dereq_("./decode"));

var _encode = _interopRequireDefault(_dereq_("./encode"));

var _escape2 = _interopRequireDefault(_dereq_("./escape"));

var _ParseError = _interopRequireDefault(_dereq_("./ParseError"));

var _Storage = _interopRequireDefault(_dereq_("./Storage"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

/**
 * Parse.Config is a local representation of configuration data that
 * can be set from the Parse dashboard.
 *
 * @alias Parse.Config
 */


var ParseConfig =
/*#__PURE__*/
function () {
  function ParseConfig() {
    (0, _classCallCheck2.default)(this, ParseConfig);
    (0, _defineProperty2.default)(this, "attributes", void 0);
    (0, _defineProperty2.default)(this, "_escapedAttributes", void 0);
    this.attributes = {};
    this._escapedAttributes = {};
  }
  /**
   * Gets the value of an attribute.
   * @param {String} attr The name of an attribute.
   */


  (0, _createClass2.default)(ParseConfig, [{
    key: "get",
    value: function (attr
    /*: string*/
    )
    /*: any*/
    {
      return this.attributes[attr];
    }
    /**
     * Gets the HTML-escaped value of an attribute.
     * @param {String} attr The name of an attribute.
     */

  }, {
    key: "escape",
    value: function (attr
    /*: string*/
    )
    /*: string*/
    {
      var html = this._escapedAttributes[attr];

      if (html) {
        return html;
      }

      var val = this.attributes[attr];
      var escaped = '';

      if (val != null) {
        escaped = (0, _escape2.default)(val.toString());
      }

      this._escapedAttributes[attr] = escaped;
      return escaped;
    }
    /**
     * Retrieves the most recently-fetched configuration object, either from
     * memory or from local storage if necessary.
     *
     * @static
     * @return {Config} The most recently-fetched Parse.Config if it
     *     exists, else an empty Parse.Config.
     */

  }], [{
    key: "current",
    value: function () {
      var controller = _CoreManager.default.getConfigController();

      return controller.current();
    }
    /**
     * Gets a new configuration object from the server.
     * @static
     * @return {Promise} A promise that is resolved with a newly-created
     *     configuration object when the get completes.
     */

  }, {
    key: "get",
    value: function () {
      var controller = _CoreManager.default.getConfigController();

      return controller.get();
    }
    /**
     * Save value keys to the server.
     * @static
     * @return {Promise} A promise that is resolved with a newly-created
     *     configuration object or with the current with the update.
     */

  }, {
    key: "save",
    value: function (attrs
    /*: { [key: string]: any }*/
    ) {
      var controller = _CoreManager.default.getConfigController(); //To avoid a mismatch with the local and the cloud config we get a new version


      return controller.save(attrs).then(function () {
        return controller.get();
      }, function (error) {
        return Promise.reject(error);
      });
    }
  }]);
  return ParseConfig;
}();

var currentConfig = null;
var CURRENT_CONFIG_KEY = 'currentConfig';

function decodePayload(data) {
  try {
    var json = JSON.parse(data);

    if (json && (0, _typeof2.default)(json) === 'object') {
      return (0, _decode.default)(json);
    }
  } catch (e) {
    return null;
  }
}

var DefaultController = {
  current: function () {
    if (currentConfig) {
      return currentConfig;
    }

    var config = new ParseConfig();

    var storagePath = _Storage.default.generatePath(CURRENT_CONFIG_KEY);

    var configData;

    if (!_Storage.default.async()) {
      configData = _Storage.default.getItem(storagePath);

      if (configData) {
        var attributes = decodePayload(configData);

        if (attributes) {
          config.attributes = attributes;
          currentConfig = config;
        }
      }

      return config;
    } // Return a promise for async storage controllers


    return _Storage.default.getItemAsync(storagePath).then(function (configData) {
      if (configData) {
        var _attributes = decodePayload(configData);

        if (_attributes) {
          config.attributes = _attributes;
          currentConfig = config;
        }
      }

      return config;
    });
  },
  get: function () {
    var RESTController = _CoreManager.default.getRESTController();

    return RESTController.request('GET', 'config', {}, {}).then(function (response) {
      if (!response || !response.params) {
        var error = new _ParseError.default(_ParseError.default.INVALID_JSON, 'Config JSON response invalid.');
        return Promise.reject(error);
      }

      var config = new ParseConfig();
      config.attributes = {};

      for (var attr in response.params) {
        config.attributes[attr] = (0, _decode.default)(response.params[attr]);
      }

      currentConfig = config;
      return _Storage.default.setItemAsync(_Storage.default.generatePath(CURRENT_CONFIG_KEY), JSON.stringify(response.params)).then(function () {
        return config;
      });
    });
  },
  save: function (attrs
  /*: { [key: string]: any }*/
  ) {
    var RESTController = _CoreManager.default.getRESTController();

    var encodedAttrs = {};

    for (var _key in attrs) {
      encodedAttrs[_key] = (0, _encode.default)(attrs[_key]);
    }

    return RESTController.request('PUT', 'config', {
      params: encodedAttrs
    }, {
      useMasterKey: true
    }).then(function (response) {
      if (response && response.result) {
        return Promise.resolve();
      } else {
        var error = new _ParseError.default(_ParseError.default.INTERNAL_SERVER_ERROR, 'Error occured updating Config.');
        return Promise.reject(error);
      }
    });
  }
};

_CoreManager.default.setConfigController(DefaultController);

var _default = ParseConfig;
exports.default = _default;
},{"./CoreManager":4,"./ParseError":18,"./Storage":35,"./decode":41,"./encode":42,"./escape":44,"@babel/runtime/helpers/classCallCheck":54,"@babel/runtime/helpers/createClass":56,"@babel/runtime/helpers/defineProperty":57,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/typeof":73}],18:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/inherits"));

var _wrapNativeSuper2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/wrapNativeSuper"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
  * Constructs a new Parse.Error object with the given code and message.
  * @alias Parse.Error
  */


var ParseError =
/*#__PURE__*/
function (_Error) {
  (0, _inherits2.default)(ParseError, _Error);
  /**
   * @param {Number} code An error code constant from <code>Parse.Error</code>.
   * @param {String} message A detailed description of the error.
   */

  function ParseError(code, message) {
    var _this;

    (0, _classCallCheck2.default)(this, ParseError);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ParseError).call(this, message));
    _this.code = code;
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'message', {
      enumerable: true,
      value: message
    });
    return _this;
  }

  (0, _createClass2.default)(ParseError, [{
    key: "toString",
    value: function () {
      return 'ParseError: ' + this.code + ' ' + this.message;
    }
  }]);
  return ParseError;
}((0, _wrapNativeSuper2.default)(Error));
/**
 * Error code indicating some error other than those enumerated here.
 * @property OTHER_CAUSE
 * @static
 * @final
 */


ParseError.OTHER_CAUSE = -1;
/**
 * Error code indicating that something has gone wrong with the server.
 * If you get this error code, it is Parse's fault. Contact us at
 * https://parse.com/help
 * @property INTERNAL_SERVER_ERROR
 * @static
 * @final
 */

ParseError.INTERNAL_SERVER_ERROR = 1;
/**
 * Error code indicating the connection to the Parse servers failed.
 * @property CONNECTION_FAILED
 * @static
 * @final
 */

ParseError.CONNECTION_FAILED = 100;
/**
 * Error code indicating the specified object doesn't exist.
 * @property OBJECT_NOT_FOUND
 * @static
 * @final
 */

ParseError.OBJECT_NOT_FOUND = 101;
/**
 * Error code indicating you tried to query with a datatype that doesn't
 * support it, like exact matching an array or object.
 * @property INVALID_QUERY
 * @static
 * @final
 */

ParseError.INVALID_QUERY = 102;
/**
 * Error code indicating a missing or invalid classname. Classnames are
 * case-sensitive. They must start with a letter, and a-zA-Z0-9_ are the
 * only valid characters.
 * @property INVALID_CLASS_NAME
 * @static
 * @final
 */

ParseError.INVALID_CLASS_NAME = 103;
/**
 * Error code indicating an unspecified object id.
 * @property MISSING_OBJECT_ID
 * @static
 * @final
 */

ParseError.MISSING_OBJECT_ID = 104;
/**
 * Error code indicating an invalid key name. Keys are case-sensitive. They
 * must start with a letter, and a-zA-Z0-9_ are the only valid characters.
 * @property INVALID_KEY_NAME
 * @static
 * @final
 */

ParseError.INVALID_KEY_NAME = 105;
/**
 * Error code indicating a malformed pointer. You should not see this unless
 * you have been mucking about changing internal Parse code.
 * @property INVALID_POINTER
 * @static
 * @final
 */

ParseError.INVALID_POINTER = 106;
/**
 * Error code indicating that badly formed JSON was received upstream. This
 * either indicates you have done something unusual with modifying how
 * things encode to JSON, or the network is failing badly.
 * @property INVALID_JSON
 * @static
 * @final
 */

ParseError.INVALID_JSON = 107;
/**
 * Error code indicating that the feature you tried to access is only
 * available internally for testing purposes.
 * @property COMMAND_UNAVAILABLE
 * @static
 * @final
 */

ParseError.COMMAND_UNAVAILABLE = 108;
/**
 * You must call Parse.initialize before using the Parse library.
 * @property NOT_INITIALIZED
 * @static
 * @final
 */

ParseError.NOT_INITIALIZED = 109;
/**
 * Error code indicating that a field was set to an inconsistent type.
 * @property INCORRECT_TYPE
 * @static
 * @final
 */

ParseError.INCORRECT_TYPE = 111;
/**
 * Error code indicating an invalid channel name. A channel name is either
 * an empty string (the broadcast channel) or contains only a-zA-Z0-9_
 * characters and starts with a letter.
 * @property INVALID_CHANNEL_NAME
 * @static
 * @final
 */

ParseError.INVALID_CHANNEL_NAME = 112;
/**
 * Error code indicating that push is misconfigured.
 * @property PUSH_MISCONFIGURED
 * @static
 * @final
 */

ParseError.PUSH_MISCONFIGURED = 115;
/**
 * Error code indicating that the object is too large.
 * @property OBJECT_TOO_LARGE
 * @static
 * @final
 */

ParseError.OBJECT_TOO_LARGE = 116;
/**
 * Error code indicating that the operation isn't allowed for clients.
 * @property OPERATION_FORBIDDEN
 * @static
 * @final
 */

ParseError.OPERATION_FORBIDDEN = 119;
/**
 * Error code indicating the result was not found in the cache.
 * @property CACHE_MISS
 * @static
 * @final
 */

ParseError.CACHE_MISS = 120;
/**
 * Error code indicating that an invalid key was used in a nested
 * JSONObject.
 * @property INVALID_NESTED_KEY
 * @static
 * @final
 */

ParseError.INVALID_NESTED_KEY = 121;
/**
 * Error code indicating that an invalid filename was used for ParseFile.
 * A valid file name contains only a-zA-Z0-9_. characters and is between 1
 * and 128 characters.
 * @property INVALID_FILE_NAME
 * @static
 * @final
 */

ParseError.INVALID_FILE_NAME = 122;
/**
 * Error code indicating an invalid ACL was provided.
 * @property INVALID_ACL
 * @static
 * @final
 */

ParseError.INVALID_ACL = 123;
/**
 * Error code indicating that the request timed out on the server. Typically
 * this indicates that the request is too expensive to run.
 * @property TIMEOUT
 * @static
 * @final
 */

ParseError.TIMEOUT = 124;
/**
 * Error code indicating that the email address was invalid.
 * @property INVALID_EMAIL_ADDRESS
 * @static
 * @final
 */

ParseError.INVALID_EMAIL_ADDRESS = 125;
/**
 * Error code indicating a missing content type.
 * @property MISSING_CONTENT_TYPE
 * @static
 * @final
 */

ParseError.MISSING_CONTENT_TYPE = 126;
/**
 * Error code indicating a missing content length.
 * @property MISSING_CONTENT_LENGTH
 * @static
 * @final
 */

ParseError.MISSING_CONTENT_LENGTH = 127;
/**
 * Error code indicating an invalid content length.
 * @property INVALID_CONTENT_LENGTH
 * @static
 * @final
 */

ParseError.INVALID_CONTENT_LENGTH = 128;
/**
 * Error code indicating a file that was too large.
 * @property FILE_TOO_LARGE
 * @static
 * @final
 */

ParseError.FILE_TOO_LARGE = 129;
/**
 * Error code indicating an error saving a file.
 * @property FILE_SAVE_ERROR
 * @static
 * @final
 */

ParseError.FILE_SAVE_ERROR = 130;
/**
 * Error code indicating that a unique field was given a value that is
 * already taken.
 * @property DUPLICATE_VALUE
 * @static
 * @final
 */

ParseError.DUPLICATE_VALUE = 137;
/**
 * Error code indicating that a role's name is invalid.
 * @property INVALID_ROLE_NAME
 * @static
 * @final
 */

ParseError.INVALID_ROLE_NAME = 139;
/**
 * Error code indicating that an application quota was exceeded.  Upgrade to
 * resolve.
 * @property EXCEEDED_QUOTA
 * @static
 * @final
 */

ParseError.EXCEEDED_QUOTA = 140;
/**
 * Error code indicating that a Cloud Code script failed.
 * @property SCRIPT_FAILED
 * @static
 * @final
 */

ParseError.SCRIPT_FAILED = 141;
/**
 * Error code indicating that a Cloud Code validation failed.
 * @property VALIDATION_ERROR
 * @static
 * @final
 */

ParseError.VALIDATION_ERROR = 142;
/**
 * Error code indicating that invalid image data was provided.
 * @property INVALID_IMAGE_DATA
 * @static
 * @final
 */

ParseError.INVALID_IMAGE_DATA = 143;
/**
 * Error code indicating an unsaved file.
 * @property UNSAVED_FILE_ERROR
 * @static
 * @final
 */

ParseError.UNSAVED_FILE_ERROR = 151;
/**
 * Error code indicating an invalid push time.
 * @property INVALID_PUSH_TIME_ERROR
 * @static
 * @final
 */

ParseError.INVALID_PUSH_TIME_ERROR = 152;
/**
 * Error code indicating an error deleting a file.
 * @property FILE_DELETE_ERROR
 * @static
 * @final
 */

ParseError.FILE_DELETE_ERROR = 153;
/**
 * Error code indicating that the application has exceeded its request
 * limit.
 * @property REQUEST_LIMIT_EXCEEDED
 * @static
 * @final
 */

ParseError.REQUEST_LIMIT_EXCEEDED = 155;
/**
 * Error code indicating an invalid event name.
 * @property INVALID_EVENT_NAME
 * @static
 * @final
 */

ParseError.INVALID_EVENT_NAME = 160;
/**
 * Error code indicating that the username is missing or empty.
 * @property USERNAME_MISSING
 * @static
 * @final
 */

ParseError.USERNAME_MISSING = 200;
/**
 * Error code indicating that the password is missing or empty.
 * @property PASSWORD_MISSING
 * @static
 * @final
 */

ParseError.PASSWORD_MISSING = 201;
/**
 * Error code indicating that the username has already been taken.
 * @property USERNAME_TAKEN
 * @static
 * @final
 */

ParseError.USERNAME_TAKEN = 202;
/**
 * Error code indicating that the email has already been taken.
 * @property EMAIL_TAKEN
 * @static
 * @final
 */

ParseError.EMAIL_TAKEN = 203;
/**
 * Error code indicating that the email is missing, but must be specified.
 * @property EMAIL_MISSING
 * @static
 * @final
 */

ParseError.EMAIL_MISSING = 204;
/**
 * Error code indicating that a user with the specified email was not found.
 * @property EMAIL_NOT_FOUND
 * @static
 * @final
 */

ParseError.EMAIL_NOT_FOUND = 205;
/**
 * Error code indicating that a user object without a valid session could
 * not be altered.
 * @property SESSION_MISSING
 * @static
 * @final
 */

ParseError.SESSION_MISSING = 206;
/**
 * Error code indicating that a user can only be created through signup.
 * @property MUST_CREATE_USER_THROUGH_SIGNUP
 * @static
 * @final
 */

ParseError.MUST_CREATE_USER_THROUGH_SIGNUP = 207;
/**
 * Error code indicating that an an account being linked is already linked
 * to another user.
 * @property ACCOUNT_ALREADY_LINKED
 * @static
 * @final
 */

ParseError.ACCOUNT_ALREADY_LINKED = 208;
/**
 * Error code indicating that the current session token is invalid.
 * @property INVALID_SESSION_TOKEN
 * @static
 * @final
 */

ParseError.INVALID_SESSION_TOKEN = 209;
/**
 * Error code indicating that a user cannot be linked to an account because
 * that account's id could not be found.
 * @property LINKED_ID_MISSING
 * @static
 * @final
 */

ParseError.LINKED_ID_MISSING = 250;
/**
 * Error code indicating that a user with a linked (e.g. Facebook) account
 * has an invalid session.
 * @property INVALID_LINKED_SESSION
 * @static
 * @final
 */

ParseError.INVALID_LINKED_SESSION = 251;
/**
 * Error code indicating that a service being linked (e.g. Facebook or
 * Twitter) is unsupported.
 * @property UNSUPPORTED_SERVICE
 * @static
 * @final
 */

ParseError.UNSUPPORTED_SERVICE = 252;
/**
 * Error code indicating an invalid operation occured on schema
 * @property INVALID_SCHEMA_OPERATION
 * @static
 * @final
 */

ParseError.INVALID_SCHEMA_OPERATION = 255;
/**
 * Error code indicating that there were multiple errors. Aggregate errors
 * have an "errors" property, which is an array of error objects with more
 * detail about each error that occurred.
 * @property AGGREGATE_ERROR
 * @static
 * @final
 */

ParseError.AGGREGATE_ERROR = 600;
/**
 * Error code indicating the client was unable to read an input file.
 * @property FILE_READ_ERROR
 * @static
 * @final
 */

ParseError.FILE_READ_ERROR = 601;
/**
 * Error code indicating a real error code is unavailable because
 * we had to use an XDomainRequest object to allow CORS requests in
 * Internet Explorer, which strips the body from HTTP responses that have
 * a non-2XX status code.
 * @property X_DOMAIN_REQUEST
 * @static
 * @final
 */

ParseError.X_DOMAIN_REQUEST = 602;
var _default = ParseError;
exports.default = _default;
},{"@babel/runtime/helpers/assertThisInitialized":52,"@babel/runtime/helpers/classCallCheck":54,"@babel/runtime/helpers/createClass":56,"@babel/runtime/helpers/getPrototypeOf":59,"@babel/runtime/helpers/inherits":60,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/possibleConstructorReturn":68,"@babel/runtime/helpers/wrapNativeSuper":74}],19:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(_dereq_("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/defineProperty"));

var _CoreManager = _interopRequireDefault(_dereq_("./CoreManager"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

/* global XMLHttpRequest, Blob */


var XHR = null;

if (typeof XMLHttpRequest !== 'undefined') {
  XHR = XMLHttpRequest;
}

/*:: type Base64 = { base64: string };*/

/*:: type Uri = { uri: string };*/

/*:: type FileData = Array<number> | Base64 | Blob | Uri;*/

/*:: export type FileSource = {
  format: 'file';
  file: Blob;
  type: string
} | {
  format: 'base64';
  base64: string;
  type: string
} | {
  format: 'uri';
  uri: string;
  type: string
};*/
var dataUriRegexp = /^data:([a-zA-Z]+\/[-a-zA-Z0-9+.]+)(;charset=[a-zA-Z0-9\-\/]*)?;base64,/;

function b64Digit(number
/*: number*/
)
/*: string*/
{
  if (number < 26) {
    return String.fromCharCode(65 + number);
  }

  if (number < 52) {
    return String.fromCharCode(97 + (number - 26));
  }

  if (number < 62) {
    return String.fromCharCode(48 + (number - 52));
  }

  if (number === 62) {
    return '+';
  }

  if (number === 63) {
    return '/';
  }

  throw new TypeError('Tried to encode large digit ' + number + ' in base64.');
}
/**
 * A Parse.File is a local representation of a file that is saved to the Parse
 * cloud.
 * @alias Parse.File
 */


var ParseFile =
/*#__PURE__*/
function () {
  /**
   * @param name {String} The file's name. This will be prefixed by a unique
   *     value once the file has finished saving. The file name must begin with
   *     an alphanumeric character, and consist of alphanumeric characters,
   *     periods, spaces, underscores, or dashes.
   * @param data {Array} The data for the file, as either:
   *     1. an Array of byte value Numbers, or
   *     2. an Object like { base64: "..." } with a base64-encoded String.
   *     3. an Object like { uri: "..." } with a uri String.
   *     4. a File object selected with a file upload control. (3) only works
   *        in Firefox 3.6+, Safari 6.0.2+, Chrome 7+, and IE 10+.
   *        For example:
   * <pre>
   * var fileUploadControl = $("#profilePhotoFileUpload")[0];
   * if (fileUploadControl.files.length > 0) {
   *   var file = fileUploadControl.files[0];
   *   var name = "photo.jpg";
   *   var parseFile = new Parse.File(name, file);
   *   parseFile.save().then(function() {
   *     // The file has been saved to Parse.
   *   }, function(error) {
   *     // The file either could not be read, or could not be saved to Parse.
   *   });
   * }</pre>
   * @param type {String} Optional Content-Type header to use for the file. If
   *     this is omitted, the content type will be inferred from the name's
   *     extension.
   */
  function ParseFile(name
  /*: string*/
  , data
  /*:: ?: FileData*/
  , type
  /*:: ?: string*/
  ) {
    (0, _classCallCheck2.default)(this, ParseFile);
    (0, _defineProperty2.default)(this, "_name", void 0);
    (0, _defineProperty2.default)(this, "_url", void 0);
    (0, _defineProperty2.default)(this, "_source", void 0);
    (0, _defineProperty2.default)(this, "_previousSave", void 0);
    (0, _defineProperty2.default)(this, "_data", void 0);
    var specifiedType = type || '';
    this._name = name;

    if (data !== undefined) {
      if (Array.isArray(data)) {
        this._data = ParseFile.encodeBase64(data);
        this._source = {
          format: 'base64',
          base64: this._data,
          type: specifiedType
        };
      } else if (typeof Blob !== 'undefined' && data instanceof Blob) {
        this._source = {
          format: 'file',
          file: data,
          type: specifiedType
        };
      } else if (data && typeof data.uri === 'string' && data.uri !== undefined) {
        this._source = {
          format: 'uri',
          uri: data.uri,
          type: specifiedType
        };
      } else if (data && typeof data.base64 === 'string') {
        var base64 = data.base64;
        var commaIndex = base64.indexOf(',');

        if (commaIndex !== -1) {
          var matches = dataUriRegexp.exec(base64.slice(0, commaIndex + 1)); // if data URI with type and charset, there will be 4 matches.

          this._data = base64.slice(commaIndex + 1);
          this._source = {
            format: 'base64',
            base64: this._data,
            type: matches[1]
          };
        } else {
          this._data = base64;
          this._source = {
            format: 'base64',
            base64: base64,
            type: specifiedType
          };
        }
      } else {
        throw new TypeError('Cannot create a Parse.File with that data.');
      }
    }
  }
  /**
   * Return the data for the file, downloading it if not already present.
   * Data is present if initialized with Byte Array, Base64 or Saved with Uri.
   * Data is cleared if saved with File object selected with a file upload control
   *
   * @return {Promise} Promise that is resolve with base64 data
   */


  (0, _createClass2.default)(ParseFile, [{
    key: "getData",
    value: function () {
      var _getData = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        var controller, result;
        return _regenerator.default.wrap(function (_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this._data) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", this._data);

              case 2:
                if (this._url) {
                  _context.next = 4;
                  break;
                }

                throw new Error('Cannot retrieve data for unsaved ParseFile.');

              case 4:
                controller = _CoreManager.default.getFileController();
                _context.next = 7;
                return controller.download(this._url);

              case 7:
                result = _context.sent;
                this._data = result.base64;
                return _context.abrupt("return", this._data);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function () {
        return _getData.apply(this, arguments);
      };
    }()
    /**
     * Gets the name of the file. Before save is called, this is the filename
     * given by the user. After save is called, that name gets prefixed with a
     * unique identifier.
     * @return {String}
     */

  }, {
    key: "name",
    value: function ()
    /*: string*/
    {
      return this._name;
    }
    /**
     * Gets the url of the file. It is only available after you save the file or
     * after you get the file from a Parse.Object.
     * @param {Object} options An object to specify url options
     * @return {String}
     */

  }, {
    key: "url",
    value: function (options
    /*:: ?: { forceSecure?: boolean }*/
    )
    /*: ?string*/
    {
      options = options || {};

      if (!this._url) {
        return;
      }

      if (options.forceSecure) {
        return this._url.replace(/^http:\/\//i, 'https://');
      } else {
        return this._url;
      }
    }
    /**
     * Saves the file to the Parse cloud.
     * @param {Object} options
     *  * Valid options are:<ul>
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>progress: In Browser only, callback for upload progress
     * </ul>
     * @return {Promise} Promise that is resolved when the save finishes.
     */

  }, {
    key: "save",
    value: function (options
    /*:: ?: FullOptions*/
    ) {
      var _this = this;

      options = options || {};

      var controller = _CoreManager.default.getFileController();

      if (!this._previousSave) {
        if (this._source.format === 'file') {
          this._previousSave = controller.saveFile(this._name, this._source, options).then(function (res) {
            _this._name = res.name;
            _this._url = res.url;
            _this._data = null;
            return _this;
          });
        } else if (this._source.format === 'uri') {
          this._previousSave = controller.download(this._source.uri).then(function (result) {
            var newSource = {
              format: 'base64',
              base64: result.base64,
              type: result.contentType
            };
            _this._data = result.base64;
            return controller.saveBase64(_this._name, newSource, options);
          }).then(function (res) {
            _this._name = res.name;
            _this._url = res.url;
            return _this;
          });
        } else {
          this._previousSave = controller.saveBase64(this._name, this._source, options).then(function (res) {
            _this._name = res.name;
            _this._url = res.url;
            return _this;
          });
        }
      }

      if (this._previousSave) {
        return this._previousSave;
      }
    }
  }, {
    key: "toJSON",
    value: function ()
    /*: { name: ?string, url: ?string }*/
    {
      return {
        __type: 'File',
        name: this._name,
        url: this._url
      };
    }
  }, {
    key: "equals",
    value: function (other
    /*: mixed*/
    )
    /*: boolean*/
    {
      if (this === other) {
        return true;
      } // Unsaved Files are never equal, since they will be saved to different URLs


      return other instanceof ParseFile && this.name() === other.name() && this.url() === other.url() && typeof this.url() !== 'undefined';
    }
  }], [{
    key: "fromJSON",
    value: function (obj)
    /*: ParseFile*/
    {
      if (obj.__type !== 'File') {
        throw new TypeError('JSON object does not represent a ParseFile');
      }

      var file = new ParseFile(obj.name);
      file._url = obj.url;
      return file;
    }
  }, {
    key: "encodeBase64",
    value: function (bytes
    /*: Array<number>*/
    )
    /*: string*/
    {
      var chunks = [];
      chunks.length = Math.ceil(bytes.length / 3);

      for (var i = 0; i < chunks.length; i++) {
        var b1 = bytes[i * 3];
        var b2 = bytes[i * 3 + 1] || 0;
        var b3 = bytes[i * 3 + 2] || 0;
        var has2 = i * 3 + 1 < bytes.length;
        var has3 = i * 3 + 2 < bytes.length;
        chunks[i] = [b64Digit(b1 >> 2 & 0x3F), b64Digit(b1 << 4 & 0x30 | b2 >> 4 & 0x0F), has2 ? b64Digit(b2 << 2 & 0x3C | b3 >> 6 & 0x03) : '=', has3 ? b64Digit(b3 & 0x3F) : '='].join('');
      }

      return chunks.join('');
    }
  }]);
  return ParseFile;
}();

var DefaultController = {
  saveFile: function (name
  /*: string*/
  , source
  /*: FileSource*/
  , options
  /*:: ?: FullOptions*/
  ) {
    if (source.format !== 'file') {
      throw new Error('saveFile can only be used with File-type sources.');
    } // To directly upload a File, we use a REST-style AJAX request


    var headers = {
      'X-Parse-Application-ID': _CoreManager.default.get('APPLICATION_ID'),
      'Content-Type': source.type || (source.file ? source.file.type : null)
    };

    var jsKey = _CoreManager.default.get('JAVASCRIPT_KEY');

    if (jsKey) {
      headers['X-Parse-JavaScript-Key'] = jsKey;
    }

    var url = _CoreManager.default.get('SERVER_URL');

    if (url[url.length - 1] !== '/') {
      url += '/';
    }

    url += 'files/' + name;
    return _CoreManager.default.getRESTController().ajax('POST', url, source.file, headers, options).then(function (res) {
      return res.response;
    });
  },
  saveBase64: function (name
  /*: string*/
  , source
  /*: FileSource*/
  , options
  /*:: ?: FullOptions*/
  ) {
    if (source.format !== 'base64') {
      throw new Error('saveBase64 can only be used with Base64-type sources.');
    }

    var data
    /*: { base64: any; _ContentType?: any }*/
    = {
      base64: source.base64
    };

    if (source.type) {
      data._ContentType = source.type;
    }

    return _CoreManager.default.getRESTController().request('POST', 'files/' + name, data, options);
  },
  download: function (uri) {
    if (XHR) {
      return this.downloadAjax(uri);
    } else {
      return Promise.reject('Cannot make a request: No definition of XMLHttpRequest was found.');
    }
  },
  downloadAjax: function (uri) {
    return new Promise(function (resolve, reject) {
      var xhr = new XHR();
      xhr.open('GET', uri, true);
      xhr.responseType = 'arraybuffer';

      xhr.onerror = function (e) {
        reject(e);
      };

      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
          return;
        }

        var bytes = new Uint8Array(this.response);
        resolve({
          base64: ParseFile.encodeBase64(bytes),
          contentType: xhr.getResponseHeader('content-type')
        });
      };

      xhr.send();
    });
  },
  _setXHR: function (xhr
  /*: any*/
  ) {
    XHR = xhr;
  }
};

_CoreManager.default.setFileController(DefaultController);

var _default = ParseFile;
exports.default = _default;
},{"./CoreManager":4,"@babel/runtime/helpers/asyncToGenerator":53,"@babel/runtime/helpers/classCallCheck":54,"@babel/runtime/helpers/createClass":56,"@babel/runtime/helpers/defineProperty":57,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/regenerator":76}],20:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/defineProperty"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

/**
 * Creates a new GeoPoint with any of the following forms:<br>
 *   <pre>
 *   new GeoPoint(otherGeoPoint)
 *   new GeoPoint(30, 30)
 *   new GeoPoint([30, 30])
 *   new GeoPoint({latitude: 30, longitude: 30})
 *   new GeoPoint()  // defaults to (0, 0)
 *   </pre>
 * <p>Represents a latitude / longitude point that may be associated
 * with a key in a ParseObject or used as a reference point for geo queries.
 * This allows proximity-based queries on the key.</p>
 *
 * <p>Only one key in a class may contain a GeoPoint.</p>
 *
 * <p>Example:<pre>
 *   var point = new Parse.GeoPoint(30.0, -20.0);
 *   var object = new Parse.Object("PlaceObject");
 *   object.set("location", point);
 *   object.save();</pre></p>
 * @alias Parse.GeoPoint
 */

/* global navigator */


var ParseGeoPoint =
/*#__PURE__*/
function () {
  /**
   * @param {(Number[]|Object|Number)} options Either a list of coordinate pairs, an object with `latitude`, `longitude`, or the latitude or the point.
   * @param {Number} longitude The longitude of the GeoPoint
   */
  function ParseGeoPoint(arg1
  /*: Array<number> |
      { latitude: number; longitude: number } |
      number*/
  , arg2
  /*:: ?: number*/
  ) {
    (0, _classCallCheck2.default)(this, ParseGeoPoint);
    (0, _defineProperty2.default)(this, "_latitude", void 0);
    (0, _defineProperty2.default)(this, "_longitude", void 0);

    if (Array.isArray(arg1)) {
      ParseGeoPoint._validate(arg1[0], arg1[1]);

      this._latitude = arg1[0];
      this._longitude = arg1[1];
    } else if ((0, _typeof2.default)(arg1) === 'object') {
      ParseGeoPoint._validate(arg1.latitude, arg1.longitude);

      this._latitude = arg1.latitude;
      this._longitude = arg1.longitude;
    } else if (arg1 !== undefined && arg2 !== undefined) {
      ParseGeoPoint._validate(arg1, arg2);

      this._latitude = arg1;
      this._longitude = arg2;
    } else {
      this._latitude = 0;
      this._longitude = 0;
    }
  }
  /**
   * North-south portion of the coordinate, in range [-90, 90].
   * Throws an exception if set out of range in a modern browser.
   * @property latitude
   * @type Number
   */


  (0, _createClass2.default)(ParseGeoPoint, [{
    key: "toJSON",

    /**
     * Returns a JSON representation of the GeoPoint, suitable for Parse.
      * @return {Object}
     */
    value: function ()
    /*: { __type: string; latitude: number; longitude: number }*/
    {
      ParseGeoPoint._validate(this._latitude, this._longitude);

      return {
        __type: 'GeoPoint',
        latitude: this._latitude,
        longitude: this._longitude
      };
    }
  }, {
    key: "equals",
    value: function (other
    /*: mixed*/
    )
    /*: boolean*/
    {
      return other instanceof ParseGeoPoint && this.latitude === other.latitude && this.longitude === other.longitude;
    }
    /**
     * Returns the distance from this GeoPoint to another in radians.
      * @param {Parse.GeoPoint} point the other Parse.GeoPoint.
     * @return {Number}
     */

  }, {
    key: "radiansTo",
    value: function (point
    /*: ParseGeoPoint*/
    )
    /*: number*/
    {
      var d2r = Math.PI / 180.0;
      var lat1rad = this.latitude * d2r;
      var long1rad = this.longitude * d2r;
      var lat2rad = point.latitude * d2r;
      var long2rad = point.longitude * d2r;
      var sinDeltaLatDiv2 = Math.sin((lat1rad - lat2rad) / 2);
      var sinDeltaLongDiv2 = Math.sin((long1rad - long2rad) / 2); // Square of half the straight line chord distance between both points.

      var a = sinDeltaLatDiv2 * sinDeltaLatDiv2 + Math.cos(lat1rad) * Math.cos(lat2rad) * sinDeltaLongDiv2 * sinDeltaLongDiv2;
      a = Math.min(1.0, a);
      return 2 * Math.asin(Math.sqrt(a));
    }
    /**
     * Returns the distance from this GeoPoint to another in kilometers.
      * @param {Parse.GeoPoint} point the other Parse.GeoPoint.
     * @return {Number}
     */

  }, {
    key: "kilometersTo",
    value: function (point
    /*: ParseGeoPoint*/
    )
    /*: number*/
    {
      return this.radiansTo(point) * 6371.0;
    }
    /**
     * Returns the distance from this GeoPoint to another in miles.
      * @param {Parse.GeoPoint} point the other Parse.GeoPoint.
     * @return {Number}
     */

  }, {
    key: "milesTo",
    value: function (point
    /*: ParseGeoPoint*/
    )
    /*: number*/
    {
      return this.radiansTo(point) * 3958.8;
    }
    /*
     * Throws an exception if the given lat-long is out of bounds.
     */

  }, {
    key: "latitude",
    get: function ()
    /*: number*/
    {
      return this._latitude;
    },
    set: function (val
    /*: number*/
    ) {
      ParseGeoPoint._validate(val, this.longitude);

      this._latitude = val;
    }
    /**
     * East-west portion of the coordinate, in range [-180, 180].
     * Throws if set out of range in a modern browser.
     * @property longitude
     * @type Number
     */

  }, {
    key: "longitude",
    get: function ()
    /*: number*/
    {
      return this._longitude;
    },
    set: function (val
    /*: number*/
    ) {
      ParseGeoPoint._validate(this.latitude, val);

      this._longitude = val;
    }
  }], [{
    key: "_validate",
    value: function (latitude
    /*: number*/
    , longitude
    /*: number*/
    ) {
      if (isNaN(latitude) || isNaN(longitude) || typeof latitude !== 'number' || typeof longitude !== 'number') {
        throw new TypeError('GeoPoint latitude and longitude must be valid numbers');
      }

      if (latitude < -90.0) {
        throw new TypeError('GeoPoint latitude out of bounds: ' + latitude + ' < -90.0.');
      }

      if (latitude > 90.0) {
        throw new TypeError('GeoPoint latitude out of bounds: ' + latitude + ' > 90.0.');
      }

      if (longitude < -180.0) {
        throw new TypeError('GeoPoint longitude out of bounds: ' + longitude + ' < -180.0.');
      }

      if (longitude > 180.0) {
        throw new TypeError('GeoPoint longitude out of bounds: ' + longitude + ' > 180.0.');
      }
    }
    /**
     * Creates a GeoPoint with the user's current location, if available.
     * Calls options.success with a new GeoPoint instance or calls options.error.
     * @static
     */

  }, {
    key: "current",
    value: function () {
      return navigator.geolocation.getCurrentPosition(function (location) {
        return new ParseGeoPoint(location.coords.latitude, location.coords.longitude);
      });
    }
  }]);
  return ParseGeoPoint;
}();

var _default = ParseGeoPoint;
exports.default = _default;
},{"@babel/runtime/helpers/classCallCheck":54,"@babel/runtime/helpers/createClass":56,"@babel/runtime/helpers/defineProperty":57,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/typeof":73}],21:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/inherits"));

var _ParseObject2 = _interopRequireDefault(_dereq_("./ParseObject"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */


var Installation =
/*#__PURE__*/
function (_ParseObject) {
  (0, _inherits2.default)(Installation, _ParseObject);

  function Installation(attributes
  /*: ?AttributeMap*/
  ) {
    var _this;

    (0, _classCallCheck2.default)(this, Installation);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Installation).call(this, '_Installation'));

    if (attributes && (0, _typeof2.default)(attributes) === 'object') {
      if (!_this.set(attributes || {})) {
        throw new Error('Can\'t create an invalid Session');
      }
    }

    return _this;
  }

  return Installation;
}(_ParseObject2.default);

exports.default = Installation;

_ParseObject2.default.registerSubclass('_Installation', Installation);
},{"./ParseObject":23,"@babel/runtime/helpers/classCallCheck":54,"@babel/runtime/helpers/getPrototypeOf":59,"@babel/runtime/helpers/inherits":60,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/possibleConstructorReturn":68,"@babel/runtime/helpers/typeof":73}],22:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(_dereq_("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/asyncToGenerator"));

var _EventEmitter = _interopRequireDefault(_dereq_("./EventEmitter"));

var _LiveQueryClient = _interopRequireDefault(_dereq_("./LiveQueryClient"));

var _CoreManager = _interopRequireDefault(_dereq_("./CoreManager"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */


function getLiveQueryClient()
/*: LiveQueryClient*/
{
  return _CoreManager.default.getLiveQueryController().getDefaultLiveQueryClient();
}
/**
 *
 * We expose three events to help you monitor the status of the WebSocket connection:
 *
 * <p>Open - When we establish the WebSocket connection to the LiveQuery server, you'll get this event.
 *
 * <pre>
 * Parse.LiveQuery.on('open', () => {
 *
 * });</pre></p>
 *
 * <p>Close - When we lose the WebSocket connection to the LiveQuery server, you'll get this event.
 *
 * <pre>
 * Parse.LiveQuery.on('close', () => {
 *
 * });</pre></p>
 *
 * <p>Error - When some network error or LiveQuery server error happens, you'll get this event.
 *
 * <pre>
 * Parse.LiveQuery.on('error', (error) => {
 *
 * });</pre></p>
 *
 * @class Parse.LiveQuery
 * @static
 *
 */


var LiveQuery = new _EventEmitter.default();
/**
 * After open is called, the LiveQuery will try to send a connect request
 * to the LiveQuery server.
 */

LiveQuery.open =
/*#__PURE__*/
(0, _asyncToGenerator2.default)(
/*#__PURE__*/
_regenerator.default.mark(function _callee() {
  var liveQueryClient;
  return _regenerator.default.wrap(function (_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return getLiveQueryClient();

        case 2:
          liveQueryClient = _context.sent;
          return _context.abrupt("return", liveQueryClient.open());

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}));
/**
 * When you're done using LiveQuery, you can call Parse.LiveQuery.close().
 * This function will close the WebSocket connection to the LiveQuery server,
 * cancel the auto reconnect, and unsubscribe all subscriptions based on it.
 * If you call query.subscribe() after this, we'll create a new WebSocket
 * connection to the LiveQuery server.
 */

LiveQuery.close =
/*#__PURE__*/
(0, _asyncToGenerator2.default)(
/*#__PURE__*/
_regenerator.default.mark(function _callee2() {
  var liveQueryClient;
  return _regenerator.default.wrap(function (_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return getLiveQueryClient();

        case 2:
          liveQueryClient = _context2.sent;
          return _context2.abrupt("return", liveQueryClient.close());

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2);
})); // Register a default onError callback to make sure we do not crash on error

LiveQuery.on('error', function () {});
var _default = LiveQuery;
exports.default = _default;
var defaultLiveQueryClient;
var DefaultLiveQueryController = {
  setDefaultLiveQueryClient: function (liveQueryClient
  /*: LiveQueryClient*/
  ) {
    defaultLiveQueryClient = liveQueryClient;
  },
  getDefaultLiveQueryClient: function () {
    var _getDefaultLiveQueryClient = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee3() {
      var currentUser, sessionToken, liveQueryServerURL, serverURL, protocol, host, applicationId, javascriptKey, masterKey;
      return _regenerator.default.wrap(function (_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!defaultLiveQueryClient) {
                _context3.next = 2;
                break;
              }

              return _context3.abrupt("return", defaultLiveQueryClient);

            case 2:
              _context3.next = 4;
              return _CoreManager.default.getUserController().currentUserAsync();

            case 4:
              currentUser = _context3.sent;
              sessionToken = currentUser ? currentUser.getSessionToken() : undefined;
              liveQueryServerURL = _CoreManager.default.get('LIVEQUERY_SERVER_URL');

              if (!(liveQueryServerURL && liveQueryServerURL.indexOf('ws') !== 0)) {
                _context3.next = 9;
                break;
              }

              throw new Error('You need to set a proper Parse LiveQuery server url before using LiveQueryClient');

            case 9:
              // If we can not find Parse.liveQueryServerURL, we try to extract it from Parse.serverURL
              if (!liveQueryServerURL) {
                serverURL = _CoreManager.default.get('SERVER_URL');
                protocol = serverURL.indexOf('https') === 0 ? 'wss://' : 'ws://';
                host = serverURL.replace(/^https?:\/\//, '');
                liveQueryServerURL = protocol + host;

                _CoreManager.default.set('LIVEQUERY_SERVER_URL', liveQueryServerURL);
              }

              applicationId = _CoreManager.default.get('APPLICATION_ID');
              javascriptKey = _CoreManager.default.get('JAVASCRIPT_KEY');
              masterKey = _CoreManager.default.get('MASTER_KEY');
              defaultLiveQueryClient = new _LiveQueryClient.default({
                applicationId: applicationId,
                serverURL: liveQueryServerURL,
                javascriptKey: javascriptKey,
                masterKey: masterKey,
                sessionToken: sessionToken
              });
              defaultLiveQueryClient.on('error', function (error) {
                LiveQuery.emit('error', error);
              });
              defaultLiveQueryClient.on('open', function () {
                LiveQuery.emit('open');
              });
              defaultLiveQueryClient.on('close', function () {
                LiveQuery.emit('close');
              });
              return _context3.abrupt("return", defaultLiveQueryClient);

            case 18:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function () {
      return _getDefaultLiveQueryClient.apply(this, arguments);
    };
  }(),
  _clearCachedDefaultClient: function () {
    defaultLiveQueryClient = null;
  }
};

_CoreManager.default.setLiveQueryController(DefaultLiveQueryController);
},{"./CoreManager":4,"./EventEmitter":5,"./LiveQueryClient":8,"@babel/runtime/helpers/asyncToGenerator":53,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/regenerator":76}],23:[function(_dereq_,module,exports){
"use strict";

var _interopRequireWildcard = _dereq_("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(_dereq_("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/asyncToGenerator"));

var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/defineProperty"));

var _CoreManager = _interopRequireDefault(_dereq_("./CoreManager"));

var _canBeSerialized = _interopRequireDefault(_dereq_("./canBeSerialized"));

var _decode = _interopRequireDefault(_dereq_("./decode"));

var _encode = _interopRequireDefault(_dereq_("./encode"));

var _escape2 = _interopRequireDefault(_dereq_("./escape"));

var _ParseACL = _interopRequireDefault(_dereq_("./ParseACL"));

var _parseDate = _interopRequireDefault(_dereq_("./parseDate"));

var _ParseError = _interopRequireDefault(_dereq_("./ParseError"));

var _ParseFile = _interopRequireDefault(_dereq_("./ParseFile"));

var _promiseUtils = _dereq_("./promiseUtils");

var _LocalDatastoreUtils = _dereq_("./LocalDatastoreUtils");

var _ParseOp = _dereq_("./ParseOp");

var _ParseQuery = _interopRequireDefault(_dereq_("./ParseQuery"));

var _ParseRelation = _interopRequireDefault(_dereq_("./ParseRelation"));

var SingleInstanceStateController = _interopRequireWildcard(_dereq_("./SingleInstanceStateController"));

var _unique = _interopRequireDefault(_dereq_("./unique"));

var UniqueInstanceStateController = _interopRequireWildcard(_dereq_("./UniqueInstanceStateController"));

var _unsavedChildren = _interopRequireDefault(_dereq_("./unsavedChildren"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */


var DEFAULT_BATCH_SIZE = 20; // Mapping of class names to constructors, so we can populate objects from the
// server with appropriate subclasses of ParseObject

var classMap = {}; // Global counter for generating unique local Ids

var localCount = 0; // Global counter for generating unique Ids for non-single-instance objects

var objectCount = 0; // On web clients, objects are single-instance: any two objects with the same Id
// will have the same attributes. However, this may be dangerous default
// behavior in a server scenario

var singleInstance = !_CoreManager.default.get('IS_NODE');

if (singleInstance) {
  _CoreManager.default.setObjectStateController(SingleInstanceStateController);
} else {
  _CoreManager.default.setObjectStateController(UniqueInstanceStateController);
}

function getServerUrlPath() {
  var serverUrl = _CoreManager.default.get('SERVER_URL');

  if (serverUrl[serverUrl.length - 1] !== '/') {
    serverUrl += '/';
  }

  var url = serverUrl.replace(/https?:\/\//, '');
  return url.substr(url.indexOf('/'));
}
/**
 * Creates a new model with defined attributes.
  *
  * <p>You won't normally call this method directly.  It is recommended that
  * you use a subclass of <code>Parse.Object</code> instead, created by calling
  * <code>extend</code>.</p>
  *
  * <p>However, if you don't want to use a subclass, or aren't sure which
  * subclass is appropriate, you can use this form:<pre>
  *     var object = new Parse.Object("ClassName");
  * </pre>
  * That is basically equivalent to:<pre>
  *     var MyClass = Parse.Object.extend("ClassName");
  *     var object = new MyClass();
  * </pre></p>
  *
 * @alias Parse.Object
 */


var ParseObject =
/*#__PURE__*/
function () {
  /**
   * @param {String} className The class name for the object
   * @param {Object} attributes The initial set of data to store in the object.
   * @param {Object} options The options for this object instance.
   */
  function ParseObject(className
  /*: ?string | { className: string, [attr: string]: mixed }*/
  , attributes
  /*:: ?: { [attr: string]: mixed }*/
  , options
  /*:: ?: { ignoreValidation: boolean }*/
  ) {
    (0, _classCallCheck2.default)(this, ParseObject);
    (0, _defineProperty2.default)(this, "id", void 0);
    (0, _defineProperty2.default)(this, "_localId", void 0);
    (0, _defineProperty2.default)(this, "_objCount", void 0);
    (0, _defineProperty2.default)(this, "className", void 0); // Enable legacy initializers

    if (typeof this.initialize === 'function') {
      this.initialize.apply(this, arguments);
    }

    var toSet = null;
    this._objCount = objectCount++;

    if (typeof className === 'string') {
      this.className = className;

      if (attributes && (0, _typeof2.default)(attributes) === 'object') {
        toSet = attributes;
      }
    } else if (className && (0, _typeof2.default)(className) === 'object') {
      this.className = className.className;
      toSet = {};

      for (var _attr in className) {
        if (_attr !== 'className') {
          toSet[_attr] = className[_attr];
        }
      }

      if (attributes && (0, _typeof2.default)(attributes) === 'object') {
        options = attributes;
      }
    }

    if (toSet && !this.set(toSet, options)) {
      throw new Error('Can\'t create an invalid Parse Object');
    }
  }
  /**
   * The ID of this object, unique within its class.
   * @property id
   * @type String
   */


  (0, _createClass2.default)(ParseObject, [{
    key: "_getId",

    /** Private methods **/

    /**
     * Returns a local or server Id used uniquely identify this object
     */
    value: function ()
    /*: string*/
    {
      if (typeof this.id === 'string') {
        return this.id;
      }

      if (typeof this._localId === 'string') {
        return this._localId;
      }

      var localId = 'local' + String(localCount++);
      this._localId = localId;
      return localId;
    }
    /**
     * Returns a unique identifier used to pull data from the State Controller.
     */

  }, {
    key: "_getStateIdentifier",
    value: function ()
    /*: ParseObject | {id: string, className: string}*/
    {
      if (singleInstance) {
        var id = this.id;

        if (!id) {
          id = this._getId();
        }

        return {
          id: id,
          className: this.className
        };
      } else {
        return this;
      }
    }
  }, {
    key: "_getServerData",
    value: function ()
    /*: AttributeMap*/
    {
      var stateController = _CoreManager.default.getObjectStateController();

      return stateController.getServerData(this._getStateIdentifier());
    }
  }, {
    key: "_clearServerData",
    value: function () {
      var serverData = this._getServerData();

      var unset = {};

      for (var _attr2 in serverData) {
        unset[_attr2] = undefined;
      }

      var stateController = _CoreManager.default.getObjectStateController();

      stateController.setServerData(this._getStateIdentifier(), unset);
    }
  }, {
    key: "_getPendingOps",
    value: function ()
    /*: Array<OpsMap>*/
    {
      var stateController = _CoreManager.default.getObjectStateController();

      return stateController.getPendingOps(this._getStateIdentifier());
    }
    /**
     * @param {Array<string>} [keysToClear] - if specified, only ops matching
     * these fields will be cleared
     */

  }, {
    key: "_clearPendingOps",
    value: function (keysToClear
    /*:: ?: Array<string>*/
    ) {
      var pending = this._getPendingOps();

      var latest = pending[pending.length - 1];
      var keys = keysToClear || Object.keys(latest);
      keys.forEach(function (key) {
        delete latest[key];
      });
    }
  }, {
    key: "_getDirtyObjectAttributes",
    value: function ()
    /*: AttributeMap*/
    {
      var attributes = this.attributes;

      var stateController = _CoreManager.default.getObjectStateController();

      var objectCache = stateController.getObjectCache(this._getStateIdentifier());
      var dirty = {};

      for (var _attr3 in attributes) {
        var val = attributes[_attr3];

        if (val && (0, _typeof2.default)(val) === 'object' && !(val instanceof ParseObject) && !(val instanceof _ParseFile.default) && !(val instanceof _ParseRelation.default)) {
          // Due to the way browsers construct maps, the key order will not change
          // unless the object is changed
          try {
            var json = (0, _encode.default)(val, false, true);
            var stringified = JSON.stringify(json);

            if (objectCache[_attr3] !== stringified) {
              dirty[_attr3] = val;
            }
          } catch (e) {
            // Error occurred, possibly by a nested unsaved pointer in a mutable container
            // No matter how it happened, it indicates a change in the attribute
            dirty[_attr3] = val;
          }
        }
      }

      return dirty;
    }
  }, {
    key: "_toFullJSON",
    value: function (seen
    /*:: ?: Array<any>*/
    )
    /*: AttributeMap*/
    {
      var json
      /*: { [key: string]: mixed }*/
      = this.toJSON(seen);
      json.__type = 'Object';
      json.className = this.className;
      return json;
    }
  }, {
    key: "_getSaveJSON",
    value: function ()
    /*: AttributeMap*/
    {
      var pending = this._getPendingOps();

      var dirtyObjects = this._getDirtyObjectAttributes();

      var json = {};

      for (var attr in dirtyObjects) {
        var isDotNotation = false;

        for (var i = 0; i < pending.length; i += 1) {
          for (var field in pending[i]) {
            // Dot notation operations are handled later
            if (field.includes('.')) {
              var fieldName = field.split('.')[0];

              if (fieldName === attr) {
                isDotNotation = true;
                break;
              }
            }
          }
        }

        if (!isDotNotation) {
          json[attr] = new _ParseOp.SetOp(dirtyObjects[attr]).toJSON();
        }
      }

      for (attr in pending[0]) {
        json[attr] = pending[0][attr].toJSON();
      }

      return json;
    }
  }, {
    key: "_getSaveParams",
    value: function ()
    /*: SaveParams*/
    {
      var method = this.id ? 'PUT' : 'POST';

      var body = this._getSaveJSON();

      var path = 'classes/' + this.className;

      if (this.id) {
        path += '/' + this.id;
      } else if (this.className === '_User') {
        path = 'users';
      }

      return {
        method: method,
        body: body,
        path: path
      };
    }
  }, {
    key: "_finishFetch",
    value: function (serverData
    /*: AttributeMap*/
    ) {
      if (!this.id && serverData.objectId) {
        this.id = serverData.objectId;
      }

      var stateController = _CoreManager.default.getObjectStateController();

      stateController.initializeState(this._getStateIdentifier());
      var decoded = {};

      for (var _attr4 in serverData) {
        if (_attr4 === 'ACL') {
          decoded[_attr4] = new _ParseACL.default(serverData[_attr4]);
        } else if (_attr4 !== 'objectId') {
          decoded[_attr4] = (0, _decode.default)(serverData[_attr4]);

          if (decoded[_attr4] instanceof _ParseRelation.default) {
            decoded[_attr4]._ensureParentAndKey(this, _attr4);
          }
        }
      }

      if (decoded.createdAt && typeof decoded.createdAt === 'string') {
        decoded.createdAt = (0, _parseDate.default)(decoded.createdAt);
      }

      if (decoded.updatedAt && typeof decoded.updatedAt === 'string') {
        decoded.updatedAt = (0, _parseDate.default)(decoded.updatedAt);
      }

      if (!decoded.updatedAt && decoded.createdAt) {
        decoded.updatedAt = decoded.createdAt;
      }

      stateController.commitServerChanges(this._getStateIdentifier(), decoded);
    }
  }, {
    key: "_setExisted",
    value: function (existed
    /*: boolean*/
    ) {
      var stateController = _CoreManager.default.getObjectStateController();

      var state = stateController.getState(this._getStateIdentifier());

      if (state) {
        state.existed = existed;
      }
    }
  }, {
    key: "_migrateId",
    value: function (serverId
    /*: string*/
    ) {
      if (this._localId && serverId) {
        if (singleInstance) {
          var stateController = _CoreManager.default.getObjectStateController();

          var oldState = stateController.removeState(this._getStateIdentifier());
          this.id = serverId;
          delete this._localId;

          if (oldState) {
            stateController.initializeState(this._getStateIdentifier(), oldState);
          }
        } else {
          this.id = serverId;
          delete this._localId;
        }
      }
    }
  }, {
    key: "_handleSaveResponse",
    value: function (response
    /*: AttributeMap*/
    , status
    /*: number*/
    ) {
      var changes = {};

      var stateController = _CoreManager.default.getObjectStateController();

      var pending = stateController.popPendingState(this._getStateIdentifier());

      for (var attr in pending) {
        if (pending[attr] instanceof _ParseOp.RelationOp) {
          changes[attr] = pending[attr].applyTo(undefined, this, attr);
        } else if (!(attr in response)) {
          // Only SetOps and UnsetOps should not come back with results
          changes[attr] = pending[attr].applyTo(undefined);
        }
      }

      for (attr in response) {
        if ((attr === 'createdAt' || attr === 'updatedAt') && typeof response[attr] === 'string') {
          changes[attr] = (0, _parseDate.default)(response[attr]);
        } else if (attr === 'ACL') {
          changes[attr] = new _ParseACL.default(response[attr]);
        } else if (attr !== 'objectId') {
          changes[attr] = (0, _decode.default)(response[attr]);

          if (changes[attr] instanceof _ParseOp.UnsetOp) {
            changes[attr] = undefined;
          }
        }
      }

      if (changes.createdAt && !changes.updatedAt) {
        changes.updatedAt = changes.createdAt;
      }

      this._migrateId(response.objectId);

      if (status !== 201) {
        this._setExisted(true);
      }

      stateController.commitServerChanges(this._getStateIdentifier(), changes);
    }
  }, {
    key: "_handleSaveError",
    value: function () {
      var stateController = _CoreManager.default.getObjectStateController();

      stateController.mergeFirstPendingState(this._getStateIdentifier());
    }
    /** Public methods **/

  }, {
    key: "initialize",
    value: function () {} // NOOP

    /**
     * Returns a JSON version of the object suitable for saving to Parse.
     * @return {Object}
     */

  }, {
    key: "toJSON",
    value: function (seen
    /*: Array<any> | void*/
    )
    /*: AttributeMap*/
    {
      var seenEntry = this.id ? this.className + ':' + this.id : this;
      seen = seen || [seenEntry];
      var json = {};
      var attrs = this.attributes;

      for (var _attr5 in attrs) {
        if ((_attr5 === 'createdAt' || _attr5 === 'updatedAt') && attrs[_attr5].toJSON) {
          json[_attr5] = attrs[_attr5].toJSON();
        } else {
          json[_attr5] = (0, _encode.default)(attrs[_attr5], false, false, seen);
        }
      }

      var pending = this._getPendingOps();

      for (var _attr6 in pending[0]) {
        json[_attr6] = pending[0][_attr6].toJSON();
      }

      if (this.id) {
        json.objectId = this.id;
      }

      return json;
    }
    /**
     * Determines whether this ParseObject is equal to another ParseObject
     * @param {Object} other - An other object ot compare
     * @return {Boolean}
     */

  }, {
    key: "equals",
    value: function (other
    /*: mixed*/
    )
    /*: boolean*/
    {
      if (this === other) {
        return true;
      }

      return other instanceof ParseObject && this.className === other.className && this.id === other.id && typeof this.id !== 'undefined';
    }
    /**
     * Returns true if this object has been modified since its last
     * save/refresh.  If an attribute is specified, it returns true only if that
     * particular attribute has been modified since the last save/refresh.
     * @param {String} attr An attribute name (optional).
     * @return {Boolean}
     */

  }, {
    key: "dirty",
    value: function (attr
    /*:: ?: string*/
    )
    /*: boolean*/
    {
      if (!this.id) {
        return true;
      }

      var pendingOps = this._getPendingOps();

      var dirtyObjects = this._getDirtyObjectAttributes();

      if (attr) {
        if (dirtyObjects.hasOwnProperty(attr)) {
          return true;
        }

        for (var i = 0; i < pendingOps.length; i++) {
          if (pendingOps[i].hasOwnProperty(attr)) {
            return true;
          }
        }

        return false;
      }

      if (Object.keys(pendingOps[0]).length !== 0) {
        return true;
      }

      if (Object.keys(dirtyObjects).length !== 0) {
        return true;
      }

      return false;
    }
    /**
     * Returns an array of keys that have been modified since last save/refresh
     * @return {String[]}
     */

  }, {
    key: "dirtyKeys",
    value: function ()
    /*: Array<string>*/
    {
      var pendingOps = this._getPendingOps();

      var keys = {};

      for (var i = 0; i < pendingOps.length; i++) {
        for (var _attr7 in pendingOps[i]) {
          keys[_attr7] = true;
        }
      }

      var dirtyObjects = this._getDirtyObjectAttributes();

      for (var _attr8 in dirtyObjects) {
        keys[_attr8] = true;
      }

      return Object.keys(keys);
    }
    /**
     * Returns true if the object has been fetched.
     * @return {Boolean}
     */

  }, {
    key: "isDataAvailable",
    value: function ()
    /*: boolean*/
    {
      var serverData = this._getServerData();

      return !!Object.keys(serverData).length;
    }
    /**
     * Gets a Pointer referencing this Object.
     * @return {Pointer}
     */

  }, {
    key: "toPointer",
    value: function ()
    /*: Pointer*/
    {
      if (!this.id) {
        throw new Error('Cannot create a pointer to an unsaved ParseObject');
      }

      return {
        __type: 'Pointer',
        className: this.className,
        objectId: this.id
      };
    }
    /**
     * Gets the value of an attribute.
     * @param {String} attr The string name of an attribute.
     */

  }, {
    key: "get",
    value: function (attr
    /*: string*/
    )
    /*: mixed*/
    {
      return this.attributes[attr];
    }
    /**
     * Gets a relation on the given class for the attribute.
     * @param String attr The attribute to get the relation for.
     * @return {Parse.Relation}
     */

  }, {
    key: "relation",
    value: function (attr
    /*: string*/
    )
    /*: ParseRelation*/
    {
      var value = this.get(attr);

      if (value) {
        if (!(value instanceof _ParseRelation.default)) {
          throw new Error('Called relation() on non-relation field ' + attr);
        }

        value._ensureParentAndKey(this, attr);

        return value;
      }

      return new _ParseRelation.default(this, attr);
    }
    /**
     * Gets the HTML-escaped value of an attribute.
     * @param {String} attr The string name of an attribute.
     */

  }, {
    key: "escape",
    value: function (attr
    /*: string*/
    )
    /*: string*/
    {
      var val = this.attributes[attr];

      if (val == null) {
        return '';
      }

      if (typeof val !== 'string') {
        if (typeof val.toString !== 'function') {
          return '';
        }

        val = val.toString();
      }

      return (0, _escape2.default)(val);
    }
    /**
     * Returns <code>true</code> if the attribute contains a value that is not
     * null or undefined.
     * @param {String} attr The string name of the attribute.
     * @return {Boolean}
     */

  }, {
    key: "has",
    value: function (attr
    /*: string*/
    )
    /*: boolean*/
    {
      var attributes = this.attributes;

      if (attributes.hasOwnProperty(attr)) {
        return attributes[attr] != null;
      }

      return false;
    }
    /**
     * Sets a hash of model attributes on the object.
     *
     * <p>You can call it with an object containing keys and values, with one
     * key and value, or dot notation.  For example:<pre>
     *   gameTurn.set({
     *     player: player1,
     *     diceRoll: 2
     *   }, {
     *     error: function(gameTurnAgain, error) {
     *       // The set failed validation.
     *     }
     *   });
     *
     *   game.set("currentPlayer", player2, {
     *     error: function(gameTurnAgain, error) {
     *       // The set failed validation.
     *     }
     *   });
     *
     *   game.set("finished", true);</pre></p>
     *
     *   game.set("player.score", 10);</pre></p>
     *
     * @param {String} key The key to set.
     * @param {} value The value to give it.
     * @param {Object} options A set of options for the set.
     *     The only supported option is <code>error</code>.
     * @return {(ParseObject|Boolean)} true if the set succeeded.
     */

  }, {
    key: "set",
    value: function (key
    /*: mixed*/
    , value
    /*: mixed*/
    , options
    /*:: ?: mixed*/
    )
    /*: ParseObject | boolean*/
    {
      var changes = {};
      var newOps = {};

      if (key && (0, _typeof2.default)(key) === 'object') {
        changes = key;
        options = value;
      } else if (typeof key === 'string') {
        changes[key] = value;
      } else {
        return this;
      }

      options = options || {};
      var readonly = [];

      if (typeof this.constructor.readOnlyAttributes === 'function') {
        readonly = readonly.concat(this.constructor.readOnlyAttributes());
      }

      for (var k in changes) {
        if (k === 'createdAt' || k === 'updatedAt') {
          // This property is read-only, but for legacy reasons we silently
          // ignore it
          continue;
        }

        if (readonly.indexOf(k) > -1) {
          throw new Error('Cannot modify readonly attribute: ' + k);
        }

        if (options.unset) {
          newOps[k] = new _ParseOp.UnsetOp();
        } else if (changes[k] instanceof _ParseOp.Op) {
          newOps[k] = changes[k];
        } else if (changes[k] && (0, _typeof2.default)(changes[k]) === 'object' && typeof changes[k].__op === 'string') {
          newOps[k] = (0, _ParseOp.opFromJSON)(changes[k]);
        } else if (k === 'objectId' || k === 'id') {
          if (typeof changes[k] === 'string') {
            this.id = changes[k];
          }
        } else if (k === 'ACL' && (0, _typeof2.default)(changes[k]) === 'object' && !(changes[k] instanceof _ParseACL.default)) {
          newOps[k] = new _ParseOp.SetOp(new _ParseACL.default(changes[k]));
        } else if (changes[k] instanceof _ParseRelation.default) {
          var relation = new _ParseRelation.default(this, k);
          relation.targetClassName = changes[k].targetClassName;
          newOps[k] = new _ParseOp.SetOp(relation);
        } else {
          newOps[k] = new _ParseOp.SetOp(changes[k]);
        }
      }

      var currentAttributes = this.attributes; // Only set nested fields if exists

      var serverData = this._getServerData();

      if (typeof key === 'string' && key.includes('.')) {
        var field = key.split('.')[0];

        if (!serverData[field]) {
          return this;
        }
      } // Calculate new values


      var newValues = {};

      for (var _attr9 in newOps) {
        if (newOps[_attr9] instanceof _ParseOp.RelationOp) {
          newValues[_attr9] = newOps[_attr9].applyTo(currentAttributes[_attr9], this, _attr9);
        } else if (!(newOps[_attr9] instanceof _ParseOp.UnsetOp)) {
          newValues[_attr9] = newOps[_attr9].applyTo(currentAttributes[_attr9]);
        }
      } // Validate changes


      if (!options.ignoreValidation) {
        var validation = this.validate(newValues);

        if (validation) {
          if (typeof options.error === 'function') {
            options.error(this, validation);
          }

          return false;
        }
      } // Consolidate Ops


      var pendingOps = this._getPendingOps();

      var last = pendingOps.length - 1;

      var stateController = _CoreManager.default.getObjectStateController();

      for (var _attr10 in newOps) {
        var nextOp = newOps[_attr10].mergeWith(pendingOps[last][_attr10]);

        stateController.setPendingOp(this._getStateIdentifier(), _attr10, nextOp);
      }

      return this;
    }
    /**
     * Remove an attribute from the model. This is a noop if the attribute doesn't
     * exist.
     * @param {String} attr The string name of an attribute.
     * @return {(ParseObject|Boolean)}
     */

  }, {
    key: "unset",
    value: function (attr
    /*: string*/
    , options
    /*:: ?: { [opt: string]: mixed }*/
    )
    /*: ParseObject | boolean*/
    {
      options = options || {};
      options.unset = true;
      return this.set(attr, null, options);
    }
    /**
     * Atomically increments the value of the given attribute the next time the
     * object is saved. If no amount is specified, 1 is used by default.
     *
     * @param attr {String} The key.
     * @param amount {Number} The amount to increment by (optional).
     * @return {(ParseObject|Boolean)}
     */

  }, {
    key: "increment",
    value: function (attr
    /*: string*/
    , amount
    /*:: ?: number*/
    )
    /*: ParseObject | boolean*/
    {
      if (typeof amount === 'undefined') {
        amount = 1;
      }

      if (typeof amount !== 'number') {
        throw new Error('Cannot increment by a non-numeric amount.');
      }

      return this.set(attr, new _ParseOp.IncrementOp(amount));
    }
    /**
     * Atomically add an object to the end of the array associated with a given
     * key.
     * @param attr {String} The key.
     * @param item {} The item to add.
     * @return {(ParseObject|Boolean)}
     */

  }, {
    key: "add",
    value: function (attr
    /*: string*/
    , item
    /*: mixed*/
    )
    /*: ParseObject | boolean*/
    {
      return this.set(attr, new _ParseOp.AddOp([item]));
    }
    /**
     * Atomically add the objects to the end of the array associated with a given
     * key.
     * @param attr {String} The key.
     * @param items {Object[]} The items to add.
     * @return {(ParseObject|Boolean)}
     */

  }, {
    key: "addAll",
    value: function (attr
    /*: string*/
    , items
    /*: Array<mixed>*/
    )
    /*: ParseObject | boolean*/
    {
      return this.set(attr, new _ParseOp.AddOp(items));
    }
    /**
     * Atomically add an object to the array associated with a given key, only
     * if it is not already present in the array. The position of the insert is
     * not guaranteed.
     *
     * @param attr {String} The key.
     * @param item {} The object to add.
     * @return {(ParseObject|Boolean)}
     */

  }, {
    key: "addUnique",
    value: function (attr
    /*: string*/
    , item
    /*: mixed*/
    )
    /*: ParseObject | boolean*/
    {
      return this.set(attr, new _ParseOp.AddUniqueOp([item]));
    }
    /**
     * Atomically add the objects to the array associated with a given key, only
     * if it is not already present in the array. The position of the insert is
     * not guaranteed.
     *
     * @param attr {String} The key.
     * @param items {Object[]} The objects to add.
     * @return {(ParseObject|Boolean)}
     */

  }, {
    key: "addAllUnique",
    value: function (attr
    /*: string*/
    , items
    /*: Array<mixed>*/
    )
    /*: ParseObject | boolean*/
    {
      return this.set(attr, new _ParseOp.AddUniqueOp(items));
    }
    /**
     * Atomically remove all instances of an object from the array associated
     * with a given key.
     *
     * @param attr {String} The key.
     * @param item {} The object to remove.
     * @return {(ParseObject|Boolean)}
     */

  }, {
    key: "remove",
    value: function (attr
    /*: string*/
    , item
    /*: mixed*/
    )
    /*: ParseObject | boolean*/
    {
      return this.set(attr, new _ParseOp.RemoveOp([item]));
    }
    /**
     * Atomically remove all instances of the objects from the array associated
     * with a given key.
     *
     * @param attr {String} The key.
     * @param items {Object[]} The object to remove.
     * @return {(ParseObject|Boolean)}
     */

  }, {
    key: "removeAll",
    value: function (attr
    /*: string*/
    , items
    /*: Array<mixed>*/
    )
    /*: ParseObject | boolean*/
    {
      return this.set(attr, new _ParseOp.RemoveOp(items));
    }
    /**
     * Returns an instance of a subclass of Parse.Op describing what kind of
     * modification has been performed on this field since the last time it was
     * saved. For example, after calling object.increment("x"), calling
     * object.op("x") would return an instance of Parse.Op.Increment.
     *
     * @param attr {String} The key.
     * @returns {Parse.Op} The operation, or undefined if none.
     */

  }, {
    key: "op",
    value: function (attr
    /*: string*/
    )
    /*: ?Op*/
    {
      var pending = this._getPendingOps();

      for (var i = pending.length; i--;) {
        if (pending[i][attr]) {
          return pending[i][attr];
        }
      }
    }
    /**
     * Creates a new model with identical attributes to this one.
     * @return {Parse.Object}
     */

  }, {
    key: "clone",
    value: function clone()
    /*: any*/
    {
      var clone = new this.constructor();

      if (!clone.className) {
        clone.className = this.className;
      }

      var attributes = this.attributes;

      if (typeof this.constructor.readOnlyAttributes === 'function') {
        var readonly = this.constructor.readOnlyAttributes() || []; // Attributes are frozen, so we have to rebuild an object,
        // rather than delete readonly keys

        var copy = {};

        for (var a in attributes) {
          if (readonly.indexOf(a) < 0) {
            copy[a] = attributes[a];
          }
        }

        attributes = copy;
      }

      if (clone.set) {
        clone.set(attributes);
      }

      return clone;
    }
    /**
     * Creates a new instance of this object. Not to be confused with clone()
     * @return {Parse.Object}
     */

  }, {
    key: "newInstance",
    value: function ()
    /*: any*/
    {
      var clone = new this.constructor();

      if (!clone.className) {
        clone.className = this.className;
      }

      clone.id = this.id;

      if (singleInstance) {
        // Just return an object with the right id
        return clone;
      }

      var stateController = _CoreManager.default.getObjectStateController();

      if (stateController) {
        stateController.duplicateState(this._getStateIdentifier(), clone._getStateIdentifier());
      }

      return clone;
    }
    /**
     * Returns true if this object has never been saved to Parse.
     * @return {Boolean}
     */

  }, {
    key: "isNew",
    value: function ()
    /*: boolean*/
    {
      return !this.id;
    }
    /**
     * Returns true if this object was created by the Parse server when the
     * object might have already been there (e.g. in the case of a Facebook
     * login)
     * @return {Boolean}
     */

  }, {
    key: "existed",
    value: function ()
    /*: boolean*/
    {
      if (!this.id) {
        return false;
      }

      var stateController = _CoreManager.default.getObjectStateController();

      var state = stateController.getState(this._getStateIdentifier());

      if (state) {
        return state.existed;
      }

      return false;
    }
    /**
     * Checks if the model is currently in a valid state.
     * @return {Boolean}
     */

  }, {
    key: "isValid",
    value: function ()
    /*: boolean*/
    {
      return !this.validate(this.attributes);
    }
    /**
     * You should not call this function directly unless you subclass
     * <code>Parse.Object</code>, in which case you can override this method
     * to provide additional validation on <code>set</code> and
     * <code>save</code>.  Your implementation should return
     *
     * @param {Object} attrs The current data to validate.
     * @return {} False if the data is valid.  An error object otherwise.
     * @see Parse.Object#set
     */

  }, {
    key: "validate",
    value: function (attrs
    /*: AttributeMap*/
    )
    /*: ParseError | boolean*/
    {
      if (attrs.hasOwnProperty('ACL') && !(attrs.ACL instanceof _ParseACL.default)) {
        return new _ParseError.default(_ParseError.default.OTHER_CAUSE, 'ACL must be a Parse ACL.');
      }

      for (var _key in attrs) {
        if (!/^[A-Za-z][0-9A-Za-z_.]*$/.test(_key)) {
          return new _ParseError.default(_ParseError.default.INVALID_KEY_NAME);
        }
      }

      return false;
    }
    /**
     * Returns the ACL for this object.
     * @returns {Parse.ACL} An instance of Parse.ACL.
     * @see Parse.Object#get
     */

  }, {
    key: "getACL",
    value: function ()
    /*: ?ParseACL*/
    {
      var acl = this.get('ACL');

      if (acl instanceof _ParseACL.default) {
        return acl;
      }

      return null;
    }
    /**
     * Sets the ACL to be used for this object.
     * @param {Parse.ACL} acl An instance of Parse.ACL.
     * @param {Object} options
     * @return {(ParseObject|Boolean)} Whether the set passed validation.
     * @see Parse.Object#set
     */

  }, {
    key: "setACL",
    value: function (acl
    /*: ParseACL*/
    , options
    /*:: ?: mixed*/
    )
    /*: ParseObject | boolean*/
    {
      return this.set('ACL', acl, options);
    }
    /**
     * Clears any (or specific) changes to this object made since the last call to save()
     * @param {string} [keys] - specify which fields to revert
     */

  }, {
    key: "revert",
    value: function ()
    /*: void*/
    {
      var keysToRevert;

      for (var _len = arguments.length, keys = new Array(_len), _key2 = 0; _key2 < _len; _key2++) {
        keys[_key2] = arguments[_key2];
      }

      if (keys.length) {
        keysToRevert = [];

        for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
          var _key3 = _keys[_i];

          if (typeof _key3 === "string") {
            keysToRevert.push(_key3);
          } else {
            throw new Error("Parse.Object#revert expects either no, or a list of string, arguments.");
          }
        }
      }

      this._clearPendingOps(keysToRevert);
    }
    /**
     * Clears all attributes on a model
     * @return {(ParseObject | boolean)}
     */

  }, {
    key: "clear",
    value: function ()
    /*: ParseObject | boolean*/
    {
      var attributes = this.attributes;
      var erasable = {};
      var readonly = ['createdAt', 'updatedAt'];

      if (typeof this.constructor.readOnlyAttributes === 'function') {
        readonly = readonly.concat(this.constructor.readOnlyAttributes());
      }

      for (var _attr11 in attributes) {
        if (readonly.indexOf(_attr11) < 0) {
          erasable[_attr11] = true;
        }
      }

      return this.set(erasable, {
        unset: true
      });
    }
    /**
     * Fetch the model from the server. If the server's representation of the
     * model differs from its current attributes, they will be overriden.
     *
     * @param {Object} options
     * Valid options are:<ul>
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     *   <li>include: The name(s) of the key(s) to include. Can be a string, an array of strings,
     *       or an array of array of strings.
     * </ul>
     * @return {Promise} A promise that is fulfilled when the fetch
     *     completes.
     */

  }, {
    key: "fetch",
    value: function (options
    /*: RequestOptions*/
    )
    /*: Promise*/
    {
      options = options || {};
      var fetchOptions = {};

      if (options.hasOwnProperty('useMasterKey')) {
        fetchOptions.useMasterKey = options.useMasterKey;
      }

      if (options.hasOwnProperty('sessionToken')) {
        fetchOptions.sessionToken = options.sessionToken;
      }

      if (options.hasOwnProperty('include')) {
        fetchOptions.include = [];

        if (Array.isArray(options.include)) {
          options.include.forEach(function (key) {
            if (Array.isArray(key)) {
              fetchOptions.include = fetchOptions.include.concat(key);
            } else {
              fetchOptions.include.push(key);
            }
          });
        } else {
          fetchOptions.include.push(options.include);
        }
      }

      var controller = _CoreManager.default.getObjectController();

      return controller.fetch(this, true, fetchOptions);
    }
    /**
     * Fetch the model from the server. If the server's representation of the
     * model differs from its current attributes, they will be overriden.
     *
     * Includes nested Parse.Objects for the provided key. You can use dot
     * notation to specify which fields in the included object are also fetched.
     *
     * @param {String|Array<string|Array<string>>} keys The name(s) of the key(s) to include.
     * @param {Object} options
     * Valid options are:<ul>
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     * @return {Promise} A promise that is fulfilled when the fetch
     *     completes.
     */

  }, {
    key: "fetchWithInclude",
    value: function (keys
    /*: String|Array<string|Array<string>>*/
    , options
    /*: RequestOptions*/
    )
    /*: Promise*/
    {
      options = options || {};
      options.include = keys;
      return this.fetch(options);
    }
    /**
     * Set a hash of model attributes, and save the model to the server.
     * updatedAt will be updated when the request returns.
     * You can either call it as:<pre>
     *   object.save();</pre>
     * or<pre>
     *   object.save(attrs);</pre>
     * or<pre>
     *   object.save(null, options);</pre>
     * or<pre>
     *   object.save(attrs, options);</pre>
     * or<pre>
     *   object.save(key, value, options);</pre>
     *
     * For example, <pre>
     *   gameTurn.save({
     *     player: "Jake Cutter",
     *     diceRoll: 2
     *   }).then(function(gameTurnAgain) {
     *     // The save was successful.
     *   }, function(error) {
     *     // The save failed.  Error is an instance of Parse.Error.
     *   });</pre>
     *
     * @param {String|Object|null} [attrs]
     * Valid options are:<ul>
     *   <li>`Object` - Key/value pairs to update on the object.</li>
     *   <li>`String` Key - Key of attribute to update (requires arg2 to also be string)</li>
     *   <li>`null` - Passing null for arg1 allows you to save the object with options passed in arg2.</li>
     * </ul>
     *
     * @param {String|Object} [options]
     * <ul>
     *   <li>`String` Value - If arg1 was passed as a key, arg2 is the value that should be set on that key.</li>
     *   <li>`Object` Options - Valid options are:
     *     <ul>
     *       <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *       <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     *     </ul>
     *   </li>
     * </ul>
     *
     * @param {Object} [options]
     * Used to pass option parameters to method if arg1 and arg2 were both passed as strings.
     * Valid options are:
     * <ul>
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *       be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     *
     * @return {Promise} A promise that is fulfilled when the save
     *     completes.
     */

  }, {
    key: "save",
    value: function (arg1
    /*: ?string | { [attr: string]: mixed }*/
    , arg2
    /*: FullOptions | mixed*/
    , arg3
    /*:: ?: FullOptions*/
    )
    /*: Promise*/
    {
      var _this = this;

      var attrs;
      var options;

      if ((0, _typeof2.default)(arg1) === 'object' || typeof arg1 === 'undefined') {
        attrs = arg1;

        if ((0, _typeof2.default)(arg2) === 'object') {
          options = arg2;
        }
      } else {
        attrs = {};
        attrs[arg1] = arg2;
        options = arg3;
      } // TODO: safely remove me
      // Support save({ success: function() {}, error: function() {} })


      if (!options && attrs) {
        options = {};

        if (typeof attrs.success === 'function') {
          options.success = attrs.success;
          delete attrs.success;
        }

        if (typeof attrs.error === 'function') {
          options.error = attrs.error;
          delete attrs.error;
        }
      }

      if (attrs) {
        var validation = this.validate(attrs);

        if (validation) {
          if (options && typeof options.error === 'function') {
            options.error(this, validation);
          }

          return Promise.reject(validation);
        }

        this.set(attrs, options);
      }

      options = options || {};
      var saveOptions = {};

      if (options.hasOwnProperty('useMasterKey')) {
        saveOptions.useMasterKey = !!options.useMasterKey;
      }

      if (options.hasOwnProperty('sessionToken') && typeof options.sessionToken === 'string') {
        saveOptions.sessionToken = options.sessionToken;
      }

      var controller = _CoreManager.default.getObjectController();

      var unsaved = (0, _unsavedChildren.default)(this);
      return controller.save(unsaved, saveOptions).then(function () {
        return controller.save(_this, saveOptions);
      });
    }
    /**
     * Destroy this model on the server if it was already persisted.
     *
     * @param {Object} options
     * Valid options are:<ul>
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     * @return {Promise} A promise that is fulfilled when the destroy
     *     completes.
     */

  }, {
    key: "destroy",
    value: function (options
    /*: RequestOptions*/
    )
    /*: Promise*/
    {
      options = options || {};
      var destroyOptions = {};

      if (options.hasOwnProperty('useMasterKey')) {
        destroyOptions.useMasterKey = options.useMasterKey;
      }

      if (options.hasOwnProperty('sessionToken')) {
        destroyOptions.sessionToken = options.sessionToken;
      }

      if (!this.id) {
        return Promise.resolve();
      }

      return _CoreManager.default.getObjectController().destroy(this, destroyOptions);
    }
    /**
     * Asynchronously stores the object and every object it points to in the local datastore,
     * recursively, using a default pin name: _default.
     *
     * If those other objects have not been fetched from Parse, they will not be stored.
     * However, if they have changed data, all the changes will be retained.
     *
     * <pre>
     * await object.pin();
     * </pre>
     *
     * To retrieve object:
     * <code>query.fromLocalDatastore()</code> or <code>query.fromPin()</code>
     *
     * @return {Promise} A promise that is fulfilled when the pin completes.
     */

  }, {
    key: "pin",
    value: function ()
    /*: Promise<void>*/
    {
      return ParseObject.pinAllWithName(_LocalDatastoreUtils.DEFAULT_PIN, [this]);
    }
    /**
     * Asynchronously removes the object and every object it points to in the local datastore,
     * recursively, using a default pin name: _default.
     *
     * <pre>
     * await object.unPin();
     * </pre>
     *
     * @return {Promise} A promise that is fulfilled when the unPin completes.
     */

  }, {
    key: "unPin",
    value: function ()
    /*: Promise<void>*/
    {
      return ParseObject.unPinAllWithName(_LocalDatastoreUtils.DEFAULT_PIN, [this]);
    }
    /**
     * Asynchronously returns if the object is pinned
     *
     * <pre>
     * const isPinned = await object.isPinned();
     * </pre>
     *
     * @return {Promise<boolean>} A boolean promise that is fulfilled if object is pinned.
     */

  }, {
    key: "isPinned",
    value: function () {
      var _isPinned = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        var localDatastore, objectKey, pin;
        return _regenerator.default.wrap(function (_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                localDatastore = _CoreManager.default.getLocalDatastore();

                if (localDatastore.isEnabled) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return", Promise.reject('Parse.enableLocalDatastore() must be called first'));

              case 3:
                objectKey = localDatastore.getKeyForObject(this);
                _context.next = 6;
                return localDatastore.fromPinWithName(objectKey);

              case 6:
                pin = _context.sent;
                return _context.abrupt("return", pin.length > 0);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function () {
        return _isPinned.apply(this, arguments);
      };
    }()
    /**
     * Asynchronously stores the objects and every object they point to in the local datastore, recursively.
     *
     * If those other objects have not been fetched from Parse, they will not be stored.
     * However, if they have changed data, all the changes will be retained.
     *
     * <pre>
     * await object.pinWithName(name);
     * </pre>
     *
     * To retrieve object:
     * <code>query.fromLocalDatastore()</code> or <code>query.fromPinWithName(name)</code>
     *
     * @param {String} name Name of Pin.
     * @return {Promise} A promise that is fulfilled when the pin completes.
     */

  }, {
    key: "pinWithName",
    value: function (name
    /*: string*/
    )
    /*: Promise<void>*/
    {
      return ParseObject.pinAllWithName(name, [this]);
    }
    /**
     * Asynchronously removes the object and every object it points to in the local datastore, recursively.
     *
     * <pre>
     * await object.unPinWithName(name);
     * </pre>
     *
     * @param {String} name Name of Pin.
     * @return {Promise} A promise that is fulfilled when the unPin completes.
     */

  }, {
    key: "unPinWithName",
    value: function (name
    /*: string*/
    )
    /*: Promise<void>*/
    {
      return ParseObject.unPinAllWithName(name, [this]);
    }
    /**
     * Asynchronously loads data from the local datastore into this object.
     *
     * <pre>
     * await object.fetchFromLocalDatastore();
     * </pre>
     *
     * You can create an unfetched pointer with <code>Parse.Object.createWithoutData()</code>
     * and then call <code>fetchFromLocalDatastore()</code> on it.
     *
     * @return {Promise} A promise that is fulfilled when the fetch completes.
     */

  }, {
    key: "fetchFromLocalDatastore",
    value: function () {
      var _fetchFromLocalDatastore = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2() {
        var localDatastore, objectKey, pinned, result;
        return _regenerator.default.wrap(function (_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                localDatastore = _CoreManager.default.getLocalDatastore();

                if (localDatastore.isEnabled) {
                  _context2.next = 3;
                  break;
                }

                throw new Error('Parse.enableLocalDatastore() must be called first');

              case 3:
                objectKey = localDatastore.getKeyForObject(this);
                _context2.next = 6;
                return localDatastore._serializeObject(objectKey);

              case 6:
                pinned = _context2.sent;

                if (pinned) {
                  _context2.next = 9;
                  break;
                }

                throw new Error('Cannot fetch an unsaved ParseObject');

              case 9:
                result = ParseObject.fromJSON(pinned);

                this._finishFetch(result.toJSON());

                return _context2.abrupt("return", this);

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function () {
        return _fetchFromLocalDatastore.apply(this, arguments);
      };
    }()
    /** Static methods **/

  }, {
    key: "attributes",

    /** Prototype getters / setters **/
    get: function ()
    /*: AttributeMap*/
    {
      var stateController = _CoreManager.default.getObjectStateController();

      return Object.freeze(stateController.estimateAttributes(this._getStateIdentifier()));
    }
    /**
     * The first time this object was saved on the server.
     * @property createdAt
     * @type Date
     */

  }, {
    key: "createdAt",
    get: function ()
    /*: ?Date*/
    {
      return this._getServerData().createdAt;
    }
    /**
     * The last time this object was updated on the server.
     * @property updatedAt
     * @type Date
     */

  }, {
    key: "updatedAt",
    get: function ()
    /*: ?Date*/
    {
      return this._getServerData().updatedAt;
    }
  }], [{
    key: "_clearAllState",
    value: function () {
      var stateController = _CoreManager.default.getObjectStateController();

      stateController.clearAllState();
    }
    /**
     * Fetches the given list of Parse.Object.
     * If any error is encountered, stops and calls the error handler.
     *
     * <pre>
     *   Parse.Object.fetchAll([object1, object2, ...])
     *    .then((list) => {
     *      // All the objects were fetched.
     *    }, (error) => {
     *      // An error occurred while fetching one of the objects.
     *    });
     * </pre>
     *
     * @param {Array} list A list of <code>Parse.Object</code>.
     * @param {Object} options
     * Valid options are:<ul>
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     *   <li>include: The name(s) of the key(s) to include. Can be a string, an array of strings,
     *       or an array of array of strings.
     * </ul>
     * @static
     */

  }, {
    key: "fetchAll",
    value: function (list
    /*: Array<ParseObject>*/
    ) {
      var options
      /*: RequestOptions*/
      = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var queryOptions = {};

      if (options.hasOwnProperty('useMasterKey')) {
        queryOptions.useMasterKey = options.useMasterKey;
      }

      if (options.hasOwnProperty('sessionToken')) {
        queryOptions.sessionToken = options.sessionToken;
      }

      if (options.hasOwnProperty('include')) {
        queryOptions.include = [];

        if (Array.isArray(options.include)) {
          options.include.forEach(function (key) {
            if (Array.isArray(key)) {
              queryOptions.include = queryOptions.include.concat(key);
            } else {
              queryOptions.include.push(key);
            }
          });
        } else {
          queryOptions.include.push(options.include);
        }
      }

      return _CoreManager.default.getObjectController().fetch(list, true, queryOptions);
    }
    /**
     * Fetches the given list of Parse.Object.
     *
     * Includes nested Parse.Objects for the provided key. You can use dot
     * notation to specify which fields in the included object are also fetched.
     *
     * If any error is encountered, stops and calls the error handler.
     *
     * <pre>
     *   Parse.Object.fetchAllWithInclude([object1, object2, ...], [pointer1, pointer2, ...])
     *    .then((list) => {
     *      // All the objects were fetched.
     *    }, (error) => {
     *      // An error occurred while fetching one of the objects.
     *    });
     * </pre>
     *
     * @param {Array} list A list of <code>Parse.Object</code>.
     * @param {String|Array<string|Array<string>>} keys The name(s) of the key(s) to include.
     * @param {Object} options
     * Valid options are:<ul>
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     * @static
     */

  }, {
    key: "fetchAllWithInclude",
    value: function (list
    /*: Array<ParseObject>*/
    , keys
    /*: String|Array<string|Array<string>>*/
    , options
    /*: RequestOptions*/
    ) {
      options = options || {};
      options.include = keys;
      return ParseObject.fetchAll(list, options);
    }
    /**
     * Fetches the given list of Parse.Object if needed.
     * If any error is encountered, stops and calls the error handler.
     *
     * <pre>
     *   Parse.Object.fetchAllIfNeeded([object1, ...])
     *    .then((list) => {
     *      // Objects were fetched and updated.
     *    }, (error) => {
     *      // An error occurred while fetching one of the objects.
     *    });
     * </pre>
     *
     * @param {Array} list A list of <code>Parse.Object</code>.
     * @param {Object} options
     * @static
     */

  }, {
    key: "fetchAllIfNeeded",
    value: function (list
    /*: Array<ParseObject>*/
    , options) {
      options = options || {};
      var queryOptions = {};

      if (options.hasOwnProperty('useMasterKey')) {
        queryOptions.useMasterKey = options.useMasterKey;
      }

      if (options.hasOwnProperty('sessionToken')) {
        queryOptions.sessionToken = options.sessionToken;
      }

      return _CoreManager.default.getObjectController().fetch(list, false, queryOptions);
    }
    /**
     * Destroy the given list of models on the server if it was already persisted.
     *
     * <p>Unlike saveAll, if an error occurs while deleting an individual model,
     * this method will continue trying to delete the rest of the models if
     * possible, except in the case of a fatal error like a connection error.
     *
     * <p>In particular, the Parse.Error object returned in the case of error may
     * be one of two types:
     *
     * <ul>
     *   <li>A Parse.Error.AGGREGATE_ERROR. This object's "errors" property is an
     *       array of other Parse.Error objects. Each error object in this array
     *       has an "object" property that references the object that could not be
     *       deleted (for instance, because that object could not be found).</li>
     *   <li>A non-aggregate Parse.Error. This indicates a serious error that
     *       caused the delete operation to be aborted partway through (for
     *       instance, a connection failure in the middle of the delete).</li>
     * </ul>
     *
     * <pre>
     *   Parse.Object.destroyAll([object1, object2, ...])
     *    .then((list) => {
     *      // All the objects were deleted.
     *    }, (error) => {
     *      // An error occurred while deleting one or more of the objects.
     *      // If this is an aggregate error, then we can inspect each error
     *      // object individually to determine the reason why a particular
     *      // object was not deleted.
     *      if (error.code === Parse.Error.AGGREGATE_ERROR) {
     *        for (var i = 0; i < error.errors.length; i++) {
     *          console.log("Couldn't delete " + error.errors[i].object.id +
     *            "due to " + error.errors[i].message);
     *        }
     *      } else {
     *        console.log("Delete aborted because of " + error.message);
     *      }
     *   });
     * </pre>
     *
     * @param {Array} list A list of <code>Parse.Object</code>.
     * @param {Object} options
     * @static
     * Valid options are:<ul>
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     *   <li>batchSize: Number of objects to process per request
     * </ul>
     * @return {Promise} A promise that is fulfilled when the destroyAll
     *     completes.
     */

  }, {
    key: "destroyAll",
    value: function (list
    /*: Array<ParseObject>*/
    ) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var destroyOptions = {};

      if (options.hasOwnProperty('useMasterKey')) {
        destroyOptions.useMasterKey = options.useMasterKey;
      }

      if (options.hasOwnProperty('sessionToken')) {
        destroyOptions.sessionToken = options.sessionToken;
      }

      if (options.hasOwnProperty('batchSize') && typeof options.batchSize === 'number') {
        destroyOptions.batchSize = options.batchSize;
      }

      return _CoreManager.default.getObjectController().destroy(list, destroyOptions);
    }
    /**
     * Saves the given list of Parse.Object.
     * If any error is encountered, stops and calls the error handler.
     *
     * <pre>
     *   Parse.Object.saveAll([object1, object2, ...])
     *    .then((list) => {
     *       // All the objects were saved.
     *    }, (error) => {
     *       // An error occurred while saving one of the objects.
     *    });
     * </pre>
     *
     * @param {Array} list A list of <code>Parse.Object</code>.
     * @param {Object} options
     * @static
     * Valid options are:<ul>
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     *   <li>batchSize: Number of objects to process per request
     * </ul>
     */

  }, {
    key: "saveAll",
    value: function (list
    /*: Array<ParseObject>*/
    ) {
      var options
      /*: RequestOptions*/
      = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var saveOptions = {};

      if (options.hasOwnProperty('useMasterKey')) {
        saveOptions.useMasterKey = options.useMasterKey;
      }

      if (options.hasOwnProperty('sessionToken')) {
        saveOptions.sessionToken = options.sessionToken;
      }

      if (options.hasOwnProperty('batchSize') && typeof options.batchSize === 'number') {
        saveOptions.batchSize = options.batchSize;
      }

      return _CoreManager.default.getObjectController().save(list, saveOptions);
    }
    /**
     * Creates a reference to a subclass of Parse.Object with the given id. This
     * does not exist on Parse.Object, only on subclasses.
     *
     * <p>A shortcut for: <pre>
     *  var Foo = Parse.Object.extend("Foo");
     *  var pointerToFoo = new Foo();
     *  pointerToFoo.id = "myObjectId";
     * </pre>
     *
     * @param {String} id The ID of the object to create a reference to.
     * @static
     * @return {Parse.Object} A Parse.Object reference.
     */

  }, {
    key: "createWithoutData",
    value: function (id
    /*: string*/
    ) {
      var obj = new this();
      obj.id = id;
      return obj;
    }
    /**
     * Creates a new instance of a Parse Object from a JSON representation.
     * @param {Object} json The JSON map of the Object's data
     * @param {boolean} override In single instance mode, all old server data
     *   is overwritten if this is set to true
     * @static
     * @return {Parse.Object} A Parse.Object reference
     */

  }, {
    key: "fromJSON",
    value: function (json
    /*: any*/
    , override
    /*:: ?: boolean*/
    ) {
      if (!json.className) {
        throw new Error('Cannot create an object without a className');
      }

      var constructor = classMap[json.className];
      var o = constructor ? new constructor() : new ParseObject(json.className);
      var otherAttributes = {};

      for (var _attr12 in json) {
        if (_attr12 !== 'className' && _attr12 !== '__type') {
          otherAttributes[_attr12] = json[_attr12];
        }
      }

      if (override) {
        // id needs to be set before clearServerData can work
        if (otherAttributes.objectId) {
          o.id = otherAttributes.objectId;
        }

        var preserved = null;

        if (typeof o._preserveFieldsOnFetch === 'function') {
          preserved = o._preserveFieldsOnFetch();
        }

        o._clearServerData();

        if (preserved) {
          o._finishFetch(preserved);
        }
      }

      o._finishFetch(otherAttributes);

      if (json.objectId) {
        o._setExisted(true);
      }

      return o;
    }
    /**
     * Registers a subclass of Parse.Object with a specific class name.
     * When objects of that class are retrieved from a query, they will be
     * instantiated with this subclass.
     * This is only necessary when using ES6 subclassing.
     * @param {String} className The class name of the subclass
     * @param {Class} constructor The subclass
     */

  }, {
    key: "registerSubclass",
    value: function (className
    /*: string*/
    , constructor
    /*: any*/
    ) {
      if (typeof className !== 'string') {
        throw new TypeError('The first argument must be a valid class name.');
      }

      if (typeof constructor === 'undefined') {
        throw new TypeError('You must supply a subclass constructor.');
      }

      if (typeof constructor !== 'function') {
        throw new TypeError('You must register the subclass constructor. ' + 'Did you attempt to register an instance of the subclass?');
      }

      classMap[className] = constructor;

      if (!constructor.className) {
        constructor.className = className;
      }
    }
    /**
     * Creates a new subclass of Parse.Object for the given Parse class name.
     *
     * <p>Every extension of a Parse class will inherit from the most recent
     * previous extension of that class. When a Parse.Object is automatically
     * created by parsing JSON, it will use the most recent extension of that
     * class.</p>
     *
     * <p>You should call either:<pre>
     *     var MyClass = Parse.Object.extend("MyClass", {
     *         <i>Instance methods</i>,
     *         initialize: function(attrs, options) {
     *             this.someInstanceProperty = [],
     *             <i>Other instance properties</i>
     *         }
     *     }, {
     *         <i>Class properties</i>
     *     });</pre>
     * or, for Backbone compatibility:<pre>
     *     var MyClass = Parse.Object.extend({
     *         className: "MyClass",
     *         <i>Instance methods</i>,
     *         initialize: function(attrs, options) {
     *             this.someInstanceProperty = [],
     *             <i>Other instance properties</i>
     *         }
     *     }, {
     *         <i>Class properties</i>
     *     });</pre></p>
     *
     * @param {String} className The name of the Parse class backing this model.
     * @param {Object} protoProps Instance properties to add to instances of the
     *     class returned from this method.
     * @param {Object} classProps Class properties to add the class returned from
     *     this method.
     * @return {Class} A new subclass of Parse.Object.
     */

  }, {
    key: "extend",
    value: function (className
    /*: any*/
    , protoProps
    /*: any*/
    , classProps
    /*: any*/
    ) {
      if (typeof className !== 'string') {
        if (className && typeof className.className === 'string') {
          return ParseObject.extend(className.className, className, protoProps);
        } else {
          throw new Error('Parse.Object.extend\'s first argument should be the className.');
        }
      }

      var adjustedClassName = className;

      if (adjustedClassName === 'User' && _CoreManager.default.get('PERFORM_USER_REWRITE')) {
        adjustedClassName = '_User';
      }

      var parentProto = ParseObject.prototype;

      if (this.hasOwnProperty('__super__') && this.__super__) {
        parentProto = this.prototype;
      } else if (classMap[adjustedClassName]) {
        parentProto = classMap[adjustedClassName].prototype;
      }

      var ParseObjectSubclass = function (attributes, options) {
        this.className = adjustedClassName;
        this._objCount = objectCount++; // Enable legacy initializers

        if (typeof this.initialize === 'function') {
          this.initialize.apply(this, arguments);
        }

        if (attributes && (0, _typeof2.default)(attributes) === 'object') {
          if (!this.set(attributes || {}, options)) {
            throw new Error('Can\'t create an invalid Parse Object');
          }
        }
      };

      ParseObjectSubclass.className = adjustedClassName;
      ParseObjectSubclass.__super__ = parentProto;
      ParseObjectSubclass.prototype = Object.create(parentProto, {
        constructor: {
          value: ParseObjectSubclass,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });

      if (protoProps) {
        for (var prop in protoProps) {
          if (prop !== 'className') {
            Object.defineProperty(ParseObjectSubclass.prototype, prop, {
              value: protoProps[prop],
              enumerable: false,
              writable: true,
              configurable: true
            });
          }
        }
      }

      if (classProps) {
        for (var _prop in classProps) {
          if (_prop !== 'className') {
            Object.defineProperty(ParseObjectSubclass, _prop, {
              value: classProps[_prop],
              enumerable: false,
              writable: true,
              configurable: true
            });
          }
        }
      }

      ParseObjectSubclass.extend = function (name, protoProps, classProps) {
        if (typeof name === 'string') {
          return ParseObject.extend.call(ParseObjectSubclass, name, protoProps, classProps);
        }

        return ParseObject.extend.call(ParseObjectSubclass, adjustedClassName, name, protoProps);
      };

      ParseObjectSubclass.createWithoutData = ParseObject.createWithoutData;
      classMap[adjustedClassName] = ParseObjectSubclass;
      return ParseObjectSubclass;
    }
    /**
     * Enable single instance objects, where any local objects with the same Id
     * share the same attributes, and stay synchronized with each other.
     * This is disabled by default in server environments, since it can lead to
     * security issues.
     * @static
     */

  }, {
    key: "enableSingleInstance",
    value: function () {
      singleInstance = true;

      _CoreManager.default.setObjectStateController(SingleInstanceStateController);
    }
    /**
     * Disable single instance objects, where any local objects with the same Id
     * share the same attributes, and stay synchronized with each other.
     * When disabled, you can have two instances of the same object in memory
     * without them sharing attributes.
     * @static
     */

  }, {
    key: "disableSingleInstance",
    value: function () {
      singleInstance = false;

      _CoreManager.default.setObjectStateController(UniqueInstanceStateController);
    }
    /**
     * Asynchronously stores the objects and every object they point to in the local datastore,
     * recursively, using a default pin name: _default.
     *
     * If those other objects have not been fetched from Parse, they will not be stored.
     * However, if they have changed data, all the changes will be retained.
     *
     * <pre>
     * await Parse.Object.pinAll([...]);
     * </pre>
     *
     * To retrieve object:
     * <code>query.fromLocalDatastore()</code> or <code>query.fromPin()</code>
     *
     * @param {Array} objects A list of <code>Parse.Object</code>.
     * @return {Promise} A promise that is fulfilled when the pin completes.
     * @static
     */

  }, {
    key: "pinAll",
    value: function (objects
    /*: Array<ParseObject>*/
    )
    /*: Promise<void>*/
    {
      var localDatastore = _CoreManager.default.getLocalDatastore();

      if (!localDatastore.isEnabled) {
        return Promise.reject('Parse.enableLocalDatastore() must be called first');
      }

      return ParseObject.pinAllWithName(_LocalDatastoreUtils.DEFAULT_PIN, objects);
    }
    /**
     * Asynchronously stores the objects and every object they point to in the local datastore, recursively.
     *
     * If those other objects have not been fetched from Parse, they will not be stored.
     * However, if they have changed data, all the changes will be retained.
     *
     * <pre>
     * await Parse.Object.pinAllWithName(name, [obj1, obj2, ...]);
     * </pre>
     *
     * To retrieve object:
     * <code>query.fromLocalDatastore()</code> or <code>query.fromPinWithName(name)</code>
     *
     * @param {String} name Name of Pin.
     * @param {Array} objects A list of <code>Parse.Object</code>.
     * @return {Promise} A promise that is fulfilled when the pin completes.
     * @static
     */

  }, {
    key: "pinAllWithName",
    value: function (name
    /*: string*/
    , objects
    /*: Array<ParseObject>*/
    )
    /*: Promise<void>*/
    {
      var localDatastore = _CoreManager.default.getLocalDatastore();

      if (!localDatastore.isEnabled) {
        return Promise.reject('Parse.enableLocalDatastore() must be called first');
      }

      return localDatastore._handlePinAllWithName(name, objects);
    }
    /**
     * Asynchronously removes the objects and every object they point to in the local datastore,
     * recursively, using a default pin name: _default.
     *
     * <pre>
     * await Parse.Object.unPinAll([...]);
     * </pre>
     *
     * @param {Array} objects A list of <code>Parse.Object</code>.
     * @return {Promise} A promise that is fulfilled when the unPin completes.
     * @static
     */

  }, {
    key: "unPinAll",
    value: function (objects
    /*: Array<ParseObject>*/
    )
    /*: Promise<void>*/
    {
      var localDatastore = _CoreManager.default.getLocalDatastore();

      if (!localDatastore.isEnabled) {
        return Promise.reject('Parse.enableLocalDatastore() must be called first');
      }

      return ParseObject.unPinAllWithName(_LocalDatastoreUtils.DEFAULT_PIN, objects);
    }
    /**
     * Asynchronously removes the objects and every object they point to in the local datastore, recursively.
     *
     * <pre>
     * await Parse.Object.unPinAllWithName(name, [obj1, obj2, ...]);
     * </pre>
     *
     * @param {String} name Name of Pin.
     * @param {Array} objects A list of <code>Parse.Object</code>.
     * @return {Promise} A promise that is fulfilled when the unPin completes.
     * @static
     */

  }, {
    key: "unPinAllWithName",
    value: function (name
    /*: string*/
    , objects
    /*: Array<ParseObject>*/
    )
    /*: Promise<void>*/
    {
      var localDatastore = _CoreManager.default.getLocalDatastore();

      if (!localDatastore.isEnabled) {
        return Promise.reject('Parse.enableLocalDatastore() must be called first');
      }

      return localDatastore._handleUnPinAllWithName(name, objects);
    }
    /**
     * Asynchronously removes all objects in the local datastore using a default pin name: _default.
     *
     * <pre>
     * await Parse.Object.unPinAllObjects();
     * </pre>
     *
     * @return {Promise} A promise that is fulfilled when the unPin completes.
     * @static
     */

  }, {
    key: "unPinAllObjects",
    value: function ()
    /*: Promise<void>*/
    {
      var localDatastore = _CoreManager.default.getLocalDatastore();

      if (!localDatastore.isEnabled) {
        return Promise.reject('Parse.enableLocalDatastore() must be called first');
      }

      return localDatastore.unPinWithName(_LocalDatastoreUtils.DEFAULT_PIN);
    }
    /**
     * Asynchronously removes all objects with the specified pin name.
     * Deletes the pin name also.
     *
     * <pre>
     * await Parse.Object.unPinAllObjectsWithName(name);
     * </pre>
     *
     * @param {String} name Name of Pin.
     * @return {Promise} A promise that is fulfilled when the unPin completes.
     * @static
     */

  }, {
    key: "unPinAllObjectsWithName",
    value: function (name
    /*: string*/
    )
    /*: Promise<void>*/
    {
      var localDatastore = _CoreManager.default.getLocalDatastore();

      if (!localDatastore.isEnabled) {
        return Promise.reject('Parse.enableLocalDatastore() must be called first');
      }

      return localDatastore.unPinWithName(_LocalDatastoreUtils.PIN_PREFIX + name);
    }
  }]);
  return ParseObject;
}();

var DefaultController = {
  fetch: function (target
  /*: ParseObject | Array<ParseObject>*/
  , forceFetch
  /*: boolean*/
  , options
  /*: RequestOptions*/
  )
  /*: Promise<Array<void> | ParseObject>*/
  {
    var localDatastore = _CoreManager.default.getLocalDatastore();

    if (Array.isArray(target)) {
      if (target.length < 1) {
        return Promise.resolve([]);
      }

      var objs = [];
      var ids = [];
      var className = null;
      var results = [];
      var error = null;
      target.forEach(function (el) {
        if (error) {
          return;
        }

        if (!className) {
          className = el.className;
        }

        if (className !== el.className) {
          error = new _ParseError.default(_ParseError.default.INVALID_CLASS_NAME, 'All objects should be of the same class');
        }

        if (!el.id) {
          error = new _ParseError.default(_ParseError.default.MISSING_OBJECT_ID, 'All objects must have an ID');
        }

        if (forceFetch || !el.isDataAvailable()) {
          ids.push(el.id);
          objs.push(el);
        }

        results.push(el);
      });

      if (error) {
        return Promise.reject(error);
      }

      var query = new _ParseQuery.default(className);
      query.containedIn('objectId', ids);

      if (options && options.include) {
        query.include(options.include);
      }

      query._limit = ids.length;
      return query.find(options).then(
      /*#__PURE__*/
      function () {
        var _ref = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee3(objects) {
          var idMap, i, obj, _i2, _obj, id, _i3, _results, object;

          return _regenerator.default.wrap(function (_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  idMap = {};
                  objects.forEach(function (o) {
                    idMap[o.id] = o;
                  });
                  i = 0;

                case 3:
                  if (!(i < objs.length)) {
                    _context3.next = 11;
                    break;
                  }

                  obj = objs[i];

                  if (!(!obj || !obj.id || !idMap[obj.id])) {
                    _context3.next = 8;
                    break;
                  }

                  if (!forceFetch) {
                    _context3.next = 8;
                    break;
                  }

                  return _context3.abrupt("return", Promise.reject(new _ParseError.default(_ParseError.default.OBJECT_NOT_FOUND, 'All objects must exist on the server.')));

                case 8:
                  i++;
                  _context3.next = 3;
                  break;

                case 11:
                  if (!singleInstance) {
                    // If single instance objects are disabled, we need to replace the
                    for (_i2 = 0; _i2 < results.length; _i2++) {
                      _obj = results[_i2];

                      if (_obj && _obj.id && idMap[_obj.id]) {
                        id = _obj.id;

                        _obj._finishFetch(idMap[id].toJSON());

                        results[_i2] = idMap[id];
                      }
                    }
                  }

                  _i3 = 0, _results = results;

                case 13:
                  if (!(_i3 < _results.length)) {
                    _context3.next = 20;
                    break;
                  }

                  object = _results[_i3];
                  _context3.next = 17;
                  return localDatastore._updateObjectIfPinned(object);

                case 17:
                  _i3++;
                  _context3.next = 13;
                  break;

                case 20:
                  return _context3.abrupt("return", Promise.resolve(results));

                case 21:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));

        return function () {
          return _ref.apply(this, arguments);
        };
      }());
    } else {
      var RESTController = _CoreManager.default.getRESTController();

      var params = {};

      if (options && options.include) {
        params.include = options.include.join();
      }

      return RESTController.request('GET', 'classes/' + target.className + '/' + target._getId(), params, options).then(
      /*#__PURE__*/
      function () {
        var _ref2 = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee4(response) {
          return _regenerator.default.wrap(function (_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  if (target instanceof ParseObject) {
                    target._clearPendingOps();

                    target._clearServerData();

                    target._finishFetch(response);
                  }

                  _context4.next = 3;
                  return localDatastore._updateObjectIfPinned(target);

                case 3:
                  return _context4.abrupt("return", target);

                case 4:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        return function () {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  },
  destroy: function () {
    var _destroy = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee7(target
    /*: ParseObject | Array<ParseObject>*/
    , options
    /*: RequestOptions*/
    ) {
      var batchSize, localDatastore, RESTController, batches, deleteCompleted, errors;
      return _regenerator.default.wrap(function (_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              batchSize = options && options.batchSize ? options.batchSize : DEFAULT_BATCH_SIZE;
              localDatastore = _CoreManager.default.getLocalDatastore();
              RESTController = _CoreManager.default.getRESTController();

              if (!Array.isArray(target)) {
                _context7.next = 15;
                break;
              }

              if (!(target.length < 1)) {
                _context7.next = 6;
                break;
              }

              return _context7.abrupt("return", Promise.resolve([]));

            case 6:
              batches = [[]];
              target.forEach(function (obj) {
                if (!obj.id) {
                  return;
                }

                batches[batches.length - 1].push(obj);

                if (batches[batches.length - 1].length >= batchSize) {
                  batches.push([]);
                }
              });

              if (batches[batches.length - 1].length === 0) {
                // If the last batch is empty, remove it
                batches.pop();
              }

              deleteCompleted = Promise.resolve();
              errors = [];
              batches.forEach(function (batch) {
                deleteCompleted = deleteCompleted.then(function () {
                  return RESTController.request('POST', 'batch', {
                    requests: batch.map(function (obj) {
                      return {
                        method: 'DELETE',
                        path: getServerUrlPath() + 'classes/' + obj.className + '/' + obj._getId(),
                        body: {}
                      };
                    })
                  }, options).then(function (results) {
                    for (var i = 0; i < results.length; i++) {
                      if (results[i] && results[i].hasOwnProperty('error')) {
                        var err = new _ParseError.default(results[i].error.code, results[i].error.error);
                        err.object = batch[i];
                        errors.push(err);
                      }
                    }
                  });
                });
              });
              return _context7.abrupt("return", deleteCompleted.then(
              /*#__PURE__*/
              (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee5() {
                var aggregate, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, object;

                return _regenerator.default.wrap(function (_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        if (!errors.length) {
                          _context5.next = 4;
                          break;
                        }

                        aggregate = new _ParseError.default(_ParseError.default.AGGREGATE_ERROR);
                        aggregate.errors = errors;
                        return _context5.abrupt("return", Promise.reject(aggregate));

                      case 4:
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context5.prev = 7;
                        _iterator = target[Symbol.iterator]();

                      case 9:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                          _context5.next = 16;
                          break;
                        }

                        object = _step.value;
                        _context5.next = 13;
                        return localDatastore._destroyObjectIfPinned(object);

                      case 13:
                        _iteratorNormalCompletion = true;
                        _context5.next = 9;
                        break;

                      case 16:
                        _context5.next = 22;
                        break;

                      case 18:
                        _context5.prev = 18;
                        _context5.t0 = _context5["catch"](7);
                        _didIteratorError = true;
                        _iteratorError = _context5.t0;

                      case 22:
                        _context5.prev = 22;
                        _context5.prev = 23;

                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                          _iterator.return();
                        }

                      case 25:
                        _context5.prev = 25;

                        if (!_didIteratorError) {
                          _context5.next = 28;
                          break;
                        }

                        throw _iteratorError;

                      case 28:
                        return _context5.finish(25);

                      case 29:
                        return _context5.finish(22);

                      case 30:
                        return _context5.abrupt("return", Promise.resolve(target));

                      case 31:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5, null, [[7, 18, 22, 30], [23,, 25, 29]]);
              }))));

            case 15:
              if (!(target instanceof ParseObject)) {
                _context7.next = 17;
                break;
              }

              return _context7.abrupt("return", RESTController.request('DELETE', 'classes/' + target.className + '/' + target._getId(), {}, options).then(
              /*#__PURE__*/
              (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee6() {
                return _regenerator.default.wrap(function (_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return localDatastore._destroyObjectIfPinned(target);

                      case 2:
                        return _context6.abrupt("return", Promise.resolve(target));

                      case 3:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }))));

            case 17:
              _context7.next = 19;
              return localDatastore._destroyObjectIfPinned(target);

            case 19:
              return _context7.abrupt("return", Promise.resolve(target));

            case 20:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    return function () {
      return _destroy.apply(this, arguments);
    };
  }(),
  save: function (target
  /*: ParseObject | Array<ParseObject | ParseFile>*/
  , options
  /*: RequestOptions*/
  ) {
    var batchSize = options && options.batchSize ? options.batchSize : DEFAULT_BATCH_SIZE;

    var localDatastore = _CoreManager.default.getLocalDatastore();

    var mapIdForPin = {};

    var RESTController = _CoreManager.default.getRESTController();

    var stateController = _CoreManager.default.getObjectStateController();

    options = options || {};
    options.returnStatus = options.returnStatus || true;

    if (Array.isArray(target)) {
      if (target.length < 1) {
        return Promise.resolve([]);
      }

      var unsaved = target.concat();

      for (var i = 0; i < target.length; i++) {
        if (target[i] instanceof ParseObject) {
          unsaved = unsaved.concat((0, _unsavedChildren.default)(target[i], true));
        }
      }

      unsaved = (0, _unique.default)(unsaved);
      var filesSaved = Promise.resolve();
      var pending
      /*: Array<ParseObject>*/
      = [];
      unsaved.forEach(function (el) {
        if (el instanceof _ParseFile.default) {
          filesSaved = filesSaved.then(function () {
            return el.save();
          });
        } else if (el instanceof ParseObject) {
          pending.push(el);
        }
      });
      return filesSaved.then(function () {
        var objectError = null;
        return (0, _promiseUtils.continueWhile)(function () {
          return pending.length > 0;
        }, function () {
          var batch = [];
          var nextPending = [];
          pending.forEach(function (el) {
            if (batch.length < batchSize && (0, _canBeSerialized.default)(el)) {
              batch.push(el);
            } else {
              nextPending.push(el);
            }
          });
          pending = nextPending;

          if (batch.length < 1) {
            return Promise.reject(new _ParseError.default(_ParseError.default.OTHER_CAUSE, 'Tried to save a batch with a cycle.'));
          } // Queue up tasks for each object in the batch.
          // When every task is ready, the API request will execute


          var res, rej;
          var batchReturned = new Promise(function (resolve, reject) {
            res = resolve;
            rej = reject;
          });
          batchReturned.resolve = res;
          batchReturned.reject = rej;
          var batchReady = [];
          var batchTasks = [];
          batch.forEach(function (obj, index) {
            var res, rej;
            var ready = new Promise(function (resolve, reject) {
              res = resolve;
              rej = reject;
            });
            ready.resolve = res;
            ready.reject = rej;
            batchReady.push(ready);
            stateController.pushPendingState(obj._getStateIdentifier());
            batchTasks.push(stateController.enqueueTask(obj._getStateIdentifier(), function () {
              ready.resolve();
              return batchReturned.then(function (responses) {
                if (responses[index].hasOwnProperty('success')) {
                  var objectId = responses[index].success.objectId;
                  var status = responses[index]._status;
                  delete responses[index]._status;
                  mapIdForPin[objectId] = obj._localId;

                  obj._handleSaveResponse(responses[index].success, status);
                } else {
                  if (!objectError && responses[index].hasOwnProperty('error')) {
                    var serverError = responses[index].error;
                    objectError = new _ParseError.default(serverError.code, serverError.error); // Cancel the rest of the save

                    pending = [];
                  }

                  obj._handleSaveError();
                }
              });
            }));
          });
          (0, _promiseUtils.when)(batchReady).then(function () {
            // Kick off the batch request
            return RESTController.request('POST', 'batch', {
              requests: batch.map(function (obj) {
                var params = obj._getSaveParams();

                params.path = getServerUrlPath() + params.path;
                return params;
              })
            }, options);
          }).then(batchReturned.resolve, function (error) {
            batchReturned.reject(new _ParseError.default(_ParseError.default.INCORRECT_TYPE, error.message));
          });
          return (0, _promiseUtils.when)(batchTasks);
        }).then(
        /*#__PURE__*/
        (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee8() {
          var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, object;

          return _regenerator.default.wrap(function (_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  if (!objectError) {
                    _context8.next = 2;
                    break;
                  }

                  return _context8.abrupt("return", Promise.reject(objectError));

                case 2:
                  _iteratorNormalCompletion2 = true;
                  _didIteratorError2 = false;
                  _iteratorError2 = undefined;
                  _context8.prev = 5;
                  _iterator2 = target[Symbol.iterator]();

                case 7:
                  if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                    _context8.next = 16;
                    break;
                  }

                  object = _step2.value;
                  _context8.next = 11;
                  return localDatastore._updateLocalIdForObject(mapIdForPin[object.id], object);

                case 11:
                  _context8.next = 13;
                  return localDatastore._updateObjectIfPinned(object);

                case 13:
                  _iteratorNormalCompletion2 = true;
                  _context8.next = 7;
                  break;

                case 16:
                  _context8.next = 22;
                  break;

                case 18:
                  _context8.prev = 18;
                  _context8.t0 = _context8["catch"](5);
                  _didIteratorError2 = true;
                  _iteratorError2 = _context8.t0;

                case 22:
                  _context8.prev = 22;
                  _context8.prev = 23;

                  if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                    _iterator2.return();
                  }

                case 25:
                  _context8.prev = 25;

                  if (!_didIteratorError2) {
                    _context8.next = 28;
                    break;
                  }

                  throw _iteratorError2;

                case 28:
                  return _context8.finish(25);

                case 29:
                  return _context8.finish(22);

                case 30:
                  return _context8.abrupt("return", Promise.resolve(target));

                case 31:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8, null, [[5, 18, 22, 30], [23,, 25, 29]]);
        })));
      });
    } else if (target instanceof ParseObject) {
      // copying target lets Flow guarantee the pointer isn't modified elsewhere
      var localId = target._localId;
      var targetCopy = target;

      var task = function () {
        var params = targetCopy._getSaveParams();

        return RESTController.request(params.method, params.path, params.body, options).then(function (response) {
          var status = response._status;
          delete response._status;

          targetCopy._handleSaveResponse(response, status);
        }, function (error) {
          targetCopy._handleSaveError();

          return Promise.reject(error);
        });
      };

      stateController.pushPendingState(target._getStateIdentifier());
      return stateController.enqueueTask(target._getStateIdentifier(), task).then(
      /*#__PURE__*/
      (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee9() {
        return _regenerator.default.wrap(function (_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return localDatastore._updateLocalIdForObject(localId, target);

              case 2:
                _context9.next = 4;
                return localDatastore._updateObjectIfPinned(target);

              case 4:
                return _context9.abrupt("return", target);

              case 5:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      })), function (error) {
        return Promise.reject(error);
      });
    }

    return Promise.resolve();
  }
};

_CoreManager.default.setObjectController(DefaultController);

var _default = ParseObject;
exports.default = _default;
},{"./CoreManager":4,"./LocalDatastoreUtils":12,"./ParseACL":16,"./ParseError":18,"./ParseFile":19,"./ParseOp":24,"./ParseQuery":26,"./ParseRelation":27,"./SingleInstanceStateController":34,"./UniqueInstanceStateController":38,"./canBeSerialized":40,"./decode":41,"./encode":42,"./escape":44,"./parseDate":46,"./promiseUtils":47,"./unique":48,"./unsavedChildren":49,"@babel/runtime/helpers/asyncToGenerator":53,"@babel/runtime/helpers/classCallCheck":54,"@babel/runtime/helpers/createClass":56,"@babel/runtime/helpers/defineProperty":57,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/interopRequireWildcard":62,"@babel/runtime/helpers/typeof":73,"@babel/runtime/regenerator":76}],24:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.opFromJSON = opFromJSON;
exports.RelationOp = exports.RemoveOp = exports.AddUniqueOp = exports.AddOp = exports.IncrementOp = exports.UnsetOp = exports.SetOp = exports.Op = void 0;

var _possibleConstructorReturn2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/createClass"));

var _arrayContainsObject = _interopRequireDefault(_dereq_("./arrayContainsObject"));

var _decode = _interopRequireDefault(_dereq_("./decode"));

var _encode = _interopRequireDefault(_dereq_("./encode"));

var _ParseObject = _interopRequireDefault(_dereq_("./ParseObject"));

var _ParseRelation = _interopRequireDefault(_dereq_("./ParseRelation"));

var _unique = _interopRequireDefault(_dereq_("./unique"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */


function opFromJSON(json
/*: { [key: string]: any }*/
)
/*: ?Op*/
{
  if (!json || !json.__op) {
    return null;
  }

  switch (json.__op) {
    case 'Delete':
      return new UnsetOp();

    case 'Increment':
      return new IncrementOp(json.amount);

    case 'Add':
      return new AddOp((0, _decode.default)(json.objects));

    case 'AddUnique':
      return new AddUniqueOp((0, _decode.default)(json.objects));

    case 'Remove':
      return new RemoveOp((0, _decode.default)(json.objects));

    case 'AddRelation':
      {
        var toAdd = (0, _decode.default)(json.objects);

        if (!Array.isArray(toAdd)) {
          return new RelationOp([], []);
        }

        return new RelationOp(toAdd, []);
      }

    case 'RemoveRelation':
      {
        var toRemove = (0, _decode.default)(json.objects);

        if (!Array.isArray(toRemove)) {
          return new RelationOp([], []);
        }

        return new RelationOp([], toRemove);
      }

    case 'Batch':
      {
        var _toAdd = [];
        var _toRemove = [];

        for (var i = 0; i < json.ops.length; i++) {
          if (json.ops[i].__op === 'AddRelation') {
            _toAdd = _toAdd.concat((0, _decode.default)(json.ops[i].objects));
          } else if (json.ops[i].__op === 'RemoveRelation') {
            _toRemove = _toRemove.concat((0, _decode.default)(json.ops[i].objects));
          }
        }

        return new RelationOp(_toAdd, _toRemove);
      }
  }

  return null;
}

var Op =
/*#__PURE__*/
function () {
  function Op() {
    (0, _classCallCheck2.default)(this, Op);
  }

  (0, _createClass2.default)(Op, [{
    key: "applyTo",
    // Empty parent class
    value: function ()
    /*: mixed*/

    /*: mixed*/
    {}
    /* eslint-disable-line no-unused-vars */

  }, {
    key: "mergeWith",
    value: function ()
    /*: Op*/

    /*: ?Op*/
    {}
    /* eslint-disable-line no-unused-vars */

  }, {
    key: "toJSON",
    value: function ()
    /*: mixed*/
    {}
  }]);
  return Op;
}();

exports.Op = Op;

var SetOp =
/*#__PURE__*/
function (_Op) {
  (0, _inherits2.default)(SetOp, _Op);

  function SetOp(value
  /*: mixed*/
  ) {
    var _this;

    (0, _classCallCheck2.default)(this, SetOp);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(SetOp).call(this));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_value", void 0);
    _this._value = value;
    return _this;
  }

  (0, _createClass2.default)(SetOp, [{
    key: "applyTo",
    value: function ()
    /*: mixed*/
    {
      return this._value;
    }
  }, {
    key: "mergeWith",
    value: function ()
    /*: SetOp*/
    {
      return new SetOp(this._value);
    }
  }, {
    key: "toJSON",
    value: function () {
      return (0, _encode.default)(this._value, false, true);
    }
  }]);
  return SetOp;
}(Op);

exports.SetOp = SetOp;

var UnsetOp =
/*#__PURE__*/
function (_Op2) {
  (0, _inherits2.default)(UnsetOp, _Op2);

  function UnsetOp() {
    (0, _classCallCheck2.default)(this, UnsetOp);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(UnsetOp).apply(this, arguments));
  }

  (0, _createClass2.default)(UnsetOp, [{
    key: "applyTo",
    value: function () {
      return undefined;
    }
  }, {
    key: "mergeWith",
    value: function ()
    /*: UnsetOp*/
    {
      return new UnsetOp();
    }
  }, {
    key: "toJSON",
    value: function ()
    /*: { __op: string }*/
    {
      return {
        __op: 'Delete'
      };
    }
  }]);
  return UnsetOp;
}(Op);

exports.UnsetOp = UnsetOp;

var IncrementOp =
/*#__PURE__*/
function (_Op3) {
  (0, _inherits2.default)(IncrementOp, _Op3);

  function IncrementOp(amount
  /*: number*/
  ) {
    var _this2;

    (0, _classCallCheck2.default)(this, IncrementOp);
    _this2 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(IncrementOp).call(this));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "_amount", void 0);

    if (typeof amount !== 'number') {
      throw new TypeError('Increment Op must be initialized with a numeric amount.');
    }

    _this2._amount = amount;
    return _this2;
  }

  (0, _createClass2.default)(IncrementOp, [{
    key: "applyTo",
    value: function (value
    /*: ?mixed*/
    )
    /*: number*/
    {
      if (typeof value === 'undefined') {
        return this._amount;
      }

      if (typeof value !== 'number') {
        throw new TypeError('Cannot increment a non-numeric value.');
      }

      return this._amount + value;
    }
  }, {
    key: "mergeWith",
    value: function (previous
    /*: Op*/
    )
    /*: Op*/
    {
      if (!previous) {
        return this;
      }

      if (previous instanceof SetOp) {
        return new SetOp(this.applyTo(previous._value));
      }

      if (previous instanceof UnsetOp) {
        return new SetOp(this._amount);
      }

      if (previous instanceof IncrementOp) {
        return new IncrementOp(this.applyTo(previous._amount));
      }

      throw new Error('Cannot merge Increment Op with the previous Op');
    }
  }, {
    key: "toJSON",
    value: function ()
    /*: { __op: string; amount: number }*/
    {
      return {
        __op: 'Increment',
        amount: this._amount
      };
    }
  }]);
  return IncrementOp;
}(Op);

exports.IncrementOp = IncrementOp;

var AddOp =
/*#__PURE__*/
function (_Op4) {
  (0, _inherits2.default)(AddOp, _Op4);

  function AddOp(value
  /*: mixed | Array<mixed>*/
  ) {
    var _this3;

    (0, _classCallCheck2.default)(this, AddOp);
    _this3 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(AddOp).call(this));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "_value", void 0);
    _this3._value = Array.isArray(value) ? value : [value];
    return _this3;
  }

  (0, _createClass2.default)(AddOp, [{
    key: "applyTo",
    value: function (value
    /*: mixed*/
    )
    /*: Array<mixed>*/
    {
      if (value == null) {
        return this._value;
      }

      if (Array.isArray(value)) {
        return value.concat(this._value);
      }

      throw new Error('Cannot add elements to a non-array value');
    }
  }, {
    key: "mergeWith",
    value: function (previous
    /*: Op*/
    )
    /*: Op*/
    {
      if (!previous) {
        return this;
      }

      if (previous instanceof SetOp) {
        return new SetOp(this.applyTo(previous._value));
      }

      if (previous instanceof UnsetOp) {
        return new SetOp(this._value);
      }

      if (previous instanceof AddOp) {
        return new AddOp(this.applyTo(previous._value));
      }

      throw new Error('Cannot merge Add Op with the previous Op');
    }
  }, {
    key: "toJSON",
    value: function ()
    /*: { __op: string; objects: mixed }*/
    {
      return {
        __op: 'Add',
        objects: (0, _encode.default)(this._value, false, true)
      };
    }
  }]);
  return AddOp;
}(Op);

exports.AddOp = AddOp;

var AddUniqueOp =
/*#__PURE__*/
function (_Op5) {
  (0, _inherits2.default)(AddUniqueOp, _Op5);

  function AddUniqueOp(value
  /*: mixed | Array<mixed>*/
  ) {
    var _this4;

    (0, _classCallCheck2.default)(this, AddUniqueOp);
    _this4 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(AddUniqueOp).call(this));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "_value", void 0);
    _this4._value = (0, _unique.default)(Array.isArray(value) ? value : [value]);
    return _this4;
  }

  (0, _createClass2.default)(AddUniqueOp, [{
    key: "applyTo",
    value: function (value
    /*: mixed | Array<mixed>*/
    )
    /*: Array<mixed>*/
    {
      if (value == null) {
        return this._value || [];
      }

      if (Array.isArray(value)) {
        // copying value lets Flow guarantee the pointer isn't modified elsewhere
        var valueCopy = value;
        var toAdd = [];

        this._value.forEach(function (v) {
          if (v instanceof _ParseObject.default) {
            if (!(0, _arrayContainsObject.default)(valueCopy, v)) {
              toAdd.push(v);
            }
          } else {
            if (valueCopy.indexOf(v) < 0) {
              toAdd.push(v);
            }
          }
        });

        return value.concat(toAdd);
      }

      throw new Error('Cannot add elements to a non-array value');
    }
  }, {
    key: "mergeWith",
    value: function (previous
    /*: Op*/
    )
    /*: Op*/
    {
      if (!previous) {
        return this;
      }

      if (previous instanceof SetOp) {
        return new SetOp(this.applyTo(previous._value));
      }

      if (previous instanceof UnsetOp) {
        return new SetOp(this._value);
      }

      if (previous instanceof AddUniqueOp) {
        return new AddUniqueOp(this.applyTo(previous._value));
      }

      throw new Error('Cannot merge AddUnique Op with the previous Op');
    }
  }, {
    key: "toJSON",
    value: function ()
    /*: { __op: string; objects: mixed }*/
    {
      return {
        __op: 'AddUnique',
        objects: (0, _encode.default)(this._value, false, true)
      };
    }
  }]);
  return AddUniqueOp;
}(Op);

exports.AddUniqueOp = AddUniqueOp;

var RemoveOp =
/*#__PURE__*/
function (_Op6) {
  (0, _inherits2.default)(RemoveOp, _Op6);

  function RemoveOp(value
  /*: mixed | Array<mixed>*/
  ) {
    var _this5;

    (0, _classCallCheck2.default)(this, RemoveOp);
    _this5 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RemoveOp).call(this));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this5), "_value", void 0);
    _this5._value = (0, _unique.default)(Array.isArray(value) ? value : [value]);
    return _this5;
  }

  (0, _createClass2.default)(RemoveOp, [{
    key: "applyTo",
    value: function (value
    /*: mixed | Array<mixed>*/
    )
    /*: Array<mixed>*/
    {
      if (value == null) {
        return [];
      }

      if (Array.isArray(value)) {
        // var i = value.indexOf(this._value);
        var removed = value.concat([]);

        for (var i = 0; i < this._value.length; i++) {
          var index = removed.indexOf(this._value[i]);

          while (index > -1) {
            removed.splice(index, 1);
            index = removed.indexOf(this._value[i]);
          }

          if (this._value[i] instanceof _ParseObject.default && this._value[i].id) {
            for (var j = 0; j < removed.length; j++) {
              if (removed[j] instanceof _ParseObject.default && this._value[i].id === removed[j].id) {
                removed.splice(j, 1);
                j--;
              }
            }
          }
        }

        return removed;
      }

      throw new Error('Cannot remove elements from a non-array value');
    }
  }, {
    key: "mergeWith",
    value: function (previous
    /*: Op*/
    )
    /*: Op*/
    {
      if (!previous) {
        return this;
      }

      if (previous instanceof SetOp) {
        return new SetOp(this.applyTo(previous._value));
      }

      if (previous instanceof UnsetOp) {
        return new UnsetOp();
      }

      if (previous instanceof RemoveOp) {
        var uniques = previous._value.concat([]);

        for (var i = 0; i < this._value.length; i++) {
          if (this._value[i] instanceof _ParseObject.default) {
            if (!(0, _arrayContainsObject.default)(uniques, this._value[i])) {
              uniques.push(this._value[i]);
            }
          } else {
            if (uniques.indexOf(this._value[i]) < 0) {
              uniques.push(this._value[i]);
            }
          }
        }

        return new RemoveOp(uniques);
      }

      throw new Error('Cannot merge Remove Op with the previous Op');
    }
  }, {
    key: "toJSON",
    value: function ()
    /*: { __op: string; objects: mixed }*/
    {
      return {
        __op: 'Remove',
        objects: (0, _encode.default)(this._value, false, true)
      };
    }
  }]);
  return RemoveOp;
}(Op);

exports.RemoveOp = RemoveOp;

var RelationOp =
/*#__PURE__*/
function (_Op7) {
  (0, _inherits2.default)(RelationOp, _Op7);

  function RelationOp(adds
  /*: Array<ParseObject | string>*/
  , removes
  /*: Array<ParseObject | string>*/
  ) {
    var _this6;

    (0, _classCallCheck2.default)(this, RelationOp);
    _this6 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RelationOp).call(this));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this6), "_targetClassName", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this6), "relationsToAdd", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this6), "relationsToRemove", void 0);
    _this6._targetClassName = null;

    if (Array.isArray(adds)) {
      _this6.relationsToAdd = (0, _unique.default)(adds.map(_this6._extractId, (0, _assertThisInitialized2.default)(_this6)));
    }

    if (Array.isArray(removes)) {
      _this6.relationsToRemove = (0, _unique.default)(removes.map(_this6._extractId, (0, _assertThisInitialized2.default)(_this6)));
    }

    return _this6;
  }

  (0, _createClass2.default)(RelationOp, [{
    key: "_extractId",
    value: function (obj
    /*: string | ParseObject*/
    )
    /*: string*/
    {
      if (typeof obj === 'string') {
        return obj;
      }

      if (!obj.id) {
        throw new Error('You cannot add or remove an unsaved Parse Object from a relation');
      }

      if (!this._targetClassName) {
        this._targetClassName = obj.className;
      }

      if (this._targetClassName !== obj.className) {
        throw new Error('Tried to create a Relation with 2 different object types: ' + this._targetClassName + ' and ' + obj.className + '.');
      }

      return obj.id;
    }
  }, {
    key: "applyTo",
    value: function (value
    /*: mixed*/
    , object
    /*:: ?: { className: string, id: ?string }*/
    , key
    /*:: ?: string*/
    )
    /*: ?ParseRelation*/
    {
      if (!value) {
        if (!object || !key) {
          throw new Error('Cannot apply a RelationOp without either a previous value, or an object and a key');
        }

        var parent = new _ParseObject.default(object.className);

        if (object.id && object.id.indexOf('local') === 0) {
          parent._localId = object.id;
        } else if (object.id) {
          parent.id = object.id;
        }

        var relation = new _ParseRelation.default(parent, key);
        relation.targetClassName = this._targetClassName;
        return relation;
      }

      if (value instanceof _ParseRelation.default) {
        if (this._targetClassName) {
          if (value.targetClassName) {
            if (this._targetClassName !== value.targetClassName) {
              throw new Error('Related object must be a ' + value.targetClassName + ', but a ' + this._targetClassName + ' was passed in.');
            }
          } else {
            value.targetClassName = this._targetClassName;
          }
        }

        return value;
      } else {
        throw new Error('Relation cannot be applied to a non-relation field');
      }
    }
  }, {
    key: "mergeWith",
    value: function (previous
    /*: Op*/
    )
    /*: Op*/
    {
      if (!previous) {
        return this;
      } else if (previous instanceof UnsetOp) {
        throw new Error('You cannot modify a relation after deleting it.');
      } else if (previous instanceof SetOp && previous._value instanceof _ParseRelation.default) {
        return this;
      } else if (previous instanceof RelationOp) {
        if (previous._targetClassName && previous._targetClassName !== this._targetClassName) {
          throw new Error('Related object must be of class ' + previous._targetClassName + ', but ' + (this._targetClassName || 'null') + ' was passed in.');
        }

        var newAdd = previous.relationsToAdd.concat([]);
        this.relationsToRemove.forEach(function (r) {
          var index = newAdd.indexOf(r);

          if (index > -1) {
            newAdd.splice(index, 1);
          }
        });
        this.relationsToAdd.forEach(function (r) {
          var index = newAdd.indexOf(r);

          if (index < 0) {
            newAdd.push(r);
          }
        });
        var newRemove = previous.relationsToRemove.concat([]);
        this.relationsToAdd.forEach(function (r) {
          var index = newRemove.indexOf(r);

          if (index > -1) {
            newRemove.splice(index, 1);
          }
        });
        this.relationsToRemove.forEach(function (r) {
          var index = newRemove.indexOf(r);

          if (index < 0) {
            newRemove.push(r);
          }
        });
        var newRelation = new RelationOp(newAdd, newRemove);
        newRelation._targetClassName = this._targetClassName;
        return newRelation;
      }

      throw new Error('Cannot merge Relation Op with the previous Op');
    }
  }, {
    key: "toJSON",
    value: function ()
    /*: { __op?: string; objects?: mixed; ops?: mixed }*/
    {
      var _this7 = this;

      var idToPointer = function (id) {
        return {
          __type: 'Pointer',
          className: _this7._targetClassName,
          objectId: id
        };
      };

      var adds = null;
      var removes = null;
      var pointers = null;

      if (this.relationsToAdd.length > 0) {
        pointers = this.relationsToAdd.map(idToPointer);
        adds = {
          __op: 'AddRelation',
          objects: pointers
        };
      }

      if (this.relationsToRemove.length > 0) {
        pointers = this.relationsToRemove.map(idToPointer);
        removes = {
          __op: 'RemoveRelation',
          objects: pointers
        };
      }

      if (adds && removes) {
        return {
          __op: 'Batch',
          ops: [adds, removes]
        };
      }

      return adds || removes || {};
    }
  }]);
  return RelationOp;
}(Op);

exports.RelationOp = RelationOp;
},{"./ParseObject":23,"./ParseRelation":27,"./arrayContainsObject":39,"./decode":41,"./encode":42,"./unique":48,"@babel/runtime/helpers/assertThisInitialized":52,"@babel/runtime/helpers/classCallCheck":54,"@babel/runtime/helpers/createClass":56,"@babel/runtime/helpers/defineProperty":57,"@babel/runtime/helpers/getPrototypeOf":59,"@babel/runtime/helpers/inherits":60,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/possibleConstructorReturn":68}],25:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/defineProperty"));

var _ParseGeoPoint = _interopRequireDefault(_dereq_("./ParseGeoPoint"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

/**
 * Creates a new Polygon with any of the following forms:<br>
 *   <pre>
 *   new Polygon([[0,0],[0,1],[1,1],[1,0]])
 *   new Polygon([GeoPoint, GeoPoint, GeoPoint])
 *   </pre>
 *
 * <p>Represents a coordinates that may be associated
 * with a key in a ParseObject or used as a reference point for geo queries.
 * This allows proximity-based queries on the key.</p>
 *
 * <p>Example:<pre>
 *   var polygon = new Parse.Polygon([[0,0],[0,1],[1,1],[1,0]]);
 *   var object = new Parse.Object("PlaceObject");
 *   object.set("area", polygon);
 *   object.save();</pre></p>
 * @alias Parse.Polygon
 */


var ParsePolygon =
/*#__PURE__*/
function () {
  /**
   * @param {(Number[][]|Parse.GeoPoint[])} coordinates An Array of coordinate pairs
   */
  function ParsePolygon(arg1
  /*: Array<Array<number>> | Array<ParseGeoPoint>*/
  ) {
    (0, _classCallCheck2.default)(this, ParsePolygon);
    (0, _defineProperty2.default)(this, "_coordinates", void 0);
    this._coordinates = ParsePolygon._validate(arg1);
  }
  /**
   * Coordinates value for this Polygon.
   * Throws an exception if not valid type.
   * @property coordinates
   * @type Array
   */


  (0, _createClass2.default)(ParsePolygon, [{
    key: "toJSON",

    /**
     * Returns a JSON representation of the Polygon, suitable for Parse.
     * @return {Object}
     */
    value: function ()
    /*: { __type: string; coordinates: Array<Array<number>>;}*/
    {
      ParsePolygon._validate(this._coordinates);

      return {
        __type: 'Polygon',
        coordinates: this._coordinates
      };
    }
    /**
     * Checks if two polygons are equal
     * @param {(Parse.Polygon|Object)} other
     * @returns {Boolean}
     */

  }, {
    key: "equals",
    value: function (other
    /*: mixed*/
    )
    /*: boolean*/
    {
      if (!(other instanceof ParsePolygon) || this.coordinates.length !== other.coordinates.length) {
        return false;
      }

      var isEqual = true;

      for (var i = 1; i < this._coordinates.length; i += 1) {
        if (this._coordinates[i][0] != other.coordinates[i][0] || this._coordinates[i][1] != other.coordinates[i][1]) {
          isEqual = false;
          break;
        }
      }

      return isEqual;
    }
    /**
     *
     * @param {Parse.GeoPoint} point
     * @returns {Boolean} Returns if the point is contained in the polygon
     */

  }, {
    key: "containsPoint",
    value: function (point
    /*: ParseGeoPoint*/
    )
    /*: boolean*/
    {
      var minX = this._coordinates[0][0];
      var maxX = this._coordinates[0][0];
      var minY = this._coordinates[0][1];
      var maxY = this._coordinates[0][1];

      for (var i = 1; i < this._coordinates.length; i += 1) {
        var p = this._coordinates[i];
        minX = Math.min(p[0], minX);
        maxX = Math.max(p[0], maxX);
        minY = Math.min(p[1], minY);
        maxY = Math.max(p[1], maxY);
      }

      var outside = point.latitude < minX || point.latitude > maxX || point.longitude < minY || point.longitude > maxY;

      if (outside) {
        return false;
      }

      var inside = false;

      for (var _i = 0, j = this._coordinates.length - 1; _i < this._coordinates.length; j = _i++) {
        var startX = this._coordinates[_i][0];
        var startY = this._coordinates[_i][1];
        var endX = this._coordinates[j][0];
        var endY = this._coordinates[j][1];
        var intersect = startY > point.longitude != endY > point.longitude && point.latitude < (endX - startX) * (point.longitude - startY) / (endY - startY) + startX;

        if (intersect) {
          inside = !inside;
        }
      }

      return inside;
    }
    /**
     * Validates that the list of coordinates can form a valid polygon
     * @param {Array} coords the list of coordinated to validate as a polygon
     * @throws {TypeError}
     */

  }, {
    key: "coordinates",
    get: function ()
    /*: Array<Array<number>>*/
    {
      return this._coordinates;
    },
    set: function (coords
    /*: Array<Array<number>> | Array<ParseGeoPoint>*/
    ) {
      this._coordinates = ParsePolygon._validate(coords);
    }
  }], [{
    key: "_validate",
    value: function (coords
    /*: Array<Array<number>> | Array<ParseGeoPoint>*/
    )
    /*: Array<Array<number>>*/
    {
      if (!Array.isArray(coords)) {
        throw new TypeError('Coordinates must be an Array');
      }

      if (coords.length < 3) {
        throw new TypeError('Polygon must have at least 3 GeoPoints or Points');
      }

      var points = [];

      for (var i = 0; i < coords.length; i += 1) {
        var coord = coords[i];
        var geoPoint = void 0;

        if (coord instanceof _ParseGeoPoint.default) {
          geoPoint = coord;
        } else if (Array.isArray(coord) && coord.length === 2) {
          geoPoint = new _ParseGeoPoint.default(coord[0], coord[1]);
        } else {
          throw new TypeError('Coordinates must be an Array of GeoPoints or Points');
        }

        points.push([geoPoint.latitude, geoPoint.longitude]);
      }

      return points;
    }
  }]);
  return ParsePolygon;
}();

var _default = ParsePolygon;
exports.default = _default;
},{"./ParseGeoPoint":20,"@babel/runtime/helpers/classCallCheck":54,"@babel/runtime/helpers/createClass":56,"@babel/runtime/helpers/defineProperty":57,"@babel/runtime/helpers/interopRequireDefault":61}],26:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));

var _regenerator = _interopRequireDefault(_dereq_("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/defineProperty"));

var _CoreManager = _interopRequireDefault(_dereq_("./CoreManager"));

var _encode = _interopRequireDefault(_dereq_("./encode"));

var _promiseUtils = _dereq_("./promiseUtils");

var _ParseError = _interopRequireDefault(_dereq_("./ParseError"));

var _ParseGeoPoint = _interopRequireDefault(_dereq_("./ParseGeoPoint"));

var _ParseObject = _interopRequireDefault(_dereq_("./ParseObject"));

var _OfflineQuery = _interopRequireDefault(_dereq_("./OfflineQuery"));

var _LocalDatastoreUtils = _dereq_("./LocalDatastoreUtils");
/*
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

/**
 * Converts a string into a regex that matches it.
 * Surrounding with \Q .. \E does this, we just need to escape any \E's in
 * the text separately.
 * @private
 */


function quote(s
/*: string*/
) {
  return '\\Q' + s.replace('\\E', '\\E\\\\E\\Q') + '\\E';
}
/**
 * Extracts the class name from queries. If not all queries have the same
 * class name an error will be thrown.
 */


function _getClassNameFromQueries(queries
/*: Array<ParseQuery>*/
)
/*: ?string*/
{
  var className = null;
  queries.forEach(function (q) {
    if (!className) {
      className = q.className;
    }

    if (className !== q.className) {
      throw new Error('All queries must be for the same class.');
    }
  });
  return className;
}
/*
 * Handles pre-populating the result data of a query with select fields,
 * making sure that the data object contains keys for all objects that have
 * been requested with a select, so that our cached state updates correctly.
 */


function handleSelectResult(data
/*: any*/
, select
/*: Array<string>*/
) {
  var serverDataMask = {};
  select.forEach(function (field) {
    var hasSubObjectSelect = field.indexOf(".") !== -1;

    if (!hasSubObjectSelect && !data.hasOwnProperty(field)) {
      // this field was selected, but is missing from the retrieved data
      data[field] = undefined;
    } else if (hasSubObjectSelect) {
      // this field references a sub-object,
      // so we need to walk down the path components
      var pathComponents = field.split(".");
      var _obj = data;
      var serverMask = serverDataMask;
      pathComponents.forEach(function (component, index, arr) {
        // add keys if the expected data is missing
        if (_obj && !_obj.hasOwnProperty(component)) {
          _obj[component] = undefined;
        }

        if (_obj !== undefined) {
          _obj = _obj[component];
        } //add this path component to the server mask so we can fill it in later if needed


        if (index < arr.length - 1) {
          if (!serverMask[component]) {
            serverMask[component] = {};
          }

          serverMask = serverMask[component];
        }
      });
    }
  });

  if (Object.keys(serverDataMask).length > 0) {
    // When selecting from sub-objects, we don't want to blow away the missing
    // information that we may have retrieved before. We've already added any
    // missing selected keys to sub-objects, but we still need to add in the
    // data for any previously retrieved sub-objects that were not selected.
    var serverData = _CoreManager.default.getObjectStateController().getServerData({
      id: data.objectId,
      className: data.className
    });

    copyMissingDataWithMask(serverData, data, serverDataMask, false);
  }
}

function copyMissingDataWithMask(src, dest, mask, copyThisLevel) {
  //copy missing elements at this level
  if (copyThisLevel) {
    for (var _key in src) {
      if (src.hasOwnProperty(_key) && !dest.hasOwnProperty(_key)) {
        dest[_key] = src[_key];
      }
    }
  }

  for (var _key2 in mask) {
    if (dest[_key2] !== undefined && dest[_key2] !== null && src !== undefined && src !== null) {
      //traverse into objects as needed
      copyMissingDataWithMask(src[_key2], dest[_key2], mask[_key2], true);
    }
  }
}

function handleOfflineSort(a, b, sorts) {
  var order = sorts[0];
  var operator = order.slice(0, 1);
  var isDescending = operator === '-';

  if (isDescending) {
    order = order.substring(1);
  }

  if (order === '_created_at') {
    order = 'createdAt';
  }

  if (order === '_updated_at') {
    order = 'updatedAt';
  }

  if (!/^[A-Za-z][0-9A-Za-z_]*$/.test(order) || order === 'password') {
    throw new _ParseError.default(_ParseError.default.INVALID_KEY_NAME, "Invalid Key: ".concat(order));
  }

  var field1 = a.get(order);
  var field2 = b.get(order);

  if (field1 < field2) {
    return isDescending ? 1 : -1;
  }

  if (field1 > field2) {
    return isDescending ? -1 : 1;
  }

  if (sorts.length > 1) {
    var remainingSorts = sorts.slice(1);
    return handleOfflineSort(a, b, remainingSorts);
  }

  return 0;
}
/**
 * Creates a new parse Parse.Query for the given Parse.Object subclass.
 *
 * <p>Parse.Query defines a query that is used to fetch Parse.Objects. The
 * most common use case is finding all objects that match a query through the
 * <code>find</code> method. for example, this sample code fetches all objects
 * of class <code>myclass</code>. it calls a different function depending on
 * whether the fetch succeeded or not.
 *
 * <pre>
 * var query = new Parse.Query(myclass);
 * query.find().then((results) => {
 *   // results is an array of parse.object.
 * }).catch((error) =>  {
 *  // error is an instance of parse.error.
 * });</pre></p>
 *
 * <p>a Parse.Query can also be used to retrieve a single object whose id is
 * known, through the get method. for example, this sample code fetches an
 * object of class <code>myclass</code> and id <code>myid</code>. it calls a
 * different function depending on whether the fetch succeeded or not.
 *
 * <pre>
 * var query = new Parse.Query(myclass);
 * query.get(myid).then((object) => {
 *     // object is an instance of parse.object.
 * }).catch((error) =>  {
 *  // error is an instance of parse.error.
 * });</pre></p>
 *
 * <p>a Parse.Query can also be used to count the number of objects that match
 * the query without retrieving all of those objects. for example, this
 * sample code counts the number of objects of the class <code>myclass</code>
 * <pre>
 * var query = new Parse.Query(myclass);
 * query.count().then((number) => {
 *     // there are number instances of myclass.
 * }).catch((error) => {
 *     // error is an instance of Parse.Error.
 * });</pre></p>
 * @alias Parse.Query
 */


var ParseQuery =
/*#__PURE__*/
function () {
  /**
   * @property className
   * @type String
   */

  /**
   * @param {(String|Parse.Object)} objectClass An instance of a subclass of Parse.Object, or a Parse className string.
   */
  function ParseQuery(objectClass
  /*: string | ParseObject*/
  ) {
    (0, _classCallCheck2.default)(this, ParseQuery);
    (0, _defineProperty2.default)(this, "className", void 0);
    (0, _defineProperty2.default)(this, "_where", void 0);
    (0, _defineProperty2.default)(this, "_include", void 0);
    (0, _defineProperty2.default)(this, "_exclude", void 0);
    (0, _defineProperty2.default)(this, "_select", void 0);
    (0, _defineProperty2.default)(this, "_limit", void 0);
    (0, _defineProperty2.default)(this, "_skip", void 0);
    (0, _defineProperty2.default)(this, "_count", void 0);
    (0, _defineProperty2.default)(this, "_order", void 0);
    (0, _defineProperty2.default)(this, "_readPreference", void 0);
    (0, _defineProperty2.default)(this, "_includeReadPreference", void 0);
    (0, _defineProperty2.default)(this, "_subqueryReadPreference", void 0);
    (0, _defineProperty2.default)(this, "_queriesLocalDatastore", void 0);
    (0, _defineProperty2.default)(this, "_localDatastorePinName", void 0);
    (0, _defineProperty2.default)(this, "_extraOptions", void 0);

    if (typeof objectClass === 'string') {
      if (objectClass === 'User' && _CoreManager.default.get('PERFORM_USER_REWRITE')) {
        this.className = '_User';
      } else {
        this.className = objectClass;
      }
    } else if (objectClass instanceof _ParseObject.default) {
      this.className = objectClass.className;
    } else if (typeof objectClass === 'function') {
      if (typeof objectClass.className === 'string') {
        this.className = objectClass.className;
      } else {
        var _obj2 = new objectClass();

        this.className = _obj2.className;
      }
    } else {
      throw new TypeError('A ParseQuery must be constructed with a ParseObject or class name.');
    }

    this._where = {};
    this._include = [];
    this._exclude = [];
    this._count = false;
    this._limit = -1; // negative limit is not sent in the server request

    this._skip = 0;
    this._readPreference = null;
    this._includeReadPreference = null;
    this._subqueryReadPreference = null;
    this._queriesLocalDatastore = false;
    this._localDatastorePinName = null;
    this._extraOptions = {};
  }
  /**
   * Adds constraint that at least one of the passed in queries matches.
   * @param {Array} queries
   * @return {Parse.Query} Returns the query, so you can chain this call.
   */


  (0, _createClass2.default)(ParseQuery, [{
    key: "_orQuery",
    value: function (queries
    /*: Array<ParseQuery>*/
    )
    /*: ParseQuery*/
    {
      var queryJSON = queries.map(function (q) {
        return q.toJSON().where;
      });
      this._where.$or = queryJSON;
      return this;
    }
    /**
     * Adds constraint that all of the passed in queries match.
     * @param {Array} queries
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "_andQuery",
    value: function (queries
    /*: Array<ParseQuery>*/
    )
    /*: ParseQuery*/
    {
      var queryJSON = queries.map(function (q) {
        return q.toJSON().where;
      });
      this._where.$and = queryJSON;
      return this;
    }
    /**
     * Adds constraint that none of the passed in queries match.
     * @param {Array} queries
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "_norQuery",
    value: function (queries
    /*: Array<ParseQuery>*/
    )
    /*: ParseQuery*/
    {
      var queryJSON = queries.map(function (q) {
        return q.toJSON().where;
      });
      this._where.$nor = queryJSON;
      return this;
    }
    /**
     * Helper for condition queries
     */

  }, {
    key: "_addCondition",
    value: function (key
    /*: string*/
    , condition
    /*: string*/
    , value
    /*: mixed*/
    )
    /*: ParseQuery*/
    {
      if (!this._where[key] || typeof this._where[key] === 'string') {
        this._where[key] = {};
      }

      this._where[key][condition] = (0, _encode.default)(value, false, true);
      return this;
    }
    /**
     * Converts string for regular expression at the beginning
     */

  }, {
    key: "_regexStartWith",
    value: function (string
    /*: string*/
    )
    /*: string*/
    {
      return '^' + quote(string);
    }
  }, {
    key: "_handleOfflineQuery",
    value: function () {
      var _handleOfflineQuery2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(params
      /*: any*/
      ) {
        var _this2 = this;

        var localDatastore, objects, results, keys, alwaysSelectedKeys, sorts, count, limit;
        return _regenerator.default.wrap(function (_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _OfflineQuery.default.validateQuery(this);

                localDatastore = _CoreManager.default.getLocalDatastore();
                _context.next = 4;
                return localDatastore._serializeObjectsFromPinName(this._localDatastorePinName);

              case 4:
                objects = _context.sent;
                results = objects.map(function (json, index, arr) {
                  var object = _ParseObject.default.fromJSON(json, false);

                  if (json._localId && !json.objectId) {
                    object._localId = json._localId;
                  }

                  if (!_OfflineQuery.default.matchesQuery(_this2.className, object, arr, _this2)) {
                    return null;
                  }

                  return object;
                }).filter(function (object) {
                  return object !== null;
                });

                if (params.keys) {
                  keys = params.keys.split(',');
                  alwaysSelectedKeys = ['className', 'objectId', 'createdAt', 'updatedAt', 'ACL'];
                  keys = keys.concat(alwaysSelectedKeys);
                  results = results.map(function (object) {
                    var json = object._toFullJSON();

                    Object.keys(json).forEach(function (key) {
                      if (!keys.includes(key)) {
                        delete json[key];
                      }
                    });
                    return _ParseObject.default.fromJSON(json, false);
                  });
                }

                if (params.order) {
                  sorts = params.order.split(',');
                  results.sort(function (a, b) {
                    return handleOfflineSort(a, b, sorts);
                  });
                } // count total before applying limit/skip


                if (params.count) {
                  count = results.length; // total count from response
                }

                if (params.skip) {
                  if (params.skip >= results.length) {
                    results = [];
                  } else {
                    results = results.splice(params.skip, results.length);
                  }
                }

                limit = results.length;

                if (params.limit !== 0 && params.limit < results.length) {
                  limit = params.limit;
                }

                results = results.splice(0, limit);

                if (!(typeof count === 'number')) {
                  _context.next = 15;
                  break;
                }

                return _context.abrupt("return", {
                  results: results,
                  count: count
                });

              case 15:
                return _context.abrupt("return", results);

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function () {
        return _handleOfflineQuery2.apply(this, arguments);
      };
    }()
    /**
     * Returns a JSON representation of this query.
     * @return {Object} The JSON representation of the query.
     */

  }, {
    key: "toJSON",
    value: function ()
    /*: QueryJSON*/
    {
      var params
      /*: QueryJSON*/
      = {
        where: this._where
      };

      if (this._include.length) {
        params.include = this._include.join(',');
      }

      if (this._exclude.length) {
        params.excludeKeys = this._exclude.join(',');
      }

      if (this._select) {
        params.keys = this._select.join(',');
      }

      if (this._count) {
        params.count = 1;
      }

      if (this._limit >= 0) {
        params.limit = this._limit;
      }

      if (this._skip > 0) {
        params.skip = this._skip;
      }

      if (this._order) {
        params.order = this._order.join(',');
      }

      if (this._readPreference) {
        params.readPreference = this._readPreference;
      }

      if (this._includeReadPreference) {
        params.includeReadPreference = this._includeReadPreference;
      }

      if (this._subqueryReadPreference) {
        params.subqueryReadPreference = this._subqueryReadPreference;
      }

      for (var _key3 in this._extraOptions) {
        params[_key3] = this._extraOptions[_key3];
      }

      return params;
    }
    /**
     * Return a query with conditions from json, can be useful to send query from server side to client
     * Not static, all query conditions was set before calling this method will be deleted.
     * For example on the server side we have
     * var query = new Parse.Query("className");
     * query.equalTo(key: value);
     * query.limit(100);
     * ... (others queries)
     * Create JSON representation of Query Object
     * var jsonFromServer = query.fromJSON();
     *
     * On client side getting query:
     * var query = new Parse.Query("className");
     * query.fromJSON(jsonFromServer);
     *
     * and continue to query...
     * query.skip(100).find().then(...);
     * @param {QueryJSON} json from Parse.Query.toJSON() method
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "withJSON",
    value: function (json
    /*: QueryJSON*/
    )
    /*: ParseQuery*/
    {
      if (json.where) {
        this._where = json.where;
      }

      if (json.include) {
        this._include = json.include.split(",");
      }

      if (json.keys) {
        this._select = json.keys.split(",");
      }

      if (json.excludeKeys) {
        this._exclude = json.excludeKeys.split(",");
      }

      if (json.count) {
        this._count = json.count === 1;
      }

      if (json.limit) {
        this._limit = json.limit;
      }

      if (json.skip) {
        this._skip = json.skip;
      }

      if (json.order) {
        this._order = json.order.split(",");
      }

      if (json.readPreference) {
        this._readPreference = json.readPreference;
      }

      if (json.includeReadPreference) {
        this._includeReadPreference = json.includeReadPreference;
      }

      if (json.subqueryReadPreference) {
        this._subqueryReadPreference = json.subqueryReadPreference;
      }

      for (var _key4 in json) {
        if (json.hasOwnProperty(_key4)) {
          if (["where", "include", "keys", "count", "limit", "skip", "order", "readPreference", "includeReadPreference", "subqueryReadPreference"].indexOf(_key4) === -1) {
            this._extraOptions[_key4] = json[_key4];
          }
        }
      }

      return this;
    }
    /**
       * Static method to restore Parse.Query by json representation
       * Internally calling Parse.Query.withJSON
       * @param {String} className
       * @param {QueryJSON} json from Parse.Query.toJSON() method
       * @returns {Parse.Query} new created query
       */

  }, {
    key: "get",

    /**
     * Constructs a Parse.Object whose id is already known by fetching data from
     * the server.  Either options.success or options.error is called when the
     * find completes. Unlike the <code>first</code> method, it never returns undefined.
     *
     * @param {String} objectId The id of the object to be fetched.
     * @param {Object} options
     * Valid options are:<ul>
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     *
     * @return {Promise} A promise that is resolved with the result when
     * the query completes.
     */
    value: function (objectId
    /*: string*/
    , options
    /*:: ?: FullOptions*/
    )
    /*: Promise<ParseObject>*/
    {
      this.equalTo('objectId', objectId);
      var firstOptions = {};

      if (options && options.hasOwnProperty('useMasterKey')) {
        firstOptions.useMasterKey = options.useMasterKey;
      }

      if (options && options.hasOwnProperty('sessionToken')) {
        firstOptions.sessionToken = options.sessionToken;
      }

      return this.first(firstOptions).then(function (response) {
        if (response) {
          return response;
        }

        var errorObject = new _ParseError.default(_ParseError.default.OBJECT_NOT_FOUND, 'Object not found.');
        return Promise.reject(errorObject);
      });
    }
    /**
     * Retrieves a list of ParseObjects that satisfy this query.
     * Either options.success or options.error is called when the find
     * completes.
     *
     * @param {Object} options Valid options
     * are:<ul>
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     *
     * @return {Promise} A promise that is resolved with the results when
     * the query completes.
     */

  }, {
    key: "find",
    value: function (options
    /*:: ?: FullOptions*/
    )
    /*: Promise<Array<ParseObject>>*/
    {
      var _this3 = this;

      options = options || {};
      var findOptions = {};

      if (options.hasOwnProperty('useMasterKey')) {
        findOptions.useMasterKey = options.useMasterKey;
      }

      if (options.hasOwnProperty('sessionToken')) {
        findOptions.sessionToken = options.sessionToken;
      }

      var controller = _CoreManager.default.getQueryController();

      var select = this._select;

      if (this._queriesLocalDatastore) {
        return this._handleOfflineQuery(this.toJSON());
      }

      return controller.find(this.className, this.toJSON(), findOptions).then(function (response) {
        var results = response.results.map(function (data) {
          // In cases of relations, the server may send back a className
          // on the top level of the payload
          var override = response.className || _this3.className;

          if (!data.className) {
            data.className = override;
          } // Make sure the data object contains keys for all objects that
          // have been requested with a select, so that our cached state
          // updates correctly.


          if (select) {
            handleSelectResult(data, select);
          }

          return _ParseObject.default.fromJSON(data, !select);
        });
        var count = response.count;

        if (typeof count === "number") {
          return {
            results: results,
            count: count
          };
        } else {
          return results;
        }
      });
    }
    /**
     * Counts the number of objects that match this query.
     * Either options.success or options.error is called when the count
     * completes.
     *
     * @param {Object} options
     * Valid options are:<ul>
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     *
     * @return {Promise} A promise that is resolved with the count when
     * the query completes.
     */

  }, {
    key: "count",
    value: function (options
    /*:: ?: FullOptions*/
    )
    /*: Promise<number>*/
    {
      options = options || {};
      var findOptions = {};

      if (options.hasOwnProperty('useMasterKey')) {
        findOptions.useMasterKey = options.useMasterKey;
      }

      if (options.hasOwnProperty('sessionToken')) {
        findOptions.sessionToken = options.sessionToken;
      }

      var controller = _CoreManager.default.getQueryController();

      var params = this.toJSON();
      params.limit = 0;
      params.count = 1;
      return controller.find(this.className, params, findOptions).then(function (result) {
        return result.count;
      });
    }
    /**
     * Executes a distinct query and returns unique values
     *
     * @param {String} key A field to find distinct values
     * @param {Object} options
     * Valid options are:<ul>
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     *
     * @return {Promise} A promise that is resolved with the query completes.
     */

  }, {
    key: "distinct",
    value: function (key
    /*: string*/
    , options
    /*:: ?: FullOptions*/
    )
    /*: Promise<Array<mixed>>*/
    {
      options = options || {};
      var distinctOptions = {};
      distinctOptions.useMasterKey = true;

      if (options.hasOwnProperty('sessionToken')) {
        distinctOptions.sessionToken = options.sessionToken;
      }

      var controller = _CoreManager.default.getQueryController();

      var params = {
        distinct: key,
        where: this._where
      };
      return controller.aggregate(this.className, params, distinctOptions).then(function (results) {
        return results.results;
      });
    }
    /**
     * Executes an aggregate query and returns aggregate results
     *
     * @param {Mixed} pipeline Array or Object of stages to process query
     * @param {Object} options Valid options are:<ul>
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     *
     * @return {Promise} A promise that is resolved with the query completes.
     */

  }, {
    key: "aggregate",
    value: function (pipeline
    /*: mixed*/
    , options
    /*:: ?: FullOptions*/
    )
    /*: Promise<Array<mixed>>*/
    {
      options = options || {};
      var aggregateOptions = {};
      aggregateOptions.useMasterKey = true;

      if (options.hasOwnProperty('sessionToken')) {
        aggregateOptions.sessionToken = options.sessionToken;
      }

      var controller = _CoreManager.default.getQueryController();

      if (!Array.isArray(pipeline) && (0, _typeof2.default)(pipeline) !== 'object') {
        throw new Error('Invalid pipeline must be Array or Object');
      }

      return controller.aggregate(this.className, {
        pipeline: pipeline
      }, aggregateOptions).then(function (results) {
        return results.results;
      });
    }
    /**
     * Retrieves at most one Parse.Object that satisfies this query.
     *
     * Either options.success or options.error is called when it completes.
     * success is passed the object if there is one. otherwise, undefined.
     *
     * @param {Object} options Valid options are:<ul>
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     *
     * @return {Promise} A promise that is resolved with the object when
     * the query completes.
     */

  }, {
    key: "first",
    value: function (options
    /*:: ?: FullOptions*/
    )
    /*: Promise<ParseObject | void>*/
    {
      var _this4 = this;

      options = options || {};
      var findOptions = {};

      if (options.hasOwnProperty('useMasterKey')) {
        findOptions.useMasterKey = options.useMasterKey;
      }

      if (options.hasOwnProperty('sessionToken')) {
        findOptions.sessionToken = options.sessionToken;
      }

      var controller = _CoreManager.default.getQueryController();

      var params = this.toJSON();
      params.limit = 1;
      var select = this._select;

      if (this._queriesLocalDatastore) {
        return this._handleOfflineQuery(params).then(function (objects) {
          if (!objects[0]) {
            return undefined;
          }

          return objects[0];
        });
      }

      return controller.find(this.className, params, findOptions).then(function (response) {
        var objects = response.results;

        if (!objects[0]) {
          return undefined;
        }

        if (!objects[0].className) {
          objects[0].className = _this4.className;
        } // Make sure the data object contains keys for all objects that
        // have been requested with a select, so that our cached state
        // updates correctly.


        if (select) {
          handleSelectResult(objects[0], select);
        }

        return _ParseObject.default.fromJSON(objects[0], !select);
      });
    }
    /**
     * Iterates over each result of a query, calling a callback for each one. If
     * the callback returns a promise, the iteration will not continue until
     * that promise has been fulfilled. If the callback returns a rejected
     * promise, then iteration will stop with that error. The items are
     * processed in an unspecified order. The query may not have any sort order,
     * and may not use limit or skip.
     * @param {Function} callback Callback that will be called with each result
     *     of the query.
     * @param {Object} options Valid options are:<ul>
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     * @return {Promise} A promise that will be fulfilled once the
     *     iteration has completed.
     */

  }, {
    key: "each",
    value: function (callback
    /*: (obj: ParseObject) => any*/
    , options
    /*:: ?: BatchOptions*/
    )
    /*: Promise<Array<ParseObject>>*/
    {
      options = options || {};

      if (this._order || this._skip || this._limit >= 0) {
        return Promise.reject('Cannot iterate on a query with sort, skip, or limit.');
      }

      var query = new ParseQuery(this.className); // We can override the batch size from the options.
      // This is undocumented, but useful for testing.

      query._limit = options.batchSize || 100;
      query._include = this._include.map(function (i) {
        return i;
      });

      if (this._select) {
        query._select = this._select.map(function (s) {
          return s;
        });
      }

      query._where = {};

      for (var _attr in this._where) {
        var val = this._where[_attr];

        if (Array.isArray(val)) {
          query._where[_attr] = val.map(function (v) {
            return v;
          });
        } else if (val && (0, _typeof2.default)(val) === 'object') {
          var conditionMap = {};
          query._where[_attr] = conditionMap;

          for (var cond in val) {
            conditionMap[cond] = val[cond];
          }
        } else {
          query._where[_attr] = val;
        }
      }

      query.ascending('objectId');
      var findOptions = {};

      if (options.hasOwnProperty('useMasterKey')) {
        findOptions.useMasterKey = options.useMasterKey;
      }

      if (options.hasOwnProperty('sessionToken')) {
        findOptions.sessionToken = options.sessionToken;
      }

      var finished = false;
      return (0, _promiseUtils.continueWhile)(function () {
        return !finished;
      }, function () {
        return query.find(findOptions).then(function (results) {
          var callbacksDone = Promise.resolve();
          results.forEach(function (result) {
            callbacksDone = callbacksDone.then(function () {
              return callback(result);
            });
          });
          return callbacksDone.then(function () {
            if (results.length >= query._limit) {
              query.greaterThan('objectId', results[results.length - 1].id);
            } else {
              finished = true;
            }
          });
        });
      });
    }
    /** Query Conditions **/

    /**
     * Adds a constraint to the query that requires a particular key's value to
     * be equal to the provided value.
     * @param {String} key The key to check.
     * @param value The value that the Parse.Object must contain.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "equalTo",
    value: function (key
    /*: string*/
    , value
    /*: mixed*/
    )
    /*: ParseQuery*/
    {
      if (typeof value === 'undefined') {
        return this.doesNotExist(key);
      }

      this._where[key] = (0, _encode.default)(value, false, true);
      return this;
    }
    /**
     * Adds a constraint to the query that requires a particular key's value to
     * be not equal to the provided value.
     * @param {String} key The key to check.
     * @param value The value that must not be equalled.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "notEqualTo",
    value: function (key
    /*: string*/
    , value
    /*: mixed*/
    )
    /*: ParseQuery*/
    {
      return this._addCondition(key, '$ne', value);
    }
    /**
     * Adds a constraint to the query that requires a particular key's value to
     * be less than the provided value.
     * @param {String} key The key to check.
     * @param value The value that provides an upper bound.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "lessThan",
    value: function (key
    /*: string*/
    , value
    /*: mixed*/
    )
    /*: ParseQuery*/
    {
      return this._addCondition(key, '$lt', value);
    }
    /**
     * Adds a constraint to the query that requires a particular key's value to
     * be greater than the provided value.
     * @param {String} key The key to check.
     * @param value The value that provides an lower bound.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "greaterThan",
    value: function (key
    /*: string*/
    , value
    /*: mixed*/
    )
    /*: ParseQuery*/
    {
      return this._addCondition(key, '$gt', value);
    }
    /**
     * Adds a constraint to the query that requires a particular key's value to
     * be less than or equal to the provided value.
     * @param {String} key The key to check.
     * @param value The value that provides an upper bound.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "lessThanOrEqualTo",
    value: function (key
    /*: string*/
    , value
    /*: mixed*/
    )
    /*: ParseQuery*/
    {
      return this._addCondition(key, '$lte', value);
    }
    /**
     * Adds a constraint to the query that requires a particular key's value to
     * be greater than or equal to the provided value.
     * @param {String} key The key to check.
     * @param value The value that provides an lower bound.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "greaterThanOrEqualTo",
    value: function (key
    /*: string*/
    , value
    /*: mixed*/
    )
    /*: ParseQuery*/
    {
      return this._addCondition(key, '$gte', value);
    }
    /**
     * Adds a constraint to the query that requires a particular key's value to
     * be contained in the provided list of values.
     * @param {String} key The key to check.
     * @param {Array} values The values that will match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "containedIn",
    value: function (key
    /*: string*/
    , value
    /*: mixed*/
    )
    /*: ParseQuery*/
    {
      return this._addCondition(key, '$in', value);
    }
    /**
     * Adds a constraint to the query that requires a particular key's value to
     * not be contained in the provided list of values.
     * @param {String} key The key to check.
     * @param {Array} values The values that will not match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "notContainedIn",
    value: function (key
    /*: string*/
    , value
    /*: mixed*/
    )
    /*: ParseQuery*/
    {
      return this._addCondition(key, '$nin', value);
    }
    /**
     * Adds a constraint to the query that requires a particular key's value to
     * be contained by the provided list of values. Get objects where all array elements match.
     * @param {String} key The key to check.
     * @param {Array} values The values that will match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "containedBy",
    value: function (key
    /*: string*/
    , value
    /*: Array<mixed>*/
    )
    /*: ParseQuery*/
    {
      return this._addCondition(key, '$containedBy', value);
    }
    /**
     * Adds a constraint to the query that requires a particular key's value to
     * contain each one of the provided list of values.
     * @param {String} key The key to check.  This key's value must be an array.
     * @param {Array} values The values that will match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "containsAll",
    value: function (key
    /*: string*/
    , values
    /*: Array<mixed>*/
    )
    /*: ParseQuery*/
    {
      return this._addCondition(key, '$all', values);
    }
    /**
     * Adds a constraint to the query that requires a particular key's value to
     * contain each one of the provided list of values starting with given strings.
     * @param {String} key The key to check.  This key's value must be an array.
     * @param {Array<String>} values The string values that will match as starting string.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "containsAllStartingWith",
    value: function (key
    /*: string*/
    , values
    /*: Array<string>*/
    )
    /*: ParseQuery*/
    {
      var _this = this;

      if (!Array.isArray(values)) {
        values = [values];
      }

      var regexObject = values.map(function (value) {
        return {
          '$regex': _this._regexStartWith(value)
        };
      });
      return this.containsAll(key, regexObject);
    }
    /**
     * Adds a constraint for finding objects that contain the given key.
     * @param {String} key The key that should exist.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "exists",
    value: function (key
    /*: string*/
    )
    /*: ParseQuery*/
    {
      return this._addCondition(key, '$exists', true);
    }
    /**
     * Adds a constraint for finding objects that do not contain a given key.
     * @param {String} key The key that should not exist
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "doesNotExist",
    value: function (key
    /*: string*/
    )
    /*: ParseQuery*/
    {
      return this._addCondition(key, '$exists', false);
    }
    /**
     * Adds a regular expression constraint for finding string values that match
     * the provided regular expression.
     * This may be slow for large datasets.
     * @param {String} key The key that the string to match is stored in.
     * @param {RegExp} regex The regular expression pattern to match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "matches",
    value: function (key
    /*: string*/
    , regex
    /*: RegExp*/
    , modifiers
    /*: string*/
    )
    /*: ParseQuery*/
    {
      this._addCondition(key, '$regex', regex);

      if (!modifiers) {
        modifiers = '';
      }

      if (regex.ignoreCase) {
        modifiers += 'i';
      }

      if (regex.multiline) {
        modifiers += 'm';
      }

      if (modifiers.length) {
        this._addCondition(key, '$options', modifiers);
      }

      return this;
    }
    /**
     * Adds a constraint that requires that a key's value matches a Parse.Query
     * constraint.
     * @param {String} key The key that the contains the object to match the
     *                     query.
     * @param {Parse.Query} query The query that should match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "matchesQuery",
    value: function (key
    /*: string*/
    , query
    /*: ParseQuery*/
    )
    /*: ParseQuery*/
    {
      var queryJSON = query.toJSON();
      queryJSON.className = query.className;
      return this._addCondition(key, '$inQuery', queryJSON);
    }
    /**
     * Adds a constraint that requires that a key's value not matches a
     * Parse.Query constraint.
     * @param {String} key The key that the contains the object to match the
     *                     query.
     * @param {Parse.Query} query The query that should not match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "doesNotMatchQuery",
    value: function (key
    /*: string*/
    , query
    /*: ParseQuery*/
    )
    /*: ParseQuery*/
    {
      var queryJSON = query.toJSON();
      queryJSON.className = query.className;
      return this._addCondition(key, '$notInQuery', queryJSON);
    }
    /**
     * Adds a constraint that requires that a key's value matches a value in
     * an object returned by a different Parse.Query.
     * @param {String} key The key that contains the value that is being
     *                     matched.
     * @param {String} queryKey The key in the objects returned by the query to
     *                          match against.
     * @param {Parse.Query} query The query to run.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "matchesKeyInQuery",
    value: function (key
    /*: string*/
    , queryKey
    /*: string*/
    , query
    /*: ParseQuery*/
    )
    /*: ParseQuery*/
    {
      var queryJSON = query.toJSON();
      queryJSON.className = query.className;
      return this._addCondition(key, '$select', {
        key: queryKey,
        query: queryJSON
      });
    }
    /**
     * Adds a constraint that requires that a key's value not match a value in
     * an object returned by a different Parse.Query.
     * @param {String} key The key that contains the value that is being
     *                     excluded.
     * @param {String} queryKey The key in the objects returned by the query to
     *                          match against.
     * @param {Parse.Query} query The query to run.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "doesNotMatchKeyInQuery",
    value: function (key
    /*: string*/
    , queryKey
    /*: string*/
    , query
    /*: ParseQuery*/
    )
    /*: ParseQuery*/
    {
      var queryJSON = query.toJSON();
      queryJSON.className = query.className;
      return this._addCondition(key, '$dontSelect', {
        key: queryKey,
        query: queryJSON
      });
    }
    /**
     * Adds a constraint for finding string values that contain a provided
     * string.  This may be slow for large datasets.
     * @param {String} key The key that the string to match is stored in.
     * @param {String} substring The substring that the value must contain.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "contains",
    value: function (key
    /*: string*/
    , value
    /*: string*/
    )
    /*: ParseQuery*/
    {
      if (typeof value !== 'string') {
        throw new Error('The value being searched for must be a string.');
      }

      return this._addCondition(key, '$regex', quote(value));
    }
    /**
    * Adds a constraint for finding string values that contain a provided
    * string. This may be slow for large datasets. Requires Parse-Server > 2.5.0
    *
    * In order to sort you must use select and ascending ($score is required)
    *  <pre>
    *   query.fullText('field', 'term');
    *   query.ascending('$score');
    *   query.select('$score');
    *  </pre>
    *
    * To retrieve the weight / rank
    *  <pre>
    *   object->get('score');
    *  </pre>
    *
    * You can define optionals by providing an object as a third parameter
    *  <pre>
    *   query.fullText('field', 'term', { language: 'es', diacriticSensitive: true });
    *  </pre>
    *
    * @param {String} key The key that the string to match is stored in.
    * @param {String} value The string to search
    * @param {Object} options (Optional)
    * @param {String} options.language The language that determines the list of stop words for the search and the rules for the stemmer and tokenizer.
    * @param {Boolean} options.caseSensitive A boolean flag to enable or disable case sensitive search.
    * @param {Boolean} options.diacriticSensitive A boolean flag to enable or disable diacritic sensitive search.
    * @return {Parse.Query} Returns the query, so you can chain this call.
    */

  }, {
    key: "fullText",
    value: function (key
    /*: string*/
    , value
    /*: string*/
    , options
    /*: ?Object*/
    )
    /*: ParseQuery*/
    {
      options = options || {};

      if (!key) {
        throw new Error('A key is required.');
      }

      if (!value) {
        throw new Error('A search term is required');
      }

      if (typeof value !== 'string') {
        throw new Error('The value being searched for must be a string.');
      }

      var fullOptions = {};
      fullOptions.$term = value;

      for (var option in options) {
        switch (option) {
          case 'language':
            fullOptions.$language = options[option];
            break;

          case 'caseSensitive':
            fullOptions.$caseSensitive = options[option];
            break;

          case 'diacriticSensitive':
            fullOptions.$diacriticSensitive = options[option];
            break;

          default:
            throw new Error("Unknown option: ".concat(option));
        }
      }

      return this._addCondition(key, '$text', {
        $search: fullOptions
      });
    }
    /**
     * Method to sort the full text search by text score
     *
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "sortByTextScore",
    value: function () {
      this.ascending('$score');
      this.select(['$score']);
      return this;
    }
    /**
     * Adds a constraint for finding string values that start with a provided
     * string.  This query will use the backend index, so it will be fast even
     * for large datasets.
     * @param {String} key The key that the string to match is stored in.
     * @param {String} prefix The substring that the value must start with.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "startsWith",
    value: function (key
    /*: string*/
    , value
    /*: string*/
    )
    /*: ParseQuery*/
    {
      if (typeof value !== 'string') {
        throw new Error('The value being searched for must be a string.');
      }

      return this._addCondition(key, '$regex', this._regexStartWith(value));
    }
    /**
     * Adds a constraint for finding string values that end with a provided
     * string.  This will be slow for large datasets.
     * @param {String} key The key that the string to match is stored in.
     * @param {String} suffix The substring that the value must end with.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "endsWith",
    value: function (key
    /*: string*/
    , value
    /*: string*/
    )
    /*: ParseQuery*/
    {
      if (typeof value !== 'string') {
        throw new Error('The value being searched for must be a string.');
      }

      return this._addCondition(key, '$regex', quote(value) + '$');
    }
    /**
     * Adds a proximity based constraint for finding objects with key point
     * values near the point given.
     * @param {String} key The key that the Parse.GeoPoint is stored in.
     * @param {Parse.GeoPoint} point The reference Parse.GeoPoint that is used.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "near",
    value: function (key
    /*: string*/
    , point
    /*: ParseGeoPoint*/
    )
    /*: ParseQuery*/
    {
      if (!(point instanceof _ParseGeoPoint.default)) {
        // Try to cast it as a GeoPoint
        point = new _ParseGeoPoint.default(point);
      }

      return this._addCondition(key, '$nearSphere', point);
    }
    /**
     * Adds a proximity based constraint for finding objects with key point
     * values near the point given and within the maximum distance given.
     * @param {String} key The key that the Parse.GeoPoint is stored in.
     * @param {Parse.GeoPoint} point The reference Parse.GeoPoint that is used.
     * @param {Number} maxDistance Maximum distance (in radians) of results to
     *   return.
     * @param {Boolean} sorted A Bool value that is true if results should be
     *   sorted by distance ascending, false is no sorting is required,
     *   defaults to true.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "withinRadians",
    value: function (key
    /*: string*/
    , point
    /*: ParseGeoPoint*/
    , distance
    /*: number*/
    , sorted
    /*: boolean*/
    )
    /*: ParseQuery*/
    {
      if (sorted || sorted === undefined) {
        this.near(key, point);
        return this._addCondition(key, '$maxDistance', distance);
      } else {
        return this._addCondition(key, '$geoWithin', {
          '$centerSphere': [[point.longitude, point.latitude], distance]
        });
      }
    }
    /**
     * Adds a proximity based constraint for finding objects with key point
     * values near the point given and within the maximum distance given.
     * Radius of earth used is 3958.8 miles.
     * @param {String} key The key that the Parse.GeoPoint is stored in.
     * @param {Parse.GeoPoint} point The reference Parse.GeoPoint that is used.
     * @param {Number} maxDistance Maximum distance (in miles) of results to
     *   return.
     * @param {Boolean} sorted A Bool value that is true if results should be
     *   sorted by distance ascending, false is no sorting is required,
     *   defaults to true.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "withinMiles",
    value: function (key
    /*: string*/
    , point
    /*: ParseGeoPoint*/
    , distance
    /*: number*/
    , sorted
    /*: boolean*/
    )
    /*: ParseQuery*/
    {
      return this.withinRadians(key, point, distance / 3958.8, sorted);
    }
    /**
     * Adds a proximity based constraint for finding objects with key point
     * values near the point given and within the maximum distance given.
     * Radius of earth used is 6371.0 kilometers.
     * @param {String} key The key that the Parse.GeoPoint is stored in.
     * @param {Parse.GeoPoint} point The reference Parse.GeoPoint that is used.
     * @param {Number} maxDistance Maximum distance (in kilometers) of results
     *   to return.
     * @param {Boolean} sorted A Bool value that is true if results should be
     *   sorted by distance ascending, false is no sorting is required,
     *   defaults to true.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "withinKilometers",
    value: function (key
    /*: string*/
    , point
    /*: ParseGeoPoint*/
    , distance
    /*: number*/
    , sorted
    /*: boolean*/
    )
    /*: ParseQuery*/
    {
      return this.withinRadians(key, point, distance / 6371.0, sorted);
    }
    /**
     * Adds a constraint to the query that requires a particular key's
     * coordinates be contained within a given rectangular geographic bounding
     * box.
     * @param {String} key The key to be constrained.
     * @param {Parse.GeoPoint} southwest
     *     The lower-left inclusive corner of the box.
     * @param {Parse.GeoPoint} northeast
     *     The upper-right inclusive corner of the box.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "withinGeoBox",
    value: function (key
    /*: string*/
    , southwest
    /*: ParseGeoPoint*/
    , northeast
    /*: ParseGeoPoint*/
    )
    /*: ParseQuery*/
    {
      if (!(southwest instanceof _ParseGeoPoint.default)) {
        southwest = new _ParseGeoPoint.default(southwest);
      }

      if (!(northeast instanceof _ParseGeoPoint.default)) {
        northeast = new _ParseGeoPoint.default(northeast);
      }

      this._addCondition(key, '$within', {
        '$box': [southwest, northeast]
      });

      return this;
    }
    /**
     * Adds a constraint to the query that requires a particular key's
     * coordinates be contained within and on the bounds of a given polygon.
     * Supports closed and open (last point is connected to first) paths
     *
     * Polygon must have at least 3 points
     *
     * @param {String} key The key to be constrained.
     * @param {Array} array of geopoints
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "withinPolygon",
    value: function (key
    /*: string*/
    , points
    /*: Array<Array<number>>*/
    )
    /*: ParseQuery*/
    {
      return this._addCondition(key, '$geoWithin', {
        '$polygon': points
      });
    }
    /**
     * Add a constraint to the query that requires a particular key's
     * coordinates that contains a ParseGeoPoint
     *
     * @param {String} key The key to be constrained.
     * @param {Parse.GeoPoint} GeoPoint
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "polygonContains",
    value: function (key
    /*: string*/
    , point
    /*: ParseGeoPoint*/
    )
    /*: ParseQuery*/
    {
      return this._addCondition(key, '$geoIntersects', {
        '$point': point
      });
    }
    /** Query Orderings **/

    /**
     * Sorts the results in ascending order by the given key.
     *
     * @param {(String|String[]|...String)} key The key to order by, which is a
     * string of comma separated values, or an Array of keys, or multiple keys.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "ascending",
    value: function ()
    /*: ParseQuery*/
    {
      this._order = [];

      for (var _len = arguments.length, keys = new Array(_len), _key5 = 0; _key5 < _len; _key5++) {
        keys[_key5] = arguments[_key5];
      }

      return this.addAscending.apply(this, keys);
    }
    /**
     * Sorts the results in ascending order by the given key,
     * but can also add secondary sort descriptors without overwriting _order.
     *
     * @param {(String|String[]|...String)} key The key to order by, which is a
     * string of comma separated values, or an Array of keys, or multiple keys.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "addAscending",
    value: function ()
    /*: ParseQuery*/
    {
      var _this5 = this;

      if (!this._order) {
        this._order = [];
      }

      for (var _len2 = arguments.length, keys = new Array(_len2), _key6 = 0; _key6 < _len2; _key6++) {
        keys[_key6] = arguments[_key6];
      }

      keys.forEach(function (key) {
        if (Array.isArray(key)) {
          key = key.join();
        }

        _this5._order = _this5._order.concat(key.replace(/\s/g, '').split(','));
      });
      return this;
    }
    /**
     * Sorts the results in descending order by the given key.
     *
     * @param {(String|String[]|...String)} key The key to order by, which is a
     * string of comma separated values, or an Array of keys, or multiple keys.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "descending",
    value: function ()
    /*: ParseQuery*/
    {
      this._order = [];

      for (var _len3 = arguments.length, keys = new Array(_len3), _key7 = 0; _key7 < _len3; _key7++) {
        keys[_key7] = arguments[_key7];
      }

      return this.addDescending.apply(this, keys);
    }
    /**
     * Sorts the results in descending order by the given key,
     * but can also add secondary sort descriptors without overwriting _order.
     *
     * @param {(String|String[]|...String)} key The key to order by, which is a
     * string of comma separated values, or an Array of keys, or multiple keys.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "addDescending",
    value: function ()
    /*: ParseQuery*/
    {
      var _this6 = this;

      if (!this._order) {
        this._order = [];
      }

      for (var _len4 = arguments.length, keys = new Array(_len4), _key8 = 0; _key8 < _len4; _key8++) {
        keys[_key8] = arguments[_key8];
      }

      keys.forEach(function (key) {
        if (Array.isArray(key)) {
          key = key.join();
        }

        _this6._order = _this6._order.concat(key.replace(/\s/g, '').split(',').map(function (k) {
          return '-' + k;
        }));
      });
      return this;
    }
    /** Query Options **/

    /**
     * Sets the number of results to skip before returning any results.
     * This is useful for pagination.
     * Default is to skip zero results.
     * @param {Number} n the number of results to skip.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "skip",
    value: function (n
    /*: number*/
    )
    /*: ParseQuery*/
    {
      if (typeof n !== 'number' || n < 0) {
        throw new Error('You can only skip by a positive number');
      }

      this._skip = n;
      return this;
    }
    /**
     * Sets the limit of the number of results to return. The default limit is
     * 100, with a maximum of 1000 results being returned at a time.
     * @param {Number} n the number of results to limit to.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "limit",
    value: function (n
    /*: number*/
    )
    /*: ParseQuery*/
    {
      if (typeof n !== 'number') {
        throw new Error('You can only set the limit to a numeric value');
      }

      this._limit = n;
      return this;
    }
    /**
     * Sets the flag to include with response the total number of objects satisfying this query,
     * despite limits/skip. Might be useful for pagination.
     * Note that result of this query will be wrapped as an object with
     *`results`: holding {ParseObject} array and `count`: integer holding total number
     * @param {boolean} b false - disable, true - enable.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "withCount",
    value: function ()
    /*: ParseQuery*/
    {
      var includeCount
      /*: boolean*/
      = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (typeof includeCount !== 'boolean') {
        throw new Error('You can only set withCount to a boolean value');
      }

      this._count = includeCount;
      return this;
    }
    /**
     * Includes nested Parse.Objects for the provided key.  You can use dot
     * notation to specify which fields in the included object are also fetched.
     *
     * You can include all nested Parse.Objects by passing in '*'.
     * Requires Parse Server 3.0.0+
     * <pre>query.include('*');</pre>
     *
     * @param {...String|Array<String>} key The name(s) of the key(s) to include.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "include",
    value: function ()
    /*: ParseQuery*/
    {
      var _this7 = this;

      for (var _len5 = arguments.length, keys = new Array(_len5), _key9 = 0; _key9 < _len5; _key9++) {
        keys[_key9] = arguments[_key9];
      }

      keys.forEach(function (key) {
        if (Array.isArray(key)) {
          _this7._include = _this7._include.concat(key);
        } else {
          _this7._include.push(key);
        }
      });
      return this;
    }
    /**
     * Includes all nested Parse.Objects.
     *
     * Requires Parse Server 3.0.0+
     *
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "includeAll",
    value: function ()
    /*: ParseQuery*/
    {
      return this.include('*');
    }
    /**
     * Restricts the fields of the returned Parse.Objects to include only the
     * provided keys.  If this is called multiple times, then all of the keys
     * specified in each of the calls will be included.
     * @param {...String|Array<String>} keys The name(s) of the key(s) to include.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "select",
    value: function ()
    /*: ParseQuery*/
    {
      var _this8 = this;

      if (!this._select) {
        this._select = [];
      }

      for (var _len6 = arguments.length, keys = new Array(_len6), _key10 = 0; _key10 < _len6; _key10++) {
        keys[_key10] = arguments[_key10];
      }

      keys.forEach(function (key) {
        if (Array.isArray(key)) {
          _this8._select = _this8._select.concat(key);
        } else {
          _this8._select.push(key);
        }
      });
      return this;
    }
    /**
     * Restricts the fields of the returned Parse.Objects to all keys except the
     * provided keys. Exclude takes precedence over select and include.
     *
     * Requires Parse Server 3.6.0+
     *
     * @param {...String|Array<String>} keys The name(s) of the key(s) to exclude.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "exclude",
    value: function ()
    /*: ParseQuery*/
    {
      var _this9 = this;

      for (var _len7 = arguments.length, keys = new Array(_len7), _key11 = 0; _key11 < _len7; _key11++) {
        keys[_key11] = arguments[_key11];
      }

      keys.forEach(function (key) {
        if (Array.isArray(key)) {
          _this9._exclude = _this9._exclude.concat(key);
        } else {
          _this9._exclude.push(key);
        }
      });
      return this;
    }
    /**
     * Changes the read preference that the backend will use when performing the query to the database.
     * @param {String} readPreference The read preference for the main query.
     * @param {String} includeReadPreference The read preference for the queries to include pointers.
     * @param {String} subqueryReadPreference The read preference for the sub queries.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "readPreference",
    value: function (_readPreference
    /*: string*/
    , includeReadPreference
    /*:: ?: string*/
    , subqueryReadPreference
    /*:: ?: string*/
    )
    /*: ParseQuery*/
    {
      this._readPreference = _readPreference;
      this._includeReadPreference = includeReadPreference;
      this._subqueryReadPreference = subqueryReadPreference;
      return this;
    }
    /**
     * Subscribe this query to get liveQuery updates
     *
     * @param {String} sessionToken (optional) Defaults to the currentUser
     * @return {Promise<LiveQuerySubscription>} Returns the liveQuerySubscription, it's an event emitter
     * which can be used to get liveQuery updates.
     */

  }, {
    key: "subscribe",
    value: function () {
      var _subscribe = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(sessionToken
      /*:: ?: string*/
      ) {
        var currentUser, liveQueryClient, subscription;
        return _regenerator.default.wrap(function (_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _CoreManager.default.getUserController().currentUserAsync();

              case 2:
                currentUser = _context2.sent;

                if (!sessionToken) {
                  sessionToken = currentUser ? currentUser.getSessionToken() : undefined;
                }

                _context2.next = 6;
                return _CoreManager.default.getLiveQueryController().getDefaultLiveQueryClient();

              case 6:
                liveQueryClient = _context2.sent;

                if (liveQueryClient.shouldOpen()) {
                  liveQueryClient.open();
                }

                subscription = liveQueryClient.subscribe(this, sessionToken);
                return _context2.abrupt("return", subscription);

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function () {
        return _subscribe.apply(this, arguments);
      };
    }()
    /**
     * Constructs a Parse.Query that is the OR of the passed in queries.  For
     * example:
     * <pre>var compoundQuery = Parse.Query.or(query1, query2, query3);</pre>
     *
     * will create a compoundQuery that is an or of the query1, query2, and
     * query3.
     * @param {...Parse.Query} var_args The list of queries to OR.
     * @static
     * @return {Parse.Query} The query that is the OR of the passed in queries.
     */

  }, {
    key: "fromLocalDatastore",

    /**
     * Changes the source of this query to all pinned objects.
     *
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
    value: function ()
    /*: ParseQuery*/
    {
      return this.fromPinWithName(null);
    }
    /**
     * Changes the source of this query to the default group of pinned objects.
     *
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "fromPin",
    value: function ()
    /*: ParseQuery*/
    {
      return this.fromPinWithName(_LocalDatastoreUtils.DEFAULT_PIN);
    }
    /**
     * Changes the source of this query to a specific group of pinned objects.
     *
     * @param {String} name The name of query source.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */

  }, {
    key: "fromPinWithName",
    value: function (name
    /*:: ?: string*/
    )
    /*: ParseQuery*/
    {
      var localDatastore = _CoreManager.default.getLocalDatastore();

      if (localDatastore.checkIfEnabled()) {
        this._queriesLocalDatastore = true;
        this._localDatastorePinName = name;
      }

      return this;
    }
  }], [{
    key: "fromJSON",
    value: function (className
    /*: string*/
    , json
    /*: QueryJSON*/
    )
    /*: ParseQuery*/
    {
      var query = new ParseQuery(className);
      return query.withJSON(json);
    }
  }, {
    key: "or",
    value: function ()
    /*: ParseQuery*/
    {
      for (var _len8 = arguments.length, queries = new Array(_len8), _key12 = 0; _key12 < _len8; _key12++) {
        queries[_key12] = arguments[_key12];
      }

      var className = _getClassNameFromQueries(queries);

      var query = new ParseQuery(className);

      query._orQuery(queries);

      return query;
    }
    /**
     * Constructs a Parse.Query that is the AND of the passed in queries.  For
     * example:
     * <pre>var compoundQuery = Parse.Query.and(query1, query2, query3);</pre>
     *
     * will create a compoundQuery that is an and of the query1, query2, and
     * query3.
     * @param {...Parse.Query} var_args The list of queries to AND.
     * @static
     * @return {Parse.Query} The query that is the AND of the passed in queries.
     */

  }, {
    key: "and",
    value: function ()
    /*: ParseQuery*/
    {
      for (var _len9 = arguments.length, queries = new Array(_len9), _key13 = 0; _key13 < _len9; _key13++) {
        queries[_key13] = arguments[_key13];
      }

      var className = _getClassNameFromQueries(queries);

      var query = new ParseQuery(className);

      query._andQuery(queries);

      return query;
    }
    /**
     * Constructs a Parse.Query that is the NOR of the passed in queries.  For
     * example:
     * <pre>const compoundQuery = Parse.Query.nor(query1, query2, query3);</pre>
     *
     * will create a compoundQuery that is a nor of the query1, query2, and
     * query3.
     * @param {...Parse.Query} var_args The list of queries to NOR.
     * @static
     * @return {Parse.Query} The query that is the NOR of the passed in queries.
     */

  }, {
    key: "nor",
    value: function ()
    /*: ParseQuery*/
    {
      for (var _len10 = arguments.length, queries = new Array(_len10), _key14 = 0; _key14 < _len10; _key14++) {
        queries[_key14] = arguments[_key14];
      }

      var className = _getClassNameFromQueries(queries);

      var query = new ParseQuery(className);

      query._norQuery(queries);

      return query;
    }
  }]);
  return ParseQuery;
}();

var DefaultController = {
  find: function (className
  /*: string*/
  , params
  /*: QueryJSON*/
  , options
  /*: RequestOptions*/
  )
  /*: Promise<Array<ParseObject>>*/
  {
    var RESTController = _CoreManager.default.getRESTController();

    return RESTController.request('GET', 'classes/' + className, params, options);
  },
  aggregate: function (className
  /*: string*/
  , params
  /*: any*/
  , options
  /*: RequestOptions*/
  )
  /*: Promise<Array<mixed>>*/
  {
    var RESTController = _CoreManager.default.getRESTController();

    return RESTController.request('GET', 'aggregate/' + className, params, options);
  }
};

_CoreManager.default.setQueryController(DefaultController);

var _default = ParseQuery;
exports.default = _default;
},{"./CoreManager":4,"./LocalDatastoreUtils":12,"./OfflineQuery":14,"./ParseError":18,"./ParseGeoPoint":20,"./ParseObject":23,"./encode":42,"./promiseUtils":47,"@babel/runtime/helpers/asyncToGenerator":53,"@babel/runtime/helpers/classCallCheck":54,"@babel/runtime/helpers/createClass":56,"@babel/runtime/helpers/defineProperty":57,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/typeof":73,"@babel/runtime/regenerator":76}],27:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/defineProperty"));

var _ParseOp = _dereq_("./ParseOp");

var _ParseObject = _interopRequireDefault(_dereq_("./ParseObject"));

var _ParseQuery = _interopRequireDefault(_dereq_("./ParseQuery"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

/**
 * Creates a new Relation for the given parent object and key. This
 * constructor should rarely be used directly, but rather created by
 * Parse.Object.relation.
 *
 * <p>
 * A class that is used to access all of the children of a many-to-many
 * relationship.  Each instance of Parse.Relation is associated with a
 * particular parent object and key.
 * </p>
 * @alias Parse.Relation
 */


var ParseRelation =
/*#__PURE__*/
function () {
  /**
   * @param {Parse.Object} parent The parent of this relation.
   * @param {String} key The key for this relation on the parent.
   */
  function ParseRelation(parent
  /*: ?ParseObject*/
  , key
  /*: ?string*/
  ) {
    (0, _classCallCheck2.default)(this, ParseRelation);
    (0, _defineProperty2.default)(this, "parent", void 0);
    (0, _defineProperty2.default)(this, "key", void 0);
    (0, _defineProperty2.default)(this, "targetClassName", void 0);
    this.parent = parent;
    this.key = key;
    this.targetClassName = null;
  }
  /*
   * Makes sure that this relation has the right parent and key.
   */


  (0, _createClass2.default)(ParseRelation, [{
    key: "_ensureParentAndKey",
    value: function (parent
    /*: ParseObject*/
    , key
    /*: string*/
    ) {
      this.key = this.key || key;

      if (this.key !== key) {
        throw new Error('Internal Error. Relation retrieved from two different keys.');
      }

      if (this.parent) {
        if (this.parent.className !== parent.className) {
          throw new Error('Internal Error. Relation retrieved from two different Objects.');
        }

        if (this.parent.id) {
          if (this.parent.id !== parent.id) {
            throw new Error('Internal Error. Relation retrieved from two different Objects.');
          }
        } else if (parent.id) {
          this.parent = parent;
        }
      } else {
        this.parent = parent;
      }
    }
    /**
     * Adds a Parse.Object or an array of Parse.Objects to the relation.
      * @param {} objects The item or items to add.
     */

  }, {
    key: "add",
    value: function (objects
    /*: ParseObject | Array<ParseObject | string>*/
    )
    /*: ParseObject*/
    {
      if (!Array.isArray(objects)) {
        objects = [objects];
      }

      var change = new _ParseOp.RelationOp(objects, []);
      var parent = this.parent;

      if (!parent) {
        throw new Error('Cannot add to a Relation without a parent');
      }

      parent.set(this.key, change);
      this.targetClassName = change._targetClassName;
      return parent;
    }
    /**
     * Removes a Parse.Object or an array of Parse.Objects from this relation.
      * @param {} objects The item or items to remove.
     */

  }, {
    key: "remove",
    value: function (objects
    /*: ParseObject | Array<ParseObject | string>*/
    ) {
      if (!Array.isArray(objects)) {
        objects = [objects];
      }

      var change = new _ParseOp.RelationOp([], objects);

      if (!this.parent) {
        throw new Error('Cannot remove from a Relation without a parent');
      }

      this.parent.set(this.key, change);
      this.targetClassName = change._targetClassName;
    }
    /**
     * Returns a JSON version of the object suitable for saving to disk.
      * @return {Object}
     */

  }, {
    key: "toJSON",
    value: function ()
    /*: { __type: 'Relation', className: ?string }*/
    {
      return {
        __type: 'Relation',
        className: this.targetClassName
      };
    }
    /**
     * Returns a Parse.Query that is limited to objects in this
     * relation.
      * @return {Parse.Query}
     */

  }, {
    key: "query",
    value: function query()
    /*: ParseQuery*/
    {
      var query;
      var parent = this.parent;

      if (!parent) {
        throw new Error('Cannot construct a query for a Relation without a parent');
      }

      if (!this.targetClassName) {
        query = new _ParseQuery.default(parent.className);
        query._extraOptions.redirectClassNameForKey = this.key;
      } else {
        query = new _ParseQuery.default(this.targetClassName);
      }

      query._addCondition('$relatedTo', 'object', {
        __type: 'Pointer',
        className: parent.className,
        objectId: parent.id
      });

      query._addCondition('$relatedTo', 'key', this.key);

      return query;
    }
  }]);
  return ParseRelation;
}();

var _default = ParseRelation;
exports.default = _default;
},{"./ParseObject":23,"./ParseOp":24,"./ParseQuery":26,"@babel/runtime/helpers/classCallCheck":54,"@babel/runtime/helpers/createClass":56,"@babel/runtime/helpers/defineProperty":57,"@babel/runtime/helpers/interopRequireDefault":61}],28:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/inherits"));

var _ParseACL = _interopRequireDefault(_dereq_("./ParseACL"));

var _ParseError = _interopRequireDefault(_dereq_("./ParseError"));

var _ParseObject2 = _interopRequireDefault(_dereq_("./ParseObject"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

/**
 * Represents a Role on the Parse server. Roles represent groupings of
 * Users for the purposes of granting permissions (e.g. specifying an ACL
 * for an Object). Roles are specified by their sets of child users and
 * child roles, all of which are granted any permissions that the parent
 * role has.
 *
 * <p>Roles must have a name (which cannot be changed after creation of the
 * role), and must specify an ACL.</p>
 * @alias Parse.Role
 * @extends Parse.Object
 */


var ParseRole =
/*#__PURE__*/
function (_ParseObject) {
  (0, _inherits2.default)(ParseRole, _ParseObject);
  /**
   * @param {String} name The name of the Role to create.
   * @param {Parse.ACL} acl The ACL for this role. Roles must have an ACL.
   * A Parse.Role is a local representation of a role persisted to the Parse
   * cloud.
   */

  function ParseRole(name
  /*: string*/
  , acl
  /*: ParseACL*/
  ) {
    var _this;

    (0, _classCallCheck2.default)(this, ParseRole);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ParseRole).call(this, '_Role'));

    if (typeof name === 'string' && acl instanceof _ParseACL.default) {
      _this.setName(name);

      _this.setACL(acl);
    }

    return _this;
  }
  /**
   * Gets the name of the role.  You can alternatively call role.get("name")
   *
    * @return {String} the name of the role.
   */


  (0, _createClass2.default)(ParseRole, [{
    key: "getName",
    value: function ()
    /*: ?string*/
    {
      var name = this.get('name');

      if (name == null || typeof name === 'string') {
        return name;
      }

      return '';
    }
    /**
     * Sets the name for a role. This value must be set before the role has
     * been saved to the server, and cannot be set once the role has been
     * saved.
     *
     * <p>
     *   A role's name can only contain alphanumeric characters, _, -, and
     *   spaces.
     * </p>
     *
     * <p>This is equivalent to calling role.set("name", name)</p>
     *
      * @param {String} name The name of the role.
     * @param {Object} options Standard options object with success and error
     *     callbacks.
     */

  }, {
    key: "setName",
    value: function (name
    /*: string*/
    , options
    /*:: ?: mixed*/
    )
    /*: ParseObject | boolean*/
    {
      return this.set('name', name, options);
    }
    /**
     * Gets the Parse.Relation for the Parse.Users that are direct
     * children of this role. These users are granted any privileges that this
     * role has been granted (e.g. read or write access through ACLs). You can
     * add or remove users from the role through this relation.
     *
     * <p>This is equivalent to calling role.relation("users")</p>
     *
      * @return {Parse.Relation} the relation for the users belonging to this
     *     role.
     */

  }, {
    key: "getUsers",
    value: function ()
    /*: ParseRelation*/
    {
      return this.relation('users');
    }
    /**
     * Gets the Parse.Relation for the Parse.Roles that are direct
     * children of this role. These roles' users are granted any privileges that
     * this role has been granted (e.g. read or write access through ACLs). You
     * can add or remove child roles from this role through this relation.
     *
     * <p>This is equivalent to calling role.relation("roles")</p>
     *
      * @return {Parse.Relation} the relation for the roles belonging to this
     *     role.
     */

  }, {
    key: "getRoles",
    value: function ()
    /*: ParseRelation*/
    {
      return this.relation('roles');
    }
  }, {
    key: "validate",
    value: function (attrs
    /*: AttributeMap*/
    , options
    /*:: ?: mixed*/
    )
    /*: ParseError | boolean*/
    {
      var isInvalid = (0, _get2.default)((0, _getPrototypeOf2.default)(ParseRole.prototype), "validate", this).call(this, attrs, options);

      if (isInvalid) {
        return isInvalid;
      }

      if ('name' in attrs && attrs.name !== this.getName()) {
        var newName = attrs.name;

        if (this.id && this.id !== attrs.objectId) {
          // Check to see if the objectId being set matches this.id
          // This happens during a fetch -- the id is set before calling fetch
          // Let the name be set in this case
          return new _ParseError.default(_ParseError.default.OTHER_CAUSE, 'A role\'s name can only be set before it has been saved.');
        }

        if (typeof newName !== 'string') {
          return new _ParseError.default(_ParseError.default.OTHER_CAUSE, 'A role\'s name must be a String.');
        }

        if (!/^[0-9a-zA-Z\-_ ]+$/.test(newName)) {
          return new _ParseError.default(_ParseError.default.OTHER_CAUSE, 'A role\'s name can be only contain alphanumeric characters, _, ' + '-, and spaces.');
        }
      }

      return false;
    }
  }]);
  return ParseRole;
}(_ParseObject2.default);

_ParseObject2.default.registerSubclass('_Role', ParseRole);

var _default = ParseRole;
exports.default = _default;
},{"./ParseACL":16,"./ParseError":18,"./ParseObject":23,"@babel/runtime/helpers/classCallCheck":54,"@babel/runtime/helpers/createClass":56,"@babel/runtime/helpers/get":58,"@babel/runtime/helpers/getPrototypeOf":59,"@babel/runtime/helpers/inherits":60,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/possibleConstructorReturn":68}],29:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/defineProperty"));

var _CoreManager = _interopRequireDefault(_dereq_("./CoreManager"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */


var FIELD_TYPES = ['String', 'Number', 'Boolean', 'Date', 'File', 'GeoPoint', 'Polygon', 'Array', 'Object', 'Pointer', 'Relation'];
/**
 * A Parse.Schema object is for handling schema data from Parse.
 * <p>All the schemas methods require MasterKey.
 *
 * <pre>
 * const schema = new Parse.Schema('MyClass');
 * schema.addString('field');
 * schema.addIndex('index_name', {'field', 1});
 * schema.save();
 * </pre>
 * </p>
 * @alias Parse.Schema
 */

var ParseSchema =
/*#__PURE__*/
function () {
  /**
   * @param {String} className Parse Class string.
   */
  function ParseSchema(className
  /*: string*/
  ) {
    (0, _classCallCheck2.default)(this, ParseSchema);
    (0, _defineProperty2.default)(this, "className", void 0);
    (0, _defineProperty2.default)(this, "_fields", void 0);
    (0, _defineProperty2.default)(this, "_indexes", void 0);

    if (typeof className === 'string') {
      if (className === 'User' && _CoreManager.default.get('PERFORM_USER_REWRITE')) {
        this.className = '_User';
      } else {
        this.className = className;
      }
    }

    this._fields = {};
    this._indexes = {};
  }
  /**
   * Static method to get all schemas
   *
   * @param {Object} options
   * Valid options are:<ul>
   *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
   *     be used for this request.
   *   <li>sessionToken: A valid session token, used for making a request on
   *       behalf of a specific user.
   * </ul>
   *
   * @return {Promise} A promise that is resolved with the result when
   * the query completes.
   */


  (0, _createClass2.default)(ParseSchema, [{
    key: "get",

    /**
     * Get the Schema from Parse
     *
     * @param {Object} options
     * Valid options are:<ul>
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     *
     * @return {Promise} A promise that is resolved with the result when
     * the query completes.
     */
    value: function (options
    /*: FullOptions*/
    ) {
      this.assertClassName();
      options = options || {};

      var controller = _CoreManager.default.getSchemaController();

      return controller.get(this.className, options).then(function (response) {
        if (!response) {
          throw new Error('Schema not found.');
        }

        return response;
      });
    }
    /**
     * Create a new Schema on Parse
     *
     * @param {Object} options
     * Valid options are:<ul>
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     *
     * @return {Promise} A promise that is resolved with the result when
     * the query completes.
     */

  }, {
    key: "save",
    value: function (options
    /*: FullOptions*/
    ) {
      this.assertClassName();
      options = options || {};

      var controller = _CoreManager.default.getSchemaController();

      var params = {
        className: this.className,
        fields: this._fields,
        indexes: this._indexes
      };
      return controller.create(this.className, params, options).then(function (response) {
        return response;
      });
    }
    /**
     * Update a Schema on Parse
     *
     * @param {Object} options
     * Valid options are:<ul>
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     *
     * @return {Promise} A promise that is resolved with the result when
     * the query completes.
     */

  }, {
    key: "update",
    value: function (options
    /*: FullOptions*/
    ) {
      this.assertClassName();
      options = options || {};

      var controller = _CoreManager.default.getSchemaController();

      var params = {
        className: this.className,
        fields: this._fields,
        indexes: this._indexes
      };
      this._fields = {};
      this._indexes = {};
      return controller.update(this.className, params, options).then(function (response) {
        return response;
      });
    }
    /**
     * Removing a Schema from Parse
     * Can only be used on Schema without objects
     *
     * @param {Object} options
     * Valid options are:<ul>
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     *
     * @return {Promise} A promise that is resolved with the result when
     * the query completes.
     */

  }, {
    key: "delete",
    value: function (options
    /*: FullOptions*/
    ) {
      this.assertClassName();
      options = options || {};

      var controller = _CoreManager.default.getSchemaController();

      return controller.delete(this.className, options).then(function (response) {
        return response;
      });
    }
    /**
     * Removes all objects from a Schema (class) in Parse.
     * EXERCISE CAUTION, running this will delete all objects for this schema and cannot be reversed
     * @return {Promise} A promise that is resolved with the result when
     * the query completes.
     */

  }, {
    key: "purge",
    value: function () {
      this.assertClassName();

      var controller = _CoreManager.default.getSchemaController();

      return controller.purge(this.className).then(function (response) {
        return response;
      });
    }
    /**
     * Assert if ClassName has been filled
     * @private
     */

  }, {
    key: "assertClassName",
    value: function () {
      if (!this.className) {
        throw new Error('You must set a Class Name before making any request.');
      }
    }
    /**
     * Adding a Field to Create / Update a Schema
     *
     * @param {String} name Name of the field that will be created on Parse
     * @param {String} type TheCan be a (String|Number|Boolean|Date|Parse.File|Parse.GeoPoint|Array|Object|Pointer|Parse.Relation)
     * @return {Parse.Schema} Returns the schema, so you can chain this call.
     */

  }, {
    key: "addField",
    value: function (name
    /*: string*/
    , type
    /*: string*/
    ) {
      type = type || 'String';

      if (!name) {
        throw new Error('field name may not be null.');
      }

      if (FIELD_TYPES.indexOf(type) === -1) {
        throw new Error("".concat(type, " is not a valid type."));
      }

      this._fields[name] = {
        type: type
      };
      return this;
    }
    /**
     * Adding an Index to Create / Update a Schema
     *
     * @param {String} name Name of the field that will be created on Parse
     * @param {String} type Can be a (String|Number|Boolean|Date|Parse.File|Parse.GeoPoint|Array|Object|Pointer|Parse.Relation)
     * @return {Parse.Schema} Returns the schema, so you can chain this call.
     */

  }, {
    key: "addIndex",
    value: function (name
    /*: string*/
    , index
    /*: any*/
    ) {
      if (!name) {
        throw new Error('index name may not be null.');
      }

      if (!index) {
        throw new Error('index may not be null.');
      }

      this._indexes[name] = index;
      return this;
    }
    /**
     * Adding String Field
     *
     * @param {String} name Name of the field that will be created on Parse
     * @return {Parse.Schema} Returns the schema, so you can chain this call.
     */

  }, {
    key: "addString",
    value: function (name
    /*: string*/
    ) {
      return this.addField(name, 'String');
    }
    /**
     * Adding Number Field
     *
     * @param {String} name Name of the field that will be created on Parse
     * @return {Parse.Schema} Returns the schema, so you can chain this call.
     */

  }, {
    key: "addNumber",
    value: function (name
    /*: string*/
    ) {
      return this.addField(name, 'Number');
    }
    /**
     * Adding Boolean Field
     *
     * @param {String} name Name of the field that will be created on Parse
     * @return {Parse.Schema} Returns the schema, so you can chain this call.
     */

  }, {
    key: "addBoolean",
    value: function (name
    /*: string*/
    ) {
      return this.addField(name, 'Boolean');
    }
    /**
     * Adding Date Field
     *
     * @param {String} name Name of the field that will be created on Parse
     * @return {Parse.Schema} Returns the schema, so you can chain this call.
     */

  }, {
    key: "addDate",
    value: function (name
    /*: string*/
    ) {
      return this.addField(name, 'Date');
    }
    /**
     * Adding File Field
     *
     * @param {String} name Name of the field that will be created on Parse
     * @return {Parse.Schema} Returns the schema, so you can chain this call.
     */

  }, {
    key: "addFile",
    value: function (name
    /*: string*/
    ) {
      return this.addField(name, 'File');
    }
    /**
     * Adding GeoPoint Field
     *
     * @param {String} name Name of the field that will be created on Parse
     * @return {Parse.Schema} Returns the schema, so you can chain this call.
     */

  }, {
    key: "addGeoPoint",
    value: function (name
    /*: string*/
    ) {
      return this.addField(name, 'GeoPoint');
    }
    /**
     * Adding Polygon Field
     *
     * @param {String} name Name of the field that will be created on Parse
     * @return {Parse.Schema} Returns the schema, so you can chain this call.
     */

  }, {
    key: "addPolygon",
    value: function (name
    /*: string*/
    ) {
      return this.addField(name, 'Polygon');
    }
    /**
     * Adding Array Field
     *
     * @param {String} name Name of the field that will be created on Parse
     * @return {Parse.Schema} Returns the schema, so you can chain this call.
     */

  }, {
    key: "addArray",
    value: function (name
    /*: string*/
    ) {
      return this.addField(name, 'Array');
    }
    /**
     * Adding Object Field
     *
     * @param {String} name Name of the field that will be created on Parse
     * @return {Parse.Schema} Returns the schema, so you can chain this call.
     */

  }, {
    key: "addObject",
    value: function (name
    /*: string*/
    ) {
      return this.addField(name, 'Object');
    }
    /**
     * Adding Pointer Field
     *
     * @param {String} name Name of the field that will be created on Parse
     * @param {String} targetClass Name of the target Pointer Class
     * @return {Parse.Schema} Returns the schema, so you can chain this call.
     */

  }, {
    key: "addPointer",
    value: function (name
    /*: string*/
    , targetClass
    /*: string*/
    ) {
      if (!name) {
        throw new Error('field name may not be null.');
      }

      if (!targetClass) {
        throw new Error('You need to set the targetClass of the Pointer.');
      }

      this._fields[name] = {
        type: 'Pointer',
        targetClass: targetClass
      };
      return this;
    }
    /**
     * Adding Relation Field
     *
     * @param {String} name Name of the field that will be created on Parse
     * @param {String} targetClass Name of the target Pointer Class
     * @return {Parse.Schema} Returns the schema, so you can chain this call.
     */

  }, {
    key: "addRelation",
    value: function (name
    /*: string*/
    , targetClass
    /*: string*/
    ) {
      if (!name) {
        throw new Error('field name may not be null.');
      }

      if (!targetClass) {
        throw new Error('You need to set the targetClass of the Relation.');
      }

      this._fields[name] = {
        type: 'Relation',
        targetClass: targetClass
      };
      return this;
    }
    /**
     * Deleting a Field to Update on a Schema
     *
     * @param {String} name Name of the field that will be created on Parse
     * @param {String} targetClass Name of the target Pointer Class
     * @return {Parse.Schema} Returns the schema, so you can chain this call.
     */

  }, {
    key: "deleteField",
    value: function (name
    /*: string*/
    ) {
      this._fields[name] = {
        __op: 'Delete'
      };
    }
    /**
     * Deleting an Index to Update on a Schema
     *
     * @param {String} name Name of the field that will be created on Parse
     * @param {String} targetClass Name of the target Pointer Class
     * @return {Parse.Schema} Returns the schema, so you can chain this call.
     */

  }, {
    key: "deleteIndex",
    value: function (name
    /*: string*/
    ) {
      this._indexes[name] = {
        __op: 'Delete'
      };
    }
  }], [{
    key: "all",
    value: function (options
    /*: FullOptions*/
    ) {
      options = options || {};

      var controller = _CoreManager.default.getSchemaController();

      return controller.get('', options).then(function (response) {
        if (response.results.length === 0) {
          throw new Error('Schema not found.');
        }

        return response.results;
      });
    }
  }]);
  return ParseSchema;
}();

var DefaultController = {
  send: function (className
  /*: string*/
  , method
  /*: string*/
  , params
  /*: any*/
  , options
  /*: RequestOptions*/
  )
  /*: Promise*/
  {
    var RESTController = _CoreManager.default.getRESTController();

    var requestOptions = {
      useMasterKey: true
    };

    if (options.hasOwnProperty('sessionToken')) {
      requestOptions.sessionToken = options.sessionToken;
    }

    return RESTController.request(method, "schemas/".concat(className), params, requestOptions);
  },
  get: function (className
  /*: string*/
  , options
  /*: RequestOptions*/
  )
  /*: Promise*/
  {
    return this.send(className, 'GET', {}, options);
  },
  create: function (className
  /*: string*/
  , params
  /*: any*/
  , options
  /*: RequestOptions*/
  )
  /*: Promise*/
  {
    return this.send(className, 'POST', params, options);
  },
  update: function (className
  /*: string*/
  , params
  /*: any*/
  , options
  /*: RequestOptions*/
  )
  /*: Promise*/
  {
    return this.send(className, 'PUT', params, options);
  },
  delete: function (className
  /*: string*/
  , options
  /*: RequestOptions*/
  )
  /*: Promise*/
  {
    return this.send(className, 'DELETE', {}, options);
  },
  purge: function (className
  /*: string*/
  )
  /*: Promise*/
  {
    var RESTController = _CoreManager.default.getRESTController();

    return RESTController.request('DELETE', "purge/".concat(className), {}, {
      useMasterKey: true
    });
  }
};

_CoreManager.default.setSchemaController(DefaultController);

var _default = ParseSchema;
exports.default = _default;
},{"./CoreManager":4,"@babel/runtime/helpers/classCallCheck":54,"@babel/runtime/helpers/createClass":56,"@babel/runtime/helpers/defineProperty":57,"@babel/runtime/helpers/interopRequireDefault":61}],30:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/inherits"));

var _CoreManager = _interopRequireDefault(_dereq_("./CoreManager"));

var _isRevocableSession = _interopRequireDefault(_dereq_("./isRevocableSession"));

var _ParseObject2 = _interopRequireDefault(_dereq_("./ParseObject"));

var _ParseUser = _interopRequireDefault(_dereq_("./ParseUser"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

/**
 * <p>A Parse.Session object is a local representation of a revocable session.
 * This class is a subclass of a Parse.Object, and retains the same
 * functionality of a Parse.Object.</p>
 * @alias Parse.Session
 * @extends Parse.Object
 */


var ParseSession =
/*#__PURE__*/
function (_ParseObject) {
  (0, _inherits2.default)(ParseSession, _ParseObject);
  /**
   *
   * @param {Object} attributes The initial set of data to store in the user.
   */

  function ParseSession(attributes
  /*: ?AttributeMap*/
  ) {
    var _this;

    (0, _classCallCheck2.default)(this, ParseSession);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ParseSession).call(this, '_Session'));

    if (attributes && (0, _typeof2.default)(attributes) === 'object') {
      if (!_this.set(attributes || {})) {
        throw new Error('Can\'t create an invalid Session');
      }
    }

    return _this;
  }
  /**
   * Returns the session token string.
    * @return {String}
   */


  (0, _createClass2.default)(ParseSession, [{
    key: "getSessionToken",
    value: function ()
    /*: string*/
    {
      var token = this.get('sessionToken');

      if (typeof token === 'string') {
        return token;
      }

      return '';
    }
  }], [{
    key: "readOnlyAttributes",
    value: function () {
      return ['createdWith', 'expiresAt', 'installationId', 'restricted', 'sessionToken', 'user'];
    }
    /**
     * Retrieves the Session object for the currently logged in session.
      * @static
     * @return {Promise} A promise that is resolved with the Parse.Session
     *   object after it has been fetched. If there is no current user, the
     *   promise will be rejected.
     */

  }, {
    key: "current",
    value: function (options
    /*: FullOptions*/
    ) {
      options = options || {};

      var controller = _CoreManager.default.getSessionController();

      var sessionOptions = {};

      if (options.hasOwnProperty('useMasterKey')) {
        sessionOptions.useMasterKey = options.useMasterKey;
      }

      return _ParseUser.default.currentAsync().then(function (user) {
        if (!user) {
          return Promise.reject('There is no current user.');
        }

        sessionOptions.sessionToken = user.getSessionToken();
        return controller.getSession(sessionOptions);
      });
    }
    /**
     * Determines whether the current session token is revocable.
     * This method is useful for migrating Express.js or Node.js web apps to
     * use revocable sessions. If you are migrating an app that uses the Parse
     * SDK in the browser only, please use Parse.User.enableRevocableSession()
     * instead, so that sessions can be automatically upgraded.
      * @static
     * @return {Boolean}
     */

  }, {
    key: "isCurrentSessionRevocable",
    value: function ()
    /*: boolean*/
    {
      var currentUser = _ParseUser.default.current();

      if (currentUser) {
        return (0, _isRevocableSession.default)(currentUser.getSessionToken() || '');
      }

      return false;
    }
  }]);
  return ParseSession;
}(_ParseObject2.default);

_ParseObject2.default.registerSubclass('_Session', ParseSession);

var DefaultController = {
  getSession: function (options
  /*: RequestOptions*/
  )
  /*: Promise<ParseSession>*/
  {
    var RESTController = _CoreManager.default.getRESTController();

    var session = new ParseSession();
    return RESTController.request('GET', 'sessions/me', {}, options).then(function (sessionData) {
      session._finishFetch(sessionData);

      session._setExisted(true);

      return session;
    });
  }
};

_CoreManager.default.setSessionController(DefaultController);

var _default = ParseSession;
exports.default = _default;
},{"./CoreManager":4,"./ParseObject":23,"./ParseUser":31,"./isRevocableSession":45,"@babel/runtime/helpers/classCallCheck":54,"@babel/runtime/helpers/createClass":56,"@babel/runtime/helpers/getPrototypeOf":59,"@babel/runtime/helpers/inherits":60,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/possibleConstructorReturn":68,"@babel/runtime/helpers/typeof":73}],31:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/inherits"));

var _AnonymousUtils = _interopRequireDefault(_dereq_("./AnonymousUtils"));

var _CoreManager = _interopRequireDefault(_dereq_("./CoreManager"));

var _isRevocableSession = _interopRequireDefault(_dereq_("./isRevocableSession"));

var _ParseError = _interopRequireDefault(_dereq_("./ParseError"));

var _ParseObject2 = _interopRequireDefault(_dereq_("./ParseObject"));

var _ParseSession = _interopRequireDefault(_dereq_("./ParseSession"));

var _Storage = _interopRequireDefault(_dereq_("./Storage"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */


var CURRENT_USER_KEY = 'currentUser';
var canUseCurrentUser = !_CoreManager.default.get('IS_NODE');
var currentUserCacheMatchesDisk = false;
var currentUserCache = null;
var authProviders = {};
/**
 * <p>A Parse.User object is a local representation of a user persisted to the
 * Parse cloud. This class is a subclass of a Parse.Object, and retains the
 * same functionality of a Parse.Object, but also extends it with various
 * user specific methods, like authentication, signing up, and validation of
 * uniqueness.</p>
 * @alias Parse.User
 * @extends Parse.Object
 */

var ParseUser =
/*#__PURE__*/
function (_ParseObject) {
  (0, _inherits2.default)(ParseUser, _ParseObject);
  /**
   * @param {Object} attributes The initial set of data to store in the user.
   */

  function ParseUser(attributes
  /*: ?AttributeMap*/
  ) {
    var _this;

    (0, _classCallCheck2.default)(this, ParseUser);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ParseUser).call(this, '_User'));

    if (attributes && (0, _typeof2.default)(attributes) === 'object') {
      if (!_this.set(attributes || {})) {
        throw new Error('Can\'t create an invalid Parse User');
      }
    }

    return _this;
  }
  /**
   * Request a revocable session token to replace the older style of token.
    * @param {Object} options
   * @return {Promise} A promise that is resolved when the replacement
   *   token has been fetched.
   */


  (0, _createClass2.default)(ParseUser, [{
    key: "_upgradeToRevocableSession",
    value: function (options
    /*: RequestOptions*/
    )
    /*: Promise<void>*/
    {
      options = options || {};
      var upgradeOptions = {};

      if (options.hasOwnProperty('useMasterKey')) {
        upgradeOptions.useMasterKey = options.useMasterKey;
      }

      var controller = _CoreManager.default.getUserController();

      return controller.upgradeToRevocableSession(this, upgradeOptions);
    }
    /**
     * Unlike in the Android/iOS SDKs, logInWith is unnecessary, since you can
     * call linkWith on the user (even if it doesn't exist yet on the server).
     */

  }, {
    key: "_linkWith",
    value: function (provider
    /*: any*/
    , options
    /*: { authData?: AuthData }*/
    )
    /*: Promise<ParseUser>*/
    {
      var _this2 = this;

      var saveOpts
      /*:: ?: FullOptions*/
      = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      saveOpts.sessionToken = saveOpts.sessionToken || this.getSessionToken() || '';
      var authType;

      if (typeof provider === 'string') {
        authType = provider;

        if (authProviders[provider]) {
          provider = authProviders[provider];
        } else {
          var authProvider = {
            restoreAuthentication: function () {
              return true;
            },
            getAuthType: function () {
              return authType;
            }
          };
          authProviders[authType] = authProvider;
          provider = authProvider;
        }
      } else {
        authType = provider.getAuthType();
      }

      if (options && options.hasOwnProperty('authData')) {
        var authData = this.get('authData') || {};

        if ((0, _typeof2.default)(authData) !== 'object') {
          throw new Error('Invalid type: authData field should be an object');
        }

        authData[authType] = options.authData;

        var controller = _CoreManager.default.getUserController();

        return controller.linkWith(this, authData, saveOpts);
      } else {
        return new Promise(function (resolve, reject) {
          provider.authenticate({
            success: function (provider, result) {
              var opts = {};
              opts.authData = result;

              _this2._linkWith(provider, opts, saveOpts).then(function () {
                resolve(_this2);
              }, function (error) {
                reject(error);
              });
            },
            error: function (provider, _error) {
              reject(_error);
            }
          });
        });
      }
    }
    /**
     * Synchronizes auth data for a provider (e.g. puts the access token in the
     * right place to be used by the Facebook SDK).
     */

  }, {
    key: "_synchronizeAuthData",
    value: function (provider
    /*: string*/
    ) {
      if (!this.isCurrent() || !provider) {
        return;
      }

      var authType;

      if (typeof provider === 'string') {
        authType = provider;
        provider = authProviders[authType];
      } else {
        authType = provider.getAuthType();
      }

      var authData = this.get('authData');

      if (!provider || !authData || (0, _typeof2.default)(authData) !== 'object') {
        return;
      }

      var success = provider.restoreAuthentication(authData[authType]);

      if (!success) {
        this._unlinkFrom(provider);
      }
    }
    /**
     * Synchronizes authData for all providers.
      */

  }, {
    key: "_synchronizeAllAuthData",
    value: function () {
      var authData = this.get('authData');

      if ((0, _typeof2.default)(authData) !== 'object') {
        return;
      }

      for (var _key in authData) {
        this._synchronizeAuthData(_key);
      }
    }
    /**
     * Removes null values from authData (which exist temporarily for
     * unlinking)
      */

  }, {
    key: "_cleanupAuthData",
    value: function () {
      if (!this.isCurrent()) {
        return;
      }

      var authData = this.get('authData');

      if ((0, _typeof2.default)(authData) !== 'object') {
        return;
      }

      for (var _key2 in authData) {
        if (!authData[_key2]) {
          delete authData[_key2];
        }
      }
    }
    /**
     * Unlinks a user from a service.
     */

  }, {
    key: "_unlinkFrom",
    value: function (provider
    /*: any*/
    , options
    /*:: ?: FullOptions*/
    ) {
      var _this3 = this;

      if (typeof provider === 'string') {
        provider = authProviders[provider];
      }

      return this._linkWith(provider, {
        authData: null
      }, options).then(function () {
        _this3._synchronizeAuthData(provider);

        return Promise.resolve(_this3);
      });
    }
    /**
     * Checks whether a user is linked to a service.
      */

  }, {
    key: "_isLinked",
    value: function (provider
    /*: any*/
    )
    /*: boolean*/
    {
      var authType;

      if (typeof provider === 'string') {
        authType = provider;
      } else {
        authType = provider.getAuthType();
      }

      var authData = this.get('authData') || {};

      if ((0, _typeof2.default)(authData) !== 'object') {
        return false;
      }

      return !!authData[authType];
    }
    /**
     * Deauthenticates all providers.
      */

  }, {
    key: "_logOutWithAll",
    value: function () {
      var authData = this.get('authData');

      if ((0, _typeof2.default)(authData) !== 'object') {
        return;
      }

      for (var _key3 in authData) {
        this._logOutWith(_key3);
      }
    }
    /**
     * Deauthenticates a single provider (e.g. removing access tokens from the
     * Facebook SDK).
      */

  }, {
    key: "_logOutWith",
    value: function (provider
    /*: any*/
    ) {
      if (!this.isCurrent()) {
        return;
      }

      if (typeof provider === 'string') {
        provider = authProviders[provider];
      }

      if (provider && provider.deauthenticate) {
        provider.deauthenticate();
      }
    }
    /**
     * Class instance method used to maintain specific keys when a fetch occurs.
     * Used to ensure that the session token is not lost.
     */

  }, {
    key: "_preserveFieldsOnFetch",
    value: function ()
    /*: AttributeMap*/
    {
      return {
        sessionToken: this.get('sessionToken')
      };
    }
    /**
     * Returns true if <code>current</code> would return this user.
      * @return {Boolean}
     */

  }, {
    key: "isCurrent",
    value: function ()
    /*: boolean*/
    {
      var current = ParseUser.current();
      return !!current && current.id === this.id;
    }
    /**
     * Returns get("username").
      * @return {String}
     */

  }, {
    key: "getUsername",
    value: function ()
    /*: ?string*/
    {
      var username = this.get('username');

      if (username == null || typeof username === 'string') {
        return username;
      }

      return '';
    }
    /**
     * Calls set("username", username, options) and returns the result.
      * @param {String} username
     * @param {Object} options
     * @return {Boolean}
     */

  }, {
    key: "setUsername",
    value: function (username
    /*: string*/
    ) {
      // Strip anonymity, even we do not support anonymous user in js SDK, we may
      // encounter anonymous user created by android/iOS in cloud code.
      var authData = this.get('authData');

      if (authData && (0, _typeof2.default)(authData) === 'object' && authData.hasOwnProperty('anonymous')) {
        // We need to set anonymous to null instead of deleting it in order to remove it from Parse.
        authData.anonymous = null;
      }

      this.set('username', username);
    }
    /**
     * Calls set("password", password, options) and returns the result.
      * @param {String} password
     * @param {Object} options
     * @return {Boolean}
     */

  }, {
    key: "setPassword",
    value: function (password
    /*: string*/
    ) {
      this.set('password', password);
    }
    /**
     * Returns get("email").
      * @return {String}
     */

  }, {
    key: "getEmail",
    value: function ()
    /*: ?string*/
    {
      var email = this.get('email');

      if (email == null || typeof email === 'string') {
        return email;
      }

      return '';
    }
    /**
     * Calls set("email", email) and returns the result.
      * @param {String} email
     * @return {Boolean}
     */

  }, {
    key: "setEmail",
    value: function (email
    /*: string*/
    ) {
      return this.set('email', email);
    }
    /**
     * Returns the session token for this user, if the user has been logged in,
     * or if it is the result of a query with the master key. Otherwise, returns
     * undefined.
      * @return {String} the session token, or undefined
     */

  }, {
    key: "getSessionToken",
    value: function ()
    /*: ?string*/
    {
      var token = this.get('sessionToken');

      if (token == null || typeof token === 'string') {
        return token;
      }

      return '';
    }
    /**
     * Checks whether this user is the current user and has been authenticated.
      * @return (Boolean) whether this user is the current user and is logged in.
     */

  }, {
    key: "authenticated",
    value: function ()
    /*: boolean*/
    {
      var current = ParseUser.current();
      return !!this.get('sessionToken') && !!current && current.id === this.id;
    }
    /**
     * Signs up a new user. You should call this instead of save for
     * new Parse.Users. This will create a new Parse.User on the server, and
     * also persist the session on disk so that you can access the user using
     * <code>current</code>.
     *
     * <p>A username and password must be set before calling signUp.</p>
     *
     * <p>Calls options.success or options.error on completion.</p>
     *
      * @param {Object} attrs Extra fields to set on the new user, or null.
     * @param {Object} options
     * @return {Promise} A promise that is fulfilled when the signup
     *     finishes.
     */

  }, {
    key: "signUp",
    value: function (attrs
    /*: AttributeMap*/
    , options
    /*:: ?: FullOptions*/
    )
    /*: Promise<ParseUser>*/
    {
      options = options || {};
      var signupOptions = {};

      if (options.hasOwnProperty('useMasterKey')) {
        signupOptions.useMasterKey = options.useMasterKey;
      }

      if (options.hasOwnProperty('installationId')) {
        signupOptions.installationId = options.installationId;
      }

      var controller = _CoreManager.default.getUserController();

      return controller.signUp(this, attrs, signupOptions);
    }
    /**
     * Logs in a Parse.User. On success, this saves the session to disk,
     * so you can retrieve the currently logged in user using
     * <code>current</code>.
     *
     * <p>A username and password must be set before calling logIn.</p>
     *
     * <p>Calls options.success or options.error on completion.</p>
     *
      * @param {Object} options
     * @return {Promise} A promise that is fulfilled with the user when
     *     the login is complete.
     */

  }, {
    key: "logIn",
    value: function (options
    /*:: ?: FullOptions*/
    )
    /*: Promise<ParseUser>*/
    {
      options = options || {};
      var loginOptions = {};

      if (options.hasOwnProperty('useMasterKey')) {
        loginOptions.useMasterKey = options.useMasterKey;
      }

      if (options.hasOwnProperty('installationId')) {
        loginOptions.installationId = options.installationId;
      }

      var controller = _CoreManager.default.getUserController();

      return controller.logIn(this, loginOptions);
    }
    /**
     * Wrap the default save behavior with functionality to save to local
     * storage if this is current user.
     */

  }, {
    key: "save",
    value: function ()
    /*: Promise<ParseUser>*/
    {
      var _this4 = this;

      for (var _len = arguments.length, args = new Array(_len), _key4 = 0; _key4 < _len; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return (0, _get2.default)((0, _getPrototypeOf2.default)(ParseUser.prototype), "save", this).apply(this, args).then(function () {
        if (_this4.isCurrent()) {
          return _CoreManager.default.getUserController().updateUserOnDisk(_this4);
        }

        return _this4;
      });
    }
    /**
     * Wrap the default destroy behavior with functionality that logs out
     * the current user when it is destroyed
     */

  }, {
    key: "destroy",
    value: function ()
    /*: Promise<ParseUser>*/
    {
      var _this5 = this;

      for (var _len2 = arguments.length, args = new Array(_len2), _key5 = 0; _key5 < _len2; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return (0, _get2.default)((0, _getPrototypeOf2.default)(ParseUser.prototype), "destroy", this).apply(this, args).then(function () {
        if (_this5.isCurrent()) {
          return _CoreManager.default.getUserController().removeUserFromDisk();
        }

        return _this5;
      });
    }
    /**
     * Wrap the default fetch behavior with functionality to save to local
     * storage if this is current user.
     */

  }, {
    key: "fetch",
    value: function ()
    /*: Promise<ParseUser>*/
    {
      var _this6 = this;

      for (var _len3 = arguments.length, args = new Array(_len3), _key6 = 0; _key6 < _len3; _key6++) {
        args[_key6] = arguments[_key6];
      }

      return (0, _get2.default)((0, _getPrototypeOf2.default)(ParseUser.prototype), "fetch", this).apply(this, args).then(function () {
        if (_this6.isCurrent()) {
          return _CoreManager.default.getUserController().updateUserOnDisk(_this6);
        }

        return _this6;
      });
    }
    /**
     * Wrap the default fetchWithInclude behavior with functionality to save to local
     * storage if this is current user.
     */

  }, {
    key: "fetchWithInclude",
    value: function ()
    /*: Promise<ParseUser>*/
    {
      var _this7 = this;

      for (var _len4 = arguments.length, args = new Array(_len4), _key7 = 0; _key7 < _len4; _key7++) {
        args[_key7] = arguments[_key7];
      }

      return (0, _get2.default)((0, _getPrototypeOf2.default)(ParseUser.prototype), "fetchWithInclude", this).apply(this, args).then(function () {
        if (_this7.isCurrent()) {
          return _CoreManager.default.getUserController().updateUserOnDisk(_this7);
        }

        return _this7;
      });
    }
  }], [{
    key: "readOnlyAttributes",
    value: function () {
      return ['sessionToken'];
    }
    /**
     * Adds functionality to the existing Parse.User class
      * @param {Object} protoProps A set of properties to add to the prototype
     * @param {Object} classProps A set of static properties to add to the class
     * @static
     * @return {Class} The newly extended Parse.User class
     */

  }, {
    key: "extend",
    value: function (protoProps
    /*: {[prop: string]: any}*/
    , classProps
    /*: {[prop: string]: any}*/
    ) {
      if (protoProps) {
        for (var _prop in protoProps) {
          if (_prop !== 'className') {
            Object.defineProperty(ParseUser.prototype, _prop, {
              value: protoProps[_prop],
              enumerable: false,
              writable: true,
              configurable: true
            });
          }
        }
      }

      if (classProps) {
        for (var _prop2 in classProps) {
          if (_prop2 !== 'className') {
            Object.defineProperty(ParseUser, _prop2, {
              value: classProps[_prop2],
              enumerable: false,
              writable: true,
              configurable: true
            });
          }
        }
      }

      return ParseUser;
    }
    /**
     * Retrieves the currently logged in ParseUser with a valid session,
     * either from memory or localStorage, if necessary.
      * @static
     * @return {Parse.Object} The currently logged in Parse.User.
     */

  }, {
    key: "current",
    value: function ()
    /*: ?ParseUser*/
    {
      if (!canUseCurrentUser) {
        return null;
      }

      var controller = _CoreManager.default.getUserController();

      return controller.currentUser();
    }
    /**
     * Retrieves the currently logged in ParseUser from asynchronous Storage.
      * @static
     * @return {Promise} A Promise that is resolved with the currently
     *   logged in Parse User
     */

  }, {
    key: "currentAsync",
    value: function ()
    /*: Promise<?ParseUser>*/
    {
      if (!canUseCurrentUser) {
        return Promise.resolve(null);
      }

      var controller = _CoreManager.default.getUserController();

      return controller.currentUserAsync();
    }
    /**
     * Signs up a new user with a username (or email) and password.
     * This will create a new Parse.User on the server, and also persist the
     * session in localStorage so that you can access the user using
     * {@link #current}.
     *
     * <p>Calls options.success or options.error on completion.</p>
     *
      * @param {String} username The username (or email) to sign up with.
     * @param {String} password The password to sign up with.
     * @param {Object} attrs Extra fields to set on the new user.
     * @param {Object} options
     * @static
     * @return {Promise} A promise that is fulfilled with the user when
     *     the signup completes.
     */

  }, {
    key: "signUp",
    value: function (username
    /*: string*/
    , password
    /*: string*/
    , attrs
    /*: AttributeMap*/
    , options
    /*:: ?: FullOptions*/
    ) {
      attrs = attrs || {};
      attrs.username = username;
      attrs.password = password;
      var user = new this(attrs);
      return user.signUp({}, options);
    }
    /**
     * Logs in a user with a username (or email) and password. On success, this
     * saves the session to disk, so you can retrieve the currently logged in
     * user using <code>current</code>.
     *
     * <p>Calls options.success or options.error on completion.</p>
     *
      * @param {String} username The username (or email) to log in with.
     * @param {String} password The password to log in with.
     * @param {Object} options
     * @static
     * @return {Promise} A promise that is fulfilled with the user when
     *     the login completes.
     */

  }, {
    key: "logIn",
    value: function (username
    /*: string*/
    , password
    /*: string*/
    , options
    /*:: ?: FullOptions*/
    ) {
      if (typeof username !== 'string') {
        return Promise.reject(new _ParseError.default(_ParseError.default.OTHER_CAUSE, 'Username must be a string.'));
      } else if (typeof password !== 'string') {
        return Promise.reject(new _ParseError.default(_ParseError.default.OTHER_CAUSE, 'Password must be a string.'));
      }

      var user = new this();

      user._finishFetch({
        username: username,
        password: password
      });

      return user.logIn(options);
    }
    /**
     * Logs in a user with a session token. On success, this saves the session
     * to disk, so you can retrieve the currently logged in user using
     * <code>current</code>.
     *
     * <p>Calls options.success or options.error on completion.</p>
     *
      * @param {String} sessionToken The sessionToken to log in with.
     * @param {Object} options
     * @static
     * @return {Promise} A promise that is fulfilled with the user when
     *     the login completes.
     */

  }, {
    key: "become",
    value: function (sessionToken
    /*: string*/
    , options
    /*:: ?: RequestOptions*/
    ) {
      if (!canUseCurrentUser) {
        throw new Error('It is not memory-safe to become a user in a server environment');
      }

      options = options || {};
      var becomeOptions
      /*: RequestOptions*/
      = {
        sessionToken: sessionToken
      };

      if (options.hasOwnProperty('useMasterKey')) {
        becomeOptions.useMasterKey = options.useMasterKey;
      }

      var controller = _CoreManager.default.getUserController();

      return controller.become(becomeOptions);
    }
    /**
     * Retrieves a user with a session token.
     *
     * @param {String} sessionToken The sessionToken to get user with.
     * @param {Object} options
     * @static
     * @return {Promise} A promise that is fulfilled with the user is fetched.
     */

  }, {
    key: "me",
    value: function (sessionToken
    /*: string*/
    ) {
      var options
      /*:: ?: RequestOptions*/
      = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var controller = _CoreManager.default.getUserController();

      var meOptions
      /*: RequestOptions*/
      = {
        sessionToken: sessionToken
      };

      if (options.useMasterKey) {
        meOptions.useMasterKey = options.useMasterKey;
      }

      return controller.me(meOptions);
    }
    /**
     * Logs in a user with a session token. On success, this saves the session
     * to disk, so you can retrieve the currently logged in user using
     * <code>current</code>. If there is no session token the user will not logged in.
     *
     * @param {Object} userJSON The JSON map of the User's data
     * @static
     * @return {Promise} A promise that is fulfilled with the user when
     *     the login completes.
     */

  }, {
    key: "hydrate",
    value: function (userJSON
    /*: AttributeMap*/
    ) {
      var controller = _CoreManager.default.getUserController();

      return controller.hydrate(userJSON);
    }
  }, {
    key: "logInWith",
    value: function (provider
    /*: any*/
    , options
    /*: { authData?: AuthData }*/
    , saveOpts
    /*:: ?: FullOptions*/
    ) {
      return ParseUser._logInWith(provider, options, saveOpts);
    }
    /**
     * Logs out the currently logged in user session. This will remove the
     * session from disk, log out of linked services, and future calls to
     * <code>current</code> will return <code>null</code>.
     *
     * @param {Object} options
     * @static
     * @return {Promise} A promise that is resolved when the session is
     *   destroyed on the server.
     */

  }, {
    key: "logOut",
    value: function () {
      var options
      /*: RequestOptions*/
      = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var controller = _CoreManager.default.getUserController();

      return controller.logOut(options);
    }
    /**
     * Requests a password reset email to be sent to the specified email address
     * associated with the user account. This email allows the user to securely
     * reset their password on the Parse site.
     *
     * <p>Calls options.success or options.error on completion.</p>
     *
      * @param {String} email The email address associated with the user that
     *     forgot their password.
     * @param {Object} options
     * @static
     * @returns {Promise}
     */

  }, {
    key: "requestPasswordReset",
    value: function (email
    /*: string*/
    , options
    /*:: ?: RequestOptions*/
    ) {
      options = options || {};
      var requestOptions = {};

      if (options.hasOwnProperty('useMasterKey')) {
        requestOptions.useMasterKey = options.useMasterKey;
      }

      var controller = _CoreManager.default.getUserController();

      return controller.requestPasswordReset(email, requestOptions);
    }
    /**
     * Allow someone to define a custom User class without className
     * being rewritten to _User. The default behavior is to rewrite
     * User to _User for legacy reasons. This allows developers to
     * override that behavior.
     *
      * @param {Boolean} isAllowed Whether or not to allow custom User class
     * @static
     */

  }, {
    key: "allowCustomUserClass",
    value: function (isAllowed
    /*: boolean*/
    ) {
      _CoreManager.default.set('PERFORM_USER_REWRITE', !isAllowed);
    }
    /**
     * Allows a legacy application to start using revocable sessions. If the
     * current session token is not revocable, a request will be made for a new,
     * revocable session.
     * It is not necessary to call this method from cloud code unless you are
     * handling user signup or login from the server side. In a cloud code call,
     * this function will not attempt to upgrade the current token.
      * @param {Object} options
     * @static
     * @return {Promise} A promise that is resolved when the process has
     *   completed. If a replacement session token is requested, the promise
     *   will be resolved after a new token has been fetched.
     */

  }, {
    key: "enableRevocableSession",
    value: function (options
    /*:: ?: RequestOptions*/
    ) {
      options = options || {};

      _CoreManager.default.set('FORCE_REVOCABLE_SESSION', true);

      if (canUseCurrentUser) {
        var current = ParseUser.current();

        if (current) {
          return current._upgradeToRevocableSession(options);
        }
      }

      return Promise.resolve();
    }
    /**
     * Enables the use of become or the current user in a server
     * environment. These features are disabled by default, since they depend on
     * global objects that are not memory-safe for most servers.
      * @static
     */

  }, {
    key: "enableUnsafeCurrentUser",
    value: function () {
      canUseCurrentUser = true;
    }
    /**
     * Disables the use of become or the current user in any environment.
     * These features are disabled on servers by default, since they depend on
     * global objects that are not memory-safe for most servers.
      * @static
     */

  }, {
    key: "disableUnsafeCurrentUser",
    value: function () {
      canUseCurrentUser = false;
    }
  }, {
    key: "_registerAuthenticationProvider",
    value: function (provider
    /*: any*/
    ) {
      authProviders[provider.getAuthType()] = provider; // Synchronize the current user with the auth provider.

      ParseUser.currentAsync().then(function (current) {
        if (current) {
          current._synchronizeAuthData(provider.getAuthType());
        }
      });
    }
  }, {
    key: "_logInWith",
    value: function (provider
    /*: any*/
    , options
    /*: { authData?: AuthData }*/
    , saveOpts
    /*:: ?: FullOptions*/
    ) {
      var user = new ParseUser();
      return user._linkWith(provider, options, saveOpts);
    }
  }, {
    key: "_clearCache",
    value: function () {
      currentUserCache = null;
      currentUserCacheMatchesDisk = false;
    }
  }, {
    key: "_setCurrentUserCache",
    value: function (user
    /*: ParseUser*/
    ) {
      currentUserCache = user;
    }
  }]);
  return ParseUser;
}(_ParseObject2.default);

_ParseObject2.default.registerSubclass('_User', ParseUser);

var DefaultController = {
  updateUserOnDisk: function (user) {
    var path = _Storage.default.generatePath(CURRENT_USER_KEY);

    var json = user.toJSON();
    json.className = '_User';
    return _Storage.default.setItemAsync(path, JSON.stringify(json)).then(function () {
      return user;
    });
  },
  removeUserFromDisk: function () {
    var path = _Storage.default.generatePath(CURRENT_USER_KEY);

    currentUserCacheMatchesDisk = true;
    currentUserCache = null;
    return _Storage.default.removeItemAsync(path);
  },
  setCurrentUser: function (user) {
    var currentUser = this.currentUser();
    var promise = Promise.resolve();

    if (currentUser && !user.equals(currentUser) && _AnonymousUtils.default.isLinked(currentUser)) {
      promise = currentUser.destroy({
        sessionToken: currentUser.getSessionToken()
      });
    }

    currentUserCache = user;

    user._cleanupAuthData();

    user._synchronizeAllAuthData();

    return promise.then(function () {
      return DefaultController.updateUserOnDisk(user);
    });
  },
  currentUser: function ()
  /*: ?ParseUser*/
  {
    if (currentUserCache) {
      return currentUserCache;
    }

    if (currentUserCacheMatchesDisk) {
      return null;
    }

    if (_Storage.default.async()) {
      throw new Error('Cannot call currentUser() when using a platform with an async ' + 'storage system. Call currentUserAsync() instead.');
    }

    var path = _Storage.default.generatePath(CURRENT_USER_KEY);

    var userData = _Storage.default.getItem(path);

    currentUserCacheMatchesDisk = true;

    if (!userData) {
      currentUserCache = null;
      return null;
    }

    userData = JSON.parse(userData);

    if (!userData.className) {
      userData.className = '_User';
    }

    if (userData._id) {
      if (userData.objectId !== userData._id) {
        userData.objectId = userData._id;
      }

      delete userData._id;
    }

    if (userData._sessionToken) {
      userData.sessionToken = userData._sessionToken;
      delete userData._sessionToken;
    }

    var current = _ParseObject2.default.fromJSON(userData);

    currentUserCache = current;

    current._synchronizeAllAuthData();

    return current;
  },
  currentUserAsync: function ()
  /*: Promise<?ParseUser>*/
  {
    if (currentUserCache) {
      return Promise.resolve(currentUserCache);
    }

    if (currentUserCacheMatchesDisk) {
      return Promise.resolve(null);
    }

    var path = _Storage.default.generatePath(CURRENT_USER_KEY);

    return _Storage.default.getItemAsync(path).then(function (userData) {
      currentUserCacheMatchesDisk = true;

      if (!userData) {
        currentUserCache = null;
        return Promise.resolve(null);
      }

      userData = JSON.parse(userData);

      if (!userData.className) {
        userData.className = '_User';
      }

      if (userData._id) {
        if (userData.objectId !== userData._id) {
          userData.objectId = userData._id;
        }

        delete userData._id;
      }

      if (userData._sessionToken) {
        userData.sessionToken = userData._sessionToken;
        delete userData._sessionToken;
      }

      var current = _ParseObject2.default.fromJSON(userData);

      currentUserCache = current;

      current._synchronizeAllAuthData();

      return Promise.resolve(current);
    });
  },
  signUp: function (user
  /*: ParseUser*/
  , attrs
  /*: AttributeMap*/
  , options
  /*: RequestOptions*/
  )
  /*: Promise<ParseUser>*/
  {
    var username = attrs && attrs.username || user.get('username');
    var password = attrs && attrs.password || user.get('password');

    if (!username || !username.length) {
      return Promise.reject(new _ParseError.default(_ParseError.default.OTHER_CAUSE, 'Cannot sign up user with an empty name.'));
    }

    if (!password || !password.length) {
      return Promise.reject(new _ParseError.default(_ParseError.default.OTHER_CAUSE, 'Cannot sign up user with an empty password.'));
    }

    return user.save(attrs, options).then(function () {
      // Clear the password field
      user._finishFetch({
        password: undefined
      });

      if (canUseCurrentUser) {
        return DefaultController.setCurrentUser(user);
      }

      return user;
    });
  },
  logIn: function (user
  /*: ParseUser*/
  , options
  /*: RequestOptions*/
  )
  /*: Promise<ParseUser>*/
  {
    var RESTController = _CoreManager.default.getRESTController();

    var stateController = _CoreManager.default.getObjectStateController();

    var auth = {
      username: user.get('username'),
      password: user.get('password')
    };
    return RESTController.request('GET', 'login', auth, options).then(function (response) {
      user._migrateId(response.objectId);

      user._setExisted(true);

      stateController.setPendingOp(user._getStateIdentifier(), 'username', undefined);
      stateController.setPendingOp(user._getStateIdentifier(), 'password', undefined);
      response.password = undefined;

      user._finishFetch(response);

      if (!canUseCurrentUser) {
        // We can't set the current user, so just return the one we logged in
        return Promise.resolve(user);
      }

      return DefaultController.setCurrentUser(user);
    });
  },
  become: function (options
  /*: RequestOptions*/
  )
  /*: Promise<ParseUser>*/
  {
    var user = new ParseUser();

    var RESTController = _CoreManager.default.getRESTController();

    return RESTController.request('GET', 'users/me', {}, options).then(function (response) {
      user._finishFetch(response);

      user._setExisted(true);

      return DefaultController.setCurrentUser(user);
    });
  },
  hydrate: function (userJSON
  /*: AttributeMap*/
  )
  /*: Promise<ParseUser>*/
  {
    var user = new ParseUser();

    user._finishFetch(userJSON);

    user._setExisted(true);

    if (userJSON.sessionToken && canUseCurrentUser) {
      return DefaultController.setCurrentUser(user);
    } else {
      return Promise.resolve(user);
    }
  },
  me: function (options
  /*: RequestOptions*/
  )
  /*: Promise<ParseUser>*/
  {
    var RESTController = _CoreManager.default.getRESTController();

    return RESTController.request('GET', 'users/me', {}, options).then(function (response) {
      var user = new ParseUser();

      user._finishFetch(response);

      user._setExisted(true);

      return user;
    });
  },
  logOut: function (options
  /*: RequestOptions*/
  )
  /*: Promise<ParseUser>*/
  {
    var RESTController = _CoreManager.default.getRESTController();

    if (options.sessionToken) {
      return RESTController.request('POST', 'logout', {}, options);
    }

    return DefaultController.currentUserAsync().then(function (currentUser) {
      var path = _Storage.default.generatePath(CURRENT_USER_KEY);

      var promise = _Storage.default.removeItemAsync(path);

      if (currentUser !== null) {
        var isAnonymous = _AnonymousUtils.default.isLinked(currentUser);

        var currentSession = currentUser.getSessionToken();

        if (currentSession && (0, _isRevocableSession.default)(currentSession)) {
          promise = promise.then(function () {
            if (isAnonymous) {
              return currentUser.destroy({
                sessionToken: currentSession
              });
            }
          }).then(function () {
            return RESTController.request('POST', 'logout', {}, {
              sessionToken: currentSession
            });
          });
        }

        currentUser._logOutWithAll();

        currentUser._finishFetch({
          sessionToken: undefined
        });
      }

      currentUserCacheMatchesDisk = true;
      currentUserCache = null;
      return promise;
    });
  },
  requestPasswordReset: function (email
  /*: string*/
  , options
  /*: RequestOptions*/
  ) {
    var RESTController = _CoreManager.default.getRESTController();

    return RESTController.request('POST', 'requestPasswordReset', {
      email: email
    }, options);
  },
  upgradeToRevocableSession: function (user
  /*: ParseUser*/
  , options
  /*: RequestOptions*/
  ) {
    var token = user.getSessionToken();

    if (!token) {
      return Promise.reject(new _ParseError.default(_ParseError.default.SESSION_MISSING, 'Cannot upgrade a user with no session token'));
    }

    options.sessionToken = token;

    var RESTController = _CoreManager.default.getRESTController();

    return RESTController.request('POST', 'upgradeToRevocableSession', {}, options).then(function (result) {
      var session = new _ParseSession.default();

      session._finishFetch(result);

      user._finishFetch({
        sessionToken: session.getSessionToken()
      });

      if (user.isCurrent()) {
        return DefaultController.setCurrentUser(user);
      }

      return Promise.resolve(user);
    });
  },
  linkWith: function (user
  /*: ParseUser*/
  , authData
  /*: AuthData*/
  , options
  /*: FullOptions*/
  ) {
    return user.save({
      authData: authData
    }, options).then(function () {
      if (canUseCurrentUser) {
        return DefaultController.setCurrentUser(user);
      }

      return user;
    });
  }
};

_CoreManager.default.setUserController(DefaultController);

var _default = ParseUser;
exports.default = _default;
},{"./AnonymousUtils":2,"./CoreManager":4,"./ParseError":18,"./ParseObject":23,"./ParseSession":30,"./Storage":35,"./isRevocableSession":45,"@babel/runtime/helpers/classCallCheck":54,"@babel/runtime/helpers/createClass":56,"@babel/runtime/helpers/get":58,"@babel/runtime/helpers/getPrototypeOf":59,"@babel/runtime/helpers/inherits":60,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/possibleConstructorReturn":68,"@babel/runtime/helpers/typeof":73}],32:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.send = send;

var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));

var _CoreManager = _interopRequireDefault(_dereq_("./CoreManager"));

var _ParseQuery = _interopRequireDefault(_dereq_("./ParseQuery"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

/**
 * Contains functions to deal with Push in Parse.
 * @class Parse.Push
 * @static
 * @hideconstructor
 */

/**
  * Sends a push notification.
  * @method send
  * @name Parse.Push.send
  * @param {Object} data -  The data of the push notification.  Valid fields
  * are:
  *   <ol>
  *     <li>channels - An Array of channels to push to.</li>
  *     <li>push_time - A Date object for when to send the push.</li>
  *     <li>expiration_time -  A Date object for when to expire
  *         the push.</li>
  *     <li>expiration_interval - The seconds from now to expire the push.</li>
  *     <li>where - A Parse.Query over Parse.Installation that is used to match
  *         a set of installations to push to.</li>
  *     <li>data - The data to send as part of the push</li>
  *   <ol>
  * @param {Object} options An object that has an optional success function,
  * that takes no arguments and will be called on a successful push, and
  * an error function that takes a Parse.Error and will be called if the push
  * failed.
  * @return {Promise} A promise that is fulfilled when the push request
  *     completes.
  */


function send(data
/*: PushData*/
, options
/*:: ?: { useMasterKey?: boolean, success?: any, error?: any }*/
)
/*: Promise*/
{
  options = options || {};

  if (data.where && data.where instanceof _ParseQuery.default) {
    data.where = data.where.toJSON().where;
  }

  if (data.push_time && (0, _typeof2.default)(data.push_time) === 'object') {
    data.push_time = data.push_time.toJSON();
  }

  if (data.expiration_time && (0, _typeof2.default)(data.expiration_time) === 'object') {
    data.expiration_time = data.expiration_time.toJSON();
  }

  if (data.expiration_time && data.expiration_interval) {
    throw new Error('expiration_time and expiration_interval cannot both be set.');
  }

  return _CoreManager.default.getPushController().send(data, {
    useMasterKey: options.useMasterKey
  });
}

var DefaultController = {
  send: function (data
  /*: PushData*/
  , options
  /*: RequestOptions*/
  ) {
    var RESTController = _CoreManager.default.getRESTController();

    var request = RESTController.request('POST', 'push', data, {
      useMasterKey: !!options.useMasterKey
    });
    return request;
  }
};

_CoreManager.default.setPushController(DefaultController);
},{"./CoreManager":4,"./ParseQuery":26,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/typeof":73}],33:[function(_dereq_,module,exports){
(function (process){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/defineProperty"));

var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));

var _CoreManager = _interopRequireDefault(_dereq_("./CoreManager"));

var _ParseError = _interopRequireDefault(_dereq_("./ParseError"));

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        (0, _defineProperty2.default)(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var XHR = null;

if (typeof XMLHttpRequest !== 'undefined') {
  XHR = XMLHttpRequest;
}

var useXDomainRequest = false;

if (typeof XDomainRequest !== 'undefined' && !('withCredentials' in new XMLHttpRequest())) {
  useXDomainRequest = true;
}

function ajaxIE9(method
/*: string*/
, url
/*: string*/
, data
/*: any*/
, options
/*:: ?: FullOptions*/
) {
  return new Promise(function (resolve, reject) {
    var xdr = new XDomainRequest();

    xdr.onload = function () {
      var response;

      try {
        response = JSON.parse(xdr.responseText);
      } catch (e) {
        reject(e);
      }

      if (response) {
        resolve({
          response: response
        });
      }
    };

    xdr.onerror = xdr.ontimeout = function () {
      // Let's fake a real error message.
      var fakeResponse = {
        responseText: JSON.stringify({
          code: _ParseError.default.X_DOMAIN_REQUEST,
          error: 'IE\'s XDomainRequest does not supply error info.'
        })
      };
      reject(fakeResponse);
    };

    xdr.onprogress = function () {
      if (options && typeof options.progress === 'function') {
        options.progress(xdr.responseText);
      }
    };

    xdr.open(method, url);
    xdr.send(data);
  });
}

var RESTController = {
  ajax: function (method
  /*: string*/
  , url
  /*: string*/
  , data
  /*: any*/
  , headers
  /*:: ?: any*/
  , options
  /*:: ?: FullOptions*/
  ) {
    if (useXDomainRequest) {
      return ajaxIE9(method, url, data, headers, options);
    }

    var res, rej;
    var promise = new Promise(function (resolve, reject) {
      res = resolve;
      rej = reject;
    });
    promise.resolve = res;
    promise.reject = rej;
    var attempts = 0;

    var dispatch = function dispatch() {
      if (XHR == null) {
        throw new Error('Cannot make a request: No definition of XMLHttpRequest was found.');
      }

      var handled = false;
      var xhr = new XHR();

      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4 || handled) {
          return;
        }

        handled = true;

        if (xhr.status >= 200 && xhr.status < 300) {
          var response;

          try {
            response = JSON.parse(xhr.responseText);

            if (typeof xhr.getResponseHeader === 'function') {
              if ((xhr.getAllResponseHeaders() || '').includes('x-parse-job-status-id: ')) {
                response = xhr.getResponseHeader('x-parse-job-status-id');
              }
            }
          } catch (e) {
            promise.reject(e.toString());
          }

          if (response) {
            promise.resolve({
              response: response,
              status: xhr.status,
              xhr: xhr
            });
          }
        } else if (xhr.status >= 500 || xhr.status === 0) {
          // retry on 5XX or node-xmlhttprequest error
          if (++attempts < _CoreManager.default.get('REQUEST_ATTEMPT_LIMIT')) {
            // Exponentially-growing random delay
            var delay = Math.round(Math.random() * 125 * Math.pow(2, attempts));
            setTimeout(dispatch, delay);
          } else if (xhr.status === 0) {
            promise.reject('Unable to connect to the Parse API');
          } else {
            // After the retry limit is reached, fail
            promise.reject(xhr);
          }
        } else {
          promise.reject(xhr);
        }
      };

      headers = headers || {};

      if (typeof headers['Content-Type'] !== 'string') {
        headers['Content-Type'] = 'text/plain'; // Avoid pre-flight
      }

      if (_CoreManager.default.get('IS_NODE')) {
        headers['User-Agent'] = 'Parse/' + _CoreManager.default.get('VERSION') + ' (NodeJS ' + process.versions.node + ')';
      }

      if (_CoreManager.default.get('SERVER_AUTH_TYPE') && _CoreManager.default.get('SERVER_AUTH_TOKEN')) {
        headers['Authorization'] = _CoreManager.default.get('SERVER_AUTH_TYPE') + ' ' + _CoreManager.default.get('SERVER_AUTH_TOKEN');
      }

      if (options && typeof options.progress === 'function') {
        if (xhr.upload) {
          xhr.upload.addEventListener('progress', function (oEvent) {
            if (oEvent.lengthComputable) {
              options.progress(oEvent.loaded / oEvent.total);
            } else {
              options.progress(null);
            }
          });
        } else if (xhr.addEventListener) {
          xhr.addEventListener('progress', function (oEvent) {
            if (oEvent.lengthComputable) {
              options.progress(oEvent.loaded / oEvent.total);
            } else {
              options.progress(null);
            }
          });
        }
      }

      xhr.open(method, url, true);

      for (var h in headers) {
        xhr.setRequestHeader(h, headers[h]);
      }

      xhr.send(data);
    };

    dispatch();
    return promise;
  },
  request: function (method
  /*: string*/
  , path
  /*: string*/
  , data
  /*: mixed*/
  , options
  /*:: ?: RequestOptions*/
  ) {
    options = options || {};

    var url = _CoreManager.default.get('SERVER_URL');

    if (url[url.length - 1] !== '/') {
      url += '/';
    }

    url += path;
    var payload = {};

    if (data && (0, _typeof2.default)(data) === 'object') {
      for (var k in data) {
        payload[k] = data[k];
      }
    }

    if (method !== 'POST') {
      payload._method = method;
      method = 'POST';
    }

    payload._ApplicationId = _CoreManager.default.get('APPLICATION_ID');

    var jsKey = _CoreManager.default.get('JAVASCRIPT_KEY');

    if (jsKey) {
      payload._JavaScriptKey = jsKey;
    }

    payload._ClientVersion = _CoreManager.default.get('VERSION');
    var useMasterKey = options.useMasterKey;

    if (typeof useMasterKey === 'undefined') {
      useMasterKey = _CoreManager.default.get('USE_MASTER_KEY');
    }

    if (useMasterKey) {
      if (_CoreManager.default.get('MASTER_KEY')) {
        delete payload._JavaScriptKey;
        payload._MasterKey = _CoreManager.default.get('MASTER_KEY');
      } else {
        throw new Error('Cannot use the Master Key, it has not been provided.');
      }
    }

    if (_CoreManager.default.get('FORCE_REVOCABLE_SESSION')) {
      payload._RevocableSession = '1';
    }

    var installationId = options.installationId;
    var installationIdPromise;

    if (installationId && typeof installationId === 'string') {
      installationIdPromise = Promise.resolve(installationId);
    } else {
      var installationController = _CoreManager.default.getInstallationController();

      installationIdPromise = installationController.currentInstallationId();
    }

    return installationIdPromise.then(function (iid) {
      payload._InstallationId = iid;

      var userController = _CoreManager.default.getUserController();

      if (options && typeof options.sessionToken === 'string') {
        return Promise.resolve(options.sessionToken);
      } else if (userController) {
        return userController.currentUserAsync().then(function (user) {
          if (user) {
            return Promise.resolve(user.getSessionToken());
          }

          return Promise.resolve(null);
        });
      }

      return Promise.resolve(null);
    }).then(function (token) {
      if (token) {
        payload._SessionToken = token;
      }

      var payloadString = JSON.stringify(payload);
      return RESTController.ajax(method, url, payloadString, {}, options).then(function (_ref) {
        var response = _ref.response,
            status = _ref.status;

        if (options.returnStatus) {
          return _objectSpread({}, response, {
            _status: status
          });
        } else {
          return response;
        }
      });
    }).catch(function (response
    /*: { responseText: string }*/
    ) {
      // Transform the error into an instance of ParseError by trying to parse
      // the error string as JSON
      var error;

      if (response && response.responseText) {
        try {
          var errorJSON = JSON.parse(response.responseText);
          error = new _ParseError.default(errorJSON.code, errorJSON.error);
        } catch (e) {
          // If we fail to parse the error text, that's okay.
          error = new _ParseError.default(_ParseError.default.INVALID_JSON, 'Received an error with invalid JSON from Parse: ' + response.responseText);
        }
      } else {
        error = new _ParseError.default(_ParseError.default.CONNECTION_FAILED, 'XMLHttpRequest failed: ' + JSON.stringify(response));
      }

      return Promise.reject(error);
    });
  },
  _setXHR: function (xhr
  /*: any*/
  ) {
    XHR = xhr;
  }
};
module.exports = RESTController;
}).call(this,_dereq_('_process'))
},{"./CoreManager":4,"./ParseError":18,"@babel/runtime/helpers/defineProperty":57,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/typeof":73,"_process":77}],34:[function(_dereq_,module,exports){
"use strict";

var _interopRequireWildcard = _dereq_("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getState = getState;
exports.initializeState = initializeState;
exports.removeState = removeState;
exports.getServerData = getServerData;
exports.setServerData = setServerData;
exports.getPendingOps = getPendingOps;
exports.setPendingOp = setPendingOp;
exports.pushPendingState = pushPendingState;
exports.popPendingState = popPendingState;
exports.mergeFirstPendingState = mergeFirstPendingState;
exports.getObjectCache = getObjectCache;
exports.estimateAttribute = estimateAttribute;
exports.estimateAttributes = estimateAttributes;
exports.commitServerChanges = commitServerChanges;
exports.enqueueTask = enqueueTask;
exports.clearAllState = clearAllState;
exports.duplicateState = duplicateState;

var ObjectStateMutations = _interopRequireWildcard(_dereq_("./ObjectStateMutations"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */


var objectState
/*: {
  [className: string]: {
    [id: string]: State
  }
}*/
= {};

function getState(obj
/*: ObjectIdentifier*/
)
/*: ?State*/
{
  var classData = objectState[obj.className];

  if (classData) {
    return classData[obj.id] || null;
  }

  return null;
}

function initializeState(obj
/*: ObjectIdentifier*/
, initial
/*:: ?: State*/
)
/*: State*/
{
  var state = getState(obj);

  if (state) {
    return state;
  }

  if (!objectState[obj.className]) {
    objectState[obj.className] = {};
  }

  if (!initial) {
    initial = ObjectStateMutations.defaultState();
  }

  state = objectState[obj.className][obj.id] = initial;
  return state;
}

function removeState(obj
/*: ObjectIdentifier*/
)
/*: ?State*/
{
  var state = getState(obj);

  if (state === null) {
    return null;
  }

  delete objectState[obj.className][obj.id];
  return state;
}

function getServerData(obj
/*: ObjectIdentifier*/
)
/*: AttributeMap*/
{
  var state = getState(obj);

  if (state) {
    return state.serverData;
  }

  return {};
}

function setServerData(obj
/*: ObjectIdentifier*/
, attributes
/*: AttributeMap*/
) {
  var serverData = initializeState(obj).serverData;
  ObjectStateMutations.setServerData(serverData, attributes);
}

function getPendingOps(obj
/*: ObjectIdentifier*/
)
/*: Array<OpsMap>*/
{
  var state = getState(obj);

  if (state) {
    return state.pendingOps;
  }

  return [{}];
}

function setPendingOp(obj
/*: ObjectIdentifier*/
, attr
/*: string*/
, op
/*: ?Op*/
) {
  var pendingOps = initializeState(obj).pendingOps;
  ObjectStateMutations.setPendingOp(pendingOps, attr, op);
}

function pushPendingState(obj
/*: ObjectIdentifier*/
) {
  var pendingOps = initializeState(obj).pendingOps;
  ObjectStateMutations.pushPendingState(pendingOps);
}

function popPendingState(obj
/*: ObjectIdentifier*/
)
/*: OpsMap*/
{
  var pendingOps = initializeState(obj).pendingOps;
  return ObjectStateMutations.popPendingState(pendingOps);
}

function mergeFirstPendingState(obj
/*: ObjectIdentifier*/
) {
  var pendingOps = getPendingOps(obj);
  ObjectStateMutations.mergeFirstPendingState(pendingOps);
}

function getObjectCache(obj
/*: ObjectIdentifier*/
)
/*: ObjectCache*/
{
  var state = getState(obj);

  if (state) {
    return state.objectCache;
  }

  return {};
}

function estimateAttribute(obj
/*: ObjectIdentifier*/
, attr
/*: string*/
)
/*: mixed*/
{
  var serverData = getServerData(obj);
  var pendingOps = getPendingOps(obj);
  return ObjectStateMutations.estimateAttribute(serverData, pendingOps, obj.className, obj.id, attr);
}

function estimateAttributes(obj
/*: ObjectIdentifier*/
)
/*: AttributeMap*/
{
  var serverData = getServerData(obj);
  var pendingOps = getPendingOps(obj);
  return ObjectStateMutations.estimateAttributes(serverData, pendingOps, obj.className, obj.id);
}

function commitServerChanges(obj
/*: ObjectIdentifier*/
, changes
/*: AttributeMap*/
) {
  var state = initializeState(obj);
  ObjectStateMutations.commitServerChanges(state.serverData, state.objectCache, changes);
}

function enqueueTask(obj
/*: ObjectIdentifier*/
, task
/*: () => Promise*/
)
/*: Promise*/
{
  var state = initializeState(obj);
  return state.tasks.enqueue(task);
}

function clearAllState() {
  objectState = {};
}

function duplicateState(source
/*: {id: string}*/
, dest
/*: {id: string}*/
) {
  dest.id = source.id;
}
},{"./ObjectStateMutations":13,"@babel/runtime/helpers/interopRequireWildcard":62}],35:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

var _CoreManager = _interopRequireDefault(_dereq_("./CoreManager"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */


var Storage = {
  async: function ()
  /*: boolean*/
  {
    var controller = _CoreManager.default.getStorageController();

    return !!controller.async;
  },
  getItem: function (path
  /*: string*/
  )
  /*: ?string*/
  {
    var controller = _CoreManager.default.getStorageController();

    if (controller.async === 1) {
      throw new Error('Synchronous storage is not supported by the current storage controller');
    }

    return controller.getItem(path);
  },
  getItemAsync: function (path
  /*: string*/
  )
  /*: Promise<string>*/
  {
    var controller = _CoreManager.default.getStorageController();

    if (controller.async === 1) {
      return controller.getItemAsync(path);
    }

    return Promise.resolve(controller.getItem(path));
  },
  setItem: function (path
  /*: string*/
  , value
  /*: string*/
  )
  /*: void*/
  {
    var controller = _CoreManager.default.getStorageController();

    if (controller.async === 1) {
      throw new Error('Synchronous storage is not supported by the current storage controller');
    }

    return controller.setItem(path, value);
  },
  setItemAsync: function (path
  /*: string*/
  , value
  /*: string*/
  )
  /*: Promise<void>*/
  {
    var controller = _CoreManager.default.getStorageController();

    if (controller.async === 1) {
      return controller.setItemAsync(path, value);
    }

    return Promise.resolve(controller.setItem(path, value));
  },
  removeItem: function (path
  /*: string*/
  )
  /*: void*/
  {
    var controller = _CoreManager.default.getStorageController();

    if (controller.async === 1) {
      throw new Error('Synchronous storage is not supported by the current storage controller');
    }

    return controller.removeItem(path);
  },
  removeItemAsync: function (path
  /*: string*/
  )
  /*: Promise<void>*/
  {
    var controller = _CoreManager.default.getStorageController();

    if (controller.async === 1) {
      return controller.removeItemAsync(path);
    }

    return Promise.resolve(controller.removeItem(path));
  },
  generatePath: function (path
  /*: string*/
  )
  /*: string*/
  {
    if (!_CoreManager.default.get('APPLICATION_ID')) {
      throw new Error('You need to call Parse.initialize before using Parse.');
    }

    if (typeof path !== 'string') {
      throw new Error('Tried to get a Storage path that was not a String.');
    }

    if (path[0] === '/') {
      path = path.substr(1);
    }

    return 'Parse/' + _CoreManager.default.get('APPLICATION_ID') + '/' + path;
  },
  _clear: function () {
    var controller = _CoreManager.default.getStorageController();

    if (controller.hasOwnProperty('clear')) {
      controller.clear();
    }
  }
};
module.exports = Storage;

_CoreManager.default.setStorageController(_dereq_('./StorageController.browser'));
},{"./CoreManager":4,"./StorageController.browser":36,"@babel/runtime/helpers/interopRequireDefault":61}],36:[function(_dereq_,module,exports){
"use strict";
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

/* global localStorage */

var StorageController = {
  async: 0,
  getItem: function (path
  /*: string*/
  )
  /*: ?string*/
  {
    return localStorage.getItem(path);
  },
  setItem: function (path
  /*: string*/
  , value
  /*: string*/
  ) {
    try {
      localStorage.setItem(path, value);
    } catch (e) {// Quota exceeded, possibly due to Safari Private Browsing mode
    }
  },
  removeItem: function (path
  /*: string*/
  ) {
    localStorage.removeItem(path);
  },
  clear: function () {
    localStorage.clear();
  }
};
module.exports = StorageController;
},{}],37:[function(_dereq_,module,exports){
/*:: type Task = {
  task: () => Promise;
  _completion: Promise
};*/
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/defineProperty"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */


var TaskQueue =
/*#__PURE__*/
function () {
  function TaskQueue() {
    (0, _classCallCheck2.default)(this, TaskQueue);
    (0, _defineProperty2.default)(this, "queue", void 0);
    this.queue = [];
  }

  (0, _createClass2.default)(TaskQueue, [{
    key: "enqueue",
    value: function (task
    /*: () => Promise*/
    )
    /*: Promise*/
    {
      var _this = this;

      var res;
      var rej;
      var taskComplete = new Promise(function (resolve, reject) {
        res = resolve;
        rej = reject;
      });
      taskComplete.resolve = res;
      taskComplete.reject = rej;
      this.queue.push({
        task: task,
        _completion: taskComplete
      });

      if (this.queue.length === 1) {
        task().then(function () {
          _this._dequeue();

          taskComplete.resolve();
        }, function (error) {
          _this._dequeue();

          taskComplete.reject(error);
        });
      }

      return taskComplete;
    }
  }, {
    key: "_dequeue",
    value: function () {
      var _this2 = this;

      this.queue.shift();

      if (this.queue.length) {
        var next = this.queue[0];
        next.task().then(function () {
          _this2._dequeue();

          next._completion.resolve();
        }, function (error) {
          _this2._dequeue();

          next._completion.reject(error);
        });
      }
    }
  }]);
  return TaskQueue;
}();

module.exports = TaskQueue;
},{"@babel/runtime/helpers/classCallCheck":54,"@babel/runtime/helpers/createClass":56,"@babel/runtime/helpers/defineProperty":57,"@babel/runtime/helpers/interopRequireDefault":61}],38:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = _dereq_("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getState = getState;
exports.initializeState = initializeState;
exports.removeState = removeState;
exports.getServerData = getServerData;
exports.setServerData = setServerData;
exports.getPendingOps = getPendingOps;
exports.setPendingOp = setPendingOp;
exports.pushPendingState = pushPendingState;
exports.popPendingState = popPendingState;
exports.mergeFirstPendingState = mergeFirstPendingState;
exports.getObjectCache = getObjectCache;
exports.estimateAttribute = estimateAttribute;
exports.estimateAttributes = estimateAttributes;
exports.commitServerChanges = commitServerChanges;
exports.enqueueTask = enqueueTask;
exports.duplicateState = duplicateState;
exports.clearAllState = clearAllState;

var ObjectStateMutations = _interopRequireWildcard(_dereq_("./ObjectStateMutations"));

var _TaskQueue = _interopRequireDefault(_dereq_("./TaskQueue"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */


var objectState = new WeakMap();

function getState(obj
/*: ParseObject*/
)
/*: ?State*/
{
  var classData = objectState.get(obj);
  return classData || null;
}

function initializeState(obj
/*: ParseObject*/
, initial
/*:: ?: State*/
)
/*: State*/
{
  var state = getState(obj);

  if (state) {
    return state;
  }

  if (!initial) {
    initial = {
      serverData: {},
      pendingOps: [{}],
      objectCache: {},
      tasks: new _TaskQueue.default(),
      existed: false
    };
  }

  state = initial;
  objectState.set(obj, state);
  return state;
}

function removeState(obj
/*: ParseObject*/
)
/*: ?State*/
{
  var state = getState(obj);

  if (state === null) {
    return null;
  }

  objectState.delete(obj);
  return state;
}

function getServerData(obj
/*: ParseObject*/
)
/*: AttributeMap*/
{
  var state = getState(obj);

  if (state) {
    return state.serverData;
  }

  return {};
}

function setServerData(obj
/*: ParseObject*/
, attributes
/*: AttributeMap*/
) {
  var serverData = initializeState(obj).serverData;
  ObjectStateMutations.setServerData(serverData, attributes);
}

function getPendingOps(obj
/*: ParseObject*/
)
/*: Array<OpsMap>*/
{
  var state = getState(obj);

  if (state) {
    return state.pendingOps;
  }

  return [{}];
}

function setPendingOp(obj
/*: ParseObject*/
, attr
/*: string*/
, op
/*: ?Op*/
) {
  var pendingOps = initializeState(obj).pendingOps;
  ObjectStateMutations.setPendingOp(pendingOps, attr, op);
}

function pushPendingState(obj
/*: ParseObject*/
) {
  var pendingOps = initializeState(obj).pendingOps;
  ObjectStateMutations.pushPendingState(pendingOps);
}

function popPendingState(obj
/*: ParseObject*/
)
/*: OpsMap*/
{
  var pendingOps = initializeState(obj).pendingOps;
  return ObjectStateMutations.popPendingState(pendingOps);
}

function mergeFirstPendingState(obj
/*: ParseObject*/
) {
  var pendingOps = getPendingOps(obj);
  ObjectStateMutations.mergeFirstPendingState(pendingOps);
}

function getObjectCache(obj
/*: ParseObject*/
)
/*: ObjectCache*/
{
  var state = getState(obj);

  if (state) {
    return state.objectCache;
  }

  return {};
}

function estimateAttribute(obj
/*: ParseObject*/
, attr
/*: string*/
)
/*: mixed*/
{
  var serverData = getServerData(obj);
  var pendingOps = getPendingOps(obj);
  return ObjectStateMutations.estimateAttribute(serverData, pendingOps, obj.className, obj.id, attr);
}

function estimateAttributes(obj
/*: ParseObject*/
)
/*: AttributeMap*/
{
  var serverData = getServerData(obj);
  var pendingOps = getPendingOps(obj);
  return ObjectStateMutations.estimateAttributes(serverData, pendingOps, obj.className, obj.id);
}

function commitServerChanges(obj
/*: ParseObject*/
, changes
/*: AttributeMap*/
) {
  var state = initializeState(obj);
  ObjectStateMutations.commitServerChanges(state.serverData, state.objectCache, changes);
}

function enqueueTask(obj
/*: ParseObject*/
, task
/*: () => Promise*/
)
/*: Promise*/
{
  var state = initializeState(obj);
  return state.tasks.enqueue(task);
}

function duplicateState(source
/*: ParseObject*/
, dest
/*: ParseObject*/
)
/*: void*/
{
  var oldState = initializeState(source);
  var newState = initializeState(dest);

  for (var key in oldState.serverData) {
    newState.serverData[key] = oldState.serverData[key];
  }

  for (var index = 0; index < oldState.pendingOps.length; index++) {
    for (var _key in oldState.pendingOps[index]) {
      newState.pendingOps[index][_key] = oldState.pendingOps[index][_key];
    }
  }

  for (var _key2 in oldState.objectCache) {
    newState.objectCache[_key2] = oldState.objectCache[_key2];
  }

  newState.existed = oldState.existed;
}

function clearAllState() {
  objectState = new WeakMap();
}
},{"./ObjectStateMutations":13,"./TaskQueue":37,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/interopRequireWildcard":62}],39:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = arrayContainsObject;

var _ParseObject = _interopRequireDefault(_dereq_("./ParseObject"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */


function arrayContainsObject(array
/*: Array<any>*/
, object
/*: ParseObject*/
)
/*: boolean*/
{
  if (array.indexOf(object) > -1) {
    return true;
  }

  for (var i = 0; i < array.length; i++) {
    if (array[i] instanceof _ParseObject.default && array[i].className === object.className && array[i]._getId() === object._getId()) {
      return true;
    }
  }

  return false;
}
},{"./ParseObject":23,"@babel/runtime/helpers/interopRequireDefault":61}],40:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = canBeSerialized;

var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));

var _ParseFile = _interopRequireDefault(_dereq_("./ParseFile"));

var _ParseObject = _interopRequireDefault(_dereq_("./ParseObject"));

var _ParseRelation = _interopRequireDefault(_dereq_("./ParseRelation"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */


function canBeSerialized(obj
/*: ParseObject*/
)
/*: boolean*/
{
  if (!(obj instanceof _ParseObject.default)) {
    return true;
  }

  var attributes = obj.attributes;

  for (var attr in attributes) {
    var val = attributes[attr];

    if (!canBeSerializedHelper(val)) {
      return false;
    }
  }

  return true;
}

function canBeSerializedHelper(value
/*: any*/
)
/*: boolean*/
{
  if ((0, _typeof2.default)(value) !== 'object') {
    return true;
  }

  if (value instanceof _ParseRelation.default) {
    return true;
  }

  if (value instanceof _ParseObject.default) {
    return !!value.id;
  }

  if (value instanceof _ParseFile.default) {
    if (value.url()) {
      return true;
    }

    return false;
  }

  if (Array.isArray(value)) {
    for (var i = 0; i < value.length; i++) {
      if (!canBeSerializedHelper(value[i])) {
        return false;
      }
    }

    return true;
  }

  for (var k in value) {
    if (!canBeSerializedHelper(value[k])) {
      return false;
    }
  }

  return true;
}
},{"./ParseFile":19,"./ParseObject":23,"./ParseRelation":27,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/typeof":73}],41:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = decode;

var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));

var _ParseACL = _interopRequireDefault(_dereq_("./ParseACL"));

var _ParseFile = _interopRequireDefault(_dereq_("./ParseFile"));

var _ParseGeoPoint = _interopRequireDefault(_dereq_("./ParseGeoPoint"));

var _ParsePolygon = _interopRequireDefault(_dereq_("./ParsePolygon"));

var _ParseObject = _interopRequireDefault(_dereq_("./ParseObject"));

var _ParseOp = _dereq_("./ParseOp");

var _ParseRelation = _interopRequireDefault(_dereq_("./ParseRelation"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */
// eslint-disable-line no-unused-vars


function decode(value
/*: any*/
)
/*: any*/
{
  if (value === null || (0, _typeof2.default)(value) !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    var dup = [];
    value.forEach(function (v, i) {
      dup[i] = decode(v);
    });
    return dup;
  }

  if (typeof value.__op === 'string') {
    return (0, _ParseOp.opFromJSON)(value);
  }

  if (value.__type === 'Pointer' && value.className) {
    return _ParseObject.default.fromJSON(value);
  }

  if (value.__type === 'Object' && value.className) {
    return _ParseObject.default.fromJSON(value);
  }

  if (value.__type === 'Relation') {
    // The parent and key fields will be populated by the parent
    var relation = new _ParseRelation.default(null, null);
    relation.targetClassName = value.className;
    return relation;
  }

  if (value.__type === 'Date') {
    return new Date(value.iso);
  }

  if (value.__type === 'File') {
    return _ParseFile.default.fromJSON(value);
  }

  if (value.__type === 'GeoPoint') {
    return new _ParseGeoPoint.default({
      latitude: value.latitude,
      longitude: value.longitude
    });
  }

  if (value.__type === 'Polygon') {
    return new _ParsePolygon.default(value.coordinates);
  }

  var copy = {};

  for (var k in value) {
    copy[k] = decode(value[k]);
  }

  return copy;
}
},{"./ParseACL":16,"./ParseFile":19,"./ParseGeoPoint":20,"./ParseObject":23,"./ParseOp":24,"./ParsePolygon":25,"./ParseRelation":27,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/typeof":73}],42:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));

var _ParseACL = _interopRequireDefault(_dereq_("./ParseACL"));

var _ParseFile = _interopRequireDefault(_dereq_("./ParseFile"));

var _ParseGeoPoint = _interopRequireDefault(_dereq_("./ParseGeoPoint"));

var _ParsePolygon = _interopRequireDefault(_dereq_("./ParsePolygon"));

var _ParseObject = _interopRequireDefault(_dereq_("./ParseObject"));

var _ParseOp = _dereq_("./ParseOp");

var _ParseRelation = _interopRequireDefault(_dereq_("./ParseRelation"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */


var toString = Object.prototype.toString;

function encode(value
/*: mixed*/
, disallowObjects
/*: boolean*/
, forcePointers
/*: boolean*/
, seen
/*: Array<mixed>*/
)
/*: any*/
{
  if (value instanceof _ParseObject.default) {
    if (disallowObjects) {
      throw new Error('Parse Objects not allowed here');
    }

    var seenEntry = value.id ? value.className + ':' + value.id : value;

    if (forcePointers || !seen || seen.indexOf(seenEntry) > -1 || value.dirty() || Object.keys(value._getServerData()).length < 1) {
      return value.toPointer();
    }

    seen = seen.concat(seenEntry);
    return value._toFullJSON(seen);
  }

  if (value instanceof _ParseOp.Op || value instanceof _ParseACL.default || value instanceof _ParseGeoPoint.default || value instanceof _ParsePolygon.default || value instanceof _ParseRelation.default) {
    return value.toJSON();
  }

  if (value instanceof _ParseFile.default) {
    if (!value.url()) {
      throw new Error('Tried to encode an unsaved file.');
    }

    return value.toJSON();
  }

  if (toString.call(value) === '[object Date]') {
    if (isNaN(value)) {
      throw new Error('Tried to encode an invalid date.');
    }

    return {
      __type: 'Date',
      iso: value
      /*: any*/
      .toJSON()
    };
  }

  if (toString.call(value) === '[object RegExp]' && typeof value.source === 'string') {
    return value.source;
  }

  if (Array.isArray(value)) {
    return value.map(function (v) {
      return encode(v, disallowObjects, forcePointers, seen);
    });
  }

  if (value && (0, _typeof2.default)(value) === 'object') {
    var output = {};

    for (var k in value) {
      output[k] = encode(value[k], disallowObjects, forcePointers, seen);
    }

    return output;
  }

  return value;
}

function _default(value
/*: mixed*/
, disallowObjects
/*:: ?: boolean*/
, forcePointers
/*:: ?: boolean*/
, seen
/*:: ?: Array<mixed>*/
)
/*: any*/
{
  return encode(value, !!disallowObjects, !!forcePointers, seen || []);
}
},{"./ParseACL":16,"./ParseFile":19,"./ParseGeoPoint":20,"./ParseObject":23,"./ParseOp":24,"./ParsePolygon":25,"./ParseRelation":27,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/typeof":73}],43:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = equals;

var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));

var _ParseACL = _interopRequireDefault(_dereq_("./ParseACL"));

var _ParseFile = _interopRequireDefault(_dereq_("./ParseFile"));

var _ParseGeoPoint = _interopRequireDefault(_dereq_("./ParseGeoPoint"));

var _ParseObject = _interopRequireDefault(_dereq_("./ParseObject"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */


var toString = Object.prototype.toString;

function equals(a, b) {
  if (toString.call(a) === '[object Date]' || toString.call(b) === '[object Date]') {
    var dateA = new Date(a);
    var dateB = new Date(b);
    return +dateA === +dateB;
  }

  if ((0, _typeof2.default)(a) !== (0, _typeof2.default)(b)) {
    return false;
  }

  if (!a || (0, _typeof2.default)(a) !== 'object') {
    // a is a primitive
    return a === b;
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) {
      return false;
    }

    if (a.length !== b.length) {
      return false;
    }

    for (var i = a.length; i--;) {
      if (!equals(a[i], b[i])) {
        return false;
      }
    }

    return true;
  }

  if (a instanceof _ParseACL.default || a instanceof _ParseFile.default || a instanceof _ParseGeoPoint.default || a instanceof _ParseObject.default) {
    return a.equals(b);
  }

  if (b instanceof _ParseObject.default) {
    if (a.__type === 'Object' || a.__type === 'Pointer') {
      return a.objectId === b.id && a.className === b.className;
    }
  }

  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (var k in a) {
    if (!equals(a[k], b[k])) {
      return false;
    }
  }

  return true;
}
},{"./ParseACL":16,"./ParseFile":19,"./ParseGeoPoint":20,"./ParseObject":23,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/typeof":73}],44:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = escape;
/*
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

var encoded = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '/': '&#x2F;',
  '\'': '&#x27;',
  '"': '&quot;'
};

function escape(str
/*: string*/
)
/*: string*/
{
  return str.replace(/[&<>\/'"]/g, function (char) {
    return encoded[char];
  });
}
},{}],45:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isRevocableSession;
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

function isRevocableSession(token
/*: string*/
)
/*: boolean*/
{
  return token.indexOf('r:') > -1;
}
},{}],46:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseDate;
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

function parseDate(iso8601
/*: string*/
)
/*: ?Date*/
{
  var regexp = new RegExp('^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,2})' + 'T' + '([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})' + '(.([0-9]+))?' + 'Z$');
  var match = regexp.exec(iso8601);

  if (!match) {
    return null;
  }

  var year = parseInt(match[1]) || 0;
  var month = (parseInt(match[2]) || 1) - 1;
  var day = parseInt(match[3]) || 0;
  var hour = parseInt(match[4]) || 0;
  var minute = parseInt(match[5]) || 0;
  var second = parseInt(match[6]) || 0;
  var milli = parseInt(match[8]) || 0;
  return new Date(Date.UTC(year, month, day, hour, minute, second, milli));
}
},{}],47:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvingPromise = resolvingPromise;
exports.when = when;
exports.continueWhile = continueWhile;

function resolvingPromise() {
  var res;
  var rej;
  var promise = new Promise(function (resolve, reject) {
    res = resolve;
    rej = reject;
  });
  promise.resolve = res;
  promise.reject = rej;
  return promise;
}

function when(promises) {
  var objects;
  var arrayArgument = Array.isArray(promises);

  if (arrayArgument) {
    objects = promises;
  } else {
    objects = arguments;
  }

  var total = objects.length;
  var hadError = false;
  var results = [];
  var returnValue = arrayArgument ? [results] : results;
  var errors = [];
  results.length = objects.length;
  errors.length = objects.length;

  if (total === 0) {
    return Promise.resolve(returnValue);
  }

  var promise = new resolvingPromise();

  var resolveOne = function () {
    total--;

    if (total <= 0) {
      if (hadError) {
        promise.reject(errors);
      } else {
        promise.resolve(returnValue);
      }
    }
  };

  var chain = function (object, index) {
    if (object && typeof object.then === 'function') {
      object.then(function (result) {
        results[index] = result;
        resolveOne();
      }, function (error) {
        errors[index] = error;
        hadError = true;
        resolveOne();
      });
    } else {
      results[index] = object;
      resolveOne();
    }
  };

  for (var i = 0; i < objects.length; i++) {
    chain(objects[i], i);
  }

  return promise;
}

function continueWhile(test, emitter) {
  if (test()) {
    return emitter().then(function () {
      return continueWhile(test, emitter);
    });
  }

  return Promise.resolve();
}
},{}],48:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = unique;

var _arrayContainsObject = _interopRequireDefault(_dereq_("./arrayContainsObject"));

var _ParseObject = _interopRequireDefault(_dereq_("./ParseObject"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */


function unique
/*:: <T>*/
(arr
/*: Array<T>*/
)
/*: Array<T>*/
{
  var uniques = [];
  arr.forEach(function (value) {
    if (value instanceof _ParseObject.default) {
      if (!(0, _arrayContainsObject.default)(uniques, value)) {
        uniques.push(value);
      }
    } else {
      if (uniques.indexOf(value) < 0) {
        uniques.push(value);
      }
    }
  });
  return uniques;
}
},{"./ParseObject":23,"./arrayContainsObject":39,"@babel/runtime/helpers/interopRequireDefault":61}],49:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = unsavedChildren;

var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));

var _ParseFile = _interopRequireDefault(_dereq_("./ParseFile"));

var _ParseObject = _interopRequireDefault(_dereq_("./ParseObject"));

var _ParseRelation = _interopRequireDefault(_dereq_("./ParseRelation"));
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

/**
 * Return an array of unsaved children, which are either Parse Objects or Files.
 * If it encounters any dirty Objects without Ids, it will throw an exception.
 */


function unsavedChildren(obj
/*: ParseObject*/
, allowDeepUnsaved
/*:: ?: boolean*/
)
/*: Array<ParseFile | ParseObject>*/
{
  var encountered = {
    objects: {},
    files: []
  };

  var identifier = obj.className + ':' + obj._getId();

  encountered.objects[identifier] = obj.dirty() ? obj : true;
  var attributes = obj.attributes;

  for (var attr in attributes) {
    if ((0, _typeof2.default)(attributes[attr]) === 'object') {
      traverse(attributes[attr], encountered, false, !!allowDeepUnsaved);
    }
  }

  var unsaved = [];

  for (var id in encountered.objects) {
    if (id !== identifier && encountered.objects[id] !== true) {
      unsaved.push(encountered.objects[id]);
    }
  }

  return unsaved.concat(encountered.files);
}

function traverse(obj
/*: ParseObject*/
, encountered
/*: EncounterMap*/
, shouldThrow
/*: boolean*/
, allowDeepUnsaved
/*: boolean*/
) {
  if (obj instanceof _ParseObject.default) {
    if (!obj.id && shouldThrow) {
      throw new Error('Cannot create a pointer to an unsaved Object.');
    }

    var _identifier = obj.className + ':' + obj._getId();

    if (!encountered.objects[_identifier]) {
      encountered.objects[_identifier] = obj.dirty() ? obj : true;
      var attributes = obj.attributes;

      for (var attr in attributes) {
        if ((0, _typeof2.default)(attributes[attr]) === 'object') {
          traverse(attributes[attr], encountered, !allowDeepUnsaved, allowDeepUnsaved);
        }
      }
    }

    return;
  }

  if (obj instanceof _ParseFile.default) {
    if (!obj.url() && encountered.files.indexOf(obj) < 0) {
      encountered.files.push(obj);
    }

    return;
  }

  if (obj instanceof _ParseRelation.default) {
    return;
  }

  if (Array.isArray(obj)) {
    obj.forEach(function (el) {
      if ((0, _typeof2.default)(el) === 'object') {
        traverse(el, encountered, shouldThrow, allowDeepUnsaved);
      }
    });
  }

  for (var k in obj) {
    if ((0, _typeof2.default)(obj[k]) === 'object') {
      traverse(obj[k], encountered, shouldThrow, allowDeepUnsaved);
    }
  }
}
},{"./ParseFile":19,"./ParseObject":23,"./ParseRelation":27,"@babel/runtime/helpers/interopRequireDefault":61,"@babel/runtime/helpers/typeof":73}],50:[function(_dereq_,module,exports){
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
},{}],51:[function(_dereq_,module,exports){
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

module.exports = _arrayWithoutHoles;
},{}],52:[function(_dereq_,module,exports){
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;
},{}],53:[function(_dereq_,module,exports){
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;
},{}],54:[function(_dereq_,module,exports){
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],55:[function(_dereq_,module,exports){
var setPrototypeOf = _dereq_("./setPrototypeOf");

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    module.exports = _construct = Reflect.construct;
  } else {
    module.exports = _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

module.exports = _construct;
},{"./setPrototypeOf":69}],56:[function(_dereq_,module,exports){
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
},{}],57:[function(_dereq_,module,exports){
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
},{}],58:[function(_dereq_,module,exports){
var superPropBase = _dereq_("./superPropBase");

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    module.exports = _get = Reflect.get;
  } else {
    module.exports = _get = function _get(target, property, receiver) {
      var base = superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

module.exports = _get;
},{"./superPropBase":71}],59:[function(_dereq_,module,exports){
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
},{}],60:[function(_dereq_,module,exports){
var setPrototypeOf = _dereq_("./setPrototypeOf");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;
},{"./setPrototypeOf":69}],61:[function(_dereq_,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
},{}],62:[function(_dereq_,module,exports){
function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};

          if (desc.get || desc.set) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
}

module.exports = _interopRequireWildcard;
},{}],63:[function(_dereq_,module,exports){
function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

module.exports = _isNativeFunction;
},{}],64:[function(_dereq_,module,exports){
function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

module.exports = _iterableToArray;
},{}],65:[function(_dereq_,module,exports){
function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;
},{}],66:[function(_dereq_,module,exports){
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

module.exports = _nonIterableRest;
},{}],67:[function(_dereq_,module,exports){
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

module.exports = _nonIterableSpread;
},{}],68:[function(_dereq_,module,exports){
var _typeof = _dereq_("../helpers/typeof");

var assertThisInitialized = _dereq_("./assertThisInitialized");

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;
},{"../helpers/typeof":73,"./assertThisInitialized":52}],69:[function(_dereq_,module,exports){
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
},{}],70:[function(_dereq_,module,exports){
var arrayWithHoles = _dereq_("./arrayWithHoles");

var iterableToArrayLimit = _dereq_("./iterableToArrayLimit");

var nonIterableRest = _dereq_("./nonIterableRest");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
},{"./arrayWithHoles":50,"./iterableToArrayLimit":65,"./nonIterableRest":66}],71:[function(_dereq_,module,exports){
var getPrototypeOf = _dereq_("./getPrototypeOf");

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

module.exports = _superPropBase;
},{"./getPrototypeOf":59}],72:[function(_dereq_,module,exports){
var arrayWithoutHoles = _dereq_("./arrayWithoutHoles");

var iterableToArray = _dereq_("./iterableToArray");

var nonIterableSpread = _dereq_("./nonIterableSpread");

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;
},{"./arrayWithoutHoles":51,"./iterableToArray":64,"./nonIterableSpread":67}],73:[function(_dereq_,module,exports){
function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
},{}],74:[function(_dereq_,module,exports){
var getPrototypeOf = _dereq_("./getPrototypeOf");

var setPrototypeOf = _dereq_("./setPrototypeOf");

var isNativeFunction = _dereq_("./isNativeFunction");

var construct = _dereq_("./construct");

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  module.exports = _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return construct(Class, arguments, getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

module.exports = _wrapNativeSuper;
},{"./construct":55,"./getPrototypeOf":59,"./isNativeFunction":63,"./setPrototypeOf":69}],75:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],76:[function(_dereq_,module,exports){
module.exports = _dereq_("regenerator-runtime");

},{"regenerator-runtime":75}],77:[function(_dereq_,module,exports){

},{}],78:[function(_dereq_,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (!events)
    return [];

  var evlistener = events[type];
  if (!evlistener)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}],79:[function(_dereq_,module,exports){
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;

},{}],80:[function(_dereq_,module,exports){
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

},{}],81:[function(_dereq_,module,exports){
var rng = _dereq_('./lib/rng');
var bytesToUuid = _dereq_('./lib/bytesToUuid');

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;

},{"./lib/bytesToUuid":79,"./lib/rng":80}]},{},[15])(15)
});
