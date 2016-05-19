function createMenuitem(name) {
    // 创建一个菜单的根节点
    return $("<li></li>").append($("<div class=\"link\"></div>").attr("data-name", name).attr("data-info", obj.info).attr("data-parent", obj.parent).append($("<i class=\"fa fa-code\"></i>")).append($("<p>"+name+"</p>")).append($("<i class=\"fa fa-plus-circle\"></i>")).append($("<i class=\"fa fa-info-circle\"></i>")).append($("<i class=\"fa fa-chevron-circle-down\"></i>")));
}

function createListItem(rootnode, obj) {
    if (obj.type != "object") {
        $a = $("<a href=\"#\">" + obj.name + "</a>");
        if (obj.info == "") {
            $a.attr("class", "no-info");
        }
        rootnode.append($("<li></li>").attr("data-name", obj.name).attr("data-info", obj.info).attr("data-parent", obj.parent).append($a).append($("<i class=\"fa fa-plus-circle\"></i>")).append($("<i class=\"fa fa-info-circle\"></i>")));
    } else {
        var li = createMenuitem(obj.name);
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
        var objs = data;
        for (obj in objs) {
            createListItem($("#accordion"), objs[obj]);
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
        }
    } else {
        $this.addClass('open');
        Accordion.boxInfoBtn = $this;
        showbox($this.parent().data("name"), $this.parent().attr("data-info"));
        $box.slideToggle();
    }
}

$('#info-box-textarea').bind('input propertychange', function() {
    Accordion.changed = true;
});

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
        success:function(data){}
    });
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
    $(this).parent().parent().slideToggle();
    Accordion.boxAddBtn.removeClass("open");
    // $(this).parent().parent().
});

Accordion.prototype.addinfo = function(e) {
    var $box = $('#add-box');
    $this = $(this);
    $this.toggleClass('open');
    $box.slideToggle();
    Accordion.boxAddBtn = $this;
}
