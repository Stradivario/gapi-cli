// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"daemon.config.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const os_1 = require("os");

exports.GAPI_MAIN_FOLDER = `${os_1.homedir()}/.gapi`;
exports.GAPI_DAEMON_FOLDER = `${exports.GAPI_MAIN_FOLDER}/daemon`;
exports.GAPI_DAEMON_PROCESS_LIST_FOLDER = `${exports.GAPI_DAEMON_FOLDER}/process-list`;
exports.GAPI_DAEMON_PLUGINS_FOLDER = `${exports.GAPI_DAEMON_FOLDER}/plugins`;
exports.GAPI_DAEMON_EXTERNAL_PLUGINS_FOLDER = `${exports.GAPI_DAEMON_FOLDER}/external-plugins`;
exports.GAPI_DAEMON_CACHE_FOLDER = `${exports.GAPI_DAEMON_FOLDER}/.cache`;
exports.IPFS_HASHED_MODULES = `${exports.GAPI_DAEMON_FOLDER}/ipfs-hash-list`;
},{}],"core/services/list.service.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const core_1 = require("@rxdi/core");

const util_1 = require("util");

const fs_1 = require("fs");

const daemon_config_1 = require("../../daemon.config");

let ListService = class ListService {
  constructor() {
    this.linkedList = [];
  }

  readList() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        this.linkedList = JSON.parse((yield util_1.promisify(fs_1.readFile)(daemon_config_1.GAPI_DAEMON_PROCESS_LIST_FOLDER, {
          encoding: 'utf-8'
        })));
      } catch (e) {}

      return this.linkedList;
    });
  }

  findByRepoPath(repoPath) {
    return __awaiter(this, void 0, void 0, function* () {
      return (yield this.readList()).filter(l => l.repoPath === repoPath);
    });
  }

  findByLinkName(linkName) {
    return {
      results: () => __awaiter(this, void 0, void 0, function* () {
        return (yield this.readList()).filter(l => l.linkName === linkName);
      }),
      exclude: isNotLike => __awaiter(this, void 0, void 0, function* () {
        return (yield this.readList()).filter(l => l.linkName === linkName && l.repoPath !== isNotLike);
      })
    };
  }

};
ListService = __decorate([core_1.Injectable()], ListService);
exports.ListService = ListService;
},{"../../daemon.config":"daemon.config.ts"}],"types/server-metadata.type.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const graphql_1 = require("graphql");

exports.ServerMetadataType = new graphql_1.GraphQLObjectType({
  name: 'ServerMetadataType',
  fields: () => ({
    port: {
      type: graphql_1.GraphQLInt
    }
  })
});
exports.ServerMetadataInputType = new graphql_1.GraphQLInputObjectType({
  name: 'ServerMetadataInputType',
  fields: () => ({
    port: {
      type: graphql_1.GraphQLInt
    }
  })
});
},{}],"types/link-list.type.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const graphql_1 = require("graphql");

const server_metadata_type_1 = require("./server-metadata.type");

exports.LinkListType = new graphql_1.GraphQLObjectType({
  name: 'LinkListType',
  fields: () => ({
    repoPath: {
      type: graphql_1.GraphQLString
    },
    introspectionPath: {
      type: graphql_1.GraphQLString
    },
    linkName: {
      type: graphql_1.GraphQLString
    },
    serverMetadata: {
      type: server_metadata_type_1.ServerMetadataType
    }
  })
});
},{"./server-metadata.type":"types/server-metadata.type.ts"}],"api-introspection/index.ts":[function(require,module,exports) {
"use strict"; // tslint:disable
// graphql typescript definitions

Object.defineProperty(exports, "__esModule", {
  value: true
}); // tslint:enable
},{}],"core/services/child.service.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const core_1 = require("@rxdi/core");

const child_process_1 = require("child_process");

let ChildService = class ChildService {
  spawn(command, args, cwd, wait = 30 * 1000) {
    return new Promise((resolve, reject) => {
      const child = child_process_1.spawn(command, args, {
        cwd,
        detached: true
      });
      const timeout = setTimeout(() => {
        const message = `${command} ${args.toString()} exited with timeout after ${wait / 1000} seconds`;
        child.kill(message);
        reject(message);
        clearTimeout(timeout);
      }, wait);
      child.stdout.on('data', data => process.stdout.write(data));
      child.stderr.on('data', data => process.stderr.write(data));
      child.on('close', code => {
        clearTimeout(timeout);

        if (!code) {
          resolve(code);
        } else {
          reject(code);
        }
      });
    });
  }

};
ChildService = __decorate([core_1.Injectable()], ChildService);
exports.ChildService = ChildService;
},{}],"core/services/daemon.service.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _a, _b;

const core_1 = require("@rxdi/core");

const fs_1 = require("fs");

const util_1 = require("util");

const rxjs_1 = require("rxjs");

const operators_1 = require("rxjs/operators");

const list_service_1 = require("./list.service");

const child_service_1 = require("./child.service");

const daemon_config_1 = require("../../daemon.config");

const {
  mkdirp
} = require('@rxdi/core/dist/services/file/dist');

let DaemonService = class DaemonService {
  constructor(listService, childService) {
    this.listService = listService;
    this.childService = childService;
    this.noop = rxjs_1.of([]);
  }

  notifyDaemon(payload) {
    return this.findByRepoPath(payload).pipe(operators_1.switchMap(([mainNode]) => this.saveMainNode(Object.assign(mainNode ? mainNode : {}, {
      serverMetadata: payload.serverMetadata
    }))), operators_1.switchMap(mainNode => this.findLinkedRepos(mainNode)), operators_1.switchMap(otherRepos => rxjs_1.combineLatest([this.trigger(payload), ...otherRepos.map(r => this.trigger(Object.assign(r, {
      serverMetadata: payload.serverMetadata
    })))])), operators_1.map(() => payload));
  }

  trigger(payload) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!(yield util_1.promisify(fs_1.exists)(payload.repoPath))) {
        yield util_1.promisify(mkdirp)(payload.repoPath);
      }

      const gapiLocalConfig = `${payload.repoPath}/gapi-cli.conf.yml`;

      if (!(yield util_1.promisify(fs_1.exists)(gapiLocalConfig))) {
        yield this.writeGapiCliConfig(gapiLocalConfig, payload);
      }

      const args = ['schema', 'introspect', '--collect-documents', '--collect-types'];
      yield this.childService.spawn('gapi', args, payload.repoPath);
      return payload;
    });
  }

  saveMainNode(payload) {
    return __awaiter(this, void 0, void 0, function* () {
      let processList = [];
      const encoding = 'utf8';

      try {
        processList = JSON.parse((yield util_1.promisify(fs_1.readFile)(daemon_config_1.GAPI_DAEMON_PROCESS_LIST_FOLDER, {
          encoding
        })));
      } catch (e) {}

      yield util_1.promisify(fs_1.writeFile)(daemon_config_1.GAPI_DAEMON_PROCESS_LIST_FOLDER, JSON.stringify(processList.filter(p => p.repoPath !== payload.repoPath).concat(payload)), {
        encoding
      });
      return payload;
    });
  }

  writeGapiCliConfig(gapiLocalConfig, payload) {
    return __awaiter(this, void 0, void 0, function* () {
      let port = 9000;

      if (payload.serverMetadata.port) {
        port = payload.serverMetadata.port;
      }

      return yield util_1.promisify(fs_1.writeFile)(gapiLocalConfig, `
config:
  schema:
    introspectionEndpoint: http://localhost:${port}/graphql
    introspectionOutputFolder: ./api-introspection
`);
    });
  }

  findByRepoPath(payload) {
    return rxjs_1.from(this.listService.readList()).pipe(operators_1.switchMap(list => list.length ? this.listService.findByRepoPath(payload.repoPath) : this.noop));
  }

  findLinkedRepos(repo) {
    return repo && repo.linkName ? this.listService.findByLinkName(repo.linkName).exclude(repo.repoPath) : this.noop;
  }

};
DaemonService = __decorate([core_1.Service(), __metadata("design:paramtypes", [typeof (_a = typeof list_service_1.ListService !== "undefined" && list_service_1.ListService) === "function" ? _a : Object, typeof (_b = typeof child_service_1.ChildService !== "undefined" && child_service_1.ChildService) === "function" ? _b : Object])], DaemonService);
exports.DaemonService = DaemonService;
},{"./list.service":"core/services/list.service.ts","./child.service":"core/services/child.service.ts","../../daemon.config":"daemon.config.ts"}],"core/interceptors/notify.interceptor.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const core_1 = require("@gapi/core");

const operators_1 = require("rxjs/operators");

let NotifyInterceptor = class NotifyInterceptor {
  intercept(chainable$, context, payload, descriptor) {
    console.log('Before...');
    const options = {
      timeout: 2
    }; // notifier.notify({
    //     'title': `Daemon triggered!`,
    //     'message': `${payload.repoPath}`,
    //     ...options
    // });

    const now = Date.now();
    return chainable$.pipe(operators_1.tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }

};
NotifyInterceptor = __decorate([core_1.Injectable()], NotifyInterceptor);
exports.NotifyInterceptor = NotifyInterceptor;
},{}],"server.controller.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _a, _b, _c, _d, _e;

const core_1 = require("@gapi/core");

const list_service_1 = require("./core/services/list.service");

const link_list_type_1 = require("./types/link-list.type");

const api_introspection_1 = require("./api-introspection");

const daemon_service_1 = require("./core/services/daemon.service");

const rxjs_1 = require("rxjs");

const server_metadata_type_1 = require("./types/server-metadata.type");

const notify_interceptor_1 = require("./core/interceptors/notify.interceptor");

let ServerController = class ServerController {
  constructor(listService, daemonService, pubsub) {
    this.listService = listService;
    this.daemonService = daemonService;
    this.pubsub = pubsub;
    let count = 0;
    setInterval(() => {
      pubsub.publish('CREATE_SIGNAL_BASIC', count++);
    }, 2000);
  }

  statusSubscription(message) {
    return {
      repoPath: message
    };
  }

  getLinkList() {
    return this.listService.readList();
  }

  notifyDaemon(root, payload) {
    return this.daemonService.notifyDaemon(payload);
  }

};

__decorate([core_1.Type(link_list_type_1.LinkListType), core_1.Subscribe(self => self.pubsub.asyncIterator('CREATE_SIGNAL_BASIC')), core_1.Interceptor(notify_interceptor_1.NotifyInterceptor), core_1.Subscription(), __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", void 0)], ServerController.prototype, "statusSubscription", null);

__decorate([core_1.Type(new core_1.GraphQLList(link_list_type_1.LinkListType)), core_1.Query(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], ServerController.prototype, "getLinkList", null);

__decorate([core_1.Type(link_list_type_1.LinkListType), core_1.Interceptor(notify_interceptor_1.NotifyInterceptor), core_1.Mutation({
  repoPath: {
    type: new core_1.GraphQLNonNull(core_1.GraphQLString)
  },
  introspectionPath: {
    type: core_1.GraphQLString
  },
  linkName: {
    type: core_1.GraphQLString
  },
  serverMetadata: {
    type: server_metadata_type_1.ServerMetadataInputType
  }
}), __metadata("design:type", Function), __metadata("design:paramtypes", [Object, typeof (_a = typeof api_introspection_1.ILinkListType !== "undefined" && api_introspection_1.ILinkListType) === "function" ? _a : Object]), __metadata("design:returntype", typeof (_b = typeof rxjs_1.Observable !== "undefined" && rxjs_1.Observable) === "function" ? _b : Object)], ServerController.prototype, "notifyDaemon", null);

ServerController = __decorate([core_1.Controller(), __metadata("design:paramtypes", [typeof (_c = typeof list_service_1.ListService !== "undefined" && list_service_1.ListService) === "function" ? _c : Object, typeof (_d = typeof daemon_service_1.DaemonService !== "undefined" && daemon_service_1.DaemonService) === "function" ? _d : Object, typeof (_e = typeof core_1.PubSubService !== "undefined" && core_1.PubSubService) === "function" ? _e : Object])], ServerController);
exports.ServerController = ServerController;
},{"./core/services/list.service":"core/services/list.service.ts","./types/link-list.type":"types/link-list.type.ts","./api-introspection":"api-introspection/index.ts","./core/services/daemon.service":"core/services/daemon.service.ts","./types/server-metadata.type":"types/server-metadata.type.ts","./core/interceptors/notify.interceptor":"core/interceptors/notify.interceptor.ts"}],"core/core.module.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const core_1 = require("@rxdi/core");

const list_service_1 = require("./services/list.service");

const daemon_service_1 = require("./services/daemon.service");

const child_service_1 = require("./services/child.service");

let CoreModule = class CoreModule {};
CoreModule = __decorate([core_1.Module({
  services: [list_service_1.ListService, daemon_service_1.DaemonService, child_service_1.ChildService]
})], CoreModule);
exports.CoreModule = CoreModule;
},{"./services/list.service":"core/services/list.service.ts","./services/daemon.service":"core/services/daemon.service.ts","./services/child.service":"core/services/child.service.ts"}],"server.module.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const core_1 = require("@gapi/core");

const server_controller_1 = require("./server.controller");

const core_module_1 = require("./core/core.module");

let ServerModule = class ServerModule {};
ServerModule = __decorate([core_1.Module({
  imports: [core_module_1.CoreModule],
  controllers: [server_controller_1.ServerController]
})], ServerModule);
exports.ServerModule = ServerModule;
},{"./server.controller":"server.controller.ts","./core/core.module":"core/core.module.ts"}],"core/services/plugin-watcher.service.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _a, _b;

const core_1 = require("@rxdi/core");

const chokidar_1 = require("chokidar");

const daemon_config_1 = require("../../daemon.config");

const child_service_1 = require("./child.service");

const rxjs_1 = require("rxjs");

let PluginWatcherService = class PluginWatcherService {
  constructor(childService, fileService) {
    this.childService = childService;
    this.fileService = fileService;
  }

  isNotFromExternalPlugins(path) {
    return !path.includes('external-plugins');
  }

  watch() {
    return new rxjs_1.Observable(observer => {
      const initPlugins = [];
      let isInitFinished = false;
      const watcher = chokidar_1.watch([`${daemon_config_1.GAPI_DAEMON_EXTERNAL_PLUGINS_FOLDER}/**/*.js`, `${daemon_config_1.GAPI_DAEMON_PLUGINS_FOLDER}/**/*.js`, daemon_config_1.IPFS_HASHED_MODULES], {
        ignored: /^\./,
        persistent: true
      });
      watcher.on('add', path => {
        if (!isInitFinished && this.isNotFromExternalPlugins(path)) {
          console.log('Plugin', path, 'has been added');
          initPlugins.push(path);
        } else {
          console.log('Present external module', path);
        }

        if (isInitFinished && this.isNotFromExternalPlugins(path)) {
          this.restartDaemon();
        }
      }).on('change', path => {
        console.log('File', path, 'has been changed');

        if (isInitFinished) {
          this.restartDaemon();
        }
      }).on('ready', () => {
        console.log('Initial scan complete. Ready for changes');
        isInitFinished = true;
        observer.next(initPlugins);
        observer.complete();
      }).on('unlink', path => {
        console.log('File', path, 'has been removed');

        if (isInitFinished) {
          this.restartDaemon();
        }
      }).on('error', error => console.error('Error happened', error));
    });
  }

  restartDaemon() {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.childService.spawn('gapi', ['daemon', 'restart'], process.cwd());
      process.exit();
    });
  }

};
PluginWatcherService = __decorate([core_1.Injectable(), __metadata("design:paramtypes", [typeof (_a = typeof child_service_1.ChildService !== "undefined" && child_service_1.ChildService) === "function" ? _a : Object, typeof (_b = typeof core_1.FileService !== "undefined" && core_1.FileService) === "function" ? _b : Object])], PluginWatcherService);
exports.PluginWatcherService = PluginWatcherService;
},{"../../daemon.config":"daemon.config.ts","./child.service":"core/services/child.service.ts"}],"core/services/plugin-loader.service.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _a, _b, _c;

const core_1 = require("@rxdi/core");

const operators_1 = require("rxjs/operators");

const rxjs_1 = require("rxjs");

const daemon_config_1 = require("../../daemon.config");

const plugin_watcher_service_1 = require("./plugin-watcher.service");

const fs_1 = require("fs");

const util_1 = require("util");

let PluginLoader = class PluginLoader {
  constructor(externalImporterService, fileService, pluginWatcherService) {
    this.externalImporterService = externalImporterService;
    this.fileService = fileService;
    this.pluginWatcherService = pluginWatcherService;
    this.defaultIpfsProvider = "https://ipfs.io/ipfs/";
    this.defaultDownloadFilename = "gapi-plugin";
    this.fileWatcher = new rxjs_1.Subject();
    this.cache = {};
  }

  getModule(hash, provider = this.defaultIpfsProvider) {
    if (this.isModuleHashed(hash)) {
      return this.cache[hash];
    }

    return this.externalImporterService.downloadIpfsModuleConfig({
      hash,
      provider
    }).pipe(operators_1.take(1), operators_1.switchMap(externalModule => this.externalImporterService.importModule({
      fileName: this.defaultDownloadFilename,
      namespace: externalModule.name,
      extension: "js",
      outputFolder: `${daemon_config_1.GAPI_DAEMON_EXTERNAL_PLUGINS_FOLDER}/`,
      link: `${this.defaultIpfsProvider}${externalModule.module}`
    }, externalModule.name, {
      folderOverride: `//`
    })), operators_1.map(data => {
      const currentModule = this.loadModule(data);
      this.cache[hash] = currentModule;
      return currentModule;
    }));
  }

  isModuleHashed(hash) {
    return !!this.cache[hash];
  }

  cacheModule(currentModule) {
    if (currentModule.metadata) {
      this.cache[currentModule.metadata.moduleHash] = currentModule;
    }
  }

  loadModule(m) {
    const currentModule = m[Object.keys(m)[0]];

    if (!currentModule) {
      throw new Error("Missing cache module ${JSON.stringify(m)}");
    }

    this.cacheModule(currentModule);
    return currentModule;
  }

  makeIpfsHashFile() {
    return __awaiter(this, void 0, void 0, function* () {
      if (!(yield util_1.promisify(fs_1.exists)(daemon_config_1.IPFS_HASHED_MODULES))) {
        yield util_1.promisify(fs_1.writeFile)(daemon_config_1.IPFS_HASHED_MODULES, JSON.stringify([], null, 4), {
          encoding: 'utf8'
        });
      }
    });
  }

  makePluginsDirectories() {
    return rxjs_1.of(true).pipe(operators_1.switchMap(() => this.makeIpfsHashFile()), operators_1.switchMap(() => this.fileService.mkdirp(daemon_config_1.GAPI_DAEMON_EXTERNAL_PLUGINS_FOLDER)), operators_1.switchMap(() => this.fileService.mkdirp(daemon_config_1.GAPI_DAEMON_PLUGINS_FOLDER)));
  }

  loadIpfsHashes() {
    let hashes = [];

    try {
      hashes = JSON.parse(fs_1.readFileSync(daemon_config_1.IPFS_HASHED_MODULES, {
        encoding: 'utf8'
      }));
    } catch (e) {}

    return hashes;
  }

  loadPlugins() {
    return this.makePluginsDirectories().pipe(operators_1.switchMap(() => this.pluginWatcherService.watch()), // switchMap(() => this.fileService.fileWalker(pluginsFolder)),
    operators_1.map(p => [...new Set(p)].map(path => !new RegExp(/^(.(?!.*\.js$))*$/g).test(path) ? this.loadModule(require(path)) : null)), operators_1.switchMap(pluginModules => rxjs_1.of(null).pipe(operators_1.combineLatest([...new Set(this.loadIpfsHashes())].map(hash => this.getModule(hash))), operators_1.map(externalModules => externalModules.concat(pluginModules)), operators_1.map(m => m.filter(i => !!i)), operators_1.map(modules => this.filterDups(modules)))));
  }

  filterDups(modules) {
    return [...new Set(modules.map(i => i.metadata.moduleHash))].map(m => this.cache[m]);
  }

};
PluginLoader = __decorate([core_1.Injectable(), __metadata("design:paramtypes", [typeof (_a = typeof core_1.ExternalImporter !== "undefined" && core_1.ExternalImporter) === "function" ? _a : Object, typeof (_b = typeof core_1.FileService !== "undefined" && core_1.FileService) === "function" ? _b : Object, typeof (_c = typeof plugin_watcher_service_1.PluginWatcherService !== "undefined" && plugin_watcher_service_1.PluginWatcherService) === "function" ? _c : Object])], PluginLoader);
exports.PluginLoader = PluginLoader;
},{"../../daemon.config":"daemon.config.ts","./plugin-watcher.service":"core/services/plugin-watcher.service.ts"}],"main.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const core_1 = require("@rxdi/core");

const server_module_1 = require("./server.module");

const core_2 = require("@gapi/core");

const core_3 = require("@gapi/core");

const operators_1 = require("rxjs/operators");

const plugin_loader_service_1 = require("./core/services/plugin-loader.service");

const plugin_watcher_service_1 = require("./core/services/plugin-watcher.service");

core_3.Container.get(plugin_loader_service_1.PluginLoader).loadPlugins().pipe(operators_1.switchMap(pluginModules => core_1.setup({
  imports: [...pluginModules, core_2.CoreModule.forRoot({
    server: {
      hapi: {
        port: 42001
      }
    },
    graphql: {
      graphiql: true,
      openBrowser: true,
      graphiQlPlayground: false
    },
    // pubsub: {
    //   host: 'localhost',
    //   port: 5672,
    //   log: true,
    //   activateRabbitMQ: true
    // },
    daemon: {
      activated: true,
      link: 'http://localhost:42001/graphql'
    }
  }), server_module_1.ServerModule],
  providers: [plugin_watcher_service_1.PluginWatcherService]
}))).subscribe(() => console.log('Server started'), console.error.bind(console));
},{"./server.module":"server.module.ts","./core/services/plugin-loader.service":"core/services/plugin-loader.service.ts","./core/services/plugin-watcher.service":"core/services/plugin-watcher.service.ts"}]},{},["main.ts"], null)
//# sourceMappingURL=/main.js.map