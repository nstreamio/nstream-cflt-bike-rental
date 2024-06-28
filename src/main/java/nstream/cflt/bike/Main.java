package nstream.cflt.bike;

import java.io.IOException;
import nstream.adapter.common.provision.ProvisionLoader;
import nstream.adapter.common.relay.LabeledLog;
import swim.kernel.Kernel;
import swim.kernel.KernelLoader;
import swim.server.ServerLoader;
import swim.structure.Value;

public class Main {

  private static Value kernelConfig() {
    final ClassLoader classLoader = Main.class.getClassLoader();
    try {
      Value kernelConfig = KernelLoader.loadConfig(classLoader);
      if (kernelConfig == null) {
        kernelConfig = KernelLoader.loadConfigResource(classLoader, "server.recon");
      }
      if (kernelConfig == null) {
        kernelConfig = Value.absent();
      }
      return kernelConfig;
    } catch (IOException e) {
      throw new RuntimeException("Failed to load kernel config", e);
    }
  }

  public static void main(String[] args) {
    // Load resources that may be required by the Swim plane, as configured by
    // the server configuration file
    // ...and from the server configuration file, if present
    ProvisionLoader.loadProvisions(LabeledLog.forUniform("Main#main", System.out::println), kernelConfig());
    ProvisionLoader.debugProvisionNames();

    // Load the SwimOS kernel, loading its configuration from the
    // `server.recon` Java resource.
    final Kernel kernel = ServerLoader.loadServer();

    // Boot the SwimOS kernel.
    kernel.start();
    System.out.println("Running AppPlane ...");

    // Park the main thread while the application concurrently runs.
    kernel.run();
  }

}
