import React from "react";
import { createSearchParams } from "react-router-dom";

export function CreateCleanSearchParams(params: any) {
  const newSearchObj = { ...params };
  const keys = Object.keys(newSearchObj);
  for (let i = 0; i < keys.length; i++) {
    if (newSearchObj[keys[i]] === "") {
      delete newSearchObj[keys[i]];
    }
  }
  const emptyOrder = !Object.keys(newSearchObj).length;
  return emptyOrder ? "" : `?${createSearchParams(newSearchObj)}`;
}

export function RemoveEmptyObj(params: any) {
  const newSearchObj = { ...params };
  const keys = Object.keys(newSearchObj);
  for (let i = 0; i < keys.length; i++) {
    if (newSearchObj[keys[i]] === "") {
      delete newSearchObj[keys[i]];
    }
  }
  return newSearchObj;
}

export function ValidateFormSubmitResponse(
  response: any[],
  errorFields: any,
  messageFields: any
) {
  return new Promise((resolve, reject) => {
    const newArray: any[] = Object.entries(response).map(([key, value]) => ({
      [key]: value,
    }));
    const errors: any = errorFields;
    const messages: any = messageFields;

    for (let i = 0; i < newArray.length; i++) {
      const errorKey: string = Object.keys(newArray[i])[0];
      const message: string[] = newArray[i][errorKey][0];

      findAndModify(errors, errorKey, true);
      findAndModify(messages, errorKey, message);
    }

    resolve({ errors, messages });
    reject("something is wrong...");
  });
}

function findAndModify(obj: any, targetKey: any, newValue: any) {
  for (const key in obj) {
    if (key === targetKey) {
      obj[key] = newValue;
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      findAndModify(obj[key], targetKey, newValue);
    }
  }
}

export function checkModalResponse(
  responseData: any,
  setModal: any,
  modal: any
) {
  ValidateFormSubmitResponse(
    responseData,
    modal.validation.error,
    modal.validation.message
  )
    .then((res: any) => {
      setModal((prevState: any) => ({
        ...prevState,
        validation: {
          ...prevState.validation,
          error: res.errors,
          message: res.messages,
        },
        requested: false,
      }));
    })
    .catch((err) => {
      console.log(err);
    });
}
