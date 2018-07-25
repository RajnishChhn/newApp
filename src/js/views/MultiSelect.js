import Backbone from 'backbone'
import Marionette from 'backbone.marionette'
import _ from 'underscore'

const

  template = _.template(
    '<span class="yl-multiselect-head yl-form-group-head"><%= label %></span>' +
    '<select class="yl-multiselect-select" id="selector-<%= id %>" data-multiple=true data-placeholder="Select...">' +
    '<% data.forEach(function(option) { %>' +
    '<option value="<%= option.val %>" id="<%= option.id %>"><%= option.text %></option>' +
    '<% }) %>' +
    '</select>'
  ),

  MultiSelect = Marionette.View.extend({

    initialize(options) {
      this.model = options.data
      this.options = options.data.get('options')
      if (this.options) {
        this.options.on('update', this.render, this)
      }
    },

    template: template,

    tagName: 'section',

    attributes: {
      class: 'yl-multiselect yl-form-section'
    },

    setStateFromSelectorValue(val) {
      const state = this.model.get('state'),
        currentValue = state.get('value')
      state.set("value", Array.isArray(val) ? val : [val])
    },

    onSelect(e) {
      this.setStateFromSelectorValue(this.selector.val())
    },

    onUnselect(e) {
      this.setStateFromSelectorValue(this.selector.val())
    },

    optionsToSelectDataForMultiKey(options) {
      const value = this.getStateValue()
      return options
        .map((el, index) => {
          return {
            id: el.value.val,
            text: el.value.val + " : " + el.value.cnt,
            val: el.key + ":" + el.value.val,
            selected: value && value.includes(el.value.val)
          }
        })
    },
    optionsToSelectDataForSingleKey(options) {
      {
        return options
          .map((el, index) => {
            return {
              id: el.val,
              text: el.val + " : " + el.cnt,
              val: el.val,
              selected: value.includes(el.val)
            }
          })
      }
    },
    templateContext() {

      return {
        id: this.cid,
        label: this.model.get('label'),
        data: Array.isArray(this.model.get('key'))?
                this.optionsToSelectDataForMultiKey(this.options.toJSON()) :
                this.optionsToSelectDataForSingleKey(this.options.toJSON())
      }

    },

    getStateValue() {
      const value = this.model
        .get('state').get('value')
      return value && value.length > 0 ? value : []
    },

    deConfigureSelector() {
      if (this.selector) {
        this.selector.off('select2:select', this.onSelect)
        this.selector.off('select2:unselect', this.onUnselect)
        this.selector.val(null)
        this.selector.select2('destroy');
      }
    },

    configureSelector(reset) {

      let config = this.model.get('config')

      this.selector = this.$('#selector-' + this.cid)
      this.selector.on('select2:select', (e) => this.onSelect(e))
      this.selector.on('select2:unselect', (e) => this.onUnselect(e))
      let value = this.getStateValue()
      this.selector.select2({
        multiple: true,
        maximumSelectionLength: config.multiple !== void 0 && config.multiple === true ? 0 : 1,
        search: config.search !== void 0 ? config.search : false,
        placeholder: 'Please Select...'
      })
      this.selector.val(value)
      this.selector.trigger('change')

      
    },

    onRender() {

      let visible = this.model.get('checkedDependencies')
        .find(depend => depend.query === 'visible')

      if (!visible || visible.value === void 0 || visible.value === true) {

        this.$el.toggleClass('hidden', false)
        if (this.selector) {
          this.deConfigureSelector()
        }
        this.configureSelector(this.selector ? false : true)
      }
      else {
        this.$el.toggleClass('hidden', true)
      }
    }

    /*render() {
      //console.log('Muli render')
      //See if selecter can be moved rather than completely detached
      //This could be expensive
      
      return this
    }*/


  })

export default MultiSelect