// packages
import 'intersection-observer';
import yall from 'yall-js';
import * as d3 from 'd3';

import { createChart } from './components/line-chart';

console.log('index');
let data;

const pct = (items, total) => {
  return Math.round((items.length / total.length) * 100);
};

const inversePct = (items) => {
  return Math.round(((data.length - items.length) / data.length) * 100);
};

let parentWidth = 418,
  margin = { top: 10, right: 10, bottom: 10, left: 10 };

if (window.innerWidth < 448) {
  parentWidth = window.innerWidth - 30 - margin.left - margin.right;
}

const daysBetween = () => {
  let date1, date2;
  date1 = new Date();
  date2 = new Date('2020-06-26');
  // get total seconds between two dates
  let res = Math.abs(date1 - date2) / 1000;
  let days = Math.floor(res / 86400);
  return days;
};

// get data
const processData = (resp) => {
  data = JSON.parse(resp.body);
  createChart(data, d3.select('#overall-chart'), parentWidth, 75, 5);

  const container = document.getElementById('info');
  // container.appendChild(node);

  console.log(`all people ${data.length}`);
  const maskWearers = data.filter((item) => item.mask === 'yes');
  const correctMaskWearers = maskWearers.filter(
    (item) => item.mask_correct === 'yes'
  );

  d3.select('#total-pct').html(`${pct(correctMaskWearers, data)}%`);
  d3.select('#days').html(daysBetween());
  d3.select('#total-people').html(data.length);
  d3.select('#total-masks').html(maskWearers.length);
  d3.select('#total-mask-correct').html(correctMaskWearers.length);

  console.log('');
  console.log('age groups');
  const ageGroups = ['youth', 'young-adult', 'middle-age', 'elderly'];
  ageGroups.forEach((ag) => {
    const subgroup = data.filter((item) => item.age_group === ag);
    const subgroupCorrect = subgroup.filter(
      (item) => item.mask === 'yes' && item.mask_correct === 'yes'
    );
    console.log(
      ag,
      subgroup.length,
      `masks correct: ${pct(subgroupCorrect, subgroup)}%`
    );
    const group = d3.select(`#block-${ag}`);
    group.select('.lg-stat').html(`${pct(subgroupCorrect, subgroup)}%`);
    createChart(subgroup, group.select('.age-chart'), 123, 50, 3);
    group.select('.total-tracked').html(subgroup.length);
  });
};

const getData = () => {
  fetch('https://bwb9uvadvf.execute-api.us-west-1.amazonaws.com/prod/people')
    .then((response) => response.json())
    .then((data) => processData(data));
};

getData();
