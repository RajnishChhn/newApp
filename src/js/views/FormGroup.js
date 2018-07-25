import Backbone from 'backbone'
import Marionette from 'backbone.marionette'
import _ from 'underscore'

import Form from './Form'


const

  template = _.template(
    '<div id="yl-formgroup-collapse">' +
    '<button id="yl-formgroup-collapse-<%= id %>" class="btn btn-default yl-formgroup-collapse-button" type="button" data-toggle="collapse" aria-expanded="false" aria-controls="yl-formgroup-form-<%= id %>">See More Options</button>' +
    '</div>' +
    '<div id="yl-formgroup-form" class="yl-formgroup-form yl-formgroup-form-<%= id %> collapsed"></div>'
  ),

  FormGroup = Marionette.View.extend({

    template: template,

    tagName: 'section',

    attributes: {
      class: 'yl-formgroup yl-form-section'
    },

    regions: {
      form: "#yl-formgroup-form",
    },

    initialize(options) {
      this.model = options.data
    },

    templateContext() {
      return {
        id: this.cid
      }
    },

    onCollapseClick(e) {
      this.$(`.yl-formgroup-form-${this.cid}`)
        .toggleClass('collapsed');
    },

    onRender() {
      if(!sessionStorage.getItem('yl-isUserLoggedIn')){
        return;
      }
      this.showChildView('form',
        new Form({
          collection: this.model.get('items')
        }));
      this.collapseButton = this.$(`#yl-formgroup-collapse-${this.cid}`)
      this.collapseButton.on('click', (e) => this.onCollapseClick(e))
    }
  })

export default FormGroup