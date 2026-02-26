
export const exitAppWithError = (errorText:string) => {
  console.error(errorText);
  process.exit(1);
};
