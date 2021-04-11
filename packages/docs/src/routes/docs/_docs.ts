import { processFiles } from '$lib/utils/process-files';
import path from 'path';

const __dirname = path.resolve();
const location = path.join(__dirname, 'docs');
export const docs = processFiles(location);
export const excerps = processFiles(location, false);
