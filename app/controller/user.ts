const crypto = require('crypto')
const sendToWormhole = require('stream-wormhole')
import { Controller } from 'egg'

import {
  subObj,
  getUniqueFileName,
  passwordSecret,
  isEmail,
} from '../utils'
import { Response, SQLResult } from '../utils/typing'

export default class UserController extends Controller {
  public async login() {
    const { ctx, service } = this
    const response: Response = {
      success: false,
      msg: '',
      code: '',
      data: null,
    }
    let result: SQLResult = { success: false }
    const { name, password: unEncrypted } = ctx.request.body

    const password = crypto
      .createHmac('sha256', passwordSecret)
      .update(unEncrypted)
      .digest('hex')

    if (isEmail(name)) {
      result = await service.user.login({ email: name, password })
      if (!result.success) {
        result = await service.user.login({ name, password })
      }
    } else {
      result = await service.user.login({ name, password })
    }

    const {
      user,
      success,
    } = result

    if (success) {
      response.success = true
      response.msg = '登录成功'
      response.data = { user }
      ctx.session.user = user
    } else {
      response.success = false
      response.msg = '用户不存在或密码错误'
      response.data = null
    }

    ctx.body = response
    ctx.status = 200
  }

  async connect() {
    const {
      ctx,
    } = this

    this.app.redis.set(ctx.session.user.uid, ctx.request.body.socketId)

    ctx.body = {
      success: true,
      msg: '',
      code: '',
      data: null,
    }
    ctx.status = 200
  }

  logout() {
    const { ctx } = this
    ctx.session = null
    ctx.body = {
      success: true,
      msg: '',
      code: '',
      data: null,
    }
    ctx.status = 200
  }

  info() {
    this.ctx.body = {
      success: true,
      msg: '',
      code: '',
      data: this.ctx.session.user,
    }
    this.ctx.status = 200
  }

  // 获取用户列表
  async list() {
    const { ctx, service } = this
    const data = await service.user.list()

    ctx.body = {
      success: true,
      msg: '',
      code: '',
      data,
    }
    ctx.status = 200
  }

  async register() {
    const { ctx, service } = this
    const { password: unEncrypted } = ctx.request.body

    const password = crypto
      .createHmac('sha256', passwordSecret)
      .update(unEncrypted)
      .digest('hex')

    ctx.request.body.password = password
    const result = await service.user.register(ctx.request.body)

    ctx.body = result
    ctx.status = 200
  }

  async update() {
    const { ctx, service } = this

    const response = {
      success: false,
      msg: '',
      code: '',
      data: null,
    }

    let params: any = subObj(['uid', 'name', 'oldPassword', 'password', 'email'], ctx.request.body)

    const { password: unEncrypted, oldPassword: unEncryptedOld } = params

    const password = unEncrypted && crypto
      .createHmac('sha256', passwordSecret)
      .update(unEncrypted)
      .digest('hex')

    const oldPassword = unEncryptedOld && crypto
      .createHmac('sha256', passwordSecret)
      .update(unEncryptedOld)
      .digest('hex')

    if (password) {
      params = {
        ...params,
        password,
        oldPassword,
      }
    }

    const { success, user, errorMsg } = await service.user.update(params)

    if (success) {
      response.success = true
      response.msg = '修改成功'
      ctx.session.user = user
    } else {
      response.success = false
      response.msg = errorMsg || '修改失败，请稍后再试'
    }

    ctx.body = response
    ctx.status = 200
  }

  async upload() {
    const { ctx, service } = this
    const stream = await ctx.getFileStream()
    const name = getUniqueFileName(stream.filename)
    let result: any
    const failRes: Response = {
      success: false,
      msg: '上传失败',
      code: 'upload failed',
      data: null,
    }

    try {
      result = await ctx.oss.put(name, stream)
    } catch (err) {
      await sendToWormhole(stream)

      throw err
    }

    if (result) {
      const { uid, type } = stream.fields
      const { url } = result
      const typeMap = ['avatar', 'cover', 'moneyCode']
      const params = {
        uid,
        [typeMap[type]]: url,
      }
      const { success, user } = await service.user.update(params)
      if (success) {
        ctx.session.user = user
        ctx.body = {
          success: true,
          msg: '上传成功',
          code: 'upload success',
          data: user,
        }
      } else {
        ctx.body = failRes
      }
    } else {
      ctx.body = failRes
    }
  }
}
