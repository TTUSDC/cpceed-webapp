import production from './webpack/production';
import dev from './webpack/dev';
import test from './webpack/test';

const config = () => {
  switch(process.env.NODE_ENV) {
    case 'production':
      return production;
    case 'dev':
      return dev;
    case 'test':
      return test;
  }
};

export default config;
