import Backbone from 'backbone'
import Marionette from 'backbone.marionette'
import _ from 'underscore'

import Form from './Form'
import Results from './Results'
import ModalView from './modal'
import PreselectionModal from "./PreselectionModal"
import Login from "./Login"

const
  template = _.template(
    "<div class='yl-app-container'>" +
    "<div id='yl-app-tools' class='yl-app-tools yl-form-group'>" +
    "</div>" +
    "<div id='yl-app-form' class='yl-app-form'></div>" +
    "<div id='yl-app-results' class='yl-app-results'></div>" +
    "<div class='yl-app-loading'>" +
    "<h3>Loading...</h3>" +
    "</div>" +
    "</div>"
    
  ),

  toolsTemplate = _.template(
    "<div id='Login-container'></div>"+
    "<button class='btn btn-default yl-app-tools-reset' id='yl-app-tools-reset'>Reset</button>"+
    "<button class='btn btn-primary margin-large yl-app-tools-Preselection' id='yl-app-tools-Preselection'>Preselection</button>"+
    "<div id='Preselection-modal-container'></div>"
  ),

  ToolsBar = Marionette.View.extend({
    template: toolsTemplate,
    events: {
      'click #yl-app-tools-reset': 'onReset',
      'click .yl-app-tools-Preselection': 'onPreselection',
    },
    regions:{
      'modalContainer':'#Preselection-modal-container',
      'loginContainer':'#Login-container'
    },
    onReset() {
      this.model.reset()
    },
    onPreselection(){
      var modal = new ModalView({
        view:new PreselectionModal({state:this.options.state}),
        title : "Preselection"
      });
      this.showChildView('modalContainer', modal);
    },
    onRender:function(){
      this.showChildView('loginContainer', new Login());
    }
  }),


  RootView = Marionette.View.extend({

    template: template,

    regions: {
      tools: "#yl-app-tools",
      form: "#yl-app-form",
      resultsTable: "#yl-app-results"
    },

    initialize(options) {
      this.productData = options.productData

      this.productData.on('request', (attrs) => {
        this.$('.yl-app-loading').toggleClass('hidden', false)
      })
      this.productData.on('sync', () => {
        this.$('.yl-app-loading').toggleClass('hidden', true)
      })
      console.log('Roort view results : ', this.productData)
    },

    onRender() {
      this.showChildView('tools',
        new ToolsBar({
          model: this.productData,
          state:this.model
        }));
      this.showChildView('form',
        new Form({
          collection: this.model
        }));
      this.showChildView('resultsTable',
        new Results({
          model: this.productData
        }));
    }

  });

export default RootView