var isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };
if (isMobile.any()) { }

if (location.hash) {
	var hsh = location.hash.replace('#', '');
	if ($('.popup-' + hsh).length > 0) {
		popupOpen(hsh);
	} else if ($('div.' + hsh).length > 0) {
		$('body,html').animate({ scrollTop: $('div.' + hsh).offset().top, }, 500, function () { });
	}
}
$('.wrapper').addClass('loaded');

var act = "click";
if (isMobile.iOS()) {
	var act = "touchstart";
}

// Translate image to backgroung
function ibg(){
	$.each($('.ibg'), function(index, val) {
		if($(this).find('img').length>0){
			$(this).css('background-image','url("'+$(this).find('img').attr('src')+'")');
		}
	}); 
}
ibg();

// Nav menu
$('.menu-header__icon').click(function (event) {
	event.preventDefault();
	$(this).toggleClass('active');
	$('.menu-header__menu').toggleClass('active');
	if ($(this).hasClass('active')) {
		$('body').data('scroll', $(window).scrollTop());
	}
	$('body').toggleClass('lock');
	if (!$(this).hasClass('active')) {
		$('body,html').scrollTop(parseInt($('body').data('scroll')));
	}
});

$('.header-menu__link.parent').click(function (event) {
	$(this).parent().toggleClass('active');
	$(this).parent().find('.header-menu-sublist').slideToggle(300, function (event) { });
	$('.header-menu__link.parent').not(this)
	return false;
});

// Change scroll 
$(".scroll").bind("click", function (e) { // class nav menu 
			var anchor = $(this);
			$("html, body")
				.stop()
				.animate(
					{
						scrollTop: $(anchor.attr("href")).offset().top - 30 //value for change scroll position
					},
					700 // value for animation
				);
			e.preventDefault();
});

// callback succsess button
$('.callback-status__button').on("click", function (event) {
	event.preventDefault();
	$(".callback-block").show(0.607);
	$(".callback-status").hide(0.607);
	$('.callback').removeClass('callback_activ');
})

//  Form 
$('.callback-form').submit(function () {
	event.preventDefault();
	var errors = false;

	$(this).find('.callback-form__errors').empty();

	$(this).find('input').each(function () {

		var name = $('.callback-form__name').val(),
			email = $('.callback-form__email').val(),
			intAdress = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
			intName = /^[a-zA-Zа-яА-Я]+$/;

		//validate all input on lenght & space
		if (($.trim($(this).val()) == '') || ($(this).val().trim().length < 4) || ($(this).val().length > 60)) {
			var showError = $('.callback-errors').attr("data-errors-base");
			$(this).next().text(showError);
			errors = true;
		}

		//validate special input(name & mail) 
		if (!intName.test(name)) {
			errors = true;
			var showError = $('.callback-errors').attr("data-errors-name");
			$('.callback-form__name').next().text(showError);
		}

		if ((email.length < 8) || (!intAdress.test(email))) {
			errors = true;
			var showError = $('.callback-errors').attr("data-errors-email");
			$('.callback-form__email').next().text(showError);
		}

	});

	//validate textarea on lenght & space
	$(this).find('textarea').each(function () {
		if (($.trim($(this).val()) == '') || ($(this).val().trim().length < 30) || ($(this).val().length > 1000)) {
			errors = true;
			var showError = $('.callback-errors').attr("data-errors-base");
			$(this).next().text(showError);
		}
	});

	//  Ajax sender ( if errors = false)
	if (!errors) {
		data = $('form').serialize();
		$.ajax({
			url: 'mailer/smart.php',
			type: 'POST',
			data: data,
			beforeSend: beforeSendForm,
			success: successForm,
			error: errorsForm
		});

		// Function before send
		function beforeSendForm() {
			var showError = $('.callback-errors').attr("data-process-send");
			$('.callback-form__message').next().text(showError);
			$('.callback-form__button').prop('disabled', true);
		};

		// Function success, server ansver
		function successForm(data) {
			var serverAnswer = $.parseJSON(data);
			$('.callback-form__message').next().text(serverAnswer.result);
			console.log(serverAnswer.result);
			if (serverAnswer.result == "pass") {
				$(".callback-form__errors").empty();
				$('.callback-form').trigger("reset");
				$('.callback-form__button').prop('disabled', false);
				$(".callback-block").hide(0.607);
				$('.сallback-close').hide(0.607);
				$(".callback-status").show(0.607);
			} else {
				var showError = $('.callback-errors').attr("data-errors-server");
				$('.callback-status__message').text(showError);
				$(".callback-block").hide(0.607);
				$(".callback-status").show(0.607);
				setTimeout(reloadPage, 5000);
			}
		};

		// Function errors
		function errorsForm(data) {
			console.log(data);
			$(".callback-block").hide(0.607);
			$(".callback-status").show(0.607);
			$(".callback-status__message").empty();

			var showError = $('.callback-errors').attr("data-errors-send");
			$('.callback-status__message').text(showError);
			setTimeout(reloadPage, 5000);
		};

		// Function reload page 
		function reloadPage() {
			location.reload();
		}
	};
	return false;
});

// accordeon
$(".title__block").on("click", function () {
	var navTab, tabsItem;
	navTab = $(this).parents(".accordion__item"), 
	tabsItem = navTab.find(".info"),
	navTab.hasClass("active__block") ? (navTab.removeClass("active__block"),
	tabsItem.slideUp()) : (navTab.addClass("active__block"), 
	tabsItem.stop(!0, !0).slideDown(),
	navTab.siblings(".active__block").removeClass("active__block").children(".info").stop(!0, !0).slideUp())
});

