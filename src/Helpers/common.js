export const ValidateToken = () => {
    let isValid;
    if (
      !JSON.parse(localStorage.getItem("retro")) ||
      JSON.parse(localStorage.getItem("retro")).token === ""
    ) {
      isValid = false;
    } else {
      isValid = true;
    }
    return isValid;
  };