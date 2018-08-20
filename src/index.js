import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";

import "./styles.css";

const url =
  "https://tidesandcurrents.noaa.gov/api/datagetter?date=today&station=9414290&datum=MTL&product=water_level&units=english&time_zone=gmt&application=ports_screen&format=json";

class App extends Component {
  constructor(props) {
    super(props);

    const self = this;

    this.state = {
      data: null
    };

    // // 2. Use the margin convention practice
    this.margin = { top: 50, right: 50, bottom: 50, left: 50 };

    this.width = window.innerWidth - this.margin.left - this.margin.right;
    this.height = window.innerHeight - this.margin.top - this.margin.bottom; // Use the window's height

    // The number of datapoints
    this.n = 5;

    // 5. X scale will use the index of our data
    this.xScale = d3
      .scaleLinear()
      .domain([0, this.n - 1]) // input
      .range([0, this.width]); // output

    // 6. Y scale will use the randomly generate number
    this.yScale = d3
      .scaleLinear()
      .domain([0, 1]) // input
      .range([this.height, 0]); // output

    // 7. d3's line generator
    this.line = d3
      .line()
      .x(function(d, i) {
        return self.xScale(i);
      }) // set the x values for the line generator
      .y(function(d) {
        return self.yScale(d.y);
      }) // set the y values for the line generator
      .curve(d3.curveMonotoneX); // apply smoothing to the line

    // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    this.dataset = d3.range(this.n).map(function(d) {
      return { y: d3.randomUniform(1)() };
    });

    // 1. Add the SVG to the page and employ #2
    this.svg = d3
      .select("body")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );

    // 3. Call the x axis in a group tag
    this.svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.xScale)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    this.svg
      .append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(this.yScale)); // Create an axis component with d3.axisLeft

    // 9. Append the path, bind the data, and call the line generator
    // this.svg
    //   .append("path")
    //   .datum(this.dataset) // 10. Binds data to the line
    //   .attr("class", "line") // Assign a class for styling
    //   .attr("d", this.line); // 11. Calls the line generator

    // // 12. Appends a circle for each datapoint
    // this.svg
    //   .selectAll(".dot")
    //   .data(this.dataset)
    //   .enter()
    //   .append("circle") // Uses the enter().append() method
    //   .attr("class", "dot") // Assign a class for styling
    //   .attr("cx", function(d, i) {
    //     return self.xScale(i);
    //   })
    //   .attr("cy", function(d) {
    //     return self.yScale(d.y);
    //   });
  }
  componentDidMount() {
    console.log("fetching");
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.dataset = data.data.map(item => {
          console.log(item);
          return { y: item.v };
        });

        console.log("fetched", this.dataset.length);
        //this.setState({ dataset: data });

        this.n = this.dataset.length;

        const self = this;

        this.xScale = d3
          .scaleLinear()
          .domain([0, this.n - 1]) // input
          .range([0, this.width]); // output

        // 6. Y scale will use the randomly generate number
        this.yScale = d3
          .scaleLinear()
          .domain([-10, 10]) // input
          .range([this.height, 0]); // output

        this.line = d3
          .line()
          .x(function(d, i) {
            return self.xScale(i);
          }) // set the x values for the line generator
          .y(function(d) {
            return self.yScale(d.y);
          }) // set the y values for the line generator
          .curve(d3.curveMonotoneX); // apply smoothing to the line

        this.svg
          .append("path")
          .datum(this.dataset) // 10. Binds data to the line
          .attr("class", "line") // Assign a class for styling
          .attr("d", this.line); // 11. Calls the line generator
      });
  }

  render() {
    return (
      <div className="App">
        <h1>Hello CodeSandbox</h1>
        <h2>Start editing to see some magic happen!</h2>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
