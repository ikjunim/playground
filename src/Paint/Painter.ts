import { Application, Text, TextStyle } from "pixi.js";
import MatterTone from "../Constants/MatterTone";
import Image from "image-js";
import { nthSubstring, rgbToHex } from "../Utility";
import { Timer, animate, createTimer, stagger, utils } from "@juliangarnierorg/anime-beta";
import { lzw_encode, lzw_decode } from "../Utility";

const loadFrames = false;

const size = 40;
const pixelText = "athousandwordsisworthapicturebutahundredwordsandsomecodeisworthagif";
var scaleFrames: number[][] = [];
var colorFrames: string[][] = [];

const frameCount = 151;
const directory = "/pacmanFrames/";
const framePaths = Array.from({ length: frameCount }, (_, i) => `${directory}frame_${i.toString().padStart(3, '0')}.jpg`);

const minRow = 15;
const maxRow = 25;

const starting = minRow * size;
const ending = maxRow * size;

const textHighlights = [
  { pattern: 'a', occurance: 6 },
  { pattern: 'thousand', occurance: 3 },
  { pattern: 'words', occurance: 7 },
  { pattern: 'is', occurance: 8 },
  { pattern: 'worth', occurance: 10 },
  { pattern: 'a', occurance: 31 },
  { pattern: 'picture', occurance: 7 },
  { pattern: 'but', occurance: 8 },
  { pattern: 'a', occurance: 93 },
  { pattern: 'hundred', occurance: 17 },
  { pattern: 'words', occurance: 36 },
  { pattern: 'and', occurance: 37 },
  { pattern: 'some', occurance: 19 },
  { pattern: 'code', occurance: 20 },
  { pattern: 'is', occurance: 43 },
  { pattern: 'worth', occurance: 44 },
  { pattern: 'a', occurance: 135 },
  { pattern: 'gif', occurance: 23 },
]

export class Painter {
  container: HTMLElement;
  //@ts-ignore
  app: Application;
  pixels: Text[] = [];
  animatingPixels: Text[] = [];
  textPixels: Text[][] = [];
  currentFrame = 0;
  animationTimer: Timer;
  finishedInitial = false;

  constructor(container: HTMLElement) {
    this.animationTimer = createTimer({
      frameRate: 24,
      onUpdate: () => {
        this.animatingPixels.forEach((pixel, i) => {
          pixel.scale.set(scaleFrames[this.currentFrame][i]);
          pixel.tint = colorFrames[this.currentFrame][i];
        })
        this.currentFrame = (this.currentFrame + 1) % frameCount;
      },
      autoplay: false
    })

    this.container = container;
    (async () => {
      const app = new Application();

      this.app = app;

      await app.init({ resizeTo: container, backgroundAlpha: 0, resolution: window.devicePixelRatio });
      container.appendChild(app.canvas);

      const width = container.clientWidth;
      const gap = width/size;
      const yOffset = 0.5;
      const xOffset = 0.5;

      for(let i = 0; i < size * size; i++) {
        const pixel = new Text({
          text: pixelText.charAt(i % pixelText.length),
          style: new TextStyle({
            fontFamily: 'Azeret Mono',
            fontSize: 2.3*parseFloat(utils.get(container, 'font-size', 'px')),
            fill: 'white',
          }),
        });

        pixel.x = (i % size) * gap + gap*xOffset;
        pixel.y = Math.floor(i / size) * gap + gap*yOffset;

        pixel.anchor.set(0.5, 0.5);
        pixel.scale.set(0.5, 0.5);

        pixel.tint = MatterTone.Black;
        pixel.alpha = 0;

        this.pixels.push(pixel);

        app.stage.addChild(pixel);
      }

      if (loadFrames) {
        for(let i = 0; i < frameCount; i++) {
          scaleFrames.push([]);
          colorFrames.push([]);
          await Image.load(framePaths[i]).then(image => {
            const dim = Math.min(image.width, image.height);
            const cropped = image.crop({
              x: (image.width - dim) / 2,
              y: (image.height - dim) / 2,
              width: dim,
              height: dim
            })
            const resized = cropped.resize({ width: size, height: size });
            for(let j = starting; j < ending; j++) {
              const sum = 2*resized.data[j * 4] + resized.data[j * 4 + 1] + resized.data[j * 4 + 2];
              colorFrames[i].push(sum > 400 ? rgbToHex(resized.data[j * 4], resized.data[j * 4 + 1], resized.data[j * 4 + 2]) : '#4d4d4d');
              scaleFrames[i].push(sum > 400 ? 1.5 : 0.5);
            }
          })
        }
        console.log(lzw_encode(JSON.stringify(colorFrames)));
        console.log(lzw_encode(JSON.stringify(scaleFrames)));
      } else {
        await fetch('/LoadedFrames/ColorFrame.txt')
          .then(response => response.text())
          .then(text => colorFrames = JSON.parse(lzw_decode(text)));
        
        await fetch('/LoadedFrames/ScaleFrame.txt')
          .then(response => response.text())
          .then(text => scaleFrames = JSON.parse(lzw_decode(text)));
      }

      this.animatingPixels = this.pixels.slice(starting, ending);
      const maxOccurance = Math.floor((size*size)/pixelText.length);
      const repeatedPixelText = pixelText.repeat(maxOccurance);
      textHighlights.forEach(({ pattern, occurance }) => {
        const start = nthSubstring(repeatedPixelText, pattern, occurance);
        const pixels: Text[] = [];
        for(let i = start; i < start + pattern.length; i++) pixels.push(this.pixels[i]);
        this.textPixels.push(pixels);
      });
    })();
  }

  play() {
    this.animationTimer.play();
  }

  pause() {
    this.animationTimer.pause();
  }

  show() {
    setTimeout(() => {
      this.textPixels.forEach((textPixels, i) => {
        setTimeout(() => {
          textPixels.forEach(pixel => {
            pixel.scale.set(1.2, 1.2);
            pixel.tint = MatterTone.White;
            pixel.alpha = 1;
          });
          if (i === this.textPixels.length - 1) {
            animate(this.pixels, {
              tint: (_, i: number | undefined) => {
                if (i === undefined) return 0x4d4d4d;
                if (this.pixels[i].scale.x === 1.2) return {
                  from: MatterTone.White,
                  to: MatterTone.White,
                };
                if (i < starting || i >= ending) return {
                  from: MatterTone.Black,
                  to: colorFrames[this.currentFrame][0]
                }
                return {
                  from: MatterTone.Black,
                  to: colorFrames[this.currentFrame][i-starting]
                }
              },
              alpha: 1,
              duration: 150,
              delay: stagger(25, {
                start: 1000,
                grid: [size, size],
                from: size*size - size/2
              }),
              onBegin: () => {
                this.animatingPixels.forEach((pixel, i) => {
                  pixel.scale.set(scaleFrames[this.currentFrame][i]);
                })
              },
              onComplete: () => {
                setTimeout(() => {
                  this.play();
                  this.finishedInitial = true;
                }, 500);
              }
            })
          }
        }, i > 7 ? 550*i + 1000 : 550*i);
      })
    }, 1000);
  }
}

//0x4d4d4d;