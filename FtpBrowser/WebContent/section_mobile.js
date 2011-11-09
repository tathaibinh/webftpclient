$(document).ready(function(){$('.tabbed .tabs li a').live('click',function(ele){htb.Tabs.selectedTab(this);});$.ajaxSetup({timeout:(35*1000)});htb.setup();});window.onscroll=function(){$('.htbMessage').css('top',(window.pageYOffset+ window.innerHeight- 40)+'px');}
window.addEventListener('load',function(){window.setTimeout(function(){var bubble=new google.bookmarkbubble.Bubble();var parameter='bmb=1';bubble.hasHashParameter=function(){return window.location.hash.indexOf(parameter)!=-1;};bubble.setHashParameter=function(){if(!this.hasHashParameter()){window.localStorage+=parameter;}};bubble.getViewportHeight=function(){window.console.log('Example of how to override getViewportHeight.');return window.innerHeight;};bubble.getViewportScrollY=function(){window.console.log('Example of how to override getViewportScrollY.');return window.pageYOffset;};bubble.registerScrollHandler=function(handler){window.console.log('Example of how to override registerScrollHandler.');window.addEventListener('scroll',handler,false);};bubble.deregisterScrollHandler=function(handler){window.console.log('Example of how to override deregisterScrollHandler.');window.removeEventListener('scroll',handler,false);};bubble.showIfAllowed();},1000);},false);var htb={setup:function(){if(htb.getHashParams(true)=='settings')
htb.Nav.setTab('settings','/mobile/settings',$('#tabBar a.settings'));},getHashParams:function(single){var hashParams={};var e,a=/\+/g,r=/([^&;=]+)=?([^&;]*)/g,d=function(s){return decodeURIComponent(s.replace(a," "));},q=window.location.hash.substring(1);if(single)
return q;while(e=r.exec(q))
hashParams[d(e[1])]=d(e[2]);return hashParams;},logout:function(){$.mobile.showPageLoadingMsg();$.get("/mobile/logout",function(data){window.location.reload();});},toggleModal:function(modal){var offset=$(window).scrollTop();if($(modal).hasClass('show')){$(modal).fadeOut('fast');$(modal).removeClass('show');$(modal).addClass('hide');}else{$('.modal-wrapper',modal).css('top',(offset+80)+'px');$(modal).fadeIn('fast');$(modal).removeClass('hide');$(modal).addClass('show');}},toggleMessage:function(msg){var b=$('#htbMessage').clone();b.attr('id','');b.css('top',(window.pageYOffset+ window.innerHeight- 40)+'px');b.children('span').html(msg);b.insertAfter('#basic');b.fadeIn('slow').delay(2000).fadeOut(function(){$(this).remove();});},searchBeers:function(){$('.search-start').hide();$.mobile.showPageLoadingMsg();term=$('#searchBeersText').val();$.ajax({url:'/mobile/beer/find',type:'GET',data:{term:term},success:function(data){$.mobile.hidePageLoadingMsg();data=$.trim(data);if(data=='fail'){}else{$('#searchResults').html(data).listview('refresh');}},error:function(data){$.mobile.hidePageLoadingMsg();}});},listLoadMore:function(ele){var ul=$(ele).parents('ul');var more=$('.morePath',ul).val();var page=$('.nextPage',ul).val();$(ele).html('Loading...');$.ajax({type:'GET',url:more,data:{page:page},success:function(data){$.mobile.hidePageLoadingMsg();data=$.trim(data);if(data=='fail'){$(ele).html('No more...');}else{$("#tmpList").empty();$(data).appendTo('#tmpList');$("#tmpList").listview("refresh");$('#tmpList li').insertBefore($(ele).parents('li'));$(ele).html('Show more...');$('.nextPage',ul).val(parseInt(page)+1);}},error:function(data){$.mobile.hidePageLoadingMsg();}});}};

htb.Logout={setup:function(){var logout=$('.logoutlink').click(
		function(){
			$.ajax({type:'POST',url:'LoginServlet',data:'logout=true',
				success:function(data){
					$.mobile.hidePageLoadingMsg();
					window.location="/FtpBrowser/";
	                location.reload();
					},
				error:function(data){
					alert("Looks like we can't find the server, please try again.");
					$.mobile.hidePageLoadingMsg();
					}});});}
		}


htb.Login={setup:function(){
	var login=$('#loginForm').validate({
		rules:{login:"required",password:"required"},messages:{login:{required:"Required"},password:{required:"Required"}},
		submitHandler:function(form){htb.Login.submit();},
		invalidHandler:function(form,validator){alert("Email/Password Required");},
		showErrors:function(errorMap,errorList){}});},submit:function(){$.mobile.showPageLoadingMsg();
$.ajax({
	type:'POST',url:'LoginServlet',data:$("#loginForm").serialize(),
	success:function(data){$.mobile.hidePageLoadingMsg();
	data=$.trim(data);if(data=='fail'){alert("Invalid username or password");}else{
		window.location="/FtpBrowser/index.jsp#ftpConnections";
		}},
	error:function(data){alert("Looks like we can't find the server, please try again.");
	$.mobile.hidePageLoadingMsg();}});}}
htb.Signup={
		setup:function(){
			var signup=$('#signupForm').validate(
					{rules:{username:"required",password:{required:true,minlength:4}},
						messages:{username:{required:"Required"},password:{required:"4 characters minimum",minlength:"4 characters minimum"}},
						submitHandler:function(form){htb.Signup.submit();return false;},
						invalidHandler:function(form,validator){alert("You made a mistake!");}});},
						submit:function(){$.mobile.showPageLoadingMsg();
						$.ajax({type:'POST',url:'LoginServlet',data:$("#signupForm").serialize(),
							success:function(data){$.mobile.hidePageLoadingMsg();
							data=$.trim(data);if(data=='fail')
							{alert("There is already such a user, please try again.");}
							else{window.location="/FtpBrowser/index.jsp#ftpConnections";}},
							error:function(data){alert("Looks like we can't find the server, please try again.");
							$.mobile.hidePageLoadingMsg();}});}}

var temp;
htb.CreateFtp={
		setup:function(){
			$('.addFtpAccountForm').each( function(){

				var form = $(this);
				form.validate(
					
					{rules:{username:"required",password:{required:true,minlength:4},host:"required",port:{required:true,number: true},connectionname:"required"},
						messages:{username:{required:"Required"},password:{required:"4 characters minimum",minlength:"4 characters minimum"},host:{required:"Required"},
							port:{required:"Required",number:"Numeric input needed"},connectionname:{required:"Required"}},
							
						submitHandler:function(){
							$.mobile.showPageLoadingMsg();
							$.ajax({type:'POST',url:'FtpConnectionsServlet',data:form.serialize(),
								success:function(data){$.mobile.hidePageLoadingMsg();
								data=$.trim(data);if(data=='fail')
								{alert("There was an error, please try again.");}
								else{window.location="/FtpBrowser/index.jsp#ftpConnections";
				                location.reload();
								}},
								error:function(data){alert("Looks like we can't find the server, please try again.");
								$.mobile.hidePageLoadingMsg();}});
							return false;},
						invalidHandler:function(form,validator){alert("You made a mistake!");}
							});
				});
			
			$('.removeclass').bind('click', function (evt) { 
				//alert($(this).parent().children('em').html());
				$.ajax({type:'POST',url:'FtpConnectionsServlet',data:'activity=removeConnection&connectionname='+$(this).parent().children('em').html(),
					success:function(data){
						$.mobile.hidePageLoadingMsg();
						window.location="/FtpBrowser/index.jsp#ftpConnections";
		                location.reload();
						},
					error:function(data){
						alert("Looks like we can't find the server, please try again.");
						$.mobile.hidePageLoadingMsg();
						}});
			
			});

							}};


var curConnection = "";


$('#ftpConnections').live('pageshow',function(event, ui){

    $.ajax({
        type: 'POST',
        url: 'FtpConnectionsServlet?activity=getall&callback=?',
        dataType: 'json',
        cache: false,
        error: function(jqXHR, textStatus, errorThrown){
            $("#errorDiv").html("<h1>error!</h1><br/>"+textStatus+" "+errorThrown+" "+jqXHR);
        },
        success: function(data, textStatus){
            resHtml = '<div id="test">';
            $.each(data.items, function() {
                if (this != '') {
//                	resHtml += '<div data-role="collapsible">';
//                		resHtml += '  <h3>Im a header</h3>';
//                	resHtml += '  <p>Im the collapsible content. By default Im closed, but you can click the header to open me.</p>';
//                	resHtml += '</div>';

                	resHtml += '   <div data-role="collapsible" data-theme="d" data-collapsed="true" class="home_collapsible_hidden ui-collapsible-contain">';
                	resHtml += '<h3 style="border-top: 1px solid #ccc;"><em>'+this.connectionname+'</em><img class="removeclass" style="float:right" alt="Remove" src="images/remove.gif"/><img class="browseclass" style="float:right" alt="Browse" src="images/folder.gif"/></h3>';
                	resHtml += '<form action="" class="addFtpAccountForm" method="post">';
                	resHtml += '<div data-role="field-contain" class="required">';
                	resHtml += '<label for="connectionname">Connection Name</label>';
                	resHtml += '<input type="text" name="connectionname" readonly="readonly" value="'+this.connectionname+'" class="text-box"  />            </div>';
                	resHtml += '<div data-role="field-contain" class="required">';
                	resHtml += '<label for="username">Username</label>';
                	resHtml += '<input type="text" name="username" value="'+this.username+'" class="text-box"  />            </div>';
                	resHtml += '<div data-role="field-contain" class="required">';
                	resHtml += '<label for="password">Password</label>';

                	resHtml += '<input type="password" name="password" id="password" value="'+this.password+'" />';
                	resHtml += '</div>';
                	resHtml += '<div data-role="field-contain" class="required">';
                	resHtml += '<label for="host">Host</label>';
                	resHtml += '<input type="text" name="host" value="'+this.host+'" class="text-box"  />            </div>';
                	resHtml += '<div data-role="field-contain" class="required">';
                	resHtml += '<label for="port">Port</label>';

                	resHtml += '<input type="text" name="port" id="port" value="'+this.port+'" />';
                	resHtml += '</div>';
                	resHtml += '<input type="hidden" name="activity" value="edit"/>';
                	resHtml += '<button data-role="button" data-theme="b">Save Changes</button>';

                	resHtml += '</form>';
                	resHtml += '</div>';
                	
                	
                	
// resHtml += '<li>';
// resHtml += ' <a href="#ftpconnection"
// onClick="curConnection=\''+this.host+'\'">';
// resHtml += ' <h3>'+this.host+'</h3>';
//                    resHtml += '    </a>';
//                    resHtml += '</li>';
                }
            });
            
            resHtml += '</div>';
            $("#ftpConnections_list").html(resHtml);
            $('div[data-role=collapsible]').collapsible();
            htb.CreateFtp.setup();


            // $('#ftpConnections_list')..listview('refresh');
        }
    });

});

htb.Nav={cleanUp:true,setTab:function(page,path,ele){var old=$('#'+page);var opts={reloadPage:true,showLoadMsg:false,transition:'none',changeHash:false,reverse:false}
if($(ele).hasClass('active')&&htb.Nav.pageStack.length>1){opts['reverse']=true;opts['transition']='slide';}
$('.tabBar a').removeClass('active');$(ele).addClass('active');$.mobile.showPageLoadingMsg();if(old.length>0&&!$('.ui-content',old).hasClass('command-no-cache')){$.mobile.changePage($('#'+page),opts);$('.tabBar .'+page).addClass('active');htb.Nav.pageStack=new Array({"page":page,"path":path});$.mobile.hidePageLoadingMsg();return;}
$.ajax({url:path,type:'GET',success:function(data){$.mobile.hidePageLoadingMsg();data=$.trim(data);if(data=='fail'){}else{var template=$('#basic').clone();template.attr("id",page).attr("data-rel",path).append(data).insertBefore('#basic').page();$.mobile.changePage(template,opts);$('.tabBar .'+page).addClass('active');htb.Nav.pageStack=new Array({"page":page,"path":path});}},error:function(data){$.mobile.hidePageLoadingMsg();}});},tabProfile:function(ele){htb.Nav.setTab('profile','/mobile/user',ele);},tabSettings:function(ele){htb.Nav.setTab('settings','/mobile/settings',ele);},tabHadSearch:function(ele){htb.Nav.setTab('hadSearch','',ele);},tabFriends:function(ele){htb.Nav.setTab('friends','/mobile/friends',ele);},tabBar:function(ele){htb.Nav.setTab('bar','/mobile/bar',ele);},pageStack:new Array({page:'hadSearch',path:'/mobile/had'}),pushPage:function(page,path,ele){$.mobile.showPageLoadingMsg();var old=$('#'+page);var opts={reloadPage:true,showLoadMsg:false,transition:'slide',changeHash:false}
if(old.length>0){$.mobile.changePage($('#'+page),opts);htb.Nav.pageStack.push({"page":page,"path":path});return;}
$.ajax({url:path,type:'GET',success:function(data){data=$.trim(data);if(data=='fail'){}else{var template=$('#basic').clone();template.attr("id",page).append(data).insertBefore('#basic').page();$.mobile.hidePageLoadingMsg();$.mobile.changePage(template,opts);htb.Nav.pageStack.push({"page":page,"path":path});$('.ui-footer').css('display','block');}},error:function(data){$.mobile.hidePageLoadingMsg();}});},popPage:function(){$.mobile.showPageLoadingMsg();var goingTo=htb.Nav.pageStack[htb.Nav.pageStack.length- 2];var old=$('#'+goingTo.page);var opts={reloadPage:true,showLoadMsg:false,transition:'slide',changeHash:false,reverse:true}
if(old.length>0){$.mobile.changePage(old,opts);htb.Nav.pageStack.pop();return;}
$.ajax({url:goingTo.path,type:'GET',success:function(data){data=$.trim(data);if(data=='fail'){}else{var template=$('#basic').clone();template.attr("id",goingTo.page).append(data).insertBefore('#basic').page();$.mobile.hidePageLoadingMsg();$.mobile.changePage(template,opts);htb.Nav.pageStack.pop();if(htb.Nav.pageStack.length>1)
$('.ui-footer').css('display','block');}},error:function(data){$.mobile.hidePageLoadingMsg();}});},changePage:function(page,path,ele){$.mobile.showPageLoadingMsg();var old=$('#'+page);var opts={reloadPage:true,showLoadMsg:false,transition:'pop',changeHash:false}
if(old.length>0){$.mobile.changePage($('#'+page),opts);htb.Nav.pageStack=new Array({"page":page,"path":path});return;}
$.ajax({url:path,type:'GET',success:function(data){data=$.trim(data);if(data=='fail'){}else{var template=$('#basic').clone();template.attr("id",page).append(data).insertBefore('#basic').page();$.mobile.hidePageLoadingMsg();$.mobile.changePage(template,opts);htb.Nav.pageStack=new Array({"page":page,"path":path});}},error:function(data){$.mobile.hidePageLoadingMsg();}});},modalPage:function(page,path,ele){$.mobile.showPageLoadingMsg();htb.Nav.cleanUp=false;var old=$('#'+page);var opts={reloadPage:true,showLoadMsg:false,transition:'slideup',changeHash:false}
if(old.length>0){old.addClass('modal-page');$.mobile.changePage($('#'+page),opts);return;}
$.ajax({url:path,type:'GET',success:function(data){data=$.trim(data);if(data=='fail'){}else{var template=$('#basic').clone();template.attr("id",page).addClass('modal-page').append(data).insertBefore('#basic').page();$.mobile.hidePageLoadingMsg();$.mobile.changePage(template,opts);}},error:function(data){$.mobile.hidePageLoadingMsg();}});},modalPageDismiss:function(ele){var modal=$(ele).parents('.page');htb.Nav.cleanUp=true;var goingTo=modal.prev();var opts={reloadPage:true,showLoadMsg:false,transition:'slideup',reverse:true,changeHash:false}
$.mobile.changePage($('#'+goingTo.attr('id')),opts);},pageHadOne:function(id,ele){htb.Nav.modalPage('hadone','/mobile/had?bid='+id,ele);},pageHadOneLocations:function(lat,lng){htb.Nav.modalPage('hadoneLocations','/mobile/had/locations?lat='+lat+'&lng='+lng);},pageHad:function(id,ele){htb.Nav.pushPage('had','/mobile/had/'+id,ele);},pageBeer:function(id,ele){htb.Nav.pushPage('beer','/mobile/beer/'+id,ele);},pageAddBeer:function(ele){htb.Nav.modalPage('addBeer','/mobile/beer/add',ele);},pageBrewer:function(id,ele){htb.Nav.pushPage('brewer','/mobile/brewer/'+id,ele);},pageUser:function(id,ele){htb.Nav.pushPage('profile','/mobile/user/'+id,ele);},pageLocation:function(id,ele){htb.Nav.pushPage('location','/mobile/location/'+id,ele);}}
htb.Tabs={setup:function(){},selectedTab:function(ele){var tabbed=$(ele).parents('.tabbed');var tabs=$(ele).parents('ul');var index=$('li',tabs).index($(ele).parent());$('.tabs li a',tabbed).removeClass('active');$('.tab-content',tabbed).hide();$(ele).addClass('active');$('.tab-content',tabbed).eq(index).show();}}
htb.HadOne={setup:function(){$('#hadone .rating').live('click',function(){htb.HadOne.rate(this);});},rate:function(ele){var val=$('input',ele).val();$('.rating').removeClass('active');$(ele).addClass('active');$('#hadone #rating').val(val);},requestLocation:function(){navigator.geolocation.getCurrentPosition(this.showLocations,this.requestLocationError);},requestLocationError:function(){alert("Can't find you!");},showLocations:function(position){htb.Nav.pageHadOneLocations(position.coords.latitude,position.coords.longitude);},removeSelectedLocation:function(){$('#hadone .location-selected').fadeOut('fast',function(){$('#hadone .add-location').fadeIn();$('#hadone #foursquareId').val('');});},submit:function(){$.mobile.showPageLoadingMsg();$.ajax({type:'POST',url:'/mobile/had/add',data:$("#hadOneForm").serialize(),success:function(data){$.mobile.hidePageLoadingMsg();data=$.trim(data);if(data=='fail'){alert("uh oh, something went wrong");}else{$('#hadone .modal-cancel').hide();$('#hadone .modal-done').show();$('#hadone .banner .content').html('Cheers!');$('#hadOneSuccess').html(data);$('#hadOneForm').fadeOut(function(){$('#hadOneSuccess').fadeIn();});}},error:function(data){$.mobile.hidePageLoadingMsg();}});}}
htb.HadOneLocations={cords:{lat:'',lng:''},setCords:function(position){htb.HadOneLocations.cords.lat=position.coords.latitude;htb.HadOneLocations.cords.lng=position.coords.longitude;},setup:function(){var search=$('#hadoneLocations .search form').validate({rules:{searchText:"required"},messages:{searchTexts:{required:"Required"}},submitHandler:function(form){htb.HadOneLocations.search();},invalidHandler:function(form,validator){alert("Need a place to search for");},showErrors:function(errorMap,errorList){}});navigator.geolocation.getCurrentPosition(this.setCords,htb.HadOne.requestLocationError);},select:function(id,ele){$('#hadone #foursquareId').val(id);$('#hadone .location-selected ul li').html($(ele).html());$('#hadone .add-location').hide();$('#hadone .location-selected').show();htb.Nav.modalPageDismiss(ele);},search:function(){$.mobile.showPageLoadingMsg();$.ajax({url:'/mobile/had/locations',type:'POST',data:{lat:this.cords.lat,lng:this.cords.lng,name:$('#hadoneLocations .search input[name=searchText]').val()},success:function(data){$.mobile.hidePageLoadingMsg();data=$.trim(data);if(data=='fail'){alert('Woops, try again');}else{$('#hadoneLocations .location-results ul').html(data).listview("refresh");$('#hadone .location-results').fadeIn();}},error:function(data){alert('Woops, try again');$.mobile.hidePageLoadingMsg();}});}}
htb.AddBeer={setup:function(){$('#brewerSearchTerm').live('keyup',function(){if($(this).val().length>1)
htb.AddBeer.searchBrewers(false);});},submitName:function(){if($.trim($('#beerName').val()).length>0){$.mobile.showPageLoadingMsg();$('.step-1').fadeOut('fast',function(){$.mobile.hidePageLoadingMsg();$('.step-2').fadeIn();$('.step-number').html('2');});}else{alert('Need a name!');}},submitBrewer:function(){if($.trim($('#brewerName').val()).length>0){$.mobile.showPageLoadingMsg();$('.step-2').fadeOut('fast',function(){$.mobile.hidePageLoadingMsg();$('.step-3').fadeIn();$('.step-number').html('3');});}else{alert('Need a name!');}},submit:function(){$.mobile.showPageLoadingMsg();$.ajax({type:'POST',url:'/mobile/beer/add',data:$("#addBeerForm").serialize(),success:function(data){$.mobile.hidePageLoadingMsg();data=$.trim(data);if(data=='fail'){alert("uh oh, something went wrong, try again!");}else{var beer=$.parseJSON(data);$('#addBeer').html('');htb.Nav.pageBeer(beer._beer_id,null,null);}},error:function(data){$.mobile.hidePageLoadingMsg();}});},searchBrewers:function(showLoading){if(showLoading)
$.mobile.showPageLoadingMsg();term=$('#brewerSearchTerm').val();$.ajax({url:'/mobile/brewer/find',type:'GET',data:{term:term},success:function(data){$.mobile.hidePageLoadingMsg();data=$.trim(data);if(data=='fail'){}else{$('.brewer-search-results').html(data).listview('refresh');}},error:function(data){$.mobile.hidePageLoadingMsg();}});},selectBrewer:function(id,ele){$('#addBeer #brewer_id').val(id);$.mobile.showPageLoadingMsg();$('.step-2').fadeOut('fast',function(){$.mobile.hidePageLoadingMsg();$('.step-3').fadeIn();$('.step-number').html('3');});},newBrewer:function(ele){term=$('#brewerSearchTerm').val();$('#brewerName').val(term);$('#addBeer .step-2 .find-brewer').slideUp('fast',function(){$('#addBeer .step-2 .add-brewer').slideDown();});},toggleStyle:function(ele){var icon=$('.ui-icon',ele);if($(icon).hasClass('ui-icon-plus')){$(icon).removeClass('ui-icon-plus');$(icon).addClass('ui-icon-grid');$('#style').show();var select=$("select#style_id");$('.step-3 .ui-select').hide();select[0].selectedIndex=0;select.selectmenu("refresh");}else{$(icon).addClass('ui-icon-plus');$(icon).removeClass('ui-icon-grid');$('#style').hide();$('.step-3 .ui-select').show();}}}
htb.Beer={setup:function(){},favBeer:function(bid,uid,ele){$.mobile.showPageLoadingMsg();if($(ele).hasClass('not-fav')){var newClass='fav';var oldClass='not-fav';}else{var oldClass='fav';var newClass='not-fav';}
$.ajax({url:'/mobile/user/'+uid+'/favorites',type:'POST',data:{id:bid},success:function(data){$.mobile.hidePageLoadingMsg();data=$.trim(data);if(data=='fail'){alert('Woops, try again');}else{$(ele).removeClass(oldClass).addClass(newClass);}},error:function(data){$.mobile.hidePageLoadingMsg();}});},wishBeer:function(bid,uid,ele){$.mobile.showPageLoadingMsg();if($(ele).hasClass('not-wish')){var newClass='wish';var oldClass='not-wish';}else{var oldClass='wish';var newClass='not-wish';}
$.ajax({url:'/mobile/user/'+uid+'/wishlist',type:'POST',data:{id:bid},success:function(data){$.mobile.hidePageLoadingMsg();data=$.trim(data);if(data=='fail'){alert('Woops, try again');}else{$(ele).removeClass(oldClass).addClass(newClass);}},error:function(data){$.mobile.hidePageLoadingMsg();}});},reccomend:function(){}}
htb.Had={remove:function(id){$.mobile.showPageLoadingMsg();$.ajax({type:'POST',url:'/mobile/had/'+id+'/delete',data:{hadId:id},success:function(data){$.mobile.hidePageLoadingMsg();data=$.trim(data);if(data=='fail'){alert("uh oh, something went wrong");}else{htb.Nav.popPage();htb.toggleMessage("Had successfully deleted");}},error:function(data){$.mobile.hidePageLoadingMsg();}});},cheers:function(id,uid,ele){if($(ele).hasClass('acted')){$(ele).removeClass('acted');$('#had div.cheers .image-grid .user-'+uid).remove();}else{$(ele).addClass('acted');var img=$('<img onerror="this.src=\'http://hadthatbeer.s3.amazonaws.com/users/user_thumb.png\'" />').attr('src','http://hadthatbeer.s3.amazonaws.com/users/'+uid+'_thumb.jpg').addClass('user-'+uid);$('#had div.cheers .image-grid').prepend(img);}
$.ajax({type:'POST',url:'/mobile/had/'+id+'/cheers',data:{id:id},success:function(data){$.mobile.hidePageLoadingMsg();var data=$.parseJSON(data);if(data.action=='added'){}else{}},error:function(data){$(ele).attr('disabled','');}});},comment:function(id,uid){$.mobile.showPageLoadingMsg();var text=$('#had .comments .add textarea').val();if(text==''){alert("Comment field is required.");return;}
$.ajax({type:'POST',url:'/mobile/had/'+id+'/comment',data:{id:id,text:text},success:function(data){$.mobile.hidePageLoadingMsg();data=$.trim(data);if(data=='fail'){alert("uh oh, something went wrong");}else{$(data).hide().insertAfter('.comments .add').slideDown();}},error:function(data){$.mobile.hidePageLoadingMsg();}});}}
htb.Bar={setup:function(){var searchBar=$('#searchBarForm').validate({rules:{searchBarText:{required:true}},messages:{searchBarText:{required:"Required!",}},submitHandler:function(form){htb.Bar.search();},invalidHandler:function(form,validator){alert("Need something to search for!");},showErrors:function(){}});},search:function(){$.mobile.showPageLoadingMsg();$.ajax({type:'POST',url:'/mobile/bar/search',data:$("#searchBarForm").serialize(),success:function(data){$.mobile.hidePageLoadingMsg();data=$.trim(data);if(data=='fail'){alert("uh oh, something went wrong");}else{var template=$('#basic').clone();template.attr("id","tmpPage").append(data).insertBefore('#basic').page();var content=$('#tmpPage').html();$('#searchBarResults').html(content);$('#tmpPage').remove();}},error:function(data){$.mobile.hidePageLoadingMsg();}});}}
htb.Profile={sendFriendRequest:function(id,ele){$(ele).hide();$('.actions .sending').show();$.ajax({url:htb.Friends.URLS.Request,type:'POST',data:{id:id},success:function(data){data=$.trim(data);if(data!='fail'){$('.actions .sending').fadeOut('fast',function(){$('.actions .success .ui-btn-text').html('Friend request sent...');$('.actions .success').fadeIn('fast');});}else{$('.actions .sending').fadeOut('fast',function(){$(ele).fadeIn('fast');});}},error:function(data){$('.actions .sending').fadeOut('fast',function(){$(ele).fadeIn('fast');});}});},acceptFriendRequest:function(id,ele){$(ele).hide();$('.actions .sending').show();$.ajax({url:htb.Friends.URLS.Accept,type:'POST',data:{id:id},success:function(data){data=$.trim(data);if(data!='fail'){$('.actions .sending').fadeOut('fast',function(){$('.actions .success .ui-btn-text').html('Friended!');$('.actions .success').fadeIn('fast');});}else{$('.actions .sending').fadeOut('fast',function(){$(ele).fadeIn('fast');});}},error:function(data){$('.actions .sending').fadeOut('fast',function(){$(ele).fadeIn('fast');});}});},declineFriendRequest:function(id,ele){$(ele).hide();$('.actions .sending').show();$.ajax({url:htb.Friends.URLS.Decline,data:{id:id},success:function(data){data=$.trim(data);if(data!='fail'){$('.ui-btn-text',ele).html('Declined');}else{$('.actions .sending').fadeOut('fast',function(){$(ele).fadeIn('fast');});}},error:function(data){$('.actions .sending').fadeOut('fast',function(){$(ele).fadeIn('fast');});}});},removeFriend:function(id,ele){$.mobile.showPageLoadingMsg();$.ajax({url:htb.Friends.URLS.Remove,type:'POST',data:{id:id},success:function(data){$.mobile.hidePageLoadingMsg();data=$.trim(data);if(data!='fail'){htb.Nav.popPage();}else{alert('Sorry, could not complete your request. Try again later.');}},error:function(data){alert('Sorry, could not complete your request. Try again later.');}});}}
htb.Friends={URLS:{Request:'/friends/request',Accept:'/friends/accept',Decline:'/friends/decline',Remove:'/friends/remove'},setup:function(){var searchFriends=$('#searchFriendsForm').validate({rules:{searchBarText:{required:true}},messages:{searchBarText:{required:"Required!",}},submitHandler:function(form){htb.Friends.search();},invalidHandler:function(form,validator){alert("Need something to search for!");},showErrors:function(){}});},search:function(){$.mobile.showPageLoadingMsg();$.ajax({type:'POST',url:'/mobile/friends/search',data:$("#searchFriendsForm").serialize(),success:function(data){$.mobile.hidePageLoadingMsg();data=$.trim(data);if(data=='fail'){alert("uh oh, something went wrong");}else{$('#friends .friends').hide();var template=$('#basic').clone();template.attr("id","tmpPage").append(data).insertBefore('#basic').page();var content=$('#tmpPage').html();$('#searchFriendsResults').html(content);$('#tmpPage').remove();}},error:function(data){$.mobile.hidePageLoadingMsg();}});},acceptRequest:function(id,ele){var li=$(ele).parents('li');$('.actions .ui-btn',li).hide();$('.actions .sending .ui-btn-text',li).html('Accepting...');$('.actions .sending',li).show();$.ajax({url:htb.Friends.URLS.Accept,type:'POST',data:{id:id},success:function(data){data=$.trim(data);if(data!='fail'){htb.Friends.changeRequestCount();$('.actions .sending .ui-btn-text',li).html('Accepted!');$('.actions .sending',li).fadeOut('fast',function(){$('.actions .success',li).fadeIn('fast').parents('li').delay(1000).slideUp();});}else{$('.actions .sending',li).fadeOut('fast',function(){$('.accept, .ignore','.actions').fadeIn('fast');});}},error:function(data){$('.actions .sending',li).fadeOut('fast',function(){$('.accept, .ignore','.actions').fadeIn('fast');});}});},declineRequest:function(id,ele){var li=$(ele).parents('li');$('.actions .ui-btn',li).hide();$('.actions .sending .ui-btn-text',li).html('Ignoring...');$('.actions .sending',li).show();$.ajax({url:htb.Friends.URLS.Decline,data:{id:id},success:function(data){data=$.trim(data);if(data!='fail'){htb.Friends.changeRequestCount();$('.actions .success .ui-btn-text',li).html('Ignored');$('.actions .sending',li).fadeOut('fast',function(){$('.actions .success',li).fadeIn('fast').parents('li').delay(1000).slideUp();});}else{$('.actions .sending',li).fadeOut('fast',function(){$('.accept, .ignore','.actions').fadeIn('fast');});}},error:function(data){$('.actions .sending',li).fadeOut('fast',function(){$('.accept, .ignore','.actions').fadeIn('fast');});}});},remove:function(id,ele){var html=$('.ui-btn-text',ele).html();$(ele).removeClass('red');$('.ui-btn-text',ele).html("Removing...").addClass('disabled');$.ajax({url:htb.Friends.URLS.Remove,type:'POST',data:{id:id},success:function(data){data=$.trim(data);if(data!='fail'){$('.ui-btn-text',ele).html('Removed').delay(500);location.reload(true);}else{$(ele).addClass('red');$('.ui-btn-text',ele).html(html);}},error:function(data){$(ele).addClass('red');$('.ui-btn-text',ele).html(html);}});},changeRequestCount:function(){var c=$('.friend-requests-count').html();$('.friend-requests-count').html(c-1);}}
htb.Settings={setup:function(){var profile=$('#profileForm').validate({rules:{first_name:"required",last_name:"required",email:{required:true,email:true,remote:'/mobile/settings/checkemail'}},messages:{first_name:{required:"Required"},last_name:{required:"Required"},email:{required:"Required",remote:"Email already registered."}},errorElement:'p',submitHandler:function(form){htb.Settings.profileSubmit();},invalidHandler:function(form,validator){alert("You made a mistake!");}});var password=$('#passwordForm').validate({rules:{password:{required:true,minlength:4},passwordconfirm:{required:true,equalTo:'#password'}},messages:{password:{required:"4 characters minimum",minlength:"{0} characters minimum"},passwordconfirm:{required:"Required",equalTo:'Must match above'}},errorElement:'p',submitHandler:function(form){htb.Settings.passwordSubmit();},invalidHandler:function(form,validator){alert("You made a mistake!");}});$('#socialForm .ui-checkbox').live('touchend',function(){htb.Settings.socialSubmit();});$('#noticesForm .ui-checkbox').live('touchend',function(){htb.Settings.noticesSubmit();});$('#privacyForm .ui-slider').live('touchend',function(){htb.Settings.privacySubmit();});},profileSubmit:function(){$.mobile.showPageLoadingMsg();$.ajax({type:'POST',url:'/mobile/settings/profile',data:$("#profileForm").serialize(),success:function(data){$.mobile.hidePageLoadingMsg();data=$.trim(data);if(data=='fail'){alert("uh oh, something went wrong");}else{htb.toggleMessage('Saved!');}},error:function(data){$.mobile.hidePageLoadingMsg();}});},privacySubmit:function(){$.ajax({type:'POST',url:'/mobile/settings/privacy',data:$("#privacyForm").serialize(),success:function(data){data=$.trim(data);if(data=='fail'){alert("uh oh, something went wrong");}else{if($('#private').val()==1)
htb.toggleMessage('Account is now private');else
htb.toggleMessage('Account is now public');}},error:function(data){}});},socialSubmit:function(){$.ajax({type:'POST',url:'/mobile/settings/social',data:$("#socialForm").serialize(),success:function(data){data=$.trim(data);if(data=='fail'){alert("uh oh, something went wrong");}else{htb.toggleMessage('Saved!');}},error:function(data){}});},noticesSubmit:function(){$.ajax({type:'POST',url:'/mobile/settings/notices',data:$("#noticesForm").serialize(),success:function(data){data=$.trim(data);if(data=='fail'){alert("uh oh, something went wrong");}else{htb.toggleMessage('Saved!');}},error:function(data){}});},passwordSubmit:function(){$.mobile.showPageLoadingMsg();$.ajax({type:'POST',url:'/mobile/settings/password',data:$("#passwordForm").serialize(),success:function(data){$.mobile.hidePageLoadingMsg();data=$.trim(data);if(data=='fail'){alert("uh oh, something went wrong");}else{htb.toggleMessage('Saved!');}},error:function(data){$.mobile.hidePageLoadingMsg();}});}}
function jqmAdd(ele,html)
{var wrapped=$('<div></div>').append(html).page();$(ele).html(wrapped);}