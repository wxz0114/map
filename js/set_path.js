function setPath() {
  var tbody = document.createElement("tbody");
  for (var obj in objs) {
    var tr = document.createElement("tr");
    // 设置图标
    var td1 = document.createElement("td");
    td1.setAttribute("class", objs[obj].type);
    tr.appendChild(td1);
    // 设置链接
    var td2 = document.createElement("td");
    var link = document.createElement("a");
    link.setAttribute("href", "home/" + objs[obj].path);
    link.innerHTML = objs[obj].path;
    td2.appendChild(link);
    tr.appendChild(td2);
    tbody.appendChild(tr);
  }
  var table = document.createElement("table");
  table.appendChild(tbody);
  document.body.appendChild(table);
}
var objs = [{"type":"dir", "path":"Portland"},{"type":"dir", "path":"Seattle"},{"type":"html", "path":"Sacramento"}];
setPath();
