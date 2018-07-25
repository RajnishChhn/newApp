import Backbone from 'backbone'
import Marionette from 'backbone.marionette'
import _ from 'underscore'
import Plotly from 'plotly.js-dist'

const
    tableTemplate = _.template(
        "<div class='modal-body'>" +

        "<table class='table'>" +
        "<tbody>" +
        "<tr><td>Nominal Speed</td><td><%= nenndrehzahl_m %></td></tr>" +
        // "<tr><td>Nominal Torque</td><td><%= nenndrehmoment_m %></td></tr>" +
        "<tr><td>No Load Speed</td><td><%= leerlaufdrehzahl_m %></td></tr>" +
        "<tr><td>Maximum Torque</td><td><%= maxmoment_m %></td></tr>" +
        "<tr><td>Stall Torque</td><td><%= anhaltemoment_m %></td></tr>" +
        "<tr><td>Weight</td><td><%= gewicht_ant %></td></tr>" +
        "<tr><td>Nominal Power</td><td><%= nennleistung_m %></td></tr>" +
        // "<tr><td>Maximum Output Power</td><td><%= maximale leistung_m %></td></tr>" +
        "<tr><td>Nominal Motor Voltage</td><td><%= nennspannung_m %></td></tr>" +
        // "<tr><td>Version</td><td><%= sw_fuer_elektronik %></td></tr>" +
        // "<tr><td>Friction Torque at No Load</td><td><%= reibmoment bei leerlauf_m %></td></tr>" +
        "<tr><td>Torque Constant</td><td><%= drehmomentkonstante_m %></td></tr>" +
        // "<tr><td>Rotor Inertia</td><td><%= rotorträgheitsmoment_m %></td></tr>" +
        "<tr><td>Motor Weight</td><td><%= gewicht_m %></td></tr>" +
        // "<tr><td>Reduction</td><td><%= untersetzungsverhältnis_g %></td></tr>" +
        "<tr><td>Nominal Output Torque</td><td><%= nenndrehmoment_am_abtrieb_g %></td></tr>" +
        "<tr><td>Acceleration Torque</td><td><%= max_beschleunigungsmoment_g %></td></tr>" +
        "<tr><td>Emergency Stop Torque</td><td><%= stat_bruchmoment_g %></td></tr>" +
        "<tr><td>Number of Stages</td><td><%= stufenzahl_g %></td></tr>" +
        "<tr><td>Operation Mode</td><td><%= betriebsart_g %></td></tr>" +
        "<tr><td>Efficiency</td><td><%= nennwirkungsgrad_g %></td></tr>" +
        "<tr><td>Max. Axial Load</td><td><%= max_axiallast_g %></td></tr>" +
        "<tr><td>Max. Radial Load</td><td><%= max_radiallast_g %></td></tr>" +
        "<tr><td>Shaft Diameter</td><td><%= ausgangswelle_durchm_g %></td></tr>" +
        "<tr><td>Shaft Length</td><td><%= ausgangswelle_laenge_g %></td></tr>" +
        "<tr><td>Gearbox Weight</td><td><%= gewicht_g %></td></tr>" +
        "<tr><td>Brake Type</td><td><%= arbeitsprinzip_a %></td></tr>" +
        "<tr><td>Braking Torque</td><td><%= nenndrehmoment_stat_typ_a %></td></tr>" +
        "<tr><td>Brake Voltage</td><td><%= nennspannung_a %></td></tr>" +
        "<tr><td>Brake Current</td><td><%= max_nennstrom_a %></td></tr>" +
        "<tr><td>Encoder Resolution</td><td><%= impulszahl_a %></td></tr>" +
        "<tr><td>Encoder Channels</td><td><%= anzahl_kanaele_a %></td></tr>" +
        // "<tr><td>Encoder Resolution Single Turn</td><td><%= enc_single_turn_res_a %></td></tr>" +
        // "<tr><td>Encoder Resolution Multi Turn</td><td><%= enc_multi_turn_res_a %></td></tr>" +
        "<tr><td>Encoder Supply Voltage</td><td><%= versorgungsspannung_a %></td></tr>" +
        "<tr><td>Encoder Inverted Signals</td><td><%= invertierte_signale_a %></td></tr>" +
        "<tr><td>Cover</td><td><%= haube_a %></td></tr>" +
        "<tr><td>Interface</td><td><%= fuer_elektronik_sw %></td></tr>" +
        "<tr><td>Softwareart</td><td><%= softwareart_sw %></td></tr>" +
        "<tr><td>Continuous Current</td><td><%= dauerstrom_ee %></td></tr>" +
        "<tr><td>Peak Current</td><td><%= spitzenstrom_ee %></td></tr>" +
        "<tr><td>Control Voltage</td><td><%= steuerspannung_ee %></td></tr>" +
        "<tr><td>Power Voltage</td><td><%= leistungsspannung_ee %></td></tr>" +
        "<tr><td>Digital Inputs</td><td><%= eingaenge_ee %></td></tr>" +
        "<tr><td>Analogue Inputs</td><td><%= analog_input_ee %></td></tr>" +
        "<tr><td>Outputs</td><td><%= ausgaenge_ee %></td></tr>" +
        "</tbody ></table > " +
        "<div id='plot'></div>" +
        "</div>" +
        "<div class='modal-footer'>" +
        "<button id='close-button' type='button' class='btn btn-secondary hook--close-modal-button' data-dismiss='modal'>Close</button>" +
        "</div>"

    ),
    ProductDetails = Marionette.View.extend({
        template: tableTemplate,
        ui:{
            "plot":"#plot"
        },
        onAttach:function() { 
            // this.draw();
        },
    })

export default ProductDetails
