import { SourceFile, Diagnostic } from 'typescript';

export class SourceFileCache extends Map<string, SourceFile> {
  private readonly angularDiagnostics = new Map<SourceFile, Diagnostic[]>();

  invalidate(file: string): void {
    const sourceFile = this.get(file);
    if (sourceFile) {
      this.delete(file);
      this.angularDiagnostics.delete(sourceFile);
    }
  }

  updateAngularDiagnostics(
    sourceFile: SourceFile,
    diagnostics: Diagnostic[]
  ): void {
    if (diagnostics.length > 0) {
      this.angularDiagnostics.set(sourceFile, diagnostics);
    } else {
      this.angularDiagnostics.delete(sourceFile);
    }
  }

  getAngularDiagnostics(sourceFile: SourceFile): Diagnostic[] | undefined {
    return this.angularDiagnostics.get(sourceFile);
  }
}
