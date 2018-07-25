import Backbone from 'backbone'
import Marionette from 'backbone.marionette'
import _ from 'underscore'

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
    // "Nominal Speed": "nenndrehzahl_m",
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

const
    getTableRows = function () {
        var row = "";
        _.each(fields, function (value, key) {
            row += "<tr><td>" + key + "</td><td><%= product1.get('" + value + "') %></td>" +
                "<td class = <%= product2.get('diff').includes('" + value + "')?'difference':''%>><%= product2.get('" + value + "')%></td>" +
                "<% if(product3){ %>" +
                "<td class = <%= product3.get('diff').includes('" + value + "')?'difference':''%>><%= product3.get('" + value + "')%></td>" +
                "<% } %>" +
                "</tr>"
        });
        return row;
    },
    rows = getTableRows(),
    tableTemplate = _.template(
        "<div class='modal-body'>" +
            "<table class='table'>" +
            "<thead>" +
                "<tr>" +
                "<th>Property</th>" +
                "<th><%= product1.get('rowNumber')%></th>" +
                "<th><%= product2.get('rowNumber')%></th>" +
                "<% if(product3){ %>" +
                    "<th><%= product3.get('rowNumber')%></th>" +
                "<% } %>" +                
                "</tr>" +
            "</thead>" +
            "<tbody>" +
                rows +
            "</tbody ></table > "+
        "</div>"+
        "<div class='modal-footer'>" +
            "<button id='close-button' type='button' class='btn btn-secondary hook--close-modal-button' data-dismiss='modal'>Close</button>" +
        "</div>"
    ),
    ProductComparisonModal = Marionette.View.extend({
        template: tableTemplate,
    })

export default ProductComparisonModal
