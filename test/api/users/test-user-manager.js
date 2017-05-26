const mockgoose = require('mockgoose');
const mongoose = require('mongoose');
const chai = require('chai');
const userManager = require('../../../api/users/user-manager');
const userModels = require('../../../api/users/user-models');
const testUsers = require('../../core/users');

const expect = chai.expect;
const should = chai.should();
const Admin = userModels.Admin;
const Student = userModels.Student;

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-moment'));

mockgoose(mongoose);

describe('userManager', () => {
  // Connect to the database.
  before((done) => { mongoose.connect('', done); });

  // Clear the database before each test case.
  beforeEach((done) => {
    mockgoose.reset();
    done();
  });

  after((done) => { mongoose.unmock(done); });

  describe('#createUser', () => {
    describe('role: student', () => {
      it('should pass a uid to the callback', (done) => {
        const student = testUsers.student000;

        userManager.createUser(student, (createErr, uid) => {
          expect(createErr).to.be.null;
          expect(uid).to.be.a('string');

          Student.findById(uid, (studentErr, foundStudent) => {
            expect(studentErr).to.be.null;
            foundStudent.comparePassword(student.password, (passwordErr, isMatch) => {
              expect(isMatch).to.be.true;
            });
            student.password = foundStudent.password; // foundStudent has a hashed password
            expect(foundStudent).to.shallowDeepEqual(student);
            done();
          });
        });
      });

      it('should pass an error to the callback', (done) => {
        const student = {
          email: 'test@test.com',
          nameame: 'Test',
          role: 'student',
          studentId: '',
        };

        userManager.createUser(student, (createErr, uid) => {
          should.exist(createErr);
          should.not.exist(uid);
          done();
        });
      });
    });

    describe('role: admin', () => {
      it('should pass a uid to the callback', (done) => {
        const admin = testUsers.admin000;

        userManager.createUser(admin, (createErr, uid) => {
          expect(createErr).to.be.null;
          expect(uid).to.be.a('string');

          Admin.findById(uid, (adminErr, foundAdmin) => {
            expect(adminErr).to.be.null;
            foundAdmin.comparePassword(admin.password, (passwordErr, isMatch) => {
              expect(isMatch).to.be.true;
            });
            admin.password = foundAdmin.password; // foundAdmin has a hashed password
            expect(foundAdmin).to.shallowDeepEqual(admin);
            done();
          });
        });
      });

      it('should pass an error to the callback', (done) => {
        const admin = {
          email: 'test@test.com',
          name: 'Test',
          role: 'student',
          studentId: '',
        };

        userManager.createUser(admin, (createErr, uid) => {
          should.exist(createErr);
          should.not.exist(uid);
          done();
        });
      });
    });
  });

  describe('#getUserById', () => {
    it('should return the created student', (done) => {
      const student = testUsers.student000;
      userManager.createUser(student, (createErr, uid) => {
        expect(createErr).to.be.null;
        expect(uid).to.be.a('string');
        userManager.getUserById(uid, {}, (getErr, foundStudent) => {
          expect(getErr).to.be.null;
          expect(foundStudent).to.not.be.null;
          foundStudent.comparePassword(student.password, (passwordErr, isMatch) => {
            expect(isMatch).to.be.true;
          });
          student.password = foundStudent.password; // foundStudent has a hashed password
          expect(foundStudent).to.shallowDeepEqual(student);
          done();
        });
      });
    });
  });
});
