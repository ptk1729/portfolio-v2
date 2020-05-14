// window.onload = function() {
// 	//canvas init
// 	var canvas = document.getElementById('canvas');
// 	var ctx = canvas.getContext('2d');

// 	//canvas dimensions
// 	var W = window.innerWidth;
// 	var H = window.innerHeight;
// 	canvas.width = W;
// 	canvas.height = H;

// 	//snowflake particles
// 	var mp = 25; //max particles
// 	var particles = [];
// 	for (var i = 0; i < mp; i++) {
// 		particles.push({
// 			x: Math.random() * W, //x-coordinate
// 			y: Math.random() * H, //y-coordinate
// 			r: Math.random() * 4 + 1, //radius
// 			d: Math.random() * mp, //density
// 			color:
// 				'rgba(' +
// 				Math.floor(Math.random() * 255) +
// 				', ' +
// 				Math.floor(Math.random() * 255) +
// 				', ' +
// 				Math.floor(Math.random() * 255) +
// 				', 0.8)'
// 		});
// 	}

// 	//Lets draw the flakes
// 	function draw() {
// 		ctx.clearRect(0, 0, W, H);

// 		for (var i = 0; i < mp; i++) {
// 			var p = particles[i];
// 			ctx.beginPath();
// 			ctx.fillStyle = p.color;
// 			ctx.moveTo(p.x, p.y);
// 			ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
// 			ctx.fill();
// 		}

// 		update();
// 	}

// 	//Function to move the snowflakes
// 	//angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
// 	var angle = 0;

// 	function update() {
// 		angle += 0.01;
// 		for (var i = 0; i < mp; i++) {
// 			var p = particles[i];
// 			//Updating X and Y coordinates
// 			//We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
// 			//Every particle has its own density which can be used to make the downward movement different for each flake
// 			//Lets make it more random by adding in the radius
// 			p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
// 			p.x += Math.sin(angle) * 2;

// 			//Sending flakes back from the top when it exits
// 			//Lets make it a bit more organic and let flakes enter from the left and right also.
// 			if (p.x > W + 5 || p.x < -5 || p.y > H) {
// 				if (i % 3 > 0) {
// 					//66.67% of the flakes
// 					particles[i] = {
// 						x: Math.random() * W,
// 						y: -10,
// 						r: p.r,
// 						d: p.d,
// 						color: p.color
// 					};
// 				} else {
// 					//If the flake is exitting from the right
// 					if (Math.sin(angle) > 0) {
// 						//Enter from the left
// 						particles[i] = {
// 							x: -5,
// 							y: Math.random() * H,
// 							r: p.r,
// 							d: p.d,
// 							color: p.color
// 						};
// 					} else {
// 						//Enter from the right
// 						particles[i] = {
// 							x: W + 5,
// 							y: Math.random() * H,
// 							r: p.r,
// 							d: p.d,
// 							color: p.color
// 						};
// 					}
// 				}
// 			}
// 		}
// 	}

// 	//animation loop
// 	setInterval(draw, Math.floor(Math.random() * 10));
// };

(function() {
	window.requestAnimationFrame =
		window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;

	var canvas = document.querySelector('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var ctx = canvas.getContext('2d');
	ctx.globalCompositeOperation = 'source-over';
	var particles = [];
	var pIndex = 0;
	var x, y, frameId;

	function Dot(x, y, vx, vy, color) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.color = color;
		particles[pIndex] = this;
		this.id = pIndex;
		pIndex++;
		this.life = 0;
		this.maxlife = 600;
		this.degree = getRandom(0, 360); //開始角度をずらす
		this.size = Math.floor(getRandom(8, 10)); //紙吹雪のサイズに変化をつける
	}

	Dot.prototype.draw = function(x, y) {
		this.degree += 1;
		this.vx *= 0.99; //重力
		this.vy *= 0.999; //重力
		this.x += this.vx + Math.cos(this.degree * Math.PI / 180); //蛇行
		this.y += this.vy;
		this.width = this.size;
		this.height = Math.cos(this.degree * Math.PI / 45) * this.size; //高さを変化させて、回転させてるっぽくみせる
		//紙吹雪の描写
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(this.x + this.x / 2, this.y + this.y / 2);
		ctx.lineTo(this.x + this.x / 2 + this.width / 2, this.y + this.y / 2 + this.height);
		ctx.lineTo(this.x + this.x / 2 + this.width + this.width / 2, this.y + this.y / 2 + this.height);
		ctx.lineTo(this.x + this.x / 2 + this.width, this.y + this.y / 2);
		ctx.closePath();
		ctx.fill();
		this.life++;
		//lifeがなくなったら紙吹雪を削除
		if (this.life >= this.maxlife) {
			delete particles[this.id];
		}
	};
	//リサイズ処理
	window.addEventListener('resize', function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		x = canvas.width / 2;
		y = canvas.height / 2;
	});

	function loop() {
		//全画面に色をしく。透過率をあげると残像が強くなる
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		//紙吹雪の量の調節
		if (frameId % 3 == 0) {
			new Dot(
				canvas.width * Math.random() - canvas.width + canvas.width / 2 * Math.random(),
				-canvas.height / 2,
				getRandom(1, 3),
				getRandom(2, 4),
				'#ED1A3D'
			);
			new Dot(
				canvas.width * Math.random() + canvas.width - canvas.width * Math.random(),
				-canvas.height / 2,
				-1 * getRandom(1, 3),
				getRandom(2, 4),
				'#FFF'
			);
		}
		for (var i in particles) {
			particles[i].draw();
		}
		frameId = requestAnimationFrame(loop);
	}

	loop();

	function getRandom(min, max) {
		return Math.random() * (max - min) + min;
	}
})();
