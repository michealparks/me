$(document).ready(function(){
	var animating = false, 
		first = true,
		_paper = [];

	_paper[0] = new Raphael('game1', '100.1%', '100.1%');

	var gameDimensions = function(div){
		var h = document.getElementById(div).offsetHeight,
			w = document.getElementById(div).offsetWidth;
		return {h:h, w:w};
	};

	var gameLoop = function(){

		// Move left.
		if (keys[37]){
			protagonist.animate({'cx': cx-=4}, 50);
			protagonistShadow.animate({'cx': cx2-=1, 'cy': cy2+=4}, 30);
		}

		// Move right.
		else if (keys[39]){
			protagonist.animate({'cx': cx+=4}, 50);
			protagonistShadow.animate({'cx': cx2+=1, 'cy': cy2-=4}, 30);
		}

		setTimeout(gameLoop, 20);
	};

	var dimensions = gameDimensions('game1'),

		cx = dimensions.w/8, 
		cy = dimensions.h - dimensions.h/3.5,
		cx2 = dimensions.w/10, 
		cy2 = dimensions.h - dimensions.h/2.8 + dimensions.h/10*2, deg = 75,
	
		ground = _paper[0].rect(0, dimensions.h - dimensions.h/4, dimensions.w*2, dimensions.h/2).attr({'fill': '#333', 'stroke-width': 0}),

		protagonistShadow = _paper[0].ellipse(cx2, cy2, dimensions.h/15, dimensions.h/10).attr({'fill': '#000', 'stroke-width': 0}).transform('r'+deg),
		protagonist = _paper[0].circle(cx, cy, dimensions.h/12).attr({'fill': '#777', 'stroke-width': 0}),
		smile = _paper[0].path(['M', cx, cy, 'L', cx - dimensions.h/13, 'A', cx - dimensions.h/13, cx - dimensions.h/13]),

		square = _paper[0].rect(cx - dimensions.h/14, cy - dimensions.h/6, dimensions.h/16, dimensions.h/16, 6).attr({'fill': 'rgba(255,255,255,0.8)', 'stroke-width': 0}),
		square2 = _paper[0].rect(cx + dimensions.h/80, cy - dimensions.h/6, dimensions.h/16, dimensions.h/16, 6).attr({'fill': 'rgba(255,255,255,0.8)', 'stroke-width': 0}),
		leftArrow = _paper[0].path(['M', cx + dimensions.h/16 - dimensions.h/12, cy - dimensions.h/6.5, 'L', cx - dimensions.h/16, cy - dimensions.h/6 + dimensions.h/32, 'L', cx + dimensions.h/16 - dimensions.h/12, cy - dimensions.h/8.5, 'Z']).attr({'fill':'#333', 'stroke-width': 0}),
		rightArrow = _paper[0].path(['M', cx - dimensions.h/16 + dimensions.h/12, cy - dimensions.h/6.5, 'L', cx + dimensions.h/16, cy - dimensions.h/6 + dimensions.h/32, 'L', cx - dimensions.h/16 + dimensions.h/12, cy - dimensions.h/8.5, 'Z']).attr({'fill':'#333', 'stroke-width': 0}),

		signPost = _paper[0].rect(dimensions.w - dimensions.w/10, dimensions.h - dimensions.h/8 - dimensions.h/4, 20, 80).attr({'fill': '#444', 'stroke-width': 0}),
		sign = _paper[0].rect(dimensions.w - dimensions.w/10, dimensions.h - dimensions.h/8 - dimensions.h/4, 20, 80).attr({'fill': '#444', 'stroke-width': 0});

	$(window).resize(function(){
		dimensions = gameDimensions('game1');

		if (!animating){
			animating = true;
			setTimeout(function(){animating = false;}, 200);
			ground.animate({'cx': dimensions.w/2, 'cy': dimensions.h/2}, 200);
		}
	});

	var keys = {};
	$(this).keydown(function(event){
		keys[event.which] = true;

		if (event.keyCode == 37 || event.keyCode == 39){
			if (first){
				square.animate({'fill': 'rgb(218,72,72)'}, 200);
				square2.animate({'fill': 'rgb(218,72,72)'}, 200);
				leftArrow.animate({'fill': 'rgb(218,72,72)'}, 200);
				rightArrow.animate({'fill': 'rgb(218,72,72)'}, 200);
				$('#game_section p').fadeOut();
			}
			first = false;
		}
	}).keyup(function(event){
		delete keys[event.which];
	});

	gameLoop();

	$('#main_nav ul .not_ready').hover(function(){
		$(this).append('<span class="annoying">(NOT READY BRO)</span>');
	}, function(){
		$(this).children('span').filter(":contains('(NOT READY BRO)')").remove();
	});
});