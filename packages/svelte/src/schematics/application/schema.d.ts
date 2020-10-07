export interface SvelteSchematicSchema {
  name: string;
  tags?: string;

  //unitTestRunner: 'jest' | 'none';
}
/*
schema.json:
"unitTestRunner": {
      "type": "string",
      "enum": ["jest", "none"],
      "description": "Test runner to use for unit tests.",
      "default": "jest"
    }
 */

export interface NormalizedSchema extends SvelteSchematicSchema {
  projectName: string;
  projectRoot: string;
  parsedTags: string[];
}
