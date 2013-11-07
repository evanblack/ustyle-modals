/* uswitch modals v0.5 - https://github.com/uswitch/ustyle-modals */

var uSwitch = uSwitch || {};

uSwitch.modal = (function() {

  var modalDefaultId = '#us-modal-0';
  var modalLinks = $('.us-modal');
  var debug = false;

  
  var init = function(forceSetUp) {
    if ($('html').hasClass('us-debug'))
      debug = true;
    if (debug)
      console.log('-- us-modal init');
    setupModal(forceSetUp);
    setupClicks();
  };

  // determine if there is a need for modals in the page
  var setupModal = function(forceSetUp) {
    // if we're asked to set-up with modals even if there's no modal links currently in the page, check one doesn't exist and set it up.
    if (forceSetUp && $('.us-modal-box').length==0) {
      if (debug)
        console.log('-- us-modal force setup');
      createModal();
      return;
    }
    var needWorkCounter = 0;
    // check the link of each modal
    $.each(modalLinks,function(index,el){
      var elJ = $(el);
      var link = elJ.attr('href');
      // if this link isn't an internal anchor, it'll need a modal to be set-up
      if (link.indexOf('#')!=0 && link.length>1) {
        needWorkCounter++;
      // if it is an internal anchor, check to see if it's a 'prebuilt', or if it's just any old internal anchor
      } else {
        var anchor = link.substring(1);
        if ($(link + '.us-modal-box').length === 0) {
          needWorkCounter++;
        } else {
          createOverlay();
          if (debug)
            console.log('-- us-modal prebuilt modal found in page - may not require scaffold setup');
        }
      }
    });
    // if needed, create a hidden modal ready for use
    if (needWorkCounter > 0) {
      if (debug)
        console.log('-- us-modal link found, scaffold setup required');
      createModal();
    }
  };

  // build the scaffold of a modal hidden in the page
  var createModal = function() {
    var modalScaffold = '\
    <section id="' + modalDefaultId.replace('#','') + '" class="us-modal-box" tabindex="-1" role="dialog" aria-labelledby="modal-label" aria-hidden="true">\
      <header>\
        <h2 class="us-modal-title"></h2>\
        <a href="#!" class="us-modal-close">X</a>\
      </header>\
      <div class="us-modal-content"></div>\
      <footer></footer>\
    </section>';
    createOverlay();
    $('body').append(modalScaffold);
    if (debug)
      console.log('-- us-modal setup modal scaffold');
  };

  var createOverlay = function() {
    if ($('#us-modal-overlay').length === 0) {
      $('body').append('<div id="us-modal-overlay" class="us-modal-overlay" tabindex="-1" aria-hidden="true"></div>');
      if (debug)
        console.log('-- us-modal setup overlay');
    }
  };

  // event handlers
  var setupClicks = function() {
    // links to open modals
    $('body').on('click','.us-modal',function(event) {
      if (debug)
        console.log('-- us-modal CLICK TO OPEN');
      event.preventDefault();
      openModal(this);
    });
    // close modal link
    $('body').on('click','.us-modal-close',function() {
      if (debug)
        console.log('-- us-modal CLICK TO CLOSE');
      closeModal($(this).closest('.us-modal-box'));
    });
    // clicking the modal background mask also closes the modal
    $('body').on('click','.us-modal-overlay',function() {
      if (debug)
        console.log('-- us-modal CLICK TO CLOSE FROM OVERLAY');
      closeModal();
    });
  };

  // helper that allows us to pass around both straight ids/classes (eg "#modal-signup", ".modal-signup") or jQuery objects (eg $('#modal-signup'))
  var jqOrId = function(undecided) {
    var nodeJQ = false;
    if (undecided instanceof jQuery) {
      nodeJQ = undecided;
    } else {
      var nodeId = undecided || modalDefaultId;
      nodeJQ = $(nodeId);
    }
    return nodeJQ;
  };

  // read string encoded json, convert it to a json object
  var readJsonConfig = function(jsonRaw) {
    if (!jsonRaw)
      return;
    if (typeof jsonRaw === 'object')
      return jsonRaw;
    jsonRaw = jsonRaw.replace(/\"/g,'~~');  // mask double quotes
    var jsonClean = jsonRaw.replace(/\'/g,'"');
    jsonClean = jsonClean.replace(/\~~/g,'\"');
    var jsonObj = JSON && JSON.parse(jsonClean) || $.parseJSON(jsonClean);
    return jsonObj;
  };

  // if the config for the modal is in the form of data-type="" attributes on the link, read it into an object and fill in any important gaps
  var readLinkConfig = function(link) {
    var linkJQ = $(link);
    var config = linkJQ.data();
    // fill in gaps: if we're not given a target, use the link href
    if (!config.target && !config.targetjq) {
      config.target = linkJQ.attr('href');
    }
    // fill in gaps: if we're not given a config.type, try and figure it out by the target given (ie the url or selector in the href)
    if (!config.type) {
      if (config.target.indexOf('#') === 0 || config.target.indexOf('.') === 0) {
        var contentJQ = $(config.target);
        if (contentJQ.length<1) {
          alert('sorry, unable to find the content you clicked on');
        } else if (contentJQ.hasClass('us-modal-box')) {
          config.type = 'prebuilt';
          config.modalid = config.target;
        } else {
          config.type = 'inpage';
        }
      } else {
        config.type = 'ajax';
      }
    }
    // fill in gaps: if we're not given a title, use the link title attr
    if (!config.title) {
      config.title = linkJQ[0].title || '';
    }
    if (debug)
      console.log('-- us-modal read modal config from link');
    return config;
  };

  // clean the modal of content after it's closed
  var resetModal = function(noreset,modal) {
    var modaljq = jqOrId(modal);
    noreset = noreset || modaljq.data('noreset') || false;
    var showfooter = false;
    if (modaljq.hasClass('us-modal-footer'))
      showfooter = true;
    modaljq.attr('class','').addClass('us-modal-box');
    if (!noreset) {
      modaljq.find('.us-modal-title').text('');
      modaljq.find('.us-modal-content').text('');
      modaljq.find('footer').text('');
      if (debug)
        console.log('-- us-modal content reset');
    } else if (showfooter) {
      modaljq.addClass('us-modal-footer');
    }
  };

  // set the modal title bar
  var setModalTitle = function(title,modal) {
    if (!title)
      return;
    var modaljq = jqOrId(modal);
    modaljq.find('.us-modal-title').html(title);
  };

  // set the modal content (type: inpage)
  var setModalContentInPage = function(targetjq,modal) {
    var modaljq = jqOrId(modal);
    var content = targetjq.first().clone().css('display','block');
    modaljq.find('.us-modal-content').append(content);
  };

  // set the modal content (type: ajax)
  var setModalContentAjax = function(target,modal) {
    var modaljq = jqOrId(modal);
    if (debug)
      console.log('-- us-modal ajax target: ' + target);
    // add a spinner
    modaljq.find('.us-modal-content').append('<div id="us-modal-loading"></div>');
    if (typeof Spinner != "undefined") {
      var opts = {
        lines: 13, // The number of lines to draw
        length: 6, // The length of each line
        width: 3, // The line thickness
        radius: 8, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#494B71', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 30, // Afterglow percentage
        shadow: false,
        hwaccel: false, // Whether to use hardware acceleration
        zIndex: 2e9 // The z-index (defaults to 2000000000)
      };
      var spinTarget = $('#us-modal-loading')[0];
      var spinner = new Spinner(opts).spin(spinTarget);
    }
    modaljq.find('.us-modal-content').load(target,function(responseText, textStatus, req) {
      if (textStatus === "error") {
        alert('sorry - we are unable to load the pop-up');
        closeModal();
        return;
      }
      // remove spinner
      $('#us-spin-container').remove();
      if (debug)
        console.log('-- us-modal ajax complete');
    });
  };

  // set the modal content (type: iframe)
  var setModalContentIframe = function(target,modal) {
    alert('NOT DONE!');
  };

  var setModalFooter = function(config) {
    var config = config || {};
    var modalid = config.modalid || modalDefaultId;
    var modaljq = $(modalid);
    var footerhtml = config.footerhtml || '';
    var formmethod = config.formmethod || 'POST';
    var formurl = config.formurl || false;
    var formhtml = config.formhtml || '';
    var forminputs = readJsonConfig(config.forminputs) || {};
    var formbutton = readJsonConfig(config.formbutton) || {};
    formbutton.text = formbutton.text || 'submit';
    if (debug) {
      console.log('-- us-modal config with footer');
      console.log(config);
    }
    // form instead of html?
    if (!footerhtml && formurl) {
      footerhtml = '<form action="' + formurl + '" method="' + formmethod + '">';
      $.each(forminputs,function(i,el){
        footerhtml += '<input' + ( el['id'] ? ' id="' + el['id'] + '"':'') + ( el['class'] ? ' class="' + el['class'] + '"':'') + ' type="' + el.type + '" name="' + i + '" value="' + el.value + '" placeholder="' + el.placeholder + '" />';
      });
      footerhtml += formhtml;
      footerhtml += '<button id="' + formbutton['id'] + '" class="btn ' + formbutton['class'] + '" type="submit">' + formbutton['text'] + '</button>';
      footerhtml += '</form>';
    }
    modaljq.find('footer').append(footerhtml);
  };

  // open a modal
  var openModal = function(link,config) {
    var config = config || readLinkConfig(link) || {};
    if (debug) {
      console.log('-- us-modal first pass config:');
      console.log(config);
    }
    var modalid = config.modalid || modalDefaultId; // by default there's only one modal in the page. But this allows the option to call multiple hidden prebuilt modals.
    var modalclass = config.modalclass || false; // extra classes to add to the modal (eg 'footer-green big-text')
    var type = config.type || false; // the type of content to pull into the modal. Choose from 'inpage' (pull a hidden ID into the modal), 'ajax', 'iframe' or 'prebuilt' (the modal is self-contained, prebuilt and hidden). Default is 'prebuilt'.
    var width = config.width || 'm';  // medium is the default width (600px wide)
    var height = config.height || '300'; // used for type = 'iframe' only
    var target = config.target || false; // could be '#nodeid' or '.nodeclass' for inpage use, 'http://www.bob.com/page.html' or '/page.html' or 'page.html' for ajax/iframe.
    var targetextra = config.targetextra || false; // used in ajax requests, a CSS selector modifier that only retrieves a specific element of a page.
    var title = config.title || false; // title bar of modal
    var noclose = config.noclose || false; // hide the close button in the modal header. should be true or false
    var closedirection = config.closedirection || false; // on small screens, what is the direction of close. default (false) is a scale fade (just like desktop). options are 'right' or 'bottom' to zoom the sheet off a side of the screen instead
    var formurl = config.formurl || false;
    var footerhtml = config.footerhtml || '';
    // look to setModalFooter for additional config for setting up the modal footer
    var showfooter = config.showfooter || false; // show the modal footer. should be true or false
    if (!showfooter && (formurl || footerhtml)) // if we don't ask to show the footer, but do have a form or html, add the footer in anyway
      showfooter = true;
    var noreset = config.noreset || false; // don't reset the modal when it's closed (ie, don't wipe any content). should be true or false
    var rootjq = $('html');
    var modaljq = $(modalid);
    // if we're looking at a prebuilt, make sure it doesn't have it's content wiped
    if (type==='prebuilt')
      noreset = true;
    // let the modal know if it shouldn't have the data reset on close either
    if (noreset)
      modaljq.attr('data-noreset','1');
    if (debug) {
      console.log('-- us-modal second pass config:');
      console.log(config);
    }
    // clear the modal
    if (!noreset)
      resetModal(noreset,modaljq);
    // set title
    setModalTitle(title,modaljq);
    // set content
    switch(type) {
      case 'inpage':
        var targetjq = config.targetjq || $(target) || false; // used for inpage only
        setModalContentInPage(targetjq,modaljq);
        break;
      case 'ajax':
        if (targetextra) {
          target = target + ' ' + targetextra;
        }
        setModalContentAjax(target,modaljq);
        break;
      case 'iframe':
        setModalContentIframe(target,height,modaljq);
        break;
      default:
        // do nothing about content, just reveal the modal (for use cases where the modal is pre-built but hidden)
    }
    // set footer
    if (showfooter)
      setModalFooter(config,modaljq);
    // open modal/set the width
    rootjq.addClass('us-modal-ready us-modal-root-' + width );
    modaljq.addClass('us-modal-ready us-modal-' + width + (noclose?' us-modal-noclose':'') + (showfooter?' us-modal-footer':'') + (closedirection?' us-modal-dir-' + closedirection:'') + (modalclass?' ' + modalclass:''));
    setTimeout(function(){
      rootjq.removeClass('us-modal-ready').addClass('us-modal-on');
      modaljq.removeClass('us-modal-ready').addClass('us-modal-on');
    },10);
  };

  // close a modal
  var closeModal = function(modal) {
    var rootjq = $('html');
    var modaljq = $('.us-modal-box');
    if (modal) {
      modaljq = jqOrId(modal);
    }
    rootjq.removeClass(function (index, css) {
      return (css.match (/\bus-modal-\S+/g) || []).join(' ');
    });
    modaljq.removeClass('us-modal-on').addClass('us-modal-ready');
    setTimeout(function(){
      rootjq.removeClass('us-modal-on us-modal-ready');
      modaljq.removeClass('us-modal-on us-modal-ready');
      resetModal(false,modaljq);
    },400);
  };
  
  return {
    init: init,
    openModal: openModal,
    closeModal: closeModal
  };

}($));

uSwitch.modal.init(true);