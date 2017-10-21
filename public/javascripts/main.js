$(document).ready(function(){

	/*
	** Globals variables 
	*/

	var globalsVar;

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
	var subscribe = function () {
		$('#subscribe-submit').off('click').on('click', function(e){
			e.preventDefault();
			var data = {
				login: null, name: null, first_name: null, birth: null, mail: null,
				mail_confirm: null, password: null, password_confirm: null
			};
			var $subscribeForm = $('#subscribe input');
			var $loading = $('#subscribe .stacked');

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
					$loading.removeClass('loading');
					if (response.data == 'mail')
						$('input[name="'+ response.data +'"]').invalidInput('Mail inexistant.');
					else if (response.data == 'password')
						$('input[name="'+ response.data +'"]').invalidInput('Mauvais mot de passe.');
					else if (response.status == 'fail')
						loginFormIsValid(response.data);
					else
						Turbolinks.visit('/home');
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
		console.log(data)
		if (!isAlphaNum(data.name))
			$('input[name="name"]').invalidInput('Nom invalide.', $form, 1);
		if (!isAlphaNum(data.first_name))
			$('input[name="first_name"]').invalidInput('Prenom invalide.', $form, 1);
		if (!isMail(data.mail) || data.mail != data.mail_confirm){
			$('input[name="mail"]').invalidInput('Mail invalide.', $form, 1);
			$('input[name="mail_confirm"]').invalidInput('', $form, 1);
		}
		console.log(isAlphaNum(data.passwd));
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
				console.log('test');
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

	/*
	**
	*/

	var runAllJs = function() {
		globalsVar = {
			tags: [],
			userTags: []
		};
		$('.ui.dropdown').dropdown();
		subscribe();
		login();
		mdpForget();
		getMainPhoto();
		delPhoto();
		editProfile();
		Dropzone.discover();
		newTag();
		delTags($('.del-tag'))
	}

	runAllJs();

	$(document).off('turbolinks:load').on('turbolinks:load', function (){
		runAllJs();
	});
});