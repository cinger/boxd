var ruleinputboxheight = 27;
/////////////////
///boxd.js
//uses[DOM,placent(),jQ]
//is[ jQ{ document.on('click',.on('blur',.on('keyup' } ]
var dataobj = {
  "users": [{
    "id": 17,
    "username": "cinger",
    "self": {
      "background-color": "black",
      "box-background-color": "white",
      "text-color": "white"
    },
    "cust": {
      "wooz": "thaers",
      "lance": "thaers",
      "russell": "self"
    },
    "look": "self",
    "boxes": {
      "boxd": {
        "gameid": 17,
        "text": "\"hazzah\""
      },
      "boxi": {
        "gameid": 3,
        "text": "'hazzah'"
      },
      "boxii": {
        "gameid": 5,
        "text": "'onit'"
      },
      "boxiii": {
        "gameid": 3,
        "text": "'hazzah'"
      }
    }
  }],
  "games": {
    "orig": {
      "17": {
        "title": "boxd",
        "rules": [{
          "title": "string replace",
          "repld": "Ni!",
          "regexopn": "([^a-z])",
          "regexend": "(?=[^a-z])",
          "regexmod": "gi",
          "stringd": "(no|not|never|nothing|nope)",
          "lngsplt": 9,
          "revflag": "\\W"
        }, {
          "title": "extreme prejudice",
          "repld": "''",
          "regexopn": "''",
          "regexend": "''",
          "regexmod": "gi",
          "stringd": "(thing)"
        }]
      }
    },
    "uc": {
      "boxd": {
        "gameid": 17,
        "rules": {
          "word replace": {
            "repld": "Ni!",
            "regexopn": "([^a-z])",
            "regexend": "(?=[^a-z])",
            "regexmod": "gi",
            "stringd": ["no", "not", "never", "nothing"]
          },
          "extreme prejudice": {
            "repld": "''",
            "regexopn": "''",
            "regexend": "''",
            "regexmod": "gi",
            "stringd": ["thing"]
          }
        }
      }
    }
  },
  "meta": {
    "delgames": "1,2,3,4,5,58,700",
    "parserule": {
      "optionshrt": ["-t \"", "-o \"", "-e \"", "-m \"", "-s \"", "-r \"", "-l \"", "-v \""],
      "optionfull": ["--title \"", "--rgxop \"", "--rgxen \"", "--rgxmd \"", "--strar \"", "--repld \"", "--lngsp \"", "--rvflg \""],
      "helper": ["rule title options :: <br />\"extreme prejudice\" : remove all instances of string, -o -e -r unnecesssary <br /> \"string replace\", replace a string depending on parameters  <br />\"prefix replace\", replaces a prefix to a string <br />\"suffix replace\", replaces a suffix to a string", "rule title options :: <br />\"extreme prejudice\" : remove all instances of string, -o -e -r unnecesssary <br /> \"string replace\", replace a string depending on parameters  <br />\"prefix replace\", replaces a prefix to a string <br />\"suffix replace\", replaces a suffix to a string", "ending regular expression :: <br />must be placed in ( ) <br /> ..\"(?=[^a-z])\"", "ending regular expression :: <br />must be placed in ( ) <br /> ..\"(?=[^a-z])\"", "listing of flagd strings in an array :: <br />must be placed in ( ) with each value seperated by a pipe, |, character <br /> ..(no|not|never|nothing|nope)", "replacement string :: <br />any string to replace the flagd values <br /> ..\"Ni!\"", "longest split :: <br />longest possible string length to cover all necessary replacements<br /> ..\"40\"", "review flag :: <br />flagged key to initiate review of the boxes contents<br />.. \"\\W\""]
    }
  }
}

var uldjQ = $('#uld');
var rules = $("#uld li");




var numb = 0;
var boxfrac = 4; //determines the ratio in regard the window to size the current box
var boxfoc = "";
var rulefoc = '';
var game = "";
var vald = 17; //used to nullify consecutive clicks on an already focused textbox,17 or undf
var deftextquickset = document.getElementById('textdef');
deftextquickset.style.height = ruleinputboxheight + 'px';
var helpbox = document.getElementById('helper');
var helpboxprompt = "click the red bar to show or hide this box<br /> click the blue bar,furthest left, to add rules to the game<br /> click the orange box, second from left, to save game to your games list<br />click the green bar, third from left, to publish the game to the public<br /> click the purple box, farthest right, to show the JSON for your game's ruleset"
helpbox.innerHTML = helpboxprompt;
//document.getElementById('helper').innerHTML = "click the red bar to show and hide this help box";
var rulehelp = " all values after an option argument must be enclosed in double quotes \" \"<br />place the cursor one space from any of these option flags in your rule box to see the option's individual helper<br />--title -t : rule title <br />--rgxop -o :: opening regular expression <br />--rgxen -e :: ending regular expression <br />--rgxmd -m :: regular expression modifiers <br />--strli -s :: list of flagd strings <br />--repld -r :: replacement string";


$('#c1').on('click', function () {
  addele();
});
$('#c2').on('click', function () {
  store();
});
$('#c3').on('click', function () {
  store();
});
$('#c4').on('click', function () {
  infd();
});


var textitlejQ = $('.textitle');
//manipulate game rules
textitlejQ.on('blur', function () {
  if (dataobj.temp) {
    if (dataobj.temp.title != this.value) {
      dataobj.temp.title = this.value;
    }
  } else {
    dataobj.temp = {};
    dataobj.temp.title = this.value;
  }
});


uldjQ.on('click', 'textarea', function () {
  if (vald) {
    placent(this);
  }
  vald = '';
  helpbox.innerHTML = rulehelp;
}); // .on('click', expand and place in center

function ruleparse(origstr) {
  // it seems to me i need this ugly while>for loop structure to allow for anything in the regex
  var parsetoobj = {};
  var workingarr = [];
  var workingval = 0;
  //origstr overused differentiate between the origstring and post regex str
  parsetoobj.origstring = origstr; // useful for diff tests on live edits to limit resource consumption
  //origstr=ruleclean(origstr); //wow, realised regex could do this easy and solve empty rule problem
  if (origstr.match(new RegExp('(-.*")', 'gi')) === null) {
    return;
  } else {
    origstr = origstr.match(new RegExp('(-.*")', 'gi')).join();
  }

  while (origstr.length > 0) {
    var workingstringshrt = origstr.substring(0, 4);
    var workingstringfull = origstr.substring(0, 9);
    var secelstr;
    var secarrel = [];
    var bound = 0;
    for (var i = 0; i < dataobj.meta.parserule.optionshrt.length; i++) {
      if (dataobj.meta.parserule.optionshrt[i] == workingstringshrt || dataobj.meta.parserule.optionfull[i] == workingstringfull) {
        if (dataobj.meta.parserule.optionshrt[i] == workingstringshrt) {
          secarrel = origstr.split(dataobj.meta.parserule.optionshrt[i]);
          workingarr[workingval] = i;
          workingval += 1;
          workingarr[workingval] = dataobj.meta.parserule.optionshrt[i];
          workingval += 1;
        }
        if (dataobj.meta.parserule.optionfull[i] == workingstringfull) {
          secarrel = origstr.split(dataobj.meta.parserule.optionfull[i]);
          workingarr[workingval] = i;
          workingval += 1;
          workingarr[workingval] = dataobj.meta.parserule.optionfull[i];
          workingval += 1;
        }
        secelstr = secarrel[1];
        while (secarrel.length > 1) {
          for (var ii = 0; ii < dataobj.meta.parserule.optionshrt.length; ii++) {
            secarrel = secelstr.split(dataobj.meta.parserule.optionshrt[ii]);
            if (secarrel.length == 2) {
              secarrel.pop();
              secelstr = secarrel[0];
            }
          }
          for (var ii = 0; ii < dataobj.meta.parserule.optionfull.length; ii++) {
            secarrel = secelstr.split(dataobj.meta.parserule.optionfull[ii]);
            if (secarrel.length == 2) {
              secarrel.pop();
              secelstr = secarrel[0];
            }
          }

        }
        secelstr = secarrel[0];

        workingarr[workingval] = secelstr;
        workingval = workingval + 1;
        //console.log(workingarr);
        //console.log(workingarr.length/3);
        subtractstring = workingarr[workingval - 2] + workingarr[workingval - 1];
        origstr = origstr.substring(subtractstring.length, origstr.length);
        bound = 0;
      } else {
        bound++;
        if (bound > dataobj.meta.parserule.optionshrt.length) {
          break; //really look into the necessity of this...
        }
      }
    } // end for
  } // end while ( origstr.length > 0 ) {
  parsetoobj.getopts = workingarr;
  return parsetoobj;
}


function ruleontology(thisbox) {
  if (dataobj.temp) {
    // parse work function  
    if (dataobj.temp === undefined || dataobj.temp.rules === undefined) {
      dataobj.temp = {};
      dataobj.temp.rules = {};
      var parsewrkfuncobj = ruleparse(thisbox.value);
      dataobj.temp.rules[thisbox.id] = parsewrkfuncobj;

    } else {
      //var parsewrkfuncobj = ruleparse(this.value);
      //var ruletitle = parsewrkfuncobj.title;
      if (dataobj.temp.rules[thisbox.id] || dataobj.temp.rules[thisbox.id] === "undefined") {
        if (dataobj.temp.rules[thisbox.id].origstr != thisbox.value) {
          var parsewrkfuncobj = ruleparse(thisbox.value);
          dataobj.temp.rules[thisbox.id] = parsewrkfuncobj;
        }
      } else {
        var parsewrkfuncobj = ruleparse(thisbox.value);
        dataobj.temp.rules[thisbox.id] = parsewrkfuncobj;
      }
    }
  } else {
    dataobj.temp = {};
    dataobj.temp.rules = {};
    var parsewrkfuncobj = ruleparse(thisbox.value);
    dataobj.temp.rules[thisbox.id] = parsewrkfuncobj;
  }
}


//###############3
//###############3
//
//modals : error button, clicks rule, clicks default, load preexisting game ruleset
//err only checks first and last character, can i do more?
//###############3
//###############3
//###############3


function fleshrule(thisbox) {
  //retrieve the options from the parsed rulebox
  var opts = dataobj.temp.rules[thisbox.id].getopts;

  // create the temporary rule
  dataobj.temp.rules[thisbox.id].real = {};
  dataobj.temp.rules[thisbox.id].real.title = "";
  dataobj.temp.rules[thisbox.id].real.rgxop = "";
  dataobj.temp.rules[thisbox.id].real.rgxen = "";
  dataobj.temp.rules[thisbox.id].real.rgxmd = "";
  dataobj.temp.rules[thisbox.id].real.strar = "";
  dataobj.temp.rules[thisbox.id].real.repld = "";
  dataobj.temp.rules[thisbox.id].real.lngsp = "";
  dataobj.temp.rules[thisbox.id].real.rvflg = "";
  // must declare empty values to ensure they exist, even if rule neglects them

  var optsnum = opts.length; //number of options
  var bildstring = ""; //the string used to build the real rule
  var i = 0;
  while (i < optsnum) { // do until all opts have been processed
    var optarrval = opts[i]; // takes in options dataobj.meta.parserule array value
    bildstring = bildstring + opts[i + 1] + opts[i + 2]; //construct the build string by taking the next opt array values
    // opts[i+1] : option : -t , et al
    // opts[i+2] : value  : "extreme prejudice" , et al

    // find the key by taking opt[i] of the optionfull object
    var keyfromfull = dataobj.meta.parserule.optionfull[optarrval].substring(2, 7);

    if (i < optsnum - 3) { // early opts end in ' "'
      dataobj.temp.rules[thisbox.id].real[keyfromfull] = opts[i + 2].substring(0, opts[i + 2].length - 2);
    } else { // the last opt ends solely in '"'
      dataobj.temp.rules[thisbox.id].real[keyfromfull] = opts[i + 2].substring(0, opts[i + 2].length - 1);
    }
    i = i + 3; // next opt starts at 3+ array element
  }
  dataobj.temp.rules[thisbox.id].bildstring = bildstring; // stores buildstring in dataobj
}


function syntaxerr(thisbox) {
  //err detection severly primitive due the desire for 'anything goes' in regexs... 
  //perhaps i can improve it further
  if (dataobj.temp.rules[thisbox.id] === undefined) {
    return;
  } else {
    if (dataobj.temp.rules[thisbox.id].origstring) {
      var orgstr = dataobj.temp.rules[thisbox.id].origstring;
      var bldstr = dataobj.temp.rules[thisbox.id].bildstring;
      var rulenum = thisbox.id.substring(4, thisbox.id.length);
      if (orgstr == bldstr) {
        $("#errd" + rulenum).css('visibility', 'hidden');
      } else {
        //console.log(rulenum);
        $("#errd" + rulenum).css('visibility', 'visible');
        var errmodp = document.getElementById('#errdmodpo');
        var errmodb = document.getElementById('#errdmodpb');
        var errmodpobj = document.getElementById('#errdmodpobj');
        errdmodpo.innerHTML = "your input .. " + orgstr;
        errdmodpb.innerHTML = "input used .. " + bldstr;
        errdmodpobj.innerHTML = JSON.stringify(dataobj.temp.rules[thisbox.id].real, null, 4);
      }
    }
    //console.log(orgstr);
  }
}



uldjQ.on('blur', 'textarea', function () {
  vald = 17;
  helpbox.innerHTML = helpboxprompt;
  ruleontology(this); // determines if rule exists, then sends rule arguments to ruleparse function creating the temp rule obj

  if (dataobj.temp.rules[this.id] === undefined) {
    return;
  } else {
    fleshrule(this); // uses getopts to flesh out the rule entire
    syntaxerr(this); // diff origstring and bildstring to determine if there is an error 
  }

  console.log(dataobj.temp.rules);
}); // .on('blur', associate rule box contents to game 


$('#testbox').on('click', function () {
  var x = "USELESS FUNC FILLER";
});

$("#showhidedef").on('click', function () {
  var state = ($("#def").css("visibility")); // determines the toggling effect
  var stateoth = ($("#help").css("visibility")); // determines the toggling effect

  if (stateoth == "hidden") {
    if (state == "hidden") { // if already hidden then show
      $(".innerscrollhide").css("height", "67%"); ///make this shit variable arithmetic 
      $("#def").css("visibility", "visible");
      $("#def").css("height", "27%");
      $("#defd").css("padding", "0");
      $("#defd").css("margin", "0");
    } else { // if shown then hide
      $("#def").css("visibility", "hidden");
      $("#def").css("height", "0%");
      $(".innerscrollhide").css("height", "94%");
      //$(".innerscrollhide").css("height","97%");		  
    }
  } else {
    if (state == "hidden") { // if already hidden then show
      $(".innerscrollhide").css("height", "40%");
      $("#def").css("visibility", "visible");
      $("#def").css("height", "27%");
      $("#defd").css("padding", "0");
      $("#defd").css("margin", "0");
    } else { // if shown then hide
      $("#def").css("visibility", "hidden");
      $("#def").css("height", "0%");
      $(".innerscrollhide").css("height", "67%");
      //$(".innerscrollhide").css("height","97%");		  
    }

  }
});


$("#showhidehelp").on('click', function () {
  var state = ($("#help").css("visibility")); // determines the toggling effect
  var stateoth = ($("#def").css("visibility")); // determines the toggling effect

  if (stateoth == "hidden") {
    if (state == "hidden") { // if already hidden then show
      $(".innerscrollhide").css("height", "67%");
      $("#help").css("visibility", "visible");
      $("#help").css("height", "27%");
      $("#helper").css("padding", "0");
      $("#helper").css("margin", "0");
    } else { // if shown then hide
      $("#help").css("visibility", "hidden");
      $("#help").css("height", "0%");
      $(".innerscrollhide").css("height", "94%");
      //$(".innerscrollhide").css("height","97%");		  
    }
  } else {
    if (state == "hidden") { // if already hidden then show
      $(".innerscrollhide").css("height", "40%");
      $("#help").css("visibility", "visible");
      $("#help").css("height", "27%");
      $("#helper").css("padding", "0");
      $("#helper").css("margin", "0");
    } else { // if shown then hide
      $("#help").css("visibility", "hidden");
      $("#help").css("height", "0%");
      $(".innerscrollhide").css("height", "67%");
      //$(".innerscrollhide").css("height","97%");		  
    }

  }
});

function displayhelper(thisbox) {
  var state = ($("#help").css("visibility"));
  if (state == "visible") { // avoid using resources if help box is hidden

    var curspos = getcursor(thisbox); // find the cursor position
    // check both options to allow for user preference
    var mostrecentshrt = thisbox.value.substring(curspos - 3, curspos);
    var mostrecentfull = thisbox.value.substring(curspos - 8, curspos);
    var disp = document.getElementById('helper'); // prep for display
    var dispd = 0; // avoid 
    if (mostrecentfull == "--title " || mostrecentshrt == "-t ") {
      disp.innerHTML = dataobj.meta.parserule.helper[0];
      dispd = 1;
    }
    if (mostrecentfull == "--rgxop " || mostrecentshrt == "-o ") {
      disp.innerHTML = dataobj.meta.parserule.helper[1];
      dispd = 1;
    }
    if (mostrecentfull == "--rgxen " || mostrecentshrt == "-e ") {
      disp.innerHTML = dataobj.meta.parserule.helper[2];
      dispd = 1;
    }
    if (mostrecentfull == "--rgxmd " || mostrecentshrt == "-m ") {
      disp.innerHTML = dataobj.meta.parserule.helper[3];
      dispd = 1;
    }
    if (mostrecentfull == "--strar " || mostrecentshrt == "-s ") {
      disp.innerHTML = dataobj.meta.parserule.helper[4];
      dispd = 1;
    }
    if (mostrecentfull == "--repld " || mostrecentshrt == "-r ") {
      disp.innerHTML = dataobj.meta.parserule.helper[5];
      dispd = 1;
    }
    if (dispd == 0) {
      disp.innerHTML = rulehelp;
    } else {
      dispd = 0;
    }
  }
} //displayhelper(), display the help dialog

var ruleset = {};

function textboxresize(thisbox, e) {

  var thisboxid = thisbox.id;

  var contlist = document.getElementById("li" + thisbox.id);
  if (e.which == 8 || e.which == 46 || (e.ctrlKey && e.which == 88)) { //user is deleting, backspacing, or cutting
    thisbox.style.height = ruleinputboxheight + 'px';
    var contboxheight = ruleinputboxheight + 5;
    contboxheight = contboxheight + 'px';
    if (contlist) {
      contlist.style.height = contboxheight;
    }
  }
  var scrollby = thisbox.scrollHeight;
  var intyheight = parseInt(thisbox.style.height.substring(0, thisbox.style.height.length - 2));
  if (intyheight < scrollby) {
    while (intyheight < scrollby) {
      thisbox.style.height = scrollby + 3;
      if (contlist) {
        contlist.style.height = scrollby + 5;
      }
      intyheight = parseInt(thisbox.style.height.substring(0, thisbox.style.height.length - 2));
      scrollby = thisbox.scrollHeight;
    }
  }
} // textboxresize(), alter height of textbox to show full contents



// on key up of the ruleboxes
$('.outerscrollhide').on('keyup', 'textarea', function (e) {

  // change box height :: to show full contents
  textboxresize(this, e); // send the box and event value

  // show help dialogue : 
  displayhelper(this); // display helper in helpbox

}); // .on('keyup', when keypress go to current box's ruleset




/////////////////
///butt.js
//is[infd(),topd(),store(),addele(),remele()]
//uses[DOM]

function infd() { //uses[DOM]
  window.scrollTo(0, document.body.scrollHeight);
} //infd(), show info, via scroll

function topd() { //uses[DOM]
  window.scrollTo(0, 0);
} //topd(), scroll to top




function store() { //uses[stord(),jQ]
  //localStorage.clear();
  var storebutt = document.getElementById('store');
  fading(storebutt);
  console.log($('#theflow').children().length - 4); //keep around for awhile
  $('#theflow > textarea').each(function () {
    console.log(this.id); //keep around for awhile
    localStorage[this.id] = this.value;

    stord();
  }); // for each textbox store its value to the local storage, then call stord for an inventory of all the data
} // store(), store the values into db


///APPEND ONCE?

var primer = $('#primer');

function addele() { //uses[v{+}numb,DOM]

  if (rules.length < 1) {
    primer.css("display", "none"); // remove the dialogue showing how to find help
  }

  var potentialruleset = document.getElementById('uld');
  var listnode = document.createElement("LI");
  var num = (numb) + 1;
  var listid = 'lirule' + num;
  var buttid = 'buttrule' + num;
  listnode.setAttribute('id', listid);

  var a = document.createElement('a');

  //	a.title="clicks";

  var click = document.createElement('input');
  click.type = 'image';
  click.src = "sty/imgd/clicks.png";
  click.setAttribute('class', 'remmy');
  //listnode.appendChild(butt);

  a.appendChild(click);
  a.href = "#rulemodal";
  //listnode.appendChild(a);

  var butt = document.createElement('input');
  butt.type = 'image';
  butt.src = "sty/imgd/rem.png";
  butt.onclick = function () {
    remele(this.id)
  };
  butt.id = buttid;
  butt.setAttribute('class', 'remmy');
  //listnode.appendChild(butt);

  var newbox = document.createElement('textarea');
  newbox.setAttribute('class', 'tecksd');
  newbox.setAttribute('id', 'rule' + num);
  newbox.setAttribute('placeholder', 'enter some new rule arguments...');
  newbox.style.height = ruleinputboxheight + 'px';
  //listnode.appendChild(newbox);

  var errd = document.createElement('a');
  var ed = document.createTextNode("e");
  errd.appendChild(ed);
  errd.href = "#errdmodal";
  errd.setAttribute('class', 'errd');
  errd.setAttribute('id', 'errd' + num);
  $(".errd").css('visibility', 'hidden');

  listnode.appendChild(butt);
  listnode.appendChild(newbox);
  listnode.appendChild(a);
  listnode.appendChild(errd);

  potentialruleset.appendChild(listnode);

  numb = num;
  rules = $("#uld li"); //update potential number of rules
} //addele(), add element



function remele(thisboxid) { //uses DOM

  var potentialruleset = document.getElementById('uld');
  ruleid = thisboxid.substring(4, thisboxid.length);
  listid = 'li' + ruleid;
  var remrule = document.getElementById(listid);
  potentialruleset.removeChild(remrule);

  ///clean up database
  if (dataobj.temp) // yet to have clicked on any rulebox
  {
    if (dataobj.temp === undefined) // click in a rulebox, click away before entering text then remove all boxes
    {
      delete dataobj.temp;
    } else { // click in rulebox and add text then click away
      dataobj.temp.rules[ruleid] = null;
      delete dataobj.temp.rules[ruleid];
    }
  }
  // clean up database, delete traces of the box you are removing

  if (rules.length == 1) {
    primer.css("display", "block"); // shows the dialogue telling how to find help 
  }
  rules = $("#uld li"); //update potential number of rules
} // remele(), remove element




/////////////////
///wind.js
//is[ boxdheight(), shrunkdheight() ]
//uses[ padd() ]

//var boxheight = (window.outerHeight/(boxfrac))*(boxfrac-1);   //focusd box
boxheight = "27";
//padd(li.height);

var shrunkheight = boxheight / 7; //unfocusd box
if (shrunkheight < 17) {
  shrunkheight = 17;
} // this way at least a single line is visible

function boxdheight() { //uses[ DOM, padd() ]
  //boxheight = (window.outerHeight/(boxfrac))*(boxfrac-1);   //focusd box
  //
  //	boxheight=li.height;
  boxheight = "27";
  //padd(boxheight);
} // boxdheight(), determines boxheight and modifies the pads

function shrunkdheight() {
  shrunkheight = boxheight / 7;
  if (shrunkheight < 17) {
    shrunkheight = 17;
  } // this way at least a single line is visible
} //shrunkdheight(), determines the desired shrunk height




/////////////////
///css.js
//is[ padd(), jQ{ #whereitsat.scroll ; thelot.scroll } ]


/////////////////
///apid.js



/////////////////
///game.js
//is[  ]
//xuses




/////////////////
///boxs.js
//is[ boxd() ]
//
//
//

function repositioning(thisbox, manipulated, change) {
  if (manipulated.ofimport === undefined) {
    return manipulated;
  } else {
    manipulated.afterchange = manipulated.bulkdsplit.substring(0, manipulated.bulkdsplit.length - manipulated.orofimport.length);
    /*console.log("repositioning==");
		console.log(manipulated.bulkdsplit);
		console.log(manipulated.bulkdsplit.length);
		console.log(manipulated.orofimport.length);
		console.log(manipulated.orofimport);
    console.log(manipulated.afterchange);
		console.log(manipulated.ofimport);
		console.log(manipulated.orofimport);
		console.log(change);
		console.log("==repositioning");*/
    var scrollpos = thisbox.scrollTop; //logs the current position of the scrollbar	
    var olelen = manipulated.ofimport.length;
    manipulated.ofimport = change;
    var newlen = manipulated.ofimport.length;
    cursdisp = newlen - olelen;
    manipulated.cursdisp = cursdisp;
    manipulated.scrollpos = scrollpos;
    return manipulated;
  }
}


function stringreplace(thisrule, manipulated, thisbox) {
  var strar = thisrule.real.strar;
  var repld = thisrule.real.repld;
  var rgxop = thisrule.real.rgxop;
  var rgxen = thisrule.real.rgxen;
  var rgxmd = thisrule.real.rgxmd;
  if (new RegExp(rgxop + strar + rgxen, rgxmd).test(manipulated.ofimport)) {
    var change = manipulated.ofimport.replace(new RegExp(rgxop + strar + rgxen, rgxmd), repld);
    manipulated = repositioning(thisbox, manipulated, change);
  }
  return manipulated;
} // stringreplace(), remove string dependant on what comes before and after


function extremeprejudice(thisrule, manipulated, thisbox) {
  thisrule.real.repld = "";
  thisrule.real.rgxop = "(\\w*)";
  thisrule.real.rgxen = "(\\w*)";
  thisrule.real.rgxmd = "gi";
  manipulated = stringreplace(thisrule, manipulated, thisbox);
  return manipulated;
} // extremeprejudice(), remove all instances


function prefix(thisrule, manipulated, thisbox) {
  thisrule.real.repld = "$1$3";
  thisrule.real.rgxop = "(^|\\W+)";
  thisrule.real.rgxen = "(\\w+)";
  thisrule.real.rgxmd = "gi";
  manipulated = stringreplace(thisrule, manipulated, thisbox);
  return manipulated;
} // prefix(), remove prefix from word


function suffix(thisrule, manipulated, thisbox) {
  thisrule.real.repld = "$1";
  thisrule.real.rgxop = "(\\w+)";
  thisrule.real.rgxen = "";
  thisrule.real.rgxmd = "gi";
  manipulated = stringreplace(thisrule, manipulated, thisbox);
  return manipulated;
} // suffix(), remove suffix from word

function calculate(thisrule, manipulated, thisbox) {
	manipulated.orofimport=manipulated.orofimport+"\n";
  var frstchar = manipulated.ofimport.substring(0, 1); //using substring stead charAt in case i change format
  var lastchar = manipulated.ofimport.substring(manipulated.ofimport.length - 1);
  if (frstchar == "(" && lastchar == ")") {
    var toeval = manipulated.ofimport.substring(1, manipulated.ofimport.length - 1);
    var evald = math.eval(toeval);
    var change = manipulated.ofimport + "\r=== " + evald;
    //replace old answer if one exists
    var bulknext = manipulated.bulkd[1];
    if (bulknext) {
      if (bulknext.substring(0, 5) == "\n=== ") {
				var shag=bulknext.split("\n");
        manipulated.bulkd[1]=bulknext.substring(shag[1].length+1,bulknext.length);
      }
    }
  } else {
					var change = manipulated.ofimport+"\n";
		}
		manipulated = repositioning(thisbox, manipulated, change);
  return manipulated;
}

function pattern(thisrule, manipulated, thisbox) {

  var pattlen = 1;
  if (manipulated.backcheck) {
  if (manipulated.backcheck.length > thisrule.real.backnum) {
  if (thisrule.real.backnum > 1) {
    var midstring = manipulated.orofimport.substring(manipulated.ofimport[0].length, manipulated.orofimport.length - manipulated.ofimport[1].length)
  } else {
    var midstring = "";
  }
    if (manipulated.ofimport[1].length > pattlen) {
      if (manipulated.ofimport[0].substring(0, pattlen) == manipulated.ofimport[1].substring(0, pattlen)) {
        var change = manipulated.ofimport[0] + midstring + manipulated.ofimport[1];
      } else {
        var change = manipulated.ofimport[0] + midstring + manipulated.ofimport[0].substring(0,pattlen);
      }
    } else {
      var startpatt = manipulated.ofimport[0].substring(0, manipulated.ofimport[1].length);
      if (startpatt == manipulated.ofimport[1]) {
        var change = manipulated.ofimport[0] + midstring + manipulated.ofimport[1]
      } else {
        var change = manipulated.ofimport[0] + midstring;
      }
    }
  } else {
    var change = manipulated.ofimport.join("");
  }


  manipulated = repositioning(thisbox, manipulated, change);
	return manipulated;
	} else { // if the user attempts to start with punctuation
	manipulated.ofimport= thisbox.value;
	manipulated.orofimport= thisbox.value;
	var change = "";
  manipulated = repositioning(thisbox, manipulated, change);

	return manipulated;
	}
}




function syllable(thisrule, manipulated, thisbox) {
  var word = thisbox.value.toLowerCase();
  if (word.length <= 3) {
    return 1;
  }
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  syllables = word.match(/[aeiouy]{1,2}/g).length;
  console.log(syllables);

  //	still fucked
  var wordhyph = thisbox.value.toLowerCase();
  console.log(hyphenateWord("en", wordhyph));
  return manipulated;
} //syllable anylisis 


function reformat(thisrule, manipulated, thisbox) {


  return manipulated;
} // reformat(), changes based on predetermined inputs


function format(thisrule, manipulated, thisbox) {


  return manipulated;
} // format(), changes based on predetermined sets



var testbox = $('#testbox');

testbox.on('keyup', function (event) {
  if (dataobj.temp) {
    var keyd = event.keyCode || event.which;
    var pushd = String.fromCharCode(keyd);
    if (keyd != 8 && keyd != 46 && keyd != 37 && keyd != 38 && keyd != 39 && keyd != 40 && keyd != 16) {
      temp(this, pushd);
    }
  } else {
    console.log('waiting on game rules...');
  }
}); // .on('keyup', when keypress go to current box's ruleset


function temp(thisbox, pushd) {
  $.each(rules, function () {
    var rulenum = (this.id.substring(2)); //removes the li from the beginning of the id, from 'lirule#' to 'rule#'
    var thisrule = dataobj.temp.rules[rulenum];
    if (thisrule) {
      thisrule = getdefaults(thisrule);
      var revflag = thisrule.real.rvflg;
      testkeypress(thisbox, thisrule, pushd, revflag);
    }
  }); // $.each(
} //temp(), tempbox ruleset

function getdefaults(thisrule) {
  switch (thisrule.real.title) // in case of rules with mandatory defaults
  {
  case "calculate":
    thisrule.real.rvflg = "\r";
    thisrule.real.lngsp = "line";
    break;
  case "pattern":
    thisrule.real.rvflg = "\\W";
    thisrule.real.lngsp = "backword";
    thisrule.real.extnt = "full";
    thisrule.real.backnum = 1;
  default: // in case flex defaults were forgotten
    if (thisrule.real.rvflg == "")
      thisrule.real.rvflg = "\\W";
    if (thisrule.real.lngsp == "")
      thisrule.real.lngsp = "40";
  }
  return thisrule;
}

function testkeypress(thisbox, thisrule, pushd, revflag) {
  // if the key pushed is of a character from the review flag, then perform the review
  if (new RegExp(revflag, 'i').test(pushd)) {
    var manipulated = {
      'curspos': 0
    };
    var getcurspos = (getcursor(thisbox));
    manipulated = texttoman(thisbox, thisrule, manipulated, getcurspos, revflag); //adds curspos, ofimport, bulkd to manipulated obj
    //returns new values into manipulated .ofimport and .cursdisp if rule is found
    manipulated = checkrule(thisbox, thisrule, manipulated);

    if (manipulated.bulkd && manipulated.curspos > 0) { // post any changes to box
      newtext(thisbox, manipulated);
    } // if bulkd && curspos > 0

    movecursorandscroll(thisbox, manipulated);
  } // if RegExp .test(pushd)
}

function lastundi(arr) {
  if (arr[arr.length - 1] == "") {
    arr.pop();
  }
  return arr;
}

function texttoman(thisbox, thisrule, manipulated, curspos, revflag) {
  var bulkdsplit = thisbox.value.substring(0, curspos)
  var longestsplit = thisrule.real.lngsp;
  if (curspos > 0) {
    var lastchar = thisbox.value.match(new RegExp("(\W*$)", "g")); // most recent character typed
  } else {
    var lastchar = '';
  }
  switch (longestsplit) {
  case "line":
    var snippd = thisbox.value.substring(0, curspos).split("\n");
    var ofimport = snippd[snippd.length - 2]; //last element is always undefined [ ... , "" ] because the review  flag is \r
    var orofimport = ofimport;
    //var bulkdsplit = ofimport;
    //var bulkd = thisbox.value.split(bulkdsplit); //array of entire work surrounding important bit
    break;
  case "backword":
    //could add a descision on how many back words, every 2 words, or 3, or n... perhaps first words leading the value of n set the alliteration pattern to follow
    var backnum = thisrule.real.backnum;
    var longestsnip = backnum * 80; // 80 character word limit seems appropriate
    var backcheck = bulkdsplit.match(/(\w+)(\W+)/gi);
    var orofimport = "";
		manipulated.backcheck = backcheck;
    if (backcheck && backcheck.length > backnum) {
      var first = backcheck[backcheck.length - (backnum + 1)];
      var second = backcheck[backcheck.length - 1];
			console.log("first:" + first + "..second:" + second);
      var fstspot = backcheck.length - (backnum + 1);
      while (fstspot < backcheck.length) {
        orofimport = orofimport + backcheck[fstspot]
        fstspot = fstspot + 1
      }
      ofimport = [backcheck[backcheck.length - (backnum + 1)], backcheck[backcheck.length - 1]];
    } else {
			if (backcheck ){
      ofimport = backcheck;
      var fstspot = 0;
      while (fstspot < backcheck.length) {
        orofimport = orofimport + backcheck[fstspot]
        fstspot = fstspot + 1
      }
			}
    }
    break;


  default:
    {
						/*
      if (curspos - longestsplit < 0) { // snippd is a piece of the box's value, if that snippet is close to the beginning
        var snippd = (thisbox.value.substring(0, curspos + longestsplit)); // snippet to limit text iterated over
        var ofimportunnec = '';
      } else {
        if (curspos + longestsplit > thisbox.value.length) { // if snippet is close to the end
          var snippd = (thisbox.value.substring(curspos - longestsplit, thisbox.value.length)); // snippet to limit text iterated over
        }
        if (!snippd) { // if still yet to have been assigned, then assign it
          var snippd = (thisbox.value.substring(curspos - longestsplit, curspos + longestsplit)); // snippet to limit text iterated over
        }
        //since the snip is character based we have to remove first match 
        //to avoid false positives like a substr knot on k(not ..)
        var ofimportunnec = snippd.substring(0, snippd.length - snippd.replace(new RegExp('(^|[a-z])*' + revflag, 'i'), '').length);
      }

      if (ofimportunnec.length == snippd.length || snippd.length == thisbox.value.length || snippd.length == longestsplit + ofimportunnec.length) {
        // this protects from the potential for the box's initial input being one of the forbidden expressions
        var ofimport = snippd;
        var orofimport = ofimport;
      } else {
        var ofimport = snippd.substring(ofimportunnec.length, snippd.length);
        var orofimport = ofimport;
      }
			*/
        var ofimport = bulkdsplit.substring(bulkdsplit.length-80, bulkdsplit.length);
        var orofimport = ofimport;

      //var bulkd = thisbox.value.split(ofimport); //array of entire work surrounding important bit
    } //default
  } //switch

  manipulated.curspos = curspos;
  manipulated.bulkdsplit = bulkdsplit;
  manipulated.bulkd = thisbox.value.split(bulkdsplit); //array of entire work surrounding important bit
  manipulated.ofimport = ofimport; // important string
  manipulated.orofimport = orofimport; // original important string

  return manipulated;
}



//also added to addele and remele for dynamic update
//on boxd.js put this in .on('click',textarea to pull rules for that box from datastore

function movecursorandscroll(thisbox, manipulated) {
  var curspos = manipulated.curspos
  var cursdisp = manipulated.cursdisp
  var scrollpos = manipulated.scrollpos
  if (manipulated.curspos > 0 && manipulated.cursdisp) {
    curspos = curspos + cursdisp; // cursdisp is greater than zero if a replace or ommission occurred
    thisbox.setSelectionRange(curspos, curspos); //due the replace the cursor position is lost, and so we reset it here
    thisbox.scrollTop = scrollpos; //due the replace the scroll position is lost, and so we reset it here
  }
}


function checkrule(thisbox, thisrule, manipulated) {
  var thisruletitle = thisrule.real.title.replace(/\s+/g, ''); //retrieve title, remove human readable spacing
  // takes the rule title and sees if there is a rule function for it
  if (typeof window[thisruletitle] == 'function') {
    //performs rule on input value, returns new value and displacement of cursor for new value
    var newmanip = window[thisruletitle](thisrule, manipulated, thisbox); //adds cursdisp, scrollpos to manipulated obj
  } else {
    console.log("unknown rule... " + thisruletitle);
  }
  return newmanip;
}

function newtext(thisbox, manipulated) {
  /*
	console.log("NEWTEXT==");
	console.log(manipulated.afterchange);
	console.log(manipulated.orofimport);
	console.log(manipulated.ofimport);
	console.log(manipulated.bulkd);
	console.log("==NEWTEXT");
	*/
	if ( manipulated.orofimport != manipulated.ofimport ) {
  var newtext = manipulated.afterchange + manipulated.ofimport;
  for (var i = 1; i < manipulated.bulkd.length; i++) {
    if (manipulated.bulkd[i] != "") {
      newtext = newtext + manipulated.bulkd[i];
    }
  }
  thisbox.value = newtext;
	} else {
					thisbox.value=thisbox.value;
	}
}




// let's talk regex :: 
// ^ beginning of input, 
// | or, 
// [^a-z] match everything but a-z, 
// (?=[^a-z]$) only match if equal to characters other than a-z, 
// /g global, 
// i ignore case
// $1 places last character into this position




/////////////////
//pure.js
//is[placent(), stord(), thesets(), getcursor(), romanise() ]
//uses[DOM]


var innerscrollhidejQ = $('.innerscrollhide');
var defjQ = $('#def');

function placent(thisbox) { // uses[ DOM, jQ{ #foryou.scrolld.animate } ]
  var uldtopOFF = uldjQ.offset().top;
  var innerOFF = innerscrollhidejQ.offset().top;
  var uldtop = uldjQ.position().top;
  var postop = $('#' + thisbox.id).position().top; //position of element's top
  if (defjQ.css('visibility') == 'visible') { // hacky solution to mystery activity, i thought i only dealt within .innerscrollhide, but the open defaults box affected the numbers
    var defhei = parseInt(defjQ.css('height').substring(0, defjQ.css('height').length - 2));
    postop = postop - defhei;
  }
  var totwin = parseInt(innerscrollhidejQ.css('height').substring(0, innerscrollhidejQ.css('height').length - 2));
  var centdiff = totwin / 2 - postop;
  var scrollspot = innerscrollhidejQ.scrollTop();
  var themove = scrollspot - centdiff;
  innerscrollhidejQ.animate({
    scrollTop: themove
  }, 700);
} // place this in center of window


function stord() { //uses[ jQ{ pstord.text ; ptona.text } ]
  /*  var stord = unescape(encodeURIComponent(JSON.stringify(localStorage))).length/1024/1024;
  var shortd = stord.toFixed(3);
  $('p.stord').text('store: ' + shortd + 'mb');
  var fivemegworthchars = 5000000;
  var fivemegworthlines = 65000;
  var liney=fivemegworthlines - shortd*fivemegworthlines;
  var chardy=fivemegworthchars - shortd*fivemegworthchars;
  $('p.tona').text('lines left: ' + liney + '..characters left: ' + chardy);
*/
  var stord = "needswork";
} // stord(), determine how much is stored in db



function thesets() { //uses[ boxheight(), shrunkheight(), jQ{ p.text } ]
  boxdheight();
  shrunkdheight();
  $('p.dyhei').text('hei : ' + boxheight + "px");
} // thesets(), sets textarea dimensions

function fading(el) {
  var opac = 1;
  var lapse = 61;
  var timed = setInterval(function () {
    if (opac <= 0.07) {
      clearInterval(timed);
      el.style.visibility = 'hidden';
      console.log('hidden');
      flickd(el);
      return 0;
    }

    el.style.opacity = opac;
    el.style.filter = 'alpha(opacity=' + opac * 100 + ")";
    opac -= opac * 0.1
  }, 61);


} // fading(), fade out until save is complete

function flickd(el) {
  var onoff = 1;
  var lapse = 7;
  var timed = setInterval(function () {
    if (onoff <= 1 && onoff > .5) {
      console.log('in');
      el.style.visibility = '';
      el.style.opacity = '';
      el.style.filter = '';
    } else {
      if (onoff < .5 && onoff > .1) {
        el.style.visibility = 'hidden';
      } else {
        el.style.visibility = '';
        return 0;
      }
    }
    onoff -= onoff * .1;
  }, lapse);
} // flickd(), after save, flicker to show save completed


function getcursor(el) { //uses[DOM]
  if (el.selectionStart) {
    return el.selectionStart;
  } else if (document.selection) {
    el.focus();
    var r = document.selection.createRange();
    if (r == null) {
      return 0;
    }
    var re = el.createTextRange(),
      rc = re.duplicate();
    re.moveToBookmark(r.getBookmark());
    rc.setEndPoint('EndToStart', re);
    return rc.text.length;
  }
  return 0;
} // getcursor(), finds cursor location in element



function romanise(num) { //inde
  if (!+num)
    return false;
  var digits = String(+num).split(""),
    key = ["", "c", "cc", "ccc", "cd", "d", "dc", "dcc", "dccc", "cm",
      "", "x", "xx", "xxx", "xl", "l", "lx", "lxx", "lxxx", "xc",
      "", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix"
    ],
    roman = "",
    i = 3;
  while (i--)
    roman = (key[+digits.pop() + (i * 10)] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
} // romanise(), turn numbers into roman numerals




function sansaccent(s) {
  s = trim(s);
  //codes with unpredictable activity after toLowerCase() is called on string
  for (var chard in s) {
    s = s.replace("\u00E0", "a"); //a accent grave
  }
  return s;
}

/////

function clear() {
  document.getElementById('postcomp').innerHTML = "";
  document.getElementById('helpbox').innerHTML = "";
  helpboxer = "";
  helppatround = 0;
  stringer = "...";
  hitems = "";
  founder = 17;
  foundhere = "";
} //clear()

function sani(s) {
  s = s.replace(/\&/gi, "&amp");
  s = s.replace(/\</gi, "&lt");
  s = s.replace(/\>/gi, "&gt");
  return s;
} //sani()

function trim(s) {
  s = s.replace(/(^\s*)|(\s*$)/gi, "");
  s = s.replace(/[ ]{2,}/gi, " ");
  s = s.replace(/\n /, "\n");
  return s;
} //trim()


function interpret() { //uses sani(),trim(),implementation(),recognise()
  clear();
  var text = document.getElementById('my_text');
  var div = document.getElementById('postcomp');
  var helpbox = document.getElementById('helpbox');

  var hippo = "";

  var fulltext = trim(sani(text.value));

  var sentences = fulltext.split(";");
  var howmanysentences = sentences.length;
  alert(howmanysentences);
  var i = 0; //sentences[1..n]
  while (i < howmanysentences - 1) { //-1 :: counts the token after last ';'
    //stringer = stringer + "</br></br>" + i + ":</br></br>";
    harpo = sansaccent(sentences[i]);
    huppo = trim(sentences[i])
    hippo = hippo + harpo + ":" + huppo + ";<br />";
    i++;
  }

  //hippo=sansaccent(fulltext);
  div.innerHTML = hippo;

  //div.innerHTML = stringer;
  //div.innerHTML = hitems;
  //div.innerHTML = stringer+"</br></br></br>"+hitems;

  helpbox.innerHTML = "->";

  // ! @ # $ % ^ & * ( ) _ + = - [ ] { } : ?

  //interpret()
}
