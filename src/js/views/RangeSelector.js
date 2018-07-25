import Backbone from 'backbone'
import Marionette from 'backbone.marionette'
import _ from 'underscore'

const

  template = _.template(
    '<span class="yl-rangeselect-head yl-form-group-head"><%= label %></span>' +
    '<input type="text" class="yl-rangeselect-select" id="selector-<%= id %>" name="selects[]" />'
  ),

  RangeSelector = Marionette.CollectionView.extend({

    initialize(options) {
      this.model = options.data
      this.options = options.data.get('options')
      if (this.options) {
        this.options.on('update', this.render, this)
      }
    },

    onOptionsChange(model) {
      console.log('onOptionsChange options ', model)
    },

    tagName: 'section',

    attributes: {
      class: 'yl-rangeselect yl-form-section'
    },

    setStateFromSelectorValue(val) {
      this.model
        .get('state')
        .set({
          value: val,
         isChanged:true
        })
    },

    getTemplateData() {

      return {
        id: this.cid,
        label: this.model.get('label'),
        data: this.model.get('options')
          .toJSON()
          .map((el, index) => {
            return {
              id: index,
              text: el.val + " : " + el.cnt,
              val: el.val
            }
          })
      }
    },

    getOptionsData() {
      return this.model
        .get('options')
        .at(0)
        .toJSON()
    },

    getValuesData() {
      return this.model
        .get('state')
        .get('value')
    },

    deConfigureSelector() {
      if (this.selector) {
        this.selector.destroy();
      }
    },

    configureSelector() {
      const values = this.getValuesData()
      this.selector = this.$('#selector-' + this.cid)
      this.selector.ionRangeSlider({
        type: 'double',
        ...this.getOptionsData(),
        from: values.start,
        to: values.end,
        onFinish: (data) => {
          const {
            from: start,
            to: end
          } = data
          this.setStateFromSelectorValue({
            start,
            end
          })
        }
      });
    },

    render() {
      //See if selecter can be moved rather than completely detached
      //This could be expensive
      //this.deConfigureRangeUI()
      this.el.innerHTML = template(this.getTemplateData())
      this.configureSelector()
      let visible = this.model.get('checkedDependencies')
        .find(depend => depend.query === 'visible')

      if (!visible || visible.value === void 0 || visible.value === true) {
        this.$el.toggleClass('hidden', false)
      }
      else {
        this.$el.toggleClass('hidden', true)
      }
        return this
      }
    })

export default RangeSelector