'use strict';

import React, { Component } from 'react';
import {StyleSheet} from 'react-native';
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
} from 'react-viro';

class HelloWorldSceneAR extends Component {

  constructor(props) {
    super(props);

    this.state = {
      spiders: [
        {
          position: [0, 0, -1],
          nodeAnimation: {name: 'advance', run: true, loop: true},
          spiderAnimation: {name: 'walk', run: true, loop: true}
        }
      ],  
    };

    this.runGame();
  }
  
  killSpider = (index) => {
    const spiders = this.state.spiders;
    spiders[index].nodeAnimation = {};
    spiders[index].spiderAnimation = {name: 'die', run: true, loop: false, onFinish: () => this.makeSpiderShrink(index)};
    
    this.setState({
      spiders
    });
  };

  makeSpiderShrink(index) {
    const spiders = this.state.spiders;
    spiders[index].spiderAnimation = {name: 'shrinkSpider', run: true, loop: false, onFinish: () => this.onSpiderShrunk(index)};

    this.setState({
      spiders
    });
  };

  onSpiderShrunk(index) {
    var spiders = [...this.state.spiders];
    spiders.splice(index, 1);
    this.setState({ 
      spiders 
    });
  }

  async runGame() {
    setInterval(() => this.spawnSpider(), 5000);
  };

  spawnSpider() {
    const spiders = this.state.spiders;
    const newSpider = {
      position: this.randomPosition(),
      nodeAnimation: {name: 'advance', run: true, loop: true},
      spiderAnimation: {name: 'walk', run: true, loop: true}    
    };

    spiders.push(newSpider);

    this.setState({
      spiders
    });
  }

  randomPosition() {
    const randomX = (Math.random() * 4) - 2;
    const randomZ = (Math.random() * 4) - 2;

    return [randomX, 0, randomZ];
  }

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
    ))

    return (
      <ViroARScene onTrackingInitialized={()=>{console.log('hi')}}>
        <ViroAmbientLight color={"#aaaaaa"} />
        <ViroSpotLight innerAngle={5} outerAngle={90} direction={[0,-1,-.2]} position={[0, 3, 1]} color="#ffffff" castsShadow={true} />
        {spiders}
      </ViroARScene>
    );
  }
};

ViroAnimations.registerAnimations({
  advance: {properties: {positionZ: "+=0.3"}, duration:2000},
  shrinkSpider: {properties: {scaleX: 0.00001, scaleY: 0.00001, scaleZ: 0.00001}, duration: 2000},
});

var styles = StyleSheet.create({
});

module.exports = HelloWorldSceneAR;
