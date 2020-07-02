import * as d3 from 'd3';

const pct = (items, total) => {
  return Math.round((items.length / total.length) * 100);
};

const fixLen = (dateStr) => {
  let day = dateStr.split('-');
  if (day[2].length < 2) {
    day[2] = `0${day[2]}`;
  }
  return day.join('-');
};

export function createChart(
  data,
  parentDiv,
  parentWidth,
  parentHeight,
  radius
) {
  console.log('line chart', data);
  let groupedData = {};
  let formattedData = [];

  data.forEach((d) => {
    d.date = fixLen(d.date);
    if (groupedData[d.date]) {
      groupedData[d.date].push(d);
    } else {
      groupedData[d.date] = [d];
    }
  });
  console.log(groupedData);

  Object.keys(groupedData).forEach((key) => {
    const correct = groupedData[key].filter(
      (item) => item.mask === 'yes' && item.mask_correct === 'yes'
    );
    const tempDate = new Date(key);
    const datePct = {
      date: tempDate.setDate(tempDate.getDate() + 1),
      pctCorrect: pct(correct, groupedData[key]),
    };
    formattedData.push(datePct);
  });

  formattedData.sort((a, b) => (a.date > b.date ? 1 : -1));
  console.log(formattedData);

  let margin = { top: 5, right: 5, bottom: 5, left: 5 },
    width = parentWidth - margin.left - margin.right,
    height = parentHeight - margin.top - margin.bottom;

  let xScale = d3
    .scaleTime()
    .range([0, width])
    .domain(
      d3.extent(formattedData, function (d) {
        return d.date;
      })
    );

  let yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

  let line = d3
    .line()
    .x(function (d, i) {
      return xScale(d.date);
    })
    .y(function (d) {
      return yScale(d.pctCorrect);
    })
    .curve(d3.curveMonotoneX);

  let svg = parentDiv
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  svg
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xScale));

  svg.append('g').attr('class', 'y axis').call(d3.axisLeft(yScale));

  svg.append('path').datum(formattedData).attr('class', 'line').attr('d', line);

  svg
    .selectAll('.dot')
    .data(formattedData)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', function (d, i) {
      return xScale(d.date);
    })
    .attr('cy', function (d) {
      return yScale(d.pctCorrect);
    })
    .attr('r', radius);
  //   .on("mouseover", function(a, b, c) {
  // 		console.log(a)
  //     this.attr('class', 'focus')
  // })
  //   .on("mouseout", function() {  })
}
