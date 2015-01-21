/*
 SuperBox v1.0.2
 by Todd Motto: http://www.toddmotto.com
 Latest version: https://github.com/toddmotto/superbox

 Copyright 2013 Todd Motto
 Licensed under the MIT license
 http://www.opensource.org/licenses/mit-license.php

 SuperBox, the lightbox reimagined. Fully responsive HTML5 image galleries.
 */
;
(function ($) {

  $.fn.SuperBox = function (clientOptions) {

    var superbox, superboximg,
        options = {
          superbox: '<div class="superbox-show"></div>',
          /************************************
          * COMPRO updates for Reader
          * 1. Adding width attribute to img
          * 2. Adding close icon
          * 3. Adding additional information/links(superboxinfo) for a book
          *************************************/    
          superboximg: '<img src="" class="superbox-current-img" style="width:25%">',
          superboxclose: '<div class="superbox-close" style="color: #fff"><i class="fa fa-times fa-lg"></div>',         
          superboxinfo:'<div id="imgInfoBox" class="superbox-imageinfo inline-block col-sm-6" > <h1>Image Title</h1><span><p><i>by</i> <strong><span class="superbox-img-author"></span></strong></p><p class="superbox-img-description">Image description</p><p><a href="" class="btn btn-primary btn-sm launch_url">LAUNCH BOOK</a></p></span> </div>'
         /************************************
          * COMPRO updates ends      
          *************************************/
        };

    $.extend(options, clientOptions);
    superbox = $(options.superbox);
    superboximg = $(options.superboximg);
    /************************************
    * COMPRO updates for Reader
    * Additional information/links for a book
    *************************************/  
    superboxinfo = $(options.superboxinfo);
    /************************************
      * COMPRO updates ends      
    *************************************/
    superbox.append(superboximg).append(superboxinfo).append($(options.superboxclose));

    return this.each(function () {

      $(this).on('click', '.superbox-list', function () {

        var currentimg = $(this).find('.superbox-img');
        var imgData = currentimg.data('img');
        superboximg.attr('src', imgData);
        /************************************
         * COMPRO updates for Reader
         * Reading title,description and author from attributes
        *************************************/ 
        var title=currentimg.attr("title");
        var name=currentimg.attr("name");
        var description=currentimg.data("desc");       
        var imgAuthor = currentimg.data('author');  
        superboxinfo.find(">:first-child").text(title);
        superboxinfo.find(".superbox-img-author").text(imgAuthor);  
           superboxinfo.find(".launch_url").attr("href","#/book/"+name);
        superboxinfo.find(".superbox-img-description").text(description);
        /************************************
         * COMPRO updates ends      
         *************************************/  
        if ($('.superbox-current-img').css('opacity') == 0) {
          $('.superbox-current-img').animate({opacity: 1});
        }

        if ($(this).next().hasClass('superbox-show')) {
          superbox.toggle();
        } else {
          superbox.insertAfter(this).css('display', 'block');
        }

        $('html, body').animate({
          scrollTop: superbox.position().top - currentimg.width()
        }, 'medium');

      });

      $(this).on('click', '.superbox-close', function () {
        $('.superbox-current-img').animate({opacity: 0}, 200, function () {
          $('.superbox-show').slideUp();
        });
      });

    });
  };
})(jQuery);