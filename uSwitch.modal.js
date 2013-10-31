var uSwitch = uSwitch || {};

uSwitch.modal = (function() {

  // v0.5

  var modalDefaultId = '#us-modal-0';
  var modalLinks = $('.us-modal');
  
  var init = function(forceSetUp) {
    setupModal(forceSetUp);
    setupClicks();
  }

  // determine if there is a need for modals in the page
  var setupModal = function(forceSetUp) {
    // if we're asked to set-up with modals even if there's no modal links currently in the page, check one doesn't exist and set it up.
    if (forceSetUp && $('.us-modal-box').length==0) {
      createModal();
      return;
    }
    var needWorkCounter = 0;
    // check the link of each modal
    $.each(modalLinks,function(index,el){
      var elJ = $(el);
      var link = el.href;
      // if this link isn't an internal anchor, it'll need a modal to be set-up
      if (link.indexOf('#')!=0 && link.length>1) {
        needWorkCounter++;
      // if it is an internal anchor, check to see if it's already set-up, or if it's just any old internal anchor
      } else {
        var anchor = link.substring(1);
        if ($('.us-modal-container[id$="' + anchor + '"]').length == 0) {
          needWorkCounter++;
        }
      }
      // if needed, create a hidden modal ready for use
      if (needWorkCounter > 0) {
        createModal();
      }
    })
  }

  // build the scaffold of a modal hidden in the page
  var createModal = function() {
    var modalScaffold = '\
    <div id="us-modal-overlay" class="us-modal-overlay" tabindex="-1" aria-hidden="true"></div>\
    <section id="' + modalDefaultId.replace('#','') + '" class="us-modal-box" tabindex="-1" role="dialog" aria-labelledby="modal-label" aria-hidden="true">\
      <header>\
        <h2 class="us-modal-title"></h2>\
        <a href="#!" class="us-modal-close">X</a>\
      </header>\
      <div class="us-modal-content"></div>\
      <footer></footer>\
    </section>';
    $('body').append(modalScaffold);
  }

  // event handlers
  var setupClicks = function() {
    // links to open modals
    $('body').on('click','.us-modal',function(event) {
      event.preventDefault();
      openModal(this);
    })
    // close modal link
    $('body').on('click','.us-modal-close',function() {
      closeModal();
    })
    // clicking the modal background mask also closes the modal
    $('body').on('click','.us-modal-overlay',function(event) {
      closeModal();
    })
  }

  // helper that allows us to pass around both straight ids/classes (eg "#modal-signup", ".modal-signup") or jQuery objects (eg $('#modal-signup'))
  var jqOrId = function(undecided) {
    if (undecided instanceof jQuery) {
      var nodeJQ = undecided;
    } else {
      var nodeId = undecided || modalDefaultId;
      var nodeJQ = $(nodeId);
    }
    return nodeJQ;
  }

  // 
  var readJsonConfig = function(jsonRaw) {
    if (!jsonRaw)
      return;
    jsonClean = jsonRaw.replace(/\'/g,'"');
    jsonObj = JSON && JSON.parse(jsonClean) || $.parseJSON(jsonClean);
    return jsonObj;
  }

  // if the config for the modal is in the form of data-type="" attributes on the link, read it into an object and fill in any important gaps
  var readLinkConfig = function(link) {
    var linkJQ = $(link);
    var config = linkJQ.data();
    // fill in gaps: if we're not given a target, use the link href
    if (!config.target && !config.targetJQ) {
      config.target = linkJQ.attr('href');
    }
    // fill in gaps: if we're not given a config.type, try and figure it out by the target given (ie the url or selector in the href)
    if (!config.type) {
      if (config.target.indexOf('#') == 0 || config.target.indexOf('.') == 0) {
        var contentJQ = $(config.target);
        if (contentJQ.length<1) {
          alert('sorry, unable to find the content you clicked on');
        } else if (contentJQ.hasClass('us-modal-box')) {
          config.type = 'prebuilt';
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
    return config;
  }

  // clean the modal of content after it's closed
  var resetModal = function(noReset,modal) {
    var modalJQ = jqOrId(modal);
    var noReset = noReset || modalJQ.data('noreset') || false;
    modalJQ.attr('class','').addClass('us-modal-box');
    if (!noReset) {
      modalJQ.find('.us-modal-title').text('');
      modalJQ.find('.us-modal-content').text('');
      modalJQ.find('footer').text('');
    }
  }

  // set the modal title bar
  var setModalTitle = function(title,modal) {
    if (!title)
      return
    var modalJQ = jqOrId(modal);
    modalJQ.find('.us-modal-title').html(title);
  }

  // set the modal content (type: inpage)
  var setModalContentInPage = function(targetJQ,modal) {
    var modalJQ = jqOrId(modal);
    var content = targetJQ.first().clone().css('display','block');
    modalJQ.find('.us-modal-content').append(content);
  }

  // set the modal content (type: ajax)
  var setModalContentAjax = function(target,modal) {
    var modalJQ = jqOrId(modal);
    // add a spinner
    modalJQ.find('.us-modal-content').append('<div id="us-modal-loading"></div>');
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
    modalJQ.find('.us-modal-content').load(target,function() {
      // remove spinner
      $('#us-spin-container').remove();
    });
  }

  // set the modal content (type: iframe)
  var setModalContentIframe = function(target,modal) {
    alert('NOT DONE!');
  }

  var setModalFooter = function(config) {
    var config = config || {};
    var modalId = config.modalid || modalDefaultId;
    var modalJQ = $(modalId);
    var footerHtml = config.footerhtml || false;
    var formMethod = config.formmethod || 'POST';
    var formUrl = config.formurl || false;
    var formHtml = config.formhtml || false;
    var formInputs = readJsonConfig(config.forminputs) || {};
    var formButton = readJsonConfig(config.formbutton) || {};
    formButton.text = formButton.text || 'submit';
    // form instead of html?
    if (!footerHtml && formUrl) {
      footerHtml = '<form action="' + formUrl + '" method="' + formMethod + '">';
      $.each(formInputs,function(i,el){
        footerHtml += '<input' + ( el['id'] ? ' id="' + el['id'] + '"':'') + ( el['class'] ? ' class="' + el['class'] + '"':'') + ' type="' + el.type + '" name="' + i + '" value="' + el.value + '" placeholder="' + el.placeholder + '" />';
      })
      footerHtml += formHtml;
      footerHtml += '<button id="' + formButton['id'] + '" class="btn ' + formButton['class'] + '" type="submit">' + formButton['text'] + '</button>';
      footerHtml += '</form>';
    }
    modalJQ.find('footer').append(footerHtml);
  }

  // open a modal
  var openModal = function(link,config) {
    var config = config || readLinkConfig(link) || {};
    var modalId = config.modalid || modalDefaultId; // by default there's only one modal in the page. But this allows the option to call multiple hidden prebuilt modals.
    var modalClass = config.modalclass || false; // extra classes to add to the modal (eg 'footer-green big-text')
    var type = config.type || false; // the type of content to pull into the modal. Choose from 'inpage' (pull a hidden ID into the modal), 'ajax', 'iframe' or 'prebuilt' (the modal is self-contained, prebuilt and hidden). Default is 'prebuilt'.
    var width = config.width || 'm';  // medium is the default width (600px wide)
    var height = config.height || '300'; // used for type = 'iframe' only
    var target = config.target || false; // could be '#nodeid' or '.nodeclass' for inpage use, 'http://www.bob.com/page.html' or '/page.html' or 'page.html' for ajax/iframe.
    var targetExtra = config.targetextra || false; // used in ajax requests, a CSS selector modifier that only retrieves a specific element of a page.
    var title = config.title || false; // title bar of modal
    var noClose = config.noclose || false; // hide the close button in the modal header. should be true or false
    var formUrl = config.formurl || false;
    var footerHtml = config.footerhtml || false;
    // look to setModalFooter for additional config for setting up the modal footer
    var showFooter = config.showfooter || false; // show the modal footer. should be true or false
    if (!showFooter && (formUrl || footerHtml)) // if we don't ask to show the footer, but do have a form or html, add the footer in anyway
      showFooter = true;
    var noReset = config.noreset || false; // don't reset the modal when it's closed (ie, don't wipe any content). should be true or false
    var rootJQ = $('html');
    var modalJQ = $(modalId);
    // let the modal know if it shouldn't have the data reset
    if (noReset)
      modalJQ.data('noreset','1');
    // clear the modal
    resetModal(noReset,modalJQ);
    // set title
    setModalTitle(title,modalJQ);
    // set content
    switch(type) {
      case 'inpage':
        var targetJQ = config.targetjq || $(target) || false; // used for inpage only
        setModalContentInPage(targetJQ,modalJQ);
        break;
      case 'ajax':
        if (targetExtra) {
          target = target + ' ' + targetExtra;
        }
        setModalContentAjax(target,modalJQ);
        break;
      case 'iframe':
        setModalContentIframe(target,height,modalJQ);
        break;
      default:
        // do nothing about content, just reveal the modal (for use cases where the modal is pre-built but hidden - remember to use the "noReset" config setting)
    }
    // set footer
    if (showFooter)
      setModalFooter(config,modalJQ);
    // open modal/set the width
    rootJQ.addClass('us-modal-ready');
    modalJQ.addClass('us-modal-' + width + (noClose?' us-modal-noclose':'') + (showFooter?' us-modal-footer':'') + (modalClass?' ' + modalClass:''));
    setTimeout(function(){
      rootJQ.removeClass('us-modal-ready').addClass('us-modal-on');
    },10);
  }

  // close a modal
  var closeModal = function(modal) {
    var rootJQ = $('html');
    var modalJQ = jqOrId(modal) || $(modalDefaultId);
    rootJQ.removeClass('us-modal-on').addClass('us-modal-ready');
    setTimeout(function(){
      rootJQ.removeClass('us-modal-ready');
      resetModal(false,modalJQ);
    },400);
  }
  
  return {
    init: init,
    openModal: openModal,
    closeModal: closeModal
  };

}($));

uSwitch.modal.init(true);