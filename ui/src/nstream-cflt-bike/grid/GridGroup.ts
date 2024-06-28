import { AnyUriPath, GeoPoint, GeoTile, MapDownlinkFastener, Uri, UriPath, Value } from "@swim/runtime";
import { Model, TraitRef, VectorIcon } from "@swim/toolkit";
import { DistrictTrait, EntityTrait, GeographicPoint, LocationTrait, NodeGroup, Status, StatusTrait, StatusFactor, StatusVector } from "@swim/platform";
import { StationWidgets } from "../station/StationWidgets";

//const BIKE_ICON = VectorIcon.create(24, 24, "M12.2,4C15.9,4,18.9,4.4,19,7.2L19,7.3L19,15.8C19,16.5,18.7,17.1,18.2,17.5L18.1,17.6L18.1,19.1C18.1,19.6,17.8,19.9,17.3,20L17.2,20L16.4,20C15.9,20,15.5,19.6,15.5,19.2L15.5,19.1L15.5,18L8.5,18L8.5,19.1C8.5,19.6,8.2,19.9,7.7,20L7.6,20L6.7,20C6.3,20,5.9,19.6,5.9,19.2L5.9,19.1L5.9,17.6C5.4,17.2,5,16.6,5,15.9L5,15.8L5,7.3C5,4.4,8,4,11.8,4L12.2,4ZM8,16.5C8.8,16.5,9.5,15.8,9.5,15C9.5,14.2,8.8,13.5,8,13.5C7.2,13.5,6.5,14.2,6.5,15C6.5,15.8,7.2,16.5,8,16.5ZM16,16.5C16.8,16.5,17.5,15.8,17.5,15C17.5,14.2,16.8,13.5,16,13.5C15.2,13.5,14.5,14.2,14.5,15C14.5,15.8,15.2,16.5,16,16.5ZM17,7L7,7L7,12L17,12L17,7Z");
const BIKE_ICON = VectorIcon.create(24, 24, "M15,11L15,5L12,2L9,5L9,7L3,7L3,21L21,21L21,11L15,11ZM7,19L5,19L5,17L7,17L7,19ZM7,15L5,15L5,13L7,13L7,15ZM7,11L5,11L5,9L7,9L7,11ZM13,19L11,19L11,17L13,17L13,19ZM13,15L11,15L11,13L13,13L13,15ZM13,11L11,11L11,9L13,9L13,11ZM13,7L11,7L11,5L13,5L13,7ZM19,19L17,19L17,17L19,17L19,19ZM19,15L17,15L17,13L19,13L19,15Z");
const BIKE_ICON_SIZE = 20;

const MIN_BIKE_ZOOM = -Infinity;
const MAX_BIKE_ZOOM = Infinity;


export class GridGroup extends NodeGroup {

  constructor(geoTile: GeoTile, nodeUri: Uri, metaHostUri?: Uri) {
    super(metaHostUri);
    this.geoTile = geoTile;
    this.agentsDownlink.nodeUri(nodeUri);
  }

  // Map/Geo Tiles

  readonly geoTile: GeoTile;

  protected initSubtiles(): void {
    const geoTile = this.geoTile;

    const southWestTile = geoTile.southWestTile;
    const southWestTileId = southWestTile.x + "," + southWestTile.y + "," + southWestTile.z;
    const southWestNodeUri = Uri.path(UriPath.of("/", "map", "/", southWestTileId))
    const southWestModel = this.createNodeModel(southWestNodeUri.path, southWestNodeUri);
    this.initTileModel(southWestModel, southWestTile);
    this.appendChild(southWestModel, southWestNodeUri.toString());

    const northWestTile = geoTile.northWestTile;
    const northWestTileId = northWestTile.x + "," + northWestTile.y + "," + northWestTile.z;
    const northWestNodeUri = Uri.path(UriPath.of("/", "map", "/", northWestTileId))
    const northWestModel = this.createNodeModel(northWestNodeUri.path, northWestNodeUri);
    this.initTileModel(northWestModel, northWestTile);
    this.appendChild(northWestModel, northWestNodeUri.toString());

    const southEastTile = geoTile.southEastTile;
    const southEastTileId = southEastTile.x + "," + southEastTile.y + "," + southEastTile.z;
    const southEastNodeUri = Uri.path(UriPath.of("/", "map", "/", southEastTileId))
    const southEastModel = this.createNodeModel(southEastNodeUri.path, southEastNodeUri);
    this.initTileModel(southEastModel, southEastTile);
    this.appendChild(southEastModel, southEastNodeUri.toString());

    const northEastTile = geoTile.northEastTile;
    const northEastTileId = northEastTile.x + "," + northEastTile.y + "," + northEastTile.z;
    const northEastNodeUri = Uri.path(UriPath.of("/", "map", "/", northEastTileId))
    const northEastModel = this.createNodeModel(northEastNodeUri.path, northEastNodeUri);
    this.initTileModel(northEastModel, northEastTile);
    this.appendChild(northEastModel, northEastNodeUri.toString());
  }

  protected initTileModel(nodeModel: Model, geoTile: GeoTile): void {
    const entityTrait = nodeModel.getTrait(EntityTrait)!;

    if (geoTile.z <= 16) {
      const districtTrait = new DistrictTrait();
      districtTrait.setZoomRange(this.geoTile.z, geoTile.z < MAX_BIKE_ZOOM ? this.geoTile.z + 2 : Infinity);
      districtTrait.setBoundary(this.geoTile.bounds);
      nodeModel.setTrait("district", districtTrait);

      const subdistricts = new GridGroup(geoTile, entityTrait.uri, this.metaHostUri);
      nodeModel.setChild("subdistricts", subdistricts);
      (entityTrait.subentities.binds as any) = false;
      entityTrait.subentities.setModel(subdistricts);
      subdistricts.district.setTrait(districtTrait);
    }
  }


  // Bikes

  initBikeNodeModel(nodeModel: Model): void {
    const entityTrait = nodeModel.getTrait(EntityTrait)!;
    entityTrait.icon.setValue(BIKE_ICON);

    const locationTrait = new LocationTrait();
    locationTrait.setZoomRange(MIN_BIKE_ZOOM - 1, Infinity);
    nodeModel.setTrait("location", locationTrait);

    const statusTrait = nodeModel.getTrait(StatusTrait)!;
    statusTrait.setStatusFactor("severity", StatusFactor.create("Severity", StatusVector.of([Status.normal, 2])));

    const widgetGroup = new StationWidgets();
    entityTrait.setTrait("widgets", widgetGroup);
  }

  updateBikeNodeModel(nodeModel: Model, value: Value): void {
    const locationTrait = nodeModel.getTrait(LocationTrait)!;

    const lng = value.get("longitude").numberValue(NaN);
    const lat = value.get("latitude").numberValue(NaN);
    if (isFinite(lng) && isFinite(lat)) {
      const geographic = GeographicPoint.fromInit({
        geometry: new GeoPoint(lng, lat),
        width: BIKE_ICON_SIZE,
        height: BIKE_ICON_SIZE,
        graphics: BIKE_ICON,
      });
      locationTrait.setGeographic(geographic);
    } else {
      locationTrait.setGeographic(null);
    }

    nodeModel.getTrait(StatusTrait)!.setStatusFactor("Status", this.getStatusFactor(value));
  }

  private getStatusFactor(status: Value): StatusFactor | null {

    const availabilityRatio = status.get("value").numberValue()!;
    if (availabilityRatio <= 0.3) return StatusFactor.create("Severity", StatusVector.of([Status.alert, 2]));
    if (availabilityRatio > 0.3 && availabilityRatio < 0.8) return StatusFactor.create("Severity", StatusVector.of([Status.warning, 2]));

    return null;
  }
    
  protected getOrCreateBikeNodeModel(nodePath: AnyUriPath): Model {
    if (typeof nodePath !== "string") {
      nodePath = UriPath.fromAny(nodePath).toString();
    }
    let nodeModel = this.getChild(nodePath);
    if (nodeModel === null) {
      nodeModel = this.createNodeModel(nodePath);
      this.initBikeNodeModel(nodeModel);
      this.appendChild(nodeModel, nodePath);
    }
    return nodeModel;
  }


  // Downlinks

  @MapDownlinkFastener<GridGroup, Value, Value>({
    laneUri: "agents",
    didUpdate(key: Value, value: Value): void {
      if (this.owner.consuming && this.owner.district.trait!.consuming) {
        const nodeModel = this.owner.getOrCreateBikeNodeModel(key.stringValue(""));
        this.owner.updateBikeNodeModel(nodeModel, value);
      }
    },
    didRemove(key: Value, value: Value): void {
      if (this.owner.consuming && this.owner.district.trait!.consuming) {
        this.owner.removeNodeModel(key.stringValue(""));
      }
    },
  })
  readonly agentsDownlink!: MapDownlinkFastener<this, Value, Value>;

  @TraitRef<GridGroup, DistrictTrait>({
    type: DistrictTrait,
    observes: true,
    traitDidStartConsuming(): void {
      if (this.owner.geoTile.z % 2 === 0 && this.owner.geoTile.z > MIN_BIKE_ZOOM - 1) {
        this.owner.agentsDownlink.consume(this.owner);
      }
    },
    traitWillStopConsuming(): void {
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
  readonly district!: TraitRef<this, DistrictTrait>;

  override onStartConsuming(): void {
    super.onStartConsuming();
    this.initSubtiles();
  }

  override onStopConsuming(): void {
    super.onStopConsuming();
    this.removeChildren();
  }

}
