var jobj = undefined;
var orgHeight = 0;

function createMenuitem(obj) {
    // 创建一个菜单的根节点
    return $("<li></li>").append($("<div class=\"link\"></div>").attr("data-name", obj.name).attr("data-info", obj.info).attr("data-parent", obj.parent).append($("<p>"+obj.name+"</p>")).append($("<i class=\"fa fa-plus-circle\"></i>")).append($("<i class=\"fa fa-info-circle\"></i>")).append($("<i class=\"fa fa-chevron-circle-down\"></i>")));
}

function createListItem(rootnode, obj) {
    if (obj.type != "object") {
        $a = $("<a href=\"#\">" + obj.name + "</a>");
        if (obj.info == "") {
            $a.attr("class", "no-info");
        }
        rootnode.append($("<li></li>").attr("data-name", obj.name).attr("data-info", obj.info).attr("data-parent", obj.parent).append($a).append($("<i class=\"fa fa-plus-circle\"></i>")).append($("<i class=\"fa fa-info-circle\"></i>")));
    } else {
        var li = createMenuitem(obj);
        rootnode.append(li);
        var submenu = $("<ul class=\"submenu\"></ul>");
        li.append(submenu);
        for (i in obj.prop) {
            createListItem(submenu, obj.prop[i]);
        }
    }
}

function showAll() {
    $.getJSON("asset/chrome.json", function(data) {
        // alert(data);
        jobj = data;
        for (obj in jobj) {
            createListItem($("#accordion"), jobj[obj]);
        }
        var accordion = new Accordion($('#accordion'), false);
    });
}

function sortName(a, b) {
    return a.name < b.name;
}

showAll();

var Accordion = function(el, multiple) {
    this.el = el || {};
    this.multiple = multiple || false;

    // Variables privadas
    var chevrons = this.el.find('.fa-chevron-circle-down');
    // Evento
    chevrons.on('click', {el: this.el, multiple: this.multiple}, this.dropdown);
    var infos = this.el.find('.fa-info-circle');
    infos.on('click', {el: this.el, multiple: this.multiple}, this.showinfo);
    var adds = this.el.find('.fa-plus-circle');
    adds.on('click', {el: this.el, multiple: this.multiple}, this.addinfo);
}

Accordion.boxInfoBtn = undefined;
Accordion.boxAddBtn = undefined;
Accordion.changed = false;

Accordion.prototype.dropdown = function(e) {
    var $el = e.data.el;
        $this = $(this),
        $next = $this.parent().next();

    $next.slideToggle();
    $this.parent().toggleClass('open');

    if (!e.data.multiple) {
        // $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
    };
}

function showbox(name, info) {
    // alert(info);
    var $box = $('#info-box');
    $($box.find('p')[0]).html(name);
    if (Accordion.changed == true) {
        $($box.find('textarea')[0]).remove();
        $box.append($('<textarea id="info-box-textarea"></textarea>').html(info));
        $('#info-box-textarea').bind('input propertychange', function() {
             Accordion.changed = true;
        });
        $('#info-box-textarea').blur(function() {
            if (Accordion.changed) {
                infoChanged(Accordion.boxInfoBtn.parent(), this.value);
                Accordion.changed = false;
            }
        });
    } else {
        $($box.find('textarea')[0]).html(info);
    }
}

Accordion.prototype.showinfo = function(e) {
    var $box = $('#info-box');
    $this = $(this);
    if (Accordion.boxInfoBtn != undefined) {
        if ($this.hasClass('open')) {
            Accordion.boxInfoBtn.removeClass('open');
            Accordion.boxInfoBtn = undefined;
            $box.slideToggle();
        } else {
            $this.addClass('open');
            Accordion.boxInfoBtn.removeClass('open');
            Accordion.boxInfoBtn = $this;
            showbox($this.parent().data("name"), $this.parent().attr("data-info"));
            resizeTextareaHeight();
        }
    } else {
        $this.addClass('open');
        Accordion.boxInfoBtn = $this;
        showbox($this.parent().data("name"), $this.parent().attr("data-info"));
        $box.slideToggle();
        resizeTextareaHeight();
    }
}

$('#info-box-textarea').bind('input propertychange', function() {
    Accordion.changed = true;
});

function infoChanged(node, value) {
    node.attr("data-info", value);
    if (value == "") {
        $(node.find('a')[0]).addClass("no-info");
    } else {
        $(node.find('a')[0]).removeClass("no-info");
    }
    // send to server
    $.ajax({
        url:'udi',
        data:{
            type:"changed",
            name:node.data("name"),
            parent:node.data("parent"),
            info:node.data("info")
        },
        type:'post',
        cache:false,
        dataType:'json',
        success:function(data) {
            // alert(data);
        }
    });
}

function infoNew(nameStr, infoStr, parentNode) {
    var parentStr;
    if (nameStr != "") {
        if (parentNode.data("parent") != "") {
            // alert(parentNode.data("name") + "&" + parentNode.data("parent"));
            parentStr = parentNode.data("parent") + '.' + parentNode.data("name");
        } else {
            // alert(parentNode.data("name"));
            parentStr = parentNode.data("name");
        }
        // 需要在当前的parentNode中查找是否有重名的项
        var tmp = getNode(parentStr, nameStr);
        if (tmp.name == nameStr) {
            alert("已经存在同名项，请确认 " + tmp.name);
            return;
        }
        $.ajax({
            url:'udi',
            data:{
                type:"new",
                name:nameStr,
                parent:parentStr,
                info:infoStr
            },
            type:'post',
            cache:false,
            dataType:'json',
            success:function(data) {
                $("#accordion").children('li').remove();
                jobj = data;
                for (obj in jobj) {
                    createListItem($("#accordion"), jobj[obj]);
                }
                var accordion = new Accordion($('#accordion'), false);
            }
        });
    } else {
        alert("至少需要写入对象名称");
    }
}

$('#info-box-textarea').blur(function() {
    if (Accordion.changed) {
        infoChanged(Accordion.boxInfoBtn.parent(), this.value);
    }
});

$('#info-box-close').click(function(){
    Accordion.boxInfoBtn.removeClass('open');
    Accordion.boxInfoBtn = undefined;
    $(this).parent().parent().slideToggle();
});

$('#add-box-close').click(function(){
    $p = $(this).parent().parent();
    infoNew(
        ($p.find("#add-title-textarea")[0]).value, 
        ($p.find("#add-info-textarea")[0]).value, 
        Accordion.boxAddBtn.parent());
    $p.slideToggle();
    Accordion.boxAddBtn.removeClass("open");
});

Accordion.prototype.addinfo = function(e) {
    var $box = $('#add-box');
    $this = $(this);
    $this.toggleClass('open');
    $box.slideToggle();
    Accordion.boxAddBtn = $this;
    $box.children('div').children('textarea').val('');
}

function getNode(parentName, name) {
    // alert(parentName);
    var p = parentName.split('.');
    p.push(name);
    // alert(p);
    var tmp = jobj;
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
    return tmp;
}

function resizeTextareaHeight() {
    textarea = $("#info-box").find('textarea')[0];
    if (orgHeight == 0)
        orgHeight = $(textarea).height() + "px";
    textarea.style.height =  orgHeight;
    textarea.style.height = Math.max(textarea.scrollHeight, $(textarea).height()) + "px";
}

// fakeInfoChanged();

function fakeInfoChanged() {
    $.ajax({
        url:'udi',
        data:{
            type:"changed",
            name:"appCodeName",
            parent:"navigator",
            // name:"geolocation",
            // parent:"navigator",
            info:"返回浏览器的名称，通常是Mozilla，即使在非Mozilla浏览器中也是如此"
        },
        type:'post',
        cache:false,
        dataType:'json',
        contentType:'text/html; charset=utf-8',
        success:function(data){}
    });
}

// fakeInfoNew();

function fakeInfoNew() {
    $.ajax({
        url:'udi',
        data:{
            type:"new",
            name:"mimeTypes",
            parent:"navigator.plugins",
            info:"回传MimeTypeArray对象，其内包含浏览器支持的媒体格式对象"
        },
        type:'post',
        cache:false,
        dataType:'json',
        contentType:'text/html; charset=utf-8',
        success:function(data){}
    });
}
