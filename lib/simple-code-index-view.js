'use babel';

export default class SimpleCodeIndexView {

    Check(force = false){
        var t = this;
        var activeEditor = atom.workspace.getActiveTextEditor()
        if(this.activeEditor != activeEditor || force){
            this.activeEditor = activeEditor;
            this.result_element.innerHTML = '';

            if(activeEditor != undefined && activeEditor != null){
                var buffer = activeEditor.getBuffer();
                var lines = buffer.getLines();

                var el = document.createElement('div');
                el.onclick = function(){
                    t.Check(true);
                };
                el.innerHTML = '<a class="update-bt" title="ctrl+alt+o">Update</a>';
                this.result_element.appendChild(el);

                for(var i=0; i<lines.length; i++){
                    var line = lines[i];
                    var strIndex = 0;
                    while(strIndex < line.length){
                        if(line.substring(strIndex, strIndex+3) == "// "){
                            var chars = line.substring(strIndex+3, strIndex+3+4);
                            var first = chars.substring(0, 1);
                            if(first == " " || first == "}" || first == "{" || first == "]" || first == "[" || first == "(" || first == ")"){
                                break;
                            }else if(chars === chars.toUpperCase()){
                                var contEl = document.createElement('div');
                                contEl.cssText = "margin-left: 10px;";
                                el = document.createElement('a');
                                el.rowIndex = i;
                                el.onclick = function(){
                                    activeEditor.setCursorBufferPosition([this.rowIndex, 0]);
                                };
                                el.innerHTML = '<font class="line-number">'+(i+1)+':</font> <font class="' + (chars == "TODO" ? 'todo' : 'index') + '">'+line.substr(strIndex+3)+"</font>";
                                el.style.cssText = 'margin-left: '+parseInt(strIndex/4*15)+'px;';
                                contEl.appendChild(el);
                                this.result_element.appendChild(contEl);
                                break;
                            }
                        }
                        if(line.substring(strIndex, strIndex+1) != " "){
                            break;
                        }
                        strIndex += activeEditor.getTabLength();
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
