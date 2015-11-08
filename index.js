module.exports = function (ret, conf, setting, opt) {
    var key = '',
        jsPoolReg = '<!--SCRIPT_PLACEHOLDER-->',
        cssPoolReg = '<!--STYLE_PLACEHOLDER-->',
        map = ret.map.res,
        pkg = ret.map.pkg,
        pkgJsPool = [],
        pkgCssPool = [];

    // lib 脚本要优先加载
    for (key in pkg) {
        var item = pkg[key];
        if (item.type === 'js') {
            pkgJsPool.push(item.uri);
        }
        if (item.type === 'css') {
            pkgCssPool.push(item.uri);
        }
    }

    for (key in ret.src) {
        var file = ret.src[key];
        if (file.depRoot) { // 标记的根依赖
            var jsPool = [].concat(pkgJsPool);
            cssPool = [].concat(pkgCssPool);

            loopDeps(file.id);

            // 遍历依赖，加载顺序为 依赖关系 的深度遍历
            function loopDeps(dep) {
                dep = map[dep];

                var len = (dep.deps && dep.deps.length);
                if (len > 0) {
                    dep.deps.forEach(function (v) {
                        loopDeps(v);
                    });
                }

                if (dep.type === 'js') {
                    unique(dep.uri, jsPool);
                }
                if (dep.type === 'css') {
                    unique(dep.uri, cssPool);
                }
            }

            /**
             * @desc 数组去重
             */
            function unique(val, arr){
                for(var i = 0; i < arr.length; i++){
                    if (arr.indexOf(val) === -1) {
                        arr.push(val);
                    }
                }
            }

            var jsPlaceHolder = '',
                cssPlaceHolder = '';

            for (var i = 0; i < jsPool.length; ++i) {
                jsPlaceHolder += '<script type="text/javascript" src="' + jsPool[i] + '"></script>';
            }
            for (var i = 0; i < cssPool.length; ++i) {
                cssPlaceHolder += '<link rel="stylesheet" type="text/css" href="' + cssPool[i] + '" />';
            }

            var content = file.getContent();
            content = content.replace(jsPoolReg, jsPlaceHolder)
                .replace(cssPoolReg, cssPlaceHolder);

            file.setContent(content);
        }
    }

};