const mockgoose = require('mockgoose');
const mongoose = require('mongoose');
const chai = require('chai');
const chaiMoment = require('chai-moment');
const userManager = require('../../../api/users/user-manager');
const userModels = require('../../../api/users/user-models');
const testUsers = require('../../core/users');

const expect = chai.expect;
const should = chai.should();
const Admin = userModels.Admin;
const Student = userModels.Student;

chai.use(chaiMoment);
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

  describe('#createStudent', () => {
    it('should pass a uid to the callback', (done) => {
      const student = testUsers.student000;

      userManager.createUser(student, (createErr, uid) => {
        expect(createErr).to.be.null;
        expect(uid).to.be.a('string');

        Student.findById(uid, (studentErr, foundStudent) => {
          expect(studentErr).to.be.null;
          expect(foundStudent.isApproved).to.be.false;
          expect(foundStudent.email).to.be.equal(student.email);
          expect(foundStudent.name).to.be.equal(student.name);
          expect(foundStudent.role).to.be.equal(student.role);
          expect(foundStudent.studentId).to.be.equal(student.studentId);
          foundStudent.comparePassword(student.password, (passwordErr, isMatch) => {
            expect(isMatch).to.be.true;
          });
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

  describe('#createAdmin', () => {
    it('should pass a uid to the callback', (done) => {
      const admin = testUsers.admin000;

      userManager.createUser(admin, (createErr, uid) => {
        expect(createErr).to.be.null;
        expect(uid).to.be.a('string');

        Admin.findById(uid, (adminErr, foundAdmin) => {
          expect(adminErr).to.be.null;
          expect(foundAdmin.isApproved).to.be.false;
          expect(foundAdmin.name).to.be.equal(admin.name);
          expect(foundAdmin.email).to.be.equal(admin.email);
          expect(foundAdmin.role).to.be.equal(admin.role);
          foundAdmin.comparePassword(admin.password, (passwordErr, isMatch) => {
            expect(isMatch).to.be.true;
          });
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
