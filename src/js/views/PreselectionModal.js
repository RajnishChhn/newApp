import Backbone from 'backbone'
import Marionette from 'backbone.marionette'
import _ from 'underscore'
import getCookie from '../utils/cookieManager'

const isUserLoggedIn = getCookie('yl-isUserLoggedIn') !== "";

const PreselectionModalFields = {
    showFilters: [
        {
            label: 'On Stock',
            key: "lagerprogramm_ant",
            value: "J"
        }, {
            label: "Preferred Series",
            key: "vorzugsreihe_ant",
            value: "J"
        }, {
            label: "Standard Series",
            key: "standard_ant",
            value: "J"
        }, {
            label: "All Approved Articles",
            key: "All_Approved_Articles",
            value: ""
        }, {
            label: "All Articles",
            key: "All_Articles",
            value: ""
        }
    ],
    gearboxFilters: [
        {
            label: "Without Overload",
            key: "Overloadedgearbox",
            value: "no"
        }, {
            label: "With Overload",
            key: "Overloadedgearbox_yes",
            value: ""
        }
    ]
},

    getRadioButton = (field, name) => {
        return (
            "<div class='form-check'> " +
            "<input id='" + field.key + "' class='form-check-input hook-" + name + "' " +
            "type='radio' name='" + name + "' value='" + field.value + "'>" +
            "<label class='form-check-label' for=preselect-'" + field.key + "'>" + field.label + "</label>" +
            "</div>");
    },
    showFilters = function () {
        var html = "";
        PreselectionModalFields.showFilters.map((item, index) => {
            if (!isUserLoggedIn && (item.key === 'All_Approved_Articles' || item.key === 'All_Articles')) {
                return;
            }
            html += getRadioButton(item, 'show-filters')
        });
        return html;
    },
    gearboxFilters = function () {
        var html = "";
        PreselectionModalFields.gearboxFilters.map((item, index) => {
            html += getRadioButton(item, 'gearbox-filters')
        });
        return html;
    },

    template = _.template(
        "<div class='modal-body'>" +
        "<label>Show</label>" +
        showFilters() +
        "<hr/>" +
        "<label>Overload Gearbox</label>" +
        gearboxFilters() +
        "</div>" +
        "<div class='modal-footer'>" +
        "<button id='ok-button' type='button' class='btn btn-primary hook--close-modal-button data-dismiss='modal'>OK</button>" +
        "<button id='close-button' type='button' class='btn btn-secondary hook--close-modal-button' data-dismiss='modal'>Close</button>" +
        "</div>"
    ),

    PreselectionModal = Marionette.View.extend({
        model: new Backbone.Model(),
        template: template,
        ui: {
            'showFilters': '.hook-show-filters',
            'gearboxFilters': '.hook-gearbox-filters'
        },
        events: {
            "click #ok-button": "fetchProductData",
            "change .hook-show-filters": "updateShowFilters",
            "change .hook-gearbox-filters": "updateGearboxFilters"
        },
        updateShowFilters: function (event) {
            var target = event.target;
            var key = _.find(PreselectionModalFields.showFilters, function (filter) {
                return filter.key === target.id;
            }).key;
            this.showFilters.set('key', key);
            this.showFilters.get('state').set('value', [target.value]);
        },
        updateGearboxFilters: function (event) {
            var target = event.target;
            var key = PreselectionModalFields.gearboxFilters.find((filter) => {
                return filter.key === target.id
            }).key;
            this.gearboxFilters.set('key', key);
            this.gearboxFilters.get('state').set('value', [target.value]);

        },
        initialize: function (options) {
            this.showFilters = this.options.state.findWhere({ type: 'preselectionFilter_show_Preference' })
            this.gearboxFilters = this.options.state.findWhere({ type: 'preselectionFilter_gearboxOverload_Preference' })
            this.model.set(showFilters);
            this.model.set(gearboxFilters);
        },
        onRender: function () {
            var that = this;
            $(_.find(this.ui.showFilters, function (element) {
                return element.id === that.showFilters.get('key')
            })).attr('checked', 'checked');

            $(_.find(this.ui.gearboxFilters, function (element) {
                return element.id === that.gearboxFilters.get('key')
            })).attr('checked', 'checked');
        },
        fetchProductData: function () {
            this.options.state.trigger("state:change");
        }
    })

export default PreselectionModal