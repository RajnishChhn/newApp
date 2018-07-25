import Backbone from 'backbone'
import Marionette from 'backbone.marionette'
import _ from 'underscore'
import getCookie from '../utils/cookieManager'
import ModalView from './modal'

const
    password = "test#123",

    isUserLoggedIn = getCookie('yl-isUserLoggedIn')!=="",

    userSvg ="<svg viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'"+
          " style='fill: #007bff; height: 24px; width: 24px; margin-right: 8px;'><title>user</title><path d='M33.5,10.4C33.7,5.1,29.2,1,24,1s-9.8,4.2-9.5,9.4c0.1,1.1,1.1,6.3,1.1,6.3c0.8,4.5,3.8,8.3,8.4,8.3s7.6-3.8,8.4-8.4C32.4,16.6,33.4,11.4,33.5,10.4z'></path><path d='M47,47H1l1.1-8.2c0.5-2.7,2.9-4.3,5.6-4.9L24,31l16.3,2.9c2.7,0.6,5.1,2.2,5.5,4.9L47,47z'></path></svg>",

    loginButton = 
        "<button class='btn yl-login-button yl-app-tools-login' id='yl-app-tools-login'>" + userSvg + "Login</button>",
    logoutButton = 
        "<button class='btn yl-login-button yl-app-tools-logout' id='yl-app-tools-logout'>" + userSvg + "Logout</button>",

    template = _.template(
        isUserLoggedIn ? logoutButton+
        "<div id='Login-modal-container'></div>"
        : loginButton +
        "<div id='Login-modal-container'></div>"        
    ),
    
    loginModalTemplate = _.template(
        "<div class='modal-body'>" +
        "<form>" +
        "<div class='form-group'>" +
        "<label for='password'>Password</label>" +
        "<input type='password' class='form-control' id='password' placeholder='Password'>" +
        "</div>" +
        "</form>" +
        "</div>" +
        "<div class='modal-footer'>" +
        "<button id='login-button' type='submit' class='btn btn-primary hook--close-modal-button data-dismiss='modal'>Login</button>" +
        "<button id='close-button' type='button' class='btn btn-secondary hook--close-modal-button' data-dismiss='modal'>Close</button>" +
        "</div>"
    ),

    logoutConfirmationModalTemplate = _.template(
        "<div class='modal-body'>" +
        "<h3>If you log out, your current input will be lost.</h3>" +
        "<div class='modal-footer'>" +
        "<button id='logout-confirmation-button' type='submit' class='btn btn-primary hook--close-modal-button data-dismiss='modal'>Logout</button>" +
        "<button id='close-button' type='button' class='btn btn-secondary hook--close-modal-button' data-dismiss='modal'>Cancel</button>" +
        "</div>"
    ),
    
    LoginModal = Marionette.View.extend({
        template: loginModalTemplate,
        ui: {
            'userName': '#userName',
            'password': '#password'
        },
        events: {
            "click #login-button": "login",
            "submit": "login"
        },
        initialize: function (options) {
        },
        onRender: function () {
        },
        login: function () {
            let password1 = this.ui.password.val();
            if (password1 === password){
                document.cookie = 'yl-isUserLoggedIn=true';
                document.location.reload();
            }
        }
    }),
    
    LogOutModal = Marionette.View.extend({
        template: logoutConfirmationModalTemplate,
        events: {
            "click #logout-confirmation-button": "logout"
        },
        logout: function () {
            document.cookie = "yl-isUserLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.location.reload();
        }
    }),

    Login = Marionette.View.extend({
        template : template,
        regions: {
            'modalContainer': "#Login-modal-container"
        },
        events: {
            'click .yl-app-tools-login': 'showLoginModal',
            'click .yl-app-tools-logout': 'showLogoutModal'
        },
        showLoginModal: function () {
            var modal = new ModalView({
                view: new LoginModal(),
                title: "Login"
            });
            this.showChildView('modalContainer', modal);
        },
        showLogoutModal:function(){
            var modal = new ModalView({
                view: new LogOutModal(),
                title: "Logout"
            });
            this.showChildView('modalContainer', modal);
        }
    })

export default Login