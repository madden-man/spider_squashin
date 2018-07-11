'use strict';

import React, { Component } from 'react';
import {StyleSheet} from 'react-native';
import {
  ViroARScene,
  ViroText,
  ViroMaterials,
  ViroBox,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
  ViroARPlaneSelector,
  ViroNode,
  ViroAnimations,
} from 'react-viro';
var createReactClass = require('create-react-class');
var HelloWorldSceneAR = createReactClass({
  getInitialState() {
    return {
      text : "Initializing AR...",
      runAnimation: true
    };
  },

  render: function() {
    return (
      <ViroARScene onTrackingInitialized={()=>{this.setState({text : "Hello World!"})}}>
        <ViroText text={this.state.text} scale={[.1, .1, .1]} height={1} width={4} position={[0, .5, -1]} style={styles.helloWorldTextStyle} />

        <ViroAmbientLight color={"#aaaaaa"} />
        <ViroSpotLight innerAngle={5} outerAngle={90} direction={[0,-1,-.2]} position={[0, 3, 1]} color="#ffffff" castsShadow={true} />

        <Viro3DObject
          source={require('./res/emoji_smile/emoji_smile.vrx')}
          position={[0, 0, -1]}
          scale={[.2, .2, .2]}
          type="VRX"
          dragType="FixedDistance" onDrag={()=>{}}
        />

        <Viro3DObject
          source={require('./res/PB_Spider/spider.vrx')}
          position={[-1, 0, -1]}
          scale={[.001, .001, .001]}
          type="VRX"
          animation={{name: 'walk', run: true, loop: true}}
          dragType="FixedDistance" onDrag={()=>{}}
        />

      </ViroARScene>
    );
  },
});

ViroAnimations.registerAnimations({
  // p: {properties: {positionY: "+=0.3"}, duration:4000}
});

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 50,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

module.exports = HelloWorldSceneAR;
