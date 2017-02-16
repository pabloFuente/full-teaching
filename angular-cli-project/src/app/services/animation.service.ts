import { Injectable } from '@angular/core';

@Injectable()
export class AnimationService {

  constructor() { }

  animateIfSmall() {
    if($(window).width() <= 600 || $(window).height() <= 600) $('html,body').animate({scrollTop:0},200);
  }

  animateToBottom(selector: string, ms: number) {
    $(selector).stop().animate({
      scrollTop: $(selector)[0].scrollHeight
    }, ms);
  }

}
