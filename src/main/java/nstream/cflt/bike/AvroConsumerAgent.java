package nstream.cflt.bike;

import nstream.adapter.common.schedule.DeferrableException;
import nstream.adapter.confluent.ConfluentIngestingPatch;
import org.apache.avro.generic.GenericRecord;
import swim.structure.Value;

public class AvroConsumerAgent extends ConfluentIngestingPatch<String, GenericRecord> {

  @Override
  protected void ingestConsumerRecordStructure(Value responseStructure) throws DeferrableException {
    final Value value = responseStructure.get("value");
    final String stationIdWrapper = value.get("id").stringValue(null);
    if (stationIdWrapper != null) {
      final String stationId = stationIdWrapper.substring(stationIdWrapper.indexOf("(") + 1,
          stationIdWrapper.indexOf(","));
      command("/station/" + stationId, "addEvent", value);
    }
  }

}
