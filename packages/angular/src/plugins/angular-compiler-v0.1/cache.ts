import { Diagnostic } from 'typescript';

export class SourceFileCache extends Map<string, string> {
  private readonly angularDiagnostics = new Map<string, Diagnostic[]>();

  invalidate(file: string): void {
    const sourceFile = this.get(file);
    if (sourceFile) {
      this.delete(file);
      this.angularDiagnostics.delete(sourceFile);
    }
  }

  updateAngularDiagnostics(
    sourceFile: string,
    diagnostics: Diagnostic[]
  ): void {
    if (diagnostics.length > 0) {
      this.angularDiagnostics.set(sourceFile, diagnostics);
    } else {
      this.angularDiagnostics.delete(sourceFile);
    }
  }

  getAngularDiagnostics(sourceFile: string): Diagnostic[] | undefined {
    return this.angularDiagnostics.get(sourceFile);
  }
}
