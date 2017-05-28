const testToken1 = {
  token: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsZXhhbmRlckBjbGluZXMuY29tIiwicm9sZSI6IlN0dWRlbnQiLCJpc0FwcHJvdmVkIjpmYWxzZSwiaWQiOiI1OTI2MDA1Y2E2OGU5ZjE5Mjg5ZTNmYTYiLCJpYXQiOjE0OTU4MTcwOTJ9.ZaTmE2doX_NBnRDD55-eS975bGWycqzw8TP0BMAQBc19QTRpmPzeyhZefagnfDW7Mr1BMcEFzIXJ6V6RSDkhXA',
  email: 'alexander@clines.com',
  role: 'Student',
  isApproved: false,
  id: '5926005ca68e9f19289e3fa6',
};

const testTokenStudent000 = {
  token: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0dWRlbnQwMDBAdHR1LmVkdSIsInJvbGUiOiJzdHVkZW50IiwiaXNBcHByb3ZlZCI6ZmFsc2UsImlkIjoiNTkyYTMxZGJlOTZjN2YwN2I4MDE3Y2Q4IiwiaWF0IjoxNDk1OTM4MTA1fQ.Y23ZiW5m18Krc3ZLyPbxyGeBwvPsfiTuHBNa1_CQkaDFIy4SgcoytbrPEWZRLomjND0wtxPHAyBjqLcxjGruFw',
  email: 'student000@ttu.edu',
  role: 'student',
  isApproved: false,
  id: '592a31dbe96c7f07b8017cd8',
};

const testTokenAdmin000 = {
  token: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluMDAwQHR0dS5lZHUiLCJyb2xlIjoiYWRtaW4iLCJpc0FwcHJvdmVkIjpmYWxzZSwiaWQiOiI1OTJhNDZlODM0NzVmMjA3ZmM4OTM5YzUiLCJpYXQiOjE0OTU5NDI5MDd9.unRKBlK2_69GFoleUXrZiQmlJhIH-VRMTo3IpWg_3UMWgm3qu_aW5vkh19HD1KiH9iMRox3QRiyls58798FVYg',
  email: 'admin000@ttu.edu',
  role: 'admin',
  isApproved: false,
  id: '592a46e83475f207fc8939c5',
};

module.exports = {
  testToken1,
  testTokenStudent000,
  testTokenAdmin000,
};
