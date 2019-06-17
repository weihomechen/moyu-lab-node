import { Service } from 'egg'
const modal = 'user'
/**
 * User Service
 */
export default class User extends Service {
  /**
   * 用户登录
   * @param params
   */
  async login(params) {
    const { app } = this
    const user = await app.mysql.get(modal, params)
    const success = !!user

    return { success, user }
  }

  /**
   * 用户注册
   * @param params
   */
  async register(params) {
    const { app } = this
    const { name = params.nickname, password } = params
    const user = await app.mysql.get(modal, { name })

    if (user) {
      return {
        success: false,
        msg: '该花名已经被注册',
        code: 'name is duplicate',
        data: null,
      }
    }

    await this.app.mysql.insert(modal, {
      name,
      password,
      role: 1,
    })

    return {
      success: true,
      msg: '',
      code: '',
      data: null,
    }
  }

  /**
   * 更新用户信息
   * @param request
   */
  async update(request: any) {
    const { app } = this
    let success = false
    const { uid, oldPassword, ...updateFields } = request
    let user = await app.mysql.get(modal, { uid })

    // 如果是修改密码，先判断旧密码正不正确
    if (oldPassword && oldPassword !== user.password) {
      return { success, errorMsg: '请输入正确的旧密码' }
    }

    const { affectedRows } = await this.app.mysql.update(modal, request, {
      where: { uid },
      columns: Object.keys(updateFields).map(field => field),
    })

    success = affectedRows === 1

    if (success) {
      user = await app.mysql.get(modal, { uid })
    }

    return { success, user }
  }

  /**
   * 创建用户
   * @param request
   */
  async create(request) {
    const result = await this.app.mysql.insert(modal, request)

    return result
  }

  /**
   * 获取用户列表
   */
  async list() {
    const record = await this.app.mysql.select(modal)

    return record
  }
}
