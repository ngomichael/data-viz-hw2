'use strict';

(function() {
  let data = ''; // keep data in global scope
  let svgContainer = ''; // keep SVG reference in global scope

  // load data and make scatter plot after window loads
  window.onload = function() {
    svgContainer = d3
      .select('#histogram')
      .append('svg')
      .attr('width', 500)
      .attr('height', 500);
    // d3.csv is basically fetch but it can be be passed a csv file as a parameter
    d3.csv('../data/Admission_Predict.csv').then(csvData =>
      makeScatterPlot(csvData)
    );
  };

  // make scatter plot with trend line
  function makeScatterPlot(csvData) {
    data = csvData;

    // // get an array of toefl scores and an array of chance of admit
    let toeflScores = data.map(row => parseInt(row['TOEFL Score']));
    // let admissionRates = data.map(row => parseFloat(row['Admit']));

    let axesLimits = findMinMax(toeflScores);

    // console.log(axesLimits.toeflMin);
    // console.log(axesLimits.toeflMax);

    // // draw axes with ticks and return mapping and scaling functions
    // let mapFunctions = drawTicks(axesLimits);

    // // plot the data using the mapping and scaling functions
    // plotData(mapFunctions);
  }

  // plot all the data points on the SVG
  function plotData(map) {
    let xMap = map.x;
    let yMap = map.y;

    // append data to SVG and plot as points
    // svgContainer
    //   .selectAll('.dot')
    //   .data(data)
    //   .enter()
    //   .append('circle')
    //   .attr('cx', xMap)
    //   .attr('cy', yMap)
    //   .attr('r', 3)
    //   .attr('fill', '#4286f4');

    svgContainer
      .selectAll('.rec')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', dataPoint => xMap(dataPoint) - 5)
      .attr('y', yMap)
      .attr('width', 10)
      .attr('height', dataPoint => 450 - yMap(dataPoint))
      .attr('fill', '#4286f4');

    // svgContainer
    //   .append('rect')
    //   .attr('x', 10)
    //   .attr('y', 10)
    //   .attr('width', 50)
    //   .attr('height', 100);
  }

  // draw the axes and ticks
  function drawTicks(limits) {
    // return toefl score from a row of data
    let xValue = function(d) {
      return +d['TOEFL Score'];
    };

    // function to scale toefl score
    let xScale = d3
      .scaleLinear()
      .domain([limits.toeflMin - 5, limits.toeflMax]) // give domain buffer room
      .range([50, 450]);

    // xMap returns a scaled x value from a row of data
    let xMap = function(d) {
      return xScale(xValue(d));
    };

    // plot x-axis at bottom of SVG
    let xAxis = d3.axisBottom().scale(xScale);
    svgContainer
      .append('g')
      .attr('transform', 'translate(0, 450)')
      .call(xAxis);

    // return Chance of Admit from a row of data
    let yValue = function(d) {
      return +d.Admit;
    };

    // function to scale Chance of Admit
    let yScale = d3
      .scaleLinear()
      .domain([limits.admitMax, limits.admitMin - 0.05]) // give domain buffer
      .range([50, 450]);

    // yMap returns a scaled y value from a row of data
    let yMap = function(d) {
      return yScale(yValue(d));
    };

    // plot y-axis at the left of SVG
    let yAxis = d3.axisLeft().scale(yScale);
    svgContainer
      .append('g')
      .attr('transform', 'translate(50, 0)')
      .call(yAxis);

    // return mapping and scaling functions
    return {
      x: xMap,
      y: yMap,
      xScale: xScale,
      yScale: yScale,
    };
  }

  // find min and max for toefl Scores and Chance of Admit
  function findMinMax(toeflScores) {
    // get min/max toefl scores
    let toeflMin = d3.min(toeflScores);
    let toeflMax = d3.max(toeflScores);

    // round x-axis limits
    toeflMax = Math.round(toeflMax * 10) / 10;
    toeflMin = Math.round(toeflMin * 10) / 10;

    const { scoresMin, scoresMax } = findMinMaxYAxis(toeflScores);
    // console.log(scoresMin);
    // console.log(scoresMax);

    // return formatted min/max data as an object
    return {
      toeflMin: toeflMin,
      toeflMax: toeflMax,
      scoresMin: scoresMin,
      scoresMax: scoresMax,
    };
  }

  function findMinMaxXAxis(toeflScores) {}

  function findMinMaxYAxis(toeflScores) {
    const count = toeflScores.reduce((acc, score) => ({
      ...acc,
      [score]: acc[score] ? acc[score] + 1 : 1,
    }));

    const countMin = d3.min(Object.values(count));
    const countMax = d3.max(Object.values(count));

    const scoresMin = Math.min(...Object.keys(count));
    const scoresMax = Math.max(...Object.keys(count));

    console.log(count);

    console.log(Object.keys(count).reduce((score, idx) => {}));

    // console.log(scoresMin);
    // console.log(scoresMax);

    // console.log(countMin);
    // console.log(countMax);

    // console.log(Math.floor(scoresMin / 10) * 10);
    // console.log(Math.floor(scoresMax / 10) * 10 + 3);

    return {
      scoresMin: Math.floor(scoresMin / 10) * 10,
      scoresMax: Math.floor(scoresMax / 10) * 10 + 3,
    };
  }

  function getBucketName(score, idx) {
    return score % idx;
  }
})();
