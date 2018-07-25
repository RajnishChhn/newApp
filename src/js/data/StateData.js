import Backbone from 'backbone'

// g == range ? 
// m == multiselct ?

const
  StateData = Backbone.Collection.extend({
    initialize: function(){
      
      //set pre-selection filters 
      var preselectionFilterModel1 = new Backbone.Model();
      preselectionFilterModel1.set({
        key:"lagerprogramm_ant",
        state: new Backbone.Model({'value':['J']}),
        type:"preselectionFilter_show_Preference"
      });
      this.add(preselectionFilterModel1);

      var preselectionFilterModel2 = new Backbone.Model();
      preselectionFilterModel2.set({
        key:"Overloadedgearbox",
        state: new Backbone.Model({'value':['no']}),
        type:"preselectionFilter_gearboxOverload_Preference"
      });
      this.add(preselectionFilterModel2);
    },
    getAll() {
      let
        allStateValue = undefined,
        allState = this.findWhere({
          label: "All"
        })

      if (!allState) {
        return -1
      }

      allStateValue = allState.get('state').get('value')

      if (!allStateValue || allStateValue.length == 0) {
        return -1
      }

      return allStateValue[0]
    }
  })

export default StateData