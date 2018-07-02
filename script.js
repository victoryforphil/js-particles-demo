var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


setInterval(tick, 25);
var index = 0;
var particles = [];

start();

function start(){
    for(var i=0;i<200;i++){
        
        genParticle();
    }
}

function tick(){
    
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(var i=0;i<particles.length;i++){
        var _particle = particles[i];
        if(!_particle.dead){
            _particle.move();
            _particle.draw();
        }
    }
    ctx.font = '48px serif';
    ctx.fillText('Particles: ' + particles.length, 10, 50);

}

function genParticle(){
    var randomSize = getRandomArbitrary(3, 5)
    var maxSpeed = 2;

    var newParticle = {
        id: index,
        dead: false,
        position: {
            x: getRandomArbitrary(0, canvas.width),
            y: getRandomArbitrary(0, canvas.height)
        },
        velocity:{
            x: getRandomArbitrary(-maxSpeed,maxSpeed),
            y: getRandomArbitrary(-maxSpeed,maxSpeed)
        },
        size:{
            x:randomSize,
            y:randomSize
        },
        opacity:{
            max: 0.8,
            current: 0
        },
        move:function(){
           
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            if(this.position.x < 0 || this.position.x > canvas.width || this.position.y < 0 || this.position.y > canvas.height){
                this.dead = true;
                particles.splice(getParticleIndexByID(this.id), 1);
                genParticle();
            }
            
        },
        draw: function(){
            ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
            ctx.font = '12px serif';
            ctx.fillText('ID: ' + this.id, this.position.x,  this.position.y);

            /*
             var nearest = getNearestParticle(this);
            ctx.beginPath();
            ctx.moveTo(this.position.x, this.position.y);
            ctx.lineTo(nearest.position.x, nearest.position.y);
            ctx.stroke();
            */

            var _neighboards = getParticlesUnderDistance(this, 200, 3);
            for(var i=0;i<_neighboards.length;i++){
                var nearest = _neighboards[i];
                ctx.beginPath();
                ctx.moveTo(this.position.x, this.position.y);
                ctx.lineTo(nearest.position.x, nearest.position.y);
                ctx.strokeStyle=`rgba(0,0,0,${(nearest.distance / 200) * 0.5 - 0.05}`;
                ctx.stroke();
            }
            
        }
    }
    particles.push(newParticle);
    index++;
}


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


function getNearestParticle(particleA){
    var distances = [];

    for(var i=0;i<particles.length;i++){
        var _particleB = particles[i];
        if(_particleB.id == particleA.id){
            continue;
        }
        var _distance = (Math.abs(_particleB.position.x - particleA.position.x) + Math.abs(_particleB.position.y - particleA.position.y))
        distances.push({
            distance: _distance,
            particle:_particleB 
        });
    }

    distances.sort(function(a,b){
        if(a.distance < b.distance) return -1;
        if(a.distance > b.distance) return 1;
        return 0;
    })

    return distances[Object.keys(distances)[0]].particle;
}


function getParticlesUnderDistance(particleA, maxDistance, maxResults = 4){
    var found = [];

    for(var i=0;i<particles.length;i++){
        var _particleB = particles[i];
        if(_particleB.id == particleA.id){
            continue;
        }
       
        var _distance = (Math.abs(_particleB.position.x - particleA.position.x) + Math.abs(_particleB.position.y - particleA.position.y))
        _particleB.distance = _distance;
        if(_distance < maxDistance && found.length < maxResults){
            found.push(_particleB);
        }
    }

    return found;
}

function getParticleIndexByID(id){
    for(var i=0;i<particles.length;i++){
        if(particles[i].id==id){
            return i;
        }
    }
}