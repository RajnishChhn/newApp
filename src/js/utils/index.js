import { getFiltersFromCookies } from "./cookieManager";
import _ from 'underscore'

export function fitNumberInRange(value, start, end) {
  return Math.max(start, Math.min(end, value))
}


function getStateForRadioList(state, values) {

  const actualState = state.state.toJSON()

  return {
    value: actualState.value ? actualState.value : undefined
  }
}

function getStateForCheckboxList(state, values) {

  const actualState = state.state.toJSON()

  return {
    value: actualState.value ? actualState.value : undefined
  }
}

function getStateForMultiSelect(state, values) {
  //No validation needed, if undefined then return undefined
  const actualState = state.state.toJSON()

  return {
    value: actualState.value ? actualState.value : undefined
  }
}


/**
 * Sets the state according to new values of the RangeSelect State.
 * This tries to preserve the state but if the current state values are out of
 * bounds in accordance to new values then they will be change to be in bounds
 * @param  {Object} state  The current state
 * @example
 * {
 *   value: {
 *     start: Number,
 *     end: Number
 *   }
 * }
 * @param  {[type]} values The new values
 * @example
 * [
 *   {
 *     cnt: Number
 *     min: Number,
 *     max: Number
 *   }
 * ]
 * @return {Object} The new state
 */
function getStateForRangeSelect(state, values) {
  //Make sure state value fits in range of new values
  let
    minStart = values[0].min,
    minEnd = values[0].max

  const
    actualState = state.state.toJSON(),
    newState = actualState.value ? {
      value: {
        start: fitNumberInRange(
          actualState.value.start | 0,
          minStart, minEnd
        ),
        end: fitNumberInRange(
          actualState.value.end | 0,
          minStart, minEnd
        )
      }
    } : {
        value: {
          start: minStart,
          end: minEnd
        }
      }

  return newState
}

function getStateForType(type, state, values) {
  let stateResolver = {
    'CheckboxList': getStateForCheckboxList,
    'MultiSelect': getStateForMultiSelect,
    'RangeSelector': getStateForRangeSelect,
    'RadioList': getStateForRadioList
  }[type]

  if (stateResolver) {
    return stateResolver(state, values)
  }
  else {
    return values
  }
}

function getNewStateDataObject(filterMapItem, options, stateData, Model) {

  const

    stateModel = new Model({
      value: undefined
    }),

    filterStateData = new Model({
      ...filterMapItem,
      options: new Backbone.Collection([...options]),
      config: filterMapItem.config,
      dependencies: filterMapItem.dependencies,
      state: stateModel
    })

  stateData.listenTo(stateModel, 'change', () => {
    stateData.trigger('state:change')
  })

  return filterStateData
}

function getNewGroupStateDataObject(filterMapItem) {

  return new Backbone.Model({
    ...filterMapItem,
    config: filterMapItem.config,
    items: new Backbone.Collection()
  })
}

function findStateObjectByKey(key, stateData) {

  let stateItem, foundItem, i = 0
  for (i; i < stateData.length; i++) {
    stateItem = stateData.at(i)

    if (stateItem.type === 'FormGroup') {
      foundItem = findStateObjectByKey(key, stateItem.get('items'))
      if (foundItem) {
        return foundItem
      }
    }
    if (stateItem.get('key') === key) {
      return stateItem
    }
  }
}

function checkStateValueIncludeArray(stateValue, value) {
  var valueExists = false;
  if (!!value && !!stateValue) {
    if (Array.isArray(stateValue) && stateValue.length > 0) {
      stateValue.some(function (item) {
        if (typeof (item) === "string") {
          return valueExists = item.split(',').includes(value);
          // break;
        }
        else {
          return valueExists = item === value;
        }
      });
    }
  }
  return valueExists;
}
function checkStateValueIncludeForRangeSelect(stateValue, value) {
  return !isNaN(value) && value > stateValue.start && value < stateValue.min
}


/*
if something is calling  this method it expects a a true comparison
so if the resolver doesn't exist then return false.
 */
function checkStateValueIncludeForType(type, stateValue, value) {
  let stateResolver = {
    'CheckboxList': checkStateValueIncludeArray,
    'MultiSelect': checkStateValueIncludeArray,
    'RangeSelector': checkStateValueIncludeForRangeSelect,
    'RadioList': checkStateValueIncludeArray
  }[type]

  if (stateResolver) {
    return stateResolver(stateValue, value)
  }
  else {
    return false
  }
}

export function satisfyDependency(stateObject, stateData) {

  let
    stateItem,
    stateItemStateValue,
    dependValue,
    dependValues = [],
    stateDepends = stateObject.get('dependencies')

  if (stateDepends) {
    stateDepends.forEach(
      depend => {

        dependValue = {
          query: depend.query,
          value: false
        }
        stateItem = findStateObjectByKey(depend.key, stateData)
        if (stateItem) {

          stateItemStateValue = stateItem.get('state').get('value')

          dependValue.value = checkStateValueIncludeForType(
            stateItem.get('type'), stateItemStateValue, depend.value)
        }

        dependValues.push(dependValue)

      }
    )
  }

  //If nothing else is falsy
  //return true ( depends are satisfied )
  return dependValues
}


function setFilterStateDataForItem(filterMapItem, formFilters, stateData, rootState, allValue, Model,updateView) {

  let

    getStateForMultiSelectWithMultiKeys = (filterMapItem, formFilters) => {
        let multiSelectoptions = []

        filterMapItem.key.forEach(key => {
          formFilters[key].forEach(value => {
            multiSelectoptions.push({ key: key, value: value });
          })
        });
      return multiSelectoptions;
    },
    
    filterValues = filterMapItem.options ?
    filterMapItem.options :
    (filterMapItem.type === 'MultiSelect' && Array.isArray(filterMapItem.key)) ?
      getStateForMultiSelectWithMultiKeys(filterMapItem,formFilters) : [...(formFilters[filterMapItem.key] || [])],

  // filterValues = filterMapItem.options ?
  //   filterMapItem.options : [...(formFilters[filterMapItem.key] || [])],

    options = Array.isArray(filterValues) ?
      filterValues : [filterValues],

    //Find the current state data for the form component
    //If not found create new object from API data
    stateDataForFilter = stateData.findWhere({
      "key": filterMapItem.key
    }),

    filterStateData


  if (stateDataForFilter) {
    filterStateData = stateDataForFilter
  }
  else {
    filterStateData = getNewStateDataObject(filterMapItem, options, rootState, Model)
  }

  let state = getStateForType(filterMapItem.type, filterStateData.toJSON(), options)

  //We do this with silent to prevent the change triggering the reload
  filterStateData.get('state').set(state, {
    silent: true
  })

  filterStateData.set({
    all: allValue,
    checkedDependencies: satisfyDependency(filterStateData, rootState)
  }, {
      silent: true
    })

  //This will trigger the update for the individual view thats boubd to this state object
filterStateData.get('options').set([...options], { silent: updateView ? false: true })
  
  return filterStateData

}



/**
 * A pure function athat defines the application wide form state Array.
 * Using the product data and map comprises a new Array that has the defintions and state
 * for each form filter.
 *
 * Can not use immutabilty here as Form Componets will be bound to any existing State objects
 * 
 * @param  {Backbone.Model} productData The product data recieved from api
 * @param  {Backbone.Model} stateData The current state Data
 * @param  {Array} filterMap The Array of objects that provide label, form type,
 *                           and a means of finding defintions for the form filter in the product data
 * @param  {function} Model The constructor for new State Collection items
 * @return {Array} The new Array of form filter values and state
 */
export function setFilterStateData(productData, stateData, filterMap, Model) {

  const
    formFilters = productData.get('formFilters'),
    procesedKeys = [],
    allValue = stateData.getAll()

  let
    filterStateData


  if (formFilters) {

    filterMap
      //Itreate all filter maps to produce state
      .forEach(
        (filterMapItem, index) => {

          if (filterMapItem.type === 'FormGroup') {

            let groupItemStateData
            filterStateData = stateData.findWhere({
              "key": filterMapItem.key
            }) || getNewGroupStateDataObject(filterMapItem)

            filterStateData.get('items')

          filterMapItem.items.forEach(
              nestedFilterMapItem => {
                groupItemStateData = setFilterStateDataForItem(nestedFilterMapItem, formFilters, filterStateData.get('items'), stateData, allValue, Model)
                procesedKeys.push(filterMapItem.key)
                filterStateData.get('items').push(groupItemStateData)
              }
            )

            ///console.log('group filterStateData : ', filterStateData)

            procesedKeys.push(filterMapItem.key)
          }
          else {

            filterStateData = setFilterStateDataForItem(filterMapItem, formFilters, stateData, stateData, allValue, Model)

          }
          // filterStateData.set('referenceIndex', filterMap.findIndex((item) => item.key == filterStateData.get('key')));


          //console.log('ProductData State Data push module start')
          //This needs to be last after all the silent
          //sets as this is what triggers update
          //We are safe to push the models here as the setFilterStateDataForItem
          //maipulates the same model is it exists so when pushing backbone recognises its the
          //same model.
          stateData.push(filterStateData)

          //console.log('ProductData Update State End')

        })
    // _.sortBy(stateData, (item) => item.get('referenceIndex'));
        
  }
  else {
    //Fail if no formFilters in data
    throw new Error('formFilters was not defined in the Product Data')
  }
}

function getValueForItemType(type,value){
  switch(type){
    case 'CheckboxList': 
    case 'MultiSelect': 
    case  'RadioList': 
    return Array.isArray(value)?value:[value];
    case 'RangeSelector': 
    return {start:value.split(',')[0], end:value.split(',')[1]}
  }
}

export function prefillStateDataWithFiltersFromCookies(stateData, filterMap, model) {
  let filtersFromCookies = getFiltersFromCookies();
  let filterMapItems = [];
  let cookieFilterKey,cookieFilterValues;
  const PreselectionModalFields = {
    show_Preference_fields: [
      "lagerprogramm_ant",
      "vorzugsreihe_ant",
      "standard_ant",
      "All_Approved_Articles",
      "All_Articles"],
    gearboxOverload_Preference_fields: [
      "Overloadedgearbox",
      "Overloadedgearbox_yes"]
  }
  //update values of preselection filters in state
  let cookie, key, value, preSelectionStateItem;

  const getPreselectionFilterItem = () => {
    let item;
    if (_.contains(PreselectionModalFields.show_Preference_fields, key)) {
      item = _.find(stateData.models, (stateItem) => {
        return stateItem.get("type") === "preselectionFilter_show_Preference"
      })
    }
    else if (_.contains(PreselectionModalFields.gearboxOverload_Preference_fields, key)) {
      item = _.find(stateData.models, function (stateItem) {
        return stateItem.get("type") == "preselectionFilter_gearboxOverload_Preference"
      })
    }
    return item ? item : undefined;
  }

  _.each(filtersFromCookies, (cookieFilter) => {
    cookie = cookieFilter.split('=')
    key = cookie[0].replace("[]", "");
    value = cookie[1];

    preSelectionStateItem = getPreselectionFilterItem();

    if (preSelectionStateItem) {
      preSelectionStateItem.set("key", key);
      preSelectionStateItem.get("state").set("value", [value]);
    }

    let matchedItem = _.find(filterMap, (filterMapItem) => {
      return filterMapItem.key === key
    });
    if (matchedItem) {
      // matchedItem.referenceIndex = filterMap.findIndex((item)=>item.key == matchedItem.key);
      filterMapItems.push(matchedItem);
    }
  });

  filterMapItems=_.uniq(filterMapItems,false,(item)=>{return item.key});

  // filterMapItems = _.sortBy(filterMapItems,'referenceIndex');
  _.each(filterMapItems, (item) => {

    if (item.type === "RangeSelector") {
      item.options = { min: 5, max: 440 }
    }
    let filterStateData = setFilterStateDataForItem(item, [], stateData, stateData, '', model, false);

    cookieFilterValues = _.filter(filtersFromCookies, (cookieFilter) => {
      return item.key === cookieFilter.split('=')[0].replace("[]", "");
    });
    cookieFilterValues = _.map(cookieFilterValues,(cookieFilterValue)=>{return cookieFilterValue.split('=')[1]});
    let value = getValueForItemType(item.type, cookieFilterValues);
    filterStateData.get('state').set('value', value);
    stateData.push(filterStateData);
  });
}