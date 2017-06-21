require('app-module-path').addPath(`${__dirname}/../../`);
const mockgoose = require('mockgoose');
const mongoose = require('mongoose');
const chai = require('chai');
const sinon = require('sinon');
const dotenv = require('dotenv');

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-moment'));
chai.use(require('sinon-chai'));

dotenv.load({ path: process.env.ENV_PATH || '.env.test' });

global.mockgoose = mockgoose;
global.mongoose = mongoose;
global.sinon = sinon;
global.expect = chai.expect;
global.should = chai.should();
