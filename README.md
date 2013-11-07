# Ustyle modals

Yet another modal/dialog/pop-up/lightbox script, but made for uSwitch with the sort of options we need, and especially with responsiveness in mind.

Inspired in a large way by CSS modals [drublic.github.io/css-modal/](http://drublic.github.io/css-modal/), but without the non-JS option (I know, I know).

## Why?

We used a bundle of different frameworks just for modals (bootstrap, jqueryUI, fancybox), and some of them weren't responsive, some had more features than we'll ever need, most didn't have enough features, and all used javascript for much of the layout engine (err, no thanks).

## Requirements

- jQuery
- SASS (or compile the sass to css)
- spin.js (optional [fgnass.github.io/spin.js/](http://fgnass.github.io/spin.js/))
- uSwitch web and icon fonts (very optional)

## Installation

include the js and css:

    <link href='_uswitch_modal.css' media='all' rel='stylesheet' type='text/css' />
    <script src='uSwitch.modal.js'></script>

that's it. The javascript is auto-running and you're ready to build a modal pop-up.

## Modes of use

### Link triggered JS delegated event

In this mode, you can just add a class to the link you want to trigger the modal:

    <a href="/ajax-content.html" class="us-modal">click me</a>

The above will create a 600px wide responsive modal dialog filled with the contents of "/ajax-content.html". It's the class "us-modal" that turns this from a regular link to a modal link.

You can then add optional extra arguments in the form of data-types (see below for full list)

    <a href="/ajax-content.html" class="us-modal" data-type="ajax" data-width="xl" data-title="Awesome pop-up" data-modalclass="green">click me</a>

### JS triggered

You can also trigger a modal programmatically in JS, with exactly the same arguments

    uSwitch.modal.openModal(false,{
      'type':'ajax',
      'target':/ajax-content.html,
      'width':'xl',
      'title':'Awesome pop-up',
      'modalclass':'green'
    });

## Examples

[click here for lots of demos and examples](http://uswitch.github.io/ustyle-modals/)

## Arguments

    modalid (default '#us-modal-0')
Not usually specified, as by default there's only one modal scaffold in the page (with an id "us-modal-0"), which is automatically created on page load and has it's contents replaced each time a link is clicked. But this option allows the calling of multiple hidden prebuilt modals. Can be a CSS id "#this-modal" or the first available CSS class ".those-modals"

    modalclass
Extra CSS classes to add to the modal (eg 'footer-green big-text')

    type (default 'prebuilt', but uses the url/target to determine the option, if empty)
The type of content to pull into the modal. Choose from 'prebuilt' (the modal is self-contained, prebuilt and hidden), 'inpage' (pull a hidden element into the modal and force it as "display:block"), 'ajax' (pull content from a url) or 'iframe' (NOT YET BUILT!). Default is 'prebuilt', but the script will try and determine of it's 'inpage' or 'ajax' based on the target (ie the link) to pull into the modal.

    width (defaults to M for medium - 600px wide)
Five widths are available: "XS,S,M,L,XL" ranging from 400px up to 800px wide. Why not allow arbitrary widths? Because then we'd have trouble spotting when the viewport is smaller than the modal and making them responsive without resorting to javascript events.

    height
Only used for type="iframe". Otherwise the modal extends in height until it hits a maximum set in the stylesheet.

    target
The content to pull into the modal (not used for type="prebuilt"). Can be set to "#nodeid" or ".nodeclass" for type="inpage/prebuilt" use, or 'http://www.bob.com/page.html' or '/page.html' or 'page.html' for type="ajax/iframe". Although it's crucial, it's also optional if you're triggering a link and data-target="url" is not set, as the href="url" will be used instead.

    targetextra
Only used for type="ajax" calls. Allows you to specify an element within the document received. For example, target="test.html", targetextra="#bob" will only pull the first element with a CSS id "bob" from the document "test.html" and place it inside the modal

    targetjq
Only useful for JS triggering of type="inpage", as it's passing the jQuery object of the element you wish to put into the modal (just means a tiny bit less jQuery object creation if you've already done it)

    title
The text to add into the modal header. Yes it can be HTML if you really want

    noClose
Set to 'true' if you'd prefer not to have a close box link in the modal header.

    closedirection
When you're viewing the modal on a small screen, the default behaviour is the same as desktop - a scale and fade opening transition. This option allows a slide transition to be substituted, with opions for "right" and "bottom"

### Footer options

The modal footer doesn't appear by default, but if you specify it, it will appear fixed to the bottom of the modal. WARNING - the footer is always a single line height, it won't deal with long text running into multiple lines.

    showfooter
If set to 'true', the modal footer will show. Duh. But then if "formurl" or "footerhtml" below are specified, this will also be set as 'true' by default.

    footerhtml
HTML to push into the footer. To warn you, p, h3, h4 are all floated left, so they don't mess with any buttons.

    formurl
If you want to add a button form in the modal footer, this is the action of the form

    formmethod
The method of the form, defaults to 'POST'

    formhtml
What to add into the left hand side of the form, eg "Click to switch".

    forminputs
A bit funky. You can add multiple input fields in a json object. eg
{
 'field-name-1':{
  'type':'hidden',
  'value':'blah',
  'id':'blah',
  'class':'blah',
  'placeholder':'blah'
 },
 'field-name-2':{
  'type':'hidden',
  'value':'blah',
  'id':'blah',
  'class':'blah',
  'placeholder':'blah'
 }
}

    formbutton
Again, the button is in a json object, if a little simpler:
{
 'field-name-1':{
  'id':'blah',
  'class':'blah',
  'text':'blah'
 }

## Modal scaffold

If you want to prebuild a modal and put it in the page, here's an example. You don't need to add theoverlay, as that will be generated on "page ready".

    <section id="name-you-modal" class="us-modal-box us-modal-footer us-modal-xl" tabindex="-1" role="dialog" aria-labelledby="modal-label" aria-hidden="true" style="display:none;">
      <header>
        <h2 class="us-modal-title">This is a prebuilt modal</h2>
        <a href="#!" class="us-modal-close">X</a>
      </header>
      <div class="us-modal-content">
        <h2>This is a "prebuilt" modal</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rhoncus urna vel nunc malesuada, sit amet lacinia augue vulputate. Donec suscipit porta mattis. Quisque varius leo et nibh fermentum, quis aliquam felis scelerisque. Quisque feugiat ligula nunc, in venenatis sem imperdiet at. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut ultrices egestas commodo. Suspendisse non consequat odio.</p>
      </div>
      <footer>
        <p>Footers here</p>
      </footer>
    </section>
        
## Notes

- All the arguments/variables keys are lowercase
- need to fix on ipad. VH units seem to take the height of the page, not the viewport on iPad.
- better aria work to come.