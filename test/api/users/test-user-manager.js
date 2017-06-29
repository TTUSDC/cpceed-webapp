const userManager = require('../../../api/users/user-manager');
const userModels = require('../../../common/models/users');
const testUsers = require('../../core/users');
const compareHelper = require('../core/helper-compare');


const Admin = userModels.Admin;
const Student = userModels.Student;

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
              compareHelper.compareStudentInfo(student, foundStudent);
              done();
            });
          });
        });
      });

      it('should pass an error to the callback', (done) => {
        const student = {
          email: 'test@test.com',
          name: 'Test',
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
              compareHelper.compareUserInfo(admin, foundAdmin);
              done();
            });
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
        student.uid = uid;
        userManager.getUserById(uid, {}, (getErr, foundStudent) => {
          expect(getErr).to.be.null;
          compareHelper.compareStudentInfo(student, foundStudent);
          done();
        });
      });
    });
  });

  describe('#modifyUser', () => {
    it('should update the student', (done) => {
      const originalStudent = testUsers.student000;
      const modifiedStudent = JSON.parse(JSON.stringify(originalStudent));
      modifiedStudent.name = `${originalStudent.name}_edit`;
      modifiedStudent.email = `${originalStudent.email}_edit`;
      userManager.createUser(originalStudent, (createErr, uid) => {
        expect(createErr).to.be.null;
        expect(uid).to.be.a('string');

        // Make sure it returned the updated student
        userManager.modifyUser(uid, modifiedStudent, { auth: { role: 'student' } },
          (modifyErr, realUpdatedUser) => {
            expect(modifyErr).to.be.null;
            expect(realUpdatedUser).to.not.be.null;
            compareHelper.compareStudentInfo(modifiedStudent, realUpdatedUser);


            // Make sure it saved the updated student
            Student.findById(uid, (findErr, foundStudent) => {
              expect(findErr).to.be.null;
              expect(foundStudent).to.not.be.null;
              compareHelper.compareStudentInfo(modifiedStudent, foundStudent);
              done();
            });
          });
      });
    });
  });
});
