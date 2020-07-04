// packages
import 'intersection-observer';
import yall from 'yall-js';
import * as d3 from 'd3';

console.log('submit page');
if (sessionStorage.getItem("logger")) {
  document.getElementById('logger').value = sessionStorage.getItem("logger");
}

if (sessionStorage.getItem("neighborhood")) {
  document.getElementById('neighborhood').value = sessionStorage.getItem("neighborhood");
}

const form = document.getElementById('form-submit');
const formToJSON = (elements) =>
  [].reduce.call(
    elements,
    (data, element) => {
      if (element.type === 'radio') {
        if (element.checked) {
          data[element.name] = element.value;
        }
      } else {
        data[element.name] = element.value;
      }
      return data;
    },
    {}
  );

const post = (formJSON) => {
  fetch('https://bwb9uvadvf.execute-api.us-west-1.amazonaws.com/prod/people', {
    method: 'POST',
    body: JSON.stringify(formJSON),
  }).then((response) => {
    console.log(response);
    location.reload();
  });
};

const submitForm = (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  let formJSON = formToJSON(form.elements);

  const date = new Date();
  const getMonth = (month) => {
    if (month < 10) {
      return `0${month}`;
    } else {
      return month;
    }
  };
  const getFullDate = `${date.getFullYear()}-${getMonth(
    date.getMonth() + 1
  )}-${date.getDate()}`;

  formJSON.date = getFullDate;
  formJSON.time = date;

  if(formJSON.logger.length > 0 && formJSON.logger !== sessionStorage.getItem("logger")){
    sessionStorage.setItem('logger', formJSON.logger);
  }

  if(formJSON.neighborhood.length > 0 && formJSON.neighborhood !== sessionStorage.getItem("neighborhood")){
    sessionStorage.setItem('neighborhood', formJSON.neighborhood);
  }

  if(formJSON.logger.length === 0 || formJSON.neighborhood.length === 0){
    d3.select('.exp.error').classed('show', true);
    if(formJSON.logger.length === 0){
      d3.select('#logger').classed('error', true);
    } else {
      d3.select('#logger').classed('error', false);
    }
    if(formJSON.neighborhood.length === 0){
      d3.select('#neighborhood').classed('error', true);
    } else {
      d3.select('#neighborhood').classed('error', false);
    }
  } else {
    d3.select('.exp.error').classed('show', false);
    d3.selectAll('input').classed('error', false);
    post(formJSON);
  }
};

form.addEventListener('submit', submitForm);
