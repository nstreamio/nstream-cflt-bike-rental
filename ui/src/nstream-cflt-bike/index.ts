export * from "./grid";
export * from "./station";

export { NstreamCfltBikePlugin } from "./NstreamCfltBikePlugin";

import { PrismService } from "@swim/platform";
import { NstreamCfltBikePlugin } from "./NstreamCfltBikePlugin"
PrismService.insertPlugin(new NstreamCfltBikePlugin());
