import { Spinner } from 'nspin-bun';

const spinner = new Spinner();

spinner.start('Processing...');

setTimeout(() => {
  spinner.stop('✅ Done!');
}, 3000);
