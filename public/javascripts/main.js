$(document).ready(function(){

	/*
	** Globals variables 
	*/

	var globalsVar;
	var socket = io.connect('http://localhost:3000');

	/*
	** Jquery plugins
	*/

	// Check if the js modif is done or not.
	$.fn.idempotent = function(){
		if (!this.attr('data-appended')){
			this.attr('data-appended', 'true')
			return 1;
		}
		return 0;
	}

	// Add class 'error' to an input invalid and display an error message.
	$.fn.invalidInput = function(err, $form, direct = 0){
		var $this = $(this);
		$this.addClass('invalid-input');
		if (direct == 1){
			$this.parent().addClass('error');
			$form.addClass('error');
		}
		else
			$this.parents().addClass('error');
		$this.val('');
		if (err)
			$('.err-message').append('<ul class="list invalid-input-msg">'
										+ '<li>'+ err +'</li>'
									+ '</ul>');
	}

	/*
	** Tools
	*/

	var updateScroll = function(id) {
		if (document.getElementById(id)) {
			var element = document.getElementById(id);
			element.scrollTop = element.scrollHeight;
		}
	}

	var newNotif = function($n) {
		if ($n.text())
			$n.text(parseInt($n.text()) + 1);
		else
			$n.text(1);
	}

	var checkDoublonInArray = function(array, string) {
		return $.inArray(string, array) < 0 ? 0 : 1;
	}

	var isAlphaNum = function(string){
		if (string){
			var regAlphaNum = new RegExp('^[ ?!\,\.0-9a-z\_\-]+$','i');
			return regAlphaNum.test(string);
		}
		return 0;
	}

	var getAge = function(date){
		if (date){
			date = new Date(date);
			var today = new Date();
			var years = today.getFullYear() - date.getFullYear();
			var months = today.getMonth() - date.getMonth();
			var days = today.getDate() - date.getDate();
			if (years > 18 || (years == 18 && months >= 0 && days >= 0))
				return years;
		}
		return 0;
	}
	var isMail = function(mail){
		if (mail){
			var regMail = new RegExp('^[0-9a-z.\_\-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i');
			return regMail.test(mail);
		}
		return 0;
	}

	var getFormInfo = function($form, data){
		$form.each(function (){
			data[this.name] = this.value;
		});
		return data;
	}

	var getSelectInfo = function($select, data){
		$select.each(function (){
			var $this = $(this);
			if ($this.hasClass('active') && $this.hasClass('selected'))
				data[$this.parent().attr('name')] = $this.attr('data-value');
		});
		return data;
	}

	/*
	** Subscribe.js
	*/

	// Check the content of every inputs of the subscribtion form. 
	var subscribeFormIsValid = function (data){
		$('.invalid-input-msg').remove();
		$('#subscribe input').removeClass('invalid-input');
		$('.error').removeClass('error');
		$('.err-message').addClass('error');
		if (!isAlphaNum(data.login))
			$('input[name="login"]').invalidInput('Login invalide.');
		if (!isAlphaNum(data.name))
			$('input[name="name"]').invalidInput('Nom invalide.');
		if (!isAlphaNum(data.first_name))
			$('input[name="first_name"]').invalidInput('Prenom invalide.');
		if (!getAge(data.birth))
			$('input[name="birth"]').invalidInput('Vous devez etre majeur.');
		if (!isMail(data.mail) || data.mail != data.mail_confirm){
			$('input[name="mail"]').invalidInput('Mail invalide.');
			$('input[name="mail_confirm"]').invalidInput('');
		}
		if (!isAlphaNum(data.password) || data.password != data.password_confirm 
			|| data.password.length < 7){
			$('input[name="password"]').invalidInput('Mot de passe invalide.');
			$('input[name="password_confirm"]').invalidInput('');
		}
	}

	// Get and ajax the form subscribe.

	var getPos = function(position) {
		globalsVar.lat = position.coords.latitude;
		globalsVar.lng = position.coords.longitude;
	} 

	var subscribe = function () {
		$('#subscribe-submit').off('click').on('click', function(e){
			e.preventDefault();
			var data = {
				login: null, name: null, first_name: null, birth: null, mail: null,
				mail_confirm: null, password: null, password_confirm: null,
				longitude: null, latitude: null
			};
			var $subscribeForm = $('#subscribe input');
			var $loading = $('#subscribe .stacked');

			if(navigator.geolocation) {
  				navigator.geolocation.getCurrentPosition(getPos);
  				data.longitude = globalsVar.lng;
  				data.latitude = globalsVar.lat;
			}
			$subscribeForm.each(function (){
				data[this.name] = this.value;
			});
			subscribeFormIsValid(data);
			if (!$subscribeForm.hasClass('invalid-input')){
				$loading.addClass('loading');
				$.ajax({
					type : 'POST',
					url : '/subscribe',
					data : data,
					dataType : 'json',
					encode : true
				}).done(function(response){
					$loading.removeClass('loading');
					if (response.data == 'login' || response.data == 'mail')
						$('input[name="'+ response.data +'"]').invalidInput('Déja utilisé.');
					else if (response.status == 'fail')
						subscribeFormIsValid(response.data);
					else {
						$('.success-message').fadeIn(700);
						setTimeout(function(){
							$('.success-message').fadeOut(700);
						}, 2000);
					}
				}).always(function (){
					$loading.removeClass('loading');
				});
			}
		});
	}

	/*
	** Logout.js
	*/

	var logout = function() {
		$('#logout').off('click').on('click', function() {
			socket.emit('deco');
		});
		
	}

	/*
	** Login.js
	*/

	// Check the content of every inputs of the login form. 
	var loginFormIsValid = function (data){
		$('.invalid-input-msg').remove();
		$('#login input').removeClass('invalid-input');
		$('.error').removeClass('error');
		$('.err-message').addClass('error');
		if (!isMail(data.mail))
			$('input[name="mail"]').invalidInput('Mail invalide.');
		if (!isAlphaNum(data.password))
			$('input[name="password"]').invalidInput('Mot de passe invalide.');
	}

	// Get and ajax the form login.
	var login = function () {
		$('#login-submit').off('click').on('click', function(e){
			e.preventDefault();
			var data = { mail: null, password: null };
			var $loginForm = $('#login input');
			var $loading = $('#login .stacked');

			$loginForm.each(function (){
				data[this.name] = this.value;
			});
			loginFormIsValid(data);
			if (!$loginForm.hasClass('invalid-input')){
				$loading.addClass('loading');
				$.ajax({
					type : 'POST',
					url : '/',
					data : data,
					dataType : 'json',
					encode : true
				}).done(function(response){
					if (response.data == 'mail')
						$('input[name="'+ response.data +'"]').invalidInput('Mail inexistant.');
					else if (response.data == 'password')
						$('input[name="'+ response.data +'"]').invalidInput('Mauvais mot de passe.');
					else if (response.status == 'fail')
						loginFormIsValid(response.data);
					else {
						window.location.reload();
					}
				}).always(function (){
					$loading.removeClass('loading');
				});
			}
		});
	}

	/*
	** mdpForget.js
	*/

	// Check the content of every inputs of the mdp forget form. 
	var mdpForgetFormIsValid = function (data){
		$('.invalid-input-msg').remove();
		$('#mdp-forget input').removeClass('invalid-input');
		$('.error').removeClass('error');
		$('.err-message').addClass('error');
		if (!isMail(data.mail))
			$('input[name="mail"]').invalidInput('Mail invalide.');
	}

	// Get and ajax the form password rescue.
	var mdpForget = function () {
		$('#mdp-forget-submit').off('click').on('click', function(e){
			e.preventDefault();
			var data = { mail: null };
			var $mdpFrogetForm = $('#mdp-forget input');
			var $loading = $('#mdp-forget .stacked');

			$mdpFrogetForm.each(function (){
				data[this.name] = this.value;
			});
			mdpForgetFormIsValid(data);
			if (!$mdpFrogetForm.hasClass('invalid-input')){
				$loading.addClass('loading');
				$.ajax({
					type : 'POST',
					url : '/forget',
					data : data,
					dataType : 'json',
					encode : true
				}).done(function(response){
					$loading.removeClass('loading');
					if (response.data == 'mail')
						$('input[name="'+ response.data +'"]').invalidInput('Mail inexistant.');
					else if (response.status == 'fail')
						mdpForgetFormIsValid(response.data);
					else
						$('.success-message').fadeIn(700);
						setTimeout(function(){
							$('.success-message').fadeOut(700);
						}, 3000);
				}).always(function (){
					$loading.removeClass('loading');
				});
			}
		});
	}	

	/*
	** editProfile.js
	*/

	var getMainPhoto = function (){
		$('.save-main-img').off('click').on('click', function (e) {
			var $container =  $($(this).parents()[1]);
			var $img = $($container[0].firstChild);
			var data = {
				src: $img.attr('src'),
			};
			$.ajax({
				type : 'PATCH',
				url : '/photo',
				data : data,
				dataType : 'json',
				encode : true
			}).done(function (response){
				if (response.status == 'success') {
					$('.img-main').removeClass('img-main');
					$container.addClass('img-main');
				}
			}).always(function (){});
		});
	}

	var delPhoto = function (){
		$('.del-img').off('click').on('click', function (e) {
			var $container =  $($(this).parents()[1]);
			var $img = $($container[0].firstChild);
			var data = {
				src: $img.attr('src'),
			};
			$.ajax({
				type : 'DELETE',
				url : '/photo',
				data : data,
				dataType : 'json',
				encode : true
			}).done(function (response){
				if (response.status == 'success') {
					$container.remove();
				}
			}).always(function (){});
		});
	}

	var validEditProfileForm = function (data, $form){
		$('.invalid-input-msg').remove();
		$('#edit-profile-form input').removeClass('invalid-input');
		$('.error').removeClass('error');
		$('.err-message').addClass('error');
		if (!isAlphaNum(data.name))
			$('input[name="name"]').invalidInput('Nom invalide.', $form, 1);
		if (!isAlphaNum(data.first_name))
			$('input[name="first_name"]').invalidInput('Prenom invalide.', $form, 1);
		if (!isMail(data.mail) || data.mail != data.mail_confirm){
			$('input[name="mail"]').invalidInput('Mail invalide.', $form, 1);
			$('input[name="mail_confirm"]').invalidInput('', $form, 1);
		}
		if ((isAlphaNum(data.passwd) == 0 && data.passwd.length != 0)
			|| (isAlphaNum(data.passwd) == true && data.passwd != data.passwd_confirm) 
			|| (isAlphaNum(data.passwd) == true && data.passwd.length < 7)){
			$('input[name="passwd"]').invalidInput('Mot de passe invalide.', $form, 1);
			$('input[name="passwd_confirm"]').invalidInput('', $form, 1);
		}
		if (data.sex != 'F' && data.sex != '' && data.sex != 'H')
			$('div[name="sex"]').invalidInput('Sexe invalide.', $form, 1);
		if (data.sex_pref != 'F' && data.sex_pref != 'B' && data.sex_pref != 'H')
			$('div[name="sex_pref"]').invalidInput('Préférence invalide.', $form, 1);
		if (data.bio.length > 500)
			$('#bio-edit').invalidInput('Biographie trop longue.', $form, 1);
	}

	var editProfile = function (){
		$('#edit-profile-submit').off('click').on('click', function (e){
			e.preventDefault();
			var $form = $('#edit-profile-form');
			var $editProfileForm = $('#edit-profile-form input');
			var $loading = $('#edit-profile-form');
			var $sex = $('#sex .item');
			var $sexPref = $('#sex-pref .item');
			var data = {
				mail: null, mail_confirm: null, name: null,
				first_name: null, passwd: null, passwd_confirm: null,
				sex: null, sex_pref: 'B', bio: $('#bio-edit')[0].value
			}
			data = getFormInfo($editProfileForm, data);
			data = getSelectInfo($sex, data);
			data = getSelectInfo($sexPref, data);
			validEditProfileForm(data, $form);
			if (!$editProfileForm.hasClass('invalid-input') 
				&& !$sex.hasClass('invalid-input') 
				&& !$sexPref.hasClass('invalid-input')){
				$loading.addClass('loading');
				$.ajax({
					type : 'POST',
					url : '/editProfile',
					data : data,
					dataType : 'json',
					encode : true
				}).done(function(response){
					$loading.removeClass('loading');
					if (response.data == 'mail'){
						$('input[name="'+ response.data +'"]').invalidInput('Adresse E-mail déja utilisé.', $form, 1);
						$('input[name="'+ response.data +'_confirm"]').invalidInput('', $form, 1);
					}
					else if (response.status == 'success'){
						$('.success-message').fadeIn(700);
						setTimeout(function(){
							$('.success-message').fadeOut(700);
						}, 2000);
					}
					else
						validEditProfileForm(response.data);
				}).always(function (){
					$loading.removeClass('loading');
				});
			}
		});
	}

	var getAllTags = function() {
		var $myTags = $('#my-tags tbody a');
		var $globalsTags = $('#global-tags tbody a');
		$myTags.each(function () {
			globalsVar.userTags.push(this.text);
		});
		$globalsTags.each(function () {
			globalsVar.tags.push(this.text);
		});
	}

	var registerTags = function($this) {
		var tag = $this.val();
		if (isAlphaNum(tag) && !checkDoublonInArray(globalsVar.userTags, `#`+ tag)){
			$.ajax({
				type : 'POST',
				url : '/tag',
				data : {tag: tag},
				dataType : 'json',
				encode : true
			}).done(function(response){
				if (response.status == 'success-new-tag') {
					globalsVar.userTags.push(`#` + response.data);
					globalsVar.tags.push(`#` + response.data);
				}
				else if (response.status == 'success-new-userTag')
					globalsVar.userTags.push(`#` + response.data);
			}).always(function (){
				$('#add-tag').val('');
				searchTags($this);
			});
		}
		else
			$this.addClass('input-error-out-form');
	}

	var searchTags = function($this) {
		var $myTags = $('#my-tags tbody');
		var $globalsTags = $('#global-tags tbody');
		$myTags.empty();
		$globalsTags.empty();
		for (var i = 0; i < globalsVar.userTags.length; i++) {
			if (~globalsVar.userTags[i].toLowerCase().indexOf($this.val().toLowerCase())) {
				var $tr = $(`<tr><td><a href="#">` + globalsVar.userTags[i] + `</a></td></tr>`);
				var $tdButton = $(`<td></td>`);
				var $button = $(`<button class="circular ui icon button del-tag"><i class="trash outline icon"></i></button>`);
				$tdButton.append($button);
				$tr.append($tdButton);
				
				$myTags.append($tr);
				delTags($button);
			}
		}
		for (var i = 0; i < globalsVar.tags.length; i++) {
			if (~globalsVar.tags[i].toLowerCase().indexOf($this.val().toLowerCase())) {
				$globalsTags.append(`<tr><td>`
								+ `<a href="#">` + globalsVar.tags[i] + `</a>`
								+ `</td></tr>`);
				
			}
		}
	}

	var newTag = function(){
		getAllTags();
		var typingTimer;
		$('#add-tag').off('keyup').on('keyup', function(e){
			var $this = $(this);
			$this.removeClass('input-error-out-form');
			clearTimeout(typingTimer);
			if (e.keyCode == 13)
				registerTags($this);
			else
				typingTimer = setTimeout(function() {searchTags($this);}, 250);
		});
	}

	var delTags = function($button) {
		$button.off('click').on('click', function (e) {
			var tag = $($($($(this).parents()[1]).children()[0]).children()[0])[0].text;
			var tagStr;
			if (checkDoublonInArray(globalsVar.userTags, tag)) {
				tagStr = tag.substring(1, tag.length);
				$.ajax({
					type : 'DELETE',
					url : '/tag',
					data : {tag: tagStr},
					dataType : 'json',
					encode : true
				}).done(function(response){
					if (response.status == 'success') {
						var index = globalsVar.userTags.indexOf('#'+ response.data);
						globalsVar.userTags.splice(index, 1);
					}
				}).always(function (){
					searchTags($(`#add-tag`));
				});
			}
		});
	}
	
	var saveNewLocation = function (lat, long) {
		var data = { lat: lat, long: long };
		$.ajax({
			type : 'PATCH',
			url : '/editProfile',
			data : data,
			dataType : 'json',
			encode : true
		}).done(function (response){
		}).always(function (){});
	}
	
	var googleMapEditProfile = function() {
		var mapId = document.getElementById("map-edit-profile");
		var $mapId = $(mapId);
		if (mapId) {
			var lat = $mapId.attr("lat");
			var long = $mapId.attr("long");
			var latlng = new google.maps.LatLng(lat, long);

			var optionsGmaps = {
				center:latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				zoom: 15,
				streetViewControl: false,
				mapTypeControl: false,
			};
			var map = new google.maps.Map(mapId, optionsGmaps);
			var marker = new google.maps.Marker({
				position: latlng,
				map: map,
				title:"Vous êtes ici",
			});
			google.maps.event.addListener(map, 'click', function(event) {
				var loc = event.latLng;
				marker.setPosition(loc);
				map.setCenter(loc);
				saveNewLocation(loc.lat(), loc.lng());
			});
		}
	}

	var disableEnableAccount = function (active) {
		var data = {active: active};
		$.ajax({
			type : 'patch',
			url : '/accountState',
			data : data,
			dataType : 'json',
			encode : true
		}).done(function (response){
			$accountState = $('#accountState');
			if (response.data.active) {
				$('#enable-account').remove();
				$accountState.append(`<button class="ui inverted green button" id="disable-account" style='width: 100%'>Désactiver mon compte </button>`);
				disableAccountButton();
			}
			else {
				$('#disable-account').remove();
				$accountState.append(`<button class="ui inverted green button" id="enable-account" style='width: 100%'> Réactiver mon compte </button>`);
				enableAccountButton();
			}
		}).always(function (){});
	}

	var enableAccountButton = function () {
		$('#enable-account').off('click').on('click', function () {
			disableEnableAccount(true);
		});
	}

	var disableAccountButton = function () {
		$('#disable-account').off('click').on('click', function () {
			disableEnableAccount(false);
		});
	}

	var deleteAccount = function () {
		$.ajax({
			type : 'delete',
			url : '/accountState',
			data : {},
			dataType : 'json',
			encode : true
		}).done(function (response){
			socket.emit('deco');
			Turbolinks.visit('/logout');
		}).always(function (){});
	}

	var deleteAccountButton = function () {
		$('#delete-account').off('click').on('click', function () {
			$('.ui .modal').modal("setting", {
				onApprove: function () {
					deleteAccount();
					return false;
				}
			}).modal('show');
		});
	}
	
	/*
	** Profile.js
	*/

	var googleMapProfile = function() {
		var mapId = document.getElementById("map-profile");
		var $mapId = $(mapId);
		if (mapId) {
			var lat = $mapId.attr("lat");
			var long = $mapId.attr("long");
			var latlng = new google.maps.LatLng(lat, long);

			var optionsGmaps = {
				center:latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				zoom: 15,
				streetViewControl: false,
				mapTypeControl: false,
			};
			var map = new google.maps.Map(mapId, optionsGmaps);
			var marker = new google.maps.Marker({
				position: latlng,
				map: map,
				title:"Vous êtes ici",
			});
		}
	}

	var zoomImg = function () {
		$('.img-profile').off('click').on('click', function () {
			$('.img-modal').attr('src', $(this).attr('src'));
			$('#img-modal').modal('show');
		});
	}

	var like = function() {
		globalsVar.profileId =  $('.body-fixed-menu').attr('userId');
		$("#like").off('click').on('click', function() {
			$.ajax({
				type : 'post',
				url : '/like',
				data : {id: globalsVar.profileId},
				dataType : 'json',
				encode : true
			}).done(function (response){
				if (response.status == 'success') {
					$('#like > a').text(Number($('#like > a').text()) + 1);
					$('#like > div').removeClass('basic');
					$('#like').addClass('heartbeat');
					dislike();
					socket.emit('like', {id: globalsVar.profileId});
				}
			}).always(function (){});
		});
	}

	var dislike = function() {
		if ($('#like').hasClass('heartbeat'))
			$("#like").off('click').on('click', function() {
				$.ajax({
					type : 'delete',
					url : '/like',
					data : {id: globalsVar.profileId},
					dataType : 'json',
					encode : true
				}).done(function (response){
					if (response.status == 'success') {
						$('#like > a').text(Number($('#like > a').text()) - 1);
						$('#like > div').addClass('basic');
						$('#like').removeClass('heartbeat');
						like();
						socket.emit('unlike', {id: globalsVar.profileId});
					}
				}).always(function (){});
			});
	}

	var block = function() {
		$("#block").off('click').on('click', function() {
			$('#block-modal').modal("setting", {
				onApprove: function () {
					blockAjax();
					return true;
				}
			}).modal('show');
		});
	}

	var blockAjax =  function() {
		$.ajax({
			type : 'post',
			url : '/block',
			data : {id: globalsVar.profileId},
			dataType : 'json',
			encode : true
		}).done(function (response){
			$('#block').remove();
			$('#other-buttons').append('<button class="ui left labeled mini icon button" id="unblock" style="float: right;">'
										+ '<i class="left remove user icon"></i> Débloquer </div>');
			unblock();
		}).always(function (){});
	}

	var unblock = function() {
		$("#unblock").off('click').on('click', function() {
			$.ajax({
				type : 'delete',
				url : '/block',
				data : {id: globalsVar.profileId},
				dataType : 'json',
				encode : true
			}).done(function (response){
				$('#unblock').remove();
				$('#other-buttons').append('<button class="ui left labeled mini icon button" id="block" style="float: right;">'
											+ '<i class="left remove user icon"></i> Bloquer </div>');
				block();
			}).always(function (){});
		});
	}

	var report = function() {
		$("#signal").off('click').on('click', function() {
			$('#signal-modal').modal("setting", {
				onApprove: function () {
					var reportContent = $('#report-content').val();
					$('#report-content').val('');
					ajaxReport(reportContent);
					return true;
				}
			}).modal('show');
		});
	}

	var ajaxReport = function(reportContent) {
		$.ajax({
			type : 'post',
			url : '/report',
			data : {report: reportContent},
			dataType : 'json',
			encode : true
		}).done(function (response){
		}).always(function (){});
	}

	var whoLikeMe = function() {
		$('#who-like-me').off('click').on('click', function() {
			$.ajax({
				type : 'get',
				url : '/whoLikeMe',
				data : {},
				dataType : 'json',
				encode : true
			}).done(function (response){
				$modalContent = $('#watch-likes > .content');
				if (response.status == 'success'){
					$modalContent.empty();
					if (response.data != 0)
						for (var i = 0; i < response.data.length ; i++) {
							if (response.data[i].sex == 'F')
								response.data[i].sex = 'woman pink';
							else if (response.data[i].sex == 'H')
								response.data[i].sex = 'man blue';
							else
								response.data[i].sex = 'genderless';
							$modalContent.append('<a href="/profile/'+ response.data[i].user_id +'"><button style="width:99%; margin-top: 5px;" class="ui basic button">'
										+ '<div style="width:49%; float: left; text-align: left;">'
										+ '<i class="big icon '+ response.data[i].sex +'"></i> '+ response.data[i].login +'</div>'
										+ '<div style="width:49%; display:inline; float:right;">'
										+ '<i class="large icon birthday"></i> '+ getAge(response.data[i].birth) +' ans</div>'
										+ '</button></a>');
						}
					else
						$modalContent.append('<h4>Personne n\'a liké votre profil</4>')
					$('#watch-likes').modal('show');
				}		
			}).always(function (){});
		});
	}

	var whoWatchMe = function() {
		$('#who-watch-me').off('click').on('click', function() {
			$.ajax({
				type : 'get',
				url : '/whoWatchMe',
				data : {},
				dataType : 'json',
				encode : true
			}).done(function (response){
				$modalContent = $('#watch-stalkers > .content');
				if (response.status == 'success'){
					$modalContent.empty();
					if (response.data != 0)
						for (var i = 0; i < response.data.length ; i++) {
							if (response.data[i].sex == 'F')
								response.data[i].sex = 'woman pink';
							else if (response.data[i].sex == 'H')
								response.data[i].sex = 'man blue';
							else
								response.data[i].sex = 'genderless';
							$modalContent.append('<a href="/profile/'+ response.data[i].user_id +'"><button style="width:99%; margin-top: 5px;" class="ui basic button">'
										+ '<div style="width:33%; float: left; text-align: left;">'
										+ '<i class="big icon '+ response.data[i].sex +'"></i> '+ response.data[i].login +'</div>'
										+ '<div style="width:33%; display:inline;">'
										+ '<i class="large icon birthday"></i> '+ getAge(response.data[i].birth) +' ans</div>'
										+ '<div style="width:33%; float: right;"> Vous a rendu visite le '
										+ moment(response.data[i].date).format('DD/MM/YYYY [à] HH:mm') +'</div>'
										+ '</button></a>');
						}
					else
						$modalContent.append('<h4>Personne n\'a consulter votre profil</4>')
					$('#watch-stalkers').modal('show');
				}
			}).always(function (){});			
		});
	}

	var connect = function() {
		socket.emit('co', {id: globalsVar.profileId});
	}

	socket.on('isCo', function() {
		$('#co').empty();
		$('#co').append('<p style="text-align:right;"><i class="circle green icon">'
						+ '</i>Connecté</p>');
	});

	socket.on('isntCo', function(data) {
		$('#co').empty();
		$('#co').append('<p style="text-align:right;"><i class="circle thin icon icon">'
						+ '</i> '+ moment(data.last_log).format('DD/MM/YYYY [à] HH:mm') +'</p>');
	});

	/*
	** Home.js
	*/

	var getDataProfiles = function() {
		$(".card").each(function(index) {
			var $this = $(this);
			globalsVar.profiles.push({
				path: $this.find("img").attr('src'), id: $this.find(".image").attr('href'),
				sex: $this.find(".sex").attr('sex'), login: $this.find(".content").attr('login'),
				age: $this.find(".age").attr('age'), loc: $this.find(".age").attr('dist'),
				pop: $this.find(".pop").attr('pop'), tag: [],
				index: index
			});
			$("#" + globalsVar.profiles[index].login).find('.tags').each(function() {
				globalsVar.profiles[index].tag.push($($(this)[0]).attr('test'));
			});
			globalsVar.profilesFiltered = globalsVar.profiles;
		});
	}

	var constructHome = function(data) {
		var profile = `<div class="ui del card" style="display:inline-block; margin-left: 5%;">
			<a class="image" href="`+ data.id +`">
				<img src="`+ data.path +`"></img>
			</a>
			<div class="content" login="`+ data.login +`">
				<a class="header modal-member" login="`+ data.login +`" style="display:inline-block;">
					<i class="`+ data.sex +` sex `+ (data.sex == "man"? "blue" : "pink" ) +` icon" sex="`+ data.sexe +`"></i>
					`+ data.login +`
				<a class="meta pop" pop="`+ data.pop +`" style="float: right; display:inline-block;">
					`+ data.pop +`
					<i class="heart red icon" style="margin-left: 3px;"></i>
				</a>
				<div class="meta">
					<a class="age" age="`+ data.age +`" dist="`+ data.loc +`"> `+ data.age +` ans</a>
					<a style="float: right;"> `+ data.loc +` km </a>
				</div>
			</div>
		</div>
		<div class="ui del modal" id="`+ data.login +`">
			<div class="header">
				<i class="`+ data.sex +` sex `+ (data.sex == "man"? "blue" : "pink" ) +` icon" sex="`+ data.sexe +`"></i>
				`+ data.login +`
			</div>
			<div class="image content">
				<div class="ui medium image">
					<img src="`+ data.path +`"></img>
				</div>
				<div class="description">
					<div class="ui header">
						Intérêts communs:
					</div>
					<p>`;
		for (var i = 0; i < data.tag.length; i++)
			profile = profile +	`<a style="margin: 4px;" class="ui label purple tags" test="`+ data.tag[i] +`"> #`+ data.tag[i] +` </a>`
		profile = profile + `</p>
				</div>
			</div>
			<div class="actions">
				<div class="ui black deny button">
					Ignorer
				</div>
				<a class="ui positive right labeled icon button" href="`+ data.id +`">
					Visiter son profil
					<i class="checkmark icon"></i>
				</a>
			</div>
		</div>`;
		$('.prof').append(profile);
	}

	var buildModalsContent = function(Id = null) {
		$('.modal-member').off('click').on('click', function(){
			if (!Id) {
				var id = '#'+$(this).attr("login");
				$(id).modal('show');
			}
			else
				$("#"+ Id).modal('show');
		});
	}

	var sortByAge = function(a, b) {
		if (parseInt(a.age) > parseInt(b.age))
			return 1;
		if (parseInt(a.age) < parseInt(b.age))
			return -1;
		return 0;
	}
	var sortByDist = function(a, b) {
		if (parseInt(a.loc) > parseInt(b.loc))
			return 1;
		if (parseInt(a.loc) < parseInt(b.loc))
			return -1;
		return 0;
	}
	var sortByTags = function(a, b) {
		if (a.tag.length > b.tag.length)
			return -1;
		if (a.tag.length < b.tag.length)
			return 1;
		return 0;
	}
	var sortByPop = function(a, b) {
		if (a.pop > b.pop)
			return -1;
		if (a.pop < b.pop)
			return 1;
		return 0;
	}

	var triProfiles = function() {
		$('#tri-age').off('click').on('click', function() {
			globalsVar.profilesFiltered.sort(sortByAge);
			$('.del').remove();
			for (var i = 0; i < globalsVar.profilesFiltered.length; i++) {
				constructHome(globalsVar.profilesFiltered[i]);
			}
			buildModalsContent();
		});

		$('#tri-dist').off('click').on('click', function() {
			globalsVar.profilesFiltered.sort(sortByDist);
			$('.del').remove();
			for (var i = 0; i < globalsVar.profilesFiltered.length; i++) {
				constructHome(globalsVar.profilesFiltered[i]);
			}
			buildModalsContent();
		});

		$('#tri-pop').off('click').on('click', function() {
			globalsVar.profilesFiltered.sort(sortByPop);
			$('.del').remove();
			for (var i = 0; i < globalsVar.profilesFiltered.length; i++) {
				constructHome(globalsVar.profilesFiltered[i]);
			}
			buildModalsContent();
		});

		$('#tri-tags').off('click').on('click', function() {
			globalsVar.profilesFiltered.sort(sortByTags);
			$('.del').remove();
			for (var i = 0; i < globalsVar.profilesFiltered.length; i++) {
				constructHome(globalsVar.profilesFiltered[i]);
			}
			buildModalsContent();
		});
	}

	var filterProfiles = function() {
		var minAge;
		$('#min-age').off('keyup').on('keyup', function() {
			clearTimeout(minAge);
			minAge = setTimeout(function() {
				console.log('#min-age');
			}, 250);
		});
		var maxAge;
		$('#max-age').off('keyup').on('keyup', function() {
			clearTimeout(maxAge);
			maxAge = setTimeout(function() {
				console.log('#max-age');
			}, 250);
		});

		var minDist;
		$('#min-dist').off('keyup').on('keyup', function() {
			clearTimeout(minDist);
			minDist = setTimeout(function() {
				console.log('#min-dist');
			}, 250);
		});
		var maxDist;
		$('#max-dist').off('keyup').on('keyup', function() {
			clearTimeout(maxDist);
			maxDist = setTimeout(function() {
				console.log('#max-dist');
			}, 250);
		});

		var minPop;
		$('#min-pop').off('keyup').on('keyup', function() {
			clearTimeout(minPop);
			minPop = setTimeout(function() {
				console.log('#min-pop');
			}, 250);
		});
		var maxPop;
		$('#max-pop').off('keyup').on('keyup', function() {
			clearTimeout(maxPop);
			maxPop = setTimeout(function() {
				console.log('#max-pop');
			}, 250);
		});

		var minTag;
		$('#min-tag').off('keyup').on('keyup', function() {
			clearTimeout(minTag);
			minTag = setTimeout(function() {
				console.log('#min-tag');
			}, 250);
		});
		var maxTag;
		$('#max-tag').off('keyup').on('keyup', function() {
			clearTimeout(maxTag);
			maxTag = setTimeout(function() {
				console.log('#max-tag');
			}, 250);
		});
	}

	var typingTimer;
		$('#add-tag').off('keyup').on('keyup', function(e){
			var $this = $(this);
			$this.removeClass('input-error-out-form');
			clearTimeout(typingTimer);
			if (e.keyCode == 13)
				registerTags($this);
			else
				typingTimer = setTimeout(function() {searchTags($this);}, 250);
		});

	/*
	** Messages.js
	*/

	var checkAuthorizeId = function(id) {
		for (var i = 0; i < globalsVar.matchId.length; i++) {
			if (id == globalsVar.matchId[i])
				return 1;
		}
		return 0;
	}

	var changeConv = function() {
		var $id;
		var $changeConv = $('.change-conv');
		for (var i = 0; i < $changeConv.length;i++) {
			$id = $('#' + $changeConv[i].id);		
			globalsVar.matchId.push($changeConv[i].id)
			globalsVar.convImg[$changeConv[i].id] = $changeConv[i].childNodes["0"].childNodes["0"].attributes[1].value;
		}
		for (var i = 0; i < globalsVar.matchId.length; i++) {
			$('#' + globalsVar.matchId[i]).off('click').on('click', function() {
				var id = $(this).attr('id');
				$('.change-conv').removeClass('active');
				$(this).addClass('active')
				if (checkAuthorizeId(id)) {
					globalsVar.talkWith = id;
					$.ajax({
						type : 'post',
						url : '/messages',
						data : {id: globalsVar.talkWith},
						dataType : 'json',
						encode : true
					}).done(function (response){
						var $msgBoard = $('#msg-display');
						$msgBoard.empty();
						for (var i = 0; i < response.data.length; i++) {
							if (response.data[i].received_by == globalsVar.talkWith 
								|| response.data[i].send_by != globalsVar.talkWith) {
								$msgBoard.append('<div style="text-align: right;"><div class="ui purple compact message msg" >'
											+ response.data[i].content + '</div></div>');
							}
							else {
								$msgBoard.append('<div><img class="ui image mini circular"'
									+ ' style="display: inline; width:47px;" src="'+ globalsVar.convImg[response.data[i].send_by] +'"></img>'
									+ '<div class="ui compact message msg" style="margin-left: 5px;">'
									+ response.data[i].content + '</div></div>');
							}
						}
						updateScroll('msg-display');
					}).always(function (){});
				}
			});
		}
	}

	var inputTchat = function() {
		var $input = $('#tchat-input');
			$input.off('keyup').on('keyup', function(e) {
				if (e.keyCode == 13) {
					if (globalsVar.talkWith) {
						tchat($input.val());
						$input.val('');
					}
					else
						$('#tchat-input').val('');
				}
			});
			$('#send-msg').off('click').on('click', function() {
				if (globalsVar.talkWith) {
					tchat($input.val());
					$input.val('');
				}
				else
					$('#tchat-input').val('');
			});
	}

	var tchat = function(text) {
		var $text = document.createTextNode(text);
		var $p1 = $('<div style="text-align: right;"></div>');
		var $p2 = $('<div class="ui purple compact message msg" ></div>');
		$p2.append($text);
		$p1.append($p2);
		$('#msg-display').append($p1);
		socket.emit('tchat', { text: text, id: globalsVar.talkWith });
		socket.emit('message', {id: globalsVar.talkWith});
		updateScroll('msg-display');
	}

	socket.on('send_msg', function(data) {
		if (globalsVar.talkWith == data.id) {
			$('#msg-display').append('<div><img class="ui image mini circular"'
				+ ' style="display: inline; width:47px;" src="'+ globalsVar.convImg[data.id] +'"></img>'
				+ '<div class="ui compact message msg" style="margin-left: 5px;">'
				+ data.msg + '</div></div>');
			updateScroll('msg-display');
		}
	});

	/*
	** Notif.js
	*/

	socket.on('unlikeNotif', function(resp) {
		newNotif($('#notif-nbr'));
		$('#notif > .menu').prepend('<div class="item">'+ resp.content +'</div>')
	});

	socket.on('likeNotif', function(resp) {
		newNotif($('#notif-nbr'));
		$('#notif > .menu').prepend('<div class="item">'+ resp.content +'</div>')
	});

	socket.on('watchNotif', function(resp) {
		newNotif($('#notif-nbr'));
		$('#notif > .menu').prepend('<div class="item">'+ resp.content +'</div>')
	});

	socket.on('messageNotif', function(resp) {
		newNotif($('#notif-nbr'));
		$('#notif > .menu').prepend('<div class="item">'+ resp.content +'</div>')
	});

	var getNbrNotifNotRead = function(resp) {
		$.ajax({
			type : 'post',
			url : '/notif',
			data : {},
			dataType : 'json',
			encode : true
		}).done(function (response){
			if (response.status == 'success'){
				$('#notif-nbr').text(response.data.nbr);
				var $newNotif = $('#notif > .menu');
				for (var i = 0; i < response.data.content.length; i++) {
					$newNotif.prepend('<div class="item">'+ response.data.content[i].content +'</div>')
				}
			}
		}).always(function (){});
	}

	var buildDropDownNotif = function() {
		var $notif = $('#notif');

		$notif.off('click').on('click', function() {
			$.ajax({
				type : 'post',
				url : '/getNotif',
				data : {del: true},
				dataType : 'json',
				encode : true
			}).done(function (response){
				if (response.status == 'success')
					$('#notif-nbr').text('');
			}).always(function (){});
		});
	}

	/*
	**
	*/

	var subscribePage = function() {
		subscribe();
	};

	var loginPage = function() {
		login();
	};

	var mdpForgetPage = function() {
		mdpForget();
	};

	var myAccountPage = function() {
		getMainPhoto();
		delPhoto();
		editProfile();
		Dropzone.discover();
		newTag();
		delTags($('.del-tag'));
		googleMapEditProfile();
		disableAccountButton();
		enableAccountButton();
		deleteAccountButton();
	};

	var profilePage = function() {
		googleMapProfile();
		zoomImg();
		like();
		dislike();
		block();
		unblock();
		report();
		whoLikeMe();
		whoWatchMe();
		connect();
		socket.emit('watch', {id: globalsVar.profileId});
	};

	var acceuilPage = function() {
		getDataProfiles();
		buildModalsContent();
		triProfiles();
		filterProfiles();
	};

	var messagesPage = function() {
		changeConv();
		inputTchat();
	}

	var runAllJs = function() {
		globalsVar = { tags: [], userTags: [],
			profileId: 0, matchId: [], talkWith: 0,
			convImg: {}, lat: null, lng: null,
			profiles: [], profilesFiltered: [] };
		getNbrNotifNotRead();
		buildDropDownNotif();
		var page = $('.active-page').attr('page');
		$('.ui.dropdown').dropdown();
		logout();
		if (page == 'subscribe') {
			subscribePage();
		}
		else if (page == 'login') {
			loginPage();
		}
		else if (page == 'mdpForget') {
			mdpForgetPage();
		}
		else if (page == 'myAccount') {
			myAccountPage();
		}
		else if (page == 'profile') {
			socket.emit('score');
			profilePage();
		}
		else if (page == 'home') {
			acceuilPage();
		}
		else if (page == 'messages') {
			messagesPage();
		}
	}

	runAllJs();

	$(document).off('turbolinks:load').on('turbolinks:load', function (){
		runAllJs();
	});
});