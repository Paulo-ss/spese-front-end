"use client";

const saveFormState = <T>(formData: T, itemName: string) => {
  localStorage.setItem(itemName, JSON.stringify(formData));
};

export default saveFormState;
