// packages
import 'intersection-observer';
import yall from 'yall-js';

console.log('submit page');
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

// const options = {
//   enableHighAccuracy: true,
//   maximumAge: 2000,
//   timeout: 10000,
// };
//
// const getPosition = function (options) {
//   return new Promise(function (resolve, reject) {
//     navigator.geolocation.getCurrentPosition(resolve, reject, options);
//   });
// };

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

  post(formJSON);

  // getPosition()
  //   .then((position) => {
  //     formJSON.lat = position.coords.latitude;
  //     formJSON.lng = position.coords.longitude;
  //     post(formJSON);
  //   })
  //   .catch((err) => {
  //     console.error(err.message);
  //     post(formJSON);
  //   });
};

form.addEventListener('submit', submitForm);
