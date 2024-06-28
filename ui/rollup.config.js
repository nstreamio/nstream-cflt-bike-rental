import nodeResolve from "@rollup/plugin-node-resolve";
import sourcemaps from "rollup-plugin-sourcemaps";

const nstream_cflt_bike = {
  input: "./lib/nstream-cflt-bike/index.js",
  output: {
    file: "./dist/nstream-cflt-bike.js",
    name: "nstream.cflt.bike",
    format: "iife",
    globals: {
      "@swim/runtime": "swim",
      "@swim/toolkit": "swim",
      "@swim/platform": "swim",
    },
    sourcemap: true,
    interop: "esModule",
  },
  external: [
    "@swim/runtime",
    "@swim/toolkit",
    "@swim/platform",
  ],
  plugins: [
    nodeResolve(),
    sourcemaps(),
  ],
};

export default [nstream_cflt_bike];
