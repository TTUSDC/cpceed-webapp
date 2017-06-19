/**
 This module is to serve as a utility module for comparing objects that would fail if compared
 using normal situations
 */

const equalError = (info, schema, key) => `Expected ${info[key]} to equal ${schema[key]}.`;

const compareKey = (info, schema, key) => {
  if (info[key] !== schema[key]) { throw equalError(info, schema, key); }
};


const compareUserInfo = (info, schema) => {
  compareKey(info, schema, 'name');
  compareKey(info, schema, 'email');
  compareKey(info, schema, 'role');
  compareKey(info, schema, 'isApproved');
  return true;
};

const compareStudentInfo = (info, schema) => {
  compareUserInfo(info, schema);
  compareKey(info.points, schema.points, 'career');
  compareKey(info.points, schema.points, 'community');
  compareKey(info.points, schema.points, 'firstother');
  compareKey(info.points, schema.points, 'firstworkshops');
  compareKey(info.points, schema.points, 'mentor');
  compareKey(info.points, schema.points, 'other');
  compareKey(info.points, schema.points, 'outreach');
  compareKey(info.points, schema.points, 'professor');
  compareKey(info.points, schema.points, 'staff');
  compareKey(info.points, schema.points, 'misc');
};

module.exports = { compareUserInfo, compareStudentInfo };
