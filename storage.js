// 加载File System读写模块
var fs = require('fs');
// 加载编码转换模块
// var iconv = require('iconv-lite'); 
var jobj;

var filepath = './asset/chrome.json';
// writeFile(file);
readFile(filepath);

function writeFile(path, data) {
    fs.writeFileSync(path, data);
}

function readFile(path) {
    jobj = JSON.parse(fs.readFileSync(path));
    // console.log(jobj);
    // for (var i in jobj) {
    //     var obj = jobj[i];
    //     console.log('>>> in storage.js ' + obj.name);
    // }
}

function showInfo(jobj, p, name, type) {
    tmp = jobj;
    for (var i in p) {
        for (var j in tmp) {
            if (tmp[j].name == p[i]) {
                // console.log(">>> in tmp[j].name=" + tmp[j].name + " p[i]="+ p[i]);
                if (tmp[j].name != name) {
                    tmp = tmp[j].prop;
                } else {
                    tmp = tmp[j];
                }
                break;
            }
        }
    }
    console.log('>>> in storage.js type:' + type + ' name:'+ tmp.name + ' parent:' + tmp.parent +' info:' + tmp.info);
}

function showProp(node) {
    console.log('>>> in storage.js showProp name:'+ node.name + ' parent:' + node.parent +' info:' + node.info);
    for (var i in node.prop) {
        console.log('    ---- ' + i + ' name:'+ node.prop[i].name);
    }
}

function save(infoObj) {
    var p = infoObj.parent.split('.');
    var tmp = jobj;
    console.log(">>> in storage.js infoObj.name=" + infoObj.name);
    console.log(">>> in storage.js infoObj.parent=" + infoObj.parent);
    if (infoObj.type == "changed") {
        p.push(infoObj.name);
        for (var i in p) {
            for (var j in tmp) {
                if (tmp[j].name == p[i]) {
                    if (tmp[j].name != infoObj.name) {
                        tmp = tmp[j].prop;
                    } else {
                        tmp = tmp[j];
                    }
                    break;
                }
            }
        }
        tmp.info = infoObj.info;
        showInfo(jobj, p, infoObj.name, infoObj.type);
    } else if (infoObj.type == "new") {
        // showProp(tmp);
        // console.log("+++++++++++++++++++++++++");
        for (var i in p) {
            for (var j in tmp) {
                if (tmp[j].name == p[i]) {
                    if (i + 1 < p.length) {
                        tmp = tmp[j].prop;
                    } else {
                        tmp = tmp[j];
                    }
                    break;
                }
            }
        }
        // tmp为新节点的父节点
        var newObj = {
            name : infoObj.name,
            parent : infoObj.parent,
            type : "",
            info : infoObj.info,
            detail : "",
            link : "",
            prop : []
        };
        // showProp(tmp);
        // console.log("-------------------------");
        tmp.prop.push(newObj);
        if (tmp.type != "object") {
            tmp.type = "object";
        }
        console.log(">>> in storage.js tmp.name=" + tmp.name + " tmp.type=" + tmp.type);
        showProp(tmp);
    }
    var data = JSON.stringify(jobj);
    writeFile(filepath, data);
    return data;
}

exports.save = save;
