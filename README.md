# Rental Bike Demo

A tutorial application for teaching core Swim concepts.  See a hosted version
of this app running at [https://cflt-bike-rental.nstream-demo.io](https://cflt-bike-rental.nstream-demo.io/).

## Prerequisites

* [Install JDK 17+](https://www.oracle.com/technetwork/java/javase/downloads/index.html).
  * Ensure that your `JAVA_HOME` environment variable is pointed to your Java installation location.
  * Ensure that your `PATH` includes `$JAVA_HOME`.

* [Install Node.js](https://nodejs.org/en/).
  * Confirm that [npm](https://www.npmjs.com/get-npm) was installed during the Node.js installation.

## Repository Structure

### Key files

- [build.gradle](build.gradle) — backend project configuration script
- [gradle.properties](gradle.properties) — backend project configuration variables
- [package.json](ui/package.json) — frontend project configuration
- [rollup.config.js](ui/rollup.config.js) — frontend bundle configuration script

### Key directories

- [src](src) — backend source code, and configuration resources
  - [main/java](src/main/java) — backend source code
  - [main/resources](src/main/resources) — backend configuration resources
- [ui src](ui/src) — frontend source code
- [gradle](gradle) — support files for the `gradlew` build script


## Run

### Running on Linux or MacOS

```bash
$ ./gradlew run
```

### Viewing the UI
Open a web browser to [http://localhost:9001](http://localhost:9001).


## Streaming APIs

The [swim-cli](https://www.swimos.org/backend/cli/) is the simplest way to fetch or stream data from  the web agents in this application

### "swim-cli" installation
**swim-cli** installation details available here: https://www.swimos.org/backend/cli/ 

### Application APIs
**Note:** 
* Below **swim-cli** commands for introspection are for streaming locally running application.
* There is a hosted version of this application running here: https://cflt-bike-rental.nstream-demo.io/
* To stream APIs for the hosted version, replace `warp://localhost:9001` in below commands with `warps://cflt-bike-rental.nstream-demo.io` 

1. **CONSUMER**:

```
swim-cli sync -h warp://localhost:9001 -n /consumer -l pulse
```

2. **STATION**:

(Below, station "0efa08a3-1c38-48fe-ab37-8c9b72b20126" is used as an example)

* Latest status metrics of the station 
```
swim-cli sync -h warp://localhost:9001 -n /station/0efa08a3-1c38-48fe-ab37-8c9b72b20126 -l latest
```

* Geographical coordinates of the station
```
swim-cli sync -h warp://localhost:9001 -n /station/0efa08a3-1c38-48fe-ab37-8c9b72b20126 -l geo
```

### Introspection APIs
The Swim runtime exposes its internal subsystems as a set of meta web agents.

Use the `swim:meta:host` agent to introspect a running host. Use the `pulse`
lane to stream high level stats:

```sh
swim-cli sync -h warp://localhost:9001 -n swim:meta:host -l pulse
```

The `nodes` lane enumerates all agents running on a host:

```sh
swim-cli sync -h warp://localhost:9001 -n swim:meta:host -l nodes
```

The fragment part of the `nodes` lane URI can contain a URI subpath filter:

```sh
swim-cli sync -h warp://localhost:9001 -n swim:meta:host -l nodes#/
```

#### Node Introspection

You can stream the utilization of an individual web agent:

```sh
swim-cli sync -h warp://localhost:9001 -n swim:meta:node/%2fconsumer -l pulse

swim-cli sync -h warp://localhost:9001 -n swim:meta:node/%2fstation%2f0efa08a3-1c38-48fe-ab37-8c9b72b20126 -l pulse
swim-cli sync -h warp://localhost:9001 -n swim:meta:node/%2fstation%2f1879828885264130640 -l pulse
```

And discover its lanes:

```sh
swim-cli sync -h warp://localhost:9001 -n swim:meta:node/%2fconsumer -l lanes

swim-cli sync -h warp://localhost:9001 -n swim:meta:node/%2fstation%2f0efa08a3-1c38-48fe-ab37-8c9b72b20126 -l lanes
swim-cli sync -h warp://localhost:9001 -n swim:meta:node/%2fstation%2f1879828885264130640 -l lanes
```

#### Mesh introspection

```sh
swim-cli sync -h warp://localhost:9001 -n swim:meta:edge -l meshes
```
