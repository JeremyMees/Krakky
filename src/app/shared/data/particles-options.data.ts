import { IOptions, RecursivePartial } from 'tsparticles';

export const PARTICLES: RecursivePartial<IOptions> = {
  fpsLimit: 60,
  particles: {
    number: {
      value: 0,
    },
    color: {
      value: ['#333333', '#0d89ec', '#fbc02d'],
    },
    shape: {
      type: ['circle', 'square', 'polygon'],
      options: {
        polygon: {
          sides: 6,
        },
      },
    },
    opacity: {
      value: 1,
      animation: {
        enable: true,
        minimumValue: 0,
        speed: 2,
        startValue: 'max',
        destroy: 'min',
      },
    },
    size: {
      value: 7,
      random: {
        enable: true,
        minimumValue: 3,
      },
    },
    links: {
      enable: false,
    },
    life: {
      duration: {
        sync: true,
        value: 5,
      },
      count: 1,
    },
    move: {
      enable: true,
      gravity: {
        enable: true,
        acceleration: 20,
      },
      speed: 80,
      decay: 0.1,
      direction: 'none',
      random: false,
      straight: false,
      outModes: {
        default: 'destroy',
        top: 'none',
      },
    },
    rotate: {
      value: {
        min: 0,
        max: 360,
      },
      direction: 'random',
      animation: {
        enable: true,
        speed: 60,
      },
    },
    tilt: {
      direction: 'random',
      enable: true,
      value: {
        min: 0,
        max: 360,
      },
      animation: {
        enable: true,
        speed: 60,
      },
    },
    roll: {
      darken: {
        enable: true,
        value: 25,
      },
      enable: true,
      speed: {
        min: 15,
        max: 25,
      },
    },
    wobble: {
      distance: 30,
      enable: true,
      speed: {
        min: -15,
        max: 15,
      },
    },
  },
  interactivity: {
    detectsOn: 'canvas',
    events: {
      resize: true,
    },
  },
  detectRetina: true,
  emitters: [
    {
      direction: 'top-right',
      rate: {
        delay: 0.1,
        quantity: 5,
      },
      position: {
        x: 60,
        y: 50,
      },
      size: {
        width: 0,
        height: 0,
      },
      particles: {
        move: {
          angle: {
            offset: -15,
            value: 60,
          },
        },
      },
    },
    {
      direction: 'top-left',
      rate: {
        delay: 0.1,
        quantity: 5,
      },
      position: {
        x: 60,
        y: 50,
      },
      size: {
        width: 0,
        height: 0,
      },
      particles: {
        move: {
          angle: {
            offset: 15,
            value: 60,
          },
        },
      },
    },
  ],
};
