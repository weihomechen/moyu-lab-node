# moyu-lab-node

本项目是墨鱼仔触手实验室`moyu-lab`的`node`端

## 快速开始

### 开发

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

本项目使用`ts`，开发阶段不需要编译`ts`，如果编译过`ts(npm run tsc)`，再`npm run dev`前，请先`npm run clean`

### 测试

```bash
npm run test
```

### 部署

#### 部署工具deploy-tool

提供配套部署工具[deploy-tool](https://github.com/weihomechen/deploy-tool)进行部署

```bash
deploy app moyu-lab-node
```

#### 手动部署

1. 整体打包后上传到服务器
2. cd到本目录，npm run stop(第一次不需要)
3. npm run prod

```bash
npm run prod
```

### 其他命令

- Use `npm run lint` to check code style
- Use `npm run clean` to clean compiled js at development mode once


## 目录结构

```
.
├── README.md
├── app               
    ├── controller  // 响应路由请求
    ├── public      // 放置静态资源
    ├── router.ts   // 路由表
    ├── schedule    // 定时任务
    ├── service     // 业务逻辑层
    ├── middleware  // 用于编写中间件
    └── utils       // 通用工具
├── config          // 配置文件
├── coverage        // 覆盖率测试文件
├── logs            // 日志
├── node_modules
├── package-lock.json
├── package.json
├── run
├── test            // 单元测试文件
├── tsconfig.json   // ts配置文件
├── tslint.json
└── typings
└── db              // 数据库文件
```

## 数据库

该项目使用了mysql，运行前请先装好mysql

### 安装包安装mysql

[mysql下载地址](https://dev.mysql.com/downloads/mysql/)，dmg安装，一路向下，记得保存最后弹出框中的密码（它是你mysql root账号的密码）。
此时只是安装成功，但还需要额外的配置：

* 进入系统偏好设置
* 点击mysql
* 开启mysql服务

此时我们在命令行输入mysql -uroot -p命令会提示没有commod not found，我们还需要将mysql加入系统环境变量。

```bash
# (1).进入/usr/local/mysql/bin,查看此目录下是否有mysql。
# (2).执行vi ~/.bash_profile, 在该文件中添加mysql/bin的目录，即在最后一行添加下面这句话：
# PATH=$PATH:/usr/local/mysql/bin
# 添加完成后，按esc，然后输入wq保存。
# 最后在命令行输入
source ~/.bash_profile
```

如果使用第三方bash工具需要编辑相应的配置文件，比如`zsh`，需要编辑 `.zshrc` 文件:

```bash
vim ~/.zshrc
# 粘贴以下内容
alias mysql='/usr/local/mysql/bin/mysql'
alias mysqladmin='/usr/local/mysql/bin/mysqladmin'
```

现在就可以通过mysql -uroot -p登录mysql了，会让你输入密码。

### 命令行安装mysql

如果没有安装homebrew先安装homebrew：

```sh
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

使用homebrew安装mysql：

```sh
brew install mysql
```

linux使用yum:

```sh
yum install mysql
```

### 初始化数据库

成功安装mysql后，在命令行执行下面这个命令自动初始化：

```sh
# cd到moyu-lab-node项目目录
mysql -u[username] -p[password] < ./db/db.sql
```

如果是累计更新，需要执行到最新的sql文件（新旧按文件名中的日期排）

如果是第一次初始化，可以执行总的sql文件：

```sh
mysql -u[username] -p[password] < ./db/db-full.sql
```
