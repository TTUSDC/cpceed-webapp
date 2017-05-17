import { login } from 'server/user-auth';
import init from 'server/server';
import defaultUser from './users';

export default function connectWithAuth() {
  init();
  return login(defaultUser.email, defaultUser.password);
}
