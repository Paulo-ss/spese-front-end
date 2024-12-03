"use client";

const getFormState = <T>(itemName: string) => {
  const formState = localStorage.getItem(itemName);

  if (formState) {
    return JSON.parse(formState) as T;
  }

  return undefined;
};

export default getFormState;
