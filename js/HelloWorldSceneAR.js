'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
} from 'react-native';
import {
  ViroARScene,
  ViroMaterials,
  ViroBox,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
  ViroARPlaneSelector,
  ViroNode,
  ViroAnimations,
  ViroSound,
  ViroText,
} from 'react-viro';

class HelloWorldSceneAR extends Component {

  constructor(props) {
    super(props);

    this.state = {
      spiders: [
        {
          position: [0, -1.5, -1],
          nodeAnimation: {name: 'advanceFront', run: true, loop: true},
          spiderAnimation: {name: 'walk', run: true, loop: true}
        },
        {
          position: [2, -1.5, 2],
          nodeAnimation: {name: this.findDirection([2, 0, 2]), run: true, loop: true},
          spiderAnimation: {name: 'walk', run: true, loop: true}
        },
        {
          position: [-2, -1.5, 2],
          nodeAnimation: {name: this.findDirection([2, 0, -2]), run: true, loop: true},
          spiderAnimation: {name: 'walk', run: true, loop: true}
        },
        {
          position: [2, -1.5, -2],
          nodeAnimation: {name: this.findDirection([2, 0, -2]), run: true, loop: true},
          spiderAnimation: {name: 'walk', run: true, loop: true}
        },
        {
          position: [-2, -1.5, -2],
          nodeAnimation: {name: this.findDirection([-2, 0, -2]), run: true, loop: true},
          spiderAnimation: {name: 'walk', run: true, loop: true}
        },
      ],
      sounds: [
        {
          file: require('./res/HauntedHouse.mp3'),
          loop: true,
          onFinish: null,
        }
      ],
      score: 0,
    };

    this.runGame();
  }
  
  getState() {
    return this.state;
  }

  killSpider = (index) => {
    const spiders = this.state.spiders;
    spiders[index].nodeAnimation = {};
    spiders[index].spiderAnimation = {name: 'die', run: true, loop: false, onFinish: () => this.makeSpiderShrink(index)};
    
    this.setState({
      ...this.getState(),
      spiders
    });
  };

  makeSpiderShrink(index) {
    const spiders = this.state.spiders;
    spiders[index].spiderAnimation = {name: 'shrinkSpider', run: true, loop: false, onFinish: () => this.onSpiderShrunk(index)};

    const sounds = this.state.sounds;
    sounds.push({
      file: require('./res/PB_Spider/splat.mp3'),
      loop: false,
      onFinish: () => this.removeSound(sounds.length),
    })

    const score = this.state.score + 1;

    this.setState({
      ...this.getState(),
      spiders,
      sounds,
      score,
    });
  };

  onSpiderShrunk(index) {
    var spiders = [...this.state.spiders];
    spiders.splice(index, 1);

    this.setState({ 
      ...this.getState(),
      spiders,
    });
  };

  async runGame() {
    setInterval(() => this.spawnSpider(), 5000);
  };

  spawnSpider() {
    const position = this.randomPosition();

    const animationDirection = this.findDirection(position);

    const spiders = this.state.spiders;
    const newSpider = {
      position,
      nodeAnimation: {name: animationDirection, run: true, loop: true},
      spiderAnimation: {name: 'walk', run: true, loop: true}    
    };

    spiders.push(newSpider);

    this.setState({
      ...this.getState(),
      spiders,
    });
  };

  findDirection(position) {
    let x, y, z;
  //  [x, y, z] = position;
    x = position[0];
    y = position[1];
    z = position[2];
    if (x == 0 && z < 0) {
      return 'advanceFront';
    } else if (x >= 0 && z <= 0) {
      return 'advanceFrontRight';
    } else if (x <= 0 && z <= 0) {
      return 'advanceFrontLeft';
    } else if (x >= 0 && z >= 0) {
      return 'advanceBackRight';
    } else if (x <= 0 && z >= 0) {
      return 'advanceBackLeft';
    } else {
      return 'advanceFront';
    }
  };

  randomPosition() {
    const randomX = (Math.random() * 4) - 2;
    const randomZ = (Math.random() * 4) - 2;

    return [randomX, -1.5, randomZ];
  };

  removeSound(index) {
    var sounds = this.state.sounds;
    sounds.splice(index, 1);

    this.setState({
      ...this.getState(),
      sounds,
    });
  };

  render() {
    const spiders = this.state.spiders.map((spider, index) => (
      <ViroNode
        key={index}
        animation={spider.nodeAnimation}>
        <Viro3DObject
          source={require('./res/PB_Spider/spider.vrx')}
          position={spider.position}
          scale={[.001, .001, .001]}
          type="VRX"
          animation={spider.spiderAnimation}
          dragType="FixedDistance" onDrag={()=>{}}
          onClick={()=>{this.killSpider(index)}}
        />
      </ViroNode>
    ));

    const sounds = this.state.sounds.map((sound, index) => (
      <ViroSound key={index}
        paused={false}
        muted={false}
        source={sound.file}
        loop={sound.loop}
        volume={1.0}
        onFinish={sound.onFinish} />
    ));

    const score = this.state.score;

    return (
      <ViroARScene onTrackingInitialized={()=>{console.log('hi')}}>
        <ViroAmbientLight color={"#8b0000"} />
        <ViroSpotLight innerAngle={5} outerAngle={90} direction={[0,-1,-.2]} position={[0, 3, 1]} color="#ffffff" castsShadow={true} />
        {spiders}
        {sounds}
        <ViroText style={styles.score}
          text={`Score: ${score}`}
          textAlign="right"
          width={2} height={2}
          position={[0, 0, -2]} />
      </ViroARScene>
    );
  }
};

ViroAnimations.registerAnimations({
  orientFrontLeft: {properties: {rotateY: "-45"}},
  orientFrontRight: {properties: {rotateY: "45"}},
  orientBackRight: {properties: {rotateY: "-135"}},
  orientBackLeft: {properties: {rotateY: "135"}},

  moveFrontLeft: {properties: {positionX: "+=0.21", positionZ: "+=0.21"}, duration:2000},
  moveFrontRight: {properties: {positionX: "-=0.21", positionZ: "+=0.21"}, duration:2000},
  moveBackLeft: {properties: {positionX:"+=0.21", positionZ: "-=0.21"}, duration:2000},
  moveBackRight: {properties: {positionX: "-=0.21", positionZ: "-=0.21"}, duration:2000},

  advanceFrontLeft: [
    ["orientFrontLeft", "moveFrontLeft"]
  ],
  advanceFrontRight: [
    ["orientFrontRight", "moveFrontRight"]
  ],
  advanceBackRight: [
    ["orientBackRight", "moveBackRight"]
  ],
  advanceBackLeft: [
    ["orientBackLeft", "moveBackLeft"]
  ],

  advanceFront: {properties: {positionZ: "+=0.3"}, duration:2000},
  advanceLeft: {properties: {positionX: "+=0.3"}, duration:2000},
  advanceBack: {properties: {positionZ: "-=0.3"}, duration:2000},
  advanceRight: {properties: {positionX: "-=0.3"}, duration:2000},

  shrinkSpider: {properties: {scaleX: 0.00001, scaleY: 0.00001, scaleZ: 0.00001}, duration: 1000},
});

var styles = StyleSheet.create({
  scoreContainer :{
    backgroundColor: "white",
    textAlign: "right",
  },
  score : {
    color: "white",
  },
});

module.exports = HelloWorldSceneAR;
