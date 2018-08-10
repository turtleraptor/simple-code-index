'use babel';

import SimpleCodeIndexView from './simple-code-index-view';
import { CompositeDisposable } from 'atom';

export default {

  simpleCodeIndexView: null,
  rightPanel: null,
  subscriptions: null,

  activate(state) {
    this.simpleCodeIndexView = new SimpleCodeIndexView(state.simpleCodeIndexViewState);
    this.rightPanel = atom.workspace.addRightPanel({
      item: this.simpleCodeIndexView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'simple-code-index:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.rightPanel.destroy();
    this.subscriptions.dispose();
    this.simpleCodeIndexView.destroy();
  },

  serialize() {
    return {
      simpleCodeIndexViewState: this.simpleCodeIndexView.serialize()
    };
  },

  toggle() {
    this.simpleCodeIndexView.Check(true);
    //console.log('SimpleCodeIndex was toggled!');
    return (
      this.rightPanel.isVisible() ?
      this.rightPanel.hide() :
      this.rightPanel.show()
    );
  }

};
