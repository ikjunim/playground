import Matter from "matter-js";
import MatterInstance from "./MatterInstance";
import MatterCategory from "../Constants/MatterCategory";
import MatterColor from "../Constants/MatterColor";

const particleCount = [40, 50];
const particleSize = 0.006;

const wallThickness = 300;
const wallLength = 10000;

const repulsionRange = 300;
const repulsionForce = 2;
const mouseForce = 5;
const repulsionSqrRange = repulsionRange * repulsionRange;

export default class Cloud {
  instance: MatterInstance;
  engine: Matter.Engine;
  container: HTMLElement;
  particles: Matter.Body[];
  walls: Matter.Body[];
  adjacentForce: boolean;
  mouseForce: boolean;

  constructor(matterInstance: MatterInstance) {
    this.instance = matterInstance;
    this.engine = matterInstance.engine;
    this.container = matterInstance.container;

    this.particles = [];
    this.walls = [];

    this.adjacentForce = true;
    this.mouseForce = true;
  }

  spawnParticles(size: number) {
    var options = {
      collisionFilter: {
        category: MatterCategory.Particle,
        mask: MatterCategory.Cloud,
      },
      render: {
        visible: true,
        lineWidth: 1,
        fillStyle: '#ffffff',
        strokeStyle: '#ffffff',
      },
      restitution: 0.8,
      friction: 0.8,
    };

    var count = Math.floor(Math.random() * (particleCount[1] - particleCount[0]) + particleCount[0]);
    for (let i = 0; i < count; i++) {
      var pickedColor = MatterColor.Random();
      options.render.fillStyle = pickedColor;
      options.render.strokeStyle = pickedColor;
      switch(Math.floor(Math.random() * 4 + 1)) {
        case 1:
          this.particles.push(Matter.Bodies.circle(0, 0, size, options));
          break;
        case 2:
          this.particles.push(Matter.Bodies.polygon(0, 0, 3, size * Math.sqrt(3), options));
          break;
        case 3:
          this.particles.push(Matter.Bodies.rectangle(0, 0, size * Math.SQRT2, size * Math.SQRT2, options));
          break;
        case 4:
        case 5:
          this.particles.push(Matter.Bodies.polygon(0, 0, 5, size * 2 * Math.sin(Math.PI / 5), options));
          break;
      }
    }
    Matter.Composite.add(this.engine.world, this.particles);
  }

  explodeAtCenter() {
    this.spawnParticles(particleSize * Math.min(this.instance.width(), this.instance.height()))
    this.setPosition(this.instance.width()/2, this.instance.height()/2);
  }

  applyForce(x: number, y: number) {
    this.particles.forEach(p1 => {
      var netForce = Matter.Vector.create(0, 0);

      if (this.adjacentForce) {
        this.particles.forEach(p2 => {
          if (p1 == p2) return;
  
          var diff = Matter.Vector.sub(p1.position, p2.position);
          var sqrMag = Matter.Vector.magnitudeSquared(diff);
          if (sqrMag < repulsionSqrRange) {
            netForce = Matter.Vector.add(netForce, Matter.Vector.mult(Matter.Vector.normalise(diff),
            p1.mass * p2.mass * repulsionForce/sqrMag));
          }
        });
      }

      if (this.mouseForce) {
        var diff = Matter.Vector.sub(p1.position, Matter.Vector.create(x, y));
        var sqrMag = Matter.Vector.magnitudeSquared(diff);
        if (sqrMag < repulsionSqrRange) {
          netForce = Matter.Vector.add(netForce, Matter.Vector.mult(Matter.Vector.normalise(diff),
          p1.mass * mouseForce/sqrMag));
        }
      }

      Matter.Body.applyForce(p1, p1.position, netForce);
    });
  }

  setPosition(x: number, y: number) {
    var radius = 40;
    this.particles.forEach(particle => {
      Matter.Body.setPosition(particle, Matter.Vector.create(x + (Math.random() * 2 * radius - radius), y + (Math.random() * radius - radius)));
    });
  }

  spawnWalls() {
    var options = {
      isStatic: true,
      render: {
        visible: false,
      },
      collisionFilter: {
        category: MatterCategory.Cloud,
        mask: MatterCategory.Particle,
      },
    };

    this.walls.push(Matter.Bodies.rectangle(this.container.clientWidth/2, -wallThickness/2, wallLength, wallThickness, options));
    this.walls.push(Matter.Bodies.rectangle(this.container.clientWidth + wallThickness/2, this.container.clientHeight/2, wallThickness, wallLength, options));
    this.walls.push(Matter.Bodies.rectangle(this.container.clientWidth/2, this.container.clientHeight + wallThickness/2, wallLength, wallThickness, options));
    this.walls.push(Matter.Bodies.rectangle(-wallThickness/2, this.container.clientHeight/2, wallThickness, wallLength, options));

    Matter.Composite.add(this.engine.world, this.walls);
  }

  repositionWalls() {
    Matter.Body.setPosition(this.walls[0], {
      x: this.container.clientWidth/2, 
      y: -wallThickness/2,
    });

    Matter.Body.setPosition(this.walls[1], {
      x: this.container.clientWidth + wallThickness/2,
      y: this.container.clientHeight/2,
    });

    Matter.Body.setPosition(this.walls[2], {
      x: this.container.clientWidth/2,
      y: this.container.clientHeight + wallThickness/2,
    });

    Matter.Body.setPosition(this.walls[3], {
      x: -wallThickness/2,
      y: this.container.clientHeight/2,
    })
  }
}