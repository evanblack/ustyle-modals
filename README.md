# Ustyle modals

Yet another modal dialog script, but made for uSwitch with the sort of options we need, and yummy responsive.

Inspired in a large way by CSS modals [http://drublic.github.io/css-modal/](http://drublic.github.io/css-modal/)

THIS IS AN EARLY INCOMPLETE VERSION

## Why?

We used a bundle of different frameworks just for modals (bootstrap, jqueryUI, fancybox), and some of them weren't responsive, some had more features than we'll even need, most didn't have enough features, and all used javascript for much of the layout engine (err, no thanks).

## Requirements

- jQuery
- SASS
- (and uSwitch stylesheets/fonts in this iteration)

## Installation

include the js and css:

    <link href='_uswitch_modal.css' media='all' rel='stylesheet' type='text/css' />
    <script src='uSwitch.modal.js'></script>

that's it. The javascript is auto-running and you're ready to build a modal pop-up

## Modes of use

### Link triggered

In this mode, you can just add a class to the link you want to trigger the modal:

    <a href="/ajax-content.html" class="us-modal">click me</a>

You can then add extra arguments in the form of data-types (see below for full list)

    <a href="/ajax-content.html" class="us-modal" data-type="ajax" data-width="xl" data-title="Awesome pop-up" data-modalclass="green">click me</a>

### JS triggered

You can also trigger a modal programmatically in JS, with exactly the same options

    uSwitch.modal.openModal(false,{
      'type':'ajax',
      'target':/ajax-content.html,
      'width':'xl',
      'title':'Awesome pop-up',
      'modalClass':'green'
    });

## Modifiers

