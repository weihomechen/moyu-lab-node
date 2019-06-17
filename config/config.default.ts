const fs = require('fs')
const path = require('path')
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'
import { ossConfig } from './config.private'

const localMysqlConf = fs.existsSync(path.join(__dirname, './mysql.local.js')) ? require('./mysql.local') : {}

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>

  const middleware = []

  const security = {
    ignore: '/api/',
    domainWhiteList: ['http://127.0.0.1:8000'],
    methodnoallow: { enable: false },
  }

  const cors = {
    allowMethods: 'GET,HEAD,PUT,OPTIONS,POST,DELETE,PATCH',
  }

  const multipart = {
    fileExtensions: ['.xls', '.doc', '.ppt', '.docx', '.xlsx', '.pptx'],
  }

  const oss = {
    client: {
      bucket: 'moyu-lab',
      endpoint: 'oss-cn-hangzhou.aliyuncs.com',
      timeout: '60s',
      secure: true,
      ...ossConfig,
    },
  }

  const cluster = {
    listen: {
      port: 7001,
    },
  }

  const redis = {
    client: {
      host: '127.0.0.1',
      port: '6379',
      password: '',
      db: '5',
    },
  }

  const sessionRedis = {
    name: '',
  }

  const session = {
    key: 'MOYU_LAB_SESS',
    maxAge: 24 * 3600 * 1000, // 1天
    httpOnly: true,
    encrypt: true,
  }

  const mysql = {
    // 单数据库信息配置
    client: Object.assign({
      // host
      host: '127.0.0.1',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: '12345678',
      // 数据库名
      database: 'moyu_lab',
    }, localMysqlConf),
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  }

  return {
    ...config,
    keys: appInfo.name + '_1550741520691_2633',
    multipart,
    security,
    cors,
    middleware,
    oss,
    cluster,
    redis,
    sessionRedis,
    session,
    mysql,
  }
}
