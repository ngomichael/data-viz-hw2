'use strict';

(function() {
  let data = []; // keep data in global scope
  let svgContainer = ''; // keep SVG reference in global scope
  let bins = [];

  // load data and make scatter plot after window loads
  window.onload = function() {
    svgContainer = d3
      .select('#histogram')
      .append('svg')
      .attr('width', 500)
      .attr('height', 500);

    d3.csv('../data/Admission_Predict.csv').then(csvData =>
      makeScatterPlot(csvData)
    );
  };

  // make scatter plot with trend line
  function makeScatterPlot(csvData) {
    data = csvData;

    // get an array of toefl scores
    let toeflScores = data.map(row => parseInt(row['TOEFL Score']));

    // group toefl scores into their bins
    bins = findBinSizes(toeflScores);
    // console.log(bins);

    let axesLimits = findMinMax(toeflScores);

    // draw axes with ticks and return mapping and scaling functions
    let mapFunctions = drawTicks(axesLimits);

    // plot the data using the mapping and scaling functions
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

    // Going to have to use bins as data
    // svgContainer
    //   .selectAll('.rec')
    //   .data(bins)
    //   .enter()
    //   .append('rect')
    //   .attr('x', dataPoint => xMap(dataPoint.x0) - 1)
    //   .attr('y', yMap)
    //   .attr('width', dataPoint => Math.max(0, x))
    //   .attr('height', dataPoint => 450 - yMap(dataPoint))
    //   .attr('fill', '#4286f4');

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
      .domain([limits.toeflMin - 2, limits.toeflMax])
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

    // return TOEFL from a row of data
    let yValue = function(d) {
      return +d['TOEFL Score'];
    };

    // function to scale bin count
    let yScale = d3
      .scaleLinear()
      .domain([limits.binCountMax, limits.binCountMin - 5])
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

  function findMinMax(toeflScores) {
    const toeflMax = d3.max(toeflScores);
    const toeflMin = d3.min(toeflScores);

    const binCounts = bins.reduce((acc, bin) => {
      return [...acc, bin.length];
    }, []);

    let binCountMin = d3.min(binCounts);
    let binCountMax = d3.max(binCounts);

    // Round min/max of binCount to nearest 5
    binCountMin = Math.ceil(binCountMin / 5) * 5;
    binCountMax = Math.ceil(binCountMax / 5) * 5;

    console.log(binCountMax);
    console.log(binCountMin);

    return {
      toeflMin: toeflMin,
      toeflMax: toeflMax,
      binCountMin: binCountMin,
      binCountMax: binCountMax,
    };
  }

  function findBinSizes(toeflScores) {
    const toeflMax = d3.max(toeflScores);
    const toeflMin = d3.min(toeflScores);

    let histGenerator = d3
      .histogram()
      .domain([toeflMin, toeflMax])
      .thresholds(9);

    let bins = histGenerator(toeflScores);
    return bins;
  }
})();
