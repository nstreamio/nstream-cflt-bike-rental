// @swim/platform v4.0.0-dev.20210927.1 (c) 2015-2021 Swim.inc
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("@swim/runtime"), require("@swim/runtime"), require("@swim/runtime"), require("@swim/toolkit"), require("@swim/runtime"), require("@swim/toolkit"), require("@swim/toolkit"), require("@swim/toolkit"), require("@swim/toolkit"), require("@swim/toolkit"), require("@swim/toolkit"), require("@swim/toolkit"), require("@swim/runtime"), require("@swim/toolkit"), require("@swim/toolkit"), require("@swim/toolkit"), require("@swim/toolkit"), require("@swim/toolkit"), require("@swim/toolkit"), require("@swim/runtime"), require("@swim/runtime"), require("@swim/runtime"), require("@swim/runtime"), require("@swim/toolkit"), require("@swim/toolkit"), require("@swim/toolkit"), require("@swim/runtime"), require("@swim/runtime")) : typeof define === "function" && define.amd ? define([ "exports", "@swim/runtime", "@swim/runtime", "@swim/runtime", "@swim/toolkit", "@swim/runtime", "@swim/toolkit", "@swim/toolkit", "@swim/toolkit", "@swim/toolkit", "@swim/toolkit", "@swim/toolkit", "@swim/toolkit", "@swim/runtime", "@swim/toolkit", "@swim/toolkit", "@swim/toolkit", "@swim/toolkit", "@swim/toolkit", "@swim/toolkit", "@swim/runtime", "@swim/runtime", "@swim/runtime", "@swim/runtime", "@swim/toolkit", "@swim/toolkit", "@swim/toolkit", "@swim/runtime", "@swim/runtime" ], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, 
  factory(global.swim = global.swim || {}, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim));
})(this, (function(exports, util, codec, time, model, component, view, dom, theme, controller, table, graphics, gauge, math, pie, chart, token, window, style, button, constraint, client, uri, geo, map, mapbox, deck, structure, recon) {
  "use strict";
  function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }
  class Status {
    constructor(name) {
      this.name = name;
    }
    toString() {
      return "Status" + "." + this.name;
    }
  }
  Status.normal = new Status("normal");
  Status.inactive = new Status("inactive");
  Status.warning = new Status("warning");
  Status.alert = new Status("alert");
  class StatusVector {
    constructor(array, index) {
      this.array = array;
      this.index = index;
    }
    get size() {
      return this.array.length;
    }
    isDefined() {
      const array = this.array;
      for (let i = 0, n = array.length; i < n; i += 1) {
        if (array[i][1] !== 0) {
          return true;
        }
      }
      return false;
    }
    isEmpty() {
      return this.array.length === 0;
    }
    has(key) {
      if (typeof key === "object" && key !== null || typeof key === "function") {
        key = key.name;
      }
      return this.index[key] !== void 0;
    }
    get(key) {
      if (typeof key === "object" && key !== null || typeof key === "function") {
        key = key.name;
      }
      if (typeof key === "string") {
        key = this.index[key];
      }
      const entry = typeof key === "number" ? this.array[key] : void 0;
      return entry !== void 0 ? entry[1] : void 0;
    }
    updated(key, value) {
      const oldArray = this.array;
      const oldIndex = this.index;
      const i = oldIndex[key.name];
      if (value !== void 0 && i !== void 0) {
        const newArray = oldArray.slice(0);
        newArray[i] = [ key, value ];
        return this.copy(newArray, oldIndex);
      } else if (value !== void 0) {
        const newArray = oldArray.slice(0);
        const newIndex = {};
        for (const name in oldIndex) {
          newIndex[name] = oldIndex[name];
        }
        newIndex[key.name] = newArray.length;
        newArray.push([ key, value ]);
        return this.copy(newArray, newIndex);
      } else if (i !== void 0) {
        const newArray = new Array;
        const newIndex = {};
        let k = 0;
        for (let j = 0, n = oldArray.length; j < n; j += 1) {
          const entry = oldArray[j];
          if (entry[0] !== key) {
            newArray[k] = entry;
            newIndex[entry[0].name] = k;
            k += 1;
          }
        }
        return this.copy(newArray, newIndex);
      } else {
        return this;
      }
    }
    plus(that) {
      const thisArray = this.array;
      const thatArray = that.array;
      const newArray = new Array;
      const newIndex = {};
      for (let i = 0, n = thisArray.length; i < n; i += 1) {
        const entry = thisArray[i];
        const key = entry[0];
        const y = that.get(key);
        newIndex[key.name] = newArray.length;
        newArray.push(y === void 0 ? entry : [ key, entry[1] + y ]);
      }
      for (let i = 0, n = thatArray.length; i < n; i += 1) {
        const entry = thatArray[i];
        const key = entry[0];
        if (newIndex[key.name] === void 0) {
          newIndex[key.name] = newArray.length;
          newArray.push(entry);
        }
      }
      return this.copy(newArray, newIndex);
    }
    negative() {
      const oldArray = this.array;
      const n = oldArray.length;
      const newArray = new Array(n);
      for (let i = 0; i < n; i += 1) {
        const [key, x] = oldArray[i];
        newArray[i] = [ key, -x ];
      }
      return this.copy(newArray, this.index);
    }
    minus(that) {
      const thisArray = this.array;
      const thatArray = that.array;
      const newArray = new Array;
      const newIndex = {};
      for (let i = 0, n = thisArray.length; i < n; i += 1) {
        const entry = thisArray[i];
        const key = entry[0];
        const y = that.get(key);
        newIndex[key.name] = newArray.length;
        newArray.push(y === void 0 ? entry : [ key, entry[1] - y ]);
      }
      for (let i = 0, n = thatArray.length; i < n; i += 1) {
        const [key, y] = thatArray[i];
        if (newIndex[key.name] === void 0) {
          newIndex[key.name] = newArray.length;
          newArray.push([ key, -y ]);
        }
      }
      return this.copy(newArray, newIndex);
    }
    times(scalar) {
      const oldArray = this.array;
      const n = oldArray.length;
      const newArray = new Array(n);
      for (let i = 0; i < n; i += 1) {
        const [key, x] = oldArray[i];
        newArray[i] = [ key, x * scalar ];
      }
      return this.copy(newArray, this.index);
    }
    dot(that) {
      const array = this.array;
      let combination;
      for (let i = 0, n = array.length; i < n; i += 1) {
        const [key, x] = array[i];
        const y = that.get(key);
        if (y !== void 0) {
          if (combination === void 0) {
            combination = x * y;
          } else {
            combination += x * y;
          }
        }
      }
      return combination;
    }
    copy(array, index) {
      return StatusVector.fromArray(array, index);
    }
    forEach(callback, thisArg) {
      const array = this.array;
      for (let i = 0, n = array.length; i < n; i += 1) {
        const entry = array[i];
        const result = callback.call(thisArg, entry[1], entry[0]);
        if (result !== void 0) {
          return result;
        }
      }
      return void 0;
    }
    equals(that) {
      if (this === that) {
        return true;
      } else if (that instanceof StatusVector) {
        return util.Arrays.equal(this.array, that.array);
      }
      return false;
    }
    debug(output) {
      const array = this.array;
      const n = array.length;
      output = output.write("StatusVector").write(46).write(n !== 0 ? "of" : "empty").write(40);
      for (let i = 0; i < n; i += 1) {
        const [key, value] = array[i];
        if (i !== 0) {
          output = output.write(", ");
        }
        output = output.write(91).debug(key).write(", ").debug(value).write(93);
      }
      output = output.write(41);
      return output;
    }
    toString() {
      return codec.Format.debug(this);
    }
    static empty() {
      return new StatusVector([], {});
    }
    static of(...keys) {
      return new StatusVector(keys, StatusVector.index(keys));
    }
    static fromArray(array, index) {
      if (index === void 0) {
        index = StatusVector.index(array);
      }
      return new StatusVector(array, index);
    }
    static fromAny(value) {
      if (value === void 0 || value === null || value instanceof StatusVector) {
        return value;
      } else if (Array.isArray(value)) {
        return StatusVector.fromArray(value);
      }
      throw new TypeError("" + value);
    }
    static index(array) {
      const index = {};
      for (let i = 0, n = array.length; i < n; i += 1) {
        const entry = array[i];
        index[entry[0].name] = i;
      }
      return index;
    }
  }
  __decorate([ util.Lazy ], StatusVector, "empty", null);
  class StatusFactor {
    constructor(name, vector, weight, since) {
      this.name = name;
      this.vector = vector;
      this.weight = weight;
      this.since = since;
    }
    equals(that) {
      if (this === that) {
        return true;
      } else if (that instanceof StatusFactor) {
        return this.name === that.name && this.vector.equals(that.vector) && this.weight === that.weight && this.since.equals(that.since);
      }
      return false;
    }
    debug(output) {
      output = output.write("StatusFactor").write(46).write("create").write(40).debug(this.name).write(", ").debug(this.vector).write(", ").debug(this.weight).write(", ").debug(this.since).write(41);
      return output;
    }
    toString() {
      return codec.Format.debug(this);
    }
    static create(name, vector, weight, since) {
      vector = StatusVector.fromAny(vector);
      if (weight === void 0) {
        weight = 1;
      }
      if (since === void 0) {
        since = time.DateTime.current();
      } else {
        since = time.DateTime.fromAny(since);
      }
      return new StatusFactor(name, vector, weight, since);
    }
    static fromInit(init) {
      const name = init.name;
      const vector = StatusVector.fromAny(init.vector);
      const weight = init.weight !== void 0 ? init.weight : 1;
      const since = init.since !== void 0 ? time.DateTime.fromAny(init.since) : time.DateTime.current();
      return new StatusFactor(name, vector, weight, since);
    }
    static fromAny(value) {
      if (value === void 0 || value === null || value instanceof StatusFactor) {
        return value;
      } else if (StatusFactor.isInit(value)) {
        return StatusFactor.fromInit(value);
      }
      throw new TypeError("" + value);
    }
    static isInit(value) {
      if (typeof value === "object" && value !== null) {
        const init = value;
        return typeof init.name === "string" && init.vector !== void 0;
      }
      return false;
    }
    static isAny(value) {
      return value instanceof StatusFactor || StatusFactor.isInit(value);
    }
  }
  class StatusTrait extends model.Trait {
    constructor() {
      super();
      this.statusFactors = null;
      this.statusVector = StatusVector.empty();
    }
    getStatusFactor(statusName) {
      const statusFactors = this.statusFactors;
      if (statusFactors !== null) {
        const statusFactor = statusFactors[statusName];
        if (statusFactor !== void 0) {
          return statusFactor;
        }
      }
      return null;
    }
    setStatusFactor(statusName, newStatusFactor) {
      let statusFactors = this.statusFactors;
      if (statusFactors === null && newStatusFactor !== null) {
        statusFactors = {};
        this.statusFactors = statusFactors;
      }
      let oldStatusFactor;
      if (statusFactors !== null) {
        oldStatusFactor = statusFactors[statusName];
      }
      if (oldStatusFactor === void 0) {
        oldStatusFactor = null;
      }
      if (!util.Equals(oldStatusFactor, newStatusFactor)) {
        this.willSetStatusFactor(statusName, newStatusFactor, oldStatusFactor);
        if (newStatusFactor !== null) {
          statusFactors[statusName] = newStatusFactor;
        } else {
          delete statusFactors[statusName];
        }
        this.onSetStatusFactor(statusName, newStatusFactor, oldStatusFactor);
        this.didSetStatusFactor(statusName, newStatusFactor, oldStatusFactor);
      }
    }
    willSetStatusFactor(statusName, newStatusFactor, oldStatusFactor) {
      this.callObservers("traitWillSetStatusFactor", statusName, newStatusFactor, oldStatusFactor, this);
    }
    onSetStatusFactor(statusName, newStatusFactor, oldStatusFactor) {
      this.requireUpdate(model.Model.NeedsAggregate);
    }
    didSetStatusFactor(statusName, newStatusFactor, oldStatusFactor) {
      this.callObservers("traitDidSetStatusFactor", statusName, newStatusFactor, oldStatusFactor, this);
    }
    setStatusVector(newStatusVector) {
      const oldStatusVector = this.statusVector;
      if (!oldStatusVector.equals(newStatusVector)) {
        this.willSetStatusVector(newStatusVector, oldStatusVector);
        this.statusVector = newStatusVector;
        this.onSetStatusVector(newStatusVector, oldStatusVector);
        this.didSetStatusVector(newStatusVector, oldStatusVector);
      }
    }
    willSetStatusVector(newStatusVector, oldStatusVector) {
      this.callObservers("traitWillSetStatusVector", newStatusVector, oldStatusVector, this);
    }
    onSetStatusVector(newStatusVector, oldStatusVector) {}
    didSetStatusVector(newStatusVector, oldStatusVector) {
      this.callObservers("traitDidSetStatusVector", newStatusVector, oldStatusVector, this);
    }
    combinedStatus() {
      const statusFactors = this.statusFactors;
      let statusVector = StatusVector.empty();
      let statusTotal = 0;
      if (statusFactors !== null) {
        for (const statusName in statusFactors) {
          const statusFactor = statusFactors[statusName];
          statusVector = statusVector.plus(statusFactor.vector.times(statusFactor.weight));
          statusTotal += statusFactor.weight;
        }
      }
      if (statusTotal !== 0) {
        statusVector = statusVector.times(1 / statusTotal);
      }
      return statusVector;
    }
    aggregateStatus() {
      this.setStatusVector(this.combinedStatus());
    }
    needsUpdate(updateFlags, immediate) {
      updateFlags = super.needsUpdate(updateFlags, immediate);
      if ((updateFlags & model.Model.NeedsAggregate) !== 0) {
        this.setModelFlags(this.modelFlags | model.Model.NeedsAggregate);
      }
      return updateFlags;
    }
    needsAnalyze(analyzeFlags, modelContext) {
      if ((this.modelFlags & model.Model.NeedsAggregate) === 0) {
        analyzeFlags &= ~model.Model.NeedsAggregate;
      }
      return analyzeFlags;
    }
    didAggregate(modelContext) {
      this.aggregateStatus();
      super.didAggregate(modelContext);
    }
  }
  StatusTrait.MountFlags = model.Trait.MountFlags | model.Model.NeedsAggregate;
  class StatusGroup extends model.Model {
    aggregateStatus(statusVector) {}
    needsAnalyze(analyzeFlags, modelContext) {
      if ((this.flags & model.Model.NeedsAggregate) === 0) {
        analyzeFlags &= ~model.Model.NeedsAggregate;
      }
      return analyzeFlags;
    }
    analyzeChildren(analyzeFlags, modelContext, analyzeChild) {
      if ((analyzeFlags & model.Model.NeedsAggregate) !== 0) {
        this.aggregateChildStatuses(analyzeFlags, modelContext, analyzeChild);
      } else {
        super.analyzeChildren(analyzeFlags, modelContext, analyzeChild);
      }
    }
    aggregateChildStatuses(analyzeFlags, modelContext, analyzeChild) {
      let statusVector = StatusVector.empty();
      let statusCount = 0;
      function aggregateChildStatus(child, analyzeFlags, modelContext) {
        analyzeChild.call(this, child, analyzeFlags, modelContext);
        const childStatusTrait = child.getTrait(StatusTrait);
        if (childStatusTrait !== null) {
          const childStatus = childStatusTrait.statusVector;
          if (childStatus.isDefined()) {
            statusVector = statusVector.plus(childStatus);
            statusCount += 1;
          }
        }
      }
      super.analyzeChildren(analyzeFlags, modelContext, aggregateChildStatus);
      if (statusCount !== 0) {
        statusVector = statusVector.times(1 / statusCount);
      }
      this.aggregateStatus(statusVector);
    }
  }
  StatusGroup.MountFlags = model.Model.MountFlags | model.Model.NeedsAggregate;
  StatusGroup.InsertChildFlags = model.Model.InsertChildFlags | model.Model.NeedsAggregate;
  StatusGroup.RemoveChildFlags = model.Model.RemoveChildFlags | model.Model.NeedsAggregate;
  class IndicatorType {
    constructor(key, name) {
      this.key = key;
      this.name = name;
    }
  }
  class IndicatorMap {
    constructor(indicatorTypeMap, indicatorTypeArray = null) {
      this.indicatorTypeMap = indicatorTypeMap;
      this.indicatorTypeArray = indicatorTypeArray;
    }
    get size() {
      return this.indicatorTypes.length;
    }
    has(key) {
      return this.indicatorTypeMap[key] !== void 0;
    }
    get(key) {
      const indicatorType = this.indicatorTypeMap[key];
      return indicatorType !== void 0 ? indicatorType : null;
    }
    updated(newIndicatorType) {
      const oldIndicatorTypeMap = this.indicatorTypeMap;
      const oldIndicatorType = oldIndicatorTypeMap[newIndicatorType.key];
      if (oldIndicatorType === newIndicatorType) {
        return this;
      } else {
        const newIndicatorTypeMap = {};
        for (const key in oldIndicatorTypeMap) {
          newIndicatorTypeMap[key] = oldIndicatorTypeMap[key];
        }
        newIndicatorTypeMap[newIndicatorType.key] = newIndicatorType;
        return new IndicatorMap(newIndicatorTypeMap);
      }
    }
    merged(that) {
      if (this.size < that.size) {
        return that.merged(this);
      } else {
        let indicatorMap = this;
        for (const key in that.indicatorTypeMap) {
          indicatorMap = indicatorMap.updated(that.indicatorTypeMap[key]);
        }
        return indicatorMap;
      }
    }
    get indicatorTypes() {
      let indicatorTypeArray = this.indicatorTypeArray;
      if (indicatorTypeArray === null) {
        indicatorTypeArray = this.arrangedIndicatorTypes();
        this.indicatorTypeArray = indicatorTypeArray;
      }
      return indicatorTypeArray;
    }
    arrangedIndicatorTypes() {
      const indicatorTypeArray = new Array;
      const indicatorTypeMap = this.indicatorTypeMap;
      for (const key in indicatorTypeMap) {
        const indicatorType = indicatorTypeMap[key];
        indicatorTypeArray.push(indicatorType);
      }
      return indicatorTypeArray;
    }
    static empty() {
      return new IndicatorMap({}, []);
    }
  }
  __decorate([ util.Lazy ], IndicatorMap, "empty", null);
  class IndicatorTrait extends model.Trait {
    constructor(indicatorType) {
      super();
      this.indicatorType = indicatorType;
    }
  }
  class ValueIndicatorTrait extends IndicatorTrait {
    constructor(indicatorType) {
      super(indicatorType);
      this.value = void 0;
    }
    setValue(newValue) {
      const oldValue = this.value;
      if (!util.Equals(oldValue, newValue)) {
        this.willSetValue(newValue, oldValue);
        this.value = newValue;
        this.onSetValue(newValue, oldValue);
        this.didSetValue(newValue, oldValue);
      }
    }
    willSetValue(newValue, oldValue) {
      this.callObservers("indicatorWillSetValue", newValue, oldValue, this);
    }
    onSetValue(newValue, oldValue) {}
    didSetValue(newValue, oldValue) {
      this.callObservers("indicatorDidSetValue", newValue, oldValue, this);
    }
    get formattedValue() {
      let formatted;
      const value = this.value;
      const observers = this.observers;
      for (let i = 0, n = observers.length; i < n; i += 1) {
        const observer = observers[i];
        if (observer.formatIndicator !== void 0) {
          formatted = observer.formatIndicator(value, this);
          if (formatted !== void 0) {
            break;
          }
        }
      }
      if (formatted === void 0) {
        formatted = "" + value;
      }
      return formatted;
    }
  }
  class IndicatorGroup extends StatusGroup {
    constructor() {
      super();
      this.indicatorMap = IndicatorMap.empty();
    }
    setIndicatorMap(indicatorMap) {
      this.indicatorMap = indicatorMap;
    }
    aggregateStatus(statusVector) {
      super.aggregateStatus(statusVector);
      const statusTrait = this.getTrait(StatusTrait);
      if (statusTrait !== null) {
        const oldFactor = statusTrait.getStatusFactor("indicators");
        if (!statusVector.isDefined()) {
          statusTrait.setStatusFactor("indicators", null);
        } else if (oldFactor === null || !statusVector.equals(oldFactor.vector)) {
          statusTrait.setStatusFactor("indicators", StatusFactor.create("Indicators", statusVector));
        }
      }
    }
    needsUpdate(updateFlags, immediate) {
      updateFlags = super.needsUpdate(updateFlags, immediate);
      const propagateFlags = updateFlags & (model.Model.NeedsAggregate | model.Model.NeedsReconcile);
      if (propagateFlags !== 0) {
        this.setFlags(this.flags | propagateFlags);
      }
      return updateFlags;
    }
    needsRefresh(refreshFlags, modelContext) {
      if ((this.flags & model.Model.NeedsReconcile) === 0) {
        refreshFlags &= ~model.Model.NeedsReconcile;
      }
      return refreshFlags;
    }
    refreshChildren(refreshFlags, modelContext, refreshChild) {
      if ((refreshFlags & model.Model.NeedsReconcile) !== 0) {
        this.reconcileChildIndicatorTypes(refreshFlags, modelContext, refreshChild);
      } else {
        super.refreshChildren(refreshFlags, modelContext, refreshChild);
      }
    }
    reconcileChildIndicatorTypes(refreshFlags, modelContext, refreshChild) {
      let indicatorMap = IndicatorMap.empty();
      function reconcileChildIndicatorType(child, refreshFlags, modelContext) {
        refreshChild.call(this, child, refreshFlags, modelContext);
        const indicatorTrait = child.getTrait(IndicatorTrait);
        if (indicatorTrait !== null) {
          indicatorMap = indicatorMap.updated(indicatorTrait.indicatorType);
        }
      }
      super.refreshChildren(refreshFlags, modelContext, reconcileChildIndicatorType);
      this.setIndicatorMap(indicatorMap);
    }
  }
  IndicatorGroup.MountFlags = StatusGroup.MountFlags | model.Model.NeedsAggregate | model.Model.NeedsReconcile;
  IndicatorGroup.InsertChildFlags = StatusGroup.InsertChildFlags | model.Model.NeedsAggregate | model.Model.NeedsReconcile;
  IndicatorGroup.RemoveChildFlags = StatusGroup.RemoveChildFlags | model.Model.NeedsAggregate | model.Model.NeedsReconcile;
  class IndicatedTrait extends model.Trait {
    get indicatorMap() {
      const indicators = this.indicators.model;
      return indicators !== null ? indicators.indicatorMap : IndicatorMap.empty();
    }
    needsUpdate(updateFlags, immediate) {
      updateFlags = super.needsUpdate(updateFlags, immediate);
      const propagateFlags = updateFlags & (model.Model.NeedsAggregate | model.Model.NeedsReconcile);
      if (propagateFlags !== 0) {
        this.setModelFlags(this.modelFlags | propagateFlags);
      }
      return updateFlags;
    }
    needsAnalyze(analyzeFlags, modelContext) {
      if ((this.modelFlags & model.Model.NeedsAggregate) === 0) {
        analyzeFlags &= ~model.Model.NeedsAggregate;
      }
      return analyzeFlags;
    }
    needsRefresh(refreshFlags, modelContext) {
      if ((this.modelFlags & model.Model.NeedsReconcile) === 0) {
        refreshFlags &= ~model.Model.NeedsReconcile;
      }
      return refreshFlags;
    }
  }
  IndicatedTrait.MountFlags = model.Trait.MountFlags | model.Model.NeedsAggregate | model.Model.NeedsReconcile;
  __decorate([ model.ModelRef({
    key: true,
    type: IndicatorGroup,
    binds: true,
    observes: true,
    didAttachModel(indicatorGroup) {
      this.owner.requireUpdate(model.Model.NeedsAggregate | model.Model.NeedsReconcile);
    },
    willDetachModel(indicatorGroup) {
      this.owner.requireUpdate(model.Model.NeedsAggregate | model.Model.NeedsReconcile);
    },
    modelDidInsertChild(child, target) {
      const childIndicator = child.getTrait(IndicatorTrait);
      if (childIndicator !== null) {
        this.owner.requireUpdate(model.Model.NeedsAggregate | model.Model.NeedsReconcile);
      }
    },
    modelWillRemoveChild(child) {
      const childIndicator = child.getTrait(IndicatorTrait);
      if (childIndicator !== null) {
        this.owner.requireUpdate(model.Model.NeedsAggregate | model.Model.NeedsReconcile);
      }
    },
    modelDidStartConsuming() {
      this.owner.requireUpdate(model.Model.NeedsAggregate | model.Model.NeedsReconcile);
    },
    modelWillStopConsuming() {
      this.owner.requireUpdate(model.Model.NeedsAggregate | model.Model.NeedsReconcile);
    },
    createModel() {
      const indicatorGroup = new IndicatorGroup;
      indicatorGroup.setTrait("status", new StatusTrait);
      return indicatorGroup;
    }
  }) ], IndicatedTrait.prototype, "indicators", void 0);
  class IndicatedGroup extends StatusGroup {
    constructor() {
      super();
      this.indicatorMap = IndicatorMap.empty();
    }
    setIndicatorMap(indicatorMap) {
      this.indicatorMap = indicatorMap;
    }
    needsUpdate(updateFlags, immediate) {
      updateFlags = super.needsUpdate(updateFlags, immediate);
      const propagateFlags = updateFlags & (model.Model.NeedsAggregate | model.Model.NeedsReconcile);
      if (propagateFlags !== 0) {
        this.setFlags(this.flags | propagateFlags);
      }
      return updateFlags;
    }
    needsRefresh(refreshFlags, modelContext) {
      if ((this.flags & model.Model.NeedsReconcile) === 0) {
        refreshFlags &= ~model.Model.NeedsReconcile;
      }
      return refreshFlags;
    }
    refreshChildren(refreshFlags, modelContext, refreshChild) {
      if ((refreshFlags & model.Model.NeedsReconcile) !== 0) {
        this.reconcileChildIndicatorMaps(refreshFlags, modelContext, refreshChild);
      } else {
        super.refreshChildren(refreshFlags, modelContext, refreshChild);
      }
    }
    reconcileChildIndicatorMaps(refreshFlags, modelContext, refreshChild) {
      let indicatorMap = IndicatorMap.empty();
      function reconcileChildIndicatorMap(child, refreshFlags, modelContext) {
        refreshChild.call(this, child, refreshFlags, modelContext);
        const childIndicatedTrait = child.getTrait(IndicatedTrait);
        if (childIndicatedTrait !== null) {
          indicatorMap = indicatorMap.merged(childIndicatedTrait.indicatorMap);
        }
      }
      super.refreshChildren(refreshFlags, modelContext, reconcileChildIndicatorMap);
      this.setIndicatorMap(indicatorMap);
    }
  }
  IndicatedGroup.MountFlags = StatusGroup.MountFlags | model.Model.NeedsAggregate | model.Model.NeedsReconcile;
  IndicatedGroup.InsertChildFlags = StatusGroup.InsertChildFlags | model.Model.NeedsAggregate | model.Model.NeedsReconcile;
  IndicatedGroup.RemoveChildFlags = StatusGroup.RemoveChildFlags | model.Model.NeedsAggregate | model.Model.NeedsReconcile;
  class EntityGroup extends IndicatedGroup {
    constructor() {
      super();
      this.sorted = true;
    }
    isSorted(isSorted) {
      if (isSorted === void 0) {
        return this.sorted;
      } else {
        this.sorted = isSorted;
        return this;
      }
    }
    aggregateStatus(statusVector) {
      super.aggregateStatus(statusVector);
      const statusTrait = this.getTrait(StatusTrait);
      if (statusTrait !== null) {
        const oldFactor = statusTrait.getStatusFactor("subentities");
        if (!statusVector.isDefined()) {
          statusTrait.setStatusFactor("subentities", null);
        } else if (oldFactor === null || !statusVector.equals(oldFactor.vector)) {
          statusTrait.setStatusFactor("subentities", StatusFactor.create("Subentities", statusVector));
        }
      }
    }
    onStopConsuming() {
      super.onStopConsuming();
      const statusTrait = this.getTrait(StatusTrait);
      if (statusTrait !== null) {
        statusTrait.setStatusFactor("subentities", null);
      }
    }
  }
  class EntityTrait extends model.Trait {
    constructor(uri) {
      super();
      this.uri = uri;
    }
    aggregateStatus(statusFactors) {
      const statusTrait = this.getTrait(StatusTrait);
      if (statusTrait !== null) {
        for (const statusName in statusFactors) {
          const statusFactor = statusFactors[statusName];
          if (statusFactor !== void 0) {
            statusTrait.setStatusFactor(statusName, statusFactor);
          } else {
            statusTrait.setStatusFactor(statusName, null);
          }
        }
      }
    }
    aggregateIndicatorsStatus(indicatorGroup, statusVector, statusFactors) {
      if (statusVector.isDefined() && indicatorGroup.consuming) {
        statusFactors["indicators"] = StatusFactor.create("Indicators", statusVector);
      } else {
        statusFactors["indicators"] = void 0;
      }
    }
    aggregateSubentitiesStatus(entityGroup, statusVector, statusFactors) {
      if (statusVector.isDefined() && entityGroup.consuming) {
        statusFactors["subentities"] = StatusFactor.create("Subentities", statusVector);
      } else {
        statusFactors["subentities"] = void 0;
      }
    }
    aggregatedChildModelStatus(child, statusFactors) {
      const childStatusTrait = child.getTrait(StatusTrait);
      if (childStatusTrait !== null) {
        if (child instanceof IndicatorGroup) {
          const indicated = this.getTrait(IndicatedTrait);
          if (indicated !== null && child === indicated.indicators.model) {
            this.aggregateIndicatorsStatus(child, childStatusTrait.statusVector, statusFactors);
          }
        } else if (child instanceof EntityGroup) {
          this.aggregateSubentitiesStatus(child, childStatusTrait.statusVector, statusFactors);
        }
      }
    }
    analyzeChildren(analyzeFlags, modelContext, analyzeChildModel, analyzeChildren) {
      if ((analyzeFlags & model.Model.NeedsAggregate) !== 0) {
        this.aggregateChildStatuses(analyzeFlags, modelContext, analyzeChildModel, analyzeChildren);
      } else {
        super.analyzeChildren(analyzeFlags, modelContext, analyzeChildModel, analyzeChildren);
      }
    }
    aggregateChildStatuses(analyzeFlags, modelContext, analyzeChildModel, analyzeChildren) {
      const statusFactors = {};
      const self = this;
      function aggregateChildStatus(child, analyzeFlags, modelContext) {
        analyzeChildModel.call(this, child, analyzeFlags, modelContext);
        self.aggregatedChildModelStatus(child, statusFactors);
      }
      analyzeChildren.call(this.model, analyzeFlags, modelContext, aggregateChildStatus);
      this.aggregateStatus(statusFactors);
    }
    onMount() {
      super.onMount();
      const domain = this.getSuperTrait(DomainTrait);
      if (domain !== null) {
        domain.injectEntity(this);
      }
    }
  }
  __decorate([ component.Property({
    type: String,
    willSetValue(newTitle, oldTitle) {
      this.owner.callObservers("entityWillSetTitle", newTitle, this.owner);
    },
    didSetValue(newTitle, oldTitle) {
      this.owner.callObservers("entityDidSetTitle", newTitle, this.owner);
    },
    equalValues(newTitle, oldTitle) {
      return newTitle === oldTitle;
    }
  }) ], EntityTrait.prototype, "title", void 0);
  __decorate([ component.Property({
    value: null,
    willSetValue(newIcon, oldIcon) {
      this.owner.callObservers("entityWillSetIcon", newIcon, this.owner);
    },
    didSetValue(newIcon, oldIcon) {
      this.owner.callObservers("entityDidSetIcon", newIcon, this.owner);
    },
    equalValues(newIcon, oldIcon) {
      return newIcon === oldIcon;
    }
  }) ], EntityTrait.prototype, "icon", void 0);
  __decorate([ model.ModelRef({
    key: true,
    type: EntityGroup,
    binds: true,
    createModel() {
      const entityGroup = new EntityGroup;
      entityGroup.setTrait("status", new StatusTrait);
      return entityGroup;
    }
  }) ], EntityTrait.prototype, "subentities", void 0);
  class DomainTrait extends model.Trait {
    injectEntity(entityTrait) {
      this.willInjectEntity(entityTrait);
      this.onInjectEntity(entityTrait);
      this.didInjectEntity(entityTrait);
    }
    willInjectEntity(entityTrait) {
      this.callObservers("domainWillInjectEntity", entityTrait, this);
    }
    onInjectEntity(entityTrait) {}
    didInjectEntity(entityTrait) {
      this.callObservers("domainDidInjectEntity", entityTrait, this);
    }
  }
  class DomainGroup extends EntityGroup {}
  class SessionModel extends StatusGroup {
    constructor() {
      super();
      this.domains.insertModel();
    }
    aggregateStatus(statusVector) {
      super.aggregateStatus(statusVector);
      const statusTrait = this.getTrait(StatusTrait);
      if (statusTrait !== null) {
        const oldFactor = statusTrait.getStatusFactor("domains");
        if (!statusVector.isDefined()) {
          statusTrait.setStatusFactor("domains", null);
        } else if (oldFactor === null || !statusVector.equals(oldFactor.vector)) {
          statusTrait.setStatusFactor("domains", StatusFactor.create("Domains", statusVector));
        }
      }
    }
    needsUpdate(updateFlags, immediate) {
      updateFlags = super.needsUpdate(updateFlags, immediate);
      const propagateFlags = updateFlags & (model.Model.NeedsAggregate | model.Model.NeedsReconcile);
      if (propagateFlags !== 0) {
        this.setFlags(this.flags | propagateFlags);
      }
      return updateFlags;
    }
    needsAnalyze(analyzeFlags, modelContext) {
      if ((this.flags & model.Model.NeedsAggregate) !== 0) {
        analyzeFlags &= ~model.Model.NeedsAggregate;
      }
      return analyzeFlags;
    }
  }
  __decorate([ model.ModelRef({
    key: true,
    type: DomainGroup,
    binds: true,
    createModel() {
      const domainGroup = new DomainGroup;
      domainGroup.setTrait("status", new StatusTrait);
      return domainGroup;
    }
  }) ], SessionModel.prototype, "domains", void 0);
  class WidgetView extends dom.HtmlView {
    createHeaderTitle(text) {
      const titleView = dom.HtmlView.create();
      if (text !== void 0) {
        titleView.text(text);
      }
      return titleView;
    }
  }
  __decorate([ component.Property({
    type: Object,
    inherits: true,
    value: null
  }) ], WidgetView.prototype, "edgeInsets", void 0);
  __decorate([ view.ViewRef({
    key: true,
    type: dom.HtmlView,
    binds: true,
    initView(headerView) {
      this.owner.headerTitle.insertView(headerView);
      this.owner.headerSubtitle.insertView(headerView);
    },
    willAttachView(headerView) {
      this.owner.callObservers("viewWillAttachHeader", headerView, this.owner);
    },
    didDetachView(headerView) {
      this.owner.callObservers("viewDidDetachHeader", headerView, this.owner);
    },
    insertChild(parent, child, target, key) {
      if (target !== null) {
        parent.insertChild(child, target, key);
      } else {
        parent.prependChild(child, key);
      }
    }
  }) ], WidgetView.prototype, "header", void 0);
  __decorate([ view.ViewRef({
    implements: true,
    key: "title",
    type: dom.HtmlView,
    binds: true,
    willAttachView(titleView) {
      this.owner.callObservers("viewWillAttachHeaderTitle", titleView, this.owner);
    },
    didDetachView(titleView) {
      this.owner.callObservers("viewDidDetachHeaderTitle", titleView, this.owner);
    },
    get parentView() {
      return this.owner.header.view;
    },
    createView(value) {
      const titleView = dom.HtmlView.create();
      if (value !== void 0) {
        titleView.text(value);
      }
      return titleView;
    },
    fromAny(value) {
      if (typeof value === "string") {
        return this.createView(value);
      } else {
        return dom.HtmlView.fromAny(value);
      }
    }
  }) ], WidgetView.prototype, "headerTitle", void 0);
  __decorate([ view.ViewRef({
    implements: true,
    key: "subtitle",
    type: dom.HtmlView,
    binds: true,
    willAttachView(subtitleView) {
      this.owner.callObservers("viewWillAttachHeaderSubtitle", subtitleView, this.owner);
    },
    didDetachView(subtitleView) {
      this.owner.callObservers("viewDidDetachHeaderSubtitle", subtitleView, this.owner);
    },
    get parentView() {
      return this.owner.header.view;
    },
    createView(value) {
      const subtitleView = dom.HtmlView.create();
      if (value !== void 0) {
        subtitleView.text(value);
      }
      return subtitleView;
    },
    fromAny(value) {
      if (typeof value === "string") {
        return this.createView(value);
      } else {
        return dom.HtmlView.fromAny(value);
      }
    }
  }) ], WidgetView.prototype, "headerSubtitle", void 0);
  __decorate([ view.ViewRef({
    key: true,
    type: dom.HtmlView,
    binds: true,
    willAttachView(footerView) {
      this.owner.callObservers("viewWillAttachFooter", footerView, this.owner);
    },
    didDetachView(footerView) {
      this.owner.callObservers("viewDidDetachFooter", footerView, this.owner);
    }
  }) ], WidgetView.prototype, "footer", void 0);
  __decorate([ view.ViewSet({
    type: dom.HtmlView,
    binds: true,
    willAttachView(gadgetView, targetView) {
      this.owner.callObservers("viewWillAttachGadget", gadgetView, targetView, this.owner);
    },
    didDetachView(gadgetView) {
      this.owner.callObservers("viewDidDetachGadget", gadgetView, this.owner);
    },
    detectView(gadgetView) {
      return null;
    }
  }) ], WidgetView.prototype, "gadgets", void 0);
  class WidgetCard extends WidgetView {
    constructor(node) {
      super(node);
      this.initWidget();
      this.initTheme();
    }
    initWidget() {
      this.addClass("widget");
      this.position.setState("relative", component.Affinity.Intrinsic);
      this.borderTopRightRadius.setState(4, component.Affinity.Intrinsic);
      this.borderBottomRightRadius.setState(4, component.Affinity.Intrinsic);
      this.borderBottomLeftRadius.setState(4, component.Affinity.Intrinsic);
      this.borderTopLeftRadius.setState(4, component.Affinity.Intrinsic);
      this.boxSizing.setState("border-box", component.Affinity.Intrinsic);
      this.overflowX.setState("hidden", component.Affinity.Intrinsic);
      this.overflowY.setState("hidden", component.Affinity.Intrinsic);
      this.pointerEvents.setState("auto", component.Affinity.Intrinsic);
    }
    initTheme() {
      this.modifyTheme(theme.Feel.default, [ [ theme.Feel.raised, 1 ] ]);
    }
    onApplyTheme(theme$1, mood, timing) {
      super.onApplyTheme(theme$1, mood, timing);
      if (this.backgroundColor.hasAffinity(component.Affinity.Intrinsic)) {
        let backgroundColor = theme$1.getOr(theme.Look.backgroundColor, mood, null);
        if (backgroundColor !== null) {
          backgroundColor = backgroundColor.alpha(.9);
        }
        this.backgroundColor.setState(backgroundColor, timing, component.Affinity.Intrinsic);
      }
    }
  }
  __decorate([ view.ViewRef({
    extends: true,
    initView(headerView) {
      WidgetView.header.prototype.initView.call(this, headerView);
      headerView.display.setState("flex", component.Affinity.Intrinsic);
      headerView.justifyContent.setState("space-between", component.Affinity.Intrinsic);
      headerView.height.setState(36, component.Affinity.Intrinsic);
      headerView.paddingLeft.setState(18, component.Affinity.Intrinsic);
      headerView.paddingRight.setState(18, component.Affinity.Intrinsic);
    }
  }) ], WidgetCard.prototype, "header", void 0);
  __decorate([ view.ViewRef({
    extends: true,
    initView(titleView) {
      WidgetView.headerTitle.prototype.initView.call(this, titleView);
      titleView.alignSelf.setState("center", component.Affinity.Intrinsic);
      titleView.color.setLook(theme.Look.neutralColor, component.Affinity.Intrinsic);
    }
  }) ], WidgetCard.prototype, "headerTitle", void 0);
  __decorate([ view.ViewRef({
    extends: true,
    initView(subtitleView) {
      WidgetView.headerSubtitle.prototype.initView.call(this, subtitleView);
      subtitleView.alignSelf.setState("center", component.Affinity.Intrinsic);
      subtitleView.color.setLook(theme.Look.neutralColor, component.Affinity.Intrinsic);
    }
  }) ], WidgetCard.prototype, "headerSubtitle", void 0);
  __decorate([ view.ViewRef({
    extends: true,
    initView(footerView) {
      WidgetView.footer.prototype.initView.call(this, footerView);
      footerView.display.setState("flex", component.Affinity.Intrinsic);
      footerView.justifyContent.setState("space-between", component.Affinity.Intrinsic);
      footerView.height.setState(12, component.Affinity.Intrinsic);
      footerView.paddingLeft.setState(18, component.Affinity.Intrinsic);
      footerView.paddingRight.setState(18, component.Affinity.Intrinsic);
    }
  }) ], WidgetCard.prototype, "footer", void 0);
  class WidgetTrait extends model.Trait {
    startConsumingGadgets() {
      const gadgetTraits = this.gadgets.traits;
      for (const traitId in gadgetTraits) {
        const gadgetTrait = gadgetTraits[traitId];
        gadgetTrait.consume(this);
      }
    }
    stopConsumingGadgets() {
      const gadgetTraits = this.gadgets.traits;
      for (const traitId in gadgetTraits) {
        const gadgetTrait = gadgetTraits[traitId];
        gadgetTrait.unconsume(this);
      }
    }
    onStartConsuming() {
      super.onStartConsuming();
      this.startConsumingGadgets();
    }
    onStopConsuming() {
      super.onStopConsuming();
      this.stopConsumingGadgets();
    }
  }
  __decorate([ component.Property({
    type: String,
    value: null,
    willSetValue(newTitle, oldTitle) {
      this.owner.callObservers("traitWillSetTitle", newTitle, oldTitle, this.owner);
    },
    didSetValue(newTitle, oldTitle) {
      this.owner.callObservers("traitDidSetTitle", newTitle, oldTitle, this.owner);
    },
    equalValues(newTitle, oldTitle) {
      return newTitle === oldTitle;
    }
  }) ], WidgetTrait.prototype, "title", void 0);
  __decorate([ component.Property({
    type: String,
    value: null,
    willSetValue(newSubtitle, oldSubtitle) {
      this.owner.callObservers("traitWillSetSubtitle", newSubtitle, oldSubtitle, this.owner);
    },
    didSetValue(newSubtitle, oldSubtitle) {
      this.owner.callObservers("traitDidSetSubtitle", newSubtitle, oldSubtitle, this.owner);
    },
    equalValues(newSubtitle, oldSubtitle) {
      return newSubtitle === oldSubtitle;
    }
  }) ], WidgetTrait.prototype, "subtitle", void 0);
  __decorate([ model.TraitSet({
    type: model.Trait,
    binds: true,
    willAttachTrait(gadgetTrait, targetTrait) {
      this.owner.callObservers("traitWillAttachGadget", gadgetTrait, targetTrait, this.owner);
    },
    didAttachTrait(gadgetTrait, targetTrait) {
      if (this.owner.consuming) {
        gadgetTrait.consume(this);
      }
    },
    willDetachTrait(gadgetTrait) {
      if (this.owner.consuming) {
        gadgetTrait.unconsume(this);
      }
    },
    didDetachTrait(gadgetTrait) {
      this.owner.callObservers("traitDidDetachGadget", gadgetTrait, this.owner);
    },
    detectModel(model) {
      const observers = this.owner.observers;
      for (let i = 0, n = observers.length; i < n; i += 1) {
        const observer = observers[i];
        if (observer.detectGadgetModel !== void 0) {
          const gadgetTrait = observer.detectGadgetModel(model, this.owner);
          if (gadgetTrait !== null) {
            return gadgetTrait;
          }
        }
      }
      return null;
    },
    detectTrait(trait) {
      return null;
    }
  }) ], WidgetTrait.prototype, "gadgets", void 0);
  class WidgetGroup extends model.Trait {}
  __decorate([ model.TraitSet({
    type: WidgetTrait,
    binds: true,
    willAttachTrait(widgetTrait, targetTrait) {
      this.owner.callObservers("traitWillAttachWidget", widgetTrait, targetTrait, this.owner);
    },
    didDetachTrait(widgetTrait) {
      this.owner.callObservers("traitDidDetachWidget", widgetTrait, this.owner);
    },
    detectModel(model) {
      return model.getTrait(WidgetTrait);
    },
    detectTrait(trait) {
      return null;
    }
  }) ], WidgetGroup.prototype, "widgets", void 0);
  class WidgetController extends controller.Controller {
    setTitle(title) {
      const widgetTrait = this.widget.trait;
      if (widgetTrait !== null) {
        widgetTrait.title.setValue(title);
      }
    }
    setSubtitle(subtitle) {
      const widgetTrait = this.widget.trait;
      if (widgetTrait !== null) {
        widgetTrait.subtitle.setValue(subtitle);
      }
    }
    createHeaderTitleView(title, widgetTrait) {
      if (typeof title === "function") {
        return title(widgetTrait);
      } else {
        return title;
      }
    }
    setHeaderTitleView(title, widgetTrait) {
      const widgetView = this.widget.view;
      if (widgetView !== null) {
        const titleView = title !== null ? this.createHeaderTitleView(title, widgetTrait) : null;
        widgetView.headerTitle.setView(titleView);
      }
    }
    createHeaderSubtitleView(subtitle, widgetTrait) {
      if (typeof subtitle === "function") {
        return subtitle(widgetTrait);
      } else {
        return subtitle;
      }
    }
    setHeaderSubtitleView(subtitle, widgetTrait) {
      const widgetView = this.widget.view;
      if (widgetView !== null) {
        const subtitleView = subtitle !== null ? this.createHeaderSubtitleView(subtitle, widgetTrait) : null;
        widgetView.headerSubtitle.setView(subtitleView);
      }
    }
    didMount() {
      const widgetTrait = this.widget.trait;
      if (widgetTrait !== null) {
        widgetTrait.consume(this);
      }
      super.didMount();
    }
    willUnmount() {
      super.willUnmount();
      const widgetTrait = this.widget.trait;
      if (widgetTrait !== null) {
        widgetTrait.unconsume(this);
      }
    }
  }
  __decorate([ controller.TraitViewRef({
    traitType: WidgetTrait,
    observesTrait: true,
    willAttachTrait(widgetTrait) {
      this.owner.callObservers("controllerWillAttachWidgetTrait", widgetTrait, this.owner);
    },
    didAttachTrait(widgetTrait) {
      const widgetView = this.view;
      if (widgetView !== null) {
        this.owner.setHeaderTitleView(widgetTrait.title.value, widgetTrait);
        this.owner.setHeaderSubtitleView(widgetTrait.subtitle.value, widgetTrait);
      }
      const widgetModel = widgetTrait.model;
      if (widgetModel !== null) {
        let widgetChild = widgetModel.firstChild;
        while (widgetChild !== null) {
          widgetTrait.gadgets.bindModel(widgetChild, null);
          widgetChild = widgetChild.nextSibling;
        }
      }
      const gadgetTraits = widgetTrait.gadgets.traits;
      for (const traitId in gadgetTraits) {
        const gadgetTrait = gadgetTraits[traitId];
        this.owner.gadgets.addTraitController(gadgetTrait);
      }
      if (widgetTrait.mounted) {
        widgetTrait.consume(this);
      }
    },
    willDetachTrait(widgetTrait) {
      if (widgetTrait.mounted) {
        widgetTrait.unconsume(this);
      }
      const gadgetTraits = widgetTrait.gadgets.traits;
      for (const traitId in gadgetTraits) {
        const gadgetTrait = gadgetTraits[traitId];
        this.owner.gadgets.deleteTraitController(gadgetTrait);
      }
      const widgetView = this.view;
      if (widgetView !== null) {
        this.owner.setHeaderTitleView(null, widgetTrait);
        this.owner.setHeaderSubtitleView(null, widgetTrait);
      }
    },
    didDetachTrait(widgetTrait) {
      this.owner.callObservers("controllerDidDetachWidgetTrait", widgetTrait, this.owner);
    },
    traitDidMount(widgetTrait) {
      widgetTrait.consume(this.owner);
    },
    traitWillUnmount(widgetTrait) {
      widgetTrait.unconsume(this.owner);
    },
    traitDidSetTitle(newTitle, oldTitle, widgetTrait) {
      this.owner.setHeaderTitleView(newTitle, widgetTrait);
    },
    traitDidSetSubtitle(newSubtitle, oldSubtitle, widgetTrait) {
      this.owner.setHeaderSubtitleView(newSubtitle, widgetTrait);
    },
    traitWillAttachGadget(gadgetTrait, targetTrait) {
      this.owner.gadgets.addTraitController(gadgetTrait, targetTrait);
    },
    traitDidDetachGadget(gadgetTrait) {
      this.owner.gadgets.deleteTraitController(gadgetTrait);
    },
    detectGadgetModel(model) {
      return null;
    },
    viewType: WidgetView,
    observesView: true,
    initView(widgetView) {
      widgetView.addClass("widget");
      widgetView.header.insertView();
      widgetView.footer.insertView();
      widgetView.modifyTheme(theme.Feel.default, [ [ theme.Feel.transparent, 1 ] ], false);
    },
    willAttachView(widgetView) {
      this.owner.callObservers("controllerWillAttachWidgetView", widgetView, this.owner);
    },
    didAttachView(widgetView) {
      this.owner.header.setView(widgetView.header.view);
      this.owner.headerTitle.setView(widgetView.headerTitle.view);
      this.owner.headerSubtitle.setView(widgetView.headerSubtitle.view);
      this.owner.footer.setView(widgetView.footer.view);
      const widgetTrait = this.trait;
      if (widgetTrait !== null) {
        this.owner.setHeaderTitleView(widgetTrait.title.value, widgetTrait);
        this.owner.setHeaderSubtitleView(widgetTrait.subtitle.value, widgetTrait);
      }
      const gadgetControllers = this.owner.gadgets.controllers;
      for (const controllerId in gadgetControllers) {
        const gadgetController = gadgetControllers[controllerId];
        const gadgetView = gadgetController.gadget.view;
        if (gadgetView !== null && gadgetView.parent === null) {
          gadgetController.gadget.insertView(widgetView, void 0, widgetView.footer.view);
        }
      }
    },
    willDetachView(widgetView) {
      this.owner.header.setView(null);
      this.owner.headerTitle.setView(null);
      this.owner.headerSubtitle.setView(null);
      this.owner.footer.setView(null);
    },
    didDetachView(widgetView) {
      this.owner.callObservers("controllerDidDetachWidgetView", widgetView, this.owner);
    },
    viewWillAttachHeader(headerView) {
      this.owner.header.setView(headerView);
    },
    viewDidDetachHeader(headerView) {
      this.owner.header.setView(null);
    },
    viewWillAttachHeaderTitle(titleView) {
      this.owner.header.setView(titleView);
    },
    viewDidDetachHeaderTitle(titleView) {
      this.owner.header.setView(null);
    },
    viewWillAttachHeaderSubtitle(subtitleView) {
      this.owner.header.setView(subtitleView);
    },
    viewDidDetachHeaderSubtitle(subtitleView) {
      this.owner.header.setView(null);
    },
    viewWillAttachFooter(footerView) {
      this.owner.footer.setView(footerView);
    },
    viewDidDetachFooter(footerView) {
      this.owner.footer.setView(null);
    },
    createView() {
      return WidgetCard.create();
    }
  }) ], WidgetController.prototype, "widget", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView,
    initView(headerView) {
      headerView.addClass("widget-header");
    },
    willAttachView(headerView) {
      this.owner.callObservers("controllerWillAttachHeaderView", headerView, this.owner);
    },
    didDetachView(headerView) {
      this.owner.callObservers("controllerDidDetachHeaderView", headerView, this.owner);
    }
  }) ], WidgetController.prototype, "header", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView,
    initView(titleView) {
      titleView.addClass("widget-title");
    },
    willAttachView(titleView) {
      this.owner.callObservers("controllerWillAttachHeaderTitleView", titleView, this.owner);
    },
    didDetachView(titleView) {
      this.owner.callObservers("controllerDidDetachHeaderTitleView", titleView, this.owner);
    }
  }) ], WidgetController.prototype, "headerTitle", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView,
    initView(subtitleView) {
      subtitleView.addClass("widget-subtitle");
    },
    willAttachView(subtitleView) {
      this.owner.callObservers("controllerWillAttachHeaderSubtitleView", subtitleView, this.owner);
    },
    didDetachView(subtitleView) {
      this.owner.callObservers("controllerDidDetachHeaderSubtitleView", subtitleView, this.owner);
    }
  }) ], WidgetController.prototype, "headerSubtitle", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView,
    initView(footerView) {
      footerView.addClass("widget-footer");
    },
    willAttachView(footerView) {
      this.owner.callObservers("controllerWillAttachFooterView", footerView, this.owner);
    },
    didDetachView(footerView) {
      this.owner.callObservers("controllerDidDetachFooterView", footerView, this.owner);
    }
  }) ], WidgetController.prototype, "footer", void 0);
  __decorate([ controller.TraitViewControllerSet({
    implements: true,
    binds: true,
    observes: true,
    get parentView() {
      return this.owner.widget.view;
    },
    getTraitViewRef(gadgetController) {
      return gadgetController.gadget;
    },
    willAttachController(gadgetController) {
      this.owner.callObservers("controllerWillAttachGadget", gadgetController, this.owner);
    },
    didAttachController(gadgetController) {
      const gadgetTrait = gadgetController.gadget.trait;
      if (gadgetTrait !== null) {
        this.attachGadgetTrait(gadgetTrait, gadgetController);
      }
      const gadgetView = gadgetController.gadget.view;
      if (gadgetView !== null) {
        this.attachGadgetView(gadgetView, gadgetController);
      }
    },
    willDetachController(gadgetController) {
      const gadgetView = gadgetController.gadget.view;
      if (gadgetView !== null) {
        this.detachGadgetView(gadgetView, gadgetController);
      }
      const gadgetTrait = gadgetController.gadget.trait;
      if (gadgetTrait !== null) {
        this.detachGadgetTrait(gadgetTrait, gadgetController);
      }
    },
    didDetachController(gadgetController) {
      this.owner.callObservers("controllerDidDetachGadget", gadgetController, this.owner);
    },
    controllerWillAttachGadgetTrait(gadgetTrait, gadgetController) {
      this.owner.callObservers("controllerWillAttachGadgetTrait", gadgetTrait, gadgetController, this.owner);
      this.attachGadgetTrait(gadgetTrait, gadgetController);
    },
    controllerDidDetachGadgetTrait(gadgetTrait, gadgetController) {
      this.detachGadgetTrait(gadgetTrait, gadgetController);
      this.owner.callObservers("controllerDidDetachGadgetTrait", gadgetTrait, gadgetController, this.owner);
    },
    attachGadgetTrait(gadgetTrait, gadgetController) {},
    detachGadgetTrait(gadgetTrait, gadgetController) {},
    controllerWillAttachGadgetView(gadgetView, gadgetController) {
      this.owner.callObservers("controllerWillAttachGadgetView", gadgetView, gadgetController, this.owner);
      this.attachGadgetView(gadgetView, gadgetController);
    },
    controllerDidDetachGadgetView(gadgetView, gadgetController) {
      this.detachGadgetView(gadgetView, gadgetController);
      this.owner.callObservers("controllerDidDetachGadgetView", gadgetView, gadgetController, this.owner);
    },
    attachGadgetView(gadgetView, gadgetController) {
      gadgetView.addClass("gadget");
      gadgetView.position.setState("relative", component.Affinity.Intrinsic);
    },
    detachGadgetView(gadgetView, gadgetController) {
      gadgetView.remove();
    },
    createController(gadgetTrait) {
      return controller.TraitViewControllerSet.prototype.createController.call(this);
    }
  }) ], WidgetController.prototype, "gadgets", void 0);
  class TableGadgetTextCellController extends table.TextCellController {
    applyStatusVector(statusVector, cellView) {
      const alert = statusVector.get(Status.alert) || 0;
      const warning = statusVector.get(Status.warning) || 0;
      const inactive = statusVector.get(Status.inactive) || 0;
      if (alert !== 0 && warning !== 0) {
        cellView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, alert ] ]);
      } else if (alert !== 0) {
        cellView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, 1 ], [ theme.Feel.alert, alert ] ]);
      } else if (warning !== 0) {
        cellView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, void 0 ] ]);
      } else {
        cellView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, void 0 ], [ theme.Feel.alert, void 0 ] ]);
      }
      if (inactive !== 0) {
        cellView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, inactive ] ]);
      } else {
        cellView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, void 0 ] ]);
      }
    }
  }
  __decorate([ controller.TraitViewRef({
    extends: true,
    didAttachTrait(cellTrait, targetTrait) {
      this.owner.status.setTrait(cellTrait.getTrait(StatusTrait));
      table.TextCellController.cell.prototype.didAttachTrait.call(this, cellTrait, targetTrait);
    },
    willDetachTrait(cellTrait) {
      table.TextCellController.cell.prototype.willDetachTrait.call(this, cellTrait);
      this.owner.status.setTrait(null);
    },
    initView(cellView) {
      table.TextCellController.cell.prototype.initView.call(this, cellView);
      const statusTrait = this.owner.status.trait;
      if (statusTrait !== null) {
        cellView.modifyMood(theme.Feel.default, [ [ theme.Feel.primary, 1 ] ]);
        this.owner.applyStatusVector(statusTrait.statusVector, cellView);
      }
    }
  }) ], TableGadgetTextCellController.prototype, "cell", void 0);
  __decorate([ model.TraitRef({
    type: StatusTrait,
    observes: true,
    initTrait(statusTrait) {
      const cellView = this.owner.cell.view;
      if (cellView !== null) {
        cellView.modifyMood(theme.Feel.default, [ [ theme.Feel.primary, 1 ] ]);
        this.owner.applyStatusVector(statusTrait.statusVector, cellView);
      }
    },
    traitDidSetStatusVector(newStatusVector, oldStatusVector) {
      const cellView = this.owner.cell.view;
      if (cellView !== null) {
        this.owner.applyStatusVector(newStatusVector, cellView);
      }
    }
  }) ], TableGadgetTextCellController.prototype, "status", void 0);
  class TableGadgetIconCellController extends table.IconCellController {
    applyStatusVector(statusVector, cellView) {
      const alert = statusVector.get(Status.alert) || 0;
      const warning = statusVector.get(Status.warning) || 0;
      const inactive = statusVector.get(Status.inactive) || 0;
      if (alert !== 0 && warning !== 0) {
        cellView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, alert ] ]);
      } else if (alert !== 0) {
        cellView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, 1 ], [ theme.Feel.alert, alert ] ]);
      } else if (warning !== 0) {
        cellView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, void 0 ] ]);
      } else {
        cellView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, void 0 ], [ theme.Feel.alert, void 0 ] ]);
      }
      if (inactive !== 0) {
        cellView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, inactive ] ]);
      } else {
        cellView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, void 0 ] ]);
      }
    }
  }
  __decorate([ controller.TraitViewRef({
    extends: true,
    didAttachTrait(cellTrait, targetTrait) {
      this.owner.status.setTrait(cellTrait.getTrait(StatusTrait));
      table.IconCellController.cell.prototype.didAttachTrait.call(this, cellTrait, targetTrait);
    },
    willDetachTrait(cellTrait) {
      table.IconCellController.cell.prototype.willDetachTrait.call(this, cellTrait);
      this.owner.status.setTrait(null);
    },
    initView(cellView) {
      table.IconCellController.cell.prototype.initView.call(this, cellView);
      const statusTrait = this.owner.status.trait;
      if (statusTrait !== null) {
        cellView.modifyMood(theme.Feel.default, [ [ theme.Feel.primary, 1 ] ]);
        this.owner.applyStatusVector(statusTrait.statusVector, cellView);
      }
    }
  }) ], TableGadgetIconCellController.prototype, "cell", void 0);
  __decorate([ model.TraitRef({
    type: StatusTrait,
    observes: true,
    initTrait(statusTrait) {
      const cellView = this.owner.cell.view;
      if (cellView !== null) {
        cellView.modifyMood(theme.Feel.default, [ [ theme.Feel.primary, 1 ] ]);
        this.owner.applyStatusVector(statusTrait.statusVector, cellView);
      }
    },
    traitDidSetStatusVector(newStatusVector, oldStatusVector) {
      const cellView = this.owner.cell.view;
      if (cellView !== null) {
        this.owner.applyStatusVector(newStatusVector, cellView);
      }
    }
  }) ], TableGadgetIconCellController.prototype, "status", void 0);
  class TableGadgetRowController extends table.RowController {
    applyStatusVector(statusVector, rowView) {
      const alert = statusVector.get(Status.alert) || 0;
      const warning = statusVector.get(Status.warning) || 0;
      const inactive = statusVector.get(Status.inactive) || 0;
      if (alert !== 0 && warning !== 0) {
        rowView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, alert ] ]);
      } else if (alert !== 0) {
        rowView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, 1 ], [ theme.Feel.alert, alert ] ]);
      } else if (warning !== 0) {
        rowView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, void 0 ] ]);
      } else {
        rowView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, void 0 ], [ theme.Feel.alert, void 0 ] ]);
      }
      if (inactive !== 0) {
        rowView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, inactive ] ]);
      } else {
        rowView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, void 0 ] ]);
      }
    }
  }
  __decorate([ controller.TraitViewRef({
    extends: true,
    didAttachTrait(rowTrait, targetTrait) {
      this.owner.status.setTrait(rowTrait.getTrait(StatusTrait));
      table.RowController.row.prototype.didAttachTrait.call(this, rowTrait, targetTrait);
    },
    willDetachTrait(rowTrait) {
      table.RowController.row.prototype.willDetachTrait.call(this, rowTrait);
      this.owner.status.setTrait(null);
    },
    initView(rowView) {
      table.RowController.row.prototype.initView.call(this, rowView);
      const statusTrait = this.owner.status.trait;
      if (statusTrait !== null) {
        rowView.modifyMood(theme.Feel.default, [ [ theme.Feel.primary, 1 ] ]);
        this.owner.applyStatusVector(statusTrait.statusVector, rowView);
      }
    }
  }) ], TableGadgetRowController.prototype, "row", void 0);
  __decorate([ controller.TraitViewControllerSet({
    extends: true,
    createController(cellTrait) {
      let cellController;
      if (cellTrait instanceof table.TextCellTrait) {
        cellController = new TableGadgetTextCellController;
      } else if (cellTrait instanceof table.IconCellTrait) {
        cellController = new TableGadgetIconCellController;
      } else {
        cellController = table.RowController.cells.prototype.createController.call(this, cellTrait);
      }
      return cellController;
    }
  }) ], TableGadgetRowController.prototype, "cells", void 0);
  __decorate([ model.TraitRef({
    type: StatusTrait,
    observes: true,
    initTrait(statusTrait) {
      const rowView = this.owner.row.view;
      if (rowView !== null) {
        rowView.modifyMood(theme.Feel.default, [ [ theme.Feel.primary, 1 ] ]);
        this.owner.applyStatusVector(statusTrait.statusVector, rowView);
      }
    },
    traitDidSetStatusVector(newStatusVector, oldStatusVector) {
      const rowView = this.owner.row.view;
      if (rowView !== null) {
        this.owner.applyStatusVector(newStatusVector, rowView);
      }
    }
  }) ], TableGadgetRowController.prototype, "status", void 0);
  class TableGadgetController extends table.TableController {
    constructor() {
      super();
      this.onGadgetScroll = this.onGadgetScroll.bind(this);
    }
    onGadgetScroll(event) {
      const gadgetView = this.gadget.view;
      if (gadgetView !== null) {
        gadgetView.requireUpdate(view.View.NeedsScroll);
      }
    }
  }
  __decorate([ controller.TraitViewRef({
    extends: true,
    initView(tableView) {
      table.TableController.table.prototype.initView.call(this, tableView);
      tableView.paddingLeft.setState(18, component.Affinity.Intrinsic);
      tableView.paddingRight.setState(18, component.Affinity.Intrinsic);
    }
  }) ], TableGadgetController.prototype, "table", void 0);
  __decorate([ controller.TraitViewControllerSet({
    extends: true,
    type: TableGadgetRowController
  }) ], TableGadgetController.prototype, "rows", void 0);
  __decorate([ controller.TraitViewRef({
    traitType: model.Trait,
    willAttachTrait(gadgetTrait) {
      this.owner.callObservers("controllerWillAttachGadgetTrait", gadgetTrait, this.owner);
    },
    didAttachTrait(gadgetTrait) {
      if (gadgetTrait instanceof table.TableTrait) {
        this.owner.table.setTrait(gadgetTrait);
      }
    },
    willDetachTrait(gadgetTrait) {
      if (gadgetTrait instanceof table.TableTrait) {
        this.owner.table.setTrait(null);
      }
    },
    didDetachTrait(gadgetTrait) {
      this.owner.callObservers("controllerDidDetachGadgetTrait", gadgetTrait, this.owner);
    },
    viewType: dom.HtmlView,
    initView(gadgetView) {
      gadgetView.position.setState("relative", component.Affinity.Intrinsic);
      gadgetView.overflowX.setState("hidden", component.Affinity.Intrinsic);
      gadgetView.overflowY.setState("auto", component.Affinity.Intrinsic);
    },
    willAttachView(gadgetView) {
      this.owner.callObservers("controllerWillAttachGadgetView", gadgetView, this.owner);
    },
    didAttachView(gadgetView) {
      gadgetView.on("scroll", this.owner.onGadgetScroll);
      this.owner.table.insertView(gadgetView);
    },
    willDetachView(gadgetView) {
      gadgetView.off("scroll", this.owner.onGadgetScroll);
    },
    didDetachView(gadgetView) {
      this.owner.callObservers("controllerDidDetachGadgetView", gadgetView, this.owner);
    }
  }) ], TableGadgetController.prototype, "gadget", void 0);
  class GaugeGadgetDialController extends gauge.DialController {
    applyStatusVector(statusVector, dialView) {
      const alert = statusVector.get(Status.alert) || 0;
      const warning = statusVector.get(Status.warning) || 0;
      const inactive = statusVector.get(Status.inactive) || 0;
      if (alert !== 0 && warning !== 0) {
        dialView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, alert ] ]);
      } else if (alert !== 0) {
        dialView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, 1 ], [ theme.Feel.alert, alert ] ]);
      } else if (warning !== 0) {
        dialView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, void 0 ] ]);
      } else {
        dialView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, void 0 ], [ theme.Feel.alert, void 0 ] ]);
      }
      if (inactive !== 0) {
        dialView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, inactive ] ]);
      } else {
        dialView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, void 0 ] ]);
      }
    }
  }
  __decorate([ controller.TraitViewRef({
    extends: true,
    didAttachTrait(dialTrait, targetTrait) {
      this.owner.status.setTrait(dialTrait.getTrait(StatusTrait));
      gauge.DialController.dial.prototype.didAttachTrait.call(this, dialTrait, targetTrait);
    },
    willDetachTrait(dialTrait) {
      gauge.DialController.dial.prototype.willDetachTrait.call(this, dialTrait);
      this.owner.status.setTrait(null);
    },
    initView(dialView) {
      gauge.DialController.dial.prototype.initView.call(this, dialView);
      const statusTrait = this.owner.status.trait;
      if (statusTrait !== null) {
        dialView.modifyMood(theme.Feel.default, [ [ theme.Feel.opaque, 1 ], [ theme.Feel.primary, 1 ] ]);
        this.owner.applyStatusVector(statusTrait.statusVector, dialView);
      }
      dialView.dialColor.setLook(theme.Look.neutralColor, component.Affinity.Intrinsic);
      dialView.meterColor.setLook(theme.Look.accentColor, component.Affinity.Intrinsic);
      dialView.tickColor.setLook(theme.Look.neutralColor, component.Affinity.Intrinsic);
    }
  }) ], GaugeGadgetDialController.prototype, "dial", void 0);
  __decorate([ view.ViewRef({
    extends: true,
    initView(labelView) {
      gauge.DialController.label.prototype.initView.call(this, labelView);
      if (graphics.TypesetView.is(labelView)) {
        labelView.textColor.setLook(theme.Look.neutralColor, component.Affinity.Intrinsic);
      }
    }
  }) ], GaugeGadgetDialController.prototype, "label", void 0);
  __decorate([ view.ViewRef({
    extends: true,
    initView(legendView) {
      gauge.DialController.legend.prototype.initView.call(this, legendView);
      if (graphics.TypesetView.is(legendView)) {
        legendView.textColor.setLook(theme.Look.neutralColor, component.Affinity.Intrinsic);
      }
    }
  }) ], GaugeGadgetDialController.prototype, "legend", void 0);
  __decorate([ model.TraitRef({
    type: StatusTrait,
    observes: true,
    initTrait(statusTrait) {
      const dialView = this.owner.dial.view;
      if (dialView !== null) {
        dialView.modifyMood(theme.Feel.default, [ [ theme.Feel.primary, 1 ] ]);
        this.owner.applyStatusVector(statusTrait.statusVector, dialView);
      }
    },
    traitDidSetStatusVector(newStatusVector, oldStatusVector) {
      const dialView = this.owner.dial.view;
      if (dialView !== null) {
        this.owner.applyStatusVector(newStatusVector, dialView);
      }
    }
  }) ], GaugeGadgetDialController.prototype, "status", void 0);
  class GaugeGadgetController extends gauge.GaugeController {
    layoutGauge(hasLegend) {
      const gaugeView = this.gauge.view;
      if (gaugeView !== null) {
        const dialCount = gaugeView.dials.viewCount;
        if (hasLegend === void 0) {
          hasLegend = false;
          const dialViews = gaugeView.dials.views;
          for (const viewId in dialViews) {
            const dialView = dialViews[viewId];
            if (dialView.legend.view !== null) {
              hasLegend = true;
              break;
            }
          }
        }
        const hasTitle = this.title.view !== null;
        const outerRadius = hasLegend ? 35 : 45;
        gaugeView.outerRadius.setState(math.Length.pct(outerRadius), component.Affinity.Intrinsic);
        if (dialCount === 1) {
          gaugeView.innerRadius.setState(math.Length.pct(outerRadius - 12.5), component.Affinity.Intrinsic);
        } else if (hasTitle) {
          gaugeView.innerRadius.setState(math.Length.pct(20), component.Affinity.Intrinsic);
        } else {
          gaugeView.innerRadius.setState(math.Length.pct(outerRadius - 25), component.Affinity.Intrinsic);
        }
      }
    }
  }
  __decorate([ controller.TraitViewRef({
    extends: true,
    initView(gaugeView) {
      gauge.GaugeController.gauge.prototype.initView.call(this, gaugeView);
      gaugeView.startAngle.setState(math.Angle.rad(Math.PI * 5 / 8), component.Affinity.Intrinsic);
      gaugeView.sweepAngle.setState(math.Angle.rad(Math.PI * 11 / 8), component.Affinity.Intrinsic);
      gaugeView.cornerRadius.setState(math.Length.zero(), component.Affinity.Intrinsic);
      gaugeView.tickAlign.setState(1, component.Affinity.Intrinsic);
      gaugeView.tickRadius.setState(math.Length.pct(40), component.Affinity.Intrinsic);
      gaugeView.font.setLook(theme.Look.font, component.Affinity.Intrinsic);
      this.owner.layoutGauge();
    }
  }) ], GaugeGadgetController.prototype, "gauge", void 0);
  __decorate([ view.ViewRef({
    extends: true,
    didAttachView(titleView, targetView) {
      gauge.GaugeController.title.prototype.didAttachView.call(this, titleView, targetView);
      this.owner.layoutGauge();
    },
    willDetachView(titleView) {
      gauge.GaugeController.title.prototype.willDetachView.call(this, titleView);
      this.owner.layoutGauge();
    }
  }) ], GaugeGadgetController.prototype, "title", void 0);
  __decorate([ controller.TraitViewControllerSet({
    extends: true,
    implements: true,
    type: GaugeGadgetDialController,
    attachDialView(dialView, dialController) {
      gauge.GaugeController.dials.prototype.attachDialView.call(this, dialView, dialController);
      this.owner.layoutGauge();
    },
    detachDialView(dialView, dialController) {
      gauge.GaugeController.dials.prototype.detachDialView.call(this, dialView, dialController);
      this.owner.layoutGauge();
    },
    attachDialLegendView(legendView, dialController) {
      gauge.GaugeController.dials.prototype.attachDialLegendView.call(this, legendView, dialController);
      this.owner.layoutGauge(true);
    },
    detachDialLegendView(legendView, dialController) {
      gauge.GaugeController.dials.prototype.detachDialLegendView.call(this, legendView, dialController);
      this.owner.layoutGauge();
    }
  }) ], GaugeGadgetController.prototype, "dials", void 0);
  __decorate([ view.ViewRef({
    type: graphics.CanvasView,
    didAttachView(canvasView) {
      this.owner.gauge.insertView(canvasView);
    },
    willDetachView(canvasView) {
      this.owner.gauge.removeView();
    }
  }) ], GaugeGadgetController.prototype, "canvas", void 0);
  __decorate([ controller.TraitViewRef({
    traitType: model.Trait,
    willAttachTrait(gadgetTrait) {
      this.owner.callObservers("controllerWillAttachGadgetTrait", gadgetTrait, this.owner);
    },
    didAttachTrait(gadgetTrait) {
      if (gadgetTrait instanceof gauge.GaugeTrait) {
        this.owner.gauge.setTrait(gadgetTrait);
      }
    },
    willDetachTrait(gadgetTrait) {
      if (gadgetTrait instanceof gauge.GaugeTrait) {
        this.owner.gauge.setTrait(null);
      }
    },
    didDetachTrait(gadgetTrait) {
      this.owner.callObservers("controllerDidDetachGadgetTrait", gadgetTrait, this.owner);
    },
    viewType: dom.HtmlView,
    initView(gadgetView) {
      gadgetView.height.setState(140, component.Affinity.Intrinsic);
      gadgetView.marginLeft.setState(18, component.Affinity.Intrinsic);
      gadgetView.marginRight.setState(18, component.Affinity.Intrinsic);
    },
    willAttachView(gadgetView) {
      this.owner.callObservers("controllerWillAttachGadgetView", gadgetView, this.owner);
    },
    didAttachView(gadgetView) {
      this.owner.canvas.insertView(gadgetView);
    },
    willDetachView(gadgetView) {
      this.owner.canvas.removeView();
    },
    didDetachView(gadgetView) {
      this.owner.callObservers("controllerDidDetachGadgetView", gadgetView, this.owner);
    }
  }) ], GaugeGadgetController.prototype, "gadget", void 0);
  class PieGadgetSliceController extends pie.SliceController {
    applyStatusVector(statusVector, sliceView) {
      const alert = statusVector.get(Status.alert) || 0;
      const warning = statusVector.get(Status.warning) || 0;
      const inactive = statusVector.get(Status.inactive) || 0;
      if (alert !== 0 && warning !== 0) {
        sliceView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, alert ] ]);
      } else if (alert !== 0) {
        sliceView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, 1 ], [ theme.Feel.alert, alert ] ]);
      } else if (warning !== 0) {
        sliceView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, void 0 ] ]);
      } else {
        sliceView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, void 0 ], [ theme.Feel.alert, void 0 ] ]);
      }
      if (inactive !== 0) {
        sliceView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, inactive ] ]);
      } else {
        sliceView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, void 0 ] ]);
      }
    }
  }
  __decorate([ controller.TraitViewRef({
    extends: true,
    didAttachTrait(sliceTrait, targetTrait) {
      this.owner.status.setTrait(sliceTrait.getTrait(StatusTrait));
      pie.SliceController.slice.prototype.didAttachTrait.call(this, sliceTrait, targetTrait);
    },
    willDetachTrait(sliceTrait) {
      pie.SliceController.slice.prototype.willDetachTrait.call(this, sliceTrait);
      this.owner.status.setTrait(null);
    },
    initView(sliceView) {
      pie.SliceController.slice.prototype.initView.call(this, sliceView);
      const statusTrait = this.owner.status.trait;
      if (statusTrait !== null) {
        sliceView.modifyMood(theme.Feel.default, [ [ theme.Feel.opaque, 1 ], [ theme.Feel.primary, 1 ] ]);
        this.owner.applyStatusVector(statusTrait.statusVector, sliceView);
      }
      sliceView.sliceColor.setLook(theme.Look.accentColor, component.Affinity.Intrinsic);
      sliceView.tickColor.setLook(theme.Look.neutralColor, component.Affinity.Intrinsic);
    }
  }) ], PieGadgetSliceController.prototype, "slice", void 0);
  __decorate([ view.ViewRef({
    extends: true,
    initView(labelView) {
      pie.SliceController.label.prototype.initView.call(this, labelView);
      if (graphics.TypesetView.is(labelView)) {
        labelView.textColor.setLook(theme.Look.backgroundColor, component.Affinity.Intrinsic);
      }
    }
  }) ], PieGadgetSliceController.prototype, "label", void 0);
  __decorate([ view.ViewRef({
    extends: true,
    initView(legendView) {
      pie.SliceController.legend.prototype.initView.call(this, legendView);
      if (graphics.TypesetView.is(legendView)) {
        legendView.textColor.setLook(theme.Look.neutralColor, component.Affinity.Intrinsic);
      }
    }
  }) ], PieGadgetSliceController.prototype, "legend", void 0);
  __decorate([ model.TraitRef({
    type: StatusTrait,
    observes: true,
    initTrait(statusTrait) {
      const sliceView = this.owner.slice.view;
      if (sliceView !== null) {
        sliceView.modifyMood(theme.Feel.default, [ [ theme.Feel.primary, 1 ] ]);
        this.owner.applyStatusVector(statusTrait.statusVector, sliceView);
      }
    },
    traitDidSetStatusVector(newStatusVector, oldStatusVector) {
      const sliceView = this.owner.slice.view;
      if (sliceView !== null) {
        this.owner.applyStatusVector(newStatusVector, sliceView);
      }
    }
  }) ], PieGadgetSliceController.prototype, "status", void 0);
  class PieGadgetController extends pie.PieController {
    layoutPie(hasLegend) {
      const pieView = this.pie.view;
      if (pieView !== null) {
        if (hasLegend === void 0) {
          hasLegend = false;
          const sliceViews = pieView.slices.views;
          for (const viewId in sliceViews) {
            const sliceView = sliceViews[viewId];
            if (sliceView.legend.view !== null) {
              hasLegend = true;
              break;
            }
          }
        }
        const hasTitle = this.title.view !== null;
        const outerRadius = hasLegend ? 35 : 40;
        pieView.outerRadius.setState(math.Length.pct(outerRadius), component.Affinity.Intrinsic);
        if (hasTitle) {
          pieView.innerRadius.setState(math.Length.pct(20), component.Affinity.Intrinsic);
        } else {
          pieView.innerRadius.setState(math.Length.pct(5), component.Affinity.Intrinsic);
        }
      }
    }
  }
  __decorate([ controller.TraitViewRef({
    extends: true,
    initView(pieView) {
      pie.PieController.pie.prototype.initView.call(this, pieView);
      pieView.innerRadius.setState(math.Length.pct(5), component.Affinity.Intrinsic);
      pieView.outerRadius.setState(math.Length.pct(35), component.Affinity.Intrinsic);
      pieView.tickRadius.setState(math.Length.pct(40), component.Affinity.Intrinsic);
      pieView.font.setLook(theme.Look.font, component.Affinity.Intrinsic);
      this.owner.layoutPie();
    }
  }) ], PieGadgetController.prototype, "pie", void 0);
  __decorate([ view.ViewRef({
    extends: true,
    didAttachView(titleView, targetView) {
      pie.PieController.title.prototype.didAttachView.call(this, titleView, targetView);
      this.owner.layoutPie();
    },
    willDetachView(titleView) {
      pie.PieController.title.prototype.willDetachView.call(this, titleView);
      this.owner.layoutPie();
    }
  }) ], PieGadgetController.prototype, "title", void 0);
  __decorate([ controller.TraitViewControllerSet({
    extends: true,
    implements: true,
    type: PieGadgetSliceController,
    attachSliceView(sliceView, sliceController) {
      pie.PieController.slices.prototype.attachSliceView.call(this, sliceView, sliceController);
      this.owner.layoutPie();
    },
    detachSliceView(sliceView, sliceController) {
      pie.PieController.slices.prototype.detachSliceView.call(this, sliceView, sliceController);
      this.owner.layoutPie();
    },
    attachSliceLegendView(legendView, sliceController) {
      pie.PieController.slices.prototype.attachSliceLegendView.call(this, legendView, sliceController);
      this.owner.layoutPie(true);
    },
    detachSliceLegendView(legendView, sliceController) {
      pie.PieController.slices.prototype.detachSliceLegendView.call(this, legendView, sliceController);
      this.owner.layoutPie();
    }
  }) ], PieGadgetController.prototype, "slices", void 0);
  __decorate([ view.ViewRef({
    type: graphics.CanvasView,
    didAttachView(canvasView) {
      this.owner.pie.insertView(canvasView);
    },
    willDetachView(canvasView) {
      this.owner.pie.removeView();
    }
  }) ], PieGadgetController.prototype, "canvas", void 0);
  __decorate([ controller.TraitViewRef({
    traitType: model.Trait,
    willAttachTrait(gadgetTrait) {
      this.owner.callObservers("controllerWillAttachGadgetTrait", gadgetTrait, this.owner);
    },
    didAttachTrait(gadgetTrait) {
      if (gadgetTrait instanceof pie.PieTrait) {
        this.owner.pie.setTrait(gadgetTrait);
      }
    },
    willDetachTrait(gadgetTrait) {
      if (gadgetTrait instanceof pie.PieTrait) {
        this.owner.pie.setTrait(null);
      }
    },
    didDetachTrait(gadgetTrait) {
      this.owner.callObservers("controllerDidDetachGadgetTrait", gadgetTrait, this.owner);
    },
    viewType: dom.HtmlView,
    initView(gadgetView) {
      gadgetView.height.setState(140, component.Affinity.Intrinsic);
      gadgetView.marginLeft.setState(18, component.Affinity.Intrinsic);
      gadgetView.marginRight.setState(18, component.Affinity.Intrinsic);
    },
    willAttachView(gadgetView) {
      this.owner.callObservers("controllerWillAttachGadgetView", gadgetView, this.owner);
    },
    didAttachView(gadgetView) {
      this.owner.canvas.insertView(gadgetView);
    },
    willDetachView(gadgetView) {
      this.owner.canvas.removeView();
    },
    didDetachView(gadgetView) {
      this.owner.callObservers("controllerDidDetachGadgetView", gadgetView, this.owner);
    }
  }) ], PieGadgetController.prototype, "gadget", void 0);
  class ChartGadgetBubblePlotController extends chart.BubblePlotController {
    applyStatusVector(statusVector, plotView) {
      const alert = statusVector.get(Status.alert) || 0;
      const warning = statusVector.get(Status.warning) || 0;
      const inactive = statusVector.get(Status.inactive) || 0;
      if (alert !== 0 && warning !== 0) {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, alert ] ]);
      } else if (alert !== 0) {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, 1 ], [ theme.Feel.alert, alert ] ]);
      } else if (warning !== 0) {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, void 0 ] ]);
      } else {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, void 0 ], [ theme.Feel.alert, void 0 ] ]);
      }
      if (inactive !== 0) {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, inactive ] ]);
      } else {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, void 0 ] ]);
      }
    }
  }
  __decorate([ controller.TraitViewRef({
    extends: true,
    didAttachTrait(plotTrait, targetTrait) {
      this.owner.status.setTrait(plotTrait.getTrait(StatusTrait));
      chart.BubblePlotController.plot.prototype.didAttachTrait.call(this, plotTrait, targetTrait);
    },
    willDetachTrait(plotTrait) {
      chart.BubblePlotController.plot.prototype.willDetachTrait.call(this, plotTrait);
      this.owner.status.setTrait(null);
    },
    initView(plotView) {
      chart.BubblePlotController.plot.prototype.initView.call(this, plotView);
      const statusTrait = this.owner.status.trait;
      if (statusTrait !== null) {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.primary, 1 ] ]);
        this.owner.applyStatusVector(statusTrait.statusVector, plotView);
      }
      plotView.fill.setLook(theme.Look.accentColor, component.Affinity.Intrinsic);
    }
  }) ], ChartGadgetBubblePlotController.prototype, "plot", void 0);
  __decorate([ model.TraitRef({
    type: StatusTrait,
    observes: true,
    initTrait(statusTrait) {
      const plotView = this.owner.plot.view;
      if (plotView !== null) {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.primary, 1 ] ]);
        this.owner.applyStatusVector(statusTrait.statusVector, plotView);
      }
    },
    traitDidSetStatusVector(newStatusVector, oldStatusVector) {
      const plotView = this.owner.plot.view;
      if (plotView !== null) {
        this.owner.applyStatusVector(newStatusVector, plotView);
      }
    }
  }) ], ChartGadgetBubblePlotController.prototype, "status", void 0);
  class ChartGadgetLinePlotController extends chart.LinePlotController {
    applyStatusVector(statusVector, plotView) {
      const alert = statusVector.get(Status.alert) || 0;
      const warning = statusVector.get(Status.warning) || 0;
      const inactive = statusVector.get(Status.inactive) || 0;
      if (alert !== 0 && warning !== 0) {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, alert ] ]);
      } else if (alert !== 0) {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, 1 ], [ theme.Feel.alert, alert ] ]);
      } else if (warning !== 0) {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, void 0 ] ]);
      } else {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, void 0 ], [ theme.Feel.alert, void 0 ] ]);
      }
      if (inactive !== 0) {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, inactive ] ]);
      } else {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, void 0 ] ]);
      }
    }
  }
  __decorate([ controller.TraitViewRef({
    extends: true,
    didAttachTrait(plotTrait, targetTrait) {
      this.owner.status.setTrait(plotTrait.getTrait(StatusTrait));
      chart.LinePlotController.plot.prototype.didAttachTrait.call(this, plotTrait, targetTrait);
    },
    willDetachTrait(plotTrait) {
      chart.LinePlotController.plot.prototype.willDetachTrait.call(this, plotTrait);
      this.owner.status.setTrait(null);
    },
    initView(plotView) {
      chart.LinePlotController.plot.prototype.initView.call(this, plotView);
      const statusTrait = this.owner.status.trait;
      if (statusTrait !== null) {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.primary, 1 ] ]);
        this.owner.applyStatusVector(statusTrait.statusVector, plotView);
      }
      const plotTrait = this.trait;
      if (plotTrait === null || plotTrait.stroke === null) {
        plotView.stroke.setLook(theme.Look.accentColor, component.Affinity.Intrinsic);
      }
      if (plotTrait === null || plotTrait.strokeWidth === null) {
        plotView.strokeWidth.setState(2, component.Affinity.Intrinsic);
      }
    }
  }) ], ChartGadgetLinePlotController.prototype, "plot", void 0);
  __decorate([ model.TraitRef({
    type: StatusTrait,
    observes: true,
    initTrait(statusTrait) {
      const plotView = this.owner.plot.view;
      if (plotView !== null) {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.primary, 1 ] ]);
        this.owner.applyStatusVector(statusTrait.statusVector, plotView);
      }
    },
    traitDidSetStatusVector(newStatusVector, oldStatusVector) {
      const plotView = this.owner.plot.view;
      if (plotView !== null) {
        this.owner.applyStatusVector(newStatusVector, plotView);
      }
    }
  }) ], ChartGadgetLinePlotController.prototype, "status", void 0);
  class ChartGadgetAreaPlotController extends chart.AreaPlotController {
    applyStatusVector(statusVector, plotView) {
      const alert = statusVector.get(Status.alert) || 0;
      const warning = statusVector.get(Status.warning) || 0;
      const inactive = statusVector.get(Status.inactive) || 0;
      if (alert !== 0 && warning !== 0) {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, alert ] ]);
      } else if (alert !== 0) {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, 1 ], [ theme.Feel.alert, alert ] ]);
      } else if (warning !== 0) {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, void 0 ] ]);
      } else {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, void 0 ], [ theme.Feel.alert, void 0 ] ]);
      }
      if (inactive !== 0) {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, inactive ] ]);
      } else {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, void 0 ] ]);
      }
    }
  }
  __decorate([ controller.TraitViewRef({
    extends: true,
    didAttachTrait(plotTrait, targetTrait) {
      this.owner.status.setTrait(plotTrait.getTrait(StatusTrait));
      chart.AreaPlotController.plot.prototype.didAttachTrait.call(this, plotTrait, targetTrait);
    },
    willDetachTrait(plotTrait) {
      chart.AreaPlotController.plot.prototype.willDetachTrait.call(this, plotTrait);
      this.owner.status.setTrait(null);
    },
    initView(plotView) {
      chart.AreaPlotController.plot.prototype.initView.call(this, plotView);
      const statusTrait = this.owner.status.trait;
      if (statusTrait !== null) {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.primary, 1 ] ]);
        this.owner.applyStatusVector(statusTrait.statusVector, plotView);
      }
      plotView.fill.setLook(theme.Look.accentColor, component.Affinity.Intrinsic);
    }
  }) ], ChartGadgetAreaPlotController.prototype, "plot", void 0);
  __decorate([ model.TraitRef({
    type: StatusTrait,
    observes: true,
    initTrait(statusTrait) {
      const plotView = this.owner.plot.view;
      if (plotView !== null) {
        plotView.modifyMood(theme.Feel.default, [ [ theme.Feel.primary, 1 ] ]);
        this.owner.applyStatusVector(statusTrait.statusVector, plotView);
      }
    },
    traitDidSetStatusVector(newStatusVector, oldStatusVector) {
      const plotView = this.owner.plot.view;
      if (plotView !== null) {
        this.owner.applyStatusVector(newStatusVector, plotView);
      }
    }
  }) ], ChartGadgetAreaPlotController.prototype, "status", void 0);
  class ChartGadgetController extends chart.ChartController {}
  __decorate([ controller.TraitViewRef({
    extends: true,
    initView(chartView) {
      chart.ChartController.chart.prototype.initView.call(this, chartView);
      chartView.gutterLeft.setState(0, component.Affinity.Intrinsic);
      chartView.gutterRight.setState(0, component.Affinity.Intrinsic);
      chartView.borderWidth.setState(0, component.Affinity.Intrinsic);
      chartView.borderSerif.setState(0, component.Affinity.Intrinsic);
      chartView.tickMarkLength.setState(0, component.Affinity.Intrinsic);
      chartView.domainTracking(true);
      chartView.font.setLook(theme.Look.font, component.Affinity.Intrinsic);
    }
  }) ], ChartGadgetController.prototype, "chart", void 0);
  __decorate([ controller.TraitViewControllerSet({
    extends: true,
    createController(plotTrait) {
      let plotController;
      if (plotTrait instanceof chart.BubblePlotTrait) {
        plotController = new ChartGadgetBubblePlotController;
      } else if (plotTrait instanceof chart.LinePlotTrait) {
        plotController = new ChartGadgetLinePlotController;
      } else if (plotTrait instanceof chart.AreaPlotTrait) {
        plotController = new ChartGadgetAreaPlotController;
      } else {
        plotController = chart.ChartController.plots.prototype.createController.call(this, plotTrait);
      }
      return plotController;
    }
  }) ], ChartGadgetController.prototype, "plots", void 0);
  __decorate([ view.ViewRef({
    type: graphics.CanvasView,
    didAttachView(canvasView) {
      this.owner.chart.insertView(canvasView);
    },
    willDetachView(canvasView) {
      this.owner.chart.removeView();
    }
  }) ], ChartGadgetController.prototype, "canvas", void 0);
  __decorate([ controller.TraitViewRef({
    traitType: model.Trait,
    willAttachTrait(gadgetTrait) {
      this.owner.callObservers("controllerWillAttachGadgetTrait", gadgetTrait, this.owner);
    },
    didAttachTrait(gadgetTrait) {
      if (gadgetTrait instanceof chart.ChartTrait) {
        this.owner.chart.setTrait(gadgetTrait);
      }
    },
    willDetachTrait(gadgetTrait) {
      if (gadgetTrait instanceof chart.ChartTrait) {
        this.owner.chart.setTrait(null);
      }
    },
    didDetachTrait(gadgetTrait) {
      this.owner.callObservers("controllerDidDetachGadgetTrait", gadgetTrait, this.owner);
    },
    viewType: dom.HtmlView,
    observesView: true,
    initView(gadgetView) {
      gadgetView.marginLeft.setState(18, component.Affinity.Intrinsic);
      gadgetView.marginRight.setState(18, component.Affinity.Intrinsic);
    },
    willAttachView(gadgetView) {
      this.owner.callObservers("controllerWillAttachGadgetView", gadgetView, this.owner);
    },
    didAttachView(gadgetView) {
      this.owner.canvas.insertView(gadgetView);
      gadgetView.requireUpdate(view.View.NeedsResize);
    },
    willDetachView(gadgetView) {
      this.owner.canvas.removeView();
    },
    didDetachView(gadgetView) {
      this.owner.callObservers("controllerDidDetachGadgetView", gadgetView, this.owner);
    },
    viewWillResize(viewContext, gadgetView) {
      const chartView = this.owner.chart.view;
      if (chartView !== null) {
        let gadgetHeight = 20;
        if (chartView.topAxis.view !== null) {
          gadgetHeight += 30;
          chartView.gutterTop.setState(30, component.Affinity.Intrinsic);
        } else {
          gadgetHeight += 20;
          chartView.gutterTop.setState(20, component.Affinity.Intrinsic);
        }
        if (chartView.bottomAxis.view !== null) {
          gadgetHeight += 30;
          chartView.gutterBottom.setState(30, component.Affinity.Intrinsic);
        } else {
          gadgetHeight += 20;
          chartView.gutterBottom.setState(20, component.Affinity.Intrinsic);
        }
        gadgetView.height.setState(gadgetHeight, component.Affinity.Intrinsic);
      }
    }
  }) ], ChartGadgetController.prototype, "gadget", void 0);
  class PrismPlugin {}
  class PrismService extends component.Service {
    constructor() {
      super();
      this.plugins = [];
    }
    insertPlugin(plugin, index) {
      const plugins = this.plugins;
      if (plugins.indexOf(plugin) >= 0) {
        return;
      }
      if (index === void 0) {
        index = plugins.length;
      } else {
        if (index < 0) {
          index = plugins.length + 1 + index;
        }
        index = Math.min(Math.max(0, index, plugins.length));
      }
      this.willInsertPlugin(plugin, index);
      plugins.splice(index, 0, plugin);
      this.onInsertPlugin(plugin, index);
      this.didInsertPlugin(plugin, index);
    }
    willInsertPlugin(plugin, index) {
      const observers = this.observers;
      for (let i = 0, n = observers.length; i < n; i += 1) {
        const observer = observers[i];
        if (observer.serviceWillInsertPlugin !== void 0) {
          observer.serviceWillInsertPlugin(plugin, index, this);
        }
      }
    }
    onInsertPlugin(plugin, index) {}
    didInsertPlugin(plugin, index) {
      const observers = this.observers;
      for (let i = 0, n = observers.length; i < n; i += 1) {
        const observer = observers[i];
        if (observer.serviceDidInsertPlugin !== void 0) {
          observer.serviceDidInsertPlugin(plugin, index, this);
        }
      }
    }
    removePlugin(plugin) {
      const plugins = this.plugins;
      const index = plugins.indexOf(plugin);
      if (index >= 0) {
        this.willRemovePlugin(plugin);
        plugins.splice(index, 1);
        this.onRemovePlugin(plugin);
        this.didRemovePlugin(plugin);
      }
    }
    willRemovePlugin(plugin) {
      const observers = this.observers;
      for (let i = 0, n = observers.length; i < n; i += 1) {
        const observer = observers[i];
        if (observer.serviceWillRemovePlugin !== void 0) {
          observer.serviceWillRemovePlugin(plugin, this);
        }
      }
    }
    onRemovePlugin(plugin) {}
    didRemovePlugin(plugin) {
      const observers = this.observers;
      for (let i = 0, n = observers.length; i < n; i += 1) {
        const observer = observers[i];
        if (observer.serviceDidRemovePlugin !== void 0) {
          observer.serviceDidRemovePlugin(plugin, this);
        }
      }
    }
    static global() {
      return new PrismService;
    }
    static get plugins() {
      return PrismService.global().plugins;
    }
    static insertPlugin(plugin, index) {
      PrismService.global().insertPlugin(plugin, index);
    }
    static removePlugin(plugin) {
      PrismService.global().removePlugin(plugin);
    }
  }
  __decorate([ util.Lazy ], PrismService, "global", null);
  const PrismProvider = function(_super) {
    const PrismProvider = _super.extend("PrismProvider");
    Object.defineProperty(PrismProvider.prototype, "plugins", {
      get() {
        let service = this.service;
        if (service === void 0 || service === null) {
          service = PrismService.global();
        }
        return service.plugins;
      },
      configurable: true
    });
    PrismProvider.prototype.createService = function() {
      return PrismService.global();
    };
    return PrismProvider;
  }(component.Provider);
  class EntityPlugin extends PrismPlugin {}
  class DomainPlugin extends PrismPlugin {}
  class SurfaceView extends dom.HtmlView {}
  __decorate([ component.Property({
    inherits: true,
    value: null
  }) ], SurfaceView.prototype, "edgeInsets", void 0);
  __decorate([ component.Property({
    type: Boolean,
    value: false,
    updateFlags: view.View.NeedsResize | view.View.NeedsLayout,
    willSetValue(fullBleed) {
      this.owner.callObservers("viewWillSetFullBleed", fullBleed, this.owner);
    },
    didSetValue(fullBleed) {
      this.owner.callObservers("viewDidSetFullBleed", fullBleed, this.owner);
    }
  }) ], SurfaceView.prototype, "fullBleed", void 0);
  class MirrorController extends controller.Controller {}
  class MirrorPlugin extends PrismPlugin {}
  class GadgetPlugin extends PrismPlugin {}
  class ActivityController extends controller.Controller {}
  class ActivityPlugin extends PrismPlugin {}
  class SuggestionController extends controller.Controller {}
  __decorate([ view.ViewRef({
    type: table.RowView,
    initView(rowView) {
      rowView.rowHeight(32);
      const iconCellView = rowView.getOrCreateCell("icon", table.IconCellView);
      iconCellView.iconWidth.setState(24, component.Affinity.Intrinsic);
      iconCellView.iconHeight.setState(24, component.Affinity.Intrinsic);
      const entityIcon = graphics.VectorIcon.create(24, 24, "M8,8 L19,8 L16,16 L5,16 Z");
      iconCellView.graphics.setState(entityIcon, component.Affinity.Intrinsic);
      const titleCellView = rowView.getOrCreateCell("title", table.TextCellView);
      const entityTrait = this.owner.entity.trait;
      if (entityTrait !== null) {
        let entityTitle = entityTrait.title.value;
        if (entityTitle === void 0) {
          entityTitle = "";
        }
        titleCellView.content(entityTitle);
      }
    }
  }) ], SuggestionController.prototype, "row", void 0);
  __decorate([ model.TraitRef({
    type: EntityTrait,
    observes: true,
    didAttachTrait(entityTrait) {
      const rowView = this.owner.row.view;
      if (rowView !== null) {
        const titleCellView = rowView.getOrCreateCell("title", table.TextCellView);
        let entityTitle = entityTrait.title.value;
        if (entityTitle === void 0) {
          entityTitle = "";
        }
        titleCellView.content(entityTitle);
      }
    },
    entityDidSetTitle(title, entityTrait) {
      const rowView = this.owner.row.view;
      if (rowView !== null) {
        const titleCellView = rowView.getOrCreateCell("title", table.TextCellView);
        titleCellView.content(title !== void 0 ? title : "");
      }
    }
  }) ], SuggestionController.prototype, "entity", void 0);
  class CollectionController extends controller.Controller {
    get domainIcon() {
      return CollectionController.domainIcon;
    }
    injectEntities(model, domainTrait) {
      const entityTrait = model.getTrait(EntityTrait);
      if (entityTrait !== null) {
        this.injectEntity(entityTrait, domainTrait);
      }
      function injectEntity(childModel) {
        this.injectEntities(childModel, domainTrait);
      }
      model.forEachChild(injectEntity, this);
    }
    injectEntity(entityTrait, domainTrait) {
      const plugins = this.prismProvider.plugins;
      for (let i = 0, n = plugins.length; i < n; i += 1) {
        const plugin = plugins[i];
        if (plugin instanceof EntityPlugin) {
          plugin.injectEntity(entityTrait, domainTrait);
        }
      }
    }
    activate() {
      const domainTrait = this.domain.trait;
      if (domainTrait !== null) {
        domainTrait.model.remove();
      }
    }
    applyStatus(statusVector) {
      const rowView = this.row.view;
      if (rowView !== null) {
        const alert = statusVector.get(Status.alert) || 0;
        const warning = statusVector.get(Status.warning) || 0;
        const inactive = statusVector.get(Status.inactive) || 0;
        if (alert !== 0 && warning !== 0) {
          rowView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, alert ] ]);
        } else if (alert !== 0) {
          rowView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, 1 ], [ theme.Feel.alert, alert ] ]);
        } else if (warning !== 0) {
          rowView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, void 0 ] ]);
        } else {
          rowView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, void 0 ], [ theme.Feel.alert, void 0 ] ]);
        }
        if (inactive !== 0) {
          rowView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, inactive ] ]);
        } else {
          rowView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, void 0 ] ]);
        }
      }
    }
    static get domainIcon() {
      return graphics.VectorIcon.create(24, 24, "M4,4L23,4L20,20L1,20Z");
    }
  }
  __decorate([ component.Property({
    type: Boolean,
    value: false,
    inherits: true
  }) ], CollectionController.prototype, "fullBleed", void 0);
  __decorate([ view.ViewRef({
    type: table.RowView,
    observes: true,
    didAttachView(rowView) {
      const iconCellView = rowView.getOrCreateCell("icon", table.IconCellView);
      iconCellView.iconWidth.setState(24, component.Affinity.Intrinsic);
      iconCellView.iconHeight.setState(24, component.Affinity.Intrinsic);
      const entityTrait = this.owner.entity.trait;
      if (entityTrait !== null) {
        let entityIcon = entityTrait.icon.value;
        if (entityIcon === null) {
          entityIcon = this.owner.domainIcon;
        }
        iconCellView.graphics.setState(entityIcon, component.Affinity.Intrinsic);
        let entityTitle = entityTrait.title.value;
        if (entityTitle === void 0) {
          entityTitle = "";
        }
        const titleCellView = rowView.getOrCreateCell("title", table.TextCellView);
        titleCellView.content.setView(entityTitle);
      }
    },
    viewDidPressLeaf(input, event) {
      this.owner.activate();
    }
  }) ], CollectionController.prototype, "row", void 0);
  __decorate([ model.TraitRef({
    type: DomainTrait,
    observes: true,
    didAttachTrait(domainTrait) {
      this.owner.entity.setTrait(domainTrait.getTrait(EntityTrait));
      this.owner.status.setTrait(domainTrait.getTrait(StatusTrait));
      const model = domainTrait.model;
      if (model !== null) {
        this.owner.injectEntities(model, domainTrait);
      }
    },
    domainDidInjectEntity(entityTrait, domainTrait) {
      this.owner.injectEntity(entityTrait, domainTrait);
    }
  }) ], CollectionController.prototype, "domain", void 0);
  __decorate([ model.TraitRef({
    type: EntityTrait,
    observes: true,
    didAttachTrait(entityTrait) {
      const rowView = this.owner.row.view;
      if (rowView !== null) {
        const iconCellView = rowView.getOrCreateCell("icon", table.IconCellView);
        let entityIcon = entityTrait.icon.value;
        if (entityIcon === null) {
          entityIcon = this.owner.domainIcon;
        }
        iconCellView.graphics(entityIcon);
        const titleCellView = rowView.getOrCreateCell("title", table.TextCellView);
        let entityTitle = entityTrait.title.value;
        if (entityTitle === void 0) {
          entityTitle = "";
        }
        titleCellView.content(entityTitle);
      }
    },
    entityDidSetTitle(title, entityTrait) {
      const rowView = this.owner.row.view;
      if (rowView !== null) {
        const titleCellView = rowView.getOrCreateCell("title", table.TextCellView);
        titleCellView.content(title !== void 0 ? title : "");
      }
    },
    entityDidSetIcon(icon, entityTrait) {
      const rowView = this.owner.row.view;
      if (rowView !== null) {
        const iconCellView = rowView.getOrCreateCell("icon", table.IconCellView);
        iconCellView.graphics(icon !== null ? icon : this.owner.domainIcon);
      }
    }
  }) ], CollectionController.prototype, "entity", void 0);
  __decorate([ model.TraitRef({
    type: StatusTrait,
    observes: true,
    willAttachTrait(statusTrait) {
      this.owner.applyStatus(statusTrait.statusVector);
    },
    traitDidSetStatusVector(newStatusVector, oldStatusVector) {
      this.owner.applyStatus(newStatusVector);
    }
  }) ], CollectionController.prototype, "status", void 0);
  __decorate([ component.Provider({
    extends: PrismProvider,
    type: PrismService,
    observes: false,
    service: PrismService.global()
  }) ], CollectionController.prototype, "prismProvider", void 0);
  __decorate([ util.Lazy ], CollectionController, "domainIcon", null);
  class CollectorController extends controller.Controller {
    get searchIcon() {
      return CollectorController.searchIcon;
    }
    get plusIcon() {
      return CollectorController.plusIcon;
    }
    setFullBleed(fullBleed) {
      const searchView = this.search.view;
      if (searchView !== null) {
        searchView.modifyMood(theme.Feel.default, [ [ theme.Feel.translucent, fullBleed ? 1 : 0 ] ]);
      }
    }
    createDomain(query) {
      const plugins = this.prismService.plugins;
      for (let i = 0, n = plugins.length; i < n; i += 1) {
        const plugin = plugins[i];
        if (plugin instanceof DomainPlugin) {
          const domain = plugin.queryDomain(query);
          if (domain !== null) {
            return domain;
          }
        }
      }
      return null;
    }
    insertSuggestionRow(suggestionController) {
      const suggestionsList = this.suggestionsList.view;
      if (suggestionsList !== null) {
        const targetSuggestion = suggestionController.nextSibling;
        const targetView = targetSuggestion instanceof SuggestionController ? targetSuggestion.row.view : null;
        suggestionController.row.insertView(suggestionsList, void 0, targetView);
      }
    }
    removeSuggestionRow(suggestionController) {
      suggestionController.row.removeView();
    }
    insertCollectionRow(collectionController) {
      const domainList = this.domainList.view;
      if (domainList !== null) {
        const targetController = collectionController.nextSibling;
        const targetView = targetController instanceof CollectionController ? targetController.row.view : null;
        collectionController.row.insertView(domainList, void 0, targetView);
      }
    }
    removeCollectionRow(collectionController) {
      collectionController.row.removeView();
    }
    static get searchIcon() {
      return graphics.VectorIcon.create(24, 24, "M14.375,13.25 L13.7825,13.25 L13.5725,13.0475 C14.3075,12.1925 14.75,11.0825 14.75,9.875 C14.75,7.1825 12.5675,5 9.875,5 C7.1825,5 5,7.1825 5,9.875 C5,12.5675 7.1825,14.75 9.875,14.75 C11.0825,14.75 12.1925,14.3075 13.0475,13.5725 L13.25,13.7825 L13.25,14.375 L17,18.1175 L18.1175,17 L14.375,13.25 Z M9.875,13.25 C8.0075,13.25 6.5,11.7425 6.5,9.875 C6.5,8.0075 8.0075,6.5 9.875,6.5 C11.7425,6.5 13.25,8.0075 13.25,9.875 C13.25,11.7425 11.7425,13.25 9.875,13.25 Z");
    }
    static get plusIcon() {
      return graphics.VectorIcon.create(24, 24, "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z");
    }
  }
  __decorate([ component.Property({
    type: Boolean,
    inherits: true,
    didSetValue(fullBleed) {
      this.owner.setFullBleed(fullBleed);
    }
  }) ], CollectorController.prototype, "fullBleed", void 0);
  __decorate([ view.ViewRef({
    type: token.InputTokenView,
    observes: true,
    initView(searchView) {
      searchView.icon.setValue(this.owner.searchIcon);
      searchView.icon.embossed = false;
      const inputView = searchView.label.view;
      if (inputView !== null) {
        inputView.width.setState(200, component.Affinity.Intrinsic);
        inputView.placeholder.setState("Search or enter a warp URL", component.Affinity.Intrinsic);
      }
      searchView.accessory.setValue(this.owner.plusIcon);
      searchView.accessory.embossed = false;
      this.owner.setFullBleed(this.owner.fullBleed.value);
    },
    tokenDidUpdateInput(inputView, searchView) {
      const node = inputView.node;
      const query = node.value;
      let dropdownView = this.owner.searchDropdown.view;
      if (query.length !== 0) {
        if (dropdownView === null) {
          dropdownView = this.owner.searchDropdown.createView();
          this.owner.searchDropdown.setView(dropdownView);
        }
        dropdownView.setSource(searchView);
      } else if (dropdownView !== null) {
        searchView.modalProvider.dismissModal(dropdownView);
      }
    },
    tokenDidAcceptInput(inputView, searchView) {
      const node = inputView.node;
      const query = node.value;
      if (query.length !== 0) {
        const domainGroup = this.owner.domains.model;
        if (domainGroup !== null) {
          const domainTrait = this.owner.createDomain(query);
          if (domainTrait !== null) {
            domainGroup.prependChild(domainTrait.model);
            const inputView = searchView.label.view;
            if (inputView !== null) {
              const inputNode = inputView.node;
              inputNode.value = "";
              inputNode.blur();
              searchView.collapse();
            }
            const dropdownView = this.owner.searchDropdown.view;
            if (dropdownView !== null) {
              searchView.modalProvider.dismissModal(dropdownView);
            }
          }
        }
      }
    }
  }) ], CollectorController.prototype, "search", void 0);
  __decorate([ view.ViewRef({
    type: window.PopoverView,
    initView(dropdownView) {
      dropdownView.addClass("search-dropdown").dropdown(true).placementGap(2).minHeight(64).maxHeight(320).borderRadius(14).boxSizing("content-box").overflowY("auto");
      dropdownView.modifyMood(theme.Feel.default, [ [ theme.Feel.translucent, 1 ] ]);
      dropdownView.backgroundColor.setLook(theme.Look.accentColor);
      this.owner.suggestionsList.insertView(dropdownView);
    }
  }) ], CollectorController.prototype, "searchDropdown", void 0);
  __decorate([ view.ViewRef({
    type: table.TableView,
    initView(suggestionsList) {
      const suggestionControllers = this.owner.suggestions.controllers;
      for (const controllerId in suggestionControllers) {
        const suggestionController = suggestionControllers[controllerId];
        this.owner.insertSuggestionRow(suggestionController);
      }
    }
  }) ], CollectorController.prototype, "suggestionsList", void 0);
  __decorate([ controller.TraitControllerSet({
    type: SuggestionController,
    binds: true,
    getTraitRef(suggestionController) {
      return suggestionController.entity;
    },
    didAttachController(suggestionController) {
      this.owner.insertSuggestionRow(suggestionController);
    },
    willDetachController(suggestionController) {
      this.owner.removeSuggestionRow(suggestionController);
    }
  }) ], CollectorController.prototype, "suggestions", void 0);
  __decorate([ controller.TraitControllerSet({
    type: CollectionController,
    binds: true,
    getTraitRef(collectionController) {
      return collectionController.entity;
    },
    didAttachController(collectionController) {
      this.owner.insertCollectionRow(collectionController);
    },
    willDetachController(collectionController) {
      this.owner.removeCollectionRow(collectionController);
    }
  }) ], CollectorController.prototype, "collections", void 0);
  __decorate([ view.ViewRef({
    type: table.TableView,
    initView(tableView) {
      const collectionControllers = this.owner.collections.controllers;
      for (const controllerId in collectionControllers) {
        const collectionController = collectionControllers[controllerId];
        this.owner.insertCollectionRow(collectionController);
      }
    }
  }) ], CollectorController.prototype, "domainList", void 0);
  __decorate([ model.ModelRef({
    type: DomainGroup,
    observes: true,
    initModel(domainGroup) {
      let domainModel = domainGroup.firstChild;
      while (domainModel !== null) {
        const domainTrait = domainModel.getTrait(DomainTrait);
        if (domainTrait !== null) {
          const entityTrait = domainTrait.getTrait(EntityTrait);
          const collectionController = this.owner.collections.addTraitController(entityTrait);
          collectionController.domain.setTrait(domainTrait);
        }
        domainModel = domainModel.nextSibling;
      }
    },
    modelDidInsertChild(child, target) {
      const domainTrait = child.getTrait(DomainTrait);
      if (domainTrait !== null) {
        const entityTrait = domainTrait.getTrait(EntityTrait);
        const targetTrait = target !== null ? target.getTrait(DomainTrait) : null;
        const collectionController = this.owner.collections.addTraitController(entityTrait, targetTrait);
        collectionController.domain.setTrait(domainTrait);
      }
    },
    modelWillRemoveChild(child) {
      const domainTrait = child.getTrait(DomainTrait);
      if (domainTrait !== null) {
        const entityTrait = domainTrait.getTrait(EntityTrait);
        this.owner.collections.deleteTraitController(entityTrait);
      }
    }
  }) ], CollectorController.prototype, "domains", void 0);
  __decorate([ component.Provider({
    extends: PrismProvider,
    type: PrismService,
    observes: false,
    service: PrismService.global()
  }) ], CollectorController.prototype, "prismService", void 0);
  __decorate([ util.Lazy ], CollectorController, "searchIcon", null);
  __decorate([ util.Lazy ], CollectorController, "plusIcon", null);
  class ReflectionController extends controller.Controller {
    constructor(plugin) {
      super();
      this.plugin = plugin;
      this.mirror.insertController();
    }
    activate() {
      this.willActivate();
      this.onActivate();
      this.didActivate();
    }
    willActivate() {
      this.callObservers("controllerWillActivateReflection", this);
    }
    onActivate() {}
    didActivate() {
      this.callObservers("controllerDidActivateReflection", this);
    }
  }
  __decorate([ controller.ControllerRef({
    key: true,
    type: MirrorController,
    binds: true,
    initController(mirrorController) {
      const domainGroup = this.owner.domains.model;
      if (domainGroup !== null) {
        mirrorController.domains.setModel(domainGroup);
      }
    },
    createController() {
      return this.owner.plugin.createController();
    }
  }) ], ReflectionController.prototype, "mirror", void 0);
  __decorate([ view.ViewRef({
    type: table.RowView,
    observes: true,
    initView(rowView) {
      const iconCellView = rowView.getOrCreateCell("icon", table.IconCellView);
      iconCellView.iconWidth.setState(24, component.Affinity.Intrinsic);
      iconCellView.iconHeight.setState(24, component.Affinity.Intrinsic);
      const titleCellView = rowView.getOrCreateCell("title", table.TextCellView);
      iconCellView.graphics.setState(this.owner.plugin.icon);
      titleCellView.content.setView(this.owner.plugin.title);
    },
    viewDidPressLeaf(input, event, leafView, rowView) {
      rowView.modalProvider.dismissModals();
      this.owner.activate();
    }
  }) ], ReflectionController.prototype, "row", void 0);
  __decorate([ view.ViewRef({
    type: SurfaceView,
    didAttachView(surfaceView) {
      const mirrorController = this.owner.mirror.controller;
      if (mirrorController !== null) {
        surfaceView.fullBleed.setValue(mirrorController.isFullBleed());
        mirrorController.surface.setView(surfaceView);
      }
    },
    willDetachView(surfaceView) {
      const mirrorController = this.owner.mirror.controller;
      if (mirrorController !== null) {
        mirrorController.surface.setView(null);
      }
    }
  }) ], ReflectionController.prototype, "surface", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView,
    didAttachView(toolbarView) {
      const mirrorController = this.owner.mirror.controller;
      if (mirrorController !== null) {
        mirrorController.toolbar.setView(toolbarView);
      }
    },
    willDetachView(toolbarView) {
      const mirrorController = this.owner.mirror.controller;
      if (mirrorController !== null) {
        mirrorController.toolbar.setView(null);
      }
    }
  }) ], ReflectionController.prototype, "toolbar", void 0);
  __decorate([ view.ViewRef({
    type: window.DrawerView,
    didAttachView(drawerView) {
      const mirrorController = this.owner.mirror.controller;
      if (mirrorController !== null) {
        mirrorController.drawer.setView(drawerView);
      }
    },
    willDetachView(drawerView) {
      const mirrorController = this.owner.mirror.controller;
      if (mirrorController !== null) {
        mirrorController.drawer.setView(null);
      }
    }
  }) ], ReflectionController.prototype, "drawer", void 0);
  __decorate([ model.ModelRef({
    type: DomainGroup,
    initModel(domainGroup) {
      const mirrorController = this.owner.mirror.controller;
      if (mirrorController !== null) {
        mirrorController.domains.setModel(domainGroup);
      }
    }
  }) ], ReflectionController.prototype, "domains", void 0);
  class ReflectorController extends controller.Controller {
    insertPlugin(plugin) {
      let reflectionController = this.reflections.getPluginController(plugin.id);
      if (reflectionController === null) {
        reflectionController = this.reflections.addController(plugin);
        const fragment = this.historyProvider.historyState.fragment;
        if (this.active.controller === null && (fragment === void 0 || fragment === plugin.id)) {
          this.active.setController(reflectionController);
          if (fragment === void 0) {
            this.historyProvider.replaceHistory({
              fragment: reflectionController.plugin.id
            });
          }
        }
      }
    }
    removePlugin(plugin) {
      const reflectionController = this.reflections.getPluginController(plugin.id);
      if (reflectionController !== null) {
        this.reflections.deleteController(reflectionController);
      }
    }
    onMount() {
      super.onMount();
      this.updateHistoryState(this.historyProvider.historyState);
    }
    updateHistoryState(historyState) {
      const fragment = historyState.fragment;
      if (fragment !== void 0) {
        const reflectionController = this.reflections.getPluginController(fragment);
        if (reflectionController !== null) {
          this.active.setController(reflectionController);
        }
      }
    }
  }
  __decorate([ controller.ControllerRef({
    type: ReflectionController,
    didAttachController(reflectionController) {
      const rowView = reflectionController.row.view;
      if (rowView !== null) {
        const leafView = rowView.leaf.view;
        if (leafView !== null) {
          leafView.highlight.focus(false);
        }
      }
      const surfaceView = this.owner.surface.view;
      if (surfaceView !== null) {
        reflectionController.surface.setView(surfaceView);
      }
      const toolbarView = this.owner.toolbar.view;
      if (toolbarView !== null) {
        reflectionController.toolbar.setView(toolbarView);
      }
      const drawerView = this.owner.drawer.view;
      if (drawerView !== null) {
        reflectionController.drawer.setView(drawerView);
      }
    },
    willDetachController(reflectionController) {
      reflectionController.drawer.setView(null);
      reflectionController.toolbar.setView(null);
      reflectionController.surface.setView(null);
      const rowView = reflectionController.row.view;
      if (rowView !== null) {
        const leafView = rowView.leaf.view;
        if (leafView !== null) {
          leafView.highlight.unfocus(true);
        }
      }
    }
  }) ], ReflectorController.prototype, "active", void 0);
  __decorate([ view.ViewRef({
    type: SurfaceView,
    initView(surfaceView) {
      const activeController = this.owner.active.controller;
      if (activeController !== null) {
        activeController.surface.setView(surfaceView);
      }
    }
  }) ], ReflectorController.prototype, "surface", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView,
    initView(toolbarView) {
      const activeController = this.owner.active.controller;
      if (activeController !== null) {
        activeController.toolbar.setView(toolbarView);
      }
    }
  }) ], ReflectorController.prototype, "toolbar", void 0);
  __decorate([ view.ViewRef({
    type: window.DrawerView,
    initView(drawerView) {
      const activeController = this.owner.active.controller;
      if (activeController !== null) {
        activeController.drawer.setView(drawerView);
      }
    }
  }) ], ReflectorController.prototype, "drawer", void 0);
  __decorate([ view.ViewRef({
    type: table.TableView,
    initView(listView) {
      const plugins = this.owner.prismProvider.plugins;
      for (let i = 0, n = plugins.length; i < n; i += 1) {
        const plugin = plugins[i];
        if (plugin instanceof MirrorPlugin) {
          this.owner.insertPlugin(plugin);
        }
      }
    }
  }) ], ReflectorController.prototype, "mirrorList", void 0);
  __decorate([ controller.ControllerSet({
    implements: true,
    type: ReflectionController,
    binds: true,
    observes: true,
    didAttachController(reflectionController) {
      const listView = this.owner.mirrorList.view;
      if (listView !== null) {
        reflectionController.row.insertView(listView);
      }
      const domainGroup = this.owner.domains.model;
      if (domainGroup !== null) {
        reflectionController.domains.setModel(domainGroup);
      }
    },
    willDetachController(reflectionController) {
      if (reflectionController === this.owner.active.controller) {
        this.owner.active.setController(null);
      }
      reflectionController.row.removeView();
    },
    controllerDidActivateReflection(reflectionController) {
      this.owner.historyProvider.pushHistory({
        fragment: reflectionController.plugin.id
      });
      this.owner.active.setController(reflectionController);
    },
    getPluginController(pluginId) {
      const controllers = this.controllers;
      for (const controllerId in controllers) {
        const controller = controllers[controllerId];
        if (controller.plugin.id === pluginId) {
          return controller;
        }
      }
      return null;
    },
    createController(plugin) {
      if (plugin !== void 0) {
        return new ReflectionController(plugin);
      } else {
        return controller.ControllerSet.prototype.createController.call(this);
      }
    },
    fromAny(value) {
      if (value instanceof MirrorPlugin) {
        return this.createController(value);
      } else {
        return ReflectionController.fromAny(value);
      }
    }
  }) ], ReflectorController.prototype, "reflections", void 0);
  __decorate([ model.ModelRef({
    type: DomainGroup,
    initModel(domainGroup) {
      const reflectionControllers = this.owner.reflections.controllers;
      for (const controllerId in reflectionControllers) {
        const reflectionController = reflectionControllers[controllerId];
        reflectionController.domains.setModel(domainGroup);
      }
    }
  }) ], ReflectorController.prototype, "domains", void 0);
  __decorate([ component.Provider({
    extends: PrismProvider,
    type: PrismService,
    observes: true,
    service: PrismService.global(),
    serviceDidInsertPlugin(plugin, index) {
      if (plugin instanceof MirrorPlugin) {
        this.owner.insertPlugin(plugin);
      }
    },
    serviceWillRemovePlugin(plugin) {
      if (plugin instanceof MirrorPlugin) {
        this.owner.removePlugin(plugin);
      }
    }
  }) ], ReflectorController.prototype, "prismProvider", void 0);
  __decorate([ component.Provider({
    extends: controller.HistoryProvider,
    type: controller.HistoryService,
    observes: true,
    service: controller.HistoryService.global(),
    serviceDidPopHistory(historyState) {
      this.owner.updateHistoryState(historyState);
    }
  }) ], ReflectorController.prototype, "historyProvider", void 0);
  class RefractionController extends WidgetController {
    willUnmount() {
      super.willUnmount();
      this.widget.removeView();
    }
  }
  __decorate([ controller.TraitViewRef({
    extends: true,
    observesTrait: true,
    detectGadgetModel(model) {
      let gadgetTrait = null;
      if (gadgetTrait === null) {
        gadgetTrait = model.getTrait(table.TableTrait);
      }
      if (gadgetTrait === null) {
        gadgetTrait = model.getTrait(gauge.GaugeTrait);
      }
      if (gadgetTrait === null) {
        gadgetTrait = model.getTrait(pie.PieTrait);
      }
      if (gadgetTrait === null) {
        gadgetTrait = model.getTrait(chart.ChartTrait);
      }
      return gadgetTrait;
    },
    initView(widgetView) {
      WidgetController.widget.prototype.initView.call(this, widgetView);
      widgetView.marginTop.setState(8, component.Affinity.Intrinsic);
      widgetView.marginRight.setState(8, component.Affinity.Intrinsic);
      widgetView.marginBottom.setState(8, component.Affinity.Intrinsic);
      widgetView.marginLeft.setState(8, component.Affinity.Intrinsic);
    }
  }) ], RefractionController.prototype, "widget", void 0);
  __decorate([ controller.TraitViewControllerSet({
    extends: true,
    implements: true,
    detectController(controller) {
      return controller instanceof TableGadgetController || controller instanceof GaugeGadgetController || controller instanceof PieGadgetController || controller instanceof ChartGadgetController ? controller : null;
    },
    createController(gadgetTrait) {
      let gadgetController;
      if (gadgetTrait instanceof table.TableTrait) {
        gadgetController = new TableGadgetController;
      } else if (gadgetTrait instanceof gauge.GaugeTrait) {
        gadgetController = new GaugeGadgetController;
      } else if (gadgetTrait instanceof pie.PieTrait) {
        gadgetController = new PieGadgetController;
      } else if (gadgetTrait instanceof chart.ChartTrait) {
        gadgetController = new ChartGadgetController;
      } else {
        gadgetController = WidgetController.gadgets.prototype.createController.call(this, gadgetTrait);
      }
      return gadgetController;
    }
  }) ], RefractionController.prototype, "gadgets", void 0);
  __decorate([ model.TraitRef({
    type: EntityTrait
  }) ], RefractionController.prototype, "entity", void 0);
  class RefractorController extends controller.Controller {
    willUnmount() {
      super.willUnmount();
      this.entity.setTrait(null);
    }
  }
  __decorate([ controller.TraitViewControllerSet({
    type: RefractionController,
    binds: true,
    get parentView() {
      return this.owner.fixtures.view;
    },
    getTraitViewRef(refractionController) {
      return refractionController.widget;
    },
    initController(refractionController) {
      refractionController.entity.setTrait(this.owner.entity.trait);
    },
    willDetachController(refractionController) {
      refractionController.widget.removeView();
    }
  }) ], RefractorController.prototype, "refractions", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView,
    initView(fixturesView) {
      const refractionControllers = this.owner.refractions.controllers;
      for (const controllerId in refractionControllers) {
        const refractionController = refractionControllers[controllerId];
        refractionController.widget.insertView(fixturesView);
      }
    }
  }) ], RefractorController.prototype, "fixtures", void 0);
  __decorate([ model.TraitRef({
    type: EntityTrait,
    didAttachTrait(entityTrait) {
      const widgetGroup = entityTrait.getTrait(WidgetGroup);
      if (widgetGroup !== null) {
        this.owner.widgets.setTrait(widgetGroup);
      }
    },
    willDetachTrait(entityTrait) {
      this.owner.widgets.setTrait(null);
      this.owner.removeChildren();
      const fixturesView = this.owner.fixtures.view;
      if (fixturesView !== null) {
        fixturesView.removeChildren();
      }
    }
  }) ], RefractorController.prototype, "entity", void 0);
  __decorate([ model.TraitRef({
    type: WidgetGroup,
    observes: true,
    initTrait(widgetGroup) {
      const widgetTraits = widgetGroup.widgets.traits;
      for (const traitId in widgetTraits) {
        const widgetTrait = widgetTraits[traitId];
        this.owner.refractions.addTraitController(widgetTrait, null);
      }
    },
    traitWillAttachWidget(widgetTrait, targetTrait) {
      this.owner.refractions.addTraitController(widgetTrait, targetTrait);
    },
    traitDidDetachWidget(widgetTrait) {
      this.owner.refractions.deleteTraitController(widgetTrait);
    }
  }) ], RefractorController.prototype, "widgets", void 0);
  __decorate([ component.Provider({
    extends: PrismProvider,
    type: PrismService,
    observes: false,
    service: PrismService.global()
  }) ], RefractorController.prototype, "prismProvider", void 0);
  class MagnifierHandle extends button.ButtonMembrane {
    constructor(node) {
      super(node);
      this.onClick = this.onClick.bind(this);
      this.initHandle();
    }
    initHandle() {
      this.addClass("magnifier-handle");
      this.position.setState("relative", component.Affinity.Intrinsic);
      this.flexShrink.setState(0, component.Affinity.Intrinsic);
      this.marginTop.setState(8, component.Affinity.Intrinsic);
      this.marginRight.setState(8, component.Affinity.Intrinsic);
      this.marginBottom.setState(0, component.Affinity.Intrinsic);
      this.marginLeft.setState(8, component.Affinity.Intrinsic);
      this.overflowX.setState("hidden", component.Affinity.Intrinsic);
      this.overflowY.setState("hidden", component.Affinity.Intrinsic);
      this.backgroundColor.setLook(theme.Look.accentColor, component.Affinity.Intrinsic);
      this.pointerEvents.setState("auto", component.Affinity.Intrinsic);
    }
    onMount() {
      super.onMount();
      this.on("click", this.onClick);
    }
    onUnmount() {
      this.off("click", this.onClick);
      super.onUnmount();
    }
    onAnimate(viewContext) {
      super.onAnimate(viewContext);
      this.lineHeight.setState(this.height.state, component.Affinity.Intrinsic);
    }
    onLayout(viewContext) {
      super.onLayout(viewContext);
      if (viewContext.viewportIdiom === "mobile") {
        this.height.setState(48, component.Affinity.Intrinsic);
      } else {
        this.height.setState(36, component.Affinity.Intrinsic);
      }
      this.lineHeight.setState(this.height.state, component.Affinity.Intrinsic);
      const iconView = this.icon.view;
      if (iconView !== null) {
        iconView.width.setState(this.height.state, component.Affinity.Intrinsic);
        iconView.height.setState(this.height.state, component.Affinity.Intrinsic);
      }
      const labelView = this.label.view;
      if (labelView !== null) {
        labelView.left.setState(this.height.state, component.Affinity.Intrinsic);
        labelView.right.setState(this.height.state, component.Affinity.Intrinsic);
      }
      const accessoryView = this.accessory.view;
      if (accessoryView !== null) {
        accessoryView.width.setState(this.height.state, component.Affinity.Intrinsic);
        accessoryView.height.setState(this.height.state, component.Affinity.Intrinsic);
      }
    }
    glow(input) {
      if (this.stretch.collapsed) {
        super.glow(input);
      }
    }
    onClick(event) {
      event.stopPropagation();
      this.callObservers("viewDidPressMagnifierHandle", this);
    }
  }
  __decorate([ component.Animator({
    type: math.Length,
    inherits: true
  }) ], MagnifierHandle.prototype, "collapsedWidth", void 0);
  __decorate([ theme.ThemeAnimator({
    type: style.Expansion,
    inherits: true,
    value: style.Expansion.expanded(),
    didSetValue(newStretch, oldStretch) {
      const labelView = this.owner.label.view;
      if (labelView !== null) {
        labelView.display.setState(newStretch.collapsed ? "none" : "block", component.Affinity.Intrinsic);
        labelView.opacity.setState(newStretch.phase, component.Affinity.Intrinsic);
      }
      const accessoryView = this.owner.accessory.view;
      if (accessoryView !== null) {
        accessoryView.display.setState(newStretch.collapsed ? "none" : "block", component.Affinity.Intrinsic);
        accessoryView.opacity.setState(newStretch.phase, component.Affinity.Intrinsic);
      }
    }
  }) ], MagnifierHandle.prototype, "stretch", void 0);
  __decorate([ view.ViewRef({
    key: true,
    type: dom.HtmlView,
    binds: true,
    initView(iconView) {
      iconView.position.setState("absolute", component.Affinity.Intrinsic);
      iconView.top.setState(0, component.Affinity.Intrinsic);
      iconView.right.setState(0, component.Affinity.Intrinsic);
      iconView.width.setState(this.owner.height.state, component.Affinity.Intrinsic);
      iconView.height.setState(this.owner.height.state, component.Affinity.Intrinsic);
      if (iconView instanceof graphics.HtmlIconView) {
        iconView.iconWidth.setState(24, component.Affinity.Intrinsic);
        iconView.iconHeight.setState(24, component.Affinity.Intrinsic);
        iconView.iconColor.setLook(theme.Look.backgroundColor, component.Affinity.Intrinsic);
      }
    },
    createView() {
      return graphics.HtmlIconView.create();
    },
    insertChild(parent, child, target, key) {
      parent.appendChild(child, key);
    },
    fromAny(value) {
      if (value instanceof dom.HtmlView) {
        return value;
      } else {
        const iconView = this.createView();
        iconView.graphics.setState(value, component.Affinity.Intrinsic);
        return iconView;
      }
    }
  }) ], MagnifierHandle.prototype, "icon", void 0);
  __decorate([ view.ViewRef({
    key: true,
    type: dom.HtmlView,
    binds: true,
    initView(labelView) {
      labelView.position.setState("absolute", component.Affinity.Intrinsic);
      labelView.top.setState(0, component.Affinity.Intrinsic);
      labelView.left.setState(this.owner.height.state, component.Affinity.Intrinsic);
      labelView.right.setState(this.owner.height.state, component.Affinity.Intrinsic);
      labelView.textAlign.setState("center", component.Affinity.Intrinsic);
      labelView.color.setLook(theme.Look.backgroundColor, component.Affinity.Intrinsic);
    },
    createView() {
      const labelView = dom.HtmlView.fromTag("span");
      labelView.display.setState("block", component.Affinity.Intrinsic);
      labelView.fontFamily.setState("system-ui, 'Open Sans', sans-serif", component.Affinity.Intrinsic);
      labelView.fontSize.setState(17, component.Affinity.Intrinsic);
      labelView.whiteSpace.setState("nowrap", component.Affinity.Intrinsic);
      labelView.textOverflow.setState("ellipsis", component.Affinity.Intrinsic);
      labelView.overflowX.setState("hidden", component.Affinity.Intrinsic);
      labelView.overflowY.setState("hidden", component.Affinity.Intrinsic);
      return labelView;
    },
    insertChild(parent, child, target, key) {
      target = this.owner.icon.view;
      parent.insertChild(child, target, key);
    },
    fromAny(value) {
      if (value === void 0 || typeof value === "string") {
        const labelView = this.createView();
        labelView.text(value);
        return labelView;
      } else {
        return dom.HtmlView.fromAny(value);
      }
    }
  }) ], MagnifierHandle.prototype, "label", void 0);
  __decorate([ view.ViewRef({
    key: true,
    type: dom.HtmlView,
    binds: true,
    initView(accessoryView) {
      accessoryView.position.setState("absolute", component.Affinity.Intrinsic);
      accessoryView.top.setState(0, component.Affinity.Intrinsic);
      accessoryView.left.setState(0, component.Affinity.Intrinsic);
      accessoryView.width.setState(this.owner.height.state, component.Affinity.Intrinsic);
      accessoryView.height.setState(this.owner.height.state, component.Affinity.Intrinsic);
      if (accessoryView instanceof graphics.HtmlIconView) {
        accessoryView.iconWidth.setState(24, component.Affinity.Intrinsic);
        accessoryView.iconHeight.setState(24, component.Affinity.Intrinsic);
        accessoryView.iconColor.setLook(theme.Look.backgroundColor, component.Affinity.Intrinsic);
      }
    },
    createView() {
      return graphics.HtmlIconView.create();
    },
    insertChild(parent, child, target, key) {
      target = this.owner.label.view;
      if (target === null) {
        target = this.owner.icon.view;
      }
      parent.insertChild(child, target, key);
    },
    fromAny(value) {
      if (value instanceof dom.HtmlView) {
        return value;
      } else {
        const accessoryView = this.createView();
        accessoryView.graphics.setState(value, component.Affinity.Intrinsic);
        return accessoryView;
      }
    }
  }) ], MagnifierHandle.prototype, "accessory", void 0);
  class MagnifierController extends controller.Controller {
    constructor() {
      super();
      this.onClickCollapse = this.onClickCollapse.bind(this);
      this.refractor.insertController();
    }
    applyStatus(statusVector) {
      const handleView = this.handle.view;
      if (handleView !== null) {
        const alert = statusVector.get(Status.alert) || 0;
        const warning = statusVector.get(Status.warning) || 0;
        const inactive = statusVector.get(Status.inactive) || 0;
        if (alert !== 0 && warning !== 0) {
          handleView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, alert ] ]);
        } else if (alert !== 0) {
          handleView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, 1 ], [ theme.Feel.alert, alert ] ]);
        } else if (warning !== 0) {
          handleView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, void 0 ] ]);
        } else {
          handleView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, void 0 ], [ theme.Feel.alert, void 0 ] ]);
        }
        if (inactive !== 0) {
          handleView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, inactive ] ]);
        } else {
          handleView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, void 0 ] ]);
        }
      }
    }
    onClickCollapse(event) {
      event.stopPropagation();
      const sessionModel = this.session.model;
      if (sessionModel !== null) {
        sessionModel.selectionProvider.unselectAll();
      }
    }
    static get collapseIcon() {
      return graphics.VectorIcon.create(24, 24, "M16.6,8.6L12,13.2L7.4,8.6L6,10L12,16L18,10Z");
    }
  }
  __decorate([ view.ViewRef({
    type: window.DrawerView,
    willAttachView(panelView) {
      this.owner.handle.insertView(panelView);
      this.owner.fixtures.insertView(panelView);
    },
    didDetachView(panelView) {
      panelView.removeChildren();
    }
  }) ], MagnifierController.prototype, "panel", void 0);
  __decorate([ view.ViewRef({
    type: MagnifierHandle,
    initView(handleView) {
      const statusTrait = this.owner.status.trait;
      if (statusTrait !== null) {
        this.owner.applyStatus(statusTrait.statusVector);
      } else {
        this.owner.applyStatus(StatusVector.empty());
      }
    },
    createView() {
      const handleView = MagnifierHandle.create();
      handleView.flexShrink.setState(0, component.Affinity.Intrinsic);
      const collapseButton = graphics.HtmlIconView.create();
      collapseButton.graphics.setState(MagnifierController.collapseIcon, component.Affinity.Intrinsic);
      collapseButton.cursor.setState("pointer", component.Affinity.Intrinsic);
      collapseButton.on("click", this.owner.onClickCollapse);
      handleView.accessory.setView(collapseButton);
      handleView.accessory.insertView();
      handleView.modifyMood(theme.Feel.default, [ [ theme.Feel.primary, 1 ] ]);
      return handleView;
    }
  }) ], MagnifierController.prototype, "handle", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView,
    initView(fixturesView) {
      const refractorController = this.owner.refractor.controller;
      if (refractorController !== null) {
        refractorController.fixtures.setView(fixturesView);
      }
    },
    createView() {
      const fixturesView = dom.HtmlView.create();
      fixturesView.addClass("fixtures");
      fixturesView.position.setState("relative", component.Affinity.Intrinsic);
      fixturesView.overflowX.setState("hidden", component.Affinity.Intrinsic);
      fixturesView.overflowY.setState("auto", component.Affinity.Intrinsic);
      fixturesView.pointerEvents.setState("auto", component.Affinity.Intrinsic);
      fixturesView.on("scroll", (function(event) {
        fixturesView.requireUpdate(view.View.NeedsScroll);
      }));
      return fixturesView;
    }
  }) ], MagnifierController.prototype, "fixtures", void 0);
  __decorate([ controller.ControllerRef({
    key: true,
    type: RefractorController,
    binds: true,
    initController(refractorController) {
      const fixturesView = this.owner.fixtures.view;
      if (fixturesView !== null) {
        refractorController.fixtures.setView(fixturesView);
      }
    }
  }) ], MagnifierController.prototype, "refractor", void 0);
  __decorate([ model.TraitRef({
    type: EntityTrait,
    observes: true,
    didAttachTrait(entityTrait) {
      this.owner.status.setTrait(entityTrait.getTrait(StatusTrait));
      const handleView = this.owner.handle.view;
      if (handleView !== null) {
        handleView.label.setView(entityTrait.title.value);
        handleView.icon.setView(entityTrait.icon.value);
      }
      const refractorController = this.owner.refractor.controller;
      if (refractorController !== null) {
        refractorController.entity.setTrait(entityTrait);
      }
    },
    willDetachTrait(entityTrait) {
      const refractorController = this.owner.refractor.controller;
      if (refractorController !== null) {
        refractorController.entity.setTrait(null);
      }
      const handleView = this.owner.handle.view;
      if (handleView !== null) {
        handleView.label.setView(null);
        handleView.icon.setView(null);
      }
      this.owner.status.setTrait(null);
    },
    entityDidSetTitle(title) {
      const handleView = this.owner.handle.view;
      if (handleView !== null) {
        handleView.label.setView(title);
      }
    },
    entityDidSetIcon(icon) {
      const handleView = this.owner.handle.view;
      if (handleView !== null) {
        handleView.icon.setView(icon);
      }
    },
    traitDidInsertTrait(memberTrait, targetTrait) {
      if (memberTrait instanceof StatusTrait) {
        this.owner.status.setTrait(memberTrait);
      }
    }
  }) ], MagnifierController.prototype, "entity", void 0);
  __decorate([ model.TraitRef({
    type: StatusTrait,
    observes: true,
    didAttachTrait(statusTrait) {
      this.owner.applyStatus(statusTrait.statusVector);
    },
    traitDidSetStatusVector(newStatusVector, oldStatusVector) {
      this.owner.applyStatus(newStatusVector);
    }
  }) ], MagnifierController.prototype, "status", void 0);
  __decorate([ model.ModelRef({
    implements: true,
    type: SessionModel,
    didAttachModel(sessionModel) {
      const selectionService = sessionModel.selectionProvider.service;
      if (selectionService !== null) {
        selectionService.observe(this);
      }
    },
    willDetachModel(sessionModel) {
      const selectionService = sessionModel.selectionProvider.service;
      if (selectionService !== null) {
        selectionService.unobserve(this);
      }
    },
    serviceDidSelect(model, index, options) {
      const entityTrait = model.getTrait(EntityTrait);
      if (entityTrait !== null) {
        this.owner.entity.setTrait(entityTrait);
        const panelView = this.owner.panel.view;
        if (panelView !== null) {
          panelView.present();
        }
      }
    },
    serviceWillUnselect(model, selectionService) {
      const selections = selectionService.selections;
      if (selections.length > 1) {
        this.owner.entity.setTrait(selections[selections.length - 1].getTrait(EntityTrait));
      } else {
        const panelView = this.owner.panel.view;
        if (panelView !== null) {
          panelView.dismiss();
        }
        this.owner.entity.setTrait(null);
        this.owner.applyStatus(StatusVector.empty());
      }
    }
  }) ], MagnifierController.prototype, "session", void 0);
  __decorate([ util.Lazy ], MagnifierController, "collapseIcon", null);
  class ActivityWindow extends window.PopoverView {
    constructor(node) {
      super(node);
      this.initWindow();
      this.initTheme();
    }
    initWindow() {
      this.addClass("activity-window");
      this.backgroundColor.setLook(theme.Look.backgroundColor, component.Affinity.Intrinsic);
    }
    initTheme() {
      this.modifyTheme(theme.Feel.default, [ [ theme.Feel.covered, 1 ] ]);
    }
  }
  class BeamView extends dom.HtmlView {
    constructor(node) {
      super(node);
      this.initBeam();
    }
    initBeam() {
      this.addClass("beam");
      this.position.setState("absolute", component.Affinity.Intrinsic);
      this.top.setState(0, component.Affinity.Intrinsic);
      this.right.setState(0, component.Affinity.Intrinsic);
      this.left.setState(0, component.Affinity.Intrinsic);
      this.height.setState(4, component.Affinity.Intrinsic);
    }
  }
  class ShellView extends dom.HtmlView {
    constructor(node) {
      super(node);
      this.masterLayout = new constraint.ConstraintGroup(this).constrain();
      this.mobileLayout = new constraint.ConstraintGroup(this);
      this.desktopLayout = new constraint.ConstraintGroup(this);
      this.onSurfaceScroll = this.onSurfaceScroll.bind(this);
      this.initShell();
      this.initMasterLayout(this.masterLayout);
      this.initMobileLayout(this.mobileLayout);
      this.initDesktopLayout(this.desktopLayout);
    }
    initShell() {
      this.beam.insertView();
      this.surface.insertView();
      this.topBar.insertView();
      this.searchBar.insertView();
      this.brand.insertView();
      this.rightPanel.insertView();
      this.scrim.insertView();
      this.leftDrawer.insertView();
      this.rightDrawer.insertView();
      this.activityWindow.insertView();
    }
    initMasterLayout(layout) {
      layout.constraint(this.beamHeight.constrain(), "ge", 4);
      layout.constraint(this.beamHeight.constrain(), "eq", this.safeAreaInsetTop, "weak");
      layout.constraint(this.topBarTop.constrain(), "eq", this.beamHeight);
      layout.constraint(this.searchBarPaddingLeft.constrain(), "eq", this.topBarPaddingLeft.plus(4));
      layout.constraint(this.searchBarPaddingRight.constrain(), "eq", this.topBarPaddingRight.plus(4));
      layout.constraint(this.searchBarPaddingBottom.constrain(), "eq", this.safeAreaInsetBottom);
      layout.constraint(this.surfacePaddingTop.constrain(), "eq", this.topBarHeight);
      layout.constraint(this.surfacePaddingBottom.constrain(), "eq", this.safeAreaInsetBottom, "weak");
      layout.constraint(this.activityHeight.constrain(), "eq", this.height.minus(this.beamHeight));
    }
    initMobileLayout(layout) {
      layout.constraint(this.topBarLeft.constrain(), "eq", 0);
      layout.constraint(this.topBarRight.constrain(), "eq", 0);
      layout.constraint(this.topBarHeight.constrain(), "eq", 60);
      layout.constraint(this.topBarPaddingLeft.constrain(), "eq", this.safeAreaInsetLeft);
      layout.constraint(this.topBarPaddingRight.constrain(), "eq", this.safeAreaInsetRight);
      layout.constraint(this.searchBarTop.constrain(), "le", this.height.minus(this.safeAreaInsetBottom).minus(this.searchBarHeight));
      layout.constraint(this.searchBarTop.constrain(), "eq", this.visualViewportPageTop.plus(this.visualViewportHeight).minus(this.searchBarHeight), "weak");
      layout.constraint(this.searchBarLeft.constrain(), "eq", 0);
      layout.constraint(this.searchBarRight.constrain(), "eq", 0);
      layout.constraint(this.searchBarHeight.constrain(), "eq", 60);
      layout.constraint(this.searchFieldHeight.constrain(), "eq", 44);
      layout.constraint(this.surfacePaddingLeft.constrain(), "eq", 0);
      layout.constraint(this.surfacePaddingRight.constrain(), "eq", 0);
      layout.constraint(this.drawerWidth.constrain(), "eq", this.width);
    }
    initDesktopLayout(layout) {
      layout.constraint(this.topBarLeft.constrain(), "eq", this.leftDrawerWidth);
      layout.constraint(this.topBarRight.constrain(), "eq", this.rightPanelWidth);
      layout.constraint(this.topBarHeight.constrain(), "eq", 48);
      layout.constraint(this.topBarPaddingLeft.constrain(), "eq", 0);
      layout.constraint(this.topBarPaddingRight.constrain(), "eq", 0);
      layout.constraint(this.searchBarTop.constrain(), "eq", this.beamHeight);
      layout.constraint(this.searchBarLeft.constrain(), "eq", this.leftDrawerWidth);
      layout.constraint(this.searchBarRight.constrain(), "eq", this.rightPanelWidth);
      layout.constraint(this.searchBarHeight.constrain(), "eq", 48);
      layout.constraint(this.searchFieldHeight.constrain(), "eq", 32);
      layout.constraint(this.surfacePaddingLeft.constrain(), "eq", this.leftDrawerWidth);
      layout.constraint(this.surfacePaddingRight.constrain(), "eq", this.rightPanelWidth);
      layout.constraint(this.drawerWidth.constrain(), "eq", 360);
    }
    updateViewportIdiom(viewportIdiom) {
      if (viewportIdiom === "mobile") {
        this.desktopLayout.constrain(false);
        this.mobileLayout.constrain(true);
      } else {
        this.mobileLayout.constrain(false);
        this.desktopLayout.constrain(true);
      }
      const searchBar = this.searchBar.view;
      if (searchBar !== null) {
        this.updateSearchBarBleed(searchBar);
      }
      const brandView = this.brand.view;
      if (brandView !== null) {
        if (viewportIdiom === "mobile") {
          brandView.display("block");
        } else {
          brandView.display("none");
        }
      }
      const leftDrawerView = this.leftDrawer.view;
      if (leftDrawerView !== null) {
        if (viewportIdiom === "mobile") {
          leftDrawerView.dismiss(false);
        } else {
          leftDrawerView.collapse(false);
          leftDrawerView.present(false);
        }
        const surfaceView = this.surface.view;
        const fullBleed = surfaceView !== null && surfaceView.fullBleed;
        const translucent = fullBleed && this.viewportIdiom !== "mobile";
        leftDrawerView.modifyTheme(theme.Feel.default, [ [ theme.Feel.translucent, translucent ? 1 : void 0 ] ]);
      }
      const leftDrawerButton = this.leftDrawerButton.view;
      if (leftDrawerButton !== null) {
        if (viewportIdiom === "mobile") {
          leftDrawerButton.display("flex");
        } else {
          leftDrawerButton.display("none");
        }
      }
      const rightDrawerView = this.rightDrawer.view;
      if (rightDrawerView !== null) {
        const surfaceView = this.surface.view;
        const fullBleed = surfaceView !== null && surfaceView.fullBleed;
        const translucent = fullBleed && this.viewportIdiom !== "mobile";
        rightDrawerView.modifyTheme(theme.Feel.default, [ [ theme.Feel.translucent, translucent ? 1 : void 0 ] ]);
      }
    }
    setFullBleed(fullBleed, surfaceView, timing) {
      const rightPanelView = this.rightPanel.view;
      if (rightPanelView !== null) {
        rightPanelView.pointerEvents(fullBleed ? "none" : "auto");
      }
      const topBar = this.topBar.view;
      if (topBar !== null) {
        this.updateTopBarBleed(topBar, timing);
      }
      const searchBar = this.searchBar.view;
      if (searchBar !== null) {
        this.updateSearchBarBleed(searchBar, timing);
      }
      const leftDrawerView = this.leftDrawer.view;
      if (leftDrawerView !== null) {
        const translucent = fullBleed && this.viewportIdiom !== "mobile";
        leftDrawerView.modifyTheme(theme.Feel.default, [ [ theme.Feel.translucent, translucent ? 1 : void 0 ] ]);
      }
      const rightDrawerView = this.rightDrawer.view;
      if (rightDrawerView !== null) {
        const translucent = fullBleed && this.viewportIdiom !== "mobile";
        rightDrawerView.modifyTheme(theme.Feel.default, [ [ theme.Feel.translucent, translucent ? 1 : void 0 ] ]);
      }
    }
    updateTopBarBleed(topBar, timing) {
      const surfaceView = this.surface.view;
      if (surfaceView !== null) {
        const backgroundColor = surfaceView.getLookOr(theme.Look.backgroundColor, null);
        if (backgroundColor !== null) {
          if (timing === void 0) {
            timing = surfaceView.getLook(theme.Look.timing);
          }
          let gradient;
          if (surfaceView.fullBleed.value) {
            gradient = style.LinearGradient.create("bottom", style.ColorStop.create(backgroundColor.alpha(0), 0), style.ColorStop.create(backgroundColor.alpha(0), 100, 75));
          } else {
            gradient = style.LinearGradient.create("bottom", style.ColorStop.create(backgroundColor, 0), style.ColorStop.create(backgroundColor.alpha(0), 100, 75));
          }
          topBar.backgroundImage.setState(gradient, timing, component.Affinity.Intrinsic);
        }
      }
    }
    updateSearchBarBleed(searchBar, timing) {
      const surfaceView = this.surface.view;
      if (surfaceView !== null) {
        const backgroundColor = surfaceView.getLookOr(theme.Look.backgroundColor, null);
        if (backgroundColor !== null) {
          if (timing === void 0) {
            timing = surfaceView.getLook(theme.Look.timing);
          }
          let gradient;
          if (surfaceView.fullBleed || surfaceView.viewportIdiom !== "mobile") {
            gradient = style.LinearGradient.create("top", style.ColorStop.create(backgroundColor.alpha(0), 0), style.ColorStop.create(backgroundColor.alpha(0), 100, 75));
          } else {
            gradient = style.LinearGradient.create("top", style.ColorStop.create(backgroundColor, 0), style.ColorStop.create(backgroundColor.alpha(0), 100, 75));
          }
          searchBar.backgroundImage.setState(gradient, timing, component.Affinity.Intrinsic);
        }
      }
    }
    willResize(viewContext) {
      super.willResize(viewContext);
      const visualViewport = viewContext.viewport.visual;
      this.visualViewportWidth.setValue(visualViewport.width);
      this.visualViewportHeight.setValue(visualViewport.height);
      this.visualViewportPageLeft.setValue(visualViewport.pageLeft);
      this.visualViewportPageTop.setValue(visualViewport.pageTop);
      const safeArea = viewContext.viewport.safeArea;
      this.safeAreaInsetTop.setValue(safeArea.insetTop);
      this.safeAreaInsetRight.setValue(safeArea.insetRight);
      this.safeAreaInsetBottom.setValue(safeArea.insetBottom);
      this.safeAreaInsetLeft.setValue(safeArea.insetLeft);
    }
    didMount() {
      this.updateViewportIdiom(this.viewportIdiom);
      const surfaceView = this.surface.view;
      if (surfaceView !== null) {
        this.setFullBleed(surfaceView.fullBleed.value, surfaceView);
      }
      super.didMount();
    }
    onLayout(viewContext) {
      super.onLayout(viewContext);
      const safeArea = viewContext.viewport.safeArea;
      this.edgeInsets.setValue({
        insetTop: 0,
        insetRight: safeArea.insetRight,
        insetBottom: safeArea.insetBottom,
        insetLeft: safeArea.insetLeft
      }, component.Affinity.Intrinsic);
    }
    onSurfaceScroll(event) {
      const surfaceView = this.surface.view;
      if (surfaceView !== null) {
        surfaceView.requireUpdate(view.View.NeedsScroll);
      }
    }
  }
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    value: 0,
    strength: "strong"
  }) ], ShellView.prototype, "visualViewportWidth", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    value: 0,
    strength: "strong"
  }) ], ShellView.prototype, "visualViewportHeight", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    value: 0,
    strength: "strong"
  }) ], ShellView.prototype, "visualViewportPageLeft", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    value: 0,
    strength: "strong"
  }) ], ShellView.prototype, "visualViewportPageTop", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    value: 0,
    strength: "strong"
  }) ], ShellView.prototype, "safeAreaInsetTop", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    value: 0,
    strength: "strong"
  }) ], ShellView.prototype, "safeAreaInsetRight", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    value: 0,
    strength: "strong"
  }) ], ShellView.prototype, "safeAreaInsetBottom", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    value: 0,
    strength: "strong"
  }) ], ShellView.prototype, "safeAreaInsetLeft", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong",
    updateFlags: view.View.NeedsLayout
  }) ], ShellView.prototype, "beamHeight", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], ShellView.prototype, "topBarTop", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], ShellView.prototype, "topBarLeft", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], ShellView.prototype, "topBarRight", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], ShellView.prototype, "topBarHeight", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], ShellView.prototype, "topBarPaddingLeft", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], ShellView.prototype, "topBarPaddingRight", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], ShellView.prototype, "searchBarTop", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], ShellView.prototype, "searchBarLeft", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], ShellView.prototype, "searchBarRight", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], ShellView.prototype, "searchBarHeight", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], ShellView.prototype, "searchBarPaddingLeft", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], ShellView.prototype, "searchBarPaddingRight", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], ShellView.prototype, "searchBarPaddingBottom", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], ShellView.prototype, "searchFieldHeight", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], ShellView.prototype, "surfacePaddingTop", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong",
    didSetValue(newValue, oldValue) {
      const surfaceView = this.owner.surface.view;
      if (surfaceView !== null) {
        surfaceView.requireUpdate(view.View.NeedsLayout);
      }
    }
  }) ], ShellView.prototype, "surfacePaddingRight", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], ShellView.prototype, "surfacePaddingBottom", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong",
    didSetValue(newValue, oldValue) {
      const surfaceView = this.owner.surface.view;
      if (surfaceView !== null) {
        surfaceView.requireUpdate(view.View.NeedsLayout);
      }
    }
  }) ], ShellView.prototype, "surfacePaddingLeft", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], ShellView.prototype, "leftDrawerWidth", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], ShellView.prototype, "rightPanelWidth", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], ShellView.prototype, "drawerWidth", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], ShellView.prototype, "activityHeight", void 0);
  __decorate([ component.Property({
    type: Object,
    value: {
      insetTop: 0,
      insetRight: 0,
      insetBottom: 0,
      insetLeft: 0
    }
  }) ], ShellView.prototype, "edgeInsets", void 0);
  __decorate([ view.ViewRef({
    type: BeamView,
    binds: true,
    initView(beamView) {
      this.constraint(beamView.height.constrain(), "eq", this.owner.beamHeight);
      beamView.zIndex.setState(9, component.Affinity.Intrinsic);
    }
  }) ], ShellView.prototype, "beam", void 0);
  __decorate([ view.ViewRef({
    type: SurfaceView,
    binds: true,
    observes: true,
    initView(surfaceView) {
      surfaceView.addClass("surface").position("absolute").left(0).right(0).top(0).bottom(0).overflowX("auto").overflowY("auto").zIndex(0);
      this.constraint(surfaceView.top.constrain(), "eq", this.owner.beamHeight);
      this.constraint(surfaceView.paddingTop.constrain(), "eq", this.owner.surfacePaddingTop);
      this.constraint(surfaceView.paddingRight.constrain(), "eq", this.owner.surfacePaddingRight);
      this.constraint(surfaceView.paddingBottom.constrain(), "eq", this.owner.surfacePaddingBottom);
      this.constraint(surfaceView.paddingLeft.constrain(), "eq", this.owner.surfacePaddingLeft);
    },
    didAttachView(surfaceView) {
      surfaceView.on("scroll", this.owner.onSurfaceScroll);
    },
    willDetachView(surfaceView) {
      surfaceView.off("scroll", this.owner.onSurfaceScroll);
    },
    viewDidSetFullBleed(fullBleed, surfaceView) {
      this.owner.setFullBleed(fullBleed, surfaceView);
    }
  }) ], ShellView.prototype, "surface", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView,
    binds: true,
    observes: true,
    initView(topBar) {
      topBar.addClass("top-bar").display("flex").position("absolute").left(0).right(0).overflowX("hidden").overflowY("hidden").pointerEvents("none");
      this.constraint(topBar.top.constrain(), "eq", this.owner.topBarTop);
      this.constraint(topBar.left.constrain(), "eq", this.owner.topBarLeft);
      this.constraint(topBar.right.constrain(), "eq", this.owner.topBarRight);
      this.constraint(topBar.height.constrain(), "eq", this.owner.topBarHeight);
      this.owner.topLeftBar.insertView(topBar);
      this.owner.topRightBar.insertView(topBar);
    },
    viewDidApplyTheme(theme, mood, timing, topBar) {
      const surfaceView = this.owner.surface.view;
      if (surfaceView !== null) {
        this.owner.setFullBleed(surfaceView.fullBleed.value, surfaceView, timing);
      }
    }
  }) ], ShellView.prototype, "topBar", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView,
    initView(topLeftBar) {
      topLeftBar.addClass("top-left-bar").display("flex").flexGrow(1).flexShrink(0).overflowX("hidden").overflowY("hidden");
      this.constraint(topLeftBar.paddingLeft.constrain(), "eq", this.owner.topBarPaddingLeft);
      this.owner.leftDrawerButton.insertView(topLeftBar);
    }
  }) ], ShellView.prototype, "topLeftBar", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView,
    initView(topRightBar) {
      topRightBar.addClass("top-right-bar").display("flex").flexShrink(0).overflowX("hidden").overflowY("hidden");
      this.constraint(topRightBar.paddingRight.constrain(), "eq", this.owner.topBarPaddingRight);
    }
  }) ], ShellView.prototype, "topRightBar", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView,
    binds: true,
    initView(searchBar) {
      searchBar.addClass("search-bar").display("flex").alignItems("center").position("absolute").left(0).right(0).overflowX("hidden").overflowY("hidden").pointerEvents("none");
      this.constraint(searchBar.top.constrain(), "eq", this.owner.searchBarTop);
      this.constraint(searchBar.left.constrain(), "eq", this.owner.searchBarLeft);
      this.constraint(searchBar.right.constrain(), "eq", this.owner.searchBarRight);
      this.constraint(searchBar.height.constrain(), "eq", this.owner.searchBarHeight);
      this.constraint(searchBar.paddingLeft.constrain(), "eq", this.owner.searchBarPaddingLeft);
      this.constraint(searchBar.paddingRight.constrain(), "eq", this.owner.searchBarPaddingRight);
      this.constraint(searchBar.paddingBottom.constrain(), "eq", this.owner.searchBarPaddingBottom);
      this.owner.search.insertView(searchBar);
    }
  }) ], ShellView.prototype, "searchBar", void 0);
  __decorate([ view.ViewRef({
    type: token.InputTokenView,
    initView(searchView) {
      searchView.flexShrink(0).marginLeft(2).marginRight(2);
      this.constraint(searchView.height.constrain(), "eq", this.owner.searchFieldHeight);
      searchView.collapse();
    },
    createView() {
      const searchView = token.InputTokenView.create();
      Object.defineProperty(searchView, "fillLook", {
        value: theme.Look.iconColor,
        writable: true,
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(searchView, "placeholderLook", {
        value: theme.Look.neutralColor,
        writable: true,
        enumerable: true,
        configurable: true
      });
      return searchView;
    }
  }) ], ShellView.prototype, "search", void 0);
  __decorate([ view.ViewRef({
    type: graphics.HtmlIconView,
    binds: true,
    initView(brandView) {
      brandView.addClass("brand");
      brandView.position.setState("absolute", component.Affinity.Intrinsic);
      brandView.width.setState(70, component.Affinity.Intrinsic);
      brandView.height.setState(70, component.Affinity.Intrinsic);
      brandView.iconWidth.setState(33, component.Affinity.Intrinsic);
      brandView.iconHeight.setState(33, component.Affinity.Intrinsic);
      brandView.pointerEvents.setState("none", component.Affinity.Intrinsic);
      this.constraint(brandView.left.constrain(), "eq", this.owner.width.times(.5).minus(brandView.width.times(.5)));
      this.constraint(brandView.top.constrain(), "eq", this.owner.beamHeight);
      this.constraint(brandView.height.constrain(), "eq", this.owner.topBarHeight);
    }
  }) ], ShellView.prototype, "brand", void 0);
  __decorate([ view.ViewRef({
    type: window.DrawerView,
    binds: true,
    initView(rightPanelView) {
      rightPanelView.dismiss(false);
      rightPanelView.flexDirection("column");
      rightPanelView.top.setState(null);
      rightPanelView.placement("right");
      this.constraint(rightPanelView.top.constrain(), "eq", this.owner.beamHeight);
      this.constraint(rightPanelView.expandedWidth.constrain(), "eq", this.owner.drawerWidth);
      this.constraint(this.owner.rightPanelWidth.constrain(), "eq", rightPanelView.effectiveWidth);
      this.constraint(rightPanelView.paddingBottom.constrain(), "eq", this.owner.surfacePaddingBottom);
      rightPanelView.backgroundColor.setState(null);
      rightPanelView.boxShadow.setState(null);
    }
  }) ], ShellView.prototype, "rightPanel", void 0);
  __decorate([ view.ViewRef({
    type: window.ScrimView,
    binds: true,
    initView(scrimView) {
      this.constraint(scrimView.top.constrain(), "eq", this.owner.beamHeight);
    }
  }) ], ShellView.prototype, "scrim", void 0);
  __decorate([ view.ViewRef({
    type: window.DrawerView,
    binds: true,
    initView(leftDrawerView) {
      leftDrawerView.flexDirection("column");
      leftDrawerView.top.setState(null);
      leftDrawerView.placement("left");
      leftDrawerView.collapsedWidth.setState(70, component.Affinity.Intrinsic);
      leftDrawerView.modifyTheme(theme.Feel.default, [ [ theme.Feel.raised, 1 ] ], false);
      leftDrawerView.backgroundColor.setLook(theme.Look.backgroundColor);
      this.constraint(leftDrawerView.top.constrain(), "eq", this.owner.beamHeight);
      this.constraint(this.owner.leftDrawerWidth.constrain(), "eq", leftDrawerView.effectiveWidth);
      const leftDrawerButton = this.owner.leftDrawerButton.view;
      if (leftDrawerButton !== null) {
        leftDrawerButton.setDrawerView(leftDrawerView);
      }
    }
  }) ], ShellView.prototype, "leftDrawer", void 0);
  __decorate([ view.ViewRef({
    type: window.DrawerButton,
    initView(leftDrawerButton) {
      leftDrawerButton.flexShrink.setState(0, component.Affinity.Intrinsic);
      leftDrawerButton.height.setState(null, component.Affinity.Intrinsic);
      leftDrawerButton.pointerEvents.setState("auto", component.Affinity.Intrinsic);
      leftDrawerButton.iconWidth.setState(24, component.Affinity.Intrinsic);
      leftDrawerButton.iconHeight.setState(24, component.Affinity.Intrinsic);
      leftDrawerButton.setDrawerView(this.owner.leftDrawer.view);
      leftDrawerButton.constraint(leftDrawerButton.width.constrain(), "eq", leftDrawerButton.height);
    }
  }) ], ShellView.prototype, "leftDrawerButton", void 0);
  __decorate([ view.ViewRef({
    type: window.DrawerView,
    binds: true,
    initView(rightDrawerView) {
      rightDrawerView.dismiss(false);
      rightDrawerView.flexDirection("column");
      rightDrawerView.top.setState(null);
      rightDrawerView.placement("right");
      rightDrawerView.modifyTheme(theme.Feel.default, [ [ theme.Feel.raised, 1 ] ], false);
      rightDrawerView.backgroundColor.setLook(theme.Look.backgroundColor);
      this.constraint(rightDrawerView.top.constrain(), "eq", this.owner.beamHeight);
      this.constraint(rightDrawerView.expandedWidth.constrain(), "eq", this.owner.drawerWidth);
      this.constraint(rightDrawerView.paddingBottom.constrain(), "eq", this.owner.surfacePaddingBottom);
    }
  }) ], ShellView.prototype, "rightDrawer", void 0);
  __decorate([ view.ViewRef({
    type: ActivityWindow,
    binds: true,
    initView(activityWindow) {
      activityWindow.placement([ "below" ]);
      activityWindow.setSource(this.owner);
      activityWindow.height.setAffinity(component.Affinity.Extrinsic);
      this.constraint(activityWindow.height.constrain(), "eq", this.owner.activityHeight);
    },
    createView() {
      const activityWindow = ActivityWindow.create();
      activityWindow.hideModal(false);
      return activityWindow;
    }
  }) ], ShellView.prototype, "activityWindow", void 0);
  __decorate([ component.Provider({
    extends: view.ViewportProvider,
    type: view.ViewportService,
    observes: true,
    service: view.ViewportService.global(),
    serviceDidSetViewportIdiom(newViewportIdiom, oldViewportIdiom) {
      this.owner.updateViewportIdiom(newViewportIdiom);
    },
    serviceDidReorient(orientation) {
      this.owner.updateViewportIdiom(this.owner.viewportIdiom);
    }
  }) ], ShellView.prototype, "viewportProvider", void 0);
  class ShellController extends controller.Controller {
    constructor() {
      super();
      this.initShell();
    }
    initShell() {
      this.reflector.insertController();
      this.collector.insertController();
      this.magnifier.insertController();
    }
    get brandIcon() {
      return ShellController.brandIcon;
    }
    get settingsIcon() {
      return ShellController.settingsIcon;
    }
    get inventoryIcon() {
      return ShellController.inventoryIcon;
    }
    getActivityController(entityTrait) {
      const plugins = this.prismProvider.plugins;
      for (let i = 0, n = plugins.length; i < n; i += 1) {
        const plugin = plugins[i];
        if (plugin instanceof ActivityPlugin) {
          const activityController = plugin.createActivity(entityTrait);
          if (activityController !== null) {
            return activityController;
          }
        }
      }
      return null;
    }
    showActivity(activityWindow) {
      activityWindow.modalProvider.presentModal(activityWindow, {
        modal: true
      });
    }
    addDomain(query) {
      let domainTrait = null;
      const collectorController = this.collector.controller;
      const domainGroup = this.domains.model;
      if (collectorController !== null && domainGroup !== null) {
        domainTrait = collectorController.createDomain(query);
        if (domainTrait !== null && domainTrait.model !== null) {
          domainGroup.appendChild(domainTrait.model);
        }
      }
      return domainTrait;
    }
    onMount() {
      super.onMount();
      this.updateHistoryState(this.historyProvider.historyState);
    }
    updateHistoryState(historyState) {
      const themeOverride = historyState.permanent.theme;
      if (themeOverride === "light") {
        view.ThemeService.global().setTheme(theme.Theme.light);
      } else if (themeOverride !== "auto") {
        view.ThemeService.global().setTheme(theme.Theme.dark);
      }
    }
    applyStatus(statusVector) {
      const beamView = this.beam.view;
      if (beamView !== null) {
        let inactive = statusVector.get(Status.inactive) || 0;
        let normal = statusVector.get(Status.normal) || 0;
        let warning = statusVector.get(Status.warning) || 0;
        let alert = statusVector.get(Status.alert) || 0;
        let total = inactive + normal + warning + alert;
        const minWarningRatio = .1;
        const minAlertRatio = .1;
        if (0 < warning && warning / total < minWarningRatio) {
          warning = (inactive + normal + alert) * minWarningRatio / (1 - minWarningRatio);
          total = inactive + normal + warning + alert;
        }
        if (0 < alert && alert / total < minAlertRatio) {
          alert = (inactive + normal + warning) * minAlertRatio / (1 - minAlertRatio);
          total = inactive + normal + warning + alert;
        }
        if (total !== 0) {
          inactive /= total;
          normal /= total;
          warning /= total;
          alert /= total;
        }
        inactive = Math.round(100 * inactive);
        normal = Math.round(100 * normal);
        warning = Math.round(100 * warning);
        alert = Math.round(100 * alert);
        const primaryMood = theme.MoodVector.of([ theme.Feel.primary, 1 ], [ theme.Feel.darker, .5 ]);
        const warningMood = theme.MoodVector.of([ theme.Feel.warning, 1 ], [ theme.Feel.darker, .5 ]);
        const alertMood = theme.MoodVector.of([ theme.Feel.alert, 1 ], [ theme.Feel.darker, .5 ]);
        const inactiveMood = theme.MoodVector.of([ theme.Feel.inactive, 1 ], [ theme.Feel.darker, .5 ]);
        let leftStop;
        let inactiveStop;
        let normalStop;
        let warningStop;
        let alertStop;
        let rightStop;
        if (alert === 0) {
          if (warning === 0) {
            if (normal === 0) {
              if (inactive === 0) {
                leftStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 0);
                inactiveStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 0);
                normalStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 50);
                warningStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 50);
                alertStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 100);
                rightStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 100);
              } else {
                leftStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 0);
                inactiveStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), 50);
                normalStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), 100);
                warningStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), 100);
                alertStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), 100);
                rightStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), 100);
              }
            } else {
              if (inactive === 0) {
                leftStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 0);
                inactiveStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 0);
                normalStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 50);
                warningStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 100);
                alertStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 100);
                rightStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 100);
              } else {
                leftStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), 0);
                inactiveStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), inactive / 2);
                normalStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), inactive + normal / 2);
                warningStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 100);
                alertStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 100);
                rightStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 100);
              }
            }
          } else {
            if (normal === 0) {
              if (inactive === 0) {
                leftStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), 0);
                inactiveStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), 0);
                normalStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), 0);
                warningStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), 50);
                alertStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), 100);
                rightStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), 100);
              } else {
                leftStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), 0);
                inactiveStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), inactive / 2);
                normalStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), inactive / 2);
                warningStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), inactive + warning / 2);
                alertStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), 100);
                rightStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), 100);
              }
            } else {
              if (inactive === 0) {
                leftStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 0);
                inactiveStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 0);
                normalStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), normal / 2);
                warningStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), normal + warning / 2);
                alertStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), 100);
                rightStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), 100);
              } else {
                leftStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), 0);
                inactiveStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), inactive / 2);
                normalStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), inactive + normal / 2);
                warningStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), inactive + normal + warning / 2);
                alertStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), 100);
                rightStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), 100);
              }
            }
          }
        } else {
          if (warning === 0) {
            if (normal === 0) {
              if (inactive === 0) {
                leftStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), 0);
                inactiveStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), 0);
                normalStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), 0);
                warningStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), 0);
                alertStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), 50);
                rightStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), 100);
              } else {
                leftStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), 0);
                inactiveStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), inactive / 2);
                normalStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), inactive / 2);
                warningStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), inactive + alert / 2);
                alertStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), 100);
                rightStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), 100);
              }
            } else {
              if (inactive === 0) {
                leftStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 0);
                inactiveStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 0);
                normalStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), normal / 2);
                warningStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), normal / 2);
                alertStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), normal + alert / 2);
                rightStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), 100);
              } else {
                leftStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), 0);
                inactiveStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), inactive / 2);
                normalStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), inactive + normal / 2);
                warningStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), inactive + normal / 2);
                alertStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), inactive + normal + alert / 2);
                rightStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), 100);
              }
            }
          } else {
            if (normal === 0) {
              if (inactive === 0) {
                leftStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), 0);
                inactiveStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), 0);
                normalStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), 0);
                warningStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), warning / 2);
                alertStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), warning + alert / 2);
                rightStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), 100);
              } else {
                leftStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), 0);
                inactiveStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), inactive / 2);
                normalStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), inactive / 2);
                warningStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), inactive + warning / 2);
                alertStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), inactive + warning + alert / 2);
                rightStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), 100);
              }
            } else {
              if (inactive === 0) {
                leftStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 0);
                inactiveStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), 0);
                normalStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), normal / 2);
                warningStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), normal + warning / 2);
                alertStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), normal + warning + alert / 2);
                rightStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), 100);
              } else {
                leftStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), 0);
                inactiveStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, inactiveMood), inactive / 2);
                normalStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, primaryMood), inactive + normal / 2);
                warningStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, warningMood), inactive + normal + warning / 2);
                alertStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), inactive + normal + warning + alert / 2);
                rightStop = style.ColorStop.create(beamView.getLook(theme.Look.accentColor, alertMood), 100);
              }
            }
          }
        }
        const gradient = style.LinearGradient.create("right", leftStop, inactiveStop, normalStop, warningStop, alertStop, rightStop);
        beamView.backgroundImage(gradient, beamView.getLook(theme.Look.timing, theme.Mood.ambient));
      }
    }
    static get leftListLayout() {
      return table.TableLayout.create([ table.ColLayout.create("icon", 0, 0, 70, false, true), table.ColLayout.create("title", 1, 0, 0, false, false, theme.Look.color) ]);
    }
    static get brandIcon() {
      return graphics.VectorIcon.create(44, 44, "M0,0H64V64H0Z M5,5V59H59V5Z M44,38.78V46L25,29.55V46H20V18Z M39,25V18H44V29.33Z");
    }
    static get settingsIcon() {
      return graphics.VectorIcon.create(20, 20, "M17.7,11C17.7,10.7,17.7,10.3,17.7,10C17.7,9.7,17.7,9.3,17.6,9L19.8,7.4C20,7.2,20.1,7,19.9,6.7L17.9,3.3C17.8,3,17.5,3,17.3,3L14.7,4C14.2,3.6,13.6,3.3,13,3.1L12.6,0.4C12.5,0.2,12.3,0,12.1,0L7.9,0C7.7,0,7.5,0.2,7.4,0.4L7.1,3.1C6.4,3.3,5.8,3.7,5.3,4L2.8,3C2.5,3,2.3,3,2.1,3.3L0.1,6.7C-0.1,7,0,7.2,0.2,7.4L2.4,9C2.3,9.3,2.3,9.7,2.3,10C2.3,10.3,2.3,10.7,2.4,11L0.2,12.6C0,12.8,-0.1,13.1,0.1,13.3L2.1,16.7C2.2,16.9,2.5,17,2.7,16.9L5.3,15.9C5.8,16.4,6.4,16.7,7,16.9L7.4,19.6C7.5,19.8,7.7,20,7.9,20L12.1,20C12.3,20,12.5,19.8,12.6,19.6L12.9,16.9C13.6,16.7,14.2,16.3,14.7,15.9L17.2,16.9C17.5,17,17.7,16.9,17.9,16.7L19.9,13.3C20.1,13,20,12.8,19.8,12.6L17.7,11L17.7,11ZM10,13.8C7.9,13.8,6.1,12.1,6.1,10C6.1,7.9,7.9,6.3,10,6.3C12.1,6.3,13.9,7.9,13.9,10C13.9,12.1,12.1,13.8,10,13.8Z");
    }
    static get inventoryIcon() {
      return graphics.VectorIcon.create(24, 24, "M20,2L4,2C3,2,2,2.9,2,4L2,7C2,7.7,2.4,8.3,3,8.7L3,20C3,21.1,4.1,22,5,22L19,22C19.9,22,21,21.1,21,20L21,8.7C21.6,8.3,22,7.7,22,7L22,4C22,2.9,21,2,20,2ZM15,14L9,14L9,12L15,12L15,14ZM20,7L4,7L4,4L20,4L20,7Z");
    }
  }
  ShellController.MountFlags = controller.Controller.MountFlags | controller.Controller.NeedsRevise;
  __decorate([ component.Property({
    type: Boolean,
    value: false
  }) ], ShellController.prototype, "fullBleed", void 0);
  __decorate([ view.ViewRef({
    type: ShellView,
    initView(rootView) {
      this.owner.beam.setView(rootView.beam.view);
      this.owner.surface.setView(rootView.surface.view);
      this.owner.topLeftBar.setView(rootView.topLeftBar.view);
      this.owner.topRightBar.setView(rootView.topRightBar.view);
      this.owner.searchBar.setView(rootView.searchBar.view);
      this.owner.search.setView(rootView.search.view);
      this.owner.brand.setView(rootView.brand.view);
      this.owner.rightPanel.setView(rootView.rightPanel.view);
      this.owner.leftDrawer.setView(rootView.leftDrawer.view);
      this.owner.leftDrawerButton.setView(rootView.leftDrawerButton.view);
      this.owner.rightDrawer.setView(rootView.rightDrawer.view);
      this.owner.activityWindow.setView(rootView.activityWindow.view);
    }
  }) ], ShellController.prototype, "root", void 0);
  __decorate([ view.ViewRef({
    type: BeamView,
    initView(beamView) {
      const statusTrait = this.owner.status.trait;
      if (statusTrait !== null) {
        this.owner.applyStatus(statusTrait.statusVector);
      }
    }
  }) ], ShellController.prototype, "beam", void 0);
  __decorate([ view.ViewRef({
    type: SurfaceView,
    observes: true,
    initView(surfaceView) {
      const reflectorController = this.owner.reflector.controller;
      if (reflectorController !== null) {
        reflectorController.surface.setView(surfaceView);
      }
    },
    viewDidSetFullBleed(fullBleed, surfaceView) {
      this.owner.fullBleed.setValue(fullBleed, component.Affinity.Intrinsic);
    }
  }) ], ShellController.prototype, "surface", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView
  }) ], ShellController.prototype, "topLeftBar", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView,
    initView(topRightBar) {
      this.owner.inventoryButton.insertView(topRightBar);
      const reflectorController = this.owner.reflector.controller;
      if (reflectorController !== null) {
        reflectorController.toolbar.setView(topRightBar);
      }
    }
  }) ], ShellController.prototype, "topRightBar", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView
  }) ], ShellController.prototype, "searchBar", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView,
    initView(searchView) {
      const collectorController = this.owner.collector.controller;
      if (collectorController !== null) {
        collectorController.search.setView(searchView);
      }
    }
  }) ], ShellController.prototype, "search", void 0);
  __decorate([ view.ViewRef({
    type: graphics.HtmlIconView,
    initView(brandView) {
      brandView.graphics.setState(this.owner.brandIcon, component.Affinity.Intrinsic);
    }
  }) ], ShellController.prototype, "brand", void 0);
  __decorate([ view.ViewRef({
    type: window.DrawerView,
    initView(rightPanelView) {
      const magnifierController = this.owner.magnifier.controller;
      if (magnifierController !== null) {
        magnifierController.panel.setView(rightPanelView);
      }
    }
  }) ], ShellController.prototype, "rightPanel", void 0);
  __decorate([ view.ViewRef({
    type: window.DrawerView,
    initView(leftDrawerView) {
      this.owner.brandItem.insertView(leftDrawerView);
      this.owner.mirrorList.insertView(leftDrawerView);
      this.owner.domainList.insertView(leftDrawerView);
      this.owner.settingsItem.insertView(leftDrawerView);
    }
  }) ], ShellController.prototype, "leftDrawer", void 0);
  __decorate([ view.ViewRef({
    type: window.DrawerButton
  }) ], ShellController.prototype, "leftDrawerButton", void 0);
  __decorate([ view.ViewRef({
    type: window.DrawerView,
    initView(rightDrawerView) {
      const reflectorController = this.owner.reflector.controller;
      if (reflectorController !== null) {
        reflectorController.drawer.setView(rightDrawerView);
      }
    }
  }) ], ShellController.prototype, "rightDrawer", void 0);
  __decorate([ view.ViewRef({
    type: button.IconButton,
    observes: true,
    initView(inventoryButton) {
      inventoryButton.flexShrink.setState(0, component.Affinity.Intrinsic);
      inventoryButton.height.setState(null, component.Affinity.Intrinsic);
      inventoryButton.pointerEvents.setState("auto", component.Affinity.Intrinsic);
      inventoryButton.visibility.setState("hidden", component.Affinity.Intrinsic);
      inventoryButton.iconWidth.setState(32, component.Affinity.Intrinsic);
      inventoryButton.iconHeight.setState(32, component.Affinity.Intrinsic);
      inventoryButton.pushIcon(this.owner.inventoryIcon);
      inventoryButton.constraint(inventoryButton.width.constrain(), "eq", inventoryButton.height);
    },
    buttonDidPress(inventoryButton) {
      const sessionModel = this.owner.session.model;
      const selections = sessionModel !== null ? sessionModel.selectionProvider.service.selections : null;
      if (selections !== null && selections.length !== 0) {
        const entityTrait = selections[selections.length - 1].getTrait(EntityTrait);
        const activityWindow = this.owner.activityWindow.view;
        if (entityTrait !== null && activityWindow !== null) {
          const activityController = this.owner.getActivityController(entityTrait);
          if (activityController !== null) {
            this.owner.activity.setController(activityController);
            activityController.window.setView(activityWindow);
            this.owner.showActivity(activityWindow);
          }
        }
      }
    }
  }) ], ShellController.prototype, "inventoryButton", void 0);
  __decorate([ view.ViewRef({
    type: table.RowView,
    observes: true,
    initView(rowView) {
      rowView.modifyMood(theme.Feel.default, [ [ theme.Feel.unselected, 1 ] ], false);
      rowView.hovers(true).rowHeight(48).layout(ShellController.leftListLayout);
      rowView.getOrCreateCell("icon", table.IconCellView).iconWidth(24, component.Affinity.Intrinsic).iconHeight(24, component.Affinity.Intrinsic).graphics(this.owner.brandIcon, component.Affinity.Intrinsic);
      const rootView = this.owner.root.view;
      rootView.constraint(rowView.rowHeight.constrain(), "eq", rootView.topBarHeight);
    },
    viewDidPressLeaf(input, event, leafView, rowView) {
      const leftDrawerView = this.owner.leftDrawer.view;
      if (leftDrawerView !== null) {
        leftDrawerView.toggle();
      }
    }
  }) ], ShellController.prototype, "brandItem", void 0);
  __decorate([ view.ViewRef({
    type: table.TableView,
    initView(listView) {
      listView.modifyMood(theme.Feel.default, [ [ theme.Feel.unselected, 1 ] ], false);
      listView.flexGrow(1).backgroundColor(null).hovers(true).rowHeight(44).layout(ShellController.leftListLayout);
      const reflectorController = this.owner.reflector.controller;
      if (reflectorController !== null) {
        reflectorController.mirrorList.setView(listView);
      }
    }
  }) ], ShellController.prototype, "mirrorList", void 0);
  __decorate([ view.ViewRef({
    type: table.TableView,
    initView(listView) {
      listView.modifyMood(theme.Feel.default, [ [ theme.Feel.unselected, 1 ] ], false);
      listView.flexGrow(0).backgroundColor(null).hovers(true).rowHeight(44).layout(ShellController.leftListLayout);
      const collectorController = this.owner.collector.controller;
      if (collectorController !== null) {
        collectorController.domainList.setView(listView);
      }
    }
  }) ], ShellController.prototype, "domainList", void 0);
  __decorate([ view.ViewRef({
    type: table.RowView,
    initView(rowView) {
      rowView.modifyMood(theme.Feel.default, [ [ theme.Feel.unselected, 1 ] ], false);
      rowView.hovers(true).rowHeight(48).layout(ShellController.leftListLayout);
      rowView.getOrCreateCell("icon", table.IconCellView).iconWidth(20, component.Affinity.Intrinsic).iconHeight(20, component.Affinity.Intrinsic).graphics(this.owner.settingsIcon, component.Affinity.Intrinsic);
      rowView.getOrCreateCell("title", table.TextCellView).content("Settings");
    }
  }) ], ShellController.prototype, "settingsItem", void 0);
  __decorate([ view.ViewRef({
    type: ActivityWindow,
    observes: true,
    initView(activityWindow) {
      activityWindow.display("none");
    },
    popoverWillShow(activityWindow) {
      activityWindow.display("block");
    },
    popoverDidShow(activityWindow) {
      const surfaceView = this.owner.surface.view;
      if (surfaceView !== null) {
        surfaceView.setCulled(true);
        surfaceView.visibility.setState("hidden", component.Affinity.Intrinsic);
      }
    },
    popoverWillHide(activityWindow) {
      const surfaceView = this.owner.surface.view;
      if (surfaceView !== null) {
        surfaceView.visibility.setState(void 0, component.Affinity.Intrinsic);
        surfaceView.setCulled(false);
      }
    },
    popoverDidHide(activityWindow) {
      activityWindow.display("none");
      const activityController = this.owner.activity.controller;
      if (activityController !== null) {
        activityController.window.setView(null);
        activityController.remove();
      }
    }
  }) ], ShellController.prototype, "activityWindow", void 0);
  __decorate([ controller.ControllerRef({
    key: true,
    type: ReflectorController,
    binds: true,
    initController(reflectorController) {
      const domainGroup = this.owner.domains.model;
      if (domainGroup !== null) {
        reflectorController.domains.setModel(domainGroup);
      }
    }
  }) ], ShellController.prototype, "reflector", void 0);
  __decorate([ controller.ControllerRef({
    key: true,
    type: CollectorController,
    binds: true,
    initController(collectorController) {
      const domainGroup = this.owner.domains.model;
      if (domainGroup !== null) {
        collectorController.domains.setModel(domainGroup);
      }
    }
  }) ], ShellController.prototype, "collector", void 0);
  __decorate([ controller.ControllerRef({
    key: true,
    type: MagnifierController,
    binds: true,
    initController(magnifierController) {
      const rightPanelView = this.owner.rightPanel.view;
      if (rightPanelView !== null) {
        magnifierController.panel.setView(rightPanelView);
      }
      const sessionModel = this.owner.session.model;
      if (sessionModel !== null) {
        magnifierController.session.setModel(sessionModel);
      }
    }
  }) ], ShellController.prototype, "magnifier", void 0);
  __decorate([ controller.ControllerRef({
    key: true,
    type: ActivityController,
    binds: true
  }) ], ShellController.prototype, "activity", void 0);
  __decorate([ model.ModelRef({
    implements: true,
    type: SessionModel,
    initModel(sessionModel) {
      this.owner.domains.setModel(sessionModel.domains.model);
      const statusTrait = sessionModel.getTrait(StatusTrait);
      if (statusTrait !== null) {
        this.owner.status.setTrait(statusTrait);
      }
      const magnifierController = this.owner.magnifier.controller;
      if (magnifierController !== null) {
        magnifierController.session.setModel(sessionModel);
      }
    },
    didAttachModel(sessionModel) {
      const selectionService = sessionModel.selectionProvider.service;
      if (selectionService !== null) {
        selectionService.observe(this);
      }
    },
    willDetachModel(sessionModel) {
      const selectionService = sessionModel.selectionProvider.service;
      if (selectionService !== null) {
        selectionService.unobserve(this);
      }
    },
    serviceDidSelect(model, index, options, selectionService) {
      const inventoryButton = this.owner.inventoryButton.view;
      if (inventoryButton !== null) {
        inventoryButton.visibility.setState("visible", component.Affinity.Intrinsic);
      }
    },
    serviceWillUnselect(model, selectionService) {
      if (selectionService.selections.length === 1) {
        const inventoryButton = this.owner.inventoryButton.view;
        if (inventoryButton !== null) {
          inventoryButton.visibility.setState("hidden", component.Affinity.Intrinsic);
        }
      }
    }
  }) ], ShellController.prototype, "session", void 0);
  __decorate([ model.TraitRef({
    type: StatusTrait,
    observes: true,
    initTrait(statusTrait) {
      this.owner.applyStatus(statusTrait.statusVector);
    },
    traitDidSetStatusVector(newStatusVector, oldStatusVector) {
      this.owner.applyStatus(newStatusVector);
    }
  }) ], ShellController.prototype, "status", void 0);
  __decorate([ model.ModelRef({
    type: DomainGroup,
    initModel(domainGroup) {
      const reflectorController = this.owner.reflector.controller;
      if (reflectorController !== null) {
        reflectorController.domains.setModel(domainGroup);
      }
      const collectorController = this.owner.collector.controller;
      if (collectorController !== null) {
        collectorController.domains.setModel(domainGroup);
      }
    }
  }) ], ShellController.prototype, "domains", void 0);
  __decorate([ component.Provider({
    extends: PrismProvider,
    type: PrismService,
    observes: false,
    service: PrismService.global()
  }) ], ShellController.prototype, "prismProvider", void 0);
  __decorate([ component.Provider({
    extends: controller.HistoryProvider,
    type: controller.HistoryService,
    observes: true,
    service: controller.HistoryService.global(),
    serviceDidPopHistory(historyState) {
      this.owner.updateHistoryState(historyState);
    }
  }) ], ShellController.prototype, "historyProvider", void 0);
  __decorate([ util.Lazy ], ShellController, "leftListLayout", null);
  __decorate([ util.Lazy ], ShellController, "brandIcon", null);
  __decorate([ util.Lazy ], ShellController, "settingsIcon", null);
  __decorate([ util.Lazy ], ShellController, "inventoryIcon", null);
  class PulseTrait extends model.Trait {
    constructor(metaNodeUri) {
      super();
      this.metaNodeUri = metaNodeUri;
      this.fabricIndicators = true;
    }
    didAttachModel(model) {
      this.indicators.insertModel();
      super.didAttachModel(model);
    }
  }
  PulseTrait.PartCountIndicatorType = new IndicatorType("partCount", "Parts");
  PulseTrait.HostCountIndicatorType = new IndicatorType("hostCount", "Hosts");
  PulseTrait.NodeCountIndicatorType = new IndicatorType("nodeCount", "Nodes");
  PulseTrait.AgentCountIndicatorType = new IndicatorType("agentCount", "Agents");
  PulseTrait.LinkCountIndicatorType = new IndicatorType("linkCount", "Links");
  PulseTrait.MessageRateIndicatorType = new IndicatorType("messageRate", "Messages");
  PulseTrait.ExecRateIndicatorType = new IndicatorType("execRate", "Compute");
  PulseTrait.TimerRateIndicatorType = new IndicatorType("timerRate", "Timers");
  __decorate([ model.ModelRef({
    key: true,
    type: IndicatorGroup,
    observes: true,
    didAttachModel(indicatorGroup) {
      if (indicatorGroup.consuming) {
        this.owner.pulse.consume(this);
      }
    },
    willDetachModel(indicatorGroup) {
      if (indicatorGroup.consuming) {
        this.owner.pulse.unconsume(this);
      }
    },
    modelDidStartConsuming(indicatorGroup) {
      this.owner.pulse.consume(this);
    },
    modelWillStopConsuming(indicatorGroup) {
      this.owner.pulse.unconsume(this);
    },
    createModel() {
      const indicatorGroup = new IndicatorGroup;
      indicatorGroup.setTrait("status", new StatusTrait);
      return indicatorGroup;
    }
  }) ], PulseTrait.prototype, "indicators", void 0);
  __decorate([ model.TraitRef({
    type: ValueIndicatorTrait,
    observes: true,
    formatIndicator(value) {
      return codec.Format.prefix(value);
    },
    createTrait() {
      return new ValueIndicatorTrait(PulseTrait.PartCountIndicatorType);
    }
  }) ], PulseTrait.prototype, "partCountIndicator", void 0);
  __decorate([ model.TraitRef({
    type: ValueIndicatorTrait,
    observes: true,
    formatIndicator(value) {
      return codec.Format.prefix(value);
    },
    createTrait() {
      return new ValueIndicatorTrait(PulseTrait.HostCountIndicatorType);
    }
  }) ], PulseTrait.prototype, "hostCountIndicator", void 0);
  __decorate([ model.TraitRef({
    type: ValueIndicatorTrait,
    observes: true,
    formatIndicator(value) {
      return codec.Format.prefix(value);
    },
    createTrait() {
      return new ValueIndicatorTrait(PulseTrait.NodeCountIndicatorType);
    }
  }) ], PulseTrait.prototype, "nodeCountIndicator", void 0);
  __decorate([ model.TraitRef({
    type: ValueIndicatorTrait,
    observes: true,
    formatIndicator(value) {
      return codec.Format.prefix(value);
    },
    createTrait() {
      return new ValueIndicatorTrait(PulseTrait.AgentCountIndicatorType);
    }
  }) ], PulseTrait.prototype, "agentCountIndicator", void 0);
  __decorate([ model.TraitRef({
    type: ValueIndicatorTrait,
    observes: true,
    formatIndicator(value) {
      return codec.Format.prefix(value);
    },
    createTrait() {
      return new ValueIndicatorTrait(PulseTrait.LinkCountIndicatorType);
    }
  }) ], PulseTrait.prototype, "linkCountIndicator", void 0);
  __decorate([ model.TraitRef({
    type: ValueIndicatorTrait,
    observes: true,
    indicatorDidSetValue(newMessageRate, oldMessageRate, messageRateIndicator) {
      const statusTrait = messageRateIndicator.getTrait(StatusTrait);
      if (statusTrait !== null) {
        const nominalRate = 1e3;
        const warningRate = 5e3;
        const alertRate = 1e4;
        if (newMessageRate < nominalRate) {
          statusTrait.setStatusFactor("message-rate", null);
        } else if (newMessageRate < warningRate) {
          const u = (newMessageRate - nominalRate) / (warningRate - nominalRate);
          statusTrait.setStatusFactor("message-rate", StatusFactor.create("Message Rate", StatusVector.of([ Status.warning, .5 + .5 * u ])));
        } else {
          const u = (Math.min(newMessageRate, alertRate) - warningRate) / (alertRate - warningRate);
          statusTrait.setStatusFactor("message-rate", StatusFactor.create("Message Rate", StatusVector.of([ Status.alert, .5 + .5 * u ])));
        }
      }
    },
    formatIndicator(value) {
      return codec.Format.prefix(value) + "/s";
    },
    createTrait() {
      return new ValueIndicatorTrait(PulseTrait.MessageRateIndicatorType);
    }
  }) ], PulseTrait.prototype, "messageRateIndicator", void 0);
  __decorate([ model.TraitRef({
    type: ValueIndicatorTrait,
    observes: true,
    indicatorDidSetValue(newExecRate, oldExecRate, execRateIndicator) {
      const statusTrait = execRateIndicator.getTrait(StatusTrait);
      if (statusTrait !== null) {
        const nominalRate = .001;
        const warningRate = .01;
        const alertRate = .1;
        if (newExecRate < nominalRate) {
          statusTrait.setStatusFactor("exec-rate", null);
        } else if (newExecRate < warningRate) {
          const u = (newExecRate - nominalRate) / (warningRate - nominalRate);
          statusTrait.setStatusFactor("exec-rate", StatusFactor.create("Exec Rate", StatusVector.of([ Status.warning, .5 + .5 * u ])));
        } else {
          const u = (Math.min(newExecRate, alertRate) - warningRate) / (alertRate - warningRate);
          statusTrait.setStatusFactor("exec-rate", StatusFactor.create("Exec Rate", StatusVector.of([ Status.alert, .5 + .5 * u ])));
        }
      }
    },
    formatIndicator(value) {
      return codec.Format.prefix(value, 0) + "s/s";
    },
    createTrait() {
      return new ValueIndicatorTrait(PulseTrait.ExecRateIndicatorType);
    }
  }) ], PulseTrait.prototype, "execRateIndicator", void 0);
  __decorate([ model.TraitRef({
    type: ValueIndicatorTrait,
    observes: true,
    formatIndicator(value) {
      return codec.Format.prefix(value) + "/s";
    },
    createTrait() {
      return new ValueIndicatorTrait(PulseTrait.TimerRateIndicatorType);
    }
  }) ], PulseTrait.prototype, "timerRateIndicator", void 0);
  __decorate([ client.ValueDownlinkFastener({
    nodeUri() {
      return this.owner.metaNodeUri;
    },
    laneUri: "pulse",
    didSet(value) {
      const indicatorGroup = this.owner.indicators.model;
      if (this.owner.fabricIndicators) {
        const partCount = value.get("partCount").numberValue(void 0);
        if (partCount !== void 0) {
          let partCountIndicator = this.owner.partCountIndicator.trait;
          if (partCountIndicator === null && indicatorGroup !== null && partCount !== 0) {
            const partCountModel = new model.Model;
            partCountIndicator = this.owner.partCountIndicator.insertTrait(partCountModel);
            partCountModel.setTrait("status", new StatusTrait);
            indicatorGroup.appendChild(partCountModel);
          }
          if (partCountIndicator !== null) {
            partCountIndicator.setValue(partCount);
          }
        }
        const hostCount = value.get("hostCount").numberValue(void 0);
        if (hostCount !== void 0) {
          let hostCountIndicator = this.owner.hostCountIndicator.trait;
          if (hostCountIndicator === null && indicatorGroup !== null && hostCount !== 0) {
            const hostCountModel = new model.Model;
            hostCountIndicator = this.owner.hostCountIndicator.insertTrait(hostCountModel);
            hostCountModel.setTrait("status", new StatusTrait);
            indicatorGroup.appendChild(hostCountModel);
          }
          if (hostCountIndicator !== null) {
            hostCountIndicator.setValue(hostCount);
          }
        }
        const nodeCount = value.get("nodeCount").numberValue(void 0);
        if (nodeCount !== void 0) {
          let nodeCountIndicator = this.owner.nodeCountIndicator.trait;
          if (nodeCountIndicator === null && indicatorGroup !== null && nodeCount !== 0) {
            const nodeCountModel = new model.Model;
            nodeCountIndicator = this.owner.nodeCountIndicator.insertTrait(nodeCountModel);
            nodeCountModel.setTrait("status", new StatusTrait);
            indicatorGroup.appendChild(nodeCountModel);
          }
          if (nodeCountIndicator !== null) {
            nodeCountIndicator.setValue(nodeCount);
          }
        }
      }
      const agentCount = value.get("agents").get("agentCount").numberValue(void 0);
      if (agentCount !== void 0) {
        let agentCountIndicator = this.owner.agentCountIndicator.trait;
        if (agentCountIndicator === null && indicatorGroup !== null && agentCount !== 0) {
          const agentCountModel = new model.Model;
          agentCountIndicator = this.owner.agentCountIndicator.insertTrait(agentCountModel);
          agentCountModel.setTrait("status", new StatusTrait);
          indicatorGroup.appendChild(agentCountModel);
        }
        if (agentCountIndicator !== null) {
          agentCountIndicator.setValue(agentCount);
        }
      }
      const downlinks = value.get("downlinks");
      const uplinks = value.get("uplinks");
      if (downlinks.isDefined() || uplinks.isDefined()) {
        const downlinkCount = downlinks.get("linkCount").numberValue(0);
        const uplinkCount = uplinks.get("linkCount").numberValue(0);
        const linkCount = downlinkCount + uplinkCount;
        let linkCountIndicator = this.owner.linkCountIndicator.trait;
        if (linkCountIndicator === null && indicatorGroup !== null && linkCount !== 0) {
          const linkCountModel = new model.Model;
          linkCountIndicator = this.owner.linkCountIndicator.insertTrait(linkCountModel);
          linkCountModel.setTrait("status", new StatusTrait);
          indicatorGroup.appendChild(linkCountModel);
        }
        if (linkCountIndicator !== null) {
          linkCountIndicator.setValue(linkCount);
        }
        const downlinkEventRate = downlinks.get("eventRate").numberValue(0);
        const uplinkEventRate = uplinks.get("eventRate").numberValue(0);
        const eventRate = downlinkEventRate + uplinkEventRate;
        const downlinkCommandRate = downlinks.get("commandRate").numberValue(0);
        const uplinkCommandRate = uplinks.get("commandRate").numberValue(0);
        const commandRate = downlinkCommandRate + uplinkCommandRate;
        const messageRate = eventRate + commandRate;
        let messageRateIndicator = this.owner.messageRateIndicator.trait;
        if (messageRateIndicator === null && indicatorGroup !== null && messageRate !== 0) {
          const messageRateModel = new model.Model;
          messageRateIndicator = this.owner.messageRateIndicator.insertTrait(messageRateModel);
          messageRateModel.setTrait("status", new StatusTrait);
          indicatorGroup.appendChild(messageRateModel);
        }
        if (messageRateIndicator !== null) {
          messageRateIndicator.setValue(messageRate);
        }
      }
      const agents = value.get("agents");
      if (agents.isDefined()) {
        const execRate = agents.get("execRate").numberValue(0) / 1e9;
        let execRateIndicator = this.owner.execRateIndicator.trait;
        if (execRateIndicator === null && indicatorGroup !== null && execRate !== 0) {
          const execRateModel = new model.Model;
          execRateIndicator = this.owner.execRateIndicator.insertTrait(execRateModel);
          execRateModel.setTrait("status", new StatusTrait);
          indicatorGroup.appendChild(execRateModel);
        }
        if (execRateIndicator !== null) {
          execRateIndicator.setValue(execRate);
        }
        const timerRate = agents.get("timerEventRate").numberValue(0);
        let timerRateIndicator = this.owner.timerRateIndicator.trait;
        if (timerRateIndicator === null && indicatorGroup !== null && timerRate !== 0) {
          const timerRateModel = new model.Model;
          timerRateIndicator = this.owner.timerRateIndicator.insertTrait(timerRateModel);
          timerRateModel.setTrait("status", new StatusTrait);
          indicatorGroup.appendChild(timerRateModel);
        }
        if (timerRateIndicator !== null) {
          timerRateIndicator.setValue(timerRate);
        }
      }
    },
    didConnect() {
      const statusTrait = this.owner.getTrait(StatusTrait);
      if (statusTrait !== null) {
        statusTrait.setStatusFactor("disconnected", null);
        statusTrait.setStatusFactor("connected", StatusFactor.create("Connected", StatusVector.of([ Status.normal, 1 ])));
      }
    },
    didDisconnect() {
      const statusTrait = this.owner.getTrait(StatusTrait);
      if (statusTrait !== null) {
        statusTrait.setStatusFactor("connected", null);
        statusTrait.setStatusFactor("disconnected", StatusFactor.create("Disconnected", StatusVector.of([ Status.inactive, 1 ])));
      }
    }
  }) ], PulseTrait.prototype, "pulse", void 0);
  class MetaNodeGroup extends EntityGroup {
    constructor(nodeUri, metaHostUri) {
      super();
      this.nodeUri = nodeUri;
      this.metaHostUri = metaHostUri;
    }
    get nodePath() {
      return this.nodeUri.path;
    }
    createNode(nodeKey, nodeUri, metaNodeUri) {
      const nodeModel = new model.Model;
      const entityTrait = new MetaNodeEntity(nodeUri, metaNodeUri, this.metaHostUri);
      entityTrait.title.setValue(uri.UriPath.parse(nodeKey).foot().head());
      nodeModel.setTrait("entity", entityTrait);
      nodeModel.setTrait("selectable", new model.SelectableTrait);
      nodeModel.setTrait("status", new StatusTrait);
      nodeModel.setTrait("indicated", new IndicatedTrait);
      nodeModel.setTrait("pulse", new PulseTrait(metaNodeUri));
      return nodeModel;
    }
    didUpdateNode(key, value) {
      const nodeKey = key.stringValue("");
      let nodeModel = this.getChild(nodeKey);
      if (nodeModel === null) {
        const metaHostUri = this.metaHostUri;
        const metaHostPath = metaHostUri.path;
        const pathBuilder = uri.UriPath.builder();
        if (metaHostPath.toString() === "meta:mesh") {
          pathBuilder.addSegment("meta:node");
        } else if (metaHostPath.toString() === "meta:node") {
          pathBuilder.addSegment("meta:node");
        } else {
          pathBuilder.addPath(metaHostPath);
          pathBuilder.addSegment("node");
        }
        pathBuilder.addSegment(nodeKey);
        const nodeUri = uri.Uri.parse(nodeKey);
        const metaNodeUri = uri.Uri.create(metaHostUri.scheme, metaHostUri.authority, pathBuilder.bind());
        nodeModel = this.createNode(nodeKey, nodeUri, metaNodeUri);
        if (nodeModel !== null) {
          this.appendChild(nodeModel, nodeKey);
        }
      }
      if (nodeModel !== null) {
        const childCount = value.get("childCount").numberValue(0);
        const entityTrait = nodeModel.getTrait(EntityTrait);
        if (entityTrait !== null) {
          if (childCount !== 0) {
            if (entityTrait.subentities.model === null) {
              entityTrait.subentities.insertModel();
            }
          } else {
            entityTrait.subentities.removeModel();
          }
        }
      }
    }
    didRemoveNode(key) {
      const nodeKey = key.stringValue("");
      this.removeChild(nodeKey);
    }
  }
  __decorate([ client.MapDownlinkFastener({
    consumed: true,
    nodeUri() {
      return this.owner.metaHostUri;
    },
    laneUri() {
      return uri.Uri.create(void 0, void 0, uri.UriPath.segment("nodes"), void 0, uri.UriFragment.create(this.owner.nodePath.toString()));
    },
    didUpdate(key, value) {
      this.owner.didUpdateNode(key, value);
    },
    didRemove(key) {
      this.owner.didRemoveNode(key);
    }
  }) ], MetaNodeGroup.prototype, "nodes", void 0);
  class MetaNodeEntity extends EntityTrait {
    constructor(nodeUri, metaNodeUri, metaHostUri) {
      super(nodeUri);
      this.metaNodeUri = metaNodeUri;
      this.metaHostUri = metaHostUri;
    }
    get nodeUri() {
      return this.uri;
    }
    get nodePath() {
      return this.uri.path;
    }
  }
  __decorate([ model.ModelRef({
    extends: true,
    createModel() {
      let nodePath = this.owner.nodePath;
      if (!nodePath.foot().isAbsolute()) {
        nodePath = nodePath.appendedSlash();
      }
      const nodeUri = uri.Uri.path(nodePath);
      const entityGroup = new MetaNodeGroup(nodeUri, this.owner.metaHostUri);
      entityGroup.setTrait("status", new StatusTrait);
      return entityGroup;
    }
  }) ], MetaNodeEntity.prototype, "subentities", void 0);
  class MetaHostEntity extends EntityTrait {
    constructor(uri) {
      super(uri);
    }
    onAttachModel(model) {
      super.onAttachModel(model);
      this.subentities.insertModel();
    }
  }
  __decorate([ model.ModelRef({
    extends: true,
    createModel() {
      const entityGroup = new MetaNodeGroup(uri.Uri.path(uri.UriPath.slash()), this.owner.uri);
      entityGroup.setTrait("status", new StatusTrait);
      return entityGroup;
    }
  }) ], MetaHostEntity.prototype, "subentities", void 0);
  class MetaHostGroup extends EntityGroup {
    constructor(metaPartUri) {
      super();
      this.metaPartUri = metaPartUri;
    }
    createHost(hostKey, metaHostUri) {
      const hostModel = new model.Model;
      const entityTrait = new MetaHostEntity(metaHostUri);
      if (hostKey === "") {
        entityTrait.title.setValue("Local Host");
      } else {
        entityTrait.title.setValue(hostKey);
      }
      hostModel.setTrait("entity", entityTrait);
      hostModel.setTrait("selectable", new model.SelectableTrait);
      hostModel.setTrait("status", new StatusTrait);
      hostModel.setTrait("indicated", new IndicatedTrait);
      hostModel.setTrait("pulse", new PulseTrait(metaHostUri));
      return hostModel;
    }
    didUpdateHost(key, value) {
      const hostKey = key.stringValue("");
      let hostModel = this.getChild(hostKey);
      if (hostModel === null) {
        const metaPartUri = this.metaPartUri;
        const pathBuilder = uri.UriPath.builder();
        if (metaPartUri.path.toString() === "meta:part") {
          pathBuilder.addSegment("meta:host");
        } else {
          pathBuilder.addPath(metaPartUri.path);
          pathBuilder.addSegment("host");
        }
        if (hostKey !== "") {
          pathBuilder.addSegment(hostKey);
        }
        const metaHostUri = uri.Uri.create(metaPartUri.scheme, metaPartUri.authority, pathBuilder.bind());
        hostModel = this.createHost(hostKey, metaHostUri);
        if (hostModel !== null) {
          this.appendChild(hostModel, hostKey);
        }
      }
    }
    didRemoveHost(key) {
      const hostKey = key.stringValue("");
      this.removeChild(hostKey);
    }
  }
  __decorate([ client.MapDownlinkFastener({
    consumed: true,
    nodeUri() {
      return this.owner.metaPartUri;
    },
    laneUri: "hosts",
    didUpdate(key, value) {
      this.owner.didUpdateHost(key, value);
    },
    didRemove(key) {
      this.owner.didRemoveHost(key);
    }
  }) ], MetaHostGroup.prototype, "hosts", void 0);
  class MetaPartEntity extends EntityTrait {
    constructor(uri) {
      super(uri);
    }
    onAttachModel(model) {
      super.onAttachModel(model);
      this.subentities.insertModel();
    }
  }
  __decorate([ model.ModelRef({
    extends: true,
    createModel() {
      const entityGroup = new MetaHostGroup(this.owner.uri);
      entityGroup.setTrait("status", new StatusTrait);
      return entityGroup;
    }
  }) ], MetaPartEntity.prototype, "subentities", void 0);
  class MetaPartGroup extends EntityGroup {
    constructor(metaMeshUri) {
      super();
      this.metaMeshUri = metaMeshUri;
    }
    createPart(partKey, metaPartUri) {
      const partModel = new model.Model;
      const entityTrait = new MetaPartEntity(metaPartUri);
      if (partKey === "") {
        entityTrait.title.setValue("Default Part");
      } else {
        entityTrait.title.setValue(partKey);
      }
      partModel.setTrait("entity", entityTrait);
      partModel.setTrait("selectable", new model.SelectableTrait);
      partModel.setTrait("status", new StatusTrait);
      partModel.setTrait("indicated", new IndicatedTrait);
      partModel.setTrait("pulse", new PulseTrait(metaPartUri));
      return partModel;
    }
    didUpdatePart(key, value) {
      const partKey = key.stringValue("");
      let partModel = this.getChild(partKey);
      if (partModel === null) {
        const metaMeshUri = this.metaMeshUri;
        const pathBuilder = uri.UriPath.builder();
        if (metaMeshUri.path.toString() === "meta:mesh") {
          pathBuilder.addSegment("meta:part");
        } else {
          pathBuilder.addPath(metaMeshUri.path);
          pathBuilder.addSegment("part");
        }
        if (partKey !== "") {
          pathBuilder.addSegment(partKey);
        }
        const metaPartUri = uri.Uri.create(metaMeshUri.scheme, metaMeshUri.authority, pathBuilder.bind());
        partModel = this.createPart(partKey, metaPartUri);
        if (partModel !== null) {
          this.appendChild(partModel, partKey);
        }
      }
    }
    didRemovePart(key) {
      const partKey = key.stringValue("");
      this.removeChild(partKey);
    }
  }
  __decorate([ client.MapDownlinkFastener({
    consumed: true,
    nodeUri() {
      return this.owner.metaMeshUri;
    },
    laneUri: "parts",
    didUpdate(key, value) {
      this.owner.didUpdatePart(key, value);
    },
    didRemove(key) {
      this.owner.didRemovePart(key);
    }
  }) ], MetaPartGroup.prototype, "parts", void 0);
  class MetaMeshEntity extends EntityTrait {
    constructor(uri) {
      super(uri);
    }
    onAttachModel(model) {
      super.onAttachModel(model);
      this.subentities.insertModel();
    }
  }
  __decorate([ model.ModelRef({
    extends: true,
    createModel() {
      const entityGroup = new MetaPartGroup(this.owner.uri);
      entityGroup.setTrait("status", new StatusTrait);
      return entityGroup;
    }
  }) ], MetaMeshEntity.prototype, "subentities", void 0);
  class MetaMeshGroup extends EntityGroup {
    constructor(metaEdgeUri) {
      super();
      this.metaEdgeUri = metaEdgeUri;
    }
    createMesh(meshKey, metaMeshUri) {
      const meshModel = new model.Model;
      const entityTrait = new MetaMeshEntity(metaMeshUri);
      if (meshKey === "") {
        entityTrait.title.setValue("Default Mesh");
      } else {
        entityTrait.title.setValue(meshKey);
      }
      meshModel.setTrait("entity", entityTrait);
      meshModel.setTrait("selectable", new model.SelectableTrait);
      meshModel.setTrait("status", new StatusTrait);
      meshModel.setTrait("indicated", new IndicatedTrait);
      meshModel.setTrait("pulse", new PulseTrait(metaMeshUri));
      return meshModel;
    }
    didUpdateMesh(key, value) {
      const meshKey = key.stringValue("");
      let meshModel = this.getChild(meshKey);
      if (meshModel === null) {
        const metaEdgeUri = this.metaEdgeUri;
        const pathBuilder = uri.UriPath.builder();
        if (metaEdgeUri.path.toString() === "meta:edge") {
          pathBuilder.addSegment("meta:mesh");
        } else {
          pathBuilder.addPath(metaEdgeUri.path);
          pathBuilder.addSegment("mesh");
        }
        if (meshKey !== "") {
          pathBuilder.addSegment(meshKey);
        }
        const metaMeshUri = uri.Uri.create(metaEdgeUri.scheme, metaEdgeUri.authority, pathBuilder.bind());
        meshModel = this.createMesh(meshKey, metaMeshUri);
        if (meshModel !== null) {
          this.appendChild(meshModel, meshKey);
        }
      }
    }
    didRemoveMesh(key) {
      const meshKey = key.stringValue("");
      this.removeChild(meshKey);
    }
  }
  __decorate([ client.MapDownlinkFastener({
    consumed: true,
    nodeUri() {
      return this.owner.metaEdgeUri;
    },
    laneUri: "meshes",
    didUpdate(key, value) {
      this.owner.didUpdateMesh(key, value);
    },
    didRemove(key) {
      this.owner.didRemoveMesh(key);
    }
  }) ], MetaMeshGroup.prototype, "meshes", void 0);
  class MetaEdgeEntity extends EntityTrait {
    constructor(uri) {
      super(uri);
    }
    onAttachModel(model) {
      super.onAttachModel(model);
      this.subentities.insertModel();
    }
  }
  __decorate([ model.ModelRef({
    extends: true,
    createModel() {
      const entityGroup = new MetaMeshGroup(this.owner.uri);
      entityGroup.setTrait("status", new StatusTrait);
      return entityGroup;
    }
  }) ], MetaEdgeEntity.prototype, "subentities", void 0);
  class AgentsEntity extends EntityTrait {
    constructor(uri) {
      super(uri);
      this.title.setValue("Agents");
    }
    onAttachModel(model) {
      super.onAttachModel(model);
      this.subentities.insertModel();
    }
  }
  __decorate([ model.ModelRef({
    extends: true,
    createModel() {
      const entityGroup = new MetaNodeGroup(uri.Uri.path(uri.UriPath.slash()), this.owner.uri);
      entityGroup.setTrait("status", new StatusTrait);
      return entityGroup;
    }
  }) ], AgentsEntity.prototype, "subentities", void 0);
  class FabricGroup extends EntityGroup {
    constructor() {
      super();
      this.isSorted(false);
      this.initGroup();
    }
    initGroup() {
      this.mesh.insertModel();
      this.edge.insertModel();
    }
  }
  __decorate([ model.ModelRef({
    key: true,
    type: model.Model,
    binds: true,
    createModel() {
      const metaMeshUri = uri.Uri.parse("swim:meta:mesh");
      const meshModel = new model.Model;
      const entityTrait = new MetaMeshEntity(metaMeshUri);
      entityTrait.title.setValue("Partitions");
      meshModel.setTrait("entity", entityTrait);
      meshModel.setTrait("selectable", new model.SelectableTrait);
      meshModel.setTrait("status", new StatusTrait);
      meshModel.setTrait("indicated", new IndicatedTrait);
      meshModel.setTrait("pulse", new PulseTrait(metaMeshUri));
      return meshModel;
    }
  }) ], FabricGroup.prototype, "mesh", void 0);
  __decorate([ model.ModelRef({
    key: true,
    type: model.Model,
    binds: true,
    createModel() {
      const metaEdgeUri = uri.Uri.parse("swim:meta:edge");
      const edgeModel = new model.Model;
      const entityTrait = new MetaEdgeEntity(metaEdgeUri);
      entityTrait.title.setValue("Connections");
      edgeModel.setTrait("entity", entityTrait);
      edgeModel.setTrait("selectable", new model.SelectableTrait);
      edgeModel.setTrait("status", new StatusTrait);
      edgeModel.setTrait("indicated", new IndicatedTrait);
      edgeModel.setTrait("pulse", new PulseTrait(metaEdgeUri));
      return edgeModel;
    }
  }) ], FabricGroup.prototype, "edge", void 0);
  class FabricEntity extends EntityTrait {
    constructor(uri) {
      super(uri);
    }
    onAttachModel(model) {
      super.onAttachModel(model);
      this.subentities.insertModel();
    }
  }
  __decorate([ model.ModelRef({
    extends: true,
    createModel() {
      const entityGroup = new FabricGroup;
      entityGroup.setTrait("status", new StatusTrait);
      return entityGroup;
    }
  }) ], FabricEntity.prototype, "subentities", void 0);
  class PlaneGroup extends EntityGroup {
    constructor() {
      super();
      this.isSorted(false);
      this.initGroup();
    }
    initGroup() {
      this.agents.insertModel();
      this.fabric.insertModel();
    }
  }
  __decorate([ model.ModelRef({
    key: true,
    type: model.Model,
    binds: true,
    createModel() {
      const metaAgentsUri = uri.Uri.parse("swim:meta:mesh");
      const agentsModel = new model.Model;
      const entityTrait = new AgentsEntity(metaAgentsUri);
      entityTrait.title.setValue("Agents");
      agentsModel.setTrait("entity", entityTrait);
      agentsModel.setTrait("selectable", new model.SelectableTrait);
      agentsModel.setTrait("status", new StatusTrait);
      agentsModel.setTrait("indicated", new IndicatedTrait);
      agentsModel.setTrait("pulse", new PulseTrait(metaAgentsUri));
      return agentsModel;
    }
  }) ], PlaneGroup.prototype, "agents", void 0);
  __decorate([ model.ModelRef({
    key: true,
    type: model.Model,
    binds: true,
    createModel() {
      const metaEdgeUri = uri.Uri.parse("swim:meta:edge");
      const fabricModel = new model.Model;
      const entityTrait = new FabricEntity(metaEdgeUri);
      entityTrait.title.setValue("Fabric");
      fabricModel.setTrait("entity", entityTrait);
      fabricModel.setTrait("selectable", new model.SelectableTrait);
      fabricModel.setTrait("status", new StatusTrait);
      fabricModel.setTrait("indicated", new IndicatedTrait);
      fabricModel.setTrait("pulse", new PulseTrait(metaEdgeUri));
      return fabricModel;
    }
  }) ], PlaneGroup.prototype, "fabric", void 0);
  class PlaneEntity extends EntityTrait {
    constructor(hostUri) {
      super(hostUri);
    }
    onAttachModel(model) {
      super.onAttachModel(model);
      if (model.warpRef.hasAffinity(component.Affinity.Intrinsic)) {
        let warpRef = model.warpRef.superValue;
        if (warpRef === void 0 || warpRef === null) {
          warpRef = model.warpProvider.service.client;
        }
        warpRef = warpRef.hostRef(this.uri);
        model.warpRef.setValue(warpRef, component.Affinity.Intrinsic);
      }
      this.subentities.insertModel();
    }
  }
  __decorate([ model.ModelRef({
    extends: true,
    createModel() {
      const entityGroup = new PlaneGroup;
      entityGroup.setTrait("status", new StatusTrait);
      return entityGroup;
    }
  }) ], PlaneEntity.prototype, "subentities", void 0);
  class NodeGroup extends EntityGroup {
    constructor(metaHostUri) {
      super();
      if (metaHostUri === void 0) {
        metaHostUri = NodeGroup.metaHostUri;
      }
      this.metaHostUri = metaHostUri;
    }
    initNodeModel(nodeModel) {}
    createNodeModel(nodePath, nodeUri, metaNodeUri) {
      nodePath = uri.UriPath.fromAny(nodePath);
      const metaHostUri = this.metaHostUri;
      if (metaNodeUri === void 0) {
        const metaHostPath = metaHostUri.path;
        const pathBuilder = uri.UriPath.builder();
        if (metaHostPath.toString() === "meta:host" || metaHostPath.toString() === "meta:node") {
          pathBuilder.addSegment("meta:node");
        } else {
          pathBuilder.addPath(metaHostPath);
          pathBuilder.addSegment("node");
        }
        pathBuilder.addSegment(nodePath.toString());
        metaNodeUri = uri.Uri.create(metaHostUri.scheme, metaHostUri.authority, pathBuilder.bind());
      }
      if (nodeUri === void 0) {
        nodeUri = uri.Uri.path(nodePath);
      }
      const nodeModel = new model.Model;
      const entityTrait = new MetaNodeEntity(nodeUri, metaNodeUri, metaHostUri);
      entityTrait.title.setValue(nodeUri.path.foot().head());
      nodeModel.setTrait("entity", entityTrait);
      this.initNodeTraits(nodeModel, nodeUri, metaNodeUri);
      return nodeModel;
    }
    initNodeTraits(nodeModel, nodeUri, metaNodeUri) {
      nodeModel.setTrait("selectable", new model.SelectableTrait);
      nodeModel.setTrait("status", new StatusTrait);
      nodeModel.setTrait("indicated", new IndicatedTrait);
      nodeModel.setTrait("pulse", new PulseTrait(metaNodeUri));
    }
    getOrCreateNodeModel(nodePath) {
      if (typeof nodePath !== "string") {
        nodePath = uri.UriPath.fromAny(nodePath).toString();
      }
      let nodeModel = this.getChild(nodePath);
      if (nodeModel === null) {
        nodeModel = this.createNodeModel(nodePath);
        this.initNodeModel(nodeModel);
        this.appendChild(nodeModel, nodePath);
      }
      return nodeModel;
    }
    removeNodeModel(nodePath) {
      if (typeof nodePath !== "string") {
        nodePath = uri.UriPath.fromAny(nodePath).toString();
      }
      this.removeChild(nodePath);
    }
    static get metaHostUri() {
      return uri.Uri.parse("swim:meta:node");
    }
  }
  __decorate([ util.Lazy ], NodeGroup, "metaHostUri", null);
  class DownlinkNodeGroup extends NodeGroup {
    constructor(metaHostUri) {
      super(metaHostUri);
    }
    getNodePath(key, value) {
      return key.stringValue("");
    }
    updateNodeModel(nodeModel, value) {}
    didUpdateNode(key, value) {
      const nodePath = this.getNodePath(key, value);
      const nodeModel = this.getOrCreateNodeModel(nodePath);
      this.updateNodeModel(nodeModel, value);
    }
    didRemoveNode(key, value) {
      const nodePath = this.getNodePath(key, value);
      this.removeNodeModel(nodePath);
    }
  }
  __decorate([ client.MapDownlinkFastener({
    consumed: true,
    didUpdate(key, value) {
      if (this.owner.consuming) {
        this.owner.didUpdateNode(key, value);
      }
    },
    didRemove(key, value) {
      if (this.owner.consuming) {
        this.owner.didRemoveNode(key, value);
      }
    }
  }) ], DownlinkNodeGroup.prototype, "downlink", void 0);
  class FabricPlugin extends DomainPlugin {
    get id() {
      return "fabric";
    }
    get title() {
      return "Fabric";
    }
    createDomain(hostUri) {
      hostUri = uri.Uri.fromAny(hostUri);
      const nodeUri = uri.Uri.parse("swim:meta:edge");
      const planeModel = new model.Model;
      const domainTrait = new DomainTrait;
      planeModel.setTrait("domain", domainTrait);
      const entityTrait = new PlaneEntity(hostUri);
      entityTrait.title.setValue(hostUri.authority.withUser(uri.UriUser.undefined()).toString());
      planeModel.setTrait("entity", entityTrait);
      planeModel.setTrait("selectable", new model.SelectableTrait);
      planeModel.setTrait("status", new StatusTrait);
      planeModel.setTrait("indicated", new IndicatedTrait);
      const pulseTrait = new PulseTrait(nodeUri);
      pulseTrait.fabricIndicators = false;
      planeModel.setTrait("pulse", pulseTrait);
      return domainTrait;
    }
    queryDomain(query) {
      try {
        let hostUri;
        try {
          const authority = uri.UriAuthority.parse(query);
          hostUri = uri.Uri.create(uri.UriScheme.create("warps"), authority);
        } catch (e) {
          hostUri = uri.Uri.parse(query);
        }
        return this.createDomain(hostUri);
      } catch (swallow) {
        return null;
      }
    }
  }
  class PortalController extends MirrorController {
    isFullBleed() {
      return false;
    }
    onInsertDomain(childDomain, targetDomain) {}
    onRemoveDomain(childDomain) {}
  }
  __decorate([ view.ViewRef({
    type: SurfaceView
  }) ], PortalController.prototype, "surface", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView
  }) ], PortalController.prototype, "toolbar", void 0);
  __decorate([ view.ViewRef({
    type: window.DrawerView
  }) ], PortalController.prototype, "drawer", void 0);
  __decorate([ model.ModelRef({
    type: DomainGroup,
    observes: true,
    didAttachModel(domainGroup) {
      let domainModel = domainGroup.firstChild;
      while (domainModel !== null) {
        const domainTrait = domainModel.getTrait(DomainTrait);
        if (domainTrait !== null) {
          this.owner.onInsertDomain(domainTrait, null);
        }
        domainModel = domainModel.nextSibling;
      }
    },
    modelDidInsertChild(child, target) {
      const childDomainTrait = child.getTrait(DomainTrait);
      if (childDomainTrait !== null) {
        const targetDomainTrait = target !== null ? target.getTrait(DomainTrait) : null;
        this.owner.onInsertDomain(childDomainTrait, targetDomainTrait);
      }
    },
    modelWillRemoveChild(child) {
      const childDomainTrait = child.getTrait(DomainTrait);
      if (childDomainTrait !== null) {
        this.owner.onRemoveDomain(childDomainTrait);
      }
    }
  }) ], PortalController.prototype, "domains", void 0);
  class PortalPlugin extends MirrorPlugin {
    get id() {
      return "portal";
    }
    get title() {
      return "Portal";
    }
    get icon() {
      return PortalPlugin.icon;
    }
    createController() {
      return new PortalController;
    }
    static get icon() {
      return graphics.VectorIcon.create(24, 24, "M3,13L21,13L21,3L3,3L3,13ZM3,21L11,21L11,15L3,15L3,21ZM13,21L21,21L21,15L13,15L13,21Z");
    }
  }
  __decorate([ util.Lazy ], PortalPlugin, "icon", null);
  class CatalogIndicatorCell extends controller.Controller {
    startConsumingIndicator() {
      const indicatorTrait = this.indicator.trait;
      if (indicatorTrait !== null) {
        indicatorTrait.consume(this);
        const indicatorModel = indicatorTrait.model;
        if (indicatorModel !== null) {
          indicatorModel.consume(this);
        }
      }
    }
    stopConsumingIndicator() {
      const indicatorTrait = this.indicator.trait;
      if (indicatorTrait !== null) {
        indicatorTrait.unconsume(this);
        const indicatorModel = indicatorTrait.model;
        if (indicatorModel !== null) {
          indicatorModel.unconsume(this);
        }
      }
    }
    applyStatus(statusVector) {
      const treeCell = this.cell.view;
      if (treeCell !== null) {
        const alert = statusVector.get(Status.alert) || 0;
        const warning = statusVector.get(Status.warning) || 0;
        const inactive = statusVector.get(Status.inactive) || 0;
        if (alert !== 0 && warning !== 0) {
          treeCell.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, alert ] ]);
        } else if (alert !== 0) {
          treeCell.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, 1 ], [ theme.Feel.alert, alert ] ]);
        } else if (warning !== 0) {
          treeCell.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, 0 ] ]);
        } else {
          treeCell.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, 0 ], [ theme.Feel.alert, 0 ] ]);
        }
        if (inactive !== 0) {
          treeCell.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, inactive ] ]);
        } else {
          treeCell.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, 0 ] ]);
        }
      }
    }
  }
  __decorate([ view.ViewRef({
    type: table.TextCellView,
    observes: true,
    initView(treeCell) {
      treeCell.color.setLook(theme.Look.statusColor, component.Affinity.Intrinsic);
      const indicatorTrait = this.owner.indicator.trait;
      if (indicatorTrait instanceof ValueIndicatorTrait) {
        treeCell.content(indicatorTrait.formattedValue);
        const statusTrait = indicatorTrait.getTrait(StatusTrait);
        if (statusTrait !== null) {
          this.owner.applyStatus(statusTrait.statusVector);
        }
      }
    },
    viewDidMount(treeCell) {
      if (!treeCell.culled) {
        this.owner.startConsumingIndicator();
      }
    },
    viewWillUnmount(treeCell) {
      this.owner.stopConsumingIndicator();
    },
    viewDidCull(treeCell) {
      this.owner.stopConsumingIndicator();
    },
    viewWillUncull(treeCell) {
      this.owner.startConsumingIndicator();
    }
  }) ], CatalogIndicatorCell.prototype, "cell", void 0);
  __decorate([ model.TraitRef({
    implements: true,
    type: IndicatorTrait,
    observes: true,
    initTrait(indicatorTrait) {
      const treeCell = this.owner.cell.view;
      if (treeCell !== null && indicatorTrait instanceof ValueIndicatorTrait) {
        treeCell.content(indicatorTrait.formattedValue);
      }
      const statusTrait = indicatorTrait.getTrait(StatusTrait);
      if (statusTrait !== null) {
        this.owner.status.setTrait(statusTrait);
      }
    },
    indicatorDidSetValue(newValue, oldValue, indicatorTrait) {
      const treeCell = this.owner.cell.view;
      if (treeCell !== null && indicatorTrait instanceof ValueIndicatorTrait) {
        treeCell.content(indicatorTrait.formattedValue);
      }
    }
  }) ], CatalogIndicatorCell.prototype, "indicator", void 0);
  __decorate([ model.TraitRef({
    type: StatusTrait,
    observes: true,
    initTrait(statusTrait) {
      this.owner.applyStatus(statusTrait.statusVector);
    },
    traitDidSetStatusVector(newStatusVector, oldStatusVector) {
      this.owner.applyStatus(newStatusVector);
    }
  }) ], CatalogIndicatorCell.prototype, "status", void 0);
  class CatalogEntityLimb extends controller.Controller {
    startConsumingSubentities() {
      const entityGroup = this.subentities.model;
      if (entityGroup !== null) {
        entityGroup.consume(this);
      }
    }
    stopConsumingSubentities() {
      const entityGroup = this.subentities.model;
      if (entityGroup !== null) {
        entityGroup.unconsume(this);
      }
    }
    startConsumingIndicators() {
      const indicatorGroup = this.indicators.model;
      if (indicatorGroup !== null) {
        indicatorGroup.consume(this);
      }
    }
    stopConsumingIndicators() {
      const indicatorGroup = this.indicators.model;
      if (indicatorGroup !== null) {
        indicatorGroup.unconsume(this);
      }
    }
    onMountLimb(rowView) {
      if (rowView.disclosure.expanded) {
        this.startConsumingSubentities();
        const entityTree = this.subtree.controller;
        if (entityTree !== null) {
          entityTree.tree.insertView(rowView);
        }
      }
    }
    onUnmountLimb(rowView) {
      this.stopConsumingSubentities();
      const entityTree = this.subtree.controller;
      if (entityTree !== null) {
        entityTree.tree.removeView();
      }
    }
    onExpandLimb(rowView) {
      if (rowView.mounted) {
        this.startConsumingSubentities();
        const entityTree = this.subtree.controller;
        if (entityTree !== null) {
          entityTree.tree.insertView(rowView);
        }
      }
    }
    onCollapseLimb(rowView) {
      this.stopConsumingSubentities();
      const entityTree = this.subtree.controller;
      if (entityTree !== null) {
        entityTree.tree.removeView();
      }
    }
    onInsertIndicatorCell(indicatorCell) {
      const treeLeaf = this.leaf.view;
      if (treeLeaf !== null) {
        const treeCell = indicatorCell.cell.createView();
        if (treeCell !== null) {
          const targetLens = indicatorCell.nextSibling;
          const targetView = targetLens instanceof CatalogIndicatorCell ? targetLens.cell.view : null;
          const id = indicatorCell.indicator.trait.indicatorType.key;
          treeLeaf.insertChild(treeCell, targetView, id);
          indicatorCell.cell.setView(treeCell);
        }
      }
    }
    onRemoveIndicatorCell(indicatorCell) {
      const treeCell = indicatorCell.cell.view;
      if (treeCell !== null) {
        treeCell.remove();
      }
    }
    applyStatus(statusVector) {
      const treeLeaf = this.leaf.view;
      if (treeLeaf !== null) {
        const alert = statusVector.get(Status.alert) || 0;
        const warning = statusVector.get(Status.warning) || 0;
        const inactive = statusVector.get(Status.inactive) || 0;
        if (alert !== 0 && warning !== 0) {
          treeLeaf.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, alert ] ]);
        } else if (alert !== 0) {
          treeLeaf.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, 1 ], [ theme.Feel.alert, alert ] ]);
        } else if (warning !== 0) {
          treeLeaf.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, void 0 ] ]);
        } else {
          treeLeaf.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, void 0 ], [ theme.Feel.alert, void 0 ] ]);
        }
        if (inactive !== 0) {
          treeLeaf.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, inactive ] ]);
        } else {
          treeLeaf.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, void 0 ] ]);
        }
      }
    }
    onInsertIndicator(childIndicator, targetIndicator) {
      const key = childIndicator.indicatorType.key;
      let controllerRef = this.getFastener(key, controller.ControllerRef);
      if (controllerRef === null) {
        controllerRef = CatalogEntityLimb.IndicatorFastener.create(this);
        Object.defineProperty(controllerRef, "key", {
          value: key,
          enumerable: true,
          configurable: true
        });
        this.setFastener(key, controllerRef);
        const indicatorCell = new CatalogIndicatorCell;
        indicatorCell.indicator.setTrait(childIndicator);
        controllerRef.setController(indicatorCell);
        const targetController = targetIndicator !== null ? this.getChild(targetIndicator.indicatorType.key) : null;
        this.insertChild(indicatorCell, targetController, key);
      }
    }
    onRemoveIndicator(childIndicator) {
      const key = childIndicator.indicatorType.key;
      const controllerRef = this.getFastener(key, controller.ControllerRef);
      if (controllerRef !== null) {
        controllerRef.deleteController();
        this.setFastener(key, null);
      }
    }
  }
  CatalogEntityLimb.IndicatorFastener = controller.ControllerRef.define("IndicatorFastener", {
    type: CatalogIndicatorCell,
    didAttachController(indicatorCell) {
      this.owner.onInsertIndicatorCell(indicatorCell);
    },
    willDetachController(indicatorCell) {
      this.owner.onRemoveIndicatorCell(indicatorCell);
    }
  });
  __decorate([ view.ViewRef({
    type: table.RowView,
    observes: true,
    initView(rowView) {
      this.owner.leaf.insertView(rowView);
      rowView.head.insertView();
      rowView.foot.insertView();
      const entityGroup = this.owner.subentities.model;
      if (entityGroup !== null) {
        const entityTree = this.owner.subtree.insertController();
        if (entityTree !== null) {
          if (rowView.disclosure.expanded) {
            entityTree.tree.insertView(rowView);
          }
          entityTree.entities.setModel(entityGroup);
        }
      }
    },
    didAttachView(rowView) {
      if (rowView.mounted) {
        this.owner.onMountLimb(rowView);
      }
    },
    viewDidMount(rowView) {
      this.owner.onMountLimb(rowView);
    },
    viewWillUnmount(rowView) {
      this.owner.onUnmountLimb(rowView);
    },
    viewWillExpand(rowView) {
      this.owner.onExpandLimb(rowView);
    },
    viewDidCollapse(rowView) {
      this.owner.onCollapseLimb(rowView);
    }
  }) ], CatalogEntityLimb.prototype, "row", void 0);
  __decorate([ view.ViewRef({
    key: true,
    type: table.LeafView,
    observes: true,
    initView(treeLeaf) {
      this.owner.iconCell.insertView(treeLeaf);
      this.owner.titleCell.insertView(treeLeaf);
      let child = this.owner.firstChild;
      while (child !== null) {
        if (child instanceof CatalogIndicatorCell) {
          this.owner.onInsertIndicatorCell(child);
        }
        child = child.nextSibling;
      }
      this.owner.disclosureCell.insertView(treeLeaf);
      const entityGroup = this.owner.subentities.model;
      if (entityGroup === null) {
        const disclosureCell = this.owner.disclosureCell.view;
        if (disclosureCell !== null) {
          disclosureCell.display.setState("none");
        }
      }
      const selectableTrait = this.owner.selectable.trait;
      if (selectableTrait !== null) {
        if (selectableTrait.selected) {
          treeLeaf.highlight.focus();
        } else {
          treeLeaf.highlight.unfocus();
        }
      }
      const statusTrait = this.owner.status.trait;
      if (statusTrait !== null) {
        this.owner.applyStatus(statusTrait.statusVector);
      }
    },
    didAttachView(treeLeaf) {
      if (treeLeaf.mounted && !treeLeaf.culled) {
        this.owner.startConsumingIndicators();
      }
    },
    viewDidMount(treeLeaf) {
      const rowView = this.owner.row.view;
      if (rowView !== null && rowView.visibility.value !== "hidden" && !rowView.culled) {
        this.owner.startConsumingIndicators();
      }
    },
    viewWillUnmount(treeLeaf) {
      this.owner.stopConsumingIndicators();
    },
    viewDidCull(treeLeaf) {
      this.owner.stopConsumingIndicators();
    },
    viewWillUncull(treeLeaf) {
      this.owner.startConsumingIndicators();
    },
    viewDidPress(input, event) {
      const selectableTrait = this.owner.selectable.trait;
      if (selectableTrait !== null) {
        if (!selectableTrait.selected) {
          selectableTrait.select({
            multi: input.shiftKey
          });
        } else if (input.shiftKey) {
          selectableTrait.unselect();
        } else {
          selectableTrait.unselectAll();
        }
      }
    },
    viewDidLongPress(input) {
      input.preventDefault();
      const selectableTrait = this.owner.selectable.trait;
      if (selectableTrait !== null) {
        if (!selectableTrait.selected) {
          selectableTrait.select({
            multi: true
          });
        } else {
          selectableTrait.unselect();
        }
      }
    }
  }) ], CatalogEntityLimb.prototype, "leaf", void 0);
  __decorate([ view.ViewRef({
    key: "icon",
    type: table.IconCellView,
    initView(iconCell) {
      const entityTrait = this.owner.entity.trait;
      if (entityTrait !== null) {
        let icon = entityTrait.icon.value;
        if (icon instanceof graphics.Icon) {
          if (icon instanceof graphics.FilledIcon) {
            icon = icon.withFillLook(theme.Look.accentColor);
          }
        } else {
          icon = null;
        }
        const cellIcon = iconCell.graphics.state;
        if (cellIcon instanceof graphics.EnclosedIcon) {
          iconCell.graphics.setState(cellIcon.withInner(icon));
        }
      }
    },
    createView() {
      const icon = graphics.EnclosedIcon.embossed(graphics.PolygonIcon.create(6), null).withInnerScale(Math.sqrt(2) / 2);
      const iconCell = table.IconCellView.create().iconWidth(40).iconHeight(40).graphics(icon);
      return iconCell;
    }
  }) ], CatalogEntityLimb.prototype, "iconCell", void 0);
  __decorate([ view.ViewRef({
    key: "title",
    type: table.TextCellView,
    initView(titleCell) {
      const entityTrait = this.owner.entity.trait;
      if (entityTrait !== null) {
        let entityTitle = entityTrait.title.value;
        if (entityTitle === void 0) {
          entityTitle = "";
        }
        titleCell.content(entityTitle);
      }
    }
  }) ], CatalogEntityLimb.prototype, "titleCell", void 0);
  __decorate([ view.ViewRef({
    key: "disclose",
    type: table.DisclosureCellView
  }) ], CatalogEntityLimb.prototype, "disclosureCell", void 0);
  __decorate([ controller.ControllerRef({
    createController() {
      return new CatalogEntityTree;
    }
  }) ], CatalogEntityLimb.prototype, "subtree", void 0);
  __decorate([ model.TraitRef({
    type: EntityTrait,
    observes: true,
    initTrait(entityTrait) {
      const titleCell = this.owner.titleCell.view;
      if (titleCell !== null) {
        let entityTitle = entityTrait.title.value;
        if (entityTitle === void 0) {
          entityTitle = "";
        }
        titleCell.content(entityTitle);
      }
      this.owner.selectable.setTrait(entityTrait.getTrait(model.SelectableTrait));
      this.owner.status.setTrait(entityTrait.getTrait(StatusTrait));
      this.owner.subentities.setModel(entityTrait.subentities.model);
      const indicatedTrait = entityTrait.getTrait(IndicatedTrait);
      if (indicatedTrait !== null) {
        this.owner.indicators.setModel(indicatedTrait.indicators.model);
      }
    },
    entityDidSetTitle(title) {
      const titleCell = this.owner.titleCell.view;
      if (titleCell !== null) {
        titleCell.content(title !== void 0 ? title : "");
      }
    },
    entityDidSetIcon(icon) {
      const iconCell = this.owner.iconCell.view;
      if (iconCell !== null) {
        if (icon instanceof graphics.Icon) {
          if (icon instanceof graphics.FilledIcon) {
            icon = icon.withFillLook(theme.Look.accentColor);
          }
        } else {
          icon = null;
        }
        const cellIcon = iconCell.graphics.state;
        if (cellIcon instanceof graphics.EnclosedIcon) {
          iconCell.graphics.setState(cellIcon.withInner(icon));
        }
      }
    },
    traitDidInsertChild(child, targetModel) {
      if (child.key === "subentities" && child instanceof EntityGroup) {
        this.owner.subentities.setModel(child);
      }
    },
    traitDidRemoveChild(child) {
      if (child.key === "subentities" && child instanceof EntityGroup) {
        this.owner.subentities.removeModel();
      }
    },
    traitDidInsertTrait(memberTrait, targetTrait) {
      if (memberTrait instanceof model.SelectableTrait) {
        this.owner.selectable.setTrait(memberTrait);
      }
    }
  }) ], CatalogEntityLimb.prototype, "entity", void 0);
  __decorate([ model.TraitRef({
    type: model.SelectableTrait,
    observes: true,
    initTrait(selectableTrait) {
      const treeLeaf = this.owner.leaf.view;
      if (treeLeaf !== null) {
        if (selectableTrait.selected) {
          treeLeaf.highlight.focus();
        } else {
          treeLeaf.highlight.unfocus();
        }
      }
    },
    traitDidSelect(options) {
      const treeLeaf = this.owner.leaf.view;
      if (treeLeaf !== null) {
        treeLeaf.highlight.focus();
      }
    },
    traitWillUnselect() {
      const treeLeaf = this.owner.leaf.view;
      if (treeLeaf !== null) {
        treeLeaf.highlight.unfocus();
      }
    }
  }) ], CatalogEntityLimb.prototype, "selectable", void 0);
  __decorate([ model.TraitRef({
    type: StatusTrait,
    observes: true,
    initTrait(statusTrait) {
      this.owner.applyStatus(statusTrait.statusVector);
    },
    traitDidSetStatusVector(newStatusVector, oldStatusVector) {
      this.owner.applyStatus(newStatusVector);
    }
  }) ], CatalogEntityLimb.prototype, "status", void 0);
  __decorate([ model.ModelRef({
    type: EntityGroup,
    didAttachModel(entityGroup) {
      const disclosureCell = this.owner.disclosureCell.view;
      if (disclosureCell !== null) {
        disclosureCell.display.setAffinity(component.Affinity.Intrinsic);
        const treeLeaf = this.owner.leaf.view;
        if (treeLeaf !== null) {
          treeLeaf.requireUpdate(view.View.NeedsResize | view.View.NeedsLayout);
        }
      }
      const rowView = this.owner.row.view;
      if (rowView !== null) {
        const entityTree = this.owner.subtree.insertController();
        if (entityTree !== null) {
          if (rowView.disclosure.expanded) {
            entityTree.tree.insertView(rowView);
          }
          entityTree.entities.setModel(entityGroup);
        }
      }
    },
    willDetachModel(entityGroup) {
      const disclosureCell = this.owner.disclosureCell.view;
      if (disclosureCell !== null) {
        disclosureCell.display.setState("none");
      }
    }
  }) ], CatalogEntityLimb.prototype, "subentities", void 0);
  __decorate([ model.ModelRef({
    type: IndicatorGroup,
    observes: true,
    initModel(indicatorGroup) {
      let child = indicatorGroup.firstChild;
      while (child !== null) {
        const indicatorTrait = child.getTrait(IndicatorTrait);
        if (indicatorTrait !== null) {
          this.owner.onInsertIndicator(indicatorTrait, null);
        }
        child = child.nextSibling;
      }
      const treeLeaf = this.owner.leaf.view;
      if (treeLeaf !== null && treeLeaf.mounted && !treeLeaf.culled) {
        this.owner.startConsumingIndicators();
      }
    },
    modelDidInsertChild(child, targetModel) {
      const childIndicator = child.getTrait(IndicatorTrait);
      if (childIndicator !== null) {
        const targetIndicator = targetModel !== null ? targetModel.getTrait(IndicatorTrait) : null;
        this.owner.onInsertIndicator(childIndicator, targetIndicator);
      }
    },
    modelWillRemoveChild(child) {
      const childIndicator = child.getTrait(IndicatorTrait);
      if (childIndicator !== null) {
        this.owner.onRemoveIndicator(childIndicator);
      }
    }
  }) ], CatalogEntityLimb.prototype, "indicators", void 0);
  class CatalogEntityTree extends controller.Controller {
    createLayout(indicatorTypes) {
      const cols = new Array;
      cols.push(table.ColLayout.create("icon", 0, 0, 64));
      cols.push(table.ColLayout.create("title", 1, 1, 200));
      if (indicatorTypes !== void 0) {
        for (let i = 0; i < indicatorTypes.length; i += 1) {
          const indicatorType = indicatorTypes[i];
          const indicatorRoot = this.createIndicatorRoot(indicatorType);
          if (indicatorRoot !== null) {
            cols.push(indicatorRoot);
          }
        }
      }
      cols.push(table.ColLayout.create("disclose", 0, 0, 40));
      return table.TableLayout.create(cols);
    }
    createIndicatorRoot(indicatorType) {
      return table.ColLayout.create(indicatorType.key, 0, 0, 100, true);
    }
    updateHeader(headerView, indicatorTypes) {
      let nameColView = headerView.getChild("title");
      if (nameColView === null) {
        nameColView = this.createNameColView();
        if (nameColView !== null) {
          headerView.appendChild(nameColView, "title");
        }
      }
      if (indicatorTypes !== void 0) {
        for (let i = 0; i < indicatorTypes.length; i += 1) {
          const indicatorType = indicatorTypes[i];
          let indicatorColView = headerView.getChild(indicatorType.key);
          if (indicatorColView === null) {
            indicatorColView = this.createIndicatorColView(indicatorType);
            if (indicatorColView !== null) {
              headerView.appendChild(indicatorColView, indicatorType.key);
            }
          }
        }
      }
    }
    createNameColView() {
      return table.ColView.create().label("Name");
    }
    createIndicatorColView(indicatorType) {
      return table.ColView.create().label(indicatorType.name);
    }
    onInsertEntity(childEntity, targetEntity) {
      const id = childEntity.uri.toString();
      let controllerRef = this.getFastener(id, controller.ControllerRef);
      if (controllerRef === null) {
        controllerRef = CatalogEntityTree.BranchRef.create(this);
        Object.defineProperty(controllerRef, "key", {
          value: id,
          enumerable: true,
          configurable: true
        });
        this.setFastener(id, controllerRef);
        const branchController = new CatalogEntityLimb;
        branchController.entity.setTrait(childEntity);
        controllerRef.setController(branchController);
        const targetController = targetEntity !== null ? this.getChild(targetEntity.uri.toString()) : null;
        this.insertChild(branchController, targetController, id);
      }
    }
    onRemoveEntity(childEntity) {
      const id = childEntity.uri.toString();
      const controllerRef = this.getFastener(id, controller.ControllerRef);
      if (controllerRef !== null) {
        controllerRef.deleteController();
        this.setFastener(id, null);
      }
    }
    onInsertBranch(branchController) {
      const treeView = this.tree.view;
      if (treeView !== null) {
        const id = branchController.entity.trait.uri.toString();
        let rowView;
        if (this.entities.model.isSorted()) {
          let index = this.lookupBranch(treeView, id);
          if (index >= 0) {
            rowView = treeView.node.childNodes[index].view;
          } else {
            index = -(index + 1);
            rowView = branchController.row.createView();
            if (rowView !== null) {
              const targetNode = treeView.node.childNodes[index];
              const targetView = targetNode !== void 0 ? targetNode.view : void 0;
              treeView.insertChild(rowView, targetView !== void 0 ? targetView : null, id);
            }
          }
          branchController.row.setView(rowView);
        } else {
          rowView = branchController.row.createView();
          if (rowView !== null) {
            const targetBranch = branchController.nextSibling;
            const targetView = targetBranch instanceof CatalogEntityLimb ? targetBranch.row.view : null;
            treeView.insertChild(rowView, targetView, id);
            branchController.row.setView(rowView);
          }
        }
      }
    }
    onRemoveBranch(branchController) {
      const rowView = branchController.row.view;
      if (rowView !== null) {
        rowView.remove();
      }
    }
    lookupBranch(treeView, key) {
      const childNodes = treeView.node.childNodes;
      let lo = 0;
      let hi = childNodes.length - 1;
      while (lo <= hi && !(childNodes[lo].view instanceof table.RowView)) {
        lo += 1;
      }
      while (hi >= lo && !(childNodes[hi].view instanceof table.RowView)) {
        hi -= 1;
      }
      while (lo <= hi) {
        const mid = lo + hi >>> 1;
        const order = util.Values.compare(key, childNodes[mid].view.key);
        if (order > 0) {
          lo = mid + 1;
        } else if (order < 0) {
          hi = mid - 1;
        } else {
          return mid;
        }
      }
      return -(lo + 1);
    }
    onReconcileEntities(entityGroup) {
      const treeView = this.tree.view;
      if (treeView !== null) {
        const indicatorTypes = entityGroup.indicatorMap.indicatorTypes;
        const oldLayout = treeView.layout.value;
        const newLayout = this.createLayout(indicatorTypes);
        if (oldLayout === null || !oldLayout.equivalentTo(newLayout)) {
          treeView.layout.setValue(newLayout);
          const headerView = treeView.header.view;
          if (headerView !== null) {
            this.updateHeader(headerView, indicatorTypes);
          }
          treeView.requireUpdate(view.View.NeedsResize | view.View.NeedsLayout);
        }
      }
    }
    bindChildFasteners(child, target) {}
    unbindChildFasteners(child) {}
  }
  CatalogEntityTree.BranchRef = controller.ControllerRef.define("BranchRef", {
    type: CatalogEntityLimb,
    didAttachController(branch) {
      this.owner.onInsertBranch(branch);
    },
    willDetachController(branch) {
      this.owner.onRemoveBranch(branch);
    }
  });
  __decorate([ view.ViewRef({
    key: true,
    type: table.TableView,
    initView(treeView) {
      let child = this.owner.firstChild;
      while (child !== null) {
        if (child instanceof CatalogEntityLimb) {
          this.owner.onInsertBranch(child);
        }
        child = child.nextSibling;
      }
      const entityGroup = this.owner.entities.model;
      if (entityGroup !== null) {
        this.owner.onReconcileEntities(entityGroup);
      }
    },
    createView() {
      const treeView = table.TableView.create();
      treeView.modifyTheme(theme.Feel.default, [ [ theme.Feel.primary, 1 ] ], false);
      treeView.rowHeight(58).rowSpacing(2).layout(this.owner.createLayout());
      const headerView = table.HeaderView.create();
      treeView.header.setView(headerView);
      this.owner.updateHeader(headerView);
      return treeView;
    }
  }) ], CatalogEntityTree.prototype, "tree", void 0);
  __decorate([ model.ModelRef({
    type: EntityGroup,
    observes: true,
    didAttachModel(entityGroup) {
      let entityModel = entityGroup.firstChild;
      while (entityModel !== null) {
        const entityTrait = entityModel.getTrait(EntityTrait);
        if (entityTrait !== null) {
          this.owner.onInsertEntity(entityTrait, null);
        }
        entityModel = entityModel.nextSibling;
      }
      this.owner.onReconcileEntities(entityGroup);
    },
    modelDidInsertChild(child, target) {
      const childEntityTrait = child.getTrait(EntityTrait);
      if (childEntityTrait !== null) {
        const targetEntityTrait = target !== null ? target.getTrait(EntityTrait) : null;
        this.owner.onInsertEntity(childEntityTrait, targetEntityTrait);
      }
    },
    modelWillRemoveChild(child) {
      const childEntityTrait = child.getTrait(EntityTrait);
      if (childEntityTrait !== null) {
        this.owner.onRemoveEntity(childEntityTrait);
      }
    },
    modelDidReconcile(modelContext, entityGroup) {
      this.owner.onReconcileEntities(entityGroup);
    }
  }) ], CatalogEntityTree.prototype, "entities", void 0);
  class CatalogController extends MirrorController {
    isFullBleed() {
      return false;
    }
    initTree(treeView) {
      treeView.marginLeft(8).marginRight(8);
    }
  }
  __decorate([ controller.ControllerRef({
    type: CatalogEntityTree
  }) ], CatalogController.prototype, "root", void 0);
  __decorate([ view.ViewRef({
    type: SurfaceView,
    didAttachView(surfaceView) {
      const domainGroup = this.owner.domains.model;
      if (domainGroup !== null) {
        const entityTree = this.owner.root.insertController();
        if (entityTree !== null) {
          const treeView = entityTree.tree.insertView(surfaceView);
          if (treeView !== null) {
            this.owner.initTree(treeView);
          }
          entityTree.entities.setModel(domainGroup);
        }
      }
    },
    willDetachView(surfaceView) {
      const entityTree = this.owner.root.controller;
      if (entityTree !== null) {
        entityTree.tree.removeView();
      }
    }
  }) ], CatalogController.prototype, "surface", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView
  }) ], CatalogController.prototype, "toolbar", void 0);
  __decorate([ view.ViewRef({
    type: window.DrawerView
  }) ], CatalogController.prototype, "drawer", void 0);
  __decorate([ model.ModelRef({
    type: DomainGroup,
    didAttachModel(domainGroup) {
      const surfaceView = this.owner.surface.view;
      if (surfaceView !== null) {
        const entityTree = this.owner.root.insertController();
        if (entityTree !== null) {
          const treeView = entityTree.tree.insertView(surfaceView);
          if (treeView !== null) {
            this.owner.initTree(treeView);
          }
          entityTree.entities.setModel(domainGroup);
        }
      }
    }
  }) ], CatalogController.prototype, "domains", void 0);
  class CatalogPlugin extends MirrorPlugin {
    get id() {
      return "catalog";
    }
    get title() {
      return "Catalog";
    }
    get icon() {
      return CatalogPlugin.icon;
    }
    createController() {
      return new CatalogController;
    }
    static get icon() {
      return graphics.VectorIcon.create(24, 24, "M3,13L5,13L5,11L3,11L3,13ZM3,19L5,19L5,17L3,17L3,19ZM3,7L5,7L5,5L3,5L3,7ZM7,13L21,13L21,11L7,11L7,13ZM7,19L21,19L21,17L7,17L7,19ZM7,5L7,7L21,7L21,5L7,5Z");
    }
  }
  __decorate([ util.Lazy ], CatalogPlugin, "icon", null);
  class DiagramController extends MirrorController {
    isFullBleed() {
      return true;
    }
    onInsertDomain(childDomain, targetDomain) {}
    onRemoveDomain(childDomain) {}
  }
  __decorate([ view.ViewRef({
    type: SurfaceView
  }) ], DiagramController.prototype, "surface", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView
  }) ], DiagramController.prototype, "toolbar", void 0);
  __decorate([ view.ViewRef({
    type: window.DrawerView
  }) ], DiagramController.prototype, "drawer", void 0);
  __decorate([ model.ModelRef({
    type: DomainGroup,
    observes: true,
    didAttachModel(domainGroup) {
      let domainModel = domainGroup.firstChild;
      while (domainModel !== null) {
        const domainTrait = domainModel.getTrait(DomainTrait);
        if (domainTrait !== null) {
          this.owner.onInsertDomain(domainTrait, null);
        }
        domainModel = domainModel.nextSibling;
      }
    },
    modelDidInsertChild(child, target) {
      const childDomainTrait = child.getTrait(DomainTrait);
      if (childDomainTrait !== null) {
        const targetDomainTrait = target !== null ? target.getTrait(DomainTrait) : null;
        this.owner.onInsertDomain(childDomainTrait, targetDomainTrait);
      }
    },
    modelWillRemoveChild(child) {
      const childDomainTrait = child.getTrait(DomainTrait);
      if (childDomainTrait !== null) {
        this.owner.onRemoveDomain(childDomainTrait);
      }
    }
  }) ], DiagramController.prototype, "domains", void 0);
  class DiagramPlugin extends MirrorPlugin {
    get id() {
      return "diagram";
    }
    get title() {
      return "Diagram";
    }
    get icon() {
      return DiagramPlugin.icon;
    }
    createController() {
      return new DiagramController;
    }
    static get icon() {
      return graphics.VectorIcon.create(24, 24, "M19.9,2L22,5.5L19.9,9L15.7,9L14.7,7.3C14.3,7.5,14,7.8,13.6,8.1L13.4,8.3L12.9,8.7L11.8,9.6C11.1,10.3,10.5,10.8,9.9,11.2L10.4,12L9.9,12.8C10.2,13.1,10.6,13.3,11,13.7L11.3,13.9L11.8,14.4L12.9,15.3C13.6,15.9,14.1,16.4,14.7,16.7L15.7,15L19.9,15L22,18.5L19.9,22L15.7,22L13.6,18.5L14.1,17.7C13.5,17.2,12.8,16.6,11.9,15.9L11.1,15.2C10.4,14.6,9.9,14.2,9.3,13.8L8.3,15.5L4.1,15.5L2,12L4.1,8.5L8.3,8.5L9.3,10.2C9.9,9.8,10.6,9.3,11.4,8.6L11.9,8.1C12.8,7.4,13.5,6.8,14.1,6.3L13.6,5.5L15.7,2L19.9,2Z");
    }
  }
  __decorate([ util.Lazy ], DiagramPlugin, "icon", null);
  class Geographic {
    static fromGeoJson(object) {
      if (object.type === "Feature") {
        return this.fromGeoJsonFeature(object);
      } else if (object.type === "FeatureCollection") {
        return this.fromGeoJsonFeatureCollection(object);
      } else {
        return this.fromGeoJsonGeometry(object);
      }
    }
    static fromGeoJsonGeometry(object, properties) {
      if (object.type === "Point") {
        return this.fromGeoJsonPoint(object, properties);
      } else if (object.type === "MultiPoint") {
        return this.fromGeoJsonMultiPoint(object, properties);
      } else if (object.type === "LineString") {
        return this.fromGeoJsonLineString(object, properties);
      } else if (object.type === "MultiLineString") {
        return this.fromGeoJsonMultiLineString(object, properties);
      } else if (object.type === "Polygon") {
        return this.fromGeoJsonPolygon(object, properties);
      } else if (object.type === "MultiPolygon") {
        return this.fromGeoJsonMultiPolygon(object, properties);
      } else if (object.type === "GeometryCollection") {
        return this.fromGeoJsonGeometryCollection(object, properties);
      } else {
        throw new TypeError("" + object);
      }
    }
    static fromGeoJsonPoint(object, properties) {
      let width = null;
      let height = null;
      let graphics$1 = null;
      let fill = null;
      if (properties !== void 0) {
        if (properties.width !== void 0 || properties.height !== void 0) {
          if (typeof properties.width === "number" || typeof properties.width === "string") {
            try {
              width = math.Length.fromAny(properties.width);
            } catch (e) {}
          }
          if (typeof properties.height === "number" || typeof properties.height === "string") {
            try {
              height = math.Length.fromAny(properties.height);
            } catch (e) {}
          }
        } else if (typeof properties.radius === "number" || typeof properties.radius === "string") {
          try {
            height = width = math.Length.fromAny(properties.radius);
          } catch (e) {}
        }
        if (width !== null && height !== null && typeof properties.icon === "string") {
          try {
            const path = math.R2Path.parse(properties.icon);
            graphics$1 = graphics.VectorIcon.create(width.pxValue(), height.pxValue(), path);
          } catch (e) {}
        }
        if (typeof properties.fill === "string") {
          try {
            fill = style.Color.parse(properties.fill);
          } catch (e) {}
        }
      }
      const geometry = geo.GeoJsonPoint.toShape(object);
      return new GeographicPoint(geometry, width, height, graphics$1, fill);
    }
    static fromGeoJsonMultiPoint(object, properties) {
      let width = null;
      let height = null;
      let graphics$1 = null;
      let fill = null;
      if (properties !== void 0) {
        if (properties.width !== void 0 || properties.height !== void 0) {
          if (typeof properties.width === "number" || typeof properties.width === "string") {
            try {
              width = math.Length.fromAny(properties.width);
            } catch (e) {}
          }
          if (typeof properties.height === "number" || typeof properties.height === "string") {
            try {
              height = math.Length.fromAny(properties.height);
            } catch (e) {}
          }
        } else if (typeof properties.radius === "number" || typeof properties.radius === "string") {
          try {
            height = width = math.Length.fromAny(properties.radius);
          } catch (e) {}
        }
        if (width !== null && height !== null && typeof properties.icon === "string") {
          try {
            const path = math.R2Path.parse(properties.icon);
            graphics$1 = graphics.VectorIcon.create(width.pxValue(), height.pxValue(), path);
          } catch (e) {}
        }
        if (typeof properties.fill === "string") {
          try {
            fill = style.Color.parse(properties.fill);
          } catch (e) {}
        }
      }
      const geometry = geo.GeoJsonMultiPoint.toShape(object);
      const shapes = geometry.shapes;
      const n = shapes.length;
      const geographics = new Array(n);
      for (let i = 0; i < n; i += 1) {
        geographics[i] = new GeographicPoint(shapes[i], width, height, graphics$1, fill);
      }
      return new GeographicGroup(geographics, geometry);
    }
    static fromGeoJsonLineString(object, properties) {
      let stroke = null;
      let strokeWidth = null;
      if (properties !== void 0) {
        if (typeof properties.stroke === "string") {
          try {
            stroke = style.Color.parse(properties.stroke);
          } catch (e) {}
        }
        if (typeof properties.strokeWidth === "number" || typeof properties.strokeWidth === "string") {
          try {
            strokeWidth = math.Length.fromAny(properties.strokeWidth);
          } catch (e) {}
        }
      }
      const geometry = geo.GeoPath.of(geo.GeoJsonLineString.toShape(object));
      return new GeographicLine(geometry, stroke, strokeWidth);
    }
    static fromGeoJsonMultiLineString(object, properties) {
      let stroke = null;
      let strokeWidth = null;
      if (properties !== void 0) {
        if (typeof properties.stroke === "string") {
          try {
            stroke = style.Color.parse(properties.stroke);
          } catch (e) {}
        }
        if (typeof properties.strokeWidth === "number" || typeof properties.strokeWidth === "string") {
          try {
            strokeWidth = math.Length.fromAny(properties.strokeWidth);
          } catch (e) {}
        }
      }
      const geometry = geo.GeoJsonMultiLineString.toShape(object);
      const shapes = geometry.shapes;
      const n = shapes.length;
      const geographics = new Array(n);
      for (let i = 0; i < n; i += 1) {
        geographics[i] = new GeographicLine(geo.GeoPath.of(shapes[i]), stroke, strokeWidth);
      }
      return new GeographicGroup(geographics, geometry);
    }
    static fromGeoJsonPolygon(object, properties) {
      let fill = null;
      let stroke = null;
      let strokeWidth = null;
      if (properties !== void 0) {
        if (typeof properties.fill === "string") {
          try {
            fill = style.Color.parse(properties.fill);
          } catch (e) {}
        }
        if (typeof properties.stroke === "string") {
          try {
            stroke = style.Color.parse(properties.stroke);
          } catch (e) {}
        }
        if (typeof properties.strokeWidth === "number" || typeof properties.strokeWidth === "string") {
          try {
            strokeWidth = math.Length.fromAny(properties.strokeWidth);
          } catch (e) {}
        }
      }
      const geometry = geo.GeoJsonPolygon.toShape(object);
      return new GeographicArea(geometry, fill, stroke, strokeWidth);
    }
    static fromGeoJsonMultiPolygon(object, properties) {
      let fill = null;
      let stroke = null;
      let strokeWidth = null;
      if (properties !== void 0) {
        if (typeof properties.fill === "string") {
          try {
            fill = style.Color.parse(properties.fill);
          } catch (e) {}
        }
        if (typeof properties.stroke === "string") {
          try {
            stroke = style.Color.parse(properties.stroke);
          } catch (e) {}
        }
        if (typeof properties.strokeWidth === "number" || typeof properties.strokeWidth === "string") {
          try {
            strokeWidth = math.Length.fromAny(properties.strokeWidth);
          } catch (e) {}
        }
      }
      const geometry = geo.GeoJsonMultiPolygon.toShape(object);
      const shapes = geometry.shapes;
      const n = shapes.length;
      const geographics = new Array(n);
      for (let i = 0; i < n; i += 1) {
        geographics[i] = new GeographicArea(shapes[i], fill, stroke, strokeWidth);
      }
      return new GeographicGroup(geographics, geometry);
    }
    static fromGeoJsonGeometryCollection(object, properties) {
      const geometries = object.geometries;
      const n = geometries.length;
      const geographics = new Array(n);
      for (let i = 0; i < n; i += 1) {
        geographics[i] = this.fromGeoJsonGeometry(geometries[i], properties);
      }
      return new GeographicGroup(geographics);
    }
    static fromGeoJsonFeature(object) {
      const geometry = object.geometry;
      if (geometry !== null) {
        const properties = object.properties;
        return this.fromGeoJsonGeometry(geometry, properties !== null ? properties : void 0);
      } else {
        return null;
      }
    }
    static fromGeoJsonFeatureCollection(object) {
      const features = object.features;
      const geographics = new Array;
      for (let i = 0, n = features.length; i < n; i += 1) {
        const geographic = this.fromGeoJsonFeature(features[i]);
        if (geographic !== null) {
          geographics.push(geographic);
        }
      }
      return new GeographicGroup(geographics);
    }
  }
  class GeographicPoint extends Geographic {
    constructor(geometry, width, height, graphics, fill) {
      super();
      this.geometry = geometry;
      this.width = width;
      this.height = height;
      this.graphics = graphics;
      this.fill = fill;
    }
    equals(that) {
      if (this === that) {
        return true;
      } else if (that instanceof GeographicPoint) {
        return this.geometry.equals(that.geometry) && util.Equals(this.width, that.width) && util.Equals(this.height, that.height) && util.Equals(this.graphics, that.graphics) && util.Equals(this.fill, that.fill);
      }
      return false;
    }
    static fromInit(init) {
      const geometry = geo.GeoPoint.fromAny(init.geometry);
      const width = init.width !== void 0 && init.width !== null ? math.Length.fromAny(init.width) : null;
      const height = init.height !== void 0 && init.height !== null ? math.Length.fromAny(init.height) : null;
      const graphics = init.graphics !== void 0 ? init.graphics : null;
      const fill = init.fill !== void 0 && init.fill !== null ? style.Color.fromAny(init.fill) : null;
      return new GeographicPoint(geometry, width, height, graphics, fill);
    }
    static fromAny(value) {
      if (value === void 0 || value === null || value instanceof GeographicPoint) {
        return value;
      } else if (typeof value === "object") {
        return GeographicPoint.fromInit(value);
      }
      throw new TypeError("" + value);
    }
  }
  class GeographicLine extends Geographic {
    constructor(geometry, stroke, strokeWidth) {
      super();
      this.geometry = geometry;
      this.stroke = stroke;
      this.strokeWidth = strokeWidth;
    }
    equals(that) {
      if (this === that) {
        return true;
      } else if (that instanceof GeographicLine) {
        return this.geometry.equals(that.geometry) && util.Equals(this.stroke, that.stroke) && util.Equals(this.strokeWidth, that.strokeWidth);
      }
      return false;
    }
    static fromInit(init) {
      const geometry = geo.GeoPath.fromAny(init.geometry);
      const stroke = init.stroke !== void 0 && init.stroke !== null ? style.Color.fromAny(init.stroke) : null;
      const strokeWidth = init.strokeWidth !== void 0 && init.strokeWidth !== null ? math.Length.fromAny(init.strokeWidth) : null;
      return new GeographicLine(geometry, stroke, strokeWidth);
    }
    static fromAny(value) {
      if (value === void 0 || value === null || value instanceof GeographicLine) {
        return value;
      } else if (typeof value === "object") {
        return GeographicLine.fromInit(value);
      }
      throw new TypeError("" + value);
    }
  }
  class GeographicArea extends Geographic {
    constructor(geometry, fill, stroke, strokeWidth) {
      super();
      this.geometry = geometry;
      this.fill = fill;
      this.stroke = stroke;
      this.strokeWidth = strokeWidth;
    }
    equals(that) {
      if (this === that) {
        return true;
      } else if (that instanceof GeographicArea) {
        return this.geometry.equals(that.geometry) && util.Equals(this.fill, that.fill) && util.Equals(this.stroke, that.stroke) && util.Equals(this.strokeWidth, that.strokeWidth);
      }
      return false;
    }
    static fromInit(init) {
      const geometry = geo.GeoPath.fromAny(init.geometry);
      const fill = init.fill !== void 0 && init.fill !== null ? style.Color.fromAny(init.fill) : null;
      const stroke = init.stroke !== void 0 && init.stroke !== null ? style.Color.fromAny(init.stroke) : null;
      const strokeWidth = init.strokeWidth !== void 0 && init.strokeWidth !== null ? math.Length.fromAny(init.strokeWidth) : null;
      return new GeographicArea(geometry, fill, stroke, strokeWidth);
    }
    static fromAny(value) {
      if (value === void 0 || value === null || value instanceof GeographicArea) {
        return value;
      } else if (typeof value === "object") {
        return GeographicArea.fromInit(value);
      }
      throw new TypeError("" + value);
    }
  }
  class GeographicGroup extends Geographic {
    constructor(geographics, geometry = null) {
      super();
      this.geographics = geographics;
      this.geometries = geometry;
    }
    get geometry() {
      let geometry = this.geometries;
      if (geometry === null) {
        const geographics = this.geographics;
        const n = geographics.length;
        const shapes = new Array(n);
        for (let i = 0; i < n; i += 1) {
          shapes[i] = geographics[i].geometry;
        }
        geometry = new geo.GeoGroup(shapes);
        this.geometries = geometry;
      }
      return geometry;
    }
    equals(that) {
      if (this === that) {
        return true;
      } else if (that instanceof GeographicGroup) {
        return util.Arrays.equal(this.geographics, that.geographics);
      }
      return false;
    }
  }
  const GeographicView = function() {
    const GeographicView = {};
    GeographicView.fromGeographic = function(geographic) {
      if (geographic instanceof GeographicPoint) {
        return GeographicPointView.fromGeographic(geographic);
      } else if (geographic instanceof GeographicLine) {
        return GeographicLineView.fromGeographic(geographic);
      } else if (geographic instanceof GeographicArea) {
        return GeographicAreaView.fromGeographic(geographic);
      } else if (geographic instanceof GeographicGroup) {
        return GeographicGroupView.fromGeographic(geographic);
      } else {
        throw new TypeError("" + geographic);
      }
    };
    GeographicView.is = function(object) {
      if (typeof object === "object" && object !== null) {
        const view = object;
        return view instanceof GeographicPoint || view instanceof GeographicLine || view instanceof GeographicArea || view instanceof GeographicGroup || view instanceof map.GeoView && "highlight" in view && "unhighlight" in view && "setState" in view;
      }
      return false;
    };
    return GeographicView;
  }();
  class GeographicPointView extends map.GeoIconView {
    get icon() {
      const graphics$1 = this.graphics.state;
      if (graphics$1 instanceof graphics.EnclosedIcon) {
        return graphics$1.inner;
      } else {
        return null;
      }
    }
    setIcon(inner) {
      if (inner instanceof graphics.FilledIcon) {
        inner = inner.withFillLook(theme.Look.accentColor);
      }
      let icon = this.graphics.state;
      if (inner instanceof graphics.Icon) {
        if (icon instanceof graphics.EnclosedIcon) {
          icon = icon.withInner(inner);
        } else {
          icon = this.createIcon(inner);
        }
        this.graphics.setState(icon);
      } else {
        this.graphics.setState(inner);
      }
    }
    createOuterIcon() {
      return graphics.PolygonIcon.create(6);
    }
    createIcon(inner) {
      let outer;
      if (this.highlighted.value) {
        outer = this.createOuterIcon();
      } else {
        outer = null;
      }
      let icon;
      if (this.highlighted.value) {
        icon = graphics.EnclosedIcon.embossed(outer, inner);
      } else {
        icon = graphics.EnclosedIcon.create(outer, inner);
      }
      icon = icon.withInnerScale(Math.sqrt(2) / 2);
      return icon;
    }
    highlight(timing) {
      if (!this.highlighted.value) {
        if (timing === void 0 || timing === true) {
          timing = this.getLookOr(theme.Look.timing, false);
        } else {
          timing = util.Timing.fromAny(timing);
        }
        this.willHighlight(timing);
        this.highlighted.setValue(true);
        this.onHighlight(timing);
        this.didHighlight(timing);
      }
    }
    willHighlight(timing) {
      this.callObservers("geographicWillHighlight", timing, this);
    }
    onHighlight(timing) {
      const width = this.width.state;
      if (width !== null) {
        this.iconWidth.setState(48, timing, component.Affinity.Intrinsic);
      }
      const height = this.height.state;
      if (height !== null) {
        this.iconHeight.setState(48, timing, component.Affinity.Intrinsic);
      }
      const oldIcon = this.graphics.state;
      if (oldIcon instanceof graphics.EnclosedIcon) {
        const outerIconColor = this.getLook(theme.Look.accentColor);
        let outer = this.createOuterIcon().withFillLook(null);
        outer = outer.withFillColor(outerIconColor.alpha(0));
        let newIcon = oldIcon.withOuter(outer);
        this.graphics.setState(newIcon);
        outer = outer.withFillColor(null).withFillLook(theme.Look.accentColor);
        newIcon = newIcon.withOuter(outer).withInnerMoodModifier(graphics.EnclosedIcon.embossedMoodModifier);
        this.graphics.setState(newIcon, timing);
      }
    }
    didHighlight(timing) {
      this.callObservers("geographicDidHighlight", timing, this);
    }
    unhighlight(timing) {
      if (this.highlighted.value) {
        if (timing === void 0 || timing === true) {
          timing = this.getLookOr(theme.Look.timing, false);
        } else {
          timing = util.Timing.fromAny(timing);
        }
        this.willUnhighlight(timing);
        this.highlighted.setValue(false);
        this.onUnhighlight(timing);
        this.didUnhighlight(timing);
      }
    }
    willUnhighlight(timing) {
      this.callObservers("geographicWillUnhighlight", timing, this);
    }
    onUnhighlight(timing) {
      const width = this.width.state;
      if (width !== null) {
        this.iconWidth.setState(width, timing, component.Affinity.Intrinsic);
      }
      const height = this.height.state;
      if (height !== null) {
        this.iconHeight.setState(height, timing, component.Affinity.Intrinsic);
      }
      const oldIcon = this.graphics.state;
      if (oldIcon instanceof graphics.EnclosedIcon) {
        let outer = oldIcon.outer;
        if (outer instanceof graphics.FilledIcon) {
          const outerIconColor = outer.fillColor;
          if (outerIconColor !== null) {
            outer = outer.withFillColor(outerIconColor.alpha(0)).withFillLook(null);
          }
        }
        const newIcon = oldIcon.withOuter(outer).withInnerMoodModifier(null);
        this.graphics.setState(newIcon, timing);
      }
    }
    didUnhighlight(timing) {
      this.callObservers("geographicDidUnhighlight", timing, this);
    }
    setState(geographic, timing) {
      if (geographic instanceof GeographicPoint) {
        if (timing === void 0 || timing === true) {
          timing = this.getLookOr(theme.Look.timing, false);
        } else {
          timing = util.Timing.fromAny(timing);
        }
        this.geoCenter.setState(geographic.geometry, timing);
        if (geographic.width !== null) {
          this.width.setState(geographic.width, timing);
        }
        if (geographic.height !== null) {
          this.height.setState(geographic.height, timing);
        }
        if (geographic.graphics !== null) {
          this.setIcon(geographic.graphics);
        }
        if (geographic.fill !== null) {
          let icon = this.graphics.state;
          if (icon instanceof graphics.EnclosedIcon) {
            let inner = icon.inner;
            if (inner instanceof graphics.FilledIcon) {
              inner = inner.withFillColor(geographic.fill).withFillLook(null);
              icon = icon.withInner(inner);
              this.graphics.setState(icon, timing);
            }
          }
        }
      }
    }
    static fromGeographic(geographic) {
      const view = new GeographicPointView;
      view.geoCenter.setState(geographic.geometry);
      let width = geographic.width;
      let height = geographic.height;
      if (width === null && height === null) {
        width = math.Length.px(10);
        height = width;
      } else if (width === null && height !== null) {
        width = height;
      } else if (width !== null && height === null) {
        height = width;
      }
      view.width.setState(width);
      view.height.setState(height);
      let graphics$1 = geographic.graphics;
      if (graphics$1 === null) {
        graphics$1 = graphics.CircleIcon.create();
      }
      view.setIcon(graphics$1);
      if (geographic.fill !== null) {
        let icon = view.graphics.state;
        if (icon instanceof graphics.EnclosedIcon) {
          let inner = icon.inner;
          if (inner instanceof graphics.FilledIcon) {
            inner = inner.withFillColor(geographic.fill).withFillLook(null);
            icon = icon.withInner(inner);
            view.graphics.setState(icon);
          }
        }
      }
      return view;
    }
  }
  GeographicPointView.SelectionScale = 2;
  __decorate([ component.Animator({
    type: math.Length,
    value: null,
    didSetValue(width) {
      if (width !== null && this.owner.highlighted.value) {
        width = math.Length.px(48);
      }
      this.owner.iconWidth.setState(width, component.Affinity.Intrinsic);
    }
  }) ], GeographicPointView.prototype, "width", void 0);
  __decorate([ component.Animator({
    type: math.Length,
    value: null,
    didSetValue(height) {
      if (height !== null && this.owner.highlighted.value) {
        height = math.Length.px(48);
      }
      this.owner.iconHeight.setState(height, component.Affinity.Intrinsic);
    }
  }) ], GeographicPointView.prototype, "height", void 0);
  __decorate([ component.Property({
    type: Boolean,
    value: false
  }) ], GeographicPointView.prototype, "highlighted", void 0);
  __decorate([ view.PositionGesture({
    self: true,
    didMovePress(input, event) {
      const dx = input.dx;
      const dy = input.dy;
      if (dx * dx + dy * dy >= 4 * 4) {
        input.preventDefault();
      }
    },
    didPress(input, event) {
      if (!input.defaultPrevented) {
        this.owner.callObservers("geographicDidPress", input, event, this.owner);
      }
    },
    didLongPress(input) {
      if (!input.defaultPrevented) {
        this.owner.callObservers("geographicDidLongPress", input, this.owner);
      }
    }
  }) ], GeographicPointView.prototype, "gesture", void 0);
  class GeographicLineView extends map.GeoLineView {
    highlight(timing) {
      if (!this.highlighted.value) {
        if (timing === void 0 || timing === true) {
          timing = this.getLookOr(theme.Look.timing, false);
        } else {
          timing = util.Timing.fromAny(timing);
        }
        this.willHighlight(timing);
        this.highlighted.setValue(true);
        this.onHighlight(timing);
        this.didHighlight(timing);
      }
    }
    willHighlight(timing) {
      this.callObservers("geographicWillHighlight", timing, this);
    }
    onHighlight(timing) {
      const accentColor = this.getLook(theme.Look.accentColor);
      if (accentColor !== void 0 && this.stroke.hasAffinity(component.Affinity.Intrinsic)) {
        const opacity = GeographicLineView.HighlightedStrokeOpacity;
        this.stroke.setState(accentColor.alpha(opacity), timing, component.Affinity.Intrinsic);
      }
    }
    didHighlight(timing) {
      this.callObservers("geographicDidHighlight", timing, this);
    }
    unhighlight(timing) {
      if (this.highlighted.value) {
        if (timing === void 0 || timing === true) {
          timing = this.getLookOr(theme.Look.timing, false);
        } else {
          timing = util.Timing.fromAny(timing);
        }
        this.willUnhighlight(timing);
        this.highlighted.setValue(false);
        this.onUnhighlight(timing);
        this.didUnhighlight(timing);
      }
    }
    willUnhighlight(timing) {
      this.callObservers("geographicWillUnhighlight", timing, this);
    }
    onUnhighlight(timing) {
      const accentColor = this.getLook(theme.Look.accentColor);
      if (accentColor !== void 0 && this.stroke.hasAffinity(component.Affinity.Intrinsic)) {
        const opacity = GeographicLineView.StrokeOpacity;
        this.stroke.setState(accentColor.alpha(opacity), timing, component.Affinity.Intrinsic);
      }
    }
    didUnhighlight(timing) {
      this.callObservers("geographicDidUnhighlight", timing, this);
    }
    setState(geographic, timing) {
      if (geographic instanceof GeographicLine) {
        if (timing === void 0 || timing === true) {
          timing = this.getLookOr(theme.Look.timing, false);
        } else {
          timing = util.Timing.fromAny(timing);
        }
        this.geoPath.setState(geographic.geometry, component.Affinity.Extrinsic);
        if (geographic.stroke !== null) {
          this.stroke.setState(geographic.stroke, timing, component.Affinity.Extrinsic);
        } else {
          this.stroke.setAffinity(component.Affinity.Intrinsic);
        }
        if (geographic.strokeWidth !== null) {
          this.strokeWidth.setState(geographic.strokeWidth, timing, component.Affinity.Extrinsic);
        } else {
          this.strokeWidth.setAffinity(component.Affinity.Intrinsic);
        }
      }
    }
    onApplyTheme(theme$1, mood, timing) {
      super.onApplyTheme(theme$1, mood, timing);
      const accentColor = theme$1.getOr(theme.Look.accentColor, mood, null);
      if (accentColor !== null && this.stroke.hasAffinity(component.Affinity.Intrinsic)) {
        const opacity = this.highlighted.value ? GeographicLineView.HighlightedStrokeOpacity : GeographicLineView.StrokeOpacity;
        this.stroke.setState(accentColor.alpha(opacity), timing, component.Affinity.Intrinsic);
      }
      this.strokeWidth.setState(1, timing, component.Affinity.Intrinsic);
    }
    static fromGeographic(geographic) {
      const view = new GeographicLineView;
      view.geoPath.setState(geographic.geometry);
      if (geographic.stroke !== null) {
        view.stroke.setState(geographic.stroke);
      }
      if (geographic.strokeWidth !== null) {
        view.strokeWidth.setState(geographic.strokeWidth);
      }
      return view;
    }
  }
  GeographicLineView.StrokeOpacity = .2;
  GeographicLineView.HighlightedStrokeOpacity = .5;
  __decorate([ component.Property({
    type: Boolean,
    value: false
  }) ], GeographicLineView.prototype, "highlighted", void 0);
  __decorate([ view.PositionGesture({
    self: true,
    didMovePress(input, event) {
      const dx = input.dx;
      const dy = input.dy;
      if (dx * dx + dy * dy >= 4 * 4) {
        input.preventDefault();
      }
    },
    didPress(input, event) {
      if (!input.defaultPrevented) {
        this.owner.callObservers("geographicDidPress", input, event, this.owner);
      }
    },
    didLongPress(input) {
      if (!input.defaultPrevented) {
        this.owner.callObservers("geographicDidLongPress", input, this.owner);
      }
    }
  }) ], GeographicLineView.prototype, "gesture", void 0);
  class GeographicAreaView extends map.GeoAreaView {
    highlight(timing) {
      if (!this.highlighted.value) {
        if (timing === void 0 || timing === true) {
          timing = this.getLookOr(theme.Look.timing, false);
        } else {
          timing = util.Timing.fromAny(timing);
        }
        this.willHighlight(timing);
        this.highlighted.setValue(true);
        this.onHighlight(timing);
        this.didHighlight(timing);
      }
    }
    willHighlight(timing) {
      this.callObservers("geographicWillHighlight", timing, this);
    }
    onHighlight(timing) {
      const accentColor = this.getLook(theme.Look.accentColor);
      if (accentColor !== void 0) {
        if (this.fill.hasAffinity(component.Affinity.Intrinsic)) {
          const opacity = GeographicAreaView.HighlightedFillOpacity;
          this.fill.setState(accentColor.alpha(opacity), timing, component.Affinity.Intrinsic);
        }
        if (this.stroke.hasAffinity(component.Affinity.Intrinsic)) {
          const opacity = GeographicAreaView.HighlightedStrokeOpacity;
          this.stroke.setState(accentColor.alpha(opacity), timing, component.Affinity.Intrinsic);
        }
      }
    }
    didHighlight(timing) {
      this.callObservers("geographicDidHighlight", timing, this);
    }
    unhighlight(timing) {
      if (this.highlighted.value) {
        if (timing === void 0 || timing === true) {
          timing = this.getLookOr(theme.Look.timing, false);
        } else {
          timing = util.Timing.fromAny(timing);
        }
        this.willUnhighlight(timing);
        this.highlighted.setValue(false);
        this.onUnhighlight(timing);
        this.didUnhighlight(timing);
      }
    }
    willUnhighlight(timing) {
      this.callObservers("geographicWillUnhighlight", timing, this);
    }
    onUnhighlight(timing) {
      const accentColor = this.getLook(theme.Look.accentColor);
      if (accentColor !== void 0) {
        if (this.fill.hasAffinity(component.Affinity.Intrinsic)) {
          const opacity = GeographicAreaView.FillOpacity;
          this.fill.setState(accentColor.alpha(opacity), timing, component.Affinity.Intrinsic);
        }
        if (this.stroke.hasAffinity(component.Affinity.Intrinsic)) {
          const opacity = GeographicAreaView.StrokeOpacity;
          this.stroke.setState(accentColor.alpha(opacity), timing, component.Affinity.Intrinsic);
        }
      }
    }
    didUnhighlight(timing) {
      this.callObservers("geographicDidUnhighlight", timing, this);
    }
    setState(geographic, timing) {
      if (geographic instanceof GeographicArea) {
        if (timing === void 0 || timing === true) {
          timing = this.getLookOr(theme.Look.timing, false);
        } else {
          timing = util.Timing.fromAny(timing);
        }
        this.geoPath.setState(geographic.geometry, component.Affinity.Extrinsic);
        if (geographic.fill !== null) {
          this.fill.setState(geographic.fill, timing, component.Affinity.Extrinsic);
        } else {
          this.fill.setAffinity(component.Affinity.Intrinsic);
        }
        if (geographic.stroke !== null) {
          this.stroke.setState(geographic.stroke, timing, component.Affinity.Extrinsic);
        } else {
          this.stroke.setAffinity(component.Affinity.Intrinsic);
        }
        if (geographic.strokeWidth !== null) {
          this.strokeWidth.setState(geographic.strokeWidth, timing, component.Affinity.Extrinsic);
        } else {
          this.strokeWidth.setAffinity(component.Affinity.Intrinsic);
        }
      }
    }
    onApplyTheme(theme$1, mood, timing) {
      super.onApplyTheme(theme$1, mood, timing);
      const accentColor = theme$1.getOr(theme.Look.accentColor, mood, null);
      if (accentColor !== null) {
        if (this.fill.hasAffinity(component.Affinity.Intrinsic)) {
          const opacity = this.highlighted.value ? GeographicAreaView.HighlightedFillOpacity : GeographicAreaView.FillOpacity;
          this.fill.setState(accentColor.alpha(opacity), timing, component.Affinity.Intrinsic);
        }
        if (this.stroke.hasAffinity(component.Affinity.Intrinsic)) {
          const opacity = this.highlighted.value ? GeographicAreaView.HighlightedStrokeOpacity : GeographicAreaView.StrokeOpacity;
          this.stroke.setState(accentColor.alpha(opacity), timing, component.Affinity.Intrinsic);
        }
      }
      this.strokeWidth.setState(1, timing, component.Affinity.Intrinsic);
    }
    static fromGeographic(geographic) {
      const view = new GeographicAreaView;
      view.geoPath.setState(geographic.geometry);
      if (geographic.fill !== null) {
        view.fill.setState(geographic.fill);
      }
      if (geographic.stroke !== null) {
        view.stroke.setState(geographic.stroke);
      }
      if (geographic.strokeWidth !== null) {
        view.strokeWidth.setState(geographic.strokeWidth);
      }
      return view;
    }
  }
  GeographicAreaView.FillOpacity = .1;
  GeographicAreaView.StrokeOpacity = .2;
  GeographicAreaView.HighlightedFillOpacity = .25;
  GeographicAreaView.HighlightedStrokeOpacity = .5;
  __decorate([ component.Property({
    type: Boolean,
    value: false
  }) ], GeographicAreaView.prototype, "highlighted", void 0);
  __decorate([ view.PositionGesture({
    self: true,
    didMovePress(input, event) {
      const dx = input.dx;
      const dy = input.dy;
      if (dx * dx + dy * dy >= 4 * 4) {
        input.preventDefault();
      }
    },
    didPress(input, event) {
      if (!input.defaultPrevented) {
        this.owner.callObservers("geographicDidPress", input, event, this.owner);
      }
    },
    didLongPress(input) {
      if (!input.defaultPrevented) {
        this.owner.callObservers("geographicDidLongPress", input, this.owner);
      }
    }
  }) ], GeographicAreaView.prototype, "gesture", void 0);
  class GeographicGroupView extends map.GeoView {
    highlight(timing) {
      if (!this.highlighted.value) {
        if (timing === void 0 || timing === true) {
          timing = this.getLookOr(theme.Look.timing, false);
        } else {
          timing = util.Timing.fromAny(timing);
        }
        this.willHighlight(timing);
        this.highlighted.setValue(true);
        this.onHighlight(timing);
        this.highlightChildren(timing);
        this.didHighlight(timing);
      }
    }
    willHighlight(timing) {
      this.callObservers("geographicWillHighlight", timing, this);
    }
    onHighlight(timing) {}
    didHighlight(timing) {
      this.callObservers("geographicDidHighlight", timing, this);
    }
    highlightChildren(timing) {
      let child = this.firstChild;
      while (child !== null) {
        if (GeographicView.is(child)) {
          child.highlight(timing);
        }
        child = child.nextSibling;
      }
    }
    unhighlight(timing) {
      if (this.highlighted.value) {
        if (timing === void 0 || timing === true) {
          timing = this.getLookOr(theme.Look.timing, false);
        } else {
          timing = util.Timing.fromAny(timing);
        }
        this.willUnhighlight(timing);
        this.highlighted.setValue(false);
        this.onUnhighlight(timing);
        this.unhighlightChildren(timing);
        this.didUnhighlight(timing);
      }
    }
    willUnhighlight(timing) {
      this.callObservers("geographicWillUnhighlight", timing, this);
    }
    onUnhighlight(timing) {}
    didUnhighlight(timing) {
      this.callObservers("geographicDidUnhighlight", timing, this);
    }
    unhighlightChildren(timing) {
      let child = this.firstChild;
      while (child !== null) {
        if (GeographicView.is(child)) {
          child.unhighlight(timing);
        }
        child = child.nextSibling;
      }
    }
    setState(geographic, timing) {}
    static fromGeographic(geographic) {
      const view = new GeographicGroupView;
      const geographics = geographic.geographics;
      for (let i = 0, n = geographics.length; i < n; i += 1) {
        const geographicView = GeographicView.fromGeographic(geographics[i]);
        view.appendChild(geographicView);
      }
      return view;
    }
  }
  __decorate([ component.Property({
    type: Boolean,
    value: false
  }) ], GeographicGroupView.prototype, "highlighted", void 0);
  __decorate([ view.PositionGesture({
    self: true,
    didMovePress(input, event) {
      const dx = input.dx;
      const dy = input.dy;
      if (dx * dx + dy * dy >= 4 * 4) {
        input.preventDefault();
      }
    },
    didPress(input, event) {
      if (!input.defaultPrevented) {
        this.owner.callObservers("geographicDidPress", input, event, this.owner);
      }
    },
    didLongPress(input) {
      if (!input.defaultPrevented) {
        this.owner.callObservers("geographicDidLongPress", input, this.owner);
      }
    }
  }) ], GeographicGroupView.prototype, "gesture", void 0);
  class LocationTrait extends model.Trait {
    constructor() {
      super();
      this.minZoom = -Infinity;
      this.maxZoom = Infinity;
      this.geographic = null;
    }
    setZoomRange(minZoom, maxZoom) {
      if (this.minZoom !== minZoom || this.maxZoom !== maxZoom) {
        this.willSetZoomRange(minZoom, maxZoom);
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
        this.onSetZoomRange(minZoom, maxZoom);
        this.didSetZoomRange(minZoom, maxZoom);
      }
    }
    willSetZoomRange(minZoom, maxZoom) {
      this.callObservers("locationWillSetZoomRange", minZoom, maxZoom, this);
    }
    onSetZoomRange(minZoom, maxZoom) {
      if (this.model !== null) {
        this.requireUpdate(model.Model.NeedsValidate);
      }
    }
    didSetZoomRange(minZoom, maxZoom) {
      this.callObservers("locationDidSetZoomRange", minZoom, maxZoom, this);
    }
    setGeographic(newGeographic) {
      const oldGeographic = this.geographic;
      if (!util.Equals(newGeographic, oldGeographic)) {
        this.willSetGeographic(newGeographic, oldGeographic);
        this.geographic = newGeographic;
        this.onSetGeographic(newGeographic, oldGeographic);
        this.didSetGeographic(newGeographic, oldGeographic);
      }
    }
    willSetGeographic(newGeographic, oldGeographic) {
      this.callObservers("locationWillSetGeographic", newGeographic, oldGeographic, this);
    }
    onSetGeographic(newGeographic, oldGeographic) {
      if (this.model !== null) {
        this.requireUpdate(model.Model.NeedsValidate);
      }
    }
    didSetGeographic(newGeographic, oldGeographic) {
      this.callObservers("locationDidSetGeographic", newGeographic, oldGeographic, this);
    }
  }
  class DownlinkLocationTrait extends LocationTrait {
    downlinkDidSet(value, oldValue) {}
  }
  __decorate([ client.ValueDownlinkFastener({
    consumed: true,
    didSet(newValue, oldValue) {
      this.owner.downlinkDidSet(newValue, oldValue);
    }
  }) ], DownlinkLocationTrait.prototype, "downlink", void 0);
  class DistrictTrait extends model.Trait {
    constructor() {
      super();
      this.minZoom = -Infinity;
      this.maxZoom = Infinity;
      this.boundary = null;
    }
    setZoomRange(minZoom, maxZoom) {
      if (this.minZoom !== minZoom || this.maxZoom !== maxZoom) {
        this.willSetZoomRange(minZoom, maxZoom);
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
        this.onSetZoomRange(minZoom, maxZoom);
        this.didSetZoomRange(minZoom, maxZoom);
      }
    }
    willSetZoomRange(minZoom, maxZoom) {
      this.callObservers("districtWillSetZoomRange", minZoom, maxZoom, this);
    }
    onSetZoomRange(minZoom, maxZoom) {
      if (this.model !== null) {
        this.requireUpdate(model.Model.NeedsValidate);
      }
    }
    didSetZoomRange(minZoom, maxZoom) {
      this.callObservers("districtDidSetZoomRange", minZoom, maxZoom, this);
    }
    setBoundary(newBoundary) {
      const oldBoundary = this.boundary;
      if (!util.Equals(newBoundary, oldBoundary)) {
        this.willSetBoundary(newBoundary, oldBoundary);
        this.boundary = newBoundary;
        this.onSetBoundary(newBoundary, oldBoundary);
        this.didSetBoundary(newBoundary, oldBoundary);
      }
    }
    willSetBoundary(newBoundary, oldBoundary) {
      this.callObservers("districtWillSetBoundary", newBoundary, oldBoundary, this);
    }
    onSetBoundary(newBoundary, oldBoundary) {
      if (this.model !== null) {
        this.requireUpdate(model.Model.NeedsValidate);
      }
    }
    didSetBoundary(newBoundary, oldBoundary) {
      this.callObservers("districtDidSetBoundary", newBoundary, oldBoundary, this);
    }
  }
  __decorate([ model.ModelRef({
    key: true,
    type: EntityGroup,
    binds: true,
    createModel() {
      const entityGroup = new EntityGroup;
      entityGroup.setTrait("status", new StatusTrait);
      return entityGroup;
    }
  }) ], DistrictTrait.prototype, "subdistricts", void 0);
  class DownlinkDistrictTrait extends DistrictTrait {
    downlinkDidSet(newValue, oldValue) {}
  }
  __decorate([ client.ValueDownlinkFastener({
    consumed: true,
    didSet(newValue, oldValue) {
      this.owner.downlinkDidSet(newValue, oldValue);
    }
  }) ], DownlinkDistrictTrait.prototype, "downlink", void 0);
  class AtlasEntityLocation extends controller.Controller {
    updateLevelOfDetail(viewContext) {
      this.requireUpdate(controller.Controller.NeedsRevise);
    }
    reviseLevelOfDetail() {
      const layerView = this.layer.view;
      if (layerView !== null) {
        const geoViewport = layerView.geoViewport;
        const locationTrait = this.location.trait;
        if (locationTrait !== null) {
          if (locationTrait.minZoom <= geoViewport.zoom) {
            locationTrait.consume(this);
            const geographicView = this.geographic.view;
            if (geographicView !== null) {
              geographicView.setHidden(locationTrait.maxZoom < geoViewport.zoom);
            }
          } else {
            locationTrait.unconsume(this);
          }
        }
        const districtTrait = this.district.trait;
        if (districtTrait !== null) {
          let boundary = districtTrait.boundary;
          if (boundary === null) {
            const geographicView = this.geographic.view;
            if (geographicView !== null) {
              boundary = geographicView.geoBounds;
            }
          }
          if (districtTrait.minZoom <= geoViewport.zoom && (boundary === null || boundary.bounds.intersects(geoViewport.geoFrame))) {
            if (geoViewport.zoom < districtTrait.maxZoom) {
              districtTrait.consume(this);
            } else {
              districtTrait.unconsume(this);
            }
            const entityGroup = this.subentities.model;
            if (entityGroup !== null) {
              entityGroup.consume(this);
            }
          } else {
            const entityGroup = this.subentities.model;
            if (entityGroup !== null) {
              entityGroup.unconsume(this);
            }
            districtTrait.unconsume(this);
          }
        }
      }
    }
    onRevise(controllerContext) {
      super.onRevise(controllerContext);
      this.reviseLevelOfDetail();
    }
    applyStatus(newStatusVector, oldStatusVector) {
      const geographicView = this.geographic.view;
      if (geographicView !== null) {
        const alert = newStatusVector.get(Status.alert) || 0;
        const warning = newStatusVector.get(Status.warning) || 0;
        const normal = newStatusVector.get(Status.normal);
        const inactive = newStatusVector.get(Status.inactive) || 0;
        if (alert !== 0 && warning !== 0) {
          geographicView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, alert ] ]);
          if (!oldStatusVector.isEmpty()) {
            this.ripple(geographicView.getLook(theme.Look.accentColor), 2, 5e3);
          }
        } else if (alert !== 0) {
          geographicView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, 1 ], [ theme.Feel.alert, alert ] ]);
          if (!oldStatusVector.isEmpty()) {
            this.ripple(geographicView.getLook(theme.Look.accentColor), 2, 5e3);
          }
        } else if (warning !== 0) {
          geographicView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, warning ], [ theme.Feel.alert, void 0 ] ]);
          if (!oldStatusVector.isEmpty()) {
            this.ripple(geographicView.getLook(theme.Look.accentColor), 1, 2500);
          }
        } else {
          geographicView.modifyMood(theme.Feel.default, [ [ theme.Feel.warning, void 0 ], [ theme.Feel.alert, void 0 ] ]);
          if (normal !== void 0 && !oldStatusVector.isEmpty()) {
            this.ripple(geographicView.getLook(theme.Look.accentColor), 1, 2500);
          }
        }
        if (inactive !== 0) {
          geographicView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, inactive ] ]);
        } else {
          geographicView.modifyMood(theme.Feel.default, [ [ theme.Feel.inactive, void 0 ] ]);
        }
      }
    }
    ripple(color, width, timing) {
      const geographicView = this.geographic.view;
      if (geographicView !== null && geographicView.mounted) {
        if (geographicView instanceof map.GeoCircleView || geographicView instanceof map.GeoIconView || geographicView instanceof map.GeoAreaView) {
          geographicView.ripple({
            width: width,
            color: color,
            timing: timing
          });
        }
      }
    }
    onSetGeographic(geographic) {
      if (geographic !== null) {
        let geographicView = this.geographic.view;
        if (geographicView === null) {
          geographicView = GeographicView.fromGeographic(geographic);
          geographicView.modifyTheme(theme.Feel.default, [ [ theme.Feel.primary, 1 ] ]);
          this.geographic.setView(geographicView);
        } else {
          geographicView.setState(geographic, util.Easing.linear.withDuration(5e3));
        }
        const layerView = this.layer.view;
        if (layerView !== null) {
          this.geographic.insertView(layerView);
          this.updateLevelOfDetail(layerView.viewContext);
        }
      } else {
        this.geographic.deleteView();
      }
    }
    onUnmount() {
      super.onUnmount();
      this.layer.setView(null);
      this.geographic.deleteView();
      this.subdistrict.deleteController();
    }
  }
  __decorate([ view.ViewRef({
    observes: true,
    initView(layerView) {
      const entityGroup = this.owner.subentities.model;
      if (entityGroup !== null) {
        const entityDistrict = this.owner.subdistrict.insertController();
        if (entityDistrict !== null) {
          entityDistrict.layer.setView(layerView);
        }
      }
      this.owner.updateLevelOfDetail(layerView.viewContext);
    },
    deinitView(layerView) {
      this.owner.subdistrict.deleteController();
    },
    viewDidProject(viewContext) {
      this.owner.updateLevelOfDetail(viewContext);
    }
  }) ], AtlasEntityLocation.prototype, "layer", void 0);
  __decorate([ view.ViewRef({
    observes: true,
    initView(geographicView) {
      const selectableTrait = this.owner.selectable.trait;
      if (selectableTrait !== null) {
        if (selectableTrait.selected) {
          geographicView.highlight();
        } else {
          geographicView.unhighlight();
        }
      }
      const statusTrait = this.owner.status.trait;
      if (statusTrait !== null) {
        this.owner.applyStatus(statusTrait.statusVector, StatusVector.empty());
      }
      if (geographicView.mounted) {
        this.owner.updateLevelOfDetail(geographicView.viewContext);
      }
    },
    geographicDidPress(input, event, geographicView) {
      const selectableTrait = this.owner.selectable.trait;
      if (selectableTrait !== null) {
        if (!selectableTrait.selected) {
          selectableTrait.select({
            multi: input.shiftKey
          });
        } else if (input.shiftKey) {
          selectableTrait.unselect();
        } else {
          selectableTrait.unselectAll();
        }
      }
    },
    geographicDidLongPress(input, geographicView) {
      input.preventDefault();
      const selectableTrait = this.owner.selectable.trait;
      if (selectableTrait !== null) {
        if (!selectableTrait.selected) {
          selectableTrait.select({
            multi: true
          });
        } else {
          selectableTrait.unselect();
        }
      }
    }
  }) ], AtlasEntityLocation.prototype, "geographic", void 0);
  __decorate([ controller.ControllerRef({
    initController(subdistrict) {
      const layerView = this.owner.layer.view;
      if (layerView !== null) {
        subdistrict.layer.setView(layerView);
        this.owner.updateLevelOfDetail(layerView.viewContext);
      }
    },
    createController() {
      return new AtlasEntityDistrict;
    }
  }) ], AtlasEntityLocation.prototype, "subdistrict", void 0);
  __decorate([ model.TraitRef({
    type: EntityTrait,
    observes: true,
    initTrait(entityTrait) {
      const geographicView = this.owner.geographic.view;
      if (geographicView !== null) {
        this.owner.updateLevelOfDetail(geographicView.viewContext);
      }
      this.owner.selectable.setTrait(entityTrait.getTrait(model.SelectableTrait));
      this.owner.status.setTrait(entityTrait.getTrait(StatusTrait));
      this.owner.location.setTrait(entityTrait.getTrait(LocationTrait));
      this.owner.district.setTrait(entityTrait.getTrait(DistrictTrait));
    },
    traitDidValidate(modelContext, entityTrait) {
      const layerView = this.owner.layer.view;
      if (layerView !== null) {
        this.owner.updateLevelOfDetail(layerView.viewContext);
      }
    },
    traitDidInsertTrait(memberTrait, targetTrait) {
      if (memberTrait instanceof model.SelectableTrait) {
        this.owner.selectable.setTrait(memberTrait);
      } else if (memberTrait instanceof StatusTrait) {
        this.owner.status.setTrait(memberTrait);
      } else if (memberTrait instanceof LocationTrait) {
        this.owner.location.setTrait(memberTrait);
      } else if (memberTrait instanceof DistrictTrait) {
        this.owner.district.setTrait(memberTrait);
      }
    }
  }) ], AtlasEntityLocation.prototype, "entity", void 0);
  __decorate([ model.TraitRef({
    type: model.SelectableTrait,
    observes: true,
    initTrait(selectableTrait) {
      const geographicView = this.owner.geographic.view;
      if (geographicView !== null) {
        if (selectableTrait.selected) {
          geographicView.highlight();
        } else {
          geographicView.unhighlight();
        }
        this.owner.updateLevelOfDetail(geographicView.viewContext);
      }
    },
    traitDidSelect(options, selectableTrait) {
      const geographicView = this.owner.geographic.view;
      if (geographicView !== null) {
        geographicView.highlight();
      }
    },
    traitWillUnselect(selectableTrait) {
      const geographicView = this.owner.geographic.view;
      if (geographicView !== null) {
        geographicView.unhighlight();
      }
    }
  }) ], AtlasEntityLocation.prototype, "selectable", void 0);
  __decorate([ model.TraitRef({
    type: StatusTrait,
    observes: true,
    initTrait(statusTrait) {
      this.owner.applyStatus(statusTrait.statusVector, StatusVector.empty());
    },
    traitDidSetStatusVector(newStatusVector, oldStatusVector) {
      this.owner.applyStatus(newStatusVector, oldStatusVector);
    }
  }) ], AtlasEntityLocation.prototype, "status", void 0);
  __decorate([ model.TraitRef({
    type: DistrictTrait,
    observes: true,
    initTrait(districtTrait) {
      this.owner.subentities.setModel(districtTrait.subdistricts.model);
    },
    traitDidInsertChild(child, target, districtTrait) {
      if (child === districtTrait.subdistricts.model) {
        this.owner.subentities.setModel(child);
      }
    },
    districtDidSetZoomRange(minZoom, maxZoom, districtTrait) {
      districtTrait.requireUpdate(model.Model.NeedsValidate);
    },
    districtDidSetBoundary(newBoundary, oldBoundary, districtTrait) {
      districtTrait.requireUpdate(model.Model.NeedsValidate);
    }
  }) ], AtlasEntityLocation.prototype, "district", void 0);
  __decorate([ model.TraitRef({
    type: LocationTrait,
    observes: true,
    initTrait(locationTrait) {
      this.owner.onSetGeographic(locationTrait.geographic);
    },
    locationDidSetZoomRange(minZoom, maxZoom, locationTrait) {
      locationTrait.requireUpdate(model.Model.NeedsValidate);
    },
    locationDidSetGeographic(geographic) {
      this.owner.onSetGeographic(geographic);
    },
    traitWillStartConsuming() {
      const geographicView = this.owner.geographic.view;
      if (geographicView !== null) {
        const layerView = this.owner.layer.view;
        if (layerView !== null) {
          this.owner.geographic.insertView(layerView);
        }
      }
    },
    traitDidStopConsuming() {
      this.owner.geographic.deleteView();
    }
  }) ], AtlasEntityLocation.prototype, "location", void 0);
  __decorate([ model.ModelRef({
    type: EntityGroup,
    observes: true,
    didAttachModel(entityGroup) {
      const entityDistrict = this.owner.subdistrict.insertController();
      if (entityDistrict !== null) {
        entityDistrict.entities.setModel(entityGroup);
      }
    },
    willDetachModel(entityGroup) {
      this.owner.subdistrict.deleteController();
    },
    modelDidStopConsuming(entityGroup) {
      entityGroup.removeChildren();
    }
  }) ], AtlasEntityLocation.prototype, "subentities", void 0);
  class AtlasEntityDistrict extends controller.Controller {
    onInsertLocation(locationController) {
      const layerView = this.layer.view;
      if (layerView !== null) {
        locationController.layer.setView(layerView);
      }
    }
    onUnmount() {
      super.onUnmount();
      this.layer.setView(null);
    }
  }
  __decorate([ view.ViewRef({
    type: map.GeoView,
    initView(layerView) {
      let child = this.owner.firstChild;
      while (child !== null) {
        if (child instanceof AtlasEntityLocation) {
          this.owner.onInsertLocation(child);
        }
        child = child.nextSibling;
      }
    },
    createView() {
      return map.GeoView.create();
    }
  }) ], AtlasEntityDistrict.prototype, "layer", void 0);
  __decorate([ controller.TraitControllerSet({
    type: AtlasEntityLocation,
    binds: true,
    getTraitRef(locationController) {
      return locationController.entity;
    },
    didAttachController(locationController) {
      this.owner.onInsertLocation(locationController);
    },
    willDetachController(locationController) {
      locationController.geographic.deleteView();
    },
    createController() {
      return new AtlasEntityLocation;
    }
  }) ], AtlasEntityDistrict.prototype, "locations", void 0);
  __decorate([ model.ModelRef({
    type: EntityGroup,
    observes: true,
    initModel(entityGroup) {
      let entityModel = entityGroup.firstChild;
      while (entityModel !== null) {
        const entityTrait = entityModel.getTrait(EntityTrait);
        if (entityTrait !== null) {
          this.owner.locations.addTraitController(entityTrait);
        }
        entityModel = entityModel.nextSibling;
      }
    },
    modelDidInsertChild(child, target) {
      const childEntityTrait = child.getTrait(EntityTrait);
      if (childEntityTrait !== null) {
        const targetEntityTrait = target !== null ? target.getTrait(EntityTrait) : null;
        this.owner.locations.addTraitController(childEntityTrait, targetEntityTrait);
      }
    },
    modelWillRemoveChild(child) {
      const childEntityTrait = child.getTrait(EntityTrait);
      if (childEntityTrait !== null) {
        this.owner.locations.deleteTraitController(childEntityTrait);
      }
    }
  }) ], AtlasEntityDistrict.prototype, "entities", void 0);
  class AtlasMap extends controller.Controller {}
  class AtlasWorldMap extends AtlasMap {
    createWorld() {
      const worldView = new map.GeoRasterView;
      const FillAnimator = theme.ThemeAnimator.define("fill", {
        type: style.Color
      });
      const fillAnimator = FillAnimator.create(worldView);
      fillAnimator.setLook(theme.Look.subduedColor, component.Affinity.Intrinsic);
      worldView.setFastener("fill", fillAnimator);
      function addWorldGeometry(shapes, mapView) {
        for (let i = 0; i < shapes.length; i += 1) {
          const shape = shapes[i];
          if (shape instanceof geo.GeoGroup) {
            const layerView = mapView.appendChild(map.GeoView);
            addWorldGeometry(shape.shapes, layerView);
          } else if (shape instanceof geo.GeoPath) {
            const shapeView = mapView.appendChild(map.GeoAreaView);
            shapeView.geoPath.setState(shape);
            shapeView.fill.setInherits(true);
          }
        }
      }
      const worldGeometry = geo.GeoJson.toShape({
        type: "GeometryCollection",
        geometries: [ {
          type: "MultiPolygon",
          coordinates: [ [ [ [ -4.58, 53.29 ], [ -4.43, 53.43 ], [ -4.04, 53.31 ], [ -4.1, 53.25 ], [ -4.21, 53.21 ], [ -4.22, 53.19 ], [ -4.3, 53.15 ], [ -4.34, 53.15 ], [ -4.33, 53.13 ], [ -4.58, 53.29 ] ] ], [ [ [ -5.06, 55.85 ], [ -5.03, 55.72 ], [ -5.19, 55.93 ], [ -5.06, 55.85 ] ] ], [ [ [ -6.07, 55.92 ], [ -5.7, 56.15 ], [ -5.96, 55.79 ], [ -6.07, 55.92 ] ] ], [ [ [ -6.33, 55.61 ], [ -6.46, 55.85 ], [ -6.12, 55.94 ], [ -6.02, 55.68 ], [ -6.33, 55.61 ] ] ], [ [ [ -6.11, 57.18 ], [ -6.79, 57.42 ], [ -6.72, 57.51 ], [ -6.58, 57.42 ], [ -6.63, 57.61 ], [ -6.31, 57.46 ], [ -6.35, 57.71 ], [ -6.17, 57.3 ], [ -5.65, 57.26 ], [ -6, 57.02 ], [ -5.84, 57.19 ], [ -6.11, 57.18 ] ] ], [ [ [ -5.67, 56.42 ], [ -6.38, 56.31 ], [ -5.98, 56.39 ], [ -6.2, 56.36 ], [ -6, 56.5 ], [ -6.34, 56.54 ], [ -6.13, 56.66 ], [ -5.67, 56.42 ] ] ], [ [ [ -7.27, 57.51 ], [ -7.55, 57.61 ], [ -7.16, 57.74 ], [ -7.27, 57.51 ] ] ], [ [ [ -157.31, 21.1 ], [ -157.25, 21.22 ], [ -156.71, 21.16 ], [ -156.87, 21.05 ], [ -157.31, 21.1 ] ] ], [ [ [ 11.86, 54.77 ], [ 11.75, 54.96 ], [ 12.17, 54.84 ], [ 11.97, 54.56 ], [ 11.86, 54.77 ] ] ], [ [ [ 10.98, 54.83 ], [ 11.18, 54.96 ], [ 11.64, 54.8 ], [ 11.65, 54.9 ], [ 11.86, 54.69 ], [ 11.5, 54.59 ], [ 10.98, 54.83 ] ] ], [ [ [ -16.99, 21.55 ], [ -16.81, 22.16 ], [ -16.49, 22.33 ], [ -16.2, 23.11 ], [ -15.71, 23.83 ], [ -15.77, 23.92 ], [ -16, 23.63 ], [ -15.9, 23.82 ], [ -14.88, 24.7 ], [ -14.83, 25.3 ], [ -14.48, 26.18 ], [ -13.57, 26.74 ], [ -13.16, 27.69 ], [ -12.92, 27.95 ], [ -11.51, 28.31 ], [ -10.22, 29.31 ], [ -9.65, 30.12 ], [ -9.61, 30.41 ], [ -9.89, 30.63 ], [ -9.84, 31.39 ], [ -9.26, 32.18 ], [ -9.28, 32.54 ], [ -8.53, 33.26 ], [ -6.82, 34.03 ], [ -6.26, 34.83 ], [ -5.93, 35.79 ], [ -5.31, 35.9 ], [ -5.24, 35.55 ], [ -4.43, 35.15 ], [ -3.71, 35.29 ], [ -3.34, 35.19 ], [ -2.98, 35.44 ], [ -2.83, 35.11 ], [ -2.85, 35.21 ], [ -1.96, 35.07 ], [ -1.29, 35.36 ], [ -.94, 35.73 ], [ -.63, 35.71 ], [ -.38, 35.91 ], [ -.1, 35.79 ], [ .34, 36.19 ], [ 1.34, 36.55 ], [ 2.56, 36.59 ], [ 2.89, 36.8 ], [ 3.49, 36.77 ], [ 3.89, 36.92 ], [ 4.79, 36.89 ], [ 5.37, 36.64 ], [ 6.47, 37.09 ], [ 6.93, 36.88 ], [ 7.39, 37.08 ], [ 7.91, 36.84 ], [ 8.78, 36.95 ], [ 9.22, 37.24 ], [ 9.84, 37.34 ], [ 9.82, 37.14 ], [ 9.89, 37.28 ], [ 10.28, 37.18 ], [ 10.13, 37.14 ], [ 10.35, 36.73 ], [ 11.04, 37.09 ], [ 11.14, 36.87 ], [ 10.81, 36.46 ], [ 10.54, 36.38 ], [ 10.46, 36.01 ], [ 11.05, 35.62 ], [ 11.17, 35.23 ], [ 10.73, 34.65 ], [ 10.02, 34.18 ], [ 10.43, 33.63 ], [ 10.72, 33.71 ], [ 10.78, 33.47 ], [ 11, 33.65 ], [ 11.1, 33.36 ], [ 11.29, 33.28 ], [ 11.13, 33.32 ], [ 11.18, 33.21 ], [ 11.45, 33.18 ], [ 11.33, 33.27 ], [ 12.3, 32.84 ], [ 13.38, 32.9 ], [ 15.23, 32.37 ], [ 15.74, 31.4 ], [ 17.86, 30.92 ], [ 18.97, 30.28 ], [ 19.62, 30.42 ], [ 20.06, 30.86 ], [ 20.18, 31.15 ], [ 19.92, 31.76 ], [ 20.03, 32.12 ], [ 20.57, 32.55 ], [ 21.72, 32.94 ], [ 23.11, 32.64 ], [ 23.1, 32.31 ], [ 23.32, 32.15 ], [ 24.98, 31.97 ], [ 25.2, 31.52 ], [ 25.91, 31.63 ], [ 26.98, 31.44 ], [ 29.02, 30.82 ], [ 29.48, 30.94 ], [ 30.07, 31.33 ], [ 30.22, 31.29 ], [ 30.38, 31.48 ], [ 31.05, 31.6 ], [ 31.57, 31.44 ], [ 31.93, 31.52 ], [ 32.34, 31.3 ], [ 32.27, 31.24 ], [ 32.3, 30.34 ], [ 32.52, 30.25 ], [ 32.59, 29.98 ], [ 32.34, 29.59 ], [ 32.59, 29.34 ], [ 32.62, 28.98 ], [ 33.58, 27.85 ], [ 33.49, 27.64 ], [ 33.85, 27.25 ], [ 33.94, 26.67 ], [ 35.14, 24.51 ], [ 35.79, 23.91 ], [ 35.47, 23.93 ], [ 35.67, 22.95 ], [ 36.89, 22.07 ], [ 36.98, 21.4 ], [ 37.32, 21.07 ], [ 37.26, 20.99 ], [ 37.1, 21.2 ], [ 37.22, 19.61 ], [ 37.41, 18.87 ], [ 38.12, 18.41 ], [ 38.08, 18.29 ], [ 38.28, 18.3 ], [ 38.55, 18.08 ], [ 38.92, 17.41 ], [ 39.24, 16.07 ], [ 39.71, 15.09 ], [ 39.85, 15.17 ], [ 39.88, 15.51 ], [ 40.21, 14.95 ], [ 40.53, 15.02 ], [ 40.78, 14.71 ], [ 41.19, 14.62 ], [ 41.69, 13.93 ], [ 41.97, 13.85 ], [ 42.24, 13.54 ], [ 42.24, 13.64 ], [ 42.39, 13.21 ], [ 42.55, 13.23 ], [ 42.79, 12.84 ], [ 42.93, 12.78 ], [ 43.01, 12.89 ], [ 42.89, 12.96 ], [ 42.98, 12.93 ], [ 43.33, 12.48 ], [ 43.37, 11.98 ], [ 42.53, 11.52 ], [ 43.15, 11.62 ], [ 43.51, 11.37 ], [ 43.89, 10.73 ], [ 44.3, 10.43 ], [ 44.59, 10.38 ], [ 44.96, 10.41 ], [ 45.8, 10.87 ], [ 46.44, 10.68 ], [ 47.41, 11.18 ], [ 48.14, 11.13 ], [ 48.53, 11.31 ], [ 49.42, 11.34 ], [ 50.27, 11.59 ], [ 50.77, 11.99 ], [ 51.29, 11.83 ], [ 51.08, 11.27 ], [ 51.17, 10.58 ], [ 51.03, 10.45 ], [ 51.24, 10.43 ], [ 51.19, 10.54 ], [ 51.41, 10.42 ], [ 50.9, 10.31 ], [ 50.83, 9.42 ], [ 50.13, 8.2 ], [ 49.82, 7.92 ], [ 48.93, 5.96 ], [ 47.96, 4.47 ], [ 46.01, 2.43 ], [ 44.6, 1.6 ], [ 43.51, .66 ], [ 42.07, -.84 ], [ 41.31, -1.97 ], [ 41.22, -1.89 ], [ 41.01, -2.05 ], [ 41.01, -1.9 ], [ 40.95, -2.08 ], [ 40.78, -1.94 ], [ 40.93, -2.23 ], [ 40.72, -2.22 ], [ 40.77, -2.45 ], [ 40.22, -2.7 ], [ 40.14, -3.06 ], [ 40.24, -2.99 ], [ 39.54, -4.44 ], [ 39.4, -4.65 ], [ 39.31, -4.55 ], [ 39.18, -4.69 ], [ 38.78, -6.07 ], [ 38.86, -6.39 ], [ 39.55, -6.99 ], [ 39.27, -7.4 ], [ 39.21, -7.85 ], [ 39.38, -7.83 ], [ 39.41, -7.95 ], [ 39.38, -8.14 ], [ 39.22, -8.2 ], [ 39.27, -8.57 ], [ 39.56, -8.93 ], [ 39.39, -8.83 ], [ 39.33, -8.96 ], [ 39.48, -8.95 ], [ 39.49, -9.22 ], [ 39.55, -9.09 ], [ 39.64, -9.18 ], [ 39.65, -9.37 ], [ 39.51, -9.41 ], [ 39.73, -9.6 ], [ 39.71, -9.99 ], [ 39.9, -10.04 ], [ 39.96, -10.23 ], [ 39.99, -10.13 ], [ 40.15, -10.3 ], [ 40.24, -10.21 ], [ 40.4, -10.3 ], [ 40.64, -10.69 ], [ 40.48, -10.75 ], [ 40.62, -10.83 ], [ 40.36, -11.33 ], [ 40.55, -12 ], [ 40.45, -12.41 ], [ 40.63, -12.75 ], [ 40.4, -12.95 ], [ 40.59, -12.97 ], [ 40.64, -14.03 ], [ 40.53, -14.17 ], [ 40.74, -14.28 ], [ 40.62, -14.33 ], [ 40.63, -14.6 ], [ 40.83, -14.45 ], [ 40.83, -14.84 ], [ 40.65, -14.91 ], [ 40.77, -15.01 ], [ 40.64, -14.97 ], [ 40.71, -15.08 ], [ 40.52, -15.13 ], [ 40.68, -15.25 ], [ 40.57, -15.5 ], [ 40.03, -16.19 ], [ 39.81, -16.28 ], [ 39.95, -16.3 ], [ 39.91, -16.41 ], [ 39.07, -17.01 ], [ 38.25, -17.23 ], [ 37.3, -17.69 ], [ 36.98, -18.02 ], [ 36.9, -17.96 ], [ 36.32, -18.86 ], [ 35.78, -19.05 ], [ 34.97, -19.81 ], [ 34.68, -19.74 ], [ 34.78, -20.14 ], [ 34.68, -20.52 ], [ 35.13, -20.93 ], [ 35.02, -21.11 ], [ 35.35, -22.19 ], [ 35.47, -22.1 ], [ 35.52, -22.24 ], [ 35.55, -22.14 ], [ 35.6, -22.94 ], [ 35.32, -23.95 ], [ 35.54, -23.79 ], [ 35.5, -24.11 ], [ 35.12, -24.61 ], [ 33.2, -25.34 ], [ 32.83, -25.59 ], [ 32.75, -25.87 ], [ 32.41, -26.03 ], [ 32.43, -26.14 ], [ 32.55, -25.97 ], [ 32.9, -26.34 ], [ 32.96, -26.08 ], [ 32.87, -27.01 ], [ 32.4, -28.53 ], [ 31.34, -29.38 ], [ 30.23, -31.06 ], [ 28.55, -32.57 ], [ 27.11, -33.52 ], [ 26.47, -33.77 ], [ 25.84, -33.72 ], [ 25.63, -33.86 ], [ 25.7, -34.03 ], [ 25.02, -33.97 ], [ 24.84, -34.21 ], [ 23.65, -33.98 ], [ 23.41, -34.11 ], [ 22.56, -34 ], [ 22.16, -34.08 ], [ 21.83, -34.38 ], [ 20.53, -34.47 ], [ 20.01, -34.83 ], [ 19.3, -34.63 ], [ 19.28, -34.41 ], [ 18.83, -34.39 ], [ 18.78, -34.09 ], [ 18.44, -34.14 ], [ 18.5, -34.36 ], [ 18.38, -34.27 ], [ 18.44, -33.69 ], [ 17.84, -32.83 ], [ 17.97, -32.7 ], [ 18.15, -32.77 ], [ 18.32, -32.55 ], [ 18.22, -31.74 ], [ 17.28, -30.35 ], [ 16.82, -29.09 ], [ 15.68, -27.95 ], [ 15.29, -27.32 ], [ 15.12, -26.44 ], [ 14.95, -26.31 ], [ 14.88, -25.08 ], [ 14.45, -24.04 ], [ 14.51, -22.55 ], [ 13.42, -20.88 ], [ 12.6, -19.13 ], [ 12.03, -18.49 ], [ 11.74, -17.59 ], [ 11.73, -15.87 ], [ 12, -15.63 ], [ 12.15, -15.18 ], [ 12.53, -13.42 ], [ 12.98, -12.98 ], [ 12.94, -12.83 ], [ 13.38, -12.59 ], [ 13.65, -12.25 ], [ 13.87, -11.01 ], [ 12.99, -9.09 ], [ 13.4, -8.75 ], [ 13.39, -8.39 ], [ 12.83, -6.99 ], [ 12.27, -6.14 ], [ 12.65, -6.15 ], [ 12.6, -6.05 ], [ 13.1, -5.88 ], [ 12.4, -6.03 ], [ 12.15, -5.69 ], [ 12.18, -5.32 ], [ 11.8, -4.57 ], [ 9.63, -2.41 ], [ 9.27, -1.88 ], [ 9.55, -2.1 ], [ 9.5, -1.9 ], [ 9.27, -1.87 ], [ 8.7, -.67 ], [ 8.89, -.85 ], [ 8.96, -.66 ], [ 9.12, -.7 ], [ 9.29, -.39 ], [ 9.35, .35 ], [ 9.47, .03 ], [ 9.51, .17 ], [ 9.58, .02 ], [ 9.62, .15 ], [ 9.86, .02 ], [ 9.76, .12 ], [ 9.87, .18 ], [ 9.57, .36 ], [ 9.5, .29 ], [ 9.31, .52 ], [ 9.5, .67 ], [ 9.62, .55 ], [ 9.55, .94 ], [ 9.66, 1.07 ], [ 9.34, 1.18 ], [ 9.81, 1.92 ], [ 9.78, 2.32 ], [ 9.97, 3.09 ], [ 9.54, 3.83 ], [ 9.71, 3.85 ], [ 9.65, 4.03 ], [ 9.41, 3.89 ], [ 9.02, 4.07 ], [ 8.8, 4.8 ], [ 8.8, 4.54 ], [ 8.68, 4.65 ], [ 8.76, 4.83 ], [ 8.63, 4.71 ], [ 8.72, 4.5 ], [ 8.56, 4.49 ], [ 8.62, 4.82 ], [ 8.4, 4.74 ], [ 8.27, 5.07 ], [ 8.27, 4.84 ], [ 8.13, 4.96 ], [ 8.28, 4.54 ], [ 7.61, 4.47 ], [ 7.61, 4.61 ], [ 7.37, 4.5 ], [ 7.29, 4.61 ], [ 7.27, 4.5 ], [ 7.09, 4.7 ], [ 7.13, 4.57 ], [ 7.02, 4.72 ], [ 7.05, 4.57 ], [ 6.77, 4.72 ], [ 6.82, 4.45 ], [ 6.72, 4.41 ], [ 6.72, 4.61 ], [ 6.7, 4.42 ], [ 6.61, 4.54 ], [ 6.7, 4.34 ], [ 5.98, 4.31 ], [ 5.61, 4.63 ], [ 5.35, 5.17 ], [ 5.32, 5.37 ], [ 5.54, 5.37 ], [ 5.52, 5.5 ], [ 5.66, 5.54 ], [ 5.52, 5.52 ], [ 5.43, 5.42 ], [ 5.39, 5.58 ], [ 5.31, 5.64 ], [ 5.35, 5.81 ], [ 5.29, 5.92 ], [ 5.06, 5.77 ], [ 4.6, 6.29 ], [ 3.9, 6.44 ], [ 1.38, 6.18 ], [ 1.08, 6.05 ], [ .93, 5.79 ], [ .19, 5.74 ], [ -2.05, 4.74 ], [ -2.38, 4.94 ], [ -3.98, 5.26 ], [ -5.85, 5.04 ], [ -7.62, 4.36 ], [ -9.3, 5.15 ], [ -10.06, 5.94 ], [ -10.79, 6.29 ], [ -11.56, 7 ], [ -12.52, 7.39 ], [ -12.35, 7.38 ], [ -12.49, 7.45 ], [ -12.34, 7.55 ], [ -12.54, 7.65 ], [ -12.48, 7.78 ], [ -12.71, 7.7 ], [ -12.93, 7.88 ], [ -12.98, 8.22 ], [ -13.16, 8.17 ], [ -13.29, 8.42 ], [ -13.21, 8.49 ], [ -13.07, 8.33 ], [ -13.14, 8.45 ], [ -12.91, 8.55 ], [ -13.15, 8.52 ], [ -13.24, 8.66 ], [ -13.24, 8.83 ], [ -13.11, 8.83 ], [ -13.29, 8.97 ], [ -13.27, 9.39 ], [ -13.43, 9.27 ], [ -13.59, 9.56 ], [ -13.45, 9.71 ], [ -13.73, 9.51 ], [ -13.5, 9.78 ], [ -13.62, 9.77 ], [ -13.67, 9.99 ], [ -13.8, 9.84 ], [ -14.16, 10.06 ], [ -14.07, 10.15 ], [ -14.19, 10.29 ], [ -14.45, 10.21 ], [ -14.64, 10.47 ], [ -14.58, 10.49 ], [ -14.61, 10.48 ], [ -14.52, 10.56 ], [ -14.59, 10.59 ], [ -14.5, 10.59 ], [ -14.62, 10.65 ], [ -14.51, 10.85 ], [ -14.74, 10.7 ], [ -14.66, 10.91 ], [ -14.81, 10.82 ], [ -14.69, 11.03 ], [ -14.62, 10.95 ], [ -14.68, 11.1 ], [ -15.1, 10.94 ], [ -14.9, 11.17 ], [ -14.95, 11.33 ], [ -15.14, 11.07 ], [ -15.15, 11.27 ], [ -15.23, 11.12 ], [ -15.41, 11.21 ], [ -15.2, 11.49 ], [ -15.5, 11.33 ], [ -15.28, 11.62 ], [ -14.97, 11.59 ], [ -15.33, 11.69 ], [ -15.43, 11.54 ], [ -15.51, 11.78 ], [ -15.01, 11.99 ], [ -15.41, 11.96 ], [ -15.81, 11.74 ], [ -15.78, 11.88 ], [ -15.95, 11.73 ], [ -15.8, 12.02 ], [ -15.98, 12.09 ], [ -15.96, 11.92 ], [ -16.2, 11.91 ], [ -16.35, 12.1 ], [ -16.13, 12.29 ], [ -16.35, 12.19 ], [ -16.54, 12.34 ], [ -16.44, 12.18 ], [ -16.77, 12.41 ], [ -16.58, 12.64 ], [ -16.44, 12.37 ], [ -16.53, 12.59 ], [ -16.12, 12.59 ], [ -16.56, 12.67 ], [ -16.77, 12.58 ], [ -16.82, 13.34 ], [ -16.53, 13.51 ], [ -16.64, 13.71 ], [ -16.49, 14 ], [ -16.68, 13.85 ], [ -17.19, 14.66 ], [ -17.53, 14.74 ], [ -17.13, 14.91 ], [ -16.57, 15.71 ], [ -16.02, 17.98 ], [ -16.19, 18.93 ], [ -16.53, 19.37 ], [ -16.3, 19.47 ], [ -16.47, 19.42 ], [ -16.2, 20.21 ], [ -16.49, 20.72 ], [ -16.53, 20.56 ], [ -16.68, 20.68 ], [ -16.92, 21.16 ], [ -17.1, 20.83 ], [ -16.99, 21.55 ] ] ], [ [ [ -16.42, 19.77 ], [ -16.35, 19.86 ], [ -16.43, 19.6 ], [ -16.42, 19.77 ] ] ], [ [ [ 10.61, 55.06 ], [ 10.07, 55.08 ], [ 9.68, 55.52 ], [ 10.31, 55.62 ], [ 10.47, 55.44 ], [ 10.62, 55.62 ], [ 10.75, 55.48 ], [ 10.54, 55.44 ], [ 10.86, 55.29 ], [ 10.61, 55.06 ] ] ], [ [ [ 9.77, 57.08 ], [ 8.67, 56.95 ], [ 8.4, 56.68 ], [ 8.55, 56.58 ], [ 8.21, 56.72 ], [ 8.59, 57.12 ], [ 9.39, 57.16 ], [ 9.96, 57.6 ], [ 10.65, 57.75 ], [ 10.34, 56.99 ], [ 10.01, 57.09 ], [ 9.77, 57.08 ] ] ], [ [ [ -16.18, 11.03 ], [ -16.25, 11.1 ], [ -16.06, 11.19 ], [ -16.18, 11.03 ] ] ], [ [ [ 11.65, 58.25 ], [ 11.83, 58.12 ], [ 11.48, 58.07 ], [ 11.65, 58.25 ] ] ], [ [ [ -12.56, 7.4 ], [ -12.96, 7.57 ], [ -12.59, 7.64 ], [ -12.56, 7.4 ] ] ], [ [ [ 12.13, 54.9 ], [ 12.26, 55.06 ], [ 12.55, 54.98 ], [ 12.13, 54.9 ] ] ], [ [ [ 14.7, 55.12 ], [ 14.77, 55.3 ], [ 15.16, 55.08 ], [ 15.07, 54.99 ], [ 14.7, 55.12 ] ] ], [ [ [ 12.42, 56.1 ], [ 12.62, 56.04 ], [ 12.64, 55.72 ], [ 12.2, 55.51 ], [ 12.45, 55.29 ], [ 12.02, 55.16 ], [ 12.18, 55.11 ], [ 12.03, 54.96 ], [ 11.62, 55.08 ], [ 11.83, 55.04 ], [ 11.71, 55.21 ], [ 11.26, 55.2 ], [ 10.93, 55.67 ], [ 11.1, 55.68 ], [ 10.87, 55.74 ], [ 11.5, 55.85 ], [ 11.28, 56.01 ], [ 11.78, 55.98 ], [ 11.65, 55.72 ], [ 11.84, 55.68 ], [ 11.95, 55.93 ], [ 12.08, 55.65 ], [ 12.02, 55.96 ], [ 11.84, 55.97 ], [ 12.42, 56.1 ] ] ], [ [ [ 16.45, 56.63 ], [ 17.12, 57.36 ], [ 16.4, 56.19 ], [ 16.45, 56.63 ] ] ], [ [ [ 28.21, 36.45 ], [ 28.09, 36.05 ], [ 27.77, 35.89 ], [ 27.68, 36.16 ], [ 28.21, 36.45 ] ] ], [ [ [ 25.74, 40.19 ], [ 26.01, 40.15 ], [ 25.74, 40.09 ], [ 25.74, 40.19 ] ] ], [ [ [ 25.6, 40.5 ], [ 25.7, 40.42 ], [ 25.44, 40.48 ], [ 25.6, 40.5 ] ] ], [ [ [ 32.76, 46.03 ], [ 32.55, 46.07 ], [ 33.08, 46.02 ], [ 32.76, 46.03 ] ] ], [ [ [ 31.89, 46.19 ], [ 31.59, 46.25 ], [ 31.52, 46.36 ], [ 31.6, 46.25 ], [ 32.04, 46.17 ], [ 31.89, 46.19 ] ] ], [ [ [ 119.88, 11.96 ], [ 120.07, 11.79 ], [ 119.96, 11.66 ], [ 119.88, 11.96 ] ] ], [ [ [ 122.17, 6.46 ], [ 121.96, 6.41 ], [ 121.8, 6.64 ], [ 122.06, 6.75 ], [ 122.32, 6.63 ], [ 122.17, 6.46 ] ] ], [ [ [ 118.42, 9.25 ], [ 117.17, 8.34 ], [ 117.63, 9.05 ], [ 118.13, 9.34 ], [ 118.76, 10.13 ], [ 118.81, 10.03 ], [ 118.99, 10.41 ], [ 119.26, 10.48 ], [ 119.34, 10.73 ], [ 119.22, 10.95 ], [ 119.46, 10.72 ], [ 119.3, 11.01 ], [ 119.5, 11.42 ], [ 119.48, 10.87 ], [ 119.72, 10.51 ], [ 119.32, 10.31 ], [ 119.2, 10.05 ], [ 118.75, 9.93 ], [ 118.76, 9.67 ], [ 118.42, 9.25 ] ] ], [ [ [ 121.85, 14.9 ], [ 121.84, 15.04 ], [ 122.05, 15.01 ], [ 121.95, 14.63 ], [ 121.85, 14.9 ] ] ], [ [ [ 121.99, 12.16 ], [ 121.92, 12.31 ], [ 122.12, 12.67 ], [ 121.99, 12.16 ] ] ], [ [ [ 123.66, 12.34 ], [ 124.05, 11.97 ], [ 124.07, 11.72 ], [ 123.53, 12.21 ], [ 123.14, 11.93 ], [ 123.3, 12.21 ], [ 123.24, 12.6 ], [ 123.38, 12.54 ], [ 123.33, 12.43 ], [ 123.44, 12.52 ], [ 123.66, 12.34 ] ] ], [ [ [ 121.42, 5.99 ], [ 121.29, 5.86 ], [ 120.87, 5.94 ], [ 121.03, 6.09 ], [ 121.42, 5.99 ] ] ], [ [ [ -8.71, 70.92 ], [ -9.04, 70.83 ], [ -7.95, 71.16 ], [ -8, 71.02 ], [ -8.71, 70.92 ] ] ], [ [ [ -7.06, 58.18 ], [ -6.86, 58.11 ], [ -6.8, 58.3 ], [ -6.22, 58.5 ], [ -6.38, 58.23 ], [ -6.15, 58.22 ], [ -6.63, 58.08 ], [ -6.38, 58.1 ], [ -6.47, 57.94 ], [ -6.69, 58.06 ], [ -6.67, 57.88 ], [ -6.97, 57.73 ], [ -7.13, 57.84 ], [ -6.81, 57.9 ], [ -7.11, 57.99 ], [ -6.91, 58.05 ], [ -7.06, 58.18 ] ] ], [ [ [ 9.29, 41.59 ], [ 9.2, 41.36 ], [ 8.79, 41.56 ], [ 8.92, 41.69 ], [ 8.66, 41.74 ], [ 8.8, 41.9 ], [ 8.61, 41.89 ], [ 8.75, 42.05 ], [ 8.54, 42.37 ], [ 8.72, 42.58 ], [ 9.3, 42.68 ], [ 9.42, 43.01 ], [ 9.56, 42.13 ], [ 9.29, 41.59 ] ] ], [ [ [ 27.03, 37.77 ], [ 26.86, 37.64 ], [ 26.57, 37.73 ], [ 27.03, 37.77 ] ] ], [ [ [ -122.47, 48.13 ], [ -122.46, 48.27 ], [ -122.36, 48.06 ], [ -122.47, 48.13 ] ] ], [ [ [ 23.76, 70.52 ], [ 23.68, 70.75 ], [ 24.13, 70.61 ], [ 23.76, 70.52 ] ] ], [ [ [ -122.76, 48.24 ], [ -122.6, 48.41 ], [ -122.51, 48.3 ], [ -122.73, 48.23 ], [ -122.38, 47.91 ], [ -122.76, 48.24 ] ] ], [ [ [ -90.52, -.71 ], [ -90.48, -.52 ], [ -90.17, -.57 ], [ -90.24, -.75 ], [ -90.52, -.71 ] ] ], [ [ [ -91.65, -.3 ], [ -91.44, -.26 ], [ -91.39, -.46 ], [ -91.6, -.49 ], [ -91.65, -.3 ] ] ], [ [ [ -90.57, -.28 ], [ -90.61, -.38 ], [ -90.87, -.26 ], [ -90.78, -.15 ], [ -90.57, -.28 ] ] ], [ [ [ -90.89, -.63 ], [ -90.78, -.77 ], [ -90.91, -.95 ], [ -91.44, -1 ], [ -91.49, -.85 ], [ -91.07, -.59 ], [ -91.39, -.26 ], [ -91.42, -.03 ], [ -91.59, .01 ], [ -91.34, .16 ], [ -90.89, -.63 ] ] ], [ [ [ 53.31, 12.53 ], [ 53.54, 12.71 ], [ 54.53, 12.54 ], [ 53.73, 12.3 ], [ 53.31, 12.53 ] ] ], [ [ [ 122.81, 7.31 ], [ 122.82, 7.44 ], [ 122.98, 7.37 ], [ 122.81, 7.31 ] ] ], [ [ [ 22.97, 70.24 ], [ 22.35, 70.34 ], [ 22.78, 70.39 ], [ 22.97, 70.24 ] ] ], [ [ [ 29.8, 69.76 ], [ 29.84, 69.91 ], [ 30.1, 69.82 ], [ 29.8, 69.76 ] ] ], [ [ [ 16.47, 43.3 ], [ 16.43, 43.39 ], [ 16.9, 43.31 ], [ 16.47, 43.3 ] ] ], [ [ [ 121.35, 31.84 ], [ 121.96, 31.47 ], [ 121.16, 31.79 ], [ 121.35, 31.84 ] ] ], [ [ [ -60.65, -51.93 ], [ -60.37, -51.76 ], [ -60.37, -51.89 ], [ -60.18, -51.71 ], [ -60.54, -51.81 ], [ -60.65, -51.67 ], [ -60.23, -51.66 ], [ -59.97, -51.74 ], [ -60.66, -51.34 ], [ -60.13, -51.51 ], [ -60.04, -51.38 ], [ -59.19, -51.4 ], [ -59.86, -51.96 ], [ -60.28, -51.99 ], [ -60.62, -52.26 ], [ -61.08, -52.01 ], [ -60.86, -52.08 ], [ -60.85, -51.95 ], [ -60.68, -52.05 ], [ -60.4, -51.93 ], [ -60.65, -51.93 ] ] ], [ [ [ -58.33, -51.38 ], [ -58.63, -51.47 ], [ -58.2, -51.66 ], [ -58.39, -51.48 ], [ -57.95, -51.36 ], [ -57.76, -51.54 ], [ -58.16, -51.55 ], [ -57.71, -51.68 ], [ -58.3, -51.75 ], [ -58.11, -51.79 ], [ -58.4, -51.92 ], [ -59.12, -51.84 ], [ -58.62, -51.97 ], [ -58.65, -52.14 ], [ -59.28, -51.99 ], [ -59.01, -52.26 ], [ -59.41, -52.12 ], [ -59.3, -52.33 ], [ -59.5, -52.31 ], [ -59.73, -52.1 ], [ -59.23, -51.72 ], [ -58.95, -51.77 ], [ -59.18, -51.58 ], [ -58.85, -51.52 ], [ -59.14, -51.46 ], [ -58.87, -51.38 ], [ -58.97, -51.23 ], [ -58.33, -51.38 ] ] ], [ [ [ -61.02, -51.78 ], [ -61.05, -51.89 ], [ -60.86, -51.79 ], [ -61, -51.99 ], [ -61.16, -51.85 ], [ -61.02, -51.78 ] ] ], [ [ [ -60.23, -51.31 ], [ -60.05, -51.34 ], [ -60.26, -51.41 ], [ -60.23, -51.31 ] ] ], [ [ [ 166.59, -45.76 ], [ 166.45, -45.72 ], [ 166.68, -45.6 ], [ 166.59, -45.76 ] ] ], [ [ [ 23.68, 39.97 ], [ 23.35, 39.95 ], [ 23.32, 40.2 ], [ 23.68, 39.97 ] ] ], [ [ [ 15.14, 44.08 ], [ 15.06, 44.16 ], [ 15.26, 44.02 ], [ 15.14, 44.08 ] ] ], [ [ [ 14.67, 45.11 ], [ 14.75, 44.94 ], [ 14.43, 45.08 ], [ 14.55, 45.25 ], [ 14.67, 45.11 ] ] ], [ [ [ 24.5, 38.84 ], [ 24.49, 38.99 ], [ 24.68, 38.77 ], [ 24.5, 38.84 ] ] ], [ [ [ 24.47, 37.96 ], [ 24.2, 38.09 ], [ 24.05, 38.39 ], [ 23.65, 38.4 ], [ 23.32, 38.76 ], [ 22.85, 38.87 ], [ 23.32, 39.04 ], [ 23.59, 38.76 ], [ 24.15, 38.65 ], [ 24.26, 38.21 ], [ 24.59, 38.16 ], [ 24.47, 37.96 ] ] ], [ [ [ 23.48, 37.67 ], [ 23.42, 37.76 ], [ 23.56, 37.77 ], [ 23.48, 37.67 ] ] ], [ [ [ 23.47, 37.35 ], [ 23.58, 37.37 ], [ 23.36, 37.3 ], [ 23.47, 37.35 ] ] ], [ [ [ 10.74, 33.72 ], [ 10.75, 33.89 ], [ 11.06, 33.82 ], [ 10.89, 33.63 ], [ 10.74, 33.72 ] ] ], [ [ [ 119.79, 25.61 ], [ 119.89, 25.57 ], [ 119.77, 25.4 ], [ 119.68, 25.6 ], [ 119.79, 25.61 ] ] ], [ [ [ 117.39, 23.58 ], [ 117.35, 23.75 ], [ 117.51, 23.76 ], [ 117.39, 23.58 ] ] ], [ [ [ 120.75, 21.95 ], [ 120.64, 22.3 ], [ 120.32, 22.52 ], [ 120.04, 23.05 ], [ 120.17, 23.81 ], [ 121.04, 25.03 ], [ 121.58, 25.3 ], [ 122, 25 ], [ 121.83, 24.84 ], [ 121.88, 24.53 ], [ 121.62, 24.08 ], [ 121.41, 23.12 ], [ 120.98, 22.56 ], [ 120.87, 21.9 ], [ 120.75, 21.95 ] ] ], [ [ [ 21.66, 36.96 ], [ 21.65, 37.44 ], [ 21.1, 37.85 ], [ 21.38, 38.22 ], [ 21.61, 38.14 ], [ 22.01, 38.31 ], [ 22.22, 38.18 ], [ 22.49, 38.14 ], [ 22.86, 37.94 ], [ 22.96, 37.95 ], [ 23.01, 37.85 ], [ 23.18, 37.8 ], [ 23.16, 37.62 ], [ 23.33, 37.53 ], [ 23.4, 37.64 ], [ 23.52, 37.45 ], [ 23.17, 37.29 ], [ 23.12, 37.45 ], [ 22.72, 37.56 ], [ 23.2, 36.44 ], [ 22.62, 36.81 ], [ 22.48, 36.39 ], [ 22.15, 37.02 ], [ 21.93, 36.98 ], [ 21.88, 36.72 ], [ 21.66, 36.96 ] ] ], [ [ [ -24.32, 16.49 ], [ -24.42, 16.65 ], [ -24.01, 16.57 ], [ -24.32, 16.49 ] ] ], [ [ [ -22.94, 16.68 ], [ -22.92, 16.86 ], [ -22.89, 16.59 ], [ -22.94, 16.68 ] ] ], [ [ [ -22.91, 16.15 ], [ -22.79, 16.23 ], [ -22.67, 16.08 ], [ -22.88, 15.97 ], [ -22.91, 16.15 ] ] ], [ [ [ 121.72, 31.41 ], [ 121.78, 31.32 ], [ 121.51, 31.49 ], [ 121.72, 31.41 ] ] ], [ [ [ 122.11, 30.14 ], [ 122.32, 29.94 ], [ 122.03, 29.99 ], [ 121.93, 30.17 ], [ 122.11, 30.14 ] ] ], [ [ [ 20.54, 38.41 ], [ 20.79, 38.06 ], [ 20.51, 38.1 ], [ 20.44, 38.28 ], [ 20.34, 38.18 ], [ 20.54, 38.41 ] ] ], [ [ [ 20.65, 37.8 ], [ 20.7, 37.93 ], [ 20.99, 37.7 ], [ 20.83, 37.64 ], [ 20.65, 37.8 ] ] ], [ [ [ 24.91, 37.9 ], [ 24.96, 37.68 ], [ 24.69, 37.95 ], [ 24.91, 37.9 ] ] ], [ [ [ 1.45, 38.91 ], [ 1.37, 38.83 ], [ 1.21, 38.96 ], [ 1.54, 39.12 ], [ 1.45, 38.91 ] ] ], [ [ [ -159.54, 21.89 ], [ -159.78, 22.07 ], [ -159.35, 22.22 ], [ -159.33, 21.96 ], [ -159.54, 21.89 ] ] ], [ [ [ -160.1, 21.88 ], [ -160.23, 21.79 ], [ -160.07, 22 ], [ -160.1, 21.88 ] ] ], [ [ [ -156.89, 20.74 ], [ -157.06, 20.91 ], [ -156.83, 20.86 ], [ -156.89, 20.74 ] ] ], [ [ [ -156.64, 21.02 ], [ -156.47, 20.89 ], [ -156.24, 20.94 ], [ -155.99, 20.71 ], [ -156.41, 20.58 ], [ -156.46, 20.78 ], [ -156.69, 20.88 ], [ -156.64, 21.02 ] ] ], [ [ [ -70.65, -55.03 ], [ -70.27, -55.13 ], [ -70.56, -55.22 ], [ -70.59, -55.07 ], [ -70.95, -55.09 ], [ -71.03, -54.97 ], [ -70.3, -54.91 ], [ -70.65, -55.03 ] ] ], [ [ [ -67.98, -55.68 ], [ -68.53, -55.41 ], [ -68.91, -55.46 ], [ -68.69, -55.39 ], [ -68.93, -55.41 ], [ -68.77, -55.19 ], [ -69.49, -55.27 ], [ -69.07, -55.48 ], [ -69.33, -55.42 ], [ -69.36, -55.55 ], [ -69.35, -55.4 ], [ -69.79, -55.35 ], [ -69.47, -55.2 ], [ -69.86, -55.31 ], [ -70.03, -55.15 ], [ -69.56, -55.05 ], [ -69.54, -55.19 ], [ -69.53, -55.05 ], [ -68.44, -54.94 ], [ -68.33, -55.08 ], [ -68.59, -55.16 ], [ -69.07, -55.08 ], [ -68.25, -55.23 ], [ -68.72, -55.28 ], [ -68.13, -55.39 ], [ -67.98, -55.68 ] ] ], [ [ [ 104.08, 10.37 ], [ 104.01, 10.01 ], [ 103.83, 10.37 ], [ 104.08, 10.37 ] ] ], [ [ [ -49.68, -.14 ], [ -49.83, -.08 ], [ -49.59, .09 ], [ -49.37, .04 ], [ -49.44, -.12 ], [ -49.68, -.14 ] ] ], [ [ [ -50.43, 1.87 ], [ -50.52, 2.01 ], [ -50.4, 2.12 ], [ -50.31, 1.95 ], [ -50.43, 1.87 ] ] ], [ [ [ -50.55, .26 ], [ -50.35, .62 ], [ -50.3, .29 ], [ -50.43, .16 ], [ -50.55, .26 ] ] ], [ [ [ -50.21, .88 ], [ -50.01, .9 ], [ -50.28, .74 ], [ -50.21, .88 ] ] ], [ [ [ -49.98, .96 ], [ -50.11, .94 ], [ -49.92, 1.09 ], [ -49.98, .96 ] ] ], [ [ [ -50.28, .56 ], [ -50.04, .57 ], [ -50.29, .35 ], [ -50.28, .56 ] ] ], [ [ [ -49.57, .3 ], [ -50, -.05 ], [ -50.39, .14 ], [ -50.03, .31 ], [ -49.57, .3 ] ] ], [ [ [ 25.05, 39.83 ], [ 25.04, 39.99 ], [ 25.45, 40.04 ], [ 25.35, 39.78 ], [ 25.26, 39.91 ], [ 25.23, 39.8 ], [ 25.05, 39.83 ] ] ], [ [ [ 30.47, 46.08 ], [ 29.61, 45.49 ], [ 29.78, 45.45 ], [ 29.59, 44.83 ], [ 29.09, 44.75 ], [ 28.63, 44.32 ], [ 28.55, 43.44 ], [ 27.65, 43.19 ], [ 27.95, 43.17 ], [ 27.9, 42.7 ], [ 27.44, 42.46 ], [ 27.73, 42.41 ], [ 28.22, 41.52 ], [ 29.12, 41.23 ], [ 28.98, 41 ], [ 27.51, 40.97 ], [ 27.31, 40.7 ], [ 26.7, 40.45 ], [ 26.19, 40.04 ], [ 26.22, 40.32 ], [ 26.82, 40.65 ], [ 26.13, 40.59 ], [ 26.01, 40.82 ], [ 25.11, 41.01 ], [ 24.8, 40.84 ], [ 24.51, 40.96 ], [ 24.09, 40.72 ], [ 23.74, 40.75 ], [ 23.87, 40.41 ], [ 24.01, 40.45 ], [ 24.4, 40.16 ], [ 23.74, 40.35 ], [ 23.99, 39.95 ], [ 23.65, 40.22 ], [ 22.89, 40.37 ], [ 22.93, 40.64 ], [ 22.59, 40.47 ], [ 22.59, 40.01 ], [ 23.35, 39.19 ], [ 23.07, 39.09 ], [ 23.22, 39.18 ], [ 22.94, 39.36 ], [ 22.83, 39.2 ], [ 23.06, 39.02 ], [ 22.53, 38.86 ], [ 23.31, 38.64 ], [ 23.33, 38.5 ], [ 24.07, 38.2 ], [ 24.03, 37.65 ], [ 23.57, 38.05 ], [ 23.01, 37.92 ], [ 22.97, 37.98 ], [ 22.85, 38.03 ], [ 23.22, 38.16 ], [ 22.78, 38.23 ], [ 22.66, 38.39 ], [ 22.55, 38.28 ], [ 22.4, 38.45 ], [ 22.38, 38.33 ], [ 21.94, 38.41 ], [ 21.48, 38.3 ], [ 21.36, 38.44 ], [ 21.42, 38.33 ], [ 21.35, 38.44 ], [ 21.14, 38.3 ], [ 20.99, 38.67 ], [ 20.71, 38.83 ], [ 20.76, 38.96 ], [ 21.17, 38.87 ], [ 21.12, 39.04 ], [ 20.8, 39.06 ], [ 20.73, 38.95 ], [ 19.98, 39.69 ], [ 19.86, 40.04 ], [ 19.29, 40.42 ], [ 19.48, 40.35 ], [ 19.31, 40.66 ], [ 19.6, 41.81 ], [ 19.16, 41.94 ], [ 18.88, 42.28 ], [ 18.55, 42.41 ], [ 18.76, 42.49 ], [ 18.51, 42.46 ], [ 18.52, 42.39 ], [ 17.89, 42.79 ], [ 17.01, 43.01 ], [ 17.75, 42.83 ], [ 16.89, 43.4 ], [ 16.43, 43.55 ], [ 15.95, 43.51 ], [ 15.96, 43.69 ], [ 15.14, 44.2 ], [ 15.28, 44.33 ], [ 15.63, 44.14 ], [ 14.99, 44.57 ], [ 14.85, 45.12 ], [ 14.56, 45.3 ], [ 14.32, 45.35 ], [ 13.91, 44.77 ], [ 13.49, 45.49 ], [ 13.81, 45.61 ], [ 13.53, 45.8 ], [ 12.36, 45.39 ], [ 12.33, 45.09 ], [ 12.55, 44.97 ], [ 12.26, 44.82 ], [ 12.39, 44.21 ], [ 13.63, 43.55 ], [ 14.06, 42.63 ], [ 14.74, 42.09 ], [ 15.17, 41.92 ], [ 16.15, 41.91 ], [ 15.96, 41.46 ], [ 18, 40.66 ], [ 18.52, 40.13 ], [ 18.35, 39.79 ], [ 18.05, 39.93 ], [ 17.86, 40.28 ], [ 17.51, 40.29 ], [ 17.12, 40.52 ], [ 16.9, 40.44 ], [ 16.49, 39.76 ], [ 17.16, 39.4 ], [ 17.21, 39.02 ], [ 16.6, 38.81 ], [ 16.57, 38.43 ], [ 16.06, 37.92 ], [ 15.63, 38.01 ], [ 15.93, 38.53 ], [ 15.84, 38.65 ], [ 16.22, 38.86 ], [ 15.68, 40.03 ], [ 15.27, 40.02 ], [ 14.91, 40.24 ], [ 15, 40.39 ], [ 14.79, 40.66 ], [ 14.32, 40.57 ], [ 14.46, 40.74 ], [ 14.04, 40.79 ], [ 13.74, 41.24 ], [ 13.05, 41.23 ], [ 11.62, 42.3 ], [ 11.1, 42.39 ], [ 11.18, 42.53 ], [ 10.73, 42.8 ], [ 10.77, 42.91 ], [ 10.5, 42.93 ], [ 10.53, 43.24 ], [ 10.16, 43.96 ], [ 8.75, 44.43 ], [ 8.07, 43.89 ], [ 7.16, 43.65 ], [ 6.59, 43.28 ], [ 6.65, 43.17 ], [ 6.16, 43.03 ], [ 5.34, 43.21 ], [ 5.31, 43.36 ], [ 4.86, 43.45 ], [ 4.86, 43.33 ], [ 4.66, 43.35 ], [ 4.08, 43.56 ], [ 3.23, 43.21 ], [ 3.04, 42.94 ], [ 3.05, 42.55 ], [ 3.32, 42.32 ], [ 3.11, 42.21 ], [ 3.2, 41.89 ], [ 2.15, 41.3 ], [ 1.05, 41.06 ], [ .7, 40.81 ], [ .87, 40.69 ], [ .54, 40.57 ], [ -.32, 39.51 ], [ -.16, 38.99 ], [ .23, 38.73 ], [ -.51, 38.33 ], [ -.86, 37.72 ], [ -.72, 37.61 ], [ -1.33, 37.56 ], [ -1.67, 37.36 ], [ -2.12, 36.73 ], [ -2.36, 36.84 ], [ -2.7, 36.68 ], [ -4.41, 36.72 ], [ -4.64, 36.51 ], [ -5.18, 36.41 ], [ -5.34, 36.11 ], [ -5.44, 36.18 ], [ -5.61, 36 ], [ -6.14, 36.3 ], [ -6.32, 36.53 ], [ -6.18, 36.47 ], [ -6.15, 36.6 ], [ -6.39, 36.63 ], [ -6.46, 36.92 ], [ -6.93, 37.18 ], [ -6.82, 37.31 ], [ -6.94, 37.21 ], [ -6.97, 37.32 ], [ -6.95, 37.16 ], [ -7.48, 37.17 ], [ -7.88, 36.98 ], [ -8.59, 37.12 ], [ -9, 37.02 ], [ -8.79, 37.53 ], [ -8.91, 38.49 ], [ -8.66, 38.41 ], [ -8.74, 38.57 ], [ -9.22, 38.41 ], [ -9.18, 38.7 ], [ -9.5, 38.78 ], [ -9.41, 39.36 ], [ -9.07, 39.58 ], [ -8.87, 40.12 ], [ -8.64, 41.02 ], [ -8.9, 42.11 ], [ -8.57, 42.34 ], [ -8.87, 42.25 ], [ -8.59, 42.45 ], [ -8.94, 42.46 ], [ -8.73, 42.69 ], [ -9.04, 42.52 ], [ -8.89, 42.82 ], [ -9.09, 42.74 ], [ -9.3, 43.06 ], [ -8.84, 43.35 ], [ -8.31, 43.41 ], [ -8.21, 43.28 ], [ -8.12, 43.43 ], [ -8.32, 43.45 ], [ -8.15, 43.52 ], [ -8.33, 43.45 ], [ -8.32, 43.57 ], [ -7.69, 43.79 ], [ -7.06, 43.47 ], [ -6.94, 43.57 ], [ -5.91, 43.55 ], [ -5.84, 43.66 ], [ -4.62, 43.4 ], [ -3.55, 43.51 ], [ -2.97, 43.26 ], [ -2.95, 43.44 ], [ -2.13, 43.27 ], [ -1.6, 43.43 ], [ -1.25, 44.55 ], [ -1.01, 44.64 ], [ -1.16, 44.77 ], [ -1.26, 44.63 ], [ -1.09, 45.57 ], [ -.59, 45.01 ], [ -.83, 45.5 ], [ -1.23, 45.68 ], [ -1.16, 45.8 ], [ -.96, 45.7 ], [ -1.17, 45.85 ], [ -.97, 45.92 ], [ -1.23, 46.15 ], [ -1.13, 46.3 ], [ -1.81, 46.49 ], [ -2.14, 46.82 ], [ -1.98, 47.03 ], [ -2.25, 47.13 ], [ -2.18, 47.3 ], [ -2.55, 47.29 ], [ -2.57, 47.57 ], [ -2.92, 47.55 ], [ -2.71, 47.65 ], [ -3.04, 47.64 ], [ -3.13, 47.47 ], [ -3.28, 47.78 ], [ -3.86, 47.79 ], [ -4.12, 47.98 ], [ -4.16, 47.81 ], [ -4.38, 47.8 ], [ -4.49, 48.04 ], [ -4.74, 48.04 ], [ -4.27, 48.15 ], [ -4.63, 48.28 ], [ -4.11, 48.25 ], [ -4.46, 48.33 ], [ -4.25, 48.45 ], [ -4.77, 48.33 ], [ -4.78, 48.52 ], [ -4.01, 48.73 ], [ -3.85, 48.61 ], [ -3.51, 48.84 ], [ -3.22, 48.87 ], [ -3.26, 48.74 ], [ -3.07, 48.88 ], [ -3.14, 48.71 ], [ -3.01, 48.82 ], [ -2.69, 48.5 ], [ -2.32, 48.69 ], [ -2, 48.49 ], [ -1.94, 48.7 ], [ -1.35, 48.63 ], [ -1.57, 48.74 ], [ -1.58, 49.22 ], [ -1.94, 49.73 ], [ -1.27, 49.7 ], [ -1.12, 49.34 ], [ -.23, 49.28 ], [ .36, 49.44 ], [ .11, 49.46 ], [ .12, 49.67 ], [ 1.67, 50.18 ], [ 1.58, 50.87 ], [ 3.19, 51.36 ], [ 4.2, 51.37 ], [ 3.43, 51.53 ], [ 3.84, 51.61 ], [ 4.22, 51.44 ], [ 3.68, 51.71 ], [ 4.07, 51.84 ], [ 3.97, 51.97 ], [ 4.4, 52.21 ], [ 4.73, 52.96 ], [ 5.04, 52.93 ], [ 5.88, 53.4 ], [ 6.83, 53.46 ], [ 7.21, 53.23 ], [ 7.04, 53.54 ], [ 7.7, 53.72 ], [ 8.03, 53.71 ], [ 8.21, 53.39 ], [ 8.27, 53.61 ], [ 8.52, 53.56 ], [ 8.47, 53.22 ], [ 8.86, 53.06 ], [ 8.48, 53.24 ], [ 8.6, 53.87 ], [ 9.27, 53.86 ], [ 9.66, 53.58 ], [ 9.4, 53.83 ], [ 8.8, 54.02 ], [ 8.99, 54.06 ], [ 8.84, 54.28 ], [ 8.59, 54.34 ], [ 9.03, 54.47 ], [ 8.81, 54.47 ], [ 8.6, 54.88 ], [ 8.28, 54.75 ], [ 8.4, 55.05 ], [ 8.38, 54.89 ], [ 8.64, 54.9 ], [ 8.69, 55.14 ], [ 8.51, 55.06 ], [ 8.49, 55.19 ], [ 8.69, 55.16 ], [ 8.62, 55.43 ], [ 8.07, 55.56 ], [ 8.12, 56 ], [ 8.18, 55.82 ], [ 8.38, 55.91 ], [ 8.13, 56.12 ], [ 8.11, 56 ], [ 8.21, 56.71 ], [ 8.67, 56.47 ], [ 9.07, 56.8 ], [ 9.05, 56.56 ], [ 9.15, 56.66 ], [ 9.31, 56.52 ], [ 9.2, 56.94 ], [ 9.49, 57.02 ], [ 9.57, 56.93 ], [ 9.69, 57.04 ], [ 10.01, 57.08 ], [ 10.31, 56.98 ], [ 10.33, 56.71 ], [ 9.8, 56.64 ], [ 10.36, 56.66 ], [ 10.04, 56.46 ], [ 10.29, 56.47 ], [ 10.3, 56.61 ], [ 10.95, 56.46 ], [ 10.71, 56.14 ], [ 10.38, 56.17 ], [ 10.45, 56.3 ], [ 10.24, 56.18 ], [ 10.19, 55.84 ], [ 9.86, 55.86 ], [ 10.03, 55.7 ], [ 9.54, 55.71 ], [ 9.86, 55.63 ], [ 9.48, 55.49 ], [ 9.69, 55.46 ], [ 9.49, 55.25 ], [ 9.72, 55.25 ], [ 9.42, 55.03 ], [ 9.78, 54.91 ], [ 9.42, 54.83 ], [ 9.96, 54.78 ], [ 10.03, 54.55 ], [ 9.83, 54.47 ], [ 10.2, 54.46 ], [ 10.13, 54.31 ], [ 10.32, 54.44 ], [ 10.71, 54.3 ], [ 11.13, 54.39 ], [ 10.75, 54.05 ], [ 10.88, 53.96 ], [ 11.46, 53.9 ], [ 11.55, 54.09 ], [ 12.12, 54.18 ], [ 12.53, 54.49 ], [ 12.93, 54.43 ], [ 12.59, 54.45 ], [ 12.4, 54.25 ], [ 13.03, 54.44 ], [ 13.1, 54.28 ], [ 13.46, 54.09 ], [ 13.7, 54.17 ], [ 13.8, 54.1 ], [ 13.74, 54.03 ], [ 13.91, 53.92 ], [ 13.82, 53.88 ], [ 13.82, 53.84 ], [ 14.6, 53.59 ], [ 14.62, 53.85 ], [ 14.59, 53.8 ], [ 14.47, 53.87 ], [ 14.34, 53.81 ], [ 14.19, 53.87 ], [ 13.94, 53.84 ], [ 13.93, 53.88 ], [ 13.91, 53.84 ], [ 13.83, 53.85 ], [ 13.94, 53.91 ], [ 13.91, 53.99 ], [ 14.04, 53.94 ], [ 14.05, 54 ], [ 13.97, 54.06 ], [ 13.77, 54.02 ], [ 13.81, 54.11 ], [ 13.76, 54.17 ], [ 14.38, 53.91 ], [ 16.1, 54.27 ], [ 17.25, 54.73 ], [ 18.29, 54.84 ], [ 18.68, 54.7 ], [ 18.83, 54.62 ], [ 18.42, 54.79 ], [ 18.39, 54.73 ], [ 18.52, 54.64 ], [ 18.58, 54.44 ], [ 18.88, 54.35 ], [ 19.23, 54.36 ], [ 19.5, 54.4 ], [ 19.87, 54.65 ], [ 19.62, 54.43 ], [ 19.37, 54.35 ], [ 19.22, 54.33 ], [ 19.37, 54.22 ], [ 20.29, 54.63 ], [ 19.87, 54.65 ], [ 19.95, 54.93 ], [ 20.71, 55.08 ], [ 21.05, 55.41 ], [ 21.08, 55.73 ], [ 21.06, 55.33 ], [ 20.86, 55.15 ], [ 20.51, 54.95 ], [ 21.21, 54.92 ], [ 20.98, 56.52 ], [ 21.7, 57.57 ], [ 22.61, 57.76 ], [ 23.26, 57.09 ], [ 23.62, 56.96 ], [ 24.39, 57.24 ], [ 24.58, 58.32 ], [ 24.31, 58.38 ], [ 24.12, 58.23 ], [ 23.75, 58.34 ], [ 23.49, 58.69 ], [ 23.76, 58.78 ], [ 23.44, 58.77 ], [ 23.43, 58.94 ], [ 23.66, 58.97 ], [ 23.4, 59.03 ], [ 23.51, 59.23 ], [ 24.08, 59.27 ], [ 24.36, 59.47 ], [ 24.79, 59.44 ], [ 24.8, 59.57 ], [ 25.44, 59.49 ], [ 25.7, 59.68 ], [ 25.81, 59.56 ], [ 27.91, 59.4 ], [ 28.1, 59.79 ], [ 28.37, 59.66 ], [ 28.47, 59.83 ], [ 28.84, 59.78 ], [ 29.13, 59.99 ], [ 30.23, 59.91 ], [ 29.87, 60.16 ], [ 29.04, 60.18 ], [ 28.62, 60.35 ], [ 28.44, 60.55 ], [ 28.71, 60.44 ], [ 28.68, 60.74 ], [ 28.23, 60.51 ], [ 27.74, 60.58 ], [ 27.48, 60.46 ], [ 27.18, 60.59 ], [ 26.2, 60.36 ], [ 25.92, 60.49 ], [ 26.12, 60.33 ], [ 25.84, 60.41 ], [ 25.9, 60.25 ], [ 25.67, 60.38 ], [ 25.15, 60.18 ], [ 24.56, 60.17 ], [ 24.39, 59.97 ], [ 24.33, 60.09 ], [ 23.41, 59.92 ], [ 23.55, 60.1 ], [ 23.22, 59.84 ], [ 22.89, 59.81 ], [ 23.21, 59.91 ], [ 23.3, 59.98 ], [ 23.33, 60.04 ], [ 23.28, 59.97 ], [ 23.16, 59.91 ], [ 23.23, 59.96 ], [ 23.19, 59.98 ], [ 23.11, 59.94 ], [ 23.11, 60 ], [ 23.23, 60.04 ], [ 23.04, 59.99 ], [ 23.03, 59.91 ], [ 22.81, 59.98 ], [ 23.27, 60.06 ], [ 22.87, 60.16 ], [ 23.08, 60.38 ], [ 22.52, 60.21 ], [ 22.63, 60.29 ], [ 22.45, 60.27 ], [ 22.65, 60.4 ], [ 21.9, 60.55 ], [ 21.7, 60.46 ], [ 21.84, 60.64 ], [ 21.58, 60.65 ], [ 21.59, 60.49 ], [ 21.33, 60.69 ], [ 21.17, 60.88 ], [ 21.29, 61.01 ], [ 21.44, 60.91 ], [ 21.46, 61.6 ], [ 21.68, 61.56 ], [ 21.28, 61.99 ], [ 21.43, 62.22 ], [ 21.12, 62.8 ], [ 21.68, 63.05 ], [ 21.58, 63.29 ], [ 22, 63.16 ], [ 22.37, 63.29 ], [ 22.32, 63.59 ], [ 22.45, 63.48 ], [ 22.82, 63.9 ], [ 22.94, 63.77 ], [ 23.41, 64.09 ], [ 23.62, 64.05 ], [ 24.54, 64.82 ], [ 25.33, 64.84 ], [ 25.18, 65.59 ], [ 24.24, 65.84 ], [ 23.38, 65.75 ], [ 23.13, 65.85 ], [ 23.1, 65.7 ], [ 22.67, 65.9 ], [ 22.68, 65.75 ], [ 22.35, 65.86 ], [ 22.4, 65.54 ], [ 22.06, 65.62 ], [ 21.99, 65.41 ], [ 21.45, 65.39 ], [ 21.75, 65.19 ], [ 21.52, 65.23 ], [ 21.54, 65.06 ], [ 21, 64.84 ], [ 21.61, 64.43 ], [ 20.57, 63.72 ], [ 20.49, 63.83 ], [ 19.66, 63.43 ], [ 19.44, 63.57 ], [ 19.51, 63.41 ], [ 19.33, 63.5 ], [ 19.03, 63.19 ], [ 18.71, 63.29 ], [ 18.88, 63.2 ], [ 18.2, 63.01 ], [ 18.56, 62.96 ], [ 17.97, 62.83 ], [ 17.85, 62.49 ], [ 17.32, 62.47 ], [ 17.66, 62.23 ], [ 17.32, 61.93 ], [ 17.49, 61.62 ], [ 17.11, 61.73 ], [ 17.04, 61.58 ], [ 17.35, 60.75 ], [ 17.16, 60.68 ], [ 17.61, 60.65 ], [ 17.73, 60.5 ], [ 17.99, 60.6 ], [ 18.61, 60.25 ], [ 18.31, 60.32 ], [ 18.59, 60.05 ], [ 18.74, 60.12 ], [ 18.81, 59.97 ], [ 18.81, 60.12 ], [ 19.08, 59.88 ], [ 18.87, 59.93 ], [ 18.71, 59.75 ], [ 19.08, 59.74 ], [ 18.33, 59.38 ], [ 18.08, 59.42 ], [ 18.08, 59.3 ], [ 18.47, 59.17 ], [ 18, 59.04 ], [ 17.89, 58.85 ], [ 17.63, 59.19 ], [ 17.51, 58.78 ], [ 17.09, 58.77 ], [ 16.92, 58.61 ], [ 16.18, 58.64 ], [ 16.95, 58.48 ], [ 16.41, 58.48 ], [ 16.83, 58.3 ], [ 16.83, 58.13 ], [ 16.6, 58.2 ], [ 16.79, 57.87 ], [ 16.47, 57.91 ], [ 16.72, 57.73 ], [ 16.41, 57.88 ], [ 16.72, 57.72 ], [ 16.5, 57.64 ], [ 16.7, 57.43 ], [ 16.45, 57.27 ], [ 16.48, 56.77 ], [ 15.85, 56.07 ], [ 15.59, 56.21 ], [ 14.69, 56.17 ], [ 14.77, 56.02 ], [ 14.54, 56.06 ], [ 14.23, 55.84 ], [ 14.2, 55.38 ], [ 12.95, 55.4 ], [ 13.07, 55.68 ], [ 12.45, 56.3 ], [ 12.79, 56.22 ], [ 12.62, 56.42 ], [ 12.94, 56.59 ], [ 12.35, 56.93 ], [ 11.7, 57.71 ], [ 11.91, 58.35 ], [ 11.5, 58.25 ], [ 11.57, 58.48 ], [ 11.46, 58.27 ], [ 11.46, 58.46 ], [ 11.24, 58.36 ], [ 11.11, 59 ], [ 11.34, 59.11 ], [ 11.48, 58.99 ], [ 11.39, 59.12 ], [ 11.2, 59.09 ], [ 11.18, 59.2 ], [ 10.73, 59.23 ], [ 10.75, 59.91 ], [ 10.47, 59.84 ], [ 10.51, 59.52 ], [ 10.21, 59.74 ], [ 10.53, 59.32 ], [ 10.31, 59.06 ], [ 9.86, 58.96 ], [ 9.61, 59.21 ], [ 9.75, 58.99 ], [ 9.07, 58.76 ], [ 9.2, 58.67 ], [ 8.24, 58.12 ], [ 8.03, 58.24 ], [ 7.95, 58.08 ], [ 7.05, 57.98 ], [ 6.87, 58.2 ], [ 6.64, 58.07 ], [ 6.93, 58.29 ], [ 6.11, 58.36 ], [ 5.49, 58.75 ], [ 5.58, 59.04 ], [ 5.74, 58.85 ], [ 5.89, 58.97 ], [ 6.18, 58.83 ], [ 6.28, 58.85 ], [ 6.12, 58.88 ], [ 6.09, 58.9 ], [ 6.13, 58.95 ], [ 6.65, 59.05 ], [ 6.26, 59.01 ], [ 6.1, 58.94 ], [ 6.07, 58.9 ], [ 5.89, 59.07 ], [ 6.56, 59.32 ], [ 6.02, 59.34 ], [ 6.6, 59.56 ], [ 6.27, 59.52 ], [ 6.31, 59.64 ], [ 6.22, 59.47 ], [ 5.98, 59.35 ], [ 6.2, 59.48 ], [ 5.91, 59.47 ], [ 5.85, 59.54 ], [ 5.65, 59.26 ], [ 5.63, 59.5 ], [ 5.49, 59.27 ], [ 5.24, 59.55 ], [ 5.53, 59.73 ], [ 5.46, 59.48 ], [ 5.59, 59.69 ], [ 5.8, 59.6 ], [ 6.38, 59.87 ], [ 6.02, 59.75 ], [ 5.67, 59.85 ], [ 6.32, 60.13 ], [ 6.08, 60.19 ], [ 6.35, 60.37 ], [ 6.67, 60.41 ], [ 6.55, 60.07 ], [ 6.69, 60.39 ], [ 7.14, 60.49 ], [ 6.91, 60.49 ], [ 7.03, 60.59 ], [ 6.7, 60.43 ], [ 6.71, 60.52 ], [ 6.21, 60.47 ], [ 5.77, 59.98 ], [ 5.77, 60.19 ], [ 5.57, 60.16 ], [ 5.76, 60.4 ], [ 5.44, 60.13 ], [ 5.17, 60.37 ], [ 5.27, 60.52 ], [ 5.46, 60.42 ], [ 5.62, 60.43 ], [ 5.74, 60.47 ], [ 5.74, 60.66 ], [ 5.96, 60.64 ], [ 5.74, 60.66 ], [ 5.8, 60.74 ], [ 5.68, 60.7 ], [ 5.79, 60.82 ], [ 5.56, 60.63 ], [ 5.28, 60.54 ], [ 4.95, 60.81 ], [ 5.46, 60.63 ], [ 5.45, 60.71 ], [ 5.27, 60.77 ], [ 5.59, 60.87 ], [ 5.1, 60.83 ], [ 5.01, 60.97 ], [ 5.12, 60.87 ], [ 5.31, 60.99 ], [ 5.02, 61.03 ], [ 5.49, 60.99 ], [ 5.92, 61.13 ], [ 6.41, 61.01 ], [ 6.64, 61.18 ], [ 7.01, 61.06 ], [ 6.84, 60.88 ], [ 7.05, 60.99 ], [ 7.12, 60.86 ], [ 7.04, 61.1 ], [ 7.48, 61.1 ], [ 7.71, 61.23 ], [ 7.31, 61.3 ], [ 7.59, 61.49 ], [ 7.28, 61.4 ], [ 7.33, 61.16 ], [ 6.94, 61.11 ], [ 7.17, 61.27 ], [ 7, 61.16 ], [ 6.6, 61.21 ], [ 6.75, 61.42 ], [ 6.47, 61.12 ], [ 6.06, 61.22 ], [ 5.23, 61.11 ], [ 4.98, 61.28 ], [ 5.67, 61.37 ], [ 5.08, 61.32 ], [ 4.98, 61.42 ], [ 5.85, 61.46 ], [ 5.18, 61.51 ], [ 5.43, 61.65 ], [ 4.99, 61.63 ], [ 4.99, 61.74 ], [ 5.22, 61.72 ], [ 5.1, 61.78 ], [ 5.43, 61.92 ], [ 5.78, 61.85 ], [ 5.65, 61.81 ], [ 5.98, 61.85 ], [ 5.91, 61.73 ], [ 6.02, 61.84 ], [ 6.18, 61.76 ], [ 6.08, 61.85 ], [ 6.48, 61.8 ], [ 6.85, 61.87 ], [ 6.43, 61.83 ], [ 5.73, 61.89 ], [ 5.91, 61.92 ], [ 5.45, 61.94 ], [ 5.18, 61.9 ], [ 5.43, 62.02 ], [ 5.1, 62.19 ], [ 5.46, 62 ], [ 5.49, 62.2 ], [ 5.72, 62.09 ], [ 5.92, 62.19 ], [ 5.85, 62 ], [ 5.98, 62.14 ], [ 6.31, 62.06 ], [ 5.93, 62.22 ], [ 6.34, 62.37 ], [ 6.55, 62.1 ], [ 6.41, 62.39 ], [ 6.72, 62.45 ], [ 7.01, 62.28 ], [ 6.87, 62.08 ], [ 7.2, 62.1 ], [ 6.96, 62.12 ], [ 7.04, 62.28 ], [ 7.43, 62.25 ], [ 6.26, 62.59 ], [ 7.08, 62.65 ], [ 7.13, 62.52 ], [ 7.17, 62.63 ], [ 7.56, 62.5 ], [ 7.78, 62.58 ], [ 7.4, 62.63 ], [ 8.15, 62.69 ], [ 6.98, 62.72 ], [ 7.24, 62.81 ], [ 7.03, 62.97 ], [ 8.04, 62.97 ], [ 8.53, 62.67 ], [ 7.97, 63.08 ], [ 8.7, 62.81 ], [ 8.42, 62.95 ], [ 8.71, 62.97 ], [ 8.16, 63.11 ], [ 8.98, 63.2 ], [ 8.58, 63.2 ], [ 8.85, 63.35 ], [ 8.66, 63.41 ], [ 9.02, 63.46 ], [ 9.1, 63.29 ], [ 9.5, 63.4 ], [ 9.15, 63.49 ], [ 9.75, 63.65 ], [ 9.82, 63.31 ], [ 10.28, 63.32 ], [ 10.09, 63.42 ], [ 10.8, 63.41 ], [ 10.95, 63.6 ], [ 10.71, 63.62 ], [ 11.53, 63.78 ], [ 11.37, 63.95 ], [ 11.07, 63.86 ], [ 11.5, 64.01 ], [ 11.32, 64.12 ], [ 10.59, 63.8 ], [ 10.96, 63.91 ], [ 10.96, 63.75 ], [ 10.42, 63.57 ], [ 9.93, 63.5 ], [ 9.81, 63.68 ], [ 10.12, 63.78 ], [ 9.54, 63.66 ], [ 9.68, 63.84 ], [ 10.22, 63.93 ], [ 9.95, 63.91 ], [ 10.68, 64.36 ], [ 10.5, 64.43 ], [ 10.84, 64.37 ], [ 10.65, 64.45 ], [ 10.98, 64.61 ], [ 11.34, 64.44 ], [ 11.22, 64.31 ], [ 11.8, 64.59 ], [ 11.38, 64.66 ], [ 11.87, 64.79 ], [ 11.69, 64.87 ], [ 12.46, 64.89 ], [ 12.06, 64.97 ], [ 11.18, 64.74 ], [ 12.12, 65.19 ], [ 12.18, 64.98 ], [ 12.96, 65.31 ], [ 12.49, 65.13 ], [ 12.25, 65.23 ], [ 12.47, 65.37 ], [ 12.04, 65.22 ], [ 12.29, 65.59 ], [ 12.71, 65.36 ], [ 12.35, 65.63 ], [ 12.51, 65.74 ], [ 12.79, 65.63 ], [ 12.67, 65.92 ], [ 13.19, 65.84 ], [ 13.05, 66.08 ], [ 12.68, 66.07 ], [ 13.52, 66.24 ], [ 13.55, 66.1 ], [ 13.83, 66.14 ], [ 13.6, 66.23 ], [ 14.17, 66.32 ], [ 13.01, 66.19 ], [ 13.56, 66.31 ], [ 13, 66.33 ], [ 12.98, 66.53 ], [ 13.26, 66.45 ], [ 13.73, 66.6 ], [ 13.2, 66.56 ], [ 13.23, 66.68 ], [ 13.57, 66.65 ], [ 13.22, 66.73 ], [ 14, 66.8 ], [ 13.49, 66.95 ], [ 14.01, 66.96 ], [ 14.05, 67.08 ], [ 14.15, 66.97 ], [ 14.24, 67 ], [ 14.23, 67.08 ], [ 14.56, 67.02 ], [ 14.24, 67.09 ], [ 14.8, 67.24 ], [ 15.47, 67.1 ], [ 15.43, 67.26 ], [ 15.04, 67.27 ], [ 15.26, 67.35 ], [ 14.31, 67.26 ], [ 15.05, 67.45 ], [ 14.65, 67.48 ], [ 15.06, 67.59 ], [ 14.93, 67.49 ], [ 15.76, 67.36 ], [ 15.53, 67.48 ], [ 15.92, 67.6 ], [ 15.52, 67.51 ], [ 15.16, 67.63 ], [ 15.65, 67.69 ], [ 15.51, 67.77 ], [ 15.85, 67.71 ], [ 15.37, 67.88 ], [ 15.17, 67.72 ], [ 14.76, 67.66 ], [ 15.14, 67.76 ], [ 14.82, 67.77 ], [ 15.14, 67.87 ], [ 14.85, 67.88 ], [ 15.87, 67.91 ], [ 15.94, 68.03 ], [ 15.28, 68.06 ], [ 15.63, 68.19 ], [ 15.81, 68.1 ], [ 16, 68.27 ], [ 16.2, 67.9 ], [ 16.52, 67.82 ], [ 16.19, 68.02 ], [ 16.46, 67.91 ], [ 16.32, 68.03 ], [ 16.52, 67.97 ], [ 16.35, 68.04 ], [ 16.45, 68.12 ], [ 16.74, 68.09 ], [ 16.49, 68.13 ], [ 16.33, 68.1 ], [ 16.61, 68.18 ], [ 16.17, 68.32 ], [ 16.82, 68.16 ], [ 16.28, 68.37 ], [ 17.19, 68.39 ], [ 17.32, 68.19 ], [ 17.3, 68.42 ], [ 17.9, 68.41 ], [ 17.54, 68.55 ], [ 16.45, 68.51 ], [ 16.97, 68.71 ], [ 17.69, 68.67 ], [ 17.25, 68.76 ], [ 17.81, 68.75 ], [ 17.47, 68.99 ], [ 18.2, 69.12 ], [ 18.15, 69.47 ], [ 18.2, 69.27 ], [ 18.39, 69.4 ], [ 18.48, 69.22 ], [ 18.56, 69.36 ], [ 19.01, 69.29 ], [ 18.45, 69.44 ], [ 18.83, 69.56 ], [ 19.55, 69.21 ], [ 18.94, 69.63 ], [ 19.72, 69.81 ], [ 19.65, 69.41 ], [ 19.73, 69.61 ], [ 20.15, 69.58 ], [ 19.77, 69.68 ], [ 20.26, 69.98 ], [ 20.35, 69.62 ], [ 19.92, 69.26 ], [ 20.42, 69.59 ], [ 20.82, 69.5 ], [ 20.46, 69.76 ], [ 21.06, 69.96 ], [ 20.84, 69.85 ], [ 21.14, 69.8 ], [ 21.24, 70.01 ], [ 22.06, 69.72 ], [ 22.09, 70.03 ], [ 21.78, 70.04 ], [ 22.07, 70.13 ], [ 21.73, 70.05 ], [ 21.19, 70.2 ], [ 21.57, 70.32 ], [ 21.86, 70.14 ], [ 21.95, 70.33 ], [ 22.22, 70.13 ], [ 22.54, 70.11 ], [ 22.36, 70.26 ], [ 22.96, 70.2 ], [ 22.29, 70.02 ], [ 23.01, 70.14 ], [ 23, 69.92 ], [ 23.47, 69.98 ], [ 23.18, 70.22 ], [ 23.86, 70.49 ], [ 24.31, 70.45 ], [ 24.3, 70.69 ], [ 24.69, 70.63 ], [ 24.24, 70.78 ], [ 24.35, 70.88 ], [ 24.62, 70.79 ], [ 24.63, 70.99 ], [ 25.23, 70.8 ], [ 25.33, 70.98 ], [ 25.44, 70.85 ], [ 25.91, 70.88 ], [ 25.05, 70.5 ], [ 25.15, 70.07 ], [ 26.67, 70.97 ], [ 26.48, 70.36 ], [ 27.1, 70.47 ], [ 27.11, 70.76 ], [ 27.72, 70.8 ], [ 27.1, 70.93 ], [ 27.28, 71.05 ], [ 27.55, 70.96 ], [ 27.66, 71.13 ], [ 28.55, 70.97 ], [ 28.24, 70.79 ], [ 27.73, 70.8 ], [ 28.14, 70.74 ], [ 27.64, 70.62 ], [ 28.3, 70.7 ], [ 27.86, 70.44 ], [ 28.51, 70.45 ], [ 28.97, 70.89 ], [ 29.4, 70.79 ], [ 29.25, 70.65 ], [ 30.08, 70.71 ], [ 30.34, 70.61 ], [ 30.01, 70.53 ], [ 30.62, 70.55 ], [ 31.03, 70.4 ], [ 30.17, 70.07 ], [ 28.56, 70.17 ], [ 29.65, 69.98 ], [ 29.49, 69.66 ], [ 30.06, 69.78 ], [ 29.95, 69.59 ], [ 30.27, 69.88 ], [ 30.31, 69.67 ], [ 30.67, 69.81 ], [ 31.42, 69.71 ], [ 31.32, 69.59 ], [ 31.82, 69.65 ], [ 31.78, 69.83 ], [ 32.09, 69.76 ], [ 32.06, 69.95 ], [ 33.13, 69.71 ], [ 32.83, 69.57 ], [ 32.1, 69.74 ], [ 31.99, 69.54 ], [ 32.5, 69.5 ], [ 32.26, 69.42 ], [ 33.06, 69.46 ], [ 32.88, 69.28 ], [ 33.5, 69.4 ], [ 33.01, 68.89 ], [ 33.58, 69.3 ], [ 35.17, 69.11 ], [ 35.16, 69.25 ], [ 35.83, 69.19 ], [ 37.8, 68.64 ], [ 38.44, 68.29 ], [ 38.78, 68.24 ], [ 38.65, 68.37 ], [ 39.71, 68 ], [ 39.74, 68.16 ], [ 40.48, 67.72 ], [ 40.96, 67.71 ], [ 41.39, 67.11 ], [ 41.21, 66.82 ], [ 40, 66.25 ], [ 38.65, 66.06 ], [ 35.55, 66.38 ], [ 34.81, 66.61 ], [ 34.46, 66.54 ], [ 34.15, 66.79 ], [ 33.95, 66.68 ], [ 33.61, 66.85 ], [ 33.63, 66.7 ], [ 33.17, 66.82 ], [ 32.79, 67.02 ], [ 33, 67.08 ], [ 31.87, 67.14 ], [ 33.32, 66.64 ], [ 32.93, 66.52 ], [ 33.72, 66.42 ], [ 32.98, 66.25 ], [ 34.11, 66.23 ], [ 35.02, 65.76 ], [ 34.93, 65.67 ], [ 34.66, 65.79 ], [ 34.69, 65.44 ], [ 34.27, 65.37 ], [ 34.96, 64.84 ], [ 34.69, 64.51 ], [ 35.4, 64.28 ], [ 35.83, 64.32 ], [ 36.3, 63.97 ], [ 37.44, 63.78 ], [ 38.01, 63.94 ], [ 38.01, 64.29 ], [ 37.79, 64.44 ], [ 37.15, 64.39 ], [ 36.53, 64.72 ], [ 36.44, 64.92 ], [ 36.81, 64.96 ], [ 36.85, 65.15 ], [ 38.37, 64.84 ], [ 38.01, 64.58 ], [ 38.43, 64.81 ], [ 39.53, 64.55 ], [ 40.1, 65.08 ], [ 39.77, 65.57 ], [ 40.75, 65.99 ], [ 41.66, 66.13 ], [ 42.14, 66.5 ], [ 42.59, 66.44 ], [ 42.45, 66.34 ], [ 43.27, 66.41 ], [ 43.68, 66.24 ], [ 43.47, 66.18 ], [ 43.33, 66.05 ], [ 43.47, 65.89 ], [ 43.4, 66.1 ], [ 43.84, 66.19 ], [ 44.2, 65.82 ], [ 44.07, 66.23 ], [ 44.55, 66.91 ], [ 43.77, 67.24 ], [ 44.23, 67.67 ], [ 44.22, 68.27 ], [ 43.29, 68.67 ], [ 44.06, 68.53 ], [ 45.28, 68.54 ], [ 45.54, 68.52 ], [ 46.03, 68.43 ], [ 45.8, 68.47 ], [ 46.03, 68.34 ], [ 46, 68.31 ], [ 46.54, 68.12 ], [ 46.69, 67.81 ], [ 45.36, 67.71 ], [ 44.91, 67.33 ], [ 45.57, 67.16 ], [ 45.73, 66.89 ], [ 46.66, 66.81 ], [ 47.59, 66.9 ], [ 47.83, 67.58 ], [ 48.74, 67.7 ], [ 48.59, 67.91 ], [ 49.08, 67.81 ], [ 50.06, 68.1 ], [ 49.83, 67.99 ], [ 50.19, 68 ], [ 50.06, 68.09 ], [ 50.81, 68.37 ], [ 52.24, 68.58 ], [ 51.99, 68.51 ], [ 52.42, 68.33 ], [ 52.76, 68.48 ], [ 52.29, 68.6 ], [ 53.87, 68.96 ], [ 54.59, 68.97 ], [ 53.57, 68.89 ], [ 54, 68.83 ], [ 53.72, 68.63 ], [ 53.94, 68.41 ], [ 53.32, 68.35 ], [ 53.33, 68.23 ], [ 54.02, 68.21 ], [ 54.35, 68.34 ], [ 54.87, 68.15 ], [ 55.39, 68.55 ], [ 56.01, 68.64 ], [ 57.3, 68.53 ], [ 57.65, 68.73 ], [ 59.2, 68.98 ], [ 58.88, 68.91 ], [ 59.48, 68.68 ], [ 59.09, 68.65 ], [ 59.12, 68.41 ], [ 59.69, 68.31 ], [ 59.95, 68.71 ], [ 61.15, 68.84 ], [ 60.19, 69.56 ], [ 60.85, 69.86 ], [ 64.26, 69.51 ], [ 67.15, 68.82 ], [ 68.31, 68.17 ], [ 69.17, 68.95 ], [ 68.48, 68.97 ], [ 68.13, 69.54 ], [ 67.03, 69.69 ], [ 66.9, 69.48 ], [ 67.53, 70.7 ], [ 66.63, 70.85 ], [ 66.94, 71.27 ], [ 68.31, 71.66 ], [ 69.01, 72.68 ], [ 69.7, 72.95 ], [ 69.58, 72.85 ], [ 71.62, 72.89 ], [ 72.01, 72.82 ], [ 71.75, 72.72 ], [ 72.06, 72.82 ], [ 72.84, 72.69 ], [ 72.83, 72.25 ], [ 71.82, 71.48 ], [ 72.8, 70.84 ], [ 72.4, 70.25 ], [ 72.52, 69 ], [ 73.6, 68.43 ], [ 73.07, 68.2 ], [ 73.11, 67.69 ], [ 72.53, 67.59 ], [ 71.75, 66.9 ], [ 71.39, 66.97 ], [ 70.19, 66.73 ], [ 68.84, 66.91 ], [ 68.72, 66.78 ], [ 70.17, 66.36 ], [ 72.03, 66.23 ], [ 72.47, 66.59 ], [ 73.88, 67 ], [ 73.93, 67.3 ], [ 74.79, 67.76 ], [ 74.31, 68.36 ], [ 74.45, 68.68 ], [ 75.33, 68.88 ], [ 76.61, 68.96 ], [ 77.29, 68.49 ], [ 77.13, 67.75 ], [ 78.06, 67.54 ], [ 79.18, 67.5 ], [ 77.46, 67.76 ], [ 77.53, 68.12 ], [ 78.17, 68.25 ], [ 77.63, 68.9 ], [ 76.02, 69.24 ], [ 74.8, 69.07 ], [ 73.78, 69.16 ], [ 73.53, 69.74 ], [ 74.3, 70.6 ], [ 73, 71.4 ], [ 73.52, 71.8 ], [ 74.99, 72.16 ], [ 74.79, 72.82 ], [ 75.44, 72.75 ], [ 75.65, 72.53 ], [ 75.3, 71.33 ], [ 77.77, 71.13 ], [ 78.17, 70.88 ], [ 78.97, 70.88 ], [ 79.1, 70.99 ], [ 78.43, 70.9 ], [ 78, 71.37 ], [ 77.69, 71.26 ], [ 76.65, 71.47 ], [ 75.99, 71.89 ], [ 76.39, 72 ], [ 76.61, 71.86 ], [ 76.39, 72 ], [ 76.89, 72.05 ], [ 77.56, 71.83 ], [ 78.09, 71.87 ], [ 78.06, 72.09 ], [ 77.4, 72.1 ], [ 78.09, 72.36 ], [ 79.5, 72.35 ], [ 81.68, 71.69 ], [ 83.44, 71.74 ], [ 82.28, 72.09 ], [ 82.35, 72.31 ], [ 80.84, 72.46 ], [ 80.88, 72.95 ], [ 80.32, 73.17 ], [ 80.75, 73.2 ], [ 80.35, 73.29 ], [ 80.77, 73.43 ], [ 80.53, 73.55 ], [ 85.27, 73.7 ], [ 87.21, 73.87 ], [ 86.94, 74.03 ], [ 87.37, 74.05 ], [ 85.91, 74.36 ], [ 86.32, 74.32 ], [ 86.44, 74.48 ], [ 87, 74.28 ], [ 87.41, 74.38 ], [ 85.75, 74.65 ], [ 85.9, 74.85 ], [ 86.98, 74.6 ], [ 87.18, 74.98 ], [ 87.62, 74.91 ], [ 87.83, 75.01 ], [ 86.96, 75.12 ], [ 88.19, 75.14 ], [ 88.19, 75.04 ], [ 89.29, 75.51 ], [ 89.77, 75.43 ], [ 90.19, 75.6 ], [ 91.72, 75.61 ], [ 91.73, 75.73 ], [ 93.89, 75.87 ], [ 94.16, 75.97 ], [ 92.87, 75.89 ], [ 93.45, 76.12 ], [ 93.43, 76.01 ], [ 94.62, 76.16 ], [ 96.27, 76.1 ], [ 95.75, 75.83 ], [ 96.43, 76 ], [ 96.54, 75.87 ], [ 97.87, 75.97 ], [ 97.56, 76.04 ], [ 98.83, 76.26 ], [ 99.86, 76.05 ], [ 98.88, 76.48 ], [ 101.08, 76.54 ], [ 101.39, 77.11 ], [ 104.1, 77.72 ], [ 105.93, 77.55 ], [ 106.31, 77.37 ], [ 104.14, 77.08 ], [ 105.93, 77.13 ], [ 105.53, 76.96 ], [ 106.81, 77.05 ], [ 107.53, 76.91 ], [ 106.5, 76.49 ], [ 107.73, 76.5 ], [ 108.02, 76.74 ], [ 110.1, 76.65 ], [ 111.1, 76.76 ], [ 112.02, 76.36 ], [ 112.34, 76.45 ], [ 112.81, 76.32 ], [ 112.71, 76.05 ], [ 113.09, 76.15 ], [ 113.34, 76.1 ], [ 113.29, 76.25 ], [ 113.59, 75.95 ], [ 113.38, 75.94 ], [ 113.61, 75.92 ], [ 113.44, 75.83 ], [ 113.78, 75.93 ], [ 113.9, 75.78 ], [ 113.43, 75.54 ], [ 113.58, 75.65 ], [ 112.33, 75.85 ], [ 112.8, 75.55 ], [ 113.28, 75.66 ], [ 113.37, 75.52 ], [ 113.76, 75.45 ], [ 112.84, 74.96 ], [ 111.8, 74.65 ], [ 109.58, 74.34 ], [ 109.89, 74.2 ], [ 108.11, 73.63 ], [ 106.94, 73.63 ], [ 106.83, 73.33 ], [ 106.13, 73.27 ], [ 105.27, 72.75 ], [ 106.47, 72.92 ], [ 106.35, 73.19 ], [ 108.36, 73.21 ], [ 109.45, 73.41 ], [ 109.22, 73.55 ], [ 109.78, 73.43 ], [ 110.9, 73.67 ], [ 110.69, 73.79 ], [ 109.66, 73.68 ], [ 110.12, 74.01 ], [ 111.01, 73.9 ], [ 111.55, 74.05 ], [ 111.32, 73.85 ], [ 112.29, 73.7 ], [ 112.98, 73.77 ], [ 112.83, 74 ], [ 113.6, 73.13 ], [ 113.87, 73.35 ], [ 113.51, 73.51 ], [ 115.59, 73.71 ], [ 118.79, 73.54 ], [ 118.4, 73.22 ], [ 119.7, 72.99 ], [ 122.71, 72.91 ], [ 122.94, 72.8 ], [ 122.57, 73.02 ], [ 123.2, 72.89 ], [ 123.72, 73.1 ], [ 123.27, 73.4 ], [ 123.6, 73.69 ], [ 123.77, 73.56 ], [ 124.36, 73.8 ], [ 125.02, 73.6 ], [ 125.16, 73.71 ], [ 125.58, 73.37 ], [ 126.3, 73.55 ], [ 126.13, 73.36 ], [ 126.49, 73.34 ], [ 127.05, 73.52 ], [ 127.84, 73.47 ], [ 127.95, 73.32 ], [ 128.44, 73.35 ], [ 128.13, 73.2 ], [ 128.93, 73.19 ], [ 127.95, 72.92 ], [ 128.42, 72.94 ], [ 128.29, 72.8 ], [ 126.63, 72.51 ], [ 126.65, 72.38 ], [ 127.8, 72.33 ], [ 128.97, 71.72 ], [ 129.12, 72.01 ], [ 129.6, 71.71 ], [ 128.98, 71.71 ], [ 128.9, 71.58 ], [ 129.25, 71.6 ], [ 129.72, 71.07 ], [ 130.63, 70.84 ], [ 130.85, 70.97 ], [ 131.07, 70.71 ], [ 132.2, 71.21 ], [ 132.78, 71.95 ], [ 133.19, 71.95 ], [ 132.76, 71.79 ], [ 133.33, 71.53 ], [ 134.73, 71.4 ], [ 134.76, 71.27 ], [ 134.84, 71.47 ], [ 135.79, 71.65 ], [ 137.59, 71.36 ], [ 138.07, 71.09 ], [ 137.87, 71.26 ], [ 138.49, 71.3 ], [ 137.86, 71.39 ], [ 138.13, 71.6 ], [ 138.51, 71.53 ], [ 138.85, 71.63 ], [ 139.24, 71.4 ], [ 140.1, 71.46 ], [ 139.84, 71.89 ], [ 139.37, 71.96 ], [ 140.61, 72.26 ], [ 139.42, 72.15 ], [ 139.15, 72.25 ], [ 139.77, 72.36 ], [ 139.4, 72.4 ], [ 139.6, 72.49 ], [ 141.29, 72.58 ], [ 140.85, 72.88 ], [ 146.86, 72.35 ], [ 144.97, 72.43 ], [ 144.29, 72.28 ], [ 144.55, 72.15 ], [ 145.21, 72.26 ], [ 146.95, 72.31 ], [ 145.98, 71.86 ], [ 146.35, 72.12 ], [ 146, 72.06 ], [ 146.07, 72.21 ], [ 145.49, 72.25 ], [ 145.81, 72.22 ], [ 145.84, 71.94 ], [ 145.03, 71.94 ], [ 144.99, 71.62 ], [ 146.06, 71.77 ], [ 147.14, 72.31 ], [ 148.39, 72.32 ], [ 150.1, 71.9 ], [ 149.7, 71.75 ], [ 149.36, 71.88 ], [ 148.86, 71.68 ], [ 150.69, 71.49 ], [ 149.84, 71.18 ], [ 151.11, 71.39 ], [ 152.07, 71.01 ], [ 151.45, 70.97 ], [ 152.53, 70.8 ], [ 153.73, 70.79 ], [ 157.02, 71.08 ], [ 159.34, 70.77 ], [ 160.1, 70.25 ], [ 159.56, 70.09 ], [ 159.95, 70.08 ], [ 159.6, 69.86 ], [ 159.74, 69.72 ], [ 161, 69.57 ], [ 161.3, 68.65 ], [ 161.67, 68.88 ], [ 161.51, 69.38 ], [ 162.36, 69.68 ], [ 164.02, 69.75 ], [ 164.61, 69.58 ], [ 166.61, 69.45 ], [ 167.94, 69.77 ], [ 168.32, 69.21 ], [ 169.33, 69.08 ], [ 169.59, 68.77 ], [ 170.58, 68.8 ], [ 171.03, 69.09 ], [ 170.65, 69.57 ], [ 170.16, 69.59 ], [ 170.61, 69.73 ], [ 170.55, 70.12 ], [ 172.75, 69.96 ], [ 173.34, 69.73 ], [ 173.47, 69.93 ], [ 173.76, 69.81 ], [ 176.11, 69.88 ], [ 179.4, 69.23 ], [ 180, 68.97 ], [ 180, 65.04 ], [ 178.55, 64.56 ], [ 178.77, 64.67 ], [ 177.63, 64.7 ], [ 177.53, 64.93 ], [ 177.25, 64.92 ], [ 176.95, 65.07 ], [ 176.6, 65.01 ], [ 176.43, 65.07 ], [ 176.54, 64.98 ], [ 177.01, 65.04 ], [ 177.34, 64.81 ], [ 176.25, 64.89 ], [ 176.44, 64.69 ], [ 176.21, 64.62 ], [ 176.54, 64.67 ], [ 176.77, 64.54 ], [ 177.51, 64.74 ], [ 177.62, 64.34 ], [ 178.15, 64.18 ], [ 178.28, 64.4 ], [ 179.63, 62.73 ], [ 179.15, 62.29 ], [ 178.09, 62.53 ], [ 177.13, 62.54 ], [ 174.58, 61.82 ], [ 173.84, 61.64 ], [ 173.52, 61.72 ], [ 173.26, 61.43 ], [ 172.76, 61.42 ], [ 172.94, 61.27 ], [ 172.34, 61.21 ], [ 172.42, 61.01 ], [ 172.01, 61.09 ], [ 172.07, 60.84 ], [ 170.64, 60.41 ], [ 170.29, 59.93 ], [ 169.67, 60.42 ], [ 168.49, 60.6 ], [ 167.23, 60.34 ], [ 167, 60.42 ], [ 166.29, 59.81 ], [ 166.09, 59.8 ], [ 166.27, 60.47 ], [ 165.03, 60.1 ], [ 165.22, 59.99 ], [ 164.84, 59.78 ], [ 164.48, 60.1 ], [ 164.2, 59.85 ], [ 164.23, 59.98 ], [ 163.67, 60.02 ], [ 163.19, 59.56 ], [ 163.22, 59.04 ], [ 162.94, 59.18 ], [ 163.07, 58.98 ], [ 162.41, 58.66 ], [ 161.9, 57.97 ], [ 162.48, 57.77 ], [ 162.36, 57.66 ], [ 162.7, 57.95 ], [ 163.32, 57.73 ], [ 162.78, 57.35 ], [ 162.78, 56.78 ], [ 163.23, 56.74 ], [ 163.36, 56.18 ], [ 163.05, 56.01 ], [ 162.62, 56.23 ], [ 162.09, 56.09 ], [ 161.74, 55.4 ], [ 162.14, 54.75 ], [ 161.71, 54.51 ], [ 160.71, 54.52 ], [ 159.99, 54.16 ], [ 159.84, 53.43 ], [ 160.04, 53.1 ], [ 159.81, 53.28 ], [ 158.7, 52.88 ], [ 158.61, 53.05 ], [ 158.4, 53 ], [ 158.65, 52.9 ], [ 158.55, 52.63 ], [ 158.39, 52.65 ], [ 158.55, 52.29 ], [ 157.91, 51.63 ], [ 156.67, 50.87 ], [ 155.58, 55.05 ], [ 155.94, 56.6 ], [ 156.54, 57.09 ], [ 156.74, 57.08 ], [ 157, 57.44 ], [ 156.85, 57.8 ], [ 157.45, 57.79 ], [ 157.68, 58.02 ], [ 158.2, 58.02 ], [ 159.03, 58.41 ], [ 160.49, 59.56 ], [ 161.92, 60.21 ], [ 161.95, 60.42 ], [ 163.73, 60.87 ], [ 163.49, 61.01 ], [ 164.03, 61.35 ], [ 163.75, 61.46 ], [ 164.06, 61.68 ], [ 164.14, 62.26 ], [ 164.53, 62.44 ], [ 165.12, 62.45 ], [ 164.61, 62.68 ], [ 163.25, 62.51 ], [ 163.37, 62.33 ], [ 162.96, 61.81 ], [ 163.34, 61.7 ], [ 163.1, 61.54 ], [ 162.84, 61.72 ], [ 162.75, 61.59 ], [ 162.39, 61.67 ], [ 160.8, 60.72 ], [ 160.43, 60.76 ], [ 160.17, 60.57 ], [ 160.44, 61.03 ], [ 159.79, 60.93 ], [ 160, 61.11 ], [ 159.77, 61.24 ], [ 160.28, 61.55 ], [ 160.37, 61.94 ], [ 159.58, 61.65 ], [ 159.57, 61.82 ], [ 158.97, 61.93 ], [ 158.08, 61.73 ], [ 157.5, 61.79 ], [ 156.69, 61.53 ], [ 156.66, 61.21 ], [ 155.93, 60.93 ], [ 155.91, 60.71 ], [ 154.87, 60.32 ], [ 154.48, 59.93 ], [ 154.58, 60.11 ], [ 154.41, 60.07 ], [ 154.48, 59.89 ], [ 154.21, 59.88 ], [ 154.37, 59.58 ], [ 154.23, 59.66 ], [ 154.13, 59.46 ], [ 154.97, 59.49 ], [ 155.18, 59.17 ], [ 154.33, 59.21 ], [ 154.04, 59.05 ], [ 153.79, 59.25 ], [ 153.39, 59.25 ], [ 152.91, 58.91 ], [ 152.36, 59.06 ], [ 152.07, 58.89 ], [ 151.34, 58.84 ], [ 151.1, 59.11 ], [ 152.32, 59.21 ], [ 151.74, 59.3 ], [ 151.41, 59.61 ], [ 150.76, 59.43 ], [ 150.5, 59.49 ], [ 150.77, 59.56 ], [ 149.55, 59.76 ], [ 149.05, 59.62 ], [ 149.23, 59.46 ], [ 148.72, 59.46 ], [ 148.93, 59.23 ], [ 148.42, 59.25 ], [ 148.2, 59.41 ], [ 147.54, 59.24 ], [ 146.51, 59.47 ], [ 146.05, 59.14 ], [ 145.92, 59.42 ], [ 143.48, 59.32 ], [ 143.25, 59.41 ], [ 142.28, 59.13 ], [ 141.56, 58.61 ], [ 140.8, 58.32 ], [ 140.49, 57.84 ], [ 138.63, 56.97 ], [ 138.11, 56.58 ], [ 138.23, 56.42 ], [ 135.23, 54.91 ], [ 135.25, 54.74 ], [ 135.74, 54.57 ], [ 136.83, 54.64 ], [ 136.79, 53.76 ], [ 137.19, 53.85 ], [ 137.19, 54.21 ], [ 137.73, 54.32 ], [ 137.3, 54.05 ], [ 137.86, 53.96 ], [ 137.31, 53.53 ], [ 137.95, 53.58 ], [ 138.58, 53.99 ], [ 138.26, 53.53 ], [ 138.46, 53.52 ], [ 138.77, 53.98 ], [ 138.66, 54.29 ], [ 139.3, 54.18 ], [ 139.73, 54.3 ], [ 140.54, 53.65 ], [ 141.13, 53.45 ], [ 140.91, 53.43 ], [ 141.42, 53.3 ], [ 141.11, 52.46 ], [ 141.55, 52.15 ], [ 140.73, 51.47 ], [ 140.86, 51.37 ], [ 140.67, 51.33 ], [ 140.43, 50.72 ], [ 140.5, 50.17 ], [ 140.69, 50.09 ], [ 140.4, 49.88 ], [ 140.55, 49.56 ], [ 140.2, 49.02 ], [ 140.39, 48.98 ], [ 140.17, 48.45 ], [ 139.26, 47.8 ], [ 137.69, 45.81 ], [ 135.88, 44.41 ], [ 135.14, 43.51 ], [ 133.92, 42.87 ], [ 133.04, 42.67 ], [ 133, 42.84 ], [ 132.85, 42.73 ], [ 132.76, 42.91 ], [ 132.57, 42.84 ], [ 132.41, 42.95 ], [ 132.32, 42.84 ], [ 132.33, 43.31 ], [ 131.96, 43.06 ], [ 132.07, 43.32 ], [ 131.76, 43.35 ], [ 131.22, 42.55 ], [ 130.71, 42.7 ], [ 130.87, 42.53 ], [ 130.7, 42.29 ], [ 130.37, 42.34 ], [ 129.76, 41.76 ], [ 129.72, 40.83 ], [ 129.22, 40.7 ], [ 128.63, 40.18 ], [ 128.33, 40.03 ], [ 128, 40.06 ], [ 127.51, 39.74 ], [ 127.57, 39.3 ], [ 127.45, 39.42 ], [ 127.37, 39.21 ], [ 127.75, 39.13 ], [ 128.36, 38.69 ], [ 128.62, 38.07 ], [ 129.43, 37.06 ], [ 129.37, 36.04 ], [ 129.58, 36.02 ], [ 129.22, 35.19 ], [ 128.97, 35.03 ], [ 128.8, 35.09 ], [ 128.83, 34.99 ], [ 128.59, 35.21 ], [ 128.63, 35.07 ], [ 128.36, 35.05 ], [ 128.5, 35.02 ], [ 128.4, 34.83 ], [ 128.32, 34.96 ], [ 128.04, 34.94 ], [ 128.05, 35.08 ], [ 127.87, 34.94 ], [ 128.04, 34.7 ], [ 127.84, 34.75 ], [ 127.87, 34.95 ], [ 127.6, 34.95 ], [ 127.78, 34.84 ], [ 127.64, 34.63 ], [ 127.51, 34.89 ], [ 127.35, 34.84 ], [ 127.51, 34.59 ], [ 127.34, 34.45 ], [ 127.11, 34.55 ], [ 127.34, 34.71 ], [ 127.23, 34.76 ], [ 126.95, 34.63 ], [ 126.89, 34.42 ], [ 126.79, 34.64 ], [ 126.52, 34.3 ], [ 126.26, 34.7 ], [ 126.45, 34.59 ], [ 126.39, 34.73 ], [ 126.59, 34.63 ], [ 126.47, 34.72 ], [ 126.65, 34.82 ], [ 126.37, 34.78 ], [ 126.43, 34.98 ], [ 126.31, 34.93 ], [ 126.39, 35.03 ], [ 126.24, 35.11 ], [ 126.46, 35.07 ], [ 126.31, 35.24 ], [ 126.49, 35.52 ], [ 126.68, 35.55 ], [ 126.46, 35.61 ], [ 126.48, 35.81 ], [ 126.57, 35.69 ], [ 126.8, 35.75 ], [ 126.59, 35.95 ], [ 126.44, 35.83 ], [ 126.52, 35.97 ], [ 126.76, 36.01 ], [ 126.5, 36.13 ], [ 126.59, 36.47 ], [ 126.45, 36.7 ], [ 126.29, 36.58 ], [ 126.11, 36.77 ], [ 126.3, 36.98 ], [ 126.37, 36.83 ], [ 126.33, 37 ], [ 126.5, 37.06 ], [ 126.91, 36.89 ], [ 126.77, 37 ], [ 126.88, 37.09 ], [ 126.75, 37.03 ], [ 126.53, 37.2 ], [ 126.75, 37.39 ], [ 126.58, 37.35 ], [ 126.57, 37.78 ], [ 126.39, 37.89 ], [ 126.12, 37.74 ], [ 125.59, 38.04 ], [ 125.73, 37.92 ], [ 125.34, 37.68 ], [ 125.43, 37.86 ], [ 124.97, 37.93 ], [ 125.26, 38.08 ], [ 124.65, 38.13 ], [ 125, 38.22 ], [ 124.85, 38.35 ], [ 125.25, 38.75 ], [ 125.13, 38.88 ], [ 125.46, 39.58 ], [ 125.27, 39.52 ], [ 125.23, 39.65 ], [ 125.09, 39.56 ], [ 124.95, 39.68 ], [ 124.82, 39.49 ], [ 124.77, 39.8 ], [ 124.62, 39.59 ], [ 124.26, 39.97 ], [ 124.14, 39.75 ], [ 123.65, 39.84 ], [ 122.75, 39.6 ], [ 122.29, 39.37 ], [ 122.06, 39.06 ], [ 121.84, 39.04 ], [ 121.91, 38.96 ], [ 121.72, 39.04 ], [ 121.69, 38.86 ], [ 121.13, 38.73 ], [ 121.09, 38.93 ], [ 121.66, 39.09 ], [ 121.59, 39.27 ], [ 121.93, 39.4 ], [ 121.55, 39.31 ], [ 121.24, 39.45 ], [ 121.57, 39.55 ], [ 121.47, 39.81 ], [ 121.89, 40 ], [ 122.28, 40.47 ], [ 121.84, 40.82 ], [ 121.86, 40.99 ], [ 121.75, 40.84 ], [ 120.97, 40.83 ], [ 121.03, 40.71 ], [ 120.83, 40.67 ], [ 120.46, 40.21 ], [ 119.4, 39.79 ], [ 119.29, 39.4 ], [ 118.92, 39.13 ], [ 118.53, 39.21 ], [ 118.4, 38.97 ], [ 118.06, 39.23 ], [ 117.72, 39.11 ], [ 117.88, 38.93 ], [ 117.72, 38.97 ], [ 117.85, 38.87 ], [ 117.62, 38.84 ], [ 117.72, 38.67 ], [ 117.57, 38.61 ], [ 117.76, 38.33 ], [ 118, 38.41 ], [ 117.84, 38.28 ], [ 117.95, 38.19 ], [ 118.15, 38.32 ], [ 118.04, 38.09 ], [ 118.12, 38.19 ], [ 118.55, 38.01 ], [ 118.63, 38.13 ], [ 119.07, 38.15 ], [ 118.94, 38.02 ], [ 119.31, 37.73 ], [ 119.01, 37.65 ], [ 118.93, 37.35 ], [ 119.02, 37.19 ], [ 119.27, 37.31 ], [ 119.18, 37.23 ], [ 119.16, 37.07 ], [ 119.21, 37.23 ], [ 119.29, 37.2 ], [ 119.24, 37.07 ], [ 119.75, 37.12 ], [ 119.84, 37.37 ], [ 120.32, 37.62 ], [ 120.22, 37.69 ], [ 120.74, 37.83 ], [ 121.56, 37.44 ], [ 122.12, 37.56 ], [ 122.16, 37.43 ], [ 122.71, 37.4 ], [ 122.45, 37.11 ], [ 122.51, 36.9 ], [ 122.17, 36.84 ], [ 122.17, 37.06 ], [ 121.64, 36.74 ], [ 121.48, 36.77 ], [ 121.57, 36.85 ], [ 121.01, 36.58 ], [ 120.77, 36.63 ], [ 120.99, 36.55 ], [ 120.89, 36.38 ], [ 120.69, 36.4 ], [ 120.71, 36.13 ], [ 120.28, 36.04 ], [ 120.32, 36.26 ], [ 120.11, 36.19 ], [ 120.3, 35.97 ], [ 119.92, 35.64 ], [ 119.65, 35.6 ], [ 119.17, 34.95 ], [ 119.64, 34.51 ], [ 120.27, 34.3 ], [ 120.86, 33.23 ], [ 120.96, 32.61 ], [ 121.37, 32.43 ], [ 121.36, 32.2 ], [ 121.73, 32.06 ], [ 121.97, 31.74 ], [ 121.3, 31.89 ], [ 121.11, 31.78 ], [ 121.97, 30.89 ], [ 121.48, 30.81 ], [ 120.68, 30.3 ], [ 120.88, 30.17 ], [ 121.32, 30.36 ], [ 121.66, 30 ], [ 122.14, 29.89 ], [ 121.43, 29.47 ], [ 121.49, 29.38 ], [ 122, 29.59 ], [ 121.97, 29.22 ], [ 121.79, 29.17 ], [ 121.81, 29.38 ], [ 121.75, 29.15 ], [ 121.54, 29.28 ], [ 121.61, 29.14 ], [ 121.44, 29.16 ], [ 121.73, 28.94 ], [ 121.51, 28.94 ], [ 121.68, 28.87 ], [ 121.51, 28.66 ], [ 121.63, 28.27 ], [ 121.46, 28.33 ], [ 121.15, 28.04 ], [ 121.27, 28.36 ], [ 121.07, 28.29 ], [ 121.01, 28.01 ], [ 120.82, 27.99 ], [ 120.87, 27.87 ], [ 120.6, 27.59 ], [ 120.7, 27.48 ], [ 120.52, 27.2 ], [ 120.19, 27.27 ], [ 120.44, 27.15 ], [ 120.04, 26.9 ], [ 120.13, 26.8 ], [ 120.12, 26.63 ], [ 119.84, 26.52 ], [ 120.07, 26.8 ], [ 119.92, 26.78 ], [ 119.87, 26.65 ], [ 119.85, 26.85 ], [ 119.73, 26.7 ], [ 119.55, 26.76 ], [ 119.83, 26.45 ], [ 119.62, 26.47 ], [ 119.67, 26.34 ], [ 119.96, 26.38 ], [ 119.52, 26.08 ], [ 119.71, 26.01 ], [ 119.6, 25.7 ], [ 119.46, 25.69 ], [ 119.65, 25.36 ], [ 119.56, 25.46 ], [ 119.49, 25.37 ], [ 119.36, 25.59 ], [ 119.34, 25.43 ], [ 119.11, 25.43 ], [ 119.37, 25.27 ], [ 119.28, 25.17 ], [ 119.12, 25.26 ], [ 119.05, 25.11 ], [ 119.02, 25.29 ], [ 118.85, 25.24 ], [ 119.03, 24.96 ], [ 118.74, 24.85 ], [ 118.67, 24.96 ], [ 118.6, 24.87 ], [ 118.78, 24.77 ], [ 118.65, 24.56 ], [ 118.44, 24.72 ], [ 118.23, 24.53 ], [ 118.17, 24.67 ], [ 118.13, 24.42 ], [ 118.08, 24.57 ], [ 118.04, 24.44 ], [ 117.79, 24.5 ], [ 118.14, 24.27 ], [ 117.77, 23.91 ], [ 117.7, 24.04 ], [ 117.59, 23.72 ], [ 117.58, 23.9 ], [ 117.36, 23.95 ], [ 117.48, 23.8 ], [ 117.3, 23.8 ], [ 117.13, 23.56 ], [ 116.91, 23.6 ], [ 116.8, 23.29 ], [ 116.54, 23.41 ], [ 116.74, 23.24 ], [ 116.55, 23.16 ], [ 116.5, 22.94 ], [ 115.82, 22.74 ], [ 115.61, 22.86 ], [ 115.57, 22.65 ], [ 115.26, 22.83 ], [ 114.98, 22.69 ], [ 114.88, 22.77 ], [ 114.88, 22.54 ], [ 114.73, 22.6 ], [ 114.78, 22.84 ], [ 114.51, 22.68 ], [ 114.61, 22.5 ], [ 114.5, 22.45 ], [ 114.41, 22.61 ], [ 114.21, 22.54 ], [ 114.34, 22.51 ], [ 114.22, 22.41 ], [ 114.4, 22.44 ], [ 114.3, 22.26 ], [ 113.92, 22.37 ], [ 114.03, 22.51 ], [ 113.89, 22.45 ], [ 113.75, 22.75 ], [ 113.56, 22.75 ], [ 113.55, 22.08 ], [ 113.36, 22.15 ], [ 113.35, 21.98 ], [ 113.26, 22.08 ], [ 113.26, 21.87 ], [ 113.03, 22.14 ], [ 112.98, 21.89 ], [ 112.79, 21.95 ], [ 112.57, 21.75 ], [ 112.4, 22.07 ], [ 112.4, 21.74 ], [ 112.02, 21.79 ], [ 111.86, 21.56 ], [ 111.91, 21.69 ], [ 111.71, 21.76 ], [ 111.79, 21.62 ], [ 111.65, 21.52 ], [ 111.43, 21.58 ], [ 111.26, 21.42 ], [ 111.03, 21.53 ], [ 110.44, 21.19 ], [ 110.5, 21.3 ], [ 110.33, 21.43 ], [ 110.42, 21.23 ], [ 110.31, 21.11 ], [ 110.55, 21.07 ], [ 110.53, 20.93 ], [ 110.2, 20.95 ], [ 110.31, 21.11 ], [ 110.16, 20.91 ], [ 110.39, 20.82 ], [ 110.3, 20.66 ], [ 110.46, 20.68 ], [ 110.53, 20.47 ], [ 110.28, 20.24 ], [ 109.92, 20.22 ], [ 109.86, 20.4 ], [ 110.01, 20.43 ], [ 109.82, 20.51 ], [ 109.67, 20.88 ], [ 109.75, 21.34 ], [ 109.96, 21.35 ], [ 109.94, 21.49 ], [ 109.65, 21.52 ], [ 109.6, 21.75 ], [ 109.48, 21.66 ], [ 109.55, 21.48 ], [ 109.16, 21.4 ], [ 109.04, 21.45 ], [ 109.14, 21.59 ], [ 109, 21.65 ], [ 108.96, 21.6 ], [ 108.85, 21.68 ], [ 108.9, 21.79 ], [ 108.83, 21.81 ], [ 108.86, 21.76 ], [ 108.82, 21.71 ], [ 108.86, 21.63 ], [ 108.74, 21.6 ], [ 108.72, 21.74 ], [ 108.69, 21.6 ], [ 108.55, 21.92 ], [ 108.47, 21.56 ], [ 108.37, 21.54 ], [ 108.44, 21.69 ], [ 107.97, 21.43 ], [ 107.77, 21.52 ], [ 107.61, 21.3 ], [ 107.36, 21.27 ], [ 107.35, 21 ], [ 106.88, 21 ], [ 106.95, 20.91 ], [ 106.86, 20.98 ], [ 106.81, 20.68 ], [ 106.58, 20.56 ], [ 106.55, 20.24 ], [ 105.95, 19.92 ], [ 105.64, 18.9 ], [ 106.06, 18.31 ], [ 106.43, 18.12 ], [ 106.46, 17.76 ], [ 106.7, 17.4 ], [ 107.34, 16.77 ], [ 108.19, 16.21 ], [ 108.15, 16.09 ], [ 108.32, 16.14 ], [ 108.29, 15.96 ], [ 108.94, 15.24 ], [ 109.3, 13.88 ], [ 109.29, 13.53 ], [ 109.2, 13.62 ], [ 109.33, 13.46 ], [ 109.21, 13.4 ], [ 109.46, 12.88 ], [ 109.36, 12.82 ], [ 109.44, 12.57 ], [ 109.34, 12.8 ], [ 109.19, 12.63 ], [ 109.34, 12.4 ], [ 109.14, 12.43 ], [ 109.28, 11.88 ], [ 109.13, 11.91 ], [ 109.23, 11.73 ], [ 109.03, 11.58 ], [ 109.02, 11.36 ], [ 108.3, 10.91 ], [ 108.09, 10.91 ], [ 107.99, 10.7 ], [ 107.08, 10.32 ], [ 107.01, 10.52 ], [ 106.78, 10.37 ], [ 106.79, 10.11 ], [ 106.5, 9.56 ], [ 106.3, 9.59 ], [ 106.17, 9.35 ], [ 105.51, 9.09 ], [ 105.11, 8.64 ], [ 104.72, 8.6 ], [ 104.9, 8.8 ], [ 104.78, 8.81 ], [ 104.85, 9.7 ], [ 105.11, 9.95 ], [ 104.99, 10.1 ], [ 104.74, 10.23 ], [ 104.6, 10.14 ], [ 104.25, 10.57 ], [ 103.86, 10.66 ], [ 103.61, 10.5 ], [ 103.49, 10.62 ], [ 103.71, 10.87 ], [ 103.55, 11.17 ], [ 103.42, 10.89 ], [ 103.12, 10.87 ], [ 103.14, 11.35 ], [ 102.61, 12.2 ], [ 102.58, 12.04 ], [ 102.29, 12.19 ], [ 101.76, 12.71 ], [ 101.42, 12.58 ], [ 100.85, 12.65 ], [ 100.97, 13.48 ], [ 100.28, 13.51 ], [ 99.95, 13.31 ], [ 100.11, 13.06 ], [ 99.96, 12.73 ], [ 100.02, 12.19 ], [ 99.56, 11.34 ], [ 99.29, 10.37 ], [ 99.15, 10.34 ], [ 99.25, 10.24 ], [ 99.15, 9.74 ], [ 99.31, 9.39 ], [ 99.22, 9.26 ], [ 99.84, 9.3 ], [ 99.96, 8.62 ], [ 100.09, 8.41 ], [ 100.11, 8.52 ], [ 100.22, 8.44 ], [ 100.47, 7.41 ], [ 100.76, 6.99 ], [ 101.56, 6.85 ], [ 101.81, 6.45 ], [ 102.35, 6.17 ], [ 102.5, 5.88 ], [ 103.15, 5.34 ], [ 103.48, 4.53 ], [ 103.33, 3.75 ], [ 103.47, 3.52 ], [ 103.43, 2.93 ], [ 103.82, 2.58 ], [ 104.28, 1.37 ], [ 104.09, 1.37 ], [ 103.97, 1.62 ], [ 104, 1.43 ], [ 103.71, 1.48 ], [ 103.51, 1.27 ], [ 103.36, 1.54 ], [ 101.29, 2.84 ], [ 101.39, 2.99 ], [ 101.3, 3.25 ], [ 100.73, 3.86 ], [ 100.76, 4.09 ], [ 100.56, 4.31 ], [ 100.66, 4.68 ], [ 100.36, 5.09 ], [ 100.35, 5.97 ], [ 100.1, 6.54 ], [ 99.7, 6.86 ], [ 99.74, 7.13 ], [ 99.39, 7.31 ], [ 99.24, 7.68 ], [ 99.04, 7.7 ], [ 98.95, 8.05 ], [ 98.77, 8.02 ], [ 98.63, 8.38 ], [ 98.47, 8.34 ], [ 98.43, 8.14 ], [ 98.41, 8.16 ], [ 98.39, 8.13 ], [ 98.36, 8.19 ], [ 98.28, 8.2 ], [ 98.22, 8.74 ], [ 98.32, 8.97 ], [ 98.39, 8.91 ], [ 98.32, 9.2 ], [ 98.59, 9.93 ], [ 98.45, 10.69 ], [ 98.79, 11 ], [ 98.65, 11.13 ], [ 98.72, 11.46 ], [ 98.83, 11.36 ], [ 98.81, 11.55 ], [ 98.71, 11.53 ], [ 98.82, 11.84 ], [ 98.54, 12.36 ], [ 98.8, 12.59 ], [ 98.61, 12.55 ], [ 98.72, 12.81 ], [ 98.35, 13.67 ], [ 98.17, 13.76 ], [ 98.12, 13.55 ], [ 98.1, 14.13 ], [ 97.87, 14.68 ], [ 98.02, 14.63 ], [ 97.92, 14.89 ], [ 97.82, 14.75 ], [ 97.72, 15.86 ], [ 97.44, 16.54 ], [ 96.9, 17.27 ], [ 96.66, 16.58 ], [ 95.85, 16.2 ], [ 95.47, 15.74 ], [ 95.12, 15.8 ], [ 95.12, 16.14 ], [ 95.02, 15.79 ], [ 94.74, 15.8 ], [ 94.88, 16.2 ], [ 94.71, 15.85 ], [ 94.56, 16 ], [ 94.39, 15.83 ], [ 94.43, 16.08 ], [ 94.24, 15.95 ], [ 94.24, 16.54 ], [ 94.5, 17.31 ], [ 94.66, 17.21 ], [ 94.56, 17.6 ], [ 94.66, 17.49 ], [ 94.32, 18.25 ], [ 94.25, 18.88 ], [ 94.18, 18.78 ], [ 94.02, 18.85 ], [ 94.12, 19.41 ], [ 93.73, 19.62 ], [ 93.82, 19.84 ], [ 93.43, 20.15 ], [ 93.36, 20.02 ], [ 93.29, 20.33 ], [ 93, 20.14 ], [ 93.08, 20.59 ], [ 93, 20.32 ], [ 92.62, 20.65 ], [ 92.73, 20.26 ], [ 92.19, 21.16 ], [ 92.31, 20.78 ], [ 91.94, 21.47 ], [ 92.06, 21.48 ], [ 92.06, 21.75 ], [ 91.98, 21.66 ], [ 92.01, 21.74 ], [ 91.96, 21.68 ], [ 91.94, 21.76 ], [ 91.89, 21.77 ], [ 91.73, 22.46 ], [ 91.42, 22.81 ], [ 91.51, 22.93 ], [ 91.21, 22.71 ], [ 91.24, 22.55 ], [ 90.86, 22.42 ], [ 90.77, 22.07 ], [ 90.62, 22 ], [ 90.6, 22.27 ], [ 90.21, 21.8 ], [ 89.94, 21.96 ], [ 89.96, 22.17 ], [ 89.76, 22.35 ], [ 89.78, 22.09 ], [ 89.68, 22.44 ], [ 89.48, 22.5 ], [ 89.46, 22.4 ], [ 89.32, 22.46 ], [ 89.33, 22.2 ], [ 89.15, 22.42 ], [ 89.24, 22.25 ], [ 88.95, 22.23 ], [ 88.72, 22.01 ], [ 88.59, 22.08 ], [ 88.47, 21.9 ], [ 88.47, 22.05 ], [ 88.27, 21.73 ], [ 88.21, 22.16 ], [ 88.05, 22.22 ], [ 88.19, 22.1 ], [ 87.84, 21.72 ], [ 87.12, 21.52 ], [ 86.89, 21.32 ], [ 86.78, 21.14 ], [ 86.96, 20.79 ], [ 86.83, 20.77 ], [ 86.75, 20.61 ], [ 87.05, 20.72 ], [ 86.74, 20.52 ], [ 86.8, 20.36 ], [ 86.38, 19.98 ], [ 86.26, 20.06 ], [ 86.24, 19.91 ], [ 85.15, 19.45 ], [ 84.12, 18.31 ], [ 83.43, 17.94 ], [ 83.21, 17.59 ], [ 82.47, 17.2 ], [ 82.25, 16.94 ], [ 82.31, 16.72 ], [ 82.03, 16.69 ], [ 82.32, 16.57 ], [ 81.73, 16.32 ], [ 81.56, 16.4 ], [ 81.26, 16.33 ], [ 81.39, 16.34 ], [ 81.21, 16.24 ], [ 81.1, 15.94 ], [ 80.96, 15.8 ], [ 80.88, 15.87 ], [ 80.83, 15.75 ], [ 80.77, 15.89 ], [ 80.5, 15.94 ], [ 80.54, 15.85 ], [ 80.32, 15.76 ], [ 80, 15.22 ], [ 80.36, 13.31 ], [ 80.16, 12.47 ], [ 79.76, 11.62 ], [ 79.88, 10.3 ], [ 79.3, 10.26 ], [ 78.9, 9.49 ], [ 79.19, 9.28 ], [ 78.41, 9.11 ], [ 78.19, 8.92 ], [ 78.07, 8.37 ], [ 77.55, 8.08 ], [ 77.32, 8.12 ], [ 76.55, 8.9 ], [ 76.32, 9.46 ], [ 76.24, 9.97 ], [ 76.41, 9.67 ], [ 76.39, 9.85 ], [ 76.27, 9.98 ], [ 76.22, 9.98 ], [ 75.7, 11.43 ], [ 75.19, 12.04 ], [ 74.36, 14.52 ], [ 73.91, 15.08 ], [ 73.78, 15.41 ], [ 73.95, 15.4 ], [ 73.79, 15.46 ], [ 74, 15.51 ], [ 73.77, 15.49 ], [ 73.46, 16.06 ], [ 73.32, 17.03 ], [ 72.93, 18.22 ], [ 73.09, 18.15 ], [ 73.12, 18.33 ], [ 72.92, 18.35 ], [ 72.86, 18.69 ], [ 72.94, 18.83 ], [ 73.04, 18.68 ], [ 73.07, 18.81 ], [ 72.91, 18.88 ], [ 73.04, 18.98 ], [ 73.01, 19.22 ], [ 72.76, 19.37 ], [ 72.88, 19.53 ], [ 72.72, 19.54 ], [ 72.65, 19.83 ], [ 72.95, 20.76 ], [ 72.72, 21.04 ], [ 72.88, 21.05 ], [ 72.71, 21.08 ], [ 72.81, 21.22 ], [ 72.61, 21.09 ], [ 72.63, 21.38 ], [ 72.82, 21.42 ], [ 72.64, 21.44 ], [ 72.75, 21.57 ], [ 72.61, 21.58 ], [ 72.81, 21.65 ], [ 72.52, 21.7 ], [ 72.73, 21.95 ], [ 72.51, 21.94 ], [ 72.59, 22.2 ], [ 72.88, 22.23 ], [ 72.49, 22.37 ], [ 72.21, 22.01 ], [ 72.1, 22.1 ], [ 72.2, 21.96 ], [ 72.07, 22.06 ], [ 72.06, 21.94 ], [ 72.22, 21.94 ], [ 72.26, 21.75 ], [ 72.13, 21.82 ], [ 72.31, 21.63 ], [ 72.11, 21.2 ], [ 70.84, 20.69 ], [ 70.18, 21.04 ], [ 68.96, 22.24 ], [ 69.07, 22.48 ], [ 69.19, 22.24 ], [ 70.15, 22.52 ], [ 70.73, 23.2 ], [ 70.83, 23.1 ], [ 71.11, 23.22 ], [ 71.23, 23.15 ], [ 71.72, 23.14 ], [ 71.46, 23.28 ], [ 71.41, 23.19 ], [ 71.21, 23.21 ], [ 71.39, 23.35 ], [ 71.24, 23.32 ], [ 71.31, 23.57 ], [ 71.05, 23.63 ], [ 71.06, 23.87 ], [ 71.27, 24 ], [ 71.16, 24.22 ], [ 70.57, 24.25 ], [ 70.71, 24.48 ], [ 70.21, 24.33 ], [ 70.12, 23.92 ], [ 70.84, 23.91 ], [ 70.83, 23.76 ], [ 71.15, 23.48 ], [ 70.83, 23.34 ], [ 70.79, 23.19 ], [ 70.32, 23.21 ], [ 70.12, 22.93 ], [ 69.57, 22.74 ], [ 68.76, 23.08 ], [ 68.6, 23.24 ], [ 68.74, 23.31 ], [ 68.5, 23.48 ], [ 68.56, 23.72 ], [ 68.74, 23.83 ], [ 69.01, 23.75 ], [ 69.23, 24.12 ], [ 68.69, 24.39 ], [ 68.43, 24.12 ], [ 68.27, 24.08 ], [ 68.22, 24.24 ], [ 68, 24.11 ], [ 67.97, 24.25 ], [ 67.49, 24.04 ], [ 67.62, 24.35 ], [ 67.39, 24.56 ], [ 67.59, 24.74 ], [ 66.66, 24.83 ], [ 66.74, 25.18 ], [ 66.38, 25.62 ], [ 66.09, 25.46 ], [ 66.35, 25.54 ], [ 66.51, 25.4 ], [ 64.76, 25.32 ], [ 64.59, 25.15 ], [ 64.56, 25.27 ], [ 64.1, 25.33 ], [ 64.23, 25.46 ], [ 64, 25.5 ], [ 63.92, 25.41 ], [ 64.06, 25.33 ], [ 63.67, 25.4 ], [ 63.44, 25.3 ], [ 63.49, 25.21 ], [ 62.51, 25.26 ], [ 62.38, 25.1 ], [ 62.13, 25.22 ], [ 61.78, 25.01 ], [ 61.81, 25.19 ], [ 61.42, 25.06 ], [ 60.61, 25.29 ], [ 60.54, 25.44 ], [ 60.47, 25.29 ], [ 59.59, 25.39 ], [ 59.36, 25.55 ], [ 59.09, 25.4 ], [ 58.57, 25.62 ], [ 57.76, 25.64 ], [ 57.71, 25.76 ], [ 57.3, 25.79 ], [ 56.84, 27.17 ], [ 55.75, 27.04 ], [ 55.49, 26.78 ], [ 55.24, 26.78 ], [ 54.79, 26.5 ], [ 54.29, 26.73 ], [ 53.73, 26.7 ], [ 53.46, 26.98 ], [ 52.69, 27.29 ], [ 52.43, 27.65 ], [ 51.97, 27.88 ], [ 51.4, 27.92 ], [ 51.03, 28.81 ], [ 50.8, 28.92 ], [ 50.92, 29.07 ], [ 50.67, 29.12 ], [ 50.67, 29.47 ], [ 50.15, 29.94 ], [ 50.07, 30.2 ], [ 49.56, 30 ], [ 49.47, 30.16 ], [ 49.24, 30.14 ], [ 49.32, 30.47 ], [ 49.05, 30.52 ], [ 48.7, 30.32 ], [ 48.91, 30.26 ], [ 48.93, 30.03 ], [ 48.44, 29.91 ], [ 48.18, 30.04 ], [ 47.98, 30.01 ], [ 47.84, 30.34 ], [ 47.82, 30.27 ], [ 48.19, 29.55 ], [ 47.98, 29.58 ], [ 47.7, 29.36 ], [ 48.1, 29.35 ], [ 48.47, 28.38 ], [ 48.89, 27.82 ], [ 48.85, 27.6 ], [ 49.25, 27.53 ], [ 49.31, 27.42 ], [ 49.12, 27.41 ], [ 49.44, 27.08 ], [ 49.49, 27.34 ], [ 49.7, 27.3 ], [ 49.49, 27.3 ], [ 49.55, 27.16 ], [ 49.63, 27.28 ], [ 49.58, 27.09 ], [ 50.16, 26.65 ], [ 49.99, 26.74 ], [ 50.24, 26.37 ], [ 50.16, 26.04 ], [ 50.03, 26.2 ], [ 50, 25.99 ], [ 50.49, 25.4 ], [ 50.77, 24.72 ], [ 50.87, 24.8 ], [ 50.76, 25.5 ], [ 50.85, 25.47 ], [ 50.85, 25.65 ], [ 50.91, 25.51 ], [ 50.97, 25.6 ], [ 51.03, 26.04 ], [ 51.26, 26.16 ], [ 51.42, 25.96 ], [ 51.66, 25.93 ], [ 51.47, 25.51 ], [ 51.66, 25.02 ], [ 51.37, 24.58 ], [ 51.22, 24.64 ], [ 51.3, 24.5 ], [ 51.5, 24.57 ], [ 51.28, 24.29 ], [ 51.59, 24.25 ], [ 51.57, 24.39 ], [ 51.63, 24.2 ], [ 51.65, 24.33 ], [ 51.78, 24.27 ], [ 51.8, 24.01 ], [ 52.08, 23.96 ], [ 52.59, 24.21 ], [ 53.15, 24.06 ], [ 53.96, 24.08 ], [ 54.18, 24.19 ], [ 54.02, 24.19 ], [ 54.13, 24.33 ], [ 54.24, 24.23 ], [ 54.51, 24.31 ], [ 54.66, 24.84 ], [ 54.75, 24.77 ], [ 55.34, 25.2 ], [ 55.29, 25.36 ], [ 55.97, 25.78 ], [ 56.2, 26.24 ], [ 56.41, 26.2 ], [ 56.32, 26.3 ], [ 56.5, 26.36 ], [ 56.49, 26.13 ], [ 56.33, 26.16 ], [ 56.48, 26.08 ], [ 56.27, 25.64 ], [ 56.58, 24.51 ], [ 57.18, 23.94 ], [ 58.75, 23.52 ], [ 59.29, 22.76 ], [ 59.8, 22.54 ], [ 59.81, 22.23 ], [ 59.34, 21.43 ], [ 58.66, 20.79 ], [ 58.52, 20.42 ], [ 58.21, 20.4 ], [ 58.31, 20.55 ], [ 58.18, 20.62 ], [ 57.82, 20.2 ], [ 57.68, 19.71 ], [ 57.84, 19 ], [ 56.79, 18.74 ], [ 56.35, 17.92 ], [ 55.43, 17.82 ], [ 55.23, 17.53 ], [ 55.26, 17.24 ], [ 55.02, 17 ], [ 54.05, 16.99 ], [ 52.49, 16.44 ], [ 52.15, 15.99 ], [ 52.2, 15.61 ], [ 51.37, 15.23 ], [ 49.35, 14.64 ], [ 48.68, 14.05 ], [ 47.98, 14.05 ], [ 47.39, 13.65 ], [ 46.69, 13.43 ], [ 45.66, 13.35 ], [ 45.13, 12.98 ], [ 45.04, 12.75 ], [ 45, 12.85 ], [ 44.87, 12.72 ], [ 44.58, 12.82 ], [ 43.96, 12.59 ], [ 43.6, 12.75 ], [ 43.47, 12.67 ], [ 43.23, 13.28 ], [ 43.29, 13.69 ], [ 42.94, 14.92 ], [ 42.85, 15.15 ], [ 42.6, 15.23 ], [ 42.7, 15.36 ], [ 42.81, 15.28 ], [ 42.68, 15.69 ], [ 42.84, 16.06 ], [ 42.71, 16.73 ], [ 42.36, 17.19 ], [ 42.37, 17.01 ], [ 42.31, 17.45 ], [ 41.64, 18 ], [ 40.79, 19.73 ], [ 40.11, 20.27 ], [ 39.73, 20.39 ], [ 39.19, 21.1 ], [ 39.17, 21.78 ], [ 39.08, 21.71 ], [ 38.93, 22.01 ], [ 39.14, 22.41 ], [ 38.46, 23.78 ], [ 37.95, 24.21 ], [ 37.43, 24.37 ], [ 37.16, 24.82 ], [ 37.24, 25.19 ], [ 36.64, 25.85 ], [ 36.71, 26.03 ], [ 36.5, 26.12 ], [ 35.22, 28.05 ], [ 34.57, 28.09 ], [ 35, 29.53 ], [ 34.74, 29.31 ], [ 34.25, 27.72 ], [ 33.24, 28.56 ], [ 33.18, 29 ], [ 32.72, 29.45 ], [ 32.57, 30.21 ], [ 32.37, 30.41 ], [ 32.34, 31.19 ], [ 32.37, 31.25 ], [ 32.61, 31.06 ], [ 32.92, 31.15 ], [ 32.71, 31.03 ], [ 33.09, 31.18 ], [ 33.14, 31.04 ], [ 33.46, 31.08 ], [ 33.27, 31.21 ], [ 33.76, 31.13 ], [ 34.2, 31.31 ], [ 34.56, 31.69 ], [ 34.95, 32.83 ], [ 35.64, 34 ], [ 35.65, 34.28 ], [ 35.99, 34.53 ], [ 35.91, 35.42 ], [ 35.72, 35.59 ], [ 35.98, 36.01 ], [ 35.78, 36.32 ], [ 36.19, 36.59 ], [ 36.2, 36.79 ], [ 36.01, 36.93 ], [ 35.34, 36.54 ], [ 34.65, 36.81 ], [ 33.96, 36.23 ], [ 33.87, 36.32 ], [ 33.69, 36.14 ], [ 32.8, 36.02 ], [ 32.39, 36.16 ], [ 32.02, 36.54 ], [ 30.68, 36.88 ], [ 30.41, 36.21 ], [ 30.18, 36.31 ], [ 29.68, 36.13 ], [ 29.1, 36.39 ], [ 29.09, 36.68 ], [ 28.93, 36.76 ], [ 28.85, 36.59 ], [ 28.46, 36.88 ], [ 28.03, 36.56 ], [ 28.13, 36.81 ], [ 27.93, 36.74 ], [ 27.73, 36.76 ], [ 27.68, 36.66 ], [ 27.36, 36.68 ], [ 27.64, 36.81 ], [ 28.03, 36.79 ], [ 28.02, 36.93 ], [ 28.33, 37.05 ], [ 27.26, 36.96 ], [ 27.25, 37.13 ], [ 27.47, 37.08 ], [ 27.64, 37.25 ], [ 27.46, 37.25 ], [ 27.42, 37.42 ], [ 27.19, 37.35 ], [ 27.23, 37.58 ], [ 27, 37.66 ], [ 27.25, 37.74 ], [ 27.25, 37.98 ], [ 26.87, 38.03 ], [ 26.76, 38.22 ], [ 26.59, 38.1 ], [ 26.23, 38.27 ], [ 26.52, 38.43 ], [ 26.42, 38.68 ], [ 26.67, 38.31 ], [ 26.71, 38.43 ], [ 26.8, 38.36 ], [ 27.17, 38.45 ], [ 26.94, 38.43 ], [ 26.72, 38.65 ], [ 27.07, 38.88 ], [ 26.8, 38.95 ], [ 26.88, 39.09 ], [ 26.61, 39.28 ], [ 26.95, 39.56 ], [ 26.06, 39.48 ], [ 26.18, 39.99 ], [ 26.75, 40.4 ], [ 27.29, 40.48 ], [ 27.76, 40.31 ], [ 27.88, 40.37 ], [ 27.75, 40.53 ], [ 28.03, 40.48 ], [ 27.96, 40.35 ], [ 29.05, 40.36 ], [ 29.15, 40.44 ], [ 28.79, 40.55 ], [ 29.94, 40.72 ], [ 29.26, 40.8 ], [ 29.01, 41.01 ], [ 29.17, 41.22 ], [ 31.25, 41.1 ], [ 31.4, 41.32 ], [ 32.58, 41.83 ], [ 33.34, 42.02 ], [ 34.72, 41.94 ], [ 34.94, 42.1 ], [ 35.21, 42.02 ], [ 35.09, 41.92 ], [ 35.28, 41.72 ], [ 36.07, 41.68 ], [ 36.4, 41.25 ], [ 36.66, 41.38 ], [ 37.51, 41.03 ], [ 37.68, 41.14 ], [ 38.36, 40.91 ], [ 39.42, 41.11 ], [ 40.13, 40.91 ], [ 41.4, 41.38 ], [ 41.72, 41.7 ], [ 41.75, 42.02 ], [ 41.44, 42.74 ], [ 40.87, 43.07 ], [ 40.34, 43.15 ], [ 38.79, 44.28 ], [ 38.21, 44.42 ], [ 37.81, 44.73 ], [ 37.48, 44.69 ], [ 37.24, 44.99 ], [ 36.6, 45.2 ], [ 36.99, 45.29 ], [ 36.76, 45.41 ], [ 36.62, 45.31 ], [ 36.79, 45.44 ], [ 37.54, 45.39 ], [ 37.62, 45.66 ], [ 37.98, 46.04 ], [ 38.11, 45.95 ], [ 38.28, 46.26 ], [ 38.58, 46.04 ], [ 38.14, 46.38 ], [ 37.91, 46.41 ], [ 37.73, 46.68 ], [ 38.59, 46.66 ], [ 38.4, 46.73 ], [ 38.5, 46.88 ], [ 39.3, 47.02 ], [ 39.2, 47.28 ], [ 38.48, 47.14 ], [ 38.83, 47.28 ], [ 38.63, 47.26 ], [ 38.09, 47.02 ], [ 37.57, 47.1 ], [ 36.77, 46.63 ], [ 36.62, 46.78 ], [ 36.17, 46.5 ], [ 36.29, 46.65 ], [ 35.9, 46.66 ], [ 35.15, 46.12 ], [ 34.98, 46.08 ], [ 35.36, 46.36 ], [ 34.63, 46.17 ], [ 34.48, 45.95 ], [ 34.52, 46.14 ], [ 34.33, 46.22 ], [ 34.23, 46.06 ], [ 34.14, 46.21 ], [ 34.03, 46.1 ], [ 34.49, 45.87 ], [ 34.65, 45.94 ], [ 34.52, 45.79 ], [ 34.79, 45.9 ], [ 34.65, 45.79 ], [ 34.98, 45.68 ], [ 35.13, 45.34 ], [ 35.47, 45.29 ], [ 34.83, 45.81 ], [ 34.83, 46.01 ], [ 34.67, 46.1 ], [ 34.81, 46.15 ], [ 35.47, 45.3 ], [ 35.85, 45.47 ], [ 36.65, 45.38 ], [ 36.46, 45.34 ], [ 36.37, 45.06 ], [ 35.84, 45 ], [ 35.5, 45.12 ], [ 35.08, 44.79 ], [ 34.6, 44.77 ], [ 33.97, 44.39 ], [ 33.38, 44.58 ], [ 33.61, 44.6 ], [ 33.6, 44.99 ], [ 32.99, 45.33 ], [ 33.2, 45.45 ], [ 32.98, 45.33 ], [ 32.48, 45.39 ], [ 33.18, 45.81 ], [ 33.68, 45.84 ], [ 33.59, 46.16 ], [ 33.5, 46.03 ], [ 33.2, 46.17 ], [ 32.54, 46.07 ], [ 31.9, 46.32 ], [ 31.78, 46.27 ], [ 32.03, 46.44 ], [ 31.71, 46.43 ], [ 31.51, 46.58 ], [ 32.49, 46.51 ], [ 31.98, 46.65 ], [ 31.99, 46.91 ], [ 31.8, 46.61 ], [ 31.42, 46.63 ], [ 31.59, 46.84 ], [ 31.41, 46.62 ], [ 30.76, 46.55 ], [ 30.47, 46.08 ] ], [ [ 52.27, 12.2 ], [ 52.39, 12.2 ], [ 52.06, 12.24 ], [ 52.27, 12.2 ] ], [ [ 47.67, 45.61 ], [ 47.53, 45.67 ], [ 47.1, 44.87 ], [ 46.98, 45.01 ], [ 46.68, 44.47 ], [ 47.22, 44.22 ], [ 47.46, 43.82 ], [ 47.7, 43.89 ], [ 47.47, 43.01 ], [ 48.36, 41.96 ], [ 49.07, 41.37 ], [ 49.55, 40.63 ], [ 50.37, 40.42 ], [ 50.37, 40.23 ], [ 49.87, 40.37 ], [ 49.48, 40.18 ], [ 49.27, 39.5 ], [ 49.44, 39.28 ], [ 49.26, 39.35 ], [ 49.2, 39.12 ], [ 49.01, 39.28 ], [ 48.87, 39.19 ], [ 49.02, 39.21 ], [ 48.81, 38.88 ], [ 49, 37.73 ], [ 49.47, 37.46 ], [ 50.2, 37.38 ], [ 50.7, 36.9 ], [ 51.67, 36.6 ], [ 53.81, 36.9 ], [ 53.96, 36.9 ], [ 53.36, 36.82 ], [ 54.03, 36.81 ], [ 53.81, 37.91 ], [ 54.02, 38.96 ], [ 53.72, 39.08 ], [ 53.71, 39.23 ], [ 53.65, 39.12 ], [ 53.55, 39.37 ], [ 53.16, 39.37 ], [ 53.18, 39.22 ], [ 53.1, 39.43 ], [ 53.29, 39.7 ], [ 53.23, 39.54 ], [ 53.46, 39.56 ], [ 53.43, 39.44 ], [ 53.74, 39.55 ], [ 53.44, 39.71 ], [ 53.6, 39.94 ], [ 54.14, 39.8 ], [ 53.63, 40.02 ], [ 52.93, 40.01 ], [ 52.95, 39.86 ], [ 52.76, 40.01 ], [ 52.95, 40.99 ], [ 52.55, 41.54 ], [ 52.42, 42.09 ], [ 52.68, 42.55 ], [ 52.55, 42.73 ], [ 52.7, 42.57 ], [ 52.75, 42.72 ], [ 51.91, 42.83 ], [ 51.66, 43.18 ], [ 51.27, 43.15 ], [ 51.28, 43.6 ], [ 50.84, 44.2 ], [ 50.25, 44.39 ], [ 50.31, 44.65 ], [ 51.6, 44.51 ], [ 51.3, 44.6 ], [ 51.3, 45.24 ], [ 51.76, 45.41 ], [ 52.43, 45.42 ], [ 52.98, 45.88 ], [ 53.26, 45.89 ], [ 53.41, 46.42 ], [ 53.1, 46.89 ], [ 52.32, 47.07 ], [ 51.7, 46.92 ], [ 51.42, 47.07 ], [ 50.89, 47.07 ], [ 49.94, 46.58 ], [ 49.84, 46.19 ], [ 49.34, 46.29 ], [ 49.22, 45.99 ], [ 49.03, 46.12 ], [ 49.05, 45.89 ], [ 48.93, 45.98 ], [ 48.84, 45.82 ], [ 48.74, 45.91 ], [ 48.73, 45.62 ], [ 48.36, 45.7 ], [ 48.4, 45.59 ], [ 48.27, 45.73 ], [ 48.14, 45.4 ], [ 48.01, 45.66 ], [ 47.99, 45.36 ], [ 47.98, 45.67 ], [ 47.85, 45.69 ], [ 47.88, 45.46 ], [ 47.73, 45.62 ], [ 47.77, 45.41 ], [ 47.67, 45.61 ] ], [ [ 15.33, 43.81 ], [ 15.46, 43.73 ], [ 15.22, 43.88 ], [ 15.33, 43.81 ] ], [ [ 69.73, 66.65 ], [ 70.03, 66.54 ], [ 69.48, 66.76 ], [ 69.73, 66.65 ] ], [ [ 92.98, 19.95 ], [ 92.92, 20.09 ], [ 93.03, 19.82 ], [ 92.98, 19.95 ] ], [ [ 93.17, 19.96 ], [ 93.25, 19.82 ], [ 93.13, 20.06 ], [ 93.17, 19.96 ] ] ], [ [ [ -71.23, -54.87 ], [ -71.37, -54.96 ], [ -71.48, -54.88 ], [ -71.2, -54.82 ], [ -70.92, -54.93 ], [ -71.23, -54.87 ] ] ], [ [ [ -69.39, -54.93 ], [ -69.13, -54.97 ], [ -69.93, -55.07 ], [ -69.86, -54.89 ], [ -69.75, -54.99 ], [ -69.75, -54.88 ], [ -69.39, -54.93 ] ] ], [ [ [ -39.03, -13.49 ], [ -38.91, -13.37 ], [ -38.93, -13.58 ], [ -39.03, -13.49 ] ] ], [ [ [ -38.67, -12.89 ], [ -38.61, -12.99 ], [ -38.79, -13.13 ], [ -38.67, -12.89 ] ] ], [ [ [ -71.38, -54 ], [ -71.21, -54.19 ], [ -71, -54.1 ], [ -71.12, -54.4 ], [ -71.39, -54.11 ], [ -71.67, -54.23 ], [ -71.61, -53.94 ], [ -71.41, -54.09 ], [ -71.38, -54 ] ] ], [ [ [ -63.89, 10.9 ], [ -64.06, 10.86 ], [ -64.17, 10.98 ], [ -64.04, 10.97 ], [ -64.03, 10.99 ], [ -64.04, 10.99 ], [ -64.06, 10.98 ], [ -64.12, 10.99 ], [ -64.14, 11 ], [ -64.17, 11.02 ], [ -64.2, 11.05 ], [ -64.21, 10.93 ], [ -64.41, 10.97 ], [ -64.21, 11.09 ], [ -64.19, 11.08 ], [ -64.21, 11.05 ], [ -64.19, 11.03 ], [ -64.15, 11.01 ], [ -64.04, 10.99 ], [ -64.02, 11 ], [ -64.01, 11.07 ], [ -63.97, 11.08 ], [ -63.98, 11.11 ], [ -63.88, 11.18 ], [ -63.78, 11 ], [ -63.89, 10.9 ] ] ], [ [ [ -61.01, 10.36 ], [ -60.99, 10.14 ], [ -61.16, 10.07 ], [ -61.93, 10.05 ], [ -61.46, 10.3 ], [ -61.61, 10.75 ], [ -60.91, 10.83 ], [ -61.04, 10.69 ], [ -61.01, 10.36 ] ] ], [ [ [ -60.76, 11.24 ], [ -60.52, 11.34 ], [ -60.84, 11.15 ], [ -60.76, 11.24 ] ] ], [ [ [ -61.33, 9.64 ], [ -61.51, 9.85 ], [ -61.43, 9.81 ], [ -61.24, 9.63 ], [ -61.2, 9.58 ], [ -61.33, 9.64 ] ] ], [ [ [ 44.2, -12.17 ], [ 44.47, -12.07 ], [ 44.53, -12.38 ], [ 44.2, -12.17 ] ] ], [ [ [ -78.87, 8.46 ], [ -78.91, 8.22 ], [ -78.98, 8.45 ], [ -78.87, 8.46 ] ] ], [ [ [ 43.45, -11.79 ], [ 43.47, -11.94 ], [ 43.24, -11.78 ], [ 43.34, -11.37 ], [ 43.45, -11.79 ] ] ], [ [ [ 48.25, -13.24 ], [ 48.36, -13.41 ], [ 48.19, -13.39 ], [ 48.25, -13.24 ] ] ], [ [ [ 48.12, 29.79 ], [ 48.11, 29.97 ], [ 48.34, 29.86 ], [ 48.23, 29.58 ], [ 48.12, 29.79 ] ] ], [ [ [ -73.38, -53.19 ], [ -73.1, -53.37 ], [ -73.61, -53.34 ], [ -73.46, -53.31 ], [ -73.6, -53.28 ], [ -73.61, -53.2 ], [ -73.73, -53.14 ], [ -73.75, -53.2 ], [ -73.89, -53.07 ], [ -74.32, -53.13 ], [ -74.73, -52.73 ], [ -74.32, -52.98 ], [ -74.12, -52.94 ], [ -73.63, -53.18 ], [ -73.6, -53.08 ], [ -73.53, -53.28 ], [ -73.51, -53.23 ], [ -73.43, -53.25 ], [ -73.51, -53.15 ], [ -73.38, -53.19 ] ] ], [ [ [ -72.36, -54.05 ], [ -72.49, -53.96 ], [ -72.55, -54.11 ], [ -73.06, -54.1 ], [ -72.78, -54.1 ], [ -72.98, -54.03 ], [ -72.75, -54.07 ], [ -72.88, -53.97 ], [ -72.65, -53.87 ], [ -72.91, -53.96 ], [ -72.83, -53.76 ], [ -73.04, -53.91 ], [ -72.81, -53.7 ], [ -73.18, -53.68 ], [ -72.93, -53.62 ], [ -73.24, -53.64 ], [ -73.43, -53.46 ], [ -73.04, -53.54 ], [ -73.2, -53.42 ], [ -73.04, -53.38 ], [ -72.86, -53.66 ], [ -72.86, -53.45 ], [ -72.68, -53.65 ], [ -72.68, -53.53 ], [ -72.46, -53.58 ], [ -72.62, -53.72 ], [ -72.15, -53.79 ], [ -72.48, -53.83 ], [ -72.36, -54.05 ] ] ], [ [ [ -72.03, -53.9 ], [ -71.65, -53.93 ], [ -71.75, -54.17 ], [ -71.95, -54.04 ], [ -71.8, -54.34 ], [ -72.26, -54.07 ], [ -72.28, -53.92 ], [ -72.06, -53.99 ], [ -72.03, -53.9 ] ] ], [ [ [ -73.66, -53.46 ], [ -73.4, -53.4 ], [ -73.51, -53.5 ], [ -73.33, -53.58 ], [ -73.56, -53.59 ], [ -73.82, -53.43 ], [ -73.46, -53.56 ], [ -73.66, -53.46 ] ] ], [ [ [ -74.12, -52.21 ], [ -73.9, -52.34 ], [ -74.11, -52.42 ], [ -74.12, -52.21 ] ] ], [ [ [ -74.88, -52.24 ], [ -74.58, -52.21 ], [ -74.7, -52.34 ], [ -74.88, -52.24 ] ] ], [ [ [ -72.81, -52.81 ], [ -72.68, -52.72 ], [ -72.72, -52.9 ], [ -72.42, -52.88 ], [ -72.17, -52.65 ], [ -71.4, -52.72 ], [ -72.04, -53.14 ], [ -72.6, -53.07 ], [ -72.2, -53.19 ], [ -72.62, -53.2 ], [ -72.42, -53.26 ], [ -72.68, -53.35 ], [ -72.43, -53.54 ], [ -73.31, -53.17 ], [ -72.72, -53.3 ], [ -72.85, -53.19 ], [ -72.68, -53.14 ], [ -72.97, -53.11 ], [ -72.85, -53.04 ], [ -73.01, -52.86 ], [ -72.81, -52.81 ] ] ], [ [ [ -74.07, -52 ], [ -74.51, -51.71 ], [ -73.64, -52.22 ], [ -74.07, -52 ] ] ], [ [ [ -73.71, -52.55 ], [ -73.9, -52.75 ], [ -73.84, -52.57 ], [ -74.07, -52.64 ], [ -73.75, -52.42 ], [ -73.71, -52.55 ] ] ], [ [ [ -74.01, -52.24 ], [ -74.01, -52.14 ], [ -73.72, -52.42 ], [ -74.01, -52.24 ] ] ], [ [ [ -74.95, -50.79 ], [ -74.79, -50.66 ], [ -74.66, -50.88 ], [ -74.95, -50.79 ] ] ], [ [ [ -74.74, -50.42 ], [ -74.54, -50.4 ], [ -74.75, -50.52 ], [ -74.74, -50.42 ] ] ], [ [ [ -75.43, -50.48 ], [ -75.06, -50.51 ], [ -75.32, -50.56 ], [ -75.3, -50.81 ], [ -75.51, -50.67 ], [ -75.34, -50.63 ], [ -75.43, -50.48 ] ] ], [ [ [ -74.29, -50.85 ], [ -74.64, -50.66 ], [ -74.35, -50.54 ], [ -74.69, -50.49 ], [ -74.54, -50.41 ], [ -74.36, -50.46 ], [ -74.21, -50.68 ], [ -74.29, -50.85 ] ] ], [ [ [ -74.88, -50.15 ], [ -75.23, -50.46 ], [ -75.19, -50.29 ], [ -75.46, -50.38 ], [ -75.41, -50.16 ], [ -75.21, -50.27 ], [ -75.1, -50.16 ], [ -75.37, -50 ], [ -74.88, -50.15 ] ] ], [ [ [ -74.55, -51.34 ], [ -74.73, -51.29 ], [ -75.03, -51.48 ], [ -74.8, -51.21 ], [ -74.56, -51.21 ], [ -74.55, -51.34 ] ] ], [ [ [ -74.4, -51.1 ], [ -74.39, -51.23 ], [ -74.59, -51.06 ], [ -74.4, -51.1 ] ] ], [ [ [ -73.91, -51.78 ], [ -74.25, -51.72 ], [ -74.12, -51.55 ], [ -73.91, -51.78 ] ] ], [ [ [ -75.11, -51.84 ], [ -74.98, -51.72 ], [ -75, -51.9 ], [ -75.11, -51.84 ] ] ], [ [ [ -75.15, -51.57 ], [ -75.35, -51.59 ], [ -75.12, -51.25 ], [ -75.14, -51.39 ], [ -74.98, -51.36 ], [ -75.15, -51.57 ] ] ], [ [ [ -75.39, -49 ], [ -75.28, -48.93 ], [ -75.24, -49.07 ], [ -75.59, -49.22 ], [ -75.39, -49 ] ] ], [ [ [ -75.09, -49 ], [ -74.83, -49.07 ], [ -74.87, -49.29 ], [ -75.09, -49.08 ], [ -75.2, -49.13 ], [ -75.09, -49 ] ] ], [ [ [ -75.27, -49.67 ], [ -75.15, -49.9 ], [ -75.35, -49.69 ], [ -75.62, -49.85 ], [ -75.55, -49.59 ], [ -75.27, -49.67 ] ] ], [ [ [ -75.34, -48 ], [ -75.02, -48.46 ], [ -75.17, -48.69 ], [ -75.21, -48.31 ], [ -75.5, -48.37 ], [ -75.32, -48.33 ], [ -75.53, -48.1 ], [ -75.34, -48 ] ] ], [ [ [ -75.33, -48.93 ], [ -75.45, -49.04 ], [ -75.63, -48.86 ], [ -75.23, -48.84 ], [ -75.2, -49.05 ], [ -75.25, -48.9 ], [ -75.33, -48.93 ] ] ], [ [ [ -75.26, -48.63 ], [ -75.58, -48.75 ], [ -75.59, -48.65 ], [ -75.45, -48.7 ], [ -75.26, -48.63 ] ] ], [ [ [ -75.09, -48.81 ], [ -75.22, -48.75 ], [ -75.01, -48.6 ], [ -75.09, -48.81 ] ] ], [ [ [ -75.25, -48.81 ], [ -75, -48.94 ], [ -75.14, -48.99 ], [ -75.25, -48.81 ] ] ], [ [ [ -75.58, -48.49 ], [ -75.29, -48.41 ], [ -75.23, -48.59 ], [ -75.47, -48.68 ], [ -75.55, -48.63 ], [ -75.32, -48.52 ], [ -75.53, -48.61 ], [ -75.58, -48.49 ] ] ], [ [ [ -74.98, -48.71 ], [ -74.96, -48.6 ], [ -74.77, -48.65 ], [ -74.98, -48.71 ] ] ], [ [ [ -75.05, -48.26 ], [ -75.21, -48.07 ], [ -74.9, -48.12 ], [ -74.9, -48.26 ], [ -74.74, -48.17 ], [ -74.96, -48.45 ], [ -75.05, -48.26 ] ] ], [ [ [ -75.03, -48 ], [ -75.22, -48.01 ], [ -74.98, -47.87 ], [ -74.75, -48.04 ], [ -75.03, -48.03 ], [ -74.79, -48.13 ], [ -75.11, -48.06 ], [ -75.03, -48 ] ] ], [ [ [ -74.29, -48.27 ], [ -74.14, -48.43 ], [ -74.22, -48.47 ], [ -74.45, -48.35 ], [ -74.22, -48.42 ], [ -74.29, -48.27 ] ] ], [ [ [ -74.32, -48.44 ], [ -74.36, -48.54 ], [ -74.47, -48.37 ], [ -74.32, -48.44 ] ] ], [ [ [ -74.01, -47.83 ], [ -73.78, -47.93 ], [ -74.47, -47.89 ], [ -74.01, -47.83 ] ] ], [ [ [ -75.29, -47.72 ], [ -75.08, -47.66 ], [ -74.99, -47.78 ], [ -75.17, -47.84 ], [ -75.29, -47.72 ] ] ], [ [ [ -73.68, -46.06 ], [ -73.73, -46.21 ], [ -73.92, -46.09 ], [ -73.68, -46.06 ] ] ], [ [ [ -73.51, -42.46 ], [ -73.39, -42.58 ], [ -73.66, -42.39 ], [ -73.51, -42.46 ] ] ], [ [ [ -72.84, -44.64 ], [ -72.97, -44.58 ], [ -72.79, -44.69 ], [ -73.12, -44.91 ], [ -73.39, -44.83 ], [ -73.18, -44.81 ], [ -73.45, -44.64 ], [ -73.13, -44.59 ], [ -73.21, -44.41 ], [ -73, -44.5 ], [ -73.1, -44.39 ], [ -72.96, -44.37 ], [ -72.98, -44.58 ], [ -72.78, -44.45 ], [ -72.84, -44.64 ] ] ], [ [ [ -73.95, -44.98 ], [ -74.38, -45 ], [ -74.15, -44.86 ], [ -73.95, -44.98 ] ] ], [ [ [ -73.86, -44.93 ], [ -73.83, -44.77 ], [ -73.72, -44.91 ], [ -73.86, -44.93 ] ] ], [ [ [ -74.78, -43.58 ], [ -74.55, -43.63 ], [ -74.77, -43.68 ], [ -74.78, -43.58 ] ] ], [ [ [ -74.13, -43.83 ], [ -73.78, -43.83 ], [ -73.94, -43.96 ], [ -74.13, -43.83 ] ] ], [ [ [ -74.47, -44.53 ], [ -74.51, -44.43 ], [ -74.25, -44.4 ], [ -74.47, -44.53 ] ] ], [ [ [ -75.03, -44.84 ], [ -75.15, -44.93 ], [ -75.2, -44.81 ], [ -75.03, -44.84 ] ] ], [ [ [ 49.11, 30.33 ], [ 49.19, 30.21 ], [ 48.92, 30.39 ], [ 49.11, 30.33 ] ] ], [ [ [ -81.67, 7.39 ], [ -81.59, 7.33 ], [ -81.89, 7.49 ], [ -81.75, 7.65 ], [ -81.67, 7.39 ] ] ], [ [ [ 58.8, 20.37 ], [ 58.64, 20.16 ], [ 58.9, 20.7 ], [ 58.96, 20.52 ], [ 58.8, 20.37 ] ] ], [ [ [ 16.47, 68.44 ], [ 16.07, 68.41 ], [ 16.34, 68.56 ], [ 16.47, 68.44 ] ] ], [ [ [ 110.46, 21.16 ], [ 110.62, 21.21 ], [ 110.57, 21.09 ], [ 110.46, 21.16 ] ] ], [ [ [ 40.02, 15.73 ], [ 39.95, 15.89 ], [ 40.42, 15.56 ], [ 39.98, 15.61 ], [ 40.02, 15.73 ] ] ], [ [ [ 42.79, 14 ], [ 42.78, 13.91 ], [ 42.68, 14 ], [ 42.79, 14 ] ] ], [ [ [ 109.33, 19.88 ], [ 109.57, 19.85 ], [ 109.71, 20.02 ], [ 110.01, 19.91 ], [ 110.38, 20.08 ], [ 110.64, 19.92 ], [ 110.57, 20.09 ], [ 110.68, 20.16 ], [ 110.93, 20.01 ], [ 111.04, 19.64 ], [ 110.86, 19.52 ], [ 110.8, 19.61 ], [ 110.54, 18.78 ], [ 109.57, 18.16 ], [ 108.69, 18.5 ], [ 108.62, 18.83 ], [ 108.66, 19.35 ], [ 109.3, 19.7 ], [ 109.16, 19.79 ], [ 109.33, 19.88 ] ] ], [ [ [ 40.1, 16 ], [ 39.99, 16 ], [ 40.05, 16.12 ], [ 40.1, 16 ] ] ], [ [ [ 42.17, 16.7 ], [ 42.18, 16.58 ], [ 41.76, 16.89 ], [ 42.17, 16.7 ] ] ], [ [ [ 40.11, 20.21 ], [ 40, 20.26 ], [ 40.2, 20.17 ], [ 40.11, 20.21 ] ] ], [ [ [ -61.26, 13.27 ], [ -61.13, 13.37 ], [ -61.17, 13.12 ], [ -61.26, 13.27 ] ] ], [ [ [ 112.92, -25.58 ], [ 113.02, -25.5 ], [ 113.22, -26.16 ], [ 112.92, -25.58 ] ] ], [ [ [ 113.1, -25.12 ], [ 113.12, -24.99 ], [ 113.08, -25.27 ], [ 113.1, -25.12 ] ] ], [ [ [ 113.13, -24.86 ], [ 113.16, -24.75 ], [ 113.12, -24.99 ], [ 113.13, -24.86 ] ] ], [ [ [ 5.08, 5.74 ], [ 5.24, 5.69 ], [ 5.15, 5.81 ], [ 5.29, 5.91 ], [ 5.35, 5.81 ], [ 5.29, 5.62 ], [ 5.08, 5.74 ] ] ], [ [ [ -60.93, 14.09 ], [ -60.95, 13.71 ], [ -61.08, 13.88 ], [ -60.93, 14.09 ] ] ], [ [ [ 135.3, -12.14 ], [ 135.57, -12.11 ], [ 135.37, -12.18 ], [ 135.32, -12.24 ], [ 135.22, -12.19 ], [ 135.3, -12.14 ] ] ], [ [ [ -74.34, -45.75 ], [ -74.49, -45.73 ], [ -74.39, -45.45 ], [ -74.18, -45.62 ], [ -74.34, -45.75 ] ] ], [ [ [ 131.22, -11.36 ], [ 131.28, -11.19 ], [ 131.54, -11.45 ], [ 130.95, -11.94 ], [ 130.49, -11.65 ], [ 130.37, -11.17 ], [ 130.8, -11.58 ], [ 130.71, -11.38 ], [ 131.03, -11.41 ], [ 131.15, -11.25 ], [ 131.22, -11.36 ] ] ], [ [ [ -73.76, -45.31 ], [ -74.09, -45.37 ], [ -74.15, -45.24 ], [ -73.76, -45.31 ] ] ], [ [ [ -74.08, -45.03 ], [ -73.81, -44.98 ], [ -73.69, -45.29 ], [ -73.98, -45.25 ], [ -73.84, -45.21 ], [ -74.13, -45.17 ], [ -74.15, -45.05 ], [ -74.21, -45.17 ], [ -74.23, -45.08 ], [ -74.17, -45.03 ], [ -74.08, -45.03 ] ] ], [ [ [ -73.86, -45.86 ], [ -73.65, -45.89 ], [ -73.89, -46 ], [ -73.86, -45.86 ] ] ], [ [ [ -73.79, -45.45 ], [ -74.11, -45.59 ], [ -74.06, -45.43 ], [ -73.79, -45.45 ] ] ], [ [ [ -74.32, -45.33 ], [ -74.32, -45.43 ], [ -74.52, -45.33 ], [ -74.32, -45.33 ] ] ], [ [ [ -73.87, -45.75 ], [ -74, -45.93 ], [ -74.09, -45.78 ], [ -73.87, -45.75 ] ] ], [ [ [ -72.23, -54.15 ], [ -72.51, -54.26 ], [ -72.34, -54.06 ], [ -72.23, -54.15 ] ] ], [ [ [ -73.33, -54.1 ], [ -73.39, -54 ], [ -73.19, -54.06 ], [ -73.33, -54.1 ] ] ], [ [ [ -72.48, -54.35 ], [ -72.29, -54.35 ], [ -72.46, -54.44 ], [ -72.48, -54.35 ] ] ], [ [ [ -135.12, 57.49 ], [ -135.83, 57.77 ], [ -135.55, 57.46 ], [ -135.71, 57.37 ], [ -135.97, 57.46 ], [ -135.92, 57.59 ], [ -136.43, 57.82 ], [ -136.35, 58 ], [ -136.03, 57.84 ], [ -136.43, 58.09 ], [ -136.36, 58.22 ], [ -136.11, 58.07 ], [ -136.17, 58.22 ], [ -135.58, 58.21 ], [ -135.68, 57.95 ], [ -135.41, 58.14 ], [ -134.95, 58.04 ], [ -134.94, 57.85 ], [ -135.23, 57.95 ], [ -135.07, 57.77 ], [ -135.89, 58 ], [ -135.44, 57.74 ], [ -134.94, 57.76 ], [ -134.84, 57.48 ], [ -135.12, 57.49 ] ] ], [ [ [ -132.87, 56.51 ], [ -132.94, 56.82 ], [ -132.54, 56.61 ], [ -132.87, 56.51 ] ] ], [ [ [ -133.66, 56.46 ], [ -133.68, 56.85 ], [ -134.05, 57.02 ], [ -133.91, 57.1 ], [ -132.95, 56.87 ], [ -133.01, 56.6 ], [ -133.37, 56.84 ], [ -133.15, 56.46 ], [ -133.66, 56.46 ] ] ], [ [ [ -132.94, 56.27 ], [ -133.01, 56.43 ], [ -132.63, 56.42 ], [ -132.66, 56.28 ], [ -132.94, 56.27 ] ] ], [ [ [ -134.82, 56.38 ], [ -135.07, 56.54 ], [ -134.83, 56.74 ], [ -135.12, 56.6 ], [ -135.02, 56.82 ], [ -135.31, 56.78 ], [ -135.4, 56.95 ], [ -135.12, 56.98 ], [ -135.69, 57.36 ], [ -135.48, 57.35 ], [ -135.43, 57.56 ], [ -134.84, 57.25 ], [ -134.67, 56.16 ], [ -134.82, 56.38 ] ] ], [ [ [ -131.95, 56.23 ], [ -132.07, 56.12 ], [ -132.33, 56.24 ], [ -132.39, 56.49 ], [ -131.95, 56.23 ] ] ], [ [ [ -134.14, 56 ], [ -134.3, 56.35 ], [ -134.18, 56.45 ], [ -134.05, 56.34 ], [ -134.04, 56.5 ], [ -134.32, 56.56 ], [ -134.08, 56.64 ], [ -134.28, 56.61 ], [ -134.42, 56.83 ], [ -134.12, 56.85 ], [ -134.26, 56.94 ], [ -134.02, 56.88 ], [ -133.91, 56.76 ], [ -134.05, 56.64 ], [ -133.97, 56.63 ], [ -133.87, 56.81 ], [ -133.69, 56.6 ], [ -133.94, 56.62 ], [ -133.83, 56.32 ], [ -133.98, 56.37 ], [ -133.99, 56.08 ], [ -134.08, 56.32 ], [ -134.14, 56 ] ] ], [ [ [ -132.63, 56.06 ], [ -132.72, 56.22 ], [ -132.43, 56.35 ], [ -132.51, 56.19 ], [ -132.1, 56.1 ], [ -132.26, 56.13 ], [ -132.22, 55.94 ], [ -132.45, 55.96 ], [ -132.46, 56.17 ], [ -132.63, 56.06 ] ] ], [ [ [ -133.7, 55.91 ], [ -133.63, 56.14 ], [ -133.29, 56.15 ], [ -133.3, 56.01 ], [ -133.7, 55.91 ] ] ], [ [ [ -133.59, 55.71 ], [ -133.63, 55.83 ], [ -133.31, 55.8 ], [ -133.59, 55.71 ] ] ], [ [ [ -131.47, 55.38 ], [ -131.55, 55.29 ], [ -131.83, 55.45 ], [ -131.53, 55.73 ], [ -131.72, 55.75 ], [ -131.49, 55.79 ], [ -131.71, 55.84 ], [ -131.26, 55.97 ], [ -130.97, 55.39 ], [ -131.18, 55.19 ], [ -131.24, 55.41 ], [ -131.46, 55.28 ], [ -131.36, 55.65 ], [ -131.47, 55.38 ] ] ], [ [ [ -131.76, 55.13 ], [ -131.85, 55.43 ], [ -131.61, 55.29 ], [ -131.76, 55.13 ] ] ], [ [ [ -131.54, 55.13 ], [ -131.57, 55.29 ], [ -131.39, 55.01 ], [ -131.64, 55.01 ], [ -131.54, 55.13 ] ] ], [ [ [ -132.14, 54.99 ], [ -131.98, 55.04 ], [ -132.02, 54.69 ], [ -132.32, 54.72 ], [ -132.39, 55.08 ], [ -132.42, 54.91 ], [ -132.62, 54.97 ], [ -132.54, 55.28 ], [ -132.67, 55.14 ], [ -132.82, 55.28 ], [ -133.24, 55.29 ], [ -133.23, 55.38 ], [ -132.88, 55.35 ], [ -133.16, 55.48 ], [ -132.93, 55.62 ], [ -133.4, 55.62 ], [ -133.13, 55.88 ], [ -133.27, 56.15 ], [ -133.64, 56.21 ], [ -133.61, 56.36 ], [ -133.17, 56.33 ], [ -133.09, 56.05 ], [ -132.5, 55.81 ], [ -132.6, 55.7 ], [ -132.14, 55.46 ], [ -132.56, 55.62 ], [ -132.74, 55.36 ], [ -132.32, 55.48 ], [ -132.53, 55.37 ], [ -132.26, 55.42 ], [ -132.1, 55.28 ], [ -132.47, 55.26 ], [ -132.36, 55.13 ], [ -131.99, 55.26 ], [ -132.09, 55.04 ], [ -132.3, 55.05 ], [ -132.14, 54.99 ] ] ], [ [ [ -132.87, 54.7 ], [ -133.23, 55.06 ], [ -133.14, 55.26 ], [ -132.66, 54.67 ], [ -132.87, 54.7 ] ] ], [ [ [ -122.93, 48.71 ], [ -122.74, 48.66 ], [ -122.8, 48.6 ], [ -122.89, 48.7 ], [ -122.87, 48.59 ], [ -123.03, 48.61 ], [ -122.93, 48.71 ] ] ], [ [ [ 18.44, 59.4 ], [ 18.66, 59.3 ], [ 18.23, 59.3 ], [ 18.44, 59.4 ] ] ], [ [ [ -136.56, 57.95 ], [ -136.5, 58.11 ], [ -136.45, 57.84 ], [ -136.56, 57.95 ] ] ], [ [ [ 151.18, -23.74 ], [ 151.02, -23.45 ], [ 151.24, -23.49 ], [ 151.32, -23.76 ], [ 151.18, -23.74 ] ] ], [ [ [ 20.5, 70.06 ], [ 20.75, 70.23 ], [ 20.8, 70.05 ], [ 20.5, 70.06 ] ] ], [ [ [ -135.85, 57.02 ], [ -135.77, 57.34 ], [ -135.57, 57.09 ], [ -135.85, 57.02 ] ] ], [ [ [ 16.31, 68.83 ], [ 16.27, 68.92 ], [ 16.59, 68.84 ], [ 16.51, 68.57 ], [ 16.09, 68.56 ], [ 15.87, 68.38 ], [ 15.87, 68.51 ], [ 15.63, 68.31 ], [ 15.33, 68.36 ], [ 15.54, 68.52 ], [ 14.99, 68.3 ], [ 15.4, 68.47 ], [ 15.21, 68.57 ], [ 15.63, 68.62 ], [ 15.45, 68.73 ], [ 15.72, 68.69 ], [ 15.62, 68.95 ], [ 15.96, 68.9 ], [ 15.77, 68.74 ], [ 16.01, 68.78 ], [ 15.73, 68.53 ], [ 16.31, 68.83 ] ] ], [ [ [ 124.55, -15.41 ], [ 124.57, -15.25 ], [ 124.66, -15.4 ], [ 124.55, -15.41 ] ] ], [ [ [ 39.8, -7.9 ], [ 39.59, -7.94 ], [ 39.91, -7.64 ], [ 39.8, -7.9 ] ] ], [ [ [ -123.02, 48.55 ], [ -122.96, 48.45 ], [ -123.15, 48.62 ], [ -123.02, 48.55 ] ] ], [ [ [ 22.85, 60.2 ], [ 22.76, 60 ], [ 22.39, 60 ], [ 22.47, 60.24 ], [ 22.49, 60.21 ], [ 22.84, 60.24 ], [ 22.96, 60.31 ], [ 22.85, 60.2 ] ] ], [ [ [ 14.91, 68.58 ], [ 15.14, 68.76 ], [ 14.53, 68.6 ], [ 14.37, 68.69 ], [ 14.54, 68.82 ], [ 14.61, 68.73 ], [ 14.65, 68.84 ], [ 15.16, 68.81 ], [ 15.16, 69.02 ], [ 15.42, 68.69 ], [ 14.91, 68.58 ] ] ], [ [ [ 72.98, 19.18 ], [ 72.8, 18.88 ], [ 72.79, 19.31 ], [ 72.98, 19.18 ] ] ], [ [ [ 5.37, 5.59 ], [ 5.43, 5.39 ], [ 5.16, 5.54 ], [ 5.21, 5.6 ], [ 5.37, 5.59 ] ] ], [ [ [ 98.28, 7.92 ], [ 98.3, 8.2 ], [ 98.35, 8.11 ], [ 98.44, 8.09 ], [ 98.41, 7.8 ], [ 98.3, 7.76 ], [ 98.28, 7.92 ] ] ], [ [ [ -139.46, 59.39 ], [ -139.61, 59.45 ], [ -139.31, 59.35 ], [ -139.46, 59.39 ] ] ], [ [ [ -153.36, 58.04 ], [ -153.27, 58.15 ], [ -152.91, 57.98 ], [ -153.36, 58.04 ] ] ], [ [ [ -151.98, 58.25 ], [ -152.11, 58.15 ], [ -152.29, 58.26 ], [ -152.54, 58.08 ], [ -152.57, 58.22 ], [ -152.8, 57.99 ], [ -153.22, 58.16 ], [ -152.85, 58.15 ], [ -153.1, 58.26 ], [ -152.72, 58.26 ], [ -152.89, 58.41 ], [ -152.65, 58.48 ], [ -151.98, 58.25 ] ] ], [ [ [ -134.31, 58.12 ], [ -133.8, 57.57 ], [ -134.32, 58.09 ], [ -134.31, 57.83 ], [ -133.85, 57.46 ], [ -134.1, 57.47 ], [ -133.86, 57.37 ], [ -134.19, 57.4 ], [ -134.12, 57.24 ], [ -134.62, 57.01 ], [ -134.58, 57.4 ], [ -134.32, 57.34 ], [ -134.61, 57.51 ], [ -134.5, 57.46 ], [ -134.34, 57.57 ], [ -134.58, 57.51 ], [ -134.68, 57.61 ], [ -134.96, 58.41 ], [ -134.7, 58.16 ], [ -134.31, 58.12 ] ] ], [ [ [ -161.12, 58.66 ], [ -160.69, 58.82 ], [ -160.92, 58.56 ], [ -161.12, 58.66 ] ] ], [ [ [ -165.88, 59.87 ], [ -166.29, 59.85 ], [ -166.19, 59.75 ], [ -167.46, 60.21 ], [ -166.85, 60.2 ], [ -166.16, 60.43 ], [ -165.68, 60.29 ], [ -165.57, 59.93 ], [ -165.88, 59.87 ] ] ], [ [ [ -147.62, 60.38 ], [ -147.77, 60.15 ], [ -147.7, 60.51 ], [ -147.62, 60.38 ] ] ], [ [ [ -147.29, 60.22 ], [ -147.16, 60.37 ], [ -146.92, 60.31 ], [ -147.43, 59.87 ], [ -147.91, 59.77 ], [ -147.29, 60.22 ] ] ], [ [ [ -165.04, 60.46 ], [ -165.42, 60.56 ], [ -164.86, 60.86 ], [ -164.26, 60.79 ], [ -164.21, 60.68 ], [ -164.53, 60.55 ], [ -164.43, 60.49 ], [ -164.58, 60.46 ], [ -164.54, 60.39 ], [ -164.69, 60.38 ], [ -164.71, 60.3 ], [ -165.04, 60.46 ] ] ], [ [ [ -169.71, 63.01 ], [ -170.73, 63.39 ], [ -171.73, 63.37 ], [ -171.74, 63.78 ], [ -171.5, 63.58 ], [ -170.29, 63.69 ], [ -170.06, 63.43 ], [ -168.69, 63.3 ], [ -169.71, 63.01 ] ] ], [ [ [ -86.44, 16.38 ], [ -86.26, 16.42 ], [ -86.6, 16.27 ], [ -86.44, 16.38 ] ] ], [ [ [ -163.8, 62.92 ], [ -164.01, 62.91 ], [ -164.57, 63.14 ], [ -163.84, 63.22 ], [ -164.13, 63.01 ], [ -163.66, 63.11 ], [ -163.89, 62.99 ], [ -163.8, 62.92 ] ] ], [ [ [ -172.48, 64.7 ], [ -172.39, 64.84 ], [ -172.06, 64.76 ], [ -172.48, 64.7 ] ] ], [ [ [ -173, 64.44 ], [ -172.84, 64.3 ], [ -173.17, 64.25 ], [ -173.34, 64.6 ], [ -173.65, 64.33 ], [ -174.78, 64.76 ], [ -175.43, 64.77 ], [ -175.89, 65 ], [ -175.92, 65.41 ], [ -176.92, 65.6 ], [ -177.16, 65.58 ], [ -176.92, 65.67 ], [ -177.19, 65.57 ], [ -177.32, 65.49 ], [ -177.43, 65.47 ], [ -178.26, 65.45 ], [ -178.53, 65.49 ], [ -178.4, 65.7 ], [ -178.92, 66.04 ], [ -178.73, 65.98 ], [ -178.48, 66.13 ], [ -178.48, 66.39 ], [ -178.84, 66.16 ], [ -179.07, 66.37 ], [ -179.39, 66.32 ], [ -179.3, 66.13 ], [ -179.68, 66.17 ], [ -179.76, 65.79 ], [ -179.27, 65.53 ], [ -180, 65.04 ], [ -180, 68.97 ], [ -180, 68.98 ], [ -178.87, 68.76 ], [ -177.43, 68.26 ], [ -177.66, 68.33 ], [ -177.66, 68.23 ], [ -175.28, 67.67 ], [ -174.74, 67.29 ], [ -174.7, 66.72 ], [ -175, 66.66 ], [ -174.44, 66.53 ], [ -174.41, 66.28 ], [ -174, 66.47 ], [ -173.98, 66.21 ], [ -173.69, 66.43 ], [ -174.22, 66.57 ], [ -174.26, 66.5 ], [ -174.26, 66.57 ], [ -173.92, 66.68 ], [ -174, 66.98 ], [ -174.62, 67.06 ], [ -173.64, 67.11 ], [ -171.67, 66.94 ], [ -170.58, 66.35 ], [ -169.67, 66.13 ], [ -170.59, 65.85 ], [ -170.58, 65.6 ], [ -171.46, 65.84 ], [ -171.05, 65.47 ], [ -172.07, 65.48 ], [ -171.74, 65.51 ], [ -172.62, 65.69 ], [ -172.46, 65.46 ], [ -172.08, 65.49 ], [ -172.09, 65.08 ], [ -172.39, 64.92 ], [ -172.99, 64.86 ], [ -173.18, 64.75 ], [ -172.91, 64.84 ], [ -172.74, 64.76 ], [ -172.98, 64.57 ], [ -172.23, 64.4 ], [ -173, 64.44 ] ] ], [ [ [ -177.73, 65.44 ], [ -178.41, 65.44 ], [ -178.75, 65.48 ], [ -178.43, 65.45 ], [ -177.61, 65.44 ], [ -177.54, 65.45 ], [ -177.41, 65.46 ], [ -177.38, 65.46 ], [ -177.17, 65.53 ], [ -177.27, 65.49 ], [ -177.33, 65.47 ], [ -177.39, 65.46 ], [ -177.57, 65.44 ], [ -177.73, 65.44 ] ] ], [ [ [ 39.73, -5.2 ], [ 39.68, -4.86 ], [ 39.87, -4.91 ], [ 39.73, -5.47 ], [ 39.63, -5.4 ], [ 39.73, -5.2 ] ] ], [ [ [ -135.92, 69.24 ], [ -135.52, 69.02 ], [ -135.94, 69.08 ], [ -135.92, 69.24 ] ] ], [ [ [ 100.18, 5.45 ], [ 100.35, 5.42 ], [ 100.28, 5.26 ], [ 100.18, 5.45 ] ] ], [ [ [ -139.13, 69.64 ], [ -138.85, 69.58 ], [ -139.09, 69.52 ], [ -139.13, 69.64 ] ] ], [ [ [ 80.9, 15.76 ], [ 80.89, 15.85 ], [ 81.01, 15.76 ], [ 80.94, 15.72 ], [ 80.9, 15.76 ] ] ], [ [ [ 100.2, -2.78 ], [ 100, -2.84 ], [ 99.97, -2.51 ], [ 100.2, -2.78 ] ] ], [ [ [ 102.09, -5.36 ], [ 102.24, -5.32 ], [ 102.37, -5.49 ], [ 102.09, -5.36 ] ] ], [ [ [ 106.33, -2.95 ], [ 105.95, -2.82 ], [ 105.76, -2.14 ], [ 105.13, -2.08 ], [ 105.39, -1.61 ], [ 105.92, -1.5 ], [ 106.19, -1.9 ], [ 106.3, -2.42 ], [ 106.85, -2.57 ], [ 106.59, -2.89 ], [ 106.74, -3.09 ], [ 106.51, -3.11 ], [ 106.33, -2.95 ] ] ], [ [ [ -61.84, 49.28 ], [ -61.67, 49.13 ], [ -61.83, 49.06 ], [ -62.93, 49.19 ], [ -64.52, 49.88 ], [ -64.15, 49.95 ], [ -63.01, 49.75 ], [ -61.84, 49.28 ] ] ], [ [ [ -166.56, 66.13 ], [ -166.16, 66.22 ], [ -166.8, 66.04 ], [ -166.56, 66.13 ] ] ], [ [ [ -167, 65.98 ], [ -167.24, 65.91 ], [ -166.81, 66.05 ], [ -167, 65.98 ] ] ], [ [ [ -75.47, 35.58 ], [ -75.49, 35.68 ], [ -75.46, 35.57 ], [ -75.53, 35.22 ], [ -75.75, 35.19 ], [ -75.52, 35.27 ], [ -75.47, 35.58 ] ] ], [ [ [ -61.85, 47.22 ], [ -62.02, 47.23 ], [ -61.96, 47.39 ], [ -61.4, 47.63 ], [ -61.87, 47.42 ], [ -61.85, 47.22 ] ] ], [ [ [ -166.7, 54 ], [ -166.61, 53.83 ], [ -166.38, 54.01 ], [ -166.21, 53.93 ], [ -166.62, 53.74 ], [ -166.28, 53.69 ], [ -166.66, 53.48 ], [ -166.8, 53.56 ], [ -166.75, 53.44 ], [ -167.8, 53.28 ], [ -166.97, 53.53 ], [ -167.16, 53.6 ], [ -167.04, 53.71 ], [ -166.79, 53.63 ], [ -166.7, 53.72 ], [ -167.16, 53.85 ], [ -166.7, 54 ] ] ], [ [ [ -169.86, 52.86 ], [ -169.7, 52.78 ], [ -170, 52.81 ], [ -169.86, 52.86 ] ] ], [ [ [ -172.39, 52.29 ], [ -172.63, 52.27 ], [ -172.45, 52.39 ], [ -172.39, 52.29 ] ] ], [ [ [ -174.19, 52.42 ], [ -174, 52.36 ], [ -174.2, 52.22 ], [ -174.09, 52.11 ], [ -175.34, 52.02 ], [ -174.34, 52.18 ], [ -174.29, 52.33 ], [ -174.46, 52.32 ], [ -174.19, 52.42 ] ] ], [ [ [ -173.6, 52.14 ], [ -172.95, 52.09 ], [ -173.49, 52.02 ], [ -174.05, 52.13 ], [ -173.6, 52.14 ] ] ], [ [ [ -177.57, 51.72 ], [ -177.05, 51.91 ], [ -177.15, 51.71 ], [ -177.67, 51.66 ], [ -177.57, 51.72 ] ] ], [ [ [ -178.01, 51.91 ], [ -177.62, 51.85 ], [ -177.91, 51.6 ], [ -178.23, 51.87 ], [ -178.01, 51.91 ] ] ], [ [ [ -176.55, 51.84 ], [ -176.43, 51.74 ], [ -176.98, 51.6 ], [ -176.91, 51.81 ], [ -176.71, 51.79 ], [ -176.79, 51.96 ], [ -176.56, 51.99 ], [ -176.55, 51.84 ] ] ], [ [ [ -153.36, 57.05 ], [ -153.26, 57.21 ], [ -152.87, 57.16 ], [ -153.36, 57.05 ] ] ], [ [ [ -79.33, 51.96 ], [ -79.67, 51.98 ], [ -79.34, 52.1 ], [ -79.33, 51.96 ] ] ], [ [ [ -155.57, 55.8 ], [ -155.75, 55.82 ], [ -155.6, 55.91 ], [ -155.57, 55.8 ] ] ], [ [ [ -81.49, 53.2 ], [ -80.91, 53.09 ], [ -80.71, 52.67 ], [ -82.05, 53.01 ], [ -81.49, 53.2 ] ] ], [ [ [ -68.6, 44.21 ], [ -68.71, 44.16 ], [ -68.74, 44.31 ], [ -68.6, 44.21 ] ] ], [ [ [ -82.14, 62.61 ], [ -83.07, 62.18 ], [ -83.37, 62.26 ], [ -83.72, 62.14 ], [ -83.97, 62.45 ], [ -83.34, 62.92 ], [ -81.9, 62.94 ], [ -82.14, 62.61 ] ] ], [ [ [ -172.92, 60.47 ], [ -172.95, 60.61 ], [ -172.22, 60.31 ], [ -172.92, 60.47 ] ] ], [ [ [ -85.15, 65.95 ], [ -84.92, 66.02 ], [ -84.73, 65.87 ], [ -84.71, 65.54 ], [ -85.15, 65.95 ] ] ], [ [ [ -85, 65.42 ], [ -84.91, 65.21 ], [ -84.51, 65.48 ], [ -84.11, 65.2 ], [ -83.4, 65.14 ], [ -83.18, 64.93 ], [ -82.07, 64.68 ], [ -81.58, 64.17 ], [ -82, 63.99 ], [ -81.39, 64.09 ], [ -80.93, 63.97 ], [ -80.92, 64.12 ], [ -80.18, 63.73 ], [ -81.16, 63.46 ], [ -82.47, 63.66 ], [ -82.36, 63.89 ], [ -83.14, 63.97 ], [ -83.09, 64.17 ], [ -83.53, 64.1 ], [ -83.61, 63.76 ], [ -84.29, 63.63 ], [ -84.57, 63.29 ], [ -85.27, 63.1 ], [ -85.61, 63.18 ], [ -85.64, 63.69 ], [ -87.13, 63.56 ], [ -86.95, 63.89 ], [ -86.17, 64.09 ], [ -86.39, 64.59 ], [ -85.99, 65.71 ], [ -85.56, 65.92 ], [ -85.17, 65.79 ], [ -85.02, 65.61 ], [ -85.28, 65.54 ], [ -85, 65.42 ] ] ], [ [ [ 143.42, -8.59 ], [ 143.19, -8.41 ], [ 143.64, -8.69 ], [ 143.42, -8.59 ] ] ], [ [ [ -79.67, 69.82 ], [ -79.32, 69.71 ], [ -80.05, 69.66 ], [ -80.02, 69.49 ], [ -80.81, 69.69 ], [ -79.67, 69.82 ] ] ], [ [ [ -78.84, 68.25 ], [ -79.19, 68.22 ], [ -79.15, 68.36 ], [ -78.84, 68.25 ] ] ], [ [ [ -120, 74.28 ], [ -119.75, 74.1 ], [ -119.08, 74.21 ], [ -119.15, 73.99 ], [ -118.76, 74.21 ], [ -117.39, 74.23 ], [ -115.29, 73.48 ], [ -119.14, 72.65 ], [ -119.77, 72.23 ], [ -120.23, 72.27 ], [ -120.64, 71.49 ], [ -121.37, 71.38 ], [ -121.68, 71.47 ], [ -123.14, 71.08 ], [ -123.97, 71.67 ], [ -125.27, 71.97 ], [ -124.88, 71.96 ], [ -125.27, 71.99 ], [ -126.01, 71.97 ], [ -124.88, 72.58 ], [ -125.13, 72.87 ], [ -124.42, 72.94 ], [ -124.86, 73.1 ], [ -123.73, 73.75 ], [ -124.77, 74.34 ], [ -121.54, 74.56 ], [ -120, 74.28 ] ] ], [ [ [ 147.86, -5.71 ], [ 147.77, -5.46 ], [ 148.09, -5.64 ], [ 148.02, -5.83 ], [ 147.86, -5.71 ] ] ], [ [ [ 145.99, -4.52 ], [ 146.05, -4.71 ], [ 145.93, -4.75 ], [ 145.99, -4.52 ] ] ], [ [ [ -69.33, 58.98 ], [ -69.25, 59.17 ], [ -69.09, 59.06 ], [ -69.33, 58.98 ] ] ], [ [ [ -68.36, 60.4 ], [ -68.23, 60.59 ], [ -67.83, 60.48 ], [ -68.33, 60.2 ], [ -68.36, 60.4 ] ] ], [ [ [ 88.04, 21.68 ], [ 88.14, 21.88 ], [ 88.16, 21.65 ], [ 88.04, 21.68 ] ] ], [ [ [ -78.16, 25.03 ], [ -78.22, 25.2 ], [ -78.02, 25.18 ], [ -77.93, 24.9 ], [ -78.07, 24.88 ], [ -77.92, 24.89 ], [ -77.78, 24.73 ], [ -77.97, 24.69 ], [ -77.78, 24.73 ], [ -77.72, 24.51 ], [ -77.87, 24.41 ], [ -77.94, 24.52 ], [ -77.86, 24.39 ], [ -78.04, 24.27 ], [ -78.12, 24.53 ], [ -78.21, 24.43 ], [ -78.46, 24.6 ], [ -78.23, 24.63 ], [ -78.16, 25.03 ] ] ], [ [ [ -81.47, 30.86 ], [ -81.4, 30.95 ], [ -81.45, 30.71 ], [ -81.47, 30.86 ] ] ], [ [ [ 138.18, -1.63 ], [ 139.75, -2.36 ], [ 140.61, -2.44 ], [ 140.71, -2.63 ], [ 141.2, -2.63 ], [ 142.53, -3.23 ], [ 143.5, -3.44 ], [ 144, -3.82 ], [ 144.53, -3.82 ], [ 144.49, -3.99 ], [ 144.54, -3.91 ], [ 145.02, -4.34 ], [ 145.32, -4.39 ], [ 145.81, -4.85 ], [ 145.76, -5.48 ], [ 146.46, -5.61 ], [ 147, -5.94 ], [ 147.34, -5.92 ], [ 147.81, -6.32 ], [ 147.81, -6.69 ], [ 146.96, -6.75 ], [ 147.18, -7.46 ], [ 147.47, -7.59 ], [ 147.75, -7.96 ], [ 148.13, -8.06 ], [ 148.23, -8.58 ], [ 148.44, -8.68 ], [ 148.6, -9.08 ], [ 149.29, -9.01 ], [ 149.24, -9.5 ], [ 150.06, -9.68 ], [ 149.71, -9.81 ], [ 149.86, -10.02 ], [ 150.61, -10.29 ], [ 150.87, -10.22 ], [ 150.63, -10.35 ], [ 150.34, -10.34 ], [ 150.7, -10.56 ], [ 150.2, -10.7 ], [ 149.85, -10.55 ], [ 150.11, -10.41 ], [ 149.91, -10.5 ], [ 149.75, -10.35 ], [ 148.96, -10.29 ], [ 148.74, -10.24 ], [ 148.72, -10.1 ], [ 148.4, -10.21 ], [ 148.17, -10.09 ], [ 148.25, -10 ], [ 148, -10.16 ], [ 147.91, -10.04 ], [ 147.73, -10.1 ], [ 147.3, -9.5 ], [ 146.9, -9.27 ], [ 147.01, -9.03 ], [ 146.89, -9.11 ], [ 146.59, -9 ], [ 146.62, -8.79 ], [ 146.1, -8.08 ], [ 145.83, -8.03 ], [ 145.78, -7.89 ], [ 145.41, -7.95 ], [ 145.05, -7.71 ], [ 145.05, -7.85 ], [ 144.95, -7.69 ], [ 144.95, -7.8 ], [ 144.85, -7.61 ], [ 145.01, -7.56 ], [ 144.77, -7.45 ], [ 144.76, -7.57 ], [ 144.45, -7.3 ], [ 144.24, -7.36 ], [ 144.25, -7.59 ], [ 144.06, -7.58 ], [ 144.15, -7.8 ], [ 143.69, -7.52 ], [ 143.92, -7.98 ], [ 143.5, -8 ], [ 143.69, -8.23 ], [ 142.52, -8.33 ], [ 142.22, -8.17 ], [ 142.45, -8.37 ], [ 142.76, -8.31 ], [ 143.1, -8.45 ], [ 143.4, -8.76 ], [ 143.37, -9.01 ], [ 142.64, -9.33 ], [ 142.22, -9.09 ], [ 141.13, -9.23 ], [ 140, -8.2 ], [ 140.06, -7.99 ], [ 139.38, -8.2 ], [ 139.24, -8.07 ], [ 138.92, -8.28 ], [ 138.83, -8.12 ], [ 138.92, -8.08 ], [ 138.91, -7.92 ], [ 139.11, -7.57 ], [ 138.67, -7.21 ], [ 139.25, -7.14 ], [ 138.85, -7.16 ], [ 138.56, -6.94 ], [ 138.92, -6.84 ], [ 139.22, -6.98 ], [ 138.43, -6.36 ], [ 138.28, -5.84 ], [ 138.07, -5.73 ], [ 138.08, -5.53 ], [ 137.45, -5.1 ], [ 137.51, -4.96 ], [ 137.42, -5.13 ], [ 137.44, -4.98 ], [ 136.98, -4.94 ], [ 136.85, -4.77 ], [ 136.63, -4.83 ], [ 135.92, -4.49 ], [ 135.2, -4.46 ], [ 134.63, -4.12 ], [ 134.68, -3.94 ], [ 134.96, -3.95 ], [ 134.68, -3.92 ], [ 134.51, -4.04 ], [ 134.33, -3.88 ], [ 134.29, -4.05 ], [ 134.11, -3.91 ], [ 134.14, -3.74 ], [ 133.96, -3.86 ], [ 133.83, -3.56 ], [ 133.82, -3.73 ], [ 133.69, -3.67 ], [ 133.62, -3.48 ], [ 133.7, -3.17 ], [ 133.88, -3.05 ], [ 133.81, -2.91 ], [ 133.65, -3.12 ], [ 133.58, -3.57 ], [ 133.4, -3.66 ], [ 133.46, -3.86 ], [ 133.25, -4.07 ], [ 132.91, -4.09 ], [ 132.73, -3.68 ], [ 132.94, -3.55 ], [ 132.82, -3.3 ], [ 132.66, -3.32 ], [ 132.35, -2.94 ], [ 131.98, -2.93 ], [ 132.07, -2.79 ], [ 131.95, -2.77 ], [ 132.23, -2.65 ], [ 132.73, -2.8 ], [ 133.21, -2.41 ], [ 133.38, -2.52 ], [ 133.26, -2.71 ], [ 133.49, -2.73 ], [ 133.44, -2.64 ], [ 133.54, -2.7 ], [ 133.63, -2.53 ], [ 133.66, -2.67 ], [ 133.85, -2.67 ], [ 133.73, -2.44 ], [ 133.99, -2.39 ], [ 133.83, -2.33 ], [ 134.02, -2.16 ], [ 133.96, -2.04 ], [ 133.52, -2.24 ], [ 132.32, -2.28 ], [ 132.04, -2.07 ], [ 132.12, -1.99 ], [ 132.07, -2.01 ], [ 132.11, -1.87 ], [ 132.06, -2.02 ], [ 131.97, -1.96 ], [ 132.04, -1.67 ], [ 131.88, -1.64 ], [ 131.97, -1.55 ], [ 131.7, -1.56 ], [ 131.74, -1.37 ], [ 131.45, -1.51 ], [ 131.37, -1.39 ], [ 131.26, -1.52 ], [ 130.93, -1.43 ], [ 131.23, -1.12 ], [ 131.22, -.82 ], [ 131.85, -.71 ], [ 132.42, -.34 ], [ 132.95, -.45 ], [ 133.4, -.74 ], [ 133.97, -.72 ], [ 134.28, -1.34 ], [ 134.07, -1.65 ], [ 134.18, -2.36 ], [ 134.46, -2.86 ], [ 134.46, -2.55 ], [ 134.63, -2.47 ], [ 134.69, -2.97 ], [ 134.86, -2.88 ], [ 134.86, -3.25 ], [ 135.34, -3.4 ], [ 135.95, -2.96 ], [ 136.39, -2.22 ], [ 137.17, -2.11 ], [ 137.26, -2.05 ], [ 137.16, -1.77 ], [ 137.31, -1.8 ], [ 137.24, -1.74 ], [ 137.74, -1.48 ], [ 138.18, -1.63 ] ], [ [ 135.22, -1.5 ], [ 135.34, -1.48 ], [ 135.09, -1.5 ], [ 135.22, -1.5 ] ] ], [ [ [ -78.74, 26.5 ], [ -78.99, 26.7 ], [ -78.56, 26.55 ], [ -78.74, 26.5 ] ] ], [ [ [ -70.66, 62.59 ], [ -70.91, 62.75 ], [ -70.73, 62.78 ], [ -71.21, 62.89 ], [ -70.51, 62.78 ], [ -70.17, 62.58 ], [ -70.66, 62.59 ] ] ], [ [ [ -86.76, 30.39 ], [ -87.16, 30.33 ], [ -87.3, 30.33 ], [ -87.16, 30.33 ], [ -87.15, 30.34 ], [ -86.73, 30.4 ], [ -86.51, 30.38 ], [ -86.76, 30.39 ] ] ], [ [ [ 98.66, .07 ], [ 98.53, .14 ], [ 98.85, .12 ], [ 98.66, .07 ] ] ], [ [ [ -99.01, 73.96 ], [ -97.63, 74.09 ], [ -98.76, 73.81 ], [ -99.38, 73.88 ], [ -99.01, 73.96 ] ] ], [ [ [ -97.25, 71.66 ], [ -98.19, 71.65 ], [ -98.21, 71.94 ], [ -98.5, 71.73 ], [ -98.18, 71.43 ], [ -98.69, 71.28 ], [ -99.22, 71.35 ], [ -100.61, 72.19 ], [ -101.2, 72.35 ], [ -101.78, 72.3 ], [ -102.67, 72.69 ], [ -102.23, 73.09 ], [ -101.27, 72.71 ], [ -100.17, 72.79 ], [ -100.52, 73.23 ], [ -99.74, 73.23 ], [ -100.38, 73.4 ], [ -100.96, 73.28 ], [ -101.62, 73.5 ], [ -100.9, 73.61 ], [ -100.42, 73.41 ], [ -101.13, 73.74 ], [ -100.54, 73.87 ], [ -100.04, 73.77 ], [ -100.09, 73.95 ], [ -99.18, 73.69 ], [ -97.77, 73.92 ], [ -96.94, 73.74 ], [ -97.72, 73.54 ], [ -97.16, 73.36 ], [ -98.5, 73.01 ], [ -98.46, 72.84 ], [ -98.07, 73.03 ], [ -97.28, 72.97 ], [ -97.12, 72.57 ], [ -96.49, 72.72 ], [ -96.27, 72.41 ], [ -96.84, 72.33 ], [ -96.46, 72.11 ], [ -96.86, 72.04 ], [ -96.46, 72.04 ], [ -96.48, 71.9 ], [ -97.25, 71.66 ] ] ], [ [ [ -146.28, -15.32 ], [ -146.4, -15.3 ], [ -146.3, -15.31 ], [ -146.19, -15.34 ], [ -146.22, -15.45 ], [ -146.19, -15.34 ], [ -146.28, -15.32 ] ] ], [ [ [ -151.38, -16.82 ], [ -151.47, -16.91 ], [ -151.48, -16.73 ], [ -151.38, -16.82 ] ] ], [ [ [ -179.88, -16.84 ], [ -180, -16.97 ], [ -180, -16.79 ], [ -179.88, -16.69 ], [ -179.88, -16.84 ] ] ], [ [ [ -140.03, -8.82 ], [ -140.02, -8.93 ], [ -140.23, -8.93 ], [ -140.24, -8.8 ], [ -140.03, -8.82 ] ] ], [ [ [ -138.94, -9.8 ], [ -139.16, -9.77 ], [ -138.8, -9.74 ], [ -138.94, -9.8 ] ] ], [ [ [ -171.74, -13.84 ], [ -171.43, -14.05 ], [ -172.07, -13.87 ], [ -171.74, -13.84 ] ] ], [ [ [ -100.66, 70.59 ], [ -100.61, 70.7 ], [ -100.23, 70.47 ], [ -100.66, 70.59 ] ] ], [ [ [ -105.9, 73.14 ], [ -107.01, 73.49 ], [ -106.49, 73.72 ], [ -105.1, 73.75 ], [ -104.45, 73.55 ], [ -105.24, 72.85 ], [ -105.9, 73.14 ] ] ], [ [ [ -91.91, 29.57 ], [ -91.77, 29.49 ], [ -92.03, 29.57 ], [ -91.91, 29.57 ] ] ], [ [ [ -100.29, 68.76 ], [ -100.6, 68.77 ], [ -100.52, 69.05 ], [ -100.12, 68.91 ], [ -100.29, 68.76 ] ] ], [ [ [ -77.69, 63.14 ], [ -78.02, 63.12 ], [ -78.53, 63.43 ], [ -77.66, 63.43 ], [ -77.69, 63.14 ] ] ], [ [ [ -77.66, 63.94 ], [ -77.95, 64.01 ], [ -77.56, 64.04 ], [ -77.66, 63.94 ] ] ], [ [ [ -76.76, 63.58 ], [ -76.71, 63.36 ], [ -77.43, 63.63 ], [ -76.76, 63.58 ] ] ], [ [ [ 90.99, 22.21 ], [ 90.91, 22.07 ], [ 90.98, 22.34 ], [ 90.99, 22.21 ] ] ], [ [ [ 131.86, 43.06 ], [ 131.87, 42.95 ], [ 131.75, 42.99 ], [ 131.86, 43.06 ] ] ], [ [ [ 177.61, 51.95 ], [ 177.2, 51.88 ], [ 177.59, 52.14 ], [ 177.61, 51.95 ] ] ], [ [ [ 178.68, 51.65 ], [ 179.47, 51.37 ], [ 179.24, 51.35 ], [ 178.68, 51.65 ] ] ], [ [ [ 91.89, 21.58 ], [ 91.88, 21.69 ], [ 91.94, 21.74 ], [ 91.97, 21.51 ], [ 91.89, 21.58 ] ] ], [ [ [ 179.59, -16.54 ], [ 179.47, -16.77 ], [ 179.92, -16.47 ], [ 179.82, -16.67 ], [ 179.93, -16.76 ], [ 179.3, -16.82 ], [ 179.36, -16.74 ], [ 179.2, -16.7 ], [ 179.07, -16.91 ], [ 178.86, -16.86 ], [ 178.73, -17.02 ], [ 178.48, -16.77 ], [ 178.94, -16.46 ], [ 180, -16.14 ], [ 179.59, -16.54 ] ] ], [ [ [ 167.54, -14.2 ], [ 167.57, -14.36 ], [ 167.42, -14.36 ], [ 167.54, -14.2 ] ] ], [ [ [ 167.02, -14.93 ], [ 167.26, -15.52 ], [ 166.82, -15.67 ], [ 166.65, -15.4 ], [ 166.57, -14.68 ], [ 166.76, -14.83 ], [ 166.83, -15.16 ], [ 167.02, -14.93 ] ] ], [ [ [ 167.92, -15.4 ], [ 167.67, -15.44 ], [ 167.99, -15.28 ], [ 167.92, -15.4 ] ] ], [ [ [ 168.28, -15.92 ], [ 168.21, -16.02 ], [ 168.15, -15.45 ], [ 168.28, -15.92 ] ] ], [ [ [ 167.47, -13.96 ], [ 167.38, -13.83 ], [ 167.47, -13.71 ], [ 167.58, -13.88 ], [ 167.47, -13.96 ] ] ], [ [ [ 168.18, -17.69 ], [ 168.32, -17.52 ], [ 168.6, -17.69 ], [ 168.4, -17.83 ], [ 168.18, -17.69 ] ] ], [ [ [ -78.36, 26.61 ], [ -78.63, 26.61 ], [ -77.91, 26.77 ], [ -77.97, 26.65 ], [ -78.36, 26.61 ] ] ], [ [ [ -77.8, 23.94 ], [ -77.76, 24.03 ], [ -77.69, 24.03 ], [ -77.6, 24.21 ], [ -77.52, 24 ], [ -77.67, 23.85 ], [ -77.8, 23.94 ] ] ], [ [ [ -75.53, 24.4 ], [ -75.76, 24.68 ], [ -75.29, 24.14 ], [ -75.53, 24.15 ], [ -75.39, 24.23 ], [ -75.53, 24.4 ] ] ], [ [ [ -76.15, 24.63 ], [ -76.35, 24.83 ], [ -76.18, 24.8 ], [ -76.15, 25.12 ], [ -76.61, 25.44 ], [ -76.79, 25.4 ], [ -76.74, 25.56 ], [ -76.11, 25.13 ], [ -76.15, 24.63 ] ] ], [ [ [ -74.86, 22.85 ], [ -75.23, 23.17 ], [ -75.04, 23.08 ], [ -75.33, 23.69 ], [ -74.86, 22.85 ] ] ], [ [ [ -77.54, 23.83 ], [ -77.66, 23.84 ], [ -77.52, 23.95 ], [ -77.54, 23.83 ] ] ], [ [ [ -77.84, 24.11 ], [ -77.87, 24.13 ], [ -77.82, 24.22 ], [ -77.83, 24.16 ], [ -77.67, 24.3 ], [ -77.85, 24.14 ], [ -77.7, 24.12 ], [ -77.72, 24.04 ], [ -77.84, 24.11 ] ] ], [ [ [ -77.36, 26.03 ], [ -77.19, 26.15 ], [ -77.13, 26.56 ], [ -77.55, 26.89 ], [ -77.83, 26.91 ], [ -77.58, 26.92 ], [ -77.02, 26.56 ], [ -77.18, 25.86 ], [ -77.36, 26.03 ] ] ], [ [ [ -97.61, 21.78 ], [ -97.71, 21.97 ], [ -97.33, 21.57 ], [ -97.42, 21.26 ], [ -97.38, 21.53 ], [ -97.61, 21.78 ] ] ], [ [ [ -97.48, 25.16 ], [ -97.42, 25.23 ], [ -97.51, 25.05 ], [ -97.48, 25.16 ] ] ], [ [ [ -91.63, 18.74 ], [ -91.51, 18.75 ], [ -91.85, 18.65 ], [ -91.63, 18.74 ] ] ], [ [ [ -106.62, 21.6 ], [ -106.65, 21.7 ], [ -106.51, 21.6 ], [ -106.62, 21.6 ] ] ], [ [ [ -115.16, 28.14 ], [ -115.19, 28.03 ], [ -115.36, 28.08 ], [ -115.25, 28.38 ], [ -115.16, 28.14 ] ] ], [ [ [ -113.21, 29.05 ], [ -113.56, 29.54 ], [ -113.17, 29.28 ], [ -113.12, 28.99 ], [ -113.21, 29.05 ] ] ], [ [ [ -110.29, 24.48 ], [ -110.35, 24.4 ], [ -110.4, 24.52 ], [ -110.29, 24.48 ] ] ], [ [ [ -112.2, 29.01 ], [ -112.31, 28.75 ], [ -112.58, 28.88 ], [ -112.45, 29.2 ], [ -112.29, 29.23 ], [ -112.2, 29.01 ] ] ], [ [ [ -110.58, 25.02 ], [ -110.53, 24.88 ], [ -110.71, 25.1 ], [ -110.58, 25.02 ] ] ], [ [ [ -74.79, 68.39 ], [ -75.4, 68.52 ], [ -75.26, 68.73 ], [ -74.79, 68.39 ] ] ], [ [ [ -74.82, 68.57 ], [ -74.75, 68.68 ], [ -74.51, 68.57 ], [ -74.82, 68.57 ] ] ], [ [ [ -74.1, 68.36 ], [ -74.22, 68.25 ], [ -74.37, 68.47 ], [ -74.1, 68.36 ] ] ], [ [ [ 8.71, 3.79 ], [ 8.94, 3.67 ], [ 8.68, 3.21 ], [ 8.41, 3.36 ], [ 8.71, 3.79 ] ] ], [ [ [ -70.1, 41.29 ], [ -70.05, 41.39 ], [ -69.97, 41.25 ], [ -70.24, 41.29 ], [ -70.1, 41.29 ] ] ], [ [ [ -105.66, 22.28 ], [ -105.68, 22.57 ], [ -105.64, 22.19 ], [ -105.66, 22.28 ] ] ], [ [ [ 92.85, 20.35 ], [ 92.78, 20.28 ], [ 92.76, 20.44 ], [ 92.85, 20.35 ] ] ], [ [ [ 93.75, 19.39 ], [ 93.85, 19.48 ], [ 93.86, 19.3 ], [ 93.75, 19.39 ] ] ], [ [ [ 93.87, 19.21 ], [ 93.94, 18.85 ], [ 93.67, 19.02 ], [ 93.79, 19.13 ], [ 93.66, 19.07 ], [ 93.48, 19.4 ], [ 93.61, 19.41 ], [ 93.62, 19.17 ], [ 93.68, 19.29 ], [ 93.87, 19.21 ] ] ], [ [ [ 93.74, 18.82 ], [ 93.66, 18.67 ], [ 93.48, 18.87 ], [ 93.74, 18.82 ] ] ], [ [ [ 168.11, -21.44 ], [ 168.12, -21.63 ], [ 167.85, -21.6 ], [ 167.8, -21.38 ], [ 168.11, -21.44 ] ] ], [ [ [ 168.29, -16.68 ], [ 168.48, -16.84 ], [ 168.18, -16.8 ], [ 168.15, -16.57 ], [ 168.29, -16.68 ] ] ], [ [ [ 18.81, 74.43 ], [ 19.25, 74.47 ], [ 19.06, 74.34 ], [ 18.81, 74.43 ] ] ], [ [ [ 126.39, 36.53 ], [ 126.43, 36.4 ], [ 126.35, 36.61 ], [ 126.39, 36.53 ] ] ], [ [ [ 126.33, 34.54 ], [ 126.34, 34.4 ], [ 126.13, 34.36 ], [ 126.33, 34.54 ] ] ], [ [ [ 126.57, 33.52 ], [ 126.95, 33.46 ], [ 126.61, 33.24 ], [ 126.18, 33.26 ], [ 126.26, 33.44 ], [ 126.57, 33.52 ] ] ], [ [ [ -77.14, 67.37 ], [ -77.28, 67.73 ], [ -76.67, 68.26 ], [ -75.89, 68.34 ], [ -75.12, 68.24 ], [ -75.3, 67.38 ], [ -76.66, 67.21 ], [ -77.14, 67.37 ] ] ], [ [ [ -72, 77.44 ], [ -71.33, 77.36 ], [ -72.09, 77.31 ], [ -72.52, 77.41 ], [ -72, 77.44 ] ] ], [ [ [ -81.06, 75.64 ], [ -80.24, 75.63 ], [ -79.93, 75.54 ], [ -80.44, 75.46 ], [ -79.48, 75.38 ], [ -80.43, 75.01 ], [ -79.59, 75.02 ], [ -79.34, 74.89 ], [ -79.97, 74.81 ], [ -80.37, 74.93 ], [ -80.3, 74.58 ], [ -82.79, 74.53 ], [ -83.51, 74.9 ], [ -83.45, 74.59 ], [ -84.26, 74.5 ], [ -84.91, 74.5 ], [ -85.01, 74.7 ], [ -85.23, 74.49 ], [ -85.56, 74.69 ], [ -85.61, 74.49 ], [ -86.13, 74.48 ], [ -86.18, 74.61 ], [ -86.46, 74.48 ], [ -86.79, 74.62 ], [ -86.62, 74.47 ], [ -88.54, 74.5 ], [ -88.55, 74.91 ], [ -89.5, 74.55 ], [ -91.03, 74.71 ], [ -90.74, 74.89 ], [ -91.3, 74.63 ], [ -92.08, 74.8 ], [ -92.26, 75.07 ], [ -91.82, 75.12 ], [ -92.5, 75.22 ], [ -92, 75.66 ], [ -93.08, 76.36 ], [ -95.4, 76.23 ], [ -94.83, 76.33 ], [ -96.02, 76.44 ], [ -95.6, 76.61 ], [ -96.93, 76.71 ], [ -96.88, 76.82 ], [ -96.3, 76.76 ], [ -96.86, 76.97 ], [ -95.69, 77.07 ], [ -93.72, 76.93 ], [ -93.17, 76.74 ], [ -93.58, 76.41 ], [ -93.12, 76.62 ], [ -90.97, 76.65 ], [ -90.47, 76.47 ], [ -91.47, 76.45 ], [ -89.19, 76.25 ], [ -90.46, 76.18 ], [ -90.11, 76.13 ], [ -91.62, 76.27 ], [ -90.19, 76.06 ], [ -91.16, 76.02 ], [ -91.2, 75.82 ], [ -90.8, 76 ], [ -90.55, 75.9 ], [ -89.93, 76.01 ], [ -89.79, 75.79 ], [ -89.16, 75.77 ], [ -89.75, 75.58 ], [ -88.93, 75.43 ], [ -88.76, 75.68 ], [ -88.22, 75.47 ], [ -87.73, 75.58 ], [ -87.58, 75.44 ], [ -87.28, 75.62 ], [ -86.35, 75.42 ], [ -86.63, 75.36 ], [ -85.54, 75.4 ], [ -86.16, 75.51 ], [ -84.51, 75.62 ], [ -84, 75.82 ], [ -81.59, 75.81 ], [ -81.06, 75.64 ] ] ], [ [ [ -56.99, 74.52 ], [ -56.39, 74.5 ], [ -57.51, 74.48 ], [ -56.99, 74.52 ] ] ], [ [ [ -84.17, 65.95 ], [ -84.44, 66.14 ], [ -83.22, 65.65 ], [ -83.83, 65.65 ], [ -83.66, 65.75 ], [ -84.12, 65.76 ], [ -84.17, 65.95 ] ] ], [ [ [ -86.74, 68.26 ], [ -86.41, 68.2 ], [ -86.57, 67.72 ], [ -86.96, 67.9 ], [ -86.74, 68.26 ] ] ], [ [ [ -87.18, 70.02 ], [ -87.07, 70.16 ], [ -86.45, 70.01 ], [ -87.18, 70.02 ] ] ], [ [ [ -179.44, 71.55 ], [ -178.16, 71.49 ], [ -177.44, 71.24 ], [ -177.58, 71.1 ], [ -179.58, 70.86 ], [ -180, 70.98 ], [ -180, 71.53 ], [ -179.44, 71.55 ] ] ], [ [ [ 93.67, 7 ], [ 93.67, 7.17 ], [ 93.84, 7.24 ], [ 93.9, 6.8 ], [ 93.67, 7 ] ] ], [ [ [ 93.65, 7.37 ], [ 93.76, 7.37 ], [ 93.65, 7.24 ], [ 93.65, 7.37 ] ] ], [ [ [ 92.39, 10.56 ], [ 92.37, 10.78 ], [ 92.52, 10.9 ], [ 92.57, 10.58 ], [ 92.39, 10.56 ] ] ], [ [ [ 92.67, 12.9 ], [ 92.71, 12.99 ], [ 92.67, 12.78 ], [ 92.67, 12.9 ] ] ], [ [ [ 92.84, 13.37 ], [ 93.03, 13.58 ], [ 93.03, 13.08 ], [ 92.85, 12.93 ], [ 92.97, 12.53 ], [ 92.82, 12.43 ], [ 92.71, 11.48 ], [ 92.51, 11.85 ], [ 92.77, 12.23 ], [ 92.68, 12.59 ], [ 92.84, 13.37 ] ] ], [ [ [ -104.67, 68.58 ], [ -104.56, 68.4 ], [ -105.08, 68.55 ], [ -104.67, 68.58 ] ] ], [ [ [ -90.48, 69.36 ], [ -90.2, 69.45 ], [ -90.27, 69.25 ], [ -90.48, 69.36 ] ] ], [ [ [ 135.72, -1.7 ], [ 135.41, -1.6 ], [ 136.9, -1.79 ], [ 136.26, -1.91 ], [ 135.72, -1.7 ] ] ], [ [ [ -72.99, 18.88 ], [ -72.82, 18.69 ], [ -73.3, 18.93 ], [ -72.99, 18.88 ] ] ], [ [ [ 135.47, -.65 ], [ 135.85, -.7 ], [ 136.17, -1.04 ], [ 136.38, -1.08 ], [ 135.86, -1.17 ], [ 135.73, -.78 ], [ 135.64, -.89 ], [ 135.47, -.74 ], [ 135.54, -.87 ], [ 135.36, -.64 ], [ 135.47, -.65 ] ] ], [ [ [ 134.85, -1.13 ], [ 134.84, -.93 ], [ 134.99, -1.05 ], [ 134.85, -1.13 ] ] ], [ [ [ 130.69, -.95 ], [ 131.08, -.97 ], [ 130.97, -1.35 ], [ 130.74, -1.23 ], [ 130.69, -.95 ] ] ], [ [ [ 154.65, 49.27 ], [ 154.85, 49.63 ], [ 154.84, 49.32 ], [ 154.65, 49.27 ] ] ], [ [ [ -118.91, 75.8 ], [ -117.44, 76.1 ], [ -118.57, 75.5 ], [ -119.4, 75.61 ], [ -118.91, 75.8 ] ] ], [ [ [ -62.22, 65.7 ], [ -62.23, 65.6 ], [ -62.47, 65.65 ], [ -62.22, 65.7 ] ] ], [ [ [ -98, 75.12 ], [ -98.65, 74.99 ], [ -99.39, 75 ], [ -99.29, 75.13 ], [ -99.55, 74.97 ], [ -100.37, 75.03 ], [ -100.54, 75.2 ], [ -99.86, 75.24 ], [ -100.72, 75.43 ], [ -98.91, 75.71 ], [ -102.66, 75.5 ], [ -102.86, 75.64 ], [ -102.04, 75.7 ], [ -102.29, 75.86 ], [ -101.84, 75.91 ], [ -101.3, 75.75 ], [ -100.9, 75.82 ], [ -101.36, 75.78 ], [ -101.25, 76.01 ], [ -101.83, 76.02 ], [ -101.35, 76.25 ], [ -102.17, 76.24 ], [ -101.9, 76.45 ], [ -99.91, 75.88 ], [ -99.43, 75.96 ], [ -100.24, 76.13 ], [ -99.41, 76.16 ], [ -100.43, 76.22 ], [ -99.91, 76.33 ], [ -100.99, 76.5 ], [ -99.65, 76.63 ], [ -99.07, 76.39 ], [ -98.5, 76.69 ], [ -97.67, 76.49 ], [ -97.54, 75.87 ], [ -98, 75.73 ], [ -97.37, 75.69 ], [ -97.26, 75.4 ], [ -97.97, 75.57 ], [ -98.17, 75.33 ], [ -97.56, 75.14 ], [ -98.07, 75.23 ], [ -98, 75.12 ] ] ], [ [ [ -103.77, 75.31 ], [ -103.85, 75.06 ], [ -104.91, 75.12 ], [ -104.5, 75.42 ], [ -103.77, 75.31 ] ] ], [ [ [ -102.49, 75.81 ], [ -103.38, 75.77 ], [ -102.14, 76 ], [ -102.49, 75.81 ] ] ], [ [ [ -104.65, 76.59 ], [ -104, 76.67 ], [ -103.03, 76.41 ], [ -104.33, 76.33 ], [ -104.65, 76.59 ] ] ], [ [ [ -102.52, 76.16 ], [ -103.92, 76.04 ], [ -104.48, 76.16 ], [ -102.9, 76.32 ], [ -102.52, 76.16 ] ] ], [ [ [ -121.01, 75.86 ], [ -120.86, 75.95 ], [ -121.14, 75.73 ], [ -121.01, 75.86 ] ] ], [ [ [ -115.39, 75.1 ], [ -115.68, 75.17 ], [ -115.69, 74.97 ], [ -116.21, 75.22 ], [ -116.69, 75.12 ], [ -117.67, 75.26 ], [ -117.26, 75.47 ], [ -116.01, 75.49 ], [ -115.01, 75.7 ], [ -117.22, 75.58 ], [ -116.81, 75.8 ], [ -114.78, 75.9 ], [ -116.73, 75.91 ], [ -116.21, 76.2 ], [ -114.63, 76.17 ], [ -115.91, 76.29 ], [ -114.89, 76.52 ], [ -114.17, 76.48 ], [ -113.98, 76.2 ], [ -112.41, 76.18 ], [ -111.68, 75.92 ], [ -112.24, 75.81 ], [ -111.44, 75.85 ], [ -111.22, 75.52 ], [ -108.77, 75.52 ], [ -108.81, 75.69 ], [ -110.05, 75.91 ], [ -109.27, 76.11 ], [ -110.42, 76.36 ], [ -109.12, 76.83 ], [ -108.41, 76.74 ], [ -108.6, 76.43 ], [ -108.04, 76.28 ], [ -108.49, 76.04 ], [ -107.61, 76 ], [ -108, 75.79 ], [ -107.04, 75.9 ], [ -106.84, 75.65 ], [ -106.58, 76.07 ], [ -105.42, 75.85 ], [ -105.99, 75.05 ], [ -107.2, 74.91 ], [ -107.76, 75.1 ], [ -108.35, 74.92 ], [ -108.79, 75.07 ], [ -112.38, 74.42 ], [ -113.53, 74.43 ], [ -114.44, 74.7 ], [ -112.85, 74.98 ], [ -111.62, 75 ], [ -111.01, 75.28 ], [ -112.38, 75.13 ], [ -112.65, 75.29 ], [ -112.68, 75.14 ], [ -113.91, 75.05 ], [ -113.31, 75.42 ], [ -114.03, 75.48 ], [ -114.17, 75.22 ], [ -114.61, 75.28 ], [ -114.45, 75.06 ], [ -115.04, 74.96 ], [ -115.23, 75.19 ], [ -115.39, 75.1 ] ] ], [ [ [ 161.19, 69.29 ], [ 161.41, 69.53 ], [ 161.38, 69.21 ], [ 161.19, 69.29 ] ] ], [ [ [ 161.38, 69.2 ], [ 161.42, 68.86 ], [ 161.14, 69.28 ], [ 161.38, 69.2 ] ] ], [ [ [ 136.23, 75.62 ], [ 135.54, 75.37 ], [ 135.72, 75.87 ], [ 136.23, 75.62 ] ] ], [ [ [ -109.95, 72.7 ], [ -110.68, 72.99 ], [ -109.64, 72.94 ], [ -108.58, 72.55 ], [ -108.22, 71.73 ], [ -107.8, 71.6 ], [ -107.23, 71.9 ], [ -107.76, 72.15 ], [ -108.11, 73.31 ], [ -106.89, 73.15 ], [ -106.85, 73.31 ], [ -105.45, 72.92 ], [ -104.3, 71.6 ], [ -104.48, 71.03 ], [ -103.53, 70.59 ], [ -102.88, 70.5 ], [ -103.01, 70.69 ], [ -102.16, 70.31 ], [ -101.53, 70.27 ], [ -101.5, 70.11 ], [ -100.97, 70.19 ], [ -100.95, 69.67 ], [ -101.31, 69.68 ], [ -101.44, 69.94 ], [ -101.87, 69.68 ], [ -102.04, 69.96 ], [ -102.67, 69.77 ], [ -102.53, 69.55 ], [ -103.47, 69.7 ], [ -103, 69.5 ], [ -103.18, 69.1 ], [ -102.29, 69.52 ], [ -101.92, 69.42 ], [ -102.22, 69.22 ], [ -101.88, 69.27 ], [ -101.8, 69 ], [ -103.41, 68.78 ], [ -104.35, 68.97 ], [ -105.12, 68.9 ], [ -104.88, 69.09 ], [ -106.38, 69.18 ], [ -106.59, 69.5 ], [ -107.35, 69.01 ], [ -108.53, 68.94 ], [ -109.16, 68.71 ], [ -113.2, 68.46 ], [ -113.67, 68.82 ], [ -113.71, 69.17 ], [ -113.41, 69.17 ], [ -116.5, 69.41 ], [ -117.26, 69.79 ], [ -117.21, 70.08 ], [ -114.5, 70.32 ], [ -112.53, 70.2 ], [ -111.44, 70.34 ], [ -113.82, 70.72 ], [ -115.57, 70.57 ], [ -117.61, 70.62 ], [ -118.36, 71.03 ], [ -115.04, 71.54 ], [ -118.24, 71.39 ], [ -117.67, 71.68 ], [ -118.89, 71.58 ], [ -119.12, 71.76 ], [ -118.08, 72.24 ], [ -118.5, 72.51 ], [ -117.32, 72.93 ], [ -114.68, 73.38 ], [ -113.93, 73.13 ], [ -114.4, 72.55 ], [ -113.43, 72.67 ], [ -113.08, 73.01 ], [ -111.18, 72.73 ], [ -112.06, 72.27 ], [ -111.22, 72.47 ], [ -111, 72.28 ], [ -110.68, 72.58 ], [ -110.29, 72.43 ], [ -110.36, 72.56 ], [ -109.77, 72.48 ], [ -110.29, 72.67 ], [ -109.95, 72.7 ] ] ], [ [ [ -90.98, 77.63 ], [ -89.73, 77.47 ], [ -90.12, 77.2 ], [ -91.21, 77.39 ], [ -90.98, 77.63 ] ] ], [ [ [ -96.26, 77.69 ], [ -95.48, 77.82 ], [ -93.08, 77.67 ], [ -93.9, 77.44 ], [ -95.83, 77.47 ], [ -96.26, 77.69 ] ] ], [ [ [ -98.11, 78.58 ], [ -98.4, 78.77 ], [ -97.7, 78.81 ], [ -95.08, 78.44 ], [ -95.11, 77.95 ], [ -97.13, 77.8 ], [ -97.8, 78.04 ], [ -96.84, 78.11 ], [ -97.96, 78.22 ], [ -98.11, 78.58 ] ] ], [ [ [ -102.26, 77.73 ], [ -102.09, 77.91 ], [ -100.89, 77.74 ], [ -102.26, 77.73 ] ] ], [ [ [ -90.08, 78.57 ], [ -89.47, 78.15 ], [ -90.23, 78.34 ], [ -90.75, 78.32 ], [ -90.33, 78.14 ], [ -92.12, 78.22 ], [ -92.98, 78.48 ], [ -91.89, 78.57 ], [ -93.29, 78.58 ], [ -93.82, 78.77 ], [ -93.03, 78.76 ], [ -94.3, 78.99 ], [ -93.38, 79.16 ], [ -90.34, 79.25 ], [ -92.26, 79.21 ], [ -92.57, 79.3 ], [ -91.12, 79.39 ], [ -92.11, 79.34 ], [ -93.09, 79.49 ], [ -93.86, 79.27 ], [ -94.38, 79.43 ], [ -95.12, 79.27 ], [ -95.73, 79.54 ], [ -94.26, 79.76 ], [ -95.72, 79.64 ], [ -96.64, 79.88 ], [ -96.68, 80.15 ], [ -94.33, 79.98 ], [ -94.79, 80.09 ], [ -94.07, 80.18 ], [ -95.33, 80.12 ], [ -95.21, 80.24 ], [ -95.91, 80.19 ], [ -96.62, 80.33 ], [ -95.22, 80.38 ], [ -95.96, 80.58 ], [ -93.78, 80.52 ], [ -95.49, 80.81 ], [ -94.88, 81.06 ], [ -94.35, 80.96 ], [ -94.27, 81.11 ], [ -92.99, 81.1 ], [ -94.35, 81.25 ], [ -94.08, 81.37 ], [ -92.06, 81.23 ], [ -90.75, 80.56 ], [ -89.22, 80.53 ], [ -88.33, 80.08 ], [ -88.61, 80.38 ], [ -87.61, 80.41 ], [ -87.55, 80.18 ], [ -88.25, 80.15 ], [ -87.25, 80.08 ], [ -87.48, 79.84 ], [ -86.94, 79.92 ], [ -87.4, 79.52 ], [ -86.31, 79.65 ], [ -86.04, 79.44 ], [ -85.7, 79.62 ], [ -84.88, 79.28 ], [ -86.7, 78.96 ], [ -86.99, 79.06 ], [ -87.62, 78.64 ], [ -87.73, 79.09 ], [ -88.14, 79 ], [ -87.87, 78.56 ], [ -88.2, 78.45 ], [ -88.8, 78.61 ], [ -88.82, 78.15 ], [ -90.08, 78.57 ] ] ], [ [ [ -89.78, 76.78 ], [ -89.97, 76.47 ], [ -90.6, 76.74 ], [ -89.78, 76.78 ] ] ], [ [ [ -94.81, 75.86 ], [ -94.5, 75.99 ], [ -94.29, 75.76 ], [ -94.81, 75.86 ] ] ], [ [ [ -85.03, 77.58 ], [ -85.11, 77.45 ], [ -85.52, 77.54 ], [ -85.03, 77.58 ] ] ], [ [ [ -68.69, 18.11 ], [ -68.78, 18.19 ], [ -68.57, 18.12 ], [ -68.69, 18.11 ] ] ], [ [ [ -72.15, 21.82 ], [ -72.36, 21.76 ], [ -72.33, 21.87 ], [ -72.15, 21.82 ] ] ], [ [ [ 166, -10.78 ], [ 165.75, -10.79 ], [ 165.88, -10.66 ], [ 166.15, -10.68 ], [ 166, -10.78 ] ] ], [ [ [ -68.31, 69.59 ], [ -67.72, 69.66 ], [ -67.93, 69.53 ], [ -68.31, 69.59 ] ] ], [ [ [ -68.19, 68.79 ], [ -67.68, 68.71 ], [ -68.48, 68.8 ], [ -68.19, 68.79 ] ] ], [ [ [ 100.04, 9.45 ], [ 99.93, 9.42 ], [ 99.92, 9.58 ], [ 100.08, 9.59 ], [ 100.04, 9.45 ] ] ], [ [ [ 152.52, -3.9 ], [ 152.17, -3.5 ], [ 150.98, -2.78 ], [ 150.72, -2.75 ], [ 150.86, -2.7 ], [ 150.8, -2.55 ], [ 152.05, -3.24 ], [ 152.55, -3.81 ], [ 152.93, -3.98 ], [ 153.12, -4.37 ], [ 152.88, -4.85 ], [ 152.52, -3.9 ] ] ], [ [ [ 98.33, 9.08 ], [ 98.25, 9.03 ], [ 98.26, 9.17 ], [ 98.33, 9.08 ] ] ], [ [ [ -61.39, 15.32 ], [ -61.46, 15.64 ], [ -61.24, 15.47 ], [ -61.26, 15.25 ], [ -61.39, 15.32 ] ] ], [ [ [ 86.68, 74.83 ], [ 86.26, 74.92 ], [ 87.01, 74.99 ], [ 86.68, 74.83 ] ] ], [ [ [ 96.51, 77.16 ], [ 96.23, 76.97 ], [ 95.29, 76.96 ], [ 96.51, 77.16 ] ] ], [ [ [ 96.47, 76.21 ], [ 96.36, 76.1 ], [ 95.35, 76.28 ], [ 96.47, 76.21 ] ] ], [ [ [ 134.5, 7.5 ], [ 134.62, 7.73 ], [ 134.55, 7.33 ], [ 134.5, 7.5 ] ] ], [ [ [ 171.1, 7.1 ], [ 171.04, 7.16 ], [ 171.36, 7.08 ], [ 171.1, 7.1 ] ] ], [ [ [ 52.59, 71.39 ], [ 53.23, 71.24 ], [ 53.18, 70.95 ], [ 52.25, 71.26 ], [ 52.59, 71.39 ] ] ], [ [ [ 52.46, 71.46 ], [ 52.3, 71.57 ], [ 52.3, 71.46 ], [ 51.63, 71.53 ], [ 51.44, 71.84 ], [ 51.82, 72.15 ], [ 52.53, 72.03 ], [ 52.72, 72.47 ], [ 53.32, 72.55 ], [ 52.73, 72.54 ], [ 52.98, 72.66 ], [ 52.4, 72.72 ], [ 52.96, 72.91 ], [ 53.63, 72.89 ], [ 53.12, 72.93 ], [ 53.22, 73.15 ], [ 54.92, 73.42 ], [ 55.4, 73.32 ], [ 56.4, 73.22 ], [ 56.55, 73.11 ], [ 55.79, 73.07 ], [ 56.43, 73.02 ], [ 55.55, 72.94 ], [ 56.26, 72.95 ], [ 56.12, 72.78 ], [ 55.34, 72.76 ], [ 55.92, 72.65 ], [ 55.3, 72.57 ], [ 55.58, 72.17 ], [ 55.27, 71.94 ], [ 56.21, 71.18 ], [ 57.54, 70.75 ], [ 57.48, 70.59 ], [ 56.24, 70.74 ], [ 56.31, 70.65 ], [ 55.8, 70.67 ], [ 56.02, 70.56 ], [ 54.92, 70.77 ], [ 55.48, 70.64 ], [ 55.17, 70.55 ], [ 54.54, 70.78 ], [ 54.79, 70.63 ], [ 53.55, 70.79 ], [ 53.54, 71.08 ], [ 53.98, 71.02 ], [ 54.23, 71.17 ], [ 53.54, 71.2 ], [ 53.47, 71.57 ], [ 52.91, 71.38 ], [ 52.53, 71.76 ], [ 52.46, 71.46 ] ] ], [ [ [ 20.22, 60.08 ], [ 20.18, 59.97 ], [ 19.97, 60.07 ], [ 20.22, 60.08 ] ] ], [ [ [ 55.3, 73.72 ], [ 54.24, 73.6 ], [ 53.68, 73.75 ], [ 54.83, 73.95 ], [ 55.03, 74.16 ], [ 56.08, 74.04 ], [ 55.12, 74.26 ], [ 55.7, 74.25 ], [ 55.38, 74.41 ], [ 56.29, 74.47 ], [ 55.57, 74.54 ], [ 55.82, 74.67 ], [ 56.94, 74.67 ], [ 55.84, 74.77 ], [ 56.45, 74.9 ], [ 55.84, 74.96 ], [ 55.87, 75.15 ], [ 56.39, 75.04 ], [ 56.89, 75.36 ], [ 57.87, 75.31 ], [ 57.56, 75.47 ], [ 58.34, 75.58 ], [ 58.01, 75.65 ], [ 60.41, 75.96 ], [ 60.27, 76.09 ], [ 61.09, 76.04 ], [ 61.1, 76.27 ], [ 62.55, 76.16 ], [ 64.83, 76.34 ], [ 65.49, 76.55 ], [ 66.09, 76.5 ], [ 65.91, 76.7 ], [ 67.05, 76.94 ], [ 68.58, 76.96 ], [ 69.09, 76.7 ], [ 68.31, 76.25 ], [ 63.8, 75.61 ], [ 63.59, 75.71 ], [ 61.47, 75.21 ], [ 61.29, 75.31 ], [ 60.75, 75.01 ], [ 60.5, 75.1 ], [ 59.93, 75 ], [ 60.63, 74.91 ], [ 60.25, 74.73 ], [ 59.45, 74.79 ], [ 59.76, 74.57 ], [ 59.09, 74.72 ], [ 59.12, 74.53 ], [ 58.78, 74.58 ], [ 59.14, 74.42 ], [ 58.25, 74.56 ], [ 58.73, 74.21 ], [ 58.15, 73.97 ], [ 57.41, 74.2 ], [ 57.72, 73.72 ], [ 56.61, 73.87 ], [ 57.62, 73.63 ], [ 57.23, 73.55 ], [ 56.69, 73.69 ], [ 57.24, 73.45 ], [ 56.73, 73.23 ], [ 56.12, 73.26 ], [ 55.93, 73.43 ], [ 55.96, 73.29 ], [ 54.96, 73.44 ], [ 54.09, 73.34 ], [ 55.3, 73.72 ] ] ], [ [ [ 179.99, 71.53 ], [ 180, 71.53 ], [ 180, 70.98 ], [ 178.79, 70.79 ], [ 178.63, 71.07 ], [ 179.99, 71.53 ] ] ], [ [ [ 167.93, 69.91 ], [ 168.47, 70.03 ], [ 169.43, 69.86 ], [ 169.18, 69.55 ], [ 168.17, 69.68 ], [ 167.93, 69.91 ] ] ], [ [ [ 149.08, 75.23 ], [ 150.95, 75.13 ], [ 150.64, 74.86 ], [ 148.34, 74.77 ], [ 146.11, 75.24 ], [ 146.49, 75.59 ], [ 146.92, 75.33 ], [ 147.62, 75.44 ], [ 148.57, 75.37 ], [ 148.33, 75.21 ], [ 149.08, 75.23 ] ] ], [ [ [ 139.87, 73.34 ], [ 141.09, 73.84 ], [ 142.07, 73.91 ], [ 143.41, 73.55 ], [ 143.61, 73.21 ], [ 140.68, 73.43 ], [ 139.87, 73.34 ] ] ], [ [ [ 140.61, 73.9 ], [ 140.2, 74.2 ], [ 140.87, 74.27 ], [ 141.04, 74.01 ], [ 140.61, 73.9 ] ] ], [ [ [ 139.94, 75.92 ], [ 140.4, 75.63 ], [ 141.19, 75.62 ], [ 141.02, 75.99 ], [ 141.75, 75.99 ], [ 141.4, 76.17 ], [ 142.66, 75.85 ], [ 144.67, 75.7 ], [ 145.4, 75.5 ], [ 144.79, 75.4 ], [ 144.72, 75.15 ], [ 144.08, 75.01 ], [ 142.93, 75.14 ], [ 142.52, 75.34 ], [ 143.13, 75.64 ], [ 142.42, 75.74 ], [ 141.97, 75.62 ], [ 142.28, 75.3 ], [ 143.55, 74.9 ], [ 142.5, 74.8 ], [ 141.87, 75 ], [ 139.92, 74.79 ], [ 139.64, 74.96 ], [ 139.16, 74.63 ], [ 138.18, 74.76 ], [ 136.95, 75.26 ], [ 137.48, 75.36 ], [ 137.16, 75.73 ], [ 138.84, 76.2 ], [ 139.94, 75.92 ] ] ], [ [ [ 137.64, 71.57 ], [ 138.03, 71.53 ], [ 137.76, 71.41 ], [ 137.18, 71.55 ], [ 137.64, 71.57 ] ] ], [ [ [ 107.62, 77.25 ], [ 107.22, 77.21 ], [ 107.42, 77.34 ], [ 107.62, 77.25 ] ] ], [ [ [ 113.46, 74.37 ], [ 112.83, 74.08 ], [ 111.51, 74.3 ], [ 112.05, 74.36 ], [ 112.05, 74.55 ], [ 113.46, 74.37 ] ] ], [ [ [ 127.05, 72.43 ], [ 126.72, 72.5 ], [ 127.27, 72.52 ], [ 127.05, 72.43 ] ] ], [ [ [ 129.15, 72.22 ], [ 128.8, 72.31 ], [ 129.45, 72.32 ], [ 129.15, 72.22 ] ] ], [ [ [ 129, 72.43 ], [ 127.63, 72.46 ], [ 128.18, 72.55 ], [ 129, 72.43 ] ] ], [ [ [ 128.44, 72.29 ], [ 128.06, 72.38 ], [ 128.76, 72.33 ], [ 128.44, 72.29 ] ] ], [ [ [ 173.49, 52.44 ], [ 173.77, 52.51 ], [ 173.72, 52.36 ], [ 173.49, 52.44 ] ] ], [ [ [ 172.76, 52.88 ], [ 172.44, 52.92 ], [ 173.12, 52.99 ], [ 173.43, 52.83 ], [ 172.9, 52.75 ], [ 172.76, 52.88 ] ] ], [ [ [ 112.71, -7.1 ], [ 112.86, -6.89 ], [ 113.91, -6.86 ], [ 114.13, -6.98 ], [ 113.51, -7.25 ], [ 112.71, -7.1 ] ] ], [ [ [ 114.87, -8.2 ], [ 115.18, -8.06 ], [ 115.71, -8.4 ], [ 115.11, -8.85 ], [ 115.14, -8.67 ], [ 114.58, -8.4 ], [ 114.43, -8.1 ], [ 114.87, -8.2 ] ] ], [ [ [ 118.82, -8.83 ], [ 118.42, -8.87 ], [ 118.39, -8.61 ], [ 118.18, -8.85 ], [ 117.41, -9.05 ], [ 117.01, -9.11 ], [ 116.72, -8.97 ], [ 116.82, -8.52 ], [ 117.11, -8.37 ], [ 117.57, -8.41 ], [ 117.79, -8.72 ], [ 118.27, -8.66 ], [ 117.69, -8.24 ], [ 117.92, -8.08 ], [ 118.14, -8.13 ], [ 118.29, -8.37 ], [ 118.65, -8.29 ], [ 118.65, -8.55 ], [ 118.77, -8.31 ], [ 119, -8.31 ], [ 119.03, -8.63 ], [ 119.17, -8.56 ], [ 119.17, -8.72 ], [ 118.68, -8.74 ], [ 118.96, -8.82 ], [ 118.82, -8.83 ] ] ], [ [ [ 117.52, -8.39 ], [ 117.48, -8.19 ], [ 117.67, -8.15 ], [ 117.52, -8.39 ] ] ], [ [ [ 119.41, -8.5 ], [ 119.57, -8.49 ], [ 119.44, -8.75 ], [ 119.41, -8.5 ] ] ], [ [ [ 119.68, -8.81 ], [ 119.61, -8.61 ], [ 119.8, -8.62 ], [ 119.68, -8.81 ] ] ], [ [ [ 120.91, -8.36 ], [ 121.51, -8.62 ], [ 121.62, -8.47 ], [ 122.02, -8.44 ], [ 122.29, -8.64 ], [ 122.88, -8.29 ], [ 122.9, -8.18 ], [ 122.73, -8.22 ], [ 122.84, -8.07 ], [ 123.02, -8.31 ], [ 122.78, -8.42 ], [ 122.82, -8.6 ], [ 121.64, -8.91 ], [ 121.57, -8.8 ], [ 121, -8.96 ], [ 120.84, -8.83 ], [ 119.91, -8.87 ], [ 119.8, -8.76 ], [ 119.86, -8.43 ], [ 120.1, -8.45 ], [ 120.43, -8.24 ], [ 120.91, -8.36 ] ] ], [ [ [ 123.06, -8.41 ], [ 123.14, -8.23 ], [ 123.33, -8.27 ], [ 123.06, -8.41 ] ] ], [ [ [ 122.95, -8.49 ], [ 123.17, -8.44 ], [ 122.89, -8.61 ], [ 122.95, -8.49 ] ] ], [ [ [ 124.43, -8.29 ], [ 124.53, -8.12 ], [ 125.09, -8.15 ], [ 125.14, -8.25 ], [ 124.42, -8.46 ], [ 124.43, -8.29 ] ] ], [ [ [ 124.09, -8.36 ], [ 124.32, -8.18 ], [ 124.06, -8.55 ], [ 123.91, -8.44 ], [ 124.09, -8.36 ] ] ], [ [ [ 123.31, -8.43 ], [ 123.48, -8.34 ], [ 123.41, -8.25 ], [ 123.56, -8.24 ], [ 123.55, -8.37 ], [ 123.61, -8.22 ], [ 123.92, -8.25 ], [ 123.55, -8.57 ], [ 123.22, -8.55 ], [ 123.31, -8.43 ] ] ], [ [ [ 149.54, -1.34 ], [ 149.75, -1.53 ], [ 149.51, -1.44 ], [ 149.54, -1.34 ] ] ], [ [ [ 150.45, -2.65 ], [ 150.17, -2.68 ], [ 149.94, -2.47 ], [ 150.2, -2.36 ], [ 150.44, -2.48 ], [ 150.45, -2.65 ] ] ], [ [ [ -47.77, 60.8 ], [ -47.9, 60.66 ], [ -48.25, 60.78 ], [ -47.77, 60.8 ] ] ], [ [ [ 178.32, -18.13 ], [ 177.89, -18.28 ], [ 177.33, -18.12 ], [ 177.25, -17.89 ], [ 177.52, -17.51 ], [ 178.18, -17.31 ], [ 178.58, -17.64 ], [ 178.7, -18 ], [ 178.59, -18.13 ], [ 178.32, -18.13 ] ] ], [ [ [ 25.23, 76.61 ], [ 25.5, 76.72 ], [ 24.93, 76.44 ], [ 25.23, 76.61 ] ] ], [ [ [ -44.16, 59.89 ], [ -44.15, 60 ], [ -44.4, 59.89 ], [ -44.2, 60.01 ], [ -44.02, 60.01 ], [ -44.16, 59.89 ] ] ], [ [ [ 104.21, 2.8 ], [ 104.12, 2.74 ], [ 104.16, 2.89 ], [ 104.21, 2.8 ] ] ], [ [ [ 20.7, 78.22 ], [ 20.19, 78.5 ], [ 21.93, 78.58 ], [ 22.12, 78.27 ], [ 20.7, 78.22 ] ] ], [ [ [ -43.82, 59.93 ], [ -43.66, 59.84 ], [ -44.12, 59.8 ], [ -43.82, 59.93 ] ] ], [ [ [ -43.81, 60.03 ], [ -43.48, 60.04 ], [ -43.55, 59.91 ], [ -43.93, 59.99 ], [ -43.81, 60.03 ] ] ], [ [ [ -43.48, 59.93 ], [ -43.47, 60.04 ], [ -43.19, 59.95 ], [ -43.48, 59.93 ] ] ], [ [ [ -43.25, 60 ], [ -43.55, 60.08 ], [ -43.8, 60.05 ], [ -43.78, 60.09 ], [ -43.95, 60.03 ], [ -44.12, 60.09 ], [ -44.11, 60.17 ], [ -43.12, 60.05 ], [ -43.25, 60 ] ] ], [ [ [ 37.88, -46.89 ], [ 37.58, -46.95 ], [ 37.69, -46.82 ], [ 37.88, -46.89 ] ] ], [ [ [ -51.06, 64.35 ], [ -51.29, 64.21 ], [ -50.88, 64.54 ], [ -51.06, 64.35 ] ] ], [ [ [ 115.5, -6.95 ], [ 115.37, -6.89 ], [ 115.29, -7.01 ], [ 115.2, -6.9 ], [ 115.39, -6.83 ], [ 115.5, -6.95 ] ] ], [ [ [ 122.81, -10.78 ], [ 123.44, -10.49 ], [ 123.22, -10.83 ], [ 122.85, -10.94 ], [ 122.81, -10.78 ] ] ], [ [ [ 120.25, -9.64 ], [ 120.47, -9.62 ], [ 120.82, -10.12 ], [ 120.45, -10.32 ], [ 120.17, -10.24 ], [ 119.67, -9.78 ], [ 119.19, -9.76 ], [ 118.93, -9.55 ], [ 119.17, -9.38 ], [ 119.8, -9.4 ], [ 119.94, -9.27 ], [ 120.25, -9.64 ] ] ], [ [ [ 119.62, -4.21 ], [ 119.46, -3.49 ], [ 118.91, -3.52 ], [ 118.78, -3.09 ], [ 118.89, -2.89 ], [ 118.76, -2.79 ], [ 118.82, -2.62 ], [ 119.14, -2.47 ], [ 119.21, -2 ], [ 119.33, -1.96 ], [ 119.34, -1.17 ], [ 119.73, -.65 ], [ 119.88, -.86 ], [ 119.81, -.14 ], [ 119.6, -.01 ], [ 119.84, -.1 ], [ 119.77, .21 ], [ 119.9, .22 ], [ 119.88, .46 ], [ 120.05, .51 ], [ 120.04, .72 ], [ 120.24, .8 ], [ 120.25, .96 ], [ 120.59, .75 ], [ 120.9, 1.36 ], [ 121.25, 1.23 ], [ 121.46, 1.31 ], [ 121.43, 1.16 ], [ 121.66, 1.03 ], [ 122.45, 1.03 ], [ 122.85, .8 ], [ 122.99, .97 ], [ 123.96, .84 ], [ 124.35, 1.16 ], [ 124.58, 1.19 ], [ 124.53, 1.35 ], [ 124.83, 1.46 ], [ 124.98, 1.75 ], [ 125.18, 1.68 ], [ 125.24, 1.49 ], [ 125.01, 1.12 ], [ 124.64, .79 ], [ 124.51, .47 ], [ 124.22, .38 ], [ 123.35, .31 ], [ 123.06, .52 ], [ 121.8, .41 ], [ 121.53, .56 ], [ 121.11, .4 ], [ 120.65, .52 ], [ 120.3, .42 ], [ 120.03, -.07 ], [ 120.06, -.63 ], [ 120.31, -.97 ], [ 120.51, -1 ], [ 120.68, -1.42 ], [ 121.1, -1.44 ], [ 121.65, -.8 ], [ 121.67, -.92 ], [ 121.95, -1 ], [ 122.2, -.79 ], [ 122.96, -.75 ], [ 122.72, -.66 ], [ 123.06, -.56 ], [ 123.46, -.77 ], [ 123.32, -1.05 ], [ 123.1, -.83 ], [ 122.8, -.94 ], [ 122.39, -1.49 ], [ 121.86, -1.67 ], [ 121.68, -1.95 ], [ 121.29, -1.84 ], [ 121.34, -2.01 ], [ 121.41, -1.91 ], [ 121.55, -2.17 ], [ 121.82, -2.29 ], [ 122.01, -2.72 ], [ 122.49, -3.18 ], [ 122.33, -3.23 ], [ 122.38, -3.46 ], [ 122.24, -3.39 ], [ 122.2, -3.61 ], [ 122.67, -3.9 ], [ 122.51, -4 ], [ 122.65, -4.01 ], [ 122.66, -4.15 ], [ 122.86, -4.19 ], [ 122.76, -4.07 ], [ 122.85, -4.07 ], [ 122.88, -4.41 ], [ 122.68, -4.32 ], [ 122.74, -4.51 ], [ 122.58, -4.4 ], [ 122.11, -4.53 ], [ 122.01, -4.9 ], [ 121.54, -4.77 ], [ 121.47, -4.61 ], [ 121.61, -4.07 ], [ 120.9, -3.57 ], [ 121.09, -3.01 ], [ 120.97, -2.81 ], [ 121.1, -2.72 ], [ 120.81, -2.62 ], [ 120.19, -2.97 ], [ 120.42, -3.27 ], [ 120.32, -4.1 ], [ 120.46, -4.66 ], [ 120.27, -5.15 ], [ 120.47, -5.62 ], [ 120.32, -5.51 ], [ 119.94, -5.54 ], [ 119.7, -5.7 ], [ 119.43, -5.58 ], [ 119.35, -5.33 ], [ 119.62, -4.21 ] ] ], [ [ [ 121.82, -5.2 ], [ 121.97, -5.07 ], [ 122.05, -5.46 ], [ 121.95, -5.49 ], [ 121.82, -5.2 ] ] ], [ [ [ 120.67, -7.15 ], [ 120.62, -7 ], [ 120.79, -7.06 ], [ 120.67, -7.15 ] ] ], [ [ [ 128.53, -7.13 ], [ 128.7, -7.12 ], [ 128.65, -7.22 ], [ 128.53, -7.13 ] ] ], [ [ [ 122.73, -4.85 ], [ 122.6, -5.43 ], [ 122.54, -5.26 ], [ 122.46, -5.4 ], [ 122.27, -5.39 ], [ 122.37, -4.74 ], [ 122.7, -4.62 ], [ 122.73, -4.85 ] ] ], [ [ [ 122.61, -5.46 ], [ 122.82, -5.21 ], [ 122.74, -5.05 ], [ 122.87, -4.53 ], [ 123.08, -4.37 ], [ 123.21, -4.86 ], [ 123.02, -4.69 ], [ 122.92, -5.18 ], [ 123.22, -5.3 ], [ 122.87, -5.45 ], [ 122.78, -5.7 ], [ 122.62, -5.68 ], [ 122.61, -5.46 ] ] ], [ [ [ 127.86, -8.21 ], [ 127.76, -8.11 ], [ 128.13, -8.15 ], [ 127.86, -8.21 ] ] ], [ [ [ 125.82, -7.93 ], [ 125.97, -7.65 ], [ 126.18, -7.73 ], [ 126.63, -7.56 ], [ 126.84, -7.73 ], [ 126.47, -7.97 ], [ 126.06, -7.89 ], [ 125.8, -8.02 ], [ 125.82, -7.93 ] ] ], [ [ [ 127.37, -7.66 ], [ 127.36, -7.5 ], [ 127.49, -7.52 ], [ 127.37, -7.66 ] ] ], [ [ [ 129.85, -7.84 ], [ 129.76, -8.05 ], [ 129.58, -7.9 ], [ 129.67, -7.79 ], [ 129.85, -7.84 ] ] ], [ [ [ -61.63, 12.05 ], [ -61.8, 12 ], [ -61.66, 12.24 ], [ -61.63, 12.05 ] ] ], [ [ [ -15.82, 28.01 ], [ -15.71, 28.17 ], [ -15.42, 28.18 ], [ -15.36, 27.93 ], [ -15.6, 27.73 ], [ -15.82, 28.01 ] ] ], [ [ [ 116.03, -3.59 ], [ 116.28, -3.21 ], [ 116.31, -3.92 ], [ 116.09, -4.09 ], [ 116.03, -3.59 ] ] ], [ [ [ 123.19, -4.01 ], [ 123.14, -4.26 ], [ 122.99, -4.2 ], [ 123.01, -3.98 ], [ 123.19, -4.01 ] ] ], [ [ [ -42.1, 62.77 ], [ -41.86, 62.72 ], [ -42.4, 62.67 ], [ -42.36, 62.8 ], [ -42.1, 62.77 ] ] ], [ [ [ -41.48, 63.34 ], [ -41.1, 63.2 ], [ -41.89, 63.47 ], [ -41.48, 63.34 ] ] ], [ [ [ 125.72, -1.82 ], [ 126.35, -1.81 ], [ 125.92, -1.94 ], [ 125.33, -1.86 ], [ 125.72, -1.82 ] ] ], [ [ [ 125.92, -2.27 ], [ 125.91, -1.97 ], [ 126.05, -2.48 ], [ 125.92, -2.27 ] ] ], [ [ [ 127.7, -1.35 ], [ 128.16, -1.68 ], [ 127.41, -1.66 ], [ 127.42, -1.42 ], [ 127.7, -1.35 ] ] ], [ [ [ 127.57, -1.19 ], [ 127.69, -1.27 ], [ 127.47, -1.26 ], [ 127.57, -1.19 ] ] ], [ [ [ 128.49, -3.62 ], [ 128.42, -3.52 ], [ 128.56, -3.54 ], [ 128.49, -3.62 ] ] ], [ [ [ 128.97, -3.29 ], [ 128.87, -3.21 ], [ 128.67, -3.43 ], [ 128.46, -3.46 ], [ 128.16, -3.06 ], [ 127.92, -3.57 ], [ 127.84, -3.16 ], [ 128.12, -3.06 ], [ 128.16, -2.86 ], [ 129.05, -2.79 ], [ 129.13, -2.97 ], [ 129.53, -2.77 ], [ 130.58, -3.12 ], [ 130.66, -3.4 ], [ 130.84, -3.46 ], [ 130.85, -3.86 ], [ 129.93, -3.34 ], [ 129.52, -3.3 ], [ 129.53, -3.47 ], [ 128.97, -3.29 ] ] ], [ [ [ 103.38, 1.14 ], [ 103.44, .99 ], [ 103.32, 1.04 ], [ 103.38, 1.14 ] ] ], [ [ [ 103.15, .64 ], [ 103.25, .69 ], [ 103.29, .53 ], [ 103.17, .5 ], [ 103.15, .64 ] ] ], [ [ [ 102.87, 1.05 ], [ 102.62, 1.02 ], [ 102.87, 1.13 ], [ 103.15, .85 ], [ 102.8, 1 ], [ 102.87, 1.05 ] ] ], [ [ [ 101.39, 1.91 ], [ 101.66, 2.13 ], [ 101.79, 1.94 ], [ 101.62, 1.69 ], [ 101.39, 1.91 ] ] ], [ [ [ 129.38, 0 ], [ 129.56, -.21 ], [ 129.28, .05 ], [ 129.38, 0 ] ] ], [ [ [ 127.3, -.68 ], [ 127.33, -.79 ], [ 127.17, -.75 ], [ 127.2, -.61 ], [ 127.3, -.68 ] ] ], [ [ [ 127.79, -.68 ], [ 127.91, -.78 ], [ 127.83, -.85 ], [ 127.63, -.74 ], [ 127.47, -.82 ], [ 127.32, -.33 ], [ 127.45, -.42 ], [ 127.56, -.3 ], [ 127.69, -.46 ], [ 127.59, -.62 ], [ 127.79, -.68 ] ] ], [ [ [ 127.27, -.28 ], [ 127.26, -.49 ], [ 127.13, -.52 ], [ 127.11, -.28 ], [ 127.27, -.28 ] ] ], [ [ [ 102.47, 1.25 ], [ 102.39, .91 ], [ 102.21, 1.41 ], [ 102.47, 1.25 ] ] ], [ [ [ 102.39, 1.33 ], [ 102, 1.6 ], [ 102.46, 1.52 ], [ 102.51, 1.26 ], [ 102.39, 1.33 ] ] ], [ [ [ 130.45, -2.01 ], [ 130.13, -2.06 ], [ 129.72, -1.88 ], [ 130.35, -1.67 ], [ 130.45, -2.01 ] ] ], [ [ [ -73.33, 71.47 ], [ -73.14, 71.57 ], [ -73.24, 71.39 ], [ -73, 71.52 ], [ -72.84, 71.46 ], [ -73.02, 71.3 ], [ -73.26, 71.36 ], [ -73.33, 71.47 ] ] ], [ [ [ 130.49, -.79 ], [ 130.93, -.78 ], [ 130.39, -.92 ], [ 130.49, -.79 ] ] ], [ [ [ 104.49, .98 ], [ 104.22, 1.09 ], [ 104.58, 1.23 ], [ 104.59, .81 ], [ 104.49, .98 ] ] ], [ [ [ -40.51, 64.48 ], [ -40.84, 64.93 ], [ -40.18, 64.43 ], [ -40.51, 64.48 ] ] ], [ [ [ 121.51, 19.25 ], [ 121.35, 19.36 ], [ 121.52, 19.39 ], [ 121.51, 19.25 ] ] ], [ [ [ 130.6, -.47 ], [ 130.46, -.51 ], [ 130.7, -.44 ], [ 130.6, -.47 ] ] ], [ [ [ 130.73, -.29 ], [ 130.94, -.38 ], [ 130.73, -.44 ], [ 130.68, -.29 ], [ 130.55, -.43 ], [ 130.53, -.25 ], [ 130.22, -.21 ], [ 130.45, -.2 ], [ 130.3, -.17 ], [ 130.35, -.08 ], [ 131.05, -.02 ], [ 131.34, -.29 ], [ 130.96, -.35 ], [ 130.62, -.08 ], [ 130.73, -.29 ] ] ], [ [ [ 28.32, 78.92 ], [ 29.64, 78.9 ], [ 28.07, 78.8 ], [ 28.32, 78.92 ] ] ], [ [ [ 22.47, 80.31 ], [ 22.79, 80.51 ], [ 23.16, 80.11 ], [ 24.28, 80.36 ], [ 27.24, 80.06 ], [ 25.76, 79.44 ], [ 23.9, 79.21 ], [ 20.06, 79.46 ], [ 19.67, 79.61 ], [ 21.09, 79.54 ], [ 20.47, 79.67 ], [ 21.83, 79.69 ], [ 21.6, 79.82 ], [ 18.75, 79.71 ], [ 18.08, 79.9 ], [ 18.95, 80.05 ], [ 17.71, 80.13 ], [ 18.71, 80.21 ], [ 19.42, 80.09 ], [ 19, 80.34 ], [ 19.78, 80.22 ], [ 19.62, 80.51 ], [ 20.9, 80.2 ], [ 21.78, 80.27 ], [ 22.21, 79.98 ], [ 22.47, 80.31 ] ] ], [ [ [ 23.98, 77.68 ], [ 22.67, 77.24 ], [ 23.03, 77.58 ], [ 20.87, 77.44 ], [ 21.55, 77.92 ], [ 20.83, 78.12 ], [ 22.83, 78.26 ], [ 23.52, 77.93 ], [ 24.29, 77.93 ], [ 23.98, 77.68 ] ] ], [ [ [ 10.92, 78.79 ], [ 12.15, 78.21 ], [ 11.03, 78.48 ], [ 10.51, 78.9 ], [ 10.92, 78.79 ] ] ], [ [ [ -19.55, 80.03 ], [ -19.26, 80.21 ], [ -18.67, 80.13 ], [ -19.55, 80.03 ] ] ], [ [ [ -17.61, 79.03 ], [ -18.08, 78.97 ], [ -17.78, 79.18 ], [ -17.61, 79.03 ] ] ], [ [ [ -18.72, 76.6 ], [ -18.47, 75.93 ], [ -19.13, 76.72 ], [ -18.72, 76.6 ] ] ], [ [ [ 100.46, -3.31 ], [ 100.19, -2.99 ], [ 100.19, -2.79 ], [ 100.47, -3.02 ], [ 100.36, -3.16 ], [ 100.46, -3.31 ] ] ], [ [ [ -25.94, 70.53 ], [ -28.07, 70.45 ], [ -27.05, 70.88 ], [ -26.47, 70.9 ], [ -25.7, 71.09 ], [ -25.26, 70.66 ], [ -25.94, 70.53 ] ] ], [ [ [ 117.64, 4.14 ], [ 117.75, 4.06 ], [ 117.68, 3.97 ], [ 117.64, 4.14 ] ] ], [ [ [ 117.62, 3.26 ], [ 117.55, 3.44 ], [ 117.67, 3.41 ], [ 117.62, 3.26 ] ] ], [ [ [ 117.06, 7.13 ], [ 117.06, 7.29 ], [ 117.28, 7.35 ], [ 117.26, 7.19 ], [ 117.06, 7.13 ] ] ], [ [ [ -37.92, 65.64 ], [ -37.66, 65.9 ], [ -37.24, 65.75 ], [ -37.48, 65.81 ], [ -37.5, 65.59 ], [ -37.92, 65.64 ] ] ], [ [ [ -52.29, 65.2 ], [ -52.18, 65.32 ], [ -52.5, 65.18 ], [ -52.56, 65.33 ], [ -51.95, 65.5 ], [ -52.49, 65.38 ], [ -52.44, 65.67 ], [ -52.8, 65.54 ], [ -52.68, 65.81 ], [ -52.83, 65.66 ], [ -53.23, 65.67 ], [ -52.91, 65.81 ], [ -53.2, 65.75 ], [ -52.67, 65.94 ], [ -52.29, 65.83 ], [ -51.96, 66.01 ], [ -51.7, 65.92 ], [ -51.71, 66.1 ], [ -52.17, 66 ], [ -52.29, 65.89 ], [ -52.56, 66.02 ], [ -53.17, 65.84 ], [ -52.88, 66.02 ], [ -53.42, 65.92 ], [ -53.47, 66.03 ], [ -51.95, 66.49 ], [ -51.92, 66.63 ], [ -51.42, 66.71 ], [ -51.12, 66.88 ], [ -50.32, 66.83 ], [ -50.97, 66.97 ], [ -51.99, 66.65 ], [ -52.15, 66.51 ], [ -53.01, 66.19 ], [ -53.67, 66.1 ], [ -53.08, 66.29 ], [ -53.61, 66.23 ], [ -53.63, 66.51 ], [ -52.41, 66.52 ], [ -53.5, 66.64 ], [ -52.59, 66.71 ], [ -53.15, 66.71 ], [ -52.65, 66.8 ], [ -53.11, 66.76 ], [ -53.06, 66.85 ], [ -52.23, 66.84 ], [ -52.4, 66.99 ], [ -53.66, 66.92 ], [ -53.78, 67.01 ], [ -53.2, 67 ], [ -53.84, 67.07 ], [ -53.34, 67.11 ], [ -53.96, 67.09 ], [ -52.5, 67.35 ], [ -53.81, 67.19 ], [ -53.86, 67.34 ], [ -52.46, 67.77 ], [ -50.62, 67.49 ], [ -50.88, 67.6 ], [ -50.65, 67.65 ], [ -51.33, 67.72 ], [ -50.27, 67.84 ], [ -50.78, 67.9 ], [ -51.19, 67.75 ], [ -51.41, 67.87 ], [ -50.98, 67.87 ], [ -51.03, 67.98 ], [ -51.6, 67.93 ], [ -51.31, 67.8 ], [ -51.71, 67.69 ], [ -52.37, 67.81 ], [ -51.6, 67.97 ], [ -53, 67.75 ], [ -53.67, 67.48 ], [ -53.73, 67.79 ], [ -53.07, 67.87 ], [ -53.34, 67.9 ], [ -52.91, 67.97 ], [ -53.27, 67.98 ], [ -53.1, 68.06 ], [ -52.06, 67.95 ], [ -53.5, 68.14 ], [ -53.14, 68.2 ], [ -50.32, 67.92 ], [ -51.44, 68.19 ], [ -51.09, 68.17 ], [ -51.41, 68.24 ], [ -51.12, 68.27 ], [ -51.19, 68.4 ], [ -50.79, 68.5 ], [ -51.64, 68.41 ], [ -51.23, 68.28 ], [ -52.46, 68.17 ], [ -52.51, 68.3 ], [ -52.94, 68.23 ], [ -52.58, 68.36 ], [ -53.47, 68.31 ], [ -52.73, 68.36 ], [ -52.38, 68.51 ], [ -52.66, 68.52 ], [ -51.99, 68.58 ], [ -52.43, 68.57 ], [ -52.25, 68.65 ], [ -51.82, 68.64 ], [ -51.91, 68.5 ], [ -51.03, 68.57 ], [ -50.67, 68.82 ], [ -51.31, 68.74 ], [ -51.09, 69.14 ], [ -50.37, 68.9 ], [ -50.49, 69.01 ], [ -50.13, 69.02 ], [ -50.71, 69.13 ], [ -50.02, 69.11 ], [ -49.94, 69.21 ], [ -50.49, 69.19 ], [ -50.42, 69.35 ], [ -51.15, 69.21 ], [ -50.92, 69.46 ], [ -50.21, 69.53 ], [ -50.91, 69.49 ], [ -50.84, 69.65 ], [ -50.42, 69.59 ], [ -50.83, 69.71 ], [ -50.2, 69.76 ], [ -50.62, 69.93 ], [ -50.24, 70.05 ], [ -51.16, 69.96 ], [ -50.89, 70.03 ], [ -52.35, 70.05 ], [ -54.61, 70.65 ], [ -54.13, 70.83 ], [ -52.92, 70.77 ], [ -50.72, 70.32 ], [ -50.56, 70.53 ], [ -50.94, 70.42 ], [ -51.35, 70.57 ], [ -50.91, 70.5 ], [ -50.67, 70.64 ], [ -51.46, 70.73 ], [ -50.66, 70.74 ], [ -51.96, 71.02 ], [ -50.97, 70.98 ], [ -51.5, 71.06 ], [ -51.16, 71.15 ], [ -52.22, 71.12 ], [ -51.51, 71.25 ], [ -51.65, 71.36 ], [ -52.51, 71.15 ], [ -52.27, 71.36 ], [ -51.35, 71.48 ], [ -52.99, 71.42 ], [ -51.63, 71.72 ], [ -52.21, 71.62 ], [ -52.59, 71.64 ], [ -52.43, 71.7 ], [ -53.27, 71.72 ], [ -52.69, 72.01 ], [ -53.37, 71.78 ], [ -53.38, 72.04 ], [ -53.87, 72.32 ], [ -53.55, 72.35 ], [ -53.93, 72.32 ], [ -53.39, 71.86 ], [ -53.93, 71.75 ], [ -53.78, 71.63 ], [ -54.1, 71.65 ], [ -53.9, 71.45 ], [ -54.79, 71.36 ], [ -55.46, 71.45 ], [ -55.85, 71.69 ], [ -55.22, 71.76 ], [ -54.38, 72.25 ], [ -55.25, 71.93 ], [ -55.58, 72.03 ], [ -54.69, 72.37 ], [ -55.62, 72.45 ], [ -54.3, 72.48 ], [ -54.86, 72.66 ], [ -54.27, 72.8 ], [ -54.97, 73.06 ], [ -55.69, 73.06 ], [ -55.03, 73.36 ], [ -56.04, 73.65 ], [ -55.48, 73.73 ], [ -55.92, 74.04 ], [ -56.41, 74.07 ], [ -56.08, 74.28 ], [ -57.29, 74.1 ], [ -56.23, 74.27 ], [ -56.72, 74.35 ], [ -56.26, 74.44 ], [ -56.8, 74.45 ], [ -56.13, 74.47 ], [ -56.14, 74.55 ], [ -58.12, 75.09 ], [ -57.78, 75.23 ], [ -58.4, 75.3 ], [ -58.22, 75.41 ], [ -58.67, 75.35 ], [ -58.05, 75.44 ], [ -58.35, 75.71 ], [ -59.34, 75.89 ], [ -59.76, 75.8 ], [ -59.54, 75.99 ], [ -60.74, 76.04 ], [ -61.05, 76.22 ], [ -61.68, 76.16 ], [ -62.21, 76.29 ], [ -62.71, 76.19 ], [ -62.99, 76.4 ], [ -63.99, 76.11 ], [ -64.38, 76.35 ], [ -64.57, 76.13 ], [ -65.3, 76.18 ], [ -65.41, 76.02 ], [ -65.87, 76.1 ], [ -65.54, 76.3 ], [ -66.17, 76.28 ], [ -66.4, 76.08 ], [ -67.1, 76.25 ], [ -66.45, 75.91 ], [ -68.48, 76.08 ], [ -69.61, 76.42 ], [ -67.92, 76.58 ], [ -67.92, 76.69 ], [ -69.99, 76.77 ], [ -69.66, 77.02 ], [ -70.59, 76.79 ], [ -71.32, 77.07 ], [ -70.15, 77.24 ], [ -66.35, 77.11 ], [ -66.13, 77.2 ], [ -69.09, 77.28 ], [ -67.37, 77.39 ], [ -66.18, 77.26 ], [ -66.62, 77.42 ], [ -66.05, 77.44 ], [ -66.16, 77.6 ], [ -66.68, 77.72 ], [ -68.35, 77.51 ], [ -68.7, 77.67 ], [ -68.59, 77.51 ], [ -69.31, 77.47 ], [ -70.28, 77.57 ], [ -69.43, 77.76 ], [ -70.63, 77.68 ], [ -69.97, 77.86 ], [ -71.22, 77.76 ], [ -73.03, 78.17 ], [ -72.37, 78.54 ], [ -70.7, 78.59 ], [ -69.1, 78.88 ], [ -68.67, 78.81 ], [ -68.78, 79.01 ], [ -66.06, 79.11 ], [ -65.14, 79.37 ], [ -64.15, 79.9 ], [ -65.06, 80.01 ], [ -63.77, 80.15 ], [ -64.08, 80.3 ], [ -64.47, 80.09 ], [ -65.84, 80.01 ], [ -67.02, 80.06 ], [ -67.48, 80.34 ], [ -66.13, 80.66 ], [ -65.38, 80.62 ], [ -65.8, 80.71 ], [ -64.08, 81.12 ], [ -63.09, 80.76 ], [ -63.5, 81.2 ], [ -61.67, 80.88 ], [ -60.78, 80.96 ], [ -61.88, 81.34 ], [ -61.45, 81.84 ], [ -60.77, 81.91 ], [ -59.65, 81.85 ], [ -57, 81.22 ], [ -59.28, 81.87 ], [ -60.29, 81.98 ], [ -59.34, 82.1 ], [ -56.7, 82.25 ], [ -56.09, 82.13 ], [ -56.39, 82.26 ], [ -55.22, 82.34 ], [ -54.78, 81.55 ], [ -53.6, 81.98 ], [ -50.7, 81.48 ], [ -52.08, 81.87 ], [ -50.4, 81.82 ], [ -51.82, 82.38 ], [ -50.52, 82.46 ], [ -45.52, 81.57 ], [ -45.41, 82.16 ], [ -42.68, 82.1 ], [ -44.49, 82.22 ], [ -46.47, 82.71 ], [ -42.71, 82.69 ], [ -42.16, 82.35 ], [ -42, 82.67 ], [ -40.03, 82.26 ], [ -40.62, 82.66 ], [ -45.37, 82.79 ], [ -45.6, 82.91 ], [ -44.68, 82.86 ], [ -46.24, 83.09 ], [ -43.69, 83.04 ], [ -44.96, 83.17 ], [ -43.04, 83.23 ], [ -39.18, 82.75 ], [ -39.69, 82.99 ], [ -37.75, 82.98 ], [ -39.45, 83.06 ], [ -37.61, 83.14 ], [ -39.7, 83.23 ], [ -38.72, 83.54 ], [ -37, 83.36 ], [ -37.76, 83.53 ], [ -36.95, 83.6 ], [ -35.16, 83.61 ], [ -34.66, 83.49 ], [ -33.86, 83.66 ], [ -29.18, 83.59 ], [ -29.03, 83.48 ], [ -26.75, 83.52 ], [ -25.45, 83.39 ], [ -26.86, 83.22 ], [ -30.96, 83.21 ], [ -32.5, 83.08 ], [ -34.04, 83.18 ], [ -33.01, 83.06 ], [ -36.08, 82.91 ], [ -35.89, 82.73 ], [ -35.38, 82.91 ], [ -32.03, 82.94 ], [ -30.61, 83.16 ], [ -26.59, 83.12 ], [ -24.75, 83.25 ], [ -24.12, 83.05 ], [ -25.4, 82.81 ], [ -23.12, 82.98 ], [ -22.96, 82.81 ], [ -22.4, 82.91 ], [ -21.19, 82.83 ], [ -19.87, 82.56 ], [ -21.42, 82.31 ], [ -24.48, 82.15 ], [ -31.38, 82.19 ], [ -29.9, 82.09 ], [ -32.71, 81.83 ], [ -32.62, 81.63 ], [ -28.6, 82 ], [ -24.56, 82 ], [ -24.73, 81.76 ], [ -27.61, 81.49 ], [ -27.69, 81.39 ], [ -26.72, 81.4 ], [ -23.37, 81.71 ], [ -23.2, 82 ], [ -21.28, 82.05 ], [ -21.32, 81.46 ], [ -23.94, 80.58 ], [ -23.06, 80.58 ], [ -22.87, 80.9 ], [ -19.47, 81.56 ], [ -19.89, 81.68 ], [ -18.9, 81.6 ], [ -19.35, 81.37 ], [ -18.45, 81.49 ], [ -17.37, 81.36 ], [ -15.68, 81.85 ], [ -12.61, 81.65 ], [ -11.52, 81.32 ], [ -13.41, 80.97 ], [ -14.53, 80.95 ], [ -14.13, 80.77 ], [ -15.46, 80.62 ], [ -17.24, 80.73 ], [ -18.15, 80.55 ], [ -19.49, 80.65 ], [ -20.76, 80.56 ], [ -15.68, 80.42 ], [ -16.79, 80.17 ], [ -19.4, 80.26 ], [ -20.48, 80.11 ], [ -20.57, 79.72 ], [ -18.94, 80.06 ], [ -17.18, 80 ], [ -17.99, 79.7 ], [ -19.31, 79.7 ], [ -19.87, 79.12 ], [ -19.49, 79.29 ], [ -18.98, 79.25 ], [ -19.17, 79.11 ], [ -19.18, 79.24 ], [ -21.23, 78.75 ], [ -20.87, 78.57 ], [ -21.97, 77.55 ], [ -21.12, 77.6 ], [ -20.78, 77.97 ], [ -19.21, 77.72 ], [ -19.21, 77.52 ], [ -20.65, 77.69 ], [ -20.16, 77.5 ], [ -21.06, 77.5 ], [ -19.46, 77.2 ], [ -18.35, 77.26 ], [ -18.19, 76.9 ], [ -18.55, 76.7 ], [ -19.86, 76.92 ], [ -21.47, 76.95 ], [ -20.54, 76.89 ], [ -21.67, 76.88 ], [ -20.76, 76.81 ], [ -21.66, 76.63 ], [ -22.38, 76.82 ], [ -22.41, 76.54 ], [ -22.07, 76.64 ], [ -21.68, 76.48 ], [ -22.55, 76.46 ], [ -21.63, 76.43 ], [ -21.85, 76.22 ], [ -21.35, 76.29 ], [ -20.44, 76.13 ], [ -21.12, 76.29 ], [ -19.89, 76.25 ], [ -19.75, 76.11 ], [ -20.4, 75.98 ], [ -21.94, 75.99 ], [ -19.77, 75.89 ], [ -19.36, 75.3 ], [ -19.88, 75.14 ], [ -20.13, 75.33 ], [ -20.66, 75.29 ], [ -22.2, 75.67 ], [ -21.4, 75.45 ], [ -22.45, 75.51 ], [ -21.43, 75.44 ], [ -20.5, 75.14 ], [ -21.76, 74.98 ], [ -22.48, 75.17 ], [ -21.76, 74.95 ], [ -20.63, 75.05 ], [ -21, 74.64 ], [ -19.8, 74.58 ], [ -19.42, 74.68 ], [ -18.97, 74.48 ], [ -19.64, 74.24 ], [ -20.41, 74.45 ], [ -21.66, 74.45 ], [ -22.11, 74.6 ], [ -21.79, 74.41 ], [ -22.43, 74.31 ], [ -22.08, 74.22 ], [ -22.55, 74.06 ], [ -21.98, 73.98 ], [ -21.84, 73.65 ], [ -21.73, 74.06 ], [ -20.29, 73.89 ], [ -20.54, 73.45 ], [ -21.56, 73.49 ], [ -22.45, 73.26 ], [ -24.09, 73.68 ], [ -22.78, 73.54 ], [ -22.31, 73.63 ], [ -22.8, 73.56 ], [ -24.08, 73.84 ], [ -24.47, 73.54 ], [ -25.81, 73.96 ], [ -24.69, 73.51 ], [ -26.02, 73.24 ], [ -27.31, 73.51 ], [ -26.35, 73.24 ], [ -27.72, 73.14 ], [ -27.46, 72.92 ], [ -27.26, 73.12 ], [ -26.41, 73.19 ], [ -25.06, 73.05 ], [ -26.2, 72.78 ], [ -27.44, 72.84 ], [ -26.42, 72.78 ], [ -27.17, 72.68 ], [ -26.34, 72.74 ], [ -26.44, 72.57 ], [ -25.56, 72.83 ], [ -24.72, 72.68 ], [ -24.87, 72.47 ], [ -26.33, 72.39 ], [ -25.25, 72.39 ], [ -25.59, 72.01 ], [ -25.22, 72.35 ], [ -24.62, 72.43 ], [ -23.71, 72.21 ], [ -23.84, 72.12 ], [ -22.54, 71.92 ], [ -23.12, 71.62 ], [ -22.45, 71.79 ], [ -22.64, 71.56 ], [ -21.91, 71.73 ], [ -22.57, 71.46 ], [ -22.43, 71.24 ], [ -22.1, 71.5 ], [ -21.67, 71.4 ], [ -21.71, 71.12 ], [ -22.27, 71.06 ], [ -21.69, 71.08 ], [ -22.01, 70.97 ], [ -21.61, 70.95 ], [ -21.94, 70.82 ], [ -21.54, 70.73 ], [ -21.65, 70.44 ], [ -22.39, 70.46 ], [ -22.5, 70.87 ], [ -22.64, 70.44 ], [ -23.67, 70.53 ], [ -24.63, 71.35 ], [ -25.12, 71.29 ], [ -25.62, 71.53 ], [ -26.44, 71.63 ], [ -26.88, 71.54 ], [ -28.65, 72.1 ], [ -28.53, 71.89 ], [ -27.38, 71.68 ], [ -28.48, 71.52 ], [ -25.85, 71.48 ], [ -25.41, 71.27 ], [ -26.72, 70.92 ], [ -27.51, 70.92 ], [ -27.93, 71.12 ], [ -27.6, 70.92 ], [ -28.38, 70.94 ], [ -27.87, 70.86 ], [ -28.11, 70.61 ], [ -29.14, 70.4 ], [ -26.49, 70.46 ], [ -26.54, 70.3 ], [ -28.47, 70.1 ], [ -27.34, 69.96 ], [ -26.86, 70.25 ], [ -26.27, 70.2 ], [ -25.29, 70.41 ], [ -25.29, 70.27 ], [ -25.04, 70.37 ], [ -23.87, 70.13 ], [ -22.12, 70.08 ], [ -23.06, 69.94 ], [ -22.98, 69.76 ], [ -23.39, 69.86 ], [ -23.28, 69.65 ], [ -23.86, 69.75 ], [ -23.54, 69.63 ], [ -23.78, 69.52 ], [ -24.31, 69.6 ], [ -24.07, 69.41 ], [ -24.82, 69.47 ], [ -24.6, 69.25 ], [ -25.39, 69.24 ], [ -24.99, 69.16 ], [ -25.35, 69 ], [ -25.63, 69.11 ], [ -25.73, 68.87 ], [ -27.26, 68.56 ], [ -27.51, 68.63 ], [ -27.65, 68.49 ], [ -27.99, 68.61 ], [ -28.04, 68.47 ], [ -28.4, 68.53 ], [ -28.25, 68.44 ], [ -28.87, 68.34 ], [ -29.25, 68.44 ], [ -29.11, 68.31 ], [ -29.43, 68.23 ], [ -29.98, 68.43 ], [ -29.99, 68.27 ], [ -30.31, 68.27 ], [ -30.04, 68.14 ], [ -30.77, 68.3 ], [ -30.46, 68.09 ], [ -31.01, 68.21 ], [ -31.09, 68.06 ], [ -31.7, 68.1 ], [ -31.53, 68.27 ], [ -32.05, 68.28 ], [ -32.47, 68.63 ], [ -32.82, 68.56 ], [ -32.25, 68.36 ], [ -32.11, 68.19 ], [ -32.46, 68.22 ], [ -31.99, 68.14 ], [ -32.04, 67.93 ], [ -33.24, 67.69 ], [ -33.31, 67.4 ], [ -33.64, 67.37 ], [ -33.37, 67.25 ], [ -33.75, 67.22 ], [ -33.56, 67.09 ], [ -34.1, 67.01 ], [ -33.94, 66.76 ], [ -34.13, 66.81 ], [ -34.33, 66.57 ], [ -34.46, 66.73 ], [ -34.76, 66.33 ], [ -35.15, 66.41 ], [ -35.22, 66.25 ], [ -35.89, 66.45 ], [ -35.59, 66.12 ], [ -35.78, 66.21 ], [ -36.01, 66.1 ], [ -35.73, 66.08 ], [ -36.34, 65.9 ], [ -36.33, 66.08 ], [ -36.64, 66.1 ], [ -36.48, 66 ], [ -36.96, 65.86 ], [ -37.25, 66.11 ], [ -37.19, 65.75 ], [ -37.67, 65.94 ], [ -37.78, 65.89 ], [ -37.77, 66.05 ], [ -36.82, 66.4 ], [ -37.57, 66.31 ], [ -37.84, 66.42 ], [ -37.97, 65.91 ], [ -38.35, 65.93 ], [ -38.04, 65.79 ], [ -38.19, 65.63 ], [ -38.68, 65.7 ], [ -38.52, 65.57 ], [ -38.88, 65.52 ], [ -39.27, 65.74 ], [ -39.26, 65.53 ], [ -39.56, 65.67 ], [ -39.71, 65.5 ], [ -39.94, 65.57 ], [ -39.68, 65.24 ], [ -40.21, 64.99 ], [ -40.65, 65.19 ], [ -40.68, 65.03 ], [ -41.14, 65.14 ], [ -41.17, 64.94 ], [ -40.34, 64.35 ], [ -41.56, 64.27 ], [ -41, 64.07 ], [ -40.59, 64.11 ], [ -40.84, 63.94 ], [ -40.51, 63.69 ], [ -41.51, 63.87 ], [ -41.69, 63.76 ], [ -40.88, 63.65 ], [ -40.75, 63.5 ], [ -41.03, 63.56 ], [ -41.08, 63.43 ], [ -41.3, 63.56 ], [ -41.03, 63.33 ], [ -41.52, 63.53 ], [ -41.13, 63.3 ], [ -41.74, 63.56 ], [ -41.93, 63.47 ], [ -41.44, 63.1 ], [ -42.11, 63.26 ], [ -41.54, 63.03 ], [ -42.14, 63.21 ], [ -42.24, 63.1 ], [ -41.64, 62.9 ], [ -42.05, 62.77 ], [ -42.45, 62.91 ], [ -42.64, 62.67 ], [ -42.71, 62.78 ], [ -42.69, 62.67 ], [ -43.15, 62.74 ], [ -42.14, 62.38 ], [ -43, 62.49 ], [ -42.26, 62.29 ], [ -42.52, 61.94 ], [ -42.11, 62 ], [ -42.44, 61.9 ], [ -42.19, 61.86 ], [ -42.35, 61.75 ], [ -42.87, 61.77 ], [ -42.24, 61.71 ], [ -42.43, 61.55 ], [ -43.06, 61.59 ], [ -42.4, 61.39 ], [ -42.65, 61.28 ], [ -43.23, 61.33 ], [ -42.65, 61.25 ], [ -43.17, 61.2 ], [ -42.63, 61.09 ], [ -43.65, 61.12 ], [ -42.7, 61.06 ], [ -42.95, 60.88 ], [ -43.48, 60.91 ], [ -42.79, 60.79 ], [ -43.57, 60.83 ], [ -42.79, 60.75 ], [ -43.29, 60.67 ], [ -42.77, 60.69 ], [ -43.15, 60.59 ], [ -42.83, 60.57 ], [ -43.32, 60.55 ], [ -43.22, 60.45 ], [ -43.75, 60.73 ], [ -43.63, 60.53 ], [ -44.2, 60.63 ], [ -43.82, 60.44 ], [ -43.31, 60.44 ], [ -43.58, 60.31 ], [ -43.1, 60.31 ], [ -43.32, 60.21 ], [ -43.12, 60.07 ], [ -43.62, 60.18 ], [ -43.64, 60.14 ], [ -44.07, 60.18 ], [ -44.13, 60.18 ], [ -44.16, 60.15 ], [ -44.14, 60.23 ], [ -43.9, 60.32 ], [ -44.12, 60.4 ], [ -44.59, 59.98 ], [ -44.75, 60.12 ], [ -44.81, 59.99 ], [ -44.89, 60.15 ], [ -45.16, 60.07 ], [ -45.08, 60.16 ], [ -44.76, 60.19 ], [ -44.47, 60.56 ], [ -45.22, 60.13 ], [ -44.49, 60.78 ], [ -45.2, 60.42 ], [ -45.08, 60.65 ], [ -45.51, 60.47 ], [ -45.22, 60.76 ], [ -45.57, 60.46 ], [ -45.62, 60.64 ], [ -45.9, 60.51 ], [ -45.57, 60.7 ], [ -45.86, 60.69 ], [ -45.24, 60.91 ], [ -45.41, 61 ], [ -45.7, 60.76 ], [ -46.23, 60.74 ], [ -45.25, 61.1 ], [ -45.51, 61.25 ], [ -45.61, 61 ], [ -46.06, 60.9 ], [ -45.61, 61.13 ], [ -45.87, 61.21 ], [ -45.71, 61.31 ], [ -46.1, 61.24 ], [ -45.82, 61.12 ], [ -46.29, 61.08 ], [ -46.2, 60.97 ], [ -46.76, 61.03 ], [ -46.57, 60.89 ], [ -47.53, 60.98 ], [ -47.49, 60.89 ], [ -47.87, 60.86 ], [ -47.32, 60.88 ], [ -47.45, 60.81 ], [ -47.97, 60.83 ], [ -47.89, 60.88 ], [ -48, 60.86 ], [ -47.98, 60.9 ], [ -48.24, 60.8 ], [ -48.19, 60.86 ], [ -47.61, 61.02 ], [ -47.93, 60.98 ], [ -47.84, 61.13 ], [ -48.2, 61.16 ], [ -47.86, 61.31 ], [ -48.49, 61.17 ], [ -48.31, 61.37 ], [ -48.98, 61.35 ], [ -48.17, 61.52 ], [ -49.01, 61.45 ], [ -48.86, 61.54 ], [ -49.29, 61.55 ], [ -48.57, 61.63 ], [ -49.07, 61.61 ], [ -48.86, 61.78 ], [ -49.27, 61.71 ], [ -49.2, 61.91 ], [ -49.43, 61.81 ], [ -48.84, 62.07 ], [ -49.08, 62.06 ], [ -49.03, 62.2 ], [ -49.16, 62 ], [ -49.63, 61.97 ], [ -49.45, 62.07 ], [ -49.71, 62.11 ], [ -49.32, 62.07 ], [ -49.27, 62.17 ], [ -49.7, 62.15 ], [ -49.27, 62.27 ], [ -49.85, 62.25 ], [ -49.61, 62.45 ], [ -49.99, 62.44 ], [ -49.98, 62.33 ], [ -50.26, 62.48 ], [ -49.87, 62.84 ], [ -50.26, 62.69 ], [ -50.24, 62.84 ], [ -49.69, 63.04 ], [ -50.16, 62.95 ], [ -50.39, 62.78 ], [ -50.15, 63 ], [ -50.59, 62.95 ], [ -50.63, 63.08 ], [ -50, 63.22 ], [ -50.9, 63.12 ], [ -50.77, 63.25 ], [ -51.02, 63.14 ], [ -51.1, 63.33 ], [ -50.15, 63.38 ], [ -51.24, 63.44 ], [ -50.86, 63.51 ], [ -51.11, 63.52 ], [ -51.15, 63.62 ], [ -50.49, 63.65 ], [ -51.08, 63.66 ], [ -51.21, 63.6 ], [ -51.16, 63.49 ], [ -51.58, 63.7 ], [ -50.91, 63.92 ], [ -51.45, 63.8 ], [ -51.61, 64.03 ], [ -50.1, 64.19 ], [ -50.58, 64.19 ], [ -50.39, 64.35 ], [ -51.05, 64.13 ], [ -51.75, 64.17 ], [ -50.96, 64.22 ], [ -50.72, 64.44 ], [ -50.21, 64.43 ], [ -50.89, 64.62 ], [ -50.32, 64.66 ], [ -49.6, 64.31 ], [ -50.25, 64.7 ], [ -49.99, 64.83 ], [ -50.57, 64.74 ], [ -50.85, 65.11 ], [ -50.64, 65.19 ], [ -51, 65.21 ], [ -50.65, 64.73 ], [ -51.17, 64.61 ], [ -51.2, 64.76 ], [ -52.08, 64.16 ], [ -52.13, 64.72 ], [ -51.24, 65.01 ], [ -51.69, 64.87 ], [ -51.72, 65.01 ], [ -51.7, 64.86 ], [ -52.08, 64.78 ], [ -52.05, 64.92 ], [ -52.2, 64.8 ], [ -51.97, 65.31 ], [ -52.29, 65.2 ] ], [ [ -56.25, 73.84 ], [ -56.74, 73.88 ], [ -55.94, 73.81 ], [ -56.25, 73.84 ] ] ], [ [ [ -72.02, 71.04 ], [ -71.39, 71.02 ], [ -71.42, 70.92 ], [ -72.13, 70.82 ], [ -72.02, 71.04 ] ] ], [ [ [ -53.11, 66.86 ], [ -53.5, 66.8 ], [ -52.86, 66.9 ], [ -53.11, 66.86 ] ] ], [ [ [ 59.29, 69.22 ], [ 59.25, 69.13 ], [ 58.73, 69.39 ], [ 59.29, 69.22 ] ] ], [ [ [ 98.6, -1.2 ], [ 98.68, -.96 ], [ 98.91, -.91 ], [ 99.29, -1.75 ], [ 99.22, -1.63 ], [ 99.24, -1.8 ], [ 98.88, -1.68 ], [ 98.6, -1.2 ] ] ], [ [ [ -73.17, 21.16 ], [ -73.01, 21.33 ], [ -73.16, 20.96 ], [ -73.67, 20.93 ], [ -73.52, 21.19 ], [ -73.17, 21.16 ] ] ], [ [ [ -114.04, 76.7 ], [ -114.84, 76.76 ], [ -114.66, 76.86 ], [ -113.46, 76.83 ], [ -114.04, 76.7 ] ] ], [ [ [ -96.65, 73.14 ], [ -96.93, 72.93 ], [ -97.09, 73.12 ], [ -96.65, 73.14 ] ] ], [ [ [ -96.69, 69.58 ], [ -96.15, 69.59 ], [ -96.11, 69.35 ], [ -96.69, 69.58 ] ] ], [ [ [ -59.54, 13.23 ], [ -59.42, 13.15 ], [ -59.53, 13.04 ], [ -59.64, 13.33 ], [ -59.54, 13.23 ] ] ], [ [ [ -95.61, 69.61 ], [ -95.49, 69.32 ], [ -95.78, 69.59 ], [ -95.98, 69.37 ], [ -95.9, 69.6 ], [ -95.61, 69.61 ] ] ], [ [ [ -85.87, 79.06 ], [ -85.17, 79.01 ], [ -86.48, 78.9 ], [ -85.87, 79.06 ] ] ], [ [ [ -98.65, 69.29 ], [ -98.35, 69.31 ], [ -98.53, 69.59 ], [ -97.98, 69.44 ], [ -98.34, 69.61 ], [ -97.92, 69.9 ], [ -97.38, 69.58 ], [ -97.26, 69.71 ], [ -96.26, 69.35 ], [ -96.14, 69.02 ], [ -96.01, 69.24 ], [ -95.83, 68.88 ], [ -95.16, 68.87 ], [ -96.26, 68.47 ], [ -97.44, 68.55 ], [ -98.25, 68.84 ], [ -98.71, 68.8 ], [ -98.85, 68.95 ], [ -99.17, 68.83 ], [ -99.42, 68.9 ], [ -99.47, 69.12 ], [ -98.65, 69.29 ] ] ], [ [ [ -105.6, 77.73 ], [ -104.44, 77.32 ], [ -104.63, 77.11 ], [ -105.43, 77.21 ], [ -106.12, 77.73 ], [ -105.6, 77.73 ] ] ], [ [ [ 124.06, 10.05 ], [ 124.37, 10.15 ], [ 124.56, 10.02 ], [ 124.59, 9.76 ], [ 124.26, 9.6 ], [ 123.87, 9.63 ], [ 123.8, 9.84 ], [ 124.06, 10.05 ] ] ], [ [ [ 70.97, 73.25 ], [ 71.44, 73.32 ], [ 71.68, 73.15 ], [ 69.96, 73.01 ], [ 70.54, 73.45 ], [ 71.26, 73.41 ], [ 70.97, 73.25 ] ] ], [ [ [ 70.79, 66.76 ], [ 71.4, 66.87 ], [ 71.54, 66.77 ], [ 70.79, 66.76 ] ] ], [ [ [ 69.9, 66.68 ], [ 70.04, 66.6 ], [ 69.59, 66.76 ], [ 69.9, 66.68 ] ] ], [ [ [ -110.23, 77.52 ], [ -112.43, 77.37 ], [ -113.2, 77.53 ], [ -113.22, 77.92 ], [ -109.65, 78.1 ], [ -109.72, 77.95 ], [ -110.92, 77.86 ], [ -110.05, 77.77 ], [ -110.23, 77.52 ] ] ], [ [ [ -114.25, 78.02 ], [ -113.55, 77.83 ], [ -114.22, 77.71 ], [ -115.1, 77.96 ], [ -114.25, 78.02 ] ] ], [ [ [ 156.51, -7.67 ], [ 156.6, -7.56 ], [ 156.78, -7.72 ], [ 156.71, -7.96 ], [ 156.51, -7.67 ] ] ], [ [ [ 150.69, -9.43 ], [ 150.93, -9.68 ], [ 150.44, -9.63 ], [ 150.44, -9.35 ], [ 150.69, -9.43 ] ] ], [ [ [ 151.06, -8.75 ], [ 151.13, -8.59 ], [ 151, -8.51 ], [ 151.12, -8.4 ], [ 151.11, -8.5 ], [ 151.15, -8.57 ], [ 151.1, -8.75 ], [ 151.13, -8.8 ], [ 151.06, -8.75 ] ] ], [ [ [ 150.76, -9.77 ], [ 151.11, -10.04 ], [ 151.27, -9.92 ], [ 151.22, -10.19 ], [ 150.96, -10.11 ], [ 150.76, -9.77 ] ] ], [ [ [ 152.75, -10.63 ], [ 152.88, -10.67 ], [ 152.52, -10.62 ], [ 152.75, -10.63 ] ] ], [ [ [ 153.49, -11.46 ], [ 153.78, -11.61 ], [ 153.55, -11.65 ], [ 153.17, -11.35 ], [ 153.49, -11.46 ] ] ], [ [ [ 160.37, -11.72 ], [ 159.95, -11.5 ], [ 160.65, -11.84 ], [ 160.37, -11.72 ] ] ], [ [ [ -119.21, 77.31 ], [ -116.99, 77.3 ], [ -116.89, 77.54 ], [ -116.02, 77.5 ], [ -115.34, 77.31 ], [ -116.4, 77.15 ], [ -115.73, 76.95 ], [ -116.37, 76.94 ], [ -116.05, 76.62 ], [ -116.96, 76.57 ], [ -117.47, 76.27 ], [ -118.05, 76.42 ], [ -117.68, 76.8 ], [ -118.29, 76.78 ], [ -119.04, 76.09 ], [ -119.73, 76.33 ], [ -119.46, 76.01 ], [ -119.91, 75.85 ], [ -120.47, 75.83 ], [ -120.86, 76.21 ], [ -120.92, 75.95 ], [ -121.85, 76.05 ], [ -122.54, 75.94 ], [ -122.49, 76.15 ], [ -122.98, 76.2 ], [ -122.39, 76.41 ], [ -121.45, 76.43 ], [ -119.21, 77.31 ] ] ], [ [ [ -99.3, 79.76 ], [ -100.16, 79.9 ], [ -99.64, 80.15 ], [ -98.7, 79.97 ], [ -98.83, 79.67 ], [ -99.3, 79.76 ] ] ], [ [ [ -101.24, 78.97 ], [ -101.2, 78.8 ], [ -100.36, 78.84 ], [ -99.48, 78.59 ], [ -99.79, 78.3 ], [ -98.91, 78.06 ], [ -99.87, 77.78 ], [ -101.03, 78.2 ], [ -102.57, 78.24 ], [ -102.78, 78.4 ], [ -104.04, 78.24 ], [ -104.7, 78.33 ], [ -104.89, 78.56 ], [ -103.54, 78.5 ], [ -103.39, 78.62 ], [ -104.01, 78.63 ], [ -103.3, 78.74 ], [ -104.21, 78.78 ], [ -104.12, 78.98 ], [ -104.98, 78.8 ], [ -104.68, 79.03 ], [ -105.6, 79.03 ], [ -105.55, 79.33 ], [ -103.11, 79.29 ], [ -102.57, 78.87 ], [ -101.96, 79.09 ], [ -101.24, 78.97 ] ] ], [ [ [ -111.84, 78.56 ], [ -110.4, 78.77 ], [ -109.32, 78.55 ], [ -109.38, 78.32 ], [ -111.16, 78.39 ], [ -111.45, 78.27 ], [ -112.16, 78.37 ], [ -113.19, 78.27 ], [ -113.22, 78.41 ], [ -111.84, 78.56 ] ] ], [ [ [ -54.29, 70.32 ], [ -53.3, 70.21 ], [ -51.85, 69.65 ], [ -53.55, 69.23 ], [ -54.27, 69.43 ], [ -53.37, 69.44 ], [ -53.34, 69.59 ], [ -53.78, 69.45 ], [ -53.75, 69.63 ], [ -54.52, 69.56 ], [ -54.98, 69.71 ], [ -54.35, 69.67 ], [ -54.92, 69.83 ], [ -54.76, 69.96 ], [ -54.25, 69.91 ], [ -54.84, 70.18 ], [ -54.29, 70.32 ] ] ], [ [ [ -51, 69.9 ], [ -50.68, 69.85 ], [ -51.15, 69.51 ], [ -51.39, 69.72 ], [ -51.01, 69.89 ], [ -51.38, 69.85 ], [ -51, 69.9 ] ] ], [ [ [ -51.74, 70.73 ], [ -51.43, 70.65 ], [ -51.92, 70.66 ], [ -51.74, 70.73 ] ] ], [ [ [ -52.01, 70.98 ], [ -51.57, 70.88 ], [ -52.16, 70.89 ], [ -52.01, 70.98 ] ] ], [ [ [ -52.62, 71.19 ], [ -53.1, 71.2 ], [ -53.1, 71.36 ], [ -52.4, 71.35 ], [ -52.62, 71.19 ] ] ], [ [ [ -53.65, 71.31 ], [ -53.59, 71.03 ], [ -54, 71.12 ], [ -53.65, 71.31 ] ] ], [ [ [ -53.09, 71.57 ], [ -53.45, 71.67 ], [ -52.74, 71.67 ], [ -53.09, 71.57 ] ] ], [ [ [ -55.05, 72.82 ], [ -55.34, 72.59 ], [ -55.83, 72.61 ], [ -55.05, 72.82 ] ] ], [ [ [ -55.51, 72.16 ], [ -55.57, 72.31 ], [ -55, 72.39 ], [ -55.51, 72.16 ] ] ], [ [ [ 74.34, 73.11 ], [ 74.76, 73.08 ], [ 74.65, 72.83 ], [ 74.11, 72.99 ], [ 74.34, 73.11 ] ] ], [ [ [ 77.87, 72.33 ], [ 76.87, 72.3 ], [ 77.62, 72.6 ], [ 78.34, 72.5 ], [ 77.87, 72.33 ] ] ], [ [ [ 79.5, 72.93 ], [ 79.54, 72.72 ], [ 78.62, 72.8 ], [ 79.17, 73.08 ], [ 79.5, 72.93 ] ] ], [ [ [ 147.09, -5.21 ], [ 147.22, -5.35 ], [ 147.13, -5.44 ], [ 147, -5.35 ], [ 147.09, -5.21 ] ] ], [ [ [ 159.56, -8.5 ], [ 159.52, -8.43 ], [ 159.59, -8.38 ], [ 159.7, -8.52 ], [ 159.56, -8.5 ] ] ], [ [ [ -79.68, 75.89 ], [ -78.81, 76.09 ], [ -78.89, 75.84 ], [ -79.68, 75.89 ] ] ], [ [ [ 134.87, -6.39 ], [ 134.81, -6.46 ], [ 134.85, -6.28 ], [ 134.87, -6.39 ] ] ], [ [ [ 134.67, -6.67 ], [ 134.76, -6.62 ], [ 134.67, -6.78 ], [ 134.67, -6.67 ] ] ], [ [ [ 69.34, -49.03 ], [ 69.21, -49.12 ], [ 69.35, -48.88 ], [ 69.34, -49.03 ] ] ], [ [ [ 69.11, -48.8 ], [ 69.05, -49.12 ], [ 69.1, -48.99 ], [ 69.22, -49.13 ], [ 69.63, -48.97 ], [ 69.66, -49.12 ], [ 69.33, -49.11 ], [ 69.22, -49.21 ], [ 69.43, -49.13 ], [ 69.54, -49.24 ], [ 69.4, -49.28 ], [ 70.52, -49.1 ], [ 70.54, -49.3 ], [ 70.3, -49.39 ], [ 70.44, -49.44 ], [ 69.61, -49.39 ], [ 69.94, -49.6 ], [ 70.3, -49.55 ], [ 70.24, -49.69 ], [ 69.86, -49.71 ], [ 69.67, -49.48 ], [ 69.68, -49.66 ], [ 69.43, -49.64 ], [ 69.29, -49.47 ], [ 69.31, -49.58 ], [ 69.11, -49.47 ], [ 69.08, -49.69 ], [ 68.77, -49.73 ], [ 68.92, -49.42 ], [ 68.78, -48.85 ], [ 68.95, -48.67 ], [ 69.12, -48.73 ], [ 68.89, -48.9 ], [ 69.11, -48.8 ] ] ], [ [ [ 160.46, -9.49 ], [ 160.83, -9.87 ], [ 160.63, -9.95 ], [ 159.82, -9.8 ], [ 159.58, -9.37 ], [ 159.71, -9.25 ], [ 159.91, -9.43 ], [ 160.46, -9.49 ] ] ], [ [ [ 161.42, -10.36 ], [ 161.27, -10.33 ], [ 161.28, -10.21 ], [ 162.09, -10.47 ], [ 162.22, -10.81 ], [ 162.38, -10.84 ], [ 161.76, -10.74 ], [ 161.42, -10.36 ] ] ], [ [ [ 147, -1.97 ], [ 147.44, -2.04 ], [ 147.19, -2.2 ], [ 146.51, -2.21 ], [ 146.57, -1.99 ], [ 147, -1.97 ] ] ], [ [ [ 154.62, -5.46 ], [ 154.52, -5.13 ], [ 154.62, -5 ], [ 154.62, -5.46 ] ] ], [ [ [ 156.09, -6.8 ], [ 156.15, -6.93 ], [ 156.03, -6.99 ], [ 156.09, -6.8 ] ] ], [ [ [ 155.68, -7.06 ], [ 155.73, -6.96 ], [ 155.87, -7.05 ], [ 155.68, -7.06 ] ] ], [ [ [ -86.96, 20.5 ], [ -86.72, 20.59 ], [ -86.99, 20.27 ], [ -86.96, 20.5 ] ] ], [ [ [ 122.32, 18.37 ], [ 122.14, 17.78 ], [ 122.25, 17.37 ], [ 122.52, 17.13 ], [ 122.46, 16.89 ], [ 122.07, 16.09 ], [ 121.99, 16.03 ], [ 122.14, 16.26 ], [ 121.56, 15.9 ], [ 121.64, 15.71 ], [ 121.38, 15.3 ], [ 121.73, 14.7 ], [ 121.6, 14.65 ], [ 121.73, 14.17 ], [ 121.91, 14.01 ], [ 122.23, 13.9 ], [ 122.25, 14.24 ], [ 122.33, 14.11 ], [ 122.42, 14.31 ], [ 122.71, 14.34 ], [ 123.04, 14.1 ], [ 123.12, 13.73 ], [ 123.33, 13.79 ], [ 123.23, 14 ], [ 123.34, 14.11 ], [ 123.42, 13.89 ], [ 123.71, 13.94 ], [ 123.94, 13.8 ], [ 123.97, 13.71 ], [ 123.56, 13.74 ], [ 123.53, 13.57 ], [ 123.87, 13.24 ], [ 123.76, 13.06 ], [ 124.19, 13.06 ], [ 124.08, 12.54 ], [ 123.83, 12.83 ], [ 124.03, 12.96 ], [ 123.74, 12.85 ], [ 123.72, 12.95 ], [ 123.32, 13.01 ], [ 123.2, 13.43 ], [ 122.54, 13.96 ], [ 122.42, 13.95 ], [ 122.67, 13.39 ], [ 122.6, 13.16 ], [ 122.4, 13.52 ], [ 121.75, 13.97 ], [ 121.29, 13.6 ], [ 121.04, 13.63 ], [ 121, 13.78 ], [ 120.89, 13.68 ], [ 120.91, 13.87 ], [ 120.79, 13.93 ], [ 120.65, 13.77 ], [ 120.59, 14.23 ], [ 120.98, 14.48 ], [ 120.95, 14.65 ], [ 120.57, 14.84 ], [ 120.61, 14.48 ], [ 120.48, 14.41 ], [ 120.27, 14.85 ], [ 120.08, 14.79 ], [ 119.75, 16.17 ], [ 119.9, 16.39 ], [ 120.14, 16.04 ], [ 120.42, 16.17 ], [ 120.28, 16.62 ], [ 120.45, 16.98 ], [ 120.35, 17.68 ], [ 120.56, 18.49 ], [ 120.85, 18.65 ], [ 121.91, 18.27 ], [ 122.17, 18.52 ], [ 122.32, 18.37 ] ] ], [ [ [ 124.32, 13.91 ], [ 124.42, 13.66 ], [ 124.19, 13.52 ], [ 124.02, 13.66 ], [ 124.13, 14.06 ], [ 124.32, 13.91 ] ] ], [ [ [ 89.49, 22.5 ], [ 89.62, 22.35 ], [ 89.58, 22.24 ], [ 89.5, 22.37 ], [ 89.53, 21.99 ], [ 89.49, 22.5 ] ] ], [ [ [ 89.46, 21.82 ], [ 89.38, 21.73 ], [ 89.38, 21.93 ], [ 89.46, 21.82 ] ] ], [ [ [ -43.77, -23.06 ], [ -44.01, -23.08 ], [ -43.91, -23.02 ], [ -43.81, -23.06 ], [ -43.61, -23.03 ], [ -43.57, -23.06 ], [ -43.77, -23.06 ] ] ], [ [ [ 144.77, 13.39 ], [ 144.68, 13.25 ], [ 144.62, 13.45 ], [ 144.87, 13.65 ], [ 144.95, 13.58 ], [ 144.77, 13.39 ] ] ], [ [ [ -76.7, 18.27 ], [ -76.34, 18.16 ], [ -76.18, 17.91 ], [ -76.53, 17.85 ], [ -76.84, 17.99 ], [ -76.95, 17.84 ], [ -77.13, 17.89 ], [ -77.18, 17.71 ], [ -77.41, 17.86 ], [ -77.74, 17.85 ], [ -78.05, 18.2 ], [ -78.37, 18.27 ], [ -78.21, 18.46 ], [ -77.83, 18.53 ], [ -76.9, 18.41 ], [ -76.7, 18.27 ] ] ], [ [ [ -44.58, -2.91 ], [ -44.48, -2.73 ], [ -44.59, -3.03 ], [ -44.58, -2.91 ] ] ], [ [ [ 147.96, -39.76 ], [ 148.29, -39.97 ], [ 148.31, -40.22 ], [ 148.05, -40.25 ], [ 147.76, -39.89 ], [ 147.96, -39.76 ] ] ], [ [ [ -82.62, 21.76 ], [ -82.55, 21.56 ], [ -82.84, 21.44 ], [ -83.19, 21.63 ], [ -82.96, 21.58 ], [ -83.09, 21.78 ], [ -82.98, 21.94 ], [ -82.62, 21.76 ] ] ], [ [ [ -5.16, 55.44 ], [ -5.36, 55.51 ], [ -5.28, 55.72 ], [ -5.16, 55.44 ] ] ], [ [ [ -118.47, 32.83 ], [ -118.61, 33.03 ], [ -118.35, 32.82 ], [ -118.47, 32.83 ] ] ], [ [ [ 32.33, 34.91 ], [ 32.28, 35.1 ], [ 32.85, 35.15 ], [ 32.92, 35.4 ], [ 33.65, 35.36 ], [ 34.59, 35.7 ], [ 33.91, 35.26 ], [ 34.09, 34.96 ], [ 33.68, 34.97 ], [ 33.03, 34.56 ], [ 32.49, 34.7 ], [ 32.33, 34.91 ] ] ], [ [ [ 60.46, 69.88 ], [ 60.5, 69.7 ], [ 59.58, 69.71 ], [ 59.68, 69.83 ], [ 58.95, 69.97 ], [ 59.07, 69.86 ], [ 58.61, 70.06 ], [ 58.42, 70.26 ], [ 58.89, 70.18 ], [ 58.52, 70.33 ], [ 59.07, 70.46 ], [ 60.46, 69.88 ] ] ], [ [ [ -62.63, 67.05 ], [ -62.88, 67.06 ], [ -62.38, 67.19 ], [ -62.63, 67.05 ] ] ], [ [ [ -94.09, 72.04 ], [ -95.21, 72 ], [ -94.73, 72.16 ], [ -95.16, 72.13 ], [ -95.85, 73.11 ], [ -95.48, 73.13 ], [ -95.64, 73.74 ], [ -94.75, 73.66 ], [ -95.3, 73.99 ], [ -93.47, 74.18 ], [ -92.6, 74.12 ], [ -92.34, 73.94 ], [ -91.53, 74.03 ], [ -90.29, 73.93 ], [ -92.08, 72.75 ], [ -94.29, 72.78 ], [ -93.75, 72.75 ], [ -93.44, 72.46 ], [ -94.09, 72.04 ] ] ], [ [ [ -170.76, -14.37 ], [ -170.84, -14.32 ], [ -170.56, -14.25 ], [ -170.76, -14.37 ] ] ], [ [ [ 116.06, -8.75 ], [ 116.03, -8.44 ], [ 116.26, -8.25 ], [ 116.72, -8.35 ], [ 116.47, -8.81 ], [ 116.57, -8.89 ], [ 116.01, -8.9 ], [ 115.82, -8.75 ], [ 116.06, -8.75 ] ] ], [ [ [ -82.86, 66.26 ], [ -83.05, 66.2 ], [ -83.25, 66.36 ], [ -82.86, 66.26 ] ] ], [ [ [ 119.77, 11.48 ], [ 119.87, 11.51 ], [ 119.83, 11.38 ], [ 119.77, 11.48 ] ] ], [ [ [ 130.54, -11.82 ], [ 130.02, -11.8 ], [ 130.08, -11.67 ], [ 130.31, -11.73 ], [ 130.15, -11.48 ], [ 130.25, -11.35 ], [ 130.4, -11.42 ], [ 130.34, -11.6 ], [ 130.64, -11.75 ], [ 130.54, -11.82 ] ] ], [ [ [ 104.09, 1.14 ], [ 104.1, .98 ], [ 103.92, 1.02 ], [ 103.92, 1.14 ], [ 104.09, 1.14 ] ] ], [ [ [ -120.05, 34.01 ], [ -120.12, 33.89 ], [ -120.25, 34 ], [ -120.05, 34.01 ] ] ], [ [ [ -61.58, 16.23 ], [ -61.56, 16.05 ], [ -61.71, 15.95 ], [ -61.8, 16.32 ], [ -61.58, 16.23 ] ] ], [ [ [ 167.45, -22.66 ], [ 167.44, -22.54 ], [ 167.56, -22.62 ], [ 167.45, -22.66 ] ] ], [ [ [ 98.46, 12.45 ], [ 98.31, 12.32 ], [ 98.31, 12.69 ], [ 98.46, 12.45 ] ] ], [ [ [ 98.55, 11.75 ], [ 98.52, 11.51 ], [ 98.36, 11.78 ], [ 98.55, 11.75 ] ] ], [ [ [ 98.6, 11.85 ], [ 98.81, 11.84 ], [ 98.69, 11.67 ], [ 98.6, 11.85 ] ] ], [ [ [ 98.51, 11.99 ], [ 98.66, 11.93 ], [ 98.47, 11.88 ], [ 98.44, 12.11 ], [ 98.51, 11.99 ] ] ], [ [ [ 98.26, 10.86 ], [ 98.26, 10.69 ], [ 98.21, 10.89 ], [ 98.08, 10.89 ], [ 98.18, 10.99 ], [ 98.26, 10.86 ] ] ], [ [ [ 98.17, 10.01 ], [ 98.3, 10.03 ], [ 98.13, 9.84 ], [ 98.17, 10.01 ] ] ], [ [ [ 103.5, -.14 ], [ 103.79, -.34 ], [ 103.43, -.52 ], [ 103.39, -.7 ], [ 103.75, -.99 ], [ 104.37, -1.03 ], [ 104.54, -1.77 ], [ 104.46, -1.91 ], [ 104.9, -2.11 ], [ 104.71, -2.37 ], [ 104.9, -2.28 ], [ 105.02, -2.39 ], [ 105.62, -2.39 ], [ 105.81, -2.92 ], [ 106.05, -3 ], [ 106.09, -3.25 ], [ 105.82, -3.59 ], [ 105.96, -3.83 ], [ 105.82, -4.16 ], [ 105.9, -4.94 ], [ 105.72, -5.91 ], [ 105.29, -5.45 ], [ 105.15, -5.81 ], [ 104.56, -5.51 ], [ 104.73, -5.93 ], [ 104.56, -5.93 ], [ 103.91, -5.13 ], [ 102.9, -4.49 ], [ 102.28, -3.96 ], [ 102.22, -3.66 ], [ 101.62, -3.24 ], [ 100.89, -2.32 ], [ 100.86, -1.92 ], [ 100.35, -1.17 ], [ 100.33, -.85 ], [ 99.82, -.3 ], [ 99.74, -.03 ], [ 99.14, .25 ], [ 98.71, 1.56 ], [ 98.8, 1.72 ], [ 97.98, 2.26 ], [ 97.78, 2.24 ], [ 97.59, 2.88 ], [ 97.37, 2.99 ], [ 97, 3.55 ], [ 96.47, 3.77 ], [ 95.41, 4.82 ], [ 95.21, 5.56 ], [ 95.61, 5.63 ], [ 96.39, 5.21 ], [ 97.52, 5.24 ], [ 97.9, 4.89 ], [ 97.98, 4.54 ], [ 98.29, 4.42 ], [ 98.16, 4.15 ], [ 99.76, 3.17 ], [ 99.99, 2.95 ], [ 99.95, 2.7 ], [ 100, 2.57 ], [ 99.97, 2.7 ], [ 100.09, 2.71 ], [ 100.09, 2.48 ], [ 100.22, 2.44 ], [ 100.12, 2.62 ], [ 100.22, 2.7 ], [ 100.43, 2.27 ], [ 100.88, 1.96 ], [ 100.77, 2.27 ], [ 101.04, 2.29 ], [ 101.41, 1.7 ], [ 101.75, 1.66 ], [ 102.15, 1.38 ], [ 102.23, 1 ], [ 102.42, .8 ], [ 102.88, .73 ], [ 103.11, .46 ], [ 103.41, .53 ], [ 103.71, .3 ], [ 103.81, 0 ], [ 103.5, -.14 ] ] ], [ [ [ 127.5, .89 ], [ 127.4, 1.2 ], [ 127.55, 1.71 ], [ 127.95, 2.22 ], [ 128.07, 2.2 ], [ 127.84, 1.85 ], [ 128.01, 1.74 ], [ 128.01, 1.31 ], [ 127.63, .92 ], [ 127.85, .81 ], [ 127.98, 1.09 ], [ 128.2, 1.16 ], [ 128.09, 1.26 ], [ 128.18, 1.38 ], [ 128.72, 1.57 ], [ 128.7, 1.06 ], [ 128.2, .79 ], [ 128.68, .55 ], [ 128.67, .34 ], [ 128.9, .21 ], [ 128.08, .48 ], [ 127.86, .3 ], [ 128.05, -.42 ], [ 128.45, -.91 ], [ 128.02, -.69 ], [ 127.69, -.27 ], [ 127.73, .31 ], [ 127.53, .55 ], [ 127.64, .85 ], [ 127.5, .89 ] ] ], [ [ [ -80.16, -3.41 ], [ -80.22, -3.34 ], [ -80.07, -3.4 ], [ -80.16, -3.41 ] ] ], [ [ [ 126.72, 3.89 ], [ 126.68, 3.81 ], [ 126.61, 4.04 ], [ 126.72, 3.89 ] ] ], [ [ [ 126.85, 4.46 ], [ 126.91, 4.27 ], [ 126.68, 3.99 ], [ 126.79, 4.21 ], [ 126.73, 4.54 ], [ 126.85, 4.46 ] ] ], [ [ [ 123.28, -1.33 ], [ 123.56, -1.28 ], [ 123.46, -1.52 ], [ 123.26, -1.45 ], [ 123.24, -1.65 ], [ 123.11, -1.6 ], [ 123.15, -1.3 ], [ 122.91, -1.6 ], [ 122.79, -1.48 ], [ 122.91, -1.18 ], [ 123.19, -1.15 ], [ 123.28, -1.33 ] ] ], [ [ [ 123.06, -1.83 ], [ 123.15, -1.82 ], [ 123.06, -1.93 ], [ 123.06, -1.83 ] ] ], [ [ [ 155.41, -6.06 ], [ 155.92, -6.51 ], [ 155.92, -6.8 ], [ 155.6, -6.86 ], [ 155.25, -6.63 ], [ 155.21, -6.31 ], [ 154.74, -5.93 ], [ 154.67, -5.43 ], [ 155.07, -5.54 ], [ 155.41, -6.06 ] ] ], [ [ [ 128.28, 2.02 ], [ 128.2, 2.28 ], [ 128.57, 2.64 ], [ 128.69, 2.42 ], [ 128.58, 2.11 ], [ 128.28, 2.02 ] ] ], [ [ [ 134.24, -6.12 ], [ 134.32, -6.2 ], [ 134.28, -6.05 ], [ 134.54, -5.92 ], [ 134.78, -6.09 ], [ 134.73, -6.31 ], [ 134.53, -6.34 ], [ 134.55, -6.54 ], [ 134.17, -6.19 ], [ 134.15, -6.01 ], [ 134.24, -6.12 ] ] ], [ [ [ 134.12, -6.45 ], [ 134.29, -6.66 ], [ 134.11, -6.16 ], [ 134.53, -6.58 ], [ 134.2, -6.94 ], [ 134.05, -6.77 ], [ 134.12, -6.45 ] ] ], [ [ [ 134.6, -5.57 ], [ 134.51, -5.56 ], [ 134.53, -5.51 ], [ 134.5, -5.49 ], [ 134.54, -5.48 ], [ 134.49, -5.49 ], [ 134.5, -5.42 ], [ 134.71, -5.52 ], [ 134.68, -5.57 ], [ 134.6, -5.57 ] ] ], [ [ [ 134.5, -5.53 ], [ 134.5, -5.56 ], [ 134.53, -5.57 ], [ 134.69, -5.58 ], [ 134.76, -5.65 ], [ 134.74, -5.97 ], [ 134.54, -5.92 ], [ 134.3, -6.02 ], [ 134.42, -5.79 ], [ 134.21, -5.71 ], [ 134.5, -5.53 ] ] ], [ [ [ 132.74, -5.66 ], [ 132.82, -5.85 ], [ 132.69, -5.95 ], [ 132.61, -5.59 ], [ 132.74, -5.66 ] ] ], [ [ [ 133.07, -5.63 ], [ 132.84, -6.01 ], [ 133.15, -5.27 ], [ 133.07, -5.63 ] ] ], [ [ [ 125.51, 3.57 ], [ 125.42, 3.73 ], [ 125.66, 3.52 ], [ 125.64, 3.38 ], [ 125.51, 3.57 ] ] ], [ [ [ 98.3, -.02 ], [ 98.41, 0 ], [ 98.56, -.39 ], [ 98.3, -.02 ] ] ], [ [ [ 98.35, -.51 ], [ 98.45, -.25 ], [ 98.51, -.56 ], [ 98.35, -.51 ] ] ], [ [ [ 108.91, -1.66 ], [ 108.79, -1.58 ], [ 108.94, -1.55 ], [ 108.91, -1.66 ] ] ], [ [ [ 109.68, -1.02 ], [ 109.78, -1.15 ], [ 109.38, -1.26 ], [ 109.49, -.97 ], [ 109.68, -1.02 ] ] ], [ [ [ 108.39, 3.79 ], [ 108.16, 3.63 ], [ 108.23, 3.82 ], [ 107.96, 4 ], [ 108.23, 4.23 ], [ 108.39, 3.79 ] ] ], [ [ [ 106.27, 3.18 ], [ 106.28, 3.08 ], [ 106.2, 3.23 ], [ 106.27, 3.18 ] ] ], [ [ [ 105.85, 2.99 ], [ 105.73, 2.82 ], [ 105.69, 3.06 ], [ 105.85, 2.99 ] ] ], [ [ [ 107.63, -2.6 ], [ 107.83, -2.53 ], [ 108.26, -2.74 ], [ 108.21, -3.15 ], [ 107.98, -3.27 ], [ 107.85, -3.06 ], [ 107.61, -3.24 ], [ 107.63, -2.6 ] ] ], [ [ [ 23.15, 58.56 ], [ 23.15, 58.68 ], [ 23.35, 58.65 ], [ 23.39, 58.51 ], [ 23.13, 58.54 ], [ 23.31, 58.43 ], [ 22.3, 58.2 ], [ 22.02, 57.92 ], [ 22.22, 58.14 ], [ 21.83, 58.28 ], [ 22.02, 58.37 ], [ 21.84, 58.5 ], [ 22.11, 58.42 ], [ 22.54, 58.64 ], [ 23.15, 58.56 ] ] ], [ [ [ 22.75, 59.01 ], [ 23.07, 58.84 ], [ 22.64, 58.69 ], [ 22.04, 58.93 ], [ 22.58, 59.09 ], [ 22.75, 59.01 ] ] ], [ [ [ 131.62, -7.13 ], [ 131.75, -7.21 ], [ 131.63, -7.25 ], [ 131.62, -7.65 ], [ 131.29, -8.03 ], [ 131.3, -7.92 ], [ 131.1, -8 ], [ 131.11, -7.7 ], [ 131.27, -7.7 ], [ 131.16, -7.67 ], [ 131.23, -7.49 ], [ 131.62, -7.13 ] ] ], [ [ [ 131.95, -7.16 ], [ 131.95, -7.25 ], [ 131.71, -7.15 ], [ 131.95, -7.16 ] ] ], [ [ [ -44.36, -2.54 ], [ -44.03, -2.41 ], [ -44.31, -2.77 ], [ -44.36, -2.54 ] ] ], [ [ [ 138.81, -8.14 ], [ 138.91, -8.38 ], [ 138.56, -8.35 ], [ 138.81, -8.14 ] ] ], [ [ [ 138.5, -8.32 ], [ 137.64, -8.42 ], [ 138.12, -7.54 ], [ 138.78, -7.38 ], [ 139.09, -7.57 ], [ 138.89, -7.91 ], [ 138.91, -8.08 ], [ 138.68, -8.15 ], [ 138.5, -8.32 ] ] ], [ [ [ 102.61, 1.03 ], [ 102.5, .95 ], [ 102.48, 1.12 ], [ 102.61, 1.03 ] ] ], [ [ [ 102.69, .93 ], [ 102.88, .95 ], [ 103.05, .72 ], [ 102.41, .85 ], [ 102.74, 1.02 ], [ 102.69, .93 ] ] ], [ [ [ 159.05, -8.09 ], [ 158.3, -7.57 ], [ 158.73, -7.58 ], [ 159.85, -8.34 ], [ 159.74, -8.4 ], [ 159.9, -8.57 ], [ 159.71, -8.41 ], [ 159.05, -8.09 ] ] ], [ [ [ 158.14, -8.81 ], [ 158.19, -8.67 ], [ 158.24, -8.8 ], [ 158.14, -8.81 ] ] ], [ [ [ 158, -8.77 ], [ 157.88, -8.56 ], [ 158.11, -8.53 ], [ 158, -8.77 ] ] ], [ [ [ 157.2, -8.58 ], [ 157.38, -8.41 ], [ 157.41, -8.72 ], [ 157.2, -8.58 ] ] ], [ [ [ 157.1, -8.24 ], [ 157.14, -8.35 ], [ 157.01, -8.19 ], [ 157.1, -8.24 ] ] ], [ [ [ 157.56, -8 ], [ 157.62, -8.23 ], [ 157.9, -8.45 ], [ 157.8, -8.64 ], [ 157.54, -8.26 ], [ 157.21, -8.32 ], [ 157.41, -7.99 ], [ 157.56, -8 ] ] ], [ [ [ 156.94, -7.97 ], [ 157.12, -7.85 ], [ 157.18, -8.1 ], [ 156.94, -7.97 ] ] ], [ [ [ 159.08, -9 ], [ 159.21, -9.03 ], [ 159.14, -9.12 ], [ 159.08, -9 ] ] ], [ [ [ 160.15, -9 ], [ 160.29, -9.05 ], [ 160.29, -9.13 ], [ 160.1, -9.09 ], [ 160.15, -9 ] ] ], [ [ [ 160.77, -9 ], [ 160.57, -8.33 ], [ 160.74, -8.32 ], [ 160.99, -8.63 ], [ 160.94, -8.82 ], [ 161.17, -8.98 ], [ 161.4, -9.59 ], [ 160.77, -9 ] ] ], [ [ [ 160.22, -9.17 ], [ 160.28, -9.14 ], [ 160.32, -9.06 ], [ 160.41, -9.14 ], [ 160.22, -9.17 ] ] ], [ [ [ 152.19, -4.23 ], [ 152.4, -4.33 ], [ 152.38, -4.68 ], [ 152.22, -4.97 ], [ 151.95, -4.99 ], [ 152.09, -5.45 ], [ 151.81, -5.59 ], [ 151.47, -5.52 ], [ 151.51, -5.68 ], [ 151.19, -5.96 ], [ 150.46, -6.25 ], [ 149.61, -6.29 ], [ 149.33, -6.05 ], [ 149.04, -6.16 ], [ 149.03, -6.02 ], [ 148.32, -5.68 ], [ 148.42, -5.44 ], [ 149.22, -5.58 ], [ 149.66, -5.45 ], [ 149.87, -5.52 ], [ 150.09, -5 ], [ 150.19, -5.06 ], [ 150.02, -5.29 ], [ 150.09, -5.52 ], [ 150.9, -5.49 ], [ 151.35, -4.91 ], [ 151.69, -4.87 ], [ 151.49, -4.21 ], [ 151.95, -4.34 ], [ 152, -4.19 ], [ 152.17, -4.13 ], [ 152.19, -4.23 ] ] ], [ [ [ 157, -6.9 ], [ 157.56, -7.39 ], [ 157.1, -7.36 ], [ 156.39, -6.66 ], [ 156.5, -6.59 ], [ 157, -6.9 ] ] ], [ [ [ -73.61, 40.9 ], [ -72.64, 40.98 ], [ -72.28, 41.16 ], [ -72.66, 40.92 ], [ -71.86, 41.07 ], [ -72.87, 40.74 ], [ -74.01, 40.57 ], [ -73.94, 40.78 ], [ -73.65, 40.8 ], [ -73.61, 40.9 ] ] ], [ [ [ 25.21, 36.99 ], [ 25.11, 37.06 ], [ 25.28, 37.15 ], [ 25.21, 36.99 ] ] ], [ [ [ 3.23, 39.74 ], [ 3.48, 39.72 ], [ 3.07, 39.27 ], [ 2.67, 39.56 ], [ 2.52, 39.46 ], [ 2.35, 39.56 ], [ 2.95, 39.92 ], [ 3.21, 39.96 ], [ 3.08, 39.89 ], [ 3.23, 39.74 ] ] ], [ [ [ 122.43, 12.45 ], [ 122.66, 12.48 ], [ 122.68, 12.33 ], [ 122.43, 12.45 ] ] ], [ [ [ -176.63, -43.71 ], [ -176.19, -43.74 ], [ -176.42, -43.92 ], [ -176.36, -43.8 ], [ -176.55, -43.74 ], [ -176.44, -43.81 ], [ -176.48, -43.95 ], [ -176.33, -44.05 ], [ -176.58, -44.13 ], [ -176.58, -43.84 ], [ -176.89, -43.82 ], [ -176.63, -43.71 ] ] ], [ [ [ 103.5, .71 ], [ 103.4, .65 ], [ 103.37, .89 ], [ 103.5, .71 ] ] ], [ [ [ 104.56, .12 ], [ 104.48, .24 ], [ 104.7, .02 ], [ 104.56, .12 ] ] ], [ [ [ 103.92, 1.01 ], [ 103.94, .91 ], [ 103.83, .98 ], [ 103.92, 1.01 ] ] ], [ [ [ 25.93, 39.14 ], [ 25.9, 39.29 ], [ 26.34, 39.39 ], [ 26.61, 39.02 ], [ 26.48, 39.12 ], [ 26.52, 38.97 ], [ 26.17, 39.01 ], [ 26.25, 39.21 ], [ 25.93, 39.14 ] ] ], [ [ [ 107.52, 21.14 ], [ 107.38, 21.04 ], [ 107.46, 21.28 ], [ 107.61, 21.22 ], [ 107.52, 21.14 ] ] ], [ [ [ 124.93, 11.75 ], [ 124.39, 12.2 ], [ 124.28, 12.58 ], [ 125.15, 12.58 ], [ 125.29, 12.47 ], [ 125.29, 12.3 ], [ 125.52, 12.19 ], [ 125.41, 11.76 ], [ 125.63, 11.36 ], [ 125.53, 11.2 ], [ 125.67, 11.2 ], [ 125.76, 11.01 ], [ 125.66, 11.14 ], [ 125.23, 11.09 ], [ 125.15, 11.28 ], [ 124.98, 11.28 ], [ 124.99, 11.42 ], [ 124.82, 11.49 ], [ 125.04, 11.75 ], [ 124.93, 11.75 ] ] ], [ [ [ 97.22, 2.22 ], [ 97.34, 2.03 ], [ 97.11, 2.22 ], [ 97.22, 2.22 ] ] ], [ [ [ 19.88, 39.8 ], [ 20.11, 39.36 ], [ 19.63, 39.75 ], [ 19.88, 39.8 ] ] ], [ [ [ -81.37, 19.36 ], [ -81.09, 19.32 ], [ -81.38, 19.27 ], [ -81.37, 19.36 ] ] ], [ [ [ 122.46, 9.98 ], [ 122.87, 10.1 ], [ 122.79, 10.52 ], [ 122.95, 10.89 ], [ 123.19, 11 ], [ 123.51, 10.92 ], [ 123.57, 10.79 ], [ 123.13, 9.84 ], [ 123.12, 9.55 ], [ 123.31, 9.32 ], [ 123.2, 9.09 ], [ 122.94, 9.08 ], [ 122.87, 9.33 ], [ 122.55, 9.48 ], [ 122.38, 9.71 ], [ 122.46, 9.98 ] ] ], [ [ [ 137.6, -36 ], [ 136.7, -36.06 ], [ 136.53, -35.88 ], [ 136.59, -35.75 ], [ 137.62, -35.56 ], [ 137.58, -35.73 ], [ 137.78, -35.72 ], [ 137.76, -35.84 ], [ 137.91, -35.72 ], [ 138.13, -35.8 ], [ 137.6, -36 ] ] ], [ [ [ 126.38, 8.29 ], [ 126.36, 7.89 ], [ 126.57, 7.72 ], [ 126.6, 7.27 ], [ 126.28, 6.93 ], [ 126.35, 6.8 ], [ 126.16, 6.91 ], [ 126.26, 6.75 ], [ 126.19, 6.27 ], [ 125.85, 7.36 ], [ 125.65, 7.24 ], [ 125.37, 6.73 ], [ 125.72, 6.1 ], [ 125.39, 5.56 ], [ 125.17, 5.8 ], [ 125.26, 6.09 ], [ 124.92, 5.86 ], [ 124.06, 6.38 ], [ 123.96, 6.91 ], [ 124.26, 7.38 ], [ 123.69, 7.81 ], [ 123.42, 7.81 ], [ 123.41, 7.36 ], [ 123.3, 7.53 ], [ 123.12, 7.51 ], [ 123.11, 7.74 ], [ 122.99, 7.46 ], [ 122.9, 7.54 ], [ 122.81, 7.43 ], [ 122.81, 7.75 ], [ 122.62, 7.78 ], [ 122.35, 7.47 ], [ 122.16, 6.91 ], [ 121.92, 7 ], [ 122.23, 7.96 ], [ 122.92, 8.15 ], [ 123.03, 8.49 ], [ 123.3, 8.52 ], [ 123.38, 8.73 ], [ 123.57, 8.57 ], [ 123.69, 8.64 ], [ 123.84, 8.43 ], [ 123.87, 8.16 ], [ 123.66, 7.95 ], [ 124.23, 8.22 ], [ 124.39, 8.59 ], [ 124.74, 8.5 ], [ 124.8, 9 ], [ 125.08, 8.83 ], [ 125.21, 9.09 ], [ 125.52, 9.01 ], [ 125.44, 9.82 ], [ 125.96, 9.48 ], [ 126.06, 9.23 ], [ 126.21, 9.31 ], [ 126.16, 9.11 ], [ 126.33, 8.84 ], [ 126.08, 8.61 ], [ 126.36, 8.54 ], [ 126.38, 8.29 ] ] ], [ [ [ 144.96, -40.63 ], [ 145.07, -40.72 ], [ 144.89, -40.74 ], [ 144.96, -40.63 ] ] ], [ [ [ 143.93, -40.16 ], [ 143.95, -39.58 ], [ 144.14, -39.93 ], [ 143.93, -40.16 ] ] ], [ [ [ -63.99, 47 ], [ -64.15, 46.69 ], [ -63.89, 46.65 ], [ -63.93, 46.46 ], [ -63.69, 46.43 ], [ -63.67, 46.57 ], [ -62.98, 46.35 ], [ -61.97, 46.45 ], [ -62.44, 46.36 ], [ -62.38, 46.25 ], [ -62.53, 46.31 ], [ -62.41, 46.21 ], [ -62.64, 46.24 ], [ -62.45, 46.1 ], [ -62.62, 46.01 ], [ -62.46, 46 ], [ -62.83, 45.96 ], [ -63.04, 46.05 ], [ -62.84, 46.15 ], [ -63.13, 46.21 ], [ -62.86, 46.36 ], [ -63.19, 46.26 ], [ -63.25, 46.13 ], [ -63.65, 46.22 ], [ -63.75, 46.4 ], [ -64.14, 46.4 ], [ -64.08, 46.65 ], [ -64.39, 46.62 ], [ -63.99, 47 ] ] ], [ [ [ -4.46, 54.17 ], [ -4.79, 54.06 ], [ -4.37, 54.42 ], [ -4.46, 54.17 ] ] ], [ [ [ 145.97, -41.08 ], [ 146.39, -41.24 ], [ 146.53, -41.12 ], [ 146.61, -41.26 ], [ 146.77, -41.08 ], [ 147.12, -41.44 ], [ 146.79, -41.05 ], [ 147.44, -41 ], [ 147.97, -40.74 ], [ 148.35, -40.99 ], [ 148.35, -42.22 ], [ 148.08, -42.11 ], [ 147.88, -42.85 ], [ 147.67, -42.9 ], [ 147.59, -42.78 ], [ 147.45, -42.76 ], [ 147.61, -42.85 ], [ 147.5, -42.86 ], [ 147.52, -43.02 ], [ 147.19, -42.73 ], [ 147.34, -43.05 ], [ 147.17, -43.28 ], [ 147, -43.02 ], [ 147.1, -43.29 ], [ 146.87, -43.64 ], [ 146.22, -43.49 ], [ 146.03, -43.57 ], [ 145.92, -43.38 ], [ 146.23, -43.32 ], [ 146, -43.34 ], [ 145.94, -43.15 ], [ 145.84, -43.32 ], [ 145.49, -42.99 ], [ 145.17, -42.2 ], [ 145.47, -42.53 ], [ 145.56, -42.36 ], [ 145.33, -42.15 ], [ 145.22, -42.22 ], [ 145.2, -41.94 ], [ 144.75, -41.42 ], [ 144.69, -40.67 ], [ 145.12, -40.84 ], [ 145.26, -40.71 ], [ 145.97, -41.08 ] ] ], [ [ [ 117.03, 7.81 ], [ 116.93, 7.94 ], [ 117.07, 8.08 ], [ 117.03, 7.81 ] ] ], [ [ [ 147.93, -43.01 ], [ 148.01, -43.22 ], [ 147.86, -43.11 ], [ 147.79, -43.24 ], [ 147.62, -43.01 ], [ 147.86, -43.06 ], [ 147.91, -42.84 ], [ 147.93, -43.01 ] ] ], [ [ [ 147.4, -43.24 ], [ 147.32, -43.5 ], [ 147.14, -43.49 ], [ 147.35, -43.06 ], [ 147.4, -43.24 ] ] ], [ [ [ 144.72, -40.5 ], [ 144.79, -40.4 ], [ 144.76, -40.61 ], [ 144.72, -40.5 ] ] ], [ [ [ -74.01, 22.72 ], [ -74.29, 22.69 ], [ -74.35, 22.83 ], [ -74.01, 22.72 ] ] ], [ [ [ -74.2, 22.26 ], [ -73.88, 22.52 ], [ -74.03, 22.69 ], [ -73.83, 22.73 ], [ -73.91, 22.69 ], [ -73.84, 22.54 ], [ -73.98, 22.36 ], [ -74.29, 22.16 ], [ -74.2, 22.26 ] ] ], [ [ [ 106.35, -5.97 ], [ 106.84, -6.12 ], [ 107.01, -6.08 ], [ 107.02, -5.91 ], [ 107.34, -5.97 ], [ 107.67, -6.24 ], [ 107.89, -6.18 ], [ 108.13, -6.34 ], [ 108.36, -6.25 ], [ 108.71, -6.81 ], [ 109.29, -6.87 ], [ 109.52, -6.77 ], [ 110.43, -6.96 ], [ 110.73, -6.43 ], [ 110.92, -6.4 ], [ 111.24, -6.69 ], [ 111.55, -6.63 ], [ 112.12, -6.9 ], [ 112.55, -6.84 ], [ 112.91, -7.63 ], [ 113.28, -7.78 ], [ 114.04, -7.6 ], [ 114.44, -7.79 ], [ 114.34, -8.52 ], [ 114.6, -8.75 ], [ 113.23, -8.28 ], [ 112.65, -8.45 ], [ 111.8, -8.26 ], [ 111.7, -8.38 ], [ 110.71, -8.2 ], [ 109.35, -7.71 ], [ 108.57, -7.69 ], [ 108.43, -7.82 ], [ 107.85, -7.74 ], [ 107.4, -7.49 ], [ 106.41, -7.38 ], [ 106.51, -6.96 ], [ 106.03, -6.82 ], [ 105.24, -6.84 ], [ 105.37, -6.65 ], [ 105.47, -6.83 ], [ 105.65, -6.48 ], [ 105.78, -6.51 ], [ 106.03, -5.88 ], [ 106.16, -6.02 ], [ 106.35, -5.97 ] ] ], [ [ [ 148.41, -40.37 ], [ 148.4, -40.49 ], [ 147.98, -40.4 ], [ 148.41, -40.37 ] ] ], [ [ [ 142.2, -10.6 ], [ 142.28, -10.71 ], [ 142.15, -10.77 ], [ 142.2, -10.6 ] ] ], [ [ [ -17.75, 28.78 ], [ -17.84, 28.45 ], [ -18.01, 28.78 ], [ -17.75, 28.78 ] ] ], [ [ [ 96.5, 2.36 ], [ 95.8, 2.63 ], [ 95.69, 2.77 ], [ 95.78, 2.93 ], [ 96.5, 2.36 ] ] ], [ [ [ -80.41, 25.12 ], [ -80.54, 25.01 ], [ -80.26, 25.33 ], [ -80.41, 25.12 ] ] ], [ [ [ -16.52, 28.42 ], [ -16.12, 28.56 ], [ -16.69, 28 ], [ -16.92, 28.35 ], [ -16.52, 28.42 ] ] ], [ [ [ 180, -77.75 ], [ 179, -85.05 ], [ -180, -85.05 ], [ -180, -77.75 ], [ -177.34, -77.88 ], [ -176.7, -77.99 ], [ -177.3, -78.12 ], [ -166.74, -78.45 ], [ -163.64, -78.73 ], [ -162.56, -78.38 ], [ -158.64, -77.88 ], [ -158.22, -77.07 ], [ -157, -77.37 ], [ -156.36, -77.07 ], [ -154.26, -77.06 ], [ -151.61, -77.4 ], [ -152.03, -77.28 ], [ -151.16, -77.21 ], [ -151.71, -76.99 ], [ -149.89, -76.89 ], [ -150.86, -76.75 ], [ -150.61, -76.52 ], [ -148.3, -76.06 ], [ -148.39, -75.74 ], [ -147.28, -75.82 ], [ -146.97, -75.63 ], [ -144.45, -75.34 ], [ -141.87, -75.52 ], [ -141.55, -75.37 ], [ -140.98, -75.5 ], [ -140.06, -75.08 ], [ -139.68, -75.18 ], [ -139.14, -75.06 ], [ -137.02, -75.02 ], [ -136.84, -74.75 ], [ -135.41, -74.57 ], [ -134.66, -74.61 ], [ -131.83, -74.32 ], [ -131.11, -74.43 ], [ -128.15, -74.31 ], [ -127.15, -73.74 ], [ -127.45, -73.39 ], [ -126.86, -73.28 ], [ -126.1, -73.29 ], [ -124.12, -73.85 ], [ -123.28, -73.83 ], [ -123.06, -73.67 ], [ -119.17, -73.78 ], [ -119, -73.94 ], [ -117.34, -74.07 ], [ -116.36, -73.86 ], [ -115.34, -74.13 ], [ -114.21, -73.86 ], [ -113.31, -74.19 ], [ -110.49, -74.25 ], [ -110.17, -74.66 ], [ -108.94, -74.99 ], [ -109.49, -75.11 ], [ -109.07, -75.25 ], [ -107.55, -75.21 ], [ -107.97, -74.78 ], [ -106.63, -74.59 ], [ -106.36, -75.14 ], [ -105.56, -74.8 ], [ -104.24, -75.1 ], [ -101.63, -75.11 ], [ -101.94, -75.02 ], [ -101.17, -74.73 ], [ -102.46, -74.51 ], [ -101.38, -74.17 ], [ -101.56, -74 ], [ -102.91, -73.9 ], [ -103, -73.6 ], [ -101.35, -73.64 ], [ -101.69, -73.34 ], [ -102.76, -73.32 ], [ -103.31, -73.14 ], [ -103.42, -72.83 ], [ -102.79, -72.7 ], [ -102.68, -72.47 ], [ -103.39, -72.28 ], [ -102.34, -72.17 ], [ -102.45, -72.27 ], [ -101.76, -71.92 ], [ -100.17, -71.82 ], [ -99.17, -71.92 ], [ -98.6, -71.74 ], [ -97.85, -71.9 ], [ -96.17, -71.86 ], [ -95.51, -72.15 ], [ -95.58, -72.47 ], [ -95.06, -72.58 ], [ -94.53, -72.48 ], [ -94.27, -72.62 ], [ -92.99, -72.54 ], [ -92.48, -72.66 ], [ -91.2, -72.53 ], [ -90.7, -72.76 ], [ -89.88, -72.45 ], [ -89.77, -72.61 ], [ -85.81, -73.05 ], [ -85.08, -73.52 ], [ -83.73, -73.56 ], [ -83.74, -73.71 ], [ -82.08, -73.89 ], [ -81.14, -73.69 ], [ -81.29, -73.27 ], [ -80.33, -73.31 ], [ -80.53, -72.95 ], [ -79.67, -73.03 ], [ -78.7, -73.4 ], [ -78.15, -73.34 ], [ -78.05, -73.13 ], [ -77.29, -73.3 ], [ -77.37, -72.98 ], [ -78.84, -73.12 ], [ -79.33, -72.95 ], [ -78.68, -72.75 ], [ -79.29, -72.47 ], [ -78.92, -72.29 ], [ -78.32, -72.5 ], [ -77.46, -72.42 ], [ -77.23, -72.62 ], [ -76.52, -72.53 ], [ -75.83, -72.88 ], [ -74.33, -72.92 ], [ -74.26, -73.1 ], [ -71.66, -73.18 ], [ -72.16, -72.81 ], [ -72.4, -72.92 ], [ -72.24, -72.71 ], [ -73.17, -72.45 ], [ -72.64, -72.27 ], [ -73.32, -72.06 ], [ -74.1, -72.17 ], [ -75.43, -71.88 ], [ -75.11, -71.54 ], [ -74.45, -71.58 ], [ -74.32, -71.39 ], [ -73.08, -71.27 ], [ -73.27, -70.83 ], [ -73.59, -70.76 ], [ -74.47, -70.99 ], [ -76.24, -71.13 ], [ -76.46, -70.92 ], [ -75.21, -70.78 ], [ -74.97, -70.59 ], [ -74.52, -70.7 ], [ -74.44, -70.58 ], [ -72.55, -70.39 ], [ -72.31, -69.81 ], [ -72.97, -69.49 ], [ -72.52, -69.43 ], [ -71.77, -69.68 ], [ -71.66, -69.4 ], [ -72.21, -69.08 ], [ -71.59, -68.86 ], [ -70.14, -68.87 ], [ -70.11, -69.27 ], [ -69.5, -69.46 ], [ -69.09, -70.12 ], [ -68.45, -70.11 ], [ -68.33, -69.7 ], [ -68.84, -69.4 ], [ -68.31, -69.4 ], [ -68.27, -69.28 ], [ -67.41, -69.38 ], [ -66.89, -69.22 ], [ -66.85, -68.98 ], [ -67.49, -68.83 ], [ -66.97, -68.76 ], [ -67.18, -68.28 ], [ -66.62, -68.24 ], [ -67.29, -67.96 ], [ -66.84, -67.91 ], [ -66.76, -67.78 ], [ -67.1, -67.77 ], [ -66.49, -67.49 ], [ -67.63, -67.56 ], [ -67.51, -67.05 ], [ -66.96, -66.93 ], [ -66.94, -67.22 ], [ -66.45, -67.33 ], [ -66.54, -66.64 ], [ -66.13, -66.59 ], [ -65.73, -66.74 ], [ -65.73, -66.14 ], [ -65.15, -66.19 ], [ -65.34, -65.98 ], [ -64.94, -65.92 ], [ -64.57, -66.04 ], [ -64.48, -65.63 ], [ -64.05, -65.7 ], [ -64.12, -65.51 ], [ -63.73, -65.58 ], [ -64.1, -65.41 ], [ -63.91, -65.06 ], [ -63.09, -65.17 ], [ -63.26, -64.95 ], [ -62.82, -64.8 ], [ -62.39, -64.88 ], [ -62.7, -64.77 ], [ -62.46, -64.59 ], [ -62.29, -64.77 ], [ -61.81, -64.49 ], [ -61.59, -64.66 ], [ -61.6, -64.43 ], [ -60.94, -64.3 ], [ -60.99, -64.04 ], [ -59.96, -63.96 ], [ -59.85, -63.77 ], [ -59.43, -63.91 ], [ -58.97, -63.55 ], [ -57.22, -63.22 ], [ -56.77, -63.61 ], [ -57.14, -63.66 ], [ -57.14, -63.48 ], [ -57.47, -63.44 ], [ -57.38, -63.56 ], [ -58.28, -63.73 ], [ -58.8, -64.22 ], [ -59.19, -64.23 ], [ -58.74, -64.3 ], [ -58.81, -64.56 ], [ -59.49, -64.31 ], [ -59.59, -64.6 ], [ -59.96, -64.37 ], [ -60.74, -64.73 ], [ -60.83, -64.92 ], [ -60.09, -64.97 ], [ -59.45, -65.25 ], [ -61.61, -64.95 ], [ -61.6, -65.24 ], [ -62.12, -65.18 ], [ -62.34, -65.33 ], [ -61.7, -65.52 ], [ -61.32, -65.92 ], [ -60.53, -65.96 ], [ -60.06, -66.82 ], [ -61.19, -67.23 ], [ -61.52, -67.66 ], [ -61.43, -68.33 ], [ -60.65, -68.95 ], [ -61.75, -69.5 ], [ -60.53, -70.37 ], [ -60.78, -70.91 ], [ -60.29, -72.11 ], [ -59.63, -72.48 ], [ -59.98, -73.25 ], [ -60.6, -73.39 ], [ -61.06, -73.97 ], [ -60.65, -74.31 ], [ -62.01, -74.91 ], [ -60.85, -75.13 ], [ -61.44, -74.91 ], [ -61.11, -74.77 ], [ -55.31, -75.86 ], [ -53.84, -76.18 ], [ -52.28, -76.78 ], [ -51.38, -76.77 ], [ -49.16, -77.6 ], [ -45.59, -77.85 ], [ -44.1, -78.16 ], [ -41.45, -77.83 ], [ -41.51, -78.01 ], [ -40.75, -77.83 ], [ -35.91, -78.2 ], [ -33.71, -77.31 ], [ -31.91, -77.15 ], [ -28.86, -76.35 ], [ -26.67, -76.11 ], [ -26.84, -75.81 ], [ -27.74, -75.62 ], [ -25.63, -75.22 ], [ -25.28, -74.91 ], [ -24.85, -75.02 ], [ -24.84, -74.79 ], [ -25.33, -74.81 ], [ -25.79, -74.6 ], [ -25.38, -74.46 ], [ -25.9, -74.16 ], [ -25.45, -73.96 ], [ -23.72, -73.84 ], [ -23.66, -73.99 ], [ -23.3, -73.92 ], [ -21.97, -74.33 ], [ -22.03, -74.09 ], [ -21.07, -73.93 ], [ -19.87, -72.94 ], [ -19.52, -72.83 ], [ -19.11, -72.92 ], [ -19.23, -72.69 ], [ -18.33, -72.58 ], [ -17.69, -72.74 ], [ -17.55, -72.53 ], [ -16.49, -72.53 ], [ -16.31, -72.37 ], [ -15.35, -72.29 ], [ -15.37, -72.15 ], [ -12.91, -72.01 ], [ -12.57, -71.87 ], [ -12.97, -71.88 ], [ -12.03, -71.68 ], [ -12.36, -71.35 ], [ -10.83, -70.96 ], [ -9.98, -70.92 ], [ -8.41, -70.5 ], [ -7.75, -70.69 ], [ -6.56, -70.41 ], [ -4.53, -70.33 ], [ -3.48, -70.48 ], [ -3.19, -70.31 ], [ -1.47, -70.13 ], [ -1.87, -70.13 ], [ -1.59, -70.05 ], [ -1.16, -70.13 ], [ -1.52, -69.96 ], [ -1.27, -69.88 ], [ -1.67, -69.88 ], [ -.93, -69.6 ], [ .08, -69.6 ], [ .03, -69.84 ], [ 1, -70.05 ], [ 1.75, -69.94 ], [ 2.48, -70.17 ], [ 3.71, -70.06 ], [ 4.12, -70.11 ], [ 4.05, -70.27 ], [ 5.31, -70.1 ], [ 5.64, -70.19 ], [ 5.69, -70.01 ], [ 6.49, -70.12 ], [ 7.2, -69.99 ], [ 7.42, -70.21 ], [ 8.18, -69.92 ], [ 8.97, -70.09 ], [ 10.21, -69.9 ], [ 10.99, -70.05 ], [ 11.96, -69.94 ], [ 12.79, -70.07 ], [ 13.27, -69.66 ], [ 13.59, -69.73 ], [ 13.72, -69.56 ], [ 14.81, -69.45 ], [ 15.46, -69.51 ], [ 15.61, -69.83 ], [ 17.73, -69.65 ], [ 19.08, -69.99 ], [ 20.03, -69.94 ], [ 19.59, -69.8 ], [ 20.2, -69.73 ], [ 21.3, -69.81 ], [ 21.83, -70.15 ], [ 23.02, -70.07 ], [ 23.79, -70.31 ], [ 24.59, -70.34 ], [ 25.07, -70.08 ], [ 24.79, -70.06 ], [ 25.78, -70.01 ], [ 25.39, -70.2 ], [ 25.9, -70.17 ], [ 25.89, -70.29 ], [ 26.25, -70.08 ], [ 26.68, -70.09 ], [ 26.45, -69.93 ], [ 27.72, -69.98 ], [ 28.49, -69.67 ], [ 29.31, -69.69 ], [ 29.23, -69.39 ], [ 29.92, -69.21 ], [ 29.65, -69.35 ], [ 29.99, -69.21 ], [ 30.47, -69.28 ], [ 30.71, -69.05 ], [ 32.57, -69.15 ], [ 32.57, -68.86 ], [ 33.23, -68.67 ], [ 34.26, -68.7 ], [ 34.73, -68.79 ], [ 34.93, -69.07 ], [ 36.55, -69.27 ], [ 36.83, -69.42 ], [ 36.23, -69.33 ], [ 36.53, -69.52 ], [ 36.2, -69.46 ], [ 37.04, -69.69 ], [ 38.12, -69.26 ], [ 38.18, -69.39 ], [ 37.79, -69.42 ], [ 38.4, -69.63 ], [ 38.56, -70.07 ], [ 38.5, -69.87 ], [ 38.76, -70 ], [ 39.16, -69.72 ], [ 39.71, -69.65 ], [ 39.86, -68.85 ], [ 42.28, -68.38 ], [ 42.67, -68.14 ], [ 44.44, -67.97 ], [ 44.93, -67.73 ], [ 46.22, -67.66 ], [ 46.43, -67.28 ], [ 47.34, -67.37 ], [ 47.53, -67.58 ], [ 48.44, -67.58 ], [ 49.31, -67.28 ], [ 48.83, -67.29 ], [ 48.33, -67.03 ], [ 49.2, -66.82 ], [ 49.97, -67.16 ], [ 50.79, -67.18 ], [ 50.42, -66.97 ], [ 50.84, -66.78 ], [ 50.22, -66.73 ], [ 50.42, -66.34 ], [ 52.05, -65.99 ], [ 53.8, -65.84 ], [ 55.61, -66.02 ], [ 56.33, -66.4 ], [ 57.26, -66.56 ], [ 57.28, -66.71 ], [ 56.8, -66.72 ], [ 56.52, -66.9 ], [ 56.96, -66.87 ], [ 56.93, -67.04 ], [ 58.26, -67.03 ], [ 58.43, -67.2 ], [ 58.97, -67.2 ], [ 58.78, -67.34 ], [ 59.1, -67.44 ], [ 60.47, -67.36 ], [ 62.64, -67.66 ], [ 63.54, -67.5 ], [ 68.34, -67.9 ], [ 69.57, -67.74 ], [ 69.65, -68.15 ], [ 70.39, -68.7 ], [ 72.86, -68.49 ], [ 72.77, -68.73 ], [ 72.42, -68.73 ], [ 73.16, -68.94 ], [ 72.94, -68.75 ], [ 73.5, -68.67 ], [ 74.52, -69.28 ], [ 74.49, -69.38 ], [ 73.57, -69.31 ], [ 74.38, -69.49 ], [ 73.71, -69.75 ], [ 75.12, -69.8 ], [ 75.14, -69.52 ], [ 75.92, -69.53 ], [ 77.88, -69.06 ], [ 78.13, -68.76 ], [ 77.84, -68.68 ], [ 78.17, -68.65 ], [ 77.89, -68.63 ], [ 78.52, -68.51 ], [ 78.07, -68.49 ], [ 78.78, -68.24 ], [ 81.37, -67.79 ], [ 81.7, -67.29 ], [ 83.25, -67.11 ], [ 83.36, -67.31 ], [ 84.41, -66.97 ], [ 84.05, -66.85 ], [ 84.39, -66.75 ], [ 83.88, -66.77 ], [ 83.87, -66.64 ], [ 84.52, -66.54 ], [ 85.02, -66.66 ], [ 85.36, -66.43 ], [ 86.38, -66.27 ], [ 89.54, -66.87 ], [ 91.98, -66.5 ], [ 92.73, -66.64 ], [ 93.72, -66.62 ], [ 93.85, -66.51 ], [ 94.33, -66.64 ], [ 94.94, -66.48 ], [ 94.84, -66.21 ], [ 95.56, -66.17 ], [ 95.51, -65.25 ], [ 95.86, -65.28 ], [ 96.35, -64.96 ], [ 97.12, -65.29 ], [ 96.43, -65.56 ], [ 96.96, -65.47 ], [ 96.86, -65.71 ], [ 98.63, -65.9 ], [ 98.43, -65.55 ], [ 99.12, -65.54 ], [ 99.57, -65.9 ], [ 99.66, -65.7 ], [ 100.25, -65.73 ], [ 100.75, -65.37 ], [ 101.82, -65.78 ], [ 102.94, -65.89 ], [ 103.15, -65.69 ], [ 102.89, -65.57 ], [ 103.2, -65.47 ], [ 102.91, -65.13 ], [ 103.89, -65.98 ], [ 108.02, -66.58 ], [ 108.77, -66.94 ], [ 109.54, -66.83 ], [ 109.76, -66.58 ], [ 110.73, -66.48 ], [ 110.49, -66.29 ], [ 110.94, -66.05 ], [ 113.22, -65.76 ], [ 114.53, -66.24 ], [ 114.46, -66.46 ], [ 115.11, -66.36 ], [ 114.53, -66.48 ], [ 115.6, -66.58 ], [ 115.76, -66.76 ], [ 115.87, -66.56 ], [ 116.51, -66.58 ], [ 116.62, -66.77 ], [ 117.43, -67 ], [ 120.72, -66.91 ], [ 121.24, -66.64 ], [ 121.93, -66.56 ], [ 122.38, -66.83 ], [ 123.51, -66.75 ], [ 124.31, -66.51 ], [ 124.81, -66.73 ], [ 124.82, -66.46 ], [ 125.13, -66.68 ], [ 125.37, -66.42 ], [ 126.21, -66.25 ], [ 127.37, -66.55 ], [ 127.84, -67.02 ], [ 128.9, -67.05 ], [ 129.31, -67 ], [ 130.3, -66.1 ], [ 131.79, -66.25 ], [ 133.43, -66.07 ], [ 134.17, -66.22 ], [ 134.68, -65.98 ], [ 136.55, -66.42 ], [ 137.44, -66.35 ], [ 141.35, -66.84 ], [ 141.86, -66.78 ], [ 142.5, -67.03 ], [ 143.77, -66.88 ], [ 143.94, -67.06 ], [ 144.53, -67.02 ], [ 144.65, -67.25 ], [ 144.97, -67.12 ], [ 145.82, -67.27 ], [ 145.29, -67.51 ], [ 146.19, -67.62 ], [ 147.26, -68.2 ], [ 147.16, -68.09 ], [ 147.8, -68.06 ], [ 148.18, -68.23 ], [ 147.74, -68.37 ], [ 148.55, -68.31 ], [ 148.88, -68.46 ], [ 149.47, -68.3 ], [ 149.94, -68.43 ], [ 150.93, -68.34 ], [ 151.49, -68.64 ], [ 151.9, -68.55 ], [ 151.94, -68.32 ], [ 153.13, -68.25 ], [ 153.44, -68.41 ], [ 153.89, -68.28 ], [ 155.38, -68.97 ], [ 156.53, -68.97 ], [ 156.81, -69.17 ], [ 157.31, -69.06 ], [ 157.49, -69.27 ], [ 157.99, -69.17 ], [ 158.52, -69.36 ], [ 159.15, -69.32 ], [ 160.58, -69.88 ], [ 160.33, -70 ], [ 161, -70.28 ], [ 161.57, -70.13 ], [ 161.96, -70.46 ], [ 162.08, -70.31 ], [ 162.68, -70.28 ], [ 163.34, -70.72 ], [ 163.83, -70.65 ], [ 163.66, -70.47 ], [ 165.28, -70.56 ], [ 165.82, -70.72 ], [ 166.72, -70.62 ], [ 166.46, -70.76 ], [ 167.73, -70.8 ], [ 168.23, -71.18 ], [ 170.2, -71.67 ], [ 170.28, -71.3 ], [ 170.98, -71.84 ], [ 169.77, -72.18 ], [ 169.78, -72.44 ], [ 170.27, -72.31 ], [ 170.28, -72.59 ], [ 169.02, -73.27 ], [ 169.18, -73.47 ], [ 168.56, -73.37 ], [ 168.28, -73.61 ], [ 168.31, -73.43 ], [ 167.63, -73.35 ], [ 167.73, -73.5 ], [ 166.48, -73.58 ], [ 166.8, -73.75 ], [ 165.63, -73.8 ], [ 166.33, -74.05 ], [ 164.81, -74.09 ], [ 165.43, -74.65 ], [ 165.24, -74.56 ], [ 164.05, -74.63 ], [ 163.67, -75.12 ], [ 162.66, -75.17 ], [ 162.89, -75.31 ], [ 163.59, -75.2 ], [ 165.44, -75.5 ], [ 162.58, -75.42 ], [ 163.04, -75.48 ], [ 163.04, -75.94 ], [ 162.33, -76.11 ], [ 163.11, -76.15 ], [ 162.51, -76.22 ], [ 163.02, -76.73 ], [ 162.29, -76.96 ], [ 163.19, -77.03 ], [ 163.86, -77.49 ], [ 162.52, -77.81 ], [ 164.21, -77.65 ], [ 164.51, -78.01 ], [ 165.56, -77.8 ], [ 166.74, -77.91 ], [ 166.94, -77.68 ], [ 166.14, -77.54 ], [ 166.7, -77.16 ], [ 167.54, -77.41 ], [ 173.67, -77.43 ], [ 180, -77.75 ] ] ], [ [ [ 86.86, 20.66 ], [ 86.78, 20.65 ], [ 86.84, 20.77 ], [ 86.99, 20.77 ], [ 86.86, 20.66 ] ] ], [ [ [ 55.71, -21.03 ], [ 55.84, -21.18 ], [ 55.65, -21.39 ], [ 55.34, -21.28 ], [ 55.22, -21.04 ], [ 55.45, -20.87 ], [ 55.71, -21.03 ] ] ], [ [ [ -60.86, 14.47 ], [ -61.08, 14.47 ], [ -60.98, 14.55 ], [ -61.21, 14.86 ], [ -60.87, 14.77 ], [ -60.86, 14.47 ] ] ], [ [ [ -157.48, 1.98 ], [ -157.31, 1.98 ], [ -157.17, 1.7 ], [ -157.55, 1.85 ], [ -157.48, 1.98 ] ] ], [ [ [ 168.06, -46.95 ], [ 168.22, -47.1 ], [ 167.45, -47.28 ], [ 167.77, -46.92 ], [ 167.72, -46.71 ], [ 167.98, -46.72 ], [ 168.16, -46.9 ], [ 167.91, -46.98 ], [ 168.06, -46.95 ] ] ], [ [ [ 80.83, 15.71 ], [ 80.86, 15.82 ], [ 80.9, 15.75 ], [ 80.93, 15.72 ], [ 80.83, 15.71 ] ] ], [ [ [ -9.94, 53.89 ], [ -10.26, 53.98 ], [ -9.97, 54.03 ], [ -9.94, 53.89 ] ] ], [ [ [ -9.79, 53.91 ], [ -9.92, 54.2 ], [ -10.14, 54.11 ], [ -10, 54.31 ], [ -9.92, 54.21 ], [ -9.72, 54.24 ], [ -9.81, 54.34 ], [ -9.34, 54.33 ], [ -9.14, 54.16 ], [ -9.05, 54.29 ], [ -8.5, 54.22 ], [ -8.68, 54.36 ], [ -8.11, 54.66 ], [ -8.46, 54.57 ], [ -8.81, 54.7 ], [ -8.21, 54.9 ], [ -8.46, 54.92 ], [ -8.28, 55.16 ], [ -7.86, 55.13 ], [ -7.79, 55.26 ], [ -7.7, 55.1 ], [ -7.63, 55.28 ], [ -7.64, 54.95 ], [ -7.52, 55.29 ], [ -7.25, 55.28 ], [ -7.38, 55.38 ], [ -6.92, 55.24 ], [ -7.13, 55.04 ], [ -6.96, 55.19 ], [ -6.06, 55.2 ], [ -5.69, 54.8 ], [ -5.92, 54.6 ], [ -5.58, 54.68 ], [ -5.43, 54.49 ], [ -5.5, 54.33 ], [ -5.69, 54.58 ], [ -5.52, 54.31 ], [ -5.82, 54.28 ], [ -6.06, 54.02 ], [ -6.32, 54.15 ], [ -6.14, 53.98 ], [ -6.4, 54.01 ], [ -6, 52.97 ], [ -6.36, 52.35 ], [ -6.57, 52.49 ], [ -6.36, 52.17 ], [ -6.76, 52.27 ], [ -6.92, 52.12 ], [ -6.96, 52.24 ], [ -7.02, 52.13 ], [ -7.64, 52.1 ], [ -7.58, 51.99 ], [ -8.06, 51.81 ], [ -8.46, 51.9 ], [ -8.27, 51.8 ], [ -8.48, 51.67 ], [ -8.67, 51.77 ], [ -8.53, 51.6 ], [ -8.77, 51.66 ], [ -8.71, 51.57 ], [ -9.23, 51.48 ], [ -9.46, 51.56 ], [ -9.82, 51.45 ], [ -9.54, 51.75 ], [ -10.16, 51.58 ], [ -9.54, 51.89 ], [ -10.34, 51.78 ], [ -10.32, 51.96 ], [ -9.7, 52.17 ], [ -10.47, 52.18 ], [ -9.72, 52.26 ], [ -9.95, 52.41 ], [ -9.62, 52.58 ], [ -9.48, 52.55 ], [ -8.63, 52.67 ], [ -8.97, 52.68 ], [ -8.96, 52.82 ], [ -9.16, 52.62 ], [ -9.31, 52.59 ], [ -9.27, 52.64 ], [ -9.41, 52.6 ], [ -9.61, 52.67 ], [ -9.94, 52.56 ], [ -9.5, 52.75 ], [ -9.28, 53.14 ], [ -8.87, 53.21 ], [ -9.62, 53.23 ], [ -9.55, 53.4 ], [ -9.77, 53.29 ], [ -9.84, 53.43 ], [ -10.18, 53.41 ], [ -10.01, 53.48 ], [ -10.19, 53.56 ], [ -9.67, 53.61 ], [ -9.91, 53.76 ], [ -9.54, 53.88 ], [ -9.94, 53.87 ], [ -9.79, 53.91 ] ] ], [ [ [ 115.1, 4.84 ], [ 115.54, 5.07 ], [ 115.6, 5.22 ], [ 115.34, 5.3 ], [ 115.37, 5.4 ], [ 115.59, 5.63 ], [ 115.6, 5.52 ], [ 115.87, 5.58 ], [ 116.74, 7.04 ], [ 116.87, 6.82 ], [ 116.77, 6.57 ], [ 117.15, 7.01 ], [ 117.29, 6.61 ], [ 117.52, 6.63 ], [ 117.74, 6.43 ], [ 117.54, 6.15 ], [ 117.68, 5.99 ], [ 117.61, 5.89 ], [ 117.98, 6.07 ], [ 118.13, 5.85 ], [ 117.9, 5.79 ], [ 117.95, 5.67 ], [ 118.35, 5.83 ], [ 118.6, 5.65 ], [ 118.54, 5.51 ], [ 118.63, 5.64 ], [ 118.8, 5.44 ], [ 119.24, 5.39 ], [ 119.16, 5.11 ], [ 118.68, 4.93 ], [ 118.33, 5.02 ], [ 118.12, 4.88 ], [ 118.62, 4.48 ], [ 118.55, 4.35 ], [ 118, 4.22 ], [ 117.57, 4.42 ], [ 117.62, 4.16 ], [ 117.42, 4.09 ], [ 117.83, 3.7 ], [ 117.28, 3.59 ], [ 117.52, 3.48 ], [ 117.52, 3.27 ], [ 117.32, 3.17 ], [ 117.62, 3.06 ], [ 117.57, 2.96 ], [ 117.7, 2.95 ], [ 117.55, 2.91 ], [ 117.72, 2.89 ], [ 117.6, 2.81 ], [ 118.09, 2.33 ], [ 117.76, 2.02 ], [ 118.97, .94 ], [ 118.79, .8 ], [ 118.39, .8 ], [ 118, .99 ], [ 118.03, .78 ], [ 117.72, .71 ], [ 117.42, -.22 ], [ 117.63, -.42 ], [ 117.46, -.69 ], [ 117.61, -.77 ], [ 117.2, -.93 ], [ 116.88, -1.28 ], [ 116.78, -.98 ], [ 116.76, -1.36 ], [ 116.21, -1.78 ], [ 116.45, -1.77 ], [ 116.35, -2.11 ], [ 116.59, -2.17 ], [ 116.53, -2.54 ], [ 116.3, -2.53 ], [ 116.42, -2.58 ], [ 116.36, -2.88 ], [ 116.22, -3.01 ], [ 116.13, -2.81 ], [ 116.09, -2.99 ], [ 116.27, -3.13 ], [ 115.97, -3.61 ], [ 115.72, -3.73 ], [ 114.66, -4.18 ], [ 114.5, -3.51 ], [ 114.06, -3.31 ], [ 113.63, -3.46 ], [ 113.58, -3.14 ], [ 113.34, -3.28 ], [ 113.05, -2.97 ], [ 112.94, -3.11 ], [ 113.04, -3.13 ], [ 112.56, -3.45 ], [ 112.26, -3.31 ], [ 111.88, -3.54 ], [ 111.77, -3.5 ], [ 111.83, -3.05 ], [ 111.71, -2.85 ], [ 111.55, -3.02 ], [ 111.41, -2.91 ], [ 110.65, -3.04 ], [ 110.56, -2.84 ], [ 110.31, -3 ], [ 110.06, -2.25 ], [ 110.12, -2.03 ], [ 109.9, -1.83 ], [ 110.06, -1.34 ], [ 109.73, -.97 ], [ 109.31, -.91 ], [ 109.25, -.66 ], [ 109.54, -.73 ], [ 109.12, -.52 ], [ 109.06, -.22 ], [ 109.19, .07 ], [ 108.92, .33 ], [ 108.84, .81 ], [ 108.98, .96 ], [ 108.91, 1.17 ], [ 109.14, 1.24 ], [ 108.96, 1.21 ], [ 109.05, 1.52 ], [ 109.34, 1.94 ], [ 109.65, 2.08 ], [ 109.68, 1.86 ], [ 109.89, 1.72 ], [ 110.29, 1.71 ], [ 110.32, 1.59 ], [ 110.34, 1.81 ], [ 110.38, 1.69 ], [ 110.51, 1.74 ], [ 110.53, 1.58 ], [ 111.1, 1.4 ], [ 110.99, 1.57 ], [ 111.14, 1.68 ], [ 111.19, 2.37 ], [ 111.47, 2.37 ], [ 111.43, 2.7 ], [ 112.96, 3.13 ], [ 113.93, 4.25 ], [ 113.97, 4.6 ], [ 114.43, 4.66 ], [ 115.06, 5.05 ], [ 115.1, 4.84 ] ] ], [ [ [ 172.95, -43.87 ], [ 172.93, -43.75 ], [ 172.93, -43.9 ], [ 172.3, -43.87 ], [ 171.33, -44.3 ], [ 171.15, -44.94 ], [ 170.9, -44.89 ], [ 171.15, -44.94 ], [ 170.57, -45.72 ], [ 170.58, -45.75 ], [ 170.64, -45.74 ], [ 170.72, -45.77 ], [ 170.72, -45.79 ], [ 170.51, -45.88 ], [ 170.6, -45.87 ], [ 170.6, -45.85 ], [ 170.65, -45.84 ], [ 170.64, -45.82 ], [ 170.67, -45.83 ], [ 170.67, -45.81 ], [ 170.72, -45.8 ], [ 170.73, -45.77 ], [ 170.75, -45.87 ], [ 170.29, -45.96 ], [ 169.58, -46.58 ], [ 168.33, -46.63 ], [ 168.34, -46.42 ], [ 167.78, -46.39 ], [ 167.52, -46.16 ], [ 166.66, -46.2 ], [ 166.92, -45.92 ], [ 166.71, -46.08 ], [ 166.56, -46.07 ], [ 166.71, -45.86 ], [ 166.45, -46 ], [ 166.45, -45.81 ], [ 166.98, -45.72 ], [ 166.73, -45.73 ], [ 166.97, -45.6 ], [ 166.72, -45.6 ], [ 167.01, -45.49 ], [ 166.67, -45.58 ], [ 166.76, -45.4 ], [ 166.91, -45.43 ], [ 166.84, -45.28 ], [ 167.16, -45.47 ], [ 166.97, -45.14 ], [ 167.31, -45.05 ], [ 167.14, -44.99 ], [ 167.33, -44.84 ], [ 167.44, -44.98 ], [ 167.36, -44.82 ], [ 167.53, -44.88 ], [ 167.75, -44.58 ], [ 167.93, -44.68 ], [ 167.82, -44.5 ], [ 168.37, -44.01 ], [ 168.82, -43.97 ], [ 170.86, -42.83 ], [ 171.28, -42.32 ], [ 171.46, -41.75 ], [ 171.72, -41.72 ], [ 172.07, -41.39 ], [ 172.13, -40.85 ], [ 172.68, -40.5 ], [ 173.04, -40.56 ], [ 172.73, -40.52 ], [ 172.65, -40.66 ], [ 172.84, -40.84 ], [ 173, -40.78 ], [ 173, -41.15 ], [ 173.19, -41.33 ], [ 173.83, -40.92 ], [ 174.02, -40.91 ], [ 173.77, -41.02 ], [ 173.76, -41.12 ], [ 173.95, -41.06 ], [ 173.77, -41.29 ], [ 174.12, -41.17 ], [ 173.87, -41.21 ], [ 174.05, -41.11 ], [ 174, -40.97 ], [ 174.32, -40.99 ], [ 174.2, -41.18 ], [ 173.91, -41.28 ], [ 174.32, -41.21 ], [ 174.03, -41.44 ], [ 174.28, -41.74 ], [ 173.32, -42.88 ], [ 172.71, -43.26 ], [ 172.81, -43.59 ], [ 172.66, -43.67 ], [ 172.86, -43.6 ], [ 173.13, -43.75 ], [ 172.95, -43.87 ] ] ], [ [ [ -140.13, -9.38 ], [ -140.02, -9.36 ], [ -140.05, -9.47 ], [ -140.13, -9.38 ] ] ], [ [ [ -74.15, -44.77 ], [ -74.34, -44.78 ], [ -74.11, -44.73 ], [ -74.4, -44.62 ], [ -73.87, -44.65 ], [ -74.15, -44.77 ] ] ], [ [ [ 173.04, 1.81 ], [ 172.99, 1.71 ], [ 172.91, 1.95 ], [ 173.04, 1.81 ] ] ], [ [ [ -17.11, 28.08 ], [ -17.27, 28.03 ], [ -17.32, 28.2 ], [ -17.11, 28.08 ] ] ], [ [ [ 146.29, -18.33 ], [ 146.3, -18.49 ], [ 146.07, -18.25 ], [ 146.23, -18.29 ], [ 146.23, -18.2 ], [ 146.29, -18.33 ] ] ], [ [ [ 120.89, 13.5 ], [ 121.2, 13.44 ], [ 121.56, 13.12 ], [ 121.56, 12.61 ], [ 121.24, 12.21 ], [ 120.93, 12.5 ], [ 120.65, 13.19 ], [ 120.3, 13.44 ], [ 120.89, 13.5 ] ] ], [ [ [ -14.22, 28.22 ], [ -14.02, 28.72 ], [ -13.87, 28.75 ], [ -13.93, 28.24 ], [ -14.51, 28.07 ], [ -14.22, 28.22 ] ] ], [ [ [ -169.92, -19.06 ], [ -169.81, -18.96 ], [ -169.84, -19.15 ], [ -169.92, -19.06 ] ] ], [ [ [ 22.71, 70.61 ], [ 22.7, 70.76 ], [ 23.01, 70.65 ], [ 23.06, 70.82 ], [ 23.45, 70.83 ], [ 22.82, 70.51 ], [ 22.09, 70.48 ], [ 22.31, 70.6 ], [ 21.93, 70.64 ], [ 22.52, 70.72 ], [ 22.71, 70.61 ] ] ], [ [ [ 1.38, 38.64 ], [ 1.43, 38.77 ], [ 1.58, 38.67 ], [ 1.38, 38.64 ] ] ], [ [ [ 4.28, 39.81 ], [ 3.79, 40.02 ], [ 4.17, 40.06 ], [ 4.28, 39.81 ] ] ], [ [ [ -53.74, 48.11 ], [ -53.88, 48.1 ], [ -53.95, 48.21 ], [ -53.72, 48.15 ], [ -53.52, 48.2 ], [ -53.74, 48.11 ] ] ], [ [ [ 8.45, 39.66 ], [ 8.48, 40.28 ], [ 8.31, 40.6 ], [ 8.15, 40.58 ], [ 8.18, 40.94 ], [ 8.56, 40.83 ], [ 9.24, 41.26 ], [ 9.66, 41 ], [ 9.49, 40.92 ], [ 9.73, 40.84 ], [ 9.83, 40.53 ], [ 9.62, 40.25 ], [ 9.74, 40.08 ], [ 9.56, 39.13 ], [ 9.06, 39.22 ], [ 9.02, 38.98 ], [ 8.64, 38.86 ], [ 8.37, 39.21 ], [ 8.45, 39.66 ] ] ], [ [ [ 10.3, 42.82 ], [ 10.42, 42.87 ], [ 10.43, 42.71 ], [ 10.1, 42.77 ], [ 10.3, 42.82 ] ] ], [ [ [ -77.57, 21.93 ], [ -77.45, 21.8 ], [ -77.6, 21.82 ], [ -77.57, 21.93 ] ] ], [ [ [ -66.75, 44.68 ], [ -66.9, 44.6 ], [ -66.78, 44.8 ], [ -66.75, 44.68 ] ] ], [ [ [ 130.61, 32.75 ], [ 130.25, 33.2 ], [ 130.12, 32.88 ], [ 130.33, 32.86 ], [ 130.36, 32.68 ], [ 130.17, 32.59 ], [ 130.08, 32.79 ], [ 129.74, 32.57 ], [ 129.87, 32.75 ], [ 129.63, 32.93 ], [ 129.68, 33.1 ], [ 129.79, 32.87 ], [ 130, 32.84 ], [ 129.55, 33.22 ], [ 129.57, 33.38 ], [ 129.86, 33.28 ], [ 129.85, 33.56 ], [ 130.02, 33.45 ], [ 130.21, 33.67 ], [ 130.39, 33.6 ], [ 130.29, 33.69 ], [ 130.68, 33.94 ], [ 130.8, 33.87 ], [ 131.02, 33.96 ], [ 131.1, 33.62 ], [ 131.67, 33.67 ], [ 131.74, 33.47 ], [ 131.51, 33.27 ], [ 131.9, 33.27 ], [ 131.8, 33.13 ], [ 132.09, 32.93 ], [ 131.69, 32.56 ], [ 131.35, 31.37 ], [ 131.11, 31.48 ], [ 131.01, 31.36 ], [ 131.13, 31.28 ], [ 130.66, 30.99 ], [ 130.8, 31.34 ], [ 130.59, 31.59 ], [ 130.77, 31.56 ], [ 130.8, 31.7 ], [ 130.63, 31.71 ], [ 130.51, 31.49 ], [ 130.59, 31.16 ], [ 130.11, 31.41 ], [ 130.33, 31.56 ], [ 130.18, 32.11 ], [ 130.49, 32.3 ], [ 130.66, 32.63 ], [ 130.45, 32.62 ], [ 130.61, 32.75 ] ] ], [ [ [ 130.08, 32.22 ], [ 129.97, 32.24 ], [ 130.01, 32.53 ], [ 130.18, 32.55 ], [ 130.08, 32.22 ] ] ], [ [ [ 129.47, 33.35 ], [ 129.56, 33.41 ], [ 129.37, 33.17 ], [ 129.47, 33.35 ] ] ], [ [ [ 129.35, 34.28 ], [ 129.17, 34.1 ], [ 129.2, 34.33 ], [ 129.35, 34.28 ] ] ], [ [ [ 129.4, 34.48 ], [ 129.35, 34.3 ], [ 129.23, 34.36 ], [ 129.45, 34.71 ], [ 129.4, 34.48 ] ] ], [ [ [ 128.66, 32.72 ], [ 128.81, 32.8 ], [ 128.9, 32.65 ], [ 128.64, 32.59 ], [ 128.66, 32.72 ] ] ], [ [ [ 124.14, 24.35 ], [ 124.08, 24.45 ], [ 124.34, 24.61 ], [ 124.14, 24.35 ] ] ], [ [ [ 125.3, 24.73 ], [ 125.27, 24.92 ], [ 125.47, 24.72 ], [ 125.3, 24.73 ] ] ], [ [ [ 127.83, 26.18 ], [ 127.66, 26.08 ], [ 127.71, 26.44 ], [ 127.98, 26.58 ], [ 127.88, 26.71 ], [ 128.12, 26.66 ], [ 128.26, 26.87 ], [ 128.25, 26.65 ], [ 127.83, 26.43 ], [ 127.83, 26.18 ] ] ], [ [ [ 123.8, 24.42 ], [ 123.94, 24.36 ], [ 123.88, 24.26 ], [ 123.66, 24.31 ], [ 123.8, 24.42 ] ] ], [ [ [ 138.84, 34.61 ], [ 138.76, 34.97 ], [ 138.91, 35.05 ], [ 138.78, 35.13 ], [ 138.36, 34.91 ], [ 138.23, 34.59 ], [ 137.58, 34.68 ], [ 137.02, 34.58 ], [ 137.35, 34.73 ], [ 137.3, 34.81 ], [ 136.95, 34.82 ], [ 136.98, 34.96 ], [ 136.91, 34.77 ], [ 136.98, 34.7 ], [ 136.86, 34.74 ], [ 136.87, 35.09 ], [ 136.52, 34.69 ], [ 136.92, 34.44 ], [ 136.9, 34.28 ], [ 136.66, 34.35 ], [ 136.32, 34.2 ], [ 135.76, 33.43 ], [ 135.06, 33.88 ], [ 135.21, 34.15 ], [ 135.07, 34.3 ], [ 135.47, 34.58 ], [ 135.34, 34.73 ], [ 135.05, 34.62 ], [ 134.47, 34.81 ], [ 133.95, 34.6 ], [ 133.93, 34.45 ], [ 133.49, 34.51 ], [ 133.37, 34.37 ], [ 133.25, 34.44 ], [ 132.64, 34.2 ], [ 132.35, 34.36 ], [ 132.14, 33.83 ], [ 131.74, 34.07 ], [ 131.27, 33.92 ], [ 131.04, 34.06 ], [ 130.92, 33.94 ], [ 130.86, 34.11 ], [ 130.97, 34.44 ], [ 131.41, 34.43 ], [ 132.63, 35.29 ], [ 132.63, 35.44 ], [ 133.09, 35.6 ], [ 133.4, 35.45 ], [ 134.54, 35.67 ], [ 134.91, 35.61 ], [ 135.22, 35.78 ], [ 135.3, 35.66 ], [ 135.15, 35.56 ], [ 135.32, 35.45 ], [ 135.46, 35.6 ], [ 135.72, 35.48 ], [ 136.02, 35.76 ], [ 136.07, 35.66 ], [ 135.96, 36 ], [ 136.71, 36.77 ], [ 136.76, 37.36 ], [ 137.35, 37.52 ], [ 136.86, 37.11 ], [ 137.06, 37.11 ], [ 136.99, 36.86 ], [ 137.22, 36.75 ], [ 138.54, 37.37 ], [ 138.84, 37.82 ], [ 139.37, 38.1 ], [ 139.83, 38.91 ], [ 140.06, 39.73 ], [ 139.69, 40 ], [ 139.86, 39.98 ], [ 140.03, 40.22 ], [ 139.86, 40.61 ], [ 140.25, 40.8 ], [ 140.34, 41.26 ], [ 140.63, 41.19 ], [ 140.73, 40.83 ], [ 140.88, 41.01 ], [ 141.11, 40.87 ], [ 141.21, 40.95 ], [ 141.2, 41.29 ], [ 140.76, 41.15 ], [ 140.92, 41.55 ], [ 141.27, 41.35 ], [ 141.47, 41.43 ], [ 141.43, 40.7 ], [ 141.82, 40.27 ], [ 142.07, 39.55 ], [ 141.92, 39.1 ], [ 141.62, 39 ], [ 141.67, 38.86 ], [ 141.44, 38.67 ], [ 141.52, 38.27 ], [ 141.43, 38.4 ], [ 141.08, 38.38 ], [ 140.94, 38.13 ], [ 140.98, 37 ], [ 140.56, 36.28 ], [ 140.88, 35.73 ], [ 140.53, 35.6 ], [ 140.38, 35.19 ], [ 139.89, 34.9 ], [ 139.75, 34.97 ], [ 139.78, 35.31 ], [ 140.13, 35.57 ], [ 139.76, 35.65 ], [ 139.68, 35.14 ], [ 139.54, 35.31 ], [ 139.15, 35.24 ], [ 139.14, 34.89 ], [ 138.84, 34.61 ] ] ], [ [ [ 135.02, 34.59 ], [ 134.95, 34.27 ], [ 134.73, 34.19 ], [ 134.66, 34.29 ], [ 135.02, 34.59 ] ] ], [ [ [ 133.31, 36.17 ], [ 133.18, 36.21 ], [ 133.28, 36.35 ], [ 133.31, 36.17 ] ] ], [ [ [ 129.21, 28.08 ], [ 129.21, 28.2 ], [ 129.35, 28.11 ], [ 129.21, 28.08 ] ] ], [ [ [ 130.52, 30.23 ], [ 130.38, 30.38 ], [ 130.5, 30.47 ], [ 130.67, 30.38 ], [ 130.52, 30.23 ] ] ], [ [ [ 128.91, 27.7 ], [ 128.97, 27.89 ], [ 129.04, 27.76 ], [ 128.91, 27.7 ] ] ], [ [ [ 129.54, 28.45 ], [ 129.72, 28.46 ], [ 129.38, 28.11 ], [ 129.13, 28.25 ], [ 129.54, 28.45 ] ] ], [ [ [ -16.16, 11.88 ], [ -15.98, 11.88 ], [ -16.08, 11.76 ], [ -16.16, 11.88 ] ] ], [ [ [ 138.22, 37.81 ], [ 138.24, 38.08 ], [ 138.51, 38.33 ], [ 138.5, 37.92 ], [ 138.22, 37.81 ] ] ], [ [ [ 134.19, 34.49 ], [ 134.37, 34.56 ], [ 134.34, 34.43 ], [ 134.19, 34.49 ] ] ], [ [ [ 143.24, 41.94 ], [ 141.7, 42.66 ], [ 141, 42.3 ], [ 140.71, 42.58 ], [ 140.48, 42.59 ], [ 140.29, 42.25 ], [ 141.19, 41.8 ], [ 140.97, 41.71 ], [ 140.64, 41.82 ], [ 140.2, 41.4 ], [ 139.99, 41.55 ], [ 140.13, 41.97 ], [ 139.77, 42.26 ], [ 139.82, 42.61 ], [ 140.52, 42.99 ], [ 140.35, 43.33 ], [ 141.16, 43.14 ], [ 141.42, 43.33 ], [ 141.33, 43.72 ], [ 141.65, 43.94 ], [ 141.79, 44.62 ], [ 141.57, 45.23 ], [ 141.64, 45.45 ], [ 141.94, 45.52 ], [ 142.99, 44.56 ], [ 143.62, 44.23 ], [ 144.24, 44.11 ], [ 144.35, 43.96 ], [ 144.8, 43.93 ], [ 145.34, 44.34 ], [ 145.07, 43.75 ], [ 145.34, 43.59 ], [ 145.19, 43.62 ], [ 145.4, 43.29 ], [ 145.82, 43.39 ], [ 144.97, 42.98 ], [ 144.8, 43.06 ], [ 144.78, 42.93 ], [ 144.28, 43 ], [ 143.93, 42.88 ], [ 143.43, 42.48 ], [ 143.24, 41.94 ] ] ], [ [ [ -54, 49.67 ], [ -54.32, 49.58 ], [ -54.27, 49.73 ], [ -54, 49.67 ] ] ], [ [ [ -54.85, 49.51 ], [ -54.9, 49.6 ], [ -54.55, 49.65 ], [ -54.85, 49.51 ] ] ], [ [ [ -58.03, 48.97 ], [ -57.87, 48.95 ], [ -58.15, 49.13 ], [ -57.85, 49.18 ], [ -58.11, 49.15 ], [ -57.92, 49.25 ], [ -58.2, 49.23 ], [ -58.23, 49.39 ], [ -57.99, 49.56 ], [ -57.7, 49.45 ], [ -57.97, 49.68 ], [ -57.37, 50.6 ], [ -57.16, 50.62 ], [ -57.41, 50.7 ], [ -56.94, 50.93 ], [ -57.1, 51.02 ], [ -55.91, 51.63 ], [ -55.65, 51.47 ], [ -55.74, 51.59 ], [ -55.42, 51.59 ], [ -55.59, 51.3 ], [ -56.1, 51.34 ], [ -56.05, 51.15 ], [ -55.72, 51.19 ], [ -55.89, 50.86 ], [ -56.1, 50.72 ], [ -56.11, 50.92 ], [ -56.5, 50.79 ], [ -56.16, 50.87 ], [ -56.11, 50.67 ], [ -56.7, 50.13 ], [ -56.87, 49.55 ], [ -56.16, 50.16 ], [ -56.19, 49.93 ], [ -56.02, 50.04 ], [ -55.47, 49.97 ], [ -56.14, 49.7 ], [ -56.19, 49.57 ], [ -55.89, 49.72 ], [ -56, 49.57 ], [ -55.82, 49.61 ], [ -56.14, 49.42 ], [ -55.69, 49.56 ], [ -55.9, 49.46 ], [ -55.69, 49.38 ], [ -55.54, 49.49 ], [ -55.59, 49.36 ], [ -55.37, 49.5 ], [ -55.49, 49.33 ], [ -55.32, 49.41 ], [ -55.32, 49.3 ], [ -55.25, 49.4 ], [ -55.34, 49.54 ], [ -55.16, 49.54 ], [ -55.33, 49.08 ], [ -55.1, 49.36 ], [ -55.04, 49.22 ], [ -54.85, 49.42 ], [ -54.84, 49.27 ], [ -54.47, 49.57 ], [ -54.64, 49.38 ], [ -54.45, 49.48 ], [ -54.52, 49.26 ], [ -54.06, 49.48 ], [ -53.46, 49.26 ], [ -53.6, 49.04 ], [ -53.88, 49.04 ], [ -53.82, 48.93 ], [ -54.21, 48.8 ], [ -53.83, 48.83 ], [ -54.05, 48.74 ], [ -53.97, 48.62 ], [ -53.85, 48.76 ], [ -53.62, 48.68 ], [ -54.2, 48.39 ], [ -53.83, 48.48 ], [ -53.9, 48.35 ], [ -53.65, 48.54 ], [ -53.68, 48.38 ], [ -53.45, 48.63 ], [ -53.26, 48.52 ], [ -53.03, 48.65 ], [ -53.21, 48.35 ], [ -53.37, 48.4 ], [ -53.39, 48.27 ], [ -53.61, 48.26 ], [ -53.64, 48.17 ], [ -53.94, 48.24 ], [ -53.99, 48.18 ], [ -53.93, 48.08 ], [ -53.68, 48.06 ], [ -53.94, 48.01 ], [ -53.61, 48.05 ], [ -53.8, 47.77 ], [ -53.94, 47.85 ], [ -53.66, 47.51 ], [ -53.3, 48.01 ], [ -52.85, 48.1 ], [ -53.29, 47.6 ], [ -53.13, 47.39 ], [ -52.79, 47.81 ], [ -52.62, 47.52 ], [ -53.07, 46.66 ], [ -53.35, 46.77 ], [ -53.62, 46.64 ], [ -53.51, 46.98 ], [ -53.66, 46.99 ], [ -53.4, 47.18 ], [ -53.55, 47.22 ], [ -54.2, 46.82 ], [ -53.79, 47.44 ], [ -53.94, 47.45 ], [ -53.99, 47.85 ], [ -54.27, 47.93 ], [ -54.44, 47.42 ], [ -54.61, 47.36 ], [ -54.43, 47.62 ], [ -55.06, 47.15 ], [ -55.1, 47.2 ], [ -55.33, 47.11 ], [ -55.09, 47.16 ], [ -55.26, 46.92 ], [ -55.74, 46.85 ], [ -55.97, 47 ], [ -55.19, 47.2 ], [ -55.36, 47.24 ], [ -55.3, 47.39 ], [ -54.72, 47.67 ], [ -55.09, 47.59 ], [ -54.94, 47.81 ], [ -55.12, 47.58 ], [ -55.12, 47.7 ], [ -55.44, 47.73 ], [ -55.58, 47.4 ], [ -55.58, 47.58 ], [ -55.94, 47.44 ], [ -55.73, 47.62 ], [ -56.16, 47.48 ], [ -55.62, 47.68 ], [ -55.93, 47.66 ], [ -55.6, 48 ], [ -56.05, 47.7 ], [ -55.99, 47.85 ], [ -56.11, 47.75 ], [ -56.18, 47.89 ], [ -56.17, 47.64 ], [ -56.35, 47.8 ], [ -56.32, 47.63 ], [ -56.6, 47.75 ], [ -56.53, 47.62 ], [ -56.77, 47.66 ], [ -56.81, 47.53 ], [ -56.84, 47.66 ], [ -56.87, 47.54 ], [ -57.14, 47.58 ], [ -57.18, 47.71 ], [ -57.34, 47.59 ], [ -57.28, 47.88 ], [ -57.4, 47.62 ], [ -57.58, 47.65 ], [ -57.5, 47.73 ], [ -57.66, 47.6 ], [ -57.72, 47.75 ], [ -57.78, 47.62 ], [ -57.91, 47.75 ], [ -58.36, 47.65 ], [ -58.33, 47.8 ], [ -58.42, 47.64 ], [ -58.54, 47.73 ], [ -59.22, 47.58 ], [ -59.4, 47.92 ], [ -58.28, 48.51 ], [ -59.22, 48.55 ], [ -58.76, 48.79 ], [ -58.97, 48.63 ], [ -58.71, 48.56 ], [ -58.37, 49.15 ], [ -58.03, 48.97 ] ] ], [ [ [ 20.67, 38.83 ], [ 20.72, 38.63 ], [ 20.54, 38.56 ], [ 20.67, 38.83 ] ] ], [ [ [ 25.94, 38.59 ], [ 26.16, 38.55 ], [ 26.01, 38.15 ], [ 25.86, 38.24 ], [ 25.94, 38.59 ] ] ], [ [ [ -73.59, -44.72 ], [ -73.74, -44.75 ], [ -73.88, -44.59 ], [ -73.62, -44.55 ], [ -73.72, -44.73 ], [ -73.59, -44.72 ] ] ], [ [ [ -73.99, -44.23 ], [ -74.02, -44.14 ], [ -73.85, -44.22 ], [ -74.04, -44.23 ], [ -73.99, -44.34 ], [ -74.1, -44.19 ], [ -73.99, -44.23 ] ] ], [ [ [ 125.93, 9.66 ], [ 125.94, 9.76 ], [ 125.94, 9.56 ], [ 125.93, 9.66 ] ] ], [ [ [ 151.79, 46.77 ], [ 151.72, 46.85 ], [ 152.29, 47.15 ], [ 151.79, 46.77 ] ] ], [ [ [ 55.53, -4.73 ], [ 55.37, -4.64 ], [ 55.43, -4.56 ], [ 55.53, -4.73 ] ] ], [ [ [ 14.38, 44.63 ], [ 14.34, 44.71 ], [ 14.46, 44.54 ], [ 14.38, 44.63 ] ] ], [ [ [ -130.27, 54.85 ], [ -130.49, 54.83 ], [ -130.19, 55.03 ], [ -130.27, 54.85 ] ] ], [ [ [ -128.15, 51.66 ], [ -127.92, 51.61 ], [ -127.9, 51.42 ], [ -128.15, 51.66 ] ] ], [ [ [ -101.68, 68.75 ], [ -101.81, 68.56 ], [ -102.33, 68.7 ], [ -101.97, 68.83 ], [ -101.68, 68.75 ] ] ], [ [ [ -127.66, 52.27 ], [ -127.23, 52.42 ], [ -127.9, 51.93 ], [ -127.66, 52.27 ] ] ], [ [ [ -128.11, 51.84 ], [ -128.02, 51.95 ], [ -128.13, 51.96 ], [ -128.17, 51.85 ], [ -128.25, 51.89 ], [ -127.99, 52.08 ], [ -127.96, 51.95 ], [ -128.08, 51.79 ], [ -128.11, 51.84 ] ] ], [ [ [ -128.16, 52.77 ], [ -128.29, 52.59 ], [ -128.35, 52.78 ], [ -128.16, 52.77 ] ] ], [ [ [ -129.1, 53.49 ], [ -129.17, 53.38 ], [ -129.18, 53.63 ], [ -128.84, 53.71 ], [ -129.1, 53.49 ] ] ], [ [ [ -129.08, 52.52 ], [ -129.28, 52.83 ], [ -128.93, 52.61 ], [ -128.97, 52.45 ], [ -129.08, 52.52 ] ] ], [ [ [ -128.52, 52.59 ], [ -128.5, 52.43 ], [ -128.83, 52.51 ], [ -128.55, 52.68 ], [ -128.52, 52.59 ] ] ], [ [ [ -128.7, 53.16 ], [ -128.52, 52.9 ], [ -128.76, 52.6 ], [ -128.66, 52.97 ], [ -128.89, 52.65 ], [ -129.14, 52.85 ], [ -128.9, 53.03 ], [ -129.11, 52.9 ], [ -129.2, 53 ], [ -129.06, 53.21 ], [ -128.89, 53.16 ], [ -129.08, 53.29 ], [ -128.7, 53.16 ] ] ], [ [ [ -130.7, 53.91 ], [ -130.64, 53.83 ], [ -130.72, 53.94 ], [ -130.42, 54.1 ], [ -130.23, 53.98 ], [ -130.34, 53.83 ], [ -130.52, 53.87 ], [ -130.47, 53.89 ], [ -130.41, 53.97 ], [ -130.34, 53.96 ], [ -130.41, 54.03 ], [ -130.49, 53.88 ], [ -130.56, 53.9 ], [ -130.64, 53.96 ], [ -130.7, 53.91 ] ] ], [ [ [ -129.9, 53.17 ], [ -130.54, 53.63 ], [ -129.93, 53.41 ], [ -129.9, 53.17 ] ] ], [ [ [ -129.33, 53.22 ], [ -129.23, 53.32 ], [ -129.15, 53.1 ], [ -129.33, 53.22 ] ] ], [ [ [ -130.28, 53.8 ], [ -130.08, 53.56 ], [ -130.41, 53.67 ], [ -130.28, 53.8 ] ] ], [ [ [ -129.47, 53.38 ], [ -129.59, 53.21 ], [ -130.26, 53.89 ], [ -129.47, 53.38 ] ] ], [ [ [ -17.95, 27.72 ], [ -18.16, 27.72 ], [ -17.92, 27.85 ], [ -17.95, 27.72 ] ] ], [ [ [ 121.87, -10.43 ], [ 121.99, -10.55 ], [ 121.68, -10.58 ], [ 121.87, -10.43 ] ] ], [ [ [ -126.52, 50.65 ], [ -126.6, 50.7 ], [ -126.33, 50.83 ], [ -126.16, 50.76 ], [ -126.52, 50.65 ] ] ], [ [ [ -126.42, 50.52 ], [ -126.68, 50.55 ], [ -126.21, 50.58 ], [ -126.42, 50.52 ] ] ], [ [ [ -125.4, 50.3 ], [ -125.28, 50.44 ], [ -125.16, 50.39 ], [ -125.4, 50.3 ] ] ], [ [ [ -126.08, 49.37 ], [ -126.05, 49.26 ], [ -126.23, 49.28 ], [ -126.08, 49.37 ] ] ], [ [ [ -126.63, 49.66 ], [ -126.83, 49.62 ], [ -126.95, 49.73 ], [ -126.74, 49.8 ], [ -126.97, 49.83 ], [ -126.67, 49.86 ], [ -126.63, 49.66 ] ] ], [ [ [ -133, 53.74 ], [ -133.09, 54.18 ], [ -132.58, 54.12 ], [ -132.67, 53.94 ], [ -132.44, 54.1 ], [ -132.18, 54.02 ], [ -132.13, 53.84 ], [ -132.67, 53.68 ], [ -132.35, 53.68 ], [ -132.48, 53.56 ], [ -132.14, 53.7 ], [ -132.09, 53.9 ], [ -132.2, 54.05 ], [ -131.64, 54.19 ], [ -131.97, 53.28 ], [ -132.33, 53.23 ], [ -132.15, 53.17 ], [ -132.47, 53.14 ], [ -132.5, 53.29 ], [ -132.72, 53.25 ], [ -132.55, 53.33 ], [ -132.72, 53.38 ], [ -132.42, 53.34 ], [ -132.73, 53.54 ], [ -132.9, 53.47 ], [ -133, 53.74 ] ] ], [ [ [ -131.81, 52.87 ], [ -131.88, 53.04 ], [ -131.6, 52.96 ], [ -131.81, 52.87 ] ] ], [ [ [ -130.96, 52.07 ], [ -131.03, 51.94 ], [ -131.12, 52.15 ], [ -130.96, 52.07 ] ] ], [ [ [ -131.6, 52.66 ], [ -131.69, 52.73 ], [ -131.45, 52.71 ], [ -131.6, 52.66 ] ] ], [ [ [ -132.34, 53.05 ], [ -132.57, 53.1 ], [ -132.08, 53.15 ], [ -131.8, 53.25 ], [ -131.61, 53.03 ], [ -132.03, 53.06 ], [ -132.01, 52.88 ], [ -131.66, 52.81 ], [ -131.85, 52.7 ], [ -131.04, 52.16 ], [ -131.42, 52.21 ], [ -132.34, 53.05 ] ] ], [ [ [ 124, 11.07 ], [ 124.02, 10.38 ], [ 123.64, 10.08 ], [ 123.3, 9.42 ], [ 123.37, 9.99 ], [ 124.06, 11.29 ], [ 124, 11.07 ] ] ], [ [ [ -13.88, 28.89 ], [ -13.42, 29.21 ], [ -13.49, 28.99 ], [ -13.88, 28.89 ] ] ], [ [ [ 124.76, 9.21 ], [ 124.77, 9.08 ], [ 124.63, 9.18 ], [ 124.76, 9.21 ] ] ], [ [ [ 123.59, 12.64 ], [ 123.73, 12.61 ], [ 123.79, 12.34 ], [ 123.59, 12.64 ] ] ], [ [ [ 117.88, 4.19 ], [ 117.86, 4.03 ], [ 117.63, 4.22 ], [ 117.88, 4.19 ] ] ], [ [ [ -124.12, 44.28 ], [ -123.96, 45.57 ], [ -123.87, 45.5 ], [ -124.07, 46.23 ], [ -123.78, 46.08 ], [ -123.87, 46.19 ], [ -123.54, 46.24 ], [ -122.96, 46.11 ], [ -123.7, 46.31 ], [ -124.09, 46.26 ], [ -124.07, 46.65 ], [ -123.96, 46.36 ], [ -123.83, 46.71 ], [ -124.09, 46.74 ], [ -124.16, 46.91 ], [ -124.02, 46.83 ], [ -123.85, 46.96 ], [ -124.04, 47.06 ], [ -124.18, 46.93 ], [ -124.73, 48.38 ], [ -123.98, 48.16 ], [ -123.1, 48.18 ], [ -122.89, 47.99 ], [ -122.75, 48.14 ], [ -122.61, 47.89 ], [ -122.78, 47.69 ], [ -122.86, 47.82 ], [ -123.16, 47.35 ], [ -122.84, 47.43 ], [ -123.11, 47.38 ], [ -122.56, 47.82 ], [ -122.61, 47.94 ], [ -122.47, 47.75 ], [ -122.71, 47.61 ], [ -122.5, 47.51 ], [ -122.59, 47.34 ], [ -122.55, 47.29 ], [ -122.59, 47.25 ], [ -122.61, 47.3 ], [ -122.69, 47.28 ], [ -122.63, 47.41 ], [ -122.77, 47.17 ], [ -122.83, 47.41 ], [ -123.09, 47.1 ], [ -122.94, 47.18 ], [ -122.89, 47.05 ], [ -122.81, 47.18 ], [ -122.73, 47.05 ], [ -122.58, 47.19 ], [ -122.53, 47.28 ], [ -122.55, 47.32 ], [ -122.36, 47.26 ], [ -122.44, 47.66 ], [ -122.18, 48.05 ], [ -122.51, 48.36 ], [ -122.48, 48.75 ], [ -122.65, 48.72 ], [ -122.84, 49.09 ], [ -123.08, 48.97 ], [ -123.26, 49.21 ], [ -122.84, 49.28 ], [ -122.86, 49.45 ], [ -122.96, 49.3 ], [ -123.27, 49.33 ], [ -123.14, 49.71 ], [ -123.52, 49.39 ], [ -123.96, 49.51 ], [ -124.02, 49.75 ], [ -123.76, 49.48 ], [ -123.52, 49.71 ], [ -123.8, 49.62 ], [ -123.72, 49.79 ], [ -123.84, 49.69 ], [ -123.95, 49.78 ], [ -123.97, 49.98 ], [ -123.74, 50.09 ], [ -123.77, 50.21 ], [ -123.99, 50.21 ], [ -123.8, 50.09 ], [ -124.01, 50 ], [ -123.97, 49.8 ], [ -124.03, 49.93 ], [ -124.08, 49.8 ], [ -124.42, 49.77 ], [ -124.75, 49.96 ], [ -124.59, 50.24 ], [ -124.74, 50.33 ], [ -124.36, 50.49 ], [ -124.83, 50.31 ], [ -125.01, 50.45 ], [ -125.08, 50.33 ], [ -124.82, 50.93 ], [ -125.11, 50.43 ], [ -125.37, 50.57 ], [ -125.59, 50.45 ], [ -125.47, 50.72 ], [ -125.71, 50.42 ], [ -125.72, 50.53 ], [ -126.28, 50.52 ], [ -125.94, 50.64 ], [ -126.3, 50.63 ], [ -125.73, 50.66 ], [ -125.59, 51.09 ], [ -125.71, 50.72 ], [ -126.18, 50.67 ], [ -126.01, 50.8 ], [ -126.19, 50.78 ], [ -126.17, 50.88 ], [ -126.57, 50.83 ], [ -126.19, 50.92 ], [ -126.52, 51.04 ], [ -126.66, 50.87 ], [ -126.84, 50.91 ], [ -126.64, 50.93 ], [ -126.78, 51.02 ], [ -126.9, 50.89 ], [ -127.07, 51.01 ], [ -127.2, 50.92 ], [ -126.9, 50.89 ], [ -127.02, 50.82 ], [ -127.52, 51 ], [ -127.5, 51.1 ], [ -127.21, 50.95 ], [ -127.19, 51.02 ], [ -127.24, 51 ], [ -127.32, 51.04 ], [ -126.77, 51.07 ], [ -126.7, 50.99 ], [ -126.66, 51.2 ], [ -126.8, 51.08 ], [ -126.85, 51.08 ], [ -126.82, 51.1 ], [ -127.16, 51.05 ], [ -127.34, 51.06 ], [ -127.34, 51.04 ], [ -127.47, 51.09 ], [ -127.14, 51.06 ], [ -127.55, 51.13 ], [ -126.92, 51.19 ], [ -127.79, 51.16 ], [ -127.06, 51.35 ], [ -127.78, 51.32 ], [ -127.57, 51.47 ], [ -127.25, 51.41 ], [ -127.56, 51.48 ], [ -127.25, 51.68 ], [ -127.45, 51.66 ], [ -127.36, 51.87 ], [ -127.66, 51.52 ], [ -127.89, 51.69 ], [ -127.61, 52.12 ], [ -127.61, 52.03 ], [ -127.03, 52.31 ], [ -126.67, 51.96 ], [ -126.96, 52.31 ], [ -126.77, 52.39 ], [ -127.11, 52.33 ], [ -127.24, 52.45 ], [ -126.97, 52.84 ], [ -127.34, 52.42 ], [ -127.63, 52.61 ], [ -127.49, 52.34 ], [ -127.75, 52.27 ], [ -127.72, 52.36 ], [ -127.88, 52.2 ], [ -127.93, 52.35 ], [ -127.87, 52.36 ], [ -127.84, 52.34 ], [ -127.93, 52.44 ], [ -127.87, 52.5 ], [ -127.71, 52.45 ], [ -127.89, 52.5 ], [ -127.95, 52.45 ], [ -127.88, 52.37 ], [ -127.94, 52.36 ], [ -127.98, 52.31 ], [ -127.96, 52.48 ], [ -128.03, 52.32 ], [ -128.05, 52.65 ], [ -128.36, 52.27 ], [ -128.11, 52.76 ], [ -127.83, 52.73 ], [ -128.13, 52.77 ], [ -128.03, 52.92 ], [ -128.44, 52.82 ], [ -128.41, 53.09 ], [ -128.85, 53.27 ], [ -128.99, 53.54 ], [ -128.47, 53.32 ], [ -128.48, 53.43 ], [ -128.16, 53.46 ], [ -127.87, 53.25 ], [ -128.12, 53.48 ], [ -128.54, 53.43 ], [ -128.77, 53.55 ], [ -128.81, 53.77 ], [ -128.48, 53.83 ], [ -128.71, 53.88 ], [ -128.61, 54.03 ], [ -129.3, 53.65 ], [ -129.28, 53.36 ], [ -130.07, 53.89 ], [ -129.9, 54.22 ], [ -130.13, 54.15 ], [ -130.24, 54.4 ], [ -130.49, 54.36 ], [ -130.43, 54.64 ], [ -129.98, 54.3 ], [ -129.98, 54.51 ], [ -130.11, 54.42 ], [ -130.39, 54.65 ], [ -129.9, 54.62 ], [ -130.22, 54.72 ], [ -130.18, 54.85 ], [ -129.72, 54.98 ], [ -129.99, 55.06 ], [ -129.46, 55.48 ], [ -129.7, 55.41 ], [ -129.81, 55.63 ], [ -129.78, 55.36 ], [ -130.11, 54.98 ], [ -129.94, 55.29 ], [ -130.14, 55.75 ], [ -130.01, 55.92 ], [ -130.18, 55.76 ], [ -130, 55.28 ], [ -130.48, 54.84 ], [ -130.65, 54.97 ], [ -130.72, 54.77 ], [ -130.75, 54.96 ], [ -130.85, 54.77 ], [ -131.01, 55.05 ], [ -130.66, 55.02 ], [ -130.48, 55.34 ], [ -130.75, 55.1 ], [ -131.07, 55.12 ], [ -130.61, 55.4 ], [ -130.87, 55.31 ], [ -130.65, 55.65 ], [ -130.87, 55.56 ], [ -130.7, 55.75 ], [ -130.91, 55.72 ], [ -131.22, 55.98 ], [ -131.03, 56.1 ], [ -131.84, 55.95 ], [ -131.95, 55.5 ], [ -132.19, 55.59 ], [ -132.29, 55.76 ], [ -132.01, 55.78 ], [ -131.97, 56.17 ], [ -131.46, 56.23 ], [ -131.9, 56.23 ], [ -132.18, 56.38 ], [ -132.36, 56.54 ], [ -132.22, 56.69 ], [ -132.56, 56.71 ], [ -132.36, 56.84 ], [ -132.56, 56.76 ], [ -132.94, 56.98 ], [ -132.82, 57.12 ], [ -133, 57.01 ], [ -133.15, 57.17 ], [ -133.58, 57.18 ], [ -133.06, 57.35 ], [ -133.46, 57.36 ], [ -133.34, 57.59 ], [ -133.62, 57.58 ], [ -133.65, 57.72 ], [ -132.83, 57.51 ], [ -133.6, 57.77 ], [ -133.58, 57.92 ], [ -133.1, 57.83 ], [ -133.16, 57.93 ], [ -133.59, 57.93 ], [ -133.68, 57.79 ], [ -133.85, 57.95 ], [ -133.57, 58.03 ], [ -133.76, 58.03 ], [ -133.67, 58.15 ], [ -133.89, 57.97 ], [ -134.05, 58.06 ], [ -133.93, 58.5 ], [ -134.15, 58.2 ], [ -134.77, 58.39 ], [ -134.99, 58.68 ], [ -134.95, 58.82 ], [ -134.75, 58.77 ], [ -134.95, 58.96 ], [ -135.02, 58.73 ], [ -135.15, 58.84 ], [ -135.34, 59.48 ], [ -135.55, 59.32 ], [ -135.31, 59.08 ], [ -135.82, 59.34 ], [ -135.38, 59.1 ], [ -135.09, 58.24 ], [ -135.5, 58.5 ], [ -135.47, 58.38 ], [ -135.92, 58.38 ], [ -136.09, 58.82 ], [ -135.76, 58.88 ], [ -136.06, 58.85 ], [ -136.37, 59.09 ], [ -136.18, 58.75 ], [ -137.07, 59.05 ], [ -136.92, 58.93 ], [ -137.13, 58.84 ], [ -136.56, 58.83 ], [ -136.35, 58.69 ], [ -136.53, 58.6 ], [ -136.31, 58.67 ], [ -136.07, 58.47 ], [ -136.28, 58.31 ], [ -136.52, 58.45 ], [ -136.37, 58.3 ], [ -136.6, 58.36 ], [ -136.67, 58.21 ], [ -138.39, 59.11 ], [ -139.86, 59.54 ], [ -139.47, 59.7 ], [ -139.49, 59.99 ], [ -139.3, 59.56 ], [ -139.3, 59.82 ], [ -138.92, 59.8 ], [ -139.54, 60.04 ], [ -140.31, 59.69 ], [ -141.46, 59.9 ], [ -141.15, 60.17 ], [ -141.6, 60.17 ], [ -141.37, 60.02 ], [ -141.61, 59.96 ], [ -142.67, 60.1 ], [ -144.25, 60.02 ], [ -144.01, 60.04 ], [ -144.23, 60.18 ], [ -145.95, 60.46 ], [ -145.59, 60.68 ], [ -146.25, 60.62 ], [ -146.05, 60.8 ], [ -146.65, 60.69 ], [ -146.05, 60.83 ], [ -146.64, 60.82 ], [ -146.66, 61.07 ], [ -145.92, 61.06 ], [ -146.65, 61.16 ], [ -146.98, 60.93 ], [ -147.08, 61.16 ], [ -147.38, 60.87 ], [ -147.53, 61.15 ], [ -147.6, 60.85 ], [ -147.73, 60.94 ], [ -147.88, 60.83 ], [ -148.07, 60.94 ], [ -147.73, 61.27 ], [ -148.07, 61.01 ], [ -148.14, 61.13 ], [ -148.41, 61.05 ], [ -148.16, 61.07 ], [ -148.34, 60.81 ], [ -148.51, 60.84 ], [ -148.72, 60.79 ], [ -148.45, 60.8 ], [ -148.68, 60.65 ], [ -148.36, 60.77 ], [ -148.43, 60.62 ], [ -148.23, 60.76 ], [ -148.19, 60.61 ], [ -148.33, 60.53 ], [ -148.4, 60.59 ], [ -148.57, 60.55 ], [ -148.71, 60.44 ], [ -148.45, 60.55 ], [ -148.28, 60.43 ], [ -148.1, 60.6 ], [ -147.94, 60.44 ], [ -148.41, 60.28 ], [ -148.45, 60.18 ], [ -148.09, 60.21 ], [ -148.34, 60.19 ], [ -148.43, 59.95 ], [ -149.09, 59.96 ], [ -149.07, 60.06 ], [ -149.29, 59.87 ], [ -149.36, 60.11 ], [ -149.6, 60.19 ], [ -149.41, 60.12 ], [ -149.52, 59.7 ], [ -149.72, 59.96 ], [ -149.74, 59.64 ], [ -150.07, 59.85 ], [ -149.92, 59.69 ], [ -150.25, 59.49 ], [ -150.23, 59.75 ], [ -150.96, 59.2 ], [ -151.3, 59.31 ], [ -151.1, 59.22 ], [ -151.74, 59.16 ], [ -151.89, 59.42 ], [ -151.3, 59.41 ], [ -151.44, 59.54 ], [ -150.88, 59.81 ], [ -151.41, 59.6 ], [ -151.87, 59.77 ], [ -151.3, 60.39 ], [ -151.41, 60.72 ], [ -150.38, 61.04 ], [ -150.05, 60.86 ], [ -149.77, 60.97 ], [ -148.96, 60.82 ], [ -150.07, 61.15 ], [ -149.35, 61.47 ], [ -149.6, 61.5 ], [ -149.99, 61.24 ], [ -150.67, 61.27 ], [ -151.61, 60.97 ], [ -151.71, 60.72 ], [ -152.27, 60.54 ], [ -152.56, 60.22 ], [ -153.03, 60.3 ], [ -152.58, 60.08 ], [ -152.71, 59.92 ], [ -153.21, 59.87 ], [ -152.99, 59.81 ], [ -153.22, 59.64 ], [ -153.47, 59.8 ], [ -154.27, 59.14 ], [ -153.25, 58.85 ], [ -153.91, 58.61 ], [ -154, 58.38 ], [ -154.47, 58.28 ], [ -154.1, 58.28 ], [ -154.32, 58.08 ], [ -154.49, 58.2 ], [ -154.57, 58.02 ], [ -155.03, 58.02 ], [ -155.3, 57.73 ], [ -155.62, 57.79 ], [ -155.73, 57.54 ], [ -156.04, 57.57 ], [ -156.02, 57.43 ], [ -156.54, 57.33 ], [ -156.31, 57.3 ], [ -156.55, 56.98 ], [ -156.77, 57.04 ], [ -157.2, 56.76 ], [ -157.44, 56.86 ], [ -157.47, 56.62 ], [ -157.76, 56.68 ], [ -158.13, 56.55 ], [ -157.86, 56.47 ], [ -158.41, 56.45 ], [ -158.64, 56.26 ], [ -158.11, 56.24 ], [ -158.49, 56.11 ], [ -158.42, 56 ], [ -158.62, 56.2 ], [ -158.67, 55.95 ], [ -158.84, 56.03 ], [ -159.41, 55.79 ], [ -159.53, 55.89 ], [ -159.6, 55.57 ], [ -159.75, 55.86 ], [ -160.42, 55.66 ], [ -160.5, 55.48 ], [ -160.59, 55.61 ], [ -160.67, 55.46 ], [ -160.91, 55.53 ], [ -161.24, 55.36 ], [ -161.5, 55.36 ], [ -161.49, 55.49 ], [ -161.14, 55.54 ], [ -161.59, 55.62 ], [ -161.96, 55.11 ], [ -162.41, 55.03 ], [ -162.65, 55.3 ], [ -162.55, 54.96 ], [ -162.64, 55.06 ], [ -162.88, 54.93 ], [ -163.18, 55.13 ], [ -163.03, 54.95 ], [ -163.36, 54.81 ], [ -163.22, 54.93 ], [ -163.42, 55.07 ], [ -163, 55.25 ], [ -162.86, 55.18 ], [ -161.8, 55.89 ], [ -160.88, 56 ], [ -161.02, 55.9 ], [ -160.8, 55.71 ], [ -160.79, 55.89 ], [ -160.25, 55.77 ], [ -160.58, 55.91 ], [ -160.35, 56.28 ], [ -158.88, 56.89 ], [ -158.64, 56.79 ], [ -158.4, 57.23 ], [ -157.75, 57.55 ], [ -157.57, 57.48 ], [ -157.58, 58.13 ], [ -157.25, 58.2 ], [ -157.53, 58.39 ], [ -156.84, 59 ], [ -158.18, 58.61 ], [ -158.56, 58.84 ], [ -158.37, 59.03 ], [ -158.04, 58.94 ], [ -158.42, 59.07 ], [ -158.8, 58.73 ], [ -158.96, 58.78 ], [ -158.7, 58.49 ], [ -158.9, 58.39 ], [ -159.6, 58.95 ], [ -159.91, 58.77 ], [ -160.33, 59.08 ], [ -161.71, 58.55 ], [ -162.14, 58.63 ], [ -161.64, 58.8 ], [ -161.84, 59.03 ], [ -161.58, 59.11 ], [ -161.87, 59.06 ], [ -162.04, 59.23 ], [ -161.7, 59.5 ], [ -162.45, 60.29 ], [ -162.3, 60.42 ], [ -162.61, 60.33 ], [ -162.55, 59.98 ], [ -164.11, 59.83 ], [ -164.02, 60.02 ], [ -164.65, 60.26 ], [ -164.62, 60.37 ], [ -164.53, 60.39 ], [ -164.57, 60.46 ], [ -164.42, 60.48 ], [ -164.49, 60.56 ], [ -163.92, 60.79 ], [ -163.65, 60.59 ], [ -163.37, 60.85 ], [ -163.93, 60.86 ], [ -163.54, 60.9 ], [ -163.75, 61 ], [ -163.95, 60.86 ], [ -164.1, 60.87 ], [ -163.97, 60.89 ], [ -163.94, 60.93 ], [ -163.99, 61.05 ], [ -164.09, 60.87 ], [ -164.54, 60.85 ], [ -164.66, 60.96 ], [ -165.12, 60.92 ], [ -164.88, 61.13 ], [ -165.56, 61.09 ], [ -165.93, 61.41 ], [ -165.69, 61.48 ], [ -166.15, 61.51 ], [ -166.17, 61.65 ], [ -165.77, 61.69 ], [ -166.1, 61.81 ], [ -165.62, 61.84 ], [ -165.74, 62.08 ], [ -165.2, 62.47 ], [ -164.85, 62.53 ], [ -164.78, 62.34 ], [ -164.55, 62.42 ], [ -164.48, 62.56 ], [ -164.69, 62.47 ], [ -164.86, 62.55 ], [ -164.69, 63.02 ], [ -164.25, 62.96 ], [ -163.84, 62.49 ], [ -164.1, 62.83 ], [ -163.8, 62.92 ], [ -163.76, 63.02 ], [ -163.37, 63.04 ], [ -163.26, 62.97 ], [ -162.31, 63.54 ], [ -162.1, 63.42 ], [ -161.14, 63.5 ], [ -160.77, 63.83 ], [ -161.17, 64.41 ], [ -161.53, 64.41 ], [ -161.01, 64.5 ], [ -160.78, 64.72 ], [ -161.17, 64.93 ], [ -161.42, 64.76 ], [ -162.18, 64.68 ], [ -162.79, 64.32 ], [ -163.12, 64.66 ], [ -163.39, 64.58 ], [ -163.03, 64.52 ], [ -163.15, 64.4 ], [ -163.65, 64.57 ], [ -164.98, 64.54 ], [ -164.74, 64.47 ], [ -165.01, 64.43 ], [ -166.2, 64.58 ], [ -166.95, 65.16 ], [ -166.85, 65.28 ], [ -166.75, 65.11 ], [ -166.04, 65.25 ], [ -167.47, 65.42 ], [ -168.1, 65.68 ], [ -167.51, 65.73 ], [ -166.24, 66.17 ], [ -165.47, 66.13 ], [ -165.86, 66.22 ], [ -165.75, 66.32 ], [ -164.4, 66.58 ], [ -163.75, 66.55 ], [ -163.84, 66.26 ], [ -164.2, 66.19 ], [ -163.76, 66.06 ], [ -162.75, 66.1 ], [ -162.65, 65.98 ], [ -162.13, 66.08 ], [ -161.8, 65.97 ], [ -161.49, 66.26 ], [ -161.06, 66.23 ], [ -161.09, 66.11 ], [ -160.98, 66.23 ], [ -161.13, 66.34 ], [ -161.69, 66.4 ], [ -161.91, 66.27 ], [ -162.47, 66.95 ], [ -161.58, 66.44 ], [ -161.19, 66.54 ], [ -160.8, 66.37 ], [ -160.21, 66.41 ], [ -160.31, 66.65 ], [ -161.49, 66.53 ], [ -161.88, 66.72 ], [ -161.65, 67.02 ], [ -163.72, 67.12 ], [ -164.15, 67.62 ], [ -166.84, 68.34 ], [ -166.33, 68.44 ], [ -166.23, 68.87 ], [ -163.94, 68.99 ], [ -163.11, 69.33 ], [ -163.01, 69.76 ], [ -161.92, 70.29 ], [ -161.66, 70.24 ], [ -162.03, 70.1 ], [ -160.12, 70.61 ], [ -160.2, 70.34 ], [ -159.76, 70.2 ], [ -159.8, 70.49 ], [ -159.26, 70.51 ], [ -160.12, 70.6 ], [ -159.65, 70.79 ], [ -158.77, 70.91 ], [ -159.48, 70.78 ], [ -159.09, 70.66 ], [ -159.07, 70.82 ], [ -157.88, 70.85 ], [ -156.48, 71.39 ], [ -156.15, 71.15 ], [ -155.51, 71.1 ], [ -156.34, 70.92 ], [ -155.96, 70.9 ], [ -156, 70.75 ], [ -155.2, 70.79 ], [ -155.51, 70.94 ], [ -155.1, 71.15 ], [ -154.39, 70.76 ], [ -153.21, 70.92 ], [ -152.64, 70.74 ], [ -152.59, 70.88 ], [ -152.19, 70.81 ], [ -152.59, 70.63 ], [ -152.06, 70.58 ], [ -152.6, 70.54 ], [ -151.76, 70.55 ], [ -151.97, 70.43 ], [ -151.2, 70.35 ], [ -149.46, 70.52 ], [ -147.97, 70.22 ], [ -145.85, 70.16 ], [ -144.96, 69.96 ], [ -143.26, 70.12 ], [ -141.36, 69.63 ], [ -139.11, 69.5 ], [ -138.44, 69.19 ], [ -138.39, 69.3 ], [ -137.21, 68.93 ], [ -136.13, 68.87 ], [ -135.24, 68.64 ], [ -135.57, 68.88 ], [ -135.26, 68.93 ], [ -135.87, 69.28 ], [ -135.55, 69.18 ], [ -135.57, 69.33 ], [ -135.15, 69.25 ], [ -135.19, 69.45 ], [ -134.6, 69.39 ], [ -134.5, 69.7 ], [ -134.15, 69.51 ], [ -133.79, 69.57 ], [ -134.04, 69.25 ], [ -133.03, 69.46 ], [ -133.01, 69.36 ], [ -132.93, 69.64 ], [ -132, 69.7 ], [ -131.41, 69.96 ], [ -131.2, 69.8 ], [ -130.93, 70.09 ], [ -130.4, 70.15 ], [ -130.14, 70.01 ], [ -129.67, 70.25 ], [ -129.4, 70.11 ], [ -130.94, 69.53 ], [ -131.05, 69.62 ], [ -132.01, 69.52 ], [ -132.53, 69.13 ], [ -132.76, 69.26 ], [ -132.93, 69.12 ], [ -132.87, 68.96 ], [ -133.08, 69.07 ], [ -133.52, 68.84 ], [ -132.93, 68.67 ], [ -133.41, 68.84 ], [ -132.46, 68.79 ], [ -132.52, 68.9 ], [ -132.8, 68.83 ], [ -132.52, 68.99 ], [ -132.77, 68.93 ], [ -132.89, 69.05 ], [ -131.85, 69.3 ], [ -131.96, 69.21 ], [ -131.73, 69.38 ], [ -131.99, 69.39 ], [ -131.45, 69.43 ], [ -131.6, 69.29 ], [ -131.39, 69.44 ], [ -131.43, 69.3 ], [ -131.29, 69.5 ], [ -131.37, 69.29 ], [ -131.25, 69.57 ], [ -131.23, 69.3 ], [ -131.1, 69.59 ], [ -130.96, 69.13 ], [ -130.34, 69.68 ], [ -129.14, 69.84 ], [ -128.98, 69.66 ], [ -128.39, 69.94 ], [ -128.21, 69.85 ], [ -128.33, 70.13 ], [ -127.8, 70.04 ], [ -128.14, 70.16 ], [ -127.23, 70.15 ], [ -128.06, 70.28 ], [ -128.01, 70.57 ], [ -127.17, 70.23 ], [ -126.54, 69.65 ], [ -125.55, 69.32 ], [ -125.16, 69.42 ], [ -125.64, 69.41 ], [ -125.14, 69.48 ], [ -125.39, 69.68 ], [ -124.79, 69.71 ], [ -125.3, 69.81 ], [ -124.64, 69.98 ], [ -125.22, 70.01 ], [ -124.42, 70.03 ], [ -124.76, 70.11 ], [ -124.76, 70.18 ], [ -124.53, 70.2 ], [ -124.69, 70.14 ], [ -124.39, 70.14 ], [ -124.33, 70.05 ], [ -124.51, 69.71 ], [ -124.03, 69.68 ], [ -124.38, 69.33 ], [ -123.38, 69.4 ], [ -122.98, 69.83 ], [ -121.88, 69.82 ], [ -120, 69.35 ], [ -117.07, 68.88 ], [ -115.89, 68.81 ], [ -116.33, 68.96 ], [ -115.92, 69.01 ], [ -114.97, 68.87 ], [ -113.89, 68.4 ], [ -114, 68.24 ], [ -115.02, 68.29 ], [ -114.72, 68.18 ], [ -115.25, 68.19 ], [ -115.09, 68.01 ], [ -115.56, 67.92 ], [ -114.39, 67.72 ], [ -111.97, 67.75 ], [ -111.91, 67.63 ], [ -111.9, 67.76 ], [ -111.06, 67.76 ], [ -110.04, 68.01 ], [ -109.7, 67.72 ], [ -109.02, 67.72 ], [ -108.83, 67.35 ], [ -108.66, 67.64 ], [ -108.47, 67.35 ], [ -108.38, 67.45 ], [ -107.96, 67.28 ], [ -107.85, 67.04 ], [ -108.6, 67.16 ], [ -108.54, 67.06 ], [ -107.13, 66.33 ], [ -107.79, 66.78 ], [ -107.62, 67.08 ], [ -107.56, 66.84 ], [ -107.43, 66.99 ], [ -107.07, 66.82 ], [ -107.43, 67.06 ], [ -107, 67.14 ], [ -107.52, 67.21 ], [ -108.02, 67.78 ], [ -107.67, 68.05 ], [ -106.69, 68.1 ], [ -106.59, 68.26 ], [ -106.26, 68.18 ], [ -106.43, 68.34 ], [ -105.73, 68.41 ], [ -105.62, 68.64 ], [ -106.59, 68.53 ], [ -106.52, 68.29 ], [ -106.93, 68.43 ], [ -107.22, 68.26 ], [ -107.81, 68.35 ], [ -107.56, 68.17 ], [ -108.36, 68.12 ], [ -108.33, 68.35 ], [ -108.81, 68.27 ], [ -108.26, 68.63 ], [ -106.2, 68.95 ], [ -105.45, 68.75 ], [ -105.48, 68.42 ], [ -104.96, 68.22 ], [ -104.57, 68.25 ], [ -104.48, 68.02 ], [ -103.43, 68.17 ], [ -102.26, 67.7 ], [ -99.74, 67.86 ], [ -99.26, 67.7 ], [ -98.7, 67.81 ], [ -98.44, 67.71 ], [ -98.65, 68.13 ], [ -98.12, 67.74 ], [ -97.64, 67.58 ], [ -97.2, 67.66 ], [ -97.19, 67.64 ], [ -97.41, 67.59 ], [ -97.43, 67.58 ], [ -97.43, 67.55 ], [ -97.13, 67.44 ], [ -97.12, 67.46 ], [ -97.4, 67.55 ], [ -97.42, 67.57 ], [ -97.33, 67.6 ], [ -97.17, 67.63 ], [ -97.14, 67.68 ], [ -97.01, 67.67 ], [ -97.2, 67.95 ], [ -97.97, 67.99 ], [ -98.09, 67.84 ], [ -98.68, 68.4 ], [ -97.68, 68.36 ], [ -97.84, 68.56 ], [ -97.47, 68.41 ], [ -97.58, 68.51 ], [ -97.3, 68.51 ], [ -96.57, 68.18 ], [ -96.37, 68.32 ], [ -96.64, 68.09 ], [ -96.84, 68.12 ], [ -96.67, 67.99 ], [ -95.87, 68.3 ], [ -96.13, 67.63 ], [ -96.31, 67.71 ], [ -96.72, 67.24 ], [ -96.44, 67.52 ], [ -96.31, 67.41 ], [ -96.07, 67.48 ], [ -96.11, 67.22 ], [ -95.53, 67.38 ], [ -95.83, 67.16 ], [ -95.13, 67.29 ], [ -95.7, 67.73 ], [ -95.47, 68.06 ], [ -94.86, 68.01 ], [ -93.15, 68.68 ], [ -93.75, 68.62 ], [ -93.85, 69.02 ], [ -94.07, 68.76 ], [ -94.62, 68.75 ], [ -94.58, 68.98 ], [ -93.99, 69.16 ], [ -94.29, 69.16 ], [ -94.27, 69.32 ], [ -93.51, 69.44 ], [ -93.86, 69.26 ], [ -93.83, 69.16 ], [ -93.31, 69.39 ], [ -93.57, 69.37 ], [ -93.42, 69.48 ], [ -93.52, 69.54 ], [ -94.28, 69.44 ], [ -94.52, 69.73 ], [ -95.09, 69.6 ], [ -96.19, 69.87 ], [ -96.5, 70.13 ], [ -96.22, 70.57 ], [ -95.57, 70.47 ], [ -96.04, 70.61 ], [ -95.74, 70.72 ], [ -96.15, 70.62 ], [ -96.57, 70.78 ], [ -96.46, 71.27 ], [ -96.03, 71.42 ], [ -95.51, 71.29 ], [ -95.17, 71.52 ], [ -95.9, 71.61 ], [ -94.58, 71.86 ], [ -95.22, 71.85 ], [ -94.94, 71.98 ], [ -94.38, 71.95 ], [ -94.4, 71.67 ], [ -94.18, 71.8 ], [ -93.68, 71.77 ], [ -92.95, 71.35 ], [ -93, 70.85 ], [ -91.51, 70.18 ], [ -92.02, 70.13 ], [ -92.28, 70.28 ], [ -92.58, 70.08 ], [ -91.93, 70.02 ], [ -92.85, 69.71 ], [ -92.51, 69.71 ], [ -92.66, 69.66 ], [ -93, 69.69 ], [ -92.65, 69.66 ], [ -92.47, 69.7 ], [ -92.26, 69.67 ], [ -91.75, 69.47 ], [ -91.49, 69.66 ], [ -91.17, 69.65 ], [ -91.63, 69.52 ], [ -90.98, 69.53 ], [ -91.3, 69.41 ], [ -90.69, 69.55 ], [ -90.34, 69.47 ], [ -90.71, 69.46 ], [ -90.86, 69.25 ], [ -91.43, 69.36 ], [ -90.43, 68.88 ], [ -90.59, 68.46 ], [ -90.27, 68.23 ], [ -89.31, 69.25 ], [ -88.22, 68.92 ], [ -87.79, 68.32 ], [ -87.92, 68.2 ], [ -88.33, 68.32 ], [ -88.41, 68.01 ], [ -87.29, 67.1 ], [ -87.05, 67.26 ], [ -86.84, 67.16 ], [ -87.07, 67.35 ], [ -86.51, 67.33 ], [ -85.62, 68.74 ], [ -84.7, 68.73 ], [ -85.19, 68.86 ], [ -84.51, 69.01 ], [ -85.39, 69.21 ], [ -85.26, 69.78 ], [ -85.55, 69.86 ], [ -85.03, 69.76 ], [ -84.41, 69.86 ], [ -83.34, 69.66 ], [ -82.54, 69.7 ], [ -82.21, 69.64 ], [ -82.76, 69.58 ], [ -82.44, 69.49 ], [ -83.23, 69.52 ], [ -82.2, 69.39 ], [ -82.25, 69.24 ], [ -81.31, 69.19 ], [ -81.25, 69.08 ], [ -82.05, 68.9 ], [ -81.36, 68.87 ], [ -81.24, 68.64 ], [ -81.94, 68.41 ], [ -82.63, 68.5 ], [ -82, 68.34 ], [ -82.49, 68.31 ], [ -82.25, 68.12 ], [ -81.98, 68.21 ], [ -82.08, 67.91 ], [ -81.19, 67.45 ], [ -81.46, 67 ], [ -82.11, 66.95 ], [ -82.12, 66.71 ], [ -82.42, 66.74 ], [ -82.58, 66.56 ], [ -83.55, 66.34 ], [ -83.99, 66.63 ], [ -83.9, 66.91 ], [ -84.22, 66.71 ], [ -84.61, 66.99 ], [ -84.32, 66.96 ], [ -84.87, 67.05 ], [ -84.6, 66.97 ], [ -85.2, 66.87 ], [ -84.56, 66.93 ], [ -83.67, 66.18 ], [ -84.48, 66.41 ], [ -84.34, 66.15 ], [ -85.11, 66.34 ], [ -85.21, 66.26 ], [ -85.43, 66.6 ], [ -85.92, 66.48 ], [ -86.74, 66.54 ], [ -86.62, 66.32 ], [ -85.86, 66.16 ], [ -87.34, 65.32 ], [ -88.02, 65.34 ], [ -88.84, 65.65 ], [ -88.39, 65.63 ], [ -89.82, 65.99 ], [ -89.73, 65.82 ], [ -90.46, 65.88 ], [ -89.68, 65.72 ], [ -89.04, 65.32 ], [ -87.01, 65.24 ], [ -87.06, 64.95 ], [ -88.11, 64.14 ], [ -88.62, 64.12 ], [ -88.34, 64.09 ], [ -88.76, 63.96 ], [ -89.22, 64.11 ], [ -89.22, 63.95 ], [ -89.46, 64.11 ], [ -89.51, 63.97 ], [ -89.71, 64.03 ], [ -89.74, 64.26 ], [ -89.79, 64.14 ], [ -90, 64.21 ], [ -89.82, 63.92 ], [ -90.24, 64.01 ], [ -89.96, 63.79 ], [ -90.27, 63.75 ], [ -90.22, 63.6 ], [ -90.75, 63.61 ], [ -90.64, 63.49 ], [ -91.68, 63.79 ], [ -92.14, 63.73 ], [ -93.34, 63.97 ], [ -93.8, 64.22 ], [ -93.53, 63.98 ], [ -94.1, 64 ], [ -92.24, 63.74 ], [ -92.47, 63.51 ], [ -91.73, 63.71 ], [ -91.38, 63.47 ], [ -90.67, 63.36 ], [ -90.63, 63.16 ], [ -90.75, 62.93 ], [ -91.35, 62.79 ], [ -92.42, 62.82 ], [ -91.83, 62.61 ], [ -92.41, 62.53 ], [ -92.65, 62.63 ], [ -92.54, 62.45 ], [ -92.07, 62.38 ], [ -92.59, 62.39 ], [ -92.74, 62.48 ], [ -92.59, 62.14 ], [ -93.08, 62.33 ], [ -92.78, 62.17 ], [ -93.21, 62.21 ], [ -92.96, 62.1 ], [ -93.1, 61.98 ], [ -93.37, 62.1 ], [ -93.21, 61.93 ], [ -93.64, 61.96 ], [ -93.21, 61.77 ], [ -94.06, 61.41 ], [ -93.81, 61.35 ], [ -94.13, 61.32 ], [ -93.98, 61.09 ], [ -94.45, 60.83 ], [ -94.54, 60.53 ], [ -94.82, 60.54 ], [ -94.61, 60.38 ], [ -94.86, 59.05 ], [ -94.43, 58.7 ], [ -93.23, 58.79 ], [ -92.43, 57.36 ], [ -92.69, 56.99 ], [ -90.63, 57.24 ], [ -89.95, 57 ], [ -88.86, 56.86 ], [ -87.97, 56.47 ], [ -87.63, 55.98 ], [ -85.9, 55.66 ], [ -84.91, 55.23 ], [ -83.89, 55.29 ], [ -83.56, 55.14 ], [ -83.69, 55.27 ], [ -82.32, 55.06 ], [ -82.32, 55.15 ], [ -82.19, 54.81 ], [ -82.46, 54.2 ], [ -82.11, 53.81 ], [ -82.1, 53.29 ], [ -82.35, 52.94 ], [ -81.53, 52.44 ], [ -81.44, 52.23 ], [ -81.61, 52.23 ], [ -80.65, 51.79 ], [ -80.39, 51.34 ], [ -79.86, 51.17 ], [ -79.44, 51.21 ], [ -79.74, 51.35 ], [ -79.31, 51.66 ], [ -78.83, 51.15 ], [ -78.9, 51.38 ], [ -78.67, 51.48 ], [ -78.83, 51.58 ], [ -78.64, 51.55 ], [ -79.04, 51.76 ], [ -78.63, 51.98 ], [ -78.56, 52.23 ], [ -78.17, 52.23 ], [ -78.58, 52.25 ], [ -78.51, 52.47 ], [ -78.87, 52.74 ], [ -78.7, 52.88 ], [ -78.99, 53.01 ], [ -78.9, 53.4 ], [ -79.14, 53.49 ], [ -78.89, 53.56 ], [ -79.16, 53.71 ], [ -78.93, 53.83 ], [ -79.15, 53.95 ], [ -78.97, 54 ], [ -79.51, 54.36 ], [ -79.03, 54.37 ], [ -79.29, 54.43 ], [ -79.01, 54.49 ], [ -79.5, 54.41 ], [ -79.54, 54.62 ], [ -79.76, 54.63 ], [ -77.64, 55.28 ], [ -76.66, 56.17 ], [ -75.9, 56.13 ], [ -76.34, 56.35 ], [ -76.12, 56.41 ], [ -76.36, 56.55 ], [ -76.48, 56.16 ], [ -76.67, 56.19 ], [ -76.55, 57.1 ], [ -76.72, 57.67 ], [ -77.2, 58 ], [ -76.99, 58.02 ], [ -78.6, 58.68 ], [ -78.6, 58.8 ], [ -78.35, 58.69 ], [ -78.54, 58.78 ], [ -78.54, 58.95 ], [ -78.51, 58.84 ], [ -78.29, 58.93 ], [ -78.25, 59.11 ], [ -78.08, 59.09 ], [ -78.13, 59.21 ], [ -77.89, 59.16 ], [ -78.02, 59.25 ], [ -77.64, 59.37 ], [ -77.93, 59.39 ], [ -77.89, 59.51 ], [ -77.32, 59.45 ], [ -77.81, 59.71 ], [ -77.06, 59.56 ], [ -77.57, 59.69 ], [ -77.19, 60 ], [ -77.64, 60.06 ], [ -77.44, 60.12 ], [ -77.78, 60.39 ], [ -77.58, 60.54 ], [ -77.26, 60.5 ], [ -77.84, 60.64 ], [ -77.49, 60.85 ], [ -78.23, 60.78 ], [ -77.71, 61.19 ], [ -77.81, 61.46 ], [ -77.65, 61.38 ], [ -77.71, 61.54 ], [ -77.48, 61.51 ], [ -78, 61.71 ], [ -78.19, 62.26 ], [ -77.42, 62.58 ], [ -75.56, 62.27 ], [ -75.89, 62.16 ], [ -75.34, 62.32 ], [ -74.53, 62.09 ], [ -74.71, 62.25 ], [ -73.69, 62.48 ], [ -72.95, 62.12 ], [ -72.61, 62.11 ], [ -72.79, 61.83 ], [ -72.59, 61.78 ], [ -72.58, 61.95 ], [ -72.2, 61.87 ], [ -71.98, 61.66 ], [ -72.27, 61.56 ], [ -71.96, 61.59 ], [ -71.94, 61.71 ], [ -71.55, 61.62 ], [ -71.87, 61.43 ], [ -71.57, 61.4 ], [ -71.92, 61.4 ], [ -71.58, 61.16 ], [ -70.73, 61.01 ], [ -70.13, 61.09 ], [ -69.9, 60.8 ], [ -69.5, 61.07 ], [ -69.36, 60.81 ], [ -69.81, 60.51 ], [ -69.62, 60.07 ], [ -70.98, 60.07 ], [ -69.54, 59.87 ], [ -69.81, 59.3 ], [ -69.43, 59.37 ], [ -69.23, 59.23 ], [ -69.53, 59.17 ], [ -69.34, 59.11 ], [ -69.55, 58.81 ], [ -69.87, 59.05 ], [ -69.79, 58.83 ], [ -70.07, 58.79 ], [ -69.81, 58.58 ], [ -69.39, 58.87 ], [ -68.63, 58.91 ], [ -68.29, 58.53 ], [ -67.97, 58.57 ], [ -67.85, 58.27 ], [ -67.74, 58.47 ], [ -67.59, 58.21 ], [ -67.18, 58.4 ], [ -67.06, 58.27 ], [ -66.94, 58.51 ], [ -66.85, 58.41 ], [ -66.62, 58.47 ], [ -66.38, 58.86 ], [ -65.93, 58.62 ], [ -66.1, 58.78 ], [ -65.82, 58.79 ], [ -65.87, 59.02 ], [ -65.38, 58.91 ], [ -65.59, 59.06 ], [ -65.31, 59.05 ], [ -65.75, 59.18 ], [ -65.72, 59.29 ], [ -65.47, 59.14 ], [ -65.63, 59.41 ], [ -65.31, 59.24 ], [ -65.51, 59.48 ], [ -64.91, 59.37 ], [ -65.39, 59.5 ], [ -65.54, 59.75 ], [ -65.14, 59.97 ], [ -65, 59.9 ], [ -65.15, 60.04 ], [ -64.92, 60.04 ], [ -64.85, 60.37 ], [ -64.42, 60.27 ], [ -64.73, 60.27 ], [ -64.36, 60.17 ], [ -64.7, 60.02 ], [ -64.36, 60.13 ], [ -64.48, 59.89 ], [ -64.17, 60.04 ], [ -64.3, 59.95 ], [ -64.13, 59.9 ], [ -64.17, 59.78 ], [ -64.06, 59.87 ], [ -63.94, 59.76 ], [ -64.13, 59.69 ], [ -64.2, 59.77 ], [ -64.14, 59.79 ], [ -64.2, 59.77 ], [ -64.25, 59.8 ], [ -64.24, 59.71 ], [ -64.11, 59.68 ], [ -63.93, 59.69 ], [ -63.99, 59.65 ], [ -63.91, 59.67 ], [ -63.95, 59.64 ], [ -64.04, 59.64 ], [ -64.13, 59.52 ], [ -64, 59.63 ], [ -63.86, 59.61 ], [ -63.98, 59.5 ], [ -63.72, 59.51 ], [ -64.07, 59.39 ], [ -63.7, 59.37 ], [ -64.01, 59.23 ], [ -63.64, 59.36 ], [ -63.64, 59.21 ], [ -63.36, 59.2 ], [ -64.07, 59.02 ], [ -63.14, 59.05 ], [ -63.34, 58.86 ], [ -63.18, 58.76 ], [ -63.02, 58.9 ], [ -63.09, 58.66 ], [ -62.85, 58.7 ], [ -63.16, 58.51 ], [ -63.47, 58.55 ], [ -63.61, 58.29 ], [ -63.28, 58.47 ], [ -63.17, 58.36 ], [ -62.56, 58.48 ], [ -62.92, 58.2 ], [ -62.59, 58.2 ], [ -63.35, 57.97 ], [ -62.45, 58.17 ], [ -62.54, 58.05 ], [ -62.32, 58.02 ], [ -62.67, 57.92 ], [ -61.94, 57.91 ], [ -61.94, 57.78 ], [ -62.17, 57.83 ], [ -61.89, 57.63 ], [ -62.36, 57.45 ], [ -62.56, 57.51 ], [ -62.36, 57.42 ], [ -61.9, 57.41 ], [ -61.79, 57.24 ], [ -62, 57.2 ], [ -61.36, 57.1 ], [ -61.36, 56.95 ], [ -61.39, 56.98 ], [ -61.54, 56.97 ], [ -61.69, 56.8 ], [ -61.93, 56.81 ], [ -61.67, 56.62 ], [ -62.52, 56.76 ], [ -61.65, 56.54 ], [ -62.23, 56.46 ], [ -61.58, 56.28 ], [ -62.12, 56.3 ], [ -61.95, 56.2 ], [ -61.33, 56.23 ], [ -61.51, 56.07 ], [ -61.25, 56.06 ], [ -61.54, 56.01 ], [ -61.07, 55.89 ], [ -61.53, 55.88 ], [ -60.73, 55.84 ], [ -60.93, 55.72 ], [ -60.6, 55.81 ], [ -60.68, 55.54 ], [ -60.33, 55.78 ], [ -60.61, 55.51 ], [ -60.45, 55.63 ], [ -60.52, 55.34 ], [ -60.34, 55.49 ], [ -60.2, 55.42 ], [ -61, 55.04 ], [ -60.69, 54.98 ], [ -60.03, 55.27 ], [ -60.3, 55 ], [ -59.78, 55.33 ], [ -59.96, 55.09 ], [ -59.42, 55.16 ], [ -59.93, 54.74 ], [ -59.15, 55.23 ], [ -59.41, 54.97 ], [ -59.03, 55.15 ], [ -58.88, 54.81 ], [ -58.4, 54.73 ], [ -57.94, 54.93 ], [ -58, 54.79 ], [ -57.84, 54.81 ], [ -58.2, 54.75 ], [ -57.33, 54.58 ], [ -57.75, 54.48 ], [ -57.41, 54.46 ], [ -57.6, 54.38 ], [ -59.62, 54.04 ], [ -58.38, 54.23 ], [ -58.62, 54.04 ], [ -60.12, 53.77 ], [ -60.03, 53.44 ], [ -60.41, 53.35 ], [ -60.06, 53.34 ], [ -59.91, 53.53 ], [ -59.11, 53.67 ], [ -58.85, 53.95 ], [ -57.78, 54.07 ], [ -58.33, 54.09 ], [ -58.36, 54.2 ], [ -57.47, 54.2 ], [ -57.07, 53.81 ], [ -57.53, 53.58 ], [ -57.32, 53.59 ], [ -57.37, 53.43 ], [ -57.02, 53.71 ], [ -56.48, 53.79 ], [ -56.73, 53.68 ], [ -56.26, 53.6 ], [ -56.49, 53.51 ], [ -56.18, 53.6 ], [ -55.96, 53.54 ], [ -56.29, 53.56 ], [ -55.8, 53.34 ], [ -55.75, 53.14 ], [ -56.2, 53.05 ], [ -56.15, 52.94 ], [ -55.88, 53.01 ], [ -55.81, 52.84 ], [ -56.21, 52.84 ], [ -55.75, 52.62 ], [ -56.29, 52.72 ], [ -55.84, 52.58 ], [ -56.54, 52.6 ], [ -55.75, 52.5 ], [ -55.65, 52.35 ], [ -56.24, 52.45 ], [ -55.62, 52.22 ], [ -56.96, 51.42 ], [ -57.7, 51.42 ], [ -57.59, 51.67 ], [ -57.78, 51.4 ], [ -58.04, 51.3 ], [ -57.86, 51.5 ], [ -58.15, 51.28 ], [ -58.07, 51.5 ], [ -58.17, 51.28 ], [ -58.27, 51.39 ], [ -58.29, 51.26 ], [ -58.63, 51.27 ], [ -58.9, 50.95 ], [ -58.9, 51.06 ], [ -59.05, 51 ], [ -59.01, 50.74 ], [ -59.26, 50.77 ], [ -60.15, 50.2 ], [ -60.27, 50.35 ], [ -60.34, 50.21 ], [ -61.09, 50.25 ], [ -61.73, 50.09 ], [ -62.36, 50.3 ], [ -63.4, 50.2 ], [ -66.46, 50.27 ], [ -66.45, 50.13 ], [ -67.15, 49.81 ], [ -67.37, 49.32 ], [ -68.32, 49.2 ], [ -68.19, 49.1 ], [ -68.46, 49.04 ], [ -68.37, 49.14 ], [ -69.05, 48.79 ], [ -69.68, 48.14 ], [ -69.84, 48.16 ], [ -69.94, 48.26 ], [ -70.12, 48.26 ], [ -70.39, 48.37 ], [ -71.25, 48.45 ], [ -69.9, 48.22 ], [ -69.88, 48.16 ], [ -69.71, 48.1 ], [ -69.91, 47.77 ], [ -70.23, 47.49 ], [ -70.5, 47.44 ], [ -70.72, 47.11 ], [ -71.01, 46.98 ], [ -71.27, 46.76 ], [ -71.69, 46.67 ], [ -71.88, 46.69 ], [ -73.18, 46.04 ], [ -71.87, 46.66 ], [ -71.64, 46.64 ], [ -71.25, 46.75 ], [ -71.16, 46.83 ], [ -70.99, 46.83 ], [ -70.5, 47.01 ], [ -69.44, 47.99 ], [ -68.17, 48.64 ], [ -66.65, 49.11 ], [ -65.33, 49.25 ], [ -64.24, 48.9 ], [ -64.16, 48.75 ], [ -64.57, 48.82 ], [ -64.17, 48.63 ], [ -64.32, 48.42 ], [ -65.25, 48.01 ], [ -65.91, 48.21 ], [ -66.95, 47.95 ], [ -66.36, 48.07 ], [ -65.84, 47.91 ], [ -65.64, 47.61 ], [ -65.19, 47.82 ], [ -64.8, 47.8 ], [ -64.67, 47.72 ], [ -64.96, 47.29 ], [ -65.37, 47.07 ], [ -64.8, 47.07 ], [ -65, 46.8 ], [ -64.87, 46.64 ], [ -64.72, 46.69 ], [ -64.57, 46.22 ], [ -63.82, 46.16 ], [ -64.1, 46.02 ], [ -63.25, 45.81 ], [ -63.4, 45.76 ], [ -63.28, 45.7 ], [ -62.68, 45.76 ], [ -62.5, 45.58 ], [ -61.92, 45.89 ], [ -61.97, 45.63 ], [ -61.49, 45.69 ], [ -61.41, 45.65 ], [ -61.39, 45.58 ], [ -61.25, 45.52 ], [ -61.23, 45.48 ], [ -61.5, 45.35 ], [ -60.98, 45.27 ], [ -61.6, 45.15 ], [ -61.82, 45.25 ], [ -61.65, 45.09 ], [ -62, 45.14 ], [ -61.98, 44.98 ], [ -62.44, 44.85 ], [ -62.56, 44.94 ], [ -62.54, 44.79 ], [ -62.88, 44.82 ], [ -62.84, 44.7 ], [ -63.14, 44.79 ], [ -63.09, 44.69 ], [ -63.15, 44.78 ], [ -63.45, 44.59 ], [ -63.66, 44.73 ], [ -63.52, 44.5 ], [ -63.65, 44.43 ], [ -63.94, 44.51 ], [ -63.89, 44.69 ], [ -64.07, 44.47 ], [ -64.3, 44.57 ], [ -64.24, 44.26 ], [ -64.55, 44.41 ], [ -64.38, 44.23 ], [ -65.13, 43.65 ], [ -65.27, 43.95 ], [ -65.23, 43.66 ], [ -65.34, 43.77 ], [ -65.35, 43.53 ], [ -65.5, 43.69 ], [ -65.45, 43.48 ], [ -65.59, 43.56 ], [ -65.62, 43.39 ], [ -65.86, 43.81 ], [ -66, 43.85 ], [ -66.02, 43.68 ], [ -66.17, 43.8 ], [ -66.13, 44.33 ], [ -65.85, 44.57 ], [ -66.18, 44.43 ], [ -64.5, 45.33 ], [ -64.33, 45.29 ], [ -64.44, 45.08 ], [ -64.29, 45.14 ], [ -64.15, 45 ], [ -64.01, 45.06 ], [ -64.15, 45.2 ], [ -63.72, 45.32 ], [ -63.45, 45.25 ], [ -63.36, 45.37 ], [ -64.94, 45.33 ], [ -64.43, 45.71 ], [ -64.7, 46 ], [ -64.57, 45.83 ], [ -64.78, 45.59 ], [ -65.89, 45.2 ], [ -66.07, 45.27 ], [ -66.46, 45.06 ], [ -66.47, 45.16 ], [ -66.89, 45.04 ], [ -66.97, 45.18 ], [ -67.05, 45.07 ], [ -67.28, 45.19 ], [ -67.04, 44.96 ], [ -67.23, 44.93 ], [ -67.17, 44.79 ], [ -67.06, 44.91 ], [ -66.95, 44.82 ], [ -67.19, 44.64 ], [ -67.39, 44.73 ], [ -67.41, 44.59 ], [ -67.57, 44.66 ], [ -67.71, 44.5 ], [ -67.72, 44.65 ], [ -67.78, 44.52 ], [ -67.93, 44.59 ], [ -68.06, 44.33 ], [ -68.19, 44.57 ], [ -68.42, 44.4 ], [ -68.42, 44.54 ], [ -68.53, 44.23 ], [ -68.75, 44.35 ], [ -68.83, 44.31 ], [ -68.73, 44.47 ], [ -69.04, 44.45 ], [ -68.95, 44.32 ], [ -69.21, 43.93 ], [ -69.17, 44.08 ], [ -69.31, 43.95 ], [ -69.38, 44.09 ], [ -69.51, 43.83 ], [ -69.51, 44.07 ], [ -69.6, 43.81 ], [ -69.65, 44.02 ], [ -69.76, 43.89 ], [ -69.83, 43.98 ], [ -69.83, 43.7 ], [ -69.87, 43.92 ], [ -70.02, 43.73 ], [ -69.95, 43.87 ], [ -70.27, 43.72 ], [ -70.2, 43.57 ], [ -70.37, 43.56 ], [ -70.91, 42.83 ], [ -70.68, 42.59 ], [ -71.06, 42.37 ], [ -70.97, 42.22 ], [ -70.88, 42.31 ], [ -70.72, 42.21 ], [ -70.49, 41.78 ], [ -70.55, 41.78 ], [ -70.62, 41.74 ], [ -70.62, 41.77 ], [ -70.67, 41.69 ], [ -70.75, 41.74 ], [ -70.95, 41.51 ], [ -71.19, 41.46 ], [ -71.16, 41.71 ], [ -71.3, 41.65 ], [ -71.4, 41.82 ], [ -71.48, 41.36 ], [ -72.07, 41.32 ], [ -72.08, 41.52 ], [ -72.11, 41.3 ], [ -72.91, 41.3 ], [ -73.64, 41.01 ], [ -73.79, 40.8 ], [ -73.94, 40.88 ], [ -74.14, 40.64 ], [ -74.09, 40.81 ], [ -74.28, 40.49 ], [ -74.01, 40.31 ], [ -73.98, 40.45 ], [ -74.1, 39.76 ], [ -74.09, 40.08 ], [ -74.26, 39.61 ], [ -74.65, 39.63 ], [ -74.4, 39.45 ], [ -74.89, 38.95 ], [ -74.8, 39.19 ], [ -75.03, 39.19 ], [ -75, 39.36 ], [ -75.09, 39.21 ], [ -75.07, 39.27 ], [ -75.19, 39.24 ], [ -75.2, 39.34 ], [ -75.29, 39.36 ], [ -75.29, 39.29 ], [ -75.32, 39.37 ], [ -75.36, 39.35 ], [ -75.35, 39.38 ], [ -75.33, 39.38 ], [ -75.33, 39.39 ], [ -75.33, 39.38 ], [ -75.32, 39.38 ], [ -75.32, 39.39 ], [ -75.29, 39.37 ], [ -75.27, 39.39 ], [ -75.25, 39.37 ], [ -75.22, 39.38 ], [ -75.23, 39.42 ], [ -75.23, 39.38 ], [ -75.25, 39.38 ], [ -75.27, 39.39 ], [ -75.29, 39.37 ], [ -75.32, 39.39 ], [ -75.32, 39.38 ], [ -75.32, 39.39 ], [ -75.33, 39.39 ], [ -75.34, 39.38 ], [ -75.37, 39.39 ], [ -75.37, 39.35 ], [ -75.54, 39.47 ], [ -75.57, 39.63 ], [ -75.25, 39.86 ], [ -75.47, 39.79 ], [ -75.61, 39.62 ], [ -75.59, 39.47 ], [ -75.09, 38.8 ], [ -75.05, 38.44 ], [ -75.96, 37.12 ], [ -75.94, 37.57 ], [ -75.64, 37.95 ], [ -75.85, 37.92 ], [ -75.76, 38.16 ], [ -76.27, 38.38 ], [ -76.39, 38.77 ], [ -75.98, 39.53 ], [ -76.4, 39.29 ], [ -76.55, 38.88 ], [ -76.32, 38.04 ], [ -76.47, 38.22 ], [ -76.53, 38.13 ], [ -76.63, 38.28 ], [ -76.92, 38.29 ], [ -77.02, 38.51 ], [ -77.24, 38.38 ], [ -77.13, 38.6 ], [ -77.26, 38.59 ], [ -77.28, 38.34 ], [ -77.04, 38.4 ], [ -77.02, 38.2 ], [ -76.7, 38.06 ], [ -76.61, 38.15 ], [ -76.49, 37.93 ], [ -76.24, 37.89 ], [ -76.44, 37.88 ], [ -76.29, 37.78 ], [ -76.28, 37.31 ], [ -76.42, 37.47 ], [ -76.5, 37.25 ], [ -76.81, 37.51 ], [ -76.3, 37 ], [ -76.42, 36.96 ], [ -76.58, 37.2 ], [ -76.87, 37.24 ], [ -76.89, 37.41 ], [ -76.92, 37.23 ], [ -77.01, 37.31 ], [ -77.07, 37.27 ], [ -77.07, 37.33 ], [ -77.26, 37.32 ], [ -77.3, 37.41 ], [ -77.29, 37.31 ], [ -77.07, 37.24 ], [ -77.01, 37.3 ], [ -77.02, 37.21 ], [ -76.72, 37.13 ], [ -76.68, 37.2 ], [ -76.49, 36.96 ], [ -76.56, 36.74 ], [ -76.36, 36.92 ], [ -76.43, 36.79 ], [ -76.32, 36.86 ], [ -76.24, 36.72 ], [ -76.33, 36.96 ], [ -76.08, 36.82 ], [ -75.99, 36.92 ], [ -75.53, 35.79 ], [ -75.95, 36.72 ], [ -75.9, 36.49 ], [ -76.1, 36.52 ], [ -75.79, 36.07 ], [ -76.29, 36.22 ], [ -76.2, 36.1 ], [ -76.44, 36.2 ], [ -76.31, 36.09 ], [ -76.74, 35.94 ], [ -76.06, 35.99 ], [ -76.04, 35.65 ], [ -75.98, 35.89 ], [ -75.75, 35.88 ], [ -75.78, 35.58 ], [ -75.89, 35.65 ], [ -76.16, 35.33 ], [ -76.43, 35.47 ], [ -76.61, 35.19 ], [ -76.44, 34.9 ], [ -76.3, 35.01 ], [ -76.33, 34.89 ], [ -76.52, 34.72 ], [ -76.63, 34.84 ], [ -76.62, 34.71 ], [ -76.68, 34.81 ], [ -77.32, 34.55 ], [ -77.44, 34.74 ], [ -77.37, 34.52 ], [ -77.76, 34.31 ], [ -77.96, 33.84 ], [ -78.24, 33.92 ], [ -78.74, 33.79 ], [ -79.36, 33.01 ], [ -79.96, 32.78 ], [ -80, 32.6 ], [ -80.48, 32.5 ], [ -80.46, 32.32 ], [ -80.77, 32.3 ], [ -80.67, 32.22 ], [ -81.32, 31.42 ], [ -81.29, 31.22 ], [ -81.65, 31.12 ], [ -81.51, 31.02 ], [ -81.67, 31.04 ], [ -81.5, 30.94 ], [ -81.65, 30.84 ], [ -81.48, 30.67 ], [ -81.53, 30.53 ], [ -81.66, 30.56 ], [ -81.45, 30.45 ], [ -81.7, 30.42 ], [ -81.69, 30.19 ], [ -81.62, 30.39 ], [ -81.38, 30.4 ], [ -81.17, 29.57 ], [ -80.53, 28.46 ], [ -80.57, 28.12 ], [ -80.03, 26.8 ], [ -80.13, 25.91 ], [ -80.4, 25.24 ], [ -81.07, 25.12 ], [ -81.15, 25.33 ], [ -80.85, 25.25 ], [ -81.04, 25.37 ], [ -80.92, 25.44 ], [ -81.17, 25.47 ], [ -80.93, 25.5 ], [ -81.29, 25.86 ], [ -81.78, 26.05 ], [ -81.87, 26.52 ], [ -82.01, 26.49 ], [ -81.78, 26.7 ], [ -82.03, 26.53 ], [ -81.99, 27 ], [ -82.27, 27.02 ], [ -82.15, 26.79 ], [ -82.27, 26.83 ], [ -82.69, 27.47 ], [ -82.42, 27.52 ], [ -82.62, 27.59 ], [ -82.39, 27.95 ], [ -82.53, 27.83 ], [ -82.7, 28.04 ], [ -82.58, 27.88 ], [ -82.68, 27.69 ], [ -82.85, 27.87 ], [ -82.63, 28.91 ], [ -83.98, 30.12 ], [ -84.35, 30.08 ], [ -84.35, 29.9 ], [ -85.35, 29.67 ], [ -85.36, 29.9 ], [ -85.73, 30.12 ], [ -85.39, 30.05 ], [ -85.73, 30.18 ], [ -85.56, 30.35 ], [ -85.85, 30.28 ], [ -85.73, 30.12 ], [ -86.52, 30.4 ], [ -86.1, 30.38 ], [ -86.19, 30.51 ], [ -86.42, 30.45 ], [ -86.5, 30.52 ], [ -86.6, 30.4 ], [ -86.78, 30.41 ], [ -86.95, 30.4 ], [ -87.18, 30.34 ], [ -87.2, 30.36 ], [ -86.94, 30.45 ], [ -86.86, 30.44 ], [ -87.03, 30.63 ], [ -87.27, 30.34 ], [ -87.5, 30.31 ], [ -87.37, 30.46 ], [ -87.72, 30.28 ], [ -88.01, 30.69 ], [ -88.16, 30.33 ], [ -89.33, 30.38 ], [ -89.86, 30.01 ], [ -89.64, 29.86 ], [ -89.43, 30.05 ], [ -89.34, 29.88 ], [ -89.43, 29.82 ], [ -89.29, 29.76 ], [ -89.42, 29.76 ], [ -89.52, 29.85 ], [ -89.42, 29.7 ], [ -89.78, 29.63 ], [ -89.56, 29.39 ], [ -89.27, 29.35 ], [ -89.27, 29.2 ], [ -89.19, 29.35 ], [ -89.11, 29.22 ], [ -89.23, 29.15 ], [ -89.02, 29.21 ], [ -89.06, 29.08 ], [ -89.19, 29.14 ], [ -89.15, 29 ], [ -89.34, 29.28 ], [ -89.42, 29.17 ], [ -89.86, 29.48 ], [ -90.06, 29.46 ], [ -90.05, 29.19 ], [ -90.23, 29.08 ], [ -90.35, 29.49 ], [ -90.56, 29.46 ], [ -90.62, 29.24 ], [ -90.78, 29.41 ], [ -90.88, 29.25 ], [ -90.78, 29.43 ], [ -91.14, 29.35 ], [ -91.82, 29.83 ], [ -92.26, 29.76 ], [ -92.01, 29.61 ], [ -92.32, 29.53 ], [ -93.34, 29.76 ], [ -93.31, 30.15 ], [ -93.44, 29.86 ], [ -93.35, 29.76 ], [ -94.5, 29.51 ], [ -94.78, 29.54 ], [ -94.71, 29.79 ], [ -95.01, 29.72 ], [ -94.98, 29.45 ], [ -94.81, 29.36 ], [ -95.21, 29.21 ], [ -95.26, 28.99 ], [ -95.12, 29.07 ], [ -95.38, 28.87 ], [ -96.31, 28.42 ], [ -95.97, 28.66 ], [ -96.18, 28.6 ], [ -96.17, 28.76 ], [ -96.36, 28.63 ], [ -96.44, 28.77 ], [ -96.49, 28.57 ], [ -96.66, 28.72 ], [ -96.4, 28.44 ], [ -96.67, 28.32 ], [ -96.79, 28.47 ], [ -96.92, 28.09 ], [ -96.39, 28.37 ], [ -96.99, 27.92 ], [ -97.36, 27.21 ], [ -97.18, 25.69 ], [ -97.42, 25.24 ], [ -97.44, 25.45 ], [ -97.54, 25.28 ], [ -97.69, 25.38 ], [ -97.84, 25.27 ], [ -97.7, 25.24 ], [ -97.76, 24.96 ], [ -97.63, 24.92 ], [ -97.75, 24.9 ], [ -97.74, 24.49 ], [ -97.87, 24.51 ], [ -97.8, 24.3 ], [ -97.74, 24.44 ], [ -97.75, 23.79 ], [ -97.71, 24.27 ], [ -97.77, 22.89 ], [ -97.9, 22.6 ], [ -97.84, 22.68 ], [ -97.68, 21.66 ], [ -97.17, 20.64 ], [ -96.45, 19.85 ], [ -96.29, 19.31 ], [ -96.37, 19.36 ], [ -95.9, 18.86 ], [ -94.81, 18.54 ], [ -94.59, 18.18 ], [ -94.42, 18.17 ], [ -94.59, 18.12 ], [ -94.45, 18.01 ], [ -94.41, 18.17 ], [ -92.91, 18.44 ], [ -92.34, 18.67 ], [ -91.96, 18.7 ], [ -91.88, 18.56 ], [ -91.93, 18.62 ], [ -92.01, 18.55 ], [ -92.06, 18.62 ], [ -92.2, 18.61 ], [ -92.3, 18.49 ], [ -92.08, 18.59 ], [ -91.98, 18.47 ], [ -91.96, 18.58 ], [ -91.79, 18.49 ], [ -91.84, 18.42 ], [ -91.7, 18.33 ], [ -91.77, 18.49 ], [ -91.49, 18.45 ], [ -91.55, 18.28 ], [ -91.23, 18.62 ], [ -91.21, 18.75 ], [ -91.35, 18.8 ], [ -91.31, 18.88 ], [ -91.35, 18.89 ], [ -91.1, 19.03 ], [ -91.39, 18.89 ], [ -91.5, 18.79 ], [ -91.39, 18.89 ], [ -90.91, 19.18 ], [ -90.72, 19.36 ], [ -90.71, 19.67 ], [ -90.44, 19.98 ], [ -90.44, 20.73 ], [ -90.2, 21.08 ], [ -88.12, 21.61 ], [ -87.95, 21.56 ], [ -87.84, 21.56 ], [ -87.77, 21.5 ], [ -87.59, 21.49 ], [ -87.92, 21.59 ], [ -88.01, 21.58 ], [ -88.11, 21.62 ], [ -88.18, 21.61 ], [ -88.14, 21.62 ], [ -87.95, 21.61 ], [ -87.5, 21.49 ], [ -87.59, 21.49 ], [ -87.47, 21.46 ], [ -87.29, 21.44 ], [ -87.2, 21.38 ], [ -87.08, 21.58 ], [ -86.82, 21.22 ], [ -86.8, 21.41 ], [ -86.88, 20.84 ], [ -87.42, 20.23 ], [ -87.47, 19.78 ], [ -87.47, 19.95 ], [ -87.74, 19.67 ], [ -87.69, 19.48 ], [ -87.46, 19.56 ], [ -87.72, 19.23 ], [ -87.45, 19.31 ], [ -87.84, 18.21 ], [ -88.07, 18.48 ], [ -88.03, 18.89 ], [ -88.4, 18.38 ], [ -88.1, 18.37 ], [ -88.3, 17.65 ], [ -88.18, 17.5 ], [ -88.3, 17.24 ], [ -88.25, 16.81 ], [ -88.91, 15.9 ], [ -88.62, 15.69 ], [ -88.49, 15.85 ], [ -88.59, 15.96 ], [ -88.15, 15.68 ], [ -87.73, 15.92 ], [ -87.5, 15.77 ], [ -86.9, 15.75 ], [ -86.36, 15.78 ], [ -85.94, 15.93 ], [ -86.01, 16.03 ], [ -85.46, 15.86 ], [ -85.01, 15.98 ], [ -84.31, 15.82 ], [ -83.73, 15.39 ], [ -84.05, 15.53 ], [ -84.1, 15.34 ], [ -83.97, 15.39 ], [ -83.76, 15.19 ], [ -83.63, 15.32 ], [ -83.72, 15.4 ], [ -83.38, 15.25 ], [ -83.13, 14.99 ], [ -83.31, 14.77 ], [ -83.2, 14.31 ], [ -83.57, 13.37 ], [ -83.49, 12.39 ], [ -83.64, 12.38 ], [ -83.56, 12.8 ], [ -83.78, 12.53 ], [ -83.68, 12.27 ], [ -83.62, 12.35 ], [ -83.68, 11.99 ], [ -83.8, 12.06 ], [ -83.84, 11.88 ], [ -83.7, 11.85 ], [ -83.64, 11.6 ], [ -83.87, 11.4 ], [ -83.85, 11.18 ], [ -83.13, 10.03 ], [ -82.34, 9.43 ], [ -82.4, 9.26 ], [ -82.17, 9.16 ], [ -82.26, 9.01 ], [ -81.79, 8.93 ], [ -81.88, 9.18 ], [ -81.39, 8.77 ], [ -80.96, 8.82 ], [ -79.92, 9.39 ], [ -79.91, 9.28 ], [ -79.62, 9.62 ], [ -78.97, 9.57 ], [ -79.07, 9.44 ], [ -78.56, 9.44 ], [ -78.03, 9.24 ], [ -76.94, 8.25 ], [ -76.93, 8.09 ], [ -76.81, 8.13 ], [ -76.93, 7.93 ], [ -76.77, 7.91 ], [ -76.76, 8.4 ], [ -76.94, 8.55 ], [ -76.33, 8.92 ], [ -75.95, 9.44 ], [ -75.62, 9.44 ], [ -75.58, 9.64 ], [ -75.7, 9.7 ], [ -75.52, 10.24 ], [ -75.7, 10.14 ], [ -75.5, 10.3 ], [ -75.39, 10.68 ], [ -74.85, 11.11 ], [ -74.29, 10.99 ], [ -74.11, 11.35 ], [ -73.28, 11.29 ], [ -72.23, 11.89 ], [ -72.18, 12.22 ], [ -71.96, 12.26 ], [ -71.93, 12.15 ], [ -71.96, 12.27 ], [ -71.67, 12.46 ], [ -71.27, 12.34 ], [ -71.11, 12.05 ], [ -71.38, 11.75 ], [ -71.97, 11.55 ], [ -71.88, 11.22 ], [ -71.6, 11 ], [ -71.82, 10.99 ], [ -71.58, 10.7 ], [ -71.63, 10.44 ], [ -72.13, 9.81 ], [ -72.01, 9.46 ], [ -71.72, 9.38 ], [ -71.82, 9.22 ], [ -71.61, 9.04 ], [ -71.06, 9.32 ], [ -71.03, 9.71 ], [ -71.59, 10.79 ], [ -71.43, 10.8 ], [ -71.45, 10.97 ], [ -70.05, 11.44 ], [ -70.14, 11.56 ], [ -69.75, 11.46 ], [ -69.81, 11.69 ], [ -70.24, 11.63 ], [ -70.29, 11.9 ], [ -70.02, 12.2 ], [ -69.63, 11.47 ], [ -69.26, 11.53 ], [ -68.66, 11.35 ], [ -68.22, 10.89 ], [ -68.33, 10.85 ], [ -68.24, 10.58 ], [ -67.93, 10.45 ], [ -66.24, 10.65 ], [ -65.82, 10.28 ], [ -65.06, 10.06 ], [ -64.75, 10.1 ], [ -64.19, 10.48 ], [ -63.64, 10.49 ], [ -64.02, 10.59 ], [ -64.23, 10.5 ], [ -64.26, 10.66 ], [ -61.86, 10.75 ], [ -62.35, 10.53 ], [ -62.66, 10.58 ], [ -62.91, 10.52 ], [ -63.04, 10.45 ], [ -63.01, 10.31 ], [ -62.91, 10.27 ], [ -62.95, 10.4 ], [ -62.73, 10.38 ], [ -62.83, 10.37 ], [ -62.69, 10.33 ], [ -62.62, 10.12 ], [ -62.79, 10.03 ], [ -62.61, 10.1 ], [ -62.62, 10.23 ], [ -62.54, 10.21 ], [ -62.33, 9.8 ], [ -62.2, 10.02 ], [ -61.82, 9.76 ], [ -61.6, 9.79 ], [ -61.64, 9.9 ], [ -61.33, 9.63 ], [ -61.21, 9.58 ], [ -61.2, 9.58 ], [ -61.21, 9.6 ], [ -61.2, 9.6 ], [ -61.01, 9.54 ], [ -60.97, 9.48 ], [ -60.88, 9.47 ], [ -60.78, 9.32 ], [ -61, 9.18 ], [ -60.75, 9.22 ], [ -60.87, 8.83 ], [ -60.69, 8.8 ], [ -61, 8.56 ], [ -60.18, 8.63 ], [ -59.12, 8.03 ], [ -58.48, 7.34 ], [ -58.62, 6.63 ], [ -58.42, 6.86 ], [ -58.06, 6.82 ], [ -57.61, 6.42 ], [ -57.53, 6.19 ], [ -57.48, 6.34 ], [ -57.22, 6.17 ], [ -57.14, 5.92 ], [ -56.67, 5.98 ], [ -55.94, 5.81 ], [ -55.9, 5.66 ], [ -55.95, 5.89 ], [ -55.72, 6 ], [ -54.04, 5.84 ], [ -52.94, 5.45 ], [ -51.96, 4.53 ], [ -51.84, 4.65 ], [ -51.66, 4.07 ], [ -51.55, 4.44 ], [ -51.29, 4.25 ], [ -51.18, 3.82 ], [ -51.06, 3.88 ], [ -51.04, 3.12 ], [ -50.71, 2.14 ], [ -50.53, 1.85 ], [ -49.93, 1.7 ], [ -49.87, 1.4 ], [ -50.16, 1.21 ], [ -49.88, 1.16 ], [ -50.28, .86 ], [ -50.77, .21 ], [ -50.62, -.09 ], [ -50.93, -.38 ], [ -50.71, -.43 ], [ -50.34, -.09 ], [ -49.62, -.25 ], [ -49.2, -.13 ], [ -48.44, -.23 ], [ -48.49, -.74 ], [ -48.59, -.64 ], [ -48.66, -.75 ], [ -48.59, -.65 ], [ -48.5, -.78 ], [ -48.15, -.84 ], [ -48.05, -.66 ], [ -47.93, -.89 ], [ -47.95, -.75 ], [ -47.85, -.67 ], [ -47.8, -.76 ], [ -47.76, -.64 ], [ -47.7, -.71 ], [ -47.67, -.58 ], [ -47.63, -.7 ], [ -47.73, -.82 ], [ -47.58, -.78 ], [ -47.57, -.63 ], [ -47.51, -.82 ], [ -47.42, -.77 ], [ -47.44, -.58 ], [ -47.34, -.73 ], [ -47.32, -.59 ], [ -47.18, -.84 ], [ -47.08, -.76 ], [ -47.11, -.93 ], [ -46.97, -.76 ], [ -47, -.97 ], [ -46.84, -.75 ], [ -46.82, -.93 ], [ -46.65, -.82 ], [ -46.7, -.99 ], [ -46.44, -1.1 ], [ -46.39, -.99 ], [ -46.35, -1.13 ], [ -46.2, -.89 ], [ -46.26, -1.14 ], [ -46.08, -1.02 ], [ -46.06, -1.22 ], [ -45.87, -1.15 ], [ -45.92, -1.31 ], [ -45.72, -1.11 ], [ -45.77, -1.38 ], [ -45.52, -1.3 ], [ -45.57, -1.49 ], [ -45.35, -1.47 ], [ -45.36, -1.8 ], [ -45.18, -1.86 ], [ -45.25, -1.59 ], [ -45.07, -1.47 ], [ -44.9, -1.64 ], [ -45.01, -1.67 ], [ -44.78, -1.62 ], [ -44.88, -1.77 ], [ -44.53, -1.82 ], [ -44.48, -2.04 ], [ -44.83, -2.31 ], [ -44.66, -2.29 ], [ -44.76, -2.43 ], [ -44.65, -2.45 ], [ -44.46, -2.15 ], [ -44.36, -2.34 ], [ -44.58, -2.42 ], [ -44.5, -2.48 ], [ -44.7, -2.71 ], [ -44.61, -3.04 ], [ -44.83, -3.38 ], [ -44.42, -2.97 ], [ -44.39, -2.76 ], [ -44.22, -2.89 ], [ -43.93, -2.56 ], [ -43.62, -2.55 ], [ -43.53, -2.42 ], [ -43.47, -2.53 ], [ -43.43, -2.34 ], [ -42.23, -2.81 ], [ -41.83, -2.72 ], [ -41.29, -2.98 ], [ -40.5, -2.78 ], [ -40, -2.84 ], [ -38.46, -3.71 ], [ -37.15, -4.95 ], [ -36.55, -5.14 ], [ -36.62, -5.08 ], [ -36.29, -5.15 ], [ -35.95, -5.04 ], [ -35.39, -5.25 ], [ -34.79, -7.15 ], [ -34.95, -8.39 ], [ -35.3, -9.19 ], [ -36.39, -10.51 ], [ -36.97, -10.87 ], [ -38.24, -12.85 ], [ -38.53, -13.01 ], [ -38.43, -12.77 ], [ -38.71, -12.58 ], [ -38.81, -12.84 ], [ -38.9, -12.67 ], [ -38.93, -12.86 ], [ -38.72, -12.88 ], [ -39.07, -13.44 ], [ -38.98, -13.83 ], [ -39.06, -13.69 ], [ -39.15, -13.75 ], [ -39.07, -13.79 ], [ -39.12, -13.96 ], [ -39, -13.97 ], [ -38.98, -14.06 ], [ -39.09, -14.17 ], [ -38.97, -14.08 ], [ -38.93, -13.91 ], [ -39.08, -14.8 ], [ -38.86, -15.86 ], [ -39.21, -17.17 ], [ -39.14, -17.69 ], [ -39.63, -18.23 ], [ -39.81, -19.65 ], [ -40.17, -19.95 ], [ -40.23, -20.29 ], [ -40.39, -20.28 ], [ -40.27, -20.32 ], [ -40.42, -20.64 ], [ -40.75, -20.86 ], [ -40.96, -21.24 ], [ -41.07, -21.51 ], [ -40.99, -22.01 ], [ -41.96, -22.54 ], [ -41.86, -22.75 ], [ -42.01, -23 ], [ -43.05, -22.98 ], [ -43.09, -22.68 ], [ -43.28, -22.78 ], [ -43.18, -22.99 ], [ -43.55, -23.08 ], [ -43.57, -23.07 ], [ -43.56, -23.05 ], [ -43.6, -23.02 ], [ -43.8, -22.92 ], [ -43.86, -22.93 ], [ -43.84, -22.9 ], [ -44.19, -23.05 ], [ -44.41, -22.94 ], [ -44.69, -23.08 ], [ -44.71, -23.23 ], [ -44.5, -23.29 ], [ -44.59, -23.36 ], [ -45.06, -23.42 ], [ -45.42, -23.63 ], [ -45.43, -23.83 ], [ -45.88, -23.76 ], [ -46.29, -24.04 ], [ -46.42, -23.96 ], [ -47.89, -24.91 ], [ -48.03, -25.03 ], [ -48.03, -25.18 ], [ -47.99, -25.18 ], [ -48, -25.19 ], [ -48, -25.21 ], [ -48.02, -25.23 ], [ -48.07, -25.22 ], [ -48.29, -25.33 ], [ -48.46, -25.26 ], [ -48.47, -25.48 ], [ -48.74, -25.36 ], [ -48.51, -25.63 ], [ -48.35, -25.57 ], [ -48.53, -25.85 ], [ -48.73, -25.87 ], [ -48.56, -25.86 ], [ -48.58, -26.17 ], [ -48.78, -26.25 ], [ -48.7, -26.36 ], [ -48.49, -26.22 ], [ -48.69, -26.68 ], [ -48.61, -27.11 ], [ -48.46, -27.14 ], [ -48.61, -27.24 ], [ -48.57, -27.89 ], [ -48.76, -28.54 ], [ -49.7, -29.31 ], [ -50.79, -31.14 ], [ -52.25, -32.27 ], [ -52.64, -33.13 ], [ -53.46, -33.83 ], [ -53.78, -34.41 ], [ -54.92, -34.95 ], [ -56.79, -36.29 ], [ -56.67, -36.88 ], [ -57.49, -37.83 ], [ -57.54, -38.1 ], [ -59.01, -38.68 ], [ -60.85, -38.98 ], [ -61.81, -38.99 ], [ -62.51, -38.71 ], [ -62.33, -38.85 ], [ -62.32, -39.27 ], [ -62.01, -39.36 ], [ -62.29, -39.29 ], [ -62.04, -39.45 ], [ -62.12, -39.87 ], [ -62.32, -39.87 ], [ -62.48, -40.3 ], [ -62.17, -40.59 ], [ -62.31, -40.87 ], [ -63.44, -41.16 ], [ -64.88, -40.83 ], [ -64.73, -40.8 ], [ -64.85, -40.72 ], [ -65.13, -40.86 ], [ -65.04, -42.06 ], [ -64.46, -42.24 ], [ -64.62, -42.42 ], [ -64.43, -42.44 ], [ -64.04, -42.35 ], [ -64.38, -42.24 ], [ -63.76, -42.08 ], [ -63.63, -42.76 ], [ -64.14, -42.87 ], [ -64.21, -42.62 ], [ -64.56, -42.49 ], [ -64.98, -42.65 ], [ -65.01, -42.78 ], [ -64.31, -42.98 ], [ -64.98, -43.26 ], [ -65.33, -43.66 ], [ -65.22, -44.37 ], [ -65.73, -44.81 ], [ -65.52, -44.93 ], [ -65.69, -45.06 ], [ -66.2, -44.98 ], [ -66.6, -45.14 ], [ -66.52, -45.22 ], [ -66.96, -45.27 ], [ -67.59, -45.99 ], [ -67.5, -46.47 ], [ -66.79, -47 ], [ -65.74, -47.2 ], [ -65.84, -47.74 ], [ -66.29, -47.87 ], [ -65.88, -47.76 ], [ -65.76, -47.95 ], [ -67.55, -49.01 ], [ -67.83, -49.39 ], [ -67.61, -49.25 ], [ -67.9, -50 ], [ -68.34, -50.12 ], [ -68.62, -49.8 ], [ -68.57, -49.94 ], [ -68.78, -49.97 ], [ -68.36, -50.16 ], [ -68.88, -50.34 ], [ -69.13, -50.9 ], [ -69.46, -51.1 ], [ -69.17, -50.98 ], [ -68.95, -51.56 ], [ -69.58, -51.62 ], [ -68.96, -51.62 ], [ -68.35, -52.34 ], [ -69.22, -52.2 ], [ -69.67, -52.54 ], [ -71, -52.75 ], [ -70.74, -52.78 ], [ -71, -53.8 ], [ -71.29, -53.9 ], [ -71.73, -53.79 ], [ -72.47, -53.42 ], [ -72.31, -53.25 ], [ -72.12, -53.25 ], [ -72.22, -53.45 ], [ -71.87, -53.23 ], [ -71.76, -53.44 ], [ -72.06, -53.54 ], [ -71.87, -53.54 ], [ -71.75, -53.45 ], [ -71.74, -53.21 ], [ -71.12, -52.91 ], [ -71.56, -52.56 ], [ -72.33, -52.53 ], [ -72.43, -52.68 ], [ -72.4, -52.51 ], [ -72.86, -52.54 ], [ -72.99, -52.76 ], [ -72.86, -52.62 ], [ -72.67, -52.68 ], [ -73.05, -52.85 ], [ -72.94, -53 ], [ -73.13, -53.12 ], [ -73.45, -53.02 ], [ -73.15, -52.91 ], [ -73.57, -52.81 ], [ -73.2, -52.79 ], [ -73.38, -52.56 ], [ -73.7, -52.79 ], [ -73.45, -52.51 ], [ -73.73, -52.04 ], [ -73.36, -52.22 ], [ -73, -52.06 ], [ -73.13, -52.23 ], [ -72.9, -52.3 ], [ -72.74, -52.08 ], [ -72.91, -52.22 ], [ -72.96, -52.05 ], [ -72.77, -51.95 ], [ -72.53, -52.22 ], [ -72.99, -52.49 ], [ -72.56, -52.49 ], [ -72.68, -52.41 ], [ -72.47, -52.22 ], [ -72.66, -51.95 ], [ -72.45, -51.78 ], [ -73.09, -51.41 ], [ -73.27, -51.48 ], [ -73.06, -51.49 ], [ -73.11, -51.61 ], [ -73, -51.51 ], [ -72.54, -51.77 ], [ -72.97, -51.77 ], [ -73.29, -51.57 ], [ -73, -51.78 ], [ -73.21, -51.89 ], [ -72.91, -51.85 ], [ -73.23, -52.1 ], [ -73.4, -51.64 ], [ -73.27, -52.16 ], [ -73.53, -52.05 ], [ -73.64, -51.82 ], [ -73.37, -52.04 ], [ -73.59, -51.75 ], [ -73.44, -51.68 ], [ -73.62, -51.64 ], [ -73.71, -51.79 ], [ -73.98, -51.49 ], [ -73.81, -51.39 ], [ -73.58, -51.62 ], [ -73.67, -51.14 ], [ -73.83, -51.06 ], [ -73.76, -51.19 ], [ -73.91, -51.26 ], [ -73.99, -51.11 ], [ -74.08, -51.21 ], [ -74.05, -50.95 ], [ -74.18, -51.06 ], [ -74.24, -50.96 ], [ -74.11, -50.87 ], [ -73.67, -50.95 ], [ -73.88, -50.85 ], [ -73.72, -50.83 ], [ -73.8, -50.68 ], [ -73.35, -50.68 ], [ -73.75, -50.54 ], [ -73.55, -50.38 ], [ -73.77, -50.52 ], [ -73.82, -50.77 ], [ -74.03, -50.85 ], [ -74.3, -50.47 ], [ -73.99, -50.6 ], [ -73.86, -50.55 ], [ -74.16, -50.43 ], [ -73.97, -50.37 ], [ -74.25, -50.45 ], [ -74.29, -50.24 ], [ -74.35, -50.39 ], [ -74.7, -50.2 ], [ -74.43, -50.02 ], [ -74.17, -50.28 ], [ -73.85, -50.29 ], [ -74.36, -49.99 ], [ -73.98, -50.07 ], [ -73.81, -49.83 ], [ -74.02, -49.98 ], [ -74.28, -49.91 ], [ -74.32, -49.78 ], [ -74.02, -49.72 ], [ -74.28, -49.77 ], [ -74.31, -49.64 ], [ -74.07, -49.54 ], [ -74.03, -49.65 ], [ -73.9, -49.55 ], [ -73.69, -49.8 ], [ -73.62, -49.66 ], [ -73.72, -49.68 ], [ -73.91, -49.51 ], [ -74.07, -49.5 ], [ -74.01, -49.26 ], [ -73.77, -49.4 ], [ -74.12, -49.18 ], [ -74.15, -49.53 ], [ -74.39, -49.39 ], [ -74.39, -48.78 ], [ -73.96, -48.72 ], [ -74.36, -48.59 ], [ -74.15, -48.47 ], [ -73.91, -48.58 ], [ -73.84, -48.41 ], [ -74.23, -48.33 ], [ -74.47, -48.09 ], [ -74.36, -48 ], [ -74.53, -48.09 ], [ -74.61, -47.99 ], [ -74.29, -48 ], [ -74.22, -48.25 ], [ -74.06, -48.19 ], [ -74.26, -48 ], [ -73.71, -48.02 ], [ -73.47, -48.32 ], [ -73.49, -48.2 ], [ -73.33, -48.22 ], [ -73.23, -48.15 ], [ -73.22, -48.01 ], [ -73.32, -48.17 ], [ -73.55, -48.03 ], [ -73.48, -47.98 ], [ -73.59, -48 ], [ -73.61, -47.87 ], [ -73.19, -47.96 ], [ -73.67, -47.77 ], [ -73.62, -47.6 ], [ -73.88, -47.83 ], [ -74.68, -47.72 ], [ -74.5, -47.51 ], [ -74.35, -47.61 ], [ -74.54, -47.68 ], [ -74.29, -47.63 ], [ -74.16, -47.75 ], [ -74.25, -47.64 ], [ -74.03, -47.63 ], [ -74.24, -47.61 ], [ -73.94, -47.58 ], [ -74.1, -47.59 ], [ -73.91, -47.49 ], [ -74.29, -47.58 ], [ -74.06, -47.43 ], [ -74.32, -47.54 ], [ -74.42, -47.45 ], [ -74.23, -47.38 ], [ -74.48, -47.44 ], [ -74.24, -47.19 ], [ -74.03, -47.38 ], [ -73.97, -47.09 ], [ -74.2, -47.1 ], [ -73.96, -46.96 ], [ -74.37, -46.78 ], [ -74.23, -46.75 ], [ -74.69, -46.81 ], [ -74.4, -46.9 ], [ -74.97, -46.74 ], [ -74.89, -46.44 ], [ -75.54, -46.71 ], [ -75.57, -46.81 ], [ -75.32, -46.73 ], [ -75.31, -46.93 ], [ -75.49, -46.96 ], [ -75.65, -46.72 ], [ -75.17, -46.3 ], [ -75.02, -46.37 ], [ -74.87, -46.37 ], [ -75.1, -46.33 ], [ -75.1, -46.29 ], [ -75, -46.29 ], [ -75.04, -46.23 ], [ -74.86, -46.3 ], [ -74.87, -46.16 ], [ -74.64, -46.18 ], [ -74.67, -45.91 ], [ -74.93, -46.12 ], [ -75.06, -46.04 ], [ -74.81, -46 ], [ -75.08, -45.89 ], [ -74.78, -45.95 ], [ -74.94, -45.86 ], [ -74.52, -45.84 ], [ -74.43, -46.05 ], [ -74.34, -45.8 ], [ -74, -45.94 ], [ -74.3, -46.01 ], [ -74.06, -46.11 ], [ -74.32, -46.14 ], [ -74.05, -46.12 ], [ -74.01, -45.99 ], [ -73.94, -46.08 ], [ -74.15, -46.22 ], [ -74.44, -46.2 ], [ -74.29, -46.26 ], [ -74, -46.18 ], [ -73.83, -46.35 ], [ -73.95, -46.14 ], [ -73.73, -46.23 ], [ -74.02, -46.66 ], [ -73.85, -46.69 ], [ -73.96, -46.61 ], [ -73.75, -46.4 ], [ -73.4, -46.32 ], [ -73.56, -46.27 ], [ -73.37, -46 ], [ -73.68, -46.33 ], [ -73.63, -45.97 ], [ -73.13, -45.65 ], [ -73.28, -45.59 ], [ -73.56, -45.78 ], [ -73.49, -45.46 ], [ -73.2, -45.29 ], [ -73.01, -45.45 ], [ -72.77, -45.4 ], [ -73.51, -45.2 ], [ -73.32, -45.21 ], [ -73.36, -44.96 ], [ -73.1, -44.95 ], [ -72.69, -44.75 ], [ -72.53, -44.53 ], [ -72.56, -44.33 ], [ -72.67, -44.51 ], [ -72.85, -44.29 ], [ -73.18, -44.25 ], [ -73.1, -44.12 ], [ -73.28, -44.16 ], [ -72.98, -43.77 ], [ -72.74, -43.83 ], [ -72.82, -43.65 ], [ -72.84, -43.77 ], [ -73.05, -43.74 ], [ -72.87, -43.61 ], [ -73.09, -43.44 ], [ -72.86, -43.03 ], [ -72.69, -43.11 ], [ -72.81, -42.51 ], [ -72.49, -42.55 ], [ -72.83, -42.3 ], [ -72.58, -42.19 ], [ -72.4, -42.48 ], [ -72.43, -41.97 ], [ -72.61, -42.04 ], [ -72.88, -41.91 ], [ -72.32, -41.66 ], [ -72.28, -41.39 ], [ -72.55, -41.71 ], [ -72.94, -41.47 ], [ -73.16, -41.81 ], [ -73.75, -41.75 ], [ -73.33, -41.5 ], [ -73.79, -41.58 ], [ -73.94, -41.06 ], [ -73.71, -40.01 ], [ -73.47, -39.85 ], [ -73.27, -39.94 ], [ -73.41, -39.72 ], [ -73.2, -39.37 ], [ -73.68, -37.34 ], [ -73.59, -37.15 ], [ -73.35, -37.24 ], [ -73.15, -37.12 ], [ -73.22, -36.77 ], [ -73.12, -36.61 ], [ -73.08, -36.76 ], [ -72.98, -36.71 ], [ -72.79, -35.98 ], [ -72.57, -35.8 ], [ -72.62, -35.56 ], [ -72.2, -35.1 ], [ -72.01, -34.13 ], [ -71.6, -33.54 ], [ -71.74, -33.1 ], [ -71.55, -33.01 ], [ -71.41, -32.4 ], [ -71.72, -30.6 ], [ -71.65, -30.27 ], [ -71.39, -30.18 ], [ -71.27, -29.89 ], [ -71.52, -28.92 ], [ -71.16, -28.36 ], [ -71.04, -27.66 ], [ -70.9, -27.62 ], [ -70.97, -27.17 ], [ -70.81, -27.06 ], [ -70.63, -26.35 ], [ -70.74, -25.82 ], [ -70.45, -25.37 ], [ -70.58, -24.55 ], [ -70.39, -23.61 ], [ -70.48, -23.47 ], [ -70.63, -23.52 ], [ -70.6, -23.25 ], [ -70.58, -23.08 ], [ -70.29, -22.91 ], [ -70.06, -21.44 ], [ -70.36, -18.37 ], [ -71.38, -17.71 ], [ -71.51, -17.27 ], [ -75.14, -15.41 ], [ -75.51, -14.91 ], [ -75.92, -14.66 ], [ -76.29, -14.16 ], [ -76.28, -13.91 ], [ -76.4, -13.91 ], [ -76.25, -13.85 ], [ -76.21, -13.38 ], [ -76.8, -12.36 ], [ -77.17, -12.07 ], [ -77.21, -11.65 ], [ -77.65, -11.3 ], [ -77.66, -10.95 ], [ -78.19, -10.11 ], [ -78.98, -8.21 ], [ -79.47, -7.72 ], [ -79.98, -6.75 ], [ -81.15, -5.98 ], [ -80.85, -5.66 ], [ -81.2, -5.21 ], [ -81.06, -5.03 ], [ -81.33, -4.68 ], [ -81.25, -4.27 ], [ -80.5, -3.51 ], [ -79.95, -3.43 ], [ -80.03, -3.31 ], [ -79.65, -2.53 ], [ -79.85, -2.35 ], [ -79.92, -2.59 ], [ -79.92, -2.21 ], [ -80.15, -2.57 ], [ -80.24, -2.51 ], [ -80.26, -2.74 ], [ -80.9, -2.33 ], [ -81.01, -2.19 ], [ -80.77, -2.13 ], [ -80.73, -1.93 ], [ -80.85, -1.6 ], [ -80.74, -1.36 ], [ -80.91, -1.06 ], [ -80.56, -.9 ], [ -80.42, -.59 ], [ -80.49, -.36 ], [ -80.07, .05 ], [ -80.04, .37 ], [ -79.93, .22 ], [ -80.08, .79 ], [ -79.16, 1.1 ], [ -78.91, 1.37 ], [ -78.78, 1.29 ], [ -79.01, 1.65 ], [ -78.83, 1.82 ], [ -78.56, 1.75 ], [ -78.71, 2.17 ], [ -78.56, 2.45 ], [ -78.48, 2.37 ], [ -78.55, 2.49 ], [ -78.32, 2.36 ], [ -77.9, 2.69 ], [ -77.8, 2.61 ], [ -77.67, 3.05 ], [ -77.15, 3.64 ], [ -77.05, 3.91 ], [ -77.28, 3.84 ], [ -77.18, 4.05 ], [ -77.36, 3.93 ], [ -77.53, 4.13 ], [ -77.29, 4.74 ], [ -77.39, 5.44 ], [ -77.54, 5.48 ], [ -77.24, 5.76 ], [ -77.48, 6.19 ], [ -77.33, 6.55 ], [ -77.7, 6.84 ], [ -77.68, 7.03 ], [ -78.18, 7.52 ], [ -78.45, 8.06 ], [ -78.28, 8.08 ], [ -78.31, 8.26 ], [ -78.16, 8.42 ], [ -78.02, 8.23 ], [ -77.84, 8.17 ], [ -78.03, 8.27 ], [ -78.15, 8.62 ], [ -78.1, 8.41 ], [ -78.16, 8.48 ], [ -78.26, 8.39 ], [ -78.24, 8.55 ], [ -78.37, 8.42 ], [ -78.41, 8.58 ], [ -78.42, 8.35 ], [ -78.62, 8.79 ], [ -78.85, 8.82 ], [ -79.09, 9.09 ], [ -79.52, 8.91 ], [ -79.59, 8.99 ], [ -79.85, 8.71 ], [ -79.7, 8.66 ], [ -79.77, 8.59 ], [ -80.47, 8.22 ], [ -79.99, 7.52 ], [ -80.37, 7.4 ], [ -80.44, 7.24 ], [ -80.89, 7.21 ], [ -81.05, 7.91 ], [ -81.27, 7.93 ], [ -81.23, 7.61 ], [ -81.52, 7.71 ], [ -81.76, 8.23 ], [ -81.77, 8.13 ], [ -82.15, 8.27 ], [ -82.16, 8.17 ], [ -82.2, 8.38 ], [ -82.7, 8.33 ], [ -82.88, 8.25 ], [ -82.88, 8.03 ], [ -83.15, 8.37 ], [ -83.17, 8.64 ], [ -83.48, 8.72 ], [ -83.28, 8.39 ], [ -83.57, 8.44 ], [ -83.73, 8.6 ], [ -83.57, 8.85 ], [ -83.64, 9.05 ], [ -84.25, 9.49 ], [ -84.62, 9.58 ], [ -84.77, 10 ], [ -85.36, 10.32 ], [ -85.2, 10.03 ], [ -84.86, 9.83 ], [ -85.11, 9.56 ], [ -85.25, 9.79 ], [ -85.67, 9.9 ], [ -85.88, 10.36 ], [ -85.63, 10.62 ], [ -85.66, 10.77 ], [ -85.95, 10.89 ], [ -85.71, 10.93 ], [ -85.67, 11.06 ], [ -86.52, 11.78 ], [ -86.79, 12.21 ], [ -87.69, 12.91 ], [ -87.58, 13.09 ], [ -87.33, 12.92 ], [ -87.28, 13.03 ], [ -87.51, 13.27 ], [ -87.4, 13.42 ], [ -87.59, 13.31 ], [ -87.58, 13.47 ], [ -87.88, 13.42 ], [ -87.78, 13.29 ], [ -87.9, 13.16 ], [ -88.35, 13.17 ], [ -88.3, 13.18 ], [ -88.34, 13.24 ], [ -88.35, 13.19 ], [ -88.64, 13.31 ], [ -88.74, 13.27 ], [ -88.47, 13.17 ], [ -88.83, 13.26 ], [ -89.29, 13.48 ], [ -89.81, 13.52 ], [ -90.53, 13.9 ], [ -91.54, 14.05 ], [ -93.94, 15.99 ], [ -93.8, 15.95 ], [ -93.9, 16.08 ], [ -94.38, 16.3 ], [ -94.42, 16.2 ], [ -93.97, 15.99 ], [ -94.93, 16.22 ], [ -96.56, 15.66 ], [ -97.78, 15.98 ], [ -98.55, 16.31 ], [ -98.77, 16.55 ], [ -99.65, 16.7 ], [ -101.06, 17.27 ], [ -101.96, 17.97 ], [ -102.19, 17.92 ], [ -103.49, 18.33 ], [ -103.83, 18.77 ], [ -105.03, 19.38 ], [ -105.69, 20.37 ], [ -105.24, 20.58 ], [ -105.34, 20.76 ], [ -105.54, 20.77 ], [ -105.25, 21.04 ], [ -105.19, 21.46 ], [ -105.45, 21.63 ], [ -105.47, 21.98 ], [ -105.52, 21.81 ], [ -105.62, 21.97 ], [ -105.63, 22.18 ], [ -105.54, 21.97 ], [ -105.33, 22.14 ], [ -105.61, 22.3 ], [ -105.64, 22.73 ], [ -105.79, 22.73 ], [ -105.7, 22.47 ], [ -106.43, 23.18 ], [ -107.14, 24.15 ], [ -107.22, 24.13 ], [ -107.28, 24.24 ], [ -107.42, 24.25 ], [ -107.81, 24.5 ], [ -107.49, 24.31 ], [ -107.52, 24.54 ], [ -107.64, 24.46 ], [ -108, 24.65 ], [ -108.01, 25.08 ], [ -108.36, 25.33 ], [ -108.39, 25.19 ], [ -108.68, 25.54 ], [ -109.05, 25.47 ], [ -109.12, 25.55 ], [ -108.99, 25.54 ], [ -108.91, 25.67 ], [ -109.06, 25.58 ], [ -109.25, 25.75 ], [ -109.29, 25.66 ], [ -109.44, 26 ], [ -109.25, 26.31 ], [ -109.3, 26.13 ], [ -109.21, 26.34 ], [ -109.12, 26.17 ], [ -109.08, 26.27 ], [ -109.26, 26.48 ], [ -109.26, 26.32 ], [ -109.31, 26.57 ], [ -109.51, 26.75 ], [ -109.77, 26.71 ], [ -109.97, 27.11 ], [ -110.52, 27.29 ], [ -110.62, 27.62 ], [ -110.51, 27.86 ], [ -111.11, 27.94 ], [ -111.46, 28.32 ], [ -111.37, 28.37 ], [ -111.71, 28.46 ], [ -111.95, 28.76 ], [ -111.84, 28.81 ], [ -112.17, 28.97 ], [ -112.23, 29.31 ], [ -112.41, 29.34 ], [ -113.09, 30.68 ], [ -113.06, 31.16 ], [ -113.62, 31.33 ], [ -113.66, 31.5 ], [ -113.98, 31.66 ], [ -114.15, 31.49 ], [ -114.81, 31.82 ], [ -114.94, 31.32 ], [ -114.71, 30.91 ], [ -114.56, 30.01 ], [ -113.64, 29.28 ], [ -113.53, 28.89 ], [ -113.39, 28.94 ], [ -113.1, 28.51 ], [ -112.85, 28.44 ], [ -112.77, 27.86 ], [ -112.33, 27.52 ], [ -112.22, 27.21 ], [ -111.95, 27.1 ], [ -111.77, 26.55 ], [ -111.85, 26.88 ], [ -111.56, 26.7 ], [ -111.31, 25.77 ], [ -110.69, 24.88 ], [ -110.61, 24.26 ], [ -110.32, 24.18 ], [ -110.39, 24.1 ], [ -110.3, 24.18 ], [ -110.33, 24.33 ], [ -110.23, 24.34 ], [ -109.47, 23.55 ], [ -109.49, 23.15 ], [ -110.01, 22.9 ], [ -110.33, 23.56 ], [ -111.64, 24.56 ], [ -111.82, 24.61 ], [ -111.82, 24.51 ], [ -112, 24.88 ], [ -111.95, 24.75 ], [ -112.04, 24.85 ], [ -112.08, 24.73 ], [ -112.17, 24.96 ], [ -111.98, 25.51 ], [ -112.19, 25.98 ], [ -113.06, 26.6 ], [ -113.23, 26.79 ], [ -113.16, 26.99 ], [ -113.27, 26.75 ], [ -113.45, 26.83 ], [ -113.61, 26.71 ], [ -113.86, 26.97 ], [ -114.44, 27.18 ], [ -114.51, 27.42 ], [ -115.03, 27.74 ], [ -115.06, 27.86 ], [ -114.5, 27.77 ], [ -114.31, 27.87 ], [ -114.11, 27.6 ], [ -113.96, 27.66 ], [ -114.07, 27.81 ], [ -114.05, 27.72 ], [ -114.18, 27.75 ], [ -114.15, 27.95 ], [ -114.28, 27.9 ], [ -114.13, 28.09 ], [ -114.11, 27.92 ], [ -114.04, 28.02 ], [ -114.05, 28.47 ], [ -114.96, 29.37 ], [ -115.7, 29.75 ], [ -116.06, 30.8 ], [ -116.33, 30.96 ], [ -116.36, 31.24 ], [ -116.69, 31.55 ], [ -116.62, 31.85 ], [ -116.88, 32.02 ], [ -117.23, 32.7 ], [ -117.12, 32.67 ], [ -117.21, 32.74 ], [ -117.24, 32.67 ], [ -117.27, 33.09 ], [ -118.1, 33.77 ], [ -118.41, 33.74 ], [ -118.53, 34.03 ], [ -119.13, 34.1 ], [ -119.56, 34.41 ], [ -120.45, 34.44 ], [ -120.65, 34.58 ], [ -120.64, 35.14 ], [ -121.9, 36.31 ], [ -121.98, 36.58 ], [ -121.79, 36.82 ], [ -122.34, 37.12 ], [ -122.52, 37.52 ], [ -122.41, 37.81 ], [ -122.36, 37.59 ], [ -121.92, 37.45 ], [ -122.43, 37.96 ], [ -121.7, 38.01 ], [ -121.7, 38.11 ], [ -122.14, 38.04 ], [ -122.4, 38.15 ], [ -122.53, 37.82 ], [ -122.93, 38.09 ], [ -123.02, 37.99 ], [ -123, 38.24 ], [ -122.83, 38.09 ], [ -123.73, 38.92 ], [ -123.85, 39.83 ], [ -124.36, 40.26 ], [ -124.39, 40.51 ], [ -124.08, 40.83 ], [ -124.24, 40.77 ], [ -124.06, 41.44 ], [ -124.57, 42.84 ], [ -124.39, 43.33 ], [ -124.17, 43.36 ], [ -124.23, 43.47 ], [ -124.35, 43.36 ], [ -124.12, 44.28 ] ], [ [ -88.82, 29.9 ], [ -88.88, 30.05 ], [ -88.87, 29.75 ], [ -88.82, 29.9 ] ], [ [ -118.5, 33.42 ], [ -118.61, 33.48 ], [ -118.31, 33.31 ], [ -118.5, 33.42 ] ], [ [ -79.56, 54.82 ], [ -79.76, 54.77 ], [ -79.02, 54.93 ], [ -79.56, 54.82 ] ], [ [ -75.78, 23.51 ], [ -75.66, 23.45 ], [ -76.03, 23.67 ], [ -75.78, 23.51 ] ], [ [ -77.89, 24.2 ], [ -77.8, 24.26 ], [ -77.99, 24.17 ], [ -77.89, 24.2 ] ], [ [ -145.58, -16.15 ], [ -145.71, -16.08 ], [ -145.46, -16.37 ], [ -145.58, -16.15 ] ], [ [ -145.1, -15.82 ], [ -145.21, -15.79 ], [ -145.06, -15.95 ], [ -145.1, -15.82 ] ], [ [ -143.84, -16.47 ], [ -143.95, -16.44 ], [ -143.77, -16.54 ], [ -143.84, -16.47 ] ], [ [ -84.8, 29.69 ], [ -84.69, 29.77 ], [ -84.96, 29.61 ], [ -84.8, 29.69 ] ] ], [ [ [ 79.41, 9.18 ], [ 79.21, 9.28 ], [ 79.32, 9.33 ], [ 79.41, 9.18 ] ] ], [ [ [ 55.79, 26.79 ], [ 55.75, 26.95 ], [ 56.29, 26.95 ], [ 55.94, 26.69 ], [ 55.27, 26.55 ], [ 55.27, 26.66 ], [ 55.79, 26.79 ] ] ], [ [ [ -27.32, 38.8 ], [ -27.07, 38.77 ], [ -27.08, 38.64 ], [ -27.35, 38.69 ], [ -27.32, 38.8 ] ] ], [ [ [ 151.56, -33.3 ], [ 151.25, -34 ], [ 150.93, -34.32 ], [ 150.75, -34.86 ], [ 150.83, -35.07 ], [ 150.68, -35.02 ], [ 150.76, -35.17 ], [ 150.54, -35.22 ], [ 150.18, -35.71 ], [ 149.87, -37.08 ], [ 150.05, -37.26 ], [ 149.98, -37.5 ], [ 149.48, -37.78 ], [ 148.29, -37.81 ], [ 147.78, -37.96 ], [ 146.88, -38.63 ], [ 146.21, -38.69 ], [ 146.29, -38.9 ], [ 146.48, -38.79 ], [ 146.37, -39.14 ], [ 146.16, -38.8 ], [ 145.92, -38.91 ], [ 145.82, -38.64 ], [ 145.37, -38.54 ], [ 145.55, -38.37 ], [ 145.49, -38.23 ], [ 145.25, -38.22 ], [ 145.23, -38.41 ], [ 144.94, -38.5 ], [ 144.65, -38.3 ], [ 144.92, -38.35 ], [ 145.12, -38.14 ], [ 144.93, -37.84 ], [ 144.36, -38.1 ], [ 144.69, -38.12 ], [ 144.67, -38.27 ], [ 144.04, -38.48 ], [ 143.55, -38.86 ], [ 142.37, -38.35 ], [ 141.74, -38.25 ], [ 141.54, -38.43 ], [ 141.04, -38.07 ], [ 140.4, -37.92 ], [ 139.74, -37.18 ], [ 139.67, -36.95 ], [ 139.85, -36.65 ], [ 139.41, -35.93 ], [ 138.77, -35.52 ], [ 138.1, -35.63 ], [ 138.44, -35.35 ], [ 138.56, -34.8 ], [ 138.09, -34.13 ], [ 137.76, -35.12 ], [ 136.85, -35.28 ], [ 137.01, -34.9 ], [ 137.45, -34.91 ], [ 137.45, -34.14 ], [ 137.98, -33.56 ], [ 137.81, -33.27 ], [ 138.05, -33.12 ], [ 137.79, -32.54 ], [ 137.79, -33 ], [ 137.64, -32.95 ], [ 137.45, -33.13 ], [ 137.21, -33.66 ], [ 136.93, -33.66 ], [ 136.36, -34.07 ], [ 136.09, -34.54 ], [ 135.93, -34.53 ], [ 135.79, -34.81 ], [ 136.01, -34.74 ], [ 135.95, -35.01 ], [ 135.79, -34.86 ], [ 135.62, -34.94 ], [ 135.25, -34.55 ], [ 135.11, -34.59 ], [ 135.21, -34.43 ], [ 135.37, -34.64 ], [ 135.52, -34.61 ], [ 135.39, -34.59 ], [ 135.18, -33.88 ], [ 134.83, -33.63 ], [ 134.71, -33.18 ], [ 134.37, -33.18 ], [ 134.28, -33.02 ], [ 134.33, -33.2 ], [ 134.06, -32.91 ], [ 134.06, -32.72 ], [ 134.2, -32.8 ], [ 134.29, -32.69 ], [ 134.18, -32.48 ], [ 133.85, -32.54 ], [ 133.95, -32.39 ], [ 133.61, -32.09 ], [ 133.13, -32.21 ], [ 132.75, -31.95 ], [ 132.2, -32.03 ], [ 131.15, -31.47 ], [ 130.79, -31.61 ], [ 129.05, -31.68 ], [ 127.22, -32.28 ], [ 125.96, -32.29 ], [ 124.25, -33.01 ], [ 123.98, -33.56 ], [ 123.54, -33.94 ], [ 123.16, -34.02 ], [ 123.02, -33.86 ], [ 122.11, -34.02 ], [ 122.01, -33.83 ], [ 121.36, -33.82 ], [ 120.04, -33.92 ], [ 119.58, -34.15 ], [ 119.58, -34.39 ], [ 119.35, -34.35 ], [ 119.42, -34.46 ], [ 119.26, -34.53 ], [ 118.91, -34.46 ], [ 118.19, -35.02 ], [ 117.95, -34.94 ], [ 117.95, -35.13 ], [ 117.33, -35.03 ], [ 117.46, -34.97 ], [ 116.63, -35.06 ], [ 116, -34.84 ], [ 115.58, -34.42 ], [ 115.14, -34.38 ], [ 114.99, -34.1 ], [ 115, -33.53 ], [ 115.38, -33.63 ], [ 115.68, -33.28 ], [ 115.61, -32.68 ], [ 115.77, -32.19 ], [ 115.7, -31.69 ], [ 115.06, -30.51 ], [ 114.96, -29.35 ], [ 114.56, -28.53 ], [ 114.17, -28.11 ], [ 113.96, -27.22 ], [ 113.16, -26.15 ], [ 113.27, -26.24 ], [ 113.3, -26.02 ], [ 113.38, -26.22 ], [ 113.36, -26.02 ], [ 113.59, -26.64 ], [ 113.63, -26.46 ], [ 113.66, -26.67 ], [ 113.84, -26.58 ], [ 113.88, -26.33 ], [ 113.8, -26.25 ], [ 113.69, -26.22 ], [ 113.58, -26.1 ], [ 113.41, -25.72 ], [ 113.51, -25.5 ], [ 113.76, -25.88 ], [ 113.7, -26.04 ], [ 113.7, -26.2 ], [ 113.78, -26.21 ], [ 113.81, -26.18 ], [ 113.88, -25.94 ], [ 114.08, -26.47 ], [ 114.24, -26.31 ], [ 114.28, -25.86 ], [ 113.4, -24.41 ], [ 113.47, -23.9 ], [ 113.78, -23.47 ], [ 113.83, -22.95 ], [ 113.65, -22.58 ], [ 113.93, -21.98 ], [ 114.19, -21.81 ], [ 114.1, -22.54 ], [ 114.31, -22.43 ], [ 114.43, -22.61 ], [ 114.56, -22.13 ], [ 114.82, -21.86 ], [ 114.68, -21.83 ], [ 115.49, -21.55 ], [ 116.18, -20.98 ], [ 116.19, -20.82 ], [ 116.46, -20.84 ], [ 116.81, -20.53 ], [ 116.8, -20.7 ], [ 117.17, -20.59 ], [ 117.38, -20.79 ], [ 117.82, -20.67 ], [ 118.18, -20.34 ], [ 118.86, -20.29 ], [ 119.1, -19.96 ], [ 119.57, -20.08 ], [ 121.11, -19.54 ], [ 121.81, -18.45 ], [ 122.37, -18.12 ], [ 122.38, -17.99 ], [ 122.18, -17.97 ], [ 122.17, -17.26 ], [ 122.48, -16.9 ], [ 122.62, -16.97 ], [ 122.58, -16.76 ], [ 122.82, -16.77 ], [ 122.74, -16.68 ], [ 122.93, -16.39 ], [ 123.04, -16.36 ], [ 122.96, -16.58 ], [ 123.14, -16.69 ], [ 123.12, -16.94 ], [ 123.56, -17.48 ], [ 123.58, -17.72 ], [ 123.63, -17.2 ], [ 123.71, -17.28 ], [ 123.58, -17.03 ], [ 123.92, -17.22 ], [ 123.8, -17 ], [ 123.92, -17.1 ], [ 123.83, -16.96 ], [ 123.96, -16.83 ], [ 123.8, -16.91 ], [ 123.78, -16.73 ], [ 123.5, -16.66 ], [ 123.64, -16.57 ], [ 123.43, -16.5 ], [ 123.66, -16.49 ], [ 123.5, -16.38 ], [ 123.73, -16.42 ], [ 123.56, -16.18 ], [ 123.81, -16.19 ], [ 123.72, -16.25 ], [ 123.87, -16.45 ], [ 123.89, -16.3 ], [ 124.04, -16.4 ], [ 123.91, -16.21 ], [ 124.13, -16.28 ], [ 124.4, -16.58 ], [ 124.51, -16.55 ], [ 124.39, -16.35 ], [ 124.96, -16.37 ], [ 124.39, -16.34 ], [ 124.45, -16.07 ], [ 124.6, -16.2 ], [ 124.61, -15.9 ], [ 124.78, -15.81 ], [ 124.8, -15.66 ], [ 124.7, -15.62 ], [ 124.75, -15.81 ], [ 124.69, -15.73 ], [ 124.5, -16 ], [ 124.42, -15.55 ], [ 124.68, -15.49 ], [ 124.7, -15.25 ], [ 125.29, -15.6 ], [ 125.23, -15.42 ], [ 125.07, -15.44 ], [ 125.11, -15.26 ], [ 124.88, -15.31 ], [ 125.05, -15.15 ], [ 124.88, -15.26 ], [ 124.83, -15.16 ], [ 125.07, -14.98 ], [ 125.19, -15.21 ], [ 125.29, -15.1 ], [ 125.55, -15.26 ], [ 125.37, -15.11 ], [ 125.49, -14.98 ], [ 125.21, -14.97 ], [ 125.34, -14.89 ], [ 125.14, -14.75 ], [ 125.35, -14.67 ], [ 125.25, -14.6 ], [ 125.37, -14.51 ], [ 125.44, -14.66 ], [ 125.49, -14.51 ], [ 125.6, -14.57 ], [ 125.62, -14.23 ], [ 125.73, -14.28 ], [ 125.64, -14.73 ], [ 125.73, -14.41 ], [ 125.93, -14.71 ], [ 126.17, -14.15 ], [ 125.99, -14.07 ], [ 126.1, -14.05 ], [ 126.01, -13.93 ], [ 126.22, -13.97 ], [ 126.15, -14.08 ], [ 126.31, -14.25 ], [ 126.33, -14.05 ], [ 126.57, -13.94 ], [ 126.45, -14.08 ], [ 126.61, -14.28 ], [ 126.71, -13.97 ], [ 126.95, -13.99 ], [ 126.77, -13.78 ], [ 126.96, -13.74 ], [ 127.32, -14.04 ], [ 127.32, -13.91 ], [ 127.43, -13.94 ], [ 127.96, -14.6 ], [ 128.22, -14.72 ], [ 128.03, -14.92 ], [ 128.14, -14.87 ], [ 128.09, -15.28 ], [ 127.98, -15.28 ], [ 128.08, -15.44 ], [ 127.79, -15.59 ], [ 127.87, -15.73 ], [ 128.1, -15.46 ], [ 128.13, -15.18 ], [ 128.33, -15.49 ], [ 128.2, -15.1 ], [ 128.29, -14.97 ], [ 128.38, -15.12 ], [ 128.36, -14.99 ], [ 128.53, -15.07 ], [ 128.42, -14.8 ], [ 129.02, -14.88 ], [ 129, -15 ], [ 129.09, -14.91 ], [ 129.13, -15.31 ], [ 129.24, -15.11 ], [ 129.36, -15.16 ], [ 129.25, -15.08 ], [ 129.29, -14.86 ], [ 129.6, -15.1 ], [ 129.57, -15.24 ], [ 129.74, -15.19 ], [ 129.65, -14.84 ], [ 129.85, -14.85 ], [ 129.84, -14.95 ], [ 129.87, -14.8 ], [ 130.05, -14.8 ], [ 129.91, -14.72 ], [ 129.76, -14.83 ], [ 129.8, -14.73 ], [ 129.62, -14.69 ], [ 129.83, -14.54 ], [ 129.53, -14.55 ], [ 129.37, -14.34 ], [ 129.75, -13.98 ], [ 129.9, -13.44 ], [ 130, -13.54 ], [ 130.27, -13.33 ], [ 130.42, -13.51 ], [ 130.12, -13.17 ], [ 130.13, -12.97 ], [ 130.42, -12.91 ], [ 130.44, -12.63 ], [ 130.51, -12.76 ], [ 130.77, -12.74 ], [ 130.55, -12.64 ], [ 130.66, -12.64 ], [ 130.58, -12.41 ], [ 130.77, -12.44 ], [ 130.73, -12.6 ], [ 130.93, -12.61 ], [ 130.94, -12.73 ], [ 130.98, -12.62 ], [ 130.86, -12.51 ], [ 131.03, -12.58 ], [ 130.82, -12.41 ], [ 131.05, -12.39 ], [ 131.03, -12.15 ], [ 131.22, -12.23 ], [ 131.3, -12.04 ], [ 131.36, -12.24 ], [ 131.77, -12.27 ], [ 131.74, -12.39 ], [ 131.89, -12.21 ], [ 132.1, -12.36 ], [ 132.25, -12.17 ], [ 132.23, -12.36 ], [ 132.36, -12.2 ], [ 132.51, -12.7 ], [ 132.42, -12.2 ], [ 132.56, -12.09 ], [ 132.77, -12.16 ], [ 132.62, -12.08 ], [ 132.58, -11.79 ], [ 132.75, -11.64 ], [ 132.55, -11.61 ], [ 132.53, -11.43 ], [ 132.12, -11.54 ], [ 131.94, -11.32 ], [ 131.77, -11.33 ], [ 131.99, -11.13 ], [ 132.17, -11.42 ], [ 132.14, -11.12 ], [ 132.28, -11.28 ], [ 132.34, -11.12 ], [ 132.67, -11.52 ], [ 132.92, -11.33 ], [ 133.16, -11.71 ], [ 133.54, -11.76 ], [ 133.49, -11.88 ], [ 133.92, -11.74 ], [ 133.78, -11.88 ], [ 134.18, -11.96 ], [ 134.1, -12.32 ], [ 134.25, -11.98 ], [ 134.58, -12.06 ], [ 134.61, -12.19 ], [ 134.75, -11.95 ], [ 134.81, -12.19 ], [ 135.06, -12.26 ], [ 134.99, -12.34 ], [ 135.15, -12.24 ], [ 135.33, -12.4 ], [ 135.27, -12.25 ], [ 135.34, -12.25 ], [ 135.39, -12.18 ], [ 135.55, -12.14 ], [ 135.65, -12.04 ], [ 135.91, -11.95 ], [ 135.65, -12.16 ], [ 135.67, -12.31 ], [ 136.05, -12.06 ], [ 135.9, -12.44 ], [ 136.02, -12.4 ], [ 136.01, -12.59 ], [ 136.06, -12.43 ], [ 136.4, -12.33 ], [ 136.47, -12.15 ], [ 136.37, -12.25 ], [ 136.17, -12.16 ], [ 136.56, -11.88 ], [ 136.45, -11.99 ], [ 136.65, -12.27 ], [ 136.78, -12.16 ], [ 136.87, -12.38 ], [ 136.98, -12.35 ], [ 136.77, -12.56 ], [ 136.72, -12.46 ], [ 136.62, -12.84 ], [ 136.46, -12.77 ], [ 136.67, -13 ], [ 136.46, -12.98 ], [ 136.57, -13.06 ], [ 136.47, -13.25 ], [ 136.33, -13.32 ], [ 136.34, -13.05 ], [ 136.18, -13.28 ], [ 136.14, -13.13 ], [ 136.05, -13.31 ], [ 135.91, -13.29 ], [ 135.87, -13.56 ], [ 135.74, -13.56 ], [ 135.91, -13.75 ], [ 136.08, -13.66 ], [ 135.9, -14.19 ], [ 135.6, -14.23 ], [ 135.71, -14.34 ], [ 135.34, -14.81 ], [ 135.36, -14.96 ], [ 135.67, -15.06 ], [ 135.61, -15.17 ], [ 135.71, -15.09 ], [ 135.4, -15.45 ], [ 135.75, -15.12 ], [ 136.6, -15.76 ], [ 136.53, -15.89 ], [ 136.43, -15.84 ], [ 136.52, -15.91 ], [ 136.68, -15.81 ], [ 136.65, -15.95 ], [ 136.96, -15.87 ], [ 137.03, -15.97 ], [ 137, -15.87 ], [ 137.42, -16.19 ], [ 137.73, -16.24 ], [ 137.59, -16.47 ], [ 137.75, -16.26 ], [ 138.3, -16.8 ], [ 139.01, -16.9 ], [ 139.22, -17.31 ], [ 139.55, -17.46 ], [ 139.51, -17.47 ], [ 139.51, -17.5 ], [ 139.49, -17.48 ], [ 139.5, -17.52 ], [ 139.48, -17.51 ], [ 139.46, -17.55 ], [ 139.38, -17.57 ], [ 139.37, -17.6 ], [ 139.38, -17.64 ], [ 139.38, -17.57 ], [ 139.46, -17.55 ], [ 139.48, -17.51 ], [ 139.5, -17.53 ], [ 139.52, -17.47 ], [ 139.58, -17.48 ], [ 139.54, -17.5 ], [ 139.59, -17.48 ], [ 139.58, -17.51 ], [ 139.59, -17.49 ], [ 139.65, -17.54 ], [ 139.82, -17.57 ], [ 140, -17.71 ], [ 140.21, -17.7 ], [ 140.23, -17.76 ], [ 140.54, -17.63 ], [ 140.89, -17.38 ], [ 140.95, -17.02 ], [ 141.26, -16.55 ], [ 141.32, -16.69 ], [ 141.38, -15.92 ], [ 141.51, -16.04 ], [ 141.41, -15.92 ], [ 141.44, -15.87 ], [ 141.43, -15.86 ], [ 141.43, -15.84 ], [ 141.59, -15.86 ], [ 141.43, -15.83 ], [ 141.42, -15.84 ], [ 141.42, -15.85 ], [ 141.43, -15.87 ], [ 141.4, -15.91 ], [ 141.58, -15.2 ], [ 141.69, -15.19 ], [ 141.47, -13.88 ], [ 141.6, -13.89 ], [ 141.51, -13.76 ], [ 141.47, -13.86 ], [ 141.63, -13.37 ], [ 141.73, -13.63 ], [ 141.72, -13.38 ], [ 141.86, -13.42 ], [ 141.93, -13.24 ], [ 141.84, -13.37 ], [ 141.68, -13.35 ], [ 141.75, -13.24 ], [ 141.66, -13.34 ], [ 141.58, -13 ], [ 141.8, -12.68 ], [ 141.95, -12.94 ], [ 141.91, -12.75 ], [ 142.12, -12.75 ], [ 141.69, -12.52 ], [ 141.83, -12.39 ], [ 141.59, -12.56 ], [ 141.88, -11.96 ], [ 141.93, -12.17 ], [ 142.16, -12.02 ], [ 141.94, -11.97 ], [ 141.99, -11.77 ], [ 142.15, -11.78 ], [ 142, -11.75 ], [ 142.13, -11.54 ], [ 142.13, -10.96 ], [ 142.53, -10.69 ], [ 142.61, -10.75 ], [ 142.46, -10.98 ], [ 142.59, -10.87 ], [ 142.79, -11.07 ], [ 142.85, -11.84 ], [ 143.24, -11.97 ], [ 143.05, -12.15 ], [ 143.08, -12.34 ], [ 143.44, -12.61 ], [ 143.36, -12.93 ], [ 143.54, -12.84 ], [ 143.53, -13.76 ], [ 143.78, -14.4 ], [ 144.14, -14.49 ], [ 144.17, -14.38 ], [ 144.2, -14.48 ], [ 144.2, -14.26 ], [ 144.52, -14.17 ], [ 144.68, -14.55 ], [ 145.35, -14.95 ], [ 145.18, -15.12 ], [ 145.36, -15.27 ], [ 145.24, -15.45 ], [ 145.48, -16.08 ], [ 145.41, -16.46 ], [ 145.79, -17.02 ], [ 145.96, -16.9 ], [ 145.89, -17.06 ], [ 146.15, -17.65 ], [ 145.98, -18.1 ], [ 146.19, -18.47 ], [ 146.34, -18.53 ], [ 146.25, -18.84 ], [ 146.88, -19.3 ], [ 147.02, -19.18 ], [ 147.12, -19.41 ], [ 147.44, -19.42 ], [ 147.41, -19.31 ], [ 147.67, -19.83 ], [ 147.82, -19.71 ], [ 147.87, -19.88 ], [ 148.26, -19.98 ], [ 148.34, -20.15 ], [ 148.56, -20.07 ], [ 148.77, -20.24 ], [ 148.93, -20.54 ], [ 148.67, -20.43 ], [ 148.73, -20.72 ], [ 149.23, -21.06 ], [ 149.29, -21.54 ], [ 149.49, -21.53 ], [ 149.52, -22.34 ], [ 149.73, -22.47 ], [ 149.81, -22.38 ], [ 150.04, -22.65 ], [ 149.91, -22.32 ], [ 150.05, -22.13 ], [ 150.64, -22.66 ], [ 150.53, -22.38 ], [ 150.63, -22.33 ], [ 150.66, -22.45 ], [ 150.67, -22.35 ], [ 150.7, -22.63 ], [ 150.77, -22.52 ], [ 150.84, -22.69 ], [ 150.73, -22.91 ], [ 150.82, -23.42 ], [ 151.45, -24.09 ], [ 151.89, -24.15 ], [ 152.12, -24.6 ], [ 152.47, -24.82 ], [ 152.51, -25.08 ], [ 152.91, -25.29 ], [ 152.93, -25.81 ], [ 153.02, -26 ], [ 153.04, -25.81 ], [ 153.19, -25.93 ], [ 153.03, -27.18 ], [ 153.29, -27.51 ], [ 153.48, -28.27 ], [ 153.57, -28.2 ], [ 153.61, -28.84 ], [ 153.34, -29.3 ], [ 152.99, -30.7 ], [ 153.06, -31.06 ], [ 152.51, -32.11 ], [ 152.54, -32.44 ], [ 152.21, -32.7 ], [ 151.97, -32.65 ], [ 151.92, -32.78 ], [ 152.19, -32.74 ], [ 151.8, -32.88 ], [ 151.56, -33.3 ] ] ], [ [ [ 16.86, 43.12 ], [ 16.37, 43.2 ], [ 17.2, 43.12 ], [ 16.86, 43.12 ] ] ], [ [ [ -7.04, 62.22 ], [ -6.74, 61.94 ], [ -7.22, 62.3 ], [ -7.04, 62.22 ] ] ], [ [ [ 139.19, -16.67 ], [ 139.31, -16.46 ], [ 139.55, -16.39 ], [ 139.7, -16.48 ], [ 139.55, -16.46 ], [ 139.31, -16.73 ], [ 139.19, -16.67 ] ] ], [ [ [ -125.09, 48.88 ], [ -124.86, 49 ], [ -124.81, 49.24 ], [ -124.91, 48.98 ], [ -125.19, 48.99 ], [ -125.2, 49.1 ], [ -125.22, 48.95 ], [ -125.35, 49.04 ], [ -125.54, 48.92 ], [ -125.92, 49.14 ], [ -125.73, 49.07 ], [ -125.6, 49.21 ], [ -125.79, 49.14 ], [ -125.78, 49.37 ], [ -125.97, 49.23 ], [ -125.9, 49.42 ], [ -126.01, 49.32 ], [ -126.29, 49.51 ], [ -126.26, 49.35 ], [ -126.4, 49.48 ], [ -126.58, 49.41 ], [ -126.48, 49.64 ], [ -126.12, 49.68 ], [ -126.44, 49.65 ], [ -126.5, 49.8 ], [ -126.59, 49.69 ], [ -126.65, 49.92 ], [ -126.86, 49.98 ], [ -126.83, 49.88 ], [ -126.94, 49.99 ], [ -126.94, 49.86 ], [ -127.15, 49.86 ], [ -127.09, 50.15 ], [ -127.31, 50.2 ], [ -127.34, 50.02 ], [ -127.43, 50.19 ], [ -127.92, 50.11 ], [ -127.72, 50.3 ], [ -127.98, 50.32 ], [ -127.94, 50.46 ], [ -127.59, 50.49 ], [ -127.43, 50.34 ], [ -127.61, 50.52 ], [ -127.42, 50.6 ], [ -128.01, 50.65 ], [ -127.56, 50.55 ], [ -128.05, 50.44 ], [ -128.43, 50.79 ], [ -127.91, 50.87 ], [ -126.87, 50.53 ], [ -125.45, 50.33 ], [ -125.39, 50.12 ], [ -124.86, 49.71 ], [ -124.98, 49.67 ], [ -124.79, 49.46 ], [ -123.95, 49.23 ], [ -123.56, 48.8 ], [ -123.55, 48.49 ], [ -123.44, 48.7 ], [ -123.27, 48.45 ], [ -123.56, 48.31 ], [ -123.92, 48.38 ], [ -125.1, 48.72 ], [ -125.09, 48.88 ] ] ], [ [ [ 104.45, -.34 ], [ 104.6, -.47 ], [ 104.36, -.68 ], [ 104.24, -.49 ], [ 104.45, -.34 ] ] ], [ [ [ 132.56, -11.03 ], [ 132.59, -11.36 ], [ 132.47, -11.15 ], [ 132.56, -11.03 ] ] ], [ [ [ 136.94, -15.71 ], [ 137.07, -15.63 ], [ 137.07, -15.85 ], [ 136.94, -15.71 ] ] ], [ [ [ 136.65, -11.27 ], [ 136.47, -11.45 ], [ 136.76, -11.02 ], [ 136.65, -11.27 ] ] ], [ [ [ 139.55, -17.1 ], [ 139.39, -17.08 ], [ 139.49, -16.98 ], [ 139.55, -17.1 ] ] ], [ [ [ 136.44, -14.2 ], [ 136.33, -14.25 ], [ 136.42, -13.82 ], [ 136.69, -13.65 ], [ 136.73, -13.84 ], [ 136.91, -13.77 ], [ 136.7, -14.12 ], [ 136.96, -14.17 ], [ 136.95, -14.3 ], [ 136.44, -14.2 ] ] ], [ [ [ 136.29, -13.74 ], [ 136.11, -13.82 ], [ 136.2, -13.67 ], [ 136.29, -13.74 ] ] ], [ [ [ 136.14, -13.47 ], [ 136.14, -13.57 ], [ 136.09, -13.36 ], [ 136.14, -13.47 ] ] ], [ [ [ 49.29, 68.78 ], [ 48.72, 68.69 ], [ 48.58, 68.7 ], [ 48.58, 68.75 ], [ 48.38, 68.79 ], [ 48.37, 68.84 ], [ 48.31, 68.83 ], [ 48.27, 68.85 ], [ 48.34, 68.84 ], [ 48.23, 68.87 ], [ 48.22, 68.89 ], [ 48.24, 68.89 ], [ 48.22, 68.9 ], [ 48.23, 68.82 ], [ 48.26, 68.8 ], [ 48.24, 68.81 ], [ 48.43, 68.72 ], [ 48.23, 68.81 ], [ 48.21, 68.92 ], [ 48.22, 68.96 ], [ 48.26, 68.93 ], [ 48.22, 69.02 ], [ 48.3, 69.03 ], [ 48.22, 69.03 ], [ 48.24, 69.1 ], [ 48.36, 69.28 ], [ 48.98, 69.5 ], [ 50.31, 69.13 ], [ 49.29, 68.78 ] ] ], [ [ [ 15.64, 68.97 ], [ 15.48, 68.87 ], [ 16.14, 69.33 ], [ 15.64, 68.97 ] ] ], [ [ [ 23.56, 35.27 ], [ 23.58, 35.59 ], [ 23.72, 35.51 ], [ 23.74, 35.7 ], [ 23.84, 35.53 ], [ 24.17, 35.59 ], [ 24.06, 35.49 ], [ 24.28, 35.36 ], [ 25.77, 35.34 ], [ 25.81, 35.11 ], [ 26.31, 35.32 ], [ 26.32, 35.19 ], [ 26.11, 35 ], [ 24.76, 34.92 ], [ 24.74, 35.08 ], [ 24.39, 35.19 ], [ 23.56, 35.27 ] ] ], [ [ [ 149.86, 45.77 ], [ 149.4, 45.58 ], [ 150.22, 46.19 ], [ 150.57, 46.23 ], [ 149.86, 45.77 ] ] ], [ [ [ 158.18, 6.97 ], [ 158.3, 6.96 ], [ 158.3, 6.79 ], [ 158.16, 6.81 ], [ 158.18, 6.97 ] ] ], [ [ [ 155.65, 50.38 ], [ 156.15, 50.75 ], [ 155.89, 50.25 ], [ 155.23, 50.05 ], [ 155.21, 50.29 ], [ 155.65, 50.38 ] ] ], [ [ [ 50.5, 26.25 ], [ 50.63, 26.22 ], [ 50.57, 25.79 ], [ 50.5, 26.25 ] ] ], [ [ [ 25.67, 71.19 ], [ 25.89, 71.01 ], [ 26.23, 71.04 ], [ 25.56, 70.93 ], [ 25.24, 71.05 ], [ 25.73, 71.07 ], [ 25.67, 71.19 ] ] ], [ [ [ 127.23, -8.48 ], [ 126.48, -8.95 ], [ 125.37, -9.27 ], [ 124.4, -10.17 ], [ 123.46, -10.36 ], [ 123.76, -10.09 ], [ 123.58, -9.94 ], [ 123.79, -9.49 ], [ 124.97, -8.95 ], [ 125.12, -8.64 ], [ 127, -8.32 ], [ 127.3, -8.39 ], [ 127.23, -8.48 ] ] ], [ [ [ 104.03, 1.35 ], [ 103.61, 1.22 ], [ 103.71, 1.45 ], [ 104.03, 1.35 ] ] ], [ [ [ 122.52, 10.51 ], [ 122.67, 10.75 ], [ 122.67, 10.47 ], [ 122.51, 10.41 ], [ 122.52, 10.51 ] ] ], [ [ [ 118.48, 39.05 ], [ 118.65, 39.06 ], [ 118.51, 38.92 ], [ 118.48, 39.05 ] ] ], [ [ [ -25.09, 17.2 ], [ -24.99, 17.06 ], [ -25.3, 16.91 ], [ -25.34, 17.09 ], [ -25.09, 17.2 ] ] ], [ [ [ -94.98, 29.19 ], [ -94.72, 29.33 ], [ -95.12, 29.09 ], [ -94.98, 29.19 ] ] ], [ [ [ 128.18, -3.57 ], [ 128.34, -3.5 ], [ 128.36, -3.63 ], [ 127.94, -3.77 ], [ 128.18, -3.57 ] ] ], [ [ [ -73.07, 22.44 ], [ -72.73, 22.34 ], [ -73.17, 22.36 ], [ -73.07, 22.44 ] ] ], [ [ [ 14.36, 45 ], [ 14.32, 45.18 ], [ 14.5, 44.6 ], [ 14.36, 45 ] ] ], [ [ [ 168.31, -16.32 ], [ 168.13, -16.37 ], [ 167.91, -16.23 ], [ 168.17, -16.1 ], [ 168.31, -16.32 ] ] ], [ [ [ 146.17, 44.52 ], [ 146.58, 44.46 ], [ 145.92, 44.14 ], [ 145.54, 43.65 ], [ 145.4, 43.84 ], [ 146.17, 44.52 ] ] ], [ [ [ -1.64, 60.31 ], [ -1.26, 60.35 ], [ -1.63, 60.48 ], [ -1.31, 60.64 ], [ -1.38, 60.4 ], [ -1.05, 60.44 ], [ -1.27, 59.85 ], [ -1.27, 60.24 ], [ -1.46, 60.15 ], [ -1.64, 60.31 ] ] ], [ [ [ 167.62, 54.73 ], [ 167.44, 54.87 ], [ 168.1, 54.5 ], [ 167.62, 54.73 ] ] ], [ [ [ 145.27, -38.38 ], [ 145.3, -38.28 ], [ 145.5, -38.35 ], [ 145.27, -38.38 ] ] ], [ [ [ 163.73, 58.62 ], [ 163.49, 58.45 ], [ 163.95, 59.01 ], [ 163.69, 58.99 ], [ 164.59, 59.24 ], [ 164.68, 58.9 ], [ 163.73, 58.62 ] ] ], [ [ [ 178.48, -37.78 ], [ 178.29, -38.53 ], [ 177.92, -38.8 ], [ 177.91, -39.22 ], [ 177.84, -39.06 ], [ 177.39, -39.07 ], [ 176.9, -39.37 ], [ 177.1, -39.64 ], [ 176.87, -40.13 ], [ 175.96, -41.25 ], [ 175.29, -41.61 ], [ 175.2, -41.42 ], [ 174.87, -41.41 ], [ 174.89, -41.23 ], [ 174.66, -41.34 ], [ 175.14, -40.69 ], [ 175.19, -40.16 ], [ 174.91, -39.89 ], [ 173.91, -39.52 ], [ 173.75, -39.28 ], [ 174.6, -38.82 ], [ 174.68, -38.11 ], [ 174.92, -38.09 ], [ 174.78, -38.08 ], [ 174.89, -37.96 ], [ 174.76, -37.86 ], [ 174.97, -37.8 ], [ 174.84, -37.8 ], [ 174.7, -37.42 ], [ 174.81, -37.32 ], [ 174.69, -37.35 ], [ 174.54, -37.06 ], [ 174.73, -37.25 ], [ 174.69, -37.14 ], [ 174.94, -37.06 ], [ 174.77, -36.93 ], [ 174.48, -37.04 ], [ 174.16, -36.47 ], [ 174.44, -36.65 ], [ 174.43, -36.34 ], [ 174.25, -36.38 ], [ 174.51, -36.25 ], [ 174.31, -36.31 ], [ 174.42, -36.14 ], [ 174.31, -36.23 ], [ 174.2, -36.11 ], [ 174.23, -36.26 ], [ 173.99, -36.12 ], [ 174.18, -36.34 ], [ 174.05, -36.39 ], [ 173.22, -35.38 ], [ 173.28, -35.28 ], [ 173.21, -35.38 ], [ 173.06, -35.19 ], [ 173.15, -35 ], [ 172.68, -34.42 ], [ 173.05, -34.41 ], [ 172.86, -34.54 ], [ 173.28, -34.89 ], [ 173.23, -35.02 ], [ 173.4, -34.78 ], [ 173.46, -35.02 ], [ 173.56, -34.91 ], [ 173.72, -35.09 ], [ 173.86, -34.99 ], [ 174.08, -35.12 ], [ 173.96, -35.22 ], [ 174.1, -35.36 ], [ 174.33, -35.17 ], [ 174.59, -35.85 ], [ 174.36, -35.73 ], [ 174.31, -35.84 ], [ 174.5, -35.84 ], [ 174.57, -36.14 ], [ 174.87, -36.37 ], [ 174.72, -36.36 ], [ 174.74, -36.5 ], [ 174.66, -36.4 ], [ 174.66, -36.6 ], [ 174.84, -36.6 ], [ 174.68, -36.62 ], [ 174.81, -36.83 ], [ 174.6, -36.76 ], [ 174.66, -36.9 ], [ 175.04, -36.87 ], [ 175.28, -36.99 ], [ 175.34, -37.21 ], [ 175.51, -37.18 ], [ 175.41, -36.47 ], [ 175.61, -36.76 ], [ 175.82, -36.72 ], [ 175.66, -36.87 ], [ 175.83, -36.86 ], [ 176.04, -37.68 ], [ 176.23, -37.71 ], [ 176.18, -37.62 ], [ 177.15, -38.04 ], [ 177.98, -37.54 ], [ 178.32, -37.56 ], [ 178.54, -37.68 ], [ 178.48, -37.78 ] ] ], [ [ [ 165.95, -50.75 ], [ 166.06, -50.53 ], [ 166.29, -50.54 ], [ 166.08, -50.72 ], [ 166.22, -50.86 ], [ 166.02, -50.74 ], [ 165.89, -50.84 ], [ 165.95, -50.75 ] ] ], [ [ [ -6.73, 62.11 ], [ -7.1, 62.32 ], [ -6.64, 62.2 ], [ -6.73, 62.11 ] ] ], [ [ [ 73.77, -53.12 ], [ 73.49, -53.19 ], [ 73.25, -52.99 ], [ 73.77, -53.12 ] ] ], [ [ [ 175.49, -36.19 ], [ 175.52, -36.35 ], [ 175.31, -36.23 ], [ 175.34, -36.07 ], [ 175.49, -36.19 ] ] ], [ [ [ 153.08, -25.79 ], [ 152.94, -25.59 ], [ 152.99, -25.22 ], [ 153.23, -24.98 ], [ 153.12, -24.82 ], [ 153.26, -24.7 ], [ 153.36, -25.01 ], [ 153.08, -25.79 ] ] ], [ [ [ 49.96, -13.33 ], [ 50.46, -15.46 ], [ 50.16, -16 ], [ 49.9, -15.44 ], [ 49.62, -15.55 ], [ 49.68, -16.05 ], [ 49.86, -16.22 ], [ 49.72, -16.71 ], [ 49.84, -16.84 ], [ 49.6, -16.91 ], [ 49.43, -17.3 ], [ 49.43, -18.16 ], [ 47.91, -22.43 ], [ 47.59, -23.79 ], [ 47.1, -24.99 ], [ 45.16, -25.6 ], [ 44.02, -24.98 ], [ 43.67, -24.33 ], [ 43.64, -23.67 ], [ 43.77, -23.46 ], [ 43.37, -22.85 ], [ 43.22, -22.25 ], [ 43.35, -21.75 ], [ 43.51, -21.69 ], [ 43.5, -21.39 ], [ 43.75, -21.34 ], [ 43.9, -20.85 ], [ 44.52, -19.97 ], [ 43.93, -17.55 ], [ 44.42, -16.72 ], [ 44.44, -16.2 ], [ 44.83, -16.24 ], [ 45.26, -15.94 ], [ 45.24, -16.15 ], [ 45.38, -16.12 ], [ 45.35, -15.98 ], [ 45.66, -16.1 ], [ 45.67, -15.77 ], [ 45.79, -15.91 ], [ 45.93, -15.78 ], [ 46.07, -15.9 ], [ 46.12, -15.71 ], [ 46.21, -15.85 ], [ 46.32, -15.8 ], [ 46.37, -15.61 ], [ 46.75, -15.46 ], [ 46.63, -15.41 ], [ 46.94, -15.2 ], [ 47.07, -15.34 ], [ 46.94, -15.47 ], [ 47.26, -15.5 ], [ 47.05, -15.19 ], [ 47.38, -14.92 ], [ 47.28, -14.86 ], [ 47.46, -14.67 ], [ 47.42, -15.15 ], [ 47.79, -14.57 ], [ 47.88, -14.73 ], [ 47.99, -14.67 ], [ 47.91, -14.97 ], [ 48.06, -14.68 ], [ 48, -14.53 ], [ 47.95, -14.48 ], [ 47.86, -14.61 ], [ 47.8, -14.54 ], [ 47.74, -14.61 ], [ 47.69, -14.44 ], [ 47.8, -14.22 ], [ 47.93, -14.27 ], [ 47.89, -14.1 ], [ 48, -14.13 ], [ 47.99, -14.42 ], [ 48.07, -14.22 ], [ 47.89, -13.6 ], [ 48.06, -13.53 ], [ 48.27, -13.83 ], [ 48.56, -13.53 ], [ 48.47, -13.37 ], [ 48.69, -13.53 ], [ 48.83, -13.39 ], [ 48.83, -13.13 ], [ 49.01, -12.9 ], [ 48.89, -12.54 ], [ 48.72, -12.44 ], [ 48.94, -12.49 ], [ 49.24, -11.95 ], [ 49.37, -12.21 ], [ 49.26, -12.14 ], [ 49.19, -12.32 ], [ 49.36, -12.23 ], [ 49.52, -12.37 ], [ 49.53, -12.68 ], [ 49.86, -12.9 ], [ 49.96, -13.33 ] ] ], [ [ [ 150.35, -9.51 ], [ 150.1, -9.37 ], [ 150.16, -9.22 ], [ 150.34, -9.27 ], [ 150.35, -9.51 ] ] ], [ [ [ -77.83, 22.23 ], [ -77.87, 22.32 ], [ -77.74, 22.17 ], [ -77.83, 22.23 ] ] ], [ [ [ -45.74, 82.02 ], [ -45.8, 81.91 ], [ -48.46, 82.57 ], [ -47.04, 82.6 ], [ -45.63, 82.42 ], [ -45.74, 82.02 ] ] ], [ [ [ -45.88, 82.88 ], [ -46.78, 82.78 ], [ -47.66, 82.91 ], [ -46.6, 82.85 ], [ -47.44, 82.94 ], [ -46.74, 83.04 ], [ -45.88, 82.88 ] ] ], [ [ [ -52.43, 81.98 ], [ -54.06, 82.07 ], [ -53.9, 82.3 ], [ -52.43, 81.98 ] ] ], [ [ [ 178.15, -19.05 ], [ 178.31, -18.93 ], [ 178.49, -19 ], [ 177.95, -19.13 ], [ 178.15, -19.05 ] ] ], [ [ [ 63.02, 80.64 ], [ 62.53, 80.8 ], [ 64.98, 81.17 ], [ 65.16, 80.84 ], [ 63.02, 80.64 ] ] ], [ [ [ -60.99, 56.12 ], [ -60.97, 56.01 ], [ -61.24, 56.07 ], [ -60.99, 56.12 ] ] ], [ [ [ 56.95, 80.35 ], [ 57.03, 80.07 ], [ 55.79, 80.09 ], [ 55.93, 80.3 ], [ 56.95, 80.35 ] ] ], [ [ [ 56.97, 80.45 ], [ 59.29, 80.32 ], [ 58.18, 80.27 ], [ 57.86, 80.09 ], [ 56.97, 80.45 ] ] ], [ [ [ 24.6, 40.61 ], [ 24.56, 40.76 ], [ 24.72, 40.79 ], [ 24.78, 40.61 ], [ 24.6, 40.61 ] ] ], [ [ [ -61.41, 56.52 ], [ -61.14, 56.44 ], [ -61.64, 56.49 ], [ -61.41, 56.52 ] ] ], [ [ [ 53.44, 80.13 ], [ 52.25, 80.22 ], [ 53, 80.39 ], [ 53.93, 80.23 ], [ 53.44, 80.13 ] ] ], [ [ [ 50.99, 80.1 ], [ 51.48, 79.93 ], [ 50.4, 79.93 ], [ 50.99, 80.1 ] ] ], [ [ [ -61.45, 56.85 ], [ -61.39, 56.6 ], [ -61.72, 56.67 ], [ -61.48, 56.96 ], [ -61.34, 56.93 ], [ -61.45, 56.85 ] ] ], [ [ [ -61.72, 57.54 ], [ -61.65, 57.39 ], [ -61.92, 57.44 ], [ -61.72, 57.54 ] ] ], [ [ [ -61.97, 57.58 ], [ -61.78, 57.55 ], [ -61.92, 57.45 ], [ -61.97, 57.58 ] ] ], [ [ [ 156.23, 50.67 ], [ 156.48, 50.87 ], [ 156.41, 50.64 ], [ 156.23, 50.67 ] ] ], [ [ [ 82.74, 75.94 ], [ 82.33, 75.95 ], [ 83.28, 75.93 ], [ 82.74, 75.94 ] ] ], [ [ [ -64.54, 60.38 ], [ -64.4, 60.28 ], [ -64.87, 60.46 ], [ -64.54, 60.38 ] ] ], [ [ [ 173.81, -40.83 ], [ 173.96, -40.69 ], [ 173.77, -40.94 ], [ 173.81, -40.83 ] ] ], [ [ [ 167.44, -16.11 ], [ 167.77, -16.33 ], [ 167.77, -16.55 ], [ 167.42, -16.53 ], [ 167.39, -16.18 ], [ 167.19, -16.14 ], [ 167.18, -15.9 ], [ 167.44, -16.11 ] ] ], [ [ [ 136.78, 54.89 ], [ 137.19, 55.12 ], [ 137.06, 54.92 ], [ 136.78, 54.89 ] ] ], [ [ [ 24.75, 64.98 ], [ 24.65, 65.08 ], [ 25.07, 65.04 ], [ 24.75, 64.98 ] ] ], [ [ [ -1.81, 57.44 ], [ -2.54, 56.57 ], [ -3.41, 56.38 ], [ -2.81, 56.45 ], [ -2.91, 56.35 ], [ -2.6, 56.26 ], [ -3.39, 56.01 ], [ -3.91, 56.12 ], [ -3.69, 56.01 ], [ -3.07, 55.95 ], [ -2.65, 56.06 ], [ -1.64, 55.58 ], [ -1.2, 54.62 ], [ -.59, 54.49 ], [ -.08, 54.12 ], [ -.21, 54 ], [ .14, 53.6 ], [ -.44, 53.7 ], [ .15, 53.49 ], [ .36, 53.19 ], [ -.04, 52.87 ], [ .2, 52.77 ], [ .54, 52.97 ], [ .98, 52.98 ], [ 1.7, 52.72 ], [ 1.58, 52.09 ], [ 1.05, 51.95 ], [ 1.29, 51.95 ], [ 1.22, 51.81 ], [ .91, 51.89 ], [ 1, 51.79 ], [ .68, 51.73 ], [ .94, 51.74 ], [ .9, 51.62 ], [ .57, 51.62 ], [ .85, 51.55 ], [ .51, 51.53 ], [ .73, 51.35 ], [ 1.44, 51.39 ], [ 1.4, 51.17 ], [ .24, 50.73 ], [ -.29, 50.85 ], [ -.79, 50.72 ], [ -.81, 50.83 ], [ -1.14, 50.77 ], [ -1.38, 50.89 ], [ -1.55, 50.71 ], [ -2.05, 50.73 ], [ -1.96, 50.59 ], [ -2.61, 50.65 ], [ -2.46, 50.51 ], [ -2.79, 50.72 ], [ -3.36, 50.61 ], [ -3.49, 50.69 ], [ -3.64, 50.22 ], [ -4.12, 50.32 ], [ -4.21, 50.52 ], [ -4.19, 50.32 ], [ -4.67, 50.41 ], [ -5.01, 50.14 ], [ -5.05, 50.27 ], [ -5.19, 49.96 ], [ -5.48, 50.13 ], [ -5.68, 50.03 ], [ -5.04, 50.55 ], [ -4.83, 50.52 ], [ -4.53, 51.02 ], [ -4.22, 51.06 ], [ -4.17, 50.96 ], [ -4.05, 51.07 ], [ -4.23, 51.19 ], [ -3.01, 51.22 ], [ -2.53, 51.68 ], [ -3.41, 51.38 ], [ -3.84, 51.64 ], [ -4.31, 51.56 ], [ -4.05, 51.66 ], [ -4.33, 51.68 ], [ -4.32, 51.83 ], [ -4.93, 51.6 ], [ -5.13, 51.68 ], [ -4.82, 51.79 ], [ -5.25, 51.73 ], [ -5.1, 51.81 ], [ -5.31, 51.91 ], [ -4.21, 52.26 ], [ -3.93, 52.55 ], [ -4.13, 52.61 ], [ -3.92, 52.75 ], [ -4.15, 52.81 ], [ -4.01, 52.94 ], [ -4.77, 52.79 ], [ -4.35, 53.03 ], [ -4.35, 53.11 ], [ -4.32, 53.1 ], [ -4.31, 53.13 ], [ -4.27, 53.13 ], [ -4.28, 53.14 ], [ -4.21, 53.18 ], [ -4.19, 53.21 ], [ -4.12, 53.24 ], [ -4.03, 53.24 ], [ -3.85, 53.3 ], [ -3.82, 53.17 ], [ -3.8, 53.27 ], [ -3.87, 53.34 ], [ -3.32, 53.36 ], [ -3.04, 53.22 ], [ -3.08, 53.44 ], [ -2.89, 53.29 ], [ -2.58, 53.38 ], [ -2.87, 53.33 ], [ -3.1, 53.55 ], [ -2.8, 54.25 ], [ -3.15, 54.07 ], [ -3.64, 54.51 ], [ -3.4, 54.87 ], [ -3.05, 54.99 ], [ -3.62, 55.07 ], [ -3.59, 54.87 ], [ -3.98, 54.77 ], [ -4.46, 54.95 ], [ -4.39, 54.68 ], [ -4.86, 54.87 ], [ -4.86, 54.63 ], [ -5.15, 54.86 ], [ -4.62, 55.49 ], [ -4.88, 55.94 ], [ -4.33, 55.87 ], [ -4.7, 55.97 ], [ -4.84, 56.08 ], [ -4.85, 55.99 ], [ -4.88, 56.06 ], [ -4.75, 56.21 ], [ -4.92, 56.16 ], [ -4.98, 55.86 ], [ -5.12, 56.01 ], [ -5.31, 55.85 ], [ -4.92, 56.27 ], [ -5.44, 56.03 ], [ -5.31, 55.78 ], [ -5.52, 55.37 ], [ -5.8, 55.3 ], [ -5.44, 55.86 ], [ -5.67, 55.8 ], [ -5.58, 56.33 ], [ -5.12, 56.49 ], [ -5.47, 56.48 ], [ -5.32, 56.65 ], [ -4.98, 56.71 ], [ -5.25, 56.7 ], [ -5.08, 56.83 ], [ -5.33, 56.86 ], [ -5.12, 56.83 ], [ -5.69, 56.5 ], [ -6, 56.65 ], [ -5.54, 56.69 ], [ -6.23, 56.71 ], [ -5.75, 56.78 ], [ -5.83, 57.01 ], [ -5.51, 57 ], [ -5.72, 57.12 ], [ -5.39, 57.11 ], [ -5.69, 57.16 ], [ -5.45, 57.31 ], [ -5.73, 57.28 ], [ -5.44, 57.42 ], [ -5.82, 57.36 ], [ -5.84, 57.58 ], [ -5.51, 57.54 ], [ -5.82, 57.64 ], [ -5.81, 57.86 ], [ -5.6, 57.77 ], [ -5.62, 57.92 ], [ -5.22, 57.84 ], [ -5.36, 57.94 ], [ -5.07, 57.83 ], [ -5.46, 58.07 ], [ -5.24, 58.15 ], [ -5.38, 58.26 ], [ -4.94, 58.21 ], [ -5.18, 58.35 ], [ -5, 58.63 ], [ -4.65, 58.55 ], [ -4.75, 58.45 ], [ -4.44, 58.56 ], [ -4.48, 58.44 ], [ -3.03, 58.65 ], [ -3.21, 58.31 ], [ -3.98, 57.97 ], [ -4.01, 57.86 ], [ -4.36, 57.89 ], [ -4.05, 57.81 ], [ -3.77, 57.87 ], [ -4.41, 57.5 ], [ -3.34, 57.72 ], [ -2, 57.7 ], [ -1.81, 57.44 ] ] ], [ [ [ -157.95, 21.38 ], [ -158.11, 21.3 ], [ -158.28, 21.57 ], [ -157.97, 21.71 ], [ -157.65, 21.3 ], [ -157.95, 21.38 ] ] ], [ [ [ -90.47, -68.83 ], [ -90.66, -68.92 ], [ -90.7, -68.76 ], [ -90.47, -68.83 ] ] ], [ [ [ -57.14, -64.09 ], [ -57.31, -64.38 ], [ -57.98, -64.45 ], [ -58.31, -64.32 ], [ -58.03, -64.08 ], [ -58.46, -64.09 ], [ -57.78, -63.78 ], [ -57.87, -64.07 ], [ -57.47, -63.91 ], [ -57.14, -64.09 ] ] ], [ [ [ -55.73, -63.44 ], [ -55.97, -63.59 ], [ -56.26, -63.48 ], [ -55.73, -63.44 ] ] ], [ [ [ -58.91, -62.14 ], [ -58.43, -61.93 ], [ -57.69, -61.89 ], [ -57.58, -62.02 ], [ -58.19, -62.05 ], [ -58.27, -62.19 ], [ -58.44, -62.06 ], [ -58.62, -62.26 ], [ -59.02, -62.23 ], [ -58.91, -62.14 ] ] ], [ [ [ -55.21, -61.28 ], [ -55.37, -61.05 ], [ -54.65, -61.1 ], [ -55.21, -61.28 ] ] ], [ [ [ -56.05, -63.14 ], [ -55.16, -63.19 ], [ -55.05, -63.32 ], [ -55.9, -63.29 ], [ -56.42, -63.44 ], [ -56.55, -63.33 ], [ -56.05, -63.14 ] ] ], [ [ [ -56.17, -63 ], [ -56.31, -63.19 ], [ -56.62, -63.06 ], [ -56.17, -63 ] ] ], [ [ [ -57.27, -63.87 ], [ -57.7, -63.82 ], [ -57.05, -63.84 ], [ -57.27, -63.87 ] ] ], [ [ [ -57.38, -64.56 ], [ -57.45, -64.45 ], [ -56.89, -64.33 ], [ -57.38, -64.56 ] ] ], [ [ [ 137.52, 55.12 ], [ 138.22, 55.02 ], [ 137.7, 54.61 ], [ 137.49, 54.87 ], [ 137.24, 54.76 ], [ 137.52, 55.12 ] ] ], [ [ [ -60.37, -62.64 ], [ -61.22, -62.59 ], [ -60.14, -62.45 ], [ -59.81, -62.61 ], [ -60.31, -62.76 ], [ -60.37, -62.64 ] ] ], [ [ [ -61.99, -63.35 ], [ -62.27, -63.36 ], [ -62.21, -63.23 ], [ -61.99, -63.35 ] ] ], [ [ [ -62.39, -64.01 ], [ -61.99, -64.14 ], [ -62.6, -64.53 ], [ -62.39, -64.01 ] ] ], [ [ [ -60.89, -63.85 ], [ -60.82, -63.68 ], [ -60.56, -63.7 ], [ -60.68, -63.89 ], [ -60.89, -63.85 ] ] ], [ [ [ -63.16, -64.31 ], [ -63.29, -64.58 ], [ -62.82, -64.57 ], [ -63.18, -64.65 ], [ -63.34, -64.77 ], [ -63.43, -64.72 ], [ -63.56, -64.73 ], [ -63.71, -64.86 ], [ -64.3, -64.71 ], [ -63.58, -64.27 ], [ -63.16, -64.31 ] ] ], [ [ [ -63.51, -64.81 ], [ -63.35, -64.8 ], [ -63.17, -64.71 ], [ -63.43, -64.91 ], [ -63.51, -64.81 ] ] ], [ [ [ 164.25, -20.27 ], [ 165.24, -20.77 ], [ 165.63, -21.27 ], [ 166.94, -22.09 ], [ 167, -22.34 ], [ 166.45, -22.31 ], [ 166.06, -21.9 ], [ 164.95, -21.36 ], [ 164.84, -21.06 ], [ 164.46, -20.85 ], [ 164.19, -20.34 ], [ 164.03, -20.3 ], [ 164, -20.08 ], [ 164.25, -20.27 ] ] ], [ [ [ -67.3, -67.74 ], [ -67.77, -67.67 ], [ -67.25, -67.57 ], [ -67.3, -67.74 ] ] ], [ [ [ -68.58, -67.75 ], [ -68.92, -67.76 ], [ -69.13, -67.43 ], [ -68.33, -66.78 ], [ -67.69, -66.62 ], [ -68.02, -66.94 ], [ -67.68, -67.16 ], [ -68.58, -67.75 ] ] ], [ [ [ -67.59, -66.87 ], [ -67.35, -66.73 ], [ -67.23, -66.84 ], [ -67.59, -66.87 ] ] ], [ [ [ -65.86, -65.54 ], [ -65.65, -65.66 ], [ -66.14, -65.89 ], [ -65.86, -65.54 ] ] ], [ [ [ -75.4, -69.76 ], [ -74.74, -69.75 ], [ -74.45, -70.14 ], [ -75.76, -70.1 ], [ -75.4, -69.76 ] ] ], [ [ [ -7.31, 57.23 ], [ -7.23, 57.1 ], [ -7.46, 57.24 ], [ -7.33, 57.41 ], [ -7.31, 57.23 ] ] ], [ [ [ 53.83, 24.23 ], [ 53.97, 24.15 ], [ 53.62, 24.17 ], [ 53.83, 24.23 ] ] ], [ [ [ 92.54, -65.71 ], [ 92.65, -65.8 ], [ 92.26, -65.79 ], [ 92.54, -65.71 ] ] ], [ [ [ 169.5, -73.52 ], [ 169.78, -73.32 ], [ 169.87, -73.63 ], [ 169.5, -73.52 ] ] ], [ [ [ 164.64, -67.44 ], [ 164.65, -67.27 ], [ 164.85, -67.6 ], [ 164.64, -67.44 ] ] ], [ [ [ 163.31, -66.79 ], [ 163.27, -66.89 ], [ 163.13, -66.69 ], [ 163.31, -66.79 ] ] ], [ [ [ -45.24, -60.63 ], [ -45.17, -60.73 ], [ -46.03, -60.61 ], [ -45.7, -60.51 ], [ -45.24, -60.63 ] ] ], [ [ [ -2.91, 58.87 ], [ -2.96, 58.73 ], [ -3.04, 58.82 ], [ -2.9, 58.9 ], [ -3.35, 58.96 ], [ -3.33, 59.14 ], [ -2.71, 58.97 ], [ -2.91, 58.87 ] ] ], [ [ [ 124.69, -1.65 ], [ 125.29, -1.73 ], [ 125.33, -1.88 ], [ 124.4, -2.03 ], [ 124.38, -1.68 ], [ 124.69, -1.65 ] ] ], [ [ [ 17.59, 42.75 ], [ 17.75, 42.69 ], [ 17.32, 42.79 ], [ 17.59, 42.75 ] ] ], [ [ [ 47.03, 80.59 ], [ 46.22, 80.44 ], [ 44.91, 80.6 ], [ 47.14, 80.84 ], [ 48.51, 80.79 ], [ 48.7, 80.62 ], [ 47.68, 80.77 ], [ 47.03, 80.59 ] ] ], [ [ [ 47.06, 80.17 ], [ 46.77, 80.32 ], [ 48.09, 80.3 ], [ 47.62, 80.4 ], [ 48.21, 80.46 ], [ 47.43, 80.46 ], [ 49.21, 80.52 ], [ 49.7, 80.67 ], [ 49, 80.78 ], [ 50.86, 80.95 ], [ 50.3, 80.74 ], [ 51.8, 80.71 ], [ 50.98, 80.55 ], [ 48.45, 80.32 ], [ 49.1, 80.17 ], [ 48.35, 80.07 ], [ 47.69, 80.05 ], [ 48.11, 80.25 ], [ 47.06, 80.17 ] ] ], [ [ [ 167.01, -20.92 ], [ 167.18, -20.83 ], [ 167.04, -20.73 ], [ 167.25, -20.7 ], [ 167.41, -21.16 ], [ 167.01, -20.92 ] ] ], [ [ [ 54.59, 80.98 ], [ 54.71, 81.11 ], [ 56.19, 81.01 ], [ 57.58, 80.71 ], [ 54.59, 80.98 ] ] ], [ [ [ 57.12, 80.94 ], [ 56.11, 81.11 ], [ 58.32, 80.91 ], [ 57.68, 80.82 ], [ 57.12, 80.94 ] ] ], [ [ [ 58.84, 80.87 ], [ 58.55, 80.73 ], [ 57.85, 80.77 ], [ 58.84, 80.87 ] ] ], [ [ [ 56.13, 81.28 ], [ 56.59, 81.41 ], [ 57.95, 81.3 ], [ 56.44, 81.16 ], [ 55.55, 81.2 ], [ 55.48, 81.32 ], [ 56.13, 81.28 ] ] ], [ [ [ 61.51, 81.07 ], [ 61.06, 80.91 ], [ 60, 80.97 ], [ 61.51, 81.07 ] ] ], [ [ [ 57.13, 81.44 ], [ 57.69, 81.56 ], [ 58.55, 81.42 ], [ 57.13, 81.44 ] ] ], [ [ [ 59.18, 81.85 ], [ 58.11, 81.69 ], [ 57.9, 81.81 ], [ 59.18, 81.85 ] ] ], [ [ [ 58.9, 80 ], [ 59.88, 80.04 ], [ 59.39, 79.91 ], [ 58.9, 80 ] ] ], [ [ [ -68.86, 12.08 ], [ -69.16, 12.39 ], [ -68.74, 12.04 ], [ -68.86, 12.08 ] ] ], [ [ [ 115.49, -8.76 ], [ 115.56, -8.67 ], [ 115.63, -8.77 ], [ 115.49, -8.76 ] ] ], [ [ [ 128.62, 34.89 ], [ 128.71, 35.03 ], [ 128.74, 34.79 ], [ 128.58, 34.7 ], [ 128.47, 34.88 ], [ 128.62, 34.89 ] ] ], [ [ [ -15.07, 10.88 ], [ -14.9, 10.93 ], [ -14.96, 10.77 ], [ -15.07, 10.88 ] ] ], [ [ [ -70.59, 41.46 ], [ -70.47, 41.35 ], [ -70.84, 41.35 ], [ -70.59, 41.46 ] ] ], [ [ [ 119.89, 12.28 ], [ 120.16, 12.12 ], [ 120.22, 12.23 ], [ 120.34, 11.99 ], [ 119.98, 12.01 ], [ 119.89, 12.28 ] ] ], [ [ [ -64.36, -54.75 ], [ -63.8, -54.73 ], [ -64.7, -54.92 ], [ -64.69, -54.78 ], [ -64.36, -54.75 ] ] ], [ [ [ 31.47, 80.12 ], [ 32.75, 80.31 ], [ 33.51, 80.23 ], [ 31.47, 80.12 ] ] ], [ [ [ -148.29, 60.1 ], [ -148.04, 60.2 ], [ -148.18, 60.02 ], [ -148.29, 60.1 ] ] ], [ [ [ -146.09, 60.4 ], [ -146.7, 60.26 ], [ -146.61, 60.48 ], [ -146.09, 60.4 ] ] ], [ [ [ -165.88, 54.18 ], [ -165.67, 54.1 ], [ -166.05, 54.05 ], [ -166.08, 54.17 ], [ -165.88, 54.18 ] ] ], [ [ [ -168.33, 53.48 ], [ -167.79, 53.5 ], [ -169.11, 52.82 ], [ -168.61, 53.27 ], [ -168.35, 53.26 ], [ -168.33, 53.48 ] ] ], [ [ [ -165.58, 54.27 ], [ -165.39, 54.2 ], [ -165.56, 54.11 ], [ -165.58, 54.27 ] ] ], [ [ [ -155.88, 19.05 ], [ -156.06, 19.73 ], [ -155.83, 19.98 ], [ -155.85, 20.27 ], [ -155.21, 19.97 ], [ -154.81, 19.52 ], [ -155.67, 18.91 ], [ -155.88, 19.05 ] ] ], [ [ [ -163.53, 54.63 ], [ -164.14, 54.61 ], [ -164.65, 54.39 ], [ -164.95, 54.58 ], [ -164.49, 54.92 ], [ -163.78, 55.05 ], [ -163.45, 55.04 ], [ -163.37, 54.79 ], [ -163.05, 54.69 ], [ -163.37, 54.75 ], [ -163.53, 54.63 ] ] ], [ [ [ 123.45, 9.19 ], [ 123.62, 9.3 ], [ 123.7, 9.14 ], [ 123.45, 9.19 ] ] ], [ [ [ 57.51, -20.14 ], [ 57.63, -19.98 ], [ 57.81, -20.23 ], [ 57.53, -20.53 ], [ 57.31, -20.47 ], [ 57.51, -20.14 ] ] ], [ [ [ 123.1, 13.04 ], [ 123.39, 12.69 ], [ 122.93, 13.11 ], [ 123.1, 13.04 ] ] ], [ [ [ 122.53, 10.68 ], [ 121.91, 10.45 ], [ 122.1, 11.65 ], [ 121.84, 11.76 ], [ 121.95, 11.94 ], [ 122.39, 11.73 ], [ 122.45, 11.55 ], [ 122.83, 11.61 ], [ 122.9, 11.43 ], [ 123.15, 11.6 ], [ 123.13, 11.17 ], [ 122.53, 10.68 ] ] ], [ [ [ 91.03, 81.22 ], [ 91.63, 81.12 ], [ 90.81, 81.04 ], [ 90.16, 81.16 ], [ 91.03, 81.22 ] ] ], [ [ [ -160.84, 55.2 ], [ -160.8, 55.38 ], [ -160.52, 55.38 ], [ -160.52, 55.13 ], [ -160.84, 55.2 ] ] ], [ [ [ 94.64, 80.13 ], [ 93.8, 80 ], [ 91.49, 80.26 ], [ 92.76, 80.37 ], [ 92.17, 80.41 ], [ 92.93, 80.47 ], [ 93.19, 80.96 ], [ 95.71, 81.27 ], [ 98.07, 80.67 ], [ 97.14, 80.64 ], [ 97.31, 80.22 ], [ 94.64, 80.13 ] ] ], [ [ [ -159.51, 55.12 ], [ -159.64, 55.04 ], [ -159.52, 55.25 ], [ -159.51, 55.12 ] ] ], [ [ [ -159.92, 55.23 ], [ -160.23, 54.86 ], [ -160.2, 55.11 ], [ -159.92, 55.23 ] ] ], [ [ [ 93.31, 79.76 ], [ 91.98, 79.68 ], [ 92.39, 79.76 ], [ 91.19, 79.84 ], [ 90.99, 80.06 ], [ 93.34, 80 ], [ 93.88, 79.91 ], [ 93.31, 79.76 ] ] ], [ [ [ 98.61, 78.81 ], [ 95.67, 79.1 ], [ 94.93, 79.04 ], [ 93.87, 79.61 ], [ 93.16, 79.47 ], [ 92.91, 79.57 ], [ 94.73, 79.8 ], [ 94.35, 79.98 ], [ 95, 80.11 ], [ 95.39, 80.03 ], [ 97.67, 80.17 ], [ 97.7, 79.84 ], [ 98.32, 79.83 ], [ 98.77, 80.07 ], [ 100.02, 79.84 ], [ 99.81, 79.27 ], [ 99.15, 79.29 ], [ 99.99, 78.92 ], [ 98.61, 78.81 ] ] ], [ [ [ 103.11, 79.04 ], [ 103.9, 79.17 ], [ 104.66, 78.76 ], [ 105.27, 78.8 ], [ 104.98, 78.33 ], [ 102.88, 78.14 ], [ 101.37, 78.18 ], [ 99.57, 77.92 ], [ 100.48, 78.72 ], [ 101.27, 78.74 ], [ 101.02, 79.01 ], [ 101.67, 78.96 ], [ 101.07, 79.05 ], [ 101.67, 79.35 ], [ 102.24, 79.21 ], [ 102.45, 79.43 ], [ 103.22, 79.3 ], [ 102.55, 78.8 ], [ 103.11, 79.04 ] ] ], [ [ [ 107.55, 78.08 ], [ 106.51, 78.13 ], [ 107.54, 78.19 ], [ 107.55, 78.08 ] ] ], [ [ [ 92.29, 79.44 ], [ 93.04, 79.4 ], [ 91.8, 79.42 ], [ 92.29, 79.44 ] ] ], [ [ [ 121.72, -.47 ], [ 121.87, -.41 ], [ 121.92, -.52 ], [ 121.66, -.58 ], [ 121.72, -.47 ] ] ], [ [ [ -62.73, 10.39 ], [ -62.78, 10.5 ], [ -62.67, 10.31 ], [ -62.73, 10.39 ] ] ], [ [ [ -62.83, 10.41 ], [ -63.04, 10.45 ], [ -62.85, 10.53 ], [ -62.83, 10.41 ] ] ], [ [ [ 122.05, 13.48 ], [ 122.15, 13.37 ], [ 122.01, 13.2 ], [ 121.81, 13.46 ], [ 121.87, 13.57 ], [ 122.05, 13.48 ] ] ], [ [ [ -119.85, 34.07 ], [ -119.52, 34.03 ], [ -119.82, 33.96 ], [ -119.85, 34.07 ] ] ], [ [ [ 89.83, 21.95 ], [ 89.75, 21.86 ], [ 89.78, 22.09 ], [ 89.83, 21.95 ] ] ], [ [ [ 89.36, 77.29 ], [ 89.76, 77.27 ], [ 89.28, 77.14 ], [ 89.36, 77.29 ] ] ], [ [ [ 79.31, 80.88 ], [ 79.91, 80.76 ], [ 78.85, 80.76 ], [ 79.31, 80.88 ] ] ], [ [ [ 97.78, .56 ], [ 97.06, 1.42 ], [ 97.42, 1.52 ], [ 97.9, 1.05 ], [ 97.9, .63 ], [ 97.78, .56 ] ] ], [ [ [ -74.23, -49.55 ], [ -74.4, -49.63 ], [ -74.39, -49.41 ], [ -74.23, -49.55 ] ] ], [ [ [ -44.18, -23.18 ], [ -44.38, -23.17 ], [ -44.24, -23.08 ], [ -44.18, -23.18 ] ] ], [ [ [ 148.98, 76.65 ], [ 148.48, 76.64 ], [ 149.5, 76.76 ], [ 148.98, 76.65 ] ] ], [ [ [ -35.87, -54.8 ], [ -36.12, -54.76 ], [ -35.94, -54.86 ], [ -36.11, -54.89 ], [ -36.49, -54.51 ], [ -37.42, -54.28 ], [ -37.24, -54.15 ], [ -37.63, -54.19 ], [ -37.61, -54.05 ], [ -38.02, -54.01 ], [ -36.64, -54.12 ], [ -36.49, -54.2 ], [ -36.7, -54.3 ], [ -36.49, -54.24 ], [ -36.35, -54.37 ], [ -36.3, -54.27 ], [ -36.12, -54.58 ], [ -35.89, -54.55 ], [ -35.87, -54.8 ] ] ], [ [ [ 18.71, 69.93 ], [ 19.18, 70.09 ], [ 19.68, 70 ], [ 19.13, 69.79 ], [ 18.71, 69.93 ] ] ], [ [ [ 35.71, 65.03 ], [ 35.5, 65.12 ], [ 35.76, 65.17 ], [ 35.71, 65.03 ] ] ], [ [ [ 18.03, 69.6 ], [ 18.61, 69.69 ], [ 18.37, 69.79 ], [ 18.75, 69.69 ], [ 18.69, 69.88 ], [ 18.99, 69.82 ], [ 18.76, 69.56 ], [ 18.03, 69.6 ] ] ], [ [ [ 99.84, 6.47 ], [ 99.91, 6.33 ], [ 99.73, 6.26 ], [ 99.64, 6.44 ], [ 99.84, 6.47 ] ] ], [ [ [ -24.39, 14.81 ], [ -24.5, 14.92 ], [ -24.37, 15.05 ], [ -24.28, 14.88 ], [ -24.39, 14.81 ] ] ], [ [ [ 93.49, 19.83 ], [ 93.51, 19.73 ], [ 93.4, 19.96 ], [ 93.49, 19.83 ] ] ], [ [ [ -74.56, -50.02 ], [ -74.91, -49.94 ], [ -74.62, -49.8 ], [ -74.82, -49.85 ], [ -74.88, -49.6 ], [ -74.67, -49.63 ], [ -74.88, -49.55 ], [ -74.58, -49.31 ], [ -74.99, -49.47 ], [ -74.97, -49.6 ], [ -75.09, -49.53 ], [ -75.01, -49.7 ], [ -74.92, -49.62 ], [ -75.06, -49.91 ], [ -75.14, -49.57 ], [ -75.3, -49.6 ], [ -75.19, -49.44 ], [ -75.31, -49.52 ], [ -75.45, -49.34 ], [ -75.33, -49.25 ], [ -75.42, -49.33 ], [ -75.1, -49.48 ], [ -74.95, -49.4 ], [ -75.21, -49.41 ], [ -75.31, -49.25 ], [ -75.02, -49.35 ], [ -75.07, -49.17 ], [ -74.86, -49.37 ], [ -74.74, -49.19 ], [ -74.81, -49.14 ], [ -74.76, -49.09 ], [ -74.91, -48.99 ], [ -74.7, -49.03 ], [ -74.98, -48.89 ], [ -74.79, -48.8 ], [ -75.02, -48.82 ], [ -74.69, -48.65 ], [ -74.64, -48.86 ], [ -74.47, -48.7 ], [ -74.58, -48.95 ], [ -74.4, -48.96 ], [ -74.58, -49.68 ], [ -74.44, -49.62 ], [ -74.38, -49.76 ], [ -74.48, -49.97 ], [ -74.63, -49.88 ], [ -74.56, -50.02 ] ] ], [ [ [ -80.01, 22.94 ], [ -79.79, 22.9 ], [ -79.86, 22.8 ], [ -79.65, 22.76 ], [ -79.36, 22.42 ], [ -78.69, 22.38 ], [ -77.92, 21.91 ], [ -78.09, 22.19 ], [ -78, 22.31 ], [ -77.64, 22.05 ], [ -77.69, 21.91 ], [ -77.57, 21.93 ], [ -77.74, 21.88 ], [ -77.84, 22.03 ], [ -77.89, 21.86 ], [ -77.83, 21.97 ], [ -77.74, 21.8 ], [ -77.44, 21.65 ], [ -77.51, 21.77 ], [ -77.33, 21.65 ], [ -77.44, 21.81 ], [ -77.14, 21.66 ], [ -77.15, 21.54 ], [ -77.37, 21.61 ], [ -77.22, 21.44 ], [ -77.09, 21.61 ], [ -76.95, 21.46 ], [ -77.04, 21.41 ], [ -76.81, 21.39 ], [ -76.89, 21.3 ], [ -76.66, 21.36 ], [ -76.74, 21.28 ], [ -76.55, 21.29 ], [ -76.59, 21.19 ], [ -76.38, 21.28 ], [ -76.03, 21.06 ], [ -75.72, 21.13 ], [ -75.57, 21.01 ], [ -75.76, 20.88 ], [ -75.55, 20.79 ], [ -75.77, 20.84 ], [ -75.76, 20.7 ], [ -75.52, 20.79 ], [ -75.58, 20.69 ], [ -74.75, 20.63 ], [ -74.14, 20.19 ], [ -75.16, 19.89 ], [ -75.1, 20.06 ], [ -75.3, 19.88 ], [ -75.87, 20.03 ], [ -77.74, 19.84 ], [ -77.11, 20.37 ], [ -77.24, 20.67 ], [ -78.14, 20.76 ], [ -78.49, 21.03 ], [ -78.49, 21.29 ], [ -78.76, 21.64 ], [ -79.21, 21.54 ], [ -79.83, 21.67 ], [ -80.29, 21.9 ], [ -80.49, 22.18 ], [ -80.46, 22.04 ], [ -81.05, 22.07 ], [ -81.21, 22.28 ], [ -81.21, 22.05 ], [ -81.8, 22.17 ], [ -82.16, 22.39 ], [ -81.59, 22.52 ], [ -81.87, 22.68 ], [ -82.76, 22.7 ], [ -83.37, 22.2 ], [ -83.92, 22.16 ], [ -84.03, 21.91 ], [ -84.51, 21.76 ], [ -84.5, 21.93 ], [ -84.95, 21.86 ], [ -84.28, 22.01 ], [ -84.45, 22.19 ], [ -84.22, 22.57 ], [ -83.22, 23 ], [ -82.03, 23.19 ], [ -81.57, 23.14 ], [ -81.56, 23.03 ], [ -80.6, 23.13 ], [ -80.41, 22.94 ], [ -80.25, 23.03 ], [ -80.28, 22.91 ], [ -80.01, 22.94 ] ] ], [ [ [ -125.34, 50.14 ], [ -125.27, 50.26 ], [ -125.38, 50.28 ], [ -125.24, 50.31 ], [ -125.16, 50 ], [ -125.34, 50.14 ] ] ], [ [ [ 166, 55.36 ], [ 166.3, 55.3 ], [ 166.67, 54.68 ], [ 165.75, 55.29 ], [ 166, 55.36 ] ] ], [ [ [ -61.53, 16.34 ], [ -61.46, 16.51 ], [ -61.17, 16.25 ], [ -61.51, 16.21 ], [ -61.53, 16.34 ] ] ], [ [ [ -67.05, -55.16 ], [ -67.26, -55.33 ], [ -67.5, -55.18 ], [ -68.04, -55.24 ], [ -68.38, -54.95 ], [ -67.28, -54.93 ], [ -67.05, -55.16 ] ] ], [ [ [ -68.31, 12.2 ], [ -68.39, 12.31 ], [ -68.2, 12.22 ], [ -68.24, 12.03 ], [ -68.31, 12.2 ] ] ], [ [ [ -23.12, 15.14 ], [ -23.23, 15.15 ], [ -23.18, 15.34 ], [ -23.12, 15.14 ] ] ], [ [ [ 127.07, -3.32 ], [ 127.27, -3.39 ], [ 127.22, -3.66 ], [ 126.69, -3.86 ], [ 126.18, -3.61 ], [ 126.01, -3.26 ], [ 126.09, -3.11 ], [ 126.78, -3.06 ], [ 127.11, -3.23 ], [ 127.07, -3.32 ] ] ], [ [ [ 89.57, 22.18 ], [ 89.66, 22.37 ], [ 89.7, 22.07 ], [ 89.68, 22.14 ], [ 89.61, 22.17 ], [ 89.6, 22.13 ], [ 89.57, 22.18 ] ] ], [ [ [ 99.81, -2.37 ], [ 99.6, -2.28 ], [ 99.56, -2.04 ], [ 99.81, -2.37 ] ] ], [ [ [ 89.66, 22.03 ], [ 89.61, 22.17 ], [ 89.7, 22.03 ], [ 89.66, 21.9 ], [ 89.66, 22.03 ] ] ], [ [ [ 16.79, 76.83 ], [ 17.06, 76.64 ], [ 16.27, 76.56 ], [ 16.52, 76.7 ], [ 15.48, 76.87 ], [ 16.61, 77.06 ], [ 15.19, 77.02 ], [ 13.9, 77.49 ], [ 15.91, 77.5 ], [ 14.73, 77.66 ], [ 17.17, 77.78 ], [ 16.73, 77.89 ], [ 13.76, 77.73 ], [ 13.57, 78.05 ], [ 14.31, 77.97 ], [ 14.19, 78.1 ], [ 17.42, 78.44 ], [ 16.29, 78.46 ], [ 16.97, 78.65 ], [ 16.55, 78.72 ], [ 15.43, 78.46 ], [ 15.32, 78.84 ], [ 14.94, 78.59 ], [ 14.26, 78.73 ], [ 14.77, 78.37 ], [ 14.09, 78.43 ], [ 14.08, 78.25 ], [ 12.98, 78.2 ], [ 12.35, 78.49 ], [ 13.3, 78.58 ], [ 12.38, 78.54 ], [ 11.5, 78.73 ], [ 11.34, 78.98 ], [ 12.65, 78.91 ], [ 11.68, 79.07 ], [ 11.99, 79.26 ], [ 11.17, 79.11 ], [ 10.64, 79.55 ], [ 11.66, 79.83 ], [ 12.3, 79.66 ], [ 12.2, 79.84 ], [ 12.5, 79.74 ], [ 13.77, 79.88 ], [ 13.72, 79.69 ], [ 12.3, 79.59 ], [ 13.45, 79.57 ], [ 14.03, 79.28 ], [ 13.81, 79.53 ], [ 14.71, 79.79 ], [ 16.4, 78.88 ], [ 15.6, 79.8 ], [ 16.24, 80.06 ], [ 17.99, 79.75 ], [ 17.66, 79.37 ], [ 18.26, 79.63 ], [ 18.88, 79.12 ], [ 19.8, 79.15 ], [ 19.87, 79 ], [ 21.5, 78.82 ], [ 21.35, 78.67 ], [ 18.89, 78.5 ], [ 18.27, 77.52 ], [ 17.58, 77.58 ], [ 16.79, 76.83 ] ] ], [ [ [ -175.19, -21.14 ], [ -175.03, -21.15 ], [ -175.12, -21.27 ], [ -175.36, -21.09 ], [ -175.19, -21.14 ] ] ], [ [ [ 169.34, -18.92 ], [ 169, -18.88 ], [ 169.01, -18.66 ], [ 169.15, -18.63 ], [ 169.34, -18.92 ] ] ], [ [ [ 169.47, -19.57 ], [ 169.29, -19.58 ], [ 169.25, -19.34 ], [ 169.36, -19.32 ], [ 169.47, -19.57 ] ] ], [ [ [ 6.68, .17 ], [ 6.51, .02 ], [ 6.46, .24 ], [ 6.61, .41 ], [ 6.76, .3 ], [ 6.68, .17 ] ] ], [ [ [ -172.2, -13.73 ], [ -172.54, -13.8 ], [ -172.8, -13.52 ], [ -172.33, -13.44 ], [ -172.2, -13.73 ] ] ], [ [ [ -74.54, 24.06 ], [ -74.45, 24.12 ], [ -74.56, 23.94 ], [ -74.54, 24.06 ] ] ], [ [ [ 141.97, 47.47 ], [ 142.2, 47.98 ], [ 141.85, 48.77 ], [ 142.14, 49.52 ], [ 142.04, 50.55 ], [ 142.26, 51.09 ], [ 141.67, 51.75 ], [ 141.83, 51.78 ], [ 141.63, 51.89 ], [ 141.63, 52.32 ], [ 141.92, 53.03 ], [ 141.76, 53.38 ], [ 142.25, 53.54 ], [ 142.24, 53.39 ], [ 142.44, 53.38 ], [ 142.67, 53.51 ], [ 142.48, 53.66 ], [ 142.78, 53.7 ], [ 142.7, 53.84 ], [ 142.59, 53.7 ], [ 142.7, 53.94 ], [ 142.26, 54.3 ], [ 142.61, 54.33 ], [ 142.55, 54.24 ], [ 142.71, 54.43 ], [ 142.99, 54.11 ], [ 142.83, 53.87 ], [ 143.06, 53.56 ], [ 142.97, 53.56 ], [ 143.06, 53.56 ], [ 143.13, 53.45 ], [ 143.06, 53.45 ], [ 143.15, 53.42 ], [ 143.08, 53.39 ], [ 143.15, 53.42 ], [ 143.21, 53.3 ], [ 143.26, 53.16 ], [ 143.32, 52.84 ], [ 143.26, 53.14 ], [ 143.14, 53.21 ], [ 143.18, 53.36 ], [ 143.03, 53.26 ], [ 143.25, 52.84 ], [ 143.29, 52.95 ], [ 143.31, 52.71 ], [ 143.33, 52.83 ], [ 143.28, 52.45 ], [ 143.18, 52.33 ], [ 143.29, 52.64 ], [ 143.12, 52.36 ], [ 143.12, 52.29 ], [ 143.17, 52.36 ], [ 143.18, 52.31 ], [ 143.14, 52.08 ], [ 143.15, 52.26 ], [ 143.07, 52.17 ], [ 143.33, 51.69 ], [ 143.21, 51.51 ], [ 143.35, 51.52 ], [ 143.33, 51.61 ], [ 143.36, 51.63 ], [ 143.44, 51.44 ], [ 143.41, 51.55 ], [ 143.31, 51.74 ], [ 143.34, 51.71 ], [ 143.44, 51.5 ], [ 143.48, 51.32 ], [ 143.37, 51.33 ], [ 143.53, 51.23 ], [ 144.28, 49.25 ], [ 144.75, 48.65 ], [ 144.04, 49.26 ], [ 143.23, 49.28 ], [ 142.97, 49.11 ], [ 142.52, 47.8 ], [ 143.1, 46.91 ], [ 143.48, 46.82 ], [ 143.62, 46.37 ], [ 143.42, 46.02 ], [ 143.3, 46.51 ], [ 142.77, 46.61 ], [ 142.7, 46.75 ], [ 142.42, 46.61 ], [ 142.03, 45.93 ], [ 141.81, 46.55 ], [ 142.06, 47.08 ], [ 141.97, 47.47 ] ] ], [ [ [ -16.79, 32.77 ], [ -16.68, 32.74 ], [ -16.94, 32.63 ], [ -17.27, 32.81 ], [ -16.79, 32.77 ] ] ], [ [ [ -25.67, 37.83 ], [ -25.13, 37.81 ], [ -25.51, 37.71 ], [ -25.85, 37.86 ], [ -25.67, 37.83 ] ] ], [ [ [ -60.35, 46.71 ], [ -60.62, 46.21 ], [ -60.42, 46.29 ], [ -61.13, 45.97 ], [ -60.74, 46.07 ], [ -61.17, 45.71 ], [ -60.74, 45.69 ], [ -60.38, 46.02 ], [ -60.8, 45.96 ], [ -60.28, 46.31 ], [ -60.23, 46.11 ], [ -60.13, 46.27 ], [ -59.82, 46.18 ], [ -60, 46.04 ], [ -59.79, 45.95 ], [ -60.69, 45.57 ], [ -60.92, 45.66 ], [ -61.33, 45.56 ], [ -61.47, 45.72 ], [ -61.55, 46.04 ], [ -60.6, 47.04 ], [ -60.39, 47.03 ], [ -60.52, 46.9 ], [ -60.3, 46.85 ], [ -60.35, 46.71 ] ] ], [ [ [ -70.51, -54.19 ], [ -70.22, -54.25 ], [ -70.49, -54.25 ], [ -70.84, -54.12 ], [ -70.91, -53.88 ], [ -70.61, -53.87 ], [ -70.71, -53.7 ], [ -70.48, -53.56 ], [ -70.33, -54.02 ], [ -70.68, -53.92 ], [ -70.51, -54.19 ] ] ], [ [ [ 5.68, 59.98 ], [ 5.55, 59.89 ], [ 5.37, 59.99 ], [ 5.67, 60.08 ], [ 5.68, 59.98 ] ] ], [ [ [ 120.57, -6.05 ], [ 120.48, -6.5 ], [ 120.48, -5.77 ], [ 120.57, -6.05 ] ] ], [ [ [ 8.55, 63.6 ], [ 9.2, 63.56 ], [ 8.39, 63.43 ], [ 8.78, 63.56 ], [ 8.55, 63.6 ] ] ], [ [ [ -31.13, 39.46 ], [ -31.25, 39.38 ], [ -31.24, 39.52 ], [ -31.13, 39.46 ] ] ], [ [ [ 115.46, -20.79 ], [ 115.32, -20.89 ], [ 115.43, -20.67 ], [ 115.46, -20.79 ] ] ], [ [ [ 14.35, 68.19 ], [ 14.41, 68.39 ], [ 15.2, 68.48 ], [ 14.35, 68.19 ] ] ], [ [ [ -78.08, 22.37 ], [ -78.12, 22.24 ], [ -78.33, 22.4 ], [ -78.08, 22.37 ] ] ], [ [ [ -78.34, 22.53 ], [ -78.27, 22.43 ], [ -78.46, 22.38 ], [ -78.71, 22.49 ], [ -78.34, 22.53 ] ] ], [ [ [ 14.05, 67.12 ], [ 14.29, 67.2 ], [ 14.19, 67 ], [ 14.13, 67.07 ], [ 14.01, 67.09 ], [ 14.05, 67.12 ] ] ], [ [ [ 14.75, 44.76 ], [ 14.68, 44.85 ], [ 14.87, 44.7 ], [ 14.75, 44.76 ] ] ], [ [ [ -67.38, -55.64 ], [ -67.27, -55.79 ], [ -67.58, -55.73 ], [ -67.38, -55.64 ] ] ], [ [ [ 17.18, 68.77 ], [ 16.82, 68.73 ], [ 17.03, 68.87 ], [ 17.18, 68.77 ] ] ], [ [ [ 13.68, 68.31 ], [ 14.17, 68.26 ], [ 13.49, 68.06 ], [ 13.68, 68.31 ] ] ], [ [ [ -16.27, 11.85 ], [ -16.29, 11.98 ], [ -16.17, 11.88 ], [ -16.27, 11.85 ] ] ], [ [ [ 126.52, 37.75 ], [ 126.54, 37.62 ], [ 126.37, 37.61 ], [ 126.35, 37.79 ], [ 126.52, 37.75 ] ] ], [ [ [ 152.92, -9.07 ], [ 152.97, -9.25 ], [ 152.74, -9.26 ], [ 152.7, -9.09 ], [ 152.47, -9.04 ], [ 152.92, -9.07 ] ] ], [ [ [ 147.88, 45.26 ], [ 147.92, 45.44 ], [ 148.17, 45.26 ], [ 148.66, 45.54 ], [ 148.89, 45.51 ], [ 148.84, 45.34 ], [ 147.91, 44.96 ], [ 147.65, 44.99 ], [ 146.87, 44.44 ], [ 147.18, 44.69 ], [ 147.11, 44.82 ], [ 147.88, 45.26 ] ] ], [ [ [ 13.18, 54.46 ], [ 13.35, 54.58 ], [ 13.5, 54.48 ], [ 13.37, 54.62 ], [ 13.25, 54.56 ], [ 13.28, 54.65 ], [ 13.16, 54.56 ], [ 13.25, 54.66 ], [ 13.43, 54.68 ], [ 13.72, 54.27 ], [ 13.65, 54.36 ], [ 13.39, 54.22 ], [ 13.14, 54.28 ], [ 13.18, 54.46 ] ] ], [ [ [ 79.99, 6.44 ], [ 79.69, 8.21 ], [ 79.79, 8.38 ], [ 79.82, 7.91 ], [ 79.91, 8.94 ], [ 80.19, 9.48 ], [ 80.05, 9.6 ], [ 80.31, 9.44 ], [ 80.41, 9.52 ], [ 79.91, 9.76 ], [ 80.21, 9.84 ], [ 80.81, 9.29 ], [ 80.91, 8.95 ], [ 81.23, 8.65 ], [ 81.13, 8.49 ], [ 81.35, 8.5 ], [ 81.79, 7.6 ], [ 81.88, 7.02 ], [ 81.6, 6.4 ], [ 80.59, 5.92 ], [ 80.18, 6.05 ], [ 79.99, 6.44 ] ] ], [ [ [ 134.01, 34.35 ], [ 134.59, 34.24 ], [ 134.75, 33.83 ], [ 134.31, 33.58 ], [ 134.18, 33.24 ], [ 133.93, 33.49 ], [ 133.55, 33.54 ], [ 133.01, 33.01 ], [ 133.02, 32.72 ], [ 132.63, 32.76 ], [ 132.72, 32.9 ], [ 132.47, 32.91 ], [ 132.41, 33.21 ], [ 132.56, 33.22 ], [ 132.37, 33.32 ], [ 132.42, 33.46 ], [ 132.01, 33.34 ], [ 132.65, 33.7 ], [ 132.89, 34.12 ], [ 133.13, 33.92 ], [ 133.51, 33.97 ], [ 133.56, 34.26 ], [ 134.01, 34.35 ] ] ], [ [ [ -23.68, 15.31 ], [ -23.44, 15.04 ], [ -23.48, 14.91 ], [ -23.78, 15.06 ], [ -23.68, 15.31 ] ] ], [ [ [ -24.56, 72.9 ], [ -23.13, 73.06 ], [ -21.97, 72.94 ], [ -21.88, 72.72 ], [ -22.63, 72.69 ], [ -22.96, 72.85 ], [ -24.56, 72.9 ] ] ], [ [ [ -23.39, 72.85 ], [ -21.97, 72.49 ], [ -22.79, 72.43 ], [ -22.05, 72.26 ], [ -22.2, 72.13 ], [ -24.39, 72.6 ], [ -24.51, 72.85 ], [ -23.39, 72.85 ] ] ], [ [ [ -25.74, 73.18 ], [ -24.73, 73.43 ], [ -23.21, 73.24 ], [ -25.02, 73.31 ], [ -22.87, 73.16 ], [ -24.41, 73.02 ], [ -25.74, 73.18 ] ] ], [ [ [ 39.19, -6.17 ], [ 39.3, -5.72 ], [ 39.57, -6.44 ], [ 39.19, -6.17 ] ] ], [ [ [ -21.59, 74.42 ], [ -20.55, 74.41 ], [ -20.11, 74.19 ], [ -21.3, 74.09 ], [ -21.99, 74.23 ], [ -21.59, 74.42 ] ] ], [ [ [ -20.59, 74.79 ], [ -20.22, 75.03 ], [ -19.75, 74.84 ], [ -20.08, 74.7 ], [ -20.59, 74.79 ] ] ], [ [ [ -18.41, 74.98 ], [ -18.89, 75.01 ], [ -18.92, 75.33 ], [ -18.21, 75.31 ], [ -18.04, 75.43 ], [ -18.2, 75.22 ], [ -17.72, 75.07 ], [ -17.32, 75.15 ], [ -17.35, 75.03 ], [ -18.41, 74.98 ] ] ], [ [ [ -123.5, 48.85 ], [ -123.49, 48.71 ], [ -123.6, 48.95 ], [ -123.5, 48.85 ] ] ], [ [ [ 5.33, 59.27 ], [ 5.2, 59.14 ], [ 5.24, 59.41 ], [ 5.33, 59.27 ] ] ], [ [ [ -96.38, 75.58 ], [ -96.84, 75.36 ], [ -97.01, 75.5 ], [ -96.38, 75.65 ], [ -95.9, 75.57 ], [ -96.19, 75.46 ], [ -96.38, 75.58 ] ] ], [ [ [ -93.49, 75.11 ], [ -93.72, 74.64 ], [ -95.06, 74.68 ], [ -96.08, 75.03 ], [ -96.23, 74.91 ], [ -96.63, 74.99 ], [ -95.77, 75.37 ], [ -96.14, 75.41 ], [ -94.91, 75.64 ], [ -93.64, 75.36 ], [ -93.49, 75.11 ] ] ], [ [ [ 25.85, 36.84 ], [ 26.09, 36.9 ], [ 25.74, 36.79 ], [ 25.85, 36.84 ] ] ], [ [ [ -78.91, 56.14 ], [ -78.68, 56.44 ], [ -78.67, 56.17 ], [ -78.91, 56.14 ] ] ], [ [ [ -80, 56.32 ], [ -79.54, 56.54 ], [ -80.05, 56.17 ], [ -80, 56.32 ] ] ], [ [ [ 17.25, 69.41 ], [ 17.31, 69.54 ], [ 17.68, 69.47 ], [ 17.48, 69.6 ], [ 17.68, 69.48 ], [ 17.87, 69.58 ], [ 18.01, 69.19 ], [ 17.49, 69.21 ], [ 17.05, 69.01 ], [ 16.78, 69.1 ], [ 17.19, 69.35 ], [ 16.87, 69.38 ], [ 17.25, 69.41 ] ] ], [ [ [ -78.95, 56.38 ], [ -79.08, 56.31 ], [ -79.1, 56.17 ], [ -79.03, 56.22 ], [ -79.28, 55.85 ], [ -79.13, 56.24 ], [ -79.47, 55.87 ], [ -79.78, 55.78 ], [ -79.52, 56.13 ], [ -79.91, 55.82 ], [ -79.82, 55.92 ], [ -80.02, 55.92 ], [ -79.45, 56.56 ], [ -79.64, 56.08 ], [ -79.27, 56.63 ], [ -79.06, 56.43 ], [ -78.92, 56.43 ], [ -78.88, 56.31 ], [ -79.21, 55.86 ], [ -78.95, 56.38 ] ] ], [ [ [ 81.74, 75.4 ], [ 81.93, 75.36 ], [ 81.89, 75.45 ], [ 82, 75.43 ], [ 82.11, 75.49 ], [ 81.89, 75.47 ], [ 82.11, 75.51 ], [ 82.3, 75.51 ], [ 82.05, 75.15 ], [ 81.94, 75.31 ], [ 81.76, 75.26 ], [ 81.64, 75.3 ], [ 81.72, 75.34 ], [ 81.67, 75.34 ], [ 81.61, 75.34 ], [ 81.63, 75.28 ], [ 81.74, 75.2 ], [ 82.03, 75.11 ], [ 82.15, 75.15 ], [ 82.16, 75.07 ], [ 81.73, 75.2 ], [ 81.61, 75.28 ], [ 81.6, 75.32 ], [ 81.64, 75.37 ], [ 81.9, 75.46 ], [ 81.74, 75.4 ] ] ], [ [ [ -76.91, 69.17 ], [ -77.36, 69.24 ], [ -77.11, 69.46 ], [ -76.63, 69.39 ], [ -76.91, 69.17 ] ] ], [ [ [ 25.56, 37 ], [ 25.44, 36.92 ], [ 25.33, 37.08 ], [ 25.53, 37.2 ], [ 25.56, 37 ] ] ], [ [ [ -78.73, 69.27 ], [ -78.27, 69.38 ], [ -78.81, 68.92 ], [ -79.26, 68.84 ], [ -78.73, 69.27 ] ] ], [ [ [ -78.24, 69.71 ], [ -78.07, 69.59 ], [ -78.83, 69.46 ], [ -78.24, 69.71 ] ] ], [ [ [ 27.23, 35.82 ], [ 27.13, 35.4 ], [ 27.06, 35.6 ], [ 27.23, 35.82 ] ] ], [ [ [ -149.13, -17.83 ], [ -149.58, -17.74 ], [ -149.62, -17.56 ], [ -149.34, -17.54 ], [ -149.13, -17.83 ] ] ], [ [ [ -80.03, 61.73 ], [ -80.21, 62.14 ], [ -79.6, 62.42 ], [ -79.26, 62.24 ], [ -79.3, 62.02 ], [ -79.72, 61.59 ], [ -80.03, 61.73 ] ] ], [ [ [ -65.01, 61.89 ], [ -64.85, 61.72 ], [ -65.24, 61.87 ], [ -65.01, 61.89 ] ] ], [ [ [ -64.67, 61.56 ], [ -64.84, 61.31 ], [ -65.47, 61.62 ], [ -65.01, 61.7 ], [ -64.67, 61.56 ] ] ], [ [ [ -64.36, 62.47 ], [ -64.61, 62.36 ], [ -64.94, 62.47 ], [ -64.52, 62.56 ], [ -64.36, 62.47 ] ] ], [ [ [ -74.52, 68.07 ], [ -74.35, 68.19 ], [ -74.25, 68.06 ], [ -73.51, 68.05 ], [ -73.42, 67.76 ], [ -74.54, 67.8 ], [ -74.78, 68.01 ], [ -74.52, 68.07 ] ] ], [ [ [ -76.89, 73.33 ], [ -76.12, 72.85 ], [ -78.23, 72.9 ], [ -79.57, 72.76 ], [ -80.14, 73.23 ], [ -80.88, 73.33 ], [ -80.84, 73.75 ], [ -78.12, 73.67 ], [ -76.89, 73.33 ] ] ], [ [ [ 105.7, -10.43 ], [ 105.67, -10.57 ], [ 105.53, -10.51 ], [ 105.7, -10.43 ] ] ], [ [ [ -21.98, 64.38 ], [ -21.76, 64.58 ], [ -22.23, 64.48 ], [ -22.39, 64.82 ], [ -23.8, 64.73 ], [ -24.05, 64.88 ], [ -23.19, 65.01 ], [ -23.09, 64.91 ], [ -22.72, 65.08 ], [ -22.58, 64.97 ], [ -21.78, 65.03 ], [ -21.74, 65.2 ], [ -22.56, 65.17 ], [ -21.92, 65.39 ], [ -22.1, 65.53 ], [ -22.39, 65.48 ], [ -22.09, 65.6 ], [ -22.48, 65.5 ], [ -22.77, 65.63 ], [ -22.72, 65.5 ], [ -22.85, 65.63 ], [ -23.86, 65.41 ], [ -24.53, 65.5 ], [ -24.31, 65.64 ], [ -23.79, 65.53 ], [ -24.1, 65.81 ], [ -23.54, 65.6 ], [ -23.26, 65.68 ], [ -23.53, 65.72 ], [ -23.19, 65.78 ], [ -23.87, 65.89 ], [ -23.18, 65.84 ], [ -23.81, 66.01 ], [ -23.39, 65.99 ], [ -23.67, 66.12 ], [ -23.36, 66.08 ], [ -23.47, 66.2 ], [ -23, 66.09 ], [ -23.09, 65.97 ], [ -22.87, 66.04 ], [ -22.98, 65.91 ], [ -22.68, 66.05 ], [ -22.67, 65.82 ], [ -22.51, 65.98 ], [ -22.42, 65.84 ], [ -22.38, 66.09 ], [ -22.98, 66.23 ], [ -22.36, 66.27 ], [ -23.15, 66.33 ], [ -22.95, 66.47 ], [ -22.4, 66.45 ], [ -21.67, 66.02 ], [ -21.31, 66 ], [ -21.61, 65.96 ], [ -21.29, 65.93 ], [ -21.34, 65.73 ], [ -21.78, 65.76 ], [ -21.3, 65.59 ], [ -21.48, 65.44 ], [ -21.19, 65.43 ], [ -21.08, 65.16 ], [ -20.93, 65.58 ], [ -20.29, 65.67 ], [ -20.41, 66.09 ], [ -20.1, 66.12 ], [ -19.47, 65.74 ], [ -19.44, 66.05 ], [ -18.79, 66.19 ], [ -18.06, 65.67 ], [ -18.31, 66.16 ], [ -17.41, 65.99 ], [ -17.14, 66.21 ], [ -16.49, 66.2 ], [ -16.57, 66.48 ], [ -16.2, 66.54 ], [ -15.43, 66.16 ], [ -14.53, 66.38 ], [ -15.18, 66.11 ], [ -14.61, 65.99 ], [ -14.9, 65.76 ], [ -14.33, 65.79 ], [ -13.61, 65.51 ], [ -14.01, 65.27 ], [ -13.6, 65.24 ], [ -14.02, 65.19 ], [ -13.49, 65.08 ], [ -14.24, 65.03 ], [ -13.68, 64.91 ], [ -14.04, 64.94 ], [ -13.75, 64.87 ], [ -14.08, 64.7 ], [ -14.51, 64.79 ], [ -14.23, 64.65 ], [ -14.5, 64.65 ], [ -14.54, 64.4 ], [ -14.99, 64.24 ], [ -15.37, 64.35 ], [ -15.46, 64.24 ], [ -15.19, 64.23 ], [ -15.95, 64.13 ], [ -16.64, 63.8 ], [ -17.68, 63.71 ], [ -18.16, 63.46 ], [ -19.13, 63.4 ], [ -20.12, 63.53 ], [ -21.25, 63.88 ], [ -22.71, 63.8 ], [ -22.71, 64.08 ], [ -22.53, 63.97 ], [ -22.04, 64.04 ], [ -21.73, 64.34 ], [ -21.36, 64.38 ], [ -21.98, 64.38 ] ] ], [ [ [ 5.5, 60.52 ], [ 5.71, 60.7 ], [ 5.71, 60.47 ], [ 5.53, 60.43 ], [ 5.34, 60.54 ], [ 5.5, 60.52 ] ] ], [ [ [ 5.83, 62.35 ], [ 6.11, 62.35 ], [ 5.87, 62.25 ], [ 5.83, 62.35 ] ] ], [ [ [ -74.51, -48.16 ], [ -74.31, -48.26 ], [ -74.46, -48.34 ], [ -74.51, -48.16 ] ] ], [ [ [ 19.84, 60.42 ], [ 20.27, 60.29 ], [ 20.17, 60.18 ], [ 19.98, 60.3 ], [ 19.96, 60.06 ], [ 19.63, 60.29 ], [ 19.82, 60.2 ], [ 19.84, 60.42 ] ] ], [ [ [ 23.15, 70.54 ], [ 23.56, 70.62 ], [ 23.64, 70.49 ], [ 23.15, 70.27 ], [ 22.82, 70.41 ], [ 23.15, 70.54 ] ] ], [ [ [ 8.57, 63.71 ], [ 8.82, 63.8 ], [ 8.81, 63.69 ], [ 8.28, 63.68 ], [ 8.57, 63.71 ] ] ], [ [ [ 68.32, 23.73 ], [ 68.21, 23.71 ], [ 68.21, 23.83 ], [ 68.43, 23.99 ], [ 68.35, 23.9 ], [ 68.31, 23.78 ], [ 68.32, 23.73 ] ] ], [ [ [ 68.45, 23.9 ], [ 68.49, 23.99 ], [ 68.47, 23.86 ], [ 68.33, 23.79 ], [ 68.36, 23.9 ], [ 68.45, 23.9 ] ] ], [ [ [ 124.36, 11.64 ], [ 124.54, 11.68 ], [ 124.61, 11.49 ], [ 124.46, 11.47 ], [ 124.36, 11.64 ] ] ], [ [ [ 7.98, 63.34 ], [ 7.79, 63.41 ], [ 8.1, 63.47 ], [ 7.98, 63.34 ] ] ], [ [ [ -69.97, 41.75 ], [ -69.95, 41.64 ], [ -70.69, 41.52 ], [ -70.66, 41.68 ], [ -70.56, 41.77 ], [ -70.29, 41.73 ], [ -70.37, 41.73 ], [ -70.3, 41.7 ], [ -70.01, 41.8 ], [ -70.23, 42.08 ], [ -70.03, 42.01 ], [ -69.97, 41.75 ] ] ], [ [ [ -74.58, -50.75 ], [ -74.35, -51.05 ], [ -74.58, -51.01 ], [ -74.69, -51.12 ], [ -74.6, -50.96 ], [ -74.8, -51.08 ], [ -74.94, -50.88 ], [ -74.61, -50.95 ], [ -74.58, -50.75 ] ] ], [ [ [ -64.52, 63.77 ], [ -64.46, 63.66 ], [ -64.51, 63.74 ], [ -64.67, 63.78 ], [ -64.88, 63.78 ], [ -64.9, 63.83 ], [ -64.53, 63.91 ], [ -64.52, 63.77 ] ] ], [ [ [ -73.79, -45.62 ], [ -73.55, -45.46 ], [ -73.62, -45.77 ], [ -73.79, -45.62 ] ] ], [ [ [ 61.32, 80.41 ], [ 59.67, 80.38 ], [ 59.69, 80.8 ], [ 62.04, 80.86 ], [ 61.32, 80.41 ] ] ], [ [ [ -65.82, 18.06 ], [ -66.16, 17.93 ], [ -67.19, 17.93 ], [ -67.27, 18.36 ], [ -67.09, 18.52 ], [ -65.62, 18.39 ], [ -65.6, 18.21 ], [ -65.82, 18.06 ] ] ], [ [ [ 126.1, 9.84 ], [ 126.05, 9.75 ], [ 125.96, 9.88 ], [ 126.06, 10.06 ], [ 126.1, 9.84 ] ] ], [ [ [ -68.35, 44.4 ], [ -68.17, 44.35 ], [ -68.33, 44.37 ], [ -68.33, 44.22 ], [ -68.35, 44.4 ] ] ], [ [ [ 125.66, 10.34 ], [ 125.67, 9.85 ], [ 125.47, 10.14 ], [ 125.64, 10.47 ], [ 125.66, 10.34 ] ] ], [ [ [ 15.28, 37.06 ], [ 15.08, 36.65 ], [ 14.49, 36.79 ], [ 14.26, 37.06 ], [ 12.66, 37.57 ], [ 12.42, 37.8 ], [ 12.49, 38.02 ], [ 12.73, 38.19 ], [ 12.9, 38.02 ], [ 13.32, 38.22 ], [ 13.74, 37.97 ], [ 14.31, 38.01 ], [ 15.65, 38.27 ], [ 15.09, 37.5 ], [ 15.28, 37.06 ] ] ], [ [ [ -65.88, 64.75 ], [ -65.92, 64.89 ], [ -65.53, 64.72 ], [ -65.7, 64.48 ], [ -65.06, 64.48 ], [ -65.2, 64.29 ], [ -65.67, 64.3 ], [ -65.23, 64.2 ], [ -65.41, 64.14 ], [ -65.01, 64.05 ], [ -65.22, 64.02 ], [ -64.61, 63.97 ], [ -64.97, 63.81 ], [ -64.94, 63.76 ], [ -64.66, 63.76 ], [ -64.67, 63.71 ], [ -64.5, 63.68 ], [ -64.52, 63.6 ], [ -64.68, 63.69 ], [ -64.5, 63.24 ], [ -64.7, 63.28 ], [ -64.85, 63.55 ], [ -65.3, 63.8 ], [ -64.96, 63.6 ], [ -65.15, 63.4 ], [ -64.88, 63.23 ], [ -65.06, 63.32 ], [ -65.08, 63.16 ], [ -64.59, 62.92 ], [ -64.81, 62.83 ], [ -65.26, 62.99 ], [ -64.89, 62.65 ], [ -65.1, 62.56 ], [ -64.85, 62.55 ], [ -65.12, 62.54 ], [ -65.35, 62.69 ], [ -65.29, 62.94 ], [ -65.54, 62.8 ], [ -65.69, 63.05 ], [ -65.76, 62.88 ], [ -66.24, 63.22 ], [ -66.06, 62.94 ], [ -66.4, 63.01 ], [ -66.5, 63.41 ], [ -66.53, 63 ], [ -66.79, 63.29 ], [ -66.8, 63.15 ], [ -67.01, 63.25 ], [ -66.92, 63.4 ], [ -67.14, 63.28 ], [ -67.9, 63.78 ], [ -67.67, 63.36 ], [ -68.24, 63.7 ], [ -68.98, 63.76 ], [ -67.97, 63.04 ], [ -67.61, 63.09 ], [ -67.75, 62.95 ], [ -67.5, 63.03 ], [ -67.63, 62.91 ], [ -67.37, 62.96 ], [ -66.34, 62.44 ], [ -66.5, 62.34 ], [ -65.89, 62.21 ], [ -66.01, 62.05 ], [ -66.24, 62.08 ], [ -65.94, 61.88 ], [ -66.27, 61.86 ], [ -67.71, 62.22 ], [ -68.6, 62.26 ], [ -68.85, 62.58 ], [ -68.97, 62.36 ], [ -69.24, 62.64 ], [ -69.34, 62.53 ], [ -69.59, 62.65 ], [ -69.38, 62.77 ], [ -69.94, 62.78 ], [ -69.88, 62.92 ], [ -70.16, 62.74 ], [ -71, 62.95 ], [ -70.82, 63.06 ], [ -71.11, 62.98 ], [ -70.85, 63.16 ], [ -71.4, 63.05 ], [ -71.7, 63.41 ], [ -72.12, 63.44 ], [ -71.6, 63.41 ], [ -71.2, 63.59 ], [ -71.56, 63.57 ], [ -71.49, 63.72 ], [ -71.61, 63.63 ], [ -71.91, 63.87 ], [ -71.89, 63.64 ], [ -72.17, 63.77 ], [ -72.25, 63.67 ], [ -72.22, 63.95 ], [ -72.56, 63.78 ], [ -72.58, 64.02 ], [ -72.96, 64.05 ], [ -72.86, 64.17 ], [ -73.49, 64.4 ], [ -73.29, 64.66 ], [ -73.58, 64.31 ], [ -73.65, 64.51 ], [ -74.18, 64.36 ], [ -74.04, 64.72 ], [ -74.38, 64.57 ], [ -74.61, 64.89 ], [ -74.94, 64.79 ], [ -74.44, 64.56 ], [ -74.65, 64.35 ], [ -75.81, 64.62 ], [ -75.69, 64.37 ], [ -76.7, 64.3 ], [ -76.65, 64.19 ], [ -78.03, 64.43 ], [ -78.14, 64.96 ], [ -77.31, 65.18 ], [ -77.41, 65.46 ], [ -75.72, 65.2 ], [ -75.91, 65.33 ], [ -75.15, 65.25 ], [ -75.1, 65.39 ], [ -74.5, 65.33 ], [ -74.13, 65.54 ], [ -73.48, 65.43 ], [ -74.46, 66.15 ], [ -73.34, 66.56 ], [ -72.14, 67.28 ], [ -73, 68.24 ], [ -73.5, 68.28 ], [ -73.21, 68.38 ], [ -73.64, 68.25 ], [ -73.96, 68.41 ], [ -73.65, 68.67 ], [ -74.19, 68.74 ], [ -73.89, 68.56 ], [ -74.23, 68.52 ], [ -74.73, 68.74 ], [ -74.4, 68.84 ], [ -74.97, 68.82 ], [ -74.66, 68.87 ], [ -75.05, 68.91 ], [ -74.75, 69.08 ], [ -75.12, 68.89 ], [ -75.49, 69.03 ], [ -75.62, 68.87 ], [ -76.63, 68.69 ], [ -76.6, 69.03 ], [ -75.6, 69.08 ], [ -75.59, 69.24 ], [ -76.65, 69.54 ], [ -76.46, 69.66 ], [ -76.21, 69.53 ], [ -76.15, 69.69 ], [ -76.57, 69.7 ], [ -76.72, 69.56 ], [ -77.19, 69.64 ], [ -76.69, 69.85 ], [ -77.31, 69.84 ], [ -76.92, 70.01 ], [ -77.62, 69.75 ], [ -77.67, 70.2 ], [ -78.38, 70.21 ], [ -78.73, 70.46 ], [ -79.59, 70.42 ], [ -78.92, 70.31 ], [ -78.79, 69.89 ], [ -79.68, 69.86 ], [ -79.94, 70.02 ], [ -81.73, 70.15 ], [ -80.94, 69.72 ], [ -83.02, 70.32 ], [ -81.76, 69.87 ], [ -82.3, 69.8 ], [ -83.07, 70.02 ], [ -84.66, 70.01 ], [ -84.79, 70.12 ], [ -85.82, 70.01 ], [ -86.56, 70.24 ], [ -86.38, 70.53 ], [ -86.65, 70.32 ], [ -86.99, 70.47 ], [ -86.98, 70.29 ], [ -87.76, 70.34 ], [ -87.85, 70.24 ], [ -88.24, 70.32 ], [ -87.87, 70.31 ], [ -88.84, 70.52 ], [ -89.54, 71.09 ], [ -88.05, 70.94 ], [ -86.99, 71 ], [ -87.83, 71.27 ], [ -89.79, 71.33 ], [ -90.03, 71.52 ], [ -90.02, 72.07 ], [ -89.56, 72.17 ], [ -89.93, 72.43 ], [ -88.99, 73.28 ], [ -88.51, 73.28 ], [ -88.69, 73.42 ], [ -86.55, 73.86 ], [ -84.83, 73.74 ], [ -85.93, 73.37 ], [ -86.76, 72.71 ], [ -86.23, 72.42 ], [ -86.2, 71.85 ], [ -84.82, 71.27 ], [ -86.81, 70.99 ], [ -84.97, 71.2 ], [ -84.78, 70.94 ], [ -84.41, 71.65 ], [ -85.31, 71.68 ], [ -86.04, 72.02 ], [ -85.51, 72.06 ], [ -85.24, 72.27 ], [ -84.14, 72.01 ], [ -84.94, 72.29 ], [ -84.39, 72.39 ], [ -85.51, 72.46 ], [ -85.7, 72.91 ], [ -85.32, 72.98 ], [ -83.92, 72.74 ], [ -85.48, 73.1 ], [ -83.57, 73.06 ], [ -84.72, 73.13 ], [ -85.13, 73.31 ], [ -84.76, 73.39 ], [ -84.32, 73.22 ], [ -84.63, 73.4 ], [ -84.16, 73.48 ], [ -83.6, 73.3 ], [ -84.01, 73.51 ], [ -82.84, 73.74 ], [ -81.6, 73.73 ], [ -80.22, 72.73 ], [ -81.38, 72.24 ], [ -80.5, 72.51 ], [ -80.96, 71.88 ], [ -80.22, 72.31 ], [ -79.68, 72.13 ], [ -80.17, 72.33 ], [ -79.79, 72.51 ], [ -79.73, 72.22 ], [ -79.43, 72.19 ], [ -79.35, 72.41 ], [ -78.94, 72.28 ], [ -79.18, 71.96 ], [ -78.51, 71.87 ], [ -78.86, 72.18 ], [ -77.74, 71.75 ], [ -78.8, 72.34 ], [ -78.42, 72.17 ], [ -78.42, 72.33 ], [ -77.65, 72.1 ], [ -77, 72.14 ], [ -78.48, 72.41 ], [ -78.41, 72.59 ], [ -77.18, 72.75 ], [ -76.13, 72.59 ], [ -76.14, 72.46 ], [ -75.97, 72.59 ], [ -75.16, 72.5 ], [ -75.04, 72.19 ], [ -75.95, 72.1 ], [ -76.4, 71.86 ], [ -75.75, 72.11 ], [ -75.22, 72.08 ], [ -75.88, 71.7 ], [ -75.08, 72.11 ], [ -74.24, 72.08 ], [ -74.23, 71.83 ], [ -75.4, 71.67 ], [ -74.91, 71.67 ], [ -75.37, 71.51 ], [ -74.61, 71.66 ], [ -75.13, 71.48 ], [ -74.83, 71.52 ], [ -74.69, 71.4 ], [ -75.05, 71.18 ], [ -74.61, 71.38 ], [ -74.51, 71.66 ], [ -74.1, 71.74 ], [ -74.11, 71.53 ], [ -73.6, 71.78 ], [ -74.31, 71.4 ], [ -74.02, 71.44 ], [ -74.21, 71.2 ], [ -73.59, 71.57 ], [ -73.39, 71.39 ], [ -73.86, 71.05 ], [ -73.33, 71.35 ], [ -73.04, 71.26 ], [ -73.36, 70.97 ], [ -72.56, 71.66 ], [ -71.15, 71.27 ], [ -71.49, 71.06 ], [ -72.08, 71.08 ], [ -72.85, 70.81 ], [ -72.19, 70.84 ], [ -72.64, 70.63 ], [ -70.61, 71.06 ], [ -70.79, 70.75 ], [ -71.19, 70.59 ], [ -71.61, 70.62 ], [ -71.98, 70.42 ], [ -71.81, 70.3 ], [ -71.51, 70.58 ], [ -71.18, 70.55 ], [ -71.55, 70.03 ], [ -71.01, 70.63 ], [ -69.89, 70.88 ], [ -70.63, 70.46 ], [ -69.45, 70.79 ], [ -68.29, 70.52 ], [ -70.19, 70.03 ], [ -69.82, 69.99 ], [ -70.47, 69.85 ], [ -69.79, 69.96 ], [ -69.65, 70.14 ], [ -68.68, 70.21 ], [ -70.01, 69.62 ], [ -68.23, 70.1 ], [ -68.12, 70.32 ], [ -67.28, 70.02 ], [ -67.1, 69.73 ], [ -67.9, 69.78 ], [ -68.31, 69.63 ], [ -70.06, 69.54 ], [ -68.55, 69.58 ], [ -66.69, 69.28 ], [ -66.77, 69.14 ], [ -69.17, 69.32 ], [ -68.08, 69.22 ], [ -68.98, 69.23 ], [ -68.51, 69.21 ], [ -69.09, 69.11 ], [ -69.01, 68.98 ], [ -68.44, 69.18 ], [ -67.71, 69.02 ], [ -68.57, 68.97 ], [ -67.8, 68.78 ], [ -69.41, 68.87 ], [ -68.06, 68.68 ], [ -68.91, 68.6 ], [ -67.94, 68.56 ], [ -67.95, 68.4 ], [ -67.69, 68.57 ], [ -67.62, 68.38 ], [ -67.57, 68.49 ], [ -66.67, 68.45 ], [ -67.88, 68.27 ], [ -67.02, 68.33 ], [ -67.34, 68.19 ], [ -66.76, 68.24 ], [ -67.05, 67.99 ], [ -66.68, 68.14 ], [ -66.74, 67.93 ], [ -66.61, 68.14 ], [ -66.31, 68.13 ], [ -66.39, 67.87 ], [ -66.73, 67.88 ], [ -66.37, 67.77 ], [ -65.93, 68.03 ], [ -66.06, 67.59 ], [ -65.8, 67.97 ], [ -65.46, 67.99 ], [ -65.34, 67.59 ], [ -65.43, 67.92 ], [ -65.08, 68.04 ], [ -64.72, 67.98 ], [ -65.1, 67.92 ], [ -65.23, 67.64 ], [ -64.52, 67.81 ], [ -64.65, 67.65 ], [ -64.29, 67.72 ], [ -64.07, 67.57 ], [ -64.46, 67.47 ], [ -63.94, 67.35 ], [ -65, 67.37 ], [ -64.23, 67.3 ], [ -64.8, 67.19 ], [ -63.95, 67.27 ], [ -64.64, 67.13 ], [ -64.71, 66.96 ], [ -64.57, 67.12 ], [ -63.5, 67.24 ], [ -63.8, 66.9 ], [ -63.12, 67.33 ], [ -63.19, 66.97 ], [ -63.86, 66.82 ], [ -63.42, 66.91 ], [ -63.4, 66.7 ], [ -63.33, 66.9 ], [ -62.84, 66.96 ], [ -62.89, 66.64 ], [ -62.76, 66.93 ], [ -62.31, 66.74 ], [ -62.42, 66.93 ], [ -62.01, 67.06 ], [ -62.08, 66.89 ], [ -61.72, 66.93 ], [ -62.01, 66.85 ], [ -61.65, 66.87 ], [ -61.29, 66.68 ], [ -61.43, 66.53 ], [ -61.98, 66.69 ], [ -62.21, 66.62 ], [ -61.8, 66.61 ], [ -61.56, 66.46 ], [ -62.03, 66.39 ], [ -61.53, 66.33 ], [ -62.17, 66.31 ], [ -62.64, 66.45 ], [ -62.32, 66.3 ], [ -62.7, 66.21 ], [ -62.85, 66.31 ], [ -62.71, 66.18 ], [ -62.1, 66.13 ], [ -62.15, 66.03 ], [ -61.93, 66.01 ], [ -63.03, 66.11 ], [ -62.28, 65.8 ], [ -62.85, 65.91 ], [ -62.66, 65.57 ], [ -62.91, 65.75 ], [ -62.95, 65.57 ], [ -63.24, 65.63 ], [ -63.52, 65.93 ], [ -63.34, 65.66 ], [ -63.73, 65.67 ], [ -63.33, 65.59 ], [ -63.69, 65.56 ], [ -63.29, 65.42 ], [ -63.68, 65.47 ], [ -63.32, 65.21 ], [ -63.54, 64.89 ], [ -63.85, 64.98 ], [ -63.8, 65.19 ], [ -64.11, 65.04 ], [ -64.12, 65.26 ], [ -64.37, 65.18 ], [ -64.21, 65.45 ], [ -64.56, 65.08 ], [ -64.91, 65.34 ], [ -64.4, 65.48 ], [ -65.09, 65.39 ], [ -64.71, 65.65 ], [ -65.1, 65.54 ], [ -65.3, 65.63 ], [ -64.79, 65.73 ], [ -65.46, 65.69 ], [ -65.36, 65.91 ], [ -64.67, 65.96 ], [ -64.86, 66.03 ], [ -64.77, 66.18 ], [ -64.35, 66.36 ], [ -64.7, 66.28 ], [ -64.95, 66.07 ], [ -65.87, 65.94 ], [ -65.48, 66.39 ], [ -66.14, 66.13 ], [ -66.54, 66.24 ], [ -66.44, 66.41 ], [ -66.77, 66.37 ], [ -66.73, 66.6 ], [ -67.17, 66.67 ], [ -66.85, 66.57 ], [ -67.08, 66.49 ], [ -67.33, 66.6 ], [ -67.95, 66.63 ], [ -67.29, 66.53 ], [ -67.13, 66.37 ], [ -67.44, 66.44 ], [ -67.12, 66.28 ], [ -67.99, 66.51 ], [ -67.17, 65.91 ], [ -67.66, 65.9 ], [ -67.71, 66.1 ], [ -67.94, 65.91 ], [ -67.93, 66.14 ], [ -68.51, 66.3 ], [ -68.97, 66.19 ], [ -68.02, 66.09 ], [ -68.11, 65.96 ], [ -68.37, 66.07 ], [ -68.24, 65.77 ], [ -67.8, 65.82 ], [ -68.36, 65.39 ], [ -67.31, 65.67 ], [ -67.46, 65.5 ], [ -67.07, 65.39 ], [ -67.55, 65.35 ], [ -67.11, 65.32 ], [ -67.25, 65.17 ], [ -66.92, 65.24 ], [ -67.11, 65.05 ], [ -66.75, 65.18 ], [ -66.73, 64.72 ], [ -66.67, 65.04 ], [ -66.12, 64.87 ], [ -66.33, 64.63 ], [ -66.01, 64.86 ], [ -65.79, 64.63 ], [ -65.88, 64.75 ] ], [ [ -64.24, 63.5 ], [ -64.04, 63.27 ], [ -64.38, 63.67 ], [ -64.24, 63.5 ] ] ], [ [ [ -77.75, 76.81 ], [ -78.39, 76.46 ], [ -79.04, 76.57 ], [ -79.45, 76.31 ], [ -81.04, 76.13 ], [ -80.79, 76.43 ], [ -82.09, 76.52 ], [ -81.77, 76.69 ], [ -82.29, 76.64 ], [ -82.73, 76.83 ], [ -82.19, 76.41 ], [ -83.04, 76.44 ], [ -83.39, 76.76 ], [ -83.2, 76.41 ], [ -84.28, 76.66 ], [ -84.14, 76.48 ], [ -84.63, 76.43 ], [ -85.22, 76.64 ], [ -84.38, 76.31 ], [ -84.92, 76.28 ], [ -86.39, 76.39 ], [ -86.6, 76.64 ], [ -86.67, 76.34 ], [ -87.51, 76.63 ], [ -87.4, 76.35 ], [ -88.38, 76.39 ], [ -88.45, 76.84 ], [ -88.59, 76.4 ], [ -88.68, 76.6 ], [ -88.9, 76.41 ], [ -89.66, 76.57 ], [ -88.54, 77.1 ], [ -86.59, 77.19 ], [ -87.23, 77.2 ], [ -86.78, 77.36 ], [ -87.72, 77.36 ], [ -88.22, 77.85 ], [ -86.41, 77.84 ], [ -85.81, 77.42 ], [ -84.44, 77.29 ], [ -84.55, 77.4 ], [ -83.46, 77.35 ], [ -83.83, 77.46 ], [ -82.31, 78.04 ], [ -83.9, 77.49 ], [ -84.85, 77.54 ], [ -84.42, 77.75 ], [ -84.92, 77.6 ], [ -85.28, 77.67 ], [ -85.29, 77.87 ], [ -84.46, 77.91 ], [ -85.68, 77.93 ], [ -84.21, 78.04 ], [ -84.97, 78.18 ], [ -83.99, 78.17 ], [ -84.95, 78.22 ], [ -84.61, 78.6 ], [ -85.44, 78.1 ], [ -86.26, 78.08 ], [ -85.79, 78.39 ], [ -86.69, 78.12 ], [ -87.52, 78.13 ], [ -86.63, 78.8 ], [ -85.07, 78.92 ], [ -82.35, 78.57 ], [ -82.19, 78.73 ], [ -83.24, 78.85 ], [ -81.62, 78.89 ], [ -81.53, 79.06 ], [ -82.53, 78.89 ], [ -84.69, 79.02 ], [ -84.5, 79.15 ], [ -83.33, 79.06 ], [ -84.33, 79.19 ], [ -85.14, 79.65 ], [ -86.45, 79.78 ], [ -86.39, 79.97 ], [ -85.23, 79.93 ], [ -86.49, 80.02 ], [ -86.49, 80.3 ], [ -83.85, 80.26 ], [ -81.72, 79.59 ], [ -80.59, 79.56 ], [ -79.74, 79.7 ], [ -81.52, 79.72 ], [ -81.43, 79.95 ], [ -83.2, 80.33 ], [ -78.08, 80.56 ], [ -79.99, 80.62 ], [ -76.44, 80.88 ], [ -78.97, 80.88 ], [ -76.85, 81.45 ], [ -78.61, 81.12 ], [ -79.45, 81.19 ], [ -79.47, 80.85 ], [ -80.96, 80.65 ], [ -83.11, 80.54 ], [ -81.74, 80.82 ], [ -83.33, 80.68 ], [ -83.22, 80.84 ], [ -83.79, 80.54 ], [ -86.04, 80.53 ], [ -86.71, 80.6 ], [ -85.68, 80.97 ], [ -82.33, 81.18 ], [ -85.67, 81.05 ], [ -87.49, 80.62 ], [ -89.4, 80.92 ], [ -85.76, 81.07 ], [ -84.88, 81.3 ], [ -89.7, 81.01 ], [ -90.25, 81.2 ], [ -89.04, 81.25 ], [ -89.91, 81.34 ], [ -87.86, 81.54 ], [ -90.37, 81.36 ], [ -90.8, 81.45 ], [ -89.51, 81.62 ], [ -90.22, 81.7 ], [ -91.4, 81.51 ], [ -91.9, 81.64 ], [ -90.57, 81.88 ], [ -89.23, 81.78 ], [ -89.24, 81.94 ], [ -88.88, 81.81 ], [ -88.01, 82.1 ], [ -86.79, 81.89 ], [ -86.84, 82.05 ], [ -84.51, 81.88 ], [ -86.85, 82.2 ], [ -85.31, 82.28 ], [ -85.22, 82.48 ], [ -83.52, 82.32 ], [ -83.07, 82.05 ], [ -81.47, 81.99 ], [ -82.74, 82.29 ], [ -79.44, 81.88 ], [ -82.6, 82.35 ], [ -82.5, 82.5 ], [ -81.44, 82.5 ], [ -82.34, 82.64 ], [ -80.34, 82.45 ], [ -81.54, 82.81 ], [ -78.74, 82.67 ], [ -80.35, 82.9 ], [ -78.69, 82.95 ], [ -78.07, 82.81 ], [ -77.82, 82.93 ], [ -75.97, 82.5 ], [ -75.42, 82.62 ], [ -77.5, 83.04 ], [ -76.22, 83.13 ], [ -73.93, 83.12 ], [ -74.48, 83.03 ], [ -72.57, 82.59 ], [ -73.85, 83.01 ], [ -72.92, 83.09 ], [ -71.55, 83.1 ], [ -70.92, 82.88 ], [ -70.63, 83.11 ], [ -68.84, 82.93 ], [ -66.34, 82.93 ], [ -68.58, 82.62 ], [ -65.73, 82.85 ], [ -65.13, 82.75 ], [ -64.86, 82.91 ], [ -64.43, 82.75 ], [ -63.57, 82.83 ], [ -63.41, 82.43 ], [ -61.53, 82.47 ], [ -61.19, 82.22 ], [ -64.36, 81.71 ], [ -68.23, 81.56 ], [ -69.26, 81.72 ], [ -68.52, 81.51 ], [ -66.6, 81.52 ], [ -70.01, 81.08 ], [ -64.44, 81.47 ], [ -69.53, 80.37 ], [ -70.22, 80.34 ], [ -70.65, 80.55 ], [ -72.04, 80.64 ], [ -70.78, 80.55 ], [ -70.42, 80.34 ], [ -69.9, 80.26 ], [ -71.6, 80.11 ], [ -72.38, 80.21 ], [ -72.22, 80.06 ], [ -70.47, 80.11 ], [ -71.4, 79.93 ], [ -71.08, 79.79 ], [ -72.25, 79.65 ], [ -72.85, 79.82 ], [ -74.39, 79.89 ], [ -75.2, 79.81 ], [ -73.3, 79.78 ], [ -73.18, 79.52 ], [ -74.93, 79.51 ], [ -75.15, 79.37 ], [ -77.11, 79.57 ], [ -75.87, 79.34 ], [ -77.09, 79.47 ], [ -77.14, 79.32 ], [ -78.05, 79.35 ], [ -77.57, 79.24 ], [ -74.47, 79.23 ], [ -74.56, 79.01 ], [ -76.13, 79.2 ], [ -78.46, 79.15 ], [ -76.07, 79.08 ], [ -78.81, 79.07 ], [ -77.66, 79.02 ], [ -78.16, 78.77 ], [ -76.68, 79.03 ], [ -75.7, 78.97 ], [ -76.43, 78.84 ], [ -74.73, 78.83 ], [ -74.57, 78.59 ], [ -76.62, 78.53 ], [ -75.02, 78.32 ], [ -76.94, 78.22 ], [ -75.64, 78.04 ], [ -76.83, 77.9 ], [ -78.38, 77.96 ], [ -77.7, 77.61 ], [ -78.79, 77.31 ], [ -80.74, 77.33 ], [ -81.94, 77.69 ], [ -81.14, 77.34 ], [ -82.2, 77.3 ], [ -81.79, 77.16 ], [ -81.07, 77.29 ], [ -80.06, 77.2 ], [ -80.34, 77.07 ], [ -79.28, 77.22 ], [ -79.4, 76.92 ], [ -78.73, 76.81 ], [ -78.09, 77.02 ], [ -77.75, 76.81 ] ] ], [ [ [ -1.22, 50.73 ], [ -1.07, 50.68 ], [ -1.26, 50.58 ], [ -1.59, 50.66 ], [ -1.22, 50.73 ] ] ], [ [ [ -73.79, 18.03 ], [ -74.45, 18.35 ], [ -74.42, 18.62 ], [ -72.88, 18.42 ], [ -72.34, 18.58 ], [ -72.82, 19.05 ], [ -72.7, 19.11 ], [ -72.8, 19.22 ], [ -72.7, 19.46 ], [ -73.45, 19.69 ], [ -73.16, 19.93 ], [ -72.77, 19.95 ], [ -72.32, 19.71 ], [ -72.2, 19.79 ], [ -71.82, 19.65 ], [ -71.65, 19.9 ], [ -71.25, 19.83 ], [ -71.01, 19.93 ], [ -70.27, 19.64 ], [ -69.96, 19.68 ], [ -69.74, 19.28 ], [ -69.15, 19.3 ], [ -69.23, 19.18 ], [ -69.62, 19.22 ], [ -69.62, 19.08 ], [ -68.92, 19.03 ], [ -68.32, 18.61 ], [ -68.64, 18.21 ], [ -69.21, 18.45 ], [ -69.88, 18.48 ], [ -70.15, 18.23 ], [ -70.5, 18.19 ], [ -70.61, 18.42 ], [ -71.06, 18.32 ], [ -71.42, 17.6 ], [ -72.05, 18.24 ], [ -72.82, 18.14 ], [ -73.65, 18.25 ], [ -73.79, 18.03 ] ] ], [ [ [ -36.98, 65.69 ], [ -37.01, 65.56 ], [ -37.23, 65.67 ], [ -36.98, 65.69 ] ] ], [ [ [ 19.64, 70.18 ], [ 19.59, 70.29 ], [ 20.13, 70.1 ], [ 19.74, 70.06 ], [ 19.64, 70.18 ] ] ], [ [ [ 145.72, 15.22 ], [ 145.83, 15.27 ], [ 145.75, 15.09 ], [ 145.72, 15.22 ] ] ], [ [ [ -74.59, -48.42 ], [ -74.46, -48.67 ], [ -74.95, -48.58 ], [ -74.84, -48.39 ], [ -74.66, -48.46 ], [ -74.69, -48.11 ], [ -74.59, -48.42 ] ] ], [ [ [ -80.13, -2.94 ], [ -80.27, -3.01 ], [ -80.22, -2.74 ], [ -79.9, -2.74 ], [ -80.17, -2.85 ], [ -80.13, -2.94 ] ] ], [ [ [ -14.65, 10.56 ], [ -14.55, 10.54 ], [ -14.66, 10.45 ], [ -14.65, 10.56 ] ] ], [ [ [ -73.77, -41.96 ], [ -73.67, -41.8 ], [ -73.48, -41.83 ], [ -73.57, -41.95 ], [ -73.34, -42.27 ], [ -73.67, -42.39 ], [ -73.58, -42.53 ], [ -73.78, -42.53 ], [ -73.74, -42.43 ], [ -73.8, -42.53 ], [ -73.46, -42.88 ], [ -73.75, -42.85 ], [ -73.48, -43.13 ], [ -73.73, -43.09 ], [ -73.66, -43.32 ], [ -73.88, -43.28 ], [ -73.85, -43.43 ], [ -74.4, -43.23 ], [ -74.15, -42.85 ], [ -74.05, -41.8 ], [ -73.9, -41.77 ], [ -74.01, -41.84 ], [ -73.77, -41.96 ] ] ], [ [ [ 119.77, 10.5 ], [ 119.83, 10.65 ], [ 120, 10.57 ], [ 119.77, 10.5 ] ] ], [ [ [ -48, -25.2 ], [ -47.91, -25.06 ], [ -47.91, -25.16 ], [ -48.1, -25.31 ], [ -48, -25.21 ], [ -47.99, -25.2 ], [ -48, -25.2 ] ] ], [ [ [ 45.2, -12.73 ], [ 45.11, -12.99 ], [ 45.04, -12.72 ], [ 45.2, -12.73 ] ] ], [ [ [ -67.05, -55.29 ], [ -66.87, -55.23 ], [ -66.86, -55.34 ], [ -67.05, -55.29 ] ] ], [ [ [ -28.07, 38.63 ], [ -28.32, 38.76 ], [ -27.75, 38.55 ], [ -28.07, 38.63 ] ] ], [ [ [ -109.34, -27.15 ], [ -109.45, -27.19 ], [ -109.39, -27.06 ], [ -109.23, -27.1 ], [ -109.34, -27.15 ] ] ], [ [ [ -65.9, -54.9 ], [ -66.52, -55.06 ], [ -67.28, -54.87 ], [ -68.25, -54.79 ], [ -69.04, -54.97 ], [ -69.65, -54.85 ], [ -69.71, -54.7 ], [ -69.69, -54.84 ], [ -69.78, -54.73 ], [ -69.92, -54.85 ], [ -69.95, -54.69 ], [ -69.95, -54.85 ], [ -70.31, -54.86 ], [ -70.19, -54.69 ], [ -70.35, -54.85 ], [ -70.54, -54.76 ], [ -70.76, -54.86 ], [ -70.44, -54.63 ], [ -71.02, -54.78 ], [ -70.92, -54.62 ], [ -71.19, -54.7 ], [ -71.34, -54.51 ], [ -71.49, -54.69 ], [ -71.49, -54.58 ], [ -71.89, -54.64 ], [ -72.02, -54.51 ], [ -71.64, -54.58 ], [ -71.87, -54.43 ], [ -71.46, -54.49 ], [ -71.61, -54.41 ], [ -71.37, -54.37 ], [ -70.94, -54.52 ], [ -70.76, -54.33 ], [ -70.58, -54.36 ], [ -70.77, -54.63 ], [ -70.56, -54.4 ], [ -70.11, -54.56 ], [ -70.93, -54.12 ], [ -70.12, -54.44 ], [ -70.2, -54.32 ], [ -69.99, -54.27 ], [ -69.76, -54.6 ], [ -69.85, -54.29 ], [ -69.58, -54.53 ], [ -69.46, -54.35 ], [ -69.2, -54.49 ], [ -69.49, -54.7 ], [ -68.97, -54.48 ], [ -69.92, -54.16 ], [ -70.16, -53.87 ], [ -70.14, -53.74 ], [ -69.35, -53.52 ], [ -69.36, -53.36 ], [ -70.23, -53.48 ], [ -70.46, -53.36 ], [ -70.42, -53.02 ], [ -70.09, -52.93 ], [ -70.44, -52.78 ], [ -69.91, -52.84 ], [ -69.41, -52.45 ], [ -69.15, -52.7 ], [ -68.75, -52.55 ], [ -68.2, -53.14 ], [ -68.33, -53.01 ], [ -68.56, -53.25 ], [ -68.14, -53.33 ], [ -67.91, -53.68 ], [ -66.47, -54.48 ], [ -65.12, -54.66 ], [ -65.38, -54.94 ], [ -65.9, -54.9 ] ] ], [ [ [ 104.64, -.04 ], [ 105, -.3 ], [ 104.43, -.24 ], [ 104.49, 0 ], [ 104.64, -.04 ] ] ], [ [ [ -61.87, 17.12 ], [ -61.67, 17.05 ], [ -61.89, 17.02 ], [ -61.87, 17.12 ] ] ], [ [ [ 18.78, 57.7 ], [ 18.92, 57.4 ], [ 18.13, 56.91 ], [ 18.3, 57.1 ], [ 18.11, 57.53 ], [ 18.7, 57.92 ], [ 18.79, 57.83 ], [ 19.01, 57.92 ], [ 19.1, 57.82 ], [ 18.78, 57.7 ] ] ], [ [ [ -45.36, -23.78 ], [ -45.23, -23.78 ], [ -45.24, -23.96 ], [ -45.46, -23.92 ], [ -45.36, -23.78 ] ] ], [ [ [ 120.2, 5.19 ], [ 119.82, 5.06 ], [ 120.21, 5.35 ], [ 120.2, 5.19 ] ] ], [ [ [ -154.13, 57.65 ], [ -153.62, 57.27 ], [ -153.88, 57.63 ], [ -153.55, 57.59 ], [ -153.93, 57.8 ], [ -153.62, 57.88 ], [ -153.49, 57.62 ], [ -153.49, 57.77 ], [ -153.31, 57.72 ], [ -153.48, 57.84 ], [ -153.18, 57.7 ], [ -153.24, 57.9 ], [ -153.04, 57.82 ], [ -153.28, 58 ], [ -152.8, 57.91 ], [ -152.85, 57.72 ], [ -152.47, 57.9 ], [ -152.52, 57.65 ], [ -152.16, 57.59 ], [ -152.35, 57.42 ], [ -152.96, 57.52 ], [ -153.05, 57.43 ], [ -152.76, 57.46 ], [ -152.66, 57.3 ], [ -153.16, 57.36 ], [ -152.95, 57.25 ], [ -153.54, 57.18 ], [ -153.49, 57.07 ], [ -153.76, 57.05 ], [ -153.59, 56.94 ], [ -154.13, 56.74 ], [ -153.74, 57.14 ], [ -154.09, 56.97 ], [ -153.95, 57.12 ], [ -154.47, 57.13 ], [ -154.1, 57.12 ], [ -154.31, 56.84 ], [ -154.8, 57.35 ], [ -154.13, 57.65 ] ] ], [ [ [ 124.69, 11.3 ], [ 124.98, 11.4 ], [ 124.96, 11.28 ], [ 125.03, 11.24 ], [ 125.04, 11.06 ], [ 125.01, 10.76 ], [ 125.26, 10.37 ], [ 125.13, 10.16 ], [ 124.97, 10.38 ], [ 125.03, 10 ], [ 124.76, 10.16 ], [ 124.8, 10.66 ], [ 124.69, 10.93 ], [ 124.38, 10.92 ], [ 124.29, 11.54 ], [ 124.69, 11.3 ] ] ], [ [ [ -112.14, 24.66 ], [ -112.06, 24.54 ], [ -112.3, 24.8 ], [ -112.13, 25.27 ], [ -112.26, 24.85 ], [ -112.14, 24.66 ] ] ] ]
        } ]
      });
      addWorldGeometry([ worldGeometry ], worldView);
      return worldView;
    }
  }
  __decorate([ view.ViewRef({
    type: map.WorldMapView,
    initView(mapView) {
      this.owner.world.insertView(mapView);
    }
  }) ], AtlasWorldMap.prototype, "base", void 0);
  __decorate([ view.ViewRef({
    type: map.GeoView,
    createView() {
      return this.owner.createWorld();
    }
  }) ], AtlasWorldMap.prototype, "world", void 0);
  __decorate([ view.ViewRef({
    type: graphics.CanvasView,
    initView(canvasView) {
      canvasView.position("absolute").top(0).right(0).bottom(0).left(0).mouseEventsEnabled(true).pointerEventsEnabled(true).touchEventsEnabled(true);
      const mapView = this.owner.base.createView();
      if (mapView !== null) {
        this.owner.base.setView(mapView);
        canvasView.appendChild(mapView);
      }
    }
  }) ], AtlasWorldMap.prototype, "canvas", void 0);
  __decorate([ view.ViewRef({
    type: SurfaceView,
    didAttachView(surfaceView) {
      this.owner.canvas.insertView(surfaceView);
    },
    willDetachView(surfaceView) {
      surfaceView.removeChildren();
    }
  }) ], AtlasWorldMap.prototype, "surface", void 0);
  class AtlasMapbox extends AtlasMap {
    constructor() {
      super();
      this.logoControl = null;
      this.navigationControl = null;
      this.onMapLoad = this.onMapLoad.bind(this);
    }
    get darkMapStyle() {
      return "mapbox://styles/mapbox/dark-v10";
    }
    get lightMapStyle() {
      return "mapbox://styles/mapbox/light-v10";
    }
    get mapStyle() {
      const surfaceView = this.surface.view;
      if (surfaceView !== null) {
        const backgroundColor = surfaceView.getLook(theme.Look.backgroundColor);
        if (backgroundColor !== void 0 && backgroundColor.lightness >= .5) {
          return this.lightMapStyle;
        }
      }
      return this.darkMapStyle;
    }
    onMapMove(mapCenter, mapZoom, mapView) {
      const lng = codec.Format.decimal(mapCenter.lng, 5);
      const lat = codec.Format.decimal(mapCenter.lat, 5);
      const zoom = codec.Format.decimal(mapZoom, 5);
      this.historyProvider.replaceHistory({
        permanent: {
          lng: lng,
          lat: lat,
          zoom: zoom
        }
      });
      const storageService = this.storageProvider.service;
      storageService.set("atlas.lng", lng);
      storageService.set("atlas.lat", lat);
      storageService.set("atlas.zoom", zoom);
    }
    resizeSurface(surfaceView, viewContext) {
      const mapView = this.base.view;
      const map = mapView !== null ? mapView.map : null;
      if (map !== null) {
        map.resize();
      }
    }
    layoutSurface(surfaceView, viewContext) {
      const containerView = this.container.view;
      if (containerView !== null) {
        const edgeInsets = surfaceView.edgeInsets.value;
        let left = surfaceView.paddingLeft.state;
        left = left instanceof math.Length ? left.pxValue() : 0;
        left = Math.max(left, edgeInsets !== null ? edgeInsets.insetLeft : 0);
        let right = surfaceView.paddingRight.state;
        right = right instanceof math.Length ? right.pxValue() : 0;
        right = Math.max(right, edgeInsets !== null ? edgeInsets.insetRight : 0);
        const controlContainer = dom.HtmlView.fromNode(containerView.node.querySelector(".mapboxgl-control-container"));
        const topLeftControls = dom.HtmlView.fromNode(controlContainer.node.querySelector(".mapboxgl-ctrl-top-left"));
        topLeftControls.top(surfaceView.paddingTop.state);
        topLeftControls.left(left);
        const topRightControls = dom.HtmlView.fromNode(controlContainer.node.querySelector(".mapboxgl-ctrl-top-right"));
        topRightControls.top(surfaceView.paddingTop.state);
        topRightControls.right(right);
        const bottomLeftControls = dom.HtmlView.fromNode(controlContainer.node.querySelector(".mapboxgl-ctrl-bottom-left"));
        bottomLeftControls.bottom(surfaceView.paddingBottom.state);
        bottomLeftControls.left(left);
        const bottomRightControls = dom.HtmlView.fromNode(controlContainer.node.querySelector(".mapboxgl-ctrl-bottom-right"));
        bottomRightControls.bottom(surfaceView.paddingBottom.state);
        bottomRightControls.right(right);
        const logoControl = this.logoControl;
        if (logoControl !== null) {
          if (viewContext.viewportIdiom === "mobile") {
            logoControl.style.marginBottom = "";
            logoControl.style.marginLeft = "14px";
            if (logoControl.parentNode !== topLeftControls.node) {
              topLeftControls.appendChild(logoControl);
            }
          } else {
            logoControl.style.marginBottom = "15px";
            logoControl.style.marginLeft = "12px";
            if (logoControl.parentNode !== bottomLeftControls.node) {
              bottomLeftControls.appendChild(logoControl);
            }
          }
        }
        const navigationControl = this.navigationControl;
        const mapView = this.base.view;
        const map = mapView !== null ? mapView.map : null;
        if (navigationControl !== null && map !== null) {
          const navigationControlContainer = navigationControl._container;
          if (viewContext.viewportIdiom === "mobile") {
            if (navigationControlContainer === void 0 || navigationControlContainer.parentNode !== topRightControls.node) {
              if (navigationControlContainer !== void 0 && navigationControlContainer.parentNode !== null) {
                map.removeControl(navigationControl);
              }
              map.addControl(navigationControl, "top-right");
            }
          } else {
            if (navigationControlContainer === void 0 || navigationControlContainer.parentNode !== bottomLeftControls.node) {
              if (navigationControlContainer !== void 0 && navigationControlContainer.parentNode !== null) {
                map.removeControl(navigationControl);
              }
              map.addControl(navigationControl, "bottom-left");
            }
          }
        }
      }
    }
    themeSurface(theme, mood, timing, surfaceView) {
      const mapView = this.base.view;
      const map = mapView !== null ? mapView.map : null;
      if (map !== null) {
        map.setStyle(this.mapStyle);
      }
    }
    onMapLoad(event) {
      const surfaceView = this.surface.view;
      if (surfaceView !== null) {
        surfaceView.requireUpdate(view.View.NeedsLayout);
      }
    }
    updateHistoryState(historyState) {
      const mapView = this.base.view;
      if (mapView !== null && !mapView.map.isZooming()) {
        let lng = historyState.permanent.lng;
        let lat = historyState.permanent.lat;
        let geoCenter;
        if (lng !== void 0 && lat !== void 0) {
          lng = parseFloat(lng);
          lat = parseFloat(lat);
          if (isFinite(lng) && isFinite(lat)) {
            geoCenter = new geo.GeoPoint(lng, lat);
          }
        }
        let zoom = historyState.permanent.zoom;
        if (zoom !== void 0) {
          zoom = parseFloat(zoom);
          if (!isFinite(zoom)) {
            zoom = void 0;
          }
        }
        if (geoCenter !== void 0 || zoom !== void 0) {
          mapView.moveTo({
            geoCenter: geoCenter,
            zoom: zoom
          });
        }
      }
    }
  }
  __decorate([ view.ViewRef({
    observes: true,
    initView(mapView) {
      mapView.container.setView(this.owner.container.view);
      const canvasView = mapView.canvas.view;
      if (canvasView !== null) {
        canvasView.mouseEventsEnabled(true).pointerEventsEnabled(true).touchEventsEnabled(true);
      }
    },
    createView() {
      const historyState = this.owner.historyProvider.historyState;
      let lng = historyState.permanent.lng;
      let lat = historyState.permanent.lat;
      let zoom = historyState.permanent.zoom;
      const storageService = this.owner.storageProvider.service;
      if (lng === void 0) {
        lng = storageService.get("atlas.lng");
      }
      if (lat === void 0) {
        lat = storageService.get("atlas.lat");
      }
      if (zoom === void 0) {
        zoom = storageService.get("atlas.zoom");
      }
      if (lng !== void 0) {
        lng = parseFloat(lng);
        if (!isFinite(lng)) {
          lng = void 0;
        }
      }
      if (lat !== void 0) {
        lat = parseFloat(lat);
        if (!isFinite(lat)) {
          lat = void 0;
        }
      }
      if (zoom !== void 0) {
        zoom = parseFloat(zoom);
        if (!isFinite(zoom)) {
          zoom = void 0;
        }
      }
      if (lng === void 0 || lat === void 0) {
        lng = -98.58;
        lat = 39.83;
      }
      if (zoom === void 0) {
        zoom = 4;
      }
      const containerView = this.owner.container.view;
      const map = new mapboxgl.Map({
        container: containerView.node,
        style: this.owner.mapStyle,
        center: {
          lng: lng,
          lat: lat
        },
        pitch: 0,
        zoom: zoom,
        logoPosition: "top-left",
        attributionControl: false
      });
      this.owner.logoControl = containerView.node.querySelector(".mapboxgl-control-container .mapboxgl-ctrl-top-left .mapboxgl-ctrl");
      this.owner.navigationControl = new mapboxgl.NavigationControl;
      map.addControl(this.owner.navigationControl, "bottom-left");
      map.on("load", this.owner.onMapLoad);
      return new mapbox.MapboxView(map);
    },
    viewDidMoveMap(mapView) {
      const geoViewport = mapView.geoViewport;
      this.owner.onMapMove(geoViewport.geoCenter, geoViewport.zoom, mapView);
    }
  }) ], AtlasMapbox.prototype, "base", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView,
    initView(containerView) {
      containerView.position("absolute").top(0).right(0).bottom(0).left(0);
      let mapView = this.owner.base.view;
      if (mapView === null) {
        mapView = this.owner.base.createView();
        this.owner.base.setView(mapView);
      }
      const controlContainer = dom.HtmlView.fromNode(containerView.node.querySelector(".mapboxgl-control-container"));
    }
  }) ], AtlasMapbox.prototype, "container", void 0);
  __decorate([ view.ViewRef({
    type: SurfaceView,
    observes: true,
    didAttachView(surfaceView) {
      this.owner.container.insertView(surfaceView);
    },
    willDetachView(surfaceView) {
      surfaceView.removeChildren();
    },
    viewWillResize(viewContext, surfaceView) {
      this.owner.resizeSurface(surfaceView, viewContext);
    },
    viewWillLayout(viewContext, surfaceView) {
      this.owner.layoutSurface(surfaceView, viewContext);
    },
    viewDidApplyTheme(theme, mood, timing, surfaceView) {
      this.owner.themeSurface(theme, mood, timing, surfaceView);
    }
  }) ], AtlasMapbox.prototype, "surface", void 0);
  __decorate([ component.Provider({
    extends: controller.HistoryProvider,
    type: controller.HistoryService,
    observes: true,
    service: controller.HistoryService.global(),
    serviceDidPopHistory(historyState) {
      this.owner.updateHistoryState(historyState);
    }
  }) ], AtlasMapbox.prototype, "historyProvider", void 0);
  class AtlasLayers extends controller.Controller {
    get layersIcon() {
      return AtlasLayers.layersIcon;
    }
    onPressLayersButton(layersButton) {
      const drawerView = this.drawer.view;
      if (drawerView !== null) {
        if (drawerView.slide.dismissed) {
          drawerView.present();
        } else {
          drawerView.dismiss();
        }
      }
    }
    static get layersListLayout() {
      return table.TableLayout.create([ table.ColLayout.create("icon", 0, 0, 60, false, true), table.ColLayout.create("title", 1, 0, 0, false, false, theme.Look.color) ]);
    }
    static get layersIcon() {
      const outer = graphics.VectorIcon.create(24, 24, "M12,16L19.36,10.27,21,9,12,2,3,9,4.63,10.27Z");
      const inner = graphics.VectorIcon.create(24, 24, "M11.99,18.54L4.62,12.81,3,14.07,12,21.07,21,14.07,19.37,12.8Z");
      const innerMoodModifier = theme.MoodMatrix.empty().updatedCol(theme.Feel.default, [ [ theme.Feel.translucent, 2 ] ], true);
      return graphics.EnclosedIcon.create(outer, inner).withInnerMoodModifier(innerMoodModifier);
    }
  }
  __decorate([ view.ViewRef({
    type: dom.HtmlView,
    didAttachView(toolbarView) {
      this.owner.layersButton.insertView(toolbarView);
    },
    willDetachView(toolbarView) {
      this.owner.layersButton.removeView();
    }
  }) ], AtlasLayers.prototype, "toolbar", void 0);
  __decorate([ view.ViewRef({
    type: button.IconButton,
    observes: true,
    initView(layersButton) {
      layersButton.flexShrink.setState(0, component.Affinity.Intrinsic);
      layersButton.height.setState(null, component.Affinity.Intrinsic);
      layersButton.pointerEvents.setState("auto", component.Affinity.Intrinsic);
      layersButton.iconWidth.setState(32, component.Affinity.Intrinsic);
      layersButton.iconHeight.setState(32, component.Affinity.Intrinsic);
      layersButton.pushIcon(this.owner.layersIcon);
      layersButton.constraint(layersButton.width.constrain(), "eq", layersButton.height);
    },
    buttonDidPress(layersButton) {
      this.owner.onPressLayersButton(layersButton);
    }
  }) ], AtlasLayers.prototype, "layersButton", void 0);
  __decorate([ view.ViewRef({
    type: window.DrawerView,
    didAttachView(drawerView) {
      this.owner.deck.insertView(drawerView);
    },
    willDetachView(drawerView) {
      drawerView.removeChildren();
      drawerView.dismiss();
    }
  }) ], AtlasLayers.prototype, "drawer", void 0);
  __decorate([ view.ViewRef({
    type: deck.DeckView,
    observes: true,
    initView(deckView) {
      deckView.flexGrow.setState(1, component.Affinity.Intrinsic);
    },
    viewDidResize(viewContext, deckView) {
      const barView = deckView.bar.view;
      if (barView !== null) {
        if (viewContext.viewportIdiom === "mobile") {
          barView.barHeight.setValue(60, component.Affinity.Intrinsic);
        } else {
          barView.barHeight.setValue(48, component.Affinity.Intrinsic);
        }
      }
    },
    deckDidPressCloseButton(event, deckView) {
      const drawerView = this.owner.drawer.view;
      if (drawerView !== null) {
        drawerView.dismiss();
      }
    },
    createView() {
      const deckView = deck.TitleDeckView.create();
      deckView.outAlign.setValue(1, component.Affinity.Intrinsic);
      const barView = deckView.bar.view;
      if (barView instanceof deck.TitleDeckBar) {
        barView.backgroundColor.setAffinity(component.Affinity.Extrinsic);
        const backButton = barView.backButton.view;
        if (backButton !== null) {
          backButton.closeIcon.setView(barView.createCloseIcon());
          backButton.closeIcon.insertView();
        }
      }
      const cardView = this.owner.card.createView();
      this.owner.card.setView(cardView);
      deckView.pushCard(cardView);
      return deckView;
    }
  }) ], AtlasLayers.prototype, "deck", void 0);
  __decorate([ view.ViewRef({
    type: deck.DeckCard,
    initView(cardView) {
      this.owner.layerList.insertView(cardView);
    },
    createView() {
      const cardView = deck.DeckCard.create();
      cardView.backgroundColor.setAffinity(component.Affinity.Extrinsic);
      cardView.cardTitle.setValue("Layers");
      return cardView;
    }
  }) ], AtlasLayers.prototype, "card", void 0);
  __decorate([ view.ViewRef({
    type: table.TableView,
    initView(layerListView) {
      layerListView.modifyMood(theme.Feel.default, [ [ theme.Feel.transparent, 1 ], [ theme.Feel.unselected, 1 ] ], false);
      layerListView.flexGrow(1).backgroundColor(null).rowHeight(44).layout(AtlasLayers.layersListLayout);
      const layer1 = layerListView.appendChild(table.RowView).backgroundColor(null);
      layer1.leaf.insertView().backgroundColor(null);
      layer1.getOrCreateCell("icon", table.IconCellView).iconWidth(24).iconHeight(24).graphics(this.owner.layersIcon);
      layer1.getOrCreateCell("title", table.TextCellView).content("Layer 1");
      layer1.on("click", (() => {
        const deckView = this.owner.deck.view;
        if (deckView !== null) {
          const layerCard = deck.DeckCard.create();
          layerCard.backgroundColor.setAffinity(component.Affinity.Extrinsic);
          layerCard.cardTitle.setValue("Layer 1");
          deckView.pushCard(layerCard);
        }
      }));
      const layer2 = layerListView.appendChild(table.RowView);
      layer2.leaf.insertView().backgroundColor(null);
      layer2.getOrCreateCell("icon", table.IconCellView).iconWidth(24).iconHeight(24).graphics(this.owner.layersIcon);
      layer2.getOrCreateCell("title", table.TextCellView).content("Layer 2");
      layer2.on("click", (() => {
        const deckView = this.owner.deck.view;
        if (deckView !== null) {
          const layerCard = deck.DeckCard.create();
          layerCard.backgroundColor.setAffinity(component.Affinity.Extrinsic);
          layerCard.cardTitle.setValue("Layer 2");
          deckView.pushCard(layerCard);
        }
      }));
      const layer3 = layerListView.appendChild(table.RowView);
      layer3.leaf.insertView().backgroundColor(null);
      layer3.getOrCreateCell("icon", table.IconCellView).iconWidth(24).iconHeight(24).graphics(this.owner.layersIcon);
      layer3.getOrCreateCell("title", table.TextCellView).content("Layer 3");
      layer3.on("click", (() => {
        const deckView = this.owner.deck.view;
        if (deckView !== null) {
          const layerCard = deck.DeckCard.create();
          layerCard.backgroundColor.setAffinity(component.Affinity.Extrinsic);
          layerCard.cardTitle.setValue("Layer 3");
          deckView.pushCard(layerCard);
        }
      }));
    }
  }) ], AtlasLayers.prototype, "layerList", void 0);
  __decorate([ util.Lazy ], AtlasLayers, "layersListLayout", null);
  __decorate([ util.Lazy ], AtlasLayers, "layersIcon", null);
  class AtlasController extends MirrorController {
    isFullBleed() {
      return true;
    }
  }
  __decorate([ controller.ControllerRef({
    key: true,
    type: AtlasEntityDistrict,
    binds: true,
    initController(entityDistrict) {
      this.owner.layers.insertController();
    }
  }) ], AtlasController.prototype, "root", void 0);
  __decorate([ controller.ControllerRef({
    type: AtlasLayers,
    initController(layersController) {
      const toolbarView = this.owner.toolbar.view;
      if (toolbarView !== null) {
        layersController.toolbar.setView(toolbarView);
      }
      const drawerView = this.owner.drawer.view;
      if (drawerView !== null) {
        layersController.drawer.setView(drawerView);
      }
    }
  }) ], AtlasController.prototype, "layers", void 0);
  __decorate([ controller.ControllerRef({
    type: AtlasMap
  }) ], AtlasController.prototype, "map", void 0);
  __decorate([ view.ViewRef({
    type: SurfaceView,
    didAttachView(surfaceView) {
      const mapController = this.owner.map.insertController();
      if (mapController !== null) {
        mapController.surface.setView(surfaceView);
        const mapView = mapController.base.view;
        if (mapView !== null) {
          const domainGroup = this.owner.domains.model;
          if (domainGroup !== null) {
            const entityDistrict = this.owner.root.insertController();
            if (entityDistrict !== null) {
              entityDistrict.layer.insertView(mapView);
              entityDistrict.entities.setModel(domainGroup);
            }
          }
        }
      }
    },
    willDetachView(surfaceView) {
      const mapController = this.owner.map.insertController();
      if (mapController !== null) {
        mapController.surface.setView(null);
      }
      this.owner.historyProvider.replaceHistory({
        permanent: {
          lng: void 0,
          lat: void 0,
          zoom: void 0
        }
      });
    }
  }) ], AtlasController.prototype, "surface", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView,
    didAttachView(toolbarView) {
      const layersController = this.owner.layers.controller;
      if (layersController !== null) {
        layersController.toolbar.setView(toolbarView);
      }
    },
    willDetachView(toolbarView) {
      const layersController = this.owner.layers.controller;
      if (layersController !== null) {
        layersController.toolbar.setView(null);
      }
    }
  }) ], AtlasController.prototype, "toolbar", void 0);
  __decorate([ view.ViewRef({
    type: window.DrawerView,
    didAttachView(drawerView) {
      const layersController = this.owner.layers.controller;
      if (layersController !== null) {
        layersController.drawer.setView(drawerView);
      }
    },
    willDetachView(drawerView) {
      const layersController = this.owner.layers.controller;
      if (layersController !== null) {
        layersController.drawer.setView(null);
      }
    }
  }) ], AtlasController.prototype, "drawer", void 0);
  __decorate([ model.ModelRef({
    type: DomainGroup,
    initModel(domainGroup) {
      const mapController = this.owner.map.controller;
      if (mapController !== null) {
        const mapView = mapController.base.view;
        if (mapView !== null) {
          const entityDistrict = this.owner.root.insertController();
          if (entityDistrict !== null) {
            entityDistrict.layer.insertView(mapView);
            entityDistrict.entities.setModel(domainGroup);
          }
        }
      }
    }
  }) ], AtlasController.prototype, "domains", void 0);
  class AtlasPlugin extends MirrorPlugin {
    constructor(mapType) {
      super();
      this.mapType = AtlasPlugin.getMapType(mapType);
    }
    get id() {
      return "atlas";
    }
    get title() {
      return "Atlas";
    }
    get icon() {
      return AtlasPlugin.icon;
    }
    createMap() {
      const mapType = this.mapType;
      if (mapType === "equirectangular") {
        return new AtlasWorldMap;
      } else if (mapType === "mapbox") {
        return new AtlasMapbox;
      } else {
        throw new Error("unknown map type: " + mapType);
      }
    }
    createController() {
      const atlasMap = this.createMap();
      const atlasController = new AtlasController;
      atlasController.map.setController(atlasMap);
      return atlasController;
    }
    static get icon() {
      return graphics.VectorIcon.create(24, 24, "M20.5,3L20.3,3L15,5.1L9,3L3.4,4.9C3.1,5,3,5.2,3,5.4L3,20.5C3,20.8,3.2,21,3.5,21L3.7,21L9,18.9L15,21L20.6,19.1C20.9,19,21,18.9,21,18.6L21,3.5C21,3.2,20.8,3,20.5,3ZM15,19L9,16.9L9,5L15,7.1L15,19Z");
    }
    static getMapType(mapType) {
      const historyState = controller.HistoryService.global().historyState;
      if (historyState.permanent.map !== void 0) {
        mapType = historyState.permanent.map;
      } else if (mapType === void 0) {
        mapType = "mapbox";
      }
      return mapType;
    }
  }
  __decorate([ util.Lazy ], AtlasPlugin, "icon", null);
  class LaneModel extends model.Model {
    constructor(nodeUri, laneUri, info) {
      super();
      this.ownNodeUri = nodeUri;
      this.ownLaneUri = laneUri;
      this.info = info;
    }
    setInfo(info) {
      this.info = info;
    }
    onEvent(value) {
      this.callObservers("onLaneEvent", value, this);
    }
  }
  class EventLaneModel extends LaneModel {}
  __decorate([ client.EventDownlinkFastener({
    consumed: true,
    nodeUri() {
      return this.owner.ownNodeUri;
    },
    laneUri() {
      return this.owner.ownLaneUri;
    },
    onEvent(value) {
      this.owner.onEvent(value);
    },
    initDownlink(downlink) {
      return downlink.keepSynced(true);
    }
  }) ], EventLaneModel.prototype, "data", void 0);
  class ListLaneModel extends LaneModel {}
  __decorate([ client.ListDownlinkFastener({
    consumed: true,
    nodeUri() {
      return this.owner.ownNodeUri;
    },
    laneUri() {
      return this.owner.ownLaneUri;
    },
    onEvent(value) {
      this.owner.onEvent(value);
    }
  }) ], ListLaneModel.prototype, "data", void 0);
  class MapLaneModel extends LaneModel {}
  __decorate([ client.MapDownlinkFastener({
    consumed: true,
    nodeUri() {
      return this.owner.ownNodeUri;
    },
    laneUri() {
      return this.owner.ownLaneUri;
    },
    didUpdate(key, newValue, oldValue) {
      this.owner.onEvent(structure.Attr.of("update", key).concat(newValue));
    },
    didRemove(key, oldValue) {
      this.owner.onEvent(structure.Record.of(structure.Attr.of("remove", key)));
    }
  }) ], MapLaneModel.prototype, "data", void 0);
  class ValueLaneModel extends LaneModel {}
  __decorate([ client.ValueDownlinkFastener({
    consumed: true,
    nodeUri() {
      return this.owner.ownNodeUri;
    },
    laneUri() {
      return this.owner.ownLaneUri;
    },
    didSet(value) {
      this.owner.onEvent(value);
    }
  }) ], ValueLaneModel.prototype, "data", void 0);
  class ManifestModel extends model.Model {
    constructor(metaNodeUri) {
      super();
      this.metaNodeUri = metaNodeUri;
      this.ownNodeUri = uri.Uri.path(uri.UriPath.parse(metaNodeUri.path.foot().head()));
    }
    createLaneModel(nodeUri, laneUri, info) {
      const laneType = info.get("laneType").stringValue(void 0);
      if (laneType === "list") {
        return new ListLaneModel(nodeUri, laneUri, info);
      } else if (laneType === "map") {
        return new MapLaneModel(nodeUri, laneUri, info);
      } else if (laneType === "value") {
        return new ValueLaneModel(nodeUri, laneUri, info);
      } else {
        return new EventLaneModel(nodeUri, laneUri, info);
      }
    }
    didUpdateLane(laneUri, newInfo, oldInfo) {
      const laneKey = laneUri.toString();
      let laneModel = this.getChild(laneKey);
      if (laneModel === null) {
        laneModel = this.createLaneModel(this.ownNodeUri, laneUri, newInfo);
        this.appendChild(laneModel, laneKey);
      } else {
        laneModel.setInfo(newInfo);
      }
      this.callObservers("manifestDidUpdateLane", laneUri, newInfo, oldInfo, this);
    }
    didRemoveLane(laneUri, oldInfo) {
      const laneKey = laneUri.toString();
      this.removeChild(laneKey);
      this.callObservers("manifestDidRemoveLane", laneUri, oldInfo, this);
    }
    onMount() {
      super.onMount();
      this.lanes.consume(this);
    }
    onUnmount() {
      super.onUnmount();
      this.lanes.unconsume(this);
    }
  }
  __decorate([ client.MapDownlinkFastener({
    consumed: true,
    nodeUri() {
      return this.owner.metaNodeUri;
    },
    laneUri: "lanes",
    keyForm: uri.Uri.form(),
    valueForm: structure.Form.forValue(),
    didUpdate(laneUri, newInfo, oldInfo) {
      this.owner.didUpdateLane(laneUri, newInfo, oldInfo);
    },
    didRemove(laneUri, oldInfo) {
      this.owner.didRemoveLane(laneUri, oldInfo);
    }
  }) ], ManifestModel.prototype, "lanes", void 0);
  class LaneController extends controller.Controller {
    select() {
      const leafView = this.leaf.view;
      if (leafView !== null) {
        leafView.highlight.focus();
      }
    }
    unselect() {
      const leafView = this.leaf.view;
      if (leafView !== null) {
        leafView.highlight.unfocus();
      }
    }
  }
  __decorate([ view.ViewRef({
    type: table.RowView,
    initView(rowView) {
      this.owner.leaf.insertView(rowView);
    }
  }) ], LaneController.prototype, "row", void 0);
  __decorate([ view.ViewRef({
    key: true,
    type: table.LeafView,
    observes: true,
    initView(leafView) {
      this.owner.iconCell.insertView(leafView);
      this.owner.nameCell.insertView(leafView);
      this.owner.kindCell.insertView(leafView);
    },
    viewDidPress() {
      this.owner.callObservers("controllerDidActivateLane", this.owner);
    }
  }) ], LaneController.prototype, "leaf", void 0);
  __decorate([ view.ViewRef({
    key: "icon",
    type: table.IconCellView,
    createView() {
      const iconCellView = table.IconCellView.create().iconWidth(36).graphics(graphics.PolygonIcon.create(4, Math.PI / 4));
      return iconCellView;
    }
  }) ], LaneController.prototype, "iconCell", void 0);
  __decorate([ view.ViewRef({
    key: "name",
    type: table.TextCellView,
    initView(nameCellView) {
      const laneModel = this.owner.lane.model;
      if (laneModel !== null) {
        nameCellView.content(laneModel.ownLaneUri.toString());
      }
    }
  }) ], LaneController.prototype, "nameCell", void 0);
  __decorate([ view.ViewRef({
    key: "kind",
    type: table.TextCellView,
    initView(kindCellView) {
      const laneModel = this.owner.lane.model;
      if (laneModel !== null) {
        kindCellView.content(laneModel.info.get("laneType").stringValue(""));
      }
    }
  }) ], LaneController.prototype, "kindCell", void 0);
  __decorate([ view.ViewRef({
    key: true,
    type: dom.HtmlView,
    didAttachView(detailView) {
      const laneModel = this.owner.lane.model;
      if (laneModel !== null) {
        laneModel.consume(this);
      }
    },
    willDetachView(detailView) {
      const laneModel = this.owner.lane.model;
      if (laneModel !== null) {
        laneModel.unconsume(this);
      }
    }
  }) ], LaneController.prototype, "detail", void 0);
  __decorate([ model.ModelRef({
    type: LaneModel,
    observes: true,
    initModel(laneModel) {
      const nameCellView = this.owner.nameCell.view;
      if (nameCellView !== null) {
        nameCellView.content(laneModel.ownLaneUri.toString());
      }
      const kindCellView = this.owner.kindCell.view;
      if (kindCellView !== null) {
        kindCellView.content(laneModel.info.get("laneType").stringValue(""));
      }
    },
    onLaneEvent(value, laneModel) {
      const detailView = this.owner.detail.view;
      if (detailView !== null) {
        detailView.appendChild("p").text(recon.Recon.toString(value));
      }
    }
  }) ], LaneController.prototype, "lane", void 0);
  class InventoryView extends dom.HtmlView {
    constructor(node) {
      super(node);
      this.masterLayout = new constraint.ConstraintGroup(this).constrain();
      this.mobileLayout = new constraint.ConstraintGroup(this);
      this.desktopLayout = new constraint.ConstraintGroup(this);
      this.onMasterPaneScroll = this.onMasterPaneScroll.bind(this);
      this.initInventory();
      this.initMasterLayout(this.masterLayout);
      this.initMobileLayout(this.mobileLayout);
      this.initDesktopLayout(this.desktopLayout);
    }
    initInventory() {
      this.masterBar.insertView();
      this.masterPane.insertView();
      this.detail.insertView();
    }
    initMasterLayout(layout) {
      layout.constraint(this.barHeight.constrain(), "eq", InventoryView.BarHeight);
      layout.constraint(this.masterWidth.constrain(), "eq", InventoryView.MasterWidth);
    }
    initMobileLayout(layout) {}
    initDesktopLayout(layout) {}
    onMasterPaneScroll(event) {
      const masterTreeView = this.masterTree.view;
      if (masterTreeView !== null) {
        masterTreeView.requireUpdate(view.View.NeedsScroll);
      }
    }
  }
  InventoryView.BarHeight = 44;
  InventoryView.MasterWidth = 320;
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], InventoryView.prototype, "barHeight", void 0);
  __decorate([ constraint.ConstraintProperty({
    type: Number,
    constrain: true,
    strength: "strong"
  }) ], InventoryView.prototype, "masterWidth", void 0);
  __decorate([ view.ViewRef({
    key: true,
    type: dom.HtmlView,
    binds: true,
    initView(masterBarView) {
      masterBarView.position("absolute").display("flex").justifyContent("center").alignItems("center").top(0).left(0).text("Lanes");
      this.owner.masterTree.constraint(masterBarView.width.constrain(), "eq", this.owner.masterWidth);
      this.owner.masterTree.constraint(masterBarView.height.constrain(), "eq", this.owner.barHeight);
    }
  }) ], InventoryView.prototype, "masterBar", void 0);
  __decorate([ view.ViewRef({
    key: true,
    type: dom.HtmlView,
    binds: true,
    initView(masterPaneView) {
      masterPaneView.position("absolute").bottom(0).left(0).overflowY("auto");
      this.owner.masterPane.constraint(masterPaneView.top.constrain(), "eq", this.owner.barHeight);
      this.owner.masterPane.constraint(masterPaneView.width.constrain(), "eq", this.owner.masterWidth);
      this.owner.masterTree.insertView(masterPaneView);
      masterPaneView.on("scroll", this.owner.onMasterPaneScroll);
    }
  }) ], InventoryView.prototype, "masterPane", void 0);
  __decorate([ view.ViewRef({
    key: true,
    type: table.TableView
  }) ], InventoryView.prototype, "masterTree", void 0);
  __decorate([ view.ViewRef({
    key: true,
    type: dom.HtmlView,
    binds: true,
    initView(detailView) {
      detailView.position("absolute").top(0).right(0).bottom(0).padding(10).overflowY("auto");
      this.owner.detail.constraint(detailView.left.constrain(), "eq", this.owner.masterWidth);
    }
  }) ], InventoryView.prototype, "detail", void 0);
  class InventoryController extends ActivityController {
    constructor() {
      super();
      this.selectedItem = null;
    }
    createMasterLayout() {
      return table.TableLayout.create([ table.ColLayout.create("icon", 0, 0, 64), table.ColLayout.create("name", 1, 1, 200), table.ColLayout.create("kind", 0, 0, 64) ]);
    }
    updateMasterHeader(headerView) {
      let nameColView = headerView.getChild("name");
      if (nameColView === null) {
        nameColView = table.ColView.create().label("Name");
        headerView.appendChild(nameColView, "name");
      }
      let kindColView = headerView.getChild("kind");
      if (kindColView === null) {
        kindColView = table.ColView.create().label("Kind");
        headerView.appendChild(kindColView, "kind");
      }
    }
    onInsertItem(item) {
      const masterTreeView = this.masterTree.view;
      if (masterTreeView !== null) {
        const id = item.lane.model.ownLaneUri.toString();
        const rowView = item.row.createView();
        if (rowView !== null) {
          const targetItem = item.nextSibling;
          const targetView = targetItem instanceof LaneController ? targetItem.row.view : null;
          masterTreeView.insertChild(rowView, targetView, id);
          item.row.setView(rowView);
        }
      }
    }
    onRemoveItem(item) {
      const rowView = item.row.view;
      if (rowView !== null) {
        rowView.remove();
      }
    }
    selectItem(newItem) {
      const oldItem = this.selectedItem;
      if (oldItem !== null) {
        oldItem.unselect();
        oldItem.detail.setView(null);
      }
      const detailView = this.detail.view;
      if (detailView !== null) {
        detailView.removeChildren();
        this.selectedItem = newItem;
        newItem.select();
        newItem.detail.setView(this.detail.view);
      }
    }
    onInsertLane(childEntity, targetEntity) {
      const id = childEntity.ownLaneUri.toString();
      let controllerRef = this.getFastener(id, controller.ControllerRef);
      if (controllerRef === null) {
        controllerRef = InventoryController.ItemRef.create(this);
        Object.defineProperty(controllerRef, "key", {
          value: id,
          enumerable: true,
          configurable: true
        });
        this.setFastener(id, controllerRef);
        const itemController = new LaneController;
        itemController.lane.setModel(childEntity);
        controllerRef.setController(itemController);
        const targetController = targetEntity !== null ? this.getChild(targetEntity.ownLaneUri.toString()) : null;
        this.insertChild(itemController, targetController, id);
      }
    }
    onRemoveLane(childEntity) {
      const id = childEntity.ownLaneUri.toString();
      const controllerRef = this.getFastener(id, controller.ControllerRef);
      if (controllerRef !== null) {
        controllerRef.deleteController();
        this.setFastener(id, null);
      }
    }
    static get closeIcon() {
      return graphics.VectorIcon.create(24, 24, "M19,6.4L17.6,5L12,10.6L6.4,5L5,6.4L10.6,12L5,17.6L6.4,19L12,13.4L17.6,19L19,17.6L13.4,12Z");
    }
  }
  InventoryController.ItemRef = controller.ControllerRef.define("ItemRef", {
    type: LaneController,
    observes: true,
    didAttachController(item) {
      this.owner.onInsertItem(item);
    },
    willDetachController(item) {
      this.owner.onRemoveItem(item);
    },
    controllerDidActivateLane(item) {
      this.owner.selectItem(item);
    }
  });
  __decorate([ view.ViewRef({
    type: InventoryView,
    initView(rootView) {
      rootView.position("absolute").top(0).right(0).bottom(0).left(0);
      this.owner.masterTree.setView(rootView.masterTree.view);
      this.owner.detail.setView(rootView.detail.view);
      this.owner.closeButton.insertView(rootView);
    }
  }) ], InventoryController.prototype, "root", void 0);
  __decorate([ view.ViewRef({
    type: table.TableView,
    initView(masterTreeView) {
      masterTreeView.modifyTheme(theme.Feel.default, [ [ theme.Feel.primary, 1 ], [ theme.Feel.transparent, 1 ], [ theme.Feel.unselected, 1 ] ], false);
      masterTreeView.rowHeight.setState(44);
      masterTreeView.layout.setValue(this.owner.createMasterLayout());
      const headerView = table.HeaderView.create();
      masterTreeView.header.setView(headerView);
      this.owner.updateMasterHeader(headerView);
      let child = this.owner.firstChild;
      while (child !== null) {
        if (child instanceof LaneController) {
          this.owner.onInsertItem(child);
        }
        child = child.nextSibling;
      }
    }
  }) ], InventoryController.prototype, "masterTree", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView
  }) ], InventoryController.prototype, "detail", void 0);
  __decorate([ view.ViewRef({
    type: button.IconButton,
    observes: true,
    initView(closeButton) {
      closeButton.position("absolute").top(0).left(0).width(InventoryView.BarHeight).height(InventoryView.BarHeight);
      closeButton.pushIcon(InventoryController.closeIcon);
    },
    buttonDidPress(closeButton) {
      const windowView = this.owner.window.view;
      if (windowView !== null) {
        windowView.modalProvider.dismissModals();
      }
    }
  }) ], InventoryController.prototype, "closeButton", void 0);
  __decorate([ view.ViewRef({
    type: dom.HtmlView,
    didAttachView(windowView) {
      this.owner.root.insertView(windowView);
    },
    willDetachView(windowView) {
      windowView.removeChildren();
      const manifestModel = this.owner.manifest.model;
      if (manifestModel !== null) {
        manifestModel.remove();
      }
    }
  }) ], InventoryController.prototype, "window", void 0);
  __decorate([ model.TraitRef({
    type: EntityTrait,
    didAttachTrait(entityTrait) {
      const model = entityTrait.model;
      if (model !== null) {
        this.owner.manifest.insertModel(model);
      }
    },
    willDetachTrait(entityTrait) {
      this.owner.manifest.removeModel();
    }
  }) ], InventoryController.prototype, "entity", void 0);
  __decorate([ model.ModelRef({
    type: ManifestModel,
    observes: true,
    modelDidInsertChild(child, target) {
      if (child instanceof LaneModel) {
        this.owner.onInsertLane(child, target instanceof LaneModel ? target : null);
      }
    },
    modelWillRemoveChild(child) {
      if (child instanceof LaneModel) {
        this.owner.onRemoveLane(child);
      }
    },
    createModel() {
      const entityTrait = this.owner.entity.trait;
      return new ManifestModel(entityTrait.metaNodeUri);
    }
  }) ], InventoryController.prototype, "manifest", void 0);
  __decorate([ util.Lazy ], InventoryController, "closeIcon", null);
  class InventoryPlugin extends ActivityPlugin {
    get id() {
      return "inventory";
    }
    get title() {
      return "Inventory";
    }
    createActivity(entityTrait) {
      if (entityTrait instanceof MetaNodeEntity) {
        const activity = new InventoryController;
        activity.entity.setTrait(entityTrait);
        return activity;
      }
      return null;
    }
  }
  exports.ActivityController = ActivityController;
  exports.ActivityPlugin = ActivityPlugin;
  exports.ActivityWindow = ActivityWindow;
  exports.AgentsEntity = AgentsEntity;
  exports.AtlasController = AtlasController;
  exports.AtlasEntityDistrict = AtlasEntityDistrict;
  exports.AtlasEntityLocation = AtlasEntityLocation;
  exports.AtlasLayers = AtlasLayers;
  exports.AtlasMap = AtlasMap;
  exports.AtlasMapbox = AtlasMapbox;
  exports.AtlasPlugin = AtlasPlugin;
  exports.AtlasWorldMap = AtlasWorldMap;
  exports.BeamView = BeamView;
  exports.CatalogController = CatalogController;
  exports.CatalogEntityLimb = CatalogEntityLimb;
  exports.CatalogEntityTree = CatalogEntityTree;
  exports.CatalogIndicatorCell = CatalogIndicatorCell;
  exports.CatalogPlugin = CatalogPlugin;
  exports.ChartGadgetAreaPlotController = ChartGadgetAreaPlotController;
  exports.ChartGadgetBubblePlotController = ChartGadgetBubblePlotController;
  exports.ChartGadgetController = ChartGadgetController;
  exports.ChartGadgetLinePlotController = ChartGadgetLinePlotController;
  exports.CollectionController = CollectionController;
  exports.CollectorController = CollectorController;
  exports.DiagramController = DiagramController;
  exports.DiagramPlugin = DiagramPlugin;
  exports.DistrictTrait = DistrictTrait;
  exports.DomainGroup = DomainGroup;
  exports.DomainPlugin = DomainPlugin;
  exports.DomainTrait = DomainTrait;
  exports.DownlinkDistrictTrait = DownlinkDistrictTrait;
  exports.DownlinkLocationTrait = DownlinkLocationTrait;
  exports.DownlinkNodeGroup = DownlinkNodeGroup;
  exports.EntityGroup = EntityGroup;
  exports.EntityPlugin = EntityPlugin;
  exports.EntityTrait = EntityTrait;
  exports.EventLaneModel = EventLaneModel;
  exports.FabricEntity = FabricEntity;
  exports.FabricGroup = FabricGroup;
  exports.FabricPlugin = FabricPlugin;
  exports.GadgetPlugin = GadgetPlugin;
  exports.GaugeGadgetController = GaugeGadgetController;
  exports.GaugeGadgetDialController = GaugeGadgetDialController;
  exports.Geographic = Geographic;
  exports.GeographicArea = GeographicArea;
  exports.GeographicAreaView = GeographicAreaView;
  exports.GeographicGroup = GeographicGroup;
  exports.GeographicGroupView = GeographicGroupView;
  exports.GeographicLine = GeographicLine;
  exports.GeographicLineView = GeographicLineView;
  exports.GeographicPoint = GeographicPoint;
  exports.GeographicPointView = GeographicPointView;
  exports.GeographicView = GeographicView;
  exports.IndicatedGroup = IndicatedGroup;
  exports.IndicatedTrait = IndicatedTrait;
  exports.IndicatorGroup = IndicatorGroup;
  exports.IndicatorMap = IndicatorMap;
  exports.IndicatorTrait = IndicatorTrait;
  exports.IndicatorType = IndicatorType;
  exports.InventoryController = InventoryController;
  exports.InventoryPlugin = InventoryPlugin;
  exports.InventoryView = InventoryView;
  exports.LaneController = LaneController;
  exports.LaneModel = LaneModel;
  exports.ListLaneModel = ListLaneModel;
  exports.LocationTrait = LocationTrait;
  exports.MagnifierController = MagnifierController;
  exports.MagnifierHandle = MagnifierHandle;
  exports.ManifestModel = ManifestModel;
  exports.MapLaneModel = MapLaneModel;
  exports.MetaEdgeEntity = MetaEdgeEntity;
  exports.MetaHostEntity = MetaHostEntity;
  exports.MetaHostGroup = MetaHostGroup;
  exports.MetaMeshEntity = MetaMeshEntity;
  exports.MetaMeshGroup = MetaMeshGroup;
  exports.MetaNodeEntity = MetaNodeEntity;
  exports.MetaNodeGroup = MetaNodeGroup;
  exports.MetaPartEntity = MetaPartEntity;
  exports.MetaPartGroup = MetaPartGroup;
  exports.MirrorController = MirrorController;
  exports.MirrorPlugin = MirrorPlugin;
  exports.NodeGroup = NodeGroup;
  exports.PieGadgetController = PieGadgetController;
  exports.PieGadgetSliceController = PieGadgetSliceController;
  exports.PlaneEntity = PlaneEntity;
  exports.PlaneGroup = PlaneGroup;
  exports.PortalController = PortalController;
  exports.PortalPlugin = PortalPlugin;
  exports.PrismPlugin = PrismPlugin;
  exports.PrismProvider = PrismProvider;
  exports.PrismService = PrismService;
  exports.PulseTrait = PulseTrait;
  exports.ReflectionController = ReflectionController;
  exports.ReflectorController = ReflectorController;
  exports.RefractionController = RefractionController;
  exports.RefractorController = RefractorController;
  exports.SessionModel = SessionModel;
  exports.ShellController = ShellController;
  exports.ShellView = ShellView;
  exports.Status = Status;
  exports.StatusFactor = StatusFactor;
  exports.StatusGroup = StatusGroup;
  exports.StatusTrait = StatusTrait;
  exports.StatusVector = StatusVector;
  exports.SuggestionController = SuggestionController;
  exports.SurfaceView = SurfaceView;
  exports.TableGadgetController = TableGadgetController;
  exports.TableGadgetIconCellController = TableGadgetIconCellController;
  exports.TableGadgetRowController = TableGadgetRowController;
  exports.TableGadgetTextCellController = TableGadgetTextCellController;
  exports.ValueIndicatorTrait = ValueIndicatorTrait;
  exports.ValueLaneModel = ValueLaneModel;
  exports.WidgetCard = WidgetCard;
  exports.WidgetController = WidgetController;
  exports.WidgetGroup = WidgetGroup;
  exports.WidgetTrait = WidgetTrait;
  exports.WidgetView = WidgetView;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
}));
//# sourceMappingURL=swim-platform.js.map