// This file is created by egg-ts-helper@1.25.4
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportUser from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    user: ExportUser;
  }
}
