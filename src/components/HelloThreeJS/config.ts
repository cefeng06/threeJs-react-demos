export enum EnumPlanetName {
    Sun,
    Mercury,
    Venus,
    Earth,
    Mars,
    Jupiter,
    Saturn,
    Uranus,
    Naptune,
    Moon
}

export type TypePlantData = {
    name: string,
    selfRadius: number,
    orbitRadius: number,
    rotateSpeed: number,
    revolveSpeed: number,
    img: any;
}

export const planetConfigs: { [key: string]: TypePlantData } = {
    'Sun': {
        name: 'Sun',
        selfRadius: 20,
        orbitRadius: 0,
        rotateSpeed: 0.001,
        revolveSpeed: 0,
        img: require('./static/sun.jpg')
    },
    'Mercury': {
        name: 'Mercury',
        selfRadius: 2,
        orbitRadius: 30,
        rotateSpeed: 0.05,
        revolveSpeed: 2.5,
        img: require('./static/mercury.jpg')
    },
    'Venus': {
        name: 'Venus',
        selfRadius: 4,
        orbitRadius: 50,
        rotateSpeed: 0.06,
        revolveSpeed: 2.3,
        img: require('./static/venus.jpg')
    },
    'Earth': {
        name: 'Earth',
        selfRadius: 5,
        orbitRadius: 75,
        rotateSpeed: 0.09,
        revolveSpeed: 2.1,
        img: require('./static/earth.jpg')
    },
    'Mars': {
        name: 'Mars',
        selfRadius: 4,
        orbitRadius: 90,
        rotateSpeed: 0.05,
        revolveSpeed: 3,
        img: require('./static/mars.png')
    },
    'Jupiter': {
        name: 'Jupiter',
        selfRadius: 12,
        orbitRadius: 120,
        rotateSpeed: 0.1,
        revolveSpeed: 1.5,
        img: require('./static/jupiter.jpg')
    },
    'Saturn': {
        name: 'Saturn',
        selfRadius: 11,
        orbitRadius: 150,
        rotateSpeed: 0.01,
        revolveSpeed: 1.2,
        img: require('./static/saturn.jpg')
    },
    'Uranus': {
        name: 'Uranus',
        selfRadius: 6,
        orbitRadius: 170,
        rotateSpeed: 0.05,
        revolveSpeed: 1.7,
        img: require('./static/uranus.jpg')
    },
    'Naptune': {
        name: 'Naptune',
        selfRadius: 5,
        orbitRadius: 190,
        rotateSpeed: 0.01,
        revolveSpeed: 3.2,
        img: require('./static/naptune.jpg')
    }
}
