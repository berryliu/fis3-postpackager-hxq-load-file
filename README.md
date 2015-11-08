# fis3-deploy-hxq-push

好学区编译加载静态文件，fis3 组件

# 使用方式

在 `fis-config.js` 文件里配置

```
fis.match('*', {
    postpackager: [
        fis.plugin('hxq-load-file')
    ]
});
```
