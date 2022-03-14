import { closeSync, openSync, utimesSync } from 'fs';

export type FileRecord = {
  internalFiles: string[];
};
type FileRecords = Record<string, FileRecord>;
type FileBelongsTo = Record<string, string>;
export class FileSystem {
  private fileRecords: FileRecords = {};
  private belongsTo: FileBelongsTo = {};

  addFile(file: string, record: FileRecord) {
    this.fileRecords[file] = record;
    for (const internal of record.internalFiles) {
      this.belongsTo[internal] = file;
    }
    return this;
  }

  findFileByInternalFile(file: string) {
    return this.belongsTo[file];
  }

  touchFile(file: string) {
    try {
      const date = new Date();
      utimesSync(file, date, date);
    } catch (err) {
      closeSync(openSync(file, 'w'));
    }
  }
}
