//這檔案不需要

import React, { Component } from 'react';
const apiGetAllFlatListData =
  'http://10.0.3.2:3000/flatlistData?_sort=id&_order=desc';
const apiPostAllFlatListData = 'http://10.0.3.2:3000/flatlistData';
const apiPutAllFlatListData = 'http://10.0.3.2:3000/flatlistData';
const apiDeleteAllFlatListData = 'http://10.0.3.2:3000/flatlistData';

// export const getAllFlatListData = function() {
//   return fetch(apiGetAllFlatListData)
//     .then(response => {
//       return response.json();
//     })
//     .then(data => {
//       return data;
//     });
// };
export const getAllFlatListData = async () => {
  try {
    let response = await fetch(apiGetAllFlatListData);
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.log(error);
  }
};

export const insertNewFlatListData = async params => {
  try {
    let response = await fetch(apiPostAllFlatListData, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.log(error);
  }
};

export const updateFlatListData = async params => {
  try {
    let response = await fetch(apiPutAllFlatListData + '/' + params.id, {
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.log(error);
  }
};

export const deleteFlatListData = async params => {
  try {
    let response = await fetch(apiDeleteAllFlatListData + '/' + params.id, {
      method: 'delete'
    });
    let responseJson = await response.json();
    return { message: 'data deleted', status: 200 };
  } catch (error) {
    console.log(error);
  }
};
