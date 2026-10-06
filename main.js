var start = document.getElementById('start');
var gameWindow = document.querySelector('.game_window');
var BLOCK = 20;
var FPS = 100;

function get_random(max) {
    return Math.floor(Math.random() * max);
};

function draw_rect(snake, ctx, food, score) {
    ctx.clearRect(0, 0, 720, 480);
    for (let i = 0; i < snake.length - 1; i++){
        let x = snake[i][0]
        let y = snake[i][1]
        ctx.fillRect(x, y, BLOCK, BLOCK);
    };
    ctx.fillRect(food[0], food[1], BLOCK, BLOCK);
    ctx.font = '24px arial'
    ctx.fillText('Score: '+ score, 25, 25)
};

function game_step(head_direction, snake, food, score) {
    let head_x = snake[0][0]
    let head_y = snake[0][1]
    
    if (head_direction == 'DOWN'){
          head_y += BLOCK;
    };
    if (head_direction == 'UP'){
          head_y -= BLOCK;
    };
    if (head_direction == 'RIGHT'){
          head_x += BLOCK;
    };
    if (head_direction == 'LEFT'){
          head_x -= BLOCK;
    };
    
    var new_head = [head_x, head_y];
    snake.unshift(new_head);
    
    if (food[0] == head_x && food[1] == head_y){
        score += 1;
        food = [get_random(720/BLOCK)*BLOCK, get_random(480/BLOCK)*BLOCK];
        return [snake, food, score];  
    };
    
    snake.pop()
    return [snake, food, score];
};

function check_crash(snake){
    var head_x = snake[0][0];
    var head_y = snake[0][1];
    if (head_x >= 720 || head_x < 0 || head_y >= 480 || head_y < 0){
        return true;
    };
    for(let i = 1; i < snake.length; i++){
        if (snake[i][0] == head_x && snake[i][1] == head_y){
            return true;
        };
    };
    return false;      
};

function game_start() {
    start.classList.add('display-none');

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = 720;
    canvas.height = 480;
    canvas.classList.add('game_canvas');
    
    gameWindow.appendChild(canvas);
    
    
    let snake = [[100, 100], [100+BLOCK, 100], [100+2*BLOCK, 100], [100+2*BLOCK, 100+BLOCK], [100+3*BLOCK, 100+BLOCK]];
    let head_direction = 'DOWN';
    
    let food = [];
    food.push(get_random(720/BLOCK)*BLOCK, get_random(480/BLOCK)*BLOCK);
    
    let score = 0;
    console.log(score)
    
    document.addEventListener('keydown', function(event){
        const code = event.code;
    
        if (code === 'KeyS' && head_direction !== 'UP') {
            head_direction = 'DOWN';
        }
        if (code === 'KeyW' && head_direction !== 'DOWN') {
            head_direction = 'UP';
        }
        if (code === 'KeyD' && head_direction !== 'LEFT') {
            head_direction = 'RIGHT';
        }
        if (code === 'KeyA' && head_direction !== 'RIGHT') {
            head_direction = 'LEFT';
        }
    });
    
    ctx.fillStyle = 'black';
    draw_rect(snake, ctx, food, score);
    
    let interval = setInterval(function(){
        [snake, food, score] = game_step(head_direction, snake, food, score);
        gameover = check_crash(snake);
        if (gameover){
            clearInterval(interval);

        canvas.classList.add('fade-out');
        canvas.offsetHeight;

        setTimeout(() => {
            canvas.remove();

            let lost = document.createElement('h1');
            lost.classList.add('lost', 'fade-in-text');
            lost.textContent = 'You lost';
            gameWindow.appendChild(lost);

            setTimeout(() => {
                lost.classList.remove('fade-in-text')
                lost.classList.add('fade-out')
                
                setTimeout(() => {
                    lost.remove()
                    start.classList.add('fade-in-text')
                    start.classList.remove('display-none');
                }, 500) 
            }, 1500);
        }, 1000);
        };
        
        draw_rect(snake, ctx, food, score);
        
        }, FPS);
    };

start.addEventListener('click', game_start);