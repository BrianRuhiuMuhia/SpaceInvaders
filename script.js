const canvas=document.querySelector("canvas")
const ctx=canvas.getContext("2d")
const canvas_width=canvas.width=600
const canvas_height=canvas.height=600
window.addEventListener("load",function()
{
    let bulletArray=[]
    const Game={
    draw:function()
    {
//must be inherited
   this.drawImage()
    },
    drawImage:function()
    {
ctx.drawImage(this.sprite,this.x,this.y,this.width,this.height)
    },
    update:function()
    {
//must be overidden
    }
}
class Grid{
    constructor()
    {
        this.x=0
        this.y=0
        this.velocity={vx:0.1,vy:1}
        this.enemyList=[]
        const rows=6
        const cols=6
        for(let i=0;i<rows;i++)
        {
            for(let j=0;j<cols;j++)
            {
           this.enemyList.push(new Enemy({x:j,y:i},this))
            }
        }
        this.width=40 * cols +200
       
    }
    update()
    {
        if(this.x + this.width>=canvas.width|| this.x<0)
        { 
            this.velocity.vx=-this.velocity.vx
            this.y+=this.velocity.vy
        }
        this.x+=this.velocity.vx
        console.log(this.x)
        console.log(this.x + this.width)
    }
}
class Enemy{
    constructor(position,grid)
    {
this.grid=grid
this.width=40
this.height=40
this.position=position
this.x=this.grid.x + this.position.x 
this.y=this.grid.y + this.position.y
this.sprite=document.getElementById("enemy")
    }
    draw()
    {
        ctx.drawImage(this.sprite,this.x*this.width,this.y*this.height,this.width,this.height)
    }
    update()
    {
        this.draw()
        this.x=this.grid.x + this.position.x
        this.y=this.grid.y + this.position.y
    }

}
const background={
    x:0,
    y:0,
    width:canvas_width,
    height:canvas_height,
    sprite:document.getElementById("background")
}
const player={
    width:50,
    height:50,
    y:canvas_height-(80),
    x:canvas_width/2-50,
    speed:10,
    sprite:this.document.getElementById("player"),
    moveLeft:function()
    {
this.x-=this.speed
    },
    moveRight:function()
    {
this.x+=this.speed
    },
    update:function()
    {
        if(this.x + this.width>=canvas_width)
        {
        this.x=canvas_width-this.width
        }
        if(this.x <= 0)
        {
        this.x=0
        }
    },
    shoot:function()
    {
        const bullet={
            x:player.x + player.width/2-10,
            y:player.y -30,
            width:20,
            height:20,
            delete:false,
            speed:5,
            sprite:document.getElementById("bullet"),
            update:function()
            {
                this.y-=this.speed
                if(this.y<=0)
                {
this.delete=true
bulletArray=bulletArray.filter((bullet)=>
{
    return !bullet.delete 
})
}
}
}
Object.setPrototypeOf(bullet,player)
bulletArray.push(bullet)
gameArray.push(...bulletArray)
    }
}
document.addEventListener("keydown",function(e)
{
switch(e.key)
{
case "ArrowLeft":
    player.moveLeft()
    break
case "ArrowRight":
    player.moveRight()
    break;
case "ArrowUp":
    player.shoot()
    break;
}
})
const gameArray=[background,player]
const grid=new Grid()
gameArray.forEach((obj)=>
{
Object.setPrototypeOf(obj,Game)
})
function animate()
{
ctx.clearRect(0,0,canvas_width,canvas_height)
gameArray.forEach((obj)=>{
        obj.draw()
        obj.update()
})
grid.update()
grid.enemyList.forEach((enemy)=>
{
    enemy.update()
})
    requestAnimationFrame(animate)
}
animate()
})
