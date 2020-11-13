import { LOGIN_PATH, SIGNUP_PATH } from '../constants/navigation';

export function getPath(...pathArr: string[]): string {
  if (!pathArr.length) {
    return '/';
  }
  return pathArr.join('/');
}

export function checkIsLoginPage(pathname: string): boolean {
  return pathname.endsWith(LOGIN_PATH) || pathname.endsWith(SIGNUP_PATH);
}
