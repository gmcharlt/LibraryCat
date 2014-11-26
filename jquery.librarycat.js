/*
 * LibraryCat - jQuery plugin for adding various enhancements to a
 *              library catalog, including feline domination.
 *
 * Usage:
 *    <script type="text/javascript" src="/path/to/jquery.min.js">
 *    <link rel="stylesheet" href="/path/to/jquery-ui.css" 
 *    <script type="text/javascript" src="/path/to/jquery-ui.min.js">
 *    <script type="text/javascript" src="/path/to/jquery.librarycat.js">
 *    <script type="text/javascript">
 *       $(document).LibraryCat({
 *          cat_image: '/path/to/catpicture.jpg',
 *          cat_perch: '#id',
 *          enable_unapi: true 
 *       });
 *    </script>
 *
 * Copyright (c) 2014 by Galen Charlton <gmcharlt@gmail.com>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

(function ($) {

    $.fn.LibraryCat = function (options) {
        var settings = $.extend({}, $.fn.LibraryCat.defaults, options);

        if (settings.cat_perch !== null) {
            $(settings.cat_perch).on('click.LibraryCat', settings, display_cat);
        }
        if (settings.enable_unapi) {
            display_unapi_widget();
        }

        return this;
    };

    function display_cat(event) {
        // we will not let our cats multiple
        $(this).off('click.LibraryCat');

        // create an image element, starting small and
        // in the upper left corner
        var cat_carrier = document.createElement('img');
        $(cat_carrier).attr('src', event.data.cat_image);
        $(cat_carrier).css('position', 'fixed')
                      .css('height',   '10px')
                      .css('top',      0)
                      .css('left',     0);

        // it is proper that a cat be above it all
        $(cat_carrier).zIndex(1);

        // actually insert into into the document...

        $(this).append(cat_carrier);

        // ... and start kitty on her merry way
        $(cat_carrier).animate({
            height: 200,
            left: '40%',
            top: '40%'
        }, 7500);

        // Lewis Carroll has a lot to answer for
        $(cat_carrier).on('click.LibraryCat', chesire_cat);
    }

    function chesire_cat() {
        // fade in and out...
        $(this).animate({
            opacity: 1.25 - $(this).css('opacity')
        }, 3000);
    }

    function display_unapi_widget() {
        // see if we can find an unapi server
        var servers = $(document).find('link[rel="unapi-server"]');
        if (servers.length == 0) return;

        // then grab the formats
        $.get($(servers[0]).attr('href'), function(data) {
            var formats = new Array;
            $(data).find('format').each(function() {
                formats.push($(this).attr('name'));
            });
    
            // then make widgets
            $('abbr[class="unapi-id"]').each(function(index) {
                var recId = $(this).attr('title');
                var list = document.createElement('ul');
                formats.map( function(format) {
                    var li = document.createElement('li');
                    var a = document.createElement('a');
                    a.setAttribute('href', $(servers[0]).attr('href') + 
                                           '?id=' + recId +
                                           '&format=' + format
                                   );
                    a.innerHTML = format;
                    li.appendChild(a);
                    list.appendChild(li);
                });
                var div = document.createElement('div');
                $(div).css('width', '5em');
                var menu = document.createElement('ul');
                var caption = document.createElement('li');
                caption.innerHTML = 'unAPI';
                caption.appendChild(list);
                menu.appendChild(caption);
                $(menu).menu();
                div.appendChild(menu);
                $(this).append(div);
            });
        }, 'xml');
    }

    $.fn.LibraryCat.defaults = {
        cat_image: 'default_cat.jpg',
        cat_perch: null,
        enable_unapi: false
    }

}(jQuery));
