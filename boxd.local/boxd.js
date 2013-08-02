var numb = 0;
var boxfrac = 4;  //determines the ratio in regard the window to size the current box

function boxdheight () {
											boxheight = (window.outerHeight/(boxfrac))*(boxfrac-1);   //focusd box
}
function shrunkdheight() {
                shrunkheight = boxheight/7;
                if ( shrunkheight < 17 ){
                  shrunkheight = 17;
                } // this way at least a single line is visible
}

var boxheight = (window.outerHeight/(boxfrac))*(boxfrac-1);   //focusd box
var shrunkheight = boxheight/7;         //unfocusd box
	if ( shrunkheight < 17 ){
		shrunkheight = 17;
	} // this way at least a single line is visible

var game = "";
var boxfoc = "";
var olebox = "";
$('#whereitsat').scroll(function() {
				document.body.style.overflow='hidden';
});
$('thelot').scroll(function() {
				document.body.style.overflow='scroll';
});

var vald = 17;  //used to nullify consecutive clicks on an already focused textbox,17 or undf
	//boxheight=window.innerHeight/2;
	$('p.padittop').css('padding-top',boxheight+'px');
	$('p.paditbot').css('padding-bottom',boxheight+'px');

$(document).on('click','textarea',function() {
	$('p.padittop').css('padding-top',boxheight+'px');
	$('p.paditbot').css('padding-bottom',boxheight+'px');
					if ( vald ) {
						$(this).animate({ height: boxheight }, 1000,function(){
						$('p.anot').text($('#'+this.id).position().top+".."+vald+',.,'+(numb+4)+";box: "+boxheight+";shrunk: "+shrunkheight);
						
						
						var postop = $('#'+this.id).position().top;
					  var totwin = window.outerHeight;
						var fracwin = totwin/(boxfrac);
						var totbox = boxheight;
					  var fracbox = totbox/(boxfrac);
						var offbox = fracbox+postop;
						var offwin = fracwin-offbox;
						var centd = $('#foryou.scrolld').scrollTop()-offwin;
						$('#foryou.scrolld').animate({ scrollTop: centd },700);

						});
					}
						olebox = boxfoc;
						boxfoc = this;
						vald='';
    $('p.boxy').text('boxy: ' + $('#'+boxfoc.id).position().top);
});

$('#foryou').scroll(function() {
				$('p.dispy').text($('#foryou').scrollTop()+' .. pads : t:  : b :'+$('p.padittop').css("padding-top"));
});

$(document).on('blur','textarea',function() {
					vald=17;
					game="";
					$(this).animate({ height: shrunkheight }, 980);  // 17*3=51
	//$('p.padittop').css('padding-top',0+'px');
	//$('p.paditbot').css('padding-bottom',0+'px');
}); // .on('blur', shrink box


function getcursor(el) {
						if (el.selectionStart) {
							return el.selectionStart;
							} else if (document.selection) {
										el.focus();
	
										var r = document.selection.createRange();
										if ( r == null ){
													return 0;
										}
										var re = el.createTextRange(),
												rc = re.duplicate();
										re.moveToBookmark(r.getBookmark());
										rc.setEndPoint('EndToStart',re);
										return rc.text.length;
							}
						 return 0;

} // getcursor(), finds cursor location in element

function boxd(thisbox,keyd,pushd) {
			var cursdisp = 0;
		  var longestsplit = 40; // smallest possible segment of the input to analyse	
			var revflag = '[^a-z]'  //revflag is element of ruleset that tells when to review and apply rules during the work flow
			
			if ( keyd != 8 && keyd != 46 )   // 8 and 46 are bkspc and del respectively, due naive regex that would replace nod if correcting by nos,bkspc,d
			{

			if ( new RegExp(revflag,'i').test(pushd) )
			{		
				var curspos = (getcursor(thisbox));
				var lastchar = thisbox.value.charAt(curspos-1); // last character typed
				var ofimport = (thisbox.value.substring(curspos-longestsplit,curspos+longestsplit)); // snippet to limit text iterated over
				var bulkd = thisbox.value.split(ofimport);  //entire work surrounding important bit

				/// full word replace
					var changeref = [ "no", "not", "never","doublenonot" ]; //make an object so you can have both word to change and word to change too associated
					var repld = "Ni!";
				
					for ( var i = 0; i < changeref.length; i++ ) 
					{
								
						if ( new RegExp('(^|[^a-z])'+changeref[i]+'(?=[^a-z])','gi').test(ofimport) ) 
						{
								var scrollpos = thisbox.scrollTop;						//logs the current position of the scrollbar	
								
								ofimport=ofimport.replace(changeref[i],repld); 
								

								cursdisp=repld.length-changeref[i].length;
						}
				
					} // full word replace																	
					
					/// prefix
					var preref = [ "non", "un" ];
					repld = "Ni!";
				  for ( var i = 0; i < preref.length; i++ )
			   	{
					 	if ( new RegExp('(^|[^a-z])'+preref[i]+'(?=[a-z])','gi').test(ofimport) ) 
					 	{
							//ofimport=ofimport.replace( new RegExp('(^|[^a-z])'+preref[i]+'(?=[a-z])','gi'), "$1" ); // just replace forbidden bit
							//cursdisp = -(preref[i].length);
							
								var befomit = ofimport.length;
							ofimport=ofimport.replace( new RegExp('(^|[^a-z])'+preref[i]+'([a-z]*(?=[^a-z]))','gi'), "$1" ); // omit containing word
								var aftomit = ofimport.length;
								var contwordlen = aftomit-befomit;
							cursdisp = contwordlen;
						}
          } // prefix replace
					
				  ///suffix 
					var sufref = [ "ing", "tion" ];
					repld = "Ni!";
				  for ( var i = 0; i < sufref.length; i++ )
			   	{
					 	if ( new RegExp('(?=[a-z])'+sufref[i]+'(?=[^a-z])','gi').test(ofimport) ) 
					 	{
						  //ofimport=ofimport.replace( new RegExp('(?=[a-z])'+sufref[i]+'([^a-z])','gi'), "$2" );  // just replace forbidden bit
							//cursdisp = -(sufref[i].length);
								
								var befomit = ofimport.length;
							ofimport=ofimport.replace( new RegExp('([a-z])*'+sufref[i]+'([^a-z])','gi'), "$2" ); // omit containing word
								var aftomit = ofimport.length;
								var contwordlen = aftomit-befomit;
							console.log(befomit+'..'+aftomit+'..'+contwordlen);
							cursdisp = contwordlen;
						}
          } // suffix replace



				//since it works in snippets of entire this.value, have button that allows for one time full scan of entire document in case of copy and paste text

				// create communicable api that allows POST box creation, first argument sent to api should be number of boxes adding, if number is too big, return error of too big and suggest smaller size, ie 10000 is too large try only 100... then limit number allowed from each ip by day by storing the ip in database with amount submitted and add or subtract that value, remove ip from db as the track expires

					thisbox.value=bulkd[0]+ofimport+bulkd[1];
					
				}
					// let's talk regex :: 
					// ^ beginning of input, 
					// | or, 
					// [^a-z] match everything but a-z, 
					// (?=[^a-z]$) only match if equal to characters other than a-z, 
					// /g global, 
					// i ignore case
					// $1 places last character into this position
			}
			if ( curspos ) {
				curspos=curspos+cursdisp;
				thisbox.setSelectionRange(curspos,curspos);   //due the replace the cursor position is lost, and so we reset it here
				thisbox.scrollTop=scrollpos;		//due the replace the scroll position is lost, and so we reset it here
			}
} //boxd(), boxd ruleset


$(document).on('keyup','textarea', function(event) {
				game = this.id;     //replace this with a get.object.value 'game' from current box
				console.log(game);
					
				var keyd = event.keyCode || event.which;
				var pushd = String.fromCharCode(keyd);
				
				if ( typeof window[game] == 'function'){					
					window[game](this,keyd,pushd);
				}
}); // .on('keyup', when keypress go to current box's ruleset



function stord() {
                var stord = unescape(encodeURIComponent(JSON.stringify(localStorage))).length/1024/1024;
                var shortd = stord.toFixed(3);
                $('p.stord').text('store: ' + shortd + 'mb');
                var fivemegworthchars = 5000000;
                var fivemegworthlines = 65000;
                var liney=fivemegworthlines - shortd*fivemegworthlines;
                var chardy=fivemegworthchars - shortd*fivemegworthchars;
                $('p.tona').text('lines left: ' + liney + '..characters left: ' + chardy);
} // stord(), determine how much is stored in db

function infd() {
					window.scrollTo(0,document.body.scrollHeight);
} //infd()

function topd() {
					window.scrollTo(0,0);
} //topd(), scroll to top

function thesets() { //uses boxheight, shrunkheight
								boxdheight();
								shrunkdheight();
                $('p.padittop').css('padding-top',boxheight+'px');
                $('p.paditbot').css('padding-bottom',boxheight+'px');


                $('p.dyhei').text('hei : '+ boxheight);

                //$('#foryou.scrolld').css('height',(boxheight*2-33)+'px');
} // thesets(), sets textarea dimensions


function store() {

                //localStorage.clear();

                console.log($('#theflow').children().length-4);


                $('#theflow > textarea').each(function() {
                	console.log(this.id);
                	localStorage[this.id]=this.value;
                	stord();
                });
} // store(), store the values into db


function addele() {    //uses +numb,DOM

                var flow = document.getElementById('theflow');
                var num = ( numb ) + 1;
                var romu = romanise(num);

                var newbox = document.createElement('textarea');
                var newboxid ='box'+num;

                newbox.setAttribute('id',newboxid);
                newbox.setAttribute('class','tecksd');
                newbox.setAttribute('placeholder','('+romu+')');

                flow.appendChild(newbox);

                numb = num;

                if ( localStorage[newboxid] ){
                  newbox.value=localStorage[newboxid];
                }

} //addele(), add element



function remele(){ //uses DOM
                var flow = document.getElementById('theflow');
                flow.removeChild(boxfoc);
} // remele(), remove element





function romanise (num) { //inde
                if (!+num)
                    return false;
                var digits = String(+num).split(""),
                    key = ["","c","cc","ccc","cd","d","dc","dcc","dccc","cm",
                           "","x","xx","xxx","xl","l","lx","lxx","lxxx","xc",
                           "","i","ii","iii","iv","v","vi","vii","viii","ix"],
                    roman = "",
                    i = 3;
                while (i--)
                    roman = (key[+digits.pop() + (i * 10)] || "") + roman;
                return Array(+digits.join("") + 1).join("M") + roman;
} // romanise(), turn numbers into roman numerals











































		function sansaccent(s) {
	s = trim(s);
		//codes with unpredictable activity after toLowerCase() is called on string
	for ( var chard in s) {
	s = s.replace("\u00E0","a"); //a accent grave
	}
			return s;
		}

/////
		function clear() {
			document.getElementById('postcomp').innerHTML = "";
    			document.getElementById('helpbox').innerHTML = "";
			helpboxer = ""; helppatround = 0;	stringer = "...";hitems="";
			founder=17; foundhere="";
		} //clear()
		function sani(s) {
    	s = s.replace(/\&/gi, "&amp");
    	s = s.replace(/\</gi, "&lt");
    	s = s.replace(/\>/gi, "&gt");
			return s;
		} //sani()
		function trim(s) {
    	s = s.replace(/(^\s*)|(\s*$)/gi,"");
    	s = s.replace(/[ ]{2,}/gi," ");
    	s = s.replace(/\n /,"\n");
			return s;
		} //trim()


function interpret() {   //uses sani(),trim(),implementation(),recognise()
		clear();
    var text = document.getElementById('my_text');
    var div = document.getElementById('postcomp');
    var helpbox = document.getElementById('helpbox');

    var hippo="";

    var fulltext = trim(sani(text.value));

		var sentences = fulltext.split(";");
			var howmanysentences = sentences.length;
		alert(howmanysentences);
		var i = 0; //sentences[1..n]
		while ( i < howmanysentences-1 ) { //-1 :: counts the token after last ';'
			//stringer = stringer + "</br></br>" + i + ":</br></br>";
			harpo=sansaccent(sentences[i]);
			huppo=trim(sentences[i])
			hippo=hippo+harpo+":"+huppo+";<br />";
			i++;
		}

		//hippo=sansaccent(fulltext);
		div.innerHTML = hippo;

		//div.innerHTML = stringer;
		//div.innerHTML = hitems;
		//div.innerHTML = stringer+"</br></br></br>"+hitems;

		helpbox.innerHTML = "->";

// ! @ # $ % ^ & * ( ) _ + = - [ ] { } : ?

} //interpret()


