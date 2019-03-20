import {Component, OnInit} from '@angular/core';
import jQuery from 'jQuery';
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    private router: Router
  ) {
  }

  ngOnInit() {
    (($) => {
      "use strict";
      /*==================================================================
      [ Validate ]*/
      let input = $('.validate-input .input100');

      $('.validate-form').on('submit', () => {
        let check = true;

        for (let i = 0; i < input.length; i++) {
          if (validate(input[i],i) == false) {
            showValidate(input[i]);
            check = false;
          }
        }

        if (check) {
          check = false;
          return check
        } else {
          return check;
        }
      });


      $('.validate-form .input100').each(function () {
        $(this).focus(function () {
          hideValidate(this);
        });
      });

      function validate(input, index) {
        if ($(input).attr('name') == 'email') {
          if ($(input).val().trim().match(/^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(]?)$/) == null) {
            return false;
          }
        } else if($(input).attr('type') == 'confirmPass' || $(input).attr('name') == 'confirmPass') {
          return $(input).val() === $(input[index+1]).val()
        }else {
          if ($(input).val().trim() == '') {
            return false;
          }
        }
      }

      function showValidate(input) {
        let thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
      }

      function hideValidate(input) {
        let thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
      }


    })(jQuery);
  }

  route(){
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(['/'])
  }

}
