// var group = [navigator, document, window];
group = [navigator];

function skip(constructortype) {
    switch (constructortype) {
        case PluginArray:
        case MimeTypeArray:
            return true;
        break;
    }
    return false;
}

function traversal(itemroot, obejctitem, propname) {
    if (arguments.length == 2) {
        var submenu = $("<ul class=\"submenu\"></ul>");
        itemroot.append(submenu);
        for (propitem in obejctitem) {
            traversal(submenu, obejctitem, propitem);
        }
    }

    var flag = false;
    p = obejctitem[propname];
    if (p instanceof Object && p.constructor != Array && typeof(p) != "function" && !skip(p.constructor)) {
    	var li = createMenuitem(propname);
    	itemroot.append(li);
        traversal(li, obejctitem[propname]);
    } else if (propname != undefined) {
    	itemroot.append($("<li></li>").append($("<a href=\"#\">" + propname + "</a>")));
    }
    // if (typeof(obejctitem[propname]) == "object") {
    //     traversal(obejctitem[propname]);
    // }
}

function createMenuitem(name) {
    // var li = $("<li></li>");
	return $("<li></li>").append($("<div class=\"link\"></div>").append($("<i class=\"fa fa-code\"></i>")).append($("<p>"+name+"</p>")).append($("<i class=\"fa fa-chevron-down\"></i>")));
}

function traversalAll(root) {
    for (var i in group) {
        var item = group[i];
        var li = createMenuitem(item.constructor.name);
        root.append(li);
    	traversal(li, item);
    }
}

// traversalAll($("#accordion"));
