 2const canvas=document.querySelector("canvas")
const ctx=canvas.getContext("2d")
const canvas_width=canvas.width=800
const canvas_height=canvas.height=600
window.addEventListener("load",function()
{
    const max=100
    let count=0
    let bullets=[]
    let enemyBullets=[]
    let gridArray=[]
    function Game()
    {
        this.background=new Background(this)
        this.player=new Player(this)
        this.grid=new Grid(this)
    }
    Game.prototype.draw=function(asset)
    {
        ctx.drawImage(asset.sprite,asset.x,asset.y,asset.width,asset.height)
    }
    Game.prototype.update=function()
    {
        this.player.update()
        bullets=bullets.filter((bullet)=>!bullet.delete)
        bullets.forEach((bullet)=>{
            bullet.update("player")
        })
        this.grid.update()
    }
    Game.prototype.drawImages=function(deltaTime)
    {
        this.background.draw()
        this.player.draw()
        bullets.forEach((bullet)=>{
            bullet.draw()
        })
        this.grid.enemyArray.forEach((enemy)=>{
            enemy.draw()   
            enemy.update()
        })
       
        if(count>max)
        {
            gridArray.push(new Grid(this))
            this.grid.enemyArray[Math.floor(Math.random() * this.grid.enemyArray.length)].shoot()
            count=0
        }
else{
    count+=deltaTime
}
        enemyBullets=enemyBullets.filter((bullet)=>!bullet.delete)
        enemyBullets.forEach((bullet)=>{
            
            bullet.draw("enemy")
            bullet.update('enemy')
        })
    }
    function Background(game)
    {
        this.game=game
        this.x=0
        this.y=0
        this.width=canvas_width
        this.height=canvas_height
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
    Player.prototype.shoot=function()
    {
this.bullet=new Bullet(this)
bullets.push(this.bullet)
    }
    function Bullet(ship)
    {
this.ship=ship
this.x=this.ship.x + (this.ship.width/2-10)
this.y=this.ship.y-20
this.enemyY=this.ship.y+20
this.speed=10

    }
Bullet.prototype.draw=function(type)
{
    if(type==="enemy")
    {
        this.width=20
this.height=20
        this.sprite=document.getElementById("enemyBullet")
        ctx.drawImage(this.sprite,this.x,this.enemyY,this.width,this.height)
    }
    else{
        this.width=25
this.height=25
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
    //that's why i love java method overloading ,used if statement to try to minic method overloading
if(type==="enemy")
{
    this.enemyY+=this.speed
    if(this.enemyY>=canvas_width)
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
this.width=30 * this.cols
}
Grid.prototype.update=function()
{
    if((this.x*30) + this.width>=canvas_width || this.x <0)
    {
        this.velocity.vx=-this.velocity.vx
        this.y+=this.velocity.vy
    }
    this.x+=this.velocity.vx
}
function Enemy(grid,position)
{
this.grid=grid
this.game=this.grid.game
this.width=30
this.height=30
this.position=position
this.x=this.grid.x + position.x
this.y=this.grid.y + position.y
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
    enemyBullets.push(new Bullet({
        sprite:this.sprite,
        x:this.x * this.width,
        y:this.y * this.height,
        width:this.width,
        height:this.height,
        delete:false
    }))
}
const game=new Game()
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
    game.player.shoot()
break
        }
    })
    let interval=0
    function animate(timeStamp)
    {
        let deltaTime=timeStamp-interval
        ctx.clearRect(0,0,canvas_width,canvas_height)
game.drawImages(deltaTime)      
game.update()
interval=timeStamp
        requestAnimationFrame(animate)
    }
    animate(0)
})

