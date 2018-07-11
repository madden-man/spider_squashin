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
  
// const defaultSpider = {
//     animation: {name: 'walk', run: true, loop: true}
//   }
  
state = {
  spiders: [
    {
      animation: {name: 'walk', run: true, loop: true}
    }
  ],  
}
  
  killSpider = (index) => {
    const spiders = this.state.spiders;
    spiders[index].animation = {name: 'die', run: true, loop: false}
    this.setState({
      spiders
    })
  }

  render() {
    const spiders = this.state.spiders.map((spider, index) => (
      <ViroNode
        key={index}
        animation={{name: 'advance', run: true, loop: true}}>
        <Viro3DObject
          source={require('./res/PB_Spider/spider.vrx')}
          position={[-1, 0, -1]}
          scale={[.001, .001, .001]}
          type="VRX"
          animation={spider.animation}
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
}

ViroAnimations.registerAnimations({
  advance: {properties: {positionZ: "+=0.3"}, duration:2000}
});

var styles = StyleSheet.create({
});

module.exports = HelloWorldSceneAR;
