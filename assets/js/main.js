$(document).ready(function(){
	var animating = false;

	var gameDimensions = function(div){
		var h = document.getElementById(div).offsetHeight;
		var w = document.getElementById(div).offsetWidth;
		return {h:h, w:w};
	}

	var dimensions = gameDimensions('game1');

	var cx = dimensions.w/8, cy = dimensions.h - dimensions.h/3.5;
	var cx2 = dimensions.w/10, cy2 = dimensions.h - dimensions.h/2.8 + dimensions.h/10*2, deg = 75;

	var _paper = [];
	_paper[0] = new Raphael('game1', '100.1%', '100.1%');
	
	var ground = _paper[0].rect(0, dimensions.h - dimensions.h/4, dimensions.w*2, dimensions.h/2).attr({'fill': '#333', 'stroke-width': 0});

	var protagonistShadow = _paper[0].ellipse(cx2, cy2, dimensions.h/15, dimensions.h/10).attr({'fill': '#000', 'stroke-width': 0}).transform('r'+deg);
	var protagonist = _paper[0].circle(cx, cy, dimensions.h/12).attr({'fill': '#777', 'stroke-width': 0});

	var signPost = _paper[0].rect(dimensions.w - dimensions.w/10, dimensions.h - dimensions.h/8 - dimensions.h/4, 20, 80).attr({'fill': '#444', 'stroke-width': 0});
	var sign = _paper[0].rect(dimensions.w - dimensions.w/10, dimensions.h - dimensions.h/8 - dimensions.h/4, 20, 80).attr({'fill': '#444', 'stroke-width': 0});

	$game1 = $('#game1');

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
	}).keyup(function(event){
		delete keys[event.which];
	});

	gameLoop = function(){
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
	}

	gameLoop();

	$('#main_nav ul .not_ready').hover(function(){
		$(this).append('<span class="annoying">(NOT READY BRO)</span>');
	}, function(){
		$(this).children('span').filter(":contains('(NOT READY BRO)')").remove();
	});
});