import Backbone from 'backbone'
import Marionette from 'backbone.marionette'
import _ from 'underscore'

const

  template = _.template(
    '<div class="radio">' +
    '<label><input type="radio" id="radio-<%= id %>" name="radio-<%= id %>" <%= checked ? "checked" : "" %>><%= label %></label>' +
    '</div>' +
    '<span class="yl-radio-count"><%= count %></span>'
  ),

  containerTemplate = _.template(
    '<header id="yl-radiolist-header" class="yl-radiolist-header yl-form-group-head"></header>' +
    '<div id="yl-radiolist-radioes"></div>'
  ),

  listHeadTemplate = _.template(
    '<span class="yl-radio-list-head"><%= label %></span>'
  ),

  Radio = Marionette.View.extend({

    tagName: 'section',

    template: template,

    attributes: {
      class: 'yl-radio'
    },

    initialize(options) {
      this.index = options.index
      this.key = options.key
      this.value = options.value
    },

    onChange(e) {
      this.trigger('radio:change', {
        model: this.model,
        checked: Backbone.$(e.target).is(':checked')
      })
    },

    getID() {
      return `${this.key}`
    },

    getTemplateData() {
      return {
        id: this.getID(),
        label: this.model.get('label') || this.model.get('val'),
        count: this.model.get('cnt'),
        checked: this.value && (this.value.find(value => value === this.model.get('val')) !== undefined)
      }
    },

    deConfigureSelector() {
      if (this.radio) {
        this.radio.off('change', (e) => this.onChange(e))
      }
    },

    configureSelector() {
      this.radio = this.$(`#radio-${this.getID()}`)
      this.radio.on('change', (e) => this.onChange(e))
    },

    render() {
      this.deConfigureSelector()
      this.el.innerHTML = template(this.getTemplateData())
      this.configureSelector()
    }
  }),

  RadioList = Marionette.CollectionView.extend({

    tagName: 'section',

    attributes: {
      class: 'yl-radiolist-list yl-form-group'
    },

    childView: Radio,

    childViewEvents: {
      'radio:change': 'handleRadioChange'
    },

    initialize(options) {
      this.data = options.data
      this.state = options.data.get('state')
      this.collection = options.data.get('options')
    },

    childViewOptions(model) {
      const index = this.collection.indexOf(model),
        key = this.data.get('key'),
        state = this.data.get('state'),
        value = state.get('value')
      return {
        key,
        index,
        model,
        value
      }
    },

    handleRadioChange(payload) {
      const state = this.data.get('state')
      state.set("value", [payload.model.get('val')])
    }
  }),

  RadioListHead = Marionette.CollectionView.extend({
    template: listHeadTemplate,
    render() {
      this.el.innerHTML = listHeadTemplate({
        label: this.model.label
      })
      return this
    }
  }),

  RadioListContainer = Marionette.View.extend({

    tagName: 'section',

    attributes: {
      class: 'yl-radiolist yl-form-section'
    },

    template: containerTemplate,

    regions: {
      head: '#yl-radiolist-header',
      list: '#yl-radiolist-radioes'
    },

    initialize(options) {
      this.data = options.data
      this.state = options.data.get('state')
      this.collection = options.data.get('options')
    },

    onRender() {
      this.showChildView('head',
        new RadioListHead({
          model: {
            label: this.data.get('label')
          }
        })
      )
      this.showChildView('list',
        new RadioList({
          data: this.data
        })
      )
    }
  })


export default RadioListContainer