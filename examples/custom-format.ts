import { Spinner } from 'nspin-bun';

const spinner = new Spinner({
  frames: ['◐', '◓', '◑', '◒'],
  interval: 120,
  format: ['cyan', 'underline'],
});

spinner.start('Loading styled spinner...');

setTimeout(() => {
  spinner.stop('🎨 Styled complete!');
}, 4000);
