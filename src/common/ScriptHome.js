var $ = require ('jquery')

//funciones para home menu
function showDiv(currentElement) {
  $(".content").css("display", "none");
  $(".cont1").css("display", "block");
}

function showDiv2(currentElement) {
  $(".content").css("display", "none");
  $(".cont2").css("display", "block");
}

function showDiv3(currentElement) {
  $(".content").css("display", "none");
  $(".cont3").css("display", "block");
}

function showDiv4(currentElement) {
  $(".content").css("display", "none");
  $(".cont4").css("display", "block");
}

function showRel1(currentElement) {
  $(".minicard").not(".rela1").css("display", "none");
  $(".botones").css("display", "none");
  $(".rela1").addClass("rela1active");
  $(".backbtn").css("display", "block");
}
function showRel2(currentElement) {
  $(".minicard").not(".rela2").css("display", "none");
  $(".botones").css("display", "none");
  $(".rela2").addClass("rela2active");
  $(".backbtn").css("display", "block");
}
function showRel3(currentElement) {
  $(".minicard").not(".rela3").css("display", "none");
  $(".botones").css("display", "none");
  $(".rela3").addClass("rela3active");
  $(".backbtn").css("display", "block");
}
function showRel4(currentElement) {
  $(".minicard").not(".rela4").css("display", "none");
  $(".botones").css("display", "none");
  $(".rela4").addClass("rela4active");
  $(".backbtn").css("display", "block");
}
function showRel5(currentElement) {
  $(".minicard").not(".rela5").css("display", "none");
  $(".botones").css("display", "none");
  $(".rela5").addClass("rela5active");
  $(".backbtn").css("display", "block");
  $(".deforestacion").css("display", "block");
}
// function showRel6(currentElement) {
//   $(".minicard").not(".rela6").css("display", "none");
//   $(".botones").css("display", "none");
//   $(".rela6").addClass("rela6active");
//   $(".backbtn").css("display", "block");
//   $(".degradacion").css("display", "block");
//       google.charts.load('current', {'packages':['scatter']});
//       google.charts.setOnLoadCallback(drawChart);
//
//       function drawChart () {
//
//         var data = new google.visualization.DataTable();
//         data.addColumn('number', 'Bosque Degradado 2002');
//         data.addColumn('number', 'Representación de SP sensibles');
//
//         data.addRows([
//             [1.115, 80.358],
//             [0.083, 21.606],
//             [ , 23.603],
//             [1.202, 76.731],
//             [0.091, 140.972],
//             [ , 6.967],
//             [1.015, 52.058],
//             [ , 41.717],
//             [0.045, 55.946],
//             [ , 80.084],
//             [2.678, 92.972],
//             [1.129, 20.513],
//             [0.012, 38.197]
//         ]);
//
//         var options = {
//           width: 900,
//           height: 500,
//           backgroundColor: { fill:'transparent' },
//           hAxis: {title: '',  titleTextStyle: {color: '#e84a5f'}, gridlines: {color: '#2a363b'}, textStyle: {color: '#424242', fontSize: 12} },
//           vAxis: {title: '', titleTextStyle: {color: '#e84a5f'}, minValue: 0, gridlines: {color: '#2a363b'}, format: 'short', textStyle: {color: '#424242', fontSize: 12}},
//           chartArea: { backgroundColor: 'transparent', left: 20, bottom: 20},
//           colors:['#e84a5f'],
//           legend: 'none'
//         };
//
//         var chart = new google.charts.Scatter(document.getElementById('chart_degradacion'));
//
//         chart.draw(data, google.charts.Scatter.convertOptions(options));
//       }
// }
// function showRel7(currentElement) {
//   $(".minicard").not(".rela7").css("display", "none");
//   $(".botones").css("display", "none");
//   $(".rela7").addClass("rela7active");
//   $(".backbtn").css("display", "block");
// }
// function showRel8(currentElement) {
//   $(".minicard").not(".rela8").css("display", "none");
//   $(".botones").css("display", "none");
//   $(".rela8").addClass("rela8active");
//   $(".backbtn").css("display", "block");
// }

//tabs para home menu

$('menu button').on('click', function(){
  $('menu button').removeClass('active');
  $(this).addClass('active');
});

// //isotope
// $(document).ready(function() {
//
//   $.Isotope.prototype._getCenteredMasonryColumns = function() {
//       this.width = this.element.width();
//       var parentWidth = this.element.parent().width();
//       var colW = this.options.masonry && this.options.masonry.columnWidth || // i.e. options.masonry && options.masonry.columnWidth
//       this.$filteredAtoms.outerWidth(true) || // or use the size of the first item
//       parentWidth; // if there's no items, use size of container
//       var cols = Math.floor(parentWidth / colW);
//       cols = Math.max(cols, 1);
//       this.masonry.cols = cols; // i.e. this.masonry.cols = ....
//       this.masonry.columnWidth = colW; // i.e. this.masonry.columnWidth = ...
//   };
//   $.Isotope.prototype._masonryReset = function() {
//       this.masonry = {}; // layout-specific props
//       this._getCenteredMasonryColumns(); // FIXME shouldn't have to call this again
//       var i = this.masonry.cols;
//       this.masonry.colYs = [];
//           while (i--) {
//           this.masonry.colYs.push(0);
//       }
//   };
//   $.Isotope.prototype._masonryResizeChanged = function() {
//       var prevColCount = this.masonry.cols;
//       this._getCenteredMasonryColumns(); // get updated colCount
//       return (this.masonry.cols !== prevColCount);
//   };
//   $.Isotope.prototype._masonryGetContainerSize = function() {
//       var unusedCols = 0,
//       i = this.masonry.cols;
//           while (--i) { // count unused columns
//           if (this.masonry.colYs[i] !== 0) {
//               break;
//           }
//           unusedCols++;
//       }
//       return {
//           height: Math.max.apply(Math, this.masonry.colYs),
//           width: (this.masonry.cols - unusedCols) * this.masonry.columnWidth // fit container to columns that have been used;
//       };
//   };
//
//   var $container;
//   var filters = {};
//   $(function(){
//       $container = $('#filter-container');
//     var $filterDisplay = $('#filter-display');
//       $container.imagesLoaded( function(){
//       $container.isotope({
//           itemSelector : '.item',
//           sortBy : 'random'
//       });
//     });
//     var numItemsDisp = $('div.item:not(.isotope-hidden)').length;
//     $filterDisplay.append( '<span class="filter-label data-counter pull-right">Mostrando todos los&nbsp;'+numItemsDisp+'&nbsp;indicadores</span>' );
//     var group = '';
//       // filter on click
//       $('.filter a').click(function(){
//         // we can gtfo directly if filter disabled
//         if ($(this).hasClass('disabled') ){
//           return false;
//         }
//         var $this = $(this);
//         var $optionSet = $(this).parents('.option-set');
//       group = $optionSet.attr('data-filter-group');
//       // store filter value in object
//       var filterGroup = filters[ group ];
//         if ( !filterGroup ) {
//         filterGroup = filters[ group ] = [];
//       }
//         var isAll = $this.hasClass('all');
//       // reset filter group
//       if ( isAll ) {
//         Array.prototype.remove = function(from, to) {
//           var rest = this.slice((to || from) + 1 || this.length);
//           this.length = from < 0 ? this.length + from : from;
//           return this.push.apply(this, rest);
//         };
//         filters[ group ].remove(0,-1)
//       }
//         var index = $.inArray($this.attr('data-filter-value'), filterGroup );
//         if ( !isAll && index === -1 ) {
//             // push filter to group
//             filters[ group ].push($this.attr('data-filter-value') );
//         }
//         else if ( !isAll ) {
//           // remove filter from group
//           filters[ group ].splice( index, 1 );
//       }
//       // class toggling
//       if ($this.hasClass('active') ) {
//         $this.removeClass('active');
//       }
//       else {
//         $this.addClass('active');
//       }
//       // let's do some filtering :>
//       var comboFilter = getComboFilter( filters );
//         $container.isotope({ filter: comboFilter });
//         // gotta check and set those disabled filters:
//       var $that = $(this);
//       // metas
//       $('a.metas:not(.clone)').each(function() {
//         var $this = $(this);
//         var getVal = $this.attr('data-filter-value');
//         var numItems = $('div.item'+getVal+':not(.isotope-hidden)').length;
//         if(!$(this).hasClass('active') && !$that.hasClass('metas') ){
//           if(numItems == 0){
//             $this.addClass('disabled');
//           }
//           else {
//             $this.removeClass('disabled');
//           }
//         }
//         else if( $this.hasClass('active') && $this.hasClass('disabled') ){
//           $this.removeClass('disabled');
//         }
//         else if(!$(this).hasClass('active') ) {
//           if(numItems > 0){
//             $this.removeClass('disabled');
//           }
//         }
//       });
//       // perb
//       $('a.perb:not(.clone)').each(function() {
//         var $this = $(this);
//         var getVal = $this.attr('data-filter-value');
//         var numItems = $('div.item'+getVal+':not(.isotope-hidden)').length;
//         if(!$(this).hasClass('active') && !$that.hasClass('perb') ){
//           if(numItems == 0){
//             $this.addClass('disabled');
//           }
//           else {
//             $this.removeClass('disabled');
//           }
//         }
//         else if( $this.hasClass('active') && $this.hasClass('disabled') ){
//           $this.removeClass('disabled');
//         }
//         else if(!$(this).hasClass('active') ) {
//           if(numItems > 0){
//             $this.removeClass('disabled');
//           }
//         }
//       });
//       // ecospp
//       $('a.ecospp:not(.clone)').each(function() {
//         var $this = $(this);
//         var getVal = $this.attr('data-filter-value');
//         var numItems = $('div.item'+getVal+':not(.isotope-hidden)').length;
//         if(!$(this).hasClass('active') && !$that.hasClass('ecospp') ){
//           if(numItems == 0){
//             $this.addClass('disabled');
//           }
//           else {
//             $this.removeClass('disabled');
//           }
//         }
//         else if( $this.hasClass('active') && $this.hasClass('disabled') ){
//           $this.removeClass('disabled');
//         }
//         else if(!$(this).hasClass('active') ) {
//           if(numItems > 0){
//             $this.removeClass('disabled');
//           }
//         }
//       });
//
//       // update filter display
//         var arrLbl = [];
//         arrLbl = comboFilter.split('.');
//         // before iterating we empty previous display vals
//         $filterDisplay.empty();
//       // clone method for filter display
//       var clone = 'clone';
//       var cloneId = 0; // because cloning an id attr just wrong :>
//       $('a.active').each(function() {
//         cloneId++;
//         $(this).clone().appendTo($filterDisplay).attr('id',clone+cloneId).addClass('clone');
//       });
//       $('a.clone').on('click', function() {
//         var that = $(this);
//         var parent = that.attr('data-filter-value');
//         $('div.filter').find(parent).each(function() {
//           $(this).trigger('click');
//         });
//       });
//       // resolves any outstanding issues with disableds
//       // TODO: Find a way around using indexOf this way. Lots of unneccesary overhead.
//       if ( comboFilter.indexOf('perb') == -1
//         && comboFilter.indexOf('ecospp') == -1
//         && comboFilter.indexOf('metas') > 0 ){
//             $('a.metas:not(.clone)').removeClass('disabled');
//         }
//       if ( comboFilter.indexOf('metas') == -1
//         && comboFilter.indexOf('ecospp') == -1
//         && comboFilter.indexOf('perb') > 0 ){
//             $('a.perb:not(.clone)').removeClass('disabled');
//         }
//       if ( comboFilter.indexOf('metas') == -1
//         && comboFilter.indexOf('perb') == -1
//         && comboFilter.indexOf('ecospp') > 0 ){
//             $('a.ecospp:not(.clone)').removeClass('disabled');
//         }
//       // filter display count
//       var numItemsHidden = $('div.item.isotope-hidden').length;
//       var numItemsDisp = $('div.item:not(.isotope-hidden)').length;
//       var numItemsVisible = $('div.item:not(.isotope-hidden)').length;
//       var activeCheck = $('a.active').size;
//       if(numItemsHidden != 0 && numItemsDisp != 1) {
//         // clear filter
//         $filterDisplay.append( '<a onclick="clearAll();" id="reset-filters" class="pull-right filter-btn">Limpiar Filtros</a>' );
//         $filterDisplay.append( '<span class="filter-label data-counter pull-right">Mostrando:&nbsp;'+numItemsDisp+'&nbsp;indicadores&nbsp;&nbsp;</span>' );
//       }
//       else if (numItemsHidden != 0 && numItemsDisp === 1) {
//         $filterDisplay.append( '<a onclick="clearAll();" id="reset-filters" class="pull-right filter-btn">Limpiar Filtros</a>' );
//         $filterDisplay.append( '<span class="filter-label data-counter pull-right">Mostrando:&nbsp;'+numItemsDisp+' indicador&nbsp;&nbsp;</span>' );
//       }
//       else if (numItemsHidden === 0 && activeCheck > 0) {
//         // $filterDisplay.append( '<a onclick="clearAll();" id="reset-filters" class="pull-right filter-btn">Limpiar Filtros</a>' );
//         // $filterDisplay.append( '<span class="filter-label data-counter pull-right">Mostrando todos los indicadores ('+numItemsDisp+')&nbsp;&nbsp;</span>' );
//       }
//       else if (numItemsHidden === 0 && activeCheck === 0) {
//         $filterDisplay.append( '<span class="filter-label data-counter pull-right">Mostrando todos los&nbsp;'+numItemsDisp+'&nbsp;indicadores</span>' );
//       }
//       else { // strictly fall-back - this should never get triggered
//         $filterDisplay.append( '<a onclick="clearAll();" id="reset-filters" class="pull-right filter-btn">Limpiar Filtros</a>' );
//         $filterDisplay.append( '<span class="filter-label data-counter pull-right">Mostrando:&nbsp;'+numItemsDisp+'&nbsp;indicadores&nbsp;&nbsp;</span>' );
//         //console.log("else was triggered"); // <-- uncomment for debugging
//       }
//      });
//   });
//
// });

  function getComboFilter( filters ) {
    var i = 0;
    var comboFilters = [];
    var message = [];
    for ( var prop in filters ) {
      message.push( filters[ prop ].join(' ') );
        var filterGroup = filters[ prop ];
        // skip to next filter group if it doesn't have any values
        if ( !filterGroup.length ) {
            continue;
        }
        if ( i === 0 ) {
          // copy to new array
            comboFilters = filterGroup.slice(0);
        }
        else {
        var filterSelectors = [];
            // copy to fresh array
        var groupCombo = comboFilters.slice(0); // [ A, B ]
        // merge filter Groups
        for (var k=0, len3 = filterGroup.length; k < len3; k++) {
          for (var j=0, len2 = groupCombo.length; j < len2; j++) {
            filterSelectors.push( groupCombo[j] + filterGroup[k] ); // [ 1, 2 ]
          }
        }
        // apply filter selectors to combo filters for next group
        comboFilters = filterSelectors;
        }
      i++;
    }
    comboFilters.sort();
      var comboFilter = comboFilters.join(', ');
    return comboFilter;
  }

  function clearAll(){
    $('a.active').trigger('click');
    $('#filter-display').empty();
    var numItemsDisp = $('div.item:not(.isotope-hidden)').length;
    $('#filter-display').append( '<span class="filter-label data-counter pull-right">Mostrando todos los&nbsp;'+numItemsDisp+'&nbsp;indicadores</span>' );
  }

(function (root, factory) {
  // if (typeof define === "function" && define.amd) {
  //   // AMD. Register as an anonymous module.
  //   define(factory);
  // } else
if (!root.tooltip) {
    // Browser globals
    root.tooltip = factory(root);
  }
}(this, function() {
  var _options = {
    tooltipId: "tooltip",
    offsetDefault: 15
  };

  var _tooltips = [];
  var _tooltipsTemp = null;

  function _bindTooltips(resetTooltips) {
    if (resetTooltips) {
      _tooltipsTemp = _tooltips.concat();
      _tooltips = [];
    }

    Array.prototype.forEach.call(document.querySelectorAll("[data-tooltip]"), function(elm, idx) {
      var tooltipText = elm.getAttribute("title").trim();
      var options;

      if (resetTooltips && _tooltipsTemp.length && _tooltipsTemp[idx] && _tooltipsTemp[idx].text) {
        if (tooltipText.length === 0) {
          elm.setAttribute("title", _tooltipsTemp[idx].text);
          tooltipText = _tooltipsTemp[idx].text;
        }

        elm.removeEventListener("mousemove", _onElementMouseMove);
        elm.removeEventListener("mouseout", _onElementMouseOut);
        elm.removeEventListener("mouseover", _onElementMouseOver);
      }

      if (tooltipText) {
        elm.setAttribute("title", "");
        elm.setAttribute("data-tooltip-id", idx);
        options = _parseOptions(elm.getAttribute("data-tooltip"));

        _tooltips[idx] = {
          text: tooltipText,
          options: options
        };

        elm.addEventListener("mousemove", _onElementMouseMove);
        elm.addEventListener("mouseout", _onElementMouseOut);
        elm.addEventListener("mouseover", _onElementMouseOver);
      }
    });

    if (resetTooltips) {
      _tooltipsTemp = null;
    }
  }

  function _createTooltip(text, tooltipId) {
    var tooltipElm = document.createElement("div");
    var tooltipText = document.createTextNode(text);
    var options = tooltipId && _tooltips[tooltipId] && _tooltips[tooltipId].options;

    if (options && options["class"]) {
      tooltipElm.setAttribute("class", options["class"]);
    }

    tooltipElm.setAttribute("id", _options.tooltipId);
    tooltipElm.appendChild(tooltipText);

    document.querySelector("body").appendChild(tooltipElm);
  }

  function _getTooltipElm() {
    return document.querySelector("#" + _options.tooltipId);
  }

  function _onElementMouseMove(evt) {
    var tooltipId = this.getAttribute("data-tooltip-id");
    var tooltipElm = _getTooltipElm();
    var options = tooltipId && _tooltips[tooltipId] && _tooltips[tooltipId].options;
    var offset = options && options.offset || _options.offsetDefault;
    var scrollY = window.scrollY || window.pageYOffset;
    var scrollX = window.scrollX || window.pageXOffset;
    var tooltipTop = evt.pageY + offset;
    var tooltipLeft = evt.pageX + offset;

    if (tooltipElm) {
      tooltipTop = (tooltipTop - scrollY + tooltipElm.offsetHeight + 20 >= window.innerHeight ? (tooltipTop - tooltipElm.offsetHeight - 20) : tooltipTop);
      tooltipLeft = (tooltipLeft - scrollX + tooltipElm.offsetWidth + 20 >= window.innerWidth ? (tooltipLeft - tooltipElm.offsetWidth - 20) : tooltipLeft);

      tooltipElm.style.top = tooltipTop + "px";
      tooltipElm.style.left = tooltipLeft + "px";
    }
  }

  function _onElementMouseOut(evt) {
    var tooltipElm = _getTooltipElm();

    if (tooltipElm) {
      document.querySelector("body").removeChild(tooltipElm);
    }
  }

  function _onElementMouseOver(evt) {
    var tooltipId = this.getAttribute("data-tooltip-id");
    var tooltipText = tooltipId && _tooltips[tooltipId] && _tooltips[tooltipId].text;

    if (tooltipText) {
      _createTooltip(tooltipText, tooltipId);
    }
  }

  function _parseOptions(options) {
    var optionsObj;

    if (options.length) {
      try {
        optionsObj = JSON.parse(options.replace(/'/ig, "\""));
      } catch(err) {
        console.log(err);
      }
    }

    return optionsObj;
  }

  function _init() {
    window.addEventListener("load", _bindTooltips);
  }

  _init();

  return {
    setOptions: function(options) {
      for (var option in options) {
        if (_options.hasOwnProperty(option)) {
          _options[option] = options[option];
        }
      }
    },
    refresh: function() {
      _bindTooltips(true);
    }
  };
}));


$("#geobtn").on("mouseover", function( event ) {
  $(".invisible").css("display", "none");
  $(".finder").removeClass("activeicon");
  $("#geobtn").addClass("activeicon");
  $(".geocont").css("display", "block");
});
$("#indbtn").on("mouseover", function( event ) {
  $(".invisible").css("display", "none");
  $(".finder").removeClass("activeicon");
  $("#indbtn").addClass("activeicon");
  $(".indicont").css("display", "block");
});
$("#combtn").on("mouseover", function( event ) {
  $(".invisible").css("display", "none");
  $(".finder").removeClass("activeicon");
  $("#combtn").addClass("activeicon");
  $(".compcont").css("display", "block");
});
$("#alebtn").on("mouseover", function( event ) {
  $(".invisible").css("display", "none");
  $(".finder").removeClass("activeicon");
  $("#alebtn").addClass("activeicon");
  $(".alertcont").css("display", "block");
});

$("#ShowHome").on("click", function( event ) {
  $("#topDiv").toggle("slow");
  if ($("#ShowHome").hasClass("rotate"))
    $("#ShowHome").removeClass("rotate");
  else
    $("#ShowHome").addClass("rotate");
});
