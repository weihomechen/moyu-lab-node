import { Application } from 'egg'

export default (app: Application) => {
  app.get('/', 'home.index')

  app.post('/api/user/login', 'user.login')
  app.post('/api/user/logout', 'user.logout')
  app.post('/api/user/register', 'user.register')
  app.post('/api/user/connect', 'user.connect')
  app.get('/api/user/info', 'user.info')
  app.get('/api/user/list', 'user.list')
  app.put('/api/user/update', 'user.update')
  app.post('/api/user/upload', 'user.upload')
}
