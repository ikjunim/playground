import Matter from "matter-js";
import Glyph from "./Glyph";
import MatterInstance from "./MatterInstance";
import { isUpper } from "../Utility";
import { allowedGlyph, randomElement } from "../Utility";
import RelativeWidth from "../Constants/RelativeWidth";
import RelativeBoundingWidth from "../Constants/RelativeBoundingWidth";
import MatterCategory from "../Constants/MatterCategory";
import { Queue } from "@datastructures-js/queue";
import MatterColor from "../Constants/MatterColor";

//Size of the space in between adjacent characters. Percentage of 'a'
const inBetween = 0.3;

//Height of the character ascents in both directions. Percentage of 'a'.
//Moves the character height by a_height * charAscent.
const charAscent = 0.15;

//Height of capital letters. Percentage of 'a'
//Moves the character height by a_height * capsAscent.
const capsAscent = 0.18;

//Moves numbers up and down. Namely 7 and 9 because it needs adjustment.
const numberAdjustment = 0.15;

//The maximum number of characters that can be spawned.
const maximumCharacter = 200;

export class Option {
  text: string;
  size: number;
  x: number;
  y: number;
  relPosition: boolean;
  relSize: boolean;
  wrap: boolean;
  color: string[];
  category: number;
  mask: number;
  velocity: { x: number, y: number };

  constructor() {
    this.text = "";
    this.size = 0;
    this.x = 0;
    this.y = 0;
    this.relPosition = false;
    this.relSize = false;
    this.wrap = true;
    this.color = ["#000000"];
    this.category = MatterCategory.Character;
    this.mask = MatterCategory.Character;
    this.velocity = { x: 0, y: 0};
  }
}

export default class Foundry {
  instance: MatterInstance;
  parser: DOMParser;
  wrappingBodies: Matter.Body[];
  scalingBodies: Matter.Body[];
  allBodies: Queue<Matter.Body>;
  engine: Matter.Engine;
  container: HTMLElement;

  constructor(matterInstance: MatterInstance) {
    this.instance = matterInstance;
    this.engine = matterInstance.engine;
    this.container = matterInstance.container;

    this.parser = new window.DOMParser();
    this.wrappingBodies = [];
    this.scalingBodies = [];
    this.allBodies = new Queue<Matter.Body>();
  }

  width(option: any): number {
    option = { ...new Option(), ...option };

    if (option.relPosition) {
      option.x *= this.container.clientWidth;
      option.y *= this.container.clientHeight;
    }

    var width = option.size;
    if (option.relSize) width *= Math.min(this.container.clientWidth, this.container.clientHeight);
    var gap = inBetween * width;

    for (var i = 0, curX = 0; i < option.text.length; i++) {
      if (option.text[i] == " " || !allowedGlyph(option.text[i])) { curX += width; continue; }
      curX += RelativeWidth[option.text[i]] * width + gap;
    }
    return curX;
  }

  height(option: any): number {
    option = { ...new Option(), ...option };

    if (option.relPosition) {
      option.x *= this.container.clientWidth;
      option.y *= this.container.clientHeight;
    }

    var width = option.size;
    if (option.relSize) width *= Math.min(this.container.clientWidth, this.container.clientHeight);
    var height = width * Glyph.aRatio;

    return height;
  }

  print(option: Option): Matter.Body[] {
    option = { ...new Option(), ...option };

    if (option.relPosition) {
      option.x *= this.container.clientWidth;
      option.y *= this.container.clientHeight;
    }

    var width = option.size;
    if (option.relSize) width *= Math.min(this.container.clientWidth, this.container.clientHeight);
    var height = width * Glyph.aRatio;
    var gap = inBetween * width;
    var bodies: Matter.Body[] = [];
    
    for (var i = 0, curX = 0; i < option.text.length; i++) {
      if (option.text[i] == " " || !allowedGlyph(option.text[i])) { curX += width; continue; }
      bodies.push(this.glyph(option.text[i], option.x + curX, option.y, width, height, randomElement(option.color), option));
      curX += RelativeWidth[option.text[i]] * width + gap;
    }

    return bodies;
  }

  printf(str: string, x: number, y: number, size: number): Matter.Body[] {
    if (!allowedGlyph(str)) return [];
    
    const options = { ... new Option(),
      text: str,
      size: size,
      x: x,
      y: y,
      relPosition: false,
      relSize: false,
      color: MatterColor.Array(),
      velocity: {
        x: -this.instance.width()/512,
        y: -(Math.random() * 1 - 0.5)
      }
    }

    return this.print(options);
  }
  
  glyph(char: string, x: number, y: number, width: number, height: number, color: string, option: Option): Matter.Body {
    var body = Matter.Bodies.fromVertices(
      x, y, Glyph.get(char).vertices, {
        render: {
          fillStyle: color,
          strokeStyle: color,
          lineWidth: 1,
        },
        collisionFilter: {
          category: option.category,
          mask: option.mask,
        },
        restitution: 0.8,
        friction: 0.6,
        label: char,
      }
    );

    if (option.wrap) {
      body.plugin.wrap = {
        min: { x: 0, y: 0 },
        max: { x: this.container.clientWidth, y: this.container.clientHeight }
      };
      this.wrappingBodies.push(body);
    }

    var newWidth = RelativeBoundingWidth[char] * width;
    var scale = newWidth/(body.bounds.max.x - body.bounds.min.x);
    var verticalOffset = ((body.bounds.max.y - body.bounds.min.y) * scale * Glyph.get(char).aspectRatio - height)/2;

    if ("gjpqy".includes(char)) verticalOffset = -height * charAscent;
    else if ("fil".includes(char)) verticalOffset = height * charAscent;
    else if ("79".includes(char)) verticalOffset = height * numberAdjustment;
    else if (isUpper(char)) verticalOffset = height * capsAscent;

    Matter.Body.scale(body, scale, scale);
    Matter.Body.setPosition(body, {
      x: x + newWidth/2,
      y: y - verticalOffset,
    });

    Matter.Composite.add(this.engine.world, body);
    Matter.Body.setVelocity(body, option.velocity);

    this.allBodies.enqueue(body);

    if (this.allBodies.size() > maximumCharacter) {
      var oldBody = this.allBodies.dequeue();
      Matter.Composite.remove(this.engine.world, oldBody);
    }

    return body;
  }

  updateWrap() {
    this.wrappingBodies.forEach(body => {
      body.plugin.wrap = {
        min: { x: 0, y: 0 },
        max: { x: this.container.clientWidth, y: this.container.clientHeight }
      }
    });
  }

  //Assuming all letters are wrapping, which it will be
  setOpacity(opacity: number) {
    this.wrappingBodies.forEach(body => {
      body.parts.forEach(part => {
        part.render.opacity = opacity;
      });
    });
  }
}