import Backbone from 'backbone'
import _ from 'underscore'
import {getFiltersFromCookies, setFiltersInCookies} from "../utils/cookieManager"

const

  ProductData = Backbone.Model.extend({

    initialize(attrs, options) {
      this.state = options.state
      this.parameters = []
      this.currentPage = 1
      this.state.on('state:change', () => {
        this.setParametersAndFetch()
      })
      this.set({
        resultsData: new Backbone.Collection()
      })
      this.setParameters();
      this.setParametersFromCookies();
    },

    reset() {

      const
        resetStateObject = stateObject => {
          stateObject.get('state').set('value', undefined, {
            silent: true
          })
        },
        resetPreselectionFilters = () => {
          var preselectionFilter = this.state.findWhere({ type: 'preselectionFilter_show_Preference' });
          preselectionFilter.set('key', 'lagerprogramm_ant', { silent: true });
          preselectionFilter.get('state').set('value', ['J'], { silent: true });

          preselectionFilter = this.state.findWhere({ type: 'preselectionFilter_gearboxOverload_Preference' });
          preselectionFilter.set('key', 'Overloadedgearbox');
          preselectionFilter.get('state').set('value', ['no'], { silent: true });
        }

      this.currentPage = 1;

      this.state.forEach(
        state => {

          if (state.get('type') === 'FormGroup') {
            state.get('items')
              .forEach(groupStateObject => {
                resetStateObject(groupStateObject)
              })
          }
          else {
            resetStateObject(state)
          }
        }
      )
      resetPreselectionFilters();
      this.state.trigger('state:change')
    },

    fetch(options) {
      //Force request trigger as it wasn't heppening
      this.trigger('request')
      Backbone.Model.prototype.fetch.call(this, options)
    },

    setPageAndFetch(page) {
      this.page = page
      this.fetch()
    },

    incrementPageAndFetch(page) {
      this.currentPage += 1
      this.fetch()
    },

    decrementPageAndFetch(page) {
      this.currentPage -= 1
      this.fetch()
    },

    setParameters() {
      this.parameters = []
      let cookieFilterCollection = [];
      let originalKey = '';

      const

        getParamtersFromMultiSelectFilter = (value) => {
          let key, param, params = [], keyValuePair = [];

          value.forEach(val => {
            keyValuePair = val.split(':');
            originalKey = keyValuePair[0];
            key = keyValuePair[0].replace(/_Options|_Range/, '');
            param = `${key}[]=${keyValuePair[1]}`;

            params.push(param);
            cookieFilterCollection.push(`${originalKey}[]=${keyValuePair[1]}`);
          });
          return params;
        },

        getParameterFromStateObject = stateObject => {

          let key, value, param, params = [];
          key =  stateObject.get('key');

          if (key === 'suppression_m_Options' ||
            key === 'All_Approved_Articles' ||
            key === 'All_Articles' ||
            key === 'Overloadedgearbox_yes'
          ) {
            cookieFilterCollection.push(`${key}=''`)            
            return
          }

          value = stateObject.get('state').get('value')
          console.log(value);
          if (!value) {
            return
          }
          if (stateObject.get('type') === 'MultiSelect' && Array.isArray(key)) {
            return getParamtersFromMultiSelectFilter(value);
          }
          else {
            originalKey = key;
            key = key.replace(/_Options|_Range/, '')
          }
          if (stateObject.get('type') === 'RangeSelector') {
            if (stateObject.get('state').get('isChanged')) {
              const {
                start: min,
                end: max
              } = value
              param = `${key}=${min},${max}`
              params.push(param)
              cookieFilterCollection.push(`${originalKey}=${min},${max}`)
            }
          }
          else {
            value.forEach(val => {
              param = `${key}[]=${val}`
              params.push(param)
              cookieFilterCollection.push(`${originalKey}[]=${val}`)
            })
          }
        
          return params

        },

        addParameters = params => {
          if (params && params.length > 0) {
            this.parameters = [...this.parameters, ...params]
          }
        }

      this.state.forEach(stateObject => {
        if (stateObject.get('type') === 'FormGroup') {
          stateObject.get('items')
            .forEach(groupStateObject => {
              addParameters(getParameterFromStateObject(groupStateObject))
            })
        }
        else {
          addParameters(getParameterFromStateObject(stateObject))
        }
      });


      setFiltersInCookies(cookieFilterCollection);
    },

    setParametersAndFetch() {
      this.setParameters()
      this.fetch()
    },

    /*
    Parse the response data.
    This is using an Adaptor pattern.
    We do this to ensure this model is control of its API.
    If the data response changes then this is one point of change.
     */
    parse(data, options) {

      this.get('resultsData').reset(data.results)

      const {
        cnt,
        currentPage,
        pages
      } = data

      this.currentPage = currentPage
      data.filters.ENTSTOERT_BESCHREIBUNG_M_Options = [{ val: "J", cnt: 17155 }]
      return {
        cnt,
        currentPage,
        pages,
        ////this shou
        //currentPage: this.page,
        formFilters: data.filters,
        resultsData: this.get('resultsData')
      }
    },
    setParametersFromCookies(){
      let that = this;
      let filtersFromCookies = getFiltersFromCookies();
      _.each(filtersFromCookies, (cookieFilter) => {
        cookie = cookieFilter.split('=')
        key = cookie[0].replace("[]", "");
        value = cookie[1];
        that.parameters.push(`${key}[]=${val}`)
      
    },
    url() {
      ///Add urls params
      ///
      //console.log('url para,s  : ', this.parameters)
      let uri = `https://filter111.herokuapp.com/filter?page=${this.currentPage}`
      return this.parameters && this.parameters.length > 0 ?
        `${uri}&${this.parameters.join('&')}` : uri
      //
    }
  })

export default ProductData