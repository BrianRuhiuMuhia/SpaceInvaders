const canvas=document.querySelector("canvas")
const ctx=canvas.getContext("2d")
const canvas_width=canvas.width=800
const canvas_height=canvas.height=600
window.addEventListener("load",function()
{
    let deltaTime=undefined
    const max=1000
    let score=0
    const laser=new Audio()
    laser.src="./assets/laser.wav"
    const explosion=new Audio()
    explosion.src="./assets/explosion.wav"
    function Game(ctx,canvasWidth,canvasHeight)
    {
        this.count=0
this.ctx=ctx
this.canvasWidth=canvasWidth
this.canvasHeight=canvasHeight
        this.bullets=[]
        this.enemyBullets=[]
        this.gridArray=[]
        this.background=new Background(this)
        this.player=new Player(this)
this.boomArray=[]
    }
    Game.prototype.draw=function(asset)
    {
        this.ctx.drawImage(asset.sprite,asset.x,asset.y,asset.width,asset.height)
    }
    Game.prototype.update=function()
    {
        this.player.update()
        this.bullets=this.bullets.filter((bullet)=>!bullet.delete)
        this.bullets.forEach((bullet)=>{
            bullet.update("player")
        })
    }
    Game.prototype.drawImages=function(deltaTime)
    {
        this.background.draw()
        this.player.draw()
        this.bullets.forEach((bullet)=>{
            bullet.draw()
        })
      
        if(this.count>max && this.gridArray.length>0)
        {
            const randomNumber=Math.floor(Math.random() * this.gridArray.length)
            this.gridArray[randomNumber].enemyArray[Math.floor(Math.random() * this.gridArray[randomNumber].enemyArray.length)].shoot()
            this.count=0
        }
else{
    this.count+=deltaTime
}
this.gridArray.forEach((grid)=>{
    if(grid.enemyArray.length < 1)
    grid.delete=true
})
this.gridArray=this.gridArray.filter((grid)=>!grid.delete)
this.gridArray.forEach((grid)=>
{
    grid.update()
    grid.enemyArray.forEach((enemy)=>{
        enemy.draw()   
        enemy.update()
    })
this.boomArray=this.boomArray.filter((boom)=>{
    return !boom.delete
})
   this.boomArray.forEach((boom)=>
   {
    boom.draw()
    boom.update()
   })
    grid.enemyArray.forEach((enemy)=>{
        this.bullets.forEach((bullet)=>
        {
            if((enemy.x*enemy.width) + enemy.width >= bullet.x && (enemy.x * enemy.width) <= bullet.x + bullet.width && (enemy.y * enemy.height) + enemy.height >= bullet.y && (enemy.y * enemy.height) <= bullet.y + bullet.height)
                {
            enemy.delete=true
            bullet.delete=true
            score+=1
            let x=enemy.x * enemy.width
            let y=enemy.y * enemy.height
            explosion.play()
            this.boomArray.push(new Boom(x,y))
                }
        })
    })
})
//fix this collision detection algorithm does not work
this.enemyBullets.forEach((bullet)=>{
    if(this.player.x + this.player.width >= bullet.x && this.player.x <= bullet.x + bullet.width && this.player.y + this.player.height >= bullet.y && this.player.y <= bullet.y + bullet.height)
    {
console.log("collision")
    }
})
//
        this.enemyBullets=this.enemyBullets.filter((bullet)=>!bullet.delete)
        this.enemyBullets.forEach((bullet)=>{
            
            bullet.draw("enemy")
            bullet.update('enemy')
        })
    }
    function Background(game)
    {
        this.game=game
        this.x=0
        this.y=0
        this.width=this.game.canvasWidth
        this.height=this.game.canvasHeight
        this.sprite=document.getElementById("background")
    }
    Background.prototype.draw=function()
    {
        this.game.draw({
            sprite:this.sprite,
            x:this.x,
            y:this.y,
            width:this.width,
            height:this.height
        })
    }
    function Player(game)
    {
        this.game=game
        this.width=50
        this.height=50
        this.x=canvas.width/2 -this.width
        this.y=canvas_height-(60)
        this.speed=20
        this.sprite=document.getElementById("player")
        this.bullet=undefined
        this.shootBullet=true
    }
    Player.prototype.draw=function()
    {
        this.game.draw({
            sprite:this.sprite,
            x:this.x,
            y:this.y,
            width:this.width,
            height:this.height
        })
    }
    Player.prototype.moveLeft=function()
    {
        this.x-=this.speed
    }
    Player.prototype.moveRight=function()
    {
        this.x+=this.speed
    }
    Player.prototype.update=function()
    {
        if(this.x + this.width>canvas_width)
        {
            this.x=canvas_width-this.width
        }
        if(this.x <0)
        {
            this.x=0
        }
    }
    Player.prototype.isUp=function()
    {
    this.shootBullet=true
    }
    Player.prototype.shoot=function()
    {
if(this.shootBullet)
{
     this.bullet=new Bullet(this)
game.bullets.push(this.bullet)
laser.play()
this.shootBullet=false

}
   
    }
    function Bullet(ship)
    {
this.ship=ship
this.x=this.ship.x + (this.ship.width/2-10)
this.y=this.ship.y-20
this.enemyY=this.ship.y+20
this.speed=10
this.delete=false
    }
Bullet.prototype.draw=function(type)
{
    if(type==="enemy")
    {
this.width=20
this.height=20
this.speed=5
        this.sprite=document.getElementById("enemyBullet")
        game.ctx.drawImage(this.sprite,this.x,this.enemyY,this.width,this.height)
    }
    else{
        this.width=20
this.height=20
        this.sprite=document.getElementById("bullet")
          this.ship.game.draw({
        sprite:this.sprite,
            x:this.x,
            y:this.y,
            width:this.width,
            height:this.height,
            delete:false
    })
    }
}
Bullet.prototype.update=function(type)
{
if(type==="enemy")
{
    this.enemyY+=this.speed
    if(this.enemyY>=game.canvasWidth)
    {
        this.delete=true
    }
}
else if(type==="player")
{
    this.y-=this.speed
    if(this.y<=0)
    {
        this.delete=true
    }
}
}
function Grid(game)
{
this.game=game
this.x=0
this.y=0
this.size=35
this.delete=false
this.cols=Math.floor(Math.random() * 6 +1)
this.rows=Math.floor(Math.random()*6 +1)
this.enemyArray=[]
this.velocity={vx:0.1,vy:2}
for(let i=0;i<this.rows;i++)
{
    for(let j=0;j<this.cols;j++)
    {
this.enemyArray.push(new Enemy(this,{x:j,y:i}))
    }
}
this.width=this.size * this.cols
this.height=this.size * this.rows
}
Grid.prototype.update=function()
{
    if((this.y *this.size) + this.height>=this.game.canvasHeight+50)
    {
        this.delete=true
    }
    if((this.x*this.size) + this.width>=this.game.canvasWidth || this.x <0)
    {
        this.velocity.vx=-this.velocity.vx
        this.y+=this.velocity.vy
    }
    this.x+=this.velocity.vx
    this.enemyArray=this.enemyArray.filter((enemy)=>!enemy.delete)
}
function Enemy(grid,position)
{
this.grid=grid
this.game=this.grid.game
this.width=grid.size
this.height=grid.size
this.position=position
this.x=this.grid.x + position.x
this.y=this.grid.y + position.y
this.delete=false
this.sprite=document.getElementById("enemy")
}
Enemy.prototype.draw=function()
{
    ctx.drawImage(this.sprite,this.x*this.width,this.y*this.height,this.width,this.height)
}
Enemy.prototype.update=function()
{
    this.x=this.grid.x + this.position.x
    this.y=this.grid.y + this.position.y
}
Enemy.prototype.shoot=function()
{
    this.grid.game.enemyBullets.push(new Bullet({
        sprite:this.sprite,
        x:this.x * this.width,
        y:this.y * this.height,
        width:this.width,
        height:this.height,
        delete:false
    }))
}
function Boom(x,y) {
      this.image = document.getElementById("cloud_sprite");
      this.spriteWidth = 92;
      this.spriteHeight = 181;
      this.width = 30;
      this.height = 30;
      this.x = x;
      this.y = y;
      this.delete = false;
      this.maxFrames = 5;
      this.frames = 0;
      this.max = 100;
      this.interval = 0;
      this.delete = false;
    }
Boom.prototype.draw=function() {
      ctx.drawImage(
        this.image,
        this.frames * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height,
      );
    }
Boom.prototype.update=function() {
      if (this.interval > deltaTime) {
        if (this.frames < this.maxFrames) {
          this.frames++;
        } else {
          this.delete = true;
          
        }
        this.interval = 0;
      } else this.interval += 2;
    }
const game=new Game(ctx,canvas_width,canvas_height)
function displayText() {
    ctx.fillStyle = "white";
    ctx.fillText(`Score:${score}`, 0, 55);
    ctx.font = "30px cursive";

    // if (gameOver) {
    //   ctx.textAlign = "center";
    //   ctx.fillStyle = "black";
    //   ctx.fillText(`Game Over`, canvas_width / 2, canvas_height / 2);
    //   ctx.font = "50px cursive";
    //   ctx.textAlign = "center";
    //   ctx.fillStyle = "black";
    //   ctx.font = "50px cursive";
    //   ctx.fillText(
    //     `Press Enter To Restart`,
    //     canvas_width / 2,
    //     canvas_height / 2 - 50,
    //   );
    //   ctx.fillStyle = "white";
    //   ctx.font = "50px cursive";
    //   ctx.fillText(
    //     `Press Enter To Restart`,
    //     canvas_width / 2,
    //     canvas_height / 2 - 55,
    //   );
    // }
  }
setInterval(function()
{
    if(game.gridArray.length<4)
    game.gridArray.push(new Grid(game))
},2000)
    document.addEventListener("keydown",function(event)
    {
        switch(event.key)
        {
case "ArrowLeft":
    game.player.moveLeft()
    break
case "ArrowRight":
    game.player.moveRight()
    break
case "ArrowUp":
    game.player.shoot(event.key)
break
        }
    })
    document.addEventListener('keyup',function(event)
    {
        if(event.key==="ArrowUp")
        {
            game.player.isUp()
        }
    })
    let interval=0
    function animate(timeStamp)
    {
        deltaTime=timeStamp-interval
        ctx.clearRect(0,0,canvas_width,canvas_height)
game.drawImages(deltaTime)      
game.update()
displayText()
interval=timeStamp
        requestAnimationFrame(animate)
    }
    animate(0)
})
//when finished,refactor your code,make it more dry//lots of code duplication 
//sprite animation for player bullet hitting the enemy
//game over code
//enemy hitting the player
//use modules => it too late can't change
//add sound effects
//code duplication using filter,make a function
//similar methods should be grouped together
//login for each player