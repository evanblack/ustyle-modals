/* uswitch modals v0.5 - https://github.com/uswitch/ustyle-modals */var uSwitch=uSwitch||{};uSwitch.modal=function(){var e="#us-modal-0",t=$(".us-modal"),n=!1,r=function(e){$("html").hasClass("us-debug")&&(n=!0);n&&console.log("-- us-modal init");i(e);u()},i=function(e){if(e&&$(".us-modal-box").length==0){n&&console.log("-- us-modal force setup");s();return}var r=0;$.each(t,function(e,t){var i=$(t),s=i.attr("href");if(s.indexOf("#")!=0&&s.length>1)r++;else{var u=s.substring(1);if($(s+".us-modal-box").length===0)r++;else{o();n&&console.log("-- us-modal prebuilt modal found in page - may not require scaffold setup")}}});if(r>0){n&&console.log("-- us-modal link found, scaffold setup required");s()}},s=function(){var t='    <section id="'+e.replace("#","")+'" class="us-modal-box" tabindex="-1" role="dialog" aria-labelledby="modal-label" aria-hidden="true">      <header>        <h2 class="us-modal-title"></h2>        <a href="#!" class="us-modal-close">X</a>      </header>      <div class="us-modal-content"></div>      <footer></footer>    </section>';o();$("body").append(t);n&&console.log("-- us-modal setup modal scaffold")},o=function(){if($("#us-modal-overlay").length===0){$("body").append('<div id="us-modal-overlay" class="us-modal-overlay" tabindex="-1" aria-hidden="true"></div>');n&&console.log("-- us-modal setup overlay")}},u=function(){$("body").on("click",".us-modal",function(e){n&&console.log("-- us-modal CLICK TO OPEN");e.preventDefault();g(this)});$("body").on("click",".us-modal-close",function(){n&&console.log("-- us-modal CLICK TO CLOSE");y($(this).closest(".us-modal-box"))});$("body").on("click",".us-modal-overlay",function(){n&&console.log("-- us-modal CLICK TO CLOSE FROM OVERLAY");y()})},a=function(t){var n=!1;if(t instanceof jQuery)n=t;else{var r=t||e;n=$(r)}return n},f=function(e){if(!e)return;if(typeof e=="object")return e;e=e.replace(/\"/g,"~~");var t=e.replace(/\'/g,'"');t=t.replace(/\~~/g,'"');var n=JSON&&JSON.parse(t)||$.parseJSON(t);return n},l=function(e){var t=$(e),r=t.data();!r.target&&!r.targetjq&&(r.target=t.attr("href"));if(!r.type)if(r.target.indexOf("#")===0||r.target.indexOf(".")===0){var i=$(r.target);if(i.length<1)alert("sorry, unable to find the content you clicked on");else if(i.hasClass("us-modal-box")){r.type="prebuilt";r.modalid=r.target}else r.type="inpage"}else r.type="ajax";r.title||(r.title=t[0].title||"");n&&console.log("-- us-modal read modal config from link");return r},c=function(e,t){var r=a(t);e=e||r.data("noreset")||!1;var i=!1;r.hasClass("us-modal-footer")&&(i=!0);r.attr("class","").addClass("us-modal-box");if(!e){r.find(".us-modal-title").text("");r.find(".us-modal-content").text("");r.find("footer").text("");n&&console.log("-- us-modal content reset")}else i&&r.addClass("us-modal-footer")},h=function(e,t){if(!e)return;var n=a(t);n.find(".us-modal-title").html(e)},p=function(e,t){var n=a(t),r=e.first().clone().css("display","block");n.find(".us-modal-content").append(r)},d=function(e,t){var r=a(t);n&&console.log("-- us-modal ajax target: "+e);r.find(".us-modal-content").append('<div id="us-modal-loading"></div>');if(typeof Spinner!="undefined")var i={lines:13,length:6,width:3,radius:8,corners:1,rotate:0,direction:1,color:"#494B71",speed:1,trail:30,shadow:!1,hwaccel:!1,zIndex:2e9},s=$("#us-modal-loading")[0],o=(new Spinner(i)).spin(s);r.find(".us-modal-content").load(e,function(e,t,r){if(t==="error"){alert("sorry - we are unable to load the pop-up");y();return}$("#us-spin-container").remove();n&&console.log("-- us-modal ajax complete")})},v=function(e,t){alert("NOT DONE!")},m=function(t){var t=t||{},r=t.modalid||e,i=$(r),s=t.footerhtml||"",o=t.formmethod||"POST",u=t.formurl||!1,a=t.formhtml||"",l=f(t.forminputs)||{},c=f(t.formbutton)||{};c.text=c.text||"submit";if(n){console.log("-- us-modal config with footer");console.log(t)}if(!s&&u){s='<form action="'+u+'" method="'+o+'">';$.each(l,function(e,t){s+="<input"+(t.id?' id="'+t.id+'"':"")+(t["class"]?' class="'+t["class"]+'"':"")+' type="'+t.type+'" name="'+e+'" value="'+t.value+'" placeholder="'+t.placeholder+'" />'});s+=a;s+='<button id="'+c.id+'" class="btn '+c["class"]+'" type="submit">'+c.text+"</button>";s+="</form>"}i.find("footer").append(s)},g=function(t,r){var r=r||l(t)||{};if(n){console.log("-- us-modal first pass config:");console.log(r)}var i=r.modalid||e,s=r.modalclass||!1,o=r.type||!1,u=r.width||"m",a=r.height||"300",f=r.target||!1,g=r.targetextra||!1,y=r.title||!1,b=r.noclose||!1,w=r.closedirection||!1,E=r.formurl||!1,S=r.footerhtml||"",x=r.showfooter||!1;!x&&(E||S)&&(x=!0);var T=r.noreset||!1,N=$("html"),C=$(i);o==="prebuilt"&&(T=!0);T&&C.attr("data-noreset","1");if(n){console.log("-- us-modal second pass config:");console.log(r)}T||c(T,C);h(y,C);switch(o){case"inpage":var k=r.targetjq||$(f)||!1;p(k,C);break;case"ajax":g&&(f=f+" "+g);d(f,C);break;case"iframe":v(f,a,C);break;default:}x&&m(r,C);N.addClass("us-modal-ready us-modal-root-"+u);C.addClass("us-modal-ready us-modal-"+u+(b?" us-modal-noclose":"")+(x?" us-modal-footer":"")+(w?" us-modal-dir-"+w:"")+(s?" "+s:""));setTimeout(function(){N.removeClass("us-modal-ready").addClass("us-modal-on");C.removeClass("us-modal-ready").addClass("us-modal-on")},10)},y=function(e){var t=$("html"),n=$(".us-modal-box");e&&(n=a(e));t.removeClass(function(e,t){return(t.match(/\bus-modal-\S+/g)||[]).join(" ")});n.removeClass("us-modal-on").addClass("us-modal-ready");setTimeout(function(){t.removeClass("us-modal-on us-modal-ready");n.removeClass("us-modal-on us-modal-ready");c(!1,n)},400)};return{init:r,openModal:g,closeModal:y}}($);uSwitch.modal.init(!0);