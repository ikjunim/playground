import MatterInstance from "./MatterInstance";
import Matter from "matter-js";
import MatterCategory from "../Constants/MatterCategory";
import MatterColor from "../Constants/MatterColor";

const wallThickness = 3000;
const wallLength = 10000;

const vary = 0.1;
const ballonRadius = 0.4;
const balloonUp = 0.171;
const brickDown = 0.515;
const brickMass = 14285, balloonMass = 200;
const stringStiffness = 0.04;

const bounceCutOff = 4;
const bounceCount = 5;
const bounceForce = 30;

const stringExtend = (n: number) => {
  return Math.floor(
    (-1 + Math.sqrt(1 + 8*n))/2
  ) + Math.random();
}

export default class Party {
  instance: MatterInstance;
  engine: Matter.Engine;
  container: HTMLElement;
  bricks: { [key: number]: Brick } = {};
  walls: Matter.Body[] = []; //wall[0] = spike; wall[1] = right; wall[2] = left; wall[3] = trampoline; wall[4] = top;
  spikeId: number = -1;
  spikeElement: HTMLDivElement;
  balloons: { [key: number]: Balloon } = {};
  trampolineId: number = -1;
  
  constructor(matterInstance: MatterInstance, spikeElement: HTMLDivElement) {
    this.instance = matterInstance;
    this.engine = matterInstance.engine;
    this.container = matterInstance.container;
    this.spikeElement = spikeElement;
  }

  spawnWalls() {
    var options = {
      isStatic: true,
      render: {
        visible: false,
      },
      collisionFilter: {
        category: MatterCategory.Default,
        mask: MatterCategory.Default,
      },
    };
 
    //top (spike)
    this.walls.push(Matter.Bodies.rectangle(
      this.container.clientWidth/2, -wallThickness/2,
      wallLength, wallThickness + this.spikeElement.offsetHeight*2,
      {
        isStatic: true,
        isSensor: true,
        render: {
          visible: false,
        },
        collisionFilter: {
          category: MatterCategory.Balloon,
          mask: MatterCategory.Balloon,
        }
      }
    ));
    this.spikeId = this.walls[0].id;

    //right
    this.walls.push(Matter.Bodies.rectangle(this.container.clientWidth + wallThickness/2, this.container.clientHeight/2, wallThickness, wallLength, options));
    //left
    this.walls.push(Matter.Bodies.rectangle(-wallThickness/2, this.container.clientHeight/2, wallThickness, wallLength, options));

    //bottom (trampoline)
    this.walls.push(Matter.Bodies.rectangle(
      this.container.clientWidth/2, this.container.clientHeight + wallThickness/2, 
      wallLength, wallThickness,
      {
        isStatic: true,
        isSensor: true,
        render: {
          visible: false,
        },
        collisionFilter: {
          category: MatterCategory.Default,
          mask: MatterCategory.Default,
        }
      }
    ));
    this.trampolineId = this.walls[3].id;

    //top
    this.walls.push(Matter.Bodies.rectangle(
      this.container.clientWidth/2, -wallThickness/2, 
      wallLength, wallThickness, options
    ))

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
      x: -wallThickness/2,
      y: this.container.clientHeight/2,
    })

    Matter.Body.setPosition(this.walls[3], {
      x: this.container.clientWidth/2,
      y: this.container.clientHeight + wallThickness/2,
    });

    Matter.Body.setPosition(this.walls[4], {
      x: this.container.clientWidth/2,
      y: -wallThickness/2,
    });
  }

  spawnBrick(box: HTMLDivElement): Brick {
    const brick = new Brick(box);
    this.bricks[brick.body.id] = brick;
    Matter.World.add(this.engine.world, brick.body);
    return brick;
  }

  despawnBrick(key: number) {
    const brick = this.bricks[key];
    brick.balloons.forEach(balloon => this.despawnBalloon(balloon));
    Matter.Composite.remove(this.engine.world, brick.body);
    delete this.bricks[key];
  }  

  spawnBalloon(brick: Brick, count: number) {
    const color = MatterColor.RandomArray(count);
    for (let i = 0; i < count; i++) {
      const balloon = new Balloon(brick, color[i], stringExtend(brick.balloons.size));
      brick.balloons.add(balloon.body.id);
      Matter.World.add(this.engine.world, balloon.constraint);
      Matter.World.add(this.engine.world, balloon.body);
      this.balloons[balloon.body.id] = balloon;
    }
  }

  despawnBalloon(key: number) {
    const balloon = this.balloons[key];
    balloon.brick.balloons.delete(balloon.body.id);
    Matter.Composite.remove(this.engine.world, balloon.constraint);
    Matter.Composite.remove(this.engine.world, balloon.body);
    delete this.balloons[key];
  }

  bounceBrick(key: number) {
    const brick = this.bricks[key];
    if (brick!.balloons.size >= bounceCutOff) return;
    Matter.Body.applyForce(brick!.body, brick!.body.position, { x: 0, y: bounceForce });
    this.spawnBalloon(brick!, bounceCount);
  }

  resize() {
    this.repositionWalls();
    Object.entries(this.bricks).forEach(([_, brick]) => brick.resize());
    Object.entries(this.balloons).forEach(([_, balloon]) => balloon.resize());
  }
}

export class Brick {
  body: Matter.Body;
  box: HTMLDivElement;
  width: number;
  height: number;
  balloons: Set<number> = new Set();
  charCount = 0;

  constructor(box: HTMLDivElement) {
    this.box = box;

    const rect = box.getBoundingClientRect();

    this.width = this.box.offsetWidth;
    this.height = this.box.offsetHeight;

    this.charCount = box.innerText.split('').reduce((acc, char) => acc + (/\s/.test(char) ? 0 : 1), 0);
    this.body = Matter.Bodies.rectangle(
      rect.x + this.width/2, rect.y + this.height/2, this.width, this.height,
      {
        render: {
          visible: false,
        },
        collisionFilter: {
          category: MatterCategory.Default,
          mask: MatterCategory.Default,
        },
      }
    );

    Matter.Body.setMass(this.body, brickMass * Math.log1p(this.charCount));
  }

  down(timestamp: number) {
    Matter.Body.applyForce(this.body, this.body.position, { x: 0, y: brickDown *(1 + vary*Math.sin(timestamp/4000)) });
  }

  resize() {
    const newWidth = this.box.offsetWidth;
    const newHeight = this.box.offsetHeight;
    Matter.Body.scale(this.body, newWidth / this.width, newHeight / this.height);
    this.width = newWidth;
    this.height = newHeight;
    Matter.Body.setMass(this.body, brickMass * Math.log1p(this.charCount));
  }
}

export class Balloon {
  body: Matter.Body;
  constraint: Matter.Constraint;
  brick: Brick;
  radius: number;
  stringExtension: number;
  anchor: { x: number, y: number };

  constructor(brick: Brick, color: string, stringExtension: number) {
    this.brick = brick;

    this.radius = brick.height * ballonRadius;
    this.stringExtension = stringExtension;

    this.body = Matter.Bodies.circle(
      brick.body.position.x + Math.random() * 2 - 1, brick.body.position.y - brick.height - this.radius * 2 * this.stringExtension,
      brick.height * ballonRadius,
      {
        render: {
          fillStyle: color,
          strokeStyle: color,
        },
        collisionFilter: {
          category: MatterCategory.Balloon,
          mask: MatterCategory.Balloon,
        },
      }
    )
    Matter.Body.setMass(this.body, balloonMass);
    this.anchor = { x: Math.random() - 0.5, y: 0 };

    this.constraint = Matter.Constraint.create({
      bodyA: brick.body,
      // pointA: scaleVector(rotateVector(this.anchor, this.brick.body.angle), this.brick.width * 0.4),
      bodyB: this.body,
      pointB: { x: 0, y: this.radius },
      stiffness: stringStiffness,
      damping: 1,
      length: brick.height + this.radius * 2 * this.stringExtension,
      render: {
        lineWidth: 1,
        type: 'line',
        strokeStyle: color,
      }
    });
  }

  up() {
    Matter.Body.applyForce(this.body, this.body.position, { x: 0, y: -balloonUp });
  }

  resize() {
    Matter.Body.scale(this.body, this.brick.height * ballonRadius / this.radius, this.brick.height * ballonRadius / this.radius);
    this.radius = this.brick.height * ballonRadius;
    Matter.Body.setMass(this.body, balloonMass);
    this.constraint.length = this.brick.height + this.radius * 2 * this.stringExtension;
    // this.constraint.pointA = scaleVector(rotateVector(this.anchor, this.brick.body.angle), this.brick.width * 0.4);
    this.constraint.pointB = { x: 0, y: this.radius };
  }
}