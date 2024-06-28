import { Uri, Value, ValueDownlinkFastener } from "@swim/runtime";
import { ColTrait, Look, Model, ModelRef, RowTrait, SelectableTrait, TableTrait, TextCellTrait, Trait, TraitRef } from "@swim/toolkit";
import { EntityTrait, WidgetGroup, WidgetTrait } from "@swim/platform";

export class StationWidgets extends WidgetGroup {

  // Status Widget

  private updateInfoTable(value: Value) {
    const tableModel = this.infoTable.model;
    value.forEach((item: Value) => {
      const key = item.key.stringValue("");
      if (key != "" && key != "latitude" && key != "longitude" && key != "id") {
        let rowModel = tableModel!.getChild(key);
        if (rowModel == null) {
          rowModel = this.createRowModel(key);
          tableModel!.appendChild(rowModel, key);
        }
        let rowValue = value.get(key).stringValue("");
        if (key == "last_updated") {
          rowValue = this.getTimeStr(rowValue);
        } 
        rowModel.getTrait("value", TextCellTrait)!
            .content(rowValue);
      }
    });
  }

  createRowModel(key: string) {
    const rowModel = new Model();
    rowModel.appendTrait(RowTrait, "row");
    rowModel.appendTrait(TextCellTrait, "key")
        .content(key);
    rowModel.appendTrait(TextCellTrait, "value");
    return rowModel;
  }

  private getTimeStr(timeStr: string): string {
    //const time = new DateTime(parseInt(timeStr)!, TimeZone.forOffset(-480));
    //const hour = time.hour < 10 ? time.hour : time.hour;
    //const minute = time.minute < 10 ? "0" + time.minute : time.minute;
    //const second = time.second < 10 ? "0" + time.second : time.second;
    //return hour + ":" + minute + ":" + second;
    return new Date(parseInt(timeStr) * 1000).toLocaleString();
  }

  @ModelRef<StationWidgets, Model>({
    key: "infoTable",
    createModel(): Model {
      const tableModel = new Model();
      tableModel.appendTrait(TableTrait, "table")
        .colSpacing(12);
      tableModel.appendTrait(ColTrait, "key")
        .layout({ key: "key", grow: 2.5, textColor: Look.mutedColor });
      tableModel.appendTrait(ColTrait, "value")
        .layout({ key: "value", grow: 3, textColor: Look.accentColor });

      return tableModel;
    },
  })
  readonly infoTable!: ModelRef<this, Model>;

  @ModelRef<StationWidgets, Model>({
    key: "latest",
    binds: true,
    observes: true,
    createModel(): Model {
      const widgetModel = new Model();
      const widgetTrait = new WidgetTrait();
      widgetTrait.title.setValue("STATUS");
      widgetTrait.subtitle.setValue("BIKE");
      widgetModel.setTrait("widget", widgetTrait);

      this.owner.infoTable.insertModel(widgetModel);

      return widgetModel;
    },
  })
  readonly statusWidget!: ModelRef<this, Model>;

  // Downlinks

  @ValueDownlinkFastener<StationWidgets, Value>({
    nodeUri(): Uri {
      return this.owner.entity.trait!.uri;
    },
    laneUri: "latest",
    didSet(newValue: Value, oldValue: Value): void {
      this.owner.updateInfoTable(newValue);
    },
  })
  readonly statusDownlink!: ValueDownlinkFastener<this, Value>;

  @TraitRef<StationWidgets, SelectableTrait>({
    type: SelectableTrait,
    binds: true,
    observes: true,
    traitDidSelect(): void {
      this.owner.statusWidget.insertModel();
      this.owner.statusDownlink.consume(this.owner);
    },
    traitWillUnselect(): void {
      this.owner.statusDownlink.unconsume(this.owner);
      this.owner.statusWidget.deleteModel();
      this.owner.infoTable.deleteModel();
     },
    detectTrait(trait: Trait): SelectableTrait | null {
      return trait instanceof SelectableTrait ? trait : null;
    },
  })
  readonly selectable!: TraitRef<this, SelectableTrait>;

  @TraitRef<StationWidgets, EntityTrait>({
    type: EntityTrait,
    binds: true,
    detectTrait(trait: Trait): EntityTrait | null {
      return trait instanceof EntityTrait ? trait : null;
    },
  })
  readonly entity!: TraitRef<this, EntityTrait>;

}
