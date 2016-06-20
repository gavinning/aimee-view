#Aimee-view
用于独立开发aimee app，不用新建测试项目在其中开发了，构建后会发布到 [UZ](https://www.npmjs.com/package/uz) 测试服务器目录下

### Install
```sh
npm i aimee-view -g
```

### Documention
```sh
$ av -h

  Usage: av [options]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -w, --watch    monitor the changes of app
    -L, --live     automatically reload your browser
```

### Example
```sh

# 编译app
$ av app

# 监听app修改，自动编译 但不会自动刷新浏览器
$ av -w app

# 监听app修改，自动编译并刷新浏览器
$ av -wL app
```


### About UZ Server
```sh
$ uz -h
$ uz server start
$ uz server restart
$ uz server stop
$ uz server clean
```