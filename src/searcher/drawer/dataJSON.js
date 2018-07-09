import React from 'react';
import d3 from 'd3';

d3.json("./bullets.json", function(error, data) {
  if (error) throw error;
