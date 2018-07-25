import Backbone from 'backbone'
import Marionette from 'backbone.marionette'
import _ from 'underscore'

import CheckboxList from './CheckboxList'
import RadioList from './RadioList'
import MultiSelect from './MultiSelect'
import RangeSelector from './RangeSelector'
import FormGroup from './FormGroup'


const
  template = _.template(
    "<section id='motortyps'></section>" +
    "<section id='busm'></section>" +
    "<section id='arbeit'></section>"
  ),

  Form = Marionette.CollectionView.extend({
    //template: template,
    //
    tagName: 'div',

    attributes: {
      class: 'yl-filter-form'
    },
    childView(item) {
      return getFormComponentForType(item.get('type'))
    },
    filter: function (item) {
      return item.get('type') === "CheckboxList"  && !item.get('options') ? false : true;
    },
    childViewOptions(model, index) {
      // do some calculations based on the model
      return {
        data: model,
        index
      }
    }
  })

function getFormComponentForType(type) {

  switch (type) {
    case 'CheckboxList':
      return CheckboxList
    case 'MultiSelect':
      return MultiSelect
    case 'RangeSelector':
      return RangeSelector
    case 'RadioList':
      return RadioList
    case 'FormGroup':
      return FormGroup
    default:
      return Backbone.View
  }
}

export default Form