$(document).ready(function(){
	var gamePage = true,
		blogPage = false,

		animating = false, 
		first = true,
		footUnleashed = false,
		_paper = [],
		deg = 0,
		keys = {};

	_paper[0] = new Raphael('game1', '100.1%', '100.1%');

	var gameDimensions = function(div){
		var h = document.getElementById(div).offsetHeight,
			w = document.getElementById(div).offsetWidth;
		return {h:h, w:w};
	};

	var gameLoop = function(){
		if (cx > (dimensions.w - dimensions.w/2.5 + 10))
		{
			if (!footUnleashed){
				unleashFoot();
				footUnleashed = true;
			}
		}

		// Move left.
		if (keys[37]){
			protagonist.attr({'cx': cx-=4});
			protagonistShadow.attr({'cx': cx2-=1, 'cy': cy2+=4});
		}

		// Move right.
		else if (keys[39]){
			protagonist.attr({'cx': cx+=4});
			protagonistShadow.attr({'cx': cx2+=1, 'cy': cy2-=4});
		}

		setTimeout(gameLoop, 20);
	};

	var unleashFoot = function(){

		$(document).off();
		setTimeout(function(){
			protagonist.remove();
			protagonistShadow.remove();
		}, 400);

		setTimeout(showWinMessage(), 500);

		var foot = '<svg version="1.1" id="foot" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="234.564px" height="409.375px" viewBox="0 0 234.564 349.375" enable-background="new 0 0 234.564 349.375" xml:space="preserve"><path fill="#CC9966" d="M10.1,0h85c0,0-1.75,211.25,0,219s7.5,14,12,18s9.827,7.182,17,9s62.25,19,71,18s12-8,20-9s14.25,2.25,17,9s3,11.5,0,18s-47.25,59.5-55,64s-13.25,4.5-21,0s-4.5-6.5-9-13s-109.108-28.648-119-27s-10.75,4.75-18,3s-10.75-13.25-10-21s6.25-9.5,10-20S10.1,0,10.1,0z"/><path fill="none" stroke="#000000" stroke-miterlimit="10" d="M234.029,275.989c1.07-9.989-22.43-6.489-31.68,5.761"/><path fill="none" stroke="#000000" stroke-miterlimit="10" d="M218.189,300.53c5.66-11.03-2.59-19.78-25.59-4.78"/><path fill="none" stroke="#000000" stroke-miterlimit="10" d="M204.1,317.428c16.301-19.637-23.75-9.928-23.75-9.928"/><path fill="none" stroke="#000000" stroke-miterlimit="10" d="M190.281,333.123C206.365,314.325,165.35,322,165.35,322"/><path fill="#F6F6F6" d="M218.207,257.167l4.226,10.5c0,0,12.52,1.907,6-5.25S218.207,257.167,218.207,257.167z"/><path fill="#F6F6F6" d="M225.933,274.333L219.91,285c0,0,4.755,3.535,8.522-1.167C235.6,272.167,225.933,274.333,225.933,274.333z"/><path fill="#F6F6F6" d="M214.933,292.5l-7.833,10.333c0,0,4.274,1.378,6.167,0C221.433,292.167,214.933,292.5,214.933,292.5z"/><path fill="#F6F6F6" d="M202.35,309.167l-9.75,9.166c0,0,4.354,2.508,7.667,0C207.767,311.333,202.35,309.167,202.35,309.167z"/><path fill="#F6F6F6" d="M183.433,326.786l-11,9.881c0,0,6.537,1.223,10.167-1.334C195.267,325.667,183.433,326.786,183.433,326.786z"/><path fill="none" stroke="#000000" stroke-miterlimit="10" d="M97.1,283c-0.194-3.544-0.074-7.229,0.351-10.649c4.083-0.493,8.376-0.242,12.55-0.479c-1.908-11.548,10.314-9.36,8.199-19.495c3.117-0.452,6.612-0.584,9.9-0.377"/><path fill="none" stroke="#000000" stroke-miterlimit="10" d="M143.1,256c-3.607,1.971-6.946,5.745-6.1,10.897c-7.081-1.418-8.447,7.729-15.805,8.224c-0.059,3.539-0.005,7.23-0.199,10.776c-2.607,0.124-6.333,0.748-8.896,0.103"/><path fill="none" stroke="#000000" stroke-miterlimit="10" d="M128.1,292c1.232,0.081,2.406,0.081,3.626-0.128c-0.1-2.748,1.002-6.563,0.474-9.519c1.944,0.493,5.672-0.352,7.801,0.542c-0.137-1.448,0.584-3.527,0.446-4.803c4.766,0.402,10.339-8,10.824-11.723c4.224-1.568,4.819-5.68,3.905-9.993c0.871-0.647,1.846-0.772,2.924-0.377"/><path fill="none" stroke="#000000" stroke-miterlimit="10" d="M142.1,299c-0.591-2.219-0.04-5.52,0.377-7.649c2.354,0.38,5.784-1.039,8.276-0.446c-0.135-2.377,1.637-4.494,1.721-6.781c1.617,0.319,3.888-0.512,5.522-0.226c-0.458-2.591,0.876-6.13,0.454-8.547c2.329,0.389,5.793-1.025,8.272-0.453c-0.693-6.2,2.446-12.806,9.03-12.99c0.604-1.42,0.227-2.422,0.347-3.907"/><path fill="none" stroke="#000000" stroke-miterlimit="10" d="M156.1,298c2.321-2.873,5.436-4.723,8.904-5.096C162.78,280.815,182.166,278.432,181.1,270"/></svg>';
		$('#game1').prepend(foot);
		$('#game1').css('z-index', '0');
		$('#game1 svg').css('z-index', '0');
		$('#foot').css({
			'position': 'absolute',
			'margin-top': '-200%',
			'margin-left': dimensions.w - dimensions.w/2.5 + 'px',
			'z-index': '1000'
		}).animate({
			'margin-top': '0'
		});
	};

	var showWinMessage = function(){
		setTimeout(function(){
			$('#game1').append('<h1 class="win">YOU WIN<h1>');
			setTimeout(function(){
				$('#game1 h1').remove();
				setTimeout(function(){
					$('#game1').append('<h1 class="win">TRIPLE KILL!!!</h1>');
					setTimeout(function(){
						$('#game1 h1').remove();
						setTimeout(function(){
							$('#game1').append('<h1 class="win">NEW HIGH SCORE</h1>');
							setTimeout(function(){
								$('#game1 h1').remove();
								showWinMessage();
							}, 2000)
						}, 500)
					}, 2000)
				}, 500);
			}, 2000);
		}, 500);
	};

	var setEvents = function(){
		$(document).keydown(function(event){
			keys[event.which] = true;

			if (event.keyCode == 37 || event.keyCode == 39){
				if (first){
					square.animate({'fill': 'rgb(218,72,72)'}, 200);
					square2.animate({'fill': 'rgb(218,72,72)'}, 200);
					leftArrow.animate({'fill': 'rgb(218,72,72)'}, 200);
					rightArrow.animate({'fill': 'rgb(218,72,72)'}, 200);
					$('#game_section p').fadeOut();

					first = false;
				}
			}
		}).keyup(function(event){
			delete keys[event.which];
		});

		$(window).resize(function(){
			dimensions = gameDimensions('game1');

			if (!animating){
				animating = true;
				setTimeout(function(){animating = false;}, 200);
				ground.animate({'cx': dimensions.w/2, 'cy': dimensions.h/2}, 200);
			}
		});
	};

	var setClickEvents = function(){
		$('#blog').click(function(){
			$('#game1').animate({
				'top': '-100% 0 0 0'
			}, 300, function(){
				$(this).css({'display': 'none'});
			});
			setTimeout(function(){
				$('#blog-section')
					.css({'display': 'block'})
					.animate({'top': '75px'}, 300);
			}, 300);
			
		});
	};

	var dimensions = gameDimensions('game1'),

		cx = dimensions.w/8, 
		cy = dimensions.h - dimensions.h/3.5,
		cx2 = dimensions.w/10, 
		cy2 = dimensions.h - dimensions.h/2.8 + dimensions.h/10*2, deg = 75,
		cx3 = dimensions.w/8,
	
		ground = _paper[0]
			.rect(0, dimensions.h - dimensions.h/4, dimensions.w*2, dimensions.h/2)
			.attr({'fill': '#333', 'stroke-width': 0}),
		protagonistShadow = _paper[0]
			.ellipse(cx2, cy2, dimensions.h/15, dimensions.h/10)
			.attr({'fill': '#000', 'stroke-width': 0}).transform('r'+deg),
		signPost = _paper[0]
			.rect(dimensions.w - dimensions.w/10, dimensions.h - dimensions.h/6 - dimensions.h/4, 20, 80)
			.attr({'fill': '#444', 'stroke-width': 0}),
		sign = _paper[0]
			.rect(dimensions.w - dimensions.w/6.4, dimensions.h - dimensions.h/6 - dimensions.h/4, 100, 40)
			.attr({'fill': '#444', 'stroke-width': 0}),
		signPostShadow = _paper[0].path([
			'M', dimensions.w - dimensions.w/10, dimensions.h - dimensions.h/6 - dimensions.h/4 + 80, 
			'L', dimensions.w - dimensions.w/5, dimensions.h - dimensions.h/20 - dimensions.h/12, 
			'L', dimensions.w - dimensions.w/5 + 20, dimensions.h - dimensions.h/20 - dimensions.h/12, 
			'L', dimensions.w - dimensions.w/10 + 20, dimensions.h - dimensions.h/6 - dimensions.h/4 + 80, 
			'Z'
		]).attr({'fill': '#000'}),
		// signShadow = _paper[0].path([
		// 	'M', 
		// 	'L', 
		// 	'L',
		// 	'L',
		// 	'Z'
		// ]).attr({'fill': '#000'}),

		protagonist = _paper[0]
			.circle(cx, cy, dimensions.h/12)
			.attr({'fill': '#777', 'stroke-width': 0}),

		startAngle = 180,
		endAngle = 360,
		// smile = _paper[0].path([
		// 	'M', cx, cy, 'L', cx - dimensions.h/12, cy, 
		// 	'A', dimensions.h/12, dimensions.h/12, 0, + (endAngle - startAngle > 180), 0, cx + dimensions.h/12, cy, 
		// 	'Z'
		// ]).attr({'fill': 'yellow', 'stroke-width': 0}),

		square = _paper[0]
			.rect(cx - dimensions.h/14, cy - dimensions.h/6, dimensions.h/16, dimensions.h/16, 6)
			.attr({'fill': 'rgba(255,255,255,0.8)', 'stroke-width': 0}),
		square2 = _paper[0]
			.rect(cx + dimensions.h/80, cy - dimensions.h/6, dimensions.h/16, dimensions.h/16, 6)
			.attr({'fill': 'rgba(255,255,255,0.8)', 'stroke-width': 0}),
		leftArrow = _paper[0].path([
			'M', cx + dimensions.h/16 - dimensions.h/12, cy - dimensions.h/6.5, 
			'L', cx - dimensions.h/16, cy - dimensions.h/6 + dimensions.h/32, 
			'L', cx + dimensions.h/16 - dimensions.h/12, cy - dimensions.h/8.5, 
			'Z'
		]).attr({'fill':'#333', 'stroke-width': 0}),
		rightArrow = _paper[0].path([
			'M', cx - dimensions.h/16 + dimensions.h/12, cy - dimensions.h/6.5, 
			'L', cx + dimensions.h/16, cy - dimensions.h/6 + dimensions.h/32, 
			'L', cx - dimensions.h/16 + dimensions.h/12, cy - dimensions.h/8.5, 
			'Z'
		]).attr({'fill':'#333', 'stroke-width': 0});

	

	$('#main_nav ul .not_ready').hover(function(){
		$(this).append('<span class="annoying">(NOT READY BRO)</span>');
	}, function(){
		$(this).children('span').filter(":contains('(NOT READY BRO)')").remove();
	});

	setEvents();
	setClickEvents();
	gameLoop();
});