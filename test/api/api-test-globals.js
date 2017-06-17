const mockgoose = require('mockgoose');
const mongoose = require('mongoose');
const chai = require('chai');

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-moment'));

global.mockgoose = mockgoose;
global.mongoose = mongoose;
global.expect = chai.expect;
global.should = chai.should();
