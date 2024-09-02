import Matter from 'matter-js';
import MatterCategory from '../Constants/MatterCategory';

export default class MatterInstance {
  container: HTMLElement;
  engine: Matter.Engine;
  render: Matter.Render;
  runner: Matter.Runner;
  mouse: Matter.Mouse;
  mouseConstraint: Matter.MouseConstraint;
  drag: boolean = false;
  running: boolean = false;

  constructor(container : HTMLElement, filter?: {category: number, mask: number, fast?: boolean}) {
    this.container = container;
    this.engine = Matter.Engine.create({
      gravity: {x: 0, y: 0},
      timing: {
        timeScale: filter && filter.fast ? 3 : 1,
      }
    });

    this.render = Matter.Render.create({
      element: this.container,
      engine: this.engine,
      options: {
        width: this.container.clientWidth,
        height: this.container.clientHeight,
        background: 'transparent',
        wireframes: false,
        showAngleIndicator: false,
        showDebug: false,
      }
    });

    this.runner = Matter.Runner.create();
    this.mouse = Matter.Mouse.create(this.render.canvas);

    this.mouseConstraint = Matter.MouseConstraint.create(this.engine, {
      mouse: this.mouse,
      constraint: {
        stiffness: 0.1,
        damping: 0.1,
        render: {
          visible: false
        }
      },
      collisionFilter: {
        category: filter ? filter.category : MatterCategory.Default,
        mask: filter ? filter.mask : MatterCategory.Default,
      },
    });
    
    //@ts-ignore
    this.mouseConstraint.mouse.element.removeEventListener("mousewheel", this.mouseConstraint.mouse.mousewheel);
    //@ts-ignore
    this.mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", this.mouseConstraint.mouse.mousewheel);

    this.enableDragging();
    this.render.mouse = this.mouse;
  }

  run() {
    if (this.running) return;
    this.running = true;
    Matter.Render.run(this.render);
    Matter.Runner.run(this.runner, this.engine);
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    Matter.Render.stop(this.render);
    Matter.Runner.stop(this.runner);
  }

  clear() {
    Matter.World.clear(this.engine.world, false);
    Matter.Engine.clear(this.engine);
    this.render.canvas.remove();
  }

  resize() {
    this.render.bounds.max.x = this.container.clientWidth;
    this.render.bounds.max.y = this.container.clientHeight
    this.render.options.width = this.container.clientWidth;
    this.render.options.height = this.container.clientHeight;
    this.render.canvas.width = this.container.clientWidth;
    this.render.canvas.height = this.container.clientHeight;
    Matter.Render.setPixelRatio(this.render, window.devicePixelRatio);
  }

  width() {
    return this.render.canvas.width;
  }

  height() {
    return this.render.canvas.height;
  }

  enableDragging() {
    if (this.drag) return;
    Matter.Composite.add(this.engine.world, this.mouseConstraint);
    this.drag = true;
    this.container.style.pointerEvents = 'auto';
  }

  disableDragging() {
    if (!this.drag) return;
    Matter.Composite.remove(this.engine.world, this.mouseConstraint);
    this.drag = false;
    this.container.style.pointerEvents = 'none';
  }
}