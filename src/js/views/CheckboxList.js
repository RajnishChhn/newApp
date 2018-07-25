import Backbone from 'backbone'
import Marionette from 'backbone.marionette'
import _ from 'underscore'

const

  template = _.template(
    '<div class="form-check">' +
    '<input class="form-check-input" type="checkbox" id="checkbox-<%= id %>" name="checkbox-<%= id %>" <%= checked ? "checked" : "" %> />' +
    '<label class="form-check-label" for="checkbox-<%= id %>"><%= label %></label>' +
    '</div>' +
    '<span class="yl-checkbox-count"><%= count %></span>'
  ),

  containerTemplate = _.template(
    '<header id="yl-checkboxlist-header" class="yl-checkboxlist-header yl-form-group-head"></header>' +
    '<div id="yl-checkboxlist-checkboxes"></div>'
  ),

  listHeadTemplate = _.template(
    '<span class="yl-checkbox-list-head"><%= label %></span>'
  ),

  Checkbox = Marionette.View.extend({

    tagName: 'section',

    template: template,

    attributes: {
      class: 'yl-checkbox'
    },

    events: {
      'change .form-check-input': 'onChange'
    },

    initialize(options) {
      this.index = options.index
      this.key = options.key
      this.value = options.value
      this.groupState = options.state
      this.toggle = options.toggle
    },

    onChange(e) {
      this.trigger('checkbox:change', {
        model: this.model,
        checked: Backbone.$(e.target).is(':checked')
      })
    },

    getTemplateData() {
      //let checked = value.find(value => value[1] === model.get('val')) !== undefined)
      return {
        id: `${this.key}-${this.index}`,
        label: this.model.get('label') || this.model.get('val'),
        count: this.model.get('cnt'),
        checked: this.value && (this.value.find(value => value === this.model.get('val')) !== undefined)
      }
    },

    deConfigureSelector() {
      if (this.checkbox) {
        this.checkbox.off('change', (e) => this.onChange(e))
      }
    },

    configureSelector() {
      this.checkbox = this.$('#checkbox-' + this.cid)
      this.checkbox.on('change', (e) => this.onChange(e))
    },

    render() {
      this.deConfigureSelector()
      this.el.innerHTML = template(this.getTemplateData())
      this.configureSelector()
    }
  }),

  CheckboxList = Marionette.CollectionView.extend({

    tagName: 'section',

    attributes: {
      class: 'yl-checkboxlist-list yl-form-section'
    },

    childView: Checkbox,

    childViewEvents: {
      'checkbox:change': 'handleCheckboxChange'
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
        value = state.get('value'),
        toggle = this.data.get('toggle')
      return {
        key,
        index,
        model,
        value,
        state,
        toggle
      }
    },

    handleCheckboxChange(payload) {

      const index = this.collection.indexOf(payload.model),
        state = this.data.get('state'),
        currentValue = state.get('value'),
        toggle = this.data.get('toggle')

      if (toggle) {
        state.set("value", [payload.model.get('val')])
      }
      else {
        const value = currentValue ? currentValue.filter((val) => val !== payload.model.get('val')) : []
        if (payload.checked) {
          value.push(payload.model.get('val'))
        }
        state.set("value", value)
      }

    },
  }),

  CheckboxListHead = Marionette.CollectionView.extend({
    template: listHeadTemplate,
    render() {
      this.el.innerHTML = listHeadTemplate({
        label: this.model.label
      })
      return this
    }
  }),

  CheckboxListContainer = Marionette.View.extend({

    tagName: 'section',

    attributes: {
      class: 'yl-checkboxlist yl-form-section'
    },

    template: containerTemplate,

    regions: {
      head: '#yl-checkboxlist-header',
      list: '#yl-checkboxlist-checkboxes'
    },

    initialize(options) {
      this.data = options.data
      this.state = options.data.get('state')
      this.collection = options.data.get('options')
      this.collection.on('update', this.render, this)
    },

    onRender() {
      // if(this.collection.models.length==0) 
      // {
      //   // return;
      // }
      this.showChildView('head',
        new CheckboxListHead({
          model: {
            label: this.data.get('label')
          }
        })
      )
      this.showChildView('list',
        new CheckboxList({
          data: this.data
        })
      )
      let hidden = false;
      let checkedDependencies = this.model.get('checkedDependencies');
      if (checkedDependencies.length === 0) {
        hidden = false;
      }
      else {
        hidden = !checkedDependencies.some(depend => {
           return depend.query === 'visible' && depend.value === true 
          });
      }
      this.$el.toggleClass('hidden', hidden);      
    }
  })


export default CheckboxListContainer