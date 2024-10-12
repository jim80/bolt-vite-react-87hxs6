import { createWriteStream } from 'fs';
import { createGzip } from 'zlib';
import { resolve } from 'path';
import { create } from 'tar';

const output = createWriteStream(resolve('project-archive.tar.gz'));
const gzip = createGzip();

create(
  {
    gzip: true,
    cwd: resolve('dist'),
  },
  ['./']
)
  .pipe(gzip)
  .pipe(output)
  .on('finish', () => {
    console.log('Project archive created: project-archive.tar.gz');
  });