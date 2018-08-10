'use babel';

export default class SimpleCodeIndexView {

    Check(force = false){
        var t = this;
        var activeEditor = atom.workspace.getActiveTextEditor();
        if(this.activeEditor != activeEditor || force){
            this.activeEditor = activeEditor;
            this.result_element.innerHTML = '';

            if(activeEditor != undefined && activeEditor != null){
                var tabLen = activeEditor.getTabLength();
                var tabChars = "";
                for(var i=0; i<tabLen; i++)
                    tabChars += " ";
                var isTabSoft = activeEditor.getSoftTabs();
                var buffer = activeEditor.getBuffer();
                var lines = buffer.getLines();

                var el = document.createElement('div');
                el.onclick = function(){
                    t.Check(true);
                };
                el.innerHTML = '<a class="update-bt" title="ctrl+alt+o">Update</a>';
                this.result_element.appendChild(el);

				var lineLengthStr = lines.length.toString();
                for(var i=0; i<lines.length; i++){
                    var line = lines[i];
                    if(!isTabSoft) line = line.replace(/\t/g, tabChars);
                    var strIndex = 0;
                    while(strIndex < line.length){
                        if(line.substring(strIndex, strIndex+3) == "// "/* || line.substring(strIndex, strIndex+3) == "<!--"*/){
                            var chars = line.substring(strIndex+3, strIndex+3+4);
                            var first = chars.substring(0, 1);
                            if(first == " " || first == "}" || first == "{" || first == "]" || first == "[" || first == "(" || first == ")" || first == "/" || first == "$" || first == "*" || first == "@"){
                                break;
                            }else if(chars === chars.toUpperCase()){
                                var contEl = document.createElement('div');
                                el = document.createElement('a');
                                el.rowIndex = i;
                                el.onclick = function(){
                                    activeEditor.setCursorBufferPosition([this.rowIndex, 0]);
                                };
								var tabStr = "";
								for(var i2=0; i2<(strIndex/4); i2++)
									tabStr += "&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;";
								var lineStr = (i+1).toString();
								var delta = lineLengthStr.length-lineStr.length;
								for(var i2=0; i2<delta; i2++){
									lineStr = "0" + lineStr;
								}
                                //el.innerHTML = '<font class="line-number">'+(i+1)+':</font> <font class="' + (chars == "TODO" ? 'todo' : 'index') + '">'+line.substr(strIndex+3)+"</font>";
								el.innerHTML = '<font class="line-number">'+lineStr+tabStr+'</font> <font class="' + (chars == "TODO" ? 'todo' : 'index') + '">'+line.substr(strIndex+3)+"</font>";
                                //el.style.cssText = 'margin-left: '+parseInt(strIndex/4*15)+'px;';
                                contEl.appendChild(el);
                                this.result_element.appendChild(contEl);
                                break;
                            }
                        }
                        if(line.substring(strIndex, strIndex+1) != " "){
                            break;
                        }
                        strIndex += tabLen;
                    }
                }
            }
        }
    }

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('simple-code-index');

    this.activeEditor = null;
    this.result_element = document.createElement('div');
    this.element.appendChild(this.result_element);

    var t = this;
    setInterval(function(){ t.Check(); }, 500);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
