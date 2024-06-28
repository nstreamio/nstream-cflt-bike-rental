this.nstream = this.nstream || {};
this.nstream.cflt = this.nstream.cflt || {};
this.nstream.cflt.bike = (function (exports, runtime, toolkit, platform) {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    class StationWidgets extends platform.WidgetGroup {
        // Status Widget
        updateInfoTable(value) {
            const tableModel = this.infoTable.model;
            value.forEach((item) => {
                const key = item.key.stringValue("");
                if (key != "" && key != "latitude" && key != "longitude" && key != "id") {
                    let rowModel = tableModel.getChild(key);
                    if (rowModel == null) {
                        rowModel = this.createRowModel(key);
                        tableModel.appendChild(rowModel, key);
                    }
                    let rowValue = value.get(key).stringValue("");
                    if (key == "last_updated") {
                        rowValue = this.getTimeStr(rowValue);
                    }
                    rowModel.getTrait("value", toolkit.TextCellTrait)
                        .content(rowValue);
                }
            });
        }
        createRowModel(key) {
            const rowModel = new toolkit.Model();
            rowModel.appendTrait(toolkit.RowTrait, "row");
            rowModel.appendTrait(toolkit.TextCellTrait, "key")
                .content(key);
            rowModel.appendTrait(toolkit.TextCellTrait, "value");
            return rowModel;
        }
        getTimeStr(timeStr) {
            //const time = new DateTime(parseInt(timeStr)!, TimeZone.forOffset(-480));
            //const hour = time.hour < 10 ? time.hour : time.hour;
            //const minute = time.minute < 10 ? "0" + time.minute : time.minute;
            //const second = time.second < 10 ? "0" + time.second : time.second;
            //return hour + ":" + minute + ":" + second;
            return new Date(parseInt(timeStr) * 1000).toLocaleString();
        }
    }
    __decorate([
        toolkit.ModelRef({
            key: "infoTable",
            createModel() {
                const tableModel = new toolkit.Model();
                tableModel.appendTrait(toolkit.TableTrait, "table")
                    .colSpacing(12);
                tableModel.appendTrait(toolkit.ColTrait, "key")
                    .layout({ key: "key", grow: 2.5, textColor: toolkit.Look.mutedColor });
                tableModel.appendTrait(toolkit.ColTrait, "value")
                    .layout({ key: "value", grow: 3, textColor: toolkit.Look.accentColor });
                return tableModel;
            },
        })
    ], StationWidgets.prototype, "infoTable", void 0);
    __decorate([
        toolkit.ModelRef({
            key: "latest",
            binds: true,
            observes: true,
            createModel() {
                const widgetModel = new toolkit.Model();
                const widgetTrait = new platform.WidgetTrait();
                widgetTrait.title.setValue("STATUS");
                widgetTrait.subtitle.setValue("BIKE");
                widgetModel.setTrait("widget", widgetTrait);
                this.owner.infoTable.insertModel(widgetModel);
                return widgetModel;
            },
        })
    ], StationWidgets.prototype, "statusWidget", void 0);
    __decorate([
        runtime.ValueDownlinkFastener({
            nodeUri() {
                return this.owner.entity.trait.uri;
            },
            laneUri: "latest",
            didSet(newValue, oldValue) {
                this.owner.updateInfoTable(newValue);
            },
        })
    ], StationWidgets.prototype, "statusDownlink", void 0);
    __decorate([
        toolkit.TraitRef({
            type: toolkit.SelectableTrait,
            binds: true,
            observes: true,
            traitDidSelect() {
                this.owner.statusWidget.insertModel();
                this.owner.statusDownlink.consume(this.owner);
            },
            traitWillUnselect() {
                this.owner.statusDownlink.unconsume(this.owner);
                this.owner.statusWidget.deleteModel();
                this.owner.infoTable.deleteModel();
            },
            detectTrait(trait) {
                return trait instanceof toolkit.SelectableTrait ? trait : null;
            },
        })
    ], StationWidgets.prototype, "selectable", void 0);
    __decorate([
        toolkit.TraitRef({
            type: platform.EntityTrait,
            binds: true,
            detectTrait(trait) {
                return trait instanceof platform.EntityTrait ? trait : null;
            },
        })
    ], StationWidgets.prototype, "entity", void 0);

    //const BIKE_ICON = VectorIcon.create(24, 24, "M12.2,4C15.9,4,18.9,4.4,19,7.2L19,7.3L19,15.8C19,16.5,18.7,17.1,18.2,17.5L18.1,17.6L18.1,19.1C18.1,19.6,17.8,19.9,17.3,20L17.2,20L16.4,20C15.9,20,15.5,19.6,15.5,19.2L15.5,19.1L15.5,18L8.5,18L8.5,19.1C8.5,19.6,8.2,19.9,7.7,20L7.6,20L6.7,20C6.3,20,5.9,19.6,5.9,19.2L5.9,19.1L5.9,17.6C5.4,17.2,5,16.6,5,15.9L5,15.8L5,7.3C5,4.4,8,4,11.8,4L12.2,4ZM8,16.5C8.8,16.5,9.5,15.8,9.5,15C9.5,14.2,8.8,13.5,8,13.5C7.2,13.5,6.5,14.2,6.5,15C6.5,15.8,7.2,16.5,8,16.5ZM16,16.5C16.8,16.5,17.5,15.8,17.5,15C17.5,14.2,16.8,13.5,16,13.5C15.2,13.5,14.5,14.2,14.5,15C14.5,15.8,15.2,16.5,16,16.5ZM17,7L7,7L7,12L17,12L17,7Z");
    const BIKE_ICON = toolkit.VectorIcon.create(24, 24, "M15,11L15,5L12,2L9,5L9,7L3,7L3,21L21,21L21,11L15,11ZM7,19L5,19L5,17L7,17L7,19ZM7,15L5,15L5,13L7,13L7,15ZM7,11L5,11L5,9L7,9L7,11ZM13,19L11,19L11,17L13,17L13,19ZM13,15L11,15L11,13L13,13L13,15ZM13,11L11,11L11,9L13,9L13,11ZM13,7L11,7L11,5L13,5L13,7ZM19,19L17,19L17,17L19,17L19,19ZM19,15L17,15L17,13L19,13L19,15Z");
    const BIKE_ICON_SIZE = 20;
    const MIN_BIKE_ZOOM = -Infinity;
    const MAX_BIKE_ZOOM = Infinity;
    class GridGroup extends platform.NodeGroup {
        constructor(geoTile, nodeUri, metaHostUri) {
            super(metaHostUri);
            this.geoTile = geoTile;
            this.agentsDownlink.nodeUri(nodeUri);
        }
        initSubtiles() {
            const geoTile = this.geoTile;
            const southWestTile = geoTile.southWestTile;
            const southWestTileId = southWestTile.x + "," + southWestTile.y + "," + southWestTile.z;
            const southWestNodeUri = runtime.Uri.path(runtime.UriPath.of("/", "map", "/", southWestTileId));
            const southWestModel = this.createNodeModel(southWestNodeUri.path, southWestNodeUri);
            this.initTileModel(southWestModel, southWestTile);
            this.appendChild(southWestModel, southWestNodeUri.toString());
            const northWestTile = geoTile.northWestTile;
            const northWestTileId = northWestTile.x + "," + northWestTile.y + "," + northWestTile.z;
            const northWestNodeUri = runtime.Uri.path(runtime.UriPath.of("/", "map", "/", northWestTileId));
            const northWestModel = this.createNodeModel(northWestNodeUri.path, northWestNodeUri);
            this.initTileModel(northWestModel, northWestTile);
            this.appendChild(northWestModel, northWestNodeUri.toString());
            const southEastTile = geoTile.southEastTile;
            const southEastTileId = southEastTile.x + "," + southEastTile.y + "," + southEastTile.z;
            const southEastNodeUri = runtime.Uri.path(runtime.UriPath.of("/", "map", "/", southEastTileId));
            const southEastModel = this.createNodeModel(southEastNodeUri.path, southEastNodeUri);
            this.initTileModel(southEastModel, southEastTile);
            this.appendChild(southEastModel, southEastNodeUri.toString());
            const northEastTile = geoTile.northEastTile;
            const northEastTileId = northEastTile.x + "," + northEastTile.y + "," + northEastTile.z;
            const northEastNodeUri = runtime.Uri.path(runtime.UriPath.of("/", "map", "/", northEastTileId));
            const northEastModel = this.createNodeModel(northEastNodeUri.path, northEastNodeUri);
            this.initTileModel(northEastModel, northEastTile);
            this.appendChild(northEastModel, northEastNodeUri.toString());
        }
        initTileModel(nodeModel, geoTile) {
            const entityTrait = nodeModel.getTrait(platform.EntityTrait);
            if (geoTile.z <= 16) {
                const districtTrait = new platform.DistrictTrait();
                districtTrait.setZoomRange(this.geoTile.z, geoTile.z < MAX_BIKE_ZOOM ? this.geoTile.z + 2 : Infinity);
                districtTrait.setBoundary(this.geoTile.bounds);
                nodeModel.setTrait("district", districtTrait);
                const subdistricts = new GridGroup(geoTile, entityTrait.uri, this.metaHostUri);
                nodeModel.setChild("subdistricts", subdistricts);
                entityTrait.subentities.binds = false;
                entityTrait.subentities.setModel(subdistricts);
                subdistricts.district.setTrait(districtTrait);
            }
        }
        // Bikes
        initBikeNodeModel(nodeModel) {
            const entityTrait = nodeModel.getTrait(platform.EntityTrait);
            entityTrait.icon.setValue(BIKE_ICON);
            const locationTrait = new platform.LocationTrait();
            locationTrait.setZoomRange(MIN_BIKE_ZOOM - 1, Infinity);
            nodeModel.setTrait("location", locationTrait);
            const statusTrait = nodeModel.getTrait(platform.StatusTrait);
            statusTrait.setStatusFactor("severity", platform.StatusFactor.create("Severity", platform.StatusVector.of([platform.Status.normal, 2])));
            const widgetGroup = new StationWidgets();
            entityTrait.setTrait("widgets", widgetGroup);
        }
        updateBikeNodeModel(nodeModel, value) {
            const locationTrait = nodeModel.getTrait(platform.LocationTrait);
            const lng = value.get("longitude").numberValue(NaN);
            const lat = value.get("latitude").numberValue(NaN);
            if (isFinite(lng) && isFinite(lat)) {
                const geographic = platform.GeographicPoint.fromInit({
                    geometry: new runtime.GeoPoint(lng, lat),
                    width: BIKE_ICON_SIZE,
                    height: BIKE_ICON_SIZE,
                    graphics: BIKE_ICON,
                });
                locationTrait.setGeographic(geographic);
            }
            else {
                locationTrait.setGeographic(null);
            }
            nodeModel.getTrait(platform.StatusTrait).setStatusFactor("Status", this.getStatusFactor(value));
        }
        getStatusFactor(status) {
            const availabilityRatio = status.get("value").numberValue();
            if (availabilityRatio <= 0.3)
                return platform.StatusFactor.create("Severity", platform.StatusVector.of([platform.Status.alert, 2]));
            if (availabilityRatio > 0.3 && availabilityRatio < 0.8)
                return platform.StatusFactor.create("Severity", platform.StatusVector.of([platform.Status.warning, 2]));
            return null;
        }
        getOrCreateBikeNodeModel(nodePath) {
            if (typeof nodePath !== "string") {
                nodePath = runtime.UriPath.fromAny(nodePath).toString();
            }
            let nodeModel = this.getChild(nodePath);
            if (nodeModel === null) {
                nodeModel = this.createNodeModel(nodePath);
                this.initBikeNodeModel(nodeModel);
                this.appendChild(nodeModel, nodePath);
            }
            return nodeModel;
        }
        onStartConsuming() {
            super.onStartConsuming();
            this.initSubtiles();
        }
        onStopConsuming() {
            super.onStopConsuming();
            this.removeChildren();
        }
    }
    __decorate([
        runtime.MapDownlinkFastener({
            laneUri: "agents",
            didUpdate(key, value) {
                if (this.owner.consuming && this.owner.district.trait.consuming) {
                    const nodeModel = this.owner.getOrCreateBikeNodeModel(key.stringValue(""));
                    this.owner.updateBikeNodeModel(nodeModel, value);
                }
            },
            didRemove(key, value) {
                if (this.owner.consuming && this.owner.district.trait.consuming) {
                    this.owner.removeNodeModel(key.stringValue(""));
                }
            },
        })
    ], GridGroup.prototype, "agentsDownlink", void 0);
    __decorate([
        toolkit.TraitRef({
            type: platform.DistrictTrait,
            observes: true,
            traitDidStartConsuming() {
                if (this.owner.geoTile.z % 2 === 0 && this.owner.geoTile.z > MIN_BIKE_ZOOM - 1) {
                    this.owner.agentsDownlink.consume(this.owner);
                }
            },
            traitWillStopConsuming() {
                this.owner.agentsDownlink.unconsume(this.owner);
                let child = this.owner.firstChild;
                while (child !== null) {
                    const next = child.nextSibling;
                    if (!(child.getChild("subdistricts") instanceof GridGroup)) {
                        child.remove();
                    }
                    child = next;
                }
            },
        })
    ], GridGroup.prototype, "district", void 0);

    const DOMAIN_ICON = toolkit.VectorIcon.create(24, 24, "M12.2,4C15.9,4,18.9,4.4,19,7.2L19,7.3L19,15.8C19,16.5,18.7,17.1,18.2,17.5L18.1,17.6L18.1,19.1C18.1,19.6,17.8,19.9,17.3,20L17.2,20L16.4,20C15.9,20,15.5,19.6,15.5,19.2L15.5,19.1L15.5,18L8.5,18L8.5,19.1C8.5,19.6,8.2,19.9,7.7,20L7.6,20L6.7,20C6.3,20,5.9,19.6,5.9,19.2L5.9,19.1L5.9,17.6C5.4,17.2,5,16.6,5,15.9L5,15.8L5,7.3C5,4.4,8,4,11.8,4L12.2,4ZM8,16.5C8.8,16.5,9.5,15.8,9.5,15C9.5,14.2,8.8,13.5,8,13.5C7.2,13.5,6.5,14.2,6.5,15C6.5,15.8,7.2,16.5,8,16.5ZM16,16.5C16.8,16.5,17.5,15.8,17.5,15C17.5,14.2,16.8,13.5,16,13.5C15.2,13.5,14.5,14.2,14.5,15C14.5,15.8,15.2,16.5,16,16.5ZM17,7L7,7L7,12L17,12L17,7Z");
    class NstreamCfltBikePlugin extends platform.EntityPlugin {
        get id() {
            return "nstream-cflt-bike";
        }
        get title() {
            return "Nstream Confluent Bike";
        }
        injectEntity(entityTrait, domainTrait) {
            const entityUri = entityTrait.uri.toString();
            if (entityUri.startsWith("warp://") || entityUri.startsWith("warps://")) {
                entityTrait.title.setValue("Nstream Confluent Bike");
                entityTrait.icon.setValue(DOMAIN_ICON);
                const districtTrait = new platform.DistrictTrait();
                districtTrait.setZoomRange(-Infinity, Infinity);
                entityTrait.setTrait("district", districtTrait);
                const rootTile = runtime.GeoTile.root();
                const rootTileId = rootTile.x + "," + rootTile.y + "," + rootTile.z;
                const rootNodeUri = runtime.Uri.path(runtime.UriPath.of("/", "map", "/", rootTileId));
                const subdistricts = new GridGroup(rootTile, rootNodeUri);
                districtTrait.setChild("subdistricts", subdistricts);
            }
        }
    }

    platform.PrismService.insertPlugin(new NstreamCfltBikePlugin());

    exports.GridGroup = GridGroup;
    exports.NstreamCfltBikePlugin = NstreamCfltBikePlugin;
    exports.StationWidgets = StationWidgets;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, swim, swim, swim);
//# sourceMappingURL=nstream-cflt-bike.js.map
