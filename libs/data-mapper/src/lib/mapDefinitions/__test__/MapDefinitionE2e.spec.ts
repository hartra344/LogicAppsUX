import type { MapDefinitionEntry, SchemaExtended } from '../../models';
import { functionMock } from '../../models';
import type { ConnectionDictionary } from '../../models/Connection';
import { convertSchemaToSchemaExtended, flattenSchemaIntoSortArray } from '../../utils/Schema.Utils';
import { convertFromMapDefinition } from '../MapDefinitionDeserializer';
import { convertToMapDefinition } from '../MapDefinitionSerializer';
import { comprehensiveMapDefinition, transcriptJsonMapDefinitionString } from '__mocks__/mapDefinitions';
import { comprehensiveSourceSchema, comprehensiveTargetSchema, sourceMockJsonSchema, targetMockJsonSchema } from '__mocks__/schemas';
import * as yaml from 'js-yaml';

describe('mapDefinitions/MapDefinitionE2e', () => {
  describe('XML to XML', () => {
    const mockSourceSchema: SchemaExtended = convertSchemaToSchemaExtended(comprehensiveSourceSchema);
    const mockTargetSchema: SchemaExtended = convertSchemaToSchemaExtended(comprehensiveTargetSchema);
    const mockTranscriptMapDefinition: MapDefinitionEntry = yaml.load(comprehensiveMapDefinition) as MapDefinitionEntry;

    it('Deserializing then re-serializing produces the same map definition', () => {
      const deserializedConnectionDictionary: ConnectionDictionary = convertFromMapDefinition(
        mockTranscriptMapDefinition,
        mockSourceSchema,
        mockTargetSchema,
        functionMock
      );

      const targetSortArray = flattenSchemaIntoSortArray(mockTargetSchema.schemaTreeRoot);

      // Compare YAML as parsed objects to disregard any comments
      const reserializedMapDefinitionString: string = convertToMapDefinition(
        deserializedConnectionDictionary,
        mockSourceSchema,
        mockTargetSchema,
        targetSortArray
      );

      const reserializedMapDefinition: MapDefinitionEntry = yaml.load(reserializedMapDefinitionString) as MapDefinitionEntry;

      // NOTE: Will be undefined if string === '', which happens when there's an issue w/ serialization
      expect(reserializedMapDefinition).toBeDefined();

      // NOTE: toEqual will log the specific properties/values that differ
      expect(reserializedMapDefinition).toEqual(mockTranscriptMapDefinition);
    });
  });

  describe('JSON to JSON', () => {
    const mockSourceSchema: SchemaExtended = convertSchemaToSchemaExtended(sourceMockJsonSchema);
    const mockTargetSchema: SchemaExtended = convertSchemaToSchemaExtended(targetMockJsonSchema);
    const mockTranscriptMapDefinition: MapDefinitionEntry = yaml.load(transcriptJsonMapDefinitionString) as MapDefinitionEntry;

    it.skip('Deserializing then re-serializing produces the same map definition', () => {
      const deserializedConnectionDictionary: ConnectionDictionary = convertFromMapDefinition(
        mockTranscriptMapDefinition,
        mockSourceSchema,
        mockTargetSchema,
        functionMock
      );

      const targetSortArray = flattenSchemaIntoSortArray(mockTargetSchema.schemaTreeRoot);

      // Compare YAML as parsed objects to disregard any comments
      const reserializedMapDefinitionString: string = convertToMapDefinition(
        deserializedConnectionDictionary,
        mockSourceSchema,
        mockTargetSchema,
        targetSortArray
      );

      const reserializedMapDefinition: MapDefinitionEntry = yaml.load(reserializedMapDefinitionString) as MapDefinitionEntry;

      // NOTE: Will be undefined if string === '', which happens when there's an issue w/ serialization
      expect(reserializedMapDefinition).toBeDefined();

      // NOTE: toEqual will log the specific properties/values that differ
      expect(reserializedMapDefinition).toEqual(mockTranscriptMapDefinition);
    });
  });
});
