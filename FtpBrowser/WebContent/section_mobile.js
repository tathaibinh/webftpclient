$(document).ready(function(){
	
	$.ajaxSetup({timeout:(35*1000)});
	});



var htb={};

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
};


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
			$.mobile.hidePageLoadingMsg();}});}};
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
							$.mobile.hidePageLoadingMsg();}});}};


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
				$.ajax({type:'POST',url:'FtpConnectionsServlet',data:'activity=removeConnection&connectionname='+$(this).attr("connectionname"),
					success:function(data){
						$.mobile.hidePageLoadingMsg();
						data=$.trim(data);
						if(data=="fail"){
							alert("You have probably a favourite folder connected to the item! Remove it first!");
						}
						else{
						window.location="/FtpBrowser/index.jsp#ftpConnections";
						location.reload();}
					},
					error:function(data){
						alert("Looks like we can't find the server, please try again.");
						$.mobile.hidePageLoadingMsg();
					}});

			});

			$('.removefavouriteclass').bind('click', function (evt) { 
				//alert($(this).parent().children('em').html());
				$.ajax({type:'POST',url:'FtpConnectionsServlet',data:'activity=removeFavourite&connectionid='+$(this).attr("connectionid")+'&currentFolder='+$(this).attr("currentfolder"),
					success:function(data){
						$.mobile.hidePageLoadingMsg();
						window.location="/FtpBrowser/index.jsp#ftpFavourites";
						location.reload();
					},
					error:function(data){
						alert("Looks like we can't find the server, please try again.");
						$.mobile.hidePageLoadingMsg();
					}});

			});
			
			$('.browseclass').bind('click', function (evt) { 
				//alert($(this).attr('title'));
				
				//alert($(this).attr('connectionname'));
				//alert($(this).parent().children('em').html());
				//alert($(this).parent().children('em').html());
				if($(this).attr('currentfolder'))
					//alert($(this).attr('currentfolder'));
					{
					//Its a favourite,treat it as it
					$("#ftpfoldercontentid").attr('connectionname',$(this).attr('connectionname'));
					$("#ftpfoldercontentid").attr('currentfolder',$(this).attr('currentfolder'));
					}
				else{
					$("#ftpfoldercontentid").attr('connectionname',$(this).attr('title'));
					}
				//alert($("#ftpfoldercontentid").attr('connectionname'));
				//alert($(this).attr('title'));*/
				window.location="/FtpBrowser/index.jsp#folderbrowser";

			});

		}};


jQuery.download = function(url, data, method){
	//url and data options required
	if( url && data ){ 
		//data can be string of parameters or array/object
		data = typeof data == 'string' ? data : jQuery.param(data);
		//split params into form inputs
		var inputs = '';
		jQuery.each(data.split('&'), function(){ 
			var pair = this.split('=');
			inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />'; 
		});
		//send request
		jQuery('<form action="'+ url +'" method="'+ (method||'post') +'">'+inputs+'</form>')
		.appendTo('body').submit().remove();
	};
};


htb.CreateFolder={
		setup:function(){
			$('.addDirectoryForm').each( function(){

				var form = $(this);
				form.validate(

						{rules:{dirname:"required"},
							messages:{dirname:{required:"Required"}},

								submitHandler:function(){
									$.mobile.showPageLoadingMsg();
									$.ajax({type:'POST',url:'FtpConnectionsServlet?currentfolder='+$("#ftpfoldercontentid").attr('currentfolder'),data:form.serialize(),
										success:function(data){$.mobile.hidePageLoadingMsg();
										data=$.trim(data);if(data=='fail')
										{alert("There was an error, probably directory already exist!");}
										else{							
											refreshFolders.refresh();
											//$("#TestCollapsible").collapsible({collapsed: false});
											$("#makedirdiv").trigger("collapse");
											$("#makedirdirname").val("");
										}},
										error:function(data){alert("Looks like we can't find the server, please try again.");
										$.mobile.hidePageLoadingMsg();}});
									return false;},
									invalidHandler:function(form,validator){alert("You made a mistake!");}
						});
			});
			$('.renameForm').each( function(){

				var form = $(this);
				form.validate(

						{rules:{renamename:"required"},
							messages:{renamename:{required:"Required"}},

								submitHandler:function(){
									$.mobile.showPageLoadingMsg();
									$.ajax({type:'POST',url:'FtpConnectionsServlet?currentfolder='+$("#ftpfoldercontentid").attr('currentfolder'),data:form.serialize(),
										success:function(data){
										data=$.trim(data);if(data=='fail')
										{alert("There was an error, probably another directory/file with that name already exist!");}
										else{		
											//$("#ftpfoldercontentid").attr('currentfolder',data);
											refreshFolders.refresh();
											
										}},
										error:function(data){alert("Looks like we can't find the server, please try again.");
										$.mobile.hidePageLoadingMsg();}});
									return false;},
									invalidHandler:function(form,validator){alert("You made a mistake!");}
						});
			});
			$('.removefolderclass').bind('click', function (evt) { 
				//$("#ftpfoldercontentid").attr('currentfolder',$("#ftpfoldercontentid").attr('currentfolder')+'/'+$.trim($(this).html()));
				//alert($(this).attr('itemname'));
				//CALL servlet for removal attempt
				$.ajax({type:'POST',
					
					url:'FtpConnectionsServlet',data:'activity=removeItem&itemtype='+$(this).attr('itemtype')+'&itemname='+
					$("#ftpfoldercontentid").attr('currentfolder')+'/'+$(this).attr('itemname')+
					'&connectionname='+$("#ftpfoldercontentid").attr('connectionname'),
					success:function(data){
						data=$.trim(data);
						if(data=='fail'){
							alert("Directory is not empty!");
						}
						else{
							refreshFolders.refresh();
						}

					},
					error:function(data){
						alert("Looks like we can't find the server, please try again.");
						$.mobile.hidePageLoadingMsg();
					}});
				
				//refreshFolders.refresh();
				//alert("Not implemented yet");
			});
			$('.favouritefolderclass').bind('click', function (evt) { 
				//$("#ftpfoldercontentid").attr('currentfolder',$("#ftpfoldercontentid").attr('currentfolder')+'/'+$.trim($(this).html()));

				//ADDITIONAL CHECK FOR CONCURRENT TRIGGERS
				if($(this).attr("class")=="favouritefolderclass"){
				$.ajax({type:'POST',
					
					url:'FtpConnectionsServlet',data:'activity=addFavourite&itemname='+
					$("#ftpfoldercontentid").attr('currentfolder')+'/'+$(this).attr('itemname'),
					success:function(data){
						data=$.trim(data);
						if(data=='fail'){
							alert("There was an error adding folder to Favourites!");
						}
						else{
							refreshFolders.refresh();
						}

					},
					error:function(data){
						alert("Looks like we can't find the server, please try again.");
						$.mobile.hidePageLoadingMsg();
					}});
				}
				//refreshFolders.refresh();
				//alert("Not implemented yet");
			});
			$('.removeInlinefavoriteclass').bind('click', function (evt) { 
				//alert($(this).parent().children('em').html());
				alert("exec");
				$.ajax({type:'POST',url:'FtpConnectionsServlet',data:'activity=removeInlineFavourite&filename='+$("#ftpfoldercontentid").attr('currentfolder')+'/'+$(this).attr('itemname'),
					success:function(data){
						$.mobile.hidePageLoadingMsg();
						refreshFolders.refresh();
					},
					error:function(data){
						alert("Looks like we can't find the server, please try again.");
						$.mobile.hidePageLoadingMsg();
					}});

			});
			
			$('.folderclass').bind('click', function (evt) { 
				var filename=$.trim($(this).attr("filename"));

				//alert($(this).parent().children('em').html());
				//alert($(this).parent().children('em').html());
				//alert($(this).html());
				$("#ftpfoldercontentid").attr('currentfolder',$("#ftpfoldercontentid").attr('currentfolder')+'/'+filename);
				//$("#currentdirdiv").show(); //to show it
				//$('div[data-role=collapsible]').collapsible();
				//alert($("#ftpfoldercontentid").attr('currentfolder'));
				$("#makedirdiv").trigger("collapse");
				$("#uploaddiv").trigger("collapse");
				$("#makedirdirname").val("");

				refreshFolders.refresh();

			});
			$('.fileclass').bind('click', function (evt) { 
				//alert($("#ftpfoldercontentid").attr('currentfolder')+'/'+$.trim($(this).html()));
				//alert($(this).attr("filename"));
				var filename=$.trim($(this).attr("filename"));
				//filename='+$.trim($(this).html()) );
$.ajax({type:'POST',
					
					url:'FtpConnectionsServlet',data:'activity=downloadfile&currentfolder='+$("#ftpfoldercontentid").attr('currentfolder')+'&filename='+filename,
					success:function(data){
						data=$.trim(data);
						if(data=='fail'){
							alert("Error accessing temp folder!");
						}
						else{
							window.open('temp/'+filename);
						}

					},
					error:function(data){
						alert("Looks like we can't find the server, please try again.");
						$.mobile.hidePageLoadingMsg();
					}});
				//$.download('FtpConnectionsServlet','activity=downloadfile&currentfolder='+$("#ftpfoldercontentid").attr('currentfolder')+'filename='+$.trim($(this).html()) );
			});
			$('.mainfolderclass').bind('click', function (evt) { 
				if(!$("#ftpfoldercontentid").attr('currentfolder')){
					var resHtml = '';
					$("#ftpfoldercontentid").html(resHtml);
					// $('div[data-role=collapsible]').collapsible();
					//htb.CreateFolder.setup();
					$('#ftpfoldercontentid').listview('refresh');
					history.back();
					return false;
				}
				else{
					var temp=$("#ftpfoldercontentid").attr('currentfolder');
					temp=temp.substring(temp,temp.lastIndexOf('/'));
					//alert(temp);
					$("#ftpfoldercontentid").attr('currentfolder',temp);
					//$("#currentdirh3").html(temp);
					//alert($("#ftpfoldercontentid").attr('currentfolder'));
					refreshFolders.refresh();
				}

			});
		}
};

//Needed for the iframe refresh issue
function ref(){
	refreshFolders.refresh();
}

refreshFolders={refresh:function(){
	//alert($("#ftpfoldercontentid").attr('connectionname'));
	$("#uploaddiv").trigger("collapse");

	$.mobile.showPageLoadingMsg();

	$.ajax({
	type: 'POST',
	url: 'FtpConnectionsServlet?activity=getfolders&currentfolder='+$("#ftpfoldercontentid").attr('currentfolder')+'&connectionname='+$("#ftpfoldercontentid").attr('connectionname')+'&callback=?',
	dataType: 'json',
	cache: false,
	error: function(jqXHR, textStatus, errorThrown){
		window.location="/FtpBrowser/index.jsp";
	},
	success: function(data, textStatus){
		resHtml = '<li><a class="mainfolderclass" href="#folderbrowser"  >..</a></li>';
		resHtml+='<li>';

		$.each(data.items, function() {
			if (this != '') {
				resHtml+='<div data-role="collapsible" class="noautocollapse" toshow="false" data-theme="d" data-collapsed="true">';
					resHtml+='	<h3><table width="100%" style="table-layout: fixed"><tr><td width="10%"><img src="images/';
					if(this.typename==1)
						resHtml+='folder.gif';
					else
						resHtml+='file.gif';
					resHtml+='"/></td><td width="70%" style="word-wrap:break-word"><a class="';
					if(this.typename==1)
						resHtml+='folderclass';
					else
						resHtml+='fileclass';
					resHtml+='" href="#folderbrowser" title="'+this.itemname+'"  filename="'+this.itemname+'">';
					if(this.itemname.length>17)
						resHtml+=this.itemname.substring(0,11)+'..'+this.itemname.substring(this.itemname.length-4);
					else
					resHtml+=this.itemname;
					resHtml+='</a></td><td width="20%"><img class="showhideimage" title="Edit" src="images/edit.gif"/></td></tr></table></h3>';
						resHtml+='	<form action="" class="renameForm" method="post">';
							resHtml+=' <div data-role="field-contain" class="required">';
								//resHtml+='  <label for="oldname">';
								//if(this.typename==1)
								//	resHtml+='Directory Name';
								//else
									//resHtml+='File Name';
								
									//resHtml+='</label>
							resHtml+='           <button data-role="button" data-theme="b">Rename to:</button>';
			                resHtml+=' <input type="text" id="renamename" name="renamename" value="'+this.itemname+'" class="text-box" style="width:130px" />            </div>';
										resHtml+='            <input type="hidden" name="activity" value="renamename"/>';
										resHtml+='            <input type="hidden" name="oldname" value="'+this.itemname+'"/>';
											
												resHtml+='</form><button data-role="button" class="removefolderclass" itemtype="'+this.typename+'" itemname="'+this.itemname+'" data-theme="b">Remove</button>';
												if(this.typename==1)
													resHtml+='<button data-role="button" class="favouritefolderclass" itemtype="'+this.typename+'" itemname="'+this.itemname+'" data-theme="b">Add to favourites</button>';	
												resHtml+='</div>';
				
				
				
				/*resHtml+='<li><table width="100%"><tr><td width="10%"><img src="images/';
				if(this.typename==1)
					resHtml+='folder.gif';
				else
					resHtml+='file.gif';
				resHtml+='"/></td><td width="70%"><a class="';
				if(this.typename==1)
					resHtml+='folderclass';
				else
					resHtml+='fileclass';
				resHtml+='" href="#folderbrowser" > '+this.itemname+' </a></td><td width="20%" align="right"><img class="removefolderclass" alt="Remove" itemtype="'+this.typename+'" itemname="'+this.itemname+'" src="images/remove.gif"/></td></tr></table></li>';
			*/}
			
		});
		resHtml+='</li>';
		resHtml += '';
		$("#ftpfoldercontentid").html(resHtml);
		$('div[data-role=collapsible]').collapsible();

		htb.CreateFolder.setup();

		$('#ftpfoldercontentid').listview('refresh');
		$.mobile.hidePageLoadingMsg();
		refreshdivs.refresh();


	}

});




}};

var curConnection = "";

//Prevent collapsible default opening
refreshdivs={refresh:function(){
	$('.showhideimage').each(function(){
		var image = $(this);
		image.click(function (evt) {
	
var thisdiv=$(this).closest(".noautocollapse");
		if($(thisdiv).attr("toshow")=="false"){
			$(thisdiv).attr("toshow","true");
		}else{
			$(thisdiv).attr("toshow","false");
		}}			);
	
	});
	$('.noautocollapse').bind('click', function (evt) { 
		if($(this).attr("toshow")=="false")
           $(this).trigger("collapse");
		else{
			
			//Change folder favourtie state appropriately
			var favouritebutton=$(this).find(".favouritefolderclass");
			if(favouritebutton.html()!=null){
				//now call post to check if we have to change favourite attribute
				$.ajax({type:'POST',
					
					url:'FtpConnectionsServlet',data:'activity=isfavourite&filename='+$("#ftpfoldercontentid").attr('currentfolder')+favouritebutton.attr("itemname"),
					success:function(data){
						data=$.trim(data);

							if(data=='yes')
									{
								favouritebutton.removeClass("favouritefolderclass").addClass("removeInlinefavoriteclass");
								
								favouritebutton.html("Remove from Favourites");
								//alert(favouritebutton.attr("class"));
								htb.CreateFolder.setup();
								}

						

					},
					error:function(data){
						alert("Looks like we can't find the server, please try again.");
						$.mobile.hidePageLoadingMsg();
					}});
			}
			//alert($(this).parent().children(".ui-collapsible-content").html());
			
			
			$(this).trigger("expand");
		}
	});	
	}};

$('#folderbrowser').live('pageshow',function(event, ui){
	refreshFolders.refresh();

});

$('#ftpConnections').live('pageshow',function(event, ui){

	$.ajax({
		type: 'POST',
		url: 'FtpConnectionsServlet?activity=getall&callback=?',
		dataType: 'json',
		cache: false,
		error: function(jqXHR, textStatus, errorThrown){
			window.location="/FtpBrowser/index.jsp";
		},
		success: function(data, textStatus){
			resHtml = '<div id="test">';
			$.each(data.items, function() {
				if (this != '') {
//					resHtml += '<div data-role="collapsible">';
//					resHtml += '  <h3>Im a header</h3>';
//					resHtml += '  <p>Im the collapsible content. By default Im closed, but you can click the header to open me.</p>';
//					resHtml += '</div>';

					resHtml += '   <div data-role="collapsible" class="noautocollapse" toshow="false" data-theme="d" data-collapsed="true" class="home_collapsible_hidden ui-collapsible-contain">';
					resHtml += '<h3><table width="100%" style="table-layout: fixed"><tr><td width="65%"><a href="#folderbrowser" class="browseclass" title="'+this.connectionname+'">';
					if(this.connectionname.length>17)
						resHtml+=this.connectionname.substring(0,11)+'..'+this.connectionname.substring(this.connectionname.length-4);
					else
					resHtml+=this.connectionname;
					resHtml += '</a></td><td width="20%"><img class="showhideimage" title="Edit" class="showhideimage" src="images/edit.gif"/>';
						resHtml += '</td><td width="15%"><img class="removeclass" connectionname="'+this.connectionname+'" style="float:right" title="Remove" src="images/remove.gif"/></td></tr></table></h3>';
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



//					resHtml += '<li>';
//					resHtml += ' <a href="#ftpconnection"
//					onClick="curConnection=\''+this.host+'\'">';
//					resHtml += ' <h3>'+this.host+'</h3>';
//					resHtml += '    </a>';
//					resHtml += '</li>';
				}
			});

			resHtml += '</div>';
			$("#ftpConnections_list").html(resHtml);
			$('div[data-role=collapsible]').collapsible();
			htb.CreateFtp.setup();
			refreshdivs.refresh();


			// $('#ftpConnections_list')..listview('refresh');
		}
	});

});

$('#ftpFavourites').live('pageshow',function(event, ui){

	$.ajax({
		type: 'POST',
		url: 'FtpConnectionsServlet?activity=getallfavourites&callback=?',
		dataType: 'json',
		cache: false,
		error: function(jqXHR, textStatus, errorThrown){
			window.location="/FtpBrowser/index.jsp";
		},
		success: function(data, textStatus){
			resHtml = '<div id="test">';
			$.each(data.items, function() {
				if (this != '') {
//					resHtml += '<div data-role="collapsible">';
//					resHtml += '  <h3>Im a header</h3>';
//					resHtml += '  <p>Im the collapsible content. By default Im closed, but you can click the header to open me.</p>';
//					resHtml += '</div>';

					resHtml += '   <div data-role="collapsible" class="noautocollapse" toshow="false" data-theme="d" data-collapsed="true" class="home_collapsible_hidden ui-collapsible-contain">';
					resHtml += '<h3><table width="100%" style="table-layout: fixed"><tr><td width="65%"><a href="" class="browseclass" currentfolder="'+this.folderpath+'" connectionname="'+this.connectionname+'" title="'+
					this.folderpath+' @ '+this.connectionname+'">';
					resHtml += this.folderpath.substring(this.folderpath.lastIndexOf('/')+1);
					/*if(this.connectionname.length>17)
						resHtml+=this.connectionname.substring(0,11)+'..'+this.connectionname.substring(this.connectionname.length-4);
					else
					resHtml+=this.connectionname;*/
					resHtml += '</a></td><td width="20%"><img class="showhideimage" title="Info" class="showhideimage" src="images/info.gif"/>';
						resHtml += '</td><td width="15%"><img class="removefavouriteclass" style="float:right" currentfolder="'+this.folderpath+'" connectionid="'+this.connectionid+'" title="Remove" src="images/remove.gif"/></td></tr></table></h3>';
					resHtml += '<form action="" class="" method="post">';
					resHtml += '<div data-role="field-contain" class="required">';
					resHtml += '<label for="connectionname">Connection Name</label>';
					resHtml += '<input type="text" name="connectionname" readonly="readonly" value="'+this.connectionname+'" class="text-box"  />            </div>';
					resHtml += '<div data-role="field-contain" class="required">';
					resHtml += '<label for="folderpath">Full path</label>';
					resHtml += '<input type="text" name="folderpath" readonly="readonly" value="'+this.folderpath+'" class="text-box"  />            </div>';
					

					resHtml += '</form>';
					
						resHtml += '</div>';



//					resHtml += '<li>';
//					resHtml += ' <a href="#ftpconnection"
//					onClick="curConnection=\''+this.host+'\'">';
//					resHtml += ' <h3>'+this.host+'</h3>';
//					resHtml += '    </a>';
//					resHtml += '</li>';
				}
			});

			resHtml += '</div>';
			$("#favourites_list").html(resHtml);
			$('div[data-role=collapsible]').collapsible();
			htb.CreateFtp.setup();
			refreshdivs.refresh();


			// $('#ftpConnections_list')..listview('refresh');
		}
	});

});

