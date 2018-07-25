import Backbone from 'backbone'
import Marionette from 'backbone.marionette'
import _ from 'underscore'
var draggable = require( "jquery-ui/ui/widgets/draggable" );

var keyCodes = {
    ESC: 27,
    ENTER: 13,
    SPACE: 32
};
const
    modalTemplate = _.template(
        "<div class='modal draggable' tabindex='-1' role='dialog'>" +
        "  <div class='modal-dialog'>" +
        "    <div class='modal-content'>" +
        "      <div class='modal-header'>" +
        "        <h5 class='modal-title'>Modal title</h5>" +
        "        <button type='button' class='close modal-close-button hook--close-modal-button' data-dismiss='modal' aria-label='Close'>" +
        "          <span aria-hidden='true'>&times;</span>" +
        "        </button>" +
        "      </div>" +
        "      <div id='modal-container'></div>" +
        "    </div>" +
        "  </div>" +
        "</div>"),

    ModalView = Marionette.View.extend({
        template: modalTemplate,
        regions: {
            contentRegion: "#modal-container",
        },
        ui: {
            modalOuterContainer: ".modal",
            modalInnerContainer: ".modal-dialog",
            modalTitle: ".modal-title",
            closeButton: ".close"
        },
        shown: false,
        onRender: function () {
            this.activateEvents();
            this.showModal(this.options.view, this.options.title, 1000);
            if(this.options.draggable){
                this.ui.modalInnerContainer.draggable({
                    cursor: 'move',
                    handle: '.modal-header'
                });
                $('.modal.draggable>.modal-dialog>.modal-content>.modal-header').css('cursor', 'move');
            }
        },

        onClose: function () {
            $(document).off("keyup.modal");
            $(window).off("hashchange.modal");
            this.$el.off();
        },

        closeModal: function () {
            var that = this,
                cleanUpInnerContainerStyles = function () {
                    that.ui.modalInnerContainer
                        .removeAttr("style")
                        .removeClass(that.widthClass);
                };

            if (!this.shown) {
                return;
            }

            $(document).off("keydown.modalContent");
            this.$el.off("click.modalContent");
            this.$el.off("keydown.modalContent");

            // this.contentRegion.close();
            this.detachChildView('contentRegion');
            this.ui.modalOuterContainer.addClass("hidden");
            cleanUpInnerContainerStyles();
            this.shown = false;
            this.options.view.trigger('modal:hidden');
        },
        showModal: function (view, title, customWidth) {
            var that = this;
            this.activateEvents();
            this.ui.closeButton.removeClass("hidden");
            var callViewCloseEventHandler = function () {
                if (view && view.events) {
                    var viewCloseEventHandler = view[view.events["click .hook--close-modal-button"]];

                    if (_.isFunction(viewCloseEventHandler)) {
                        viewCloseEventHandler.call(view);
                    }
                }
            };

            $(document).on("keydown.modalContent", function (evt) {
                if (evt.keyCode === keyCodes.ESC) {
                    callViewCloseEventHandler();
                }
            });

            this.$el
                .on("click.modalContent", "#modal-header-close-modal-button", callViewCloseEventHandler)
                .on("keydown.modalContent", "#modal-header-close-modal-button", function (evt) {
                    if (evt.keyCode === keyCodes.ENTER || evt.keyCode === keyCodes.SPACE) {
                        callViewCloseEventHandler();
                    }
                });

            this.ui.modalTitle.text(title);
            this.showChildView('contentRegion', view);
            this.ui.modalOuterContainer.removeClass("hidden");

            if (_.isString(customWidth)) {
                this.widthClass = customWidth;
                this.ui.modalInnerContainer.addClass(customWidth);
            }
            else if (_.isNumber(customWidth)) {
                this.ui.modalInnerContainer.outerWidth(customWidth);
            }

            view.trigger("modal:shown");
            this.shown = true;
        },
        isModalShown: function () {
            return this.shown;
        },
        activateEvents: function () {
            var that = this;

            $(document).on("keyup.modal", function (evt) {
                if (evt.keyCode === keyCodes.ESC) {
                    that.closeModal();
                }
            });

            $(window).on("hashchange.modal", function () {
                that.closeModal();
            });

            this.$el
                .on("click.modal", ".hook--close-modal-button", function () {
                    that.closeModal();
                })
                .on("keydown.modal", ".hook--close-modal-button", function (evt) {
                    if (evt.keyCode === keyCodes.ENTER || evt.keyCode === keyCodes.SPACE) {
                        that.closeModal();
                    }
                });
        }
    });

export default ModalView;

