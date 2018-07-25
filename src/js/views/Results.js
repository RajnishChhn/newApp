import Backbone from 'backbone'
import Marionette from 'backbone.marionette'
import _ from 'underscore'
import tippy from 'tippy.js'

import ModalView from './modal'
import ProductDetails from './ProductDetails'
import ProductComparisonModal from './ProductComparisonModal'
import { ECANCELED } from 'constants';
let isModalActive = false;
const fields = {
  "Nominal Speed": "nenndrehzahl_ant",
  // "Nominal Torque": "nenndrehmoment_ant",
  "No Load Speed": "leerlaufdrehzahl_ant",
  "Maximum Torque": "anhaltemoment_ant",
  "Stall Torque": "maxmoment_ant",
  "Weight": "gewicht_ant",
  "Nominal Power": "nennleistung_m",
  // "Maximum Output Power": "maximale leistung_m",
  "Nominal Motor Voltage": "nennspannung_m",
  "Nominal Speed": "nenndrehzahl_m",
  "Nominal Torque": "nenndrehmoment_m",
  "Maximum Torque": "maxmoment_m",
  "Stall Torque": "anhaltemoment_m",
  // "Version": "sw_fuer_elektronik",
  // "Friction Torque at No Load": "reibmoment bei leerlauf_m",
  "No Load Speed": "leerlaufdrehzahl_m",
  "Torque Constant": "drehmomentkonstante_m",
  // "Rotor Inertia": "rotorträgheitsmoment_m",
  "Motor Weight": "gewicht_m",
  // "Reduction": "untersetzungsverhältnis_g",
  "Nominal Output Torque": "nenndrehmoment_am_abtrieb_g",
  "Acceleration Torque": "max_beschleunigungsmoment_g",
  "Emergency Stop Torque": "stat_bruchmoment_g",
  "Number of Stages": "stufenzahl_g",
  "Operation Mode": "betriebsart_g",
  "Efficiency": "nennwirkungsgrad_g",
  "Max. Axial Load": "max_axiallast_g",
  "Max. Radial Load": "max_radiallast_g",
  "Shaft Diameter": "ausgangswelle_durchm_g",
  "Shaft Length": "ausgangswelle_laenge_g",
  "Gearbox Weight": "gewicht_g",
  "Brake Type": "arbeitsprinzip_a",
  "Braking Torque": "nenndrehmoment_stat_typ_a",
  "Brake Voltage": "nennspannung_a",
  "Brake Current": "max_nennstrom_a",
  "Encoder Resolution": "impulszahl_a",
  "Encoder Channels": "anzahl_kanaele_a",
  // "Encoder Resolution Single Turn": "enc_single_turn_res_a",
  // "Encoder Resolution Multi Turn": "enc_multi_turn_res_a",
  "Encoder Supply Voltage": "versorgungsspannung_a",
  "Encoder Inverted Signals": "invertierte_signale_a",
  "Cover": "haube_a",
  "Interface": "fuer_elektronik_sw",
  "Softwareart": "softwareart_sw",
  "Continuous Current": "dauerstrom_ee",
  "Peak Current": "spitzenstrom_ee",
  "Control Voltage": "steuerspannung_ee",
  "Power Voltage": "leistungsspannung_ee",
  "Digital Inputs": "eingaenge_ee",
  "Analogue Inputs": "analog_input_ee",
  "Outputs": "ausgaenge_ee"
}
let tooltips;
let selectedProducts = []
const
  template = _.template(
    "<div class='yl-results-container'>" +
    "<header id='yl-results-header' class='yl-rangeselect-head'>" +
    "</header>" +
    "<div id='yl-results-pagination' class=yl-results-pagination></div>" +
    "<section id='yl-results-table' class='yl-results'></section>" +
    "</div>" +
    "<div>" +
    "<button class='btn btn-default yl-results-compare float-right margin-large' disabled>Compare</button>" +
    "<div id='comparison-Modal-Container'></div>" +
    "</div>"
  ),

  headTemplate = _.template(
    "<h4 class='yl-results-head yl-form-group-head'><%= count %> Items</h4>"
  ),

  tableTemplate = _.template(
    "<thead>" +
    "<tr>" +
    "<th>Row#</th>" +
    "<th></th>" +
    "<th>id</th>" +
    "<th>bauart_m</th>" +
    "<th>nennspannung_m</th>" +
    "<th>motor</th>" +
    "<th>getriebe</th>" +
    "<th>nenndrehmoment_ant</th>" +
    "<th>baureihe_a</th>" +
    "<th>baureihe_m</th>" +
    "</tr>" +
    "</thead>" +
    "<tbody></tbody>"
  ),

  toolTipRowTemplate = (
    "<table class='table'>" +
    "<tbody>" +
    "<tr>" +
    "<td>No Load Speed</td>" +
    "<td>Maximum Torque</td>" +
    "<td>Stall Torque</td>" +
    "<td>Maximum Output Power</td>" +
    "</tr>" +
    "<tr>" +
    "<td><%- leerlaufdrehzahl_ant %></td>" +
    "<td><%- anhaltemoment_ant %></td>" +
    "<td><%- maxmoment_ant %></td>" +
    "<td><%- maxabgabeleistung_m %></td>" +
    "</tr>" +
    "<tr style='height:10px'></tr>" +
    "<tr>" +
    "<td>Version</td>" +
    "<td>Brake Type</td>" +
    "<td>Braking Torque</td>" +
    "<td>Encoder Resolution</td>" +
    "</tr>" +
    "<tr>" +
    "<td></td>" +
    "<td><%- arbeitsprinzip_a %></td>" +
    "<td><%- nenndrehmoment_stat_typ_a %></td>" +
    "<td><%- impulszahl_a %></td>" +
    "</tr>" +
    "<tr style='height:10px'></tr>" +
    "<tr>" +
    "<td>Encoder Channels</td>" +
    "<td>Encoder Resolution Single Turn</td>" +
    "<td>Encoder Resolution Multi Turn</td>" +
    "<td>Cover</td>" +
    "</tr>" +
    "<tr>" +
    "<td><%- anzahl_kanaele_a %></td>" +
    "<td><%- enc_singleturn_res_a %></td>" +
    "<td><%- enc_multiturn_res_a %></td>" +
    "<td><%- haube_a %></td>" +
    "</tr>" +
    "<tr style='height:10px'></tr>" +
    "<tr>" +
    "<td>Interface</td>" +
    "<td>Continuous Current</td>" +
    "<td>Peak Current</td>" +
    "<td>Power Voltage</td>" +
    "</tr>" +
    "<tr>" +
    "<td><%- fuer_elektronik_sw %></td>" +
    "<td><%- dauerstrom_ee %></td>" +
    "<td><%- spitzenstrom_ee %></td>" +
    "<td><%- leistungsspannung_ee %></td>" +
    "</tr>" +
    "</tbody></table>"
  ),

  rowTemplate = _.template(
    "<td class='product-row-number'><%- rowNumber %> </td>" +
    "<td class='product-row-checkbox-container'><input class='form-check-input product-row-checkbox' type='checkbox' /></td>" +
    "<td><%- id %></td>" +
    "<td><%- bauart_m %></td>" +
    "<td><%- nennspannung_m %></td>" +
    "<td><%- motor %></td>" +
    "<td><%- getriebe %></td>" +
    "<td><%- nenndrehmoment_ant %></td>" +
    "<td><%- baureihe_a %></td>" +
    "<td><%- baureihe_m %></td>" +
    "<td class='more-details-button-container'><button class='btn btn-default yl-results-more-details'>More Details</button>" +
    "<div id='modal-container'>" +
    "</div>" +
    "<div id='myTemplate-<%= id %>' style='display: none;'>" +
      toolTipRowTemplate +
    "</div>" +
    "</td>"
  ),

  RowView = Marionette.View.extend({
    tagName: 'tr',
    template: rowTemplate,
    events: {
      'mouseenter': 'showTooltip',
      'mouseleave': 'hideTooltip',
      'click .yl-results-more-details': 'showDetailsModal',
      'click .product-row-checkbox': 'setSelectedProduct'
    },
    regions: {
      modalConatiner: '#modal-container'
    },
    onBeforeRender:function(){
      this.model.set("rowNumber", ++this.options.index);
    },
    showTooltip: function (event) {
      //don't show tooltip if modal is active
      if (isModalActive) {
        return;
      }

      //don't show tooltip if checkbox or button is clicekd      
      const eventClasses = event.target.className.split(' ');

      if (eventClasses.includes('product-row-number') ||
        eventClasses.includes('product-row-checkbox') ||
        eventClasses.includes('product-row-checkbox-container') ||
        eventClasses.includes('yl-results-more-details') ||
        eventClasses.includes('more-details-button-container')) {
        return;
      }

      let tooltip = tippy.one('.product-details-row-' + this.model.get('id'), {
        placement: 'bottom',
        html: '#myTemplate-' + this.model.get('id'),
        trigger: 'manual'
      });
      tooltip.show();
    },
    hideTooltip: function () {
      for (const popper of document.querySelectorAll('.tippy-popper')) {
        const instance = popper._tippy

        if (instance.state.visible) {
          instance.popperInstance.disableEventListeners()
          instance.hide()
        }
      }
    },
    showDetailsModal: function () {
      let view = new ProductDetails({ model: this.model });
      view.on('modal:shown', function () {
        isModalActive = true
      });

      view.on('modal:hidden', function () { isModalActive = false })
      var modal = new ModalView({
        view: view,
        title: "Product Details",
        draggable: true
      });
      this.showChildView('modalConatiner', modal)
    },
    setSelectedProduct: function (event) {
      var that = this;
      if (event.target.checked) {
        selectedProducts.push(this.model);
      }
      else {
        selectedProducts = _.reject(selectedProducts, function (product) {
          return that.model.cid === product.cid
        });
      }
    },
    onRender() {
      this.$el.addClass('product-details-row-' + this.model.get('id'))
    }
  }),

  TableBody = Marionette.CollectionView.extend({
    tagName: 'tbody',
    childView: RowView,
    childViewOptions: function(model, index) {
      return {
        index: index
      }
    },
    
    onRender(){
      selectedProducts = [];      
    }
  }),

  ResultsView = Marionette.View.extend({

    tagName: 'table',
    className: 'table table-hover',
    template: tableTemplate,

    regions: {
      body: {
        el: 'tbody',
        replaceElement: true
      }
    },

    onRender() {
      this.showChildView('body', new TableBody({
        collection: this.collection
      }));
    }
  }),

  paginationTemplate = _.template(
    "<nav aria-label='Page navigation example'>" +
    "<ul class='pagination'>" +
    "<li class='page-item page-previous'><a class='page-link' href='#''>Previous</a></li>" +
    "<% for(var i=1; i<=pages; i++) { %>" +
    "<li class='page-item' data-page=<%= i %>><a class='page-link' href='#'><%= i %></a></li>" +
    "<% } %>" +
    "<li class='page-item page-next'><a class='page-link' href='#'>Next</a></li>" +
    "</ul>" +
    "</nav>"
  ),

  ResultsPagination = Marionette.View.extend({
    initialize(options) {
      if (this.model) {
        this.model.on('sync', this.render, this)
      }
    },

    events: {
      'click .page-item': 'onPageClick',
      'click .page-previous': 'onPagePrevious',
      'click .page-next': 'onPageNext'
    },

    onPageClick(e) {
      this.model.setPageAndFetch(Backbone.$(e.currentTarget).data('page'))
    },

    onPageNext(e) {
      this.model.incrementPageAndFetch()
    },

    onPagePrevious(e) {
      this.model.decrementPageAndFetch()
    },

    getCurrentPage() {
      const currentPage = this.model.get('currentPage')
      return currentPage || 0
    },

    getPageCount() {
      const pages = this.model.get('pages')
      return pages || 0
    },
    render() {
      this.el.innerHTML = paginationTemplate({
        pages: this.getPageCount()
      })
      return this
    }

  }),


  ResultHeader = Marionette.View.extend({

    initialize(options) {
      if (this.model) {
        this.model.on('sync', this.render, this)
      }
    },

    getContentCount() {
      const count = this.model.get('cnt')
      return count || 0
    },

    render() {
      this.el.innerHTML = headTemplate({
        count: this.getContentCount()
      })
      return this
    }
  }),

  Results = Marionette.View.extend({

    template: template,

    regions: {
      header: "#yl-results-header",
      pagination: "#yl-results-pagination",
      resultsTable: "#yl-results-table",
      modalContainer: '#comparison-Modal-Container'
    },

    attributes: {
      class: 'yl-results'
    },
    ui: {
      'compareButton': '.yl-results-compare',
    },
    events: {
      'click .yl-results-compare': 'compareSelectedProducts',
      'click .product-row-checkbox': 'handleCheckboxClick'
    },
    initialize(options) {
      this.collection = this.model.get('resultsData')
    },

    compareProducts: function (model1, model2) {
      var difference = [];
      var i;
      _.each(fields, function (value, key) {
        if (model1.get(value) !== model2.get(value)) {
          difference.push(value);
        }
      });
      model2.set('diff', difference);
    },

    compareSelectedProducts: function () {
      this.compareProducts(selectedProducts[0], selectedProducts[1]);
      if (selectedProducts[2]) {
        this.compareProducts(selectedProducts[1], selectedProducts[2]);
      }
      var Products = new Backbone.Model();
      Products.set({
        product1: selectedProducts[0],
        product2: selectedProducts[1],
        product3: selectedProducts[2]
      });

      var modal = new ModalView({
        view: new ProductComparisonModal({ model: Products }),
        title: "Product Comparison"
      });
      this.showChildView('modalContainer', modal);
    },

    handleCheckboxClick: function () {
      this.ui.compareButton.attr('disabled', selectedProducts.length < 2);
      $('.product-row-checkbox').not(':checked').attr('disabled', selectedProducts.length >= 3);
    },
    onRender() {
      this.showChildView('header',
        new ResultHeader({
          model: this.model
        })
      )
      this.showChildView('pagination',
        new ResultsPagination({
          model: this.model
        })
      )
      this.showChildView('resultsTable',
        new ResultsView({
          collection: this.collection
        })
      )

      ResultsPagination
    }

  })

export default Results