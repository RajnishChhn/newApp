import Backbone from 'backbone'
import Marionette from 'backbone.marionette'
import _ from 'underscore'

import '../scss/index.scss'

import RootView from './views/RootView'

import ProductData from './data/ProductData'
import StateData from './data/StateData'

import {
  setFilterStateData, prefillStateDataWithFiltersFromCookies
}
  from './utils'

import jquery from 'jquery'
import select2 from '../../vendor/select2/js/select2.full.js'
import rangeslider from '../../vendor/ion-rangeSlider/js/ion-rangeSlider/ion.rangeSlider.min.js'

Backbone.$ = global.jQuery = global.jquery = global.$ = jquery

global.$.ajaxSetup({
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
});

const

  formFilterMaps = [{
    label: "Motortyp",
    type: "CheckboxList",
    key: "motortyp_Options"
  },
  {
    label: "Voltage",
    type: "RangeSelector",
    key: "nennspannung_m_Range"
  },
  {
    label: "Gearbox",
    type: "CheckboxList",
    key: "gearboxtyp_Options"
  },
  {
    label: "Controller - Regulation",
    type: "CheckboxList",
    key: "controller_regulation_Options",
    dependencies: [{
      query: 'visible',
      key: 'motortyp_Options',
      value: 'DC Brushless_with_Controller'
    }]
  },
  {
    label: "Controller - Triggering Via",
    type: "CheckboxList",
    key: "controller_triggering_Options",
    dependencies: [{
      query: 'visible',
      key: 'motortyp_Options',
      value: 'DC Brushless_with_Controller'
    }]
  },
  {
    label: "Attachment",
    type: "CheckboxList",
    key: "attachment_Options"
  },
  {
    label: "Brake",
    type: "CheckboxList",
    key: "braketyp_Options",
    dependencies: [{
      query: 'visible',
      key: 'attachment_Options',
      value: 'with_Brake'
    }]
  },
  {
    label: "Brake Voltage",
    type: "RangeSelector",
    key: "nennspannung_a_Range",
    dependencies: [{
      query: 'visible',
      key: 'attachment_Options',
      value: 'with_Brake'
    }]
  },
  {
    label: "Brake Torque",
    type: "RangeSelector",
    key: "nenndrehmoment_stat_typ_a_Range",
    dependencies: [{
      query: 'visible',
      key: 'attachment_Options',
      value: 'with_Brake'
    }]
  },
  {
    label: "Encoder type",
    type: "CheckboxList",
    key: "encodertyp_Options",
    dependencies: [{
      query: 'visible',
      key: 'attachment_Options',
      value: 'with_Encoder'
    }]
  },
  {
    label: "Encoder Voltage",
    type: "RangeSelector",
    key: "versorgungsspannung_a_Range",
    dependencies: [{
      query: 'visible',
      key: 'attachment_Options',
      value: 'with_Encoder'
    }]
  },
  {
    label: "Encoder Channels",
    type: "RangeSelector",
    key: "anzahl_kanaele_a_Range",
    dependencies: [{
      query: 'visible',
      key: 'attachment_Options',
      value: 'with_Encoder'
    }]
  },
  {
    label: "Encoder Resolution",
    type: "RangeSelector",
    key: "impulszahl_a_Range",
    dependencies: [{
      query: 'visible',
      key: 'attachment_Options',
      value: 'with_Encoder'
    }]
  },
  {
    label: "Cover",
    type: "CheckboxList",
    key: "ENTSTOERT_BESCHREIBUNG_M_Options",
    dependencies: [{
      query: 'visible',
      key: 'attachment_Options',
      value: 'with_Brake'
    },
    {
      query: 'visible',
      key: 'attachment_Options',
      value: 'with_Encoder'
    }]
  },
  {
    type: "FormGroup",
    key: "fm_1",
    config: {
      collapsable: true
    },
    items: [{
      label: "Baureihe",
      type: "MultiSelect",
      key: "baureihe_g_Options",
      config: {
        search: true,
        multiple: false
      }
    },
    {
      label: "Suppression",
      type: "MultiSelect",
      key: ["attachment_Options","motortyp_Options"],
      // options: [{
      //   label: "To come",
      //   val: "0"
      // }],
      config: {
        multiple: true
      },
      dependencies: [{
        query: 'visible',
        key: 'motortyp_Options',
        value: 'DC_Brushtype'
      }]
    }
    ]
  }
  ],

  App = Marionette.Application.extend({

    region: '#app',
    initialize: function (options) {

      this.model = new StateData()
      prefillStateDataWithFiltersFromCookies(this.model,formFilterMaps, Backbone.Model);
      this.productData = new ProductData(null, {
        state: this.model
      }),

        this.productData.on('sync',
          () => {
            setFilterStateData(this.productData, this.model, formFilterMaps, Backbone.Model);
          })

      this.productData.fetch()
    },

    onStart() {
      this.showView(new RootView({
        model: this.model,
        productData: this.productData
      }));
    }
  }),
  app = new App()



app.start()