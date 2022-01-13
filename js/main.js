function debounce(func, wait = 250, immediate = false) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function arrayRemove(arr, value) {
  return arr.filter(function (ele) {
    return ele != value;
  });
}

function toggle(el, index) {
  var cdEd = document.querySelectorAll(".con");
  if (document.querySelectorAll(".active").length !== 1) {
    el.classList.contains("active") ? el.classList.remove("active") : el.classList.add("active");
    cdEd[index].style.display == "none" ? (cdEd[index].style.display = "flex") : (cdEd[index].style.display = "none");
    triggerResize();
    if (!window.activeEdI) window.activeEdI = [0, 3];
    if (window.activeEdI.indexOf(index) > -1) window.activeEdI = arrayRemove(window.activeEdI, index);
    else window.activeEdI.push(index);
    window.activeEdI.sort();
    if (index !== 3 && el.classList.contains("active")) {
      if (!window.activePos) window.activePos = index;
      aceEditor[index].focus();
      aceEditor[index].navigateFileEnd();
    }
  } else {
    !el.classList.contains("active") ? el.classList.add("active") : null;
    if (window.activeEdI.indexOf(index) < 0) window.activeEdI.push(index);
    window.activeEdI.sort();
    if (index !== 3) {
      aceEditor[index].focus();
      aceEditor[index].navigateFileEnd();
    }
    cdEd[index].style.display = "flex";
    triggerResize();
  }
}

function repl() {
  document.querySelectorAll(".bigscreen")[0].style.display = "none";
  document.querySelectorAll(".smallscreen")[0].style.display = "flex";
}

function triggerResize() {
  var resizeEvent = window.document.createEvent("UIEvents");
  resizeEvent.initUIEvent("resize", true, false, window, 0);
  window.dispatchEvent(resizeEvent);
}

var codeEditor = document.querySelectorAll(".editor");
window.addEventListener("DOMContentLoaded", (event) => {
  document.querySelectorAll(".con")[1].style.display = "none";
  document.querySelectorAll(".con")[2].style.display = "none";
  // window.innerWidth <= 768 ? navToggle() : null;
  document.querySelector("#htmlEditor").innerHTML = '<h1 class="greet">Hello</h1>';
  document.querySelector("#cssEditor").innerHTML =
    ".greet {\n\tcolor:#ffffff;\n\tposition:absolute;\n\ttop:50%;\n\tleft:50%;\n\ttransform:translate(-50%,-50%);";
  document.querySelector("#cssEditor").innerHTML += "\n\tbackground:tomato;\n\tborder:1px solid;\n\tpadding:40px;\n}";
  document.querySelector("#jsEditor").innerHTML = 'document.querySelector(".greet").innerHTML+=" World..!";';
  codeEditor.forEach.call(codeEditor, function (editor, index) {
    makeEditor(editor, ["html", "css", "javascript"][index]);
  });
  triggerResize();
  updateiFrame();
});

window.addEventListener("resize", (event) => {
  window.innerWidth > 768 ? navToggle(true) : navToggle(false);
  updateiFrame();
});

var ariahidden = document.querySelectorAll(".ariahidden");

for (let i = 0; i < ariahidden.length; i++) {
  var fragment = document.createDocumentFragment();
  for (let j = 0; j < 20; j++) {
    ariahidden[i].innerHTML += "<i aria-hidden=true></i>";
  }
  while (ariahidden[i].firstChild) {
    fragment.appendChild(ariahidden[i].firstChild);
  }

  ariahidden[i].parentNode.replaceChild(fragment, ariahidden[i]);
}

let nav_display = false;

function navToggle(val = null) {
  if (val !== null) {
    nav_display = val;
  }
  var navitems = document.querySelectorAll(".navitem");
  for (let i = 0; i < navitems.length; i++) {
    if (nav_display || val) {
      navitems[i].style.display = "block";
    } else {
      navitems[i].style.display = "none";
      nav_display = false;
    }
  }
  nav_display = !nav_display;

  return false;
}

let editorTheme, themeBg;
const changeTheme = () => {
  // var darkThemes = [
  // "ambiance",
  // "dracula",
  // "terminal",
  // "twilight",
  // "cobalt",
  // "gruvbox",
  // "merbivore_soft",
  // "mono_industrial",
  // "monokai",
  // "tomorrow_night_bright"
  // ];

  var themes = ["monokai", "crimson_editor"];
  editorTheme == "crimson_editor"
    ? ((editorTheme = "monokai"), (themeBg = "#272822"))
    : ((editorTheme = "crimson_editor"), (themeBg = "#FFFFFF"));
  // var randomDarkTheme =
  // darkThemes[Math.floor(Math.random() * darkThemes.length)];
  // document.querySelector("#chTheme").innerHTML = randomDarkTheme;
  for (var t = 0; t < aceEditor.length; t++) {
    aceEditor[t].setTheme(`ace/theme/${editorTheme}`);
    document.querySelectorAll(".editor")[t].style.background = themeBg;
  }
};

var aceEditor = [],
  x = 0;
const makeEditor = (editor, editorMode) => {
  let editorContent = editor.innerHTML;
  aceEditor[x] = ace.edit(editor);
  aceEditor[x].setFontSize("16px");
  aceEditor[x].setTheme("ace/theme/monokai");
  aceEditor[x].session.setMode({
    path: `ace/mode/${editorMode}`,
  });
  aceEditor[x].setShowPrintMargin(false);
  aceEditor[x].session.setUseWrapMode(true);
  aceEditor[x].session.setValue(editorContent);
  for (let y = 0; y < aceEditor.length; y++) {
    aceEditor[y].session.on("change", function () {
      editorOnChange(aceEditor[y], y);
    });
    if (y === 0) {
      aceEditor[y].focus();
      aceEditor[y].navigateFileEnd();
    }
  }
  x++;
};

function datetime() {
  var date = new Date();
  var dd = date.getDate().toString().padStart(2, "0");
  var mm = (date.getMonth() + 1).toString().padStart(2, "0");
  var yyyy = date.getFullYear().toString();
  var hr = date.getHours().toString().padStart(2, "0");
  var min = date.getMinutes().toString().padStart(2, "0");
  var sec = date.getSeconds().toString().padStart(2, "0");
  var fulldate = dd + "-" + mm + "-" + yyyy;
  var fulltime = hr + "." + min + "." + sec;
  return {
    date,
    dd,
    mm,
    yyyy,
    hr,
    min,
    sec,
    fulldate,
    fulltime,
  };
}

function saveTextAsFile(text) {
  var textFileAsBlob = new Blob([text], {
    type: "text/html",
  });
  var dt = datetime();
  var fileNameToSaveAs = "webdocument_" + dt.fulldate + "_" + dt.fulltime + ".html";
  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null) {
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }
  downloadLink.click();
}

const editorOnChange = debounce(function (ed, index) {
  updateiFrame(index);
});

const updateiFrame = debounce(function (index) {
  let htmlTextArea, cssTextArea, jsTextArea, iframeResult;
  let bigscreen = document.querySelector(".bigscreen");
  bigscreen.style.display !== "none" ? (htmlTextArea = aceEditor[0].getSession().getValue()) : "";
  htmlTextArea = htmlTextArea.trim();
  bigscreen.style.display !== "none"
    ? (cssTextArea = aceEditor[1].getSession().getValue())
    : (cssTextArea = aceEditor[4].getSession().getValue());
  cssTextArea = cssTextArea.replace(/\r?\n|\r|\s\s+/g, "").trim();
  bigscreen.style.display !== "none"
    ? (jsTextArea = aceEditor[2].getSession().getValue())
    : (jsTextArea = aceEditor[5].getSession().getValue());
  jsTextArea = jsTextArea.trim();
  bigscreen.style.display !== "none"
    ? (iframeResult = document.querySelectorAll(".fi-2-column-4")[0])
    : (iframeResult = document.querySelectorAll(".fi-2-column-4")[1]);
  window.finalDoc = document.createElement("html");
  finalDoc.innerHTML = htmlTextArea;
  let iframeDoc = iframeResult.contentDocument || iframeResult.contentWindow.document;
  iframeDoc.open();
  if (htmlTextArea.length > 0) iframeDoc.write(htmlTextArea);
  else iframeDoc.write("<!DOCTYPE html><html><head></head><body></body></html>");
  if (cssTextArea.length > 0) {
    let style = iframeDoc.createElement("style");
    style.innerText = cssTextArea;
    iframeDoc.head.appendChild(style);
    finalDoc.querySelector("head").innerHTML += style.outerHTML;
  }
  if (jsTextArea.length > 0) {
    let script = iframeDoc.createElement("script");
    script.innerText = jsTextArea;
    iframeDoc.body.appendChild(script);
    finalDoc.querySelector("body").innerHTML += script.outerHTML;
  }
  iframeDoc.close();
});
